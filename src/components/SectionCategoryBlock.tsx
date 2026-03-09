'use client'

import type { TPost } from '@/utils/dataTransformers'
import { FC, useState } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Card11 from './PostCards/Card11'
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
  variant?: 'featured' | 'grid' | 'list' | 'spotlight' | 'compact' | 'magazine' | 'editorial'
  /** Section index for editorial numbering (1-based) */
  sectionIndex?: number
  /** Header style: 'default' = left-aligned accent, 'centered' = large centered title, 'editorial' = FT-style centered uppercase with text nav */
  headerStyle?: 'default' | 'centered' | 'editorial'
  className?: string
}

// ─── Accent color mapping ────────────────────────────────────────────
// Unified neutral + primary palette (no per-category colors)
const NEUTRAL_COLORS = {
  bg: 'bg-neutral-50 dark:bg-neutral-900/50',
  text: 'text-neutral-900 dark:text-neutral-100',
  pill: 'bg-primary-600 text-white',
  border: 'border-primary-600',
}

function getColorScheme(_color: string) {
  return NEUTRAL_COLORS
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════

const SectionCategoryBlock: FC<Props> = ({ category, variant = 'grid', sectionIndex, headerStyle = 'default', className }) => {
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
    <section className={clsx('section-category-block', className, headerStyle === 'editorial' && 'rounded-3xl bg-neutral-50 px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16 dark:bg-neutral-900')}>
      {headerStyle === 'editorial' ? (
        /* ── Editorial header: FT-style centered uppercase title + text nav tabs ── */
        <div className="mb-10">
          <div className="text-center">
            <h2 className="heading-serif text-xl font-bold tracking-widest text-neutral-900 uppercase sm:text-2xl dark:text-neutral-100">
              <Link
                href={`/category/${category.slug}`}
                className="hover:underline"
              >
                {category.name}
              </Link>
            </h2>
          </div>

          {/* Subcategory text links — FT style */}
          {tabs.length > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-b border-neutral-300 py-3 dark:border-neutral-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={clsx(
                    'text-xs font-bold tracking-wider uppercase transition-colors sm:text-sm',
                    activeTabId === tab.id
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : headerStyle === 'centered' ? (
        /* ── Centered header: large title + centered tabs ── */
        <div className="mb-10">
          <div className="text-center">
            <h2 className="heading-serif text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl dark:text-neutral-100">
              <Link
                href={`/category/${category.slug}`}
                className="hover:underline"
              >
                {category.name}
              </Link>
            </h2>
          </div>

          {/* Subcategory tabs — centered */}
          {tabs.length > 1 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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
              <Link
                href={`/category/${category.slug}`}
                className="group ms-4 hidden items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 sm:inline-flex dark:hover:text-white"
              >
                View all
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* ── Default header: left-aligned with accent underline ── */
        <>
          <div className="mb-8">
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                {sectionIndex != null && (
                  <span className={clsx('heading-serif text-4xl font-black opacity-15 lg:text-5xl text-neutral-300 dark:text-neutral-600')}>
                    {String(sectionIndex).padStart(2, '0')}
                  </span>
                )}
                <h2 className={clsx('heading-serif text-2xl font-bold hover:underline lg:text-3xl text-neutral-900 dark:text-neutral-100')}>
                  <Link
                    href={`/category/${category.slug}`}
                  >
                    {category.name}
                  </Link>
                </h2>
              </div>
              <Link
                href={`/category/${category.slug}`}
                className="group hidden items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 sm:flex dark:hover:text-white"
              >
                View all
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </div>
            {/* Accent underline */}
            <div className="mt-3 flex items-center gap-2">
              <div className={clsx('h-1 w-12 rounded-full bg-primary-600')} />
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
            </div>
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
        </>
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
              {variant === 'magazine' && <LayoutMagazine posts={activeTab.posts} />}
              {variant === 'editorial' && <LayoutEditorial posts={activeTab.posts} colors={colors} />}
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
function LayoutList({ posts }: { posts: TPost[]; colors: { border: string } }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left — large hero card spanning 3 cols */}
      <div className="lg:col-span-3">
        {posts[0] && <Card2 size="large" className="h-full" post={posts[0]} />}
      </div>
      {/* Right — stacked horizontal rows */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        {posts.slice(1, 5).map((post) => (
          <Card3 key={post.id} post={post} />
        ))}
      </div>
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

/**
 * Magazine: 2 small cards left | 1 large card center | 2 small cards right
 * (Newspaper broadsheet / NYT-style spread)
 */
function LayoutMagazine({ posts }: { posts: TPost[] }) {
  const [hero, ...rest] = posts
  const leftPosts = rest.slice(0, 2)
  const rightPosts = rest.slice(2, 4)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:gap-8">
      {/* Left column — 2 small cards stacked */}
      <div className="flex flex-col gap-6 md:col-span-1">
        {leftPosts.map((post) => (
          <Card11 key={post.id} post={post} ratio="aspect-4/3" />
        ))}
      </div>

      {/* Center — 1 large hero card */}
      <div className="md:col-span-2">
        {hero && <Card2 size="large" className="h-full" post={hero} />}
      </div>

      {/* Right column — 2 small cards stacked */}
      <div className="flex flex-col gap-6 md:col-span-1">
        {rightPosts.map((post) => (
          <Card11 key={post.id} post={post} ratio="aspect-4/3" />
        ))}
      </div>
    </div>
  )
}

/**
 * Editorial: FT-inspired clean layout — 2 large cards on top + 3 smaller cards below.
 * Each card shows: image → category label in accent → serif title (no social buttons).
 */
function LayoutEditorial({ posts, colors }: { posts: TPost[]; colors: { text: string } }) {
  const topPosts = posts.slice(0, 2)
  const bottomPosts = posts.slice(2, 5)

  return (
    <div className="space-y-8">
      {/* Top row: 2 large cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        {topPosts.map((post) => (
          <EditorialCard key={post.id} post={post} colors={colors} size="large" />
        ))}
      </div>

      {/* Bottom row: 3 smaller cards */}
      {bottomPosts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {bottomPosts.map((post) => (
            <EditorialCard key={post.id} post={post} colors={colors} size="small" />
          ))}
        </div>
      )}
    </div>
  )
}

/** FT-style editorial card: image + category label + serif title */
function EditorialCard({
  post,
  colors,
  size,
}: {
  post: TPost
  colors: { text: string }
  size: 'large' | 'small'
}) {
  const { title, handle, featuredImage, categories } = post
  const primaryCategory = categories[0]

  return (
    <article className="group flex flex-col">
      {/* Image */}
      <Link href={`/post/${handle}`} className="relative block overflow-hidden rounded-lg">
        <div className={clsx('relative w-full', size === 'large' ? 'aspect-16/9' : 'aspect-16/9')}>
          <Image
            src={featuredImage}
            alt={title}
            fill
            sizes={size === 'large' ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      {/* Category label */}
      <div className="mt-4 text-center">
        {primaryCategory && (
          <Link
            href={`/category/${primaryCategory.handle}`}
            className="text-xs font-bold tracking-wider text-primary-600 uppercase hover:underline dark:text-primary-400 sm:text-sm"
          >
            {primaryCategory.name}
          </Link>
        )}
      </div>

      {/* Title */}
      <h3
        className={clsx(
          'heading-serif mt-2 text-center font-bold text-neutral-900 dark:text-neutral-100',
          size === 'large'
            ? 'text-base leading-snug sm:text-lg md:text-xl'
            : 'text-sm leading-snug sm:text-base'
        )}
      >
        <Link href={`/post/${handle}`} className="line-clamp-3 hover:underline">
          {title}
        </Link>
      </h3>
    </article>
  )
}

export default SectionCategoryBlock
