'use client'

import { useState } from 'react'
import type { Project, ProjectPriority } from '@/lib/types'
import { StatusBadge, PriorityBadge } from './status-badge'
import { getStaleness, getRelativeTime } from '@/lib/projects'

const PRIORITY_WEIGHT: Record<ProjectPriority, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1,
}

const STALENESS_COLOR = {
  fresh: 'var(--green)', recent: 'var(--orange)', stale: 'var(--red)', unknown: 'var(--text-meta)',
}

function daysSince(iso?: string): number {
  if (!iso) return 999
  return (Date.now() - new Date(iso).getTime()) / 86_400_000
}

function rankProjects(projects: Project[]): Project[] {
  return projects
    .filter(p => p.status !== 'dead' && p.status !== 'complete')
    .map(p => ({
      project: p,
      score: PRIORITY_WEIGHT[p.priority] * 10
        + Math.min(daysSince(p.lastCommitDate), 30)
        - (p.progressPercent ?? 50) * 0.1,
    }))
    .sort((a, b) => b.score - a.score)
    .map(r => r.project)
}

function FocusCard({ project: p, rank }: { project: Project; rank: number }) {
  const staleness = getStaleness(p.lastCommitDate)
  const relTime   = getRelativeTime(p.lastCommitDate)
  const dotColor  = STALENESS_COLOR[staleness]

  return (
    <article
      style={{
        background:   'var(--surface-1)',
        borderRadius: 10,
        border:       '1px solid var(--border)',
        padding:      28,
        boxShadow:    'var(--card-shadow)',
        display:      'flex',
        flexDirection: 'column',
        gap:          16,
      }}
    >
      {/* Rank + Name + Badges */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{
          fontSize: 28, fontWeight: 700, color: 'var(--text-meta)',
          fontFamily: 'var(--font-display)', lineHeight: 1, opacity: 0.4,
          minWidth: 28,
        }}>
          {rank}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h2 style={{
              fontSize: 20, fontWeight: 600, color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>
              {p.name}
            </h2>
            <PriorityBadge priority={p.priority} />
            <StatusBadge status={p.status} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
            {p.description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* NEXT ACTION — large, prominent */}
      <div>
        <p style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--next-action-label)',
          fontFamily: 'var(--font-body)', marginBottom: 6,
        }}>
          ↗ Next Action
        </p>
        <p style={{
          fontSize: 15, fontWeight: 500, lineHeight: 1.5,
          color: 'var(--next-action)',
        }}>
          {p.nextAction}
        </p>
      </div>

      {/* Blockers */}
      {p.blockers && p.blockers.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {p.blockers.map((b, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--red)', lineHeight: 1.4, fontWeight: 500 }}>
              ▸ {b}
            </p>
          ))}
        </div>
      )}

      {/* Progress + Staleness + Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Staleness */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: dotColor, fontFamily: 'var(--font-body)' }}>
            {relTime}
          </span>
        </div>

        {/* Progress */}
        {p.progressPercent !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${p.progressPercent}%`,
                background: 'var(--blue)', borderRadius: 2,
              }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-meta)', fontFamily: 'var(--font-body)' }}>
              {p.progressPercent}%
            </span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Links */}
        {p.githubUrl && (
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)',
            background: 'var(--surface-3)', padding: '4px 10px', borderRadius: 999,
            textDecoration: 'none',
          }}>
            GitHub
          </a>
        )}
        {p.vercelUrl && (
          <a href={p.vercelUrl} target="_blank" rel="noopener noreferrer" style={{
            fontSize: 11, fontWeight: 500, color: 'var(--blue)',
            background: 'color-mix(in srgb, var(--blue) 10%, var(--surface-3))',
            padding: '4px 10px', borderRadius: 999, textDecoration: 'none',
          }}>
            Live
          </a>
        )}
      </div>
    </article>
  )
}

export function FocusView({ projects }: { projects: Project[] }) {
  const ranked    = rankProjects(projects)
  const top3      = ranked.slice(0, 3)
  const rest      = ranked.slice(3)
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top 3 focus cards */}
      {top3.map((p, i) => (
        <FocusCard key={p.id} project={p} rank={i + 1} />
      ))}

      {/* Remaining projects — collapsed */}
      {rest.length > 0 && (
        <div
          style={{
            background:   'var(--surface-1)',
            borderRadius: 10,
        border:       '1px solid var(--border)',
            boxShadow:    'var(--card-shadow)',
            overflow:     'hidden',
          }}
        >
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              width: '100%', padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              Other Projects
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-meta)' }}>{rest.length}</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: 'var(--text-meta)' }}>{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {rest.map(p => {
                const staleness = getStaleness(p.lastCommitDate)
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 20px',
                    }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: STALENESS_COLOR[staleness],
                    }} />
                    <span style={{
                      fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-meta)' }}>
                      {getRelativeTime(p.lastCommitDate)}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
