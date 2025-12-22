'use client'

import React from 'react'
import { useGetPostStatsQuery } from '@/app/redux/api/posts/postsApi'
import SpinLoading from '@/shared/spin-loading'
import Link from 'next/link'

interface DashboardStatsProps {
    userId: string
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userId }) => {
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
                <p className="text-red-800 dark:text-red-200">Failed to load stats.</p>
            </div>
        )
    }

    const statCards = [
        { label: 'Total Posts', value: stats.totalPosts, color: 'blue', link: '/dashboard/posts' },
        { label: 'Published', value: stats.publishedPosts, color: 'green', link: '/dashboard/posts' },
        { label: 'Drafts', value: stats.draftPosts, color: 'yellow', link: '/dashboard/posts' },
        { label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'indigo', link: null },
        { label: 'Total Likes', value: stats.totalLikes.toLocaleString(), color: 'rose', link: null },
        { label: 'Total Comments', value: stats.totalComments.toLocaleString(), color: 'teal', link: null },
    ]

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-lg border border-${stat.color}-200 bg-${stat.color}-50 p-6 dark:border-${stat.color}-800 dark:bg-${stat.color}-900/20`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                        {stat.link && (
                            <Link href={stat.link} className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">
                                View all →
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Averages */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Average Performance</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Views per Post</p>
                        <p className="mt-1 text-2xl font-bold">{stats.avgViewsPerPost.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Likes per Post</p>
                        <p className="mt-1 text-2xl font-bold">{stats.avgLikesPerPost.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Comments per Post</p>
                        <p className="mt-1 text-2xl font-bold">{stats.avgCommentsPerPost.toFixed(1)}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/dashboard/submit-post"
                        className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-center hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/20 dark:hover:bg-primary-900/30"
                    >
                        <p className="font-medium">Create New Post</p>
                    </Link>
                    <Link
                        href="/dashboard/posts"
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <p className="font-medium">Manage Posts</p>
                    </Link>
                    <Link
                        href="/dashboard/categories"
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <p className="font-medium">Manage Categories</p>
                    </Link>
                    <Link
                        href="/dashboard/media"
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <p className="font-medium">Media Library</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DashboardStats
