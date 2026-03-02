import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ArchiveTabs from '@/components/ArchiveTabs'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import { fetchAuthorByUsername, fetchPostsPaginated } from '@/utils/serverApi'
import { transformAuthor, transformPosts } from '@/utils/dataTransformers'
import { mapSortBy } from '@/utils/sortMapping'
import { AllBookmarkIcon, FolderFavouriteIcon, LicenseIcon } from '@hugeicons/core-free-icons'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'
import PageHeader from '../page-header'
import SectionAds from '@/components/SectionAds'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const POSTS_PER_PAGE = 12

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  try {
  const { handle } = await params
  const t = await getTranslations('authorProfile')
  const result = await fetchAuthorByUsername(handle)
  if (!result?.user) {
    return { title: t('notFoundTitle'), description: t('notFoundDescription') }
  }
  const name = result.user.display_name || result.user.username
  const description = result.user.bio || t('articlesBy', { name })
  const avatar = result.user.avatar
    ? (result.user.avatar.startsWith('http') ? result.user.avatar : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${result.user.avatar}`)
    : undefined
  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      type: 'profile',
      url: `${SITE_URL}/author/${result.user.username}`,
      ...(avatar ? { images: [{ url: avatar, width: 200, height: 200, alt: name }] } : {}),
    },
    twitter: {
      card: 'summary',
      title: name,
      description,
      ...(avatar ? { images: [avatar] } : {}),
    },
    alternates: {
      canonical: `${SITE_URL}/author/${result.user.username}`,
      languages: generateAlternateLanguages(`/author/${result.user.username}`),
    },
  }
  } catch {
    return { title: 'Author', description: '' }
  }
}

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ page?: string; 'sort-by'?: string }>
}) => {
  const { handle } = await params
  const { page: pageStr, 'sort-by': sortByParam } = await searchParams
  const t = await getTranslations('authorProfile')
  const ts = await getTranslations('search')
  let result: Awaited<ReturnType<typeof fetchAuthorByUsername>> = null
  try {
    result = await fetchAuthorByUsername(handle)
  } catch {
    // API unreachable
  }

  if (!result?.user) return notFound()

  const page = Math.max(Number(pageStr) || 1, 1)
  const { sortBy, sortOrder } = mapSortBy(sortByParam)

  const { posts: apiPosts, total } = await fetchPostsPaginated({
    user: result.user.id,
    page,
    limit: POSTS_PER_PAGE,
    sortBy,
    sortOrder,
  }).catch(() => ({ posts: [] as Awaited<ReturnType<typeof fetchPostsPaginated>>['posts'], total: 0 }))

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)
  const author = transformAuthor(result.user, result.profile, total)
  const posts = transformPosts(apiPosts)

  const sortByOptions = [
    { name: ts('sortMostRecent'), value: 'most-recent' },
    { name: ts('sortCuratedByAdmin'), value: 'curated-by-admin' },
    { name: ts('sortMostAppreciated'), value: 'most-appreciated' },
    { name: ts('sortMostDiscussed'), value: 'most-discussed' },
    { name: ts('sortMostViewed'), value: 'most-viewed' },
    { name: ts('sortMostLiked'), value: 'most-liked' },
  ]
  const filterTabs = [
    { name: t('tabArticles'), value: 'articles', icon: LicenseIcon },
    { name: t('tabFavorites'), value: 'favorites', icon: FolderFavouriteIcon },
    { name: t('tabSaved'), value: 'saved', icon: AllBookmarkIcon },
  ]

  return (
    <div className={`page-author`}>
      <PageHeader author={author} />

      {/* Horizontal banner ad below author header */}
      <div className="container mt-8">
        <SectionAds slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL} />
      </div>

      <div className="container pt-16 lg:pt-20">
        {/* TABS FILTER */}
        <div className="flex flex-wrap items-center gap-4">
          <ArchiveTabs tabs={filterTabs} />
          <ArchiveSortByListBox className="ms-auto shrink-0" filterOptions={sortByOptions} />
        </div>

        {/* LOOP ITEMS */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-8 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <Card11 key={post.id} post={post} />
          ))}
        </div>

        {/* PAGINATION */}
        <PaginationWrapper className="mt-20" totalPages={totalPages} />
      </div>
    </div>
  )
}

export default Page
