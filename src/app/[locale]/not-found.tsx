import { getTranslations } from 'next-intl/server'
import ButtonPrimary from '@/shared/ButtonPrimary'

export default async function NotFound() {
  const t = await getTranslations('errors')

  return (
    <div className="nc-Page404">
      <div className="relative container py-16 lg:py-20">
        <header className="mx-auto max-w-2xl space-y-7 text-center">
          <h2 className="text-7xl md:text-8xl">{t('notFoundEmoji')}</h2>
          <h1 className="text-8xl font-semibold tracking-widest md:text-9xl">{t('notFound404')}</h1>
          <span className="block text-sm font-medium tracking-wider text-neutral-800 sm:text-base dark:text-neutral-200">
            {t('pageNotFoundMessage')}
          </span>
          <ButtonPrimary href="/" className="mt-4">
            {t('returnHomePage')}
          </ButtonPrimary>
        </header>
      </div>
    </div>
  )
}
