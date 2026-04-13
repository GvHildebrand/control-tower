'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavIcon = ({
  children,
  active,
  label,
  href,
}: {
  children: React.ReactNode
  active?: boolean
  label: string
  href: string
}) => (
  <Link
    href={href}
    title={label}
    aria-label={label}
    style={{
      width:      44,
      height:     44,
      borderRadius: 12,
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor:     'pointer',
      textDecoration: 'none',
      background: active ? 'rgba(29, 78, 216, 0.08)' : 'transparent',
      color:      active ? '#1D4ED8'                  : 'var(--text-meta)',
      transition: 'transform 180ms cubic-bezier(.4,0,.2,1), background 150ms ease, color 150ms ease',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform = 'scale(1.12)'
      if (!active) {
        el.style.background = 'rgba(14, 116, 144, 0.06)'
        el.style.color      = '#0E7490'
      }
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.transform  = ''
      if (!active) {
        el.style.background = 'transparent'
        el.style.color      = 'var(--text-meta)'
      }
    }}
  >
    {children}
  </Link>
)

export function Sidebar({ criticalCount }: { criticalCount: number }) {
  const pathname = usePathname()

  return (
    <aside
      style={{
        position:  'fixed',
        left:      0,
        top:       0,
        height:    '100%',
        width:     72,
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        gap:       12,
        zIndex:    40,
        background:        'var(--sidebar-bg)',
        backdropFilter:    'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width:        44,
          height:       44,
          borderRadius: 12,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          marginBottom: 8,
          background:   'var(--navy)',
          boxShadow:    '0 4px 16px rgba(15,45,82,0.35)',
          transition:   'transform 180ms cubic-bezier(.4,0,.2,1)',
          cursor:       'default',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = ''
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          {/* Solomon prism mark */}
          <polygon points="12,3 22,18 2,18" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="12" cy="13" r="3" fill="#0E7490"/>
        </svg>
      </div>

      <div style={{ width: 32, height: 1, background: 'var(--border)' }} />

      <NavIcon active={pathname === '/'} href="/" label="Dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
      </NavIcon>

      <NavIcon active={pathname === '/activity'} href="/activity" label="Activity">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </NavIcon>

      <NavIcon active={pathname === '/analytics'} href="/analytics" label="Analytics">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </NavIcon>

      <NavIcon active={pathname === '/settings'} href="/settings" label="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      </NavIcon>

      <div style={{ flex: 1 }} />

      {/* Critical alert badge */}
      {criticalCount > 0 && (
        <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width:        40,
              height:       40,
              borderRadius: 12,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              background:   'color-mix(in srgb, var(--red) 10%, var(--surface-1))',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" style={{ stroke: 'var(--red)' }} aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span
            style={{
              position:   'absolute',
              top:        -2,
              right:      -2,
              width:      18,
              height:     18,
              borderRadius: '50%',
              fontSize:   10,
              fontWeight: 600,
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--red)',
              color:      '#FFFFFF',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {criticalCount}
          </span>
        </div>
      )}
    </aside>
  )
}
