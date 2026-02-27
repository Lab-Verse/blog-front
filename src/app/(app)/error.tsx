'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useEffect } from 'react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AppError]', error)
  }, [error])

  return (
    <div className="container flex min-h-[50vh] items-center justify-center py-16">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h2 className="text-5xl">😕</h2>
        <h1 className="text-2xl font-semibold">Oops! Something went wrong</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          We couldn&apos;t load this page. This might be a temporary issue.
        </p>
        <div className="flex justify-center gap-4">
          <ButtonPrimary onClick={() => reset()}>Try Again</ButtonPrimary>
          <ButtonPrimary href="/">Go Home</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}
