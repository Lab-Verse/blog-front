/**
 * Category and Tag type definitions used by theme UI components.
 * All data is fetched from the real API via @/utils/serverApi
 * and transformed via @/utils/dataTransformers.
 */

import type { TPost } from './posts'

export interface TCategory {
  id: string
  name: string
  handle: string
  description?: string
  color: string
  count?: number
  date?: string
  thumbnail?: {
    src: string
    alt: string
    width: number
    height: number
  }
  listing_image?: {
    src: string
    alt: string
    width: number
    height: number
  }
  posts?: TPost[]
}

export interface TTag {
  id: string
  name: string
  handle: string
  description?: string
  color: string
  count?: number
  date?: string
  thumbnail?: {
    src: string
    alt: string
    width: number
    height: number
  }
  posts?: TPost[]
}
