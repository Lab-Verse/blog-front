import { Metadata } from 'next'
import SignupForm from './SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up for a new account',
}

const Page = () => {
  return <SignupForm />
}

export default Page
