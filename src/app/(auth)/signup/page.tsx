import { Metadata } from 'next'
import SignupForm from './SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up for a new account',
  robots: { index: false, follow: false },
}

const Page = () => {
  return <SignupForm />
}

export default Page
