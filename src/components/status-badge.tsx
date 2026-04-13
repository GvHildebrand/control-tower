import type { ProjectStatus, ProjectPriority } from '@/lib/types'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; textColor: string }> = {
  new:      { label: 'New',      color: '#BF5AF2', textColor: '#BF5AF2' },
  critical: { label: 'Critical', color: '#FF453A', textColor: '#FF453A' },
  blocked:  { label: 'Blocked',  color: '#FF9F0A', textColor: '#FF9F0A' },
  active:   { label: 'Active',   color: '#30D158', textColor: '#30D158' },
  paused:   { label: 'Paused',   color: '#636366', textColor: '#98989F' },
  complete: { label: 'Complete', color: '#0A84FF', textColor: '#0A84FF' },
  dead:     { label: 'Dead',     color: '#3A3A3C', textColor: '#636366' },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.paused
  const isPulsing = status === 'critical' || status === 'new' || status === 'blocked'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{
        background: `${cfg.color}18`,
        border: `1px solid ${cfg.color}30`,
        color: cfg.textColor,
      }}
    >
      <span
        className="relative flex items-center justify-center"
        style={{ width: 6, height: 6 }}
      >
        {isPulsing && (
          <span
            className="absolute inline-flex rounded-full animate-ping"
            style={{ inset: 0, background: cfg.color, opacity: 0.5 }}
          />
        )}
        <span
          className="relative rounded-full"
          style={{ width: 6, height: 6, background: cfg.color }}
        />
      </span>
      {cfg.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  if (priority === 'LOW' || priority === 'MEDIUM') return null
  const isCritical = priority === 'CRITICAL'
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
      style={{
        background: isCritical ? 'rgba(255, 69, 58, 0.15)' : 'rgba(255, 159, 10, 0.15)',
        border: isCritical ? '1px solid rgba(255, 69, 58, 0.30)' : '1px solid rgba(255, 159, 10, 0.30)',
        color: isCritical ? '#FF453A' : '#FF9F0A',
      }}
    >
      {priority}
    </span>
  )
}
