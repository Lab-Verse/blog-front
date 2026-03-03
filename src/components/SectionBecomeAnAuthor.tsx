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
    <div
      className={clsx(
        'section-become-an-author relative flex flex-col items-center overflow-hidden rounded-3xl bg-neutral-900 p-8 text-white lg:flex-row lg:p-14 dark:bg-neutral-800',
        className,
      )}
    >
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -top-24 -end-24 size-72 rounded-full bg-primary-600/20 blur-3xl" />

      <div className="relative z-10 mb-14 shrink-0 lg:mr-10 lg:mb-0 lg:w-2/5">
        <span className="text-xs font-semibold tracking-widest text-primary-400 uppercase">
          {t('superChangeYourPlanningPowers')}
        </span>
        <h2 className="heading-serif mt-3 text-3xl font-semibold sm:text-4xl">{t('becomeAnAuthorHeading')}</h2>
        <span className="mt-8 block text-neutral-300">
          {t('becomeAnAuthorDescription')}
        </span>
        <ButtonPrimary className="mt-8">{t('becomeAnAuthorButton')}</ButtonPrimary>
      </div>
      <div className="relative z-10 grow">
        <Image alt="hero" sizes="(max-width: 768px) 100vw, 50vw" src={rightImg} className="rounded-2xl" />
      </div>
    </div>
  )
}

export default SectionBecomeAnAuthor
