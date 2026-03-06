'use client'

import type { TPost } from '@/utils/dataTransformers'
import { FC, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import clsx from 'clsx'
import PostCardLikeBtn from './PostCardLikeBtn'
import PostCardCommentBtn from './PostCardCommentBtn'
import PostCardSaveBtn from './PostCardSaveBtn'
import LocalDate from './LocalDate'

interface Props {
  posts: TPost[]
  className?: string
}

/**
 * Full-width hero carousel with dark gradient overlay,
 * large serif headline, category tag, and read-time.
 * Uses Embla Carousel with auto-play and dash indicators.
 */
const HeroCarousel: FC<Props> = ({ posts, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Auto-play every 6 seconds, pause on hover
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000)

    return () => {
      clearInterval(interval)
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!posts.length) return null

  const heroSlides = posts.slice(0, 5)

  return (
    <section className={clsx('hero-carousel group/carousel relative', className)}>
      {/* Main carousel */}
      <div ref={emblaRef} className="embla rounded-2xl">
        <div className="embla__container flex">
          {heroSlides.map((post, i) => {
            const primaryCategory = post.categories?.[0]

            return (
              <div key={post.id} className="embla__slide relative min-w-0 flex-[0_0_100%]">
                <div className="relative aspect-16/9 sm:aspect-2/1 lg:aspect-21/9">
                  {/* Background image */}
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Clickable area */}
                  <Link href={`/post/${post.handle}`} className="absolute inset-0 z-10" />

                  {/* Hover actions — top right */}
                  <div className="absolute top-4 end-4 z-20 flex gap-2 opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100 sm:top-6 sm:end-6">
                    <PostCardLikeBtn likeCount={post.likeCount} liked={post.liked} />
                    <PostCardCommentBtn commentCount={post.commentCount} handle={post.handle} />
                    <PostCardSaveBtn bookmarked={post.bookmarked} postId={post.id} />
                  </div>

                  {/* Content overlay — bottom */}
                  <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 lg:p-12">
                    <div className="mx-auto max-w-4xl">
                      {/* Category pill */}
                      {primaryCategory && (
                        <Link
                          href={`/category/${primaryCategory.handle}`}
                          className="relative z-30 inline-block rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-primary-500"
                        >
                          {primaryCategory.name}
                        </Link>
                      )}

                      {/* Headline — serif */}
                      <h2 className="mt-3 text-xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl xl:text-5xl">
                        <Link href={`/post/${post.handle}`} className="relative z-30 hover:underline decoration-2 underline-offset-4">
                          {post.title}
                        </Link>
                      </h2>

                      {/* Meta row */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                        {post.author?.name && (
                          <span className="font-medium text-white">{post.author.name}</span>
                        )}
                        {post.date && (
                          <>
                            <span className="text-white/50">·</span>
                            <LocalDate date={post.date} options={{ month: 'short', day: 'numeric', year: 'numeric' }} />
                          </>
                        )}
                        {post.readingTime > 0 && (
                          <>
                            <span className="text-white/50">·</span>
                            <span>{post.readingTime} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Arrow navigation — thin side arrows */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute start-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/90 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white sm:start-5 sm:p-3"
      >
        <svg className="size-4 sm:size-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute end-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/90 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white sm:end-5 sm:p-3"
      >
        <svg className="size-4 sm:size-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dash indicators */}
      <div className="absolute inset-x-0 bottom-3 z-30 flex items-center justify-center gap-2 sm:bottom-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={clsx(
              'h-1 rounded-full transition-all duration-300',
              selectedIndex === index
                ? 'w-8 bg-white'
                : 'w-4 bg-white/40 hover:bg-white/60',
            )}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroCarousel
