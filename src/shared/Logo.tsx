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
        src="/images/twa.png"
        alt="TWA - The World Ambassador"
        width={200}
        height={60}
        className="h-8 w-auto sm:h-10"
        priority
      />
    </Link>
  )
}

export default Logo
