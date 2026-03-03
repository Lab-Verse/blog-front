import PageHeader from '@/app/[locale]/(app)/tag/page-header'
import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import JsonLd from '@/components/seo/JsonLd'
import SectionAds from '@/components/SectionAds'
import {
  fetchTagBySlug,
  fetchPostsPaginated,
  fetchCategories,
  fetchTags,
} from '@/utils/serverApi'
import {
  transformTag,
  transformCategories,
  transformTags,
  transformPosts,
} from '@/utils/dataTransformers'
import { mapSortBy } from '@/utils/sortMapping'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const POSTS_PER_PAGE = 12

/** Allow on-demand rendering for tag slugs not returned by generateStaticParams */
export const dynamicParams = true

/** Revalidate tag pages every 5 minutes via ISR */
export const revalidate = 300

/** Pre-generate pages for all tags at build time */
export async function generateStaticParams() {
  try {
    const tags = await fetchTags()
    return tags.map((tag) => ({ handle: tag.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; handle: string }> }): Promise<Metadata> {
  try {
  const { locale, handle } = await params
  setRequestLocale(locale)
  const apiTag = await fetchTagBySlug(handle)
  const tTag = await getTranslations('tag')

  if (!apiTag) {
    return { title: tTag('tagNotFound'), description: tTag('tagNotFoundDescription') }
  }

  const description = tTag('postsTaggedWith', { name: apiTag.name })
  return {
    title: apiTag.name,
    description,
    openGraph: {
      title: apiTag.name,
      description,
      type: 'website',
      url: `${SITE_URL}/tag/${apiTag.slug}`,
    },
    twitter: { card: 'summary', title: apiTag.name, description },
    alternates: {
      canonical: `${SITE_URL}/tag/${apiTag.slug}`,
      languages: generateAlternateLanguages(`/tag/${apiTag.slug}`),
    },
  }
  } catch {
    return { title: 'Tag', description: '' }
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
  let apiTag: Awaited<ReturnType<typeof fetchTagBySlug>> = null
  try {
    apiTag = await fetchTagBySlug(handle)
  } catch {
    // API unreachable
  }

  if (!apiTag) return notFound()

  const page = Math.max(Number(pageStr) || 1, 1)
  const { sortBy, sortOrder } = mapSortBy(sortByParam)

  const [paginatedResult, apiCategories, apiTags] = await Promise.all([
    fetchPostsPaginated({
      tag: apiTag.id,
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
  const tag = transformTag(apiTag, apiPosts)
  const posts = transformPosts(apiPosts)
  const categories = transformCategories(apiCategories)
  const tags = transformTags(apiTags)

  const t = await getTranslations('search')
  const tTag = await getTranslations('tag')

  const filterOptions = [
    { name: t('sortMostRecent'), value: 'most-recent' },
    { name: t('sortCuratedByAdmin'), value: 'curated-by-admin' },
    { name: t('sortMostAppreciated'), value: 'most-appreciated' },
    { name: t('sortMostDiscussed'), value: 'most-discussed' },
    { name: t('sortMostViewed'), value: 'most-viewed' },
  ]

  return (
    <div className={`page-tag-${handle}`}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: tag.name,
          description: tTag('postsTaggedWith', { name: tag.name }),
          url: `${SITE_URL}/tag/${handle}`,
        }}
      />
      {/* HEADER */}
      <PageHeader tag={tag} />

      {/* Horizontal banner ad below page header */}
      <div className="container mt-8">
        <SectionAds slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL} />
      </div>

      <div className="container pt-10 lg:pt-16">
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
