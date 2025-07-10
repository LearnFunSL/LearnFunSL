export interface VideoLesson {
  id: string;
  title: string;
  youtube_id: string;
  grade: number;
  subject: string;
  unit: number;
  duration: string;
}

export interface GroupedVideos {
  [grade: number]: {
    [subject: string]: VideoLesson[];
  };
}
