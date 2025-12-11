'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Fieldset, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { useState, useEffect } from 'react'
import { useGetUserByIdQuery, useUpdateUserProfileMutation } from '../../redux/api/users/usersApi'
import { useDispatch } from 'react-redux'
import { usersApi } from '../../redux/api/users/usersApi'
import { AppDispatch } from '../../redux/store'
import { cookies } from '../../redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import Avatar from '@/shared/Avatar'
import { handleImageUpload } from '@/lib/tiptap-utils'

const DashboardEditProfile = () => {
  const [userId, setUserId] = useState('')
  const { data: user, isLoading } = useGetUserByIdQuery(userId, { skip: !userId })
  const [updateUserProfile] = useUpdateUserProfileMutation()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const accessToken = cookies.getAccessToken()
    if (accessToken) {
      const decoded: any = jwtDecode(accessToken)
      setUserId(decoded?.sub || '')
    }
  }, [])

  useEffect(() => {
    if (user?.avatar) {
      setPreview(user.avatar)
    }
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !userId) return

    setUploading(true)
    try {
      const avatarUrl = await handleImageUpload(selectedFile)
      // await updateUserProfile({ userId, data: { avatar: avatarUrl } }).unwrap()
      dispatch(usersApi.util.updateQueryData('getUserById', userId, (draft) => {
        draft!.avatar = avatarUrl
      }))
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to update profile')
    } finally {
      setUploading(false)
    }
  }

  // if (isLoading) return <div>Loading...</div>

  return (
    <form className="max-w-4xl rounded-xl md:border md:p-6" onSubmit={handleSubmit}>
      <Fieldset className="grid gap-6 md:grid-cols-2">
        <Field className="block">
          <Label>First name</Label>
          <Input placeholder="Example Doe" type="text" className="mt-1" />
        </Field>
        <Field className="block">
          <Label>Last name</Label>
          <Input placeholder="Doe" type="text" className="mt-1" />
        </Field>
        <Field className="block">
          <Label>Current password</Label>
          <Input placeholder="***" type="password" className="mt-1" />
        </Field>
        <Field className="block">
          <Label>New password</Label>
          <Input type="password" className="mt-1" />
        </Field>
        <Field className="block md:col-span-2">
          <Label> Email address</Label>
          <Input type="email" placeholder="example@example.com" className="mt-1" />
        </Field>
        <Field className="block md:col-span-2">
          <Label>Profile Picture</Label>
          <div className="mt-1 flex items-center gap-4">
            <Avatar src={preview || '/images/musicWave.png'} className="w-16 h-16" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
        </Field>
        <div className="md:col-span-2">
          <ButtonPrimary type="submit" disabled={uploading}>
            {uploading ? 'Updating...' : 'Update profile'}
          </ButtonPrimary>
        </div>
      </Fieldset>
    </form>
  )
}

export default DashboardEditProfile
