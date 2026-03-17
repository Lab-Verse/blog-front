import Card11 from '@/components/PostCards/Card11'
import { fetchColumnists, fetchPosts } from '@/utils/serverApi'
import { transformAuthor, transformPosts } from '@/utils/dataTransformers'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'
import { resolveImageUrl } from '@/utils/dataTransformers'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  return {
    title: 'Columnists',
    description:
      'Meet our columnists — regular contributors sharing expert commentary, analysis, and opinion pieces.',
    alternates: {
      canonical: `${SITE_URL}/columnists`,
      languages: generateAlternateLanguages('/columnists'),
    },
  }
}

export const revalidate = 120

const Page = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)

  const columnists = await fetchColumnists()

  // Fetch recent opinion posts for the sidebar
  const opinionPosts = await fetchPosts({
    postType: 'opinion',
    limit: 6,
    sortBy: 'published_at',
    sortOrder: 'DESC',
    locale,
  })
  const recentOpinions = transformPosts(opinionPosts)

  return (
    <div className="container pb-16 pt-4 lg:pb-28">
      {/* Page Header */}
      <div className="mb-12 max-w-3xl">
        <h1 className="heading-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          Columnists
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Our regular contributors share expert commentary, in-depth analysis,
          and thought-provoking opinion pieces on the issues that matter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Columnists Grid */}
        <div className="lg:col-span-2">
          {columnists.length === 0 ? (
            <p className="text-neutral-500">No columnists found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {columnists.map((user) => {
                const author = transformAuthor(user, user.profile)
                return (
                  <Link
                    key={author.id}
                    href={`/author/${author.handle}`}
                    className="group flex flex-col items-center rounded-xl border border-neutral-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <div className="relative size-24 overflow-hidden rounded-full">
                      <Image
                        src={author.avatar.src}
                        alt={author.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <h2 className="heading-serif mt-4 text-lg font-bold text-neutral-900 group-hover:text-primary-600 dark:text-neutral-100">
                      {author.name}
                    </h2>
                    {author.career && (
                      <p className="mt-1 text-sm text-neutral-500">
                        {author.career}
                      </p>
                    )}
                    {author.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {author.description}
                      </p>
                    )}
                    <span className="mt-3 text-xs font-medium text-primary-600">
                      {author.count} {author.count === 1 ? 'article' : 'articles'}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Recent Opinion Pieces */}
        <div>
          <h3 className="heading-serif mb-6 text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Latest Opinion
          </h3>
          <div className="flex flex-col gap-6">
            {recentOpinions.map((post) => (
              <Card11 key={post.id} post={post} ratio="aspect-16/9" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
