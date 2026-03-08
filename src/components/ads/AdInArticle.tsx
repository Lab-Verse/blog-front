'use client'

import { useEffect, useRef } from 'react'

interface AdInArticleProps {
  className?: string
  slot?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

/** Reserved height to prevent CLS while the in-article ad is loading */
const IN_ARTICLE_MIN_HEIGHT = 120

const AdInArticle: React.FC<AdInArticleProps> = ({ className = '', slot = '' }) => {
  const isAdPushed = useRef(false)
  const adRef = useRef<HTMLModElement>(null)
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  // Only push the ad when it scrolls into view
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
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [clientId])

  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <div
        className={`my-6 flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-800/50 ${className}`}
        style={{ minHeight: IN_ARTICLE_MIN_HEIGHT }}
      >
        <span className="text-xs text-neutral-400">In-Article Ad</span>
      </div>
    )
  }

  return (
    <div
      className={`my-6 overflow-hidden ${className}`}
      style={{ minHeight: IN_ARTICLE_MIN_HEIGHT }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={clientId}
        data-ad-slot={slot}
      />
    </div>
  )
}

export default AdInArticle
