export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          subject: string | null;
          grade: string | null;
          color: string;
          tags: string[];
          created_at: string;
          updated_at: string;
          last_studied: string | null;
          is_archived: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          subject?: string | null;
          grade?: string | null;
          color?: string;
          tags?: string[];
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          subject?: string | null;
          grade?: string | null;
          color?: string;
          tags?: string[];
          last_studied?: string | null;
          is_archived?: boolean;
        };
      };
      flashcards: {
        Row: {
          id: string;
          deck_id: string;
          user_id: string;
          front: string;
          back: string;
          difficulty: "easy" | "medium" | "hard";
          position: number;
          correct_count: number;
          incorrect_count: number;
          last_reviewed: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          deck_id: string;
          user_id: string;
          front: string;
          back: string;
          difficulty?: "easy" | "medium" | "hard";
          position?: number;
        };
        Update: {
          front?: string;
          back?: string;
          difficulty?: "easy" | "medium" | "hard";
          position?: number;
          correct_count?: number;
          incorrect_count?: number;
          last_reviewed?: string | null;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          deck_id: string;
          cards_studied: number;
          correct_answers: number;
          incorrect_answers: number;
          duration_minutes: number;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          deck_id: string;
          cards_studied?: number;
          correct_answers?: number;
          incorrect_answers?: number;
          duration_minutes?: number;
        };
        Update: {
          cards_studied?: number;
          correct_answers?: number;
          incorrect_answers?: number;
          duration_minutes?: number;
        };
      };
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          name: string | null;
          grade: number | null;
          preferred_language: "en" | "si" | "ta" | null;
          created_at: string;
          last_active: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          name?: string | null;
          grade?: number | null;
          preferred_language?: "en" | "si" | "ta" | null;
        };
        Update: {
          name?: string | null;
          grade?: number | null;
          preferred_language?: "en" | "si" | "ta" | null;
          last_active?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          type: "pastpaper" | "textbook" | "other";
          subject: string;
          grade: number | null;
          year: number | null;
          term: number | null;
          medium: "english" | "sinhala" | "tamil";
          file_url: string | null;
          file_size: number | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: "pastpaper" | "textbook" | "other";
          subject: string;
          grade?: number | null;
          year?: number | null;
          term?: number | null;
          medium: "english" | "sinhala" | "tamil";
          file_url?: string | null;
          file_size?: number | null;
          metadata?: Json | null;
        };
        Update: {
          title?: string;
          type?: "pastpaper" | "textbook" | "other";
          subject?: string;
          grade?: number | null;
          year?: number | null;
          term?: number | null;
          medium?: "english" | "sinhala" | "tamil";
          file_url?: string | null;
          file_size?: number | null;
          metadata?: Json | null;
        };
      };
      video_lessons: {
        Row: {
          id: string;
          title: string;
          youtube_id: string;
          subject: string;
          grade: number | null;
          unit: string | null;
          duration: number | null;
          thumbnail_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          youtube_id: string;
          subject: string;
          grade?: number | null;
          unit?: string | null;
          duration?: number | null;
          thumbnail_url?: string | null;
        };
        Update: {
          title?: string;
          youtube_id?: string;
          subject?: string;
          grade?: number | null;
          unit?: string | null;
          duration?: number | null;
          thumbnail_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
