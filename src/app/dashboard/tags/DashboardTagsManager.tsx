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

const DashboardTagsManager: React.FC = () => {
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
            toast.success('Tag created successfully.')
            setShowCreateDialog(false)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create tag.')
        }
    }

    const handleUpdate = async () => {
        if (!selectedTag) return

        try {
            await updateTag({ id: selectedTag.id, data: formData }).unwrap()
            toast.success('Tag updated successfully.')
            setShowEditDialog(false)
            setSelectedTag(null)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update tag.')
        }
    }

    const handleDelete = async () => {
        if (!selectedTag) return

        try {
            await deleteTag(selectedTag.id).unwrap()
            toast.success('Tag deleted successfully.')
            setShowDeleteDialog(false)
            setSelectedTag(null)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete tag.')
        }
    }

    const handleBulkDelete = async () => {
        try {
            const ids = selectedTags.map(t => t.id)
            await bulkDelete(ids).unwrap()
            toast.success(`${ids.length} tags deleted successfully.`)
            dispatch(clearSelectedTags())
            setShowBulkDeleteDialog(false)
            refetch()
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete selected tags.')
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
                <p className="text-red-800 dark:text-red-200">Failed to load tags. Please try again.</p>
            </div>
        )
    }

    return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="max-w-sm"
            />
            <div className="flex gap-2">
                {selectedTags.length > 0 && (
                    <Button onClick={() => setShowBulkDeleteDialog(true)} className="bg-red-600 hover:bg-red-700">
                        Delete {selectedTags.length} Selected
                    </Button>
                )}
                <Button onClick={handleCreateClick}>Create Tag</Button>
            </div>
        </div>

        <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => {
                const isSelected = selectedTags.some(t => t.id === tag.id)
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
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteClick(tag)}
                                className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Dialogs */}
        <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Create Tag</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Tag name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="tag-slug" />
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={isCreating || !formData.name}>
                        {isCreating ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </div>
        </Dialog>

        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Tag</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Tag name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="tag-slug" />
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={isUpdating || !formData.name}>
                        {isUpdating ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </div>
        </Dialog>

        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Delete Tag</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete &quot;{selectedTag?.name}&quot;? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</Button>
                </div>
            </div>
        </Dialog>

        <Dialog open={showBulkDeleteDialog} onClose={() => setShowBulkDeleteDialog(false)}>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Delete Multiple Tags</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete {selectedTags.length} tags? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button onClick={() => setShowBulkDeleteDialog(false)} disabled={isBulkDeleting}>Cancel</Button>
                    <Button onClick={handleBulkDelete} disabled={isBulkDeleting} className="bg-red-600 hover:bg-red-700">
                        {isBulkDeleting ? 'Deleting...' : 'Delete All'}
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
)
}

export default DashboardTagsManager
