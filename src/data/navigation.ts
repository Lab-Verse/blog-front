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
export async function getParentNavigation(): Promise<TNavigationItem[]> {
  try {
    const categories = await fetchCategories()
    const tree = buildCategoryTree(categories)
    return tree.map((cat) => ({
      id: String(cat.id),
      href: `/category/${cat.slug}`,
      name: cat.name,
      children: (cat.children || []).map((sub) => ({
        id: String(sub.id),
        href: `/category/${sub.slug}`,
        name: sub.name,
      })),
    }))
  } catch {
    return []
  }
}

/**
 * CNN-style sub-navigation — returns children of a given parent slug.
 * Used on category pages to show subcategory links in the nav bar.
 */
export async function getSubNavigation(
  parentSlug: string
): Promise<{ parent: TNavigationItem; children: TNavigationItem[] } | null> {
  try {
    const categories = await fetchCategories()
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



