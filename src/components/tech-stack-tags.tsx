/* Tech stack pills — CSS var colors adapt to light/dark */

/* Maps tech name → CSS variable name */
const TECH_COLOR_VARS: Record<string, string> = {
  'Next.js':        'var(--text-secondary)',
  'React':          'var(--cyan)',
  'TypeScript':     'var(--blue)',
  'Supabase':       'var(--green)',
  'Stripe':         'var(--indigo)',
  'Tailwind':       'var(--cyan)',
  'Claude':         'var(--orange)',
  'Python':         'var(--yellow)',
  'Node.js':        'var(--green)',
  'Gmail API':      'var(--red)',
  'GitHub Actions': 'var(--text-secondary)',
  'Docker':         'var(--blue)',
  'D3':             'var(--orange)',
  'Three.js':       'var(--text-secondary)',
  'Framer Motion':  'var(--pink)',
  'Markdown':       'var(--text-tertiary)',
  'Telegram':       'var(--cyan)',
  'RSS':            'var(--orange)',
}

export function TechStackTags({ stack, max = 4 }: { stack: string[]; max?: number }) {
  const visible  = stack.slice(0, max)
  const overflow = stack.length - max

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((tech) => {
        const colorVar = TECH_COLOR_VARS[tech] ?? 'var(--text-tertiary)'
        return (
          <span
            key={tech}
            className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium"
            style={{
              background: `color-mix(in srgb, ${colorVar} 10%, var(--surface-2))`,
              color: colorVar,
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
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
