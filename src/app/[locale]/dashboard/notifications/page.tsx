'use client'

import { cookies } from '@/app/redux/utils/cookies'
import {
  useGetNotificationsByUserQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} from '@/app/redux/api/notifications/notificationsApi'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  EnvelopeOpenIcon,
} from '@heroicons/react/24/outline'

type Filter = 'all' | 'unread' | 'read'

const Page = () => {
  const t = useTranslations('notifications')
  const [userId, setUserId] = useState<string>('')
  const [filter, setFilter] = useState<Filter>('all')
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

  const { data: notifications, isLoading } = useGetNotificationsByUserQuery(userId, { skip: !userId })
  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [markAllAsRead] = useMarkAllAsReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()
  const [clearAll] = useClearAllNotificationsMutation()

  const filtered = useMemo(() => {
    if (!notifications) return []
    if (filter === 'unread') return notifications.filter((n) => !n.isRead)
    if (filter === 'read') return notifications.filter((n) => n.isRead)
    return notifications
  }, [notifications, filter])

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0

  const handleMarkAllRead = async () => {
    if (!userId) return
    try {
      await markAllAsRead(userId).unwrap()
      toast.success(t('markAllRead'))
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap()
      toast.success(t('deleteNotification'))
    } catch { /* ignore */ }
  }

  const handleClearAll = async () => {
    if (!userId) return
    try {
      await clearAll(userId).unwrap()
      toast.success('All notifications cleared')
    } catch { /* ignore */ }
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const diff = Date.now() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (!userId) return null

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('allNotifications') },
    { key: 'unread', label: t('unread') },
    { key: 'read', label: t('read') },
  ]

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('notifications')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('notificationsDescription')}
          </p>
        </div>
        {notifications && notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <CheckIcon className="size-4" />
                {t('markAllRead')}
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <TrashIcon className="size-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            {label}
            {key === 'unread' && unreadCount > 0 && (
              <span className="ms-1.5 inline-flex size-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <BellIcon className="mb-4 size-16 text-neutral-300 dark:text-neutral-600" />
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            {t('noNotifications')}
          </h3>
          <p className="mt-2 max-w-sm text-neutral-500 dark:text-neutral-400">
            {t('noNotificationsHint')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notification) => (
            <div
              key={notification.id}
              className={`group flex items-start gap-4 rounded-2xl border p-5 transition-colors ${
                notification.isRead
                  ? 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
                  : 'border-blue-200 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-900/10'
              }`}
            >
              <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${
                notification.isRead
                  ? 'bg-neutral-100 dark:bg-neutral-800'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {notification.isRead ? (
                  <EnvelopeOpenIcon className="size-5 text-neutral-500 dark:text-neutral-400" />
                ) : (
                  <BellIcon className="size-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm ${notification.isRead ? 'text-neutral-600 dark:text-neutral-400' : 'font-semibold text-neutral-900 dark:text-neutral-100'}`}>
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
                        title={t('markRead')}
                      >
                        <CheckIcon className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title={t('deleteNotification')}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {!notification.isRead && (
                <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
