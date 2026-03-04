import BackgroundSection from '@/components/BackgroundSection'
import SectionAds from '@/components/SectionAds'
import HeroEditorial from '@/components/HeroEditorial'
import TrendingTicker from '@/components/TrendingTicker'
import SectionCategoryBlock from '@/components/SectionCategoryBlock'
import type { CategoryBlockData } from '@/components/SectionCategoryBlock'
import { fetchPosts, fetchCategories, buildCategoryTree } from '@/utils/serverApi'
import { transformPosts, transformCategories, transformCategoriesWithPosts } from '@/utils/dataTransformers'
import { Divider } from '@/shared/divider'
import JsonLd from '@/components/seo/JsonLd'
import nextDynamic from 'next/dynamic'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

// Dynamic imports for below-the-fold sections
const SectionBecomeAnAuthor = nextDynamic(() => import('@/components/SectionBecomeAnAuthor'))
const SectionPostsWithWidgets = nextDynamic(() => import('@/components/SectionPostsWithWidgets'))
const SectionSliderNewAuthors = nextDynamic(() => import('@/components/SectionSliderNewAuthors'))

export const revalidate = 60 // ISR: revalidate every 60 seconds

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twa.com.pk'

// Rotating color palette for category blocks
const CATEGORY_COLORS = ['blue', 'red', 'green', 'purple', 'teal', 'pink', 'indigo', 'yellow']
// Rotating layout variants for visual diversity
const LAYOUT_VARIANTS = ['featured', 'grid', 'list', 'spotlight', 'compact'] as const

// Limit concurrent API requests to avoid overwhelming the backend
const CONCURRENCY_LIMIT = 3

/** Execute async tasks in controlled batches to avoid overwhelming the API */
async function fetchWithConcurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<T[]> {
  const results: T[] = []
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit)
    const batchResults = await Promise.all(batch.map((fn) => fn()))
    results.push(...batchResults)
  }
  return results
}

// Categories to exclude from the home page blocks (navigation-only categories)
const EXCLUDED_CATEGORY_SLUGS = new Set(['more'])

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: SITE_URL, languages: generateAlternateLanguages('/') },
  }
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  // ── Step 1: Fetch hero/general posts + all categories in parallel ──
  const [apiPosts, apiCategories] = await Promise.all([
    fetchPosts({ limit: 100 }).catch(() => []),
    fetchCategories().catch(() => []),
  ])

  // Transform top-level data
  const posts = transformPosts(apiPosts)

  // Extract unique authors from posts
  const authorMap = new Map<string, (typeof posts)[0]['author']>()
  for (const post of posts) {
    if (post.author && !authorMap.has(post.author.id)) {
      authorMap.set(post.author.id, post.author)
    }
  }
  const authors = Array.from(authorMap.values()).map((a) => ({
    id: a.id,
    name: a.name,
    handle: a.handle,
    career: '',
    description: '',
    count: posts.filter((p) => p.author.id === a.id).length,
    joinedDate: '',
    reviewCount: 0,
    rating: 0,
    avatar: a.avatar,
    cover: { src: '/images/placeholder.png', alt: a.name, width: 1920, height: 1080 },
  }))

  // ── Step 2: Build category blocks — fetch per-parent via /posts?category= ──
  // The /posts?category=ID endpoint joins through postCategories (many-to-many)
  // and returns posts with populated category_id (pointing to child categories).
  // This lets us group posts by child category for subcategory tabs.
  const categoryTree = buildCategoryTree(apiCategories).filter(
    (parent) => !EXCLUDED_CATEGORY_SLUGS.has(parent.slug),
  )

  // Create a child category ID→name lookup for building tabs
  const childCategoryMap = new Map<string, { id: string; name: string; slug: string }>()
  for (const parent of categoryTree) {
    for (const child of parent.children ?? []) {
      childCategoryMap.set(child.id, { id: child.id, name: child.name, slug: child.slug })
    }
  }

  // Fetch posts per parent category (limit 20 for lightweight payloads)
  const parentFetchTasks = categoryTree.map(
    (parent) => () => fetchPosts({ category: parent.id, limit: 20 }),
  )

  // Execute in controlled batches of CONCURRENCY_LIMIT
  const parentPostResults = await fetchWithConcurrencyLimit(parentFetchTasks, CONCURRENCY_LIMIT)

  const categoryBlocksData: CategoryBlockData[] = categoryTree.map((parent, idx) => {
    const allPosts = parentPostResults[idx]
    const children = parent.children ?? []

    // Group fetched posts into child buckets by category_id
    // (category_id points to the post's child category from WordPress import)
    const tabs = children
      .map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        posts: transformPosts(allPosts.filter((p) => p.category_id === child.id)),
      }))
      .filter((tab) => tab.posts.length > 0)

    const parentTransformed = transformPosts(allPosts)

    return {
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      // Use child tabs if available; fall back to a single parent tab
      tabs:
        tabs.length > 0
          ? tabs
          : [{ id: parent.id, name: parent.name, slug: parent.slug, posts: parentTransformed }],
      // Pass all posts (including those not matching any child) for a richer "All" tab
      allPosts: parentTransformed,
    } satisfies CategoryBlockData
  })

  // Filter out categories with no posts at all
  const categoryBlocksRaw = categoryBlocksData.filter((block) =>
    block.tabs.some((tab) => tab.posts.length > 0),
  )

  // Ensure Embassy & Consulates appears right after Pakistan
  const pakistanIdx = categoryBlocksRaw.findIndex((b) => b.slug === 'pakistan')
  const embassyIdx = categoryBlocksRaw.findIndex((b) => b.slug === 'embassy-consulates')
  const categoryBlocks = [...categoryBlocksRaw]
  if (pakistanIdx !== -1 && embassyIdx !== -1 && embassyIdx !== pakistanIdx + 1) {
    const [embassyBlock] = categoryBlocks.splice(embassyIdx, 1)
    const newPakIdx = categoryBlocks.findIndex((b) => b.slug === 'pakistan')
    categoryBlocks.splice(newPakIdx + 1, 0, embassyBlock)
  }

  // ── Step 3: Widget data — reuse already-fetched posts ──
  const parentPostsMap = new Map<string, typeof apiPosts>()
  categoryTree.forEach((parent, i) => {
    parentPostsMap.set(parent.id, parentPostResults[i])
  })
  const widgetCategoryPostsMap = new Map<string, typeof apiPosts>()
  for (const cat of apiCategories.slice(0, 7)) {
    widgetCategoryPostsMap.set(cat.id, parentPostsMap.get(cat.id) || [])
  }
  const categoriesForWidgets = transformCategoriesWithPosts(
    apiCategories.slice(0, 7),
    widgetCategoryPostsMap,
  )

  return (
    <div className="relative container space-y-20 pb-28 lg:space-y-28 lg:pb-32">
      {/* JSON-LD Structured Data */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/search?s={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* ═══ Trending Ticker ═══ */}
      <TrendingTicker posts={posts.slice(0, 10)} label={t('trending')} />

      {/* ═══ CNN-style Editorial Hero ═══ */}
      <HeroEditorial posts={posts.slice(0, 11)} />

      <SectionAds />

      {/* ═══ Category Blocks with Subcategory Tabs ═══ */}
      {categoryBlocks.map((block, idx) => {
        // World category gets the magazine layout with centered header
        const isWorld = block.slug === 'world'
        // Embassy & Consulates gets the FT-style editorial layout
        const isEmbassy = block.slug === 'embassy-consulates'
        const blockVariant = isEmbassy
          ? 'editorial' as const
          : isWorld
            ? 'magazine' as const
            : LAYOUT_VARIANTS[idx % LAYOUT_VARIANTS.length]
        const blockHeaderStyle = isEmbassy
          ? 'editorial' as const
          : isWorld
            ? 'centered' as const
            : 'default' as const

        return (
          <div key={block.id}>
            {/* Embassy & Consulates: editorial style with its own background */}
            {isEmbassy ? (
              <SectionCategoryBlock
                category={block}
                variant={blockVariant}
                headerStyle={blockHeaderStyle}
              />
            ) : /* Alternate: every other block gets a subtle background */
            idx % 2 === 1 ? (
              <div className="relative -mx-4 rounded-3xl px-4 py-10 lg:-mx-8 lg:px-8 lg:py-14">
                <BackgroundSection />
                <SectionCategoryBlock
                  className="relative z-10"
                  category={block}
                  variant={blockVariant}
                  headerStyle={blockHeaderStyle}
                  sectionIndex={isWorld || isEmbassy ? undefined : idx + 1}
                />
              </div>
            ) : (
              <SectionCategoryBlock
                category={block}
                variant={blockVariant}
                headerStyle={blockHeaderStyle}
                sectionIndex={isWorld || isEmbassy ? undefined : idx + 1}
              />
            )}

            {/* Insert ads every 3 blocks */}
            {(idx + 1) % 3 === 0 && idx < categoryBlocks.length - 1 && <SectionAds className="mt-20 lg:mt-28" />}
          </div>
        )
      })}

      {/* ═══ Top Authors ═══ */}
      <div className="relative py-16 lg:py-20">
        <BackgroundSection />
        <SectionSliderNewAuthors
          className="relative z-10"
          heading={t('topEliteAuthorsHeading')}
          subHeading={t('topEliteAuthorsSubHeading')}
          authors={authors.slice(0, 10)}
        />
      </div>

      <Divider />

      <SectionBecomeAnAuthor />

      {/* ═══ Latest Articles with Sidebar Widgets ═══ */}
      <SectionPostsWithWidgets
        heading={t('latestArticlesHeading')}
        subHeading={t('latestArticlesSubHeading')}
        posts={posts.slice(0, 8)}
        postCardName="card4"
        gridClass="sm:grid-cols-2"
        widgetAuthors={authors.slice(0, 4)}
        widgetCategories={categoriesForWidgets.slice(0, 7)}
        widgetTags={categoriesForWidgets.slice(0, 6)}
        widgetPosts={posts.slice(0, 4)}
      />
    </div>
  )
}

export default Page
