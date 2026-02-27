import { fetchPostsPaginated, fetchCategories, fetchTags, fetchAuthors } from '@/utils/serverApi'
import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  entries.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/signup`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
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
      })
    }
  } catch {
    /* skip */
  }

  // Authors
  try {
    const authors = await fetchAuthors()
    for (const a of authors) {
      entries.push({
        url: `${SITE_URL}/author/${a.username}`,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  } catch {
    /* skip */
  }

  return entries
}
