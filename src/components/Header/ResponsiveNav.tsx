'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { TNavigationItem } from '@/data/navigation'
import { Link } from '@/i18n/navigation'
import clsx from 'clsx'
import MoreDropdown from './MoreDropdown'

interface Props {
  items: TNavigationItem[]
  /** When set, highlights the matching item */
  activeHref?: string
}

/**
 * Responsive navigation that measures available space and moves
 * overflow items into a "More" dropdown automatically.
 */
export default function ResponsiveNav({ items, activeHref }: Props) {
  const outerRef = useRef<HTMLDivElement>(null)
  const measuringRef = useRef<HTMLUListElement>(null)
  const [visibleCount, setVisibleCount] = useState(items.length)

  const measure = useCallback(() => {
    const outer = outerRef.current
    const measuring = measuringRef.current
    if (!outer || !measuring) return

    const availableWidth = outer.clientWidth
    const moreButtonWidth = 100 // Reserve space for "More" button
    const gap = 4 // gap-x-1 = 0.25rem = 4px

    let totalWidth = 0
    let count = 0
    const children = measuring.children

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement
      const childWidth = child.offsetWidth + gap
      const wouldExceed = totalWidth + childWidth > availableWidth - (i < children.length - 1 ? moreButtonWidth : 0)

      if (wouldExceed && i < children.length - 1) {
        // If adding this would exceed, but all items fit without "More", allow it
        break
      }
      totalWidth += childWidth
      count++
    }

    // If all items fit, show all
    if (totalWidth <= availableWidth) {
      count = items.length
    }

    setVisibleCount(Math.max(1, count))
  }, [items.length])

  useEffect(() => {
    measure()

    const observer = new ResizeObserver(() => {
      measure()
    })

    if (outerRef.current) {
      observer.observe(outerRef.current)
    }

    return () => observer.disconnect()
  }, [measure])

  const visible = items.slice(0, visibleCount)
  const overflow = items.slice(visibleCount)

  return (
    <div ref={outerRef} className="flex flex-1 items-center justify-center overflow-hidden">
      {/* Hidden measuring row — all items rendered but invisible, for width measurement */}
      <ul
        ref={measuringRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex items-center gap-x-1"
        style={{ whiteSpace: 'nowrap' }}
      >
        {items.map((item) => (
          <li key={item.id}>
            <span className="block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap">
              {item.name}
            </span>
          </li>
        ))}
      </ul>

      {/* Visible nav */}
      <ul className="flex items-center gap-x-1">
        {visible.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href || '#'}
              className={clsx(
                'block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                activeHref && item.href === activeHref
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
        {overflow.length > 0 && <MoreDropdown items={overflow} />}
      </ul>
    </div>
  )
}
