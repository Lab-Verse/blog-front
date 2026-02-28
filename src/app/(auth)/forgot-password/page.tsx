import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
  robots: { index: false, follow: false },
}

const Page = () => {
  return <ForgotPasswordForm />
}

export default Page
