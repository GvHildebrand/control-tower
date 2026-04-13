import type { ProjectStatus, ProjectPriority } from '@/lib/types'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  new:      { label: 'New',      color: 'var(--purple)' },
  critical: { label: 'Critical', color: 'var(--red)'    },
  blocked:  { label: 'Blocked',  color: 'var(--orange)' },
  active:   { label: 'Active',   color: 'var(--green)'  },
  paused:   { label: 'Paused',   color: 'var(--text-meta)' },
  complete: { label: 'Complete', color: 'var(--blue)'   },
  dead:     { label: 'Dead',     color: 'var(--text-meta)' },
}

/* Glass pill — Apple-style */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, color } = STATUS_CONFIG[status] ?? STATUS_CONFIG.paused
  const isPulsing = status === 'critical' || status === 'new'

  return (
    <span
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            5,
        padding:        '4px 10px',
        borderRadius:   999,
        fontSize:       11,
        fontWeight:     500,
        background:     `color-mix(in srgb, ${color} 8%, transparent)`,
        border:         `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        color:          color,
        fontFamily:     'var(--font-label)',
        letterSpacing:  '0.08em',
        whiteSpace:     'nowrap',
      }}
    >
      <span
        style={{
          position:   'relative',
          display:    'inline-flex',
          width:      6,
          height:     6,
          flexShrink: 0,
        }}
      >
        {isPulsing && (
          <span
            className="animate-ping"
            style={{
              position:     'absolute',
              inset:        0,
              borderRadius: '50%',
              background:   color,
              opacity:      0.50,
            }}
          />
        )}
        <span
          style={{
            position:     'relative',
            width:        6,
            height:       6,
            borderRadius: '50%',
            background:   color,
          }}
        />
      </span>
      {label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  if (priority === 'LOW' || priority === 'MEDIUM') return null
  const isCritical = priority === 'CRITICAL'
  const color = isCritical ? 'var(--red)' : 'var(--orange)'
  return (
    <span
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        padding:      '4px 10px',
        borderRadius: 999,
        fontSize:     11,
        fontWeight:   600,
        background:   `color-mix(in srgb, ${color} 8%, transparent)`,
        border:       `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        color:        color,
        fontFamily:   'var(--font-label)',
        letterSpacing:'0.08em',
      }}
    >
      {priority}
    </span>
  )
}
