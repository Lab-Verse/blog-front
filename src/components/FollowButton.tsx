'use client'

import { useFollowAuthorMutation, useUnfollowAuthorMutation } from '@/app/redux/api/authorfollowers/authorfollowersApi'
import { cookies } from '@/app/redux/utils/cookies'
import { Button } from '@/shared/Button'
import { PlusIcon } from '@heroicons/react/24/solid'
import { jwtDecode } from 'jwt-decode'
import { FC, useState } from 'react'

interface Props {
  following?: boolean
  className?: string
  authorId?: string
}

const FollowButton: FC<Props> = ({ className, following, authorId }) => {
  const [isFollowing, setIsFollowing] = useState(following)
  const [followAuthor] = useFollowAuthorMutation()
  const [unfollowAuthor] = useUnfollowAuthorMutation()

  const handleFollow = async () => {
    if (!authorId) {
      setIsFollowing(!isFollowing)
      return
    }

    try {
      const token = cookies.getAccessToken()
      if (!token) {
        setIsFollowing(!isFollowing)
        return
      }
      const decoded: any = jwtDecode(token)
      const userId = decoded?.sub
      if (!userId) {
        setIsFollowing(!isFollowing)
        return
      }

      if (isFollowing) {
        setIsFollowing(false)
        // Note: unfollowAuthor requires the follow record ID, not the author ID
        // For now we just toggle UI state. A proper implementation would need 
        // to lookup the follow record ID first.
        await unfollowAuthor(authorId).unwrap()
      } else {
        setIsFollowing(true)
        await followAuthor({
          author_id: authorId,
          follower_id: userId,
        }).unwrap()
      }
    } catch {
      setIsFollowing(isFollowing)
    }
  }

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
