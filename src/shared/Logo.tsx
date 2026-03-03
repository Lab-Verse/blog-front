import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import React from 'react'

interface Props {
  className?: string
  size?: string
}

const Logo: React.FC<Props> = ({ className, size }) => {
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
        src="/images/twa.png"
        alt="TWA - The World Ambassador"
        width={900}
        height={300}
        className="h-20 max-h-20 w-auto"
        priority
      />
    </Link>
  )
}

export default Logo
