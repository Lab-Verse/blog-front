import { describe, it, expect } from 'vitest'
import { getPageNumbers } from '@/utils/pagination'

describe('getPageNumbers', () => {
  it('returns all pages when totalPages <= 7', () => {
    expect(getPageNumbers(1, 1)).toEqual([1])
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('returns correct pages for page 1 with many pages', () => {
    const result = getPageNumbers(1, 20)
    // Should show: 1, 2, gap, 20
    expect(result).toEqual([1, 2, 'gap', 20])
  })

  it('returns correct pages for last page with many pages', () => {
    const result = getPageNumbers(20, 20)
    // Should show: 1, gap, 19, 20
    expect(result).toEqual([1, 'gap', 19, 20])
  })

  it('returns correct pages for middle page', () => {
    const result = getPageNumbers(10, 20)
    // Should show: 1, gap, 9, 10, 11, gap, 20
    expect(result).toEqual([1, 'gap', 9, 10, 11, 'gap', 20])
  })

  it('returns correct pages near start', () => {
    const result = getPageNumbers(3, 20)
    // Should show: 1, 2, 3, 4, gap, 20
    expect(result).toEqual([1, 2, 3, 4, 'gap', 20])
  })

  it('returns correct pages near end', () => {
    const result = getPageNumbers(18, 20)
    // Should show: 1, gap, 17, 18, 19, 20
    expect(result).toEqual([1, 'gap', 17, 18, 19, 20])
  })

  it('does not produce gaps when neighbor overlaps with first/last', () => {
    const result = getPageNumbers(2, 8)
    // Page 2: neighbors are 1, 2, 3, plus first=1 and last=8
    // Should show: 1, 2, 3, gap, 8
    expect(result).toEqual([1, 2, 3, 'gap', 8])
  })

  it('single page returns just [1]', () => {
    expect(getPageNumbers(1, 1)).toEqual([1])
  })

  it('handles page 1 of 8 correctly', () => {
    const result = getPageNumbers(1, 8)
    expect(result).toEqual([1, 2, 'gap', 8])
  })

  it('consecutive pages do not produce gaps', () => {
    const result = getPageNumbers(7, 8)
    // neighbors: 6,7,8 + first=1, last=8 → 1, gap, 6, 7, 8
    expect(result).toEqual([1, 'gap', 6, 7, 8])
  })
})
