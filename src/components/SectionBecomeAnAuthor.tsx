'use client'

import rightImgDemo from '@/images/BecomeAnAuthorImg.png'
import ButtonPrimary from '@/shared/ButtonPrimary'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Image, { StaticImageData } from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
  rightImg?: string | StaticImageData
}

const SectionBecomeAnAuthor: FC<Props> = ({ className, rightImg = rightImgDemo }) => {
  const t = useTranslations('home')

  return (
    <div className={clsx('section-become-an-author relative flex flex-col items-center lg:flex-row', className)}>
      <div className="mb-14 shrink-0 lg:mr-10 lg:mb-0 lg:w-2/5">
        <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
          {t('superChangeYourPlanningPowers')}
        </span>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t('becomeAnAuthorHeading')}</h2>
        <span className="mt-8 block text-neutral-500 dark:text-neutral-400">
          {t('becomeAnAuthorDescription')}
        </span>
        <ButtonPrimary className="mt-8">{t('becomeAnAuthorButton')}</ButtonPrimary>
      </div>
      <div className="grow">
        <Image alt="hero" sizes="(max-width: 768px) 100vw, 50vw" src={rightImg} />
      </div>
    </div>
  )
}

export default SectionBecomeAnAuthor