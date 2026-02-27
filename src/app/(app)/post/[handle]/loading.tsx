export default function PostLoading() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl animate-pulse space-y-8">
        {/* Category badge skeleton */}
        <div className="h-6 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700" />

        {/* Title skeleton */}
        <div className="space-y-3">
          <div className="h-9 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-9 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* Meta skeleton */}
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>

        {/* Featured image skeleton */}
        <div className="aspect-video w-full rounded-2xl bg-neutral-200 dark:bg-neutral-700" />

        {/* Content skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
