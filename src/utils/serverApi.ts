/**
 * Server-side API utility for fetching data from the backend.
 * Used by server components (pages) that cannot use RTK Query hooks.
 * Implements Next.js fetch caching and revalidation.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface FetchOptions {
  revalidate?: number | false
  tags?: string[]
  cache?: RequestCache
  /** When provided, appends ?locale=xx to the request URL (for backends that support it) */
  locale?: string
}

// ========================
// Translation types
// ========================

export interface ApiPostTranslation {
  id: string
  post_id: string
  locale: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ApiCategoryTranslation {
  id: string
  category_id: string
  locale: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ApiTagTranslation {
  id: string
  tag_id: string
  locale: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 60, tags, cache, locale } = options

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      ...(revalidate !== undefined && { revalidate }),
      ...(tags && { tags }),
    },
    ...(cache && { cache }),
  }

  // Append locale query param when provided and not default English
  let finalEndpoint = endpoint
  if (locale && locale !== 'en') {
    const sep = endpoint.includes('?') ? '&' : '?'
    finalEndpoint = `${endpoint}${sep}locale=${locale}`
  }

  const url = `${API_URL}${finalEndpoint}`

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      console.warn(`[ServerAPI] ${response.status} ${response.statusText}: ${endpoint}`)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const json = await response.json()

    // Handle various API envelope formats:
    // { data: T } or { items: T } or direct T
    if (json && typeof json === 'object' && !Array.isArray(json)) {
      if ('data' in json) return json.data as T
      if ('items' in json) return json.items as T
    }

    return json as T
  } catch (error) {
    // Suppress verbose stack traces for connection errors (e.g. backend not running during build)
    const isConnError =
      error instanceof TypeError && (error.message === 'fetch failed' || error.cause?.toString().includes('ECONNREFUSED'))
    if (isConnError) {
      console.warn(`[ServerAPI] Backend unavailable — skipped ${endpoint}`)
    } else {
      console.error(`[ServerAPI] Failed to fetch ${endpoint}:`, error)
    }
    throw error
  }
}

// ========================
// Posts
// ========================

export interface ApiPost {
  id: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  description?: string
  user_id: string
  category_id: string
  status: string
  featured_image?: string
  views_count: number
  likes_count: number
  comments_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  post_date_gmt?: string
  post_modified_gmt?: string
  user?: ApiUser
  category?: ApiCategory
  tags?: ApiTag[]
  // Media fields (may or may not exist depending on post type)
  video_url?: string
  audio_url?: string
  gallery_images?: string[]
}

export interface ApiUser {
  id: string
  username: string
  email: string
  display_name?: string
  role?: string
  role_id?: string
  status?: string
  avatar?: string
  bio?: string
  created_at?: string
  updated_at?: string
}

export interface ApiUserProfile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  bio?: string
  profile_picture?: string
  phone?: string
  location?: string
  website_url?: string
  company?: string
  job_title?: string
  posts_count: number
  followers_count: number
  following_count: number
  created_at: string
  updated_at: string
  user?: ApiUser
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  parent_id?: string | null
  posts_count: number
  followers_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  parent?: ApiCategory
  children?: ApiCategory[]
}

export interface ApiTag {
  id: string
  name: string
  slug: string
  posts_count: number
  created_at?: string
  updated_at?: string
}

export interface ApiComment {
  id: string
  post_id: string
  user_id: string
  content: string
  parent_id?: string | null
  likes_count: number
  replies_count: number
  created_at: string
  updated_at: string
  user?: ApiUser
}

/** Fetch published posts with pagination. Returns an array (extracts from paginated envelope). */
export async function fetchPosts(filters?: {
  category?: string
  user?: string
  limit?: number
  page?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  search?: string
}): Promise<ApiPost[]> {
  const params = new URLSearchParams()
  if (filters?.category) params.append('category', filters.category)
  if (filters?.user) params.append('user', filters.user)
  if (filters?.limit) params.append('limit', String(filters.limit))
  if (filters?.page) params.append('page', String(filters.page))
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
  if (filters?.search) params.append('search', filters.search)
  const query = params.toString() ? `?${params.toString()}` : ''

  try {
    const result = await serverFetch<ApiPost[] | { data: ApiPost[]; total?: number }>(`/posts${query}`, {
      revalidate: 60,
      tags: ['posts'],
    })
    // Handle both array and paginated { data, total } envelope formats
    let posts: ApiPost[]
    if (Array.isArray(result)) {
      posts = result
    } else if (result && typeof result === 'object' && 'data' in result) {
      posts = result.data
    } else {
      posts = []
    }
    // Safety net: if the API ignores the limit param, enforce it client-side
    if (filters?.limit && posts.length > filters.limit) {
      posts = posts.slice(0, filters.limit)
    }
    return posts
  } catch {
    return []
  }
}

/** Fetch posts and total count (paginated). Use when you need total for pagination UI. */
export async function fetchPostsPaginated(filters?: {
  category?: string
  user?: string
  limit?: number
  page?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  search?: string
}): Promise<{ posts: ApiPost[]; total: number }> {
  const params = new URLSearchParams()
  if (filters?.category) params.append('category', filters.category)
  if (filters?.user) params.append('user', filters.user)
  if (filters?.limit) params.append('limit', String(filters.limit))
  if (filters?.page) params.append('page', String(filters.page))
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
  if (filters?.search) params.append('search', filters.search)
  const query = params.toString() ? `?${params.toString()}` : ''

  try {
    // serverFetch unwraps { data: T } envelopes, so the new { data, total } response
    // gets its `data` unwrapped. We need the raw response for `total`.
    const url = `${API_URL}/posts${query}`
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60, tags: ['posts'] },
    })
    if (!res.ok) return { posts: [], total: 0 }
    const json = await res.json()
    const posts = Array.isArray(json) ? json : (json?.data || [])
    const total = json?.total ?? posts.length
    return { posts, total }
  } catch {
    return { posts: [], total: 0 }
  }
}

/** Fetch a single post by slug using the dedicated endpoint */
export async function fetchPostBySlug(slug: string): Promise<ApiPost | null> {
  try {
    return await serverFetch<ApiPost>(`/posts/slug/${encodeURIComponent(slug)}`, {
      revalidate: 60,
      tags: ['posts', `post-slug-${slug}`],
    })
  } catch {
    return null
  }
}

/** Fetch a single post by ID */
export async function fetchPostById(id: string): Promise<ApiPost | null> {
  try {
    return await serverFetch<ApiPost>(`/posts/${id}`, {
      revalidate: 60,
      tags: ['posts', `post-${id}`],
    })
  } catch {
    return null
  }
}

/** Fetch comments for a post (uses /comments?postId=X which loads user relations) */
export async function fetchPostComments(postId: string): Promise<ApiComment[]> {
  try {
    return await serverFetch<ApiComment[]>(`/comments?postId=${postId}`, {
      revalidate: 30,
      tags: ['comments', `post-comments-${postId}`],
    })
  } catch {
    return []
  }
}

// ========================
// Categories
// ========================

/** Fetch all categories */
export async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const result = await serverFetch<ApiCategory[] | { items: ApiCategory[] }>('/categories', {
      revalidate: 300, // 5 minutes
      tags: ['categories'],
    })
    if (Array.isArray(result)) return result
    if (result && typeof result === 'object' && 'items' in result) return result.items
    return []
  } catch {
    return []
  }
}

/** Fetch a single category by ID */
export async function fetchCategoryById(id: string): Promise<ApiCategory | null> {
  try {
    return await serverFetch<ApiCategory>(`/categories/${id}`, {
      revalidate: 300,
      tags: ['categories', `category-${id}`],
    })
  } catch {
    return null
  }
}

/** Fetch a category by slug */
export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  try {
    const categories = await fetchCategories()
    return categories.find((c) => c.slug === slug) || null
  } catch {
    return null
  }
}

/** Fetch posts for a specific category */
export async function fetchCategoryPosts(categoryId: string): Promise<ApiPost[]> {
  try {
    const result = await serverFetch<ApiPost[] | { items: ApiPost[]; data: ApiPost[] }>(`/categories/${categoryId}/posts`, {
      revalidate: 60,
      tags: ['posts', `category-posts-${categoryId}`],
    })
    if (Array.isArray(result)) return result
    if (result && typeof result === 'object') {
      if ('items' in result && Array.isArray(result.items)) return result.items
      if ('data' in result && Array.isArray(result.data)) return result.data
    }
    return []
  } catch {
    return []
  }
}

/** Get categories organized as a tree (parent + children) */
export function buildCategoryTree(categories: ApiCategory[]): ApiCategory[] {
  const parentCategories = categories.filter((c) => !c.parent_id)
  return parentCategories.map((parent) => ({
    ...parent,
    children: categories.filter((c) => c.parent_id === parent.id),
  }))
}

// ========================
// Tags
// ========================

/** Fetch all tags */
export async function fetchTags(): Promise<ApiTag[]> {
  try {
    const result = await serverFetch<ApiTag[] | { items: ApiTag[] }>('/tags', {
      revalidate: 300,
      tags: ['tags'],
    })
    if (Array.isArray(result)) return result
    if (result && typeof result === 'object' && 'items' in result) return Array.isArray(result.items) ? result.items : []
    return result as ApiTag[]
  } catch {
    return []
  }
}

/** Fetch a tag by slug */
export async function fetchTagBySlug(slug: string): Promise<ApiTag | null> {
  try {
    const tags = await fetchTags()
    return tags.find((t) => t.slug === slug) || null
  } catch {
    return null
  }
}

/** Fetch posts for a tag */
export async function fetchTagPosts(tagId: string): Promise<ApiPost[]> {
  try {
    return await serverFetch<ApiPost[]>(`/tags/${tagId}/posts`, {
      revalidate: 60,
      tags: ['posts', `tag-posts-${tagId}`],
    })
  } catch {
    return []
  }
}

// ========================
// Users / Authors
// ========================

/** Fetch all users (for author listings) - now public endpoint */
export async function fetchAuthors(): Promise<ApiUser[]> {
  try {
    const data = await serverFetch<ApiUser[]>('/users?limit=100')
    const result = Array.isArray(data) ? data : (data as any)?.items || []
    return result
  } catch {
    return []
  }
}

/** Fetch user by ID (requires auth - use only in authenticated contexts) */
export async function fetchUserById(
  id: string,
  accessToken?: string
): Promise<ApiUser | null> {
  try {
    const url = `${API_URL}/users/${id}`
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      next: { revalidate: 120, tags: [`user-${id}`] },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data || json
  } catch {
    return null
  }
}

/** Fetch user profile by user ID */
export async function fetchUserProfile(
  userId: string,
  accessToken?: string
): Promise<ApiUserProfile | null> {
  try {
    const url = `${API_URL}/users/${userId}/profile`
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      next: { revalidate: 120, tags: [`user-profile-${userId}`] },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data || json
  } catch {
    return null
  }
}

// ========================
// Search
// ========================

/** Find an author by username using the API */
export async function fetchAuthorByUsername(username: string): Promise<{
  user: ApiUser | null
  posts: ApiPost[]
} | null> {
  try {
    // Use the dedicated username endpoint
    const url = `${API_URL}/users/username/${encodeURIComponent(username)}`
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 120, tags: [`author-${username}`] },
    })
    if (!res.ok) return null
    const user = await res.json()
    if (!user || !user.id) return null

    // Fetch their posts using paginated endpoint
    const postsUrl = `${API_URL}/posts?user=${user.id}&limit=50`
    const postsRes = await fetch(postsUrl, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60, tags: [`author-posts-${user.id}`] },
    })
    let posts: ApiPost[] = []
    if (postsRes.ok) {
      const postsData = await postsRes.json()
      posts = Array.isArray(postsData) ? postsData : (postsData?.data || postsData?.items || [])
    }

    return { user, posts }
  } catch {
    return null
  }
}

export interface SearchResults {
  posts: ApiPost[]
  categories: ApiCategory[]
  tags: ApiTag[]
  authors: ApiUser[]
  totalResults: number
}

/** Search across posts, categories, tags, and authors using backend search */
export async function searchAll(query: string): Promise<SearchResults> {
  try {
    // Use the dedicated search endpoint for posts (SQL ILIKE — efficient)
    const [searchedPosts, allCategories, allTags] = await Promise.all([
      fetchPosts({ search: query, limit: 50 }),
      fetchCategories(),
      fetchTags(),
    ])

    const q = query.toLowerCase()

    const categories = allCategories.filter((c) =>
      c.name.toLowerCase().includes(q)
    )

    const tags = allTags.filter((t) => t.name.toLowerCase().includes(q))

    // Extract unique authors from searched posts
    const authorMap = new Map<string, ApiUser>()
    for (const post of searchedPosts) {
      if (post.user) {
        authorMap.set(post.user.id, post.user)
      }
    }
    const authors = Array.from(authorMap.values())

    return {
      posts: searchedPosts,
      categories,
      tags,
      authors,
      totalResults: searchedPosts.length + categories.length + tags.length + authors.length,
    }
  } catch {
    return { posts: [], categories: [], tags: [], authors: [], totalResults: 0 }
  }
}

// ========================
// Translations
// ========================

/** Fetch all translations for a post */
export async function fetchPostTranslations(postId: string): Promise<ApiPostTranslation[]> {
  try {
    return await serverFetch<ApiPostTranslation[]>(`/posts/${postId}/translations`, {
      revalidate: 300,
      tags: [`post-translations-${postId}`],
    })
  } catch {
    return []
  }
}

/** Fetch a single translation for a post in a specific locale */
export async function fetchPostTranslation(
  postId: string,
  locale: string
): Promise<ApiPostTranslation | null> {
  if (locale === 'en') return null
  try {
    const translations = await fetchPostTranslations(postId)
    return translations.find((t) => t.locale === locale) || null
  } catch {
    return null
  }
}

/** Fetch all translations for a category */
export async function fetchCategoryTranslations(categoryId: string): Promise<ApiCategoryTranslation[]> {
  try {
    return await serverFetch<ApiCategoryTranslation[]>(`/categories/${categoryId}/translations`, {
      revalidate: 300,
      tags: [`category-translations-${categoryId}`],
    })
  } catch {
    return []
  }
}

/** Fetch a single translation for a category in a specific locale */
export async function fetchCategoryTranslation(
  categoryId: string,
  locale: string
): Promise<ApiCategoryTranslation | null> {
  if (locale === 'en') return null
  try {
    const translations = await fetchCategoryTranslations(categoryId)
    return translations.find((t) => t.locale === locale) || null
  } catch {
    return null
  }
}

/** Fetch all translations for a tag */
export async function fetchTagTranslations(tagId: string): Promise<ApiTagTranslation[]> {
  try {
    return await serverFetch<ApiTagTranslation[]>(`/tags/${tagId}/translations`, {
      revalidate: 300,
      tags: [`tag-translations-${tagId}`],
    })
  } catch {
    return []
  }
}

/** Fetch a single translation for a tag in a specific locale */
export async function fetchTagTranslation(
  tagId: string,
  locale: string
): Promise<ApiTagTranslation | null> {
  if (locale === 'en') return null
  try {
    const translations = await fetchTagTranslations(tagId)
    return translations.find((t) => t.locale === locale) || null
  } catch {
    return null
  }
}

/** Apply post translation overlay — merges translated fields onto the base post */
export function applyPostTranslation(post: ApiPost, translation: ApiPostTranslation | null): ApiPost {
  if (!translation) return post
  return {
    ...post,
    title: translation.title || post.title,
    slug: translation.slug || post.slug,
    content: translation.content ?? post.content,
    excerpt: translation.excerpt ?? post.excerpt,
    description: translation.description ?? post.description,
  }
}

/** Apply category translation overlay */
export function applyCategoryTranslation(
  category: ApiCategory,
  translation: ApiCategoryTranslation | null
): ApiCategory {
  if (!translation) return category
  return {
    ...category,
    name: translation.name || category.name,
    slug: translation.slug || category.slug,
  }
}

/** Apply tag translation overlay */
export function applyTagTranslation(tag: ApiTag, translation: ApiTagTranslation | null): ApiTag {
  if (!translation) return tag
  return {
    ...tag,
    name: translation.name || tag.name,
    slug: translation.slug || tag.slug,
  }
}
