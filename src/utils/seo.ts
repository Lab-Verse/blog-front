/**
 * SEO utilities for generating hreflang alternate links and locale-aware metadata.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

/** All supported locales */
export const locales = ['en', 'ur', 'ar', 'ko', 'zh', 'es'] as const
export type Locale = (typeof locales)[number]

/** Default locale — does not appear in the URL path */
export const defaultLocale: Locale = 'en'

/**
 * Generates `alternates.languages` for Next.js Metadata API.
 * Produces hreflang tags for all supported locales.
 *
 * @param path - The path segment after the locale prefix, e.g. '/about' or '/post/my-slug'
 * @returns An object suitable for `metadata.alternates.languages`
 *
 * @example
 * ```ts
 * export async function generateMetadata() {
 *   return {
 *     title: 'About',
 *     alternates: {
 *       canonical: `${SITE_URL}/about`,
 *       languages: generateAlternateLanguages('/about'),
 *     },
 *   }
 * }
 * ```
 */
export function generateAlternateLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    if (locale === defaultLocale) {
      // Default locale has no prefix
      languages[locale] = `${SITE_URL}${path}`
    } else {
      languages[locale] = `${SITE_URL}/${locale}${path}`
    }
  }

  // x-default points to the default locale (no prefix)
  languages['x-default'] = `${SITE_URL}${path}`

  return languages
}
