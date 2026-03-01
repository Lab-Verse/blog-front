'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useResetPasswordMutation } from '@/app/redux/api/auth/authApi'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import { Link } from '@/i18n/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const ResetPasswordForm = () => {
  const t = useTranslations('auth')
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
      setError(t('invalidResetToken'))
      return
    }

    if (!password || !confirmPassword) {
      setError(t('fillBothPasswordFields'))
      return
    }

    if (password.length < 8) {
      setError(t('passwordMinLength'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      return
    }

    try {
      await resetPassword({ token, password }).unwrap()
      toast.success(t('passwordResetSuccess'))
      setSuccess(true)
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        t('passwordResetFailed')
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
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{t('passwordResetTitle')}</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {t('passwordResetMessage')}
            </p>
          </div>
          <Link href="/login" className="inline-block font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400">
            {t('goToLogin')}
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
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{t('invalidResetLinkTitle')}</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {t('invalidResetLinkMessage')}
            </p>
          </div>
          <Link href="/forgot-password" className="inline-block font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400">
            {t('requestNewResetLink')}
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
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('resetYourPassword')}</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {t('enterNewPasswordBelow')}
          </p>
        </div>

        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">{t('newPassword')}</Label>
            <Input
              type="password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('newPasswordPlaceholder')}
            />
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">{t('confirmPassword')}</Label>
            <Input
              type="password"
              className="mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
            />
          </Field>

          <ButtonPrimary type="submit" disabled={isLoading}>
            {isLoading ? t('resetting') : t('resetPasswordButton')}
          </ButtonPrimary>
        </form>

        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          <Link href="/login" className="font-medium underline">
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
