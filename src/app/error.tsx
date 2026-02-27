'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h2 className="text-6xl font-semibold">⚠️</h2>
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <ButtonPrimary onClick={() => reset()}>Try Again</ButtonPrimary>
          <ButtonPrimary href="/">Go Home</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}
