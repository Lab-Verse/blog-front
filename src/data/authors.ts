/**
 * Author type definition used by theme UI components.
 * All data is fetched from the real API via @/utils/serverApi
 * and transformed via @/utils/dataTransformers.
 */

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
  avatar: {
    src: string
    alt: string
    width: number
    height: number
  }
  cover: {
    src: string
    alt: string
    width: number
    height: number
  }
}
