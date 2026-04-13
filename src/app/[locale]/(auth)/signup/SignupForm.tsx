"use client";

import { useState, useRef } from 'react'
import { useRegisterMutation } from '@/app/redux/api/auth/authApi'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import { Link } from '@/i18n/navigation'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const MAX_CV_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const SignupForm = () => {
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [register, { isLoading }] = useRegisterMutation()

  const validateCvFile = (file: File): string | null => {
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      return t('cvInvalidType')
    }
    if (file.size > MAX_CV_SIZE) {
      return t('cvTooLarge')
    }
    return null
  }

  const handleCvSelect = (file: File) => {
    const error = validateCvFile(file)
    if (error) {
      toast.error(error)
      return
    }
    setCvFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleCvSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password || !username || !phone) {
      setError(t('fillAllFields'))
      return
    }

    if (password.length < 8) {
      setError(t('passwordMinLength'))
      return
    }

    try {
      await register({ email, password, username, phone, cv: cvFile || undefined }).unwrap()
      toast.success(t('accountCreatedToast'))
      setRegistered(true)
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        t('signupFailed')
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
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{t('accountCreatedTitle')}</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {t('accountCreatedMessage')}
            </p>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
              {t('accountCreatedNote')}
            </p>
          </div>
          <Link href="/login" className="inline-block font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400">
            {t('goToLogin')}
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
            <Label className="text-neutral-800 dark:text-neutral-200">{t('username')}</Label>
            <Input
              type="text"
              placeholder={t('usernamePlaceholder')}
              className="mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          
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

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">{t('phoneNumber')}</Label>
            <Input
              type="tel"
              placeholder={t('phonePlaceholder')}
              className="mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>

          <Field className="block">
            <Label className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">{t('password')}</Label>
            <Input
              type="password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {/* CV Upload */}
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">
              {t('cvUpload')}
              <span className="ml-1 text-xs text-neutral-500">({t('cvOptional')})</span>
            </Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-1 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : cvFile
                    ? 'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
                    : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleCvSelect(file)
                }}
              />
              {cvFile ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">{cvFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCvFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t('cvDragDrop')}</p>
                  <p className="mt-1 text-xs text-neutral-500">{t('cvAllowedFormats')}</p>
                </div>
              )}
            </div>
          </Field>

          <ButtonPrimary type="submit" disabled={isLoading}>
            {isLoading ? t('signingUp') : t('signUpButton')}
          </ButtonPrimary>
        </form>

        {/* Already have an account */}
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="font-medium underline">
            {t('signIn')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
