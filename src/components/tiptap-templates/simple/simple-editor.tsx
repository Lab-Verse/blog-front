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
import Logo from '@/shared/Logo'
import SwitchDarkMode from '@/shared/SwitchDarkMode'
import { TagsInput } from '@/shared/TagsInput'
import { useRouter } from 'next/navigation'

// --- API & Auth ---
import { useCreatePostMutation } from '@/app/redux/api/posts/postsApi'
import { useGetAllCategoriesQuery } from '@/app/redux/api/categories/categoriesApi'
import { useGetAllTagsQuery, useCreateTagMutation } from '@/app/redux/api/tags/tagsApi'
import { PostStatus } from '@/app/redux/types/posts/postTypes'
import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import Select from '@/shared/Select'
import { toast } from 'sonner'

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

  // --- API hooks ---
  const [createPost, { isLoading: isSubmitting }] = useCreatePostMutation()
  const [createTag] = useCreateTagMutation()
  const { data: categories = [] } = useGetAllCategoriesQuery()
  const { data: tagsData = [] } = useGetAllTagsQuery()

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
  const [selectedCategoryId, setSelectedCategoryId] = React.useState('')

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
    if (!selectedCategoryId) {
      toast.error('Please select a category.')
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
    formData.append('category_id', selectedCategoryId)
    formData.append('status', status)

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
        formData.append('featured_image', featuredImageUrl)
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

  return (
    <EditorContext.Provider value={{ editor }}>
      <>
        <div className="sticky top-0 z-10 flex h-[var(--tt-toolbar-height)] items-center gap-2 border-b border-neutral-200 bg-[var(--tt-toolbar-bg-color)] px-2 dark:border-neutral-800">
          <div className="flex items-center gap-1">
            <Button data-style="ghost" onClick={() => router.push('/')}>
              <ArrowLeftIcon className="tiptap-button-icon" />
              <span className="text-nowrap">Exit editor</span>
            </Button>
            <span className="me-2 hidden font-light text-neutral-500 sm:block dark:text-neutral-400">/</span>
            <Logo size="size-6" className="hidden! sm:block!" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button data-style="ghost" onClick={() => handlePublish(PostStatus.DRAFT)} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button data-style="ghost" onClick={() => setIsOpenPreview(true)}>
              Publish
            </Button>
            <SwitchDarkMode iconSize="size-4.5" className="size-8!" />
          </div>
        </div>

        <div className="title-wrapper container mt-8 sm:mt-12">
          <div className="mx-auto max-w-screen-md">
            <ImageUploadButton
              className="h-10! ring-2 ring-neutral-200 dark:ring-neutral-600"
              text={featuredImageUrl ? 'Update featured image' : 'Add featured image'}
              editor={featuredImageEditor}
            />
          </div>
          <EditorContent editor={featuredImageEditor} role="presentation" />
          <EditorContent editor={titleEditor} role="presentation" />

          <div className="mx-auto mt-4 max-w-screen-md sm:mt-8">
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

        <Toolbar ref={toolbarRef} className="my-8 sm:my-12">
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

        <div className="content-wrapper container">
          <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
        </div>
      </>

      {/* Publish / Preview Dialog */}
      <Dialog className="mt-4" size="4xl" open={isOpenPreview} onClose={setIsOpenPreview}>
        <DialogTitle>Review &amp; Publish</DialogTitle>
        <DialogBody>
          <div className="flex flex-col gap-5 text-sm/6">
            {/* Category Select */}
            <div className="flex flex-col gap-2">
              <div className="font-medium text-neutral-700 dark:text-neutral-300">Category *</div>
              <Select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">-- Select a category --</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>
            <Divider />

            <div className="flex flex-wrap gap-2.5">
              <div className="text-neutral-600 dark:text-neutral-400">Title:</div>
              <div className="font-medium">{getTitle() || 'No title'}</div>
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
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </SharedButton>
        </DialogActions>
      </Dialog>
    </EditorContext.Provider>
  )
}
