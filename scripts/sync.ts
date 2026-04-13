#!/usr/bin/env tsx
/**
 * Mission Control — Project Sync Script
 *
 * Auto-discovers all projects in AGENTS_DIR, reads git metadata and status files,
 * merges with human-curated projects.config.ts, writes src/data/snapshot.json.
 *
 * Usage:
 *   npm run sync        — generate snapshot.json locally
 *   npm run sync:push   — sync + commit + push (triggers Vercel redeploy)
 */

import { execSync, spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// ── Config ─────────────────────────────────────────────────────────────────────
const AGENTS_DIR = path.resolve(__dirname, '../..')
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/snapshot.json')
const CONFIG_FILE = path.resolve(__dirname, '../src/data/projects.config.ts')

// ── Types (inline to avoid import issues in tsx) ───────────────────────────────
type ProjectStatus = 'critical' | 'new' | 'active' | 'blocked' | 'paused' | 'complete' | 'dead'
type ProjectPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type ProjectType = 'saas-nextjs' | 'agent-node' | 'agent-python' | 'docs' | 'stub' | 'unknown'

interface Project {
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
  lastCommitHash?: string
  lastCommitMessage?: string
  lastCommitDate?: string
  lastCommitAuthor?: string
  totalCommits?: number
  activeBranch?: string
  statusSummary?: string
  syncedAt: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function git(args: string[], cwd: string): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' })
  if (result.error || result.status !== 0) return ''
  return (result.stdout || '').trim()
}

function run(cmd: string, cwd: string): string {
  try {
    return execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function isGitRepo(dir: string): boolean {
  return git(['rev-parse', '--git-dir'], dir) !== ''
}

function getGitData(dir: string) {
  const hash    = git(['log', '-1', '--format=%H'],  dir)
  const subject = git(['log', '-1', '--format=%s'],  dir)
  const date    = git(['log', '-1', '--format=%aI'], dir)
  const author  = git(['log', '-1', '--format=%an'], dir)

  if (!hash) return {}

  const totalStr = git(['rev-list', '--count', 'HEAD'], dir)
  const branch   = git(['rev-parse', '--abbrev-ref', 'HEAD'], dir)

  return {
    lastCommitHash:    hash.slice(0, 7),
    lastCommitMessage: subject,
    lastCommitDate:    date,
    lastCommitAuthor:  author,
    totalCommits:      totalStr ? parseInt(totalStr, 10) : undefined,
    activeBranch:      branch || 'main',
  }
}

function getStatusSummary(dir: string): string | undefined {
  const candidates = ['EXEC_SUMMARY.md', 'CLAUDE.md', 'README.md']
  for (const file of candidates) {
    const fp = path.join(dir, file)
    if (!fs.existsSync(fp)) continue
    const content = fs.readFileSync(fp, 'utf8')

    // Try to find a Status/Current State section
    const sectionMatch = content.match(
      /##\s+(?:status|current[_ ]?state|overview)[^\n]*\n+([\s\S]{20,400}?)(?:\n##|\n---|\n\*\*\*|$)/i
    )
    if (sectionMatch) {
      return sectionMatch[1].replace(/[#*_`>\[\]]/g, '').replace(/\n+/g, ' ').trim().slice(0, 220)
    }

    // Fall back to first meaningful paragraph
    const paras = content.split(/\n{2,}/).filter((p) => p.trim().length > 40)
    if (paras.length > 0) {
      return paras[0].replace(/[#*_`>\[\]]/g, '').replace(/\n+/g, ' ').trim().slice(0, 220)
    }
  }
  return undefined
}

function detectTechStack(dir: string): string[] {
  const stack: string[] = []
  const pkgPath = path.join(dir, 'package.json')
  const reqPath = path.join(dir, 'requirements.txt')

  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }
      if (deps['next']) stack.push('Next.js')
      if (deps['@supabase/supabase-js'] || deps['@supabase/ssr']) stack.push('Supabase')
      if (deps['stripe']) stack.push('Stripe')
      if (deps['@anthropic-ai/sdk']) stack.push('Claude')
      if (deps['googleapis']) stack.push('Gmail API')
      if (deps['d3']) stack.push('D3')
      if (deps['three']) stack.push('Three.js')
      if (deps['framer-motion']) stack.push('Framer Motion')
      if (!stack.includes('Next.js') && (deps['react'] || deps['react-dom'])) stack.push('React')
      if (deps['typescript'] || deps['ts-node'] || deps['tsx']) stack.push('TypeScript')
      if (deps['tailwindcss']) stack.push('Tailwind')
      if (deps['node-cron']) stack.push('node-cron')
      if (deps['taskforce-aiagent']) stack.push('taskforce-aiagent')
      if (stack.length === 0) stack.push('Node.js')
    } catch {
      stack.push('Node.js')
    }
  }

  if (fs.existsSync(reqPath)) {
    const req = fs.readFileSync(reqPath, 'utf8')
    stack.push('Python')
    if (req.includes('feedparser')) stack.push('RSS')
    if (req.includes('telegram')) stack.push('Telegram')
  }

  // Check for Python files if no requirements.txt
  if (stack.length === 0) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.py'))
    if (files.length > 0) stack.push('Python')
  }

  return [...new Set(stack)]
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Load config ────────────────────────────────────────────────────────────────
// We read the config file as text and eval the array — safe since it's our own file
function loadConfig(): Map<string, any> {
  const content = fs.readFileSync(CONFIG_FILE, 'utf8')
  // Extract the array literal from the export
  const match = content.match(/export const projectsConfig[^=]*=\s*(\[[\s\S]*?\n\])/m)
  const skipMatch = content.match(/export const SKIP_FOLDERS[^=]*=\s*(\[[\s\S]*?\])/m)

  let configs: any[] = []
  let skipFolders: string[] = ['control-tower', 'node_modules', '.git']

  try {
    // Use a simple require approach via tsx
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(CONFIG_FILE)
    configs = mod.projectsConfig || mod.default?.projectsConfig || []
    skipFolders = mod.SKIP_FOLDERS || skipFolders
  } catch {
    // Fallback: parse manually if require fails
    if (match) {
      try {
        configs = eval(match[1]) // eslint-disable-line no-eval
      } catch (e) {
        console.warn('Could not parse projects.config.ts:', e)
      }
    }
    if (skipMatch) {
      try {
        skipFolders = eval(skipMatch[1]) // eslint-disable-line no-eval
      } catch {}
    }
  }

  const map = new Map<string, any>()
  for (const c of configs) {
    map.set(c.id, c)
    // Also index by local path basename for matching
    map.set(path.basename(c.localPath), c)
  }
  return map
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔭 Mission Control — syncing projects...\n')

  // Load skip list from config
  let skipFolders = ['control-tower', 'node_modules', '.git']
  let configMap = new Map<string, any>()
  let allConfigs: any[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(CONFIG_FILE)
    allConfigs = mod.projectsConfig || []
    skipFolders = mod.SKIP_FOLDERS || skipFolders
    for (const c of allConfigs) {
      configMap.set(c.id, c)
      configMap.set(path.basename(c.localPath), c)
    }
  } catch (e) {
    console.warn('⚠️  Could not load projects.config.ts:', e)
  }

  // Discover all folders in AGENTS_DIR
  const entries = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
  const folders = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !skipFolders.includes(e.name))
    .map((e) => path.join(AGENTS_DIR, e.name))

  const projects: Project[] = []
  const syncedAt = new Date().toISOString()

  for (const dir of folders) {
    const folderName = path.basename(dir)

    // Look up config by folder name or by matching localPath
    const configByFolder = configMap.get(folderName)
    // Also try to match by localPath basename
    const configByPath = allConfigs.find((c: any) => path.basename(c.localPath) === folderName)
    const config = configByFolder || configByPath

    const gitData = isGitRepo(dir) ? getGitData(dir) : {}
    const statusSummary = getStatusSummary(dir)
    const autoStack = detectTechStack(dir)

    if (config) {
      // Known project — merge git data with human config
      projects.push({
        ...config,
        techStack: config.techStack?.length ? config.techStack : autoStack,
        ...gitData,
        statusSummary: statusSummary || undefined,
        syncedAt,
      })
      console.log(`  ✓ ${config.name} (${config.status}) — ${gitData.lastCommitDate ? new Date(gitData.lastCommitDate as string).toLocaleString() : 'no git'}`)
    } else {
      // Unknown project — auto-create entry
      const id = slugify(folderName)
      projects.push({
        id,
        name: folderName,
        type: 'unknown',
        description: statusSummary?.slice(0, 100) || 'Auto-discovered project — needs triage.',
        localPath: dir,
        status: 'new',
        priority: 'MEDIUM',
        nextAction: 'NEW PROJECT — add to projects.config.ts to set priority, status, and next action.',
        techStack: autoStack,
        tags: ['auto-discovered'],
        ...gitData,
        statusSummary: statusSummary || undefined,
        syncedAt,
      })
      console.log(`  + ${folderName} (NEW — auto-discovered)`)
    }
  }

  // Also include config entries whose localPath doesn't exist locally (show as offline)
  for (const config of allConfigs) {
    const alreadyIncluded = projects.some((p) => p.id === config.id)
    if (!alreadyIncluded) {
      projects.push({
        ...config,
        syncedAt,
        statusSummary: 'Local path not found — project may be on another machine or path changed.',
      })
      console.log(`  ⚠ ${config.name} — local path not found`)
    }
  }

  // Sort: critical first, then by priority, then by last commit date
  const priorityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  const statusOrder: Record<string, number> = {
    new: 0, critical: 1, blocked: 2, active: 3, paused: 4, complete: 5, dead: 6,
  }

  projects.sort((a, b) => {
    const sd = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
    if (sd !== 0) return sd
    const pd = (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
    if (pd !== 0) return pd
    // Most recently active first
    const da = a.lastCommitDate ? new Date(a.lastCommitDate).getTime() : 0
    const db = b.lastCommitDate ? new Date(b.lastCommitDate).getTime() : 0
    return db - da
  })

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2))

  console.log(`\n✅ Synced ${projects.length} projects → src/data/snapshot.json`)
  console.log(`   Synced at: ${new Date(syncedAt).toLocaleString()}\n`)

  // Summary
  const counts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const parts = Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(' · ')
  console.log(`   ${parts}`)
}

main().catch((e) => {
  console.error('Sync failed:', e)
  process.exit(1)
})
