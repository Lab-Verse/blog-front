'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type TTSStatus = 'idle' | 'playing' | 'paused'

interface UseTextToSpeechReturn {
  status: TTSStatus
  /** 0–100 */
  progress: number
  currentRate: number
  isSupported: boolean
  play: (text: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setRate: (rate: number) => void
}

/**
 * Maximum characters per utterance. Browsers like Chrome cut off around 200-300 chars
 * of continuous speech, so we split by sentence and keep chunks small.
 */
const MAX_CHUNK_CHARS = 3000

/**
 * Split text into sentence-sized chunks that stay under MAX_CHUNK_CHARS.
 * Splits on sentence boundaries (. ! ? followed by space/newline/end),
 * falling back to clause-level (comma/semicolon) and then word boundaries.
 */
function splitIntoChunks(text: string): string[] {
  // First split into sentences
  const sentences = text.match(/[^.!?\n]+[.!?]*[\s]*/g) || [text]

  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHUNK_CHARS && current.length > 0) {
      chunks.push(current.trim())
      current = ''
    }
    // If a single sentence exceeds the limit, split it further on clause boundaries
    if (sentence.length > MAX_CHUNK_CHARS) {
      if (current.length > 0) {
        chunks.push(current.trim())
        current = ''
      }
      const clauses = sentence.match(/[^,;]+[,;]?\s*/g) || [sentence]
      for (const clause of clauses) {
        if ((current + clause).length > MAX_CHUNK_CHARS && current.length > 0) {
          chunks.push(current.trim())
          current = ''
        }
        current += clause
      }
    } else {
      current += sentence
    }
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks.filter(Boolean)
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [status, setStatus] = useState<TTSStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [currentRate, setCurrentRate] = useState(1)

  const chunksRef = useRef<string[]>([])
  const currentIndexRef = useRef(0)
  const rateRef = useRef(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isCancelledRef = useRef(false)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const getPreferredVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!isSupported) return null
    const voices = window.speechSynthesis.getVoices()
    // Prefer high-quality English voices
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')
    )
    const english = voices.find((v) => v.lang.startsWith('en-US'))
    const anyEnglish = voices.find((v) => v.lang.startsWith('en'))
    return preferred || english || anyEnglish || voices[0] || null
  }, [isSupported])

  const speakChunk = useCallback(
    (index: number) => {
      if (!isSupported || isCancelledRef.current) return
      const chunks = chunksRef.current
      if (index >= chunks.length) {
        setStatus('idle')
        setProgress(100)
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index])
      utteranceRef.current = utterance

      const voice = getPreferredVoice()
      if (voice) utterance.voice = voice
      utterance.rate = rateRef.current
      utterance.pitch = 1
      utterance.lang = 'en-US'

      utterance.onend = () => {
        if (isCancelledRef.current) return
        const nextIndex = index + 1
        currentIndexRef.current = nextIndex
        // Update progress based on chunks completed
        setProgress(Math.round((nextIndex / chunks.length) * 100))
        // Speak next chunk
        speakChunk(nextIndex)
      }

      utterance.onerror = (event) => {
        // 'canceled' is expected when we call stop/cancel deliberately
        if (event.error === 'canceled' || isCancelledRef.current) return
        console.error('SpeechSynthesis error:', event.error)
        setStatus('idle')
      }

      window.speechSynthesis.speak(utterance)
    },
    [isSupported, getPreferredVoice]
  )

  const play = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      isCancelledRef.current = false

      const chunks = splitIntoChunks(text)
      chunksRef.current = chunks
      currentIndexRef.current = 0
      setProgress(0)
      setStatus('playing')

      speakChunk(0)
    },
    [isSupported, speakChunk]
  )

  const pause = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.pause()
    setStatus('paused')
  }, [isSupported])

  const resume = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.resume()
    setStatus('playing')
  }, [isSupported])

  const stop = useCallback(() => {
    if (!isSupported) return
    isCancelledRef.current = true
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    currentIndexRef.current = 0
    chunksRef.current = []
    setStatus('idle')
    setProgress(0)
  }, [isSupported])

  const setRate = useCallback(
    (rate: number) => {
      rateRef.current = rate
      setCurrentRate(rate)

      // If currently speaking, restart current chunk at new rate
      if (status === 'playing' && isSupported) {
        const currentIdx = currentIndexRef.current
        isCancelledRef.current = true
        window.speechSynthesis.cancel()
        isCancelledRef.current = false
        speakChunk(currentIdx)
      }
    },
    [status, isSupported, speakChunk]
  )

  // Cleanup on unmount — stop speech
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSupported])

  // Chrome pauses speech synthesis after ~15 seconds if there's no user interaction.
  // This keepalive workaround resumes it periodically.
  useEffect(() => {
    if (status !== 'playing' || !isSupported) return

    const interval = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [status, isSupported])

  return {
    status,
    progress,
    currentRate,
    isSupported,
    play,
    pause,
    resume,
    stop,
    setRate,
  }
}
