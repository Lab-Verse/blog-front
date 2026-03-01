export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="bg-neutral-100 py-16 dark:bg-neutral-900">
        <div className="container flex flex-col items-center">
          <div className="h-10 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="mt-4 h-5 w-96 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      {/* Card grid skeleton */}
      <div className="container py-16">
        <div className="mb-8 h-7 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700"
            >
              <div className="aspect-[3/4] bg-neutral-200 dark:bg-neutral-700" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
