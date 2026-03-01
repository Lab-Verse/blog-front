'use client'

import { cookies } from '@/app/redux/utils/cookies'
import { useGetBookmarksByUserQuery, useDeleteBookmarkMutation } from '@/app/redux/api/bookmarks/bookmarksApi'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { TrashIcon, BookmarkIcon } from '@heroicons/react/24/outline'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const Page = () => {
  const t = useTranslations('bookmarks')
  const [userId, setUserId] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const token = cookies.getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const decoded: { sub?: string } = jwtDecode(token)
      setUserId(decoded?.sub || '')
    } catch {
      router.push('/login')
    }
  }, [router])

  const { data: bookmarks, isLoading, error } = useGetBookmarksByUserQuery(userId, { skip: !userId })
  const [deleteBookmark] = useDeleteBookmarkMutation()

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      await deleteBookmark(bookmarkId).unwrap()
      toast.success(t('bookmarkRemoved'))
    } catch {
      toast.error(t('failedRemoveBookmark'))
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getImageUrl = (image?: string) => {
    if (!image) return '/images/placeholder.png'
    if (image.startsWith('http')) return image
    return `${API_URL}/${image}`
  }

  if (!userId) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('myBookmarks')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('myBookmarksDescription')}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="aspect-video rounded-xl bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-4 h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{t('failedRemoveBookmark')}</p>
        </div>
      ) : !bookmarks || bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <BookmarkIcon className="mb-4 size-16 text-neutral-300 dark:text-neutral-600" />
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            {t('noBookmarks')}
          </h3>
          <p className="mt-2 max-w-sm text-neutral-500 dark:text-neutral-400">
            {t('noBookmarksHint')}
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t('browseArticles')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => {
            const post = bookmark.post
            if (!post) return null

            return (
              <div
                key={bookmark.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
              >
                <Link href={`/post/${post.slug}`} className="block">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    {post.category && (
                      <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {post.category.name}
                      </span>
                    )}
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {t('savedOn', { date: formatDate(bookmark.created_at) })}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-neutral-500 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:bg-neutral-800/80 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  title={t('removeBookmark')}
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Page
