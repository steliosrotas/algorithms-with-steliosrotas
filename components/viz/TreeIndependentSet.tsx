'use client'

/**
 * TreeIndependentSet — DP on a tree, computed leaves-to-root.
 *
 * L17's new structural idea: subproblems are *subtrees*, and each node
 * carries TWO values — A[v] (v free) and B[v] (v excluded). This viz walks
 * the tree in post-order, showing B[v] = Σ A[children] and
 * A[v] = max{ B[v], χ(v) + Σ B[children] } as each node is reached. A
 * final step lights the maximum-weight independent set. Built for L17,
 * on the lecture's own "party" tree.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { routeEdge, type NodeRect } from './edge-routing'

type TNode = { id: string; chi: number; x: number; y: number; children: string[] }

const NODES: Record<string, TNode> = {
  r: { id: 'r', chi: 8, x: 310, y: 52, children: ['a', 'b'] },
  a: { id: 'a', chi: 10, x: 180, y: 166, children: ['c', 'd'] },
  b: { id: 'b', chi: 20, x: 470, y: 166, children: ['e'] },
  c: { id: 'c', chi: 15, x: 100, y: 288, children: [] },
  d: { id: 'd', chi: 4, x: 260, y: 288, children: [] },
  e: { id: 'e', chi: 9, x: 470, y: 288, children: [] },
}
/** post-order: children before parents */
const POSTORDER = ['c', 'd', 'a', 'e', 'b', 'r']
/** the maximum-weight independent set (verified by hand for this tree) */
const SOLUTION = new Set(['b', 'c', 'd'])

const NODE_R = 26
const NODE_RECTS: ReadonlyArray<NodeRect> = Object.values(NODES).map((n) => ({
  id: n.id,
  x: n.x - NODE_R,
  y: n.y - NODE_R,
  w: NODE_R * 2,
  h: NODE_R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

/**
 * Collision-aware edge routing for this 6-node undirected tree. Center-to-
 * center (no trimming needed — tree edges have no arrowheads). Locks out the
 * «edge through unrelated node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(aId: string, bId: string) {
  const rectA = NODE_RECT_BY_ID.get(aId)!
  const rectB = NODE_RECT_BY_ID.get(bId)!
  return routeEdge(rectA, rectB, NODE_RECTS)
}

export function TreeIndependentSet() {
  const [step, setStep] = useState(0) // 0 intro, 1..6 compute node, 7 reveal set
  const last = POSTORDER.length + 1

  const { A, B } = useMemo(() => {
    const a: Record<string, number> = {}
    const b: Record<string, number> = {}
    for (const id of POSTORDER) {
      const n = NODES[id]
      b[id] = n.children.reduce((s, c) => s + a[c], 0)
      const inVal = n.chi + n.children.reduce((s, c) => s + b[c], 0)
      a[id] = Math.max(b[id], inVal)
    }
    return { A: a, B: b }
  }, [])

  const computedCount = Math.min(step, POSTORDER.length)
  const computed = new Set(POSTORDER.slice(0, computedCount))
  const curId = step >= 1 && step <= POSTORDER.length ? POSTORDER[step - 1] : null
  const done = step === last

  let note: string
  if (step === 0) {
    note =
      'Δέντρο ιεραρχίας — ο αριθμός σε κάθε κορυφή είναι η προσφορά χ(v). Θα υπολογίσουμε A[v] και B[v] από τα φύλλα προς τη ρίζα.'
  } else if (curId) {
    const n = NODES[curId]
    if (n.children.length === 0) {
      note = `Φύλλο ${curId}: B[${curId}] = 0 (το ${curId} έξω). A[${curId}] = χ(${curId}) = ${n.chi}.`
    } else {
      const sumA = n.children.map((c) => `A[${c}]=${A[c]}`).join(' + ')
      const sumB = n.children.map((c) => `B[${c}]=${B[c]}`).join(' + ')
      const inVal = n.chi + n.children.reduce((s, c) => s + B[c], 0)
      note =
        `Κορυφή ${curId}: B[${curId}] = ${sumA} = ${B[curId]}. ` +
        `A[${curId}] = max{ B[${curId}]=${B[curId]}, χ(${curId})+${sumB} = ${n.chi}+${B[curId]} = ${inVal} } = ${A[curId]}.`
    }
  } else {
    note = `Η μέγιστη προσφορά είναι A[r] = ${A.r}. Πέρασμα προς τα κάτω → η βέλτιστη λίστα καλεσμένων: {${[...SOLUTION].sort().join(', ')}}, με συνολική προσφορά ${A.r}.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ανεξάρτητο σύνολο σε δέντρο — από τα φύλλα στη ρίζα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Βέλτιστο: ${A.r}` : step === 0 ? 'Αρχή' : `Κορυφή ${curId}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        A[v] = καλύτερο στο υποδέντρο · B[v] = καλύτερο χωρίς την v.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 620 372"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {Object.values(NODES).flatMap((n) =>
            n.children.map((c) => {
              const g = routedEdge(n.id, c)
              return g.kind === 'line' ? (
                <line
                  key={`${n.id}-${c}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="#9b8a8d"
                  strokeWidth={1.9}
                />
              ) : (
                <path
                  key={`${n.id}-${c}`}
                  d={g.d}
                  fill="none"
                  stroke="#9b8a8d"
                  strokeWidth={1.9}
                />
              )
            }),
          )}
          {/* nodes */}
          {Object.values(NODES).map((n) => {
            const isCur = n.id === curId
            const isChild = curId ? NODES[curId].children.includes(n.id) : false
            const isComputed = computed.has(n.id)
            const inSol = done && SOLUTION.has(n.id)
            const fill = inSol
              ? '#dcfce7'
              : isCur
                ? '#9f1239'
                : isChild
                  ? '#bae6fd'
                  : '#ffffff'
            const stroke = inSol
              ? '#16a34a'
              : isCur
                ? '#7e1031'
                : isChild
                  ? '#0284c7'
                  : '#9b8a8d'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={26}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCur || inSol ? 3 : 2}
                />
                <text
                  x={n.x}
                  y={n.y - 4}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={800}
                  fill={isCur ? '#ffffff' : '#1c1214'}
                >
                  {n.chi}
                </text>
                <text
                  x={n.x}
                  y={n.y + 12}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill={isCur ? '#ffffff' : '#5a4a4d'}
                >
                  {n.id}
                </text>
                {isComputed && (
                  <text
                    x={n.x}
                    y={n.y + 44}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="#9f1239"
                    fontFamily="ui-monospace, monospace"
                  >
                    A={A[n.id]} · B={B[n.id]}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
          disabled={done}
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
