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

const AdInArticle: React.FC<AdInArticleProps> = ({ className = '', slot = '' }) => {
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
        className={`my-6 flex items-center justify-center rounded-xl bg-neutral-50 py-8 dark:bg-neutral-800/50 ${className}`}
      >
        <span className="text-xs text-neutral-400">In-Article Ad</span>
      </div>
    )
  }

  return (
    <div className={`my-6 ${className}`}>
      <ins
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
