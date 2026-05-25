'use client'

/**
 * TreeMatchingPeel — greedy O(n) perfect matching on a tree by leaf peeling.
 *
 * The algorithm has one rule: pick a leaf, pair it with its parent, remove
 * both, repeat. Visually that's «πέτα τις άκρες προς τα μέσα» — the tree
 * shrinks from the outside in. The viz makes two things click:
 *
 *  - on a matching-friendly tree the peeling closes cleanly, recovering
 *    {1-2, 3-5, 4-6};
 *  - on the «τρία αδέλφια» tree the peeling lands at vertices 4 and 5
 *    isolated — a leaf's parent has been consumed, and there's no edge
 *    left to cover them. That's the «δεν υπάρχει τέλειο ταίριασμα»
 *    verdict, made physical instead of stated.
 *
 * Two tabs over two hand-picked 6-vertex trees. Built for pt3-th3.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type Vertex = { id: number; x: number; y: number }
type Edge = [number, number]

type StepKind = 'init' | 'match' | 'fail' | 'done'

type Step = {
  kind: StepKind
  /** vertices removed at the end of this step */
  removed: number[]
  /** matching edges accumulated through this step */
  matched: Edge[]
  /** vertex chosen as «leaf» this step (undefined for init/done) */
  pickedLeaf?: number
  /** vertices that become isolated and trigger fail */
  isolated?: number[]
  note: string
}

type Tree = {
  vertices: Vertex[]
  edges: Edge[]
  title: string
  intro: string
  width: number
  height: number
  /** the precomputed steps */
  steps: Step[]
  /** has perfect matching? */
  ok: boolean
}

/* ─────────────────────── instance A — succeeds ─────────────────────── */
/*
 *      1
 *      |
 *      2
 *     / \
 *    3   4
 *    |   |
 *    5   6
 */
const TREE_OK: Tree = {
  title: 'Δέντρο που έχει τέλειο ταίριασμα',
  intro:
    '6 κορυφές, 5 ακμές. Η άπληστη μέθοδος ξεκινά από τα φύλλα 1, 5, 6 και κλείνει τρία ζευγάρια.',
  width: 360,
  height: 290,
  vertices: [
    { id: 1, x: 180, y: 40 },
    { id: 2, x: 180, y: 110 },
    { id: 3, x: 120, y: 180 },
    { id: 4, x: 240, y: 180 },
    { id: 5, x: 120, y: 250 },
    { id: 6, x: 240, y: 250 },
  ],
  edges: [
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 6],
  ],
  ok: true,
  steps: [
    {
      kind: 'init',
      removed: [],
      matched: [],
      note: 'Αρχικά. Φύλλα (κορυφές βαθμού 1): {1, 5, 6}. Διαλέγουμε ένα οποιοδήποτε — εδώ το 1.',
    },
    {
      kind: 'match',
      removed: [1, 2],
      matched: [[1, 2]],
      pickedLeaf: 1,
      note: 'Φύλλο 1 → υποχρεωτικό ταίριασμα 1-2. Σβήνουμε και τις δύο κορυφές. Νέα φύλλα στο υπόλοιπο δάσος: {3, 4, 5, 6} — η αφαίρεση του 2 έκοψε τους γονείς 3 και 4 από επάνω, οπότε κι αυτοί γίνονται φύλλα.',
    },
    {
      kind: 'match',
      removed: [1, 2, 5, 3],
      matched: [
        [1, 2],
        [3, 5],
      ],
      pickedLeaf: 5,
      note: 'Φύλλο 5 → ταίριασμα 3-5. Μένει μόνο η ακμή 4-6.',
    },
    {
      kind: 'done',
      removed: [1, 2, 3, 4, 5, 6],
      matched: [
        [1, 2],
        [3, 5],
        [4, 6],
      ],
      pickedLeaf: 6,
      note: 'Φύλλο 6 → ταίριασμα 4-6. Έμεινε άδειο δάσος ⇒ ΥΠΑΡΧΕΙ τέλειο ταίριασμα: {1-2, 3-5, 4-6}. ✓',
    },
  ],
}

/* ─────────────────────── instance B — fails ────────────────────────── */
/*
 *      1
 *      |
 *      2
 *     /|\
 *    3 4 5
 *    |
 *    6
 */
const TREE_FAIL: Tree = {
  title: 'Δέντρο χωρίς τέλειο ταίριασμα',
  intro:
    '6 κορυφές, 5 ακμές — αλλά τρία παιδιά του 2 (4, 5 και μέσω 3 το 6) δεν χωράνε σε ζευγάρια. Η άπληστη μέθοδος το ανακαλύπτει σε λίγα βήματα.',
  width: 360,
  height: 290,
  vertices: [
    { id: 1, x: 180, y: 40 },
    { id: 2, x: 180, y: 110 },
    { id: 3, x: 110, y: 180 },
    { id: 4, x: 180, y: 180 },
    { id: 5, x: 250, y: 180 },
    { id: 6, x: 110, y: 250 },
  ],
  edges: [
    [1, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 6],
  ],
  ok: false,
  steps: [
    {
      kind: 'init',
      removed: [],
      matched: [],
      note: 'Αρχικά. Φύλλα: {1, 4, 5, 6}. Διαλέγουμε ένα — εδώ το 6 (το βαθύτερο).',
    },
    {
      kind: 'match',
      removed: [3, 6],
      matched: [[3, 6]],
      pickedLeaf: 6,
      note: 'Φύλλο 6 → ταίριασμα 3-6. Σβήνουμε 3 και 6. Νέα φύλλα: {1, 4, 5} — όλα μονοβαθμικά γείτονες του 2.',
    },
    {
      kind: 'match',
      removed: [1, 2, 3, 6],
      matched: [
        [3, 6],
        [1, 2],
      ],
      pickedLeaf: 1,
      note: 'Φύλλο 1 → ταίριασμα 1-2. Σβήνουμε 1 και 2. Αλλά τώρα το 2 (που ήταν ο μοναδικός γείτονας του 4 και του 5) εξαφανίστηκε.',
    },
    {
      kind: 'fail',
      removed: [1, 2, 3, 6],
      matched: [
        [3, 6],
        [1, 2],
      ],
      isolated: [4, 5],
      note: 'Οι 4 και 5 είναι ΑΠΟΜΟΝΩΜΕΝΕΣ — δεν υπάρχει καμία ακμή να τις καλύψει. ΔΕΝ υπάρχει τέλειο ταίριασμα. ✗',
    },
  ],
}

const INSTANCES = { ok: TREE_OK, fail: TREE_FAIL } as const

type InstanceKey = keyof typeof INSTANCES

const TMP_NODE_R = 14

export function TreeMatchingPeel() {
  const [tab, setTab] = useState<InstanceKey>('ok')
  const tree = INSTANCES[tab]
  const [step, setStep] = useState(0)

  // reset step when tab changes
  const last = tree.steps.length - 1
  const current = tree.steps[Math.min(step, last)]

  const removed = useMemo(() => new Set(current.removed), [current.removed])
  const matchedKeys = useMemo(
    () => new Set(current.matched.map(([u, v]) => `${Math.min(u, v)}-${Math.max(u, v)}`)),
    [current.matched],
  )

  const { rects: nodeRects, rectById: nodeRectById } = useMemo(() => {
    const rects: NodeRect[] = []
    const byId = new Map<number, NodeRect>()
    for (const v of tree.vertices) {
      const r: NodeRect = {
        id: v.id,
        x: v.x - TMP_NODE_R,
        y: v.y - TMP_NODE_R,
        w: 2 * TMP_NODE_R,
        h: 2 * TMP_NODE_R,
      }
      rects.push(r)
      byId.set(v.id, r)
    }
    return { rects, rectById: byId }
  }, [tree])

  /** Routed undirected edge, center-to-center (no arrowheads). */
  const routedEdge = (u: number, v: number) => {
    const aR = nodeRectById.get(u)!
    const bR = nodeRectById.get(v)!
    return routeEdge(aR, bR, nodeRects)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Φύλλο-φύλλο: άπληστο τέλειο ταίριασμα σε δέντρο
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            current.kind === 'done' && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
            current.kind === 'fail' && 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
            (current.kind === 'init' || current.kind === 'match') &&
              'bg-accent/10 text-accent',
          )}
        >
          {current.kind === 'done'
            ? 'Υπάρχει ταίριασμα'
            : current.kind === 'fail'
              ? 'Αποτυχία'
              : `Βήμα ${step}/${last}`}
        </span>
      </div>

      {/* tabs */}
      <div className="mb-3 flex gap-1.5">
        {(Object.keys(INSTANCES) as InstanceKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setTab(k)
              setStep(0)
            }}
            className={cn(
              'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
              tab === k
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-soft text-fg-muted hover:bg-bg-soft/70',
            )}
          >
            {INSTANCES[k].title}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs text-fg-subtle">{tree.intro}</p>

      <div className="grid gap-4 md:grid-cols-[1fr,1fr]">
        {/* tree SVG */}
        <div className="graph-canvas overflow-x-auto">
          <svg
            viewBox={`0 0 ${tree.width} ${tree.height}`}
            className="mx-auto block w-full max-w-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* edges */}
            {tree.edges.map(([u, v]) => {
              const key = `${Math.min(u, v)}-${Math.max(u, v)}`
              const isMatched = matchedKeys.has(key)
              const isDead = removed.has(u) || removed.has(v)
              const isCandidate =
                current.pickedLeaf !== undefined &&
                (current.pickedLeaf === u || current.pickedLeaf === v) &&
                current.kind === 'match' &&
                isMatched
              const g = routedEdge(u, v)
              const stroke = isMatched ? '#059669' : isDead ? '#e5d6d7' : '#9b8a8d'
              const strokeWidth = isCandidate ? 4 : isMatched ? 3.5 : 2
              const strokeOpacity = isDead && !isMatched ? 0.35 : 1
              return g.kind === 'line' ? (
                <line
                  key={key}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                />
              ) : (
                <path
                  key={key}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                />
              )
            })}

            {/* vertices */}
            {tree.vertices.map((v) => {
              const isRemoved = removed.has(v.id)
              const isIsolated = current.isolated?.includes(v.id) ?? false
              const isPicked = current.pickedLeaf === v.id && current.kind === 'match'
              return (
                <g key={v.id}>
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={14}
                    fill={
                      isIsolated
                        ? '#fecdd3'
                        : isPicked
                          ? '#fef3c7'
                          : isRemoved
                            ? '#f5ebec'
                            : '#ffffff'
                    }
                    stroke={
                      isIsolated
                        ? '#be123c'
                        : isPicked
                          ? '#d97706'
                          : isRemoved
                            ? '#d4c2c4'
                            : '#5a4a4d'
                    }
                    strokeWidth={isIsolated || isPicked ? 3 : 2}
                    strokeDasharray={isRemoved && !isIsolated ? '3 3' : undefined}
                  />
                  <text
                    x={v.x}
                    y={v.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={800}
                    fill={
                      isIsolated
                        ? '#9f1239'
                        : isRemoved && !isIsolated
                          ? '#a89798'
                          : '#1c1214'
                    }
                  >
                    {v.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* matching ledger + leaves */}
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Ταίριασμα ώς τώρα
            </div>
            {current.matched.length === 0 ? (
              <p className="text-xs text-fg-muted">(κενό)</p>
            ) : (
              <ul className="flex flex-wrap gap-1.5">
                {current.matched.map(([u, v]) => (
                  <li
                    key={`${u}-${v}`}
                    className="inline-flex items-center rounded-md border border-emerald-500/60 bg-emerald-500/15 px-2 py-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300"
                  >
                    {u}–{v}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Κορυφές που έχουν φύγει
            </div>
            <p className="text-xs text-fg-muted">
              {current.removed.length === 0
                ? '(καμία)'
                : [...current.removed]
                    .sort((a, b) => a - b)
                    .join(', ')}
            </p>
          </div>

          {current.kind === 'fail' && (
            <div className="rounded-lg border border-rose-500/60 bg-rose-500/10 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                Απομονωμένες κορυφές
              </div>
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                {current.isolated?.join(', ')} — αδύνατο να καλυφθούν.
              </p>
            </div>
          )}
          {current.kind === 'done' && (
            <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Επιβεβαίωση
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                3 ζευγάρια, 6 κορυφές καλυμμένες, καμία ακμή πέρα από το ταίριασμα.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {current.note}
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
          disabled={step >= last}
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
