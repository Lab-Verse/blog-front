'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { FC, useCallback } from 'react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface SearchFiltersProps {
  categories: { id: string; name: string; slug: string }[]
  tags: { id: string; name: string; slug: string }[]
  selectedCategory: string
  selectedTag: string
  selectedAuthor: string
}

const SearchFilters: FC<SearchFiltersProps> = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  selectedAuthor,
}) => {
  const t = useTranslations('search')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const hasActiveFilters = !!(selectedCategory || selectedTag || selectedAuthor)

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 when filters change
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('tag')
    params.delete('author')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  return (
    <div className="mt-6 space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <FunnelIcon className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          <option value="">{t('allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Tag Filter */}
        <select
          value={selectedTag}
          onChange={(e) => updateFilter('tag', e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          <option value="">{t('allTags')}</option>
          {tags.slice(0, 50).map((tag) => (
            <option key={tag.id} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>

        {/* Author Filter */}
        <input
          type="text"
          placeholder={t('filterByAuthor')}
          defaultValue={selectedAuthor}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFilter('author', (e.target as HTMLInputElement).value)
            }
          }}
          onBlur={(e) => {
            if (e.target.value !== selectedAuthor) {
              updateFilter('author', e.target.value)
            }
          }}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500 w-40 sm:w-48"
        />

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
            {t('clearFilters')}
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">{t('activeFilters')}</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
              {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button
                onClick={() => updateFilter('category', '')}
                className="ms-0.5 hover:text-primary-900 dark:hover:text-primary-300"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              {tags.find((t) => t.slug === selectedTag)?.name || selectedTag}
              <button
                onClick={() => updateFilter('tag', '')}
                className="ms-0.5 hover:text-blue-900 dark:hover:text-blue-300"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedAuthor && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              {selectedAuthor}
              <button
                onClick={() => updateFilter('author', '')}
                className="ms-0.5 hover:text-amber-900 dark:hover:text-amber-300"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilters
