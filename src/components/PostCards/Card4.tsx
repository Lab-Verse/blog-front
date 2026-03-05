'use client'

import type { TPost } from '@/utils/dataTransformers'
import clsx from 'clsx'
import { Link } from '@/i18n/navigation'
import { FC, useState } from 'react'
import PostCardCommentBtn from '../PostCardCommentBtn'
import PostCardLikeBtn from '../PostCardLikeBtn'
import PostCardMeta from '../PostCardMeta/PostCardMeta'
import PostCardSaveBtn from '../PostCardSaveBtn'
import PostFeaturedMedia from '../PostFeaturedMedia/PostFeaturedMedia'

interface Props {
  className?: string
  post: TPost
}

const Card4: FC<Props> = ({ className, post }) => {
  const { title, handle, categories, readingTime, bookmarked, likeCount, liked, commentCount } = post
  const primaryCategory = categories?.[0]
  const [isHover, setIsHover] = useState(false)
  return (
    <div
      className={clsx(
        'group post-card-4 relative flex flex-col rounded-lg border bg-white dark:bg-white/5',
        className
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative aspect-16/9 w-full shrink-0 overflow-hidden rounded-t-lg">
        <PostFeaturedMedia post={post} isHover={isHover} className="transition-transform duration-500 group-hover:scale-[1.02]" />
        {primaryCategory && (
          <span className="absolute bottom-2 start-2 rounded bg-primary-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
            {primaryCategory.name}
          </span>
        )}
      </div>

      <div className="flex grow flex-col gap-y-2.5 p-4">
        <PostCardMeta meta={post} />
        <h2 className="heading-serif block font-bold text-neutral-900 dark:text-neutral-100">
          <Link href={`/post/${handle}`} className="line-clamp-2 hover:underline decoration-1 underline-offset-2" title={title}>
            {title}
          </Link>
        </h2>
        <div className="mt-auto flex flex-wrap gap-x-2 gap-y-1">
          <PostCardLikeBtn likeCount={likeCount} liked={liked} />
          <PostCardCommentBtn commentCount={commentCount} handle={handle} />
          <PostCardSaveBtn className="ms-auto" readingTime={readingTime} bookmarked={bookmarked} postId={post.id} />
        </div>
      </div>
    </div>
  )
}

export default Card4
