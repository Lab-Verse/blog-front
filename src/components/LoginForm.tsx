'use client'

import { useState } from 'react'
import { useLoginMutation } from '@/app/redux/api/auth/authApi'
import { useRouter } from '@/i18n/navigation'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import { Link } from '@/i18n/navigation'
import { useDispatch } from 'react-redux'
import { setAccessToken } from '@/app/redux/slices/auth/authSlice'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const LoginForm = () => {
  const t = useTranslations('auth')
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
    setError(t('fillAllFields'))
    return
  }

  try {
    await login({ email, password }).unwrap()

    setSuccess(t('loginSuccessRedirecting'))
    toast.success(t('loginSuccessRedirecting'))

    router.push('/dashboard')
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.error ||
      t('loginFailed')

    setError(message)
    toast.error(message)
  }
}


  return (
    <>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <Field className="block">
          <Label className="text-neutral-800 dark:text-neutral-200">{t('emailAddress')}</Label>
          <Input type="email" placeholder={t('emailPlaceholder')} className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field className="block">
          <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
            <Label>{t('password')}</Label>
            <Link href="/forgot-password" className="text-sm font-medium underline">
              {t('forgotPassword')}
            </Link>
          </div>
          <Input type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <ButtonPrimary type="submit" disabled={isLoading}>{isLoading ? t('loggingIn') : t('loginButton')}</ButtonPrimary>
      </form>
    </>
  )
}

export default LoginForm