'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Project } from '@/lib/types'

const CELL  = 9
const GAP   = 2
const STEP  = CELL + GAP
const DAYS  = 90
const LABEL_W = 140
const MARGIN = { top: 28, right: 16, bottom: 8, left: LABEL_W }

type Tooltip = { x: number; y: number; name: string; date: string; count: number } | null

function getLast90Days(): string[] {
  const days: string[] = []
  const now = new Date()
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

type Row = { id: string; name: string; history: Record<string, number>; total: number }

function prepareRows(projects: Project[]): Row[] {
  return projects
    .filter(p => p.status !== 'dead')
    .map(p => {
      const h = p.commitHistory ?? {}
      return { id: p.id, name: p.name, history: h, total: Object.values(h).reduce((s, v) => s + v, 0) }
    })
    .sort((a, b) => b.total - a.total)
}

export function ActivityHeatmap({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<Tooltip>(null)

  const rows    = prepareRows(projects)
  const allDays = getLast90Days()

  // Compute max commits in a single day across all projects
  const maxCount = Math.max(
    1,
    ...rows.flatMap(r => Object.values(r.history))
  )

  const width  = MARGIN.left + DAYS * STEP + MARGIN.right
  const height = MARGIN.top + rows.length * STEP * 1.6 + MARGIN.bottom

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    // Month labels along the top
    const months = new Map<string, number>()
    allDays.forEach((day, i) => {
      const m = day.slice(0, 7) // "YYYY-MM"
      if (!months.has(m)) months.set(m, i)
    })
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    months.forEach((col, ym) => {
      const monthIdx = parseInt(ym.slice(5, 7), 10) - 1
      svg.append('text')
        .attr('x', MARGIN.left + col * STEP + 2)
        .attr('y', 16)
        .attr('fill', 'var(--text-meta)')
        .style('font-size', '10px')
        .style('font-family', 'var(--font-body)')
        .text(monthNames[monthIdx])
    })

    // Rows
    rows.forEach((row, rowIdx) => {
      const y = MARGIN.top + rowIdx * STEP * 1.6

      // Project name label
      svg.append('text')
        .attr('x', MARGIN.left - 10)
        .attr('y', y + CELL / 2 + 3.5)
        .attr('text-anchor', 'end')
        .attr('fill', 'var(--text-secondary)')
        .style('font-size', '11px')
        .style('font-family', 'var(--font-body)')
        .text(row.name.length > 16 ? row.name.slice(0, 15) + '…' : row.name)

      // Cells
      allDays.forEach((day, colIdx) => {
        const count = row.history[day] || 0
        const intensity = count / maxCount

        const rect = svg.append('rect')
          .attr('x', MARGIN.left + colIdx * STEP)
          .attr('y', y)
          .attr('width', CELL)
          .attr('height', CELL)
          .attr('rx', 2)
          .attr('fill', count === 0
            ? 'var(--surface-3)'
            : d3.interpolateRgb('#34C759', '#006400')(Math.min(intensity, 1)))
          .attr('fill-opacity', count === 0 ? 0.5 : 0.3 + intensity * 0.7)
          .style('cursor', count > 0 ? 'pointer' : 'default')

        if (count > 0) {
          rect
            .on('mouseover', function(event: MouseEvent) {
              const svgRect = svgRef.current!.getBoundingClientRect()
              setTooltip({
                x: event.clientX - svgRect.left,
                y: event.clientY - svgRect.top - 10,
                name: row.name,
                date: day,
                count,
              })
            })
            .on('mouseout', () => setTooltip(null))
        }
      })

      // Total count at end of row
      if (row.total > 0) {
        svg.append('text')
          .attr('x', MARGIN.left + DAYS * STEP + 6)
          .attr('y', y + CELL / 2 + 3.5)
          .attr('fill', 'var(--text-meta)')
          .style('font-size', '10px')
          .style('font-family', 'var(--font-body)')
          .text(`${row.total}`)
      }
    })
  }, [rows, allDays, maxCount, width, height])

  return (
    <div
      ref={containerRef}
      style={{
        position:     'relative',
        background:   'var(--surface-1)',
        borderRadius: 10,
        border:       '1px solid var(--border)',
        boxShadow:    'var(--card-shadow)',
        overflow:     'auto',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px 0', borderBottom: 'none' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
        }}>
          90-Day Activity
        </h3>
        <p style={{
          fontSize: 11, color: 'var(--text-meta)', marginTop: 2, marginBottom: 8,
          fontFamily: 'var(--font-body)',
        }}>
          Commit frequency per project
        </p>
      </div>

      <div style={{ overflowX: 'auto', padding: '0 8px 16px' }}>
        <svg ref={svgRef} style={{ display: 'block' }} />
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x + 12, top: tooltip.y - 40,
          pointerEvents: 'none', background: 'var(--surface-1)',
          border: '1px solid var(--border)', borderRadius: 8,
          padding: '7px 11px', boxShadow: 'var(--card-shadow-hover)', zIndex: 10,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
            {tooltip.name}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-meta)', marginLeft: 8 }}>
            {tooltip.date} · {tooltip.count} commit{tooltip.count !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
