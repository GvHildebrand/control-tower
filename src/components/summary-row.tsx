import type { ProjectCounts } from '@/lib/projects'

interface SummaryRowProps {
  counts: ProjectCounts
  syncedAt: string
}

function formatSyncTime(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 2) return 'just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  } catch { return '–' }
}

const RefreshIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 21h5v-5"/>
  </svg>
)

interface StatItemProps {
  color: string
  label: string
  count: number
}

function StatItem({ color, label, count }: StatItemProps) {
  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        7,
      }}
    >
      <span
        style={{
          width:        7,
          height:       7,
          borderRadius: '50%',
          background:   color,
          flexShrink:   0,
        }}
      />
      <span
        style={{
          fontSize:   13,
          color:      'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize:   14,
          fontWeight: 600,
          color:      'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          minWidth:   16,
        }}
      >
        {count}
      </span>
    </div>
  )
}

export function SummaryRow({ counts, syncedAt }: SummaryRowProps) {
  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            24,
        flexWrap:       'wrap',
        padding:        '10px 18px',
        borderRadius:   10,
        background:     'var(--glass-bg)',
        backdropFilter: 'blur(16px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
        border:         '1px solid var(--border)',
        boxShadow:      'var(--card-shadow)',
      }}
    >
      {counts.critical > 0 && (
        <StatItem color="var(--red)"    label="Critical" count={counts.critical} />
      )}
      <StatItem color="var(--green)"   label="Active"   count={counts.active}   />
      <StatItem color="var(--text-meta)" label="Paused" count={counts.paused}   />
      <StatItem color="var(--blue)"    label="Archived" count={counts.archive}  />

      {/* Divider */}
      <div style={{ width: 1, height: 16, background: 'var(--border)', marginLeft: 4 }} />

      <span
        style={{
          fontSize:   12,
          color:      'var(--text-meta)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {counts.total} total
      </span>

      <div style={{ flex: 1 }} />

      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        5,
          fontSize:   12,
          color:      'var(--text-meta)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <RefreshIcon />
        {formatSyncTime(syncedAt)}
      </div>
    </div>
  )
}
