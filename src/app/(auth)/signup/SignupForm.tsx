"use client";

import { useState } from 'react'
import { useRegisterMutation } from '@/app/redux/api/auth/authApi'
import { setCredentials } from '@/app/redux/slices/auth/authSlice'
import { useDispatch } from 'react-redux'
import { cookies } from '@/app/redux/utils/cookies'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [register, { isLoading }] = useRegisterMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!email || !password || !username) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const userData = { email, password, username, role: 'user' } 

      const response = await register(userData).unwrap()

      const data = response.data
      if (!data) {
        throw new Error('Registration failed: no data returned')
      }

      // On successful registration, set credentials (accessToken, refreshToken, and user)
      const { accessToken, refreshToken, user } = data
      dispatch(setCredentials({ accessToken, refreshToken, user }))

      // Set the tokens in cookies
      cookies.setAuthTokens(accessToken, refreshToken)

      setSuccess('Account created successfully!')

      // Redirect to dashboard (or another page)
      router.push('/dashboard')
    } catch (err: any) {
      const message =
      err?.data?.message ||
      err?.error ||
      'Signup failed. Please check your credentials and try again.'

    setError(message)
    }
  }

  return (
    <div className="container">
      <div className="my-16 flex justify-center">
        <Logo />
      </div>

      <div className="mx-auto max-w-md space-y-6">
        {/* Form */}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Username</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              className="mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Email address</Label>
            <Input
              type="email"
              placeholder="example@example.com"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field className="block">
            <Label className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">Password</Label>
            <Input
              type="password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <ButtonPrimary type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </ButtonPrimary>
        </form>

        {/* Already have an account */}
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignupForm