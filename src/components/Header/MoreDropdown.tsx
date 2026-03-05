'use client'

import { TNavigationItem } from '@/data/navigation'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Link } from '@/i18n/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  items: TNavigationItem[]
}

export default function MoreDropdown({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLLIElement>(null)
  const t = useTranslations('header')

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!items.length) return null

  return (
    <li
      ref={containerRef}
      className="relative flex list-none"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen((prev) => !prev)
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        {t('more')}
        <ChevronDownIcon
          className={`ms-1 -me-1 size-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel — visible on hover AND click */}
      <div
        className={`absolute top-full right-0 z-50 w-56 pt-2 transition-all duration-200 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        <ul className="grid space-y-1 rounded-lg bg-white py-3 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
          {items.map((item) => (
            <li key={item.id} className="px-2">
              <Link
                className="flex items-center rounded-md px-4 py-2 font-normal text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                href={item.href || '#'}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
