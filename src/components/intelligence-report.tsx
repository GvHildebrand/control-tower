const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  'monetization':    { color: '#34C759', label: 'Revenue' },
  'open-source':     { color: '#007AFF', label: 'Open Source' },
  'content':         { color: '#AF52DE', label: 'Content' },
  'product':         { color: '#FF9500', label: 'Product' },
  'kill-or-commit':  { color: '#FF3B30', label: 'Decision' },
}

const EFFORT_COLOR: Record<string, string> = {
  LOW: '#34C759', MEDIUM: '#FF9500', HIGH: '#FF3B30',
}

interface Opportunity {
  title: string
  type: string
  effort: string
  impact: string
  description: string
  projects: string[]
}

interface Report {
  generatedAt: string
  headline: string
  opportunities: Opportunity[]
  quickWins: string[]
  weeklyDigest: string
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

export function IntelligenceReport({ report }: { report: Report }) {
  const isEmpty = report.opportunities.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Headline card */}
      <div style={{
        background: 'var(--surface-1)', borderRadius: 10, border: '1px solid var(--border)', padding: 28,
        boxShadow: 'var(--card-shadow)',
      }}>
        <p style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--text-meta)',
          fontFamily: 'var(--font-body)', marginBottom: 10,
        }}>
          Strategic Insight
        </p>
        <h2 style={{
          fontSize: 20, fontWeight: 600, lineHeight: 1.35,
          color: 'var(--text-primary)', fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}>
          {report.headline}
        </h2>
        <p style={{
          fontSize: 11, color: 'var(--text-meta)', marginTop: 12,
          fontFamily: 'var(--font-body)',
        }}>
          Generated {formatDate(report.generatedAt)}
        </p>
      </div>

      {/* Opportunities grid */}
      {!isEmpty && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {report.opportunities.map((opp, i) => {
            const typeConf = TYPE_CONFIG[opp.type] ?? { color: '#8E8E93', label: opp.type }
            return (
              <div key={i} style={{
                background: 'var(--surface-1)', borderRadius: 10, border: '1px solid var(--border)', padding: 22,
                boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {/* Type + Effort/Impact badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
                    background: `${typeConf.color}18`, color: typeConf.color,
                  }}>
                    {typeConf.label}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 999,
                    background: `${EFFORT_COLOR[opp.effort] ?? '#8E8E93'}14`,
                    color: EFFORT_COLOR[opp.effort] ?? '#8E8E93',
                  }}>
                    {opp.effort} effort
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 999,
                    background: 'var(--surface-3)', color: 'var(--text-secondary)',
                  }}>
                    {opp.impact} impact
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)', lineHeight: 1.3, letterSpacing: '-0.01em',
                }}>
                  {opp.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {opp.description}
                </p>

                {/* Related projects */}
                {opp.projects.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {opp.projects.map((p, j) => (
                      <span key={j} style={{
                        fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 6,
                        background: 'var(--surface-3)', color: 'var(--text-meta)',
                      }}>
                        {p === '*' ? 'All projects' : p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Wins */}
      {report.quickWins.length > 0 && (
        <div style={{
          background: 'var(--surface-1)', borderRadius: 10, border: '1px solid var(--border)', padding: 22,
          boxShadow: 'var(--card-shadow)',
        }}>
          <h3 style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)', marginBottom: 12,
          }}>
            Quick Wins
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.quickWins.map((win, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: 'var(--green)',
                  minWidth: 18, flexShrink: 0,
                }}>
                  {i + 1}.
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {win}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Digest */}
      {report.weeklyDigest && (
        <div style={{
          background: 'var(--surface-1)', borderRadius: 10, border: '1px solid var(--border)', padding: 22,
          boxShadow: 'var(--card-shadow)',
        }}>
          <h3 style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)', marginBottom: 10,
          }}>
            Weekly Digest
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {report.weeklyDigest}
          </p>
        </div>
      )}
    </div>
  )
}
