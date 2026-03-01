import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `contact@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'watt.com.pk'}`

export async function generateMetadata() {
  const t = await getTranslations('legal')
  return {
    title: t('privacyPolicy'),
    description: t('privacyIntro', { siteName: SITE_NAME, siteUrl: SITE_URL }),
  }
}

const PrivacyPolicyPage = async () => {
  const t = await getTranslations('legal')

  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('privacyPolicy')}</h1>
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        {t('privacyLastUpdated')}
      </p>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <p>
          {t('privacyIntro', { siteName: SITE_NAME, siteUrl: SITE_URL })}
        </p>

        <h2>{t('informationWeCollect')}</h2>
        <h3>{t('personalData')}</h3>
        <p>
          {t('personalDataIntro')}
        </p>
        <ul>
          <li>{t('personalDataItem1')}</li>
          <li>{t('personalDataItem2')}</li>
          <li>{t('personalDataItem3')}</li>
          <li>{t('personalDataItem4')}</li>
        </ul>

        <h3>{t('usageData')}</h3>
        <p>
          {t('usageDataDescription')}
        </p>

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

        <h2>{t('sharingInfo')}</h2>
        <p>
          {t('sharingIntro')}
        </p>
        <ul>
          <li><strong>{t('sharingItem1Label')}</strong> — {t('sharingItem1Description')}</li>
          <li><strong>{t('sharingItem2Label')}</strong> — {t('sharingItem2Description')}</li>
          <li><strong>{t('sharingItem3Label')}</strong> — {t('sharingItem3Description')}</li>
        </ul>

        <h2>{t('dataSecurity')}</h2>
        <p>
          {t('dataSecurityDescription')}
        </p>

        <h2>{t('yourRights')}</h2>
        <p>{t('yourRightsIntro')}</p>
        <ul>
          <li>{t('yourRightsItem1')}</li>
          <li>{t('yourRightsItem2')}</li>
          <li>{t('yourRightsItem3')}</li>
          <li>{t('yourRightsItem4')}</li>
        </ul>

        <h2>{t('thirdPartyLinks')}</h2>
        <p>
          {t('thirdPartyLinksDescription')}
        </p>

        <h2>{t('changesToPolicy')}</h2>
        <p>
          {t('changesToPolicyDescription')}
        </p>

        <h2>{t('contactUs')}</h2>
        <p>
          {t('contactUsPrivacy', { email: CONTACT_EMAIL })}
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
