import { fetchCategories, buildCategoryTree, type ApiCategory } from '@/utils/serverApi'

// ============ TYPE =============
export type TNavigationItem = {
  id: string
  href: string
  name: string
  children?: TNavigationItem[]
}

/**
 * CNN-style navigation — returns only parent categories as flat links.
 * Used on the homepage header.
 */
export async function getParentNavigation(locale?: string): Promise<TNavigationItem[]> {
  try {
    const categories = await fetchCategories(locale)
    const tree = buildCategoryTree(categories)
      const categoryNav: TNavigationItem[] = tree.map((cat) => ({
      id: String(cat.id),
      href: `/category/${cat.slug}`,
        name: cat.name,
      children: (cat.children || []).map((sub) => ({
        id: String(sub.id),
        href: `/category/${sub.slug}`,
          name: sub.name,
      })),
    }))

    // Static E-Magazine link appended after categories
    const eMagazineItem: TNavigationItem = {
      id: 'e-magazine',
      href: '/e-magazine',
        name: locale === 'ur' ? 'ای-میگزین' : 'E-Magazine',
    }

    return [...categoryNav, eMagazineItem]
  } catch {
    return []
  }
}

/**
 * CNN-style sub-navigation — returns children of a given parent slug.
 * Used on category pages to show subcategory links in the nav bar.
 */
export async function getSubNavigation(
  parentSlug: string,
  locale?: string,
): Promise<{ parent: TNavigationItem; children: TNavigationItem[] } | null> {
  try {
    const categories = await fetchCategories(locale)
    const tree = buildCategoryTree(categories)

    // Find the parent category that matches the slug (could be the parent itself or a child)
    const parentCat = tree.find((cat) => cat.slug === parentSlug)
    if (parentCat) {
      return {
        parent: {
          id: String(parentCat.id),
          href: `/category/${parentCat.slug}`,
          name: parentCat.name,
        },
        children: (parentCat.children || []).map((sub) => ({
          id: String(sub.id),
          href: `/category/${sub.slug}`,
          name: sub.name,
        })),
      }
    }

    // Check if slug is a subcategory — find its parent
    for (const cat of tree) {
      const child = (cat.children || []).find((sub) => sub.slug === parentSlug)
      if (child) {
        return {
          parent: {
            id: String(cat.id),
            href: `/category/${cat.slug}`,
            name: cat.name,
          },
          children: (cat.children || []).map((sub) => ({
            id: String(sub.id),
            href: `/category/${sub.slug}`,
            name: sub.name,
          })),
        }
      }
    }

    return null
  } catch {
    return null
  }
}
