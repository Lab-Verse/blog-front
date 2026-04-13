import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twa.com.pk'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `editor@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'twa.com.pk'}`

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')
  return {
    title: t('termsOfService'),
    description: t('termsIntro', { siteName: SITE_NAME, siteUrl: SITE_URL }),
    alternates: {
      canonical: `${SITE_URL}/terms-of-service`,
      languages: generateAlternateLanguages('/terms-of-service'),
    },
  }
}

const TermsOfServicePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')

  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      {/* Hero header */}
      <div className="mb-12 border-b border-neutral-200 pb-10 dark:border-neutral-700">
        <span className="mb-3 inline-block rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          {t('termsBadge')}
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('termsOfService')}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          {t('termsSubtitle', { siteName: SITE_NAME })}
        </p>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {t('termsLastUpdated')}
        </p>
      </div>

      <div className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-3 prose-h2:dark:border-neutral-700">
        <p className="lead">
          {t('termsIntro', { siteName: SITE_NAME, siteUrl: SITE_URL })}
        </p>

        <h2>{t('accountRegistration')}</h2>
        <p>{t('accountRegistrationIntro')}</p>
        <ul>
          <li>{t('accountRegistrationItem1')}</li>
          <li>{t('accountRegistrationItem2')}</li>
          <li>{t('accountRegistrationItem3')}</li>
          <li>{t('accountRegistrationItem4')}</li>
        </ul>
        <p>{t('accountApprovalNote')}</p>

        <h2>{t('userContent')}</h2>
        <p>{t('userContentIntro', { siteName: SITE_NAME })}</p>
        <p>{t('userContentProhibited')}</p>
        <ul>
          <li>{t('userContentProhibitedItem1')}</li>
          <li>{t('userContentProhibitedItem2')}</li>
          <li>{t('userContentProhibitedItem3')}</li>
          <li>{t('userContentProhibitedItem4')}</li>
          <li>{t('userContentProhibitedItem5')}</li>
        </ul>

        <h2>{t('acceptableUse')}</h2>
        <p>{t('acceptableUseIntro')}</p>
        <ul>
          <li>{t('acceptableUseItem1')}</li>
          <li>{t('acceptableUseItem2')}</li>
          <li>{t('acceptableUseItem3')}</li>
          <li>{t('acceptableUseItem4')}</li>
          <li>{t('acceptableUseItem5')}</li>
        </ul>

        <h2>{t('intellectualProperty')}</h2>
        <p>{t('intellectualPropertyDescription', { siteName: SITE_NAME })}</p>

        <h2>{t('termsPrivacyLink')}</h2>
        <p>{t('termsPrivacyLinkDescription', { siteName: SITE_NAME })}</p>

        <h2>{t('termination')}</h2>
        <p>{t('terminationDescription')}</p>

        <h2>{t('disclaimer')}</h2>
        <p>{t('disclaimerDescription')}</p>

        <h2>{t('limitationLiability')}</h2>
        <p>{t('limitationLiabilityDescription', { siteName: SITE_NAME })}</p>

        <h2>{t('termsIndemnification')}</h2>
        <p>{t('termsIndemnificationDescription', { siteName: SITE_NAME })}</p>

        <h2>{t('termsGoverningLaw')}</h2>
        <p>{t('termsGoverningLawDescription')}</p>

        <h2>{t('termsSeverability')}</h2>
        <p>{t('termsSeverabilityDescription')}</p>

        <h2>{t('changesToTerms')}</h2>
        <p>{t('changesToTermsDescription')}</p>

        <h2>{t('termsContact')}</h2>
        <p>{t('termsContactDescription', { email: CONTACT_EMAIL })}</p>
      </div>
    </div>
  )
}

export default TermsOfServicePage
