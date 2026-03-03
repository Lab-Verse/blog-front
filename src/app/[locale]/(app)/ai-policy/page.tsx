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
    title: t('aiPolicyTitle'),
    description: t('aiPolicyIntro', { siteName: SITE_NAME }),
    alternates: {
      canonical: `${SITE_URL}/ai-policy`,
      languages: generateAlternateLanguages('/ai-policy'),
    },
  }
}

const AIPolicyPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')

  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      {/* Hero header */}
      <div className="mb-12 border-b border-neutral-200 pb-10 dark:border-neutral-700">
        <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {t('aiPolicyBadge')}
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('aiPolicyTitle')}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          {t('aiPolicySubtitle', { siteName: SITE_NAME })}
        </p>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {t('aiPolicyLastUpdated')}
        </p>
      </div>

      <div className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-3 prose-h2:dark:border-neutral-700">
        <p className="lead">
          {t('aiPolicyIntro', { siteName: SITE_NAME })}
        </p>

        <h2>{t('aiCommitment')}</h2>
        <p>{t('aiCommitmentDescription', { siteName: SITE_NAME })}</p>
        <ul>
          <li>{t('aiCommitmentItem1')}</li>
          <li>{t('aiCommitmentItem2')}</li>
          <li>{t('aiCommitmentItem3')}</li>
          <li>{t('aiCommitmentItem4')}</li>
        </ul>

        <h2>{t('aiContentGuidelines')}</h2>
        <p>{t('aiContentGuidelinesIntro', { siteName: SITE_NAME })}</p>

        <h3>{t('aiPermittedUses')}</h3>
        <p>{t('aiPermittedUsesIntro')}</p>
        <ul>
          <li><strong>{t('aiPermittedUse1Label')}</strong> — {t('aiPermittedUse1Description')}</li>
          <li><strong>{t('aiPermittedUse2Label')}</strong> — {t('aiPermittedUse2Description')}</li>
          <li><strong>{t('aiPermittedUse3Label')}</strong> — {t('aiPermittedUse3Description')}</li>
          <li><strong>{t('aiPermittedUse4Label')}</strong> — {t('aiPermittedUse4Description')}</li>
        </ul>

        <h3>{t('aiProhibitedUses')}</h3>
        <p>{t('aiProhibitedUsesIntro')}</p>
        <ul>
          <li>{t('aiProhibitedUse1')}</li>
          <li>{t('aiProhibitedUse2')}</li>
          <li>{t('aiProhibitedUse3')}</li>
          <li>{t('aiProhibitedUse4')}</li>
          <li>{t('aiProhibitedUse5')}</li>
        </ul>

        <h2>{t('aiDisclosure')}</h2>
        <p>{t('aiDisclosureDescription', { siteName: SITE_NAME })}</p>
        <ul>
          <li>{t('aiDisclosureItem1')}</li>
          <li>{t('aiDisclosureItem2')}</li>
          <li>{t('aiDisclosureItem3')}</li>
        </ul>

        <h2>{t('aiEditorialOversight')}</h2>
        <p>{t('aiEditorialOversightDescription', { siteName: SITE_NAME })}</p>

        <h2>{t('aiDataPrivacy')}</h2>
        <p>{t('aiDataPrivacyDescription', { siteName: SITE_NAME })}</p>
        <ul>
          <li>{t('aiDataPrivacyItem1')}</li>
          <li>{t('aiDataPrivacyItem2')}</li>
          <li>{t('aiDataPrivacyItem3')}</li>
        </ul>

        <h2>{t('aiIntellectualProperty')}</h2>
        <p>{t('aiIntellectualPropertyDescription')}</p>

        <h2>{t('aiAccountability')}</h2>
        <p>{t('aiAccountabilityDescription', { siteName: SITE_NAME })}</p>

        <h2>{t('aiPolicyUpdates')}</h2>
        <p>{t('aiPolicyUpdatesDescription')}</p>

        <h2>{t('contactUs')}</h2>
        <p>{t('aiContactDescription', { email: CONTACT_EMAIL })}</p>
      </div>
    </div>
  )
}

export default AIPolicyPage
