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
  } catch { return 'unknown' }
}

interface StatCardProps {
  value: number
  label: string
  color: string
}

function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-2.5 rounded-xl min-w-[68px]"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}20`,
      }}
    >
      <span
        className="text-[20px] font-bold font-display leading-none"
        style={{ color }}
      >
        {value}
      </span>
      <span
        className="text-[10px] font-semibold tracking-wide uppercase mt-0.5 font-mono"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
    </div>
  )
}

const RefreshIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 21h5v-5"/>
  </svg>
)

export function SummaryRow({ counts, syncedAt }: SummaryRowProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {counts.critical > 0 && (
        <StatCard value={counts.critical} label="Critical" color="#FF453A" />
      )}
      <StatCard value={counts.active}  label="Active"   color="#30D158" />
      <StatCard value={counts.paused}  label="Paused"   color="#636366" />
      <StatCard value={counts.archive} label="Archived" color="#0A84FF" />
      <StatCard value={counts.total}   label="Total"    color="#98989F" />
      <div className="ml-auto flex items-center gap-1.5 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
        <RefreshIcon />
        {formatSyncTime(syncedAt)}
      </div>
    </div>
  )
}
