import { NextResponse, NextRequest } from "next/server";

// Mock platform settings - this would typically come from a database or config file
let platformSettings = {
  platformTitle: "LearnFunSL - Sri Lankan Education Hub",
  platformLogoUrl: "/images/logo-default.png", // Default logo
  theme: "light", // 'light', 'dark', or 'system'
  maintenanceMode: false,
  defaultLanguage: "en",
  allowUserRegistration: true,
  maxUploadSizeMB: 50,
  // Add other settings as needed from your PRD
};

// GET /api/admin/settings - Retrieve current platform settings
export async function GET(request: NextRequest) {
  // TODO: Add authentication and authorization checks (admin only)

  // Simulate fetching settings
  return NextResponse.json(platformSettings);
}

// POST /api/admin/settings - Update platform settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Add authentication and authorization checks (superadmin or specific role only)
    // TODO: Add input validation for each setting (e.g., using Zod)
    // TODO: Handle logo file upload if a new logo is provided, update platformLogoUrl

    // Update only the settings provided in the request body
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(platformSettings, key)) {
        // Basic type coercion for known types, add more as needed
        if (key === "maintenanceMode" || key === "allowUserRegistration") {
          (platformSettings as any)[key] = Boolean(body[key]);
        } else if (key === "maxUploadSizeMB") {
          (platformSettings as any)[key] = parseInt(body[key], 10);
        } else {
          (platformSettings as any)[key] = body[key];
        }
      }
    }

    // In a real scenario, persist these settings to a database or config file
    return NextResponse.json({
      message: "Settings updated successfully",
      settings: platformSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { message: "Error updating settings", error: (error as Error).message },
      { status: 500 },
    );
  }
}
