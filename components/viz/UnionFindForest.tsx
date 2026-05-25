'use client'

/**
 * UnionFindForest — a disjoint set is a rooted tree (L10).
 *
 * The leap a student must make in union-find: a "set" is not a list or a
 * bag — it is a rooted tree of parent pointers, and its root is its name.
 * This viz steps through a scripted run of MakeSet / Union / Find on seven
 * elements. Each set is drawn as its own coloured tree; Union joins two
 * roots; Find lights up the walk from an element straight up to its root.
 * The parent[] array underneath shows the very same forest as plain
 * numbers — the structure and its storage, side by side. Built for L10.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { forestNodeRects, layoutForest } from './uf-layout'
import { routeEdge, trimEdgeGeom } from './edge-routing'

const ELEMS = ['1', '2', '3', '4', '5', '6', '7']
const NODE_R = 17

type Op =
  | { kind: 'union'; a: string; b: string }
  | { kind: 'find'; x: string }

const OPS: Op[] = [
  { kind: 'union', a: '1', b: '2' },
  { kind: 'union', a: '3', b: '4' },
  { kind: 'union', a: '5', b: '6' },
  { kind: 'find', x: '2' },
  { kind: 'union', a: '2', b: '3' },
  { kind: 'union', a: '6', b: '7' },
  { kind: 'union', a: '4', b: '5' },
  { kind: 'find', x: '7' },
]

/** each set is coloured by its root's id, so the colour stays stable */
const SET_COLORS: Record<string, { fill: string; stroke: string }> = {
  '1': { fill: '#fecdd3', stroke: '#e11d48' },
  '2': { fill: '#fde68a', stroke: '#d97706' },
  '3': { fill: '#bae6fd', stroke: '#0284c7' },
  '4': { fill: '#ddd6fe', stroke: '#7c3aed' },
  '5': { fill: '#bbf7d0', stroke: '#059669' },
  '6': { fill: '#fed7aa', stroke: '#ea580c' },
  '7': { fill: '#f5d0fe', stroke: '#c026d3' },
}

type UFStep = {
  parent: Record<string, string>
  findPath: string[]
  unionRoots: [string, string] | null
  newChild: string | null
  opLabel: string
  note: string
}

function runOps(): UFStep[] {
  const parent: Record<string, string> = {}
  const size: Record<string, number> = {}
  for (const e of ELEMS) {
    parent[e] = e
    size[e] = 1
  }
  const find = (x: string): string => {
    let r = x
    while (parent[r] !== r) r = parent[r]
    return r
  }
  const pathOf = (x: string): string[] => {
    const path = [x]
    let r = x
    while (parent[r] !== r) {
      r = parent[r]
      path.push(r)
    }
    return path
  }

  const steps: UFStep[] = [
    {
      parent: { ...parent },
      findPath: [],
      unionRoots: null,
      newChild: null,
      opLabel: 'MakeSet ×7',
      note: 'Επτά στοιχεία, επτά ξεχωριστά σύνολα. Το MakeSet δίνει στο καθένα το δικό του δέντρο μιας κορυφής — ρίζα του εαυτού του.',
    },
  ]

  for (const op of OPS) {
    if (op.kind === 'union') {
      const ra = find(op.a)
      const rb = find(op.b)
      if (ra === rb) {
        steps.push({
          parent: { ...parent },
          findPath: [],
          unionRoots: [ra, rb],
          newChild: null,
          opLabel: `Union(${op.a}, ${op.b})`,
          note: `Union(${op.a}, ${op.b}): οι ${op.a} και ${op.b} έχουν ήδη κοινή ρίζα (${ra}) — είναι στο ίδιο σύνολο, τίποτα να ενώσουμε.`,
        })
        continue
      }
      const sa = size[ra]
      const sb = size[rb]
      let big = ra
      let small = rb
      if (sa < sb) {
        big = rb
        small = ra
      }
      parent[small] = big
      size[big] += size[small]
      steps.push({
        parent: { ...parent },
        findPath: [],
        unionRoots: [ra, rb],
        newChild: small,
        opLabel: `Union(${op.a}, ${op.b})`,
        note: `Union(${op.a}, ${op.b}): η ρίζα του ${op.a} είναι ${ra} (μέγεθος ${sa}), του ${op.b} είναι ${rb} (μέγεθος ${sb}). Κρεμάμε τη ρίζα του μικρότερου δέντρου, ${small}, κάτω από τη ρίζα του μεγαλύτερου, ${big} — μία αλλαγή δείκτη.`,
      })
    } else {
      const path = pathOf(op.x)
      const root = path[path.length - 1]
      steps.push({
        parent: { ...parent },
        findPath: path,
        unionRoots: null,
        newChild: null,
        opLabel: `Find(${op.x})`,
        note:
          path.length === 1
            ? `Find(${op.x}): το ${op.x} δείχνει στον εαυτό του — είναι ήδη ρίζα. Find(${op.x}) = ${op.x}.`
            : `Find(${op.x}): ακολουθούμε τους δείκτες-γονείς προς τα πάνω, ${path.join(' → ')}. Το ${root} δείχνει στον εαυτό του — είναι η ρίζα. Find(${op.x}) = ${root}.`,
      })
    }
  }
  return steps
}

export function UnionFindForest() {
  const steps = useMemo(runOps, [])
  const last = steps.length - 1
  const [step, setStep] = useState(0)
  const cur = steps[step]

  const view = useMemo(() => {
    let w = 0
    let h = 0
    for (const s of steps) {
      const L = layoutForest(new Map(Object.entries(s.parent)))
      if (L.width > w) w = L.width
      if (L.height > h) h = L.height
    }
    return { w, h }
  }, [steps])

  const layout = useMemo(
    () => layoutForest(new Map(Object.entries(cur.parent))),
    [cur],
  )

  const { rects: nodeRects, rectById: nodeRectById } = useMemo(
    () => forestNodeRects(layout, NODE_R),
    [layout],
  )

  /** routed child→parent geometry, trimmed asymmetrically so the arrowhead
   *  marker has room on the parent side (NODE_R + 7) but the line starts
   *  exactly on the child's circle border (NODE_R). */
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

  const rootOf = (x: string): string => {
    let r = x
    while (cur.parent[r] !== r) r = cur.parent[r]
    return r
  }

  const pathEdgeChild = new Set(cur.findPath.slice(0, -1))
  const pathNodes = new Set(cur.findPath)
  const unionSet = new Set(cur.unionRoots ?? [])
  const setCount = new Set(ELEMS.map(rootOf)).size
  const offsetX = (view.w - layout.width) / 2

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Union-Find — κάθε σύνολο ένα δέντρο με ρίζα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {cur.opLabel}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Ίδιο χρώμα = ίδιο σύνολο · βέλος = δείκτης προς τον γονέα ·{' '}
        {setCount} {setCount === 1 ? 'σύνολο' : 'σύνολα'} τώρα
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${view.w} ${view.h}`}
          className="mx-auto block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="uff-arrow"
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
              id="uff-arrow-hot"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
          </defs>

          <g transform={`translate(${offsetX}, 0)`}>
            {/* edges: each non-root points at its parent */}
            {ELEMS.filter((e) => cur.parent[e] !== e).map((c) => {
              const p = cur.parent[c]
              const g = routedEdge(c, p)
              const onPath = pathEdgeChild.has(c)
              const isNew = cur.newChild === c
              const hot = onPath || isNew
              const stroke = hot ? '#9f1239' : '#6b5d5f'
              const strokeWidth = hot ? 3.4 : 1.9
              const markerEnd = hot ? 'url(#uff-arrow-hot)' : 'url(#uff-arrow)'
              return g.kind === 'line' ? (
                <line
                  key={`e${c}`}
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
                  key={`e${c}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={markerEnd}
                />
              )
            })}

            {/* self-loop on each root */}
            {layout.roots.map((r) => {
              const p = layout.pos.get(r)!
              return (
                <path
                  key={`loop${r}`}
                  d={`M ${p.x - 6} ${p.y - NODE_R + 1} a 9 9 0 1 1 12 0`}
                  fill="none"
                  stroke="#9b8a8d"
                  strokeWidth={1.7}
                  markerEnd="url(#uff-arrow)"
                />
              )
            })}

            {/* nodes */}
            {ELEMS.map((e) => {
              const p = layout.pos.get(e)!
              const col = SET_COLORS[rootOf(e)]
              const onPath = pathNodes.has(e)
              const inUnion = unionSet.has(e)
              return (
                <g key={`n${e}`}>
                  {(onPath || inUnion) && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={NODE_R + 6}
                      fill="none"
                      stroke={onPath ? '#9f1239' : '#1c1214'}
                      strokeWidth={2.4}
                      strokeDasharray={inUnion && !onPath ? '4 3' : undefined}
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={NODE_R}
                    fill={col.fill}
                    stroke={col.stroke}
                    strokeWidth={2.6}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill="#1c1214"
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
            const col = SET_COLORS[rootOf(e)]
            return (
              <div
                key={e}
                className="flex w-[3.1rem] flex-col items-center rounded-md border-2 py-0.5"
                style={{ borderColor: col.stroke, backgroundColor: col.fill }}
              >
                <span className="text-[10px] font-bold text-[#1c1214]/70">
                  {e}
                </span>
                <span className="text-base font-extrabold text-[#1c1214]">
                  {pv}
                </span>
                <span className="text-[9px] font-semibold text-[#1c1214]/70">
                  {isRoot ? 'ρίζα' : 'γονέας'}
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
