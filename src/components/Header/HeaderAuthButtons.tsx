'use client'

import { cookies } from '@/app/redux/utils/cookies'
import { useGetUserProfileQuery } from '@/app/redux/api/users/usersApi'
import Avatar from '@/shared/Avatar'
import { Button } from '@/shared/Button'
import ButtonCircle from '@/shared/ButtonCircle'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import {
  BulbChargingIcon,
  FavouriteIcon,
  Idea01Icon,
  Logout01Icon,
  PlusSignCircleIcon,
  Task01Icon,
  UserIcon,
  Notification02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { jwtDecode } from 'jwt-decode'

export default function HeaderAuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const t = useTranslations('header')

  useEffect(() => {
    const token = cookies.getAccessToken()
    setIsLoggedIn(Boolean(token))

    // Re-check periodically (e.g. after login/logout in another tab)
    const interval = setInterval(() => {
      setIsLoggedIn(Boolean(cookies.getAccessToken()))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-x-2">
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          {t('login')}
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {t('register')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-x-0.5">
      <div className="hidden sm:block">
        <Button className="h-10 px-3!" href="/submission" plain>
          <PlusIcon className="size-5!" />
          {t('create')}
        </Button>
      </div>

      {/* Notification bell */}
      <NotifyDropdown />

      {/* Avatar dropdown */}
      <AvatarMenu />
    </div>
  )
}

/* ─── Notification dropdown (inline) ─── */
function NotifyDropdown() {
  const t = useTranslations('common')
  return (
    <Popover className="me-3">
      <PopoverButton as={ButtonCircle} aria-label="Notifications" className="relative" color="light" plain>
        <span className="absolute end-0 top-px size-2.5 rounded-full bg-primary-500" />
        <HugeiconsIcon icon={Notification02Icon} size={24} />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor={{ to: 'bottom end', gap: 16 }}
        className="z-40 w-sm rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
      >
        <div className="relative grid gap-8 bg-white p-7 dark:bg-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('noNewNotifications')}</p>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

/* ─── Avatar dropdown menu (inline) ─── */
function AvatarMenu() {
  const t = useTranslations('header')
  const handleLogout = () => {
    cookies.clearAuthTokens()
    window.location.href = '/'
  }

  // Decode JWT to get userId for profile fetch
  const userId = useMemo(() => {
    try {
      const token = cookies.getAccessToken()
      if (token) {
        const decoded: { sub?: string } = jwtDecode(token)
        return decoded?.sub || ''
      }
    } catch { /* ignore */ }
    return ''
  }, [])

  const { data: userProfile } = useGetUserProfileQuery(userId, { skip: !userId })
  const avatarSrc = useMemo(() => {
    if (!userProfile) return null
    // Handle both direct object and envelope { data: ... }
    const p = (userProfile as any)?.profile_picture ?? (userProfile as any)?.data?.profile_picture ?? null
    return p || null
  }, [userProfile])

  return (
    <Popover>
      <PopoverButton as={ButtonCircle} aria-label="User menu" className="relative" plain>
        <Avatar
          alt="avatar"
          src={avatarSrc}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      </PopoverButton>

      <PopoverPanel
        transition
        anchor={{ to: 'bottom end', gap: 16 }}
        className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
      >
        <div className="relative flex flex-col gap-y-6 bg-white px-6 py-7 dark:bg-neutral-800">
          {/* My Account */}
          <Link
            href="/dashboard"
            className="-m-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
              <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium">{t('myAccount')}</p>
          </Link>

          {/* My Posts */}
          <Link
            href="/dashboard/posts"
            className="-m-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
              <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium">{t('myPosts')}</p>
          </Link>

          {/* Favorites */}
          <Link
            href="/dashboard?tab=favorites"
            className="-m-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
              <HugeiconsIcon icon={FavouriteIcon} size={24} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium">{t('favorites')}</p>
          </Link>

          {/* Create Post */}
          <Link
            href="/submission"
            className="-m-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
              <HugeiconsIcon icon={PlusSignCircleIcon} size={24} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium">{t('writeAPost')}</p>
          </Link>

          <Divider />

          {/* Dark mode */}
          <div className="-m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700">
            <div className="flex items-center">
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">{t('darkTheme')}</p>
            </div>
            <SwitchDarkMode2 />
          </div>

          {/* Help */}
          <Link
            href="#"
            className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
              <HugeiconsIcon icon={BulbChargingIcon} size={24} strokeWidth={1.5} />
            </div>
            <p className="ms-4 text-sm font-medium">{t('help')}</p>
          </Link>

          {/* Log out */}
          <button
            onClick={handleLogout}
            className="-m-3 flex items-center rounded-lg p-2 text-left transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
              <HugeiconsIcon icon={Logout01Icon} size={24} strokeWidth={1.5} />
            </div>
            <p className="ms-4 text-sm font-medium">{t('logOut')}</p>
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
