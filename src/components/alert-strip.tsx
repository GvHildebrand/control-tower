import type { Project } from '@/lib/types'

export function AlertStrip({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  // Show the first (highest-priority) critical project prominently
  const primary   = projects[0]
  const remaining = projects.length - 1

  return (
    <div
      style={{
        margin:         '12px 16px 0',
        borderRadius:   14,
        padding:        '11px 16px',
        display:        'flex',
        alignItems:     'center',
        gap:            12,
        background:     'color-mix(in srgb, var(--red) 8%, var(--surface-1))',
      }}
    >
      {/* Pulsing dot */}
      <span
        style={{
          position:   'relative',
          display:    'inline-flex',
          width:      8,
          height:     8,
          flexShrink: 0,
        }}
      >
        <span
          className="animate-ping"
          style={{
            position:     'absolute',
            inset:        0,
            borderRadius: '50%',
            background:   'var(--red)',
            opacity:      0.5,
          }}
        />
        <span
          style={{
            position:     'relative',
            width:        8,
            height:       8,
            borderRadius: '50%',
            background:   'var(--red)',
          }}
        />
      </span>

      {/* Label */}
      <span
        style={{
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: '0.10em',
          textTransform: 'uppercase' as const,
          color:         'var(--red)',
          fontFamily:    'var(--font-mono)',
          flexShrink:    0,
          whiteSpace:    'nowrap' as const,
        }}
      >
        Immediate Action Required
      </span>

      {/* Divider */}
      <div
        style={{
          width:      1,
          height:     14,
          background: 'color-mix(in srgb, var(--red) 25%, transparent)',
          flexShrink: 0,
        }}
      />

      {/* Project name + truncated next action */}
      <span
        style={{
          fontSize:     13,
          fontWeight:   600,
          color:        'var(--text-primary)',
          fontFamily:   'var(--font-display)',
          whiteSpace:   'nowrap' as const,
          flexShrink:   0,
        }}
      >
        {primary.name}
      </span>
      <span
        style={{
          fontSize:    13,
          color:       'var(--text-secondary)',
          overflow:    'hidden',
          textOverflow:'ellipsis',
          whiteSpace:  'nowrap' as const,
          minWidth:    0,
          flex:        1,
        }}
      >
        {primary.nextAction.length > 72
          ? primary.nextAction.slice(0, 72) + '…'
          : primary.nextAction}
      </span>

      {/* Overflow badge */}
      {remaining > 0 && (
        <span
          style={{
            fontSize:     11,
            fontWeight:   600,
            color:        'var(--red)',
            fontFamily:   'var(--font-mono)',
            flexShrink:   0,
            whiteSpace:   'nowrap' as const,
          }}
        >
          +{remaining} more
        </span>
      )}

      {/* Open arrow */}
      <span
        style={{
          fontSize:     12,
          fontWeight:   600,
          color:        'var(--red)',
          fontFamily:   'var(--font-mono)',
          flexShrink:   0,
          whiteSpace:   'nowrap' as const,
        }}
        aria-hidden="true"
      >
        ↓
      </span>
    </div>
  )
}
