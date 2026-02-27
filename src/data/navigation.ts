import { fetchCategories, buildCategoryTree, type ApiCategory } from '@/utils/serverApi'

/**
 * Build navigation dynamically from API categories.
 * Parent categories become top-level nav items.
 * Their children appear in mega-menu / dropdown format.
 */
export async function getNavigation(): Promise<TNavigationItem[]> {
  try {
    const categories = await fetchCategories()
    const tree = buildCategoryTree(categories)
    return buildNavigationFromCategories(tree, categories)
  } catch {
    // Fallback navigation if API is unavailable
    return getFallbackNavigation()
  }
}

/**
 * Returns { visible, overflow } split of navigation items.
 * `visible` = parent categories with children (shown inline with mega-menus)
 * `overflow` = standalone categories without children (shown in "More" dropdown)
 */
export async function getSplitNavigation(): Promise<{
  visible: TNavigationItem[]
  overflow: TNavigationItem[]
}> {
  const nav = await getNavigation()
  const visible = nav.filter((item) => item.type === 'mega-menu')
  const overflow = nav.filter((item) => !item.type)
  return { visible, overflow }
}

function buildNavigationFromCategories(
  tree: (ApiCategory & { children?: ApiCategory[] })[],
  allCategories: ApiCategory[]
): TNavigationItem[] {
  const nav: TNavigationItem[] = []

  // Parent categories with subcategories as mega-menu, plain categories as links
  const parentCats = tree.filter((c) => c.children && c.children.length > 0)
  const standaloneCats = tree.filter((c) => !c.children || c.children.length === 0)

  // Add parent categories with mega-menu showing sub-categories
  for (const parent of parentCats) {
    const megaChildren: TNavigationItem[] = []

    // Split subcategories into columns of up to 7
    const subs = parent.children || []
    const colSize = Math.ceil(subs.length / 4) || 7
    for (let i = 0; i < Math.min(4, Math.ceil(subs.length / colSize)); i++) {
      const chunk = subs.slice(i * colSize, (i + 1) * colSize)
      megaChildren.push({
        id: `${parent.id}-col-${i}`,
        href: '#',
        name: i === 0 ? parent.name : '',
        children: chunk.map((sub) => ({
          id: String(sub.id),
          href: `/category/${sub.slug}`,
          name: sub.name,
        })),
      })
    }

    nav.push({
      id: String(parent.id),
      href: `/category/${parent.slug}`,
      name: parent.name,
      type: subs.length > 0 ? 'mega-menu' : undefined,
      children: subs.length > 0 ? megaChildren : undefined,
    })
  }

  // Add standalone categories as simple nav links
  for (const cat of standaloneCats) {
    nav.push({
      id: String(cat.id),
      href: `/category/${cat.slug}`,
      name: cat.name,
    })
  }

  return nav
}

function getFallbackNavigation(): TNavigationItem[] {
  return [
    { id: 'search', href: '/search', name: 'Search' },
  ]
}

export async function getNavMegaMenu(): Promise<TNavigationItem> {
  const navigation = await getNavigation()
  return navigation.find((item) => item.type === 'mega-menu') || {}
}

// ============ TYPE =============
export type TNavigationItem = Partial<{
  id: string
  href: string
  name: string
  type?: 'dropdown' | 'mega-menu'
  isNew?: boolean
  children?: TNavigationItem[]
}>



