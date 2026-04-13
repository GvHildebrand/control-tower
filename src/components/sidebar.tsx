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
            background: '#0A84FF',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(10, 132, 255, 0.35)',
          }
        : {
            background: 'transparent',
            color: 'var(--text-muted)',
          }
    }
    onMouseEnter={e => {
      if (!active) {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'
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
        background: 'rgba(28, 28, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Logo mark */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-2"
        style={{
          background: '#0A84FF',
          boxShadow: '0 4px 16px rgba(10, 132, 255, 0.40)',
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

      <div
        className="w-8 h-px my-1"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />

      <NavIcon active label="Dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      </NavIcon>

      <NavIcon label="Activity">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </NavIcon>

      <NavIcon label="Analytics">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </NavIcon>

      <NavIcon label="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      </NavIcon>

      <div className="flex-1" />

      {/* Critical alert badge */}
      {criticalCount > 0 && (
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255, 69, 58, 0.12)',
              border: '1px solid rgba(255, 69, 58, 0.22)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span
            className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: '#FF453A', color: '#FFFFFF' }}
          >
            {criticalCount}
          </span>
        </div>
      )}
    </aside>
  )
}
