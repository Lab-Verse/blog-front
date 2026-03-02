import { getParentNavigation, getSubNavigation, TNavigationItem } from '@/data/navigation'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { FC } from 'react'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import HeaderAuthButtons from './HeaderAuthButtons'
import ResponsiveNav from './ResponsiveNav'

interface Props {
  bottomBorder?: boolean
  className?: string
  /** When set, renders CNN-style category header with subcategories */
  activeCategory?: string
}

const Header2: FC<Props> = async ({ bottomBorder, className, activeCategory }) => {
  // If on a category page, load subcategories for that category
  const subNav = activeCategory ? await getSubNavigation(activeCategory) : null
  // Always load parent categories for homepage / fallback
  const parentNav = await getParentNavigation()

  const isSubNavMode = subNav && subNav.children.length > 0

  // Determine which items and which active href
  const navItems = isSubNavMode ? subNav.children : parentNav
  const activeHref = isSubNavMode ? `/category/${activeCategory}` : undefined

  return (
    <div
      className={clsx(
        'header-2 relative z-20 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
        bottomBorder && 'border-b',
        className
      )}
    >
      <div className="container flex h-16 items-center gap-x-4">
        {/* Logo — always visible */}
        <Link href="/" className="inline-flex shrink-0 items-center">
          <Image
            src="/images/twa-logo.png"
            alt="TWA - The World Ambassador"
            width={200}
            height={60}
            className="h-8 w-auto sm:h-10 dark:invert"
            priority
          />
        </Link>

        {/* CNN-style: parent category label next to logo on category pages */}
        {isSubNavMode && (
          <>
            <div className="hidden lg:block h-6 w-px bg-neutral-300 dark:bg-neutral-600" />
            <Link
              href={subNav.parent.href}
              className="hidden lg:block text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400 whitespace-nowrap"
            >
              {subNav.parent.name}
            </Link>
          </>
        )}

        {/* Desktop Navigation — responsive overflow */}
        <nav className="hidden lg:flex flex-1 items-center justify-center min-w-0">
          <ResponsiveNav items={navItems} activeHref={activeHref} />
        </nav>

        {/* Right: Auth buttons + Hamburger */}
        <div className="ms-auto flex items-center justify-end gap-x-1 lg:ms-0 shrink-0">
          <HeaderAuthButtons />
          <div className="ms-2 flex lg:hidden">
            <HamburgerBtnMenu />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header2
