'use client'

import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardPostsManager from './DashboardPostsManager'

const Page = () => {
  const [userId, setUserId] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const token = cookies.getAccessToken()
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const decoded: any = jwtDecode(token)
      setUserId(decoded?.sub || '')
    } catch {
      router.push('/login')
    }
  }, [router])

  if (!userId) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create, edit, and manage your blog posts
        </p>
      </div>

      <DashboardPostsManager userId={userId} />
    </div>
  )
}

export default Page
