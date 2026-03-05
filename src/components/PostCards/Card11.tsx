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
  ratio?: string
  hiddenAuthor?: boolean
}

const Card11: FC<Props> = ({ className, post, hiddenAuthor = false, ratio = 'aspect-16/9' }) => {
  const { title, handle, categories, date, likeCount, liked, commentCount, readingTime, bookmarked } = post
  const primaryCategory = categories?.[0]

  const [isHover, setIsHover] = useState(false)

  return (
    <div
      className={clsx('group post-card-11 relative flex flex-col rounded-lg bg-white dark:bg-white/5', className)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={clsx('relative w-full shrink-0 overflow-hidden rounded-t-lg', ratio)}>
        <PostFeaturedMedia post={post} isHover={isHover} className="transition-transform duration-500 group-hover:scale-[1.02]" />
        <div className="absolute bottom-2 start-2 flex flex-wrap gap-1.5">
          {post.postType === 'opinion' && (
            <span className="rounded bg-primary-700 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
              Opinion
            </span>
          )}
          {primaryCategory && (
            <span className="rounded bg-primary-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
              {primaryCategory.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex grow flex-col gap-y-3 rounded-b-lg border p-4">
        {!hiddenAuthor ? <PostCardMeta meta={post} /> : <span className="text-xs text-neutral-500">{date}</span>}
        <h3 className="heading-serif nc-card-title block text-base font-bold text-neutral-900 dark:text-neutral-100">
          <Link href={`/post/${post.handle}`} className="line-clamp-2 hover:underline decoration-1 underline-offset-2" title={title}>
            {title}
          </Link>
        </h3>

        <div className="mt-auto flex flex-wrap gap-x-2 gap-y-1">
          <PostCardLikeBtn likeCount={likeCount} liked={liked} />
          <PostCardCommentBtn commentCount={commentCount} handle={handle} />
          <PostCardSaveBtn className="ms-auto" readingTime={readingTime} bookmarked={bookmarked} postId={post.id} />
        </div>
      </div>
    </div>
  )
}

export default Card11
