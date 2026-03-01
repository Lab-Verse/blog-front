'use client'

import SectionSliderPosts from '@/components/SectionSliderPosts'
import { TPost } from '@/data/posts'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface Props {
  relatedPosts: TPost[]
  moreFromAuthorPosts: TPost[]
}

const SingleRelatedPosts: FC<Props> = ({ relatedPosts, moreFromAuthorPosts }) => {
  const t = useTranslations('post')

  return (
    <div className="relative mt-16 bg-neutral-50 py-16 lg:mt-28 lg:py-24 dark:bg-neutral-800">
      {/* RELATED  */}
      <div className="container space-y-16 lg:space-y-28">
        <SectionSliderPosts posts={relatedPosts} heading={t('dontMissThese')} postCardName="card7" />
        <SectionSliderPosts posts={moreFromAuthorPosts} heading={t('moreFromAuthor')} />
      </div>
    </div>
  )
}

export default SingleRelatedPosts
