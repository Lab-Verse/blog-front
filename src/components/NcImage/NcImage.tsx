import clsx from 'clsx'
import Image, { ImageProps } from 'next/image'
import { FC } from 'react'

interface Props extends ImageProps {
  containerClassName?: string
}

const PLACEHOLDER = '/images/placeholder.png'

const NcImage: FC<Props> = ({
  containerClassName = 'relative',
  alt,
  className = 'object-cover size-full',
  sizes = '(max-width: 600px) 480px, 800px',
  src,
  ...args
}) => {
  const isPlaceholder = !src || src === PLACEHOLDER
  return (
    <div className={clsx('bg-neutral-100 dark:bg-neutral-800', containerClassName)}>
      {src && !isPlaceholder ? (
        <Image className={className} alt={alt} sizes={sizes} src={src} {...args} />
      ) : (
        <div className="flex size-full items-center justify-center text-lg font-semibold text-neutral-400 dark:text-neutral-500">
          {alt ? alt.charAt(0).toUpperCase() : ''}
        </div>
      )}
    </div>
  )
}

export default NcImage
