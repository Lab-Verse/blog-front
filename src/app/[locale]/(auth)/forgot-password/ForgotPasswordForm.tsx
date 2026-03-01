'use client'

import { useState } from 'react'
import { useForgotPasswordMutation } from '@/app/redux/api/auth/authApi'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import { Link } from '@/i18n/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const ForgotPasswordForm = () => {
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError(t('enterEmailRequired'))
      return
    }

    try {
      await forgotPassword({ email }).unwrap()
      toast.success(t('resetLinkSentToast'))
      setSent(true)
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        t('failedSendReset')
      setError(message)
      toast.error(message)
    }
  }

  if (sent) {
    return (
      <div className="container">
        <div className="my-16 flex justify-center">
          <Logo />
        </div>
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{t('checkYourEmail')}</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {t('resetEmailSent', { email })}
            </p>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
              {t('didntReceiveEmail')}
            </p>
          </div>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="inline-block font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400"
          >
            {t('tryAnotherEmail')}
          </button>
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
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('forgotPasswordHeading')}</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {t('forgotPasswordSubheading')}
          </p>
        </div>

        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">{t('emailAddress')}</Label>
            <Input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <ButtonPrimary type="submit" disabled={isLoading}>
            {isLoading ? t('sending') : t('sendResetLink')}
          </ButtonPrimary>
        </form>

        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          {t('rememberPassword')}{' '}
          <Link href="/login" className="font-medium underline">
            {t('signIn')}
          </Link>
          {' | '}
          <Link href="/signup" className="font-medium underline">
            {t('createAnAccount')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
