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
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors duration-150 cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        color: '#98989F',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.10)'
        ;(e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'
        ;(e.currentTarget as HTMLAnchorElement).style.color = '#98989F'
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

const STATUS_ACCENT: Record<string, string> = {
  new:      '#BF5AF2',
  critical: '#FF453A',
  blocked:  '#FF9F0A',
  active:   '#30D158',
  paused:   '#48484A',
  complete: '#0A84FF',
  dead:     '#2C2C2E',
}

export function ProjectCard({ project: p }: { project: Project }) {
  const accentColor = STATUS_ACCENT[p.status] ?? '#48484A'
  const isCritical = p.status === 'critical'
  const isNew = p.status === 'new'

  return (
    <article
      className="group relative flex flex-col overflow-hidden cursor-default"
      style={{
        background: isCritical
          ? 'rgba(255, 69, 58, 0.06)'
          : isNew
          ? 'rgba(191, 90, 242, 0.05)'
          : 'var(--surface-1)',
        border: isCritical
          ? '1px solid rgba(255, 69, 58, 0.20)'
          : isNew
          ? '1px solid rgba(191, 90, 242, 0.18)'
          : '1px solid var(--border)',
        borderRadius: 14,
        borderLeft: `3px solid ${accentColor}`,
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.40)'
        if (!isCritical && !isNew) {
          el.style.borderColor = 'rgba(255, 255, 255, 0.14)'
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = ''
        el.style.borderColor = isCritical
          ? 'rgba(255, 69, 58, 0.20)'
          : isNew
          ? 'rgba(191, 90, 242, 0.18)'
          : 'var(--border)'
      }}
    >
      {/* ── Card header ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className="text-[15px] font-bold leading-tight font-display tracking-tight"
            style={{ color: 'var(--text-primary)' }}
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
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

      {/* ── NEXT ACTION — primary reading target ── */}
      <div
        className="px-4 py-3"
        style={{ background: 'rgba(255, 159, 10, 0.06)' }}
      >
        <p
          className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5 font-mono"
          style={{ color: 'rgba(255, 159, 10, 0.55)' }}
        >
          Next Action
        </p>
        <p
          className="text-[13px] font-semibold leading-snug"
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
                style={{ color: '#FF453A' }}
              >
                <span className="mt-0.5 shrink-0" aria-hidden="true">▸</span>
                {b}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ── Hairline ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

      {/* ── Footer ── */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <TechStackTags stack={p.techStack} max={4} />
          <div className="flex items-center gap-1.5">
            {p.githubUrl && <ExternalLink href={p.githubUrl} label="GitHub" icon={<GithubIcon />} />}
            {p.vercelUrl && <ExternalLink href={p.vercelUrl} label="Live" icon={<VercelIcon />} />}
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
        <div style={{ height: 2, background: 'rgba(255,255,255,0.06)' }}>
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
