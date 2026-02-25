import { getSplitNavigation } from '@/data/navigation'
import { fetchPosts } from '@/utils/serverApi'
import { transformPosts } from '@/utils/dataTransformers'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import { FC } from 'react'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import HeaderAuthButtons from './HeaderAuthButtons'
import MoreDropdown from './MoreDropdown'
import Navigation from './Navigation/Navigation'
import SearchModal from './SearchModal'

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
      <div className="container flex h-20 justify-between">
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <Logo />
          <div className="h-8 border-l hidden sm:block"></div>
          <div className="-ms-1.5 hidden sm:block">
            <SearchModal type="type1" />
          </div>
        </div>

        <div className="mx-4 hidden flex-2 justify-center lg:flex items-center overflow-hidden">
          <Navigation menu={visible} featuredPosts={featuredPosts} />
          {overflow.length > 0 && <MoreDropdown items={overflow} />}
        </div>

        <div className="flex items-center justify-end gap-x-1">
          <div className="sm:hidden">
            <SearchModal type="type1" />
          </div>
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
