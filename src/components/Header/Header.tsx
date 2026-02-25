import { getNavigation } from '@/data/navigation'
import { getAllPosts } from '@/data/posts'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import { FC } from 'react'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import HeaderAuthButtons from './HeaderAuthButtons'
import Navigation from './Navigation/Navigation'

interface HeaderProps {
  bottomBorder?: boolean
  className?: string
}

const Header: FC<HeaderProps> = async ({ bottomBorder, className }) => {
  const navItems = await getNavigation()
  const featuredPosts = (await getAllPosts()).slice(0, 2)

  return (
    <div className={clsx('relative z-20', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-20 items-center gap-x-3 border-neutral-200 dark:border-neutral-700',
            bottomBorder && 'border-b',
            !bottomBorder && 'has-[.header-popover-full-panel]:border-b'
          )}
        >
          {/* Logo */}
          <Logo />

          {/* Navigation links (desktop only) - all parent categories */}
          <nav className="hidden lg:flex flex-1 items-center justify-center">
            <Navigation menu={navItems} featuredPosts={featuredPosts} />
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

export default Header
