'use client'

import { TNavigationItem } from '@/data/navigation'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SocialsList from '@/shared/SocialsList'
import SwitchDarkMode from '@/shared/SwitchDarkMode'
import { Disclosure, DisclosureButton, DisclosurePanel, useClose } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
  data: TNavigationItem[]
}

const SidebarNavigation: React.FC<Props> = ({ data }) => {
  const handleClose = useClose()

  const _renderItem = (menu: TNavigationItem, index: number) => {
    const hasChildren = menu.children && menu.children.length > 0

    return (
      <Disclosure key={index} as="li" className="text-neutral-900 dark:text-white">
        <div className="flex w-full items-center rounded-lg px-3 text-start text-sm font-medium tracking-wide uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Link
            href={menu.href || '#'}
            className={clsx(!hasChildren && 'flex-1', 'block py-2.5')}
            onClick={handleClose}
          >
            {menu.name}
          </Link>
          {hasChildren && (
            <DisclosureButton className="flex flex-1 cursor-pointer justify-end py-2.5">
              <ChevronDownIcon className="ms-2 h-4 w-4 text-neutral-500" aria-hidden="true" />
            </DisclosureButton>
          )}
        </div>
        {hasChildren && (
          <DisclosurePanel>
            <ul className="ps-6 pb-1 text-base">
              {menu.children!.map((child, childIndex) => (
                <li key={childIndex}>
                  <Link
                    href={child.href || '#'}
                    onClick={handleClose}
                    className="mt-0.5 flex rounded-lg px-3 py-2 text-sm font-normal text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </DisclosurePanel>
        )}
      </Disclosure>
    )
  }

  const renderSearchForm = () => {
    return (
      <form
        action="#"
        method="POST"
        className="flex-1 text-neutral-900 dark:text-neutral-200"
        onSubmit={(e) => {
          e.preventDefault()
          handleClose()
          redirect('/search')
        }}
      >
        <div className="flex h-full items-center gap-x-2.5 rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-800">
          <HugeiconsIcon icon={Search01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Type and press enter"
            className="w-full border-none bg-transparent focus:ring-0 focus:outline-hidden sm:text-sm"
          />
        </div>
        <input type="submit" hidden value="" />
      </form>
    )
  }

  return (
    <div>
      <p className="text-sm/relaxed">
        Discover the most outstanding articles on all topics of life. Write your stories and share them
      </p>
      <div className="mt-5 flex items-center justify-between">
        <SocialsList />
      </div>
      <div className="mt-5">{renderSearchForm()}</div>
      <ul className="flex flex-col gap-y-1 px-2 py-6">{data?.map(_renderItem)}</ul>
      <Divider className="mb-6" />

      <div className="flex items-center justify-end py-6">
        <SwitchDarkMode />
      </div>
    </div>
  )
}

export default SidebarNavigation
