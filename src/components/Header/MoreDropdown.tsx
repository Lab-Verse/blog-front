'use client'

import { TNavigationItem } from '@/data/navigation'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface Props {
  items: TNavigationItem[]
}

export default function MoreDropdown({ items }: Props) {
  if (!items.length) return null

  return (
    <li className="relative flex list-none group">
      <button className="flex items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
        More
        <ChevronDownIcon className="ms-1 -me-1 size-4 text-neutral-400" aria-hidden="true" />
      </button>

      {/* Dropdown panel — visible on hover */}
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full right-0 z-50 w-56 pt-2">
        <ul className="grid space-y-1 rounded-lg bg-white py-3 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
          {items.map((item) => (
            <li key={item.id} className="px-2">
              <Link
                className="flex items-center rounded-md px-4 py-2 font-normal text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                href={item.href || '#'}
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
