import { ApplicationLayout } from '@/app/[locale]/(app)/application-layout'
import BackgroundSection from '@/components/BackgroundSection'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAuthors'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { fetchAuthors, fetchCategories } from '@/utils/serverApi'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

// Default cover/avatar images for authors missing them
const defaultCover = {
  src: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80',
  alt: 'Cover',
  width: 1920,
  height: 1080,
}

const defaultAvatar = {
  src: '/images/placeholder.png',
  alt: 'Avatar',
  width: 128,
  height: 128,
}

const Layout = async ({ children, params }: Props) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('search')
  const tc = await getTranslations('common')

  let categories: any[] = []
  let authors: any[] = []

  try {
    const apiCategories = await fetchCategories()
    categories = apiCategories.slice(0, 10).map((cat: any, i: number) => ({
      id: cat.id,
      name: cat.name,
      handle: cat.slug,
      description: cat.description || '',
      count: cat.post_count || 0,
      thumbnail: {
        src: cat.image || `https://images.unsplash.com/photo-${1639322537228 + i}?w=400&q=80`,
        alt: cat.name,
        width: 400,
        height: 300,
      },
      listing_image: {
        src: cat.image || `https://images.unsplash.com/photo-${1639322537228 + i}?w=1920&q=80`,
        alt: cat.name,
        width: 1920,
        height: 1080,
      },
    }))
  } catch {
    categories = []
  }

  try {
    const apiAuthors = await fetchAuthors()
    authors = apiAuthors.slice(0, 10).map((user: any) => ({
      id: user.id,
      name: user.display_name || user.username || 'Author',
      handle: user.username || 'unknown',
      career: user.profile?.bio || '',
      description: user.profile?.bio || '',
      count: 0,
      joinedDate: user.created_at || '',
      reviewCount: 0,
      rating: 0,
      avatar: {
        src: user.avatar || user.profile?.profile_picture_url || defaultAvatar.src,
        alt: user.display_name || user.username || 'Avatar',
        width: 128,
        height: 128,
      },
      cover: { ...defaultCover },
    }))
  } catch {
    authors = []
  }

  return (
    <ApplicationLayout>
      {children}

      <div className="container space-y-16 py-16 lg:space-y-28 lg:pt-20 lg:pb-28">
        <div className="relative py-16 lg:py-20">
          <BackgroundSection />
          <SectionGridCategoryBox categories={categories.slice(0, 10) as any} />
          <div className="mx-auto mt-10 text-center md:mt-16">
            <ButtonPrimary>{tc('showMore')}</ButtonPrimary>
          </div>
        </div>

        <SectionSliderNewAuthors
          heading={t('topEliteAuthors')}
          subHeading={t('discoverEliteWriters')}
          authors={authors.slice(0, 10) as any}
        />

        <SectionSubscribe2 />
      </div>
    </ApplicationLayout>
  )
}

export default Layout
