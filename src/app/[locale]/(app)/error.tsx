'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { useTranslations } from 'next-intl'
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

  const t = useTranslations('errors')

  return (
    <div className="container flex min-h-[50vh] items-center justify-center py-16">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h2 className="text-5xl">😕</h2>
        <h1 className="text-2xl font-semibold">{t('oopsSomethingWentWrong')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('couldntLoadPage')}
        </p>
        <div className="flex justify-center gap-4">
          <ButtonPrimary onClick={() => reset()}>{t('tryAgain')}</ButtonPrimary>
          <ButtonPrimary href="/">{t('goHome')}</ButtonPrimary>
        </div>
      </div>
    </div>
  )
}
