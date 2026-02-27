export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600 dark:border-neutral-700 dark:border-t-primary-400" />
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}
