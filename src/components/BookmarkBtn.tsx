'use client'

import { useToggleBookmarkMutation } from '@/app/redux/api/bookmarks/bookmarksApi'
import { cookies } from '@/app/redux/utils/cookies'
import { Bookmark02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { jwtDecode } from 'jwt-decode'
import { FC, useState } from 'react'

interface Props {
  className?: string
  bookmarked?: boolean
  postId?: string
}

const BookmarkBtn: FC<Props> = ({ className, bookmarked, postId }) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)
  const [toggleBookmark] = useToggleBookmarkMutation()

  const handleBookmark = async () => {
    if (!postId) {
      setIsBookmarked(!isBookmarked)
      return
    }

    try {
      const token = cookies.getAccessToken()
      if (!token) {
        setIsBookmarked(!isBookmarked)
        return
      }
      const decoded: any = jwtDecode(token)
      const userId = decoded?.sub
      if (!userId) {
        setIsBookmarked(!isBookmarked)
        return
      }

      setIsBookmarked(!isBookmarked)
      await toggleBookmark({
        userId,
        postId,
      }).unwrap()
    } catch {
      setIsBookmarked(isBookmarked)
    }
  }

  return (
    <button
      className={clsx(
        'relative flex size-8 items-center justify-center rounded-full bg-neutral-50 transition-colors duration-300 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20',
        className
      )}
      title="Save to reading list"
      onClick={handleBookmark}
      type="button"
    >
      <HugeiconsIcon icon={Bookmark02Icon} size={18} strokeWidth={1.75} fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  )
}

export default BookmarkBtn
