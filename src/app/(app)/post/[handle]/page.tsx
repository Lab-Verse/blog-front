import WidgetAuthors from '@/components/WidgetAuthors'
import WidgetCategories from '@/components/WidgetCategories'
import WidgetPosts from '@/components/WidgetPosts'
import WidgetTags from '@/components/WidgetTags'
import JsonLd from '@/components/seo/JsonLd'
import {
  fetchPostBySlug,
  fetchPostComments,
  fetchPosts,
  fetchCategories,
  fetchTags,
  fetchAuthors,
} from '@/utils/serverApi'
import {
  resolveImageUrl,
  transformPostDetail,
  transformPosts,
  transformCategories,
  transformTags,
  transformAuthors,
  transformComments,
} from '@/utils/dataTransformers'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SingleContentContainer from '../SingleContentContainer'
import SingleHeaderContainer from '../SingleHeaderContainer'
import SingleRelatedPosts from '../SingleRelatedPosts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const apiPost = await fetchPostBySlug(handle)
  if (!apiPost) {
    return { title: 'Post not found', description: 'Post not found' }
  }
  const description = apiPost.excerpt || apiPost.description || apiPost.title
  const imageUrl = resolveImageUrl(apiPost.featured_image)
  return {
    title: apiPost.title,
    description,
    openGraph: {
      title: apiPost.title,
      description,
      type: 'article',
      url: `${SITE_URL}/post/${apiPost.slug}`,
      publishedTime: apiPost.published_at || apiPost.created_at,
      authors: apiPost.user ? [apiPost.user.display_name || apiPost.user.username] : [],
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: apiPost.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: apiPost.title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    alternates: {
      canonical: `${SITE_URL}/post/${apiPost.slug}`,
    },
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const apiPost = await fetchPostBySlug(handle)

  if (!apiPost) return notFound()

  const [apiComments, allPosts, apiCategories, apiTags, apiAuthors] = await Promise.all([
    fetchPostComments(apiPost.id),
    fetchPosts({ limit: 12, sortBy: 'created_at', sortOrder: 'DESC' }),
    fetchCategories(),
    fetchTags(),
    fetchAuthors(),
  ])

  const post = transformPostDetail(apiPost, apiPost.tags)
  const comments = transformComments(apiComments)
  const relatedPosts = transformPosts(allPosts.filter((p) => p.id !== apiPost.id).slice(0, 6))
  const moreFromAuthorPosts = transformPosts(
    allPosts.filter((p) => p.user_id === apiPost.user_id && p.id !== apiPost.id).slice(0, 6)
  )

  const widgetPosts = transformPosts(allPosts.slice(0, 6))
  const widgetCategories = transformCategories(apiCategories.slice(0, 6))
  const widgetTags = transformTags(apiTags.slice(0, 6))
  const widgetAuthors = transformAuthors(apiAuthors.slice(0, 6))

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: apiPost.title,
    description: apiPost.excerpt || apiPost.description || '',
    ...(apiPost.featured_image ? { image: resolveImageUrl(apiPost.featured_image) } : {}),
    datePublished: apiPost.published_at || apiPost.created_at,
    dateModified: apiPost.updated_at || apiPost.created_at,
    author: {
      '@type': 'Person',
      name: apiPost.user?.display_name || apiPost.user?.username || 'Unknown',
      url: apiPost.user ? `${SITE_URL}/author/${apiPost.user.username}` : undefined,
    },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/post/${apiPost.slug}` },
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <div className="single-post-page">
        <SingleHeaderContainer post={post} />

        <div className="container mt-12 flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 xl:w-2/3 xl:pe-20">
            <SingleContentContainer post={post} comments={comments} />
          </div>
          <div className="mt-12 w-full lg:mt-0 lg:w-2/5 lg:ps-10 xl:w-1/3 xl:ps-0">
            <div className="space-y-7 lg:sticky lg:top-7">
              <WidgetAuthors authors={widgetAuthors} />
              <WidgetTags tags={widgetTags} />
              <WidgetCategories categories={widgetCategories} />
              <WidgetPosts posts={widgetPosts} />
            </div>
          </div>
        </div>

        <SingleRelatedPosts relatedPosts={relatedPosts} moreFromAuthorPosts={moreFromAuthorPosts} />
      </div>
    </>
  )
}

export default Page
