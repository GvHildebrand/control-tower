'use client'

import type { Project } from '@/lib/types'
import { StatusBadge, PriorityBadge } from './status-badge'
import { TechStackTags } from './tech-stack-tags'
import { getStaleness, getRelativeTime } from '@/lib/projects'

const GithubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

const STALENESS_COLOR = {
  fresh:   'var(--green)',
  recent:  'var(--orange)',
  stale:   'var(--red)',
  unknown: 'var(--text-meta)',
}

export function ProjectCard({ project: p }: { project: Project }) {
  const isCritical = p.status === 'critical'
  const staleness  = getStaleness(p.lastCommitDate)
  const relTime    = getRelativeTime(p.lastCommitDate)
  const dotColor   = STALENESS_COLOR[staleness]

  return (
    <article
      className={`flex flex-col cursor-default ${isCritical ? 'critical-glow' : ''}`}
      style={{
        background:    'var(--surface-1)',
        borderRadius:  10,
        border:        '1px solid var(--border)',
        padding:       '24px',
        boxShadow:     'var(--card-shadow)',
        gap:           16,
        transition:    'transform 180ms cubic-bezier(.4,0,.2,1), box-shadow 180ms cubic-bezier(.4,0,.2,1)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-1px)'
        el.style.boxShadow = 'var(--card-shadow-hover)'
        el.style.borderColor = 'var(--border-hover)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = 'var(--card-shadow)'
        el.style.borderColor = 'var(--border)'
      }}
    >
      {/* ── Name + Description ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {p.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <PriorityBadge priority={p.priority} />
            <StatusBadge status={p.status} />
          </div>
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
          }}
        >
          {p.description}
        </p>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* ── NEXT ACTION ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--next-action-label)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ↗ Next Action
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
            color: 'var(--next-action)',
          }}
        >
          {p.nextAction}
        </p>
        {p.blockers && p.blockers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {p.blockers.map((b, i) => (
              <p key={i} style={{ fontSize: 12, color: 'var(--red)', lineHeight: 1.4 }}>
                ▸ {b}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ── Tags + Links ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <TechStackTags stack={p.techStack} max={4} />
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 500,
                background: 'var(--surface-3)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'background 150ms ease',
              }}
            >
              <GithubIcon /> GitHub
            </a>
          )}
          {p.vercelUrl && (
            <a
              href={p.vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 500,
                background: `color-mix(in srgb, var(--blue) 10%, var(--surface-3))`,
                color: 'var(--blue)',
                textDecoration: 'none',
              }}
            >
              <ExternalIcon /> Live
            </a>
          )}
        </div>
      </div>

      {/* ── Activity ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Staleness dot */}
        <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7, flexShrink: 0 }}>
          {staleness === 'fresh' && (
            <span
              className="animate-ping"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: dotColor,
                opacity: 0.45,
              }}
            />
          )}
          <span
            style={{
              position: 'relative',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: dotColor,
              flexShrink: 0,
            }}
          />
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: dotColor,
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}
        >
          {relTime}
        </span>
        {p.lastCommitMessage && (
          <span
            style={{
              fontSize: 12,
              color: 'var(--text-meta)',
              fontFamily: 'var(--font-mono)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            {p.lastCommitMessage.slice(0, 55)}{p.lastCommitMessage.length > 55 ? '…' : ''}
          </span>
        )}
      </div>

      {/* ── Progress ── */}
      {p.progressPercent !== undefined && (
        <div
          style={{
            height: 2,
            background: 'var(--border)',
            borderRadius: 1,
            overflow: 'hidden',
            marginTop: -8,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${p.progressPercent}%`,
              background: 'var(--blue)',
              transition: 'width 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      )}
    </article>
  )
}
