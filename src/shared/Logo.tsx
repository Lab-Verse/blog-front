import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

interface Props {
  className?: string
  size?: string
}

const Logo: React.FC<Props> = ({ className, size = 'size-12 sm:size-14' }) => {
  return (
    <Link
      href="/"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white',
        className,
        size,
      )}
    >
      <span className="text-lg sm:text-xl">TWA</span>
    </Link>
  )
}

export default Logo
