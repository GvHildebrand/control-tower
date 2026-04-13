'use client'

const NavIcon = ({
  children,
  active,
  label,
}: {
  children: React.ReactNode
  active?: boolean
  label: string
}) => (
  <button
    title={label}
    aria-label={label}
    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer"
    style={
      active
        ? {
            background: 'var(--blue)',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px color-mix(in srgb, var(--blue) 35%, transparent)',
          }
        : {
            background: 'transparent',
            color: 'var(--text-muted)',
          }
    }
    onMouseEnter={e => {
      if (!active) {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-3)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
      }
    }}
    onMouseLeave={e => {
      if (!active) {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
      }
    }}
  >
    {children}
  </button>
)

export function Sidebar({ criticalCount }: { criticalCount: number }) {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-[72px] flex flex-col items-center py-5 gap-3 z-40"
      style={{
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo mark */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-2"
        style={{
          background: 'var(--blue)',
          boxShadow: '0 4px 16px color-mix(in srgb, var(--blue) 40%, transparent)',
        }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="w-8 h-px my-1" style={{ background: 'var(--border)' }} />

      <NavIcon active label="Dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
      </NavIcon>

      <NavIcon label="Activity">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </NavIcon>

      <NavIcon label="Analytics">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </NavIcon>

      <NavIcon label="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      </NavIcon>

      <div className="flex-1" />

      {/* Critical alert */}
      {criticalCount > 0 && (
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'color-mix(in srgb, var(--status-critical) 10%, var(--surface-1))',
              border:     '1px solid color-mix(in srgb, var(--status-critical) 22%, transparent)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: 'var(--status-critical)' }} aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span
            className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-[10px] font-semibold flex items-center justify-center"
            style={{ background: 'var(--status-critical)', color: '#FFFFFF' }}
          >
            {criticalCount}
          </span>
        </div>
      )}
    </aside>
  )
}
