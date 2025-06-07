// app/lib/types.ts

export interface Resource {
  id: string;
  title: string;
  type: string; // e.g., "textbook", "pastpaper", "video"
  subject: string;
  grade: number;
  year?: number | null;
  term?: number | null;
  medium: "english" | "sinhala" | "tamil";
  file_url: string;
  metadata: {
    original_type?: string;
    original_status?: string;
    size?: string;
    uploader?: string;
    lastModified?: string;
    duration?: string; // For videos
    pages?: number; // For documents
    [key: string]: any; // Allow other metadata
  };
  created_at: string; // ISO date string
}

export interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}
