import type { TPost } from '@/utils/dataTransformers'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { FC } from 'react'
import ButtonPlayMusicPlayer from '../ButtonPlayMusicPlayer'
import LocalDate from '../LocalDate'
import PostCardCommentBtn from '../PostCardCommentBtn'
import PostCardLikeBtn from '../PostCardLikeBtn'
import PostCardSaveBtn from '../PostCardSaveBtn'

interface Props {
  className?: string
  ratio?: string
  post: TPost
}

const Card9: FC<Props> = ({ className, ratio = 'aspect-16/9', post }) => {
  const {
    title,
    handle,
    featuredImage,
    categories,
    author,
    date,
    postType,
    likeCount,
    liked,
    commentCount,
    readingTime,
    bookmarked,
  } = post
  const primaryCategory = categories?.[0]

  const renderMeta = () => {
    return (
      <div className="mt-3.5 text-neutral-300">
        <h2 className="heading-serif block text-lg/6 font-bold text-white">
          <Link href={`/post/${handle}`} title={title}>
            {title}
          </Link>
        </h2>
        <div className="relative mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
          <Link href={`/author/${author.handle}`} className="absolute inset-0" aria-label={author.name} tabIndex={-1} />
          <span className="font-semibold text-neutral-200 hover:text-white">{author.name}</span>
          <span className="font-medium">·</span>
          <LocalDate date={date} />
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('group post-card-9 relative flex flex-col overflow-hidden rounded-lg', className)}>
      <div className={`relative flex w-full items-start ${ratio}`}></div>

      <Link href={`/post/${handle}`} className="absolute inset-0">
        <Image
          fill
          alt={title}
          className="size-full rounded-lg object-cover brightness-[0.6] transition-transform duration-500 group-hover:scale-[1.02]"
          src={featuredImage}
          sizes="(max-width: 600px) 480px, 800px"
        />
      </Link>

      {postType === 'audio' && (
        <ButtonPlayMusicPlayer className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4" post={post} />
      )}

      <div className="absolute inset-x-0 bottom-0 flex grow flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {postType === 'opinion' && (
            <span className="inline-block rounded bg-primary-700 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
              Opinion
            </span>
          )}
          {primaryCategory && (
            <span className="inline-block rounded bg-primary-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
              {primaryCategory.name}
            </span>
          )}
        </div>
        {renderMeta()}
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
          <PostCardLikeBtn likeCount={likeCount} liked={liked} />
          <PostCardCommentBtn commentCount={commentCount} handle={handle} />
          <PostCardSaveBtn className="ms-auto" readingTime={readingTime} bookmarked={bookmarked} postId={post.id} />
        </div>
      </div>
    </div>
  )
}

export default Card9
