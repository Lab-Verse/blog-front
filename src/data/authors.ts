/**
 * Type definitions for theme author shapes.
 * Matches the return shape of transformAuthor from @/utils/dataTransformers.
 */

export interface TAuthorImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface TAuthor {
  id: string
  name: string
  handle: string
  career: string
  description: string
  count: number
  joinedDate: string
  reviewCount: number
  rating: number
  avatar: TAuthorImage
  cover: TAuthorImage
  website?: string
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
}
