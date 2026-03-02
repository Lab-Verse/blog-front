import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import JsonLd from '@/components/seo/JsonLd'
import SectionAds from '@/components/SectionAds'
import {
  fetchCategoryBySlug,
  fetchPostsPaginated,
  fetchCategories,
  fetchTags,
} from '@/utils/serverApi'
import {
  transformCategory,
  transformCategories,
  transformTags,
  transformPosts,
} from '@/utils/dataTransformers'
import { mapSortBy } from '@/utils/sortMapping'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'
import PageHeader from '../page-header'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const POSTS_PER_PAGE = 12

/** Pre-generate pages for all categories at build time */
export async function generateStaticParams() {
  try {
    const categories = await fetchCategories()
    return categories.map((cat) => ({ handle: cat.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; handle: string }> }): Promise<Metadata> {
  try {
    const { locale, handle } = await params
    setRequestLocale(locale)
    const apiCategory = await fetchCategoryBySlug(handle)
    const tCat = await getTranslations('category')

    if (!apiCategory) {
      return { title: tCat('categoryNotFound'), description: tCat('categoryNotFoundDescription') }
    }

    const description = tCat('exploreArticles', { name: apiCategory.name })
    return {
      title: apiCategory.name,
      description,
      openGraph: {
        title: apiCategory.name,
        description,
        type: 'website',
        url: `${SITE_URL}/category/${apiCategory.slug}`,
      },
      twitter: { card: 'summary', title: apiCategory.name, description },
      alternates: {
        canonical: `${SITE_URL}/category/${apiCategory.slug}`,
        languages: generateAlternateLanguages(`/category/${apiCategory.slug}`),
      },
    }
  } catch {
    return { title: 'Category', description: '' }
  }
}

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; handle: string }>
  searchParams: Promise<{ page?: string; 'sort-by'?: string }>
}) => {
  const { locale, handle } = await params
  setRequestLocale(locale)
  const { page: pageStr, 'sort-by': sortByParam } = await searchParams

  let apiCategory: Awaited<ReturnType<typeof fetchCategoryBySlug>> = null
  try {
    apiCategory = await fetchCategoryBySlug(handle)
  } catch {
    // API unreachable — handled below
  }

  if (!apiCategory) return notFound()

  const page = Math.max(Number(pageStr) || 1, 1)
  const { sortBy, sortOrder } = mapSortBy(sortByParam)

  // Wrap parallel fetches in individual try-catch to prevent cascade failures
  const [paginatedResult, apiCategories, apiTags] = await Promise.all([
    fetchPostsPaginated({
      category: apiCategory.id,
      page,
      limit: POSTS_PER_PAGE,
      sortBy,
      sortOrder,
    }).catch(() => ({ posts: [] as Awaited<ReturnType<typeof fetchPostsPaginated>>['posts'], total: 0 })),
    fetchCategories().catch(() => []),
    fetchTags().catch(() => []),
  ])

  const { posts: apiPosts, total } = paginatedResult
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)
  const category = transformCategory(apiCategory, apiPosts)
  const posts = transformPosts(apiPosts)
  const categories = transformCategories(apiCategories)
  const tags = transformTags(apiTags)

  const t = await getTranslations('search')
  const tCat = await getTranslations('category')

  const filterOptions = [
    { name: t('sortMostRecent'), value: 'most-recent' },
    { name: t('sortCuratedByAdmin'), value: 'curated-by-admin' },
    { name: t('sortMostAppreciated'), value: 'most-appreciated' },
    { name: t('sortMostDiscussed'), value: 'most-discussed' },
    { name: t('sortMostViewed'), value: 'most-viewed' },
  ]

  return (
    <div className={`page-category-${handle}`}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.name,
          description: tCat('exploreArticles', { name: category.name }),
          url: `${SITE_URL}/category/${handle}`,
        }}
      />
      <PageHeader category={category} />

      {/* Horizontal banner ad below page header */}
      <div className="container mt-8">
        <SectionAds slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL} />
      </div>

      <div className="container pt-10 lg:pt-20">
        <div className="flex flex-wrap gap-x-2 gap-y-4">
          <ModalCategories categories={categories} />
          <ModalTags tags={tags} />
          <div className="ms-auto">
            <ArchiveSortByListBox filterOptions={filterOptions} />
          </div>
        </div>

        {/* LOOP ITEMS */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-7 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <Card11 key={post.id} post={post} />
          ))}
        </div>

        {/* PAGINATIONS */}
        <PaginationWrapper totalPages={totalPages} className="mt-20" />
      </div>
    </div>
  )
}

export default Page
