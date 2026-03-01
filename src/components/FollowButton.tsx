'use client'

import { useGetFollowersByAuthorQuery, useToggleFollowMutation } from '@/app/redux/api/authorfollowers/authorfollowersApi'
import { cookies } from '@/app/redux/utils/cookies'
import { Button } from '@/shared/Button'
import { PlusIcon } from '@heroicons/react/24/solid'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { FC, useMemo } from 'react'

interface Props {
  following?: boolean
  className?: string
  authorId?: string
}

const FollowButton: FC<Props> = ({ className, following, authorId }) => {
  const router = useRouter()
  const token = cookies.getAccessToken()
  const userId = useMemo(() => {
    if (!token) return ''
    try {
      const decoded: { sub?: string } = jwtDecode(token)
      return decoded?.sub || ''
    } catch { return '' }
  }, [token])

  const { data: followers } = useGetFollowersByAuthorQuery(authorId || '', { skip: !authorId })
  const [toggleFollow] = useToggleFollowMutation()

  const existingFollow = useMemo(() => {
    if (!followers || !userId) return undefined
    return followers.find((f: any) => f.follower_id === userId)
  }, [followers, userId])

  const isFollowing = existingFollow ? true : (following ?? false)

  const handleFollow = async () => {
    if (!authorId) return

    if (!token || !userId) {
      router.push('/login')
      return
    }

    // Don't allow following yourself
    if (userId === authorId) return

    try {
      await toggleFollow({
        userId,
        authorId,
        existingFollowId: existingFollow?.id,
      }).unwrap()
    } catch {
      // Error handled by RTK Query
    }
  }

  // Hide follow button if viewing own profile
  if (userId === authorId) return null

  return !isFollowing ? (
    <Button outline className={className} onClick={handleFollow}>
      <PlusIcon className="size-5" />
      Follow
    </Button>
  ) : (
    <Button outline className={className} onClick={handleFollow}>
      Following
    </Button>
  )
}

export default FollowButton
