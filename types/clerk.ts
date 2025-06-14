// types/clerk.ts

// The top-level structure of a Clerk webhook event
export interface ClerkWebhookEvent {
  type: EventType;
  data: Record<string, any>; // The shape of this depends on the event type
  object: "event";
}

// The specific types of events we are interested in
export type EventType = "user.created" | "user.updated" | "user.deleted";

// A utility type to get the payload for a specific event type
export type WebhookEvent<T extends EventType> = ClerkWebhookEvent & {
  type: T;
  data: WebhookData<T>;
};

// Map event types to their corresponding data shapes
type WebhookDataMap = {
  "user.created": UserData;
  "user.updated": UserData;
  "user.deleted": DeletedUserData;
};

// A utility to get the data type based on the event type
type WebhookData<T extends EventType> = WebhookDataMap[T];

// The structure of the user data in 'user.created' and 'user.updated' events
export interface UserData {
  id: string;
  email_addresses: { id: string; email_address: string }[];
  username: string | null;
  image_url: string;
  created_at: number;
  updated_at: number;
  [key: string]: any; // Allow for other properties
}

// The structure for 'user.deleted' events
export interface DeletedUserData {
  id: string;
  deleted: boolean;
}
