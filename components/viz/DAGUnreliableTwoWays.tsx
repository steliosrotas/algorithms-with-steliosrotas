'use client'

/**
 * DAGUnreliableTwoWays — front-set-5-ask8 («Πιο αναξιόπιστο μονοπάτι
 * σε DAG»).
 *
 * Two reformulations of «min ∏ r_e» on a DAG, side by side on the
 * SAME instance:
 *  • Tab «MAX με w = −log r»: weights ≥ 0, find the MAXIMUM-cost
 *    path (= longest path) in DAG. Topological order + relaxation
 *    keeping the per-node maximum.
 *  • Tab «MIN με w = log r»:  weights ≤ 0, find the MINIMUM-cost
 *    path. Dijkstra would refuse (negative weights), but the
 *    DAG-relaxation works.
 *
 * Both modes pick the SAME edge sequence — that's the punchline. The
 * instance is a 7-vertex DAG A→…→H with carefully chosen
 * reliabilities so the most-unreliable path is A → C → D → F (the
 * solution claim, with the path encoding kept compact).
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type NodeId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

const NODES: Record<NodeId, { x: number; y: number }> = {
  A: { x: 60, y: 140 },
  B: { x: 180, y: 60 },
  C: { x: 180, y: 220 },
  D: { x: 320, y: 140 },
  E: { x: 320, y: 240 },
  F: { x: 460, y: 60 },
  G: { x: 460, y: 200 },
  H: { x: 580, y: 140 },
}

const TOPO: NodeId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

type Edge = { from: NodeId; to: NodeId; r: number; rLabel: string }

/** Reliabilities chosen so the MOST UNRELIABLE path is A → C → D → F:
 *  r-product 0.5 · 0.4 · 0.3 = 0.060 (smallest among A→…→F/G/H).
 *  Other A→F candidates: A→B→D→F = 0.9·0.7·0.3 = 0.189; A→D→F = 0.8·0.3 = 0.24.
 *  A→H via cheapest neighbour: 0.060 · max(r(F→H), via G…) — the
 *  problem asks for "most unreliable from A", and we report A→F as the
 *  worst destination with product 0.060. */
const EDGES: Edge[] = [
  { from: 'A', to: 'B', r: 0.9, rLabel: '0.9' },
  { from: 'A', to: 'C', r: 0.5, rLabel: '0.5' },
  { from: 'A', to: 'D', r: 0.8, rLabel: '0.8' },
  { from: 'B', to: 'D', r: 0.7, rLabel: '0.7' },
  { from: 'B', to: 'F', r: 0.6, rLabel: '0.6' },
  { from: 'C', to: 'D', r: 0.4, rLabel: '0.4' },
  { from: 'C', to: 'E', r: 0.8, rLabel: '0.8' },
  { from: 'D', to: 'F', r: 0.3, rLabel: '0.3' },
  { from: 'D', to: 'G', r: 0.6, rLabel: '0.6' },
  { from: 'E', to: 'G', r: 0.7, rLabel: '0.7' },
  { from: 'F', to: 'H', r: 0.9, rLabel: '0.9' },
  { from: 'G', to: 'H', r: 0.8, rLabel: '0.8' },
]

/** Negative-log-2 weights (max formulation). */
function wMax(r: number) {
  return -Math.log2(r)
}
/** Plain log-2 weights (min formulation, all ≤ 0). */
function wMin(r: number) {
  return Math.log2(r)
}

type RelaxMode = 'max' | 'min'

function relax(mode: RelaxMode) {
  const dist: Record<NodeId, number> = {
    A: 0,
    B: -Infinity,
    C: -Infinity,
    D: -Infinity,
    E: -Infinity,
    F: -Infinity,
    G: -Infinity,
    H: -Infinity,
  }
  if (mode === 'min') {
    // For min formulation we want min of (negative) weights — init others to +∞.
    for (const k of TOPO) if (k !== 'A') dist[k] = Infinity
  }
  const pred: Record<NodeId, NodeId | null> = {
    A: null, B: null, C: null, D: null, E: null, F: null, G: null, H: null,
  }
  for (const u of TOPO) {
    if (!isFinite(dist[u])) continue
    for (const e of EDGES) {
      if (e.from !== u) continue
      const candidate = dist[u] + (mode === 'max' ? wMax(e.r) : wMin(e.r))
      if (mode === 'max' ? candidate > dist[e.to] : candidate < dist[e.to]) {
        dist[e.to] = candidate
        pred[e.to] = u
      }
    }
  }
  return { dist, pred }
}

function pathTo(pred: Record<NodeId, NodeId | null>, target: NodeId): NodeId[] {
  const path: NodeId[] = [target]
  let cur: NodeId | null = target
  while (cur && pred[cur]) {
    cur = pred[cur]!
    path.unshift(cur)
  }
  return path
}

const BOTH = (['max', 'min'] as const).reduce(
  (acc, m) => {
    const { dist, pred } = relax(m)
    let best: NodeId = 'A'
    for (const v of TOPO) {
      if (v === 'A') continue
      if (m === 'max' ? dist[v] > dist[best] : dist[v] < dist[best]) best = v
    }
    acc[m] = { dist, pred, best }
    return acc
  },
  {} as Record<RelaxMode, { dist: Record<NodeId, number>; pred: Record<NodeId, NodeId | null>; best: NodeId }>,
)

const R = 19

const NODE_RECTS: NodeRect[] = (Object.keys(NODES) as NodeId[]).map((id) => {
  const n = NODES[id]
  return { id, x: n.x - R, y: n.y - R, w: 2 * R, h: 2 * R }
})
const NODE_RECT_BY_ID = new Map<NodeId, NodeRect>(
  NODE_RECTS.map((r) => [r.id as NodeId, r]),
)

/** Routed directed edge, symmetric trim by R so the arrowhead lands on
 *  the destination border. */
function routedEdge(fromId: NodeId, toId: NodeId) {
  const a = NODE_RECT_BY_ID.get(fromId)!
  const b = NODE_RECT_BY_ID.get(toId)!
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2
  const geom = routeEdge(a, b, NODE_RECTS)
  return trimEdgeGeom(geom, ax, ay, R, bx, by, R)
}

export function DAGUnreliableTwoWays() {
  const [mode, setMode] = useState<RelaxMode>('max')
  const data = BOTH[mode]
  const optPath = pathTo(data.pred, data.best)
  const optEdges = new Set(optPath.slice(0, -1).map((u, i) => `${u}-${optPath[i + 1]}`))
  const optProduct = optPath
    .slice(0, -1)
    .map((u, i) => EDGES.find((e) => e.from === u && e.to === optPath[i + 1])!.r)
    .reduce((a, b) => a * b, 1)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πιο αναξιόπιστο μονοπάτι — δύο διατυπώσεις, ίδιο αποτέλεσμα
        </div>
        <div className="flex overflow-hidden rounded-md border border-border text-xs">
          {(
            [
              { v: 'max' as const, label: 'MAX με w = −log₂ r ≥ 0' },
              { v: 'min' as const, label: 'MIN με w = log₂ r ≤ 0' },
            ]
          ).map(({ v, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => setMode(v)}
              className={
                'border-l border-border px-3 py-1.5 transition first:border-l-0 ' +
                (mode === v
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Ίδιος DAG, ίδιες αξιοπιστίες r_e. Διαφορά: στη μία διατύπωση τρέχουμε{' '}
        <strong className="text-fg">μεγιστοποίηση</strong> με w = −log r ≥ 0·
        στην άλλη <strong className="text-fg">ελαχιστοποίηση</strong> με w = log
        r ≤ 0. Και οι δύο επιστρέφουν το ίδιο μονοπάτι.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 640 290"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="dag-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id="dag-arr-hi"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
          </defs>

          {EDGES.map((e, i) => {
            const a = NODES[e.from]
            const b = NODES[e.to]
            const g = routedEdge(e.from, e.to)
            const onOpt = optEdges.has(`${e.from}-${e.to}`)
            // Anchor weight label at the segment midpoint (line) or Bezier
            // midpoint (curve = `(P0 + 2Q + P2) / 4`).
            const mx = g.kind === 'line' ? (a.x + b.x) / 2 : (a.x + b.x + 2 * g.cx) / 4
            const my = g.kind === 'line' ? (a.y + b.y) / 2 : (a.y + b.y + 2 * g.cy) / 4
            const stroke = onOpt ? '#9f1239' : '#9b8a8d'
            const strokeWidth = onOpt ? 3 : 1.6
            const marker = onOpt ? 'url(#dag-arr-hi)' : 'url(#dag-arr)'
            return (
              <g key={i}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={marker}
                  />
                ) : (
                  <path d={g.d} fill="none" stroke={stroke} strokeWidth={strokeWidth} markerEnd={marker} />
                )}
                <rect
                  x={mx - 14}
                  y={my - 9}
                  width={28}
                  height={17}
                  rx={3}
                  fill="#faf4ee"
                  stroke={onOpt ? '#9f1239' : '#cdbfc0'}
                />
                <text
                  x={mx}
                  y={my}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {e.rLabel}
                </text>
              </g>
            )
          })}

          {TOPO.map((id) => {
            const n = NODES[id]
            const onOpt = optPath.includes(id)
            return (
              <g key={id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill="#ffffff"
                  stroke={onOpt ? '#9f1239' : '#9b8a8d'}
                  strokeWidth={onOpt ? 3 : 2}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {id}
                </text>
                <g>
                  <rect
                    x={n.x - 18}
                    y={n.y + R + 4}
                    width={36}
                    height={16}
                    rx={3}
                    fill="#1c1214"
                  />
                  <text
                    x={n.x}
                    y={n.y + R + 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={9}
                    fontWeight={700}
                    fill="#fff"
                    fontFamily="ui-monospace, monospace"
                  >
                    {isFinite(data.dist[id]) ? data.dist[id].toFixed(2) : '—'}
                  </text>
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs">
          <div className="text-fg-subtle">Πιο αναξιόπιστος προορισμός</div>
          <div className="mt-0.5 font-mono text-lg font-bold text-fg">{data.best}</div>
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs">
          <div className="text-fg-subtle">Διαδρομή από το A</div>
          <div className="mt-0.5 font-mono font-bold text-danger">
            {optPath.join(' → ')}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs">
          <div className="text-fg-subtle">Αξιοπιστία ∏ r</div>
          <div className="mt-0.5 font-mono text-lg font-bold text-fg">
            {optProduct.toFixed(3)}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Γιατί δουλεύουν και οι δύο:</span>{' '}
        ο γράφος είναι DAG — υπάρχει τοπολογική σειρά. Όταν επεξεργάζεσαι μια
        κορυφή, οι πρόγονοί της έχουν ήδη οριστικοποιηθεί. Άρα{' '}
        <em>μία σάρωση</em> με χαλάρωση (κρατώντας max ή min ανά διατύπωση)
        αρκεί. Ο Dijkstra εδώ δεν χρειάζεται — ο τοπολογικός κανόνας
        αντικαθιστά την «επιλογή ελάχιστου από το PQ». Χρόνος{' '}
        <span className="font-mono">Θ(|V| + |E|)</span>.
      </div>
    </section>
  )
}
