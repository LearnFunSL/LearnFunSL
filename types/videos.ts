export interface Video {
  id: string; // UUID
  title: string;
  youtube_id: string;
  subject: string;
  grade: number;
  unit?: string;
  duration?: number; // in seconds
  thumbnail_url?: string;
}
