'use client'

/**
 * DijkstraAnimator — step through Dijkstra on a small weighted digraph.
 *
 * One step = one extract-min plus all the relaxations it triggers. The
 * payoff a static page can't give: watching a tentative distance drop
 * (d[b]: 5 → 3) when a cheaper route is found, and seeing a node turn
 * green — "settled, distance final" — the moment it leaves the queue.
 * That settling moment is the invariant Dijkstra's correctness rests on.
 * Built for L09.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type DNode = { id: string; x: number; y: number }
type DEdge = { from: string; to: string; w: number }

const NODES: DNode[] = [
  { id: 's', x: 56, y: 148 },
  { id: 'a', x: 168, y: 70 },
  { id: 'b', x: 168, y: 226 },
  { id: 'c', x: 300, y: 120 },
  { id: 'd', x: 300, y: 240 },
  { id: 't', x: 416, y: 152 },
]
const EDGES: DEdge[] = [
  { from: 's', to: 'a', w: 2 },
  { from: 's', to: 'b', w: 5 },
  { from: 'a', to: 'b', w: 1 },
  { from: 'a', to: 'c', w: 7 },
  { from: 'b', to: 'c', w: 3 },
  { from: 'b', to: 'd', w: 4 },
  { from: 'c', to: 't', w: 1 },
  { from: 'd', to: 'c', w: 1 },
  { from: 'd', to: 't', w: 6 },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const NODE_R = 22
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - NODE_R,
  y: n.y - NODE_R,
  w: NODE_R * 2,
  h: NODE_R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))
const INF = Infinity

type Relax = { to: string; oldD: number; newD: number }
type DStep = {
  extracted: string
  dist: Record<string, number>
  settled: string[]
  relaxations: Relax[]
}

/** Run Dijkstra once, recording one DStep per extract-min. */
function runDijkstra(): DStep[] {
  const dist: Record<string, number> = {}
  for (const n of NODES) dist[n.id] = INF
  dist['s'] = 0
  const settled = new Set<string>()
  const steps: DStep[] = []

  while (settled.size < NODES.length) {
    let u: string | null = null
    for (const n of NODES) {
      if (settled.has(n.id)) continue
      if (u === null || dist[n.id] < dist[u]) u = n.id
    }
    if (u === null || dist[u] === INF) break
    settled.add(u)
    const relaxations: Relax[] = []
    for (const e of EDGES) {
      if (e.from !== u || settled.has(e.to)) continue
      const nd = dist[u] + e.w
      if (nd < dist[e.to]) {
        relaxations.push({ to: e.to, oldD: dist[e.to], newD: nd })
        dist[e.to] = nd
      }
    }
    steps.push({
      extracted: u,
      dist: { ...dist },
      settled: [...settled],
      relaxations,
    })
  }
  return steps
}

const fmt = (d: number) => (d === INF ? '∞' : String(d))

/**
 * Collision-aware edge routing for this viz: returns a straight line trimmed
 * to the node borders (the steady-state case for this 6-node layout) or a
 * quadratic Bezier curving around an unrelated node, also trimmed so the
 * arrowhead lands on the target border. Locks out the «edge through unrelated
 * node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: DNode, b: DNode) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  const trimmed = trimEdgeGeom(geom, a.x, a.y, NODE_R, b.x, b.y, NODE_R)
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  if (trimmed.kind === 'curve') {
    return { ...trimmed, mx: (a.x + 2 * trimmed.cx + b.x) / 4, my: (a.y + 2 * trimmed.cy + b.y) / 4 }
  }
  return { ...trimmed, mx, my }
}

export function DijkstraAnimator() {
  const steps = useMemo(() => runDijkstra(), [])
  const [step, setStep] = useState(0)
  const last = steps.length

  const cur = step === 0 ? null : steps[step - 1]
  const dist: Record<string, number> =
    cur?.dist ?? Object.fromEntries(NODES.map((n) => [n.id, n.id === 's' ? 0 : INF]))
  const settled = new Set(cur?.settled ?? [])
  const extracted = cur?.extracted ?? null
  const relaxedTo = new Set(cur?.relaxations.map((r) => r.to) ?? [])

  let note: string
  if (step === 0) {
    note =
      'Αρχικοποίηση: d[s] = 0, κάθε άλλη κορυφή d = ∞. Καμία κορυφή δεν είναι ακόμα οριστικοποιημένη. Πάτα «Επόμενο».'
  } else {
    const c = cur as DStep
    const head = `Εξάγουμε την κορυφή ${c.extracted} (d = ${fmt(c.dist[c.extracted])}) — οριστικοποιείται· η απόστασή της δεν θα ξαναλλάξει.`
    const body =
      c.relaxations.length === 0
        ? ' Καμία εξερχόμενη ακμή δεν βελτιώνει υπάρχουσα απόσταση.'
        : ' Χαλαρώνουμε: ' +
          c.relaxations
            .map((r) => `d[${r.to}] ${fmt(r.oldD)} → ${r.newD}`)
            .join(', ') +
          '.'
    const tail =
      step === last ? ` Τέλος — η συντομότερη απόσταση s→t είναι ${fmt(c.dist['t'])}.` : ''
    note = head + body + tail
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Dijkstra βήμα-βήμα — εξαγωγή ελαχίστου και χαλάρωση ακμών
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === last ? 'Ολοκληρώθηκε' : `S = {${[...settled].join(',') || '∅'}}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Πράσινο = οριστικοποιημένη (στο S) · κόκκινο = εξάγεται τώρα · κίτρινο = μόλις βελτιώθηκε.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 472 300"
          className="mx-auto block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="dij-arr"
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
              id="dij-arr-hi"
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

          {/* edges */}
          {EDGES.map((e, i) => {
            const A = POS.get(e.from)!
            const B = POS.get(e.to)!
            const g = routedEdge(A, B)
            const hot = extracted === e.from && !settled.has(e.to)
            const stroke = hot ? '#9f1239' : '#9b8a8d'
            const strokeWidth = hot ? 3 : 1.8
            const markerEnd = hot ? 'url(#dij-arr-hi)' : 'url(#dij-arr)'
            return (
              <g key={`e${i}`}>
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
                  x={g.mx - 11}
                  y={g.my - 10}
                  width={22}
                  height={16}
                  rx={3}
                  fill="#faf4ee"
                  stroke={hot ? '#9f1239' : '#cdbfc0'}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={hot ? '#9f1239' : '#5a4a4d'}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const isExtracted = n.id === extracted
            const isSettled = settled.has(n.id) && !isExtracted
            const isRelaxed = relaxedTo.has(n.id)
            const fill = isExtracted
              ? '#9f1239'
              : isSettled
                ? '#d1fae5'
                : '#ffffff'
            const stroke = isExtracted
              ? '#7e1031'
              : isSettled
                ? '#059669'
                : isRelaxed
                  ? '#d97706'
                  : '#9b8a8d'
            const txt = isExtracted ? '#ffffff' : '#1c1214'
            return (
              <g key={n.id}>
                {isRelaxed && (
                  <circle cx={n.x} cy={n.y} r={26} fill="none" stroke="#f59e0b" strokeWidth={2.5} />
                )}
                <circle cx={n.x} cy={n.y} r={20} fill={fill} stroke={stroke} strokeWidth={2.5} />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={700}
                  fill={txt}
                >
                  {n.id}
                </text>
                {/* distance label */}
                <rect
                  x={n.x - 20}
                  y={n.y - 42}
                  width={40}
                  height={18}
                  rx={4}
                  fill={isRelaxed ? '#fef3c7' : '#faf4ee'}
                  stroke={isRelaxed ? '#d97706' : '#cdbfc0'}
                />
                <text
                  x={n.x}
                  y={n.y - 33}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  d={fmt(dist[n.id])}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={step === last}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {last}
        </span>
      </div>
    </section>
  )
}
