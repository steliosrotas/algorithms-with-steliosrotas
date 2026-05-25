'use client'

/**
 * WhyBFSFailsWeighted — BFS counts hops, not cost (L08 → L09 bridge).
 *
 * BFS finds the path with the FEWEST edges. With edge weights, that is no
 * longer the cheapest path. This viz shows the same graph judged two ways:
 * by edge count (how BFS thinks) the direct s–t edge wins with 1 hop; by
 * total weight it costs 100, while the 3-edge detour costs only 30. Flipping
 * the toggle back and forth makes the mismatch land — and motivates the
 * weighted-shortest-path algorithms of L09. Built for L08.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type WNode = { id: string; x: number; y: number }
const NODES: WNode[] = [
  { id: 's', x: 56, y: 100 },
  { id: 'a', x: 152, y: 194 },
  { id: 'b', x: 272, y: 194 },
  { id: 't', x: 368, y: 100 },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const R = 22
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

const PATH: { a: string; b: string; w: number }[] = [
  { a: 's', b: 'a', w: 10 },
  { a: 'a', b: 'b', w: 10 },
  { a: 'b', b: 't', w: 10 },
]

/**
 * Collision-aware edge routing for the 3 detour edges (s→a, a→b, b→t).
 * Steady-state straight line trimmed to node borders; falls back to a
 * Bezier if a future layout edit places a node on the centerline. The
 * separate s–t arc is hand-crafted by design (a deliberate over-the-top
 * curve to visually separate «1 ακμή, βάρος 100» from the 3-edge detour
 * running along the bottom) and intentionally bypasses routeEdge.
 * Phase E.4.6.
 */
function routedEdge(a: WNode, b: WNode) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  return trimEdgeGeom(geom, a.x, a.y, R + 1, b.x, b.y, R + 1)
}

function EdgeLabel({
  x,
  y,
  text,
  tone,
}: {
  x: number
  y: number
  text: string
  tone: 'plain' | 'good' | 'bad'
}) {
  const fill =
    tone === 'good' ? '#16a34a' : tone === 'bad' ? '#d97706' : '#57464a'
  const w = text.length * 8.5 + 12
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 11}
        width={w}
        height={22}
        rx={6}
        fill="#fffdf8"
        stroke={fill}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
        fontFamily="ui-monospace, monospace"
        fill={fill}
      >
        {text}
      </text>
    </g>
  )
}

export function WhyBFSFailsWeighted() {
  const [view, setView] = useState<'edges' | 'weights'>('edges')
  const byEdges = view === 'edges'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γιατί το BFS αποτυγχάνει με βάρη
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['edges', 'weights'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                view === key
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {key === 'edges' ? 'Μέτρημα ακμών (BFS)' : 'Άθροισμα βαρών'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-xs text-fg-subtle">
        {byEdges
          ? 'Έτσι «σκέφτεται» το BFS: κάθε ακμή μετράει 1. Διαλέγει τη διαδρομή με τις λιγότερες ακμές.'
          : 'Το πραγματικό μήκος μιας διαδρομής: το άθροισμα των βαρών των ακμών της.'}
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 424 244"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* direct s–t edge, drawn as an arc over the top */}
          <path
            d="M 73 82 Q 212 8 351 82"
            fill="none"
            stroke={byEdges ? '#d97706' : '#bdb0b2'}
            strokeWidth={byEdges ? 5 : 2.4}
            strokeLinecap="round"
          />
          {/* 3-edge detour along the bottom */}
          {PATH.map((e, i) => {
            const A = POS.get(e.a)!
            const B = POS.get(e.b)!
            const g = routedEdge(A, B)
            const stroke = !byEdges ? '#16a34a' : '#bdb0b2'
            const strokeWidth = !byEdges ? 5 : 2.4
            return g.kind === 'line' ? (
              <line
                key={i}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            ) : (
              <path
                key={i}
                d={g.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )
          })}

          {/* edge labels */}
          <EdgeLabel
            x={212}
            y={26}
            text={byEdges ? '1' : '100'}
            tone={byEdges ? 'bad' : 'plain'}
          />
          {PATH.map((e, i) => {
            const A = POS.get(e.a)!
            const B = POS.get(e.b)!
            return (
              <EdgeLabel
                key={i}
                x={(A.x + B.x) / 2}
                y={(A.y + B.y) / 2 - (i === 1 ? 18 : 0)}
                text={byEdges ? '1' : String(e.w)}
                tone={!byEdges ? 'good' : 'plain'}
              />
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const terminal = n.id === 's' || n.id === 't'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={terminal ? '#fda4af' : '#ffffff'}
                  stroke={terminal ? '#e11d48' : '#9b8a8d'}
                  strokeWidth={2.5}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* comparison panel */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-sm',
            byEdges
              ? 'border-warn/50 bg-warn/10'
              : 'border-border bg-bg-soft/50',
          )}
        >
          <div className="font-semibold text-fg">Απευθείας s → t</div>
          <div className="mt-0.5 text-fg-muted">
            1 ακμή · βάρος <span className="font-mono font-bold">100</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-warn">
            ← η επιλογή του BFS
          </div>
        </div>
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-sm',
            !byEdges
              ? 'border-success/50 bg-success/10'
              : 'border-border bg-bg-soft/50',
          )}
        >
          <div className="font-semibold text-fg">Μονοπάτι s → a → b → t</div>
          <div className="mt-0.5 text-fg-muted">
            3 ακμές · βάρος <span className="font-mono font-bold">30</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-success">
            ← πραγματικά συντομότερη
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        Το BFS μετράει <strong className="text-fg">ακμές</strong>, οπότε
        διαλέγει την απευθείας s → t — μία μόνο ακμή. Αλλά αυτή κοστίζει{' '}
        <strong className="text-fg">100</strong>, ενώ η διαδρομή των τριών
        «φθηνών» ακμών κοστίζει μόλις <strong className="text-fg">30</strong>.
        Το BFS βελτιστοποιεί λάθος μέγεθος — μετράει άλματα, όχι κόστος.
        Χρειαζόμαστε νέους αλγορίθμους: <strong className="text-fg">Dijkstra</strong> και{' '}
        <strong className="text-fg">Bellman-Ford</strong> στο L09.
      </div>
    </section>
  )
}
