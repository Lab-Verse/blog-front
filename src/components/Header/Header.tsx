import { getParentNavigation, getSubNavigation, TNavigationItem } from '@/data/navigation'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import HeaderAuthButtons from './HeaderAuthButtons'

interface HeaderProps {
  bottomBorder?: boolean
  className?: string
  /** When set, renders CNN-style category header with subcategories */
  activeCategory?: string
}

const Header: FC<HeaderProps> = async ({ bottomBorder, className, activeCategory }) => {
  const subNav = activeCategory ? await getSubNavigation(activeCategory) : null
  const parentNav = await getParentNavigation()

  const isSubNavMode = subNav && subNav.children.length > 0

  return (
    <div className={clsx('relative z-20', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-16 items-center gap-x-4 border-neutral-200 dark:border-neutral-700',
            bottomBorder && 'border-b'
          )}
        >
          {/* Logo */}
          <Logo />

          {/* CNN-style: parent category label */}
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center justify-center overflow-x-auto">
            <ul className="flex items-center gap-x-1">
              {isSubNavMode
                ? subNav.children.map((item) => (
                    <NavLink key={item.id} item={item} isActive={item.href === `/category/${activeCategory}`} />
                  ))
                : parentNav.map((item) => <NavLink key={item.id} item={item} />)}
            </ul>
          </nav>

          {/* Right: Auth buttons + Hamburger */}
          <div className="ms-auto flex items-center justify-end gap-x-1 lg:ms-0">
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

function NavLink({ item, isActive }: { item: TNavigationItem; isActive?: boolean }) {
  return (
    <li>
      <Link
        href={item.href || '#'}
        className={clsx(
          'block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
          isActive
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
        )}
      >
        {item.name}
      </Link>
    </li>
  )
}

export default Header
