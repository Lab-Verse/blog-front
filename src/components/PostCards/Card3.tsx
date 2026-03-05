import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import type { TPost } from '@/utils/dataTransformers'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { FC } from 'react'
import PostCardCommentBtn from '../PostCardCommentBtn'
import PostCardLikeBtn from '../PostCardLikeBtn'
import PostCardSaveBtn from '../PostCardSaveBtn'
import PostTypeFeaturedIcon from '../PostTypeFeaturedIcon'

interface Props {
  className?: string
  post: TPost
}

const Card3: FC<Props> = ({ className, post }) => {
  const {
    title,
    handle,
    readingTime,
    featuredImage,
    excerpt,
    categories,
    postType,
    likeCount,
    liked,
    commentCount,
    bookmarked,
  } = post
  const primaryCategory = categories?.[0]

  return (
    <div className={clsx('group post-card-3 flex flex-wrap items-center gap-x-7 gap-y-5 sm:flex-nowrap', className)}>
      <div className="flex grow flex-col">
        <div className="space-y-3.5">
          {primaryCategory && (
            <Link
              href={`/category/${primaryCategory.handle}`}
              className="text-xs font-bold tracking-wider text-primary-600 uppercase hover:underline dark:text-primary-400"
            >
              {primaryCategory.name}
            </Link>
          )}
          <h2 className="heading-serif nc-card-title block text-base font-bold xl:text-lg text-neutral-900 dark:text-neutral-100">
            <Link href={`/post/${handle}`} className="line-clamp-2 hover:underline decoration-1 underline-offset-2" title={title}>
              {title}
            </Link>
          </h2>
          <p className="line-clamp-2 text-sm/6 text-neutral-600 dark:text-neutral-400">{excerpt}</p>

          <PostCardMeta meta={post} />
        </div>
        <div className="relative mt-5 flex flex-wrap gap-x-2 gap-y-1">
          <PostCardLikeBtn likeCount={likeCount} liked={liked} />
          <PostCardCommentBtn commentCount={commentCount} handle={handle} />
          <PostCardSaveBtn className="ms-auto" readingTime={readingTime} bookmarked={bookmarked} postId={post.id} />
        </div>
      </div>

      <div className="relative aspect-16/9 w-64 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={featuredImage}
          alt={title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          fill
        />
        <PostTypeFeaturedIcon
          className="absolute bottom-2 left-2"
          postType={postType}
          wrapSize="size-8"
          iconSize="size-4"
        />
        <Link href={`/post/${handle}`} className="absolute inset-0"></Link>
      </div>
    </div>
  )
}

export default Card3
