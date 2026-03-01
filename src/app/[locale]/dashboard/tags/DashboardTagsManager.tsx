'use client'

import React, { useState } from 'react'
import {
    useGetAllTagsQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
    useBulkDeleteTagsMutation,
} from '@/app/redux/api/tags/tagsApi'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { toggleTagSelection, clearSelectedTags, setSearchQuery } from '@/app/redux/slices/tags/tagsSlice'
import type { Tag, CreateTagDto } from '@/app/redux/types/tags/tagTypes'
import { Badge } from '@/shared/Badge'
import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import SpinLoading from '@/shared/spin-loading'
import { Dialog } from '@/shared/dialog'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const DashboardTagsManager: React.FC = () => {
    const t = useTranslations('tags')
    const tc = useTranslations('common')
    const dispatch = useAppDispatch()
    const { selectedTags, searchQuery } = useAppSelector((state) => state.tags)
    const { data: tags = [], isLoading, error, refetch } = useGetAllTagsQuery()
    const [createTag, { isLoading: isCreating }] = useCreateTagMutation()
    const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation()
    const [deleteTag] = useDeleteTagMutation()
    const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteTagsMutation()

    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

    const [formData, setFormData] = useState<CreateTagDto>({
        name: '',
        slug: '',
    })

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSearchChange = (value: string) => {
        dispatch(setSearchQuery(value))
    }

    const handleToggleSelection = (tag: Tag) => {
        dispatch(toggleTagSelection(tag))
    }

    const handleCreateClick = () => {
        setFormData({ name: '', slug: '' })
        setShowCreateDialog(true)
    }

    const handleEditClick = (tag: Tag) => {
        setSelectedTag(tag)
        setFormData({ name: tag.name, slug: tag.slug })
        setShowEditDialog(true)
    }

    const handleDeleteClick = (tag: Tag) => {
        setSelectedTag(tag)
        setShowDeleteDialog(true)
    }

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const handleNameChange = (value: string) => {
        setFormData({ ...formData, name: value, slug: generateSlug(value) })
    }

    const handleCreate = async () => {
        try {
            await createTag(formData).unwrap()
            toast.success(t('tagCreatedSuccess'))
            setShowCreateDialog(false)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedCreateTag'))
        }
    }

    const handleUpdate = async () => {
        if (!selectedTag) return

        try {
            await updateTag({ id: selectedTag.id, data: formData }).unwrap()
            toast.success(t('tagUpdatedSuccess'))
            setShowEditDialog(false)
            setSelectedTag(null)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedUpdateTag'))
        }
    }

    const handleDelete = async () => {
        if (!selectedTag) return

        try {
            await deleteTag(selectedTag.id).unwrap()
            toast.success(t('tagDeletedSuccess'))
            setShowDeleteDialog(false)
            setSelectedTag(null)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedDeleteTag'))
        }
    }

    const handleBulkDelete = async () => {
        try {
            const ids = selectedTags.map(tag => tag.id)
            await bulkDelete(ids).unwrap()
            toast.success(t('tagsDeletedSuccess', { count: ids.length }))
            dispatch(clearSelectedTags())
            setShowBulkDeleteDialog(false)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || t('failedDeleteSelectedTags'))
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
                <p className="text-red-800 dark:text-red-200">{t('failedToLoadTags')}</p>
            </div>
        )
    }

    return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
                type="text"
                placeholder={t('searchTags')}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="max-w-sm"
            />
            <div className="flex gap-2">
                {selectedTags.length > 0 && (
                    <Button onClick={() => setShowBulkDeleteDialog(true)} className="bg-red-600 hover:bg-red-700">
                        {t('deleteSelectedTags', { count: selectedTags.length })}
                    </Button>
                )}
                <Button onClick={handleCreateClick}>{t('createTag')}</Button>
            </div>
        </div>

        <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => {
                const isSelected = selectedTags.some(st => st.id === tag.id)
                return (
                    <div
                        key={tag.id}
                        className={`group relative rounded-full border px-4 py-2 ${isSelected
                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelection(tag)}
                                className="h-4 w-4 rounded"
                            />
                            <span className="font-medium">{tag.name}</span>
                            <Badge color="blue" className="text-xs">{tag.posts_count}</Badge>
                        </div>
                        <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 gap-1 group-hover:flex">
                            <button
                                onClick={() => handleEditClick(tag)}
                                className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                {tc('edit')}
                            </button>
                            <button
                                onClick={() => handleDeleteClick(tag)}
                                className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                            >
                                {tc('delete')}
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Dialogs */}
        <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('createTag')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('name')}</label>
                        <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder={t('tagNamePlaceholder')} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('slug')}</label>
                        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder={t('tagSlugPlaceholder')} />
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <Button onClick={() => setShowCreateDialog(false)}>{tc('cancel')}</Button>
                    <Button onClick={handleCreate} disabled={isCreating || !formData.name}>
                        {isCreating ? t('creating') : tc('create')}
                    </Button>
                </div>
            </div>
        </Dialog>

        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('editTag')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('name')}</label>
                        <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder={t('tagNamePlaceholder')} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('slug')}</label>
                        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder={t('tagSlugPlaceholder')} />
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <Button onClick={() => setShowEditDialog(false)}>{tc('cancel')}</Button>
                    <Button onClick={handleUpdate} disabled={isUpdating || !formData.name}>
                        {isUpdating ? t('updating') : tc('update')}
                    </Button>
                </div>
            </div>
        </Dialog>

        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('deleteTag')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('deleteTagConfirm', { name: selectedTag?.name || '' })}
                </p>
                <div className="flex gap-3 justify-end">
                    <Button onClick={() => setShowDeleteDialog(false)}>{tc('cancel')}</Button>
                    <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">{tc('delete')}</Button>
                </div>
            </div>
        </Dialog>

        <Dialog open={showBulkDeleteDialog} onClose={() => setShowBulkDeleteDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('deleteMultipleTags')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('deleteMultipleTagsConfirm', { count: selectedTags.length })}
                </p>
                <div className="flex gap-3 justify-end">
                    <Button onClick={() => setShowBulkDeleteDialog(false)} disabled={isBulkDeleting}>{tc('cancel')}</Button>
                    <Button onClick={handleBulkDelete} disabled={isBulkDeleting} className="bg-red-600 hover:bg-red-700">
                        {isBulkDeleting ? tc('deleting') : tc('deleteAll')}
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
)
}

export default DashboardTagsManager
