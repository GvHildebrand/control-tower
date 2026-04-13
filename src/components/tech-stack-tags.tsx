/*
  Tech stack tags — deliberately restrained.
  A card already has status color, left border, NEXT ACTION color.
  Tags should be quiet: neutral surface, secondary text.
  Only 1-2 key techs get a subtle color hint to aid scanning.
*/

const TECH_HUE: Record<string, string> = {
  'TypeScript':  'var(--status-complete)',   /* blue */
  'React':       'var(--status-complete)',
  'Next.js':     'var(--text-secondary)',
  'Supabase':    'var(--status-active)',     /* emerald */
  'Node.js':     'var(--status-active)',
  'Python':      'var(--status-blocked)',    /* amber */
  'Stripe':      'var(--status-new)',        /* violet */
  'Claude':      'var(--status-blocked)',
  'Gmail API':   'var(--status-critical)',   /* red */
}

export function TechStackTags({ stack, max = 4 }: { stack: string[]; max?: number }) {
  const visible  = stack.slice(0, max)
  const overflow = stack.length - max

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((tech) => {
        const hue = TECH_HUE[tech]
        return (
          <span
            key={tech}
            className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium"
            style={{
              /* Neutral surface — only primary tech gets a faint hue */
              background: hue
                ? `color-mix(in srgb, ${hue} 8%, var(--surface-3))`
                : 'var(--surface-3)',
              color: hue
                ? `color-mix(in srgb, ${hue} 70%, var(--text-tertiary))`
                : 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {tech}
          </span>
        )
      })}
      {overflow > 0 && (
        <span
          className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium"
          style={{
            background: 'var(--surface-3)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
