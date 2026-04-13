interface GreetingData {
  generatedAt: string
  greeting: string
  mood: string
}

export function DailyGreeting({ data }: { data: GreetingData }) {
  return (
    <div
      style={{
        background:   'var(--surface-1)',
        borderRadius: 10,
        border:       '1px solid var(--border)',
        borderLeft:   '3px solid var(--teal)',
        padding:      '20px 24px',
        boxShadow:    'var(--card-shadow)',
      }}
    >
      <p
        style={{
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--teal)',
          fontFamily:    'var(--font-label)',
          marginBottom:  10,
        }}
      >
        Solomon
      </p>
      <p
        style={{
          fontSize:   15,
          lineHeight: 1.65,
          color:      'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {data.greeting}
      </p>
    </div>
  )
}
