'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  className?: string
  slot?: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const AdBanner: React.FC<AdBannerProps> = ({
  className = '',
  slot = '',
  format = 'auto',
  responsive = true,
}) => {
  const adRef = useRef<HTMLModElement>(null)
  const isAdPushed = useRef(false)
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') return
    if (isAdPushed.current) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      isAdPushed.current = true
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [clientId])

  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <div
        className={`mx-auto flex items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800 ${className}`}
        style={{ minHeight: 90 }}
      >
        <span className="text-xs text-neutral-400">Ad Space</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

export default AdBanner
