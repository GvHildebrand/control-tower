import type { Project } from '@/lib/types'

export function AlertStrip({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <div
      className="mx-4 mt-3 rounded-xl px-5 py-2.5 flex items-center gap-3 flex-wrap"
      style={{
        background: 'rgba(255, 69, 58, 0.10)',
        border: '1px solid rgba(255, 69, 58, 0.22)',
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        {/* Pulsing dot */}
        <span className="relative flex" style={{ width: 8, height: 8 }}>
          <span
            className="absolute inline-flex rounded-full animate-ping"
            style={{ inset: 0, background: '#FF453A', opacity: 0.5 }}
          />
          <span
            className="relative inline-flex rounded-full"
            style={{ width: 8, height: 8, background: '#FF453A' }}
          />
        </span>
        <span
          className="text-[11px] font-bold tracking-widest uppercase font-mono"
          style={{ color: '#FF453A' }}
        >
          Needs Immediate Action
        </span>
      </div>

      <div
        className="hidden sm:block self-stretch w-px"
        style={{ background: 'rgba(255, 69, 58, 0.25)' }}
      />

      <div className="flex flex-wrap gap-1.5">
        {projects.map((proj) => (
          <span
            key={proj.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background: 'rgba(255, 69, 58, 0.12)',
              border: '1px solid rgba(255, 69, 58, 0.22)',
              color: '#FF6961',
            }}
          >
            <span
              className="rounded-full shrink-0"
              style={{
                width: 6,
                height: 6,
                background: proj.status === 'critical' ? '#FF453A' : '#FF9F0A',
              }}
            />
            {proj.name}
          </span>
        ))}
      </div>
    </div>
  )
}
