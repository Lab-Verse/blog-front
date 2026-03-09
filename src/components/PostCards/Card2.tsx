import type { TPost } from '@/utils/dataTransformers'
import { Divider } from '@/shared/divider'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { FC } from 'react'
import PostCardCommentBtn from '../PostCardCommentBtn'
import PostCardLikeBtn from '../PostCardLikeBtn'
import PostCardMeta from '../PostCardMeta/PostCardMeta'
import PostCardSaveBtn from '../PostCardSaveBtn'
import PostTypeFeaturedIcon from '../PostTypeFeaturedIcon'

interface Props {
  className?: string
  post: TPost
  size?: 'normal' | 'large'
}

const Card2: FC<Props> = ({ className, size = 'normal', post }) => {
  const {
    title,
    featuredImage,
    handle,
    readingTime,
    categories,
    postType,
    likeCount,
    liked,
    commentCount,
    bookmarked,
    excerpt,
  } = post
  const primaryCategory = categories?.[0]

  return (
    <div className={clsx('group post-card-2 relative flex flex-col', className)}>
      <div className="relative w-full shrink-0 overflow-hidden rounded-lg">
        <div className="relative aspect-16/9">
          <Image
            fill
            sizes="(max-width: 600px) 100vw, 50vw"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            src={featuredImage}
            alt={title}
          />
        </div>
        <Link href={`/post/${handle}`} className="absolute inset-0 z-0" aria-label={title} tabIndex={-1}></Link>
        <div className="absolute bottom-3 start-3 flex flex-wrap gap-1.5">
          <PostTypeFeaturedIcon
            postType={postType}
            wrapSize="size-8"
            iconSize="size-4"
          />
          {primaryCategory && (
            <span className="rounded bg-primary-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
              {primaryCategory.name}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:px-4">
        <div className="space-y-3">
          <PostCardMeta className="relative text-sm" meta={post} />
          <h2
            className={clsx(
              'heading-serif post-card-title block font-bold text-neutral-900 dark:text-neutral-100',
              size === 'large' ? 'text-base sm:text-lg md:text-xl' : 'text-base'
            )}
          >
            <Link href={`/post/${handle}`} className="line-clamp-2 hover:underline decoration-1 underline-offset-2" title={title}>
              {title}
            </Link>
          </h2>
          <p className="block text-sm/6 text-neutral-600 dark:text-neutral-400">{excerpt}</p>
        </div>

        <Divider className="my-5" />

        <div className="relative flex flex-wrap gap-x-2 gap-y-1">
          <PostCardLikeBtn likeCount={likeCount} liked={liked} />
          <PostCardCommentBtn commentCount={commentCount} handle={handle} />
          <PostCardSaveBtn className="ms-auto" readingTime={readingTime} bookmarked={bookmarked} postId={post.id} />
        </div>
      </div>
    </div>
  )
}

export default Card2
