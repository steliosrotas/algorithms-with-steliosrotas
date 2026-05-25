'use client'

/**
 * ComponentSweep — finding ALL connected components with the outer loop (L08).
 *
 * One BFS finds one component. To find them all, an outer loop walks every
 * vertex 1…n; an unvisited one fires a BFS that claims a whole component at
 * once, and already-visited ones are skipped instantly. This viz makes both
 * halves visible: the cursor scanning the vertices, each BFS lighting up an
 * entire component in its own colour, and — crucially — the running tally
 * that shows only ONE BFS call per component, not one per vertex. That is
 * why the total stays O(n + m). Built for L08.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type GNode = { id: string; x: number; y: number }

const NODES: GNode[] = [
  { id: '1', x: 62, y: 58 },
  { id: '2', x: 164, y: 46 },
  { id: '3', x: 120, y: 124 },
  { id: '4', x: 54, y: 156 },
  { id: '5', x: 176, y: 138 },
  { id: '6', x: 110, y: 216 },
  { id: '7', x: 238, y: 74 },
  { id: '8', x: 242, y: 156 },
  { id: '9', x: 360, y: 62 },
  { id: '10', x: 434, y: 62 },
  { id: '11', x: 352, y: 212 },
  { id: '12', x: 438, y: 190 },
  { id: '13', x: 424, y: 264 },
]
const NODE_R = 18
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - NODE_R,
  y: n.y - NODE_R,
  w: NODE_R * 2,
  h: NODE_R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

/**
 * Collision-aware edge routing on the multi-component layout: returns a
 * straight segment (the steady-state case here — every component sits in
 * its own region of the canvas) or a quadratic Bezier that bends around an
 * unrelated node. Center-to-center, no border trim. Locks out the «edge
 * through unrelated node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(aId: string, bId: string) {
  const rectA = NODE_RECT_BY_ID.get(aId)!
  const rectB = NODE_RECT_BY_ID.get(bId)!
  return routeEdge(rectA, rectB, NODE_RECTS)
}

const EDGES: [string, string][] = [
  ['1', '2'], ['1', '3'], ['2', '3'], ['3', '4'], ['3', '5'],
  ['2', '5'], ['5', '6'], ['3', '7'], ['7', '8'], ['5', '8'],
  ['9', '10'],
  ['11', '12'], ['12', '13'], ['11', '13'],
]

type CompKey = 'A' | 'B' | 'C'
type Comp = {
  key: CompKey
  label: string
  nodes: string[]
  trigger: string
  fill: string
  stroke: string
  light: string
}
const COMPS: Comp[] = [
  {
    key: 'A',
    label: 'Συνιστώσα 1',
    nodes: ['1', '2', '3', '4', '5', '6', '7', '8'],
    trigger: '1',
    fill: '#fda4af',
    stroke: '#e11d48',
    light: '#fff1f2',
  },
  {
    key: 'B',
    label: 'Συνιστώσα 2',
    nodes: ['9', '10'],
    trigger: '9',
    fill: '#7dd3fc',
    stroke: '#0284c7',
    light: '#f0f9ff',
  },
  {
    key: 'C',
    label: 'Συνιστώσα 3',
    nodes: ['11', '12', '13'],
    trigger: '11',
    fill: '#fcd34d',
    stroke: '#ca8a04',
    light: '#fffbeb',
  },
]

const ORDER = NODES.map((n) => n.id)
const COMP_OF = new Map<string, Comp>()
for (const c of COMPS) for (const id of c.nodes) COMP_OF.set(id, c)
/** the scan step (1-based) at which each component's trigger is reached */
const TRIGGER_STEP = new Map<CompKey, number>(
  COMPS.map((c) => [c.key, ORDER.indexOf(c.trigger) + 1]),
)

export function ComponentSweep() {
  const [step, setStep] = useState(0)
  const last = ORDER.length

  /** components claimed (BFS already fired) by the current step */
  const claimed = useMemo(
    () => COMPS.filter((c) => step >= (TRIGGER_STEP.get(c.key) ?? Infinity)),
    [step],
  )
  const visited = useMemo(() => {
    const s = new Set<string>()
    for (const c of claimed) for (const id of c.nodes) s.add(id)
    return s
  }, [claimed])

  const cursor = step > 0 ? ORDER[step - 1] : null
  const cursorComp = cursor ? COMP_OF.get(cursor)! : null
  const cursorFired = cursor ? cursorComp!.trigger === cursor : false
  const bfsCalls = claimed.length

  let note: string
  if (step === 0) {
    note =
      'Η εξωτερική επανάληψη θα διατρέξει τις κορυφές 1…13 με τη σειρά. Κάθε ανεπίσκεπτη κορυφή πυροδοτεί ένα BFS. Πάτα «Επόμενο».'
  } else if (step === last) {
    note =
      'Σάρωση πλήρης. 13 κορυφές ελέγχθηκαν — αλλά μόνο 3 κλήσεις BFS, μία ανά συνιστώσα, ΟΧΙ μία ανά κορυφή. Κάθε κορυφή μαρκαρίστηκε μία φορά και κάθε ακμή εξετάστηκε μία φορά συνολικά → χρόνος O(n + m).'
  } else if (cursorFired) {
    note = `Κορυφή ${cursor}: ΑΝΕΠΙΣΚΕΠΤΗ → ξεκινά BFS από εδώ. Με μία διάσχιση ξεκλειδώνει ΟΛΗ τη ${cursorComp!.label.toLowerCase()} — ${cursorComp!.nodes.length} κορυφές μονομιάς.`
  } else {
    note = `Κορυφή ${cursor}: ήδη επισκεμμένη — την είχε μαρκάρει το BFS από την κορυφή ${cursorComp!.trigger}. Η εξωτερική επανάληψη απλώς την προσπερνά· κανένα νέο BFS.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Όλες οι συνεκτικές συνιστώσες — η εξωτερική επανάληψη
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === last ? 'Ολοκληρώθηκε' : `Κορυφή ${step}/${last}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κλήσεις BFS: {bfsCalls} · κορυφές μαρκαρισμένες: {visited.size}/{last}
      </p>

      {/* outer-loop strip */}
      <div className="mb-2 flex flex-wrap gap-1">
        {ORDER.map((id, i) => {
          const done = i + 1 < step
          const isCursor = i + 1 === step
          const fired = COMP_OF.get(id)!.trigger === id
          const comp = COMP_OF.get(id)!
          const style =
            done || isCursor
              ? {
                  backgroundColor: isCursor ? comp.fill : comp.light,
                  borderColor: comp.stroke,
                  color: comp.stroke,
                }
              : undefined
          return (
            <div
              key={id}
              style={style}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded border text-xs font-bold',
                isCursor && 'ring-2 ring-fg/40',
                !done && !isCursor && 'border-dashed border-border text-fg-subtle',
                done && fired && 'border-2',
              )}
            >
              {id}
            </div>
          )
        })}
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 484 300"
          className="mx-auto block w-full max-w-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {EDGES.map(([a, b], i) => {
            const g = routedEdge(a, b)
            const comp = COMP_OF.get(a)!
            const on = visited.has(a) && visited.has(b)
            const stroke = on ? comp.stroke : '#c9bcbe'
            const strokeWidth = on ? 2.6 : 1.7
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

          {/* nodes */}
          {NODES.map((n) => {
            const comp = COMP_OF.get(n.id)!
            const isVisited = visited.has(n.id)
            const isCursor = n.id === cursor
            return (
              <g key={n.id}>
                {isCursor && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={26}
                    fill="none"
                    stroke="#1c1214"
                    strokeWidth={2.5}
                    strokeDasharray="4 3"
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={18}
                  fill={isVisited ? comp.fill : '#ffffff'}
                  stroke={isVisited ? comp.stroke : '#9b8a8d'}
                  strokeWidth={2.5}
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
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* legend */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {COMPS.map((c) => (
          <div key={c.key} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-3 w-3 rounded-sm border"
              style={{ backgroundColor: c.fill, borderColor: c.stroke }}
            />
            <span className="text-fg-muted">
              {c.label} — BFS από την {c.trigger}
            </span>
          </div>
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

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
