'use client'

import { useState } from 'react'
import type { ProjectGroup } from '@/lib/projects'
import { ProjectCard } from './project-card'

const GROUP_COLOR_VARS: Record<string, string> = {
  'needs-action': 'var(--status-critical)',
  'active':       'var(--status-active)',
  'paused':       'var(--status-paused)',
  'archive':      'var(--status-complete)',
}

export function ProjectGrid({ groups }: { groups: ProjectGroup[] }) {
  const [archiveOpen, setArchiveOpen] = useState(false)

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const isArchive = group.key === 'archive'
        const isOpen    = isArchive ? archiveOpen : true
        const colorVar  = GROUP_COLOR_VARS[group.key] ?? 'var(--status-paused)'

        return (
          <section key={group.key}>
            <div
              className="flex items-center gap-2.5 mb-4"
              onClick={isArchive ? () => setArchiveOpen(v => !v) : undefined}
              style={{ cursor: isArchive ? 'pointer' : 'default' }}
              role={isArchive ? 'button' : undefined}
              aria-expanded={isArchive ? isOpen : undefined}
            >
              <span
                className="rounded-full shrink-0"
                style={{ width: 7, height: 7, background: colorVar }}
              />
              <span
                className="text-[10px] font-semibold tracking-[0.12em] uppercase"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
              >
                {group.label}
              </span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{
                  background: `color-mix(in srgb, ${colorVar} 12%, var(--surface-1))`,
                  border:     `1px solid color-mix(in srgb, ${colorVar} 22%, transparent)`,
                  color:      colorVar,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {group.projects.length}
              </span>
              {isArchive && (
                <span
                  className="ml-1 text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                  aria-hidden="true"
                >
                  {isOpen ? '▲' : '▼'}
                </span>
              )}
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
