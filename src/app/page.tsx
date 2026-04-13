import { snapshot, groupProjects, getProjectCounts, getCriticalProjects } from '@/lib/projects'
import { AlertStrip } from '@/components/alert-strip'
import { SummaryRow } from '@/components/summary-row'
import { ProjectGrid } from '@/components/project-grid'
import { Sidebar } from '@/components/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

const syncedAt = snapshot[0]?.syncedAt ?? new Date().toISOString()

export default function Page() {
  const groups   = groupProjects(snapshot)
  const counts   = getProjectCounts(snapshot)
  const critical = getCriticalProjects(snapshot)

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar criticalCount={counts.critical} />

      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 72 }}>

        {/* Sticky header */}
        <header
          className="sticky top-0 z-30 px-6 py-4"
          style={{
            background:           'var(--header-bg)',
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom:         '1px solid var(--border)',
          }}
        >
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-[22px] font-semibold leading-none tracking-[-0.02em]"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                Mission Control
              </h1>
              <p
                className="text-[11px] mt-1 tracking-widest uppercase"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                Project Command Center
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px]"
                style={{
                  background: 'var(--surface-2)',
                  border:     '1px solid var(--border)',
                  color:      'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span className="hidden sm:block">Search projects</span>
              </div>
              <ThemeToggle />
              <button
                title="Refresh: npm run sync:push"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer"
                style={{
                  background: 'var(--surface-2)',
                  border:     '1px solid var(--border)',
                  color:      'var(--text-tertiary)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M16 21h5v-5"/>
                </svg>
              </button>
            </div>
          </div>

          <SummaryRow counts={counts} syncedAt={syncedAt} />
        </header>

        <AlertStrip projects={critical} />

        <main className="flex-1 px-6 py-6">
          <ProjectGrid groups={groups} />
        </main>

        <footer
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p
            className="text-[11px]"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Run{' '}
            <code
              className="px-1.5 py-0.5 rounded"
              style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)', fontFamily: 'inherit' }}
            >
              npm run sync:push
            </code>{' '}
            in{' '}
            <code
              className="px-1.5 py-0.5 rounded"
              style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)', fontFamily: 'inherit' }}
            >
              control-tower/
            </code>{' '}
            to refresh
          </p>
          <p
            className="text-[11px] hidden sm:block"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            New projects in /Agents auto-discovered
          </p>
        </footer>
      </div>
    </div>
  )
}
