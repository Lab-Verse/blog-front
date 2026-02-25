import { getSplitNavigation } from '@/data/navigation'
import { fetchPosts } from '@/utils/serverApi'
import { transformPosts } from '@/utils/dataTransformers'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import { FC } from 'react'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import HeaderAuthButtons from './HeaderAuthButtons'
import Navigation from './Navigation/Navigation'
import MoreDropdown from './MoreDropdown'

interface Props {
  bottomBorder?: boolean
  className?: string
}

const Header2: FC<Props> = async ({ bottomBorder, className }) => {
  const { visible, overflow } = await getSplitNavigation()

  let featuredPosts: any[] = []
  try {
    const apiPosts = await fetchPosts({ limit: 2, sortBy: 'views_count', sortOrder: 'DESC' })
    featuredPosts = transformPosts(apiPosts)
  } catch {
    featuredPosts = []
  }

  return (
    <div
      className={clsx(
        'header-2 relative z-20 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
        bottomBorder && 'border-b',
        !bottomBorder && 'has-[.header-popover-full-panel]:border-b',
        className
      )}
    >
      <div className="container flex h-20 items-center gap-x-3">
        <Logo />

        <nav className="hidden lg:flex flex-1 items-center justify-center">
          <Navigation menu={visible} featuredPosts={featuredPosts} />
          {overflow.length > 0 && <MoreDropdown items={overflow} />}
        </nav>

        <div className="ms-auto flex items-center justify-end gap-x-1 lg:ms-0">
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
