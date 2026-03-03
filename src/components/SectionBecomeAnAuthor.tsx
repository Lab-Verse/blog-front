'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
}

const SectionBecomeAnAuthor: FC<Props> = ({ className }) => {
  const t = useTranslations('home')

  return (
    <div
      className={clsx(
        'section-become-an-author relative flex flex-col items-center overflow-hidden rounded-3xl bg-neutral-900 lg:flex-row',
        className,
      )}
    >
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-10 end-0 h-80 w-80 rounded-full bg-primary-500/30 blur-[100px]" />
      </div>

      {/* Left side — text content */}
      <div className="relative shrink-0 px-6 py-14 sm:px-10 lg:w-2/5 lg:py-20 xl:px-16">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          {t('becomeAnAuthorHeading')}
        </h2>
        <span className="mt-5 block text-neutral-400">
          {t('becomeAnAuthorDescription')}
        </span>
        <ButtonPrimary href="/dashboard/submit-post" className="mt-8">
          <span>{t('becomeAnAuthorButton')}</span>
          <svg className="-me-1 ms-2 size-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </ButtonPrimary>
      </div>

      {/* Right side — image */}
      <div className="relative grow lg:self-stretch">
        <Image
          alt="How to become an author"
          src="/images/how-to-become-an-author.png"
          width={1470}
          height={1008}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="size-full object-cover"
          priority
        />
      </div>
    </div>
  )
}

export default SectionBecomeAnAuthor
