"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GroupedVideos, VideoLesson } from "@/types/video";

export async function getGroupedVideoLessons(): Promise<GroupedVideos> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("video_lessons_")
    .select("*")
    .order("grade", { ascending: true })
    .order("subject", { ascending: true })
    .order("unit", { ascending: true });

  if (error) {
    console.error("Error fetching video lessons:", error);
    throw new Error("Failed to fetch video lessons.");
  }

  if (!data) {
    return {};
  }

  // Group the lessons by grade, then by subject
  const groupedVideos = data.reduce(
    (acc: GroupedVideos, video: VideoLesson) => {
      const { grade, subject } = video;

      if (!acc[grade]) {
        acc[grade] = {};
      }
      if (!acc[grade][subject]) {
        acc[grade][subject] = [];
      }

      acc[grade][subject].push(video);
      return acc;
    },
    {},
  );

  return groupedVideos;
}
