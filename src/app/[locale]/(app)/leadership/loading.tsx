export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="bg-neutral-100 py-16 dark:bg-neutral-900">
        <div className="container flex flex-col items-center">
          <div className="h-10 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      {/* Members grid skeleton */}
      <div className="container py-16">
        <div className="grid gap-12 sm:grid-cols-2 md:gap-16 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex animate-pulse flex-col items-center">
              <div className="h-36 w-36 rounded-full bg-neutral-200 dark:bg-neutral-700 lg:h-44 lg:w-44" />
              <div className="mt-4 h-5 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-2 h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-3 h-3 w-48 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-1 h-3 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-4 flex gap-3">
                <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
