'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { TPost } from '@/data/posts'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

interface SectionVideoPostsProps {
  posts: TPost[]
  heading?: string
  subHeading?: string
  className?: string
}

const SectionVideoPosts: React.FC<SectionVideoPostsProps> = ({
  posts,
  heading = 'Video',
  subHeading = 'Watch the latest video stories',
  className = '',
}) => {
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null)

  if (!posts.length) return null

  const featured = posts[0]
  const rest = posts.slice(1, 7)

  return (
    <div className={`nc-SectionVideoPosts ${className}`}>
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 md:text-3xl">
            {heading}
          </h2>
          {subHeading && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {subHeading}
            </p>
          )}
        </div>
        <Link
          href="/category/video"
          className="shrink-0 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Featured Video — large player */}
        <div className="lg:col-span-2">
          <div className="group relative aspect-video overflow-hidden rounded-2xl bg-neutral-900">
            {featured.videoUrl ? (
              <ReactPlayer
                url={featured.videoUrl}
                width="100%"
                height="100%"
                controls
                light={
                  <Image
                    src={featured.featuredImage.src}
                    alt={featured.title}
                    fill
                    className="object-cover"
                  />
                }
                playing={activeVideo === featured.id}
                onClickPreview={() => setActiveVideo(featured.id)}
              />
            ) : (
              <Link href={`/post/${featured.handle}`}>
                <Image
                  src={featured.featuredImage.src}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg">
                    <svg className="h-8 w-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
          <div className="mt-3">
            <Link href={`/post/${featured.handle}`}>
              <h3 className="text-lg font-semibold text-neutral-900 transition hover:text-primary-600 dark:text-neutral-100 dark:hover:text-primary-400 md:text-xl">
                {featured.title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {featured.author.name} · {new Date(featured.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Side list — smaller video cards */}
        <div className="flex flex-col gap-4">
          {rest.map((post) => (
            <div key={post.id} className="group flex gap-3">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                <Link href={`/post/${post.handle}`}>
                  <Image
                    src={post.featuredImage.src}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-900">
                      <svg className="h-4 w-4 translate-x-px" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="flex flex-col justify-center">
                <Link href={`/post/${post.handle}`}>
                  <h4 className="line-clamp-2 text-sm font-semibold text-neutral-900 transition hover:text-primary-600 dark:text-neutral-100 dark:hover:text-primary-400">
                    {post.title}
                  </h4>
                </Link>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {post.author.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SectionVideoPosts
