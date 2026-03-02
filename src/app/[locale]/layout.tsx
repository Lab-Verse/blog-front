import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Be_Vietnam_Pro, Playfair_Display, Noto_Nastaliq_Urdu, Noto_Naskh_Arabic, Noto_Sans_SC, Noto_Sans_KR } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, rtlLocales, type Locale } from '@/i18n/routing'
import ThemeProvider from '../theme-provider'

// ── Latin font (EN, ES) ────────────────────────────────
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-primary',
})

// ── Serif heading font (editorial style) ───────────────
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
})

// ── Urdu font (Nastaliq) ───────────────────────────────
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-urdu',
})

// ── Arabic font (Naskh) ────────────────────────────────
const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
})

// ── Chinese font ────────────────────────────────────────
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-chinese',
})

// ── Korean font ─────────────────────────────────────────
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-korean',
})

// ── Font class picker by locale ─────────────────────────
function getFontClassName(locale: string): string {
  switch (locale) {
    case 'ur':
      return notoNastaliqUrdu.variable
    case 'ar':
      return notoNaskhArabic.variable
    case 'zh':
      return notoSansSC.variable
    case 'ko':
      return notoSansKR.variable
    default:
      return beVietnamPro.variable
  }
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

/** Maps Next.js locale codes to OpenGraph locale format */
const OG_LOCALE_MAP: Record<string, string> = {
  en: 'en_US',
  ur: 'ur_PK',
  ar: 'ar_AR',
  ko: 'ko_KR',
  zh: 'zh_CN',
  es: 'es_ES',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const ogLocale = OG_LOCALE_MAP[locale] ?? 'en_US'

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} - News, Articles & Insights`,
    },
    description:
      'Your go-to source for the latest news, in-depth articles, and expert insights on technology, travel, sports, finance, and more.',
    keywords: [
      'blog',
      'news',
      'technology',
      'travel',
      'sports',
      'finance',
      'articles',
      'insights',
      SITE_NAME,
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} - News, Articles & Insights`,
      description:
        'Your go-to source for the latest news, in-depth articles, and expert insights.',
      images: [
        {
          url: `${SITE_URL}/images/twa.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} - News, Articles & Insights`,
      description:
        'Your go-to source for the latest news, in-depth articles, and expert insights.',
      images: [`${SITE_URL}/images/twa.png`],
    },
    alternates: {
      canonical: SITE_URL,
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && {
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      },
    }),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const dir = rtlLocales.includes(locale as Locale) ? 'rtl' : 'ltr'
  const fontVarClass = getFontClassName(locale)

  // All font variables for CSS custom properties
  const allFontVars = [
    beVietnamPro.variable,
    playfairDisplay.variable,
    notoNastaliqUrdu.variable,
    notoNaskhArabic.variable,
    notoSansSC.variable,
    notoSansKR.variable,
  ].join(' ')

  return (
    <html lang={locale} dir={dir} className={`${allFontVars} ${fontVarClass}`} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200" suppressHydrationWarning>
        {/* FOUC prevention: apply dark class synchronously before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark-mode'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`
          }}
        />
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider>
          <ThemeProvider>
            <Toaster richColors position={dir === 'rtl' ? 'top-left' : 'top-right'} closeButton />
            <div>{children}</div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
