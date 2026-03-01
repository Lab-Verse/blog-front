import { ApplicationLayout } from '@/app/[locale]/(app)/application-layout'
import BackgroundSection from '@/components/BackgroundSection'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAuthors'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { fetchAuthors } from '@/utils/serverApi'
import { ReactNode } from 'react'

const defaultAvatar = {
  src: '/images/placeholder.png',
  alt: 'Avatar',
  width: 128,
  height: 128,
}

interface Props {
  children: ReactNode
  params: Promise<{ handle: string }>
}

const CategoryHandleLayout = async ({ children, params }: Props) => {
  const { handle } = await params

  let authors: any[] = []
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
      cover: {
        src: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80',
        alt: 'Cover',
        width: 1920,
        height: 1080,
      },
    }))
  } catch {
    authors = []
  }

  return (
    <ApplicationLayout activeCategory={handle}>
      {children}

      <div className="container space-y-20 py-20 lg:space-y-28 lg:py-28">
        <div className="relative py-16 lg:py-20">
          <BackgroundSection />
          <SectionSliderNewAuthors
            heading="Top elite authors"
            subHeading="Discover our elite writers"
            authors={authors.slice(0, 10)}
          />
        </div>

        {/* SUBSCRIBE */}
        <SectionSubscribe2 />
      </div>
    </ApplicationLayout>
  )
}

export default CategoryHandleLayout
