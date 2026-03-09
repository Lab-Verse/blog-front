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
  auto: 250,
  fluid: 100,
  rectangle: 250,
  vertical: 600,
  horizontal: 250,
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

  // Only push the ad when it scrolls into view (reduces main-thread jank on load)
  useEffect(() => {
    if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') return
    if (isAdPushed.current) return
    const node = adRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAdPushed.current) {
          try {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            isAdPushed.current = true
          } catch (err) {
            console.error('AdSense error:', err)
          }
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }, // trigger 200px before visible
    )
    observer.observe(node)
    return () => observer.disconnect()
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
