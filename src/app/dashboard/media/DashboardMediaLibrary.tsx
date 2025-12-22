'use client'

import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import {
    useGetMediaByUserQuery,
    useUploadMediaMutation,
    useDeleteMediaMutation,
    useBulkDeleteMediaMutation,
} from '@/app/redux/api/media/mediaApi'
import {
    toggleMediaSelection,
    clearSelectedMedia,
    setViewMode,
} from '@/app/redux/slices/media/mediaSlice'
import type { Media } from '@/app/redux/types/media/mediaTypes'
import { Button } from '@/shared/Button'
import SpinLoading from '@/shared/spin-loading'
import Image from 'next/image'
import { Dialog } from '@/shared/dialog'

interface DashboardMediaLibraryProps {
    userId: string
}

const DashboardMediaLibrary: React.FC<DashboardMediaLibraryProps> = ({ userId }) => {
    const dispatch = useAppDispatch()
    const { selectedMediaIds, viewMode } = useAppSelector((state) => state.media)
    const { data: media = [], isLoading, error, refetch } = useGetMediaByUserQuery(userId)
    const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation()
    const [deleteMedia] = useDeleteMediaMutation()
    const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteMediaMutation()

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
    const [previewMedia, setPreviewMedia] = useState<Media | null>(null)

    const toggleView = () => {
        dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'))
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', userId)

        try {
            await uploadMedia(formData).unwrap()
            refetch()
        } catch (err) {
            console.error('Failed to upload media:', err)
        }
    }

    const handleToggleSelection = (mediaId: string) => {
        dispatch(toggleMediaSelection(mediaId))
    }

    const handleDeleteClick = (mediaItem: Media) => {
        setSelectedMedia(mediaItem)
        setShowDeleteDialog(true)
    }

    const handleDelete = async () => {
        if (!selectedMedia) return

        try {
            await deleteMedia(selectedMedia.id).unwrap()
            setShowDeleteDialog(false)
            setSelectedMedia(null)
            refetch()
        } catch (err) {
            console.error('Failed to delete media:', err)
        }
    }

    const handleBulkDelete = async () => {
        try {
            await bulkDelete(selectedMediaIds).unwrap()
            dispatch(clearSelectedMedia())
            setShowBulkDeleteDialog(false)
            refetch()
        } catch (err) {
            console.error('Failed to bulk delete media:', err)
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
                <p className="text-red-800 dark:text-red-200">Failed to load media. Please try again.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <label className="cursor-pointer">
                        <Button as="span" disabled={isUploading}>
                            {isUploading ? 'Uploading...' : 'Upload Media'}
                        </Button>
                        <input
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </label>
                    {selectedMediaIds.length > 0 && (
                        <Button
                            onClick={() => setShowBulkDeleteDialog(true)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete {selectedMediaIds.length} Selected
                        </Button>
                    )}
                </div>
                <Button onClick={toggleView}>
                    {viewMode === 'grid' ? 'List View' : 'Grid View'}
                </Button>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {media.map((item) => {
                        const isSelected = selectedMediaIds.includes(item.id)
                        const isImage = item.mime_type.startsWith('image/')

                        return (
                            <div
                                key={item.id}
                                className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${isSelected
                                        ? 'border-primary-600'
                                        : 'border-gray-200 dark:border-gray-700'
                                    } bg-gray-100 dark:bg-gray-800`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelection(item.id)}
                                    className="absolute left-2 top-2 z-10 h-5 w-5 rounded"
                                />

                                {isImage ? (
                                    <Image
                                        src={item.file_url}
                                        alt={item.filename}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-4xl">📄</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex h-full flex-col items-center justify-center gap-2">
                                        <button
                                            onClick={() => setPreviewMedia(item)}
                                            className="rounded bg-white px-3 py-1 text-sm font-medium text-gray-900"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(item)}
                                            className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2">
                                    <p className="truncate text-xs text-white">{item.filename}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="space-y-2">
                    {media.map((item) => {
                        const isSelected = selectedMediaIds.includes(item.id)

                        return (
                            <div
                                key={item.id}
                                className={`flex items-center gap-4 rounded-lg border p-3 ${isSelected
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelection(item.id)}
                                    className="h-5 w-5 rounded"
                                />
                                <div className="relative h-12 w-12 flex-shrink-0">
                                    {item.mime_type.startsWith('image/') ? (
                                        <Image src={item.file_url} alt={item.filename} fill className="object-cover rounded" sizes="48px" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                                            📄
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-medium">{item.filename}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {(item.file_size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setPreviewMedia(item)} className="text-sm text-primary-600 hover:underline">
                                        Preview
                                    </button>
                                    <button onClick={() => handleDeleteClick(item)} className="text-sm text-red-600 hover:underline">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Dialogs */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Delete Media</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Are you sure you want to delete "{selectedMedia?.filename}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={showBulkDeleteDialog} onClose={() => setShowBulkDeleteDialog(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Delete Multiple Media</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Are you sure you want to delete {selectedMediaIds.length} media items? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button onClick={() => setShowBulkDeleteDialog(false)} disabled={isBulkDeleting}>Cancel</Button>
                        <Button onClick={handleBulkDelete} disabled={isBulkDeleting} className="bg-red-600 hover:bg-red-700">
                            {isBulkDeleting ? 'Deleting...' : 'Delete All'}
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={previewMedia !== null} onClose={() => setPreviewMedia(null)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{previewMedia?.filename}</h3>
                    {previewMedia?.mime_type.startsWith('image/') && (
                        <div className="relative aspect-video">
                            <Image src={previewMedia.file_url} alt={previewMedia.filename} fill className="object-contain" />
                        </div>
                    )}
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <p>Size: {((previewMedia?.file_size || 0) / 1024).toFixed(2)} KB</p>
                        <p>Type: {previewMedia?.mime_type}</p>
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <Button onClick={() => setPreviewMedia(null)}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default DashboardMediaLibrary
