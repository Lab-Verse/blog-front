'use client'

import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import DashboardProfileEditor from './DashboardProfileEditor'

const Page = () => {
  const t = useTranslations('profile')
  const router = useRouter()
  const token = cookies.getAccessToken()
  const userId = useMemo(() => {
    if (!token) return ''
    try {
      const decoded: { sub?: string } = jwtDecode(token)
      return decoded?.sub || ''
    } catch { return '' }
  }, [token])

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('editProfile')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('editProfileDescription')}
        </p>
      </div>

      <DashboardProfileEditor userId={userId} />
    </div>
  )
}

export default Page
