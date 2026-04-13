import type { ProjectStatus, ProjectPriority } from '@/lib/types'

/* Uses CSS vars — automatically adapts light/dark */
const STATUS_VARS: Record<ProjectStatus, string> = {
  new:      'var(--status-new)',
  critical: 'var(--status-critical)',
  blocked:  'var(--status-blocked)',
  active:   'var(--status-active)',
  paused:   'var(--status-paused)',
  complete: 'var(--status-complete)',
  dead:     'var(--status-dead)',
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  new:      'New',
  critical: 'Critical',
  blocked:  'Blocked',
  active:   'Active',
  paused:   'Paused',
  complete: 'Complete',
  dead:     'Dead',
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const colorVar  = STATUS_VARS[status] ?? 'var(--status-paused)'
  const label     = STATUS_LABELS[status] ?? status
  const isPulsing = status === 'critical' || status === 'new' || status === 'blocked'

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{
        background: `color-mix(in srgb, ${colorVar} 12%, transparent)`,
        border:     `1px solid color-mix(in srgb, ${colorVar} 25%, transparent)`,
        color:      colorVar,
      }}
    >
      <span
        className="relative flex items-center justify-center"
        style={{ width: 6, height: 6 }}
      >
        {isPulsing && (
          <span
            className="absolute inline-flex rounded-full animate-ping"
            style={{ inset: 0, background: colorVar, opacity: 0.5 }}
          />
        )}
        <span
          className="relative rounded-full"
          style={{ width: 6, height: 6, background: colorVar }}
        />
      </span>
      {label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  if (priority === 'LOW' || priority === 'MEDIUM') return null
  const isCritical = priority === 'CRITICAL'
  const colorVar   = isCritical ? 'var(--status-critical)' : 'var(--status-blocked)'
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
      style={{
        background: `color-mix(in srgb, ${colorVar} 12%, transparent)`,
        border:     `1px solid color-mix(in srgb, ${colorVar} 25%, transparent)`,
        color:      colorVar,
      }}
    >
      {priority}
    </span>
  )
}
