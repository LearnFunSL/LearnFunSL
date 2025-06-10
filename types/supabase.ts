import type { SupabaseClient, Session } from "@supabase/supabase-js";

/**
 * Response type for successful Supabase token generation
 */
export interface TokenSuccessResponse {
  supabaseToken: string;
}

/**
 * Response type for failed Supabase token generation
 */
export interface TokenErrorResponse {
  error: string;
  details?: unknown;
  status?: number;
}

/**
 * Session status for the Supabase client
 */
export type SupabaseSessionStatus =
  | "authenticated"
  | "anonymous"
  | "error"
  | "loading";

/**
 * Context type for Supabase authentication
 */
export interface SupabaseAuthContextType {
  supabase: SupabaseClient | null;
  isLoading: boolean;
  error: string | null;
  retry: () => Promise<void>;
  signOut: () => Promise<void>;
  sessionStatus: SupabaseSessionStatus;
}

/**
 * Authentication methods available depending on Supabase client version
 */
export enum SupabaseAuthMethod {
  SET_SESSION = "setSession",
  SIGN_IN_WITH_JWT = "signInWithJwt",
  SIGN_IN_TOKEN = "signInToken",
  CUSTOM_URL = "customUrl",
}

/**
 * JWT template structure for communicating with Supabase
 */
export interface SupabaseJwtTemplate {
  aud: string;
  role: string;
  user_id: string;
  [key: string]: any;
}

/**
 * Configuration options for token fetch requests
 */
export interface TokenFetchOptions {
  retryCount?: number;
  retryDelay?: number;
  maxRetries?: number;
}

/**
 * Supabase session data format
 */
export interface SupabaseSessionData {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

/**
 * Error codes for Supabase authentication
 */
export enum SupabaseAuthErrorCode {
  TOKEN_NOT_FOUND = "token_not_found",
  TEMPLATE_NOT_FOUND = "template_not_found",
  UNAUTHORIZED = "unauthorized",
  CONFIGURATION_ERROR = "configuration_error",
  NETWORK_ERROR = "network_error",
  AUTHENTICATION_FAILED = "authentication_failed",
  SESSION_NOT_ESTABLISHED = "session_not_established",
  METHOD_NOT_AVAILABLE = "method_not_available",
  UNKNOWN_ERROR = "unknown_error",
}

export type SupabaseAuthStatus =
  | "LOADING"
  | "AUTHENTICATED"
  | "ANONYMOUS"
  | "ERROR";

export interface SupabaseAuthState {
  supabaseClient: SupabaseClient | null;
  session: Session | null;
  status: SupabaseAuthStatus;
  error: AuthError | null;
}

export interface SupabaseAuthContextValue extends SupabaseAuthState {
  userId?: string | null;
  clerkUserId?: string | null;
  isInitialized: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => Promise<void>;
}

export type AuthErrorType =
  | "CLIENT_CREATION_FAILED"
  | "TOKEN_FETCH_FAILED"
  | "TOKEN_MISSING"
  | "SESSION_SET_FAILED"
  | "SESSION_VERIFY_FAILED"
  | "SIGN_OUT_FAILED"
  | "SESSION_SYNC_FAILED"
  | "UNHANDLED_ERROR"
  | "CUSTOM_ERROR";

export class AuthError extends Error {
  public type: AuthErrorType;
  public cause: any;

  constructor(type: AuthErrorType, message: string, cause?: any) {
    super(message);
    this.name = "AuthError";
    this.type = type;
    this.cause = cause;
  }
}
