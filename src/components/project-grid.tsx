'use client'

import { useState } from 'react'
import type { ProjectGroup } from '@/lib/projects'
import { ProjectCard } from './project-card'

const GROUP_COLORS: Record<string, string> = {
  'needs-action': '#FF453A',
  'active':       '#30D158',
  'paused':       '#636366',
  'archive':      '#0A84FF',
}

export function ProjectGrid({ groups }: { groups: ProjectGroup[] }) {
  const [archiveOpen, setArchiveOpen] = useState(false)

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const isArchive = group.key === 'archive'
        const isOpen = isArchive ? archiveOpen : true
        const color = GROUP_COLORS[group.key] ?? '#636366'

        return (
          <section key={group.key}>
            {/* Section header */}
            <div
              className="flex items-center gap-2.5 mb-4"
              onClick={isArchive ? () => setArchiveOpen(v => !v) : undefined}
              style={{ cursor: isArchive ? 'pointer' : 'default' }}
              role={isArchive ? 'button' : undefined}
              aria-expanded={isArchive ? isOpen : undefined}
            >
              <span
                className="rounded-full shrink-0"
                style={{ width: 7, height: 7, background: color }}
              />
              <span
                className="text-[11px] font-bold tracking-[0.12em] uppercase font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                {group.label}
              </span>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                style={{
                  background: `${color}14`,
                  border: `1px solid ${color}22`,
                  color: color,
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
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
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
