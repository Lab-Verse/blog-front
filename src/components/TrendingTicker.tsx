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
 * Shows a "Trending" label followed by a continuously scrolling row of post titles.
 */
const TrendingTicker: FC<Props> = ({ posts, label = 'Trending', className }) => {
  if (!posts.length) return null

  const items = posts.slice(0, 10)

  return (
    <div
      className={clsx(
        'trending-ticker flex items-center gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:border-neutral-700 dark:bg-neutral-900 mt-5 min-h-[44px]',
        className,
      )}
    >
      {/* Label */}
      <span className="shrink-0 rounded-md bg-primary-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase z-10">
        {label}
      </span>

      {/* Scrolling track — duplicated content for seamless loop */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="trending-ticker__track flex w-max animate-ticker gap-6 hover:[animation-play-state:paused]">
          {/* First set */}
          {items.map((post, i) => (
            <Link
              key={post.id}
              href={`/post/${post.handle}`}
              className="flex shrink-0 items-center gap-2 text-sm text-neutral-700 transition-colors hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
            >
              <span className="font-semibold text-primary-700 dark:text-primary-400">{String(i + 1).padStart(2, '0')}</span>
              <span className="max-w-[260px] truncate font-medium">{post.title}</span>
            </Link>
          ))}
          {/* Duplicate set for seamless loop */}
          {items.map((post, i) => (
            <span
              key={`dup-${post.id}`}
              className="flex shrink-0 items-center gap-2 text-sm text-neutral-700 transition-colors dark:text-neutral-300"
              aria-hidden="true"
            >
              <span className="font-semibold text-primary-700 dark:text-primary-400">{String(i + 1).padStart(2, '0')}</span>
              <span className="max-w-[260px] truncate font-medium">{post.title}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrendingTicker
