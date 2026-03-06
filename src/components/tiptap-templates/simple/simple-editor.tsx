'use client'

import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import * as React from 'react'

// --- Tiptap Core Extensions ---
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { Text } from '@tiptap/extension-text'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'

// --- Custom Extensions ---
import { Link } from '@/components/tiptap-extension/link-extension'
import { Selection } from '@/components/tiptap-extension/selection-extension'
import { TrailingNode } from '@/components/tiptap-extension/trailing-node-extension'
import Placeholder from '@tiptap/extension-placeholder'

// --- UI Primitives ---
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'

// --- Tiptap Node ---
import '@/components/tiptap-node/image-node/image-node.scss'
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

// --- Tiptap UI ---
import { BlockQuoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from '@/components/tiptap-ui/color-highlight-popover'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button'
import { LinkButton, LinkContent, LinkPopover } from '@/components/tiptap-ui/link-popover'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon'
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon'
import { LinkIcon } from '@/components/tiptap-icons/link-icon'

// --- Hooks ---
import { useMobile } from '@/hooks/use-mobile'

// --- Components ---

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils'

// --- Styles ---
import '@/components/tiptap-templates/simple/simple-editor.scss'

import { OnlyOneHeading, SingleHeadingDocument } from '@/components/tiptap-extension/single-heading-document'
import { SingleImageDocument } from '@/components/tiptap-extension/single-image-document'
import { Button as SharedButton } from '@/shared/Button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/shared/dialog'
import { Divider } from '@/shared/divider'
import SwitchDarkMode from '@/shared/SwitchDarkMode'
import { TagsInput } from '@/shared/TagsInput'
import { useRouter } from 'next/navigation'

// --- API & Auth ---
import { useCreatePostMutation, useUpdatePostMutation, useGetPostByIdQuery } from '@/app/redux/api/posts/postsApi'
import { useGetAllCategoriesQuery } from '@/app/redux/api/categories/categoriesApi'
import { useGetAllTagsQuery, useCreateTagMutation } from '@/app/redux/api/tags/tagsApi'
import { useGetUserByIdQuery } from '@/app/redux/api/users/usersApi'
import { PostStatus } from '@/app/redux/types/posts/postTypes'
import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
        <BlockQuoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>
      <Spacer />
    </>
  )
}

const MobileToolbarContent = ({ type, onBack }: { type: 'highlighter' | 'link'; onBack: () => void }) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
)

export function SimpleEditor() {
  // --- Auth ---
  const [userId, setUserId] = React.useState('')
  React.useEffect(() => {
    const token = cookies.getAccessToken()
    if (token) {
      try {
        const decoded: { sub?: string } = jwtDecode(token)
        setUserId(decoded?.sub || '')
      } catch { /* ignore */ }
    }
  }, [])

  // --- Edit mode ---
  const searchParams = useSearchParams()
  const editId = searchParams.get('id') || ''
  const isEditMode = Boolean(editId)

  // --- API hooks ---
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation()
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const [createTag] = useCreateTagMutation()
  const { data: categories = [] } = useGetAllCategoriesQuery()
  const { data: tagsData = [] } = useGetAllTagsQuery()
  const { data: existingPost, isLoading: isLoadingPost } = useGetPostByIdQuery(editId, { skip: !editId })
  const { data: currentUser } = useGetUserByIdQuery(userId, { skip: !userId })
  const isSubmitting = isCreating || isUpdating

  // Determine if the user can write opinion posts (columnist or admin)
  const isColumnist = currentUser?.profile?.is_columnist === true
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin'
  const canWriteOpinion = isColumnist || isAdmin

  // Map API tags to TagsInput format
  const topicsSuggestions = React.useMemo(
    () => tagsData.map((t: any) => ({ id: t.id, name: t.name })),
    [tagsData]
  )

  const isMobile = useMobile()
  const [mobileView, setMobileView] = React.useState<'main' | 'highlighter' | 'link'>('main')
  const toolbarRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [selectedTags, setSelectedTags] = React.useState<typeof topicsSuggestions>([])
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState('')
  const [isOpenPreview, setIsOpenPreview] = React.useState(false)
  const [selectedCategories, setSelectedCategories] = React.useState<{ id: string; name: string }[]>([])
  const [categoryQuery, setCategoryQuery] = React.useState('')
  const [editPopulated, setEditPopulated] = React.useState(false)
  const [postType, setPostType] = React.useState<string>('standard')
  const [excerpt, setExcerpt] = React.useState('')

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        class: 'prose mx-auto max-w-screen-md dark:prose-invert lg:prose-lg',
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Placeholder.configure({
        placeholder: ({ node }) => {
          return 'Write, type "/" for commands...'
        },
      }),
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 5,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: ``,
  })

  const featuredImageEditor = useEditor({
    immediatelyRender: false,
    editable: false, // important...
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Featured image area, start typing to enter text.',
        class: 'prose mx-auto max-w-screen-md dark:prose-invert lg:prose-lg featuredImageEditor',
      },
    },
    extensions: [
      SingleImageDocument,
      StarterKit,
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 1,
        upload: handleImageUpload,
        onError: (error) => {
          console.error('Upload failed:', error)
          setFeaturedImageUrl('')
        },
        onSuccess: (url) => {
          setFeaturedImageUrl(url)
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getJSON()
      if (content.content?.some((node) => node.type === 'imageUpload')) {
        setFeaturedImageUrl('')
      }
    },
  })

  const titleEditor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Title area, start typing to enter text.',
        class: 'prose mx-auto max-w-screen-md dark:prose-invert lg:prose-lg titleEditor',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          return true
        }
        return false
      },
    },
    extensions: [
      SingleHeadingDocument,
      OnlyOneHeading.configure({
        levels: [1],
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          return 'Write a title...'
        },
      }),
      Text,
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getJSON()
      if (content.content && content.content.length > 1) {
        editor.commands.setContent('<h1>' + content?.content?.[0]?.content?.[0]?.text + '</h1>')
      }
    },
    content: '<h1></h1>',
  })

  // --- Populate editors in edit mode ---
  React.useEffect(() => {
    if (!isEditMode || !existingPost || editPopulated) return
    if (!editor || !titleEditor) return

    // Set title
    if (existingPost.title) {
      titleEditor.commands.setContent(`<h1>${existingPost.title}</h1>`)
    }

    // Set content
    if (existingPost.content) {
      editor.commands.setContent(existingPost.content)
    }

    // Set featured image
    if (existingPost.featured_image) {
      setFeaturedImageUrl(existingPost.featured_image)
      if (featuredImageEditor) {
        featuredImageEditor.commands.setContent(
          `<img src="${existingPost.featured_image}" alt="Featured image" />`
        )
      }
    }

    // Set tags from post.tags (PostTag[] with nested tag)
    if (existingPost.tags && existingPost.tags.length > 0) {
      const mapped = existingPost.tags
        .filter((pt: any) => pt.tag)
        .map((pt: any) => ({ id: pt.tag.id, name: pt.tag.name }))
      setSelectedTags(mapped)
    }

    // Set categories from post.postCategories (with nested category)
    if (existingPost.postCategories && existingPost.postCategories.length > 0) {
      const mapped = existingPost.postCategories
        .filter((pc: any) => pc.category)
        .map((pc: any) => ({ id: pc.category.id, name: pc.category.name }))
      setSelectedCategories(mapped)
    } else if (existingPost.category) {
      // Fallback: single legacy category
      setSelectedCategories([{ id: existingPost.category.id, name: existingPost.category.name }])
    }

    // Set excerpt
    if (existingPost.excerpt) {
      setExcerpt(existingPost.excerpt)
    }

    // Set post type
    if (existingPost.post_type) {
      setPostType(existingPost.post_type)
    }

    setEditPopulated(true)
  }, [isEditMode, existingPost, editor, titleEditor, featuredImageEditor, editPopulated])

  const getTitle = () => {
    if (!titleEditor) return ''
    const content = titleEditor.getJSON()
    return content.content?.[0]?.content?.[0]?.text || ''
  }

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '')

  const handlePublish = async (status: PostStatus = PostStatus.DRAFT) => {
    const title = getTitle()
    if (!title) {
      toast.error('Please add a title for your post.')
      return
    }
    const htmlContent = editor?.getHTML() || ''
    if (!htmlContent || htmlContent === '<p></p>') {
      toast.error('Please add some content to your post.')
      return
    }
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category.')
      return
    }
    if (!userId) {
      toast.error('You must be logged in to publish.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slugify(title))
    formData.append('content', htmlContent)
    formData.append('user_id', userId)
    // Legacy single category_id (first selected)
    formData.append('category_id', selectedCategories[0].id)
    formData.append('status', status)

    // Excerpt
    if (excerpt.trim()) {
      formData.append('excerpt', excerpt.trim())
    }

    // Post type (only send opinion if user has permission)
    if (postType && postType !== 'standard') {
      formData.append('post_type', postType)
    }

    // Multi-category support
    for (const cat of selectedCategories) {
      formData.append('category_ids[]', cat.id)
    }

    if (featuredImageUrl) {
      // If it's a base64 data URL, convert to a File for upload
      if (featuredImageUrl.startsWith('data:')) {
        try {
          const res = await fetch(featuredImageUrl)
          const blob = await res.blob()
          const file = new File([blob], 'featured-image.jpg', { type: blob.type })
          formData.append('featured_image', file)
        } catch {
          formData.append('featured_image', featuredImageUrl)
        }
      } else {
        // In edit mode, don't re-send existing URL as featured_image unless it changed
        if (!isEditMode || featuredImageUrl !== existingPost?.featured_image) {
          formData.append('featured_image', featuredImageUrl)
        }
      }
    }

    if (selectedTags.length > 0) {
      // Resolve any newly-created tags (non-UUID ids) by creating them on the backend first
      const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      for (const tag of selectedTags) {
        if (isUUID(tag.id)) {
          formData.append('tag_ids[]', tag.id)
        } else {
          // New tag — create on backend to get a real UUID
          try {
            const created = await createTag({ name: tag.name, slug: slugify(tag.name) }).unwrap()
            if (created?.id) {
              formData.append('tag_ids[]', created.id)
            }
          } catch {
            // Tag might already exist — try to find it from cached tags
            const existing = tagsData.find((t: any) => t.name.toLowerCase() === tag.name.toLowerCase())
            if (existing?.id) {
              formData.append('tag_ids[]', existing.id)
            }
          }
        }
      }
    }

    try {
      if (isEditMode) {
        await updatePost({ id: editId, data: formData }).unwrap()
        toast.success('Post updated successfully!')
      } else {
        const result = await createPost(formData).unwrap()
        if (status === PostStatus.PUBLISHED) {
          // Backend may downgrade to PENDING if user lacks can_publish permission
          const resultStatus = (result as any)?.status as string | undefined
          if (resultStatus === 'pending' || resultStatus === PostStatus.PENDING) {
            toast.success('Your post has been submitted for review. It will be published once approved by an admin.')
          } else {
            toast.success('Post published successfully!')
          }
        } else {
          toast.success('Post saved as draft!')
        }
      }
      router.push('/dashboard/posts')
    } catch (err: any) {
      const message =
        err?.data?.message || err?.error || 'Failed to submit post. Please try again.'
      toast.error(message)
    }
  }

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main')
    }
  }, [isMobile, mobileView])

  if (isEditMode && isLoadingPost) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-neutral-500">Loading post...</p>
      </div>
    )
  }

  // Filtered categories for searchable multi-select
  const filteredCategories = categories.filter((cat: any) => {
    const isAlreadySelected = selectedCategories.some((s) => s.id === cat.id)
    const matchesQuery = cat.name.toLowerCase().includes(categoryQuery.toLowerCase())
    return !isAlreadySelected && matchesQuery
  })

  return (
    <EditorContext.Provider value={{ editor }}>
      <>
        <div className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-neutral-200 bg-white/95 backdrop-blur-sm px-4 dark:border-neutral-800 dark:bg-neutral-950/95">
          <div className="flex items-center gap-2">
            <Button data-style="ghost" onClick={() => router.push('/dashboard/posts')}>
              <ArrowLeftIcon className="tiptap-button-icon" />
              <span className="text-nowrap text-sm font-medium">Exit editor</span>
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              data-style="ghost"
              onClick={() => handlePublish(PostStatus.DRAFT)}
              disabled={isSubmitting}
              className="text-sm!"
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              data-style="ghost"
              onClick={() => setIsOpenPreview(true)}
              className="text-sm! rounded-lg! bg-neutral-900! text-white! hover:bg-neutral-800! dark:bg-white! dark:text-neutral-900! dark:hover:bg-neutral-200! px-4! py-1.5!"
            >
              {isEditMode ? 'Update' : 'Publish'}
            </Button>
            <SwitchDarkMode iconSize="size-4.5" className="size-8!" />
          </div>
        </div>

        <div className="title-wrapper container mt-10 sm:mt-14">
          <div className="mx-auto max-w-screen-md">
            <ImageUploadButton
              className="h-10! rounded-lg! ring-1! ring-neutral-300! hover:ring-neutral-400! dark:ring-neutral-600! dark:hover:ring-neutral-500! transition-all"
              text={featuredImageUrl ? 'Update featured image' : 'Add featured image'}
              editor={featuredImageEditor}
            />
          </div>
          <EditorContent editor={featuredImageEditor} role="presentation" />
          <EditorContent editor={titleEditor} role="presentation" />

          <div className="mx-auto mt-4 max-w-screen-md sm:mt-6">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief excerpt or summary of your post..."
              rows={2}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-neutral-200 bg-transparent px-4 py-3 text-base text-neutral-700 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-0 dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500"
            />
          </div>

          <div className="mx-auto mt-5 max-w-screen-md sm:mt-8">
            <TagsInput
              value={selectedTags}
              suggestions={topicsSuggestions}
              onChange={setSelectedTags}
              placeholder="Add a topic..."
              maxTags={5}
              className="w-full"
            />
          </div>
        </div>

        <Toolbar ref={toolbarRef} className="my-6 sm:my-10">
          {mobileView === 'main' ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView('highlighter')}
              onLinkClick={() => setMobileView('link')}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
              onBack={() => setMobileView('main')}
            />
          )}
        </Toolbar>

        <div className="content-wrapper container pb-20">
          <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
        </div>
      </>

      {/* Publish / Preview Dialog */}
      <Dialog className="mt-4" size="4xl" open={isOpenPreview} onClose={setIsOpenPreview}>
        <DialogTitle>{isEditMode ? 'Review & Update' : 'Review & Publish'}</DialogTitle>
        <DialogBody>
          <div className="flex flex-col gap-5 text-sm/6">
            {/* Searchable multi-category select (chips) */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-neutral-700 dark:text-neutral-300">Categories *</div>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-neutral-300 px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {cat.name}
                      <button
                        type="button"
                        onClick={() => setSelectedCategories(selectedCategories.filter((c) => c.id !== cat.id))}
                        className="hover:text-red-600 focus:outline-none"
                        aria-label={`Remove ${cat.name}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="min-w-32 flex-1 border-none bg-transparent px-0 py-0.5 text-sm outline-none placeholder:text-neutral-500 focus:ring-0 dark:text-white dark:placeholder:text-neutral-400"
                    placeholder={selectedCategories.length > 0 ? 'Add more...' : 'Search categories...'}
                    value={categoryQuery}
                    onChange={(e) => setCategoryQuery(e.target.value)}
                  />
                </div>
                {categoryQuery && filteredCategories.length > 0 && (
                  <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    {filteredCategories.map((cat: any) => (
                      <li
                        key={cat.id}
                        className="cursor-pointer px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-white/10"
                        onClick={() => {
                          setSelectedCategories([...selectedCategories, { id: cat.id, name: cat.name }])
                          setCategoryQuery('')
                        }}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                )}
                {categoryQuery && filteredCategories.length === 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white p-2 text-sm text-neutral-500 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    No categories found
                  </div>
                )}
              </div>
            </div>

            {/* Post Type selector — only show if author has Opinion access */}
            {canWriteOpinion && (
              <>
                <Divider />
                <div className="flex flex-col gap-2">
                  <div className="font-medium text-neutral-700 dark:text-neutral-300">Post Type</div>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="opinion">Opinion</option>
                  </select>
                </div>
              </>
            )}

            <Divider />

            <div className="flex flex-wrap gap-2.5">
              <div className="text-neutral-600 dark:text-neutral-400">Title:</div>
              <div className="font-medium">{getTitle() || 'No title'}</div>
            </div>
            <Divider />

            <div className="flex flex-col gap-1">
              <div className="text-neutral-600 dark:text-neutral-400">Excerpt:</div>
              <div className="text-sm">{excerpt || <span className="italic text-neutral-400">No excerpt (will auto-generate from content)</span>}</div>
            </div>
            <Divider />

            <div className="flex flex-wrap gap-2.5">
              <div className="text-neutral-600 dark:text-neutral-400">Tags:</div>
              <div>{selectedTags.map((tag) => tag.name).join(', ') || 'No tags'}</div>
            </div>
            <Divider />

            <div className="flex flex-col gap-2.5">
              <div className="text-neutral-600 dark:text-neutral-400">Featured image:</div>
              <div className="line-clamp-1">{featuredImageUrl ? 'Uploaded' : 'No featured image'}</div>
            </div>
            <Divider />

            <div className="flex flex-col gap-2.5">
              <div className="text-neutral-600 dark:text-neutral-400">Content preview:</div>
              <div
                className="prose prose-sm max-h-40 overflow-y-auto rounded border border-neutral-200 p-3 dark:prose-invert dark:border-neutral-700"
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '<p>No content</p>' }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <SharedButton plain onClick={() => setIsOpenPreview(false)} disabled={isSubmitting}>
            Cancel
          </SharedButton>
          <SharedButton
            plain
            onClick={() => handlePublish(PostStatus.DRAFT)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </SharedButton>
          <SharedButton
            onClick={() => handlePublish(PostStatus.PUBLISHED)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update' : 'Publish')}
          </SharedButton>
        </DialogActions>
      </Dialog>
    </EditorContext.Provider>
  )
}
