'use client'

/**
 * ReverseDeleteAnimator — the third MST algorithm, run backwards (L09).
 *
 * Kruskal sweeps cheapest-to-priciest and ADDS what doesn't close a cycle.
 * Reverse-delete sweeps the OPPOSITE direction — priciest-to-cheapest — and
 * REMOVES every edge whose removal does not disconnect the graph. By the
 * cycle property each such edge was the most expensive of some cycle and
 * cannot be in any MST; the edges that survive are exactly the bridges,
 * which form the tree. This viz makes both halves operable: a strip at the
 * top tracks the edges in descending order, and the graph below colours
 * vertices by whether they stay reachable from a fixed anchor after the
 * trial removal. Watch a bridge fail the test, get restored, and stay
 * green forever after. Built for L09.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MST_NODES,
  MST_EDGES,
  MST_POS,
  MST_NODE_R,
  MST_VIEW,
  routeMstEdge,
  type MstEdge,
} from './mst-graph'

const SORTED_DESC: MstEdge[] = [...MST_EDGES].sort((a, b) => b.w - a.w)
const ANCHOR = 'A'

type RDAction = 'delete' | 'keep'
type RDStep = {
  edge: MstEdge
  action: RDAction
  /** Edges that have been permanently removed up to and including this step. */
  removed: Set<string>
  /** Connected component of ANCHOR after tentatively removing this edge. */
  testComponent: Set<string>
  /** Tree edges committed so far. */
  treeSoFar: Set<string>
}

function bfsComponent(start: string, edges: Set<string>): Set<string> {
  const adj = new Map<string, string[]>()
  for (const n of MST_NODES) adj.set(n.id, [])
  for (const e of MST_EDGES) {
    if (!edges.has(e.id)) continue
    adj.get(e.a)!.push(e.b)
    adj.get(e.b)!.push(e.a)
  }
  const seen = new Set<string>([start])
  const queue = [start]
  while (queue.length) {
    const u = queue.shift()!
    for (const v of adj.get(u)!) {
      if (!seen.has(v)) {
        seen.add(v)
        queue.push(v)
      }
    }
  }
  return seen
}

function runReverseDelete(): RDStep[] {
  const surviving = new Set<string>(MST_EDGES.map((e) => e.id))
  const removed = new Set<string>()
  const tree = new Set<string>()
  const steps: RDStep[] = []

  for (const e of SORTED_DESC) {
    surviving.delete(e.id)
    const testComponent = bfsComponent(ANCHOR, surviving)
    const stillConnected = testComponent.size === MST_NODES.length

    if (stillConnected) {
      removed.add(e.id)
      steps.push({
        edge: e,
        action: 'delete',
        removed: new Set(removed),
        testComponent: new Set(testComponent),
        treeSoFar: new Set(tree),
      })
    } else {
      surviving.add(e.id)
      tree.add(e.id)
      steps.push({
        edge: e,
        action: 'keep',
        removed: new Set(removed),
        testComponent: new Set(testComponent),
        treeSoFar: new Set(tree),
      })
    }
  }
  return steps
}

export function ReverseDeleteAnimator() {
  const steps = useMemo(() => runReverseDelete(), [])
  const last = steps.length - 1
  const [step, setStep] = useState(0)
  const cur = steps[step]

  const cumulativeCost = useMemo(() => {
    let c = 0
    for (const id of cur.treeSoFar) {
      const e = MST_EDGES.find((x) => x.id === id)
      if (e) c += e.w
    }
    return c
  }, [cur])

  const cumKept = cur.treeSoFar.size
  const cumDeleted = cur.removed.size

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Αντίστροφη διαγραφή — αφαίρεση από την ακριβότερη
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === last
            ? 'Ολοκληρώθηκε'
            : `Ακμή ${step + 1}/${SORTED_DESC.length}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Σαρώνουμε τις ακμές σε φθίνουσα σειρά κόστους. Για καθεμία: αν η
        αφαίρεση αφήσει το γράφημα συνεκτικό, οριστική διαγραφή (ιδιότητα
        κύκλου). Αλλιώς, ήταν γέφυρα — την κρατάμε.
      </p>

      {/* sorted edge strip */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-semibold uppercase tracking-wider text-fg-subtle">
          Σειρά ↓
        </span>
        {SORTED_DESC.map((e, i) => {
          const decided = i <= step
          const isCur = i === step
          const wasKept = cur.treeSoFar.has(e.id)
          const wasDeleted = cur.removed.has(e.id)
          let cls = 'border-border bg-bg-soft text-fg-muted'
          if (isCur) {
            cls = cn(
              'border-amber-500 ring-2 ring-amber-300',
              cur.action === 'delete'
                ? 'bg-rose-50 text-rose-800'
                : 'bg-success/15 text-success',
            )
          } else if (wasKept) {
            cls = 'border-success/55 bg-success/10 text-success'
          } else if (wasDeleted) {
            cls = 'border-rose-200 bg-rose-50 text-rose-500 line-through'
          }
          return (
            <span
              key={e.id}
              className={cn(
                'rounded border px-1.5 py-0.5 font-mono font-semibold',
                cls,
                !decided && 'opacity-50',
              )}
            >
              {e.a}-{e.b}·{e.w}
            </span>
          )
        })}
      </div>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${MST_VIEW.w} ${MST_VIEW.h}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {MST_EDGES.map((e) => {
            const A = MST_POS.get(e.a)!
            const B = MST_POS.get(e.b)!
            const g = routeMstEdge(A, B)
            const isCur = e.id === cur.edge.id
            const wasKept = cur.treeSoFar.has(e.id)
            const wasDeleted = cur.removed.has(e.id)
            let stroke = '#d4cccd'
            let width = 1.7
            let dash: string | undefined
            let labelStroke = '#cdbfc0'
            let labelFill = '#5a4a4d'
            if (isCur) {
              if (cur.action === 'delete') {
                stroke = '#dc2626'
                width = 4
                dash = '7 5'
                labelStroke = '#dc2626'
                labelFill = '#b91c1c'
              } else {
                stroke = '#059669'
                width = 5.5
                labelStroke = '#059669'
                labelFill = '#047857'
              }
            } else if (wasKept) {
              stroke = '#059669'
              width = 3.6
              labelStroke = '#059669'
              labelFill = '#047857'
            } else if (wasDeleted) {
              stroke = '#e5e7eb'
              width = 1.3
              dash = '4 4'
              labelStroke = '#e5e7eb'
              labelFill = '#a8a29e'
            }
            return (
              <g key={e.id} opacity={wasDeleted && !isCur ? 0.4 : 1}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={width}
                    strokeDasharray={dash}
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width}
                    strokeDasharray={dash}
                    strokeLinecap="round"
                  />
                )}
                <rect
                  x={g.mx - 11}
                  y={g.my - 10}
                  width={22}
                  height={17}
                  rx={4}
                  fill="#faf4ee"
                  stroke={labelStroke}
                  strokeWidth={isCur || wasKept ? 2 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={labelFill}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {MST_NODES.map((n) => {
            const inComp = cur.testComponent.has(n.id)
            const isAnchor = n.id === ANCHOR
            let fill = '#d1fae5'
            let stroke = '#059669'
            if (cur.action === 'keep') {
              fill = inComp ? '#d1fae5' : '#fecaca'
              stroke = inComp ? '#059669' : '#dc2626'
            }
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={MST_NODE_R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isAnchor ? 3.5 : 2.5}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
                {isAnchor && (
                  <text
                    x={n.x}
                    y={n.y + MST_NODE_R + 13}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill="#9b8a8d"
                  >
                    αναφορά
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <p className="mt-1.5 text-center text-xs text-fg-subtle">
        Πράσινο = συνεκτικό κομμάτι της {ANCHOR} στη δοκιμή · ροζ = αποκόπηκε ·
        παχιά πράσινη ακμή = στο ΕΣΔ · διακεκομμένη γκρι = έχει διαγραφεί.
      </p>

      {/* counters */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded border border-success/55 bg-success/10 px-2 py-0.5 font-mono font-semibold text-success">
          κρατήθηκαν: {cumKept}
        </span>
        <span className="rounded border border-rose-300 bg-rose-50 px-2 py-0.5 font-mono font-semibold text-rose-700">
          διαγράφηκαν: {cumDeleted}
        </span>
        <span className="rounded border border-border bg-bg-soft px-2 py-0.5 font-mono font-semibold text-fg-muted">
          κόστος δέντρου: {cumulativeCost}
        </span>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[5.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {cur.action === 'delete' ? (
          <>
            <strong className="text-fg">
              Δοκίμασε την {cur.edge.a}-{cur.edge.b} (κόστος {cur.edge.w}).
            </strong>{' '}
            Αν την αφαιρέσουμε, η {ANCHOR} εξακολουθεί να φτάνει και στις 7
            κορυφές → το γράφημα μένει συνεκτικό. Άρα η ακμή ήταν η ακριβότερη
            σε κάποιον κύκλο, και η ιδιότητα κύκλου μας εξασφαλίζει ότι δεν
            ανήκει σε κανένα ΕΣΔ.{' '}
            <strong className="text-rose-700">Οριστική διαγραφή.</strong>
          </>
        ) : (
          <>
            <strong className="text-fg">
              Δοκίμασε την {cur.edge.a}-{cur.edge.b} (κόστος {cur.edge.w}).
            </strong>{' '}
            Αν την αφαιρέσουμε, η {ANCHOR} φτάνει μόνο σε{' '}
            {cur.testComponent.size}/7 κορυφές — οι υπόλοιπες ροζ έχασαν τη
            σύνδεση. Η ακμή είναι{' '}
            <strong className="text-success">γέφυρα</strong>· την ξαναβάζουμε
            και προστίθεται στο ΕΣΔ.
          </>
        )}
      </div>

      {step === last && (
        <div className="mt-2 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-fg">
          <strong className="text-success">Τέλος.</strong> Διαγράφηκαν{' '}
          {cumDeleted} ακμές, κρατήθηκαν {cumKept} = n − 1 με συνολικό κόστος{' '}
          <strong>{cumulativeCost}</strong> — ίδιο ΕΣΔ με Prim και Kruskal,
          χτισμένο όμως από την ανάποδη άκρη της λίστας.
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
          Βήμα {step + 1} / {last + 1}
        </span>
      </div>
    </section>
  )
}
