'use client'

/**
 * LayeredSubsetsDAG — front-set-5-ask7 («Μονοπάτι μέσα από διατεταγμένα
 * υποσύνολα»).
 *
 * The construction: given disjoint subsets C_1, …, C_k of a complete
 * weighted graph, build a layered DAG where each C_i is a layer and
 * the only surviving edges go from C_i to C_{i+1} (with their
 * original weights). Add a virtual source s with 0-weight edges to
 * C_1 and a virtual sink t with 0-weight edges from C_k. Shortest
 * path from s to t in the DAG (topological order + relaxation) gives
 * the answer.
 *
 * The viz: two tabs over the SAME 7-vertex instance grouped into
 * C_1={a,b}, C_2={c,d,e}, C_3={f,g}.
 *  • Tab «Πλήρης γράφος»  — all 21 edges visible (hairball).
 *  • Tab «Στρωματικός DAG» — only across-layer edges + s/t. A
 *    «Δες dist[]» toggle reveals the per-vertex shortest distance
 *    from s, and the optimal s→t path lights up in red. The path is
 *    s → a → d → f → t with total 1+3+2+0 = 6, beating the four
 *    alternatives via b / c / e / g.
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type NodeId = 's' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 't'

const NODES_COMPLETE: Record<NodeId, { x: number; y: number }> = {
  s: { x: 0, y: 0 }, // hidden in this tab
  a: { x: 80, y: 70 },
  b: { x: 80, y: 200 },
  c: { x: 220, y: 30 },
  d: { x: 280, y: 145 },
  e: { x: 220, y: 250 },
  f: { x: 420, y: 70 },
  g: { x: 420, y: 200 },
  t: { x: 0, y: 0 }, // hidden in this tab
}

const NODES_LAYERED: Record<NodeId, { x: number; y: number }> = {
  s: { x: 40, y: 140 },
  a: { x: 160, y: 80 },
  b: { x: 160, y: 200 },
  c: { x: 290, y: 40 },
  d: { x: 290, y: 140 },
  e: { x: 290, y: 240 },
  f: { x: 420, y: 80 },
  g: { x: 420, y: 200 },
  t: { x: 540, y: 140 },
}

type Edge = { from: NodeId; to: NodeId; w: number }

/** Edges within the complete graph on {a..g}. Only across-layer ones
 *  are kept in the DAG view; same-layer edges (a-b, c-d, c-e, d-e,
 *  f-g) are drawn in the «Πλήρης» tab only. */
const EDGES_ALL: Edge[] = [
  // C_1 internal
  { from: 'a', to: 'b', w: 5 },
  // C_2 internal
  { from: 'c', to: 'd', w: 4 },
  { from: 'c', to: 'e', w: 6 },
  { from: 'd', to: 'e', w: 2 },
  // C_3 internal
  { from: 'f', to: 'g', w: 3 },
  // C_1 × C_2
  { from: 'a', to: 'c', w: 4 },
  { from: 'a', to: 'd', w: 3 },
  { from: 'a', to: 'e', w: 7 },
  { from: 'b', to: 'c', w: 6 },
  { from: 'b', to: 'd', w: 5 },
  { from: 'b', to: 'e', w: 5 },
  // C_2 × C_3
  { from: 'c', to: 'f', w: 5 },
  { from: 'c', to: 'g', w: 7 },
  { from: 'd', to: 'f', w: 2 },
  { from: 'd', to: 'g', w: 6 },
  { from: 'e', to: 'f', w: 8 },
  { from: 'e', to: 'g', w: 4 },
  // C_1 × C_3 (allowed in complete graph, NOT in DAG since order is forced)
  { from: 'a', to: 'f', w: 7 },
  { from: 'a', to: 'g', w: 9 },
  { from: 'b', to: 'f', w: 6 },
  { from: 'b', to: 'g', w: 8 },
]

const LAYER: Record<NodeId, number> = {
  s: -1,
  a: 1,
  b: 1,
  c: 2,
  d: 2,
  e: 2,
  f: 3,
  g: 3,
  t: 4,
}

const SOURCE_EDGES: Edge[] = [
  { from: 's', to: 'a', w: 0 },
  { from: 's', to: 'b', w: 0 },
]
const SINK_EDGES: Edge[] = [
  { from: 'f', to: 't', w: 0 },
  { from: 'g', to: 't', w: 0 },
]

const DAG_CROSS_EDGES = EDGES_ALL.filter((e) => LAYER[e.to] - LAYER[e.from] === 1)

const R = 18

/** Rects for the «Πλήρης γράφος» tab: only the 7 visible vertices {a..g}.
 *  (s and t sit at (0,0) in NODES_COMPLETE — placeholder, not rendered.) */
const COMPLETE_VISIBLE: NodeId[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
const COMPLETE_RECTS: NodeRect[] = COMPLETE_VISIBLE.map((id) => {
  const n = NODES_COMPLETE[id]
  return { id, x: n.x - R, y: n.y - R, w: 2 * R, h: 2 * R }
})
const COMPLETE_RECT_BY_ID = new Map<NodeId, NodeRect>(
  COMPLETE_RECTS.map((r) => [r.id as NodeId, r]),
)

/** Rects for the «Στρωματικός DAG» tab: all 9 vertices including s, t. */
const LAYERED_RECTS: NodeRect[] = (Object.keys(NODES_LAYERED) as NodeId[]).map(
  (id) => {
    const n = NODES_LAYERED[id]
    return { id, x: n.x - R, y: n.y - R, w: 2 * R, h: 2 * R }
  },
)
const LAYERED_RECT_BY_ID = new Map<NodeId, NodeRect>(
  LAYERED_RECTS.map((r) => [r.id as NodeId, r]),
)

/** Routed UNDIRECTED edge over the «complete» layout, center-to-center
 *  (no arrowheads in that tab). */
function routedCompleteEdge(fromId: NodeId, toId: NodeId) {
  const a = COMPLETE_RECT_BY_ID.get(fromId)!
  const b = COMPLETE_RECT_BY_ID.get(toId)!
  return routeEdge(a, b, COMPLETE_RECTS)
}

/** Routed DIRECTED edge over the «layered» layout, symmetric trim by R so
 *  the arrowhead marker lands on the destination border. */
function routedLayeredEdge(fromId: NodeId, toId: NodeId) {
  const a = LAYERED_RECT_BY_ID.get(fromId)!
  const b = LAYERED_RECT_BY_ID.get(toId)!
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2
  const geom = routeEdge(a, b, LAYERED_RECTS)
  return trimEdgeGeom(geom, ax, ay, R, bx, by, R)
}

/** dist[] computed by topological-order relaxation:
 *  s = 0; a = b = 0 (via s);
 *  c = min(a+4, b+6) = 4 (via a);
 *  d = min(a+3, b+5) = 3 (via a);
 *  e = min(a+7, b+5) = 5 (via b);
 *  f = min(c+5, d+2, e+8) = 5 (via d);
 *  g = min(c+7, d+6, e+4) = 9 (tie via d and e);
 *  t = min(f+0, g+0) = 5 (via f). */
const DIST: Record<NodeId, number> = {
  s: 0,
  a: 0,
  b: 0,
  c: 4,
  d: 3,
  e: 5,
  f: 5,
  g: 9,
  t: 5,
}

/** The optimal s→t path in DAG: s → a → d → f → t (total = 0+3+2+0 = 5). */
const OPT_PATH: NodeId[] = ['s', 'a', 'd', 'f', 't']
const OPT_EDGES = new Set(
  OPT_PATH.slice(0, -1).map((u, i) => `${u}-${OPT_PATH[i + 1]}`),
)

function NodeCircle({
  id,
  cx,
  cy,
  fill,
  stroke,
  highlight,
}: {
  id: string
  cx: number
  cy: number
  fill: string
  stroke: string
  highlight: boolean
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill={fill}
        stroke={highlight ? '#9f1239' : stroke}
        strokeWidth={highlight ? 3 : 2}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
        fill="#1c1214"
      >
        {id}
      </text>
    </g>
  )
}

export function LayeredSubsetsDAG() {
  const [tab, setTab] = useState<'complete' | 'dag'>('complete')
  const [showDist, setShowDist] = useState(false)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Από πλήρη γράφο σε στρωματικό DAG
        </div>
        <div className="flex overflow-hidden rounded-md border border-border text-xs">
          {(
            [
              { v: 'complete' as const, label: 'Πλήρης γράφος G' },
              { v: 'dag' as const, label: 'Στρωματικός DAG' },
            ]
          ).map(({ v, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => setTab(v)}
              className={
                'border-l border-border px-3 py-1.5 transition first:border-l-0 ' +
                (tab === v
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
        Παράδειγμα: <strong className="text-fg">C₁ = {'{a, b}'}</strong>,{' '}
        <strong className="text-fg">C₂ = {'{c, d, e}'}</strong>,{' '}
        <strong className="text-fg">C₃ = {'{f, g}'}</strong>. Στόχος: μονοπάτι 3
        κορυφών (μία από κάθε C_i) με ελάχιστο άθροισμα βαρών.
      </p>

      {tab === 'complete' && (
        <>
          <p className="mb-2 text-xs text-fg-muted">
            Όλες οι{' '}
            <span className="font-mono text-fg">{EDGES_ALL.length}</span> ακμές
            είναι παρούσες — αλλά η σειρά C₁ → C₂ → C₃ απαγορεύει τις περισσότερες.
            (Στον πλήρη γράφο: ακμές εντός υποσυνόλου, μεταξύ διαδοχικών, και
            μεταξύ μη-διαδοχικών.)
          </p>
          <div className="graph-canvas overflow-x-auto">
            <svg
              viewBox="0 0 500 290"
              className="mx-auto block w-full max-w-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {EDGES_ALL.map((e, i) => {
                const g = routedCompleteEdge(e.from, e.to)
                const allowed = LAYER[e.to] - LAYER[e.from] === 1
                const stroke = allowed ? '#9b8a8d' : '#e8d9da'
                const strokeWidth = allowed ? 1.6 : 1.2
                const strokeDasharray = allowed ? '' : '4 3'
                return g.kind === 'line' ? (
                  <line
                    key={i}
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                  />
                ) : (
                  <path
                    key={i}
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                  />
                )
              })}
              {(['a', 'b'] as NodeId[]).map((id) => {
                const n = NODES_COMPLETE[id]
                return <NodeCircle key={id} id={id} cx={n.x} cy={n.y} fill="#dbeafe" stroke="#3b82f6" highlight={false} />
              })}
              {(['c', 'd', 'e'] as NodeId[]).map((id) => {
                const n = NODES_COMPLETE[id]
                return <NodeCircle key={id} id={id} cx={n.x} cy={n.y} fill="#fef3c7" stroke="#d97706" highlight={false} />
              })}
              {(['f', 'g'] as NodeId[]).map((id) => {
                const n = NODES_COMPLETE[id]
                return <NodeCircle key={id} id={id} cx={n.x} cy={n.y} fill="#dcfce7" stroke="#16a34a" highlight={false} />
              })}
            </svg>
          </div>
          <p className="mt-2 text-xs text-fg-subtle">
            Συνεχείς γκρι ακμές: επιτρέπονται (μεταξύ διαδοχικών υποσυνόλων).
            Διακεκομμένες: παραβιάζουν τη διάταξη και αφαιρούνται στο επόμενο
            βήμα.
          </p>
        </>
      )}

      {tab === 'dag' && (
        <>
          <div className="graph-canvas overflow-x-auto">
            <svg
              viewBox="0 0 590 290"
              className="mx-auto block w-full max-w-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="lsd-arr"
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
                  id="lsd-arr-hi"
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

              {/* Layer column headers */}
              <text x={160} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#5a4a4d">
                C₁
              </text>
              <text x={290} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#5a4a4d">
                C₂
              </text>
              <text x={420} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#5a4a4d">
                C₃
              </text>

              {[...SOURCE_EDGES, ...DAG_CROSS_EDGES, ...SINK_EDGES].map((e, i) => {
                const a = NODES_LAYERED[e.from]
                const b = NODES_LAYERED[e.to]
                const g = routedLayeredEdge(e.from, e.to)
                const key = `${e.from}-${e.to}`
                const onOpt = OPT_EDGES.has(key)
                const mx = g.kind === 'line' ? (a.x + b.x) / 2 : (a.x + b.x + 2 * g.cx) / 4
                const my = g.kind === 'line' ? (a.y + b.y) / 2 : (a.y + b.y + 2 * g.cy) / 4
                const stroke = onOpt ? '#9f1239' : '#9b8a8d'
                const strokeWidth = onOpt ? 3 : 1.6
                const marker = onOpt ? 'url(#lsd-arr-hi)' : 'url(#lsd-arr)'
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
                      x={mx - 11}
                      y={my - 9}
                      width={22}
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
                      {e.w}
                    </text>
                  </g>
                )
              })}

              {(['s', 't'] as NodeId[]).map((id) => {
                const n = NODES_LAYERED[id]
                return (
                  <NodeCircle
                    key={id}
                    id={id}
                    cx={n.x}
                    cy={n.y}
                    fill="#fde2e4"
                    stroke="#9f1239"
                    highlight={OPT_PATH.includes(id)}
                  />
                )
              })}
              {(['a', 'b'] as NodeId[]).map((id) => {
                const n = NODES_LAYERED[id]
                return <NodeCircle key={id} id={id} cx={n.x} cy={n.y} fill="#dbeafe" stroke="#3b82f6" highlight={OPT_PATH.includes(id)} />
              })}
              {(['c', 'd', 'e'] as NodeId[]).map((id) => {
                const n = NODES_LAYERED[id]
                return <NodeCircle key={id} id={id} cx={n.x} cy={n.y} fill="#fef3c7" stroke="#d97706" highlight={OPT_PATH.includes(id)} />
              })}
              {(['f', 'g'] as NodeId[]).map((id) => {
                const n = NODES_LAYERED[id]
                return <NodeCircle key={id} id={id} cx={n.x} cy={n.y} fill="#dcfce7" stroke="#16a34a" highlight={OPT_PATH.includes(id)} />
              })}

              {showDist &&
                (['a', 'b', 'c', 'd', 'e', 'f', 'g'] as NodeId[]).map((id) => {
                  const n = NODES_LAYERED[id]
                  return (
                    <g key={`d-${id}`}>
                      <rect
                        x={n.x - 14}
                        y={n.y + R + 4}
                        width={28}
                        height={18}
                        rx={3}
                        fill="#1c1214"
                      />
                      <text
                        x={n.x}
                        y={n.y + R + 13}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={10}
                        fontWeight={700}
                        fill="#fff"
                      >
                        {DIST[id]}
                      </text>
                    </g>
                  )
                })}
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowDist((v) => !v)}
              className="rounded-md border border-border bg-bg-soft/60 px-3 py-1.5 text-xs font-semibold text-fg hover:bg-bg-soft"
            >
              {showDist ? 'Κρύψε dist[]' : 'Δες dist[] (τοπολογική χαλάρωση)'}
            </button>
            <div className="text-xs text-fg-muted">
              Συντομότερο μονοπάτι:{' '}
              <span className="font-mono font-bold text-danger">
                s → a → d → f → t
              </span>
              , συνολικό βάρος{' '}
              <span className="font-mono font-bold text-fg">0+3+2+0 = 5</span>.
            </div>
          </div>
        </>
      )}

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Το βήμα-κλειδί:</span> κρατώντας
        μόνο τις ακμές «από C_i προς C_{'{i+1}'}», ο γράφος γίνεται ακυκλικός με
        φυσική τοπολογική σειρά s, C₁, C₂, C₃, t. Από εκεί, συντομότερο μονοπάτι
        σε DAG = μία σάρωση σε O(|V|+|E|). Σε πλήρες υπόβαθρο, |E|=O(|V|²) → ο
        αλγόριθμος είναι O(|V|²), πολυωνυμικός.
      </div>
    </section>
  )
}
