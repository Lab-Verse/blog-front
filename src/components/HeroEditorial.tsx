import type { TPost } from '@/utils/dataTransformers'
import { FC } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import clsx from 'clsx'
import LocalDate from './LocalDate'

interface Props {
  posts: TPost[]
  className?: string
}

/**
 * CNN-style editorial hero layout:
 *  - Large centered serif headline (lead story)
 *  - 3-column spread: side stories | hero image + related links | side stories
 *  - Minimal chrome, newspaper broadsheet feel
 */
const HeroEditorial: FC<Props> = ({ posts, className }) => {
  if (!posts.length) return null

  const hero = posts[0]
  const leftPosts = posts.slice(1, 4) // 3 left sidebar stories
  const rightPosts = posts.slice(4, 7) // 3 right sidebar stories
  const relatedPosts = posts.slice(7, 11) // up to 4 text-only related links

  const heroCategory = hero.categories?.[0]

  return (
    <section className={clsx('hero-editorial', className)}>
      {/* ── Featured headline ── */}
      <div className="mb-8 border-b border-neutral-200 pb-8 text-center dark:border-neutral-700 lg:mb-10 lg:pb-10">
        {heroCategory && (
          <Link
            href={`/category/${heroCategory.handle}`}
            className="mb-3 inline-block text-xs font-bold tracking-widest text-primary-600 uppercase hover:underline dark:text-primary-400"
          >
            {heroCategory.name}
          </Link>
        )}
        <h1
          className="heading-serif mx-auto max-w-4xl text-xl leading-tight font-bold text-indigo-900 sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.5rem] xl:leading-[1.2] dark:text-indigo-200"
        >
          <Link
            href={`/post/${hero.handle}`}
            className="hover:underline decoration-2 underline-offset-4"
          >
            {hero.title}
          </Link>
        </h1>
        {hero.excerpt && (
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
            {hero.excerpt}
          </p>
        )}
      </div>

      {/* ── 3-column spread ── */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6 lg:gap-8">
        {/* Left column — stacked side stories */}
        <div className="order-2 md:order-none md:col-span-3">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {leftPosts.map((post, i) => (
              <SideStory key={post.id} post={post} isFirst={i === 0} />
            ))}
          </div>
        </div>

        {/* Center column — hero image + related links (order-first on mobile for LCP) */}
        <div className="order-1 md:order-none md:col-span-6">
          {/* Hero image */}
          <div className="group relative overflow-hidden rounded-lg">
            <Link href={`/post/${hero.handle}`} className="block">
              <div className="relative aspect-16/9">
                <Image
                  src={hero.featuredImage}
                  alt={hero.title}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
            {/* Category badge overlay */}
            {heroCategory && (
              <span className="absolute bottom-3 start-3 rounded bg-primary-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
                {heroCategory.name}
              </span>
            )}
          </div>

          {/* Hero meta below image */}
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              {hero.author?.name && (
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {hero.author.name}
                </span>
              )}
              {hero.date && (
                <>
                  <span>·</span>
                  <LocalDate date={hero.date} options={{ month: 'long', day: 'numeric', year: 'numeric' }} />
                </>
              )}
              {hero.readingTime > 0 && (
                <>
                  <span>·</span>
                  <span>{hero.readingTime} min read</span>
                </>
              )}
            </div>
          </div>

          {/* Related text links — CNN "what else" style */}
          {relatedPosts.length > 0 && (
            <div className="mt-5 space-y-2.5 border-t border-neutral-200 pt-5 dark:border-neutral-700">
              {relatedPosts.map((post) => (
                <TextLink key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right column — stacked side stories */}
        <div className="order-3 md:order-none md:col-span-3">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {rightPosts.map((post, i) => (
              <SideStory key={post.id} post={post} isFirst={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Side story card (image + title) ────────────────────────────────
function SideStory({ post, isFirst }: { post: TPost; isFirst: boolean }) {
  const category = post.categories?.[0]

  return (
    <article className={clsx('group', isFirst ? 'pb-5' : 'py-5')}>
      {/* Image */}
      <Link href={`/post/${post.handle}`} className="relative mb-3 block overflow-hidden rounded-lg">
        <div className="relative aspect-16/9">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* Category pill */}
        {category && (
          <span className="absolute bottom-2 start-2 rounded bg-neutral-900/70 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
            {category.name}
          </span>
        )}
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        {post.author?.name && (
          <span className="font-medium text-neutral-600 dark:text-neutral-300">{post.author.name}</span>
        )}
        {post.date && (
          <>
            <span>·</span>
            <LocalDate date={post.date} options={{ month: 'short', day: 'numeric', year: 'numeric' }} />
          </>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-1.5 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
        <Link
          href={`/post/${post.handle}`}
          className="line-clamp-3 hover:underline decoration-1 underline-offset-2"
        >
          {post.title}
        </Link>
      </h2>

      {/* Reading time */}
      {post.readingTime > 0 && (
        <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">
          {post.readingTime} min read
        </span>
      )}
    </article>
  )
}

// ─── Text-only related link ─────────────────────────────────────────
function TextLink({ post }: { post: TPost }) {
  return (
    <div className="group flex items-start gap-2">
      <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary-500" />
      <Link
        href={`/post/${post.handle}`}
        className="text-sm font-medium leading-snug text-neutral-700 hover:text-primary-600 hover:underline dark:text-neutral-300 dark:hover:text-primary-400"
      >
        {post.title}
      </Link>
    </div>
  )
}

export default HeroEditorial
