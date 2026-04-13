import type { Project } from '@/lib/types'

export function AlertStrip({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <div
      className="mx-4 mt-3 rounded-xl px-5 py-2.5 flex items-center gap-3 flex-wrap"
      style={{
        background: 'color-mix(in srgb, var(--status-critical) 8%, var(--surface-1))',
        border:     '1px solid color-mix(in srgb, var(--status-critical) 22%, transparent)',
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex shrink-0" style={{ width: 8, height: 8 }}>
          <span
            className="absolute inline-flex rounded-full animate-ping"
            style={{ inset: 0, background: 'var(--status-critical)', opacity: 0.5 }}
          />
          <span
            className="relative inline-flex rounded-full"
            style={{ width: 8, height: 8, background: 'var(--status-critical)' }}
          />
        </span>
        <span
          className="text-[11px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--status-critical)', fontFamily: 'var(--font-mono)' }}
        >
          Needs Immediate Action
        </span>
      </div>

      <div
        className="hidden sm:block self-stretch w-px"
        style={{ background: 'color-mix(in srgb, var(--status-critical) 25%, transparent)' }}
      />

      <div className="flex flex-wrap gap-1.5">
        {projects.map((proj) => (
          <span
            key={proj.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: 'color-mix(in srgb, var(--status-critical) 10%, var(--surface-1))',
              border:     '1px solid color-mix(in srgb, var(--status-critical) 22%, transparent)',
              color:      'var(--status-critical)',
            }}
          >
            <span
              className="rounded-full shrink-0"
              style={{
                width: 6,
                height: 6,
                background: proj.status === 'critical' ? 'var(--status-critical)' : 'var(--status-blocked)',
              }}
            />
            {proj.name}
          </span>
        ))}
      </div>
    </div>
  )
}
