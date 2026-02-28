import ResetPasswordForm from '@/components/ResetPasswordForm'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set your new password',
  robots: { index: false, follow: false },
}

const Page = () => {
  return (
    <Suspense fallback={<div className="flex justify-center py-20">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}

export default Page
