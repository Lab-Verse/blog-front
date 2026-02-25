import { CustomLink } from '@/data/types'
import { fetchCategories } from '@/utils/serverApi'
import Logo from '@/shared/Logo'
import SocialsList1 from '@/shared/SocialsList1'
import React from 'react'

export interface WidgetFooterMenu {
  id: string
  title: string
  menus: CustomLink[]
}

const staticMenus: WidgetFooterMenu[] = [
  {
    id: '1',
    title: 'Quick Links',
    menus: [
      { href: '/', label: 'Home' },
      { href: '/search', label: 'Search' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    id: '2',
    title: 'Account',
    menus: [
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'Sign Up' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/dashboard/posts', label: 'My Posts' },
      { href: '/submission', label: 'Write a Post' },
    ],
  },
  {
    id: '3',
    title: 'Legal',
    menus: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' },
      { href: '/cookie-policy', label: 'Cookie Policy' },
    ],
  },
]

const Footer: React.FC = async () => {
  let categoryMenus: WidgetFooterMenu[] = []
  try {
    const categories = await fetchCategories()
    const topCategories = categories
      .filter((c) => !c.parent_id)
      .slice(0, 6)
    if (topCategories.length > 0) {
      categoryMenus = [
        {
          id: 'cats',
          title: 'Categories',
          menus: topCategories.map((c) => ({
            href: `/category/${c.slug}`,
            label: c.name,
          })),
        },
      ]
    }
  } catch {
    // Categories unavailable, skip
  }

  const widgetMenus = [...categoryMenus, ...staticMenus]
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">{menu.title}</h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                key={index}
                className="text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <>
      {/* footer */}
      <div className="nc-Footer relative border-t border-neutral-200 py-16 lg:py-28 dark:border-neutral-700">
        <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
          <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:flex lg:flex-col lg:md:col-span-1">
            <div className="col-span-2 md:col-span-1">
              <Logo size="size-10" />
            </div>
            <div className="col-span-2 flex items-center md:col-span-3">
              <SocialsList1 />
            </div>
          </div>
          {widgetMenus.map(renderWidgetMenuItem)}
        </div>
      </div>
    </>
  )
}

export default Footer
