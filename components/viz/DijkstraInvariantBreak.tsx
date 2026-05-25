'use client'

/**
 * DijkstraInvariantBreak — Dijkstra's invariant collapsing on a negative edge (L09).
 *
 * The Callout that says "Dijkstra needs non-negative weights" usually feels
 * abstract. Here is the canonical 4-vertex counterexample, stepped: Dijkstra
 * finalises u with d=1, then later discovers the path s→v→u costs −1 — but
 * u is already locked, so the better value never propagates. The final
 * answer d[t] = 5 is WRONG (true shortest is 3, via s→v→u→t). The student
 * sees the invariant break in a single frame, and immediately understands
 * why Bellman-Ford has to revisit edges every round. Built for L09.
 */

import type { ReactNode } from 'react'
import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

const VIEW_W = 460
const VIEW_H = 220
const NODE_R = 22

const NODES: { id: string; x: number; y: number }[] = [
  { id: 's', x: 60, y: 110 },
  { id: 'u', x: 230, y: 50 },
  { id: 'v', x: 230, y: 170 },
  { id: 't', x: 400, y: 110 },
]

type Edge = { id: string; from: string; to: string; w: number; negative?: boolean }
const EDGES: Edge[] = [
  { id: 'su', from: 's', to: 'u', w: 1 },
  { id: 'sv', from: 's', to: 'v', w: 2 },
  { id: 'vu', from: 'v', to: 'u', w: -3, negative: true },
  { id: 'ut', from: 'u', to: 't', w: 4 },
]

const POS = new Map(NODES.map((n) => [n.id, n]))
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - NODE_R,
  y: n.y - NODE_R,
  w: NODE_R * 2,
  h: NODE_R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))
const INF = Infinity

type DStep = {
  /** the vertex just extracted (and finalized at this step) */
  extracted: string
  /** d-values after this step's relaxations */
  d: Record<string, number>
  /** which vertices have ever been finalized */
  finalizedSet: Set<string>
  /** edges relaxed THIS step (highlighted) */
  relaxedEdges: string[]
  /** if true, this step contains the invariant-break moment */
  breakMoment?: { edge: string; staleD: number; betterD: number }
  /** human-readable annotation */
  note: ReactNode
}

const STEPS: DStep[] = [
  {
    extracted: 's',
    d: { s: 0, u: 1, v: 2, t: INF },
    finalizedSet: new Set(['s']),
    relaxedEdges: ['su', 'sv'],
    note: (
      <>
        <strong className="text-fg">Βήμα 1:</strong> εξάγουμε την s (d=0). Χαλαρώνουμε
        τις s→u και s→v: d[u] = 1, d[v] = 2.
      </>
    ),
  },
  {
    extracted: 'u',
    d: { s: 0, u: 1, v: 2, t: 5 },
    finalizedSet: new Set(['s', 'u']),
    relaxedEdges: ['ut'],
    note: (
      <>
        <strong className="text-fg">Βήμα 2:</strong> η u έχει το μικρότερο d (=1) →
        εξάγεται. <em>Η αναλλοίωτη του Dijkstra λέει: τώρα η d[u] = 1 είναι
        οριστική.</em> Χαλαρώνουμε u→t: d[t] = 1 + 4 = 5.
      </>
    ),
  },
  {
    extracted: 'v',
    d: { s: 0, u: 1, v: 2, t: 5 },
    finalizedSet: new Set(['s', 'u', 'v']),
    relaxedEdges: ['vu'],
    breakMoment: { edge: 'vu', staleD: 1, betterD: -1 },
    note: (
      <>
        <strong className="text-danger">Η αναλλοίωτη καταρρέει.</strong> Εξάγουμε
        την v (d=2) και πάμε να χαλαρώσουμε τη v→u: το κόστος μέσω v θα ήταν 2 + (−3) ={' '}
        <strong>−1</strong>, πολύ καλύτερο από το d[u] = 1. Αλλά η u είναι ήδη
        οριστικοποιημένη — ο Dijkstra δεν την ξανακοιτάει. Η βελτίωση χάνεται, και μαζί της
        χάνεται και ο σωστός υπολογισμός του d[t].
      </>
    ),
  },
  {
    extracted: 't',
    d: { s: 0, u: 1, v: 2, t: 5 },
    finalizedSet: new Set(['s', 'u', 'v', 't']),
    relaxedEdges: [],
    note: (
      <>
        <strong className="text-fg">Βήμα 4:</strong> εξάγουμε την t (d=5). Ο Dijkstra
        τέλειωσε με απάντηση <strong className="text-danger">d[t] = 5</strong> — αλλά
        η πραγματικά συντομότερη διαδρομή s→v→u→t κοστίζει 2 + (−3) + 4 ={' '}
        <strong className="text-success">3</strong>. Λάθος απάντηση κατά 2 μονάδες, με
        αιτία τη μία και μοναδική αρνητική ακμή.
      </>
    ),
  },
]

const LAST = STEPS.length - 1

const fmt = (x: number) => (x === INF ? '∞' : String(x))

type EdgePath =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; mx: number; my: number }
  | { kind: 'curve'; d: string; mx: number; my: number }

function edgePath(e: Edge): EdgePath {
  const a = POS.get(e.from)!
  const b = POS.get(e.to)!
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  const trimmed = trimEdgeGeom(geom, a.x, a.y, NODE_R, b.x, b.y, NODE_R)
  if (trimmed.kind === 'line') {
    return {
      kind: 'line',
      x1: trimmed.x1,
      y1: trimmed.y1,
      x2: trimmed.x2,
      y2: trimmed.y2,
      mx: (a.x + b.x) / 2,
      my: (a.y + b.y) / 2,
    }
  }
  return {
    kind: 'curve',
    d: trimmed.d,
    mx: (a.x + 2 * trimmed.cx + b.x) / 4,
    my: (a.y + 2 * trimmed.cy + b.y) / 4,
  }
}

export function DijkstraInvariantBreak() {
  const [step, setStep] = useState(0)
  const cur = STEPS[step]
  const relaxed = new Set(cur.relaxedEdges)
  const isBreak = !!cur.breakMoment

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πού σπάει ο Dijkstra — μία αρνητική ακμή φτάνει
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            isBreak
              ? 'bg-danger/15 text-danger'
              : 'bg-accent/10 text-accent',
          )}
        >
          Βήμα {step + 1}/{LAST + 1}
          {isBreak && ' · αναλλοίωτη'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Τέσσερις κορυφές, τέσσερις ακμές, μία αρνητική. Δες πώς ο Dijkstra
        οριστικοποιεί την u πολύ νωρίς — και πληρώνει το τίμημα στην t.
      </p>

      {/* graph */}
      <div className="graph-canvas">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="dij-fail-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#5a4a4d" />
            </marker>
            <marker
              id="dij-fail-arr-neg"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
            <marker
              id="dij-fail-arr-hi"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
            </marker>
          </defs>

          {/* edges */}
          {EDGES.map((e) => {
            const g = edgePath(e)
            const isRelaxed = relaxed.has(e.id)
            const isBreakEdge = cur.breakMoment?.edge === e.id
            const isNeg = !!e.negative
            let stroke = isNeg ? '#dc2626' : '#5a4a4d'
            let width = 2
            let dash: string | undefined
            let marker = isNeg
              ? 'url(#dij-fail-arr-neg)'
              : 'url(#dij-fail-arr)'
            if (isRelaxed && !isBreakEdge) {
              stroke = '#d97706'
              width = 3.4
              marker = 'url(#dij-fail-arr-hi)'
            } else if (isBreakEdge) {
              stroke = '#dc2626'
              width = 4
              dash = '6 4'
              marker = 'url(#dij-fail-arr-neg)'
            }
            return (
              <g key={e.id}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={width}
                    strokeDasharray={dash}
                    markerEnd={marker}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width}
                    strokeDasharray={dash}
                    markerEnd={marker}
                  />
                )}
                <rect
                  x={g.mx - 14}
                  y={g.my - 10}
                  width={28}
                  height={17}
                  rx={4}
                  fill={isNeg ? '#fee2e2' : '#faf4ee'}
                  stroke={
                    isBreakEdge
                      ? '#dc2626'
                      : isRelaxed
                        ? '#d97706'
                        : isNeg
                          ? '#dc2626'
                          : '#cdbfc0'
                  }
                  strokeWidth={isRelaxed || isBreakEdge ? 2 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={isNeg ? '#b91c1c' : isRelaxed ? '#b45309' : '#5a4a4d'}
                >
                  {e.w >= 0 ? e.w : `−${Math.abs(e.w)}`}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const isFinal = cur.finalizedSet.has(n.id)
            const isCurrent = n.id === cur.extracted
            const dval = cur.d[n.id]
            const isStale =
              cur.breakMoment?.edge && n.id === 'u' && step === 2
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={NODE_R}
                  fill={isFinal ? '#d1fae5' : '#ffffff'}
                  stroke={
                    isCurrent
                      ? '#d97706'
                      : isStale
                        ? '#dc2626'
                        : isFinal
                          ? '#059669'
                          : '#9b8a8d'
                  }
                  strokeWidth={isCurrent || isStale ? 3.5 : 2.5}
                />
                <text
                  x={n.x}
                  y={n.y - 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
                <text
                  x={n.x}
                  y={n.y + 10}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontWeight={600}
                  fill="#5a4a4d"
                >
                  d={fmt(dval)}
                </text>
                {isStale && (
                  <text
                    x={n.x}
                    y={n.y - NODE_R - 8}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill="#dc2626"
                  >
                    «κλειδωμένη» — δεν ανοίγει
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {isBreak && cur.breakMoment && (
        <div className="mt-2 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-fg">
          <span className="font-semibold text-danger">
            Στιγμή της κατάρρευσης:
          </span>{' '}
          Η v→u προτείνει d[u] ={' '}
          <span className="font-mono font-bold">{cur.breakMoment.betterD}</span>,
          αλλά η u μένει κολλημένη στο <span className="font-mono">d[u] = {cur.breakMoment.staleD}</span>{' '}
          γιατί έχει ήδη βγει από την ουρά. Η βελτίωση χάνεται.
        </div>
      )}

      <div
        aria-live="polite"
        className="mt-2 min-h-[4.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {cur.note}
      </div>

      {step === LAST && (
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-danger">
              Dijkstra απαντά
            </span>
            <div className="font-mono text-base font-bold text-danger">
              d[t] = 5
            </div>
            <div className="text-xs text-fg-muted">μέσω s → u → t</div>
          </div>
          <div className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-success">
              Πραγματικά συντομότερη
            </span>
            <div className="font-mono text-base font-bold text-success">
              d[t] = 3
            </div>
            <div className="text-xs text-fg-muted">
              μέσω s → v → u → t (2 + (−3) + 4)
            </div>
          </div>
        </div>
      )}

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
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={step === LAST}
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
          Βήμα {step + 1} / {LAST + 1}
        </span>
      </div>
    </section>
  )
}
