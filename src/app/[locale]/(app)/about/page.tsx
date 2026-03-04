import SectionHero from '@/components/SectionHero'
import rightImg from '@/images/about-hero-right.png'
import { Divider } from '@/shared/divider'
import SectionStatistic from './SectionStatistic'
import LeadershipCard from '@/components/leadership/LeadershipCard'
import { fetchLeadershipMembers } from '@/utils/serverApi'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'
import { Link } from '@/i18n/navigation'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twa.com.pk'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')
  return {
    title: t('title'),
    description: t('aboutSubheading', { siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog' }),
    alternates: {
      canonical: `${SITE_URL}/about`,
      languages: generateAlternateLanguages('/about'),
    },
  }
}

const PageAbout = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')
  const tLeadership = await getTranslations('leadership')
  const members = await fetchLeadershipMembers()

  return (
    <div className="nc-PageAbout relative">
      <div className="container relative space-y-16 py-16 lg:space-y-28 lg:py-28">
        <SectionHero
          rightImg={rightImg}
          heading={t('title')}
          btnText={t('getInTouch')}
          btnHref="/contact"
          subHeading={t('aboutSubheading', { siteName: SITE_NAME })}
        />

        <Divider />

        {/* Mission Section */}
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t('ourMission')}
          </h2>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
            {t('missionDescription')}
          </p>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="text-lg font-semibold">{t('qualityContent')}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {t('qualityContentDescription')}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="text-lg font-semibold">{t('communityDriven')}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {t('communityDrivenDescription')}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700">
              <h3 className="text-lg font-semibold">{t('openPlatform')}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {t('openPlatformDescription')}
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Leadership Team Preview */}
        {members.length > 0 && (
          <>
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {tLeadership('meetTheTeam')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                {tLeadership('meetTheTeamDescription')}
              </p>
              <div className="mt-12 grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
                {members.slice(0, 4).map((member) => (
                  <LeadershipCard
                    key={member.id}
                    member={member}
                    compact
                  />
                ))}
              </div>
              {members.length > 4 && (
                <Link
                  href="/leadership"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  {tLeadership('viewFullTeam')}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
            <Divider />
          </>
        )}

        <SectionStatistic />
      </div>
    </div>
  )
}

export default PageAbout
