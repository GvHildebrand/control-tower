'use client'

import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'

function getSystemDark() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (theme === 'dark')  root.classList.add('dark')
  if (theme === 'light') root.classList.add('light')
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) ?? 'system'
    setTheme(stored)
    applyTheme(stored)
    setIsDark(stored === 'dark' || (stored === 'system' && getSystemDark()))

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') setIsDark(mq.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  function cycle() {
    const next: Theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'
    setTheme(next)
    localStorage.setItem('theme', next)
    applyTheme(next)
    setIsDark(next === 'dark' || (next === 'system' && getSystemDark()))
  }

  const icon = theme === 'dark'
    ? /* Moon */
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    : theme === 'light'
    ? /* Sun */
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    : /* Auto */
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" stroke="none"/>
      </svg>

  const label = theme === 'dark' ? 'Dark mode' : theme === 'light' ? 'Light mode' : 'System theme'

  return (
    <button
      onClick={cycle}
      title={`${label} — click to cycle`}
      aria-label={label}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer"
      style={{
        background: 'var(--surface-2)',
        border:     '1px solid var(--border)',
        color:      'var(--text-tertiary)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'var(--surface-3)'
        el.style.color = 'var(--text-primary)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'var(--surface-2)'
        el.style.color = 'var(--text-tertiary)'
      }}
    >
      {icon}
    </button>
  )
}
