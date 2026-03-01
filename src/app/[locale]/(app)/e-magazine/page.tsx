import PaginationWrapper from '@/components/PaginationWrapper'
import JsonLd from '@/components/seo/JsonLd'
import { fetchEMagazines } from '@/utils/serverApi'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const ISSUES_PER_PAGE = 12

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('eMagazine')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
      url: `${SITE_URL}/e-magazine`,
    },
    twitter: {
      card: 'summary',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    alternates: {
      canonical: `${SITE_URL}/e-magazine`,
      languages: generateAlternateLanguages('/e-magazine'),
    },
  }
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) => {
  const { page: pageStr } = await searchParams
  const page = Math.max(Number(pageStr) || 1, 1)

  const { magazines, total } = await fetchEMagazines({
    page,
    limit: ISSUES_PER_PAGE,
  })

  const totalPages = Math.ceil(total / ISSUES_PER_PAGE)
  const t = await getTranslations('eMagazine')

  return (
    <div className="page-e-magazine">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: t('title'),
          description: t('subtitle'),
          url: `${SITE_URL}/e-magazine`,
        }}
      />

      {/* Hero / Header Section */}
      <div className="bg-neutral-100 py-16 dark:bg-neutral-900">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 md:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Magazine Grid */}
      <div className="container pb-20 pt-10 lg:pt-16">
        {magazines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              className="mb-4 h-16 w-16 text-neutral-300 dark:text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
              {t('noIssues')}
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-8 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t('latestIssues')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
              {magazines.map((mag) => (
                <MagazineCard key={mag.id} magazine={mag} t={t} />
              ))}
            </div>
            <PaginationWrapper totalPages={totalPages} className="mt-16" />
          </>
        )}
      </div>
    </div>
  )
}

function MagazineCard({
  magazine,
  t,
}: {
  magazine: any
  t: (key: string, values?: Record<string, string | number>) => string
}) {
  return (
    <Link
      href={`/e-magazine/${magazine.slug}`}
      className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-700">
        {magazine.cover_image_url ? (
          <Image
            src={magazine.cover_image_url}
            alt={magazine.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400 dark:text-neutral-500">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-sm font-medium">
              {t('issue')} #{magazine.issue_number}
            </span>
          </div>
        )}
        {/* Issue badge */}
        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {t('issue')} #{magazine.issue_number}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
          {magazine.title}
        </h3>
        {magazine.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
            {magazine.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          {magazine.published_date && (
            <time dateTime={magazine.published_date}>
              {new Date(magazine.published_date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
          {magazine.page_count && (
            <>
              <span className="text-neutral-300 dark:text-neutral-600">|</span>
              <span>
                {magazine.page_count} {t('pages')}
              </span>
            </>
          )}
        </div>
        <div className="mt-3">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300">
            {t('readNow')} &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}

export default Page
