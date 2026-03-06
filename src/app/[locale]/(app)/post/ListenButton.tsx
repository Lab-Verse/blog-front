'use client'

import { FC, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTextToSpeech, type TTSStatus } from '@/hooks/useTextToSpeech'
import { htmlToPlainText } from '@/utils/htmlToPlainText'

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2]

interface ListenButtonProps {
  content: string
}

const ListenButton: FC<ListenButtonProps> = ({ content }) => {
  const t = useTranslations('post.listen')
  const tts = useTextToSpeech()
  const [showRateMenu, setShowRateMenu] = useState(false)

  const plainText = useMemo(() => htmlToPlainText(content), [content])

  const handlePlayPause = () => {
    if (tts.status === 'idle') {
      tts.play(plainText)
    } else if (tts.status === 'playing') {
      tts.pause()
    } else if (tts.status === 'paused') {
      tts.resume()
    }
  }

  if (!tts.isSupported) return null

  return (
    <div className="mx-auto mb-6 max-w-(--breakpoint-md)">
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
          tts.status !== 'idle'
            ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-950'
            : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900'
        }`}
      >
        {/* Play / Pause Button */}
        <button
          type="button"
          onClick={handlePlayPause}
          aria-label={
            tts.status === 'playing'
              ? t('pause')
              : tts.status === 'paused'
                ? t('resume')
                : t('listen')
          }
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          {tts.status === 'playing' ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Label + Progress */}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {tts.status === 'idle' && t('listen')}
            {tts.status === 'playing' && t('playing')}
            {tts.status === 'paused' && t('paused')}
          </span>

          {tts.status !== 'idle' && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${tts.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Speed Control */}
        {tts.status !== 'idle' && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRateMenu((v) => !v)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
              aria-label={t('speed')}
            >
              {tts.currentRate}x
            </button>
            {showRateMenu && (
              <div className="absolute bottom-full right-0 z-10 mb-1 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                {PLAYBACK_RATES.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      tts.setRate(rate)
                      setShowRateMenu(false)
                    }}
                    className={`block w-full px-4 py-1.5 text-left text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                      tts.currentRate === rate
                        ? 'font-bold text-primary-600 dark:text-primary-400'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stop Button */}
        {tts.status !== 'idle' && (
          <button
            type="button"
            onClick={tts.stop}
            aria-label={t('stop')}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          >
            <StopIcon />
          </button>
        )}
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
    >
      <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-5"
    >
      <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4"
    >
      <path
        fillRule="evenodd"
        d="M2 4.75A2.75 2.75 0 0 1 4.75 2h10.5A2.75 2.75 0 0 1 18 4.75v10.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25V4.75Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default ListenButton
