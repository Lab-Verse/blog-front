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
        'section-become-an-author relative flex flex-col items-center overflow-hidden rounded-3xl lg:flex-row',
        className,
      )}
    >
      <Image
        alt="How to become an author"
        src="/images/how-to-become-an-author.png"
        width={1470}
        height={1008}
        sizes="(max-width: 768px) 100vw, 80vw"
        className="h-auto w-full rounded-3xl object-contain"
        priority
      />
    </div>
  )
}

export default SectionBecomeAnAuthor
