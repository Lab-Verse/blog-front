import StructuredData from '@/components/StructuredData'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'The World Ambassador'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twa.com.pk'

/**
 * Organization, WebSite (with SearchAction for sitelinks search box),
 * and SiteNavigationElement structured data — injected once in the root layout.
 */
export default function SiteStructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/twa-svg.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/images/twa-svg.png`,
    sameAs: [
      // Add your social media URLs here
      // 'https://twitter.com/yourhandle',
      // 'https://www.facebook.com/yourpage',
    ],
  }

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['en', 'ur', 'ar', 'ko', 'zh', 'es'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const navigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${SITE_URL}/#navigation`,
    name: 'Main Navigation',
    url: SITE_URL,
    hasPart: [
      { '@type': 'WebPage', name: 'Home', url: SITE_URL },
      { '@type': 'WebPage', name: 'E-Magazine', url: `${SITE_URL}/e-magazine` },
      { '@type': 'WebPage', name: 'Leadership', url: `${SITE_URL}/leadership` },
      { '@type': 'WebPage', name: 'About', url: `${SITE_URL}/about` },
      { '@type': 'WebPage', name: 'Contact', url: `${SITE_URL}/contact` },
    ],
  }

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={webSiteSchema} />
      <StructuredData data={navigationSchema} />
    </>
  )
}
