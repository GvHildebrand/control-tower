'use client'

import { useState, useCallback } from 'react'
import { useConversation } from '@elevenlabs/react'
import type { Project } from '@/lib/types'

function buildSystemPrompt(projects: Project[]): string {
  const activeProjects = projects.filter(p => !['dead'].includes(p.status))
  const portfolio = activeProjects.map(p => {
    const days = p.lastCommitDate
      ? Math.round((Date.now() - new Date(p.lastCommitDate).getTime()) / 86_400_000)
      : null
    return [
      `- ${p.name} (${p.status}, ${p.priority})`,
      `  Progress: ${p.progressPercent ?? '?'}% | Last commit: ${days !== null ? days + 'd ago' : 'never'}`,
      `  Next action: ${p.nextAction}`,
      p.blockers?.length ? `  Blockers: ${p.blockers.join('; ')}` : null,
      `  Tech: ${p.techStack.join(', ')}`,
      p.vercelUrl ? `  Live: ${p.vercelUrl}` : null,
    ].filter(Boolean).join('\n')
  }).join('\n\n')

  return `You are Solomon, a strategic AI advisor for Gregorio, a solo founder managing ${activeProjects.length} tech projects simultaneously. You know his full portfolio intimately — every project, its status, priority, progress, blockers, and what needs to happen next.

PORTFOLIO DATA (as of today):

${portfolio}

PERSONALITY & RULES:
- You are calm, strategic, warm, and encouraging — like a trusted chief of staff
- Always address him as "Gregorio"
- Reference SPECIFIC projects by name and cite real data (commit age, progress %, blockers)
- Help him prioritize ruthlessly — he has ADHD and loses track of projects
- Suggest monetization paths, cross-project synergies, and quick wins
- Be honest about what's stale or should be killed
- Keep responses concise (2-4 sentences) unless he asks for more detail
- If he asks "what should I work on", recommend the single highest-impact action
- Think like a chief of staff who has been watching this portfolio every day`
}

export function VoiceWidget({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const conversation = useConversation({
    onError: (err) => {
      console.error('Voice error:', err)
      setError(typeof err === 'string' ? err : 'Connection error')
    },
    onConnect: () => {
      setError(null)
    },
    onDisconnect: () => {
      setExpanded(false)
    },
  })

  const status     = conversation.status
  const isSpeaking = conversation.isSpeaking

  const startCall = useCallback(async () => {
    setExpanded(true)
    setError(null)

    try {
      // Get signed URL from our API route
      const res = await fetch('/api/voice/signed-url')
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to get signed URL')
        return
      }

      await conversation.startSession({
        signedUrl: data.signed_url,
        overrides: {
          agent: {
            prompt: {
              prompt: buildSystemPrompt(projects),
            },
            firstMessage: 'Hello Gregorio, Solomon here. What would you like to discuss?',
          },
        },
      })
    } catch (e: any) {
      setError(e.message || 'Failed to start voice session')
    }
  }, [conversation, projects])

  const endCall = useCallback(async () => {
    await conversation.endSession()
    setExpanded(false)
  }, [conversation])

  const isConnected = status === 'connected'
  const isConnecting = status === 'connecting'

  return (
    <div
      style={{
        position: 'fixed',
        bottom:   24,
        right:    24,
        zIndex:   9999,
        display:  'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            background:   'var(--surface-1)',
            borderRadius: 14,
            border:       '1px solid var(--border)',
            boxShadow:    '0 10px 40px rgba(15,45,82,0.18), 0 4px 12px rgba(15,45,82,0.08)',
            padding:      '16px 20px',
            minWidth:     220,
            display:      'flex',
            flexDirection: 'column',
            gap:          12,
          }}
        >
          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Animated orb */}
            <div
              style={{
                width:        12,
                height:       12,
                borderRadius: '50%',
                background:   isConnected
                  ? (isSpeaking ? 'var(--teal)' : 'var(--green)')
                  : isConnecting
                    ? 'var(--orange)'
                    : 'var(--text-meta)',
                boxShadow: isConnected
                  ? `0 0 0 ${isSpeaking ? '4px' : '2px'} ${isSpeaking ? 'rgba(14,116,144,0.25)' : 'rgba(21,128,61,0.20)'}`
                  : 'none',
                transition: 'all 300ms ease',
                animation: (isConnecting || (isConnected && isSpeaking))
                  ? 'glow-pulse 1.5s ease-in-out infinite'
                  : 'none',
              }}
            />
            <span style={{
              fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}>
              {isConnecting ? 'Connecting...'
                : isConnected && isSpeaking ? 'Solomon is speaking'
                : isConnected ? 'Listening...'
                : 'Disconnected'}
            </span>
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: 11, color: 'var(--red)', lineHeight: 1.4 }}>
              {error}
            </p>
          )}

          {/* End call button */}
          {isConnected && (
            <button
              onClick={endCall}
              style={{
                background:   'rgba(220,38,38,0.08)',
                border:       '1px solid rgba(220,38,38,0.25)',
                borderRadius: 8,
                padding:      '8px 16px',
                fontSize:     12,
                fontWeight:   600,
                color:        'var(--red)',
                fontFamily:   'var(--font-label)',
                cursor:       'pointer',
                letterSpacing: '0.04em',
              }}
            >
              End Call
            </button>
          )}

          {/* Retry if disconnected with error */}
          {!isConnected && !isConnecting && error && (
            <button
              onClick={startCall}
              style={{
                background:   'var(--navy)',
                border:       'none',
                borderRadius: 8,
                padding:      '8px 16px',
                fontSize:     12,
                fontWeight:   600,
                color:        '#FFFFFF',
                fontFamily:   'var(--font-label)',
                cursor:       'pointer',
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Floating mic button */}
      <button
        onClick={isConnected ? endCall : startCall}
        title={isConnected ? 'End conversation' : 'Talk to Solomon'}
        style={{
          width:        52,
          height:       52,
          borderRadius: '50%',
          border:       'none',
          cursor:       'pointer',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          background:   isConnected ? 'var(--teal)' : 'var(--navy)',
          color:        '#FFFFFF',
          boxShadow:    '0 4px 20px rgba(15,45,82,0.30)',
          transition:   'transform 180ms ease, box-shadow 180ms ease, background 200ms ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.transform = 'scale(1.08)'
          el.style.boxShadow = '0 6px 28px rgba(15,45,82,0.40)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.transform = ''
          el.style.boxShadow = '0 4px 20px rgba(15,45,82,0.30)'
        }}
      >
        {isConnected ? (
          // Phone-off icon
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/>
            <line x1="23" y1="1" x2="1" y2="23"/>
          </svg>
        ) : (
          // Mic icon
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )}
      </button>
    </div>
  )
}
