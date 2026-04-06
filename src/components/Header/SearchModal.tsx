'use client'

import type { TPost } from '@/utils/dataTransformers'
import { Button } from '@/shared/Button'
import ButtonCircle from '@/shared/ButtonCircle'
import { Link } from '@/shared/link'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ArrowUpRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FolderDetailsIcon, Search01Icon, Tag02Icon, UserSearchIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import CategoryBadgeList from '../CategoryBadgeList'
import LocalDate from '../LocalDate'
import PostTypeFeaturedIcon from '../PostTypeFeaturedIcon'

interface Option {
  type: 'recommended_searches' | 'quick-action'
  name: string
  icon: IconSvgElement
  uri: string
}

interface SearchAuthor {
  id: string
  name: string
  handle: string
  avatar: string
}

const recommended_searches: Option[] = [
  { type: 'recommended_searches', name: 'Pakistan', icon: Search01Icon, uri: '/search/?s=pakistan' },
  { type: 'recommended_searches', name: 'Technology', icon: Search01Icon, uri: '/search/?s=technology' },
  { type: 'recommended_searches', name: 'Sports', icon: Search01Icon, uri: '/search/?s=sports' },
  { type: 'recommended_searches', name: 'Travel', icon: Search01Icon, uri: '/search/?s=travel' },
  { type: 'recommended_searches', name: 'Business', icon: Search01Icon, uri: '/search/?s=business' },
]

const quickActions: Option[] = [
  { type: 'quick-action', name: 'Go to search page', icon: Search01Icon, uri: '/search/?s=' },
  { type: 'quick-action', name: 'Search authors', icon: UserSearchIcon, uri: '/search/?tab=authors&s=' },
  { type: 'quick-action', name: 'Search categories', icon: FolderDetailsIcon, uri: '/search/?tab=categories&s=' },
  { type: 'quick-action', name: 'Search tags', icon: Tag02Icon, uri: '/search/?tab=tags&s=' },
]

interface Props {
  type: 'type1' | 'type2'
}

const SearchModal: FC<Props> = ({ type = 'type1' }) => {
  const router = useRouter()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<TPost[]>([])
  const [authors, setAuthors] = useState<SearchAuthor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setPosts([])
      setAuthors([])
      return
    }

    setLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const localeParam = locale && locale !== 'en' ? `&locale=${encodeURIComponent(locale)}` : ''
    const encodedQuery = encodeURIComponent(query.trim())

    Promise.all([
      fetch(`${apiUrl}/posts?limit=5&search=${encodedQuery}${localeParam}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${apiUrl}/users?limit=5&search=${encodedQuery}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([postsData, usersData]) => {
      if (postsData) {
        const items = Array.isArray(postsData) ? postsData : postsData?.data || []
        setPosts(
          items.slice(0, 5).map((p: any) => ({
            id: p.id,
            title: p.title || '',
            handle: p.slug || p.id,
            excerpt: p.excerpt || '',
            date: p.published_at || p.created_at || '',
            readingTime: p.reading_time || 2,
            commentCount: p.comments_count || 0,
            viewCount: p.views_count || 0,
            bookmarkCount: 0,
            bookmarked: false,
            likeCount: p.reactions_count || p.likes_count || 0,
            liked: false,
            postType: p.content_type || p.post_type || 'standard',
            status: p.status || 'published',
            featuredImage: {
              src: p.featured_image || '/images/placeholder.png',
              alt: p.title || '',
              width: 1920,
              height: 1080,
            },
            author: {
              id: p.user?.id || '',
              name: p.user?.display_name || p.user?.username || 'Author',
              handle: p.user?.username || '',
              avatar: {
                src: p.user?.profile?.profile_picture || p.user?.avatar || '/images/placeholder.png',
                alt: p.user?.display_name || 'Author',
                width: 128,
                height: 128,
              },
            },
            categories: (p.categories || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              handle: c.slug,
              color: 'blue',
            })),
          }))
        )
      } else {
        setPosts([])
      }

      if (usersData) {
        const usersList = Array.isArray(usersData) ? usersData : usersData?.items || usersData?.data || []
        setAuthors(
          usersList.slice(0, 5).map((u: any) => ({
            id: u.id,
            name: u.display_name || u.username || 'Unknown',
            handle: u.username || '',
            avatar: u.profile?.profile_picture || u.avatar || '/images/placeholder.png',
          }))
        )
      } else {
        setAuthors([])
      }

      setLoading(false)
    })
  }, [query, locale])

  // Debounce
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const handleSearchDebounced = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setQuery(value), 300)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.defaultPrevented) {
        e.preventDefault()
        const value = (e.target as HTMLInputElement).value?.trim()
        if (value) {
          router.push(`/search?s=${encodeURIComponent(value)}`)
          setOpen(false)
          setQuery('')
        }
      }
    },
    [router]
  )

  const hasResults = posts.length > 0 || authors.length > 0

  const buttonOpenModal2 = () => (
    <>
      <div className="hidden md:block">
        <Button outline className="w-full justify-between px-4!" onClick={() => setOpen(true)}>
          <span className="text-sm/6 font-normal text-neutral-500 dark:text-neutral-400">Type to search...</span>
          <HugeiconsIcon icon={Search01Icon} size={24} className="ms-auto" />
        </Button>
      </div>
      <div className="-ms-1 md:hidden">
        <ButtonCircle plain onClick={() => setOpen(true)}>
          <HugeiconsIcon icon={Search01Icon} size={24} />
        </ButtonCircle>
      </div>
    </>
  )

  const buttonOpenModal1 = () => (
    <ButtonCircle plain onClick={() => setOpen(true)}>
      <HugeiconsIcon icon={Search01Icon} size={24} />
    </ButtonCircle>
  )

  return (
    <>
      <>{type === 'type1' ? buttonOpenModal1() : buttonOpenModal2()}</>

      <Dialog
        className="relative z-50"
        open={open}
        onClose={() => {
          setOpen(false)
          setQuery('')
        }}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 z-50 bg-neutral-900/50 transition-opacity duration-300 ease-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-50 hidden-scrollbar flex w-full overflow-y-auto sm:p-6 md:pt-20 md:pb-10">
          <DialogPanel
            transition
            className="mx-auto w-full max-w-2xl transform divide-y divide-gray-100 self-end overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 transition duration-300 ease-out data-closed:translate-y-10 data-closed:opacity-0 sm:self-start sm:rounded-xl dark:divide-gray-700 dark:bg-neutral-800 dark:ring-white/10"
          >
            <Combobox
              onChange={(item: Option | TPost | SearchAuthor | null) => {
                if (!item) return
                if ('uri' in item) {
                  if (item.type === 'recommended_searches') {
                    router.push(item.uri)
                  } else {
                    router.push(item.uri + query)
                  }
                } else if ('postType' in item) {
                  router.push(`/post/${(item as TPost).handle}`)
                } else if ('handle' in item) {
                  router.push(`/author/${(item as SearchAuthor).handle}`)
                }
                setOpen(false)
                setQuery('')
              }}
              form="search-form-combobox"
            >
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute start-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-300"
                  aria-hidden="true"
                />
                <div className="pe-9">
                  <ComboboxInput
                    autoFocus
                    className="h-12 w-full border-0 bg-transparent ps-11 pe-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm dark:text-gray-100 dark:placeholder:text-gray-300"
                    placeholder="Search news, authors, categories..."
                    onChange={handleSearchDebounced}
                    onKeyDown={handleKeyDown}
                    data-autofocus
                  />
                </div>
                <button
                  className="absolute end-3 top-1/2 z-10 -translate-y-1/2 text-xs text-neutral-400 focus:outline-none sm:end-4 dark:text-neutral-300"
                  onClick={() => {
                    setOpen(false)
                    setQuery('')
                  }}
                  type="button"
                >
                  <XMarkIcon className="block h-5 w-5 sm:hidden" />
                  <span className="hidden sm:block">
                    <kbd className="font-sans">Esc</kbd>
                  </span>
                </button>
              </div>

              {loading && query && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-600 dark:border-t-neutral-300" />
                    <span>Searching...</span>
                  </div>
                </div>
              )}

              <ComboboxOptions
                static
                as="ul"
                className="hidden-scrollbar max-h-[70vh] scroll-py-2 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700"
              >
                {/* Posts results */}
                {query !== '' && !loading && posts.length > 0 && (
                  <li className="p-2">
                    <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      News
                    </h2>
                    <ul className="text-sm text-gray-700 dark:text-gray-300">
                      {posts.map((post) => (
                        <ComboboxOption
                          as="li"
                          key={post.id}
                          value={post}
                          className={({ focus }) =>
                            clsx(
                              'relative flex cursor-default items-center select-none rounded-lg',
                              focus && 'bg-neutral-100 dark:bg-neutral-700'
                            )
                          }
                        >
                          <CardPost post={post} />
                        </ComboboxOption>
                      ))}
                    </ul>
                    <div className="mt-2 px-3">
                      <Link
                        href={`/search?s=${encodeURIComponent(query)}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={() => { setOpen(false); setQuery('') }}
                      >
                        View all results
                        <ArrowUpRightIcon className="h-3 w-3" />
                      </Link>
                    </div>
                  </li>
                )}

                {/* Authors results */}
                {query !== '' && !loading && authors.length > 0 && (
                  <li className="p-2">
                    <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Authors
                    </h2>
                    <ul className="text-sm text-gray-700 dark:text-gray-300">
                      {authors.map((author) => (
                        <ComboboxOption
                          as="li"
                          key={author.id}
                          value={author}
                          className={({ focus }) =>
                            clsx(
                              'flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 select-none',
                              focus && 'bg-neutral-100 dark:bg-neutral-700'
                            )
                          }
                        >
                          <Image
                            src={author.avatar.startsWith('http') ? author.avatar : '/images/placeholder.png'}
                            alt={author.name}
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">{author.name}</p>
                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">@{author.handle}</p>
                          </div>
                          <ArrowUpRightIcon className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                        </ComboboxOption>
                      ))}
                    </ul>
                    <div className="mt-2 px-3">
                      <Link
                        href={`/search?s=${encodeURIComponent(query)}&tab=authors`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={() => { setOpen(false); setQuery('') }}
                      >
                        View all authors
                        <ArrowUpRightIcon className="h-3 w-3" />
                      </Link>
                    </div>
                  </li>
                )}

                {/* No results */}
                {query !== '' && !loading && !hasResults && (
                  <li className="p-6 text-center">
                    <HugeiconsIcon icon={Search01Icon} size={32} className="mx-auto text-neutral-300 dark:text-neutral-600" />
                    <p className="mt-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">No results for &quot;{query}&quot;</p>
                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Try a different search term</p>
                  </li>
                )}

                {/* Recommended searches */}
                {query === '' && (
                  <li className="p-2">
                    <h2 className="mt-4 mb-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-300">
                      Recommended searches
                    </h2>
                    <ul className="text-sm text-gray-700 dark:text-gray-300">
                      {recommended_searches.map((item) => (
                        <ComboboxOption
                          as="li"
                          key={item.name}
                          value={item}
                          className={({ focus }) =>
                            clsx(
                              'flex cursor-default items-center rounded-md px-3 py-2 select-none',
                              focus && 'bg-neutral-100 dark:bg-neutral-700'
                            )
                          }
                        >
                          {({ focus }) => (
                            <>
                              <HugeiconsIcon icon={item.icon} size={24} className="h-6 w-6 flex-none text-neutral-400 dark:text-gray-300" />
                              <span className="ms-3 flex-auto truncate">{item.name}</span>
                              {focus && (
                                <span className="ms-3 flex-none text-neutral-500 dark:text-gray-400">
                                  <ArrowUpRightIcon className="inline-block h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </ComboboxOption>
                      ))}
                    </ul>
                  </li>
                )}

                {/* Quick actions */}
                <li className="p-2">
                  <h2 className="sr-only">Quick actions</h2>
                  <ul className="text-sm text-gray-700 dark:text-gray-300">
                    {quickActions.map((action) => (
                      <ComboboxOption
                        as="li"
                        key={action.name}
                        value={action}
                        className={({ focus }) =>
                          clsx(
                            'flex cursor-default items-center rounded-md px-3 py-2 select-none',
                            focus && 'bg-neutral-100 dark:bg-neutral-700'
                          )
                        }
                      >
                        {() => (
                          <>
                            <HugeiconsIcon icon={action.icon} size={24} className="h-6 w-6 flex-none text-neutral-400 dark:text-gray-300" />
                            <span className="ms-3 flex-auto truncate">{action.name}</span>
                            <span className="ms-3 flex-none text-xs font-semibold text-neutral-400 dark:text-gray-300">
                              <ArrowUpRightIcon className="inline-block h-4 w-4" />
                            </span>
                          </>
                        )}
                      </ComboboxOption>
                    ))}
                  </ul>
                </li>
              </ComboboxOptions>
            </Combobox>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

const CardPost = ({ post }: { post: TPost }) => {
  const { title, date, categories, author, featuredImage, postType } = post
  const imgSrc =
    typeof featuredImage === 'string'
      ? featuredImage
      : featuredImage?.src || '/images/placeholder.png'

  return (
    <div className="group relative flex items-center gap-3 rounded-lg p-3 sm:gap-4">
      <div className="relative z-0 h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
        <Image
          sizes="(max-width: 600px) 80px, 100px"
          className="object-cover"
          fill
          src={imgSrc}
          alt={title || 'News Image'}
        />
        <span className="absolute start-1 bottom-1">
          <PostTypeFeaturedIcon wrapSize="h-6 w-6" iconSize="h-3.5 w-3.5" postType={postType} />
        </span>
        <Link className="absolute inset-0" href={`/post/${post.handle}`} />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <span className="capitalize">{author?.name || ''}</span>
            <span className="mx-1">·</span>
            <LocalDate date={date} />
          </p>
          <CategoryBadgeList categories={categories} />
        </div>
        <h4 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900 dark:text-neutral-200">
          <Link className="absolute inset-0" href={`/post/${post.handle}`} />
          {title}
        </h4>
      </div>
    </div>
  )
}

export default SearchModal
