'use client'

import React, { useState, useEffect } from 'react'
import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useUploadProfilePictureMutation,
} from '@/app/redux/api/users/usersApi'
import type { UpdateUserProfileDto } from '@/app/redux/types/users/userTypes'
import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import SpinLoading from '@/shared/spin-loading'
import Image from 'next/image'

interface DashboardProfileEditorProps {
    userId: string
}

const DashboardProfileEditor: React.FC<DashboardProfileEditorProps> = ({ userId }) => {
    const { data: profile, isLoading, error, refetch } = useGetUserProfileQuery(userId)
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation()
    const [uploadAvatar, { isLoading: isUploading }] = useUploadProfilePictureMutation()

    const [formData, setFormData] = useState<UpdateUserProfileDto>({
        first_name: '',
        last_name: '',
        bio: '',
        phone: '',
        location: '',
        website_url: '',
        company: '',
        job_title: '',
    })

    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                bio: profile.bio || '',
                phone: profile.phone || '',
                location: profile.location || '',
                website_url: profile.website_url || '',
                company: profile.company || '',
                job_title: profile.job_title || '',
            })
            if (profile.profile_picture) {
                setPreviewImage(profile.profile_picture)
            }
        }
    }, [profile])

    const handleInputChange = (field: keyof UpdateUserProfileDto, value: string) => {
        setFormData({ ...formData, [field]: value })
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Preview image
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload image
        try {
            await uploadAvatar({ userId, file }).unwrap()
            refetch()
            showSuccess('Profile picture updated successfully!')
        } catch (err) {
            console.error('Failed to upload profile picture:', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await updateProfile({ userId, data: formData }).unwrap()
            refetch()
            showSuccess('Profile updated successfully!')
        } catch (err) {
            console.error('Failed to update profile:', err)
        }
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(null), 3000)
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
                <p className="text-red-800 dark:text-red-200">Failed to load profile. Please try again.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Success Message */}
            {successMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                    <p className="text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
            )}

            {/* Profile Picture */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        {previewImage ? (
                            <Image src={previewImage} alt="Profile" fill className="object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-4xl text-gray-400">
                                👤
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="cursor-pointer">
                            <Button type="button" as="span" disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Change Picture'}
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </label>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            JPG, PNG or GIF. Max 5MB.
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <Input
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            placeholder="John"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <Input
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            placeholder="Doe"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <Textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                    />
                </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="San Francisco, CA"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-1">Website URL</label>
                        <Input
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => handleInputChange('website_url', e.target.value)}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                </div>
            </div>

            {/* Professional Information */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <Input
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Company Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Title</label>
                        <Input
                            value={formData.job_title}
                            onChange={(e) => handleInputChange('job_title', e.target.value)}
                            placeholder="Software Engineer"
                        />
                    </div>
                </div>
            </div>

            {/* Profile Stats (Read-only) */}
            {profile && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Profile Stats</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                            <p className="mt-1 text-2xl font-bold">{profile.posts_count}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                            <p className="mt-1 text-2xl font-bold">{profile.followers_count}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                            <p className="mt-1 text-2xl font-bold">{profile.following_count}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <Button type="button" onClick={() => window.location.href = '/dashboard'} className="bg-gray-600 hover:bg-gray-700">
                    Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}

export default DashboardProfileEditor
