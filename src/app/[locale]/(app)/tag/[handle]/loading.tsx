export default function Loading() {
  return (
    <div className="container py-16">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="mb-10 h-8 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="mb-6 h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />

        {/* Post grid skeleton */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
