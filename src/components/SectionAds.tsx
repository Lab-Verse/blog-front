import AdBanner from '@/components/ads/AdBanner'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  className?: string
  slot?: string
}

const SectionAds: FC<Props> = ({ className, slot }) => {
  return (
    <div className={clsx('section-ads mx-auto text-center', className)}>
      <span className="mb-2 block text-xs text-neutral-500">
        - Advertisement -
      </span>
      <AdBanner
        slot={slot}
        format="horizontal"
        responsive
        className="min-h-[90px]"
      />
    </div>
  )
}

export default SectionAds
