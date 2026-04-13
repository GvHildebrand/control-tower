'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Project, ProjectStatus, ProjectPriority } from '@/lib/types'

const PRIORITY_ORDER: ProjectPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const STATUS_COLOR: Record<ProjectStatus, string> = {
  critical: 'var(--red)',
  blocked:  'var(--orange)',
  new:      'var(--purple)',
  active:   'var(--green)',
  paused:   'var(--text-meta)',
  complete: 'var(--blue)',
  dead:     'var(--border)',
}

// Resolved fallback colors for D3 SVG fill (CSS vars work in modern browsers,
// but keep resolved hex as a stroke fallback)
const STATUS_COLOR_HEX: Record<ProjectStatus, string> = {
  critical: '#FF3B30',
  blocked:  '#FF9500',
  new:      '#AF52DE',
  active:   '#34C759',
  paused:   '#8E8E93',
  complete: '#007AFF',
  dead:     '#C7C7CC',
}

type ChartDatum = {
  id: string
  name: string
  status: ProjectStatus
  priority: ProjectPriority
  days: number       // 999 = unknown
  progress: number   // 0-100
  nextAction: string
  totalCommits?: number
}

type Tooltip = {
  x: number; y: number
  datum: ChartDatum
} | null

function daysSince(iso?: string): number {
  if (!iso) return 999
  return (Date.now() - new Date(iso).getTime()) / 86_400_000
}

function toChartData(projects: Project[]): ChartDatum[] {
  return projects
    .filter(p => p.status !== 'dead')  // hide dead projects (unclutter)
    .map(p => ({
      id:           p.id,
      name:         p.name,
      status:       p.status,
      priority:     p.priority,
      days:         daysSince(p.lastCommitDate),
      progress:     p.progressPercent ?? 50,
      nextAction:   p.nextAction,
      totalCommits: p.totalCommits,
    }))
}

const MARGIN = { top: 56, right: 80, bottom: 56, left: 80 }
const MAX_DAYS = 30  // clamp display axis at 30 days; beyond = "stale"

export function BubbleChart({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const [dims, setDims]       = useState({ width: 900, height: 520 })
  const [tooltip, setTooltip] = useState<Tooltip>(null)

  const data = toChartData(projects)

  // Responsive: observe container size
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDims({ width: Math.max(width, 400), height: Math.max(height, 340) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // D3 render
  useEffect(() => {
    if (!svgRef.current) return
    const { width, height } = dims
    const innerW = width  - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top  - MARGIN.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, MAX_DAYS])
      .range([0, innerW])
      .clamp(true)

    const yScale = d3.scalePoint<ProjectPriority>()
      .domain(PRIORITY_ORDER)
      .range([innerH, 0])
      .padding(0.5)

    const rScale = d3.scaleSqrt()
      .domain([0, 100])
      .range([10, 28])

    // Quadrant backgrounds
    const midX = xScale(MAX_DAYS / 2)
    g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', midX).attr('height', innerH)
      .attr('fill', 'rgba(52,199,89,0.05)')

    g.append('rect')
      .attr('x', midX).attr('y', 0)
      .attr('width', innerW - midX).attr('height', innerH)
      .attr('fill', 'rgba(255,59,48,0.05)')

    // Quadrant labels
    const qLabelStyle = {
      fontSize: 9,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.10em',
      textTransform: 'uppercase' as const,
      opacity: 0.45,
    }
    g.append('text')
      .attr('x', midX / 2).attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#34C759')
      .style('font-size', qLabelStyle.fontSize)
      .style('font-family', qLabelStyle.fontFamily)
      .style('letter-spacing', qLabelStyle.letterSpacing)
      .text('ACTIVE ZONE')

    g.append('text')
      .attr('x', midX + (innerW - midX) / 2).attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FF3B30')
      .style('font-size', qLabelStyle.fontSize)
      .style('font-family', qLabelStyle.fontFamily)
      .style('letter-spacing', qLabelStyle.letterSpacing)
      .text('DANGER ZONE')

    // Mid divider
    g.append('line')
      .attr('x1', midX).attr('y1', 0)
      .attr('x2', midX).attr('y2', innerH)
      .attr('stroke', 'var(--border)')
      .attr('stroke-dasharray', '4 4')
      .attr('opacity', 0.6)

    // X axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat(d => `${d}d`)
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis)
      .call(ax => {
        ax.select('.domain').remove()
        ax.selectAll('.tick line').attr('stroke', 'var(--border)')
        ax.selectAll('.tick text')
          .attr('fill', 'var(--text-meta)')
          .style('font-size', '11px')
          .style('font-family', 'var(--font-mono)')
      })

    // X axis label
    g.append('text')
      .attr('x', innerW / 2).attr('y', innerH + 44)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-meta)')
      .style('font-size', '11px')
      .style('font-family', 'var(--font-mono)')
      .style('letter-spacing', '0.08em')
      .text('DAYS SINCE LAST COMMIT')

    // Y axis
    const yAxis = d3.axisLeft(yScale)
    g.append('g')
      .call(yAxis)
      .call(ax => {
        ax.select('.domain').remove()
        ax.selectAll('.tick line').remove()
        ax.selectAll('.tick text')
          .attr('fill', 'var(--text-meta)')
          .style('font-size', '11px')
          .style('font-family', 'var(--font-mono)')
          .style('letter-spacing', '0.06em')
      })

    // Horizontal grid lines (per priority)
    PRIORITY_ORDER.forEach(p => {
      const y = yScale(p)!
      g.append('line')
        .attr('x1', 0).attr('y1', y)
        .attr('x2', innerW).attr('y2', y)
        .attr('stroke', 'var(--border)')
        .attr('opacity', 0.5)
    })

    // Group projects by priority for jitter
    const byPriority = d3.group(data, d => d.priority)
    const jitterMap = new Map<string, number>()
    byPriority.forEach((items) => {
      items.forEach((item, i) => {
        jitterMap.set(item.id, (i % 3 - 1) * 24)
      })
    })

    // Bubbles
    const nodes = g.selectAll<SVGCircleElement, ChartDatum>('circle.bubble')
      .data(data)
      .join('circle')
      .attr('class', 'bubble')
      .attr('cx', d => xScale(Math.min(d.days, MAX_DAYS)))
      .attr('cy', d => (yScale(d.priority) ?? 0) + (jitterMap.get(d.id) ?? 0))
      .attr('r',  d => rScale(d.progress))
      .attr('fill', d => `${STATUS_COLOR_HEX[d.status]}CC`)  // 80% opacity via hex
      .attr('stroke', d => STATUS_COLOR_HEX[d.status])
      .attr('stroke-width', d => d.days >= 999 ? 0 : 1.5)
      .attr('stroke-dasharray', d => d.days >= 999 ? '3 2' : 'none')
      .style('cursor', 'pointer')
      .style('transition', 'r 150ms ease, opacity 150ms ease')

    // Labels beneath each bubble
    g.selectAll<SVGTextElement, ChartDatum>('text.bubble-label')
      .data(data)
      .join('text')
      .attr('class', 'bubble-label')
      .attr('x', d => xScale(Math.min(d.days, MAX_DAYS)))
      .attr('y', d => (yScale(d.priority) ?? 0) + (jitterMap.get(d.id) ?? 0) + rScale(d.progress) + 13)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-meta)')
      .style('font-size', '10px')
      .style('font-family', 'var(--font-mono)')
      .style('pointer-events', 'none')
      .text(d => d.name.length > 13 ? d.name.slice(0, 12) + '…' : d.name)

    // Tooltip interactions
    nodes
      .on('mouseover', function(event: MouseEvent, d: ChartDatum) {
        d3.select(this).attr('r', rScale(d.progress) * 1.15)
        const svgRect = svgRef.current!.getBoundingClientRect()
        setTooltip({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top - 12,
          datum: d,
        })
      })
      .on('mousemove', function(event: MouseEvent) {
        const svgRect = svgRef.current!.getBoundingClientRect()
        setTooltip(prev => prev ? { ...prev, x: event.clientX - svgRect.left, y: event.clientY - svgRect.top - 12 } : null)
      })
      .on('mouseout', function(_event: MouseEvent, d: ChartDatum) {
        d3.select(this).attr('r', rScale(d.progress))
        setTooltip(null)
      })

  }, [dims, data])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width:    '100%',
        height:   'calc(100vh - 160px)',
        minHeight: 400,
        background:   'var(--surface-1)',
        borderRadius: 10,
        border:       '1px solid var(--border)',
        boxShadow:    'var(--card-shadow)',
        overflow:     'hidden',
      }}
    >
      <svg ref={svgRef} style={{ display: 'block' }} />

      {/* Legend */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        display: 'flex', flexDirection: 'column', gap: 5,
      }}>
        {(Object.entries(STATUS_COLOR_HEX) as [ProjectStatus, string][])
          .filter(([s]) => s !== 'dead')
          .map(([status, hex]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: hex, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-meta)', textTransform: 'capitalize' }}>
                {status}
              </span>
            </div>
          ))}
        <div style={{ marginTop: 4, borderTop: '1px solid var(--border)', paddingTop: 5 }}>
          <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-meta)', letterSpacing: '0.06em' }}>
            SIZE = PROGRESS %
          </span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position:      'absolute',
            left:          tooltip.x + 14,
            top:           tooltip.y - 60,
            pointerEvents: 'none',
            background:    'var(--surface-1)',
            border:        '1px solid var(--border)',
            borderRadius:  10,
            padding:       '10px 14px',
            boxShadow:     'var(--card-shadow-hover)',
            maxWidth:      220,
            zIndex:        10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: STATUS_COLOR_HEX[tooltip.datum.status],
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {tooltip.datum.name}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-meta)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
            {tooltip.datum.days >= 999
              ? 'No commit data'
              : `${Math.round(tooltip.datum.days)}d ago · ${tooltip.datum.progress}% done`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--next-action)', lineHeight: 1.45 }}>
            {tooltip.datum.nextAction.length > 70
              ? tooltip.datum.nextAction.slice(0, 69) + '…'
              : tooltip.datum.nextAction}
          </div>
        </div>
      )}
    </div>
  )
}
