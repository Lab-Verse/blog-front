'use client'

import NotifyDropdown from '@/components/Header/NotifyDropdown'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  PhotoIcon,
  TagIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookmarkIcon,
  BellIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Image from 'next/image'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ReactNode, useEffect, useState, type ElementType } from 'react'
import { useGetUserByIdQuery } from '@/app/redux/api/users/usersApi'
import { useLogoutMutation } from '@/app/redux/api/auth/authApi'
import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import Avatar from '@/shared/Avatar'

interface NavItem {
  name: string
  href: string
  icon: ElementType
  section?: string
}

export default function Layout({ children }: { children: ReactNode }) {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const pathname = usePathname()

  const navigation: NavItem[] = [
    { name: t('dashboard'), href: '/dashboard', icon: HomeIcon, section: 'main' },
    { name: t('posts'), href: '/dashboard/posts', icon: DocumentTextIcon, section: 'main' },
    { name: t('writePost'), href: '/dashboard/submit-post', icon: PencilSquareIcon, section: 'main' },
    { name: t('media'), href: '/dashboard/media', icon: PhotoIcon, section: 'content' },
    { name: t('tags'), href: '/dashboard/tags', icon: TagIcon, section: 'content' },
    { name: t('bookmarks'), href: '/dashboard/bookmarks', icon: BookmarkIcon, section: 'content' },
    { name: t('drafts'), href: '/dashboard/drafts', icon: DocumentDuplicateIcon, section: 'content' },
    { name: t('notifications'), href: '/dashboard/notifications', icon: BellIcon, section: 'content' },
    { name: t('settings'), href: '/dashboard/edit-profile', icon: Cog6ToothIcon, section: 'account' },
    { name: t('billing'), href: '/dashboard/billing-address', icon: CreditCardIcon, section: 'account' },
  ]
  const [userId, setUserId] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { data: user } = useGetUserByIdQuery(userId, { skip: !userId })
  const [logoutMutation] = useLogoutMutation()

  const profilePic =
    user?.avatar && user.avatar !== 'default-avatar.png'
      ? user.avatar
      : '/images/musicWave.png'

  const accessToken = cookies.getAccessToken()

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded: { sub?: string } = jwtDecode(accessToken)
        setUserId(decoded?.sub || '')
      } catch {
        setUserId('')
      }
    }
  }, [accessToken])

  const handleSignOut = async () => {
    const refreshToken = cookies.getRefreshToken()
    try {
      await logoutMutation(refreshToken ? { refreshToken } : undefined).unwrap()
    } catch {
      // Even if backend logout fails, still clear local state
    }
    cookies.clearAuthTokens()
    router.push('/login')
  }

  const isActive = (href: string) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href))
  const pageTitle = navigation.find((item) => isActive(item.href))?.name ?? 'Dashboard'

  const sectionLabels: Record<string, string> = {
    main: t('sectionMain'),
    content: t('sectionContent'),
    account: t('sectionAccount'),
  }

  const groupedNav = navigation.reduce<Record<string, NavItem[]>>((acc, item) => {
    const section = item.section || 'main'
    if (!acc[section]) acc[section] = []
    acc[section].push(item)
    return acc
  }, {})

  /* Sidebar content shared between desktop and mobile */
  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* Logo area */}
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/twa.png"
            alt="TWA"
            width={40}
            height={40}
            className="h-8 w-8 rounded"
          />
          {(!sidebarCollapsed || mobile) && (
            <span className="text-lg font-bold tracking-tight">TWA</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {Object.entries(groupedNav).map(([section, items]) => (
          <div key={section} className="mb-4">
            {(!sidebarCollapsed || mobile) && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {sectionLabels[section]}
              </p>
            )}
            {items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={mobile ? () => setSidebarOpen(false) : undefined}
                  title={sidebarCollapsed && !mobile ? item.name : undefined}
                  className={clsx(
                    active
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200',
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    sidebarCollapsed && !mobile && 'justify-center'
                  )}
                >
                  <Icon
                    className={clsx(
                      'size-5 shrink-0',
                      active
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300'
                    )}
                  />
                  {(!sidebarCollapsed || mobile) && item.name}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User profile section at bottom */}
      <div className="shrink-0 border-t border-neutral-200 p-4 dark:border-neutral-700">
        {(!sidebarCollapsed || mobile) ? (
          <div className="flex items-center gap-3">
            <Avatar alt="avatar" src={profilePic} className="size-9" width={36} height={36} sizes="36px" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.display_name || user?.username || 'Author'}</p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{user?.email || ''}</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            >
              <ArrowRightStartOnRectangleIcon className="size-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="mx-auto flex items-center justify-center rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            <ArrowRightStartOnRectangleIcon className="size-5" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-200 ease-in-out lg:hidden dark:bg-neutral-900',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="absolute right-2 top-3 z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
        <SidebarContent mobile />
      </div>

      {/* Desktop sidebar */}
      <div
        className={clsx(
          'hidden lg:flex lg:shrink-0 lg:flex-col border-r border-neutral-200 bg-white transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900',
          sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-64'
        )}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute bottom-20 -right-3 z-20 hidden lg:flex items-center justify-center size-6 rounded-full border border-neutral-200 bg-white text-neutral-400 shadow-sm hover:text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-300"
          style={{ left: sidebarCollapsed ? '60px' : '248px' }}
        >
          {sidebarCollapsed ? <ChevronRightIcon className="size-3.5" /> : <ChevronLeftIcon className="size-3.5" />}
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-neutral-200 bg-white px-4 sm:px-6 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-neutral-400 hover:text-neutral-600 lg:hidden dark:hover:text-neutral-300"
          >
            <Bars3Icon className="size-6" />
          </button>

          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{pageTitle}</h1>

          <div className="ml-auto flex items-center gap-3">
            <NotifyDropdown />
            <Dropdown>
              <DropdownButton as="button" className="rounded-full">
                <Avatar alt="avatar" src={profilePic} className="size-8" width={32} height={32} sizes="32px" />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem href="/dashboard">{t('dashboard')}</DropdownItem>
                <DropdownItem href="/dashboard/edit-profile">{t('settings')}</DropdownItem>
                <DropdownItem href="/">{t('viewSite')}</DropdownItem>
                <DropdownItem onClick={handleSignOut}>{t('signOut')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
