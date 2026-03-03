'use client'

import type { TPost } from '@/utils/dataTransformers'
import { Link } from '@/i18n/navigation'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  posts: TPost[]
  label?: string
  className?: string
}

/**
 * Horizontal trending-now ticker strip.
 * Shows a "Trending" label followed by a scrollable row of post titles.
 */
const TrendingTicker: FC<Props> = ({ posts, label = 'Trending', className }) => {
  if (!posts.length) return null

  return (
    <div
      className={clsx(
        'trending-ticker flex items-center gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:border-neutral-700 dark:bg-neutral-900 mt-5',
        className,
      )}
    >
      {/* Label */}
      <span className="shrink-0 rounded-md bg-primary-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
        {label}
      </span>

      {/* Scrolling titles */}
      <div className="trending-ticker__track flex min-w-0 gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {posts.slice(0, 10).map((post, i) => (
          <Link
            key={post.id}
            href={`/post/${post.handle}`}
            className="flex shrink-0 items-center gap-2 text-sm text-neutral-700 transition-colors hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
          >
            <span className="font-semibold text-primary-500">{String(i + 1).padStart(2, '0')}</span>
            <span className="max-w-[260px] truncate font-medium">{post.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TrendingTicker
