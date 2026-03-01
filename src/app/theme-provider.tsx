'use client'

import { createContext, useCallback, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/redux/store'

interface ThemeContextValue {
  isDarkMode: boolean
  toggleDarkMode: () => void
  themeDir: 'rtl' | 'ltr'
  setThemeDir: (value: 'rtl' | 'ltr') => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize from DOM state (set by inline FOUC-prevention script)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  const [themeDir, setThemeDir] = useState<'rtl' | 'ltr'>('ltr')

  // Sync React state with the inline script's DOM state on mount
  useEffect(() => {
    const hasDarkClass = document.documentElement.classList.contains('dark')
    setIsDarkMode(hasDarkClass)
  }, [])

  // themeDir
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.getAttribute('dir') === 'rtl' ? setThemeDir('rtl') : setThemeDir('ltr')
    }
  }, [])

  // Update themeDir when it changes
  // This ensures that the document's direction is set correctly
  // when the themeDir state changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('dir', themeDir)
    }
  }, [themeDir])

  // toggleDarkMode
  // This function toggles the dark mode state and updates the localStorage
  // and the HTML class accordingly
  const toggleDarkMode = useCallback((): void => {
    if (localStorage.getItem('theme') === 'light-mode') {
      setIsDarkMode(true)
      const root = document.querySelector('html')
      if (root && !root.classList.contains('dark')) {
        root.classList.add('dark')
      }
      localStorage.setItem('theme', 'dark-mode')
    } else {
      setIsDarkMode(false)
      const root = document.querySelector('html')
      if (root) {
        root.classList.remove('dark')
      }
      localStorage.setItem('theme', 'light-mode')
    }
  }, [])

  //
  return (
    <Provider store={store}>
      <ThemeContext.Provider
        value={{
          isDarkMode,
          toggleDarkMode,
          themeDir,
          setThemeDir,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </Provider>
  )
}
