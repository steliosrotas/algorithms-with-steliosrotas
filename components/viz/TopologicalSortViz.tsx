'use client'

/**
 * TopologicalSortViz — Kahn's algorithm, one source removed per step.
 *
 * The viz makes the O(m + n) implementation tangible: every node carries
 * its current in-degree count; removing a source decrements its targets;
 * a target whose count hits 0 lights up as a new source. The topological
 * order builds up below. Built for L12.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type TNode = { id: string; x: number; y: number }
type TEdge = { from: string; to: string }

const NODES: TNode[] = [
  { id: 'A', x: 112, y: 52 },
  { id: 'B', x: 344, y: 52 },
  { id: 'C', x: 88, y: 156 },
  { id: 'D', x: 228, y: 156 },
  { id: 'E', x: 368, y: 156 },
  { id: 'F', x: 228, y: 256 },
  { id: 'G', x: 228, y: 348 },
]
const EDGES: TEdge[] = [
  { from: 'A', to: 'C' },
  { from: 'A', to: 'D' },
  { from: 'B', to: 'C' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'D', to: 'F' },
  { from: 'E', to: 'F' },
  { from: 'F', to: 'G' },
]
const NODE_R = 22
const NODE_RECTS: NodeRect[] = NODES.map((n) => ({
  id: n.id,
  x: n.x - NODE_R,
  y: n.y - NODE_R,
  w: 2 * NODE_R,
  h: 2 * NODE_R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id as string, r]))

/** Routed directed edge, trimmed symmetrically by NODE_R so the arrowhead
 *  marker lands on the destination's circle border. */
function routedEdge(fromId: string, toId: string) {
  const a = NODE_RECT_BY_ID.get(fromId)!
  const b = NODE_RECT_BY_ID.get(toId)!
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2
  const geom = routeEdge(a, b, NODE_RECTS)
  return trimEdgeGeom(geom, ax, ay, NODE_R, bx, by, NODE_R)
}

type TStep = {
  removed: string
  counts: Record<string, number>
  order: string[]
  newSources: string[]
}

/** Run Kahn's algorithm, recording one step per removed source. */
function runKahn(): TStep[] {
  const count: Record<string, number> = {}
  for (const n of NODES) count[n.id] = 0
  for (const e of EDGES) count[e.to] += 1
  const removed = new Set<string>()
  const order: string[] = []
  const steps: TStep[] = []

  while (order.length < NODES.length) {
    const sources = NODES.filter(
      (n) => count[n.id] === 0 && !removed.has(n.id),
    ).map((n) => n.id)
    if (sources.length === 0) break
    const pick = sources.sort()[0]
    removed.add(pick)
    order.push(pick)
    const newSources: string[] = []
    for (const e of EDGES) {
      if (e.from !== pick) continue
      count[e.to] -= 1
      if (count[e.to] === 0) newSources.push(e.to)
    }
    steps.push({ removed: pick, counts: { ...count }, order: [...order], newSources })
  }
  return steps
}

const INDEG0: Record<string, number> = (() => {
  const c: Record<string, number> = {}
  for (const n of NODES) c[n.id] = 0
  for (const e of EDGES) c[e.to] += 1
  return c
})()

export function TopologicalSortViz() {
  const steps = useMemo(() => runKahn(), [])
  const [step, setStep] = useState(0)
  const last = steps.length

  const counts = step === 0 ? INDEG0 : steps[step - 1].counts
  const order = step === 0 ? [] : steps[step - 1].order
  const removed = new Set(order)
  const justRemoved = step === 0 ? null : steps[step - 1].removed
  const newSources = new Set(step === 0 ? [] : steps[step - 1].newSources)
  const settled = new Set(order.filter((id) => id !== justRemoved))

  let note: string
  if (step === 0) {
    const src = NODES.filter((n) => INDEG0[n.id] === 0).map((n) => n.id)
    note = `Υπολογίζουμε τον εσώβαθμο κάθε κορυφής (πλήθος εισερχόμενων ακμών). Πηγές — εσώβαθμος 0 — είναι οι: ${src.join(', ')}. Πάτα «Επόμενο».`
  } else {
    const s = steps[step - 1]
    note =
      `Αφαιρούμε την πηγή ${s.removed} — μπαίνει στη θέση ${step} της διάταξης. Μειώνουμε τον εσώβαθμο των γειτόνων της. ` +
      (s.newSources.length
        ? `Νέες πηγές (εσώβαθμος 0): ${s.newSources.join(', ')}.`
        : 'Καμία νέα πηγή αυτή τη φορά.')
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Τοπολογική διάταξη — βγάζε επανειλημμένα μια πηγή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === last ? 'Ολοκληρώθηκε' : `Βήμα ${step}/${last}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Ο αριθμός σε κάθε κορυφή είναι ο τρέχων εσώβαθμός της. Πηγή = εσώβαθμος 0.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 460 388"
          className="mx-auto block w-full max-w-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="ts-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
          </defs>

          {/* edges */}
          {EDGES.map((e, i) => {
            const g = routedEdge(e.from, e.to)
            const gone = removed.has(e.from)
            const strokeOpacity = gone ? 0.25 : 1
            return g.kind === 'line' ? (
              <line
                key={`e${i}`}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke="#9b8a8d"
                strokeWidth={1.8}
                strokeOpacity={strokeOpacity}
                markerEnd="url(#ts-arr)"
              />
            ) : (
              <path
                key={`e${i}`}
                d={g.d}
                fill="none"
                stroke="#9b8a8d"
                strokeWidth={1.8}
                strokeOpacity={strokeOpacity}
                markerEnd="url(#ts-arr)"
              />
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const isJust = n.id === justRemoved
            const isSettled = settled.has(n.id)
            const isSource = counts[n.id] === 0 && !removed.has(n.id)
            const fill = isJust
              ? '#9f1239'
              : isSettled
                ? '#d1fae5'
                : isSource
                  ? '#fef3c7'
                  : '#ffffff'
            const stroke = isJust
              ? '#7e1031'
              : isSettled
                ? '#059669'
                : isSource
                  ? '#d97706'
                  : '#9b8a8d'
            return (
              <g key={n.id}>
                {newSources.has(n.id) && (
                  <circle cx={n.x} cy={n.y} r={28} fill="none" stroke="#f59e0b" strokeWidth={2.5} />
                )}
                <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={stroke} strokeWidth={2.5} />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill={isJust ? '#ffffff' : '#1c1214'}
                >
                  {n.id}
                </text>
                {/* in-degree badge */}
                {!removed.has(n.id) && (
                  <>
                    <circle cx={n.x + 20} cy={n.y - 20} r={11} fill="#faf4ee" stroke={stroke} strokeWidth={1.5} />
                    <text
                      x={n.x + 20}
                      y={n.y - 20}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={700}
                      fill="#1c1214"
                    >
                      {counts[n.id]}
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* topological order built so far */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Τοπολογική διάταξη
        </div>
        <div className="flex flex-wrap gap-1.5">
          {NODES.map((_, i) => {
            const id = order[i]
            return (
              <div
                key={i}
                className={
                  'flex h-8 w-8 items-center justify-center rounded-md border font-mono text-sm font-bold ' +
                  (id
                    ? 'border-success/50 bg-success/15 text-fg'
                    : 'border-dashed border-border text-transparent')
                }
              >
                {id ?? '·'}
              </div>
            )
          })}
        </div>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
      </div>
    </section>
  )
}
