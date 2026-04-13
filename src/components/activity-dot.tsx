import { getStaleness, getRelativeTime } from '@/lib/projects'

interface ActivityDotProps {
  lastCommitDate?: string
  lastCommitMessage?: string
  lastCommitHash?: string
}

const STALENESS_VAR = {
  fresh:   'var(--green)',
  recent:  'var(--orange)',
  stale:   'var(--red)',
  unknown: 'var(--text-muted)',
}

export function ActivityDot({ lastCommitDate, lastCommitMessage, lastCommitHash }: ActivityDotProps) {
  const staleness = getStaleness(lastCommitDate)
  const relTime   = getRelativeTime(lastCommitDate)
  const colorVar  = STALENESS_VAR[staleness]

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="relative flex items-center justify-center shrink-0" style={{ width: 8, height: 8 }}>
        {staleness === 'fresh' && (
          <span
            className="absolute inline-flex rounded-full animate-ping"
            style={{ inset: 0, background: colorVar, opacity: 0.45 }}
          />
        )}
        <span
          className="relative rounded-full"
          style={{ width: 8, height: 8, background: colorVar }}
        />
      </span>
      <span
        className="text-[11px] shrink-0 font-medium"
        style={{ color: colorVar, fontFamily: 'var(--font-mono)' }}
      >
        {relTime}
      </span>
      {lastCommitMessage && (
        <span
          className="text-[11px] truncate min-w-0"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          {lastCommitMessage.slice(0, 52)}{lastCommitMessage.length > 52 ? '…' : ''}
        </span>
      )}
      {lastCommitHash && (
        <span
          className="text-[10px] shrink-0 hidden sm:block"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          {lastCommitHash}
        </span>
      )}
    </div>
  )
}
