'use client'

import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import DashboardPostsManager from './DashboardPostsManager'

const Page = () => {
  const t = useTranslations('posts')
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
        <h1 className="text-3xl font-bold">{t('managePosts')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('managePostsDescription')}
        </p>
      </div>

      <DashboardPostsManager userId={userId} />
    </div>
  )
}

export default Page
