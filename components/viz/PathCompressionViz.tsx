'use client'

/**
 * PathCompressionViz — Find pays for the walk, then flattens it (L10).
 *
 * Path compression is "almost free" but invisible in prose: a student reads
 * "re-point every node on the path to the root" and pictures nothing. So
 * this viz runs Find(6) hop by hop up a near-degenerate tree, counts the 5
 * jumps it costs — then performs the compression, snapping every visited
 * node straight onto the root. A second Find(6) now costs ONE hop. The
 * before/after, plus the parent[] row rewriting itself, makes the trick
 * concrete: you pay the long walk once, and buy speed forever. Built for L10.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { forestNodeRects, layoutForest } from './uf-layout'
import { routeEdge, trimEdgeGeom } from './edge-routing'

const ELEMS = ['1', '2', '3', '4', '5', '6', '7']
const NODE_R = 16
const LAYOUT = { nodeGap: 50, levelGap: 48, padX: 26, padY: 24 }

/** the near-chain we start from: 1 ← 2 ← 3 ← 4 ← (5 ← 6, 7) */
const TALL: Record<string, string> = {
  '1': '1',
  '2': '1',
  '3': '2',
  '4': '3',
  '5': '4',
  '6': '5',
  '7': '4',
}
/** after compressing the 6→1 path */
const FLAT: Record<string, string> = {
  '1': '1',
  '2': '1',
  '3': '1',
  '4': '1',
  '5': '1',
  '6': '1',
  '7': '4',
}

type Phase = 'init' | 'walk' | 'reached' | 'compress' | 'refind'
type PCStep = {
  parent: Record<string, string>
  cursor: string | null
  path: string[]
  rerouted: string[]
  hops: number
  phase: Phase
  note: string
}

const STEPS: PCStep[] = [
  {
    parent: TALL,
    cursor: null,
    path: [],
    rerouted: [],
    hops: 0,
    phase: 'init',
    note: 'Αυτό το δέντρο union-find έχει εκφυλιστεί σχεδόν σε αλυσίδα. Θα τρέξουμε Find(6) — και θα δούμε τη συμπίεση μονοπατιού να το ισιώνει.',
  },
  {
    parent: TALL,
    cursor: '6',
    path: ['6'],
    rerouted: [],
    hops: 0,
    phase: 'walk',
    note: 'Find(6): ξεκινάμε στο 6. Δεν είναι ρίζα — δείχνει στον γονέα του, το 5.',
  },
  {
    parent: TALL,
    cursor: '5',
    path: ['6', '5'],
    rerouted: [],
    hops: 1,
    phase: 'walk',
    note: '6 → 5. Ανεβαίνουμε έναν δείκτη. Το 5 δείχνει στο 4.',
  },
  {
    parent: TALL,
    cursor: '4',
    path: ['6', '5', '4'],
    rerouted: [],
    hops: 2,
    phase: 'walk',
    note: '5 → 4. Συνεχίζουμε προς τα πάνω. Το 4 δείχνει στο 3.',
  },
  {
    parent: TALL,
    cursor: '3',
    path: ['6', '5', '4', '3'],
    rerouted: [],
    hops: 3,
    phase: 'walk',
    note: '4 → 3. Το 3 δείχνει στο 2.',
  },
  {
    parent: TALL,
    cursor: '2',
    path: ['6', '5', '4', '3', '2'],
    rerouted: [],
    hops: 4,
    phase: 'walk',
    note: '3 → 2. Το 2 δείχνει στο 1.',
  },
  {
    parent: TALL,
    cursor: '1',
    path: ['6', '5', '4', '3', '2', '1'],
    rerouted: [],
    hops: 5,
    phase: 'reached',
    note: '2 → 1. Το 1 δείχνει στον εαυτό του — ρίζα! Find(6) = 1, με κόστος 5 αναπηδήσεις. Ακριβό. Αλλά μόλις διασχίσαμε όλο αυτό το μονοπάτι…',
  },
  {
    parent: FLAT,
    cursor: '1',
    path: ['6', '5', '4', '3', '2', '1'],
    rerouted: ['6', '5', '4', '3', '2'],
    hops: 5,
    phase: 'compress',
    note: 'Συμπίεση μονοπατιού: κάθε κορυφή που μόλις διασχίσαμε — 6, 5, 4, 3, 2 — ξαναδείχνει ΑΠΕΥΘΕΙΑΣ στο 1. Το δέντρο ισιώνει. Ακόμα και το 7 ωφελήθηκε: ο γονέας του, το 4, ανέβηκε στη ρίζα.',
  },
  {
    parent: FLAT,
    cursor: '6',
    path: ['6', '1'],
    rerouted: [],
    hops: 1,
    phase: 'refind',
    note: 'Τρέξε ξανά Find(6): 6 → 1 σε ΕΝΑ βήμα. Πλήρωσες το μακρύ μονοπάτι μία φορά — κερδίζεις σε κάθε επόμενη Find, για όλες αυτές τις κορυφές.',
  },
]

export function PathCompressionViz() {
  const last = STEPS.length - 1
  const [step, setStep] = useState(0)
  const cur = STEPS[step]

  const view = useMemo(() => {
    let w = 0
    let h = 0
    for (const s of STEPS) {
      const L = layoutForest(new Map(Object.entries(s.parent)), LAYOUT)
      if (L.width > w) w = L.width
      if (L.height > h) h = L.height
    }
    return { w, h }
  }, [])

  const layout = useMemo(
    () => layoutForest(new Map(Object.entries(cur.parent)), LAYOUT),
    [cur],
  )
  const offsetX = (view.w - layout.width) / 2

  const { rects: nodeRects, rectById: nodeRectById } = useMemo(
    () => forestNodeRects(layout, NODE_R),
    [layout],
  )

  /** routed child→parent geometry; asymmetric trim leaves NODE_R + 7 on the
   *  parent side so the arrowhead marker has its expected gap. */
  const routedEdge = (childId: string, parentId: string) => {
    const cR = nodeRectById.get(childId)!
    const pR = nodeRectById.get(parentId)!
    const cx = cR.x + cR.w / 2
    const cy = cR.y + cR.h / 2
    const px = pR.x + pR.w / 2
    const py = pR.y + pR.h / 2
    const geom = routeEdge(cR, pR, nodeRects)
    return trimEdgeGeom(geom, cx, cy, NODE_R, px, py, NODE_R + 7)
  }

  const pathNodes = new Set(cur.path)
  const pathEdge = new Set<string>()
  for (let i = 0; i + 1 < cur.path.length; i++) pathEdge.add(cur.path[i])
  const rerouted = new Set(cur.rerouted)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Συμπίεση μονοπατιού — πλήρωσε μία φορά, κέρδισε για πάντα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {cur.phase === 'compress'
            ? 'Συμπίεση'
            : cur.phase === 'refind'
              ? 'Find #2'
              : cur.phase === 'init'
                ? 'Αρχή'
                : 'Find #1'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Αναπηδήσεις αυτής της Find:{' '}
        <span className="font-bold text-fg">{cur.hops}</span>
        {cur.phase === 'refind' && (
          <span className="text-success"> — έναντι 5 πριν τη συμπίεση</span>
        )}
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${view.w} ${view.h}`}
          className="mx-auto block w-full max-w-xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="pcv-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b5d5f" />
            </marker>
            <marker
              id="pcv-arrow-hot"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
            <marker
              id="pcv-arrow-new"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
            </marker>
          </defs>

          <g transform={`translate(${offsetX}, 0)`}>
            {/* edges */}
            {ELEMS.filter((e) => cur.parent[e] !== e).map((c) => {
              const g = routedEdge(c, cur.parent[c])
              const isNew = rerouted.has(c)
              const onPath = pathEdge.has(c)
              const stroke = isNew ? '#059669' : onPath ? '#9f1239' : '#6b5d5f'
              const marker = isNew
                ? 'url(#pcv-arrow-new)'
                : onPath
                  ? 'url(#pcv-arrow-hot)'
                  : 'url(#pcv-arrow)'
              const strokeWidth = isNew || onPath ? 3.4 : 1.9
              return g.kind === 'line' ? (
                <line
                  key={`e${c}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                />
              ) : (
                <path
                  key={`e${c}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                />
              )
            })}

            {/* nodes */}
            {ELEMS.map((e) => {
              const p = layout.pos.get(e)!
              const isRoot = cur.parent[e] === e
              const isCursor = e === cur.cursor
              const onPath = pathNodes.has(e)
              const fill = isRoot
                ? '#fecdd3'
                : isCursor
                  ? '#9f1239'
                  : onPath
                    ? '#fde68a'
                    : '#ffffff'
              const stroke = isRoot
                ? '#e11d48'
                : isCursor
                  ? '#7e1031'
                  : onPath
                    ? '#d97706'
                    : '#9b8a8d'
              return (
                <g key={`n${e}`}>
                  {isCursor && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={NODE_R + 6}
                      fill="none"
                      stroke="#9f1239"
                      strokeWidth={2.4}
                      strokeDasharray="4 3"
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={NODE_R}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2.6}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill={isCursor ? '#ffffff' : '#1c1214'}
                  >
                    {e}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* parent[] array */}
      <div className="mt-3">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πίνακας γονέων — parent[ ]
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ELEMS.map((e) => {
            const pv = cur.parent[e]
            const isRoot = pv === e
            const changed = rerouted.has(e)
            return (
              <div
                key={e}
                className={cn(
                  'flex w-[3rem] flex-col items-center rounded-md border-2 py-0.5 transition-colors',
                  changed
                    ? 'border-[#059669] bg-[#d1fae5] text-[#065f46]'
                    : isRoot
                      ? 'border-[#e11d48] bg-[#fecdd3] text-[#9f1239]'
                      : 'border-border bg-bg-soft text-fg-muted',
                )}
              >
                <span className="text-[10px] font-bold opacity-70">{e}</span>
                <span className="text-base font-extrabold">{pv}</span>
                <span className="text-[9px] font-semibold opacity-70">
                  {isRoot ? 'ρίζα' : changed ? 'νέο!' : 'γονέας'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[4.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {cur.note}
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
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {last}
        </span>
      </div>
    </section>
  )
}
