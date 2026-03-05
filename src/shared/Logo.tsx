import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import React from 'react'

interface Props {
  className?: string
  size?: string
  /** When true, use a light/inverted version for dark backgrounds */
  inverted?: boolean
}

const Logo: React.FC<Props> = ({ className, size, inverted }) => {
  return (
    <Link
      href="/"
      className={clsx(
        'inline-flex shrink-0 items-center',
        className,
        size,
      )}
    >
      <Image
        src="/images/twa-logo.svg"
        alt="TWA - The World Ambassador"
        width={900}
        height={300}
        className={clsx('h-20 max-h-20 w-auto', inverted && 'brightness-0 invert')}
        priority
      />
    </Link>
  )
}

export default Logo
