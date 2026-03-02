'use client'

import type { TPost } from '@/utils/dataTransformers'
import { FC, useState } from 'react'
import clsx from 'clsx'
import { Link } from '@/i18n/navigation'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Card11 from './PostCards/Card11'
import Card4 from './PostCards/Card4'
import Card9 from './PostCards/Card9'
import Card2 from './PostCards/Card2'
import Card3 from './PostCards/Card3'

// ─── Types ────────────────────────────────────────────────────────────
export interface CategoryBlockTab {
  id: string
  name: string
  slug: string
  posts: TPost[]
}

export interface CategoryBlockData {
  id: string
  name: string
  slug: string
  color: string
  tabs: CategoryBlockTab[]
  /** All posts for this parent category (used to build the "All" tab, includes orphans) */
  allPosts?: TPost[]
}

interface Props {
  category: CategoryBlockData
  /** Visual layout variant for design diversity */
  variant?: 'featured' | 'grid' | 'list' | 'spotlight' | 'compact'
  className?: string
}

// ─── Accent color mapping ────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; text: string; pill: string; border: string }> = {
  red: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', pill: 'bg-red-600 text-white', border: 'border-red-500' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', pill: 'bg-blue-600 text-white', border: 'border-blue-500' },
  green: { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-600 dark:text-green-400', pill: 'bg-green-600 text-white', border: 'border-green-500' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-600 dark:text-yellow-400', pill: 'bg-yellow-600 text-white', border: 'border-yellow-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400', pill: 'bg-purple-600 text-white', border: 'border-purple-500' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-600 dark:text-pink-400', pill: 'bg-pink-600 text-white', border: 'border-pink-500' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', pill: 'bg-indigo-600 text-white', border: 'border-indigo-500' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-600 dark:text-teal-400', pill: 'bg-teal-600 text-white', border: 'border-teal-500' },
}

function getColorScheme(color: string) {
  return COLOR_MAP[color] || COLOR_MAP.blue
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

const SectionCategoryBlock: FC<Props> = ({ category, variant = 'grid', className }) => {
  // Build "All" tab: prefer allPosts (includes orphaned parent-level posts),
  // fallback to flatMapping child tabs
  const aggregatedPosts = category.allPosts && category.allPosts.length > 0
    ? category.allPosts
    : category.tabs.flatMap((t) => t.posts).filter(
        (post, index, self) => self.findIndex((p) => p.id === post.id) === index
      )

  const allTab: CategoryBlockTab = {
    id: 'all',
    name: 'All',
    slug: category.slug,
    posts: aggregatedPosts,
  }

  const tabs = [allTab, ...category.tabs]
  const [activeTabId, setActiveTabId] = useState(allTab.id)
  const activeTab = tabs.find((t) => t.id === activeTabId) || allTab
  const colors = getColorScheme(category.color)

  return (
    <section className={clsx('section-category-block', className)}>
      {/* Header with tabs */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href={`/category/${category.slug}`}
            className={clsx('text-2xl font-bold hover:underline lg:text-3xl', colors.text)}
          >
            {category.name}
          </Link>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="group hidden items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 sm:flex dark:hover:text-white"
        >
          View all
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {/* Subcategory tabs */}
      {tabs.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={clsx(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                activeTabId === tab.id
                  ? colors.pill
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}

      {/* Content — render based on variant, adapt for low post counts */}
      {activeTab.posts.length > 0 ? (
        <div className="min-h-[200px]">
          {activeTab.posts.length < 3 ? (
            <LayoutAdaptive posts={activeTab.posts} />
          ) : (
            <>
              {variant === 'featured' && <LayoutFeatured posts={activeTab.posts} />}
              {variant === 'grid' && <LayoutGrid posts={activeTab.posts} />}
              {variant === 'list' && <LayoutList posts={activeTab.posts} colors={colors} />}
              {variant === 'spotlight' && <LayoutSpotlight posts={activeTab.posts} />}
              {variant === 'compact' && <LayoutCompact posts={activeTab.posts} />}
            </>
          )}
        </div>
      ) : (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
          <p className="text-sm text-neutral-400">No articles yet in this category</p>
        </div>
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Layout Variants
// ═══════════════════════════════════════════════════════════════════════

/**
 * Adaptive: Graceful layout for 1-2 posts (prevents empty grid gaps)
 */
function LayoutAdaptive({ posts }: { posts: TPost[] }) {
  if (posts.length === 1) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card2 size="large" className="h-full" post={posts[0]} />
      </div>
    )
  }
  // 2 posts — side by side
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <Card2 key={post.id} size="large" className="h-full" post={post} />
      ))}
    </div>
  )
}

/**
 * Featured: 1 large card left + 2 smaller cards right (CNN / BBC style)
 */
function LayoutFeatured({ posts }: { posts: TPost[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>{posts[0] && <Card2 size="large" className="h-full" post={posts[0]} />}</div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {posts.slice(1, 5).map((post) => (
          <Card11 key={post.id} post={post} ratio="aspect-[4/3]" />
        ))}
      </div>
    </div>
  )
}

/**
 * Grid: 4-column card grid (clean, uniform, NYT style)
 */
function LayoutGrid({ posts }: { posts: TPost[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.slice(0, 8).map((post) => (
        <Card11 key={post.id} post={post} />
      ))}
    </div>
  )
}

/**
 * List: Horizontal rows with image thumbnail left + text right (Guardian style)
 */
function LayoutList({ posts, colors }: { posts: TPost[]; colors: { border: string } }) {
  return (
    <div className={clsx('divide-y divide-neutral-200 border-t-4 pt-2 dark:divide-neutral-700', colors.border)}>
      {posts.slice(0, 5).map((post) => (
        <div key={post.id} className="py-4">
          <Card4 post={post} />
        </div>
      ))}
    </div>
  )
}

/**
 * Spotlight: 1 hero card full width + 3 smaller cards below (Al Jazeera style)
 */
function LayoutSpotlight({ posts }: { posts: TPost[] }) {
  return (
    <div className="space-y-6">
      {posts[0] && <Card9 post={posts[0]} ratio="aspect-[21/9]" className="w-full" />}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(1, 4).map((post) => (
          <Card3 key={post.id} post={post} className="p-4 bg-neutral-50 rounded-2xl dark:bg-neutral-800/50" />
        ))}
      </div>
    </div>
  )
}

/**
 * Compact: Dense list with minimal spacing (Bloomberg/Reuters style)
 */
function LayoutCompact({ posts }: { posts: TPost[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.slice(0, 6).map((post) => (
        <Card3 key={post.id} post={post} />
      ))}
    </div>
  )
}

export default SectionCategoryBlock
