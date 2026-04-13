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
    title: t('cookiePolicy'),
    description: t('cookieIntro', { siteName: SITE_NAME, siteUrl: SITE_URL }),
    alternates: {
      canonical: `${SITE_URL}/cookie-policy`,
      languages: generateAlternateLanguages('/cookie-policy'),
    },
  }
}

const CookiePolicyPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')

  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      {/* Hero header */}
      <div className="mb-12 border-b border-neutral-200 pb-10 dark:border-neutral-700">
        <span className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
          {t('cookieBadge')}
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('cookiePolicy')}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          {t('cookieSubtitle', { siteName: SITE_NAME })}
        </p>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {t('cookieLastUpdated')}
        </p>
      </div>

      <div className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-3 prose-h2:dark:border-neutral-700">
        <p className="lead">
          {t('cookieIntro', { siteName: SITE_NAME, siteUrl: SITE_URL })}
        </p>

        <h2>{t('whatAreCookies')}</h2>
        <p>{t('whatAreCookiesDescription')}</p>

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
        <p>{t('analyticsCookiesDescription')}</p>

        <h3>{t('preferenceCookies')}</h3>
        <p>{t('preferenceCookiesDescription')}</p>

        <h3>{t('cookieAdvertisingCookies')}</h3>
        <p>{t('cookieAdvertisingCookiesDescription')}</p>

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
              <tr>
                <td>NEXT_LOCALE</td>
                <td>{t('cookieLocalePurpose')}</td>
                <td>{t('cookieLocaleDuration')}</td>
                <td>{t('cookiePreference')}</td>
              </tr>
              <tr>
                <td>theme</td>
                <td>{t('cookieThemePurpose')}</td>
                <td>{t('cookieThemeDuration')}</td>
                <td>{t('cookiePreference')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('managingCookies')}</h2>
        <p>{t('managingCookiesIntro')}</p>
        <ul>
          <li>{t('managingCookieItem1')}</li>
          <li>{t('managingCookieItem2')}</li>
          <li>{t('managingCookieItem3')}</li>
          <li>{t('managingCookieItem4')}</li>
          <li>{t('managingCookieItem5')}</li>
        </ul>
        <p>{t('managingCookiesNote')}</p>

        <h2>{t('thirdPartyCookies')}</h2>
        <p>{t('thirdPartyCookiesDescription')}</p>

        <h2>{t('cookieConsentInfo')}</h2>
        <p>{t('cookieConsentInfoDescription')}</p>

        <h2>{t('changesToCookiePolicy')}</h2>
        <p>{t('changesToCookiePolicyDescription')}</p>

        <h2>{t('contactUs')}</h2>
        <p>{t('cookieContactUs', { email: CONTACT_EMAIL })}</p>
      </div>
    </div>
  )
}

export default CookiePolicyPage
