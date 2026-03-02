/**
 * Type definitions for theme category and tag shapes.
 * Matches the return shapes of transformCategory / transformTag
 * from @/utils/dataTransformers.
 */

import type { TPost } from './posts'

export interface TCategoryImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface TCategory {
  id: string
  name: string
  handle: string
  description: string
  color: string
  count: number
  date: string
  thumbnail: TCategoryImage
  posts?: TPost[]
}

export interface TTag {
  id: string
  name: string
  handle: string
  description: string
  color: string
  count: number
  date: string
  thumbnail: TCategoryImage
  posts?: TPost[]
}
