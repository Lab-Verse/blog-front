import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import {
  fetchCategoryBySlug,
  fetchCategoryPosts,
  fetchCategories,
  fetchTags,
} from '@/utils/serverApi'
import {
  transformCategory,
  transformCategories,
  transformTags,
  transformPosts,
} from '@/utils/dataTransformers'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHeader from '../page-header'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const apiCategory = await fetchCategoryBySlug(handle)

  if (!apiCategory) {
    return { title: 'Category not found', description: 'Category not found' }
  }

  const description = `Explore ${apiCategory.name} articles and news`
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
    alternates: { canonical: `${SITE_URL}/category/${apiCategory.slug}` },
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const apiCategory = await fetchCategoryBySlug(handle)

  if (!apiCategory) return notFound()

  const [apiPosts, apiCategories, apiTags] = await Promise.all([
    fetchCategoryPosts(apiCategory.id),
    fetchCategories(),
    fetchTags(),
  ])

  const category = transformCategory(apiCategory, apiPosts)
  const posts = transformPosts(apiPosts)
  const categories = transformCategories(apiCategories)
  const tags = transformTags(apiTags)

  const filterOptions = [
    { name: 'Most recent', value: 'most-recent' },
    { name: 'Curated by admin', value: 'curated-by-admin' },
    { name: 'Most appreciated', value: 'most-appreciated' },
    { name: 'Most discussed', value: 'most-discussed' },
    { name: 'Most viewed', value: 'most-viewed' },
  ]

  return (
    <div className={`page-category-${handle}`}>
      <PageHeader category={category} />

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
        <PaginationWrapper className="mt-20" />
      </div>
    </div>
  )
}

export default Page
