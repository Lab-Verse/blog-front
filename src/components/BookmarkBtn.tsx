'use client'

import { useGetBookmarksByUserQuery, useToggleBookmarkMutation } from '@/app/redux/api/bookmarks/bookmarksApi'
import { cookies } from '@/app/redux/utils/cookies'
import { Bookmark02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { FC, useMemo } from 'react'

interface Props {
  className?: string
  bookmarked?: boolean
  postId?: string
}

const BookmarkBtn: FC<Props> = ({ className, bookmarked, postId }) => {
  const router = useRouter()
  const token = cookies.getAccessToken()
  const userId = useMemo(() => {
    if (!token) return ''
    try {
      const decoded: any = jwtDecode(token)
      return decoded?.sub || ''
    } catch { return '' }
  }, [token])

  const { data: bookmarks } = useGetBookmarksByUserQuery(userId, { skip: !userId })
  const [toggleBookmark] = useToggleBookmarkMutation()

  const existingBookmark = useMemo(() => {
    if (!bookmarks || !postId) return undefined
    return bookmarks.find((b: any) => b.post_id === postId)
  }, [bookmarks, postId])

  const isBookmarked = existingBookmark ? true : (bookmarked ?? false)

  const handleBookmark = async () => {
    if (!postId) return

    if (!token || !userId) {
      router.push('/login')
      return
    }

    try {
      await toggleBookmark({
        userId,
        postId,
        bookmarkId: existingBookmark?.id,
      }).unwrap()
    } catch {
      // Error handled by RTK Query
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
