'use client'

import { useState } from 'react'

export function ReloadButton({ syncedAt }: { syncedAt: string }) {
  const [spinning, setSpinning] = useState(false)

  const formatted = (() => {
    try {
      return new Date(syncedAt).toLocaleString('en-US', {
        month:  'short',
        day:    'numeric',
        hour:   'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return '–'
    }
  })()

  function handleReload() {
    setSpinning(true)
    window.location.reload()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
      <button
        onClick={handleReload}
        title="Reload dashboard"
        style={{
          width:        28,
          height:       28,
          borderRadius: 8,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          cursor:       'pointer',
          background:   'var(--surface-2)',
          border:       '1px solid var(--border)',
          color:        'var(--text-meta)',
          padding:      0,
          flexShrink:   0,
          transition:   'color 150ms ease, background 150ms ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--text-primary)'
          el.style.background = 'var(--surface-1)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--text-meta)'
          el.style.background = 'var(--surface-2)'
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            animation: spinning ? 'spin 0.6s linear' : 'none',
          }}
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M16 21h5v-5"/>
        </svg>
      </button>
      <span
        style={{
          fontSize:   11,
          color:      'var(--text-meta)',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
        }}
      >
        synced {formatted}
      </span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
