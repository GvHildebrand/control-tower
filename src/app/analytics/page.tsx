import { snapshot, getProjectCounts } from '@/lib/projects'
import { Sidebar } from '@/components/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { BubbleChart } from '@/components/bubble-chart'
import { MismatchTable } from '@/components/mismatch-table'
import { ActivityHeatmap } from '@/components/activity-heatmap'

export default function AnalyticsPage() {
  const counts = getProjectCounts(snapshot)

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar criticalCount={counts.critical} />

      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 72 }}>
        <header
          className="sticky top-0 z-30 px-6 py-4"
          style={{
            background:           'var(--header-bg)',
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom:         '1px solid var(--border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                style={{
                  fontSize:      22,
                  fontWeight:    600,
                  color:         'var(--text-primary)',
                  fontFamily:    'var(--font-display)',
                  letterSpacing: '-0.02em',
                  lineHeight:    1,
                }}
              >
                Analytics
              </h1>
              <p
                style={{
                  fontSize:      11,
                  color:         'var(--text-meta)',
                  fontFamily:    'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop:     4,
                }}
              >
                Priority · Staleness · Progress
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-6 py-6" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <BubbleChart projects={snapshot} />
          <MismatchTable projects={snapshot} />
          <ActivityHeatmap projects={snapshot} />
        </main>
      </div>
    </div>
  )
}
