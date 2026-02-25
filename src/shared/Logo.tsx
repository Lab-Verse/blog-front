import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
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
        src="/images/twa-logo.svg"
        alt="TWA - The World Ambassador"
        width={66}
        height={50}
        className="h-10 w-auto sm:h-12"
        priority
      />
    </Link>
  )
}

export default Logo
