/**
 * Generate an array of page numbers/gaps to display.
 * Always shows first, last, current, and neighbors (current ± 1).
 * Inserts 'gap' markers where pages are skipped.
 */
export function getPageNumbers(currentPage: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>()
  // Always include first and last
  pages.add(1)
  pages.add(totalPages)
  // Current and neighbors
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i)
  }

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: (number | 'gap')[] = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('gap')
    }
    result.push(sorted[i])
  }

  return result
}
