import { getStaleness, getRelativeTime } from '@/lib/projects'

interface ActivityDotProps {
  lastCommitDate?: string
  lastCommitMessage?: string
  lastCommitHash?: string
}

const STALENESS_COLORS = {
  fresh:   '#30D158',   /* Apple green */
  recent:  '#FF9F0A',   /* Apple orange */
  stale:   '#FF453A',   /* Apple red */
  unknown: '#3A3A3C',   /* Apple system gray 4 */
}

const STALENESS_TEXT = {
  fresh:   '#30D158',
  recent:  '#FF9F0A',
  stale:   '#FF453A',
  unknown: '#636366',
}

export function ActivityDot({ lastCommitDate, lastCommitMessage, lastCommitHash }: ActivityDotProps) {
  const staleness = getStaleness(lastCommitDate)
  const relTime = getRelativeTime(lastCommitDate)
  const dotColor = STALENESS_COLORS[staleness]
  const textColor = STALENESS_TEXT[staleness]

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="relative flex items-center justify-center shrink-0" style={{ width: 8, height: 8 }}>
        {staleness === 'fresh' && (
          <span
            className="absolute inline-flex rounded-full animate-ping"
            style={{ inset: 0, background: dotColor, opacity: 0.45 }}
          />
        )}
        <span
          className="relative rounded-full"
          style={{ width: 8, height: 8, background: dotColor }}
        />
      </span>
      <span
        className="text-[11px] font-mono shrink-0 font-semibold"
        style={{ color: textColor }}
      >
        {relTime}
      </span>
      {lastCommitMessage && (
        <span
          className="text-[11px] font-mono truncate min-w-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {lastCommitMessage.slice(0, 52)}{lastCommitMessage.length > 52 ? '…' : ''}
        </span>
      )}
      {lastCommitHash && (
        <span
          className="text-[10px] font-mono shrink-0 hidden sm:block"
          style={{ color: 'var(--text-muted)' }}
        >
          {lastCommitHash}
        </span>
      )}
    </div>
  )
}
