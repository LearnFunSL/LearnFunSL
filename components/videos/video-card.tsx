"use client";

import { VideoLesson } from "@/types/video";
import { Clock, Film } from "lucide-react";

interface VideoCardProps {
  video: VideoLesson;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="aspect-video overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 truncate text-lg font-semibold tracking-tight group-hover:text-primary">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>Unit {video.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{video.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
