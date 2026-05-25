'use client'

/**
 * BipartiteChecker — the BFS-levels test for bipartiteness.
 *
 * L08's central theorem: run BFS, colour even levels one colour and odd
 * levels the other; the graph is bipartite iff no edge joins two vertices
 * of the SAME level (same colour). This viz colours the levels one by one,
 * then checks every edge — and on the non-bipartite example it lights up
 * the same-level edge and the odd cycle it closes. A toggle flips between
 * a bipartite graph and one with an odd cycle, so both verdicts are seen.
 * Built for L08.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type BNode = { id: string; x: number; level: number }
type BGraph = {
  nodes: BNode[]
  edges: [string, string][]
  /** nodes of the odd cycle to highlight, or null when bipartite */
  oddCycle: string[] | null
}

const ROW_Y = (lvl: number) => 58 + lvl * 84
const NODE_R = 20

const GRAPHS: Record<'bipartite' | 'odd', BGraph> = {
  bipartite: {
    nodes: [
      { id: 'A', x: 190, level: 0 },
      { id: 'B', x: 118, level: 1 },
      { id: 'C', x: 262, level: 1 },
      { id: 'D', x: 70, level: 2 },
      { id: 'E', x: 190, level: 2 },
      { id: 'F', x: 310, level: 2 },
      { id: 'G', x: 190, level: 3 },
    ],
    edges: [
      ['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'],
      ['C', 'E'], ['C', 'F'], ['D', 'G'], ['F', 'G'],
    ],
    oddCycle: null,
  },
  odd: {
    nodes: [
      { id: 'A', x: 190, level: 0 },
      { id: 'B', x: 118, level: 1 },
      { id: 'C', x: 262, level: 1 },
      { id: 'D', x: 70, level: 2 },
      { id: 'E', x: 190, level: 2 },
      { id: 'F', x: 310, level: 2 },
    ],
    edges: [
      ['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'],
      ['B', 'E'], ['C', 'E'], ['C', 'F'],
    ],
    oddCycle: ['A', 'B', 'C'],
  },
}

const RED = '#ef4444'
const BLUE = '#3b82f6'

export function BipartiteChecker() {
  const [which, setWhich] = useState<'bipartite' | 'odd'>('bipartite')
  const [step, setStep] = useState(0)

  const g = GRAPHS[which]
  const levelById = new Map(g.nodes.map((n) => [n.id, n.level]))
  const numLevels = Math.max(...g.nodes.map((n) => n.level)) + 1
  const verdictStep = numLevels + 1
  const atVerdict = step === verdictStep

  // Collision-aware edge routing: built per-graph because the bipartite and
  // odd layouts have different node sets. Steady state is straight lines
  // (the level-banded layout is collision-free); routeEdge falls back to a
  // Bezier if a future layout edit places a node on the centerline. Locks
  // out the «edge through unrelated node» class of bug structurally per
  // Phase E.4.6.
  const nodeRects = useMemo<NodeRect[]>(
    () =>
      g.nodes.map((n) => ({
        id: n.id,
        x: n.x - NODE_R,
        y: ROW_Y(n.level) - NODE_R,
        w: NODE_R * 2,
        h: NODE_R * 2,
      })),
    [g],
  )
  const rectById = useMemo(
    () => new Map(nodeRects.map((r) => [r.id, r] as const)),
    [nodeRects],
  )

  /** a node's level is coloured once step has reached it */
  const coloured = (lvl: number) => step >= lvl + 1
  const colourOf = (lvl: number) => (lvl % 2 === 0 ? RED : BLUE)

  /** an edge whose endpoints sit on the same BFS level */
  const sameLevel = (a: string, b: string) =>
    levelById.get(a) === levelById.get(b)
  const cycleSet = new Set(g.oddCycle ?? [])
  const inCycleEdge = (a: string, b: string) =>
    cycleSet.has(a) && cycleSet.has(b)

  let note: string
  if (step === 0) {
    note =
      'BFS από την κορυφή A. Θα χρωματίσουμε τα επίπεδα εναλλάξ: άρτια επίπεδα κόκκινα, περιττά μπλε. Πάτα «Επόμενο».'
  } else if (step <= numLevels) {
    const lvl = step - 1
    note = `Επίπεδο L${lvl}: το χρωματίζουμε ${lvl % 2 === 0 ? 'κόκκινο' : 'μπλε'}. Κάθε ακμή του BFS-δέντρου πάει από ένα επίπεδο στο επόμενο — άρα αλλάζει χρώμα.`
  } else if (which === 'bipartite') {
    note =
      'Ελέγχουμε κάθε ακμή: ΚΑΜΙΑ δεν ενώνει δύο κορυφές ίδιου χρώματος (ίδιου επιπέδου). ⇒ Το γράφημα είναι ΔΙΜΕΡΕΣ.'
  } else {
    note =
      'Η ακμή B–C ενώνει δύο κορυφές του ΙΔΙΟΥ επιπέδου — ίδιο χρώμα. Μαζί με τις ακμές προς τον κοινό πρόγονο A κλείνει τον περιττό κύκλο A–B–C (μήκος 3). ⇒ ΟΧΙ διμερές.'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + graph toggle */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Έλεγχος διμερότητας — χρωμάτισε τα επίπεδα του BFS
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['bipartite', 'odd'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setWhich(key)
                setStep(0)
              }}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                which === key
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {key === 'bipartite' ? 'Διμερές' : 'Με περιττό κύκλο'}
            </button>
          ))}
        </div>
      </div>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 380 350"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* level bands */}
          {Array.from({ length: numLevels }, (_, lvl) => (
            <g key={`band${lvl}`}>
              <rect
                x={10}
                y={ROW_Y(lvl) - 32}
                width={360}
                height={64}
                rx={8}
                fill={coloured(lvl) ? colourOf(lvl) : '#9b8a8d'}
                fillOpacity={coloured(lvl) ? 0.08 : 0.05}
                stroke={coloured(lvl) ? colourOf(lvl) : '#9b8a8d'}
                strokeOpacity={0.3}
                strokeDasharray="5 4"
              />
              <text
                x={20}
                y={ROW_Y(lvl) - 14}
                fontSize={11}
                fontWeight={700}
                fill={coloured(lvl) ? colourOf(lvl) : '#9b8a8d'}
              >
                L{lvl}
              </text>
            </g>
          ))}

          {/* edges */}
          {g.edges.map(([a, b], i) => {
            const rectA = rectById.get(a)!
            const rectB = rectById.get(b)!
            const geom = routeEdge(rectA, rectB, nodeRects)
            const bad = atVerdict && which === 'odd' && sameLevel(a, b)
            const cyc = atVerdict && which === 'odd' && inCycleEdge(a, b)
            const stroke = bad ? '#dc2626' : cyc ? '#f59e0b' : '#9b8a8d'
            const strokeWidth = bad ? 5 : cyc ? 4 : 2
            return geom.kind === 'line' ? (
              <line
                key={`e${i}`}
                x1={geom.x1}
                y1={geom.y1}
                x2={geom.x2}
                y2={geom.y2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            ) : (
              <path
                key={`e${i}`}
                d={geom.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )
          })}

          {/* nodes */}
          {g.nodes.map((n) => {
            const isColoured = coloured(n.level)
            const fill = isColoured ? colourOf(n.level) : '#ffffff'
            const onCycle = atVerdict && which === 'odd' && cycleSet.has(n.id)
            return (
              <g key={n.id}>
                {onCycle && (
                  <circle
                    cx={n.x}
                    cy={ROW_Y(n.level)}
                    r={26}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={ROW_Y(n.level)}
                  r={20}
                  fill={fill}
                  stroke={isColoured ? '#1c1214' : '#9b8a8d'}
                  strokeWidth={2.5}
                />
                <text
                  x={n.x}
                  y={ROW_Y(n.level)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={700}
                  fill={isColoured ? '#ffffff' : '#1c1214'}
                >
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* verdict pill */}
      {atVerdict && (
        <div
          className={cn(
            'mt-3 rounded-lg border px-3 py-2 text-sm font-semibold',
            which === 'bipartite'
              ? 'border-success/40 bg-success/10 text-success'
              : 'border-danger/40 bg-danger/10 text-danger',
          )}
        >
          {which === 'bipartite'
            ? '✓ Διμερές — υπάρχει έγκυρος 2-χρωματισμός'
            : '✗ Όχι διμερές — βρέθηκε περιττός κύκλος'}
        </div>
      )}

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
          onClick={() => setStep((s) => Math.min(verdictStep, s + 1))}
          disabled={atVerdict}
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
          Βήμα {step} / {verdictStep}
        </span>
      </div>
    </section>
  )
}
