'use client'

import { useState } from 'react'
import type { ProjectGroup } from '@/lib/projects'
import { ProjectCard } from './project-card'

const GROUP_LABEL: Record<string, string> = {
  'needs-action': 'Needs Action',
  'active':       'Active',
  'paused':       'Paused',
  'archive':      'Archived',
}

export function ProjectGrid({ groups }: { groups: ProjectGroup[] }) {
  const [archiveOpen, setArchiveOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {groups.map((group) => {
        const isArchive = group.key === 'archive'
        const isOpen    = isArchive ? archiveOpen : true
        const label     = GROUP_LABEL[group.key] ?? group.label
        const count     = group.projects.length

        return (
          <section key={group.key}>
            {/* Section divider header */}
            <div
              onClick={isArchive ? () => setArchiveOpen(v => !v) : undefined}
              role={isArchive ? 'button' : undefined}
              aria-expanded={isArchive ? isOpen : undefined}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        10,
                marginBottom: 16,
                cursor:     isArchive ? 'pointer' : 'default',
              }}
            >
              <span
                style={{
                  fontSize:   13,
                  fontWeight: 600,
                  color:      'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize:   12,
                  fontWeight: 500,
                  color:      'var(--text-meta)',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap',
                }}
              >
                {count}
              </span>
              {/* Hairline rule — fills remaining space */}
              <div
                style={{
                  flex:       1,
                  height:     1,
                  background: 'var(--border)',
                }}
              />
              {isArchive && (
                <span
                  style={{
                    fontSize:  11,
                    color:     'var(--text-meta)',
                    userSelect: 'none',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {isOpen ? '▲' : '▼'}
                </span>
              )}
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
