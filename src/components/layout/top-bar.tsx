'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocale } from '@/i18n/provider'
import type { SearchResult } from '@/lib/types'

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* private browsing */ }
  return 'light'
}

export function TopBar() {
  const { locale, t, setLocale } = useLocale()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = getInitialTheme()
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value)
    if (value.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
        setShowResults(true)
      }
    } catch {
      setResults([])
    }
  }, [])

  const handleSelect = useCallback((result: SearchResult) => {
    setShowResults(false)
    setQuery('')
    if (result.type === 'brand') {
      window.location.href = `/brand/${encodeURIComponent(result.name)}`
    } else if (result.type === 'company') {
      window.location.href = `/company/${encodeURIComponent(result.name)}`
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <div ref={wrapperRef} className="relative flex-1 max-w-[240px]">
        <input
          type="text"
          className="search-input"
          placeholder={t.common.search}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {showResults && results.length > 0 && (
          <div className="search-results">
            {results.map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                className="search-item w-full text-left"
                onClick={() => handleSelect(r)}
              >
                <span className="search-type">{r.type}</span>
                <span>{r.name}</span>
                {r.name_kr && (
                  <span className="text-text-quaternary text-xs">{r.name_kr}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
      </button>
      <div className="locale-switch">
        <button
          className={`locale-btn ${locale === 'en' ? 'active' : ''}`}
          onClick={() => setLocale('en')}
        >
          EN
        </button>
        <button
          className={`locale-btn ${locale === 'ko' ? 'active' : ''}`}
          onClick={() => setLocale('ko')}
        >
          KR
        </button>
      </div>
    </div>
  )
}
