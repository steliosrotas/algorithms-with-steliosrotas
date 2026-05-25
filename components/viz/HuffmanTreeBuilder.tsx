'use client'

/**
 * HuffmanTreeBuilder — the greedy merge, step by step.
 *
 * Each step takes the two lowest-frequency trees from the pool and merges
 * them under a new internal node. The tree assembles bottom-up; the pool
 * row below shrinks as it goes. When one tree remains, the prefix codes
 * appear — short for frequent characters, long for rare ones.
 *
 * Built originally for L13 on the lecture's a/b/c/d/e/f instance. The
 * `instance` prop now also drives the front-set-6-ask7 «ΚΑΣΤΑΝΑΣ» problem
 * (A/N/T/K/Σ frequencies).
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type HNode = {
  id: string
  freq: number
  x: number
  y: number
  char?: string
  code?: string
}

type Merge = { id: string; a: string; b: string }
type PoolItem = { freq: number; char?: string }

export type HuffmanInstance = 'lecture' | 'kastanas'

type InstanceData = {
  title: string
  subtitle: string
  freqFormat: (n: number) => string
  introNote: string
  /** vertical extent of the tree's SVG viewBox */
  viewHeight: number
  nodes: Record<string, HNode>
  /** merges in algorithm order; `a` is the 0/left child, `b` the 1/right */
  merges: Merge[]
  leaves: string[]
  /** pool snapshot after k merges, ascending */
  pool: PoolItem[][]
}

const LECTURE_DATA: InstanceData = {
  title: 'Huffman βήμα-βήμα — συγχώνευσε τα δύο σπανιότερα',
  subtitle:
    'Το δέντρο χτίζεται από κάτω προς τα πάνω· οι κωδικοί εμφανίζονται στο τέλος.',
  freqFormat: (n) => String(n),
  introNote:
    'Έξι χαρακτήρες με τις συχνότητές τους. Ο αλγόριθμος συγχωνεύει επανειλημμένα τα δύο σπανιότερα δέντρα του pool. Πρώτο ζευγάρι: f (5) και e (9).',
  viewHeight: 396,
  nodes: {
    a: { id: 'a', freq: 45, x: 60, y: 118, char: 'a', code: '0' },
    c: { id: 'c', freq: 12, x: 148, y: 266, char: 'c', code: '100' },
    b: { id: 'b', freq: 13, x: 236, y: 266, char: 'b', code: '101' },
    f: { id: 'f', freq: 5, x: 324, y: 340, char: 'f', code: '1100' },
    e: { id: 'e', freq: 9, x: 412, y: 340, char: 'e', code: '1101' },
    d: { id: 'd', freq: 16, x: 500, y: 266, char: 'd', code: '111' },
    n14: { id: 'n14', freq: 14, x: 368, y: 266 },
    n25: { id: 'n25', freq: 25, x: 192, y: 192 },
    n30: { id: 'n30', freq: 30, x: 434, y: 192 },
    n55: { id: 'n55', freq: 55, x: 313, y: 118 },
    root: { id: 'root', freq: 100, x: 187, y: 44 },
  },
  merges: [
    { id: 'n14', a: 'f', b: 'e' },
    { id: 'n25', a: 'c', b: 'b' },
    { id: 'n30', a: 'n14', b: 'd' },
    { id: 'n55', a: 'n25', b: 'n30' },
    { id: 'root', a: 'a', b: 'n55' },
  ],
  leaves: ['a', 'b', 'c', 'd', 'e', 'f'],
  pool: [
    [
      { freq: 5, char: 'f' },
      { freq: 9, char: 'e' },
      { freq: 12, char: 'c' },
      { freq: 13, char: 'b' },
      { freq: 16, char: 'd' },
      { freq: 45, char: 'a' },
    ],
    [
      { freq: 12, char: 'c' },
      { freq: 13, char: 'b' },
      { freq: 14 },
      { freq: 16, char: 'd' },
      { freq: 45, char: 'a' },
    ],
    [{ freq: 14 }, { freq: 16, char: 'd' }, { freq: 25 }, { freq: 45, char: 'a' }],
    [{ freq: 25 }, { freq: 30 }, { freq: 45, char: 'a' }],
    [{ freq: 45, char: 'a' }, { freq: 55 }],
    [{ freq: 100 }],
  ],
}

/* ─────────────────────── ΚΑΣΤΑΝΑΣ — front-set-6-ask7 ─────────────────── */
/*
 *           root (1.00)
 *           /        \
 *        0.44       0.56
 *        /  \       /   \
 *       T    N   0.25    A
 *     .20  .24   / \    .31
 *               Σ   K
 *              .10 .15
 *
 * Codes: T=00, N=01, Σ=100, K=101, A=11.
 * (Frequencies displayed with comma as decimal: «0,10».)
 */
const KASTANAS_DATA: InstanceData = {
  title: 'Huffman για το «ΚΑΣΤΑΝΑΣ» — A, N, T, K, Σ',
  subtitle:
    'Τέσσερις συγχωνεύσεις (n−1 = 4) και το δέντρο είναι έτοιμο· οι κωδικοί εμφανίζονται στο τέλος.',
  freqFormat: (n) => `0,${String(Math.round(n * 100)).padStart(2, '0')}`,
  introNote:
    'Πέντε χαρακτήρες με τις συχνότητες (πιθανότητες) τους. Πρώτο ζευγάρι: Σ (0,10) και K (0,15) — οι δύο σπανιότεροι.',
  viewHeight: 320,
  nodes: {
    sigma: { id: 'sigma', freq: 0.1, x: 240, y: 256, char: 'Σ', code: '100' },
    K: { id: 'K', freq: 0.15, x: 380, y: 256, char: 'K', code: '101' },
    T: { id: 'T', freq: 0.2, x: 60, y: 184, char: 'T', code: '00' },
    N: { id: 'N', freq: 0.24, x: 220, y: 184, char: 'N', code: '01' },
    A: { id: 'A', freq: 0.31, x: 470, y: 110, char: 'A', code: '11' },
    n025: { id: 'n025', freq: 0.25, x: 310, y: 184 },
    n044: { id: 'n044', freq: 0.44, x: 140, y: 110 },
    n056: { id: 'n056', freq: 0.56, x: 390, y: 38 },
    root: { id: 'root', freq: 1.0, x: 265, y: 38 },
  },
  merges: [
    { id: 'n025', a: 'sigma', b: 'K' },
    { id: 'n044', a: 'T', b: 'N' },
    { id: 'n056', a: 'n025', b: 'A' },
    { id: 'root', a: 'n044', b: 'n056' },
  ],
  leaves: ['sigma', 'K', 'T', 'N', 'A'],
  pool: [
    [
      { freq: 0.1, char: 'Σ' },
      { freq: 0.15, char: 'K' },
      { freq: 0.2, char: 'T' },
      { freq: 0.24, char: 'N' },
      { freq: 0.31, char: 'A' },
    ],
    [
      { freq: 0.2, char: 'T' },
      { freq: 0.24, char: 'N' },
      { freq: 0.25 },
      { freq: 0.31, char: 'A' },
    ],
    [{ freq: 0.25 }, { freq: 0.31, char: 'A' }, { freq: 0.44 }],
    [{ freq: 0.44 }, { freq: 0.56 }],
    [{ freq: 1.0 }],
  ],
}

const INSTANCES: Record<HuffmanInstance, InstanceData> = {
  lecture: LECTURE_DATA,
  kastanas: KASTANAS_DATA,
}

export function HuffmanTreeBuilder({ instance = 'lecture' }: { instance?: HuffmanInstance } = {}) {
  const data = INSTANCES[instance]
  const [step, setStep] = useState(0)
  const last = data.merges.length
  const done = step === last

  const describe = (id: string) => {
    const n = data.nodes[id]
    return n.char
      ? `${n.char} (${data.freqFormat(n.freq)})`
      : `υποδέντρο ${data.freqFormat(n.freq)}`
  }

  const mergeIndex = useMemo(
    () => new Map(data.merges.map((m, i) => [m.id, i])),
    [data],
  )
  const visible = (id: string) =>
    data.leaves.includes(id) || (mergeIndex.get(id) ?? Infinity) < step
  const cur = step > 0 ? data.merges[step - 1] : null
  const hot = new Set(cur ? [cur.id, cur.a, cur.b] : [])

  const { rects: nodeRects, rectById: nodeRectById } = useMemo(() => {
    const rects: NodeRect[] = []
    const byId = new Map<string, NodeRect>()
    for (const n of Object.values(data.nodes)) {
      const isLeaf = data.leaves.includes(n.id)
      const isPresent = isLeaf || (mergeIndex.get(n.id) ?? Infinity) < step
      if (!isPresent) continue
      const r = isLeaf ? 23 : 20
      const rect: NodeRect = {
        id: n.id,
        x: n.x - r,
        y: n.y - r,
        w: 2 * r,
        h: 2 * r,
      }
      rects.push(rect)
      byId.set(n.id, rect)
    }
    return { rects, rectById: byId }
  }, [data, mergeIndex, step])

  /** Routed parent→child edge, center-to-center (Huffman edges have no
   *  arrowhead). Returns the midpoint anchor for the bit label. */
  const routedEdge = (parent: HNode, child: HNode) => {
    const pR = nodeRectById.get(parent.id)!
    const cR = nodeRectById.get(child.id)!
    const g = routeEdge(pR, cR, nodeRects)
    const mx =
      g.kind === 'line' ? (parent.x + child.x) / 2 : (parent.x + child.x + 2 * g.cx) / 4
    const my =
      g.kind === 'line' ? (parent.y + child.y) / 2 : (parent.y + child.y + 2 * g.cy) / 4
    return { g, mx, my }
  }

  let note: string
  if (step === 0) {
    note = data.introNote
  } else {
    const m = cur as Merge
    note =
      `Συγχώνευση ${step}: ενώνουμε ${describe(m.a)} και ${describe(m.b)} κάτω από νέο κόμβο συχνότητας ${data.freqFormat(data.nodes[m.id].freq)}. ` +
      (done
        ? 'Έμεινε ένα δέντρο — η κωδικοποίηση Huffman είναι έτοιμη.'
        : 'Επόμενο: τα δύο σπανιότερα δέντρα που μένουν στο pool.')
  }

  const pool = data.pool[step]
  const viewWidth = 560
  const viewHeight = data.viewHeight

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">{data.title}</div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? 'Έτοιμο' : `Συγχώνευση ${step}/${last}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">{data.subtitle}</p>

      {/* the tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {data.merges.map((m, i) => {
            if (i >= step) return null
            const parent = data.nodes[m.id]
            return [m.a, m.b].map((childId, ci) => {
              const child = data.nodes[childId]
              const { g, mx, my } = routedEdge(parent, child)
              const stroke = hot.has(m.id) ? '#9f1239' : '#9b8a8d'
              const strokeWidth = hot.has(m.id) ? 3 : 1.8
              return (
                <g key={`${m.id}-${childId}`}>
                  {g.kind === 'line' ? (
                    <line
                      x1={g.x1}
                      y1={g.y1}
                      x2={g.x2}
                      y2={g.y2}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  ) : (
                    <path d={g.d} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
                  )}
                  <text
                    x={mx}
                    y={my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={800}
                    fill="#9f1239"
                  >
                    {ci === 0 ? '0' : '1'}
                  </text>
                </g>
              )
            })
          })}

          {/* nodes */}
          {Object.values(data.nodes).map((n) => {
            if (!visible(n.id)) return null
            const isLeaf = !!n.char
            const isHot = hot.has(n.id)
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isLeaf ? 23 : 20}
                  fill={isLeaf ? '#fde2e4' : isHot ? '#9f1239' : '#ffffff'}
                  stroke={isHot ? '#7e1031' : isLeaf ? '#e0607a' : '#9b8a8d'}
                  strokeWidth={isHot ? 3 : 2}
                />
                {isLeaf ? (
                  <>
                    <text
                      x={n.x}
                      y={n.y - 5}
                      textAnchor="middle"
                      fontSize={15}
                      fontWeight={800}
                      fill="#1c1214"
                    >
                      {n.char}
                    </text>
                    <text
                      x={n.x}
                      y={n.y + 10}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={600}
                      fill="#5a4a4d"
                    >
                      {data.freqFormat(n.freq)}
                    </text>
                  </>
                ) : (
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={700}
                    fill={isHot ? '#ffffff' : '#1c1214'}
                  >
                    {data.freqFormat(n.freq)}
                  </text>
                )}
                {/* code, once the tree is complete */}
                {isLeaf && done && (
                  <text
                    x={n.x}
                    y={n.y + 40}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="#9f1239"
                    fontFamily="ui-monospace, monospace"
                  >
                    {n.code}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* the pool */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Pool — δέντρα προς συγχώνευση {!done && '(τα δύο μικρότερα = επόμενο ζευγάρι)'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pool.map((p, i) => {
            const next = !done && i < 2
            return (
              <div
                key={i}
                className={cn(
                  'flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-2 font-mono text-sm',
                  next
                    ? 'border-amber-500 bg-amber-500/15 font-bold text-fg'
                    : 'border-border bg-bg-elevated text-fg-muted',
                )}
              >
                {p.char && <span className="font-bold not-italic">{p.char}</span>}
                <span>{data.freqFormat(p.freq)}</span>
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
