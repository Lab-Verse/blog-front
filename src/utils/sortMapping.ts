/**
 * Maps frontend sort-by dropdown values to backend sortBy/sortOrder query params.
 * Backend allowedSortFields: created_at, updated_at, published_at, views_count, likes_count, comments_count, title
 */

const SORT_MAP: Record<string, { sortBy: string; sortOrder: 'ASC' | 'DESC' }> = {
  'most-recent': { sortBy: 'created_at', sortOrder: 'DESC' },
  'curated-by-admin': { sortBy: 'published_at', sortOrder: 'DESC' },
  'most-appreciated': { sortBy: 'likes_count', sortOrder: 'DESC' },
  'most-discussed': { sortBy: 'comments_count', sortOrder: 'DESC' },
  'most-viewed': { sortBy: 'views_count', sortOrder: 'DESC' },
}

export function mapSortBy(frontendValue?: string): { sortBy?: string; sortOrder?: 'ASC' | 'DESC' } {
  if (!frontendValue || !SORT_MAP[frontendValue]) return {}
  return SORT_MAP[frontendValue]
}
