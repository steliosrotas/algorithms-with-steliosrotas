'use client'

/**
 * BinaryHeapAnimator — heapify-up and heapify-down, tree and array in sync.
 *
 * The two things students must feel about a heap: (1) the tree and the
 * backing array are the same object — parent(i) = ⌊i/2⌋ — and (2) a single
 * violation is fixed by one bubble along a root-to-leaf path, O(log n).
 * This viz steps through Insert (bubble up) and ExtractMin (sink down) on
 * a fixed heap, lighting the moving element and its comparison partner in
 * both views at once. Built for L10.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type HeapStep = {
  array: number[]
  active: number | null
  compare: number | null
  removing?: boolean
  note: string
}

const INSERT_STEPS: HeapStep[] = [
  {
    array: [2, 5, 8, 9, 11, 14, 18],
    active: null,
    compare: null,
    note: 'Ένας έγκυρος σωρός 7 στοιχείων — κάθε γονέας ≤ τα παιδιά του. Θα εισάγουμε το 3.',
  },
  {
    array: [2, 5, 8, 9, 11, 14, 18, 3],
    active: 7,
    compare: null,
    note: 'Το 3 μπαίνει στην πρώτη ελεύθερη θέση, H[8] — έτσι το δέντρο μένει ισοσταθμισμένο. Όμως ίσως είναι μικρότερο από τον γονέα του.',
  },
  {
    array: [2, 5, 8, 9, 11, 14, 18, 3],
    active: 7,
    compare: 3,
    note: 'Heapify-up: συγκρίνουμε το 3 με τον γονέα του, H[4] = 9. Είναι 3 < 9 → εναλλαγή.',
  },
  {
    array: [2, 5, 8, 3, 11, 14, 18, 9],
    active: 3,
    compare: 1,
    note: 'Το 3 ανέβηκε. Συγκρίνουμε με τον νέο γονέα, H[2] = 5. Είναι 3 < 5 → εναλλαγή.',
  },
  {
    array: [2, 3, 8, 5, 11, 14, 18, 9],
    active: 1,
    compare: 0,
    note: 'Το 3 ανέβηκε ξανά. Συγκρίνουμε με τη ρίζα, H[1] = 2. Είναι 3 < 2; Όχι → σταματάμε.',
  },
  {
    array: [2, 3, 8, 5, 11, 14, 18, 9],
    active: null,
    compare: null,
    note: 'Ο σωρός αποκαταστάθηκε. Η εισαγωγή κόστισε μία διαδρομή ως τη ρίζα — O(log n).',
  },
]

const EXTRACT_STEPS: HeapStep[] = [
  {
    array: [2, 5, 8, 9, 11, 14, 18],
    active: null,
    compare: null,
    note: 'Ένας έγκυρος σωρός 7 στοιχείων. Θα εξάγουμε το ελάχιστο.',
  },
  {
    array: [2, 5, 8, 9, 11, 14, 18],
    active: 0,
    compare: null,
    removing: true,
    note: 'Το ελάχιστο είναι πάντα η ρίζα: H[1] = 2. Αυτό επιστρέφεται — αλλά αφήνει μια «τρύπα» στην κορυφή.',
  },
  {
    array: [18, 5, 8, 9, 11, 14],
    active: 0,
    compare: null,
    note: 'Φέρνουμε το τελευταίο στοιχείο, το 18, στη ρίζα. Το σχήμα μένει ισοσταθμισμένο — αλλά το 18 είναι πολύ μεγάλο για εκεί πάνω.',
  },
  {
    array: [18, 5, 8, 9, 11, 14],
    active: 0,
    compare: 1,
    note: 'Heapify-down: συγκρίνουμε το 18 με το ΜΙΚΡΟΤΕΡΟ από τα παιδιά του — το 5 (μικρότερο από το 8). Είναι 18 > 5 → εναλλαγή.',
  },
  {
    array: [5, 18, 8, 9, 11, 14],
    active: 1,
    compare: 3,
    note: 'Το 18 κατέβηκε. Νέα παιδιά: 9 και 11. Μικρότερο = 9. Είναι 18 > 9 → εναλλαγή.',
  },
  {
    array: [5, 9, 8, 18, 11, 14],
    active: 3,
    compare: null,
    note: 'Το 18 κατέβηκε ξανά — και τώρα δεν έχει παιδιά. Σταματάμε.',
  },
  {
    array: [5, 9, 8, 18, 11, 14],
    active: null,
    compare: null,
    note: 'Ο σωρός αποκαταστάθηκε. Επιστράφηκε το ελάχιστο, 2 — η εξαγωγή κόστισε O(log n).',
  },
]

/** Position of array index i (0-based) in the heap tree layout. */
function nodePos(i: number) {
  const level = Math.floor(Math.log2(i + 1))
  const slots = 2 ** level
  const slot = i + 1 - slots
  return {
    x: 28 + ((slot + 0.5) * 484) / slots,
    y: 42 + level * 74,
  }
}

const NODE_R = 19

export function BinaryHeapAnimator() {
  const [mode, setMode] = useState<'insert' | 'extract'>('insert')
  const [step, setStep] = useState(0)

  const steps = mode === 'insert' ? INSERT_STEPS : EXTRACT_STEPS
  const last = steps.length - 1
  const cur = steps[step]
  const n = cur.array.length

  const { rects: nodeRects, rectById: nodeRectById } = useMemo(() => {
    const rects: NodeRect[] = []
    const byId = new Map<number, NodeRect>()
    for (let i = 0; i < n; i++) {
      const p = nodePos(i)
      const r: NodeRect = {
        id: i,
        x: p.x - NODE_R,
        y: p.y - NODE_R,
        w: 2 * NODE_R,
        h: 2 * NODE_R,
      }
      rects.push(r)
      byId.set(i, r)
    }
    return { rects, rectById: byId }
  }, [n])

  /** Routed parent→child edge geometry, center-to-center (heap tree edges
   *  have no arrowhead, so no asymmetric trim). */
  const routedEdge = (parentI: number, childI: number) => {
    const pR = nodeRectById.get(parentI)!
    const cR = nodeRectById.get(childI)!
    return routeEdge(pR, cR, nodeRects)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + mode toggle */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Σωρός βήμα-βήμα — δέντρο και πίνακας συγχρονισμένα
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['insert', 'extract'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key)
                setStep(0)
              }}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                mode === key ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {key === 'insert' ? 'Insert (heapify-up)' : 'ExtractMin (heapify-down)'}
            </button>
          ))}
        </div>
      </div>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 540 392"
          className="mx-auto block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* tree edges */}
          {cur.array.map((_, i) => {
            const kids = [2 * i + 1, 2 * i + 2].filter((k) => k < n)
            return kids.map((k) => {
              const g = routedEdge(i, k)
              return g.kind === 'line' ? (
                <line
                  key={`e${i}-${k}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="#9b8a8d"
                  strokeWidth={1.8}
                />
              ) : (
                <path
                  key={`e${i}-${k}`}
                  d={g.d}
                  fill="none"
                  stroke="#9b8a8d"
                  strokeWidth={1.8}
                />
              )
            })
          })}

          {/* tree nodes */}
          {cur.array.map((v, i) => {
            const p = nodePos(i)
            const isActive = i === cur.active
            const isCompare = i === cur.compare
            const removing = isActive && cur.removing
            const fill = removing
              ? '#fee2e2'
              : isActive
                ? '#9f1239'
                : isCompare
                  ? '#fef3c7'
                  : '#ffffff'
            const stroke = removing
              ? '#dc2626'
              : isActive
                ? '#7e1031'
                : isCompare
                  ? '#d97706'
                  : '#9b8a8d'
            return (
              <g key={`n${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={19}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                  strokeDasharray={removing ? '4 3' : undefined}
                />
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={700}
                  fill={isActive && !removing ? '#ffffff' : '#1c1214'}
                >
                  {v}
                </text>
              </g>
            )
          })}

          {/* array */}
          {cur.array.map((v, i) => {
            const x = (540 - n * 50) / 2 + i * 50
            const isActive = i === cur.active
            const isCompare = i === cur.compare
            const removing = isActive && cur.removing
            return (
              <g key={`a${i}`}>
                <rect
                  x={x}
                  y={318}
                  width={46}
                  height={38}
                  rx={4}
                  fill={
                    removing
                      ? '#fee2e2'
                      : isActive
                        ? '#9f1239'
                        : isCompare
                          ? '#fef3c7'
                          : '#faf4ee'
                  }
                  stroke={
                    removing
                      ? '#dc2626'
                      : isActive
                        ? '#7e1031'
                        : isCompare
                          ? '#d97706'
                          : '#cdbfc0'
                  }
                  strokeWidth={1.8}
                  strokeDasharray={removing ? '4 3' : undefined}
                />
                <text
                  x={x + 23}
                  y={337}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fontWeight={700}
                  fill={isActive && !removing ? '#ffffff' : '#1c1214'}
                >
                  {v}
                </text>
                <text
                  x={x + 23}
                  y={372}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill="#9b8a8d"
                >
                  H[{i + 1}]
                </text>
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
        {cur.note}
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
