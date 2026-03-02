/**
 * Type definitions for theme post shapes.
 * These types match the return shapes of transformPost / transformPostDetail
 * from @/utils/dataTransformers.
 */

export interface TPostImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface TPostAuthor {
  id: string
  name: string
  handle: string
  avatar: TPostImage
  description?: string
}

export interface TPostCategory {
  id: string
  name: string
  handle: string
  color: string
}

export interface TPostTag {
  id: string
  name: string
  handle: string
  color: string
}

export type TPostType = 'standard' | 'video' | 'gallery' | 'audio'

/** Card-level post (no content) — returned by transformPost / transformPosts */
export interface TPost {
  id: string
  title: string
  handle: string
  featuredImage: TPostImage
  excerpt: string
  date: string
  readingTime: number
  commentCount: number
  viewCount: number
  bookmarkCount: number
  bookmarked: boolean
  likeCount: number
  liked: boolean
  postType: TPostType
  status: string
  author: TPostAuthor
  categories: TPostCategory[]
  audioUrl?: string
  videoUrl?: string
  galleryImgs?: string[]
}

/** Full post detail (includes content, tags) — returned by transformPostDetail */
export interface TPostDetail extends TPost {
  content: string
  tags: TPostTag[]
  galleryImgs: string[]
  videoUrl: string
  audioUrl: string
}

/** Comment on a post — matches transformComment output */
export interface TComment {
  id: string
  content: string
  date: string
  like: { count: number; isLiked: boolean }
  repliesCount: number
  author: TPostAuthor
  parentId?: string | null
  children?: TComment[]
}
