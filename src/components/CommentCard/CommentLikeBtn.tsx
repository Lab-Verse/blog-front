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
  isLiked: boolean
  commentId: string
}

const CommentLikeBtn: FC<Props> = ({ className, likeCount, isLiked: likedProp, commentId }) => {
  const [isLiked, setIsLiked] = useState(likedProp)
  const [toggleReaction] = useToggleReactionMutation()

  const handleLike = async () => {
    try {
      const token = cookies.getAccessToken()
      if (!token) {
        setIsLiked(!isLiked)
        return
      }
      const decoded: { sub?: string } = jwtDecode(token)
      const userId = decoded?.sub
      if (!userId) {
        setIsLiked(!isLiked)
        return
      }

      setIsLiked(!isLiked)
      await toggleReaction({
        userId,
        reactableId: commentId,
        reactableType: 'comment',
        reactionType: 'like',
      }).unwrap()
    } catch {
      setIsLiked(isLiked)
    }
  }

  return (
    <button
      className={clsx(
        'comment-like-btn group flex h-8 items-center rounded-full ps-2 pe-3 text-xs leading-none transition-colors',
        className,
        isLiked
          ? 'bg-rose-50 text-rose-600 dark:bg-rose-100'
          : 'bg-neutral-50 text-neutral-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-rose-500'
      )}
      onClick={handleLike}
    >
      <HeartIcon className="size-5" fill={isLiked ? 'currentColor' : 'none'} />
      <span className={clsx('ms-1', isLiked ? 'text-rose-600' : '')}>
        {convertNumbThousand(isLiked ? likeCount + 1 : likeCount)}
      </span>
    </button>
  )
}

export default CommentLikeBtn
