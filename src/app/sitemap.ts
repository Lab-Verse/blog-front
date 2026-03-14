import { fetchPostsPaginated, fetchCategories, fetchTags, fetchAuthors } from '@/utils/serverApi'
import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

// Non-default locales (English is default and needs no prefix with localePrefix: 'as-needed')
const NON_DEFAULT_LOCALES = ['ur', 'ar', 'ko', 'zh', 'es']

/**
 * Build hreflang alternates for each sitemap entry.
 * English uses no prefix; all other locales use /{locale}{path}.
 */
function buildAlternates(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {
    en: `${SITE_URL}${path}`,
    'x-default': `${SITE_URL}${path}`,
  }
  for (const locale of NON_DEFAULT_LOCALES) {
    languages[locale] = `${SITE_URL}/${locale}${path}`
  }
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages — include all locales via alternates
  // NOTE: /search, /login, /signup are excluded because they have noindex meta tags.
  // Including noindex pages in the sitemap sends conflicting signals to crawlers.
  entries.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1, alternates: buildAlternates('/') },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5, alternates: buildAlternates('/about') },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5, alternates: buildAlternates('/contact') },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3, alternates: buildAlternates('/privacy-policy') },
    { url: `${SITE_URL}/terms-of-service`, changeFrequency: 'yearly', priority: 0.3, alternates: buildAlternates('/terms-of-service') },
    { url: `${SITE_URL}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3, alternates: buildAlternates('/cookie-policy') },
    { url: `${SITE_URL}/e-magazine`, changeFrequency: 'weekly', priority: 0.6, alternates: buildAlternates('/e-magazine') },
    { url: `${SITE_URL}/leadership`, changeFrequency: 'weekly', priority: 0.6, alternates: buildAlternates('/leadership') },
    { url: `${SITE_URL}/columnists`, changeFrequency: 'weekly', priority: 0.6, alternates: buildAlternates('/columnists') },
    { url: `${SITE_URL}/ai-policy`, changeFrequency: 'yearly', priority: 0.3, alternates: buildAlternates('/ai-policy') },
  )

  // Posts — paginate in batches of 100 (backend caps at 100 per request)
  try {
    let page = 1
    let hasMore = true
    while (hasMore) {
      const { posts, total } = await fetchPostsPaginated({ limit: 100, page })
      for (const p of posts) {
        entries.push({
          url: `${SITE_URL}/post/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(p.created_at),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: buildAlternates(`/post/${p.slug}`),
        })
      }
      hasMore = page * 100 < total
      page++
      // Safety: cap at 50 pages (5000 posts) to avoid infinite loops
      if (page > 50) break
    }
  } catch {
    /* skip on error */
  }

  // Categories
  try {
    const categories = await fetchCategories()
    for (const c of categories) {
      entries.push({
        url: `${SITE_URL}/category/${c.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: buildAlternates(`/category/${c.slug}`),
      })
    }
  } catch {
    /* skip */
  }

  // Tags
  try {
    const tags = await fetchTags()
    for (const t of tags) {
      entries.push({
        url: `${SITE_URL}/tag/${t.slug}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: buildAlternates(`/tag/${t.slug}`),
      })
    }
  } catch {
    /* skip */
  }

  // Authors
  try {
    const authors = await fetchAuthors()
    for (const a of authors) {
      const encodedUsername = encodeURIComponent(a.username)
      entries.push({
        url: `${SITE_URL}/author/${encodedUsername}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: buildAlternates(`/author/${encodedUsername}`),
      })
    }
  } catch {
    /* skip */
  }

  return entries
}
