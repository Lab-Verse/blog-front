export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="mx-auto w-screen px-2 xl:max-w-(--breakpoint-2xl)">
        <div className="relative aspect-16/9 rounded-3xl bg-neutral-200 lg:aspect-16/5 dark:bg-neutral-700" />
      </div>

      {/* Results skeleton */}
      <div className="container py-16">
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video rounded-2xl bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
