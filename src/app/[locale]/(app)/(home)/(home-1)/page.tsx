import BackgroundSection from '@/components/BackgroundSection'
import SectionAds from '@/components/SectionAds'
import SectionMagazine9 from '@/components/SectionMagazine9'
import SectionMagazine10 from '@/components/SectionMagazine10'
import SectionCategoryBlock from '@/components/SectionCategoryBlock'
import type { CategoryBlockData } from '@/components/SectionCategoryBlock'
import { fetchPosts, fetchCategories, fetchCategoryPosts, buildCategoryTree } from '@/utils/serverApi'
import { transformPosts, transformCategories, transformCategoriesWithPosts } from '@/utils/dataTransformers'
import { Divider } from '@/shared/divider'
import JsonLd from '@/components/seo/JsonLd'
import nextDynamic from 'next/dynamic'
import { getTranslations } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

// Dynamic imports for below-the-fold sections
const SectionBecomeAnAuthor = nextDynamic(() => import('@/components/SectionBecomeAnAuthor'))
const SectionPostsWithWidgets = nextDynamic(() => import('@/components/SectionPostsWithWidgets'))
const SectionSliderNewAuthors = nextDynamic(() => import('@/components/SectionSliderNewAuthors'))

export const revalidate = 60 // ISR: revalidate every 60 seconds

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'

// Rotating color palette for category blocks
const CATEGORY_COLORS = ['blue', 'red', 'green', 'purple', 'teal', 'pink', 'indigo', 'yellow']
// Rotating layout variants for visual diversity
const LAYOUT_VARIANTS = ['featured', 'grid', 'list', 'spotlight', 'compact'] as const

export async function generateMetadata() {
  const t = await getTranslations('home')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: SITE_URL, languages: generateAlternateLanguages('/') },
  }
}

const Page = async () => {
  const t = await getTranslations('home')

  // Fetch posts + categories in parallel
  const [apiPosts, apiCategories] = await Promise.all([
    fetchPosts({ limit: 100 }),
    fetchCategories(),
  ])

  // Transform top-level data
  const posts = transformPosts(apiPosts)
  const categories = transformCategories(apiCategories)

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

  // ── Build category blocks by fetching posts per parent category ──
  const categoryTree = buildCategoryTree(apiCategories)

  // Fetch posts for every parent + its children in parallel
  const categoryBlocksData: CategoryBlockData[] = await Promise.all(
    categoryTree.map(async (parent, idx) => {
      const children = parent.children ?? []

      // Fetch parent posts + all children posts concurrently
      const [parentPosts, ...childrenPosts] = await Promise.all([
        fetchCategoryPosts(parent.id),
        ...children.map((child) => fetchCategoryPosts(child.id)),
      ])

      const tabs = children
        .map((child, childIdx) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          posts: transformPosts(childrenPosts[childIdx]),
        }))
        .filter((tab) => tab.posts.length > 0)

      // If parent itself has posts, include as fallback for "All" tab
      const parentTransformed = transformPosts(parentPosts)

      return {
        id: parent.id,
        name: parent.name,
        slug: parent.slug,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        tabs: tabs.length > 0 ? tabs : [{ id: parent.id, name: parent.name, slug: parent.slug, posts: parentTransformed }],
      } satisfies CategoryBlockData
    })
  )

  // Filter out categories with no posts at all
  const categoryBlocks = categoryBlocksData.filter(
    (block) => block.tabs.some((tab) => tab.posts.length > 0)
  )

  // Build widget data for the latest articles sidebar
  const widgetCategoryPosts = await Promise.all(
    apiCategories.slice(0, 7).map((cat) => fetchCategoryPosts(cat.id))
  )
  const widgetCategoryPostsMap = new Map<string, typeof apiPosts>()
  apiCategories.slice(0, 7).forEach((cat, i) => {
    widgetCategoryPostsMap.set(cat.id, widgetCategoryPosts[i])
  })
  const categoriesForWidgets = transformCategoriesWithPosts(
    apiCategories.slice(0, 7),
    widgetCategoryPostsMap
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

      {/* ═══ Hero Section ═══ */}
      <SectionMagazine10 posts={posts.slice(0, 8)} />

      {/* ═══ Popular News ═══ */}
      <SectionMagazine9
        heading={t('popularNewsHeading')}
        subHeading={t('popularNewsSubHeading')}
        posts={posts.slice(0, 18)}
      />

      <SectionAds />

      {/* ═══ Category Blocks with Subcategory Tabs ═══ */}
      {categoryBlocks.map((block, idx) => (
        <div key={block.id}>
          {/* Alternate: every other block gets a subtle background */}
          {idx % 2 === 1 ? (
            <div className="relative -mx-4 rounded-3xl px-4 py-10 lg:-mx-8 lg:px-8 lg:py-14">
              <BackgroundSection />
              <SectionCategoryBlock
                category={block}
                variant={LAYOUT_VARIANTS[idx % LAYOUT_VARIANTS.length]}
              />
            </div>
          ) : (
            <SectionCategoryBlock
              category={block}
              variant={LAYOUT_VARIANTS[idx % LAYOUT_VARIANTS.length]}
            />
          )}

          {/* Insert ads every 3 blocks */}
          {(idx + 1) % 3 === 0 && idx < categoryBlocks.length - 1 && <SectionAds className="mt-20 lg:mt-28" />}
        </div>
      ))}

      {/* ═══ Top Authors ═══ */}
      <div className="relative py-16 lg:py-20">
        <BackgroundSection />
        <SectionSliderNewAuthors
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
