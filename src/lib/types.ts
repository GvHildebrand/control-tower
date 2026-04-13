export type ProjectStatus =
  | 'critical'
  | 'new'
  | 'active'
  | 'blocked'
  | 'paused'
  | 'complete'
  | 'dead'

export type ProjectPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export type ProjectType =
  | 'saas-nextjs'
  | 'agent-node'
  | 'agent-python'
  | 'docs'
  | 'stub'
  | 'unknown'

export interface Project {
  // Human-edited in projects.config.ts
  id: string
  name: string
  type: ProjectType
  description: string
  localPath: string
  githubUrl?: string
  vercelUrl?: string
  status: ProjectStatus
  priority: ProjectPriority
  progressPercent?: number
  nextAction: string
  blockers?: string[]
  techStack: string[]
  tags?: string[]

  // CLI-populated in snapshot.json
  lastCommitHash?: string
  lastCommitMessage?: string
  lastCommitDate?: string   // ISO 8601
  lastCommitAuthor?: string
  totalCommits?: number
  activeBranch?: string
  statusSummary?: string    // from CLAUDE.md / EXEC_SUMMARY.md
  syncedAt: string
}

export type ProjectConfig = Omit<
  Project,
  | 'lastCommitHash'
  | 'lastCommitMessage'
  | 'lastCommitDate'
  | 'lastCommitAuthor'
  | 'totalCommits'
  | 'activeBranch'
  | 'statusSummary'
  | 'syncedAt'
>
