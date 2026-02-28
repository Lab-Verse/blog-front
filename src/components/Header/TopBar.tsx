'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

export default function TopBar() {
  const [currentLang, setCurrentLang] = useState('en')
  const [isOpen, setIsOpen] = useState(false)
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setDateTime(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
          '  |  ' +
          now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
      )
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  const activeLang = LANGUAGES.find((l) => l.code === currentLang)!

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
              <span>{activeLang.flag}</span>
              <span className="hidden sm:inline">{activeLang.label}</span>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                <div className="absolute right-0 z-40 mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setCurrentLang(lang.code); setIsOpen(false) }}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                        lang.code === currentLang ? 'bg-neutral-100 font-medium dark:bg-neutral-800' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
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
