import { getParentNavigation, getSubNavigation, TNavigationItem } from '@/data/navigation'
import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { FC } from 'react'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import HeaderAuthButtons from './HeaderAuthButtons'
import ResponsiveNav from './ResponsiveNav'

interface HeaderProps {
  bottomBorder?: boolean
  className?: string
  /** When set, renders CNN-style category header with subcategories */
  activeCategory?: string
}

const Header: FC<HeaderProps> = async ({ bottomBorder, className, activeCategory }) => {
  let subNav: Awaited<ReturnType<typeof getSubNavigation>> = null
  let parentNav: TNavigationItem[] = []

  try {
    const [subNavResult, parentNavResult] = await Promise.all([
      activeCategory ? getSubNavigation(activeCategory) : Promise.resolve(null),
      getParentNavigation(),
    ])
    subNav = subNavResult
    parentNav = parentNavResult
  } catch {
    subNav = null
    parentNav = []
  }

  const isSubNavMode = subNav !== null && subNav.children.length > 0

  const navItems = isSubNavMode ? subNav!.children : parentNav
  const activeHref = isSubNavMode ? `/category/${activeCategory}` : undefined

  return (
    <div className={clsx('relative z-20 bg-white/80 backdrop-blur-md shadow-sm dark:bg-neutral-900/90', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-16 items-center gap-x-4 border-neutral-200 dark:border-neutral-700',
            bottomBorder && 'border-b'
          )}
        >
          {/* Logo */}
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

          {/* CNN-style: parent category label */}
          {isSubNavMode && subNav && (
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
            <div className="ms-2.5 flex lg:hidden">
              <HamburgerBtnMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
