import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twa.com.pk'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `contact@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'twa.com.pk'}`

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')
  return {
    title: t('privacyPolicy'),
    description: t('privacyIntro', { siteName: SITE_NAME, siteUrl: SITE_URL }),
    alternates: {
      canonical: `${SITE_URL}/privacy-policy`,
      languages: generateAlternateLanguages('/privacy-policy'),
    },
  }
}

const PrivacyPolicyPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')

  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      {/* Hero header */}
      <div className="mb-12 border-b border-neutral-200 pb-10 dark:border-neutral-700">
        <span className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          {t('privacyBadge')}
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('privacyPolicy')}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          {t('privacySubtitle', { siteName: SITE_NAME })}
        </p>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {t('privacyLastUpdated')}
        </p>
      </div>

      <div className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-3 prose-h2:dark:border-neutral-700">
        <p className="lead">
          {t('privacyIntro', { siteName: SITE_NAME, siteUrl: SITE_URL })}
        </p>

        <h2>{t('informationWeCollect')}</h2>

        <h3>{t('personalData')}</h3>
        <p>{t('personalDataIntro')}</p>
        <ul>
          <li>{t('personalDataItem1')}</li>
          <li>{t('personalDataItem2')}</li>
          <li>{t('personalDataItem3')}</li>
          <li>{t('personalDataItem4')}</li>
        </ul>

        <h3>{t('usageData')}</h3>
        <p>{t('usageDataDescription')}</p>

        <h3>{t('privacyCookiesAndTracking')}</h3>
        <p>{t('privacyCookiesAndTrackingDescription')}</p>

        <h2>{t('howWeUseInfo')}</h2>
        <p>{t('howWeUseIntro')}</p>
        <ul>
          <li>{t('howWeUseItem1')}</li>
          <li>{t('howWeUseItem2')}</li>
          <li>{t('howWeUseItem3')}</li>
          <li>{t('howWeUseItem4')}</li>
          <li>{t('howWeUseItem5')}</li>
          <li>{t('howWeUseItem6')}</li>
        </ul>

        <h2>{t('privacyLegalBasis')}</h2>
        <p>{t('privacyLegalBasisIntro')}</p>
        <ul>
          <li><strong>{t('privacyLegalBasis1Label')}</strong> — {t('privacyLegalBasis1Description')}</li>
          <li><strong>{t('privacyLegalBasis2Label')}</strong> — {t('privacyLegalBasis2Description')}</li>
          <li><strong>{t('privacyLegalBasis3Label')}</strong> — {t('privacyLegalBasis3Description')}</li>
          <li><strong>{t('privacyLegalBasis4Label')}</strong> — {t('privacyLegalBasis4Description')}</li>
        </ul>

        <h2>{t('sharingInfo')}</h2>
        <p>{t('sharingIntro')}</p>
        <ul>
          <li><strong>{t('sharingItem1Label')}</strong> — {t('sharingItem1Description')}</li>
          <li><strong>{t('sharingItem2Label')}</strong> — {t('sharingItem2Description')}</li>
          <li><strong>{t('sharingItem3Label')}</strong> — {t('sharingItem3Description')}</li>
        </ul>

        <h2>{t('privacyDataRetention')}</h2>
        <p>{t('privacyDataRetentionDescription')}</p>

        <h2>{t('privacyInternationalTransfers')}</h2>
        <p>{t('privacyInternationalTransfersDescription')}</p>

        <h2>{t('dataSecurity')}</h2>
        <p>{t('dataSecurityDescription')}</p>

        <h2>{t('yourRights')}</h2>
        <p>{t('yourRightsIntro')}</p>
        <ul>
          <li>{t('yourRightsItem1')}</li>
          <li>{t('yourRightsItem2')}</li>
          <li>{t('yourRightsItem3')}</li>
          <li>{t('yourRightsItem4')}</li>
          <li>{t('privacyRightsItem5')}</li>
          <li>{t('privacyRightsItem6')}</li>
        </ul>
        <p>{t('privacyRightsExercise', { email: CONTACT_EMAIL })}</p>

        <h2>{t('privacyChildrensPrivacy')}</h2>
        <p>{t('privacyChildrensPrivacyDescription')}</p>

        <h2>{t('thirdPartyLinks')}</h2>
        <p>{t('thirdPartyLinksDescription')}</p>

        <h2>{t('changesToPolicy')}</h2>
        <p>{t('changesToPolicyDescription')}</p>

        <h2>{t('contactUs')}</h2>
        <p>{t('contactUsPrivacy', { email: CONTACT_EMAIL })}</p>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
