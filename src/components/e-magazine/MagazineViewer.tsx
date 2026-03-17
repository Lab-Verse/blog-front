'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { useTranslations } from 'next-intl'

// CDN base for pdfjs-dist — loaded at runtime to avoid webpack ESM bundling issues
const PDFJS_VERSION = '5.4.624'
const PDFJS_CDN = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build`

// R2 public base URL — rewritten through Next.js to avoid CORS
const R2_PUBLIC_BASE = 'https://pub-b3abd4448aa7438db921404307c0e985.r2.dev'

function proxyR2Url(url: string): string {
  if (url.startsWith(R2_PUBLIC_BASE)) {
    return url.replace(R2_PUBLIC_BASE, '/r2-proxy')
  }
  return url
}

interface MagazineViewerProps {
  pdfUrl: string
}

/**
 * Interactive flipbook viewer that renders a PDF as page-flippable images.
 * Uses pdfjs-dist for PDF rendering and react-pageflip for the flip animation.
 */
export default function MagazineViewer({ pdfUrl }: MagazineViewerProps) {
  const t = useTranslations('eMagazine')
  const [pages, setPages] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const flipBookRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate dimensions based on viewport
  const [dimensions, setDimensions] = useState({ width: 400, height: 566 })

  useEffect(() => {
    const updateDimensions = () => {
      const vh = window.innerHeight - 160 // subtract header + toolbar
      const vw = window.innerWidth
      // Each page is roughly A4 ratio (1:1.414)
      const pageHeight = Math.min(vh, 700)
      const pageWidth = Math.round(pageHeight / 1.414)
      // Ensure the double-page spread fits the viewport
      const maxDoubleWidth = vw - 40
      if (pageWidth * 2 > maxDoubleWidth) {
        const adjustedWidth = Math.round(maxDoubleWidth / 2)
        setDimensions({
          width: adjustedWidth,
          height: Math.round(adjustedWidth * 1.414),
        })
      } else {
        setDimensions({ width: pageWidth, height: pageHeight })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Load PDF and render all pages to image data URLs
  useEffect(() => {
    let cancelled = false

    async function loadPdf() {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamic import from CDN to avoid webpack ESM bundling issues with pdfjs-dist v5
        const pdfjsLib = await import(
          /* webpackIgnore: true */ `${PDFJS_CDN}/pdf.min.mjs`
        )

        // Set up worker from the same CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.mjs`

        const loadingTask = pdfjsLib.getDocument({
          url: proxyR2Url(pdfUrl),
          cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
          cMapPacked: true,
        })

        const pdf = await loadingTask.promise

        if (cancelled) return
        setTotalPages(pdf.numPages)

        const renderedPages: string[] = []

        // Render each page at a good resolution
        const scale = 2 // 2x for retina clarity

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return

          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale })

          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height

          await page.render({ canvas, viewport }).promise

          renderedPages.push(canvas.toDataURL('image/jpeg', 0.85))

          // Update progress
          if (!cancelled) {
            setPages([...renderedPages])
          }
        }

        if (!cancelled) {
          setPages(renderedPages)
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load PDF:', err)
          setError('Failed to load the magazine. Please try again.')
          setIsLoading(false)
        }
      }
    }

    loadPdf()
    return () => {
      cancelled = true
    }
  }, [pdfUrl])

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data)
  }, [])

  const goToPrev = () => {
    flipBookRef.current?.pageFlip()?.flipPrev()
  }

  const goToNext = () => {
    flipBookRef.current?.pageFlip()?.flipNext()
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="mb-4 h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t('download')}
        </a>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center bg-neutral-50 dark:bg-neutral-950">
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t('loading')}
            {pages.length > 0 && totalPages > 0 && (
              <span className="ms-1">
                ({Math.round((pages.length / totalPages) * 100)}%)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Flipbook */}
      {pages.length > 0 && (
        <>
          <div className="py-6">
            {/* @ts-ignore - react-pageflip types are incomplete */}
            <HTMLFlipBook
              ref={flipBookRef}
              width={dimensions.width}
              height={dimensions.height}
              size="stretch"
              minWidth={280}
              maxWidth={600}
              minHeight={400}
              maxHeight={850}
              showCover={true}
              maxShadowOpacity={0.5}
              mobileScrollSupport={true}
              onFlip={handleFlip}
              className="magazine-flipbook"
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={600}
              usePortrait={dimensions.width < 400}
              startZIndex={0}
              autoSize={true}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {pages.map((pageDataUrl, index) => (
                <div key={index} className="overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pageDataUrl}
                    alt={`Page ${index + 1}`}
                    className="h-full w-full object-contain"
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </HTMLFlipBook>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 pb-6">
            <button
              onClick={goToPrev}
              disabled={currentPage === 0}
              className="rounded-full border border-neutral-300 p-2 text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-800"
              aria-label={t('prevPage')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="min-w-[120px] text-center text-sm text-neutral-600 dark:text-neutral-400">
              {t('pageOf', {
                current: currentPage + 1,
                total: totalPages,
              })}
            </span>

            <button
              onClick={goToNext}
              disabled={currentPage >= totalPages - 1}
              className="rounded-full border border-neutral-300 p-2 text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-800"
              aria-label={t('nextPage')}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
