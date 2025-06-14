// types/supabase.ts

// The structure of the 'users' table in Supabase
export interface UserProfile {
  id: string; // Corresponds to the UUID in Supabase
  clerk_id: string;
  email: string;
  username: string | null;
  image_url: string | null;
  grade: string | null;
  preferred_language: string;
  onboarding_completed: boolean;
  last_active_at: string | null;
  created_at: string;
}

// Utility type for inserting a new user
export type NewUserProfile = Omit<
  UserProfile,
  "id" | "created_at" | "last_active_at"
> & {
  last_active_at?: string;
};

// Utility type for updating an existing user
export type UpdateUserProfile = Partial<Omit<UserProfile, "id" | "clerk_id">>;
