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

/** Minimum heights per format to prevent Cumulative Layout Shift (CLS) */
const FORMAT_MIN_HEIGHT: Record<string, number> = {
  auto: 90,
  fluid: 100,
  rectangle: 250,
  vertical: 600,
  horizontal: 90,
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
  const minHeight = FORMAT_MIN_HEIGHT[format] ?? 90

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
        style={{ minHeight }}
      >
        <span className="text-xs text-neutral-400">Ad Space</span>
      </div>
    )
  }

  return (
    <div className={className} style={{ minHeight, overflow: 'hidden' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

export default AdBanner
