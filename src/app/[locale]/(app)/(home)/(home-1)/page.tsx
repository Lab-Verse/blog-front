import BackgroundSection from '@/components/BackgroundSection'
import SectionAds from '@/components/SectionAds'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine8 from '@/components/SectionMagazine8'
import SectionMagazine9 from '@/components/SectionMagazine9'
import SectionMagazine10 from '@/components/SectionMagazine10'
import { fetchPosts, fetchCategories, fetchCategoryPosts, fetchAuthors, buildCategoryTree } from '@/utils/serverApi'
import { transformPosts, transformCategories, transformAuthors, transformCategoriesWithPosts } from '@/utils/dataTransformers'
import { Divider } from '@/shared/divider'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'
import nextDynamic from 'next/dynamic'
import { getTranslations } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

// Dynamic imports for below-the-fold sections (loaded on demand)
const SectionBecomeAnAuthor = nextDynamic(() => import('@/components/SectionBecomeAnAuthor'))
const SectionPostsWithWidgets = nextDynamic(() => import('@/components/SectionPostsWithWidgets'))
const SectionSliderNewAuthors = nextDynamic(() => import('@/components/SectionSliderNewAuthors'))
const SectionSliderPosts = nextDynamic(() => import('@/components/SectionSliderPosts'))

export const revalidate = 60 // ISR: revalidate every 60 seconds

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'

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

  // Fetch data from API — limit to what the page actually uses
  const [apiPosts, apiCategories] = await Promise.all([
    fetchPosts({ limit: 30 }),
    fetchCategories(),
  ])

  // Transform API data to theme format
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

  // Fetch posts by specific categories for the hero section
  const categoryTree = buildCategoryTree(apiCategories)
  const categoriesWithPosts: Array<{
    name: string
    posts: typeof posts
  }> = []

  // Get up to 3 categories with their posts for sections
  for (const cat of apiCategories.slice(0, 3)) {
    const catPosts = await fetchCategoryPosts(cat.id)
    categoriesWithPosts.push({
      name: cat.name,
      posts: transformPosts(catPosts),
    })
  }

  // Build categories with posts for widgets
  const categoryPostsMap = new Map<string, typeof apiPosts>()
  for (const cat of apiCategories.slice(0, 7)) {
    const catPosts = await fetchCategoryPosts(cat.id)
    categoryPostsMap.set(cat.id, catPosts)
  }
  const categoriesForWidgets = transformCategoriesWithPosts(
    apiCategories.slice(0, 7),
    categoryPostsMap
  )

  return (
    <div className="relative container space-y-28 pb-28 lg:space-y-32 lg:pb-32">
      {/* JSON-LD Structured Data for Homepage */}
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

      {/* Hero Grid Section - Country/Category based news */}
      <SectionMagazine10 posts={posts.slice(0, 8)} />

      {/* POPULAR News */}
      <SectionMagazine9
        heading={t('popularNewsHeading')}
        subHeading={t('popularNewsSubHeading')}
        posts={posts.slice(0, 18)}
      />

      {/* Latest Audio NEWS */}
      <SectionMagazine8
        posts={posts.filter((p) => p.postType === 'audio').slice(0, 6).length > 0
          ? posts.filter((p) => p.postType === 'audio').slice(0, 6)
          : posts.slice(0, 6)}
        heading={t('latestAudioHeading')}
        dimHeading={t('latestAudioDimHeading')}
      />

      <SectionAds />

      {/* Top Elite Authors */}
      <div className="relative py-16 lg:py-20">
        <BackgroundSection />
        <SectionSliderNewAuthors
          heading={t('topEliteAuthorsHeading')}
          subHeading={t('topEliteAuthorsSubHeading')}
          authors={authors.slice(0, 10)}
        />
      </div>

      {/* Travel Section */}
      <div className="relative py-16 lg:py-20">
        <BackgroundSection />
        <SectionSliderPosts
          postCardName="card10V2"
          heading={t('travelHeading')}
          subHeading={t('travelSubHeading')}
          posts={posts.slice(0, 8)}
        />
      </div>

      {/* Sports / World News Section */}
      <SectionMagazine2
        heading={t('worldNewsHeading')}
        subHeading={t('worldNewsSubHeading')}
        posts={posts.slice(0, 7)}
      />

      <Divider />

      <SectionBecomeAnAuthor />

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
