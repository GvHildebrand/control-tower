/* Apple dark mode tech stack pills — solid color on dark surface */

const TECH_COLORS: Record<string, { bg: string; text: string }> = {
  'Next.js':        { bg: 'rgba(255,255,255,0.08)', text: '#EBEBF5' },
  'React':          { bg: 'rgba(50,173,230,0.15)',  text: '#32ADE6' },
  'TypeScript':     { bg: 'rgba(10,132,255,0.15)',  text: '#0A84FF' },
  'Supabase':       { bg: 'rgba(48,209,88,0.15)',   text: '#30D158' },
  'Stripe':         { bg: 'rgba(94,92,230,0.15)',   text: '#5E5CE6' },
  'Tailwind':       { bg: 'rgba(50,173,230,0.12)',  text: '#32ADE6' },
  'Claude':         { bg: 'rgba(255,159,10,0.15)',  text: '#FF9F0A' },
  'Python':         { bg: 'rgba(255,214,10,0.12)',  text: '#FFD60A' },
  'Node.js':        { bg: 'rgba(48,209,88,0.12)',   text: '#30D158' },
  'Gmail API':      { bg: 'rgba(255,69,58,0.12)',   text: '#FF453A' },
  'GitHub Actions': { bg: 'rgba(255,255,255,0.07)', text: '#98989F' },
  'Docker':         { bg: 'rgba(10,132,255,0.12)',  text: '#0A84FF' },
  'D3':             { bg: 'rgba(255,159,10,0.12)',  text: '#FF9F0A' },
  'Three.js':       { bg: 'rgba(255,255,255,0.08)', text: '#98989F' },
  'Framer Motion':  { bg: 'rgba(255,55,95,0.12)',   text: '#FF375F' },
  'Markdown':       { bg: 'rgba(99,99,102,0.20)',   text: '#98989F' },
  'Telegram':       { bg: 'rgba(50,173,230,0.12)',  text: '#32ADE6' },
  'RSS':            { bg: 'rgba(255,159,10,0.12)',  text: '#FF9F0A' },
}

const DEFAULT = { bg: 'rgba(99,99,102,0.15)', text: '#98989F' }

export function TechStackTags({ stack, max = 4 }: { stack: string[]; max?: number }) {
  const visible = stack.slice(0, max)
  const overflow = stack.length - max
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((tech) => {
        const { bg, text } = TECH_COLORS[tech] ?? DEFAULT
        return (
          <span
            key={tech}
            className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold"
            style={{ background: bg, color: text }}
          >
            {tech}
          </span>
        )
      })}
      {overflow > 0 && (
        <span
          className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold"
          style={{ background: DEFAULT.bg, color: DEFAULT.text }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
