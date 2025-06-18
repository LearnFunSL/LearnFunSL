export interface Content {
  id: string;
  title: string;
  type: "pastpaper" | "textbook" | "other";
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
    duration?: string;
    original_actual_type?: string;
  };
  created_at: string;
}
