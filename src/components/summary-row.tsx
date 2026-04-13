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

function StatCard({ value, label, colorVar }: { value: number; label: string; colorVar: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-2.5 rounded-xl min-w-[68px]"
      style={{
        background: `color-mix(in srgb, ${colorVar} 10%, var(--surface-1))`,
        border:     `1px solid color-mix(in srgb, ${colorVar} 18%, transparent)`,
        boxShadow:  'var(--card-shadow)',
      }}
    >
      <span
        className="text-[20px] font-semibold leading-none"
        style={{ color: colorVar, fontFamily: 'var(--font-display)' }}
      >
        {value}
      </span>
      <span
        className="text-[9px] font-semibold tracking-widest uppercase mt-0.5"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </span>
    </div>
  )
}

const SyncIcon = () => (
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
        <StatCard value={counts.critical} label="Critical" colorVar="var(--status-critical)" />
      )}
      <StatCard value={counts.active}  label="Active"   colorVar="var(--status-active)"   />
      <StatCard value={counts.paused}  label="Paused"   colorVar="var(--status-paused)"   />
      <StatCard value={counts.archive} label="Archived" colorVar="var(--status-complete)" />
      <StatCard value={counts.total}   label="Total"    colorVar="var(--text-secondary)"  />
      <div
        className="ml-auto flex items-center gap-1.5 text-[11px]"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        <SyncIcon />
        {formatSyncTime(syncedAt)}
      </div>
    </div>
  )
}
