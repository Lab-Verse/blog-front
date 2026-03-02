import JsonLd from '@/components/seo/JsonLd'
import LeadershipCard from '@/components/leadership/LeadershipCard'
import { fetchLeadershipMembers } from '@/utils/serverApi'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('leadership')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
      url: `${SITE_URL}/leadership`,
    },
    twitter: {
      card: 'summary',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    alternates: {
      canonical: `${SITE_URL}/leadership`,
      languages: generateAlternateLanguages('/leadership'),
    },
  }
}

const LeadershipPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const members = await fetchLeadershipMembers()
  const t = await getTranslations('leadership')

  return (
    <div className="page-leadership">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog',
          url: SITE_URL,
          member: members.map((m) => ({
            '@type': 'Person',
            name: m.name,
            jobTitle: m.designation,
            ...(m.photo_url && { image: m.photo_url }),
            ...(m.website_url && { url: m.website_url }),
          })),
        }}
      />

      {/* Hero */}
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

      {/* Members Grid */}
      <div className="container pb-20 pt-10 lg:pt-16">
        {members.length === 0 ? (
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
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
              {t('noMembers')}
            </p>
          </div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 md:gap-16 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <LeadershipCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadershipPage
