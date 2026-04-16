'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/routing'

/** Emoji flags — zero CSS cost, renders natively on all modern OSes */
const FLAG_MAP: Record<string, string> = {
  en: '\uD83C\uDDEC\uD83C\uDDE7',
  ur: '\uD83C\uDDF5\uD83C\uDDF0',
  ar: '\uD83C\uDDF8\uD83C\uDDE6',
  ko: '\uD83C\uDDF0\uD83C\uDDF7',
  zh: '\uD83C\uDDE8\uD83C\uDDF3',
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
      <div className="container flex h-14 md:h-25 items-center justify-between gap-4">
        {/* Left — Language list */}
        <ol className="flex items-center gap-1 md:gap-1.5 text-sm text-neutral-700 dark:text-neutral-300 overflow-x-auto">
          {locales.map((code) => (
            <li key={code}>
              <button
                onClick={() => switchLocale(code)}
                className={`flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                  code === locale
                    ? 'bg-neutral-200 font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                    : ''
                }`}
                title={t(`languages.${code}`)}
              >
                <span className="text-base leading-none" role="img" aria-hidden="true">{FLAG_MAP[code]}</span>
                <span className="hidden lg:inline">{t(`languages.${code}`)}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* Center — TWA logo (hidden on mobile — already visible in Header2) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
          <Image
            src="/images/twa-logo.svg"
            alt="TWA"
            width={900}
            height={300}
            className="h-20 max-h-20 w-auto"
          />
        </div>

        {/* Right — E-Magazine icon + DateTime */}
        <div className="flex items-center gap-5 text-sm text-neutral-700 dark:text-neutral-300">
          {/* E-Magazine link */}
          <Link
            href="/e-magazine"
            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
            title={t('eMagazine')}
          >
            {/* Book / Magazine icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 4.533A9.707 9.707 0 0118 3a9.735 9.735 0 013.25.555.75.75 0 01.5.707v14.25a.75.75 0 01-1 .707A8.237 8.237 0 0018 18.75c-1.995 0-3.823.707-5.25 1.886V4.533z" />
            </svg>
            <span className="hidden sm:inline">{t('eMagazine')}</span>
          </Link>

          {/* Separator */}
          <div className="hidden h-5 w-px bg-neutral-300 dark:bg-neutral-700 sm:block" />

          {/* Date & Time */}
          <span className="hidden whitespace-nowrap sm:inline min-h-5">{dateTime || '\u00A0'}</span>
        </div>
      </div>
    </div>
  )
}
