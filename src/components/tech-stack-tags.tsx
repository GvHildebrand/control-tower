/* Quiet tech pills — surface-3 bg, meta text, very subtle color hint for key stacks */

const KEY_TECH_COLOR: Record<string, string> = {
  'TypeScript': 'var(--blue)',
  'Supabase':   'var(--green)',
  'Stripe':     'var(--purple)',
  'Claude':     'var(--orange)',
}

export function TechStackTags({ stack, max = 4 }: { stack: string[]; max?: number }) {
  const visible  = stack.slice(0, max)
  const overflow = stack.length - max
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {visible.map((tech) => {
        const hue = KEY_TECH_COLOR[tech]
        return (
          <span
            key={tech}
            style={{
              display:      'inline-block',
              padding:      '3px 8px',
              borderRadius: 6,
              fontSize:     11,
              fontWeight:   500,
              background:   hue
                ? `color-mix(in srgb, ${hue} 9%, var(--surface-3))`
                : 'var(--surface-3)',
              color: hue
                ? `color-mix(in srgb, ${hue} 65%, var(--text-meta))`
                : 'var(--text-meta)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {tech}
          </span>
        )
      })}
      {overflow > 0 && (
        <span
          style={{
            display:      'inline-block',
            padding:      '3px 8px',
            borderRadius: 6,
            fontSize:     11,
            fontWeight:   500,
            background:   'var(--surface-3)',
            color:        'var(--text-meta)',
            fontFamily:   'var(--font-mono)',
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
