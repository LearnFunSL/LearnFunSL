import { getGroupedVideoLessons } from "@/lib/actions/video.actions";
import { VideoCard } from "./video-card";

export async function VideoGrid() {
  try {
    const groupedVideos = await getGroupedVideoLessons();
    const grades = Object.keys(groupedVideos).sort(
      (a, b) => Number(a) - Number(b),
    );

    if (grades.length === 0) {
      return (
        <p className="text-center text-muted-foreground">No videos found.</p>
      );
    }

    return (
      <div className="space-y-12">
        {grades.map((grade) => (
          <section key={grade}>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">
              Grade {grade}
            </h2>
            <div className="space-y-8">
              {Object.keys(groupedVideos[Number(grade)]).map((subject) => (
                <div key={subject}>
                  <h3 className="mb-4 text-2xl font-semibold">{subject}</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {groupedVideos[Number(grade)][subject].map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed bg-destructive/10">
        <p className="text-center text-destructive">
          Failed to load videos. Please try again later.
        </p>
      </div>
    );
  }
}
