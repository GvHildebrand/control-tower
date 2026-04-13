import type { Project, ProjectPriority } from '@/lib/types'
import { getRelativeTime } from '@/lib/projects'

const PRIORITY_WEIGHT: Record<ProjectPriority, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1,
}

const PRIORITY_COLOR: Record<ProjectPriority, string> = {
  CRITICAL: '#FF3B30', HIGH: '#FF9500', MEDIUM: '#007AFF', LOW: '#8E8E93',
}

function daysSince(iso?: string): number {
  if (!iso) return 999
  return (Date.now() - new Date(iso).getTime()) / 86_400_000
}

type Row = {
  id: string; name: string; priority: ProjectPriority
  days: number; relTime: string; score: number
}

function computeRows(projects: Project[]): Row[] {
  return projects
    .filter(p => p.status !== 'dead' && p.status !== 'complete')
    .map(p => {
      const days = daysSince(p.lastCommitDate)
      return {
        id:       p.id,
        name:     p.name,
        priority: p.priority,
        days,
        relTime:  getRelativeTime(p.lastCommitDate),
        score:    Math.round(PRIORITY_WEIGHT[p.priority] * Math.min(days, 60)),
      }
    })
    .sort((a, b) => b.score - a.score)
}

export function MismatchTable({ projects }: { projects: Project[] }) {
  const rows = computeRows(projects)
  const maxScore = Math.max(...rows.map(r => r.score), 1)

  return (
    <div
      style={{
        background:   'var(--surface-1)',
        borderRadius: 10,
        border:       '1px solid var(--border)',
        boxShadow:    'var(--card-shadow)',
        overflow:     'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
        }}>
          Priority vs Attention
        </h3>
        <p style={{
          fontSize: 11, color: 'var(--text-meta)', marginTop: 2,
          fontFamily: 'var(--font-body)',
        }}>
          High score = high priority but untouched
        </p>
      </div>

      {/* Rows */}
      <div style={{ padding: '4px 0' }}>
        {rows.map((row) => (
          <div
            key={row.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 20px',
            }}
          >
            {/* Priority dot */}
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: PRIORITY_COLOR[row.priority],
            }} />

            {/* Name */}
            <span style={{
              fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)', width: 150, flexShrink: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {row.name}
            </span>

            {/* Priority badge */}
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
              color: PRIORITY_COLOR[row.priority],
              background: `${PRIORITY_COLOR[row.priority]}18`,
              padding: '2px 8px', borderRadius: 999, flexShrink: 0,
            }}>
              {row.priority}
            </span>

            {/* Last commit */}
            <span style={{
              fontSize: 11, color: 'var(--text-meta)', fontFamily: 'var(--font-body)',
              width: 64, flexShrink: 0, textAlign: 'right',
            }}>
              {row.relTime}
            </span>

            {/* Neglect bar */}
            <div style={{ flex: 1, height: 4, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(row.score / maxScore) * 100}%`,
                borderRadius: 2,
                background: row.score / maxScore > 0.6
                  ? 'var(--red)'
                  : row.score / maxScore > 0.3
                    ? 'var(--orange)'
                    : 'var(--green)',
                transition: 'width 500ms ease',
              }} />
            </div>

            {/* Score */}
            <span style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-meta)',
              fontFamily: 'var(--font-body)', width: 28, textAlign: 'right', flexShrink: 0,
            }}>
              {row.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
