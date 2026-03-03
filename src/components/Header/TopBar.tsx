'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/routing'

const FLAG_MAP: Record<string, string> = {
  en: 'gb',
  ur: 'pk',
  ar: 'sa',
  ko: 'kr',
  zh: 'cn',
  es: 'es',
}

export default function TopBar() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('topBar')
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setDateTime(
        now.toLocaleDateString(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
          '  |  ' +
          now.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
      )
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [locale])

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="container flex h-25 items-center justify-between gap-4">
        {/* Left — Language list */}
        <ol className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
          {locales.map((code) => (
            <li key={code}>
              <button
                onClick={() => switchLocale(code)}
                className={`flex items-center gap-1 rounded px-1.5 py-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                  code === locale
                    ? 'bg-neutral-200 font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                    : ''
                }`}
                title={t(`languages.${code}`)}
              >
                <span className={`fi fi-${FLAG_MAP[code]} fis rounded-sm`} />
                <span className="hidden lg:inline">{t(`languages.${code}`)}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* Center — TWA logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Image
            src="/images/twa-logo.svg"
            alt="TWA"
            width={900}
            height={300}
            className="h-20 max-h-20 w-auto"
          />
        </div>

        {/* Right — E-Magazine icon + DateTime */}
        <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          {/* E-Magazine link */}
          <Link
            href="/e-magazine"
            className="flex items-center gap-1.5 rounded px-2 py-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
            title={t('eMagazine')}
          >
            {/* Book / Magazine icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 4.533A9.707 9.707 0 0118 3a9.735 9.735 0 013.25.555.75.75 0 01.5.707v14.25a.75.75 0 01-1 .707A8.237 8.237 0 0018 18.75c-1.995 0-3.823.707-5.25 1.886V4.533z" />
            </svg>
            <span className="hidden sm:inline">{t('eMagazine')}</span>
          </Link>

          {/* Separator */}
          <div className="hidden h-4 w-px bg-neutral-300 dark:bg-neutral-700 sm:block" />

          {/* Date & Time */}
          <span className="hidden whitespace-nowrap sm:inline">{dateTime}</span>
        </div>
      </div>
    </div>
  )
}
