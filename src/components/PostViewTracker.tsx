'use client'

import { cookies } from '@/app/redux/utils/cookies'
import { useEffect, useRef } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface PostViewTrackerProps {
  postId: string
}

/**
 * Invisible client component that records a view for the given post.
 * Fires once on mount with a slight delay to avoid counting quick bounces.
 * Uses the backend's dedup logic (24h per IP/user) to prevent inflated counts.
 */
export default function PostViewTracker({ postId }: PostViewTrackerProps) {
  const hasFired = useRef(false)

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    // Small delay — only count if visitor stays for 2 seconds
    const timer = setTimeout(() => {
      const token = cookies.getAccessToken()

      fetch(`${API_URL}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          viewable_type: 'post',
          viewable_id: postId,
        }),
      }).catch(() => {
        // Silently fail — view tracking should never block the page
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [postId])

  return null
}
