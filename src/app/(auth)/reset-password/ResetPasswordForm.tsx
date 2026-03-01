'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useResetPasswordMutation } from '@/app/redux/api/auth/authApi'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { toast } from 'sonner'

const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.')
      return
    }

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await resetPassword({ token, password }).unwrap()
      toast.success('Password reset successfully!')
      setSuccess(true)
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        'Failed to reset password. The link may have expired.'
      setError(message)
      toast.error(message)
    }
  }

  if (success) {
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
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Password Reset!</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>
          <Link href="/login" className="inline-block font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="container">
        <div className="my-16 flex justify-center">
          <Logo />
        </div>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/20">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Invalid Reset Link</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          <Link href="/forgot-password" className="inline-block font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400">
            Request New Reset Link
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
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Reset Your Password</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Enter your new password below.
          </p>
        </div>

        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">New Password</Label>
            <Input
              type="password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Confirm Password</Label>
            <Input
              type="password"
              className="mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
            />
          </Field>

          <ButtonPrimary type="submit" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </ButtonPrimary>
        </form>

        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          <Link href="/login" className="font-medium underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
