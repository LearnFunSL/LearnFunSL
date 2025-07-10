export function VideoGridSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2].map((grade) => (
        <section key={grade}>
          <div className="mb-6 h-9 w-48 animate-pulse rounded-md bg-muted"></div>
          <div className="space-y-8">
            {[1, 2].map((subject) => (
              <div key={subject}>
                <div className="mb-4 h-8 w-64 animate-pulse rounded-md bg-muted"></div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((video) => (
                    <div key={video} className="space-y-2">
                      <div className="aspect-video w-full animate-pulse rounded-lg bg-muted"></div>
                      <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted"></div>
                      <div className="flex justify-between">
                        <div className="h-5 w-1/4 animate-pulse rounded-md bg-muted"></div>
                        <div className="h-5 w-1/4 animate-pulse rounded-md bg-muted"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
