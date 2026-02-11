'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale, Translations } from './types'
import { ko } from './ko'
import { en } from './en'

const translations: Readonly<Record<Locale, Translations>> = { ko, en }

interface LocaleContextValue {
  readonly locale: Locale
  readonly t: Translations
  readonly setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  t: en,
  setLocale: () => {},
})

export function LocaleProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('kb-dashboard-locale') as Locale | null
    if (saved === 'ko' || saved === 'en') {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('kb-dashboard-locale', newLocale)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
