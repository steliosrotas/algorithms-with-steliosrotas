'use client'

/**
 * DagAveragePathCost — the (count, sum) DP on a DAG, stepped backward through
 * reverse topological order.
 *
 * Front-Set-8.1 asks for the average cost of all s→t paths in a weighted DAG.
 * The trick is to compute TWO numbers per vertex — count[x] = #paths x→t, and
 * sum[x] = sum of their costs — by reading already-computed successor values.
 * Average = sum[s] / count[s].
 *
 * The viz walks a 6-vertex / 8-edge DAG in reverse topological order
 * t, c, d, a, b, s. Each step: highlight the current vertex; light up its
 * outgoing edges; show, per successor y, the (count[y], sum[y]) pair and the
 * "(count[y]·w + sum[y])" contribution that gets added. The table on the right
 * fills cell by cell, t → s. At step 6 the final cards reveal:
 *     sum[s] = 42, count[s] = 4, average = 10.5.
 *
 * The 4 paths on this instance — s→a→c→t (13), s→a→d→t (9), s→b→c→t (11),
 * s→b→d→t (9) — sum to 42 and verify the DP by hand.
 *
 * Built for L17 problem front-set-8-ask1.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type DagNode = { id: string; x: number; y: number; label: string }
const NODES: DagNode[] = [
  { id: 's', x: 60, y: 140, label: 's' },
  { id: 'a', x: 190, y: 60, label: 'a' },
  { id: 'b', x: 190, y: 220, label: 'b' },
  { id: 'c', x: 320, y: 60, label: 'c' },
  { id: 'd', x: 320, y: 220, label: 'd' },
  { id: 't', x: 450, y: 140, label: 't' },
]
const POS = new Map(NODES.map((n) => [n.id, n]))

type DagEdge = { from: string; to: string; w: number }
const EDGES: DagEdge[] = [
  { from: 's', to: 'a', w: 2 },
  { from: 's', to: 'b', w: 3 },
  { from: 'a', to: 'c', w: 4 },
  { from: 'a', to: 'd', w: 6 },
  { from: 'b', to: 'c', w: 1 },
  { from: 'b', to: 'd', w: 5 },
  { from: 'c', to: 't', w: 7 },
  { from: 'd', to: 't', w: 1 },
]

/** Reverse topological order — what the DP needs. */
const PROCESS_ORDER = ['t', 'c', 'd', 'a', 'b', 's']

/** Pre-computed (count, sum) per vertex after the DP completes. */
const RESULT: Record<string, { count: number; sum: number }> = {
  t: { count: 1, sum: 0 },
  c: { count: 1, sum: 7 }, // 1·7 + 0
  d: { count: 1, sum: 1 }, // 1·1 + 0
  a: { count: 2, sum: 18 }, // (1·4 + 7) + (1·6 + 1) = 11 + 7
  b: { count: 2, sum: 14 }, // (1·1 + 7) + (1·5 + 1) = 8 + 6
  s: { count: 4, sum: 42 }, // (2·2 + 18) + (2·3 + 14) = 22 + 20
}

const R = 22
const LAST_STEP = PROCESS_ORDER.length // 6

const NODE_RECTS: NodeRect[] = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map<string, NodeRect>(
  NODE_RECTS.map((r) => [r.id as string, r]),
)

/** Routed directed edge, symmetric trim by R so the arrowhead lands on
 *  the destination border. */
function routedEdge(fromId: string, toId: string) {
  const a = NODE_RECT_BY_ID.get(fromId)!
  const b = NODE_RECT_BY_ID.get(toId)!
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2
  const geom = routeEdge(a, b, NODE_RECTS)
  return trimEdgeGeom(geom, ax, ay, R, bx, by, R)
}

export function DagAveragePathCost() {
  const [step, setStep] = useState(0)

  // Vertices computed so far (after this step). At step k, the first k of
  // PROCESS_ORDER have been processed.
  const computed = new Set(PROCESS_ORDER.slice(0, step))
  const current = step >= 1 && step <= LAST_STEP ? PROCESS_ORDER[step - 1] : null

  // For the current vertex, its outgoing edges (the ones lighting up)
  const outgoing = current
    ? EDGES.filter((e) => e.from === current)
    : []

  // Build the contribution rows for the current vertex
  const contributions = current
    ? outgoing.map((e) => {
        const succ = e.to
        const cy = RESULT[succ].count
        const sy = RESULT[succ].sum
        return {
          edge: e,
          succ,
          countY: cy,
          sumY: sy,
          term: cy * e.w + sy,
        }
      })
    : []

  const currentCount = current
    ? contributions.reduce((acc, c) => acc + c.countY, 0)
    : 0
  const currentSum = current
    ? contributions.reduce((acc, c) => acc + c.term, 0)
    : 0

  // Special: t has no outgoing edges → base case
  const isBaseCase = current === 't'

  let note: string
  if (step === 0) {
    note =
      'DAG με 6 κορυφές και 8 ακμές. Θα γεμίσουμε (count[x], sum[x]) με την ΑΝΤΙΣΤΡΟΦΗ τοπολογική σειρά t, c, d, a, b, s — κάθε κορυφή χρειάζεται πρώτα τις διαδόχους της. Η απάντηση θα είναι sum[s] / count[s].'
  } else if (isBaseCase) {
    note =
      'Βάση: t είναι ο προορισμός. Υπάρχει ένα μονοπάτι από το t στον εαυτό του (το κενό), με μήκος 0. Άρα count[t] = 1, sum[t] = 0.'
  } else if (current) {
    const parts = contributions
      .map(
        (c) =>
          `${c.succ}: count=${c.countY}, sum=${c.sumY} → προσθέτει ${c.countY}·${c.edge.w} + ${c.sumY} = ${c.term}`,
      )
      .join(' · ')
    note = `Επεξεργαζόμαστε ${current}. Κάθε διάδοχος ήδη υπολογισμένος. count[${current}] = Σ count[διαδόχου] = ${contributions
      .map((c) => c.countY)
      .join(' + ')} = ${currentCount}. sum[${current}] = Σ (count[y]·w + sum[y]) — ${parts} → σύνολο ${currentSum}.`
  } else {
    note = ''
  }

  const showFinal = step === LAST_STEP

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Μέσο κόστος όλων των s→t μονοπατιών — DP βήμα-βήμα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === 0
            ? 'Έτοιμοι'
            : current
              ? `Επεξεργασία: ${current}`
              : 'Τέλος'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Σειρά υπολογισμού: t → c → d → a → b → s (αντίστροφη τοπολογική).
      </p>

      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
        {/* graph */}
        <div className="graph-canvas overflow-x-auto">
          <svg
            viewBox="0 0 510 290"
            className="mx-auto block w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="dag-arr"
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
                id="dag-arr-hi"
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

            {EDGES.map((e, i) => {
              const A = POS.get(e.from)!
              const B = POS.get(e.to)!
              const g = routedEdge(e.from, e.to)
              const hot = outgoing.some(
                (oe) => oe.from === e.from && oe.to === e.to,
              )
              const mx = g.kind === 'line' ? (A.x + B.x) / 2 : (A.x + B.x + 2 * g.cx) / 4
              const my = g.kind === 'line' ? (A.y + B.y) / 2 : (A.y + B.y + 2 * g.cy) / 4
              const stroke = hot ? '#9f1239' : '#9b8a8d'
              const strokeWidth = hot ? 3.2 : 1.6
              const marker = hot ? 'url(#dag-arr-hi)' : 'url(#dag-arr)'
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
                      markerEnd={marker}
                    />
                  ) : (
                    <path d={g.d} fill="none" stroke={stroke} strokeWidth={strokeWidth} markerEnd={marker} />
                  )}
                  <rect
                    x={mx - 11}
                    y={my - 9}
                    width={22}
                    height={17}
                    rx={3}
                    fill="#faf4ee"
                    stroke={hot ? '#9f1239' : '#cdbfc0'}
                  />
                  <text
                    x={mx}
                    y={my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight={700}
                    fill="#1c1214"
                  >
                    {e.w}
                  </text>
                </g>
              )
            })}

            {NODES.map((n) => {
              const isCurrent = current === n.id
              const isComputed = computed.has(n.id)
              const isSucc =
                current !== null && outgoing.some((e) => e.to === n.id)
              const fill = isCurrent
                ? '#fef3c7'
                : isComputed
                  ? '#d1fae5'
                  : '#ffffff'
              const stroke = isCurrent
                ? '#d97706'
                : isSucc
                  ? '#9f1239'
                  : isComputed
                    ? '#0f766e'
                    : '#9b8a8d'

              const lbl = isComputed
                ? `${RESULT[n.id].count}, ${RESULT[n.id].sum}`
                : null

              return (
                <g key={n.id}>
                  {isCurrent && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={R + 5}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                    />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isCurrent || isSucc ? 2.8 : 2}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill="#1c1214"
                  >
                    {n.label}
                  </text>
                  {lbl && (
                    <g>
                      <rect
                        x={n.x - 26}
                        y={n.y + R + 4}
                        width={52}
                        height={18}
                        rx={4}
                        fill="#ecfdf5"
                        stroke="#0f766e"
                      />
                      <text
                        x={n.x}
                        y={n.y + R + 13}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={10}
                        fontWeight={700}
                        fill="#065f46"
                      >
                        ({lbl})
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* table — count[v], sum[v] */}
        <div>
          <div className="mb-1 text-xs font-semibold text-fg-subtle">
            Πίνακας (count[v], sum[v])
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left text-fg-subtle">v</th>
                  <th className="px-2 py-1 text-right text-fg-subtle">count</th>
                  <th className="px-2 py-1 text-right text-fg-subtle">sum</th>
                </tr>
              </thead>
              <tbody>
                {PROCESS_ORDER.map((v) => {
                  const isCurrentRow = current === v
                  const isDone = computed.has(v)
                  return (
                    <tr
                      key={v}
                      className={cn(
                        'border-t border-border',
                        isCurrentRow
                          ? 'bg-amber-100 font-bold'
                          : isDone
                            ? 'bg-emerald-50/60'
                            : '',
                      )}
                    >
                      <td className="px-2 py-1 font-bold text-fg">{v}</td>
                      <td className="px-2 py-1 text-right text-fg">
                        {isDone ? RESULT[v].count : '·'}
                      </td>
                      <td className="px-2 py-1 text-right text-fg">
                        {isDone ? RESULT[v].sum : '·'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* contribution breakdown */}
          {current && !isBaseCase && (
            <div className="mt-3 rounded-md border border-amber-300 bg-amber-50/60 p-2">
              <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
                Συνεισφορές προς το {current}
              </div>
              <div className="space-y-1 text-[0.7rem]">
                {contributions.map((c, i) => (
                  <div key={i} className="font-mono text-fg-muted">
                    {current}→{c.succ} (w={c.edge.w}):{' '}
                    <span className="text-amber-900">
                      {c.countY}·{c.edge.w} + {c.sumY} = {c.term}
                    </span>
                  </div>
                ))}
                <div className="mt-1 border-t border-amber-300 pt-1 font-mono text-fg">
                  count[{current}] = {contributions.map((c) => c.countY).join(' + ')} ={' '}
                  <span className="font-bold text-amber-900">{currentCount}</span>
                </div>
                <div className="font-mono text-fg">
                  sum[{current}] ={' '}
                  {contributions.map((c) => c.term).join(' + ')} ={' '}
                  <span className="font-bold text-amber-900">{currentSum}</span>
                </div>
              </div>
            </div>
          )}

          {isBaseCase && (
            <div className="mt-3 rounded-md border border-emerald-300 bg-emerald-50/60 p-2 text-[0.7rem] font-mono text-emerald-900">
              count[t] = 1 (το κενό μονοπάτι) · sum[t] = 0
            </div>
          )}
        </div>
      </div>

      {/* narration */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* final ratio */}
      {showFinal && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-emerald-300 bg-emerald-50 p-2 text-center">
            <div className="text-[0.65rem] uppercase tracking-wider text-emerald-700">
              count[s]
            </div>
            <div className="text-xl font-bold text-emerald-900">
              {RESULT.s.count}
            </div>
            <div className="text-[0.65rem] text-emerald-700">
              4 διακριτά μονοπάτια s→t
            </div>
          </div>
          <div className="rounded-md border border-emerald-300 bg-emerald-50 p-2 text-center">
            <div className="text-[0.65rem] uppercase tracking-wider text-emerald-700">
              sum[s]
            </div>
            <div className="text-xl font-bold text-emerald-900">
              {RESULT.s.sum}
            </div>
            <div className="text-[0.65rem] text-emerald-700">
              άθροισμα των 4 κοστών
            </div>
          </div>
          <div className="rounded-md border-2 border-accent bg-accent/15 p-2 text-center">
            <div className="text-[0.65rem] uppercase tracking-wider text-accent">
              μέσο κόστος
            </div>
            <div className="text-xl font-bold text-accent">
              {RESULT.s.sum} / {RESULT.s.count} = {RESULT.s.sum / RESULT.s.count}
            </div>
            <div className="text-[0.65rem] text-accent">η ζητούμενη απάντηση</div>
          </div>
        </div>
      )}

      {/* enumerate paths cross-check */}
      {showFinal && (
        <div className="mt-3 rounded-md border border-border bg-bg-soft/40 p-3 text-[0.7rem]">
          <div className="mb-1 font-bold text-fg-subtle">
            Έλεγχος — απαρίθμηση των 4 μονοπατιών
          </div>
          <div className="grid gap-1 font-mono text-fg-muted sm:grid-cols-2">
            <div>s→a→c→t · 2 + 4 + 7 = <strong>13</strong></div>
            <div>s→a→d→t · 2 + 6 + 1 = <strong>9</strong></div>
            <div>s→b→c→t · 3 + 1 + 7 = <strong>11</strong></div>
            <div>s→b→d→t · 3 + 5 + 1 = <strong>9</strong></div>
          </div>
          <div className="mt-1 font-mono">
            Σύνολο: 13 + 9 + 11 + 9 = <strong>42</strong> · μέσο: 42 / 4 ={' '}
            <strong className="text-accent">10.5</strong>
          </div>
        </div>
      )}

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
          onClick={() => setStep((s) => Math.min(LAST_STEP, s + 1))}
          disabled={step === LAST_STEP}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {step === LAST_STEP ? 'Τέλος' : `Επόμενο (${PROCESS_ORDER[step]})`}
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
          Βήμα {step} / {LAST_STEP}
        </span>
      </div>
    </section>
  )
}
