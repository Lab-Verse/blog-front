'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import { useCreatePostMutation } from '@/app/redux/api/posts/postsApi'
import { useGetAllCategoriesQuery } from '@/app/redux/api/categories/categoriesApi'
import { PostStatus } from '@/app/redux/types/posts/postTypes'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Fieldset, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import Textarea from '@/shared/Textarea'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const Page = () => {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [createPost, { isLoading }] = useCreatePostMutation()
  const { data: categories = [] } = useGetAllCategoriesQuery()

  useEffect(() => {
    const token = cookies.getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const decoded: any = jwtDecode(token)
      setUserId(decoded?.sub || '')
    } catch {
      router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Post title is required.')
      return
    }
    if (!content.trim()) {
      setError('Post content is required.')
      return
    }
    if (!categoryId) {
      setError('Please select a category.')
      return
    }

    const slug = slugify(title)

    try {
      await createPost({
        title: title.trim(),
        slug,
        content: content.trim(),
        user_id: userId,
        category_id: categoryId,
        status: PostStatus.DRAFT,
      }).unwrap()
      setSuccess(true)
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        'Failed to submit post. Please try again.'
      setError(message)
    }
  }

  if (!userId) return null

  if (success) {
    return (
      <div className="max-w-5xl rounded-xl md:border md:p-6">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Post Submitted!</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Your post has been saved as a draft. You can manage it from your posts page.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <ButtonPrimary onClick={() => router.push('/dashboard/posts')}>
              View Posts
            </ButtonPrimary>
            <button
              onClick={() => { setSuccess(false); setTitle(''); setContent(''); setExcerpt(''); setCategoryId(''); setTags('') }}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Write Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="max-w-5xl rounded-xl md:border md:p-6" onSubmit={handleSubmit}>
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <Fieldset className="grid gap-6 md:grid-cols-2">
        <Field className="block md:col-span-2">
          <Label>Post Title *</Label>
          <Input
            type="text"
            className="mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title"
          />
        </Field>
        <Field className="block md:col-span-2">
          <Label>Post Excerpt</Label>
          <Textarea
            className="mt-1"
            rows={4}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description for your article"
          />
          <p className="mt-1 text-sm text-neutral-500">Brief description for your article.</p>
        </Field>
        <Field className="block">
          <Label>Category *</Label>
          <Select
            className="mt-1"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">– select –</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field className="block">
          <Label>Tags</Label>
          <Input
            type="text"
            className="mt-1"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags"
          />
        </Field>

        <Field className="block md:col-span-2">
          <Label>Post Content *</Label>
          <Textarea
            className="mt-1"
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
          />
        </Field>

        <div className="md:col-span-2">
          <ButtonPrimary type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit post'}
          </ButtonPrimary>
        </div>
      </Fieldset>
    </form>
  )
}

export default Page
