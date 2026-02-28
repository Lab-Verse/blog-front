import { Metadata } from 'next'
import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your account',
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
