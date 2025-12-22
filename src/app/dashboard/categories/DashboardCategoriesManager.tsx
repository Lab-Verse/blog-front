'use client'

import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from '@/app/redux/api/categories/categoriesApi'
import { setSelectedTag, setIsCreating, setIsEditing } from '@/app/redux/slices/tags/tagsSlice'
import type { Category, CreateCategoryDto } from '@/app/redux/types/categories/categoryTypes'
import { Badge } from '@/shared/Badge'
import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import SpinLoading from '@/shared/spin-loading'
import { Dialog } from '@/shared/dialog'

const DashboardCategoriesManager: React.FC = () => {
    const dispatch = useAppDispatch()
    const { data: categories = [], isLoading, error, refetch } = useGetAllCategoriesQuery()
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
    const [deleteCategory] = useDeleteCategoryMutation()

    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const [formData, setFormData] = useState<CreateCategoryDto>({
        name: '',
        slug: '',
        is_active: true,
    })

    const handleCreateClick = () => {
        setFormData({ name: '', slug: '', is_active: true })
        setShowCreateDialog(true)
    }

    const handleEditClick = (category: Category) => {
        setSelectedCategory(category)
        setFormData({
            name: category.name,
            slug: category.slug,
            is_active: category.is_active,
        })
        setShowEditDialog(true)
    }

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category)
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
            await createCategory(formData).unwrap()
            setShowCreateDialog(false)
            refetch()
        } catch (err) {
            console.error('Failed to create category:', err)
        }
    }

    const handleUpdate = async () => {
        if (!selectedCategory) return

        try {
            await updateCategory({ id: selectedCategory.id, data: formData }).unwrap()
            setShowEditDialog(false)
            setSelectedCategory(null)
            refetch()
        } catch (err) {
            console.error('Failed to update category:', err)
        }
    }

    const handleDelete = async () => {
        if (!selectedCategory) return

        try {
            await deleteCategory(selectedCategory.id).unwrap()
            setShowDeleteDialog(false)
            setSelectedCategory(null)
            refetch()
        } catch (err) {
            console.error('Failed to delete category:', err)
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
                <p className="text-red-800 dark:text-red-200">Failed to load categories. Please try again.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Categories</h2>
                <Button onClick={handleCreateClick}>Create Category</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold">{category.name}</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">/{category.slug}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge color={category.is_active ? 'green' : 'zinc'}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {category.posts_count} posts
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button onClick={() => handleEditClick(category)} className="flex-1 text-sm">
                                Edit
                            </Button>
                            <Button
                                onClick={() => handleDeleteClick(category)}
                                className="flex-1 bg-red-600 text-sm hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Create Category</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Category name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="category-slug" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 rounded"
                            />
                            <label className="text-sm">Active</label>
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

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Category name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="category-slug" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 rounded"
                            />
                            <label className="text-sm">Active</label>
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

            {/* Delete Dialog */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Delete Category</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default DashboardCategoriesManager
