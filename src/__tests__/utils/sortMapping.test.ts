import { describe, it, expect } from 'vitest'
import { mapSortBy } from '@/utils/sortMapping'

describe('mapSortBy', () => {
  it('returns empty object for undefined input', () => {
    expect(mapSortBy(undefined)).toEqual({})
  })

  it('returns empty object for empty string', () => {
    expect(mapSortBy('')).toEqual({})
  })

  it('returns empty object for unknown sort value', () => {
    expect(mapSortBy('unknown-sort')).toEqual({})
  })

  it('maps "most-recent" to created_at DESC', () => {
    expect(mapSortBy('most-recent')).toEqual({
      sortBy: 'created_at',
      sortOrder: 'DESC',
    })
  })

  it('maps "curated-by-admin" to published_at DESC', () => {
    expect(mapSortBy('curated-by-admin')).toEqual({
      sortBy: 'published_at',
      sortOrder: 'DESC',
    })
  })

  it('maps "most-appreciated" to likes_count DESC', () => {
    expect(mapSortBy('most-appreciated')).toEqual({
      sortBy: 'likes_count',
      sortOrder: 'DESC',
    })
  })

  it('maps "most-discussed" to comments_count DESC', () => {
    expect(mapSortBy('most-discussed')).toEqual({
      sortBy: 'comments_count',
      sortOrder: 'DESC',
    })
  })

  it('maps "most-viewed" to views_count DESC', () => {
    expect(mapSortBy('most-viewed')).toEqual({
      sortBy: 'views_count',
      sortOrder: 'DESC',
    })
  })
})
