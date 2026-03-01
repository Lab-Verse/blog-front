import { Metadata } from 'next'
import ForgotPasswordForm from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
  robots: { index: false, follow: false },
}

const Page = () => {
  return <ForgotPasswordForm />
}

export default Page
