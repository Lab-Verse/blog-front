'use client'

import { useTranslations } from 'next-intl'

export default function PostDisclaimer() {
  const t = useTranslations('post')

  return (
    <div className="mx-auto max-w-(--breakpoint-md) mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-700">
      <p className="text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">
        <span className="font-semibold text-neutral-500 dark:text-neutral-400">
          {t('disclaimer.title')}:
        </span>{' '}
        {t('disclaimer.text')}
      </p>
    </div>
  )
}
