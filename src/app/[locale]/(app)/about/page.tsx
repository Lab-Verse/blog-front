import SectionHero from '@/components/SectionHero'
import rightImg from '@/images/about-hero-right.png'
import { Divider } from '@/shared/divider'
import SectionStatistic from './SectionStatistic'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'

export async function generateMetadata() {
  const t = await getTranslations('about')
  return {
    title: t('title'),
    description: t('aboutSubheading', { siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog' }),
  }
}

const PageAbout = async () => {
  const t = await getTranslations('about')

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
        <SectionStatistic />
      </div>
    </div>
  )
}

export default PageAbout
