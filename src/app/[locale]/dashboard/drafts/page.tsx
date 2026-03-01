'use client'

import { cookies } from '@/app/redux/utils/cookies'
import {
  useGetDraftsByUserQuery,
  useDeleteDraftMutation,
} from '@/app/redux/api/drafts/draftsApi'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

const Page = () => {
  const t = useTranslations('drafts')
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

  const { data: drafts, isLoading } = useGetDraftsByUserQuery(userId, { skip: !userId })
  const [deleteDraft] = useDeleteDraftMutation()

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteDraftConfirm'))) return
    try {
      await deleteDraft(id).unwrap()
      toast.success(t('draftDeleted'))
    } catch {
      toast.error(t('failedDeleteDraft'))
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getExcerpt = (content: string | null, maxLen = 140) => {
    if (!content) return 'No content yet...'
    const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    if (text.length <= maxLen) return text
    return text.slice(0, maxLen) + '...'
  }

  if (!userId) return null

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('myDrafts')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('myDraftsDescription')}
          </p>
        </div>
        <Link
          href="/dashboard/submit-post"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PencilSquareIcon className="size-4" />
          {t('startWriting')}
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-3 h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-4 h-3 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          ))}
        </div>
      ) : !drafts || drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <DocumentDuplicateIcon className="mb-4 size-16 text-neutral-300 dark:text-neutral-600" />
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            {t('noDrafts')}
          </h3>
          <p className="mt-2 max-w-sm text-neutral-500 dark:text-neutral-400">
            {t('noDraftsHint')}
          </p>
          <Link
            href="/dashboard/submit-post"
            className="mt-6 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <PencilSquareIcon className="size-4" />
            {t('startWriting')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {draft.title || 'Untitled Draft'}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {getExcerpt(draft.content)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {draft.category && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {draft.category.name}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {t('lastEdited', { date: formatDate(draft.updated_at) })}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/dashboard/submit-post?draftId=${draft.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <PencilSquareIcon className="size-4" />
                    {t('continueDraft')}
                  </Link>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    title={t('deleteDraft')}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
