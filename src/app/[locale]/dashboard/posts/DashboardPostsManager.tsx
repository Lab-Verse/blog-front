'use client'

import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import {
    useGetUserPostsQuery,
    useDeletePostMutation,
    useBulkDeletePostsMutation,
    useBulkUpdatePostStatusMutation,
} from '@/app/redux/api/posts/postsApi'
import {
    togglePostSelection,
    selectAllPosts,
    clearSelection,
    updateDashboardFilters,
    setBulkActionInProgress,
} from '@/app/redux/slices/posts/postsSlice'
import { PostStatus, type Post } from '@/app/redux/types/posts/postTypes'
import { Badge } from '@/shared/Badge'
import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import SpinLoading from '@/shared/spin-loading'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Dialog } from '@/shared/dialog'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface DashboardPostsManagerProps {
    userId: string
}

const DashboardPostsManager: React.FC<DashboardPostsManagerProps> = ({ userId }) => {
    const t = useTranslations('posts')
    const tc = useTranslations('common')
    const dispatch = useAppDispatch()
    const { selectedPosts, dashboardFilters, bulkActionInProgress } = useAppSelector((state) => state.posts)

    const { data: posts = [], isLoading, error, refetch } = useGetUserPostsQuery(
        { userId, filters: dashboardFilters },
        { skip: !userId }
    )
    const [deletePost] = useDeletePostMutation()
    const [bulkDelete] = useBulkDeletePostsMutation()
    const [bulkUpdateStatus] = useBulkUpdatePostStatusMutation()

    const [searchInput, setSearchInput] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

    const handleSearch = () => {
        dispatch(updateDashboardFilters({ search: searchInput }))
    }

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value)
        if (value === 'all') {
            dispatch(updateDashboardFilters({ status: undefined }))
        } else {
            dispatch(updateDashboardFilters({ status: value as PostStatus }))
        }
    }

    const handleToggleSelection = (postId: string) => {
        dispatch(togglePostSelection(postId))
    }

    const handleSelectAll = () => {
        if (selectedPosts.length === posts.length) {
            dispatch(clearSelection())
        } else {
            dispatch(selectAllPosts(posts.map((p) => p.id)))
        }
    }

    const handleDeletePost = async (postId: string) => {
        setPostToDelete(postId)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        if (!postToDelete) return

        try {
            await deletePost(postToDelete).unwrap()
            toast.success(t('postDeletedSuccess'))
            setShowDeleteDialog(false)
            setPostToDelete(null)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedDeletePost'))
        }
    }

    const handleBulkDelete = () => {
        if (selectedPosts.length > 0) {
            setShowBulkDeleteDialog(true)
        }
    }

    const confirmBulkDelete = async () => {
        dispatch(setBulkActionInProgress(true))
        try {
            await bulkDelete(selectedPosts).unwrap()
            toast.success(t('postsDeletedSuccess', { count: selectedPosts.length }))
            dispatch(clearSelection())
            setShowBulkDeleteDialog(false)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedDeleteSelectedPosts'))
        } finally {
            dispatch(setBulkActionInProgress(false))
        }
    }

    const handleBulkPublish = async () => {
        dispatch(setBulkActionInProgress(true))
        try {
            await bulkUpdateStatus({ ids: selectedPosts, status: PostStatus.PUBLISHED }).unwrap()
            toast.success(t('postsPublished', { count: selectedPosts.length }))
            dispatch(clearSelection())
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedPublishSelectedPosts'))
        } finally {
            dispatch(setBulkActionInProgress(false))
        }
    }

    const handleBulkUnpublish = async () => {
        dispatch(setBulkActionInProgress(true))
        try {
            await bulkUpdateStatus({ ids: selectedPosts, status: PostStatus.DRAFT }).unwrap()
            toast.success(t('postsUnpublished', { count: selectedPosts.length }))
            dispatch(clearSelection())
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedUnpublishSelectedPosts'))
        } finally {
            dispatch(setBulkActionInProgress(false))
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <SpinLoading />
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-red-800 dark:text-red-200">{t('failedToLoadPosts')}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-2">
                    <Input
                        type="text"
                        placeholder={t('searchPosts')}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="max-w-sm"
                    />
                    <Button onClick={handleSearch}>{tc('search')}</Button>
                </div>

                <Select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="sm:w-48"
                >
                    <option value="all">{t('allStatus')}</option>
                    <option value={PostStatus.PUBLISHED}>{t('published')}</option>
                    <option value={PostStatus.PENDING}>{t('pendingApproval')}</option>
                    <option value={PostStatus.DRAFT}>{t('draft')}</option>
                    <option value={PostStatus.ARCHIVED}>{t('archived')}</option>
                </Select>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedPosts.length > 0 && (
                <div className="flex items-center gap-4 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-800 dark:bg-primary-900/20">
                    <span className="font-medium">{t('selected', { count: selectedPosts.length })}</span>
                    <div className="flex flex-1 gap-2">
                        <Button onClick={handleBulkPublish} disabled={bulkActionInProgress} className="text-sm">
                            {t('publishSelected')}
                        </Button>
                        <Button onClick={handleBulkUnpublish} disabled={bulkActionInProgress} className="text-sm">
                            {t('unpublishSelected')}
                        </Button>
                        <Button onClick={handleBulkDelete} disabled={bulkActionInProgress} className="bg-red-600 text-sm hover:bg-red-700">
                            {t('deleteSelected')}
                        </Button>
                    </div>
                    <Button onClick={() => dispatch(clearSelection())} className="text-sm">
                        {t('clearSelection')}
                    </Button>
                </div>
            )}

            {/* Posts Table */}
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.length === posts.length && posts.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                                        />
                                    </th>
                                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold">
                                        {t('post')}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                        {t('stats')}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                        {t('status')}
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                        {t('date')}
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">{t('actions')}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            {t('noPostsFound')}
                                        </td>
                                    </tr>
                                ) : (
                                    posts.map((post) => (
                                        <tr key={post.id} className={selectedPosts.includes(post.id) ? 'bg-primary-50 dark:bg-primary-900/10' : ''}>
                                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPosts.includes(post.id)}
                                                    onChange={() => handleToggleSelection(post.id)}
                                                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                                                />
                                            </td>
                                            <td className="py-5 px-3 text-sm max-w-xs">
                                                <div className="flex items-center gap-3">
                                                    {post.featured_image && (
                                                        <div className="relative h-12 w-12 flex-shrink-0">
                                                            <Image alt={post.title} src={post.featured_image} className="rounded object-cover" fill sizes="48px" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="font-medium line-clamp-2">{post.title}</div>
                                                        {post.category && (<div className="mt-1 text-gray-500 dark:text-gray-400 truncate">{post.category.name}</div>)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm">
                                                <div>{t('views', { count: post.views_count })}</div>
                                                <div className="mt-1 text-gray-500 dark:text-gray-400">{t('comments', { count: post.comments_count })}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm">
                                                <Badge color={post.status === PostStatus.PUBLISHED ? 'green' : post.status === PostStatus.PENDING ? 'amber' : post.status === PostStatus.DRAFT ? 'yellow' : 'zinc'}>
                                                    {post.status === PostStatus.PENDING ? t('pendingApproval') : post.status}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400"> {new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/dashboard/submit-post?id=${post.id}`} className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400">
                                                        {tc('edit')}
                                                    </Link>
                                                    <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                                        {tc('delete')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Dialogs */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('deletePost')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('deletePostConfirm')}
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button onClick={() => setShowDeleteDialog(false)}>{tc('cancel')}</Button>
                        <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">{tc('delete')}</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={showBulkDeleteDialog} onClose={() => setShowBulkDeleteDialog(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('deleteMultiplePosts')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t('deleteMultiplePostsConfirm', { count: selectedPosts.length })}
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button onClick={() => setShowBulkDeleteDialog(false)} disabled={bulkActionInProgress}>{tc('cancel')}</Button>
                        <Button onClick={confirmBulkDelete} disabled={bulkActionInProgress} className="bg-red-600 hover:bg-red-700">
                            {bulkActionInProgress ? tc('deleting') : tc('deleteAll')}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default DashboardPostsManager
