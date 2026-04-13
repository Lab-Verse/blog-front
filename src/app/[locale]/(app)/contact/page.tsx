import SectionSubscribe2 from '@/components/SectionSubscribe2'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import SocialsList from '@/shared/SocialsList'
import Textarea from '@/shared/Textarea'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { generateAlternateLanguages } from '@/utils/seo'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `editor@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'twa.com.pk'}`
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twa.com.pk'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/contact`,
      languages: generateAlternateLanguages('/contact'),
    },
  }
}

const PageContact = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  const info = [
    { title: t('email'), description: CONTACT_EMAIL },
    { title: t('website'), description: SITE_URL },
  ]

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl">
        <div className="grid shrink-0 grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2">
          <div>
            <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              {t('description')}
            </p>
            <div className="mt-10 flex max-w-sm flex-col gap-y-8 sm:mt-20">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-neutral-200">
                    {item.title}
                  </h3>
                  <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </span>
                </div>
              ))}
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-neutral-200">
                  {t('socials')}
                </h3>
                <SocialsList className="mt-4" />
              </div>
            </div>
          </div>
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <Field className="block">
              <Label>{t('fullName')}</Label>
              <Input placeholder={t('fullNamePlaceholder')} type="text" className="mt-1" />
            </Field>
            <Field className="block">
              <Label>{t('emailAddress')}</Label>
              <Input type="email" placeholder={t('emailPlaceholder')} className="mt-1" />
            </Field>
            <Field className="block">
              <Label>{t('message')}</Label>
              <Textarea className="mt-1" rows={6} placeholder={t('messagePlaceholder')} />
            </Field>
            <div>
              <ButtonPrimary type="submit">{t('sendMessage')}</ButtonPrimary>
            </div>
          </form>
        </div>
      </div>

      <div className="container mt-20 lg:mt-32">
        <Divider />
        <SectionSubscribe2 className="mt-20 lg:mt-32" />
      </div>
    </div>
  )
}

export default PageContact
