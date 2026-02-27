'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[DashboardError]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h2 className="text-4xl">⚠️</h2>
        <h1 className="text-xl font-semibold">Dashboard Error</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Something went wrong loading this section.
        </p>
        <ButtonPrimary onClick={() => reset()}>Try Again</ButtonPrimary>
      </div>
    </div>
  )
}
