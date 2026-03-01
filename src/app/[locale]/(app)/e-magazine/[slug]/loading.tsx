export default function Loading() {
  return (
    <div>
      {/* Top bar skeleton */}
      <div className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="container flex items-center justify-between py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex flex-col items-center gap-1">
            <div className="h-4 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="h-7 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      {/* Viewer skeleton */}
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="h-[600px] w-[800px] animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  )
}
