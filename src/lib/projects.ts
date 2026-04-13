import type { Project, ProjectStatus } from './types'

// Import snapshot at build time (static)
// To switch to live data later: replace with fetch() from Supabase
import snapshotData from '@/data/snapshot.json'

export const snapshot = snapshotData as Project[]

// ── Grouping ────────────────────────────────────────────────────────────────────

export type ProjectGroup = {
  label: string
  key: string
  projects: Project[]
  color: string
}

const STATUS_NEEDS_ACTION: ProjectStatus[] = ['new', 'critical', 'blocked']
const STATUS_ACTIVE: ProjectStatus[] = ['active']
const STATUS_PAUSED: ProjectStatus[] = ['paused']
const STATUS_ARCHIVE: ProjectStatus[] = ['complete', 'dead']

export function groupProjects(projects: Project[]): ProjectGroup[] {
  const needsAction = projects.filter((p) => STATUS_NEEDS_ACTION.includes(p.status))
  const active = projects.filter((p) => STATUS_ACTIVE.includes(p.status))
  const paused = projects.filter((p) => STATUS_PAUSED.includes(p.status))
  const archive = projects.filter((p) => STATUS_ARCHIVE.includes(p.status))

  return [
    { label: 'Needs Action', key: 'needs-action', projects: needsAction, color: '#FF3B3B' },
    { label: 'Active', key: 'active', projects: active, color: '#00D68F' },
    { label: 'Paused', key: 'paused', projects: paused, color: '#5A5A7A' },
    { label: 'Archive', key: 'archive', projects: archive, color: '#2A2A3A' },
  ].filter((g) => g.projects.length > 0)
}

// ── Counts ─────────────────────────────────────────────────────────────────────

export type ProjectCounts = {
  total: number
  critical: number
  needsAction: number
  active: number
  paused: number
  archive: number
  new: number
}

export function getProjectCounts(projects: Project[]): ProjectCounts {
  return {
    total: projects.length,
    critical: projects.filter((p) => p.status === 'critical' || p.priority === 'CRITICAL').length,
    needsAction: projects.filter((p) => STATUS_NEEDS_ACTION.includes(p.status)).length,
    active: projects.filter((p) => p.status === 'active').length,
    paused: projects.filter((p) => p.status === 'paused').length,
    archive: projects.filter((p) => STATUS_ARCHIVE.includes(p.status)).length,
    new: projects.filter((p) => p.status === 'new').length,
  }
}

// ── Staleness ──────────────────────────────────────────────────────────────────

export type StalenessLevel = 'fresh' | 'recent' | 'stale' | 'unknown'

export function getStaleness(lastCommitDate?: string): StalenessLevel {
  if (!lastCommitDate) return 'unknown'
  const diff = Date.now() - new Date(lastCommitDate).getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 3) return 'fresh'
  if (days < 7) return 'recent'
  return 'stale'
}

export function getRelativeTime(date?: string): string {
  if (!date) return 'never'
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (mins < 2) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 5) return `${weeks}w ago`
  return `${months}mo ago`
}

// ── Critical alerts ─────────────────────────────────────────────────────────────

export function getCriticalProjects(projects: Project[]): Project[] {
  return projects.filter(
    (p) => p.status === 'critical' || p.status === 'blocked' || p.priority === 'CRITICAL'
  )
}
