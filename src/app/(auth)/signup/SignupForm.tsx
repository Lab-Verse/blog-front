"use client";

import { useState } from 'react'
import { useRegisterMutation } from '@/app/redux/api/auth/authApi'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { toast } from 'sonner'

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  
  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password || !username) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    try {
      await register({ email, password, username }).unwrap()
      // Registration successful - account is PENDING admin approval
      toast.success('Account created! Awaiting admin approval.')
      setRegistered(true)
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        'Signup failed. Please try again.'
      setError(message)
      toast.error(message)
    }
  }

  if (registered) {
    return (
      <div className="container">
        <div className="my-16 flex justify-center">
          <Logo />
        </div>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 dark:border-green-800 dark:bg-green-900/20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Account Created!</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Your account has been created successfully and is now <strong>pending approval</strong>.
              An administrator will review and activate your account shortly.
            </p>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
              You will be able to log in once your account has been approved.
            </p>
          </div>
          <Link href="/login" className="inline-block font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400">
            Go to Login
          </Link>
        </div>
      </div>
    )
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