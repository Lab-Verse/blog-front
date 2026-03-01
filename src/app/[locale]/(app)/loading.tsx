export default function AppLoading() {
  return (
    <div className="container py-16">
      {/* Hero skeleton */}
      <div className="mb-12 animate-pulse space-y-4">
        <div className="h-8 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="aspect-video rounded-2xl bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        ))}
      </div>
    </div>
  )
}
