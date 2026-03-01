/**
 * Post type definitions used by theme UI components.
 * All data is fetched from the real API via @/utils/serverApi
 * and transformed via @/utils/dataTransformers.
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
  postType: 'standard' | 'audio' | 'video' | 'gallery'
  status: string
  author: TPostAuthor
  categories: TPostCategory[]
  audioUrl?: string
  videoUrl?: string
  galleryImgs?: string[]
}

export interface TPostDetail extends TPost {
  content: string
  tags: TPostTag[]
  author: TPostAuthor & { description?: string }
}

export interface TComment {
  id: string
  author: TPostAuthor
  date: string
  content: string
  like: { count: number; isLiked: boolean }
  repliesCount?: number
}
