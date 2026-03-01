import { CustomLink } from '@/data/types'
import { fetchCategories } from '@/utils/serverApi'
import Logo from '@/shared/Logo'
import SocialsList1 from '@/shared/SocialsList1'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export interface WidgetFooterMenu {
  id: string
  title: string
  menus: CustomLink[]
}

interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  parent_id?: string | null
  children: CategoryWithChildren[]
}

function buildCategoryTree(categories: any[]): CategoryWithChildren[] {
  const map = new Map<string, CategoryWithChildren>()
  const roots: CategoryWithChildren[] = []

  // Create nodes
  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] })
  }

  // Build tree
  for (const cat of categories) {
    const node = map.get(cat.id)!
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

const Footer: React.FC = async () => {
  const t = await getTranslations('footer')
  let categoryTree: CategoryWithChildren[] = []
  try {
    const categories = await fetchCategories()
    categoryTree = buildCategoryTree(categories)
  } catch {
    // Categories unavailable, skip
  }

  // Build category menus: each parent becomes a column with its children
  const categoryMenus: WidgetFooterMenu[] = []

  if (categoryTree.length > 0) {
    // Parents with children get their own column
    const parentsWithChildren = categoryTree.filter(c => c.children.length > 0).slice(0, 3)
    for (const parent of parentsWithChildren) {
      categoryMenus.push({
        id: `cat-${parent.id}`,
        title: parent.name,
        menus: [
          { href: `/category/${parent.slug}`, label: t('allCategory', { name: parent.name }) },
          ...parent.children.slice(0, 6).map(child => ({
            href: `/category/${child.slug}`,
            label: child.name,
          })),
        ],
      })
    }

    // If there are standalone categories (no children), group them
    const standalone = categoryTree.filter(c => c.children.length === 0).slice(0, 8)
    if (standalone.length > 0) {
      categoryMenus.push({
        id: 'cats-other',
        title: t('categories'),
        menus: standalone.map(c => ({
          href: `/category/${c.slug}`,
          label: c.name,
        })),
      })
    }
  }

  const staticMenus: WidgetFooterMenu[] = [
    {
      id: '1',
      title: t('quickLinks'),
      menus: [
        { href: '/', label: t('home') },
        { href: '/search', label: t('search') },
        { href: '/about', label: t('aboutUs') },
        { href: '/contact', label: t('contact') },
        { href: '/leadership', label: t('leadership') },
      ],
    },
    {
      id: '2',
      title: t('account'),
      menus: [
        { href: '/login', label: t('login') },
        { href: '/signup', label: t('signUp') },
        { href: '/dashboard', label: t('dashboard') },
        { href: '/dashboard/posts', label: t('myPosts') },
        { href: '/submission', label: t('writeAPost') },
      ],
    },
    {
      id: '3',
      title: t('legal'),
      menus: [
        { href: '/privacy-policy', label: t('privacyPolicy') },
        { href: '/terms-of-service', label: t('termsOfService') },
        { href: '/cookie-policy', label: t('cookiePolicy') },
      ],
    },
  ]

  const widgetMenus = [...categoryMenus, ...staticMenus]

  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">{menu.title}</h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, i) => (
            <li key={i}>
              <Link
                className="text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <footer className="nc-Footer relative border-t border-neutral-200 dark:border-neutral-700">
      <div className="container py-16 lg:py-28">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
          {/* Logo + tagline + socials */}
          <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:flex lg:flex-col lg:md:col-span-1">
            <div className="col-span-2 md:col-span-1">
              <Logo />
            </div>
            <div className="col-span-2 md:col-span-3 lg:mt-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t('tagline')}
              </p>
              <div className="mt-4">
                <SocialsList1 />
              </div>
            </div>
          </div>

          {/* Menu columns */}
          {widgetMenus.map(renderWidgetMenuItem)}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-neutral-200 dark:border-neutral-700">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-x-6 text-sm text-neutral-500 dark:text-neutral-400">
            <Link href="/privacy-policy" className="hover:text-neutral-700 dark:hover:text-neutral-200">{t('privacy')}</Link>
            <Link href="/terms-of-service" className="hover:text-neutral-700 dark:hover:text-neutral-200">{t('terms')}</Link>
            <Link href="/contact" className="hover:text-neutral-700 dark:hover:text-neutral-200">{t('contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
