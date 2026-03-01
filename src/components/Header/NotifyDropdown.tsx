'use client'

import ButtonCircle from '@/shared/ButtonCircle'
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Notification02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@/i18n/navigation'
import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useGetNotificationsByUserQuery, useMarkNotificationAsReadMutation } from '@/app/redux/api/notifications/notificationsApi'
import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import { BellIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline'

interface Props {
  className?: string
}

const NotifyDropdown: FC<Props> = ({ className = '' }) => {
  const t = useTranslations('common')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const token = cookies.getAccessToken()
    if (token) {
      try {
        const decoded: { sub?: string } = jwtDecode(token)
        setUserId(decoded?.sub || '')
      } catch { /* ignore */ }
    }
  }, [])

  const { data: notifications } = useGetNotificationsByUserQuery(userId, { skip: !userId })
  const [markAsRead] = useMarkNotificationAsReadMutation()

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0
  const displayNotifications = notifications?.slice(0, 5) ?? []

  const formatTime = (date: Date | string) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id)
    }
  }

  return (
    <Popover className={className}>
      <>
        <PopoverButton as={ButtonCircle} aria-label="Notifications" className="relative" color="light" plain>
          {unreadCount > 0 && (
            <span className="absolute end-0 top-px flex size-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <HugeiconsIcon icon={Notification02Icon} size={24} />
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-sm rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative grid gap-6 bg-white p-6 dark:bg-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                {t('noNewNotifications').replace('No new n', 'N').replace('otifications', 'otifications')}
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {unreadCount} new
                </span>
              )}
            </div>

            {displayNotifications.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <BellIcon className="mb-3 size-10 text-neutral-300 dark:text-neutral-600" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('noNewNotifications')}
                </p>
              </div>
            ) : (
              <>
                {displayNotifications.map((notification) => (
                  <CloseButton
                    as={Link}
                    key={notification.id}
                    href="/dashboard/notifications"
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                    className="relative -m-2 flex items-start gap-3 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${notification.isRead ? 'bg-neutral-100 dark:bg-neutral-700' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      {notification.isRead ? (
                        <EnvelopeOpenIcon className="size-4 text-neutral-500 dark:text-neutral-400" />
                      ) : (
                        <BellIcon className="size-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'font-medium text-gray-900 dark:text-gray-200'}`}>
                        {notification.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-500"></span>
                    )}
                  </CloseButton>
                ))}
                {(notifications?.length ?? 0) > 5 && (
                  <CloseButton
                    as={Link}
                    href="/dashboard/notifications"
                    className="block rounded-lg py-2 text-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View all notifications
                  </CloseButton>
                )}
              </>
            )}
          </div>
        </PopoverPanel>
      </>
    </Popover>
  )
}

export default NotifyDropdown
