'use client'

import React from 'react'
import { useGetPostStatsQuery } from '@/app/redux/api/posts/postsApi'
import SpinLoading from '@/shared/spin-loading'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface DashboardStatsProps {
    userId: string
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userId }) => {
    const t = useTranslations('dashboard')
    const tc = useTranslations('common')
    const { data: stats, isLoading, error } = useGetPostStatsQuery(userId)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <SpinLoading />
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-red-800 dark:text-red-200">{t('failedToLoadStats')}</p>
            </div>
        )
    }

    const statCards = [
        { label: t('totalPosts'), value: stats.totalPosts, link: '/dashboard/posts', borderClass: 'border-blue-200 dark:border-blue-800', bgClass: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: t('published'), value: stats.publishedPosts, link: '/dashboard/posts', borderClass: 'border-green-200 dark:border-green-800', bgClass: 'bg-green-50 dark:bg-green-900/20' },
        { label: t('drafts'), value: stats.draftPosts, link: '/dashboard/posts', borderClass: 'border-yellow-200 dark:border-yellow-800', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { label: t('totalViews'), value: stats.totalViews.toLocaleString(), link: null, borderClass: 'border-indigo-200 dark:border-indigo-800', bgClass: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { label: t('totalLikes'), value: stats.totalLikes.toLocaleString(), link: null, borderClass: 'border-rose-200 dark:border-rose-800', bgClass: 'bg-rose-50 dark:bg-rose-900/20' },
        { label: t('totalComments'), value: stats.totalComments.toLocaleString(), link: null, borderClass: 'border-teal-200 dark:border-teal-800', bgClass: 'bg-teal-50 dark:bg-teal-900/20' },
    ]

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-lg border ${stat.borderClass} ${stat.bgClass} p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                        {stat.link && (
                            <Link href={stat.link} className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">
                                {tc('viewAll')}
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Averages */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">{t('averagePerformance')}</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('avgViewsPerPost')}</p>
                        <p className="mt-1 text-2xl font-bold">{stats.avgViewsPerPost.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('avgLikesPerPost')}</p>
                        <p className="mt-1 text-2xl font-bold">{stats.avgLikesPerPost.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('avgCommentsPerPost')}</p>
                        <p className="mt-1 text-2xl font-bold">{stats.avgCommentsPerPost.toFixed(1)}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/dashboard/submit-post"
                        className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-center hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/20 dark:hover:bg-primary-900/30"
                    >
                        <p className="font-medium">{t('createNewPost')}</p>
                    </Link>
                    <Link
                        href="/dashboard/posts"
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <p className="font-medium">{t('managePosts')}</p>
                    </Link>
                    <Link
                        href="/dashboard/bookmarks"
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <p className="font-medium">{t('bookmarks')}</p>
                    </Link>
                    <Link
                        href="/dashboard/media"
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <p className="font-medium">{t('mediaLibrary')}</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DashboardStats
