'use client'

import { useState } from 'react'
import { useLoginMutation } from '@/app/redux/api/auth/authApi'
import { useRouter } from 'next/navigation'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { setAccessToken } from '@/app/redux/slices/auth/authSlice'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setError('')
  setSuccess('')

  if (!email || !password) {
    setError('Please fill in all fields.')
    return
  }

  try {
    // Call RTK Query mutation – this triggers onQueryStarted internally
    await login({ email, password }).unwrap()

    // Tokens + user are now in cookies / Redux via setCredentials
    setSuccess('Login successful!')

    // Prefer router.push so Next.js handles routing
    router.push('/dashboard')
    // or: router.replace('/dashboard')
  } catch (err: any) {
    // RTK Query fetchBaseQuery-style error handling
    const message =
      err?.data?.message ||
      err?.error ||
      'Login failed. Please check your credentials and try again.'

    setError(message)
  }
}


  return (
    <>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <Field className="block">
          <Label className="text-neutral-800 dark:text-neutral-200">Email address</Label>
          <Input type="email" placeholder="example@example.com" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field className="block">
          <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
            <Label>Password</Label>
            <Link href="/forgot-password" className="text-sm font-medium underline">
              Forgot password?
            </Link>
          </div>
          <Input type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <ButtonPrimary type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</ButtonPrimary>
      </form>
    </>
  )
}

export default LoginForm