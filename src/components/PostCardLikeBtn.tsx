'use client'

import { useToggleReactionMutation } from '@/app/redux/api/reactions/reactionsApi'
import { cookies } from '@/app/redux/utils/cookies'
import convertNumbThousand from '@/utils/convertNumbThousand'
import { HeartIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { jwtDecode } from 'jwt-decode'
import { FC, useState } from 'react'

interface Props {
  className?: string
  likeCount: number
  liked?: boolean
  postId?: string
}

const PostCardLikeBtn: FC<Props> = ({ className, likeCount = 0, liked, postId }) => {
  const [isLiked, setisLiked] = useState(liked)
  const [toggleReaction] = useToggleReactionMutation()

  const handleLike = async () => {
    if (!postId) {
      setisLiked(!isLiked)
      return
    }

    try {
      const token = cookies.getAccessToken()
      if (!token) {
        // Not logged in - just toggle UI
        setisLiked(!isLiked)
        return
      }
      const decoded: any = jwtDecode(token)
      const userId = decoded?.sub
      if (!userId) {
        setisLiked(!isLiked)
        return
      }

      setisLiked(!isLiked)
      await toggleReaction({
        userId,
        reactableId: postId,
        reactableType: 'post',
        reactionType: 'like',
      }).unwrap()
    } catch {
      // Revert on error
      setisLiked(isLiked)
    }
  }

  return (
    <button
      className={clsx(
        'post-card-like-btn group flex h-8 items-center rounded-full ps-2 pe-3 text-xs leading-none transition-colors',
        className,
        isLiked
          ? 'bg-rose-50 text-rose-600 dark:bg-rose-100'
          : 'bg-neutral-50 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/10 dark:hover:bg-white/10 dark:hover:text-rose-400'
      )}
      onClick={handleLike}
      title="Like"
    >
      <HeartIcon className="size-5" fill={isLiked ? 'currentColor' : 'none'} />

      <span className={clsx('ms-1', isLiked && 'text-rose-600')}>
        {convertNumbThousand(isLiked ? likeCount + 1 : likeCount)}
      </span>
    </button>
  )
}

export default PostCardLikeBtn
