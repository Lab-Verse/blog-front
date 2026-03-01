import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `contact@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'watt.com.pk'}`

export async function generateMetadata() {
  const t = await getTranslations('legal')
  return {
    title: t('cookiePolicy'),
    description: t('cookieIntro', { siteName: SITE_NAME, siteUrl: SITE_URL }),
    alternates: {
      canonical: `${SITE_URL}/cookie-policy`,
      languages: generateAlternateLanguages('/cookie-policy'),
    },
  }
}

const CookiePolicyPage = async () => {
  const t = await getTranslations('legal')

  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('cookiePolicy')}</h1>
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        {t('cookieLastUpdated')}
      </p>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <p>
          {t('cookieIntro', { siteName: SITE_NAME, siteUrl: SITE_URL })}
        </p>

        <h2>{t('whatAreCookies')}</h2>
        <p>
          {t('whatAreCookiesDescription')}
        </p>

        <h2>{t('howWeUseCookies')}</h2>
        <p>{t('howWeUseCookiesIntro')}</p>

        <h3>{t('essentialCookies')}</h3>
        <p>{t('essentialCookiesIntro')}</p>
        <ul>
          <li><strong>{t('essentialCookieItem1Label')}</strong> — {t('essentialCookieItem1Description')}</li>
          <li><strong>{t('essentialCookieItem2Label')}</strong> — {t('essentialCookieItem2Description')}</li>
          <li><strong>{t('essentialCookieItem3Label')}</strong> — {t('essentialCookieItem3Description')}</li>
        </ul>

        <h3>{t('analyticsCookies')}</h3>
        <p>
          {t('analyticsCookiesDescription')}
        </p>

        <h3>{t('preferenceCookies')}</h3>
        <p>
          {t('preferenceCookiesDescription')}
        </p>

        <h2>{t('cookieDetails')}</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>{t('cookieName')}</th>
                <th>{t('purpose')}</th>
                <th>{t('duration')}</th>
                <th>{t('cookieType')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>accessToken</td>
                <td>{t('accessTokenPurpose')}</td>
                <td>{t('accessTokenDuration')}</td>
                <td>{t('essential')}</td>
              </tr>
              <tr>
                <td>refreshToken</td>
                <td>{t('refreshTokenPurpose')}</td>
                <td>{t('refreshTokenDuration')}</td>
                <td>{t('essential')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('managingCookies')}</h2>
        <p>
          {t('managingCookiesIntro')}
        </p>
        <ul>
          <li>{t('managingCookieItem1')}</li>
          <li>{t('managingCookieItem2')}</li>
          <li>{t('managingCookieItem3')}</li>
          <li>{t('managingCookieItem4')}</li>
          <li>{t('managingCookieItem5')}</li>
        </ul>
        <p>{t('managingCookiesNote')}</p>

        <h2>{t('thirdPartyCookies')}</h2>
        <p>
          {t('thirdPartyCookiesDescription')}
        </p>

        <h2>{t('changesToCookiePolicy')}</h2>
        <p>
          {t('changesToCookiePolicyDescription')}
        </p>

        <h2>{t('contactUs')}</h2>
        <p>
          {t('cookieContactUs', { email: CONTACT_EMAIL })}
        </p>
      </div>
    </div>
  )
}

export default CookiePolicyPage
