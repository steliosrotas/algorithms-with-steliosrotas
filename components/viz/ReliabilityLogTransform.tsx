'use client'

/**
 * ReliabilityLogTransform — front-set-5-ask6 («Μονοπάτι μέγιστης αξιοπιστίας»).
 *
 * The headline trick: max ∏ P  ⇔  max ∑ log P  ⇔  min ∑ (−log P).
 * The same 4-node / 5-edge graph is shown in two modes:
 *   • «Πιθανότητες P» — edges labelled with P ∈ (0, 1]; each candidate
 *     path's value is the PRODUCT of its edges.
 *   • «Βάρη w = −log₂ P» — same graph, edges relabelled with w ≥ 0;
 *     each path's value is the SUM of its edges (= what Dijkstra
 *     minimises).
 * The three s→t paths are listed under the graph, with both the
 * product and the sum side by side. The winner — s → v1 → v2 → t —
 * is the path with min-sum (= 2) AND max-product (= 1/4).
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type NodeId = 's' | 'v1' | 'v2' | 't'

const NODES: Record<NodeId, { x: number; y: number }> = {
  s: { x: 60, y: 130 },
  v1: { x: 230, y: 50 },
  v2: { x: 230, y: 210 },
  t: { x: 410, y: 130 },
}
const R = 22

const NODE_RECTS: NodeRect[] = (Object.keys(NODES) as NodeId[]).map((id) => ({
  id,
  x: NODES[id].x - R,
  y: NODES[id].y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r]))

function routedEdge(aId: NodeId, bId: NodeId) {
  const aRect = NODE_RECT_BY_ID.get(aId)!
  const bRect = NODE_RECT_BY_ID.get(bId)!
  const ax = aRect.x + aRect.w / 2
  const ay = aRect.y + aRect.h / 2
  const bx = bRect.x + bRect.w / 2
  const by = bRect.y + bRect.h / 2
  const geom = trimEdgeGeom(routeEdge(aRect, bRect, NODE_RECTS), ax, ay, R, bx, by, R)
  const mx = geom.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * geom.cx) / 4
  const my = geom.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * geom.cy) / 4
  return { ...geom, mx, my }
}

type EdgeKey = 'sv1' | 'sv2' | 'v1v2' | 'v1t' | 'v2t'

const EDGES: { key: EdgeKey; from: NodeId; to: NodeId; p: number; pLabel: string; w: number }[] = [
  { key: 'sv1', from: 's', to: 'v1', p: 1, pLabel: '1', w: 0 },
  { key: 'sv2', from: 's', to: 'v2', p: 1 / 8, pLabel: '1/8', w: 3 },
  { key: 'v1v2', from: 'v1', to: 'v2', p: 1 / 2, pLabel: '1/2', w: 1 },
  { key: 'v1t', from: 'v1', to: 't', p: 1 / 16, pLabel: '1/16', w: 4 },
  { key: 'v2t', from: 'v2', to: 't', p: 1 / 2, pLabel: '1/2', w: 1 },
]

type Path = {
  id: string
  nodes: NodeId[]
  edges: EdgeKey[]
  productLabel: string
  productValue: number
  sumLabel: string
  sum: number
}

const PATHS: Path[] = [
  {
    id: 'p1',
    nodes: ['s', 'v1', 't'],
    edges: ['sv1', 'v1t'],
    productLabel: '1 · 1/16 = 1/16',
    productValue: 1 / 16,
    sumLabel: '0 + 4 = 4',
    sum: 4,
  },
  {
    id: 'p2',
    nodes: ['s', 'v2', 't'],
    edges: ['sv2', 'v2t'],
    productLabel: '1/8 · 1/2 = 1/16',
    productValue: 1 / 16,
    sumLabel: '3 + 1 = 4',
    sum: 4,
  },
  {
    id: 'p3',
    nodes: ['s', 'v1', 'v2', 't'],
    edges: ['sv1', 'v1v2', 'v2t'],
    productLabel: '1 · 1/2 · 1/2 = 1/4',
    productValue: 1 / 4,
    sumLabel: '0 + 1 + 1 = 2',
    sum: 2,
  },
]

const WINNER_ID = 'p3'

export function ReliabilityLogTransform() {
  const [mode, setMode] = useState<'P' | 'W'>('P')
  const [focused, setFocused] = useState<string | null>(null)

  const activeEdges: Set<EdgeKey> = new Set(
    focused ? PATHS.find((p) => p.id === focused)!.edges : [],
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Μετασχηματισμός με λογάριθμο — γινόμενο γίνεται άθροισμα
        </div>
        <div className="flex overflow-hidden rounded-md border border-border text-xs">
          <button
            type="button"
            onClick={() => setMode('P')}
            className={
              'px-3 py-1.5 transition ' +
              (mode === 'P'
                ? 'bg-accent text-white font-semibold'
                : 'bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
            }
          >
            Πιθανότητες P
          </button>
          <button
            type="button"
            onClick={() => setMode('W')}
            className={
              'border-l border-border px-3 py-1.5 transition ' +
              (mode === 'W'
                ? 'bg-accent text-white font-semibold'
                : 'bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
            }
          >
            Βάρη w = −log₂ P
          </button>
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Ίδιος γράφος, διαφορετική «γλώσσα». Στα{' '}
        <strong className="text-fg">P</strong>: αξία διαδρομής = γινόμενο. Στα{' '}
        <strong className="text-fg">w</strong>: αξία διαδρομής = άθροισμα — και
        το άθροισμα είναι αυτό που ξέρει να ελαχιστοποιεί ο Dijkstra.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 470 280"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="rlt-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id="rlt-arr-hi"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
          </defs>

          {EDGES.map((e) => {
            const g = routedEdge(e.from, e.to)
            const active = activeEdges.has(e.key)
            const label = mode === 'P' ? e.pLabel : e.w.toString()
            const stroke = active ? '#9f1239' : '#bdb0b2'
            const strokeWidth = active ? 3.6 : 2
            const markerEnd = active ? 'url(#rlt-arr-hi)' : 'url(#rlt-arr)'
            return (
              <g key={e.key}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                  />
                )}
                <rect
                  x={g.mx - 22}
                  y={g.my - 11}
                  width={44}
                  height={21}
                  rx={4}
                  fill="#faf4ee"
                  stroke={active ? '#9f1239' : '#cdbfc0'}
                />
                <text
                  x={g.mx}
                  y={g.my}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {label}
                </text>
              </g>
            )
          })}

          {(Object.keys(NODES) as NodeId[]).map((id) => {
            const n = NODES[id]
            const terminal = id === 's' || id === 't'
            return (
              <g key={id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={terminal ? '#fde2e4' : '#ffffff'}
                  stroke={terminal ? '#9f1239' : '#9b8a8d'}
                  strokeWidth={2.4}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {PATHS.map((p) => {
          const isWinner = p.id === WINNER_ID
          const isFocused = p.id === focused
          return (
            <button
              key={p.id}
              type="button"
              onMouseEnter={() => setFocused(p.id)}
              onMouseLeave={() => setFocused(null)}
              onFocus={() => setFocused(p.id)}
              onBlur={() => setFocused(null)}
              onClick={() => setFocused((cur) => (cur === p.id ? null : p.id))}
              className={
                'rounded-lg border px-3 py-2 text-left text-xs transition ' +
                (isFocused
                  ? 'border-accent bg-accent/10'
                  : isWinner
                    ? 'border-success/60 bg-success/5'
                    : 'border-border bg-bg-soft/40 hover:border-fg-subtle')
              }
            >
              <div className="font-mono font-semibold text-fg">
                {p.nodes.join(' → ')}
              </div>
              <div className="mt-1 font-mono text-fg-muted">
                {mode === 'P' ? (
                  <>
                    P = <span className="text-fg">{p.productLabel}</span>
                  </>
                ) : (
                  <>
                    w = <span className="text-fg">{p.sumLabel}</span>
                  </>
                )}
              </div>
              {isWinner && (
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-success">
                  Νικητής
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Η μεταμόρφωση:</span>{' '}
        <span className="font-mono">max ∏P</span> ⇔{' '}
        <span className="font-mono">max ∑ log P</span> ⇔{' '}
        <span className="font-mono">min ∑ (−log P)</span>. Με{' '}
        <span className="font-mono">w = −log₂ P ≥ 0</span> ο Dijkstra βρίσκει το
        ελάχιστο άθροισμα — και αυτό είναι ταυτόχρονα το μέγιστο γινόμενο
        αξιοπιστίας. Νικητής: <strong className="text-fg">s → v₁ → v₂ → t</strong>,
        με βάρος <span className="font-mono text-fg">2</span> και αξιοπιστία{' '}
        <span className="font-mono text-fg">2⁻² = 1/4</span>.
      </div>
    </section>
  )
}
