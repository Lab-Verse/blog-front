/**
 * Data transformers to bridge API types (from backend) to Theme types (used by UI components).
 * The purchased theme expects TPost, TCategory, TAuthor shapes from @/data/*.
 * The API returns different shapes. These transformers map between them.
 */

import type { ApiPost, ApiCategory, ApiTag, ApiUser, ApiUserProfile, ApiComment } from './serverApi'

const PLACEHOLDER_IMAGE = '/images/placeholder.png'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// ========================
// Image URL helpers
// ========================

/** Resolve an image URL from the API to a full URL */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER_IMAGE
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${API_URL}${url}`
  return `${API_URL}/${url}`
}

/** Create an image object compatible with theme components */
function makeImage(url?: string | null, alt?: string) {
  return {
    src: resolveImageUrl(url),
    alt: alt || '',
    width: 1920,
    height: 1080,
  }
}

// ========================
// Post Transformer
// ========================

/** Extract categories from a post — handles both legacy `category` and join-table `postCategories` */
function extractCategories(post: ApiPost) {
  // Prefer postCategories (join table) if available
  const pc = (post as any).postCategories
  if (Array.isArray(pc) && pc.length > 0) {
    return pc
      .filter((entry: any) => entry.category)
      .map((entry: any) => ({
        id: entry.category.id,
        name: entry.category.name,
        handle: entry.category.slug,
        color: getCategoryColor(entry.category.name),
      }))
  }
  // Fallback to legacy `category` field
  if (post.category) {
    return [{
      id: post.category.id,
      name: post.category.name,
      handle: post.category.slug,
      color: getCategoryColor(post.category.name),
    }]
  }
  return []
}

/** Extract tags from a post — handles both direct `tags` and join-table `tags[].tag` */
function extractTags(post: ApiPost) {
  const rawTags = post.tags
  if (!Array.isArray(rawTags) || rawTags.length === 0) return []
  return rawTags.map((t: any) => {
    // If it's a join-table entry with nested `tag`, unwrap it
    const tag = t.tag || t
    return {
      id: tag.id || String(t),
      name: tag.name || '',
      handle: tag.slug || tag.handle || '',
      color: getCategoryColor(tag.name || ''),
    }
  })
}

/** Transform an API Post to the theme's TPost shape (content omitted for list/card use) */
export function transformPost(post: ApiPost) {
  const postType = detectPostType(post)

  return {
    id: post.id,
    title: post.title,
    handle: post.slug,
    featuredImage: makeImage(post.featured_image, post.title),
    excerpt: post.excerpt || post.description || (post.content ? stripHtml(post.content).slice(0, 200) : ''),
    date: post.published_at || post.created_at,
    readingTime: estimateReadingTime(post.content || ''),
    commentCount: post.comments_count || 0,
    viewCount: post.views_count || 0,
    bookmarkCount: 0,
    bookmarked: false,
    likeCount: post.likes_count || 0,
    liked: false,
    postType,
    status: post.status,
    author: post.user
      ? {
          id: post.user.id,
          name: post.user.display_name || post.user.username,
          handle: post.user.username,
          avatar: makeImage(post.user.avatar, post.user.username),
        }
      : {
          id: 'unknown',
          name: 'Unknown Author',
          handle: 'unknown',
          avatar: makeImage(null, 'Unknown'),
        },
    categories: extractCategories(post),
    // Audio/video specific fields
    ...(postType === 'audio' && { audioUrl: '' }),
    ...(postType === 'video' && { videoUrl: '' }),
    ...(postType === 'gallery' && { galleryImgs: [] }),
  }
}

/** Transform an array of API Posts */
export function transformPosts(posts: ApiPost[]) {
  return posts.map(transformPost)
}

/** Transform an API Post to a TPostDetail shape (includes content, tags, etc) */
export function transformPostDetail(
  post: ApiPost,
  tags?: ApiTag[],
  comments?: ApiComment[]
) {
  const base = transformPost(post)

  return {
    ...base,
    content: post.content || '',
    tags: tags && tags.length > 0
      ? tags.map((t: any) => ({
          id: t.id || String(t),
          name: t.name || '',
          handle: t.slug || t.handle || '',
          color: getCategoryColor(t.name || ''),
        }))
      : extractTags(post),
    // Enrich author with description from profile
    author: {
      ...base.author,
      description: post.user?.bio || '',
    },
    galleryImgs: post.gallery_images || [],
    videoUrl: post.video_url || '',
    audioUrl: post.audio_url || '',
  }
}

// ========================
// Category Transformer
// ========================

/** Color palette for categories */
const CATEGORY_COLORS = [
  'indigo', 'blue', 'red', 'green', 'yellow',
  'pink', 'purple', 'orange', 'teal', 'gray',
]

export function getCategoryColor(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}

/** Transform an API Category to the theme's TCategory shape */
export function transformCategory(category: ApiCategory, posts?: ApiPost[]) {
  return {
    id: category.id,
    name: category.name,
    handle: category.slug,
    description: `Explore ${category.name} articles and news`,
    color: getCategoryColor(category.name),
    count: category.posts_count || 0,
    date: category.created_at,
    thumbnail: makeImage(null, category.name),
    ...(posts && { posts: transformPosts(posts) }),
  }
}

/** Transform an array of API Categories */
export function transformCategories(categories: ApiCategory[]) {
  return categories.map((c) => transformCategory(c))
}

/** Transform categories with their posts */
export function transformCategoriesWithPosts(
  categories: ApiCategory[],
  categoryPostsMap: Map<string, ApiPost[]>
) {
  return categories.map((c) =>
    transformCategory(c, categoryPostsMap.get(c.id) || [])
  )
}

// ========================
// Tag Transformer
// ========================

/** Transform an API Tag to the theme's TTag shape */
export function transformTag(tag: ApiTag, posts?: ApiPost[]) {
  return {
    id: tag.id,
    name: tag.name,
    handle: tag.slug,
    description: `Posts tagged with ${tag.name}`,
    color: getCategoryColor(tag.name),
    count: tag.posts_count || 0,
    date: tag.created_at || '',
    thumbnail: makeImage(null, tag.name),
    ...(posts && { posts: transformPosts(posts) }),
  }
}

/** Transform an array of API Tags */
export function transformTags(tags: ApiTag[]) {
  return tags.map((t) => transformTag(t))
}

// ========================
// Author Transformer
// ========================

/** Transform an API User to the theme's TAuthor shape */
export function transformAuthor(
  user: ApiUser,
  profile?: ApiUserProfile | null,
  postCount?: number
) {
  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.display_name || user.username
    : user.display_name || user.username

  return {
    id: user.id,
    name: displayName,
    handle: user.username,
    career: profile?.job_title || profile?.company || '',
    description: profile?.bio || '',
    count: postCount ?? profile?.posts_count ?? 0,
    joinedDate: user.created_at || '',
    reviewCount: 0,
    rating: 0,
    avatar: makeImage(
      profile?.profile_picture || user.avatar,
      displayName
    ),
    cover: makeImage(null, displayName),
  }
}

/** Transform an array of API Users to theme authors */
export function transformAuthors(
  users: ApiUser[],
  profilesMap?: Map<string, ApiUserProfile>
) {
  return users.map((u) => transformAuthor(u, profilesMap?.get(u.id)))
}

// ========================
// Comment Transformer
// ========================

/** Transform an API Comment to the theme's TComment shape */
export function transformComment(comment: ApiComment, index: number = 0) {
  return {
    id: index + 1,
    author: comment.user
      ? {
          id: comment.user.id,
          name: comment.user.display_name || comment.user.username,
          handle: comment.user.username,
          avatar: makeImage(comment.user.avatar, comment.user.username),
        }
      : {
          id: 'anonymous',
          name: 'Anonymous',
          handle: 'anonymous',
          avatar: makeImage(null, 'Anonymous'),
        },
    date: comment.created_at,
    content: comment.content,
    like: { count: comment.likes_count || 0, isLiked: false },
  }
}

/** Transform an array of API Comments */
export function transformComments(comments: ApiComment[]) {
  return comments.map((c, i) => transformComment(c, i))
}

// ========================
// Utilities
// ========================

/** Strip HTML tags from a string */
function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

/** Estimate reading time in minutes */
function estimateReadingTime(content: string): number {
  if (!content) return 1
  const text = stripHtml(content)
  const wordCount = text.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

/** Detect post type based on content/metadata */
function detectPostType(
  post: ApiPost
): 'standard' | 'audio' | 'video' | 'gallery' {
  // Check if post slug or content hints at audio/video
  const title = post.title?.toLowerCase() || ''
  const content = post.content?.toLowerCase() || ''

  if (
    title.includes('audio') ||
    title.includes('podcast') ||
    title.includes('music') ||
    title.includes('symphony') ||
    title.includes('jazz') ||
    content.includes('<audio') ||
    content.includes('soundcloud.com')
  ) {
    return 'audio'
  }

  if (
    title.includes('video') ||
    content.includes('youtube.com') ||
    content.includes('vimeo.com') ||
    content.includes('<video') ||
    content.includes('youtu.be')
  ) {
    return 'video'
  }

  return 'standard'
}
