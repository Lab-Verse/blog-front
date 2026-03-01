export default function Loading() {
  return (
    <div className="container py-16">
      <div className="animate-pulse">
        {/* Author header skeleton */}
        <div className="relative h-40 w-full rounded-3xl bg-neutral-200 md:h-60 dark:bg-neutral-700" />
        <div className="-mt-10 flex items-start gap-6 rounded-3xl bg-white p-5 shadow-xl dark:bg-neutral-900">
          <div className="size-24 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="grow space-y-3">
            <div className="h-6 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>

        {/* Post grid skeleton */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
