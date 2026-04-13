'use client'

import type { Project } from '@/lib/types'
import { StatusBadge, PriorityBadge } from './status-badge'
import { ActivityDot } from './activity-dot'
import { TechStackTags } from './tech-stack-tags'

function ExternalLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'var(--surface-3)'
        el.style.color = 'var(--text-primary)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'var(--surface-2)'
        el.style.color = 'var(--text-tertiary)'
      }}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}

const GithubIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const VercelIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
)

/* CSS variable references — adapts automatically to light/dark */
const STATUS_ACCENT: Record<string, string> = {
  new:      'var(--status-new)',
  critical: 'var(--status-critical)',
  blocked:  'var(--status-blocked)',
  active:   'var(--status-active)',
  paused:   'var(--status-paused)',
  complete: 'var(--status-complete)',
  dead:     'var(--status-dead)',
}

export function ProjectCard({ project: p }: { project: Project }) {
  const accentColor = STATUS_ACCENT[p.status] ?? 'var(--status-paused)'
  const isCritical  = p.status === 'critical'
  const isNew       = p.status === 'new'
  const isBlocked   = p.status === 'blocked'

  const cardBg = isCritical
    ? 'color-mix(in srgb, var(--status-critical) 5%, var(--surface-1))'
    : isNew
    ? 'color-mix(in srgb, var(--status-new) 4%, var(--surface-1))'
    : isBlocked
    ? 'color-mix(in srgb, var(--status-blocked) 4%, var(--surface-1))'
    : 'var(--surface-1)'

  const cardBorderColor = isCritical
    ? 'color-mix(in srgb, var(--status-critical) 22%, transparent)'
    : isNew
    ? 'color-mix(in srgb, var(--status-new) 18%, transparent)'
    : isBlocked
    ? 'color-mix(in srgb, var(--status-blocked) 18%, transparent)'
    : 'var(--border)'

  return (
    <article
      className="group relative flex flex-col overflow-hidden cursor-default"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorderColor}`,
        borderRadius: 14,
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: 'var(--card-shadow)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = 'var(--card-shadow-hover)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = 'var(--card-shadow)'
      }}
    >
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className="text-[15px] font-semibold leading-tight tracking-[-0.01em]"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {p.name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            <PriorityBadge priority={p.priority} />
            <StatusBadge status={p.status} />
          </div>
        </div>
        <p
          className="text-[12px] leading-snug line-clamp-1"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {p.description}
        </p>
      </div>

      {/* ── Hairline ── */}
      <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />

      {/* ── NEXT ACTION — primary reading target ── */}
      <div className="px-4 py-3.5" style={{ background: 'var(--next-action-bg)' }}>
        <p
          className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-1.5"
          style={{ color: 'var(--next-action-label)', fontFamily: 'var(--font-mono)' }}
        >
          Next Action
        </p>
        <p
          className="text-[13px] font-medium leading-snug"
          style={{ color: 'var(--next-action)' }}
        >
          {p.nextAction}
        </p>
        {p.blockers && p.blockers.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {p.blockers.map((b, i) => (
              <p
                key={i}
                className="text-[11px] flex items-start gap-1.5"
                style={{ color: 'var(--status-critical)' }}
              >
                <span className="mt-0.5 shrink-0" aria-hidden="true">▸</span>
                {b}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ── Hairline ── */}
      <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />

      {/* ── Footer ── */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <TechStackTags stack={p.techStack} max={4} />
          <div className="flex items-center gap-1.5">
            {p.githubUrl && <ExternalLink href={p.githubUrl} label="GitHub" icon={<GithubIcon />} />}
            {p.vercelUrl && <ExternalLink href={p.vercelUrl} label="Live"   icon={<VercelIcon />} />}
          </div>
        </div>
        <ActivityDot
          lastCommitDate={p.lastCommitDate}
          lastCommitMessage={p.lastCommitMessage}
          lastCommitHash={p.lastCommitHash}
        />
      </div>

      {/* ── Progress bar ── */}
      {p.progressPercent !== undefined && (
        <div style={{ height: 2, background: 'var(--border)' }}>
          <div
            style={{
              height: '100%',
              width: `${p.progressPercent}%`,
              background: accentColor,
              transition: 'width 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      )}
    </article>
  )
}
