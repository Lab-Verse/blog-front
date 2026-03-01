'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function SectionStatistic() {
  const t = useTranslations('about')
  const [stats, setStats] = useState({ posts: 0, categories: 0, authors: 0 })

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch only lightweight endpoints — avoids the ~15 MB /posts response
        const [catRes, authorRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/users?limit=100`),
        ])

        const categories = await catRes.json()
        const authors = await authorRes.json()

        const catArr = Array.isArray(categories)
          ? categories
          : categories?.items ?? []
        const authorArr = Array.isArray(authors) ? authors : authors?.items ?? []

        // Derive total post count from categories.posts_count (avoids huge /posts call)
        const totalPosts = catArr.reduce(
          (sum: number, c: { posts_count?: number }) => sum + (c.posts_count ?? 0),
          0,
        )

        setStats({
          posts: totalPosts,
          categories: catArr.length,
          authors: authorArr.length,
        })
      } catch {
        // Silently fail — stats stay at 0
      }
    }
    loadStats()
  }, [])

  return (
    <div>
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold tracking-tight text-pretty sm:text-4xl lg:text-5xl">
          {t('growingEveryDay')}
        </h2>
        <p className="mt-6 text-base/7 text-neutral-600 dark:text-neutral-400">
          {t('growingDescription')}
        </p>
      </div>
      <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-neutral-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start dark:bg-neutral-800">
          <p className="flex-none text-3xl font-bold tracking-tight">
            {stats.posts > 0 ? `${stats.posts.toLocaleString()}+` : '—'}
          </p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight">{t('publishedArticles')}</p>
            <p className="mt-2 text-base/7 text-neutral-600 dark:text-neutral-400">
              {t('publishedArticlesDescription')}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-neutral-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44 dark:bg-neutral-700">
          <p className="flex-none text-3xl font-bold tracking-tight text-white">
            {stats.categories > 0 ? `${stats.categories.toLocaleString()}+` : '—'}
          </p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight text-white">{t('contentCategories')}</p>
            <p className="mt-2 text-base/7 text-neutral-400">
              {t('contentCategoriesDescription')}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-primary-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
          <p className="flex-none text-3xl font-bold tracking-tight text-white">
            {stats.authors > 0 ? `${stats.authors.toLocaleString()}+` : '—'}
          </p>
          <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
            <p className="text-lg font-semibold tracking-tight text-white">{t('contributingAuthors')}</p>
            <p className="mt-2 text-base/7 text-primary-100">
              {t('contributingAuthorsDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
