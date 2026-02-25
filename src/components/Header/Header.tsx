import { getSplitNavigation } from '@/data/navigation'
import { getAllPosts } from '@/data/posts'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import { FC } from 'react'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import HeaderAuthButtons from './HeaderAuthButtons'
import Navigation from './Navigation/Navigation'
import MoreDropdown from './MoreDropdown'
import SearchModal from './SearchModal'

interface HeaderProps {
  bottomBorder?: boolean
  className?: string
}

const Header: FC<HeaderProps> = async ({ bottomBorder, className }) => {
  const { visible, overflow } = await getSplitNavigation()
  const featuredPosts = (await getAllPosts()).slice(0, 2)

  return (
    <div className={clsx('relative z-20', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-20 justify-between gap-x-2.5 border-neutral-200 dark:border-neutral-700',
            bottomBorder && 'border-b',
            !bottomBorder && 'has-[.header-popover-full-panel]:border-b'
          )}
        >
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <Logo />
            <div className="h-8 border-l hidden sm:block"></div>
            <div className="max-w-xs hidden sm:block md:w-48 xl:w-60">
              <SearchModal type="type2" />
            </div>
          </div>

          {/* Center: Navigation links (desktop only) */}
          <div className="hidden lg:flex items-center overflow-hidden">
            <Navigation menu={visible} featuredPosts={featuredPosts} />
            {overflow.length > 0 && <MoreDropdown items={overflow} />}
          </div>

          {/* Right: Auth buttons + Hamburger */}
          <div className="ms-auto flex items-center justify-end gap-x-1">
            {/* Mobile search */}
            <div className="sm:hidden">
              <SearchModal type="type2" />
            </div>
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
