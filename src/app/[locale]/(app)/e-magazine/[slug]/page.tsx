import { fetchEMagazines, fetchEMagazineBySlug } from '@/utils/serverApi'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'
import JsonLd from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import MagazineViewer from '@/components/e-magazine/MagazineViewer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export async function generateStaticParams() {
  try {
    const { magazines } = await fetchEMagazines({ limit: 100 })
    return magazines.map((m) => ({ slug: m.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const magazine = await fetchEMagazineBySlug(slug)
  const t = await getTranslations('eMagazine')

  if (!magazine) {
    return { title: t('title') }
  }

  const description =
    magazine.description || t('metaDescription')

  return {
    title: `${magazine.title} — ${t('issue')} #${magazine.issue_number}`,
    description,
    openGraph: {
      title: magazine.title,
      description,
      type: 'article',
      url: `${SITE_URL}/e-magazine/${magazine.slug}`,
      ...(magazine.cover_image_url && {
        images: [{ url: magazine.cover_image_url }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: magazine.title,
      description,
      ...(magazine.cover_image_url && {
        images: [magazine.cover_image_url],
      }),
    },
    alternates: {
      canonical: `${SITE_URL}/e-magazine/${magazine.slug}`,
      languages: generateAlternateLanguages(`/e-magazine/${magazine.slug}`),
    },
  }
}

const Page = async ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) => {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const magazine = await fetchEMagazineBySlug(slug)

  if (!magazine) return notFound()

  const t = await getTranslations('eMagazine')

  return (
    <div className="page-e-magazine-viewer">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          name: magazine.title,
          description: magazine.description || '',
          url: `${SITE_URL}/e-magazine/${magazine.slug}`,
          encodingFormat: 'application/pdf',
          ...(magazine.cover_image_url && {
            image: magazine.cover_image_url,
          }),
          ...(magazine.published_date && {
            datePublished: magazine.published_date,
          }),
        }}
      />

      {/* Top bar */}
      <div className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="container flex items-center justify-between py-3">
          <Link
            href="/e-magazine"
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('backToIssues')}
          </Link>

          <div className="text-center">
            <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 md:text-base">
              {magazine.title}
            </h1>
            <p className="text-xs text-neutral-500">
              {t('issue')} #{magazine.issue_number}
              {magazine.page_count && (
                <>
                  {' '}
                  &middot; {magazine.page_count} {t('pages')}
                </>
              )}
            </p>
          </div>

          <a
            href={magazine.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {t('download')}
          </a>
        </div>
      </div>

      {/* Flipbook viewer */}
      <MagazineViewer pdfUrl={magazine.pdf_url} />
    </div>
  )
}

export default Page
