// import { jest, describe, it, expect, afterEach } from '@jest/globals'; // This line is not needed
import { POST } from "./route";
import { NextRequest } from "next/server";
import {
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
} from "@/lib/services/userSync";
import crypto from "crypto";
import { Webhook } from "svix";

// Mock the user sync services
jest.mock("@/lib/services/userSync");

// Mock next-axiom
jest.mock("next-axiom", () => ({
  log: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock the Supabase admin client to prevent it from calling cookies() during tests
jest.mock("@/lib/supabase/client", () => ({
  createAdminClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: {}, error: null }),
    })),
  })),
}));

// Mock the svix library to control its behavior in tests
jest.mock("svix");
const MockWebhook = Webhook as jest.MockedClass<typeof Webhook>;
const mockVerify = jest.fn();

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error("CLERK_WEBHOOK_SECRET is not set in the test environment");
}

// Helper to create a signed payload that mimics the svix library's logic
const createSignedPayload = (payload: any) => {
  const body = JSON.stringify(payload);
  const svix_id = `svix_${crypto.randomBytes(16).toString("hex")}`;
  const svix_timestamp = Math.floor(Date.now() / 1000).toString();

  // The svix library uses the decoded secret for the HMAC
  const decodedSecret = Buffer.from(WEBHOOK_SECRET.split("_")[1], "base64");

  const signedContent = `${svix_id}.${svix_timestamp}.${body}`;
  const signature = crypto
    .createHmac("sha256", decodedSecret)
    .update(signedContent)
    .digest("base64");
  const svix_signature = `v1,${signature}`;

  const headers = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  return { body, headers };
};

// Helper to create a mock NextRequest
const createMockRequest = (
  body: string,
  headers: Record<string, string>,
): NextRequest => {
  return new NextRequest("https://localhost/api/webhooks/clerk", {
    method: "POST",
    headers: new Headers(headers),
    body: body,
  });
};

describe("Clerk Webhook Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Before each test, we set up the mock Webhook class to return our mock verify function
    MockWebhook.mockImplementation(() => {
      return {
        verify: mockVerify,
      } as unknown as Webhook;
    });
  });

  it("should return 400 if svix headers are missing", async () => {
    const req = createMockRequest("{}", {});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 for an invalid signature", async () => {
    // For this test, we make our mock 'verify' function throw an error
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const { body, headers } = createSignedPayload({
      type: "user.created",
      data: {},
    });
    const req = createMockRequest(body, headers);

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should handle user.created events", async () => {
    const payload = {
      type: "user.created" as const,
      data: {
        id: "user_123",
        email_addresses: [{ email_address: "test@example.com" }],
        username: "test",
        image_url: "",
      },
    };
    // Make our mock 'verify' function return the test payload
    mockVerify.mockReturnValue(payload);

    const { body, headers } = createSignedPayload(payload);
    const req = createMockRequest(body, headers);

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(syncUserCreation).toHaveBeenCalledWith(payload.data);
  });

  it("should handle user.updated events", async () => {
    const payload = {
      type: "user.updated" as const,
      data: {
        id: "user_123",
        email_addresses: [{ email_address: "test@example.com" }],
        username: "test-updated",
        image_url: "",
      },
    };
    mockVerify.mockReturnValue(payload);

    const { body, headers } = createSignedPayload(payload);
    const req = createMockRequest(body, headers);

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(syncUserUpdate).toHaveBeenCalledWith(payload.data);
  });

  it("should handle user.deleted events", async () => {
    const payload = {
      type: "user.deleted" as const,
      data: { id: "user_123", deleted: true },
    };
    mockVerify.mockReturnValue(payload);

    const { body, headers } = createSignedPayload(payload);
    const req = createMockRequest(body, headers);

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(syncUserDeletion).toHaveBeenCalledWith(payload.data);
  });

  it("should return 500 if an error occurs during processing", async () => {
    const payload = {
      type: "user.created" as const,
      data: {
        id: "user_123",
        email_addresses: [{ email_address: "test@example.com" }],
        username: "test",
        image_url: "",
      },
    };
    // Verification succeeds...
    mockVerify.mockReturnValue(payload);
    // ...but the sync function fails
    (syncUserCreation as jest.Mock).mockRejectedValue(
      new Error("Database connection failed"),
    );

    const { body, headers } = createSignedPayload(payload);
    const req = createMockRequest(body, headers);

    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
