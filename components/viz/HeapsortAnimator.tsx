'use client'

/**
 * HeapsortAnimator — sorting that falls out of a priority queue for free (L10).
 *
 * Heapsort is two phases: build a heap from the n input numbers, then call
 * ExtractMin n times. Because every ExtractMin hands back the current
 * minimum, the numbers leave the heap already in sorted order — no extra
 * idea required. This viz makes that visible: the heap fills up during the
 * build phase, then drains element by element into a sorted output strip.
 * The student watches an unsorted list become sorted, and sees exactly why
 * the cost is n·O(log n). Built for L10.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

const INPUT = [7, 2, 9, 4, 11, 5]

/** insert v into a min-heap (array form), bubbling up */
function heapInsert(h: number[], v: number): number[] {
  const a = [...h, v]
  let i = a.length - 1
  while (i > 0) {
    const p = (i - 1) >> 1
    if (a[i] < a[p]) {
      ;[a[i], a[p]] = [a[p], a[i]]
      i = p
    } else break
  }
  return a
}

/** pop the minimum, sinking the last leaf down from the root */
function heapExtractMin(h: number[]): { min: number; heap: number[] } {
  const a = [...h]
  const min = a[0]
  const last = a.pop()!
  if (a.length > 0) {
    a[0] = last
    let i = 0
    const n = a.length
    for (;;) {
      const l = 2 * i + 1
      const r = 2 * i + 2
      let s = i
      if (l < n && a[l] < a[s]) s = l
      if (r < n && a[r] < a[s]) s = r
      if (s === i) break
      ;[a[i], a[s]] = [a[s], a[i]]
      i = s
    }
  }
  return { min, heap: a }
}

type Phase = 'init' | 'build' | 'extract' | 'done'
type SortStep = {
  heap: number[]
  output: number[]
  phase: Phase
  hot: number | null
  note: string
}

function buildSteps(): SortStep[] {
  const steps: SortStep[] = []
  let heap: number[] = []
  steps.push({
    heap: [],
    output: [],
    phase: 'init',
    hot: null,
    note: `Δίνονται 6 αριθμοί: ${INPUT.join(', ')}. Το Heapsort τους ταξινομεί σε δύο φάσεις — πρώτα χτίζει έναν σωρό, μετά τον αδειάζει.`,
  })
  INPUT.forEach((v, k) => {
    heap = heapInsert(heap, v)
    const done = k === INPUT.length - 1
    steps.push({
      heap: [...heap],
      output: [],
      phase: 'build',
      hot: v,
      note: done
        ? `Φάση Α ολοκληρώθηκε — και τα 6 στοιχεία μπήκαν στον σωρό. Η ρίζα H[1] = ${heap[0]} κρατά το ελάχιστο: είμαστε έτοιμοι να τον αδειάσουμε.`
        : `Φάση Α (χτίσιμο σωρού): εισάγουμε το ${v}. Το Heapify-up το σπρώχνει στη θέση του. Ο σωρός έχει τώρα ${heap.length} στοιχεία.`,
    })
  })
  const output: number[] = []
  const total = heap.length
  for (let k = 0; k < total; k++) {
    const res = heapExtractMin(heap)
    heap = res.heap
    output.push(res.min)
    const done = heap.length === 0
    steps.push({
      heap: [...heap],
      output: [...output],
      phase: done ? 'done' : 'extract',
      hot: null,
      note: done
        ? `Ο σωρός άδειασε. Η έξοδος ${output.join(', ')} βγήκε ταξινομημένη — χωρίς να κάνουμε τίποτα παραπάνω. 6 εισαγωγές + 6 εξαγωγές, καθεμία O(log n) → συνολικά O(n log n).`
        : `Φάση Β (εξαγωγή): το ExtractMin βγάζει το ${res.min} — το τρέχον ελάχιστο — στο επόμενο κενό της εξόδου. Το τελευταίο φύλλο ανεβαίνει στη ρίζα και βυθίζεται με Heapify-down.`,
    })
  }
  return steps
}

/** tree position of a 0-based heap index */
function nodePos(i: number) {
  const lvl = Math.floor(Math.log2(i + 1))
  const slots = 2 ** lvl
  const slot = i + 1 - slots
  return {
    x: 32 + ((slot + 0.5) * 360) / slots,
    y: 40 + lvl * 70,
  }
}

const NODE_R = 18

export function HeapsortAnimator() {
  const steps = useMemo(buildSteps, [])
  const last = steps.length - 1
  const [step, setStep] = useState(0)
  const cur = steps[step]
  const n = cur.heap.length

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

  /** Routed child→parent edge, center-to-center (no arrowheads). */
  const routedEdge = (childI: number, parentI: number) => {
    const cR = nodeRectById.get(childI)!
    const pR = nodeRectById.get(parentI)!
    return routeEdge(cR, pR, nodeRects)
  }

  const phaseLabel =
    cur.phase === 'init'
      ? 'Έτοιμοι'
      : cur.phase === 'build'
        ? 'Φάση Α — χτίσιμο'
        : cur.phase === 'extract'
          ? 'Φάση Β — εξαγωγή'
          : 'Ολοκληρώθηκε'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Heapsort — ο σωρός γεμίζει, μετά αδειάζει ταξινομημένος
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {phaseLabel}
        </span>
      </div>

      {/* heap */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 424 292"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {n === 0 ? (
            <text
              x={212}
              y={130}
              textAnchor="middle"
              fontSize={14}
              fontWeight={600}
              fill="#9b8a8d"
            >
              (ο σωρός είναι άδειος)
            </text>
          ) : (
            <>
              {/* edges */}
              {cur.heap.map((_, i) => {
                if (i === 0) return null
                const g = routedEdge(i, (i - 1) >> 1)
                return g.kind === 'line' ? (
                  <line
                    key={`e${i}`}
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke="#c9bcbe"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    key={`e${i}`}
                    d={g.d}
                    fill="none"
                    stroke="#c9bcbe"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                )
              })}
              {/* nodes */}
              {cur.heap.map((v, i) => {
                const p = nodePos(i)
                const isHot = v === cur.hot
                const isRoot = i === 0
                const fill = isHot ? '#9f1239' : isRoot ? '#fde68a' : '#ffffff'
                const stroke = isHot ? '#7e1031' : isRoot ? '#d97706' : '#9b8a8d'
                return (
                  <g key={`n${i}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={18}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={2.5}
                    />
                    <text
                      x={p.x}
                      y={p.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={14}
                      fontWeight={700}
                      fill={isHot ? '#ffffff' : '#1c1214'}
                    >
                      {v}
                    </text>
                  </g>
                )
              })}
              {/* heap array */}
              {cur.heap.map((v, i) => {
                const x = (424 - n * 40) / 2 + i * 40
                const isHot = v === cur.hot
                const isRoot = i === 0
                return (
                  <g key={`a${i}`}>
                    <rect
                      x={x}
                      y={238}
                      width={36}
                      height={32}
                      rx={4}
                      fill={isHot ? '#9f1239' : isRoot ? '#fef3c7' : '#faf4ee'}
                      stroke={isHot ? '#7e1031' : isRoot ? '#d97706' : '#cdbfc0'}
                      strokeWidth={1.7}
                    />
                    <text
                      x={x + 18}
                      y={254}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={700}
                      fill={isHot ? '#ffffff' : '#1c1214'}
                    >
                      {v}
                    </text>
                    <text
                      x={x + 18}
                      y={282}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight={600}
                      fill="#9b8a8d"
                    >
                      H[{i + 1}]
                    </text>
                  </g>
                )
              })}
            </>
          )}
        </svg>
      </div>

      {/* sorted output */}
      <div className="mt-3">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Ταξινομημένη έξοδος
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INPUT.map((_, slot) => {
            const v = cur.output[slot]
            const filled = v !== undefined
            const justAdded =
              filled && slot === cur.output.length - 1 && cur.phase !== 'init'
            return (
              <div
                key={slot}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md border-2 text-sm font-bold transition-colors',
                  filled
                    ? justAdded
                      ? 'border-[#047857] bg-[#059669] text-white'
                      : 'border-[#059669]/50 bg-[#d1fae5] text-[#065f46]'
                    : 'border-dashed border-border text-fg-subtle',
                )}
              >
                {filled ? v : '·'}
              </div>
            )
          })}
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[4.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
