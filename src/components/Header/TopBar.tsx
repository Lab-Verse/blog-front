'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
  const [isOpen, setIsOpen] = useState(false)
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
    setIsOpen(false)
  }

  return (
    <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="container flex h-10 items-center justify-between gap-4">
        {/* Left — TWA small logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/twa.png"
            alt="TWA"
            width={100}
            height={30}
            className="h-6 w-auto"
          />
        </div>

        {/* Right — Language + DateTime */}
        <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className={`fi fi-${FLAG_MAP[locale]} fis rounded-sm`} />
              <span className="hidden sm:inline">{t(`languages.${locale}`)}</span>
              <svg className="h-3 w-3 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                <div className="absolute end-0 z-40 mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                  {locales.map((code) => (
                    <button
                      key={code}
                      onClick={() => switchLocale(code)}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 rtl:text-right ${
                        code === locale ? 'bg-neutral-100 font-medium dark:bg-neutral-800' : ''
                      }`}
                    >
                      <span className={`fi fi-${FLAG_MAP[code]} fis rounded-sm`} />
                      <span>{t(`languages.${code}`)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Separator */}
          <div className="hidden h-4 w-px bg-neutral-300 dark:bg-neutral-700 sm:block" />

          {/* Date & Time */}
          <span className="hidden whitespace-nowrap sm:inline">{dateTime}</span>
        </div>
      </div>
    </div>
  )
}
