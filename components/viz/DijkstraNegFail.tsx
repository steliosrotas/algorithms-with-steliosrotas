'use client'

/**
 * DijkstraNegFail — watch Dijkstra finalize a vertex too early.
 *
 * Dijkstra's whole correctness rests on one promise: the moment a vertex is
 * extracted (the smallest tentative distance), that distance is final and
 * the vertex is never revisited. A negative edge breaks the promise. This viz
 * steps through the smallest possible counterexample — s, t, u with edges
 * s→u = 1, s→t = 2, t→u = −5. Dijkstra locks u at distance 1; later it finds
 * t→u would give −3, but u is already locked, so the improvement is thrown
 * away. The student sees the lock snap shut, then sees the better path arrive
 * too late. The L17 analogue of WhyBFSFailsWeighted. Built for L17.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type DNode = { id: string; x: number; y: number }
const S: DNode = { id: 's', x: 72, y: 160 }
const T: DNode = { id: 't', x: 268, y: 74 }
const U: DNode = { id: 'u', x: 268, y: 246 }
const NODES = [S, T, U]
const R = 25
const INF = Infinity
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

const fmt = (d: number) => (d === INF ? '∞' : String(d))

/**
 * Collision-aware edge routing: returns a straight segment trimmed to the
 * node borders (the steady-state case for this 3-node directed layout) or a
 * quadratic Bezier that bends around an unrelated node, also trimmed so the
 * arrowhead lands on the target border. The `mx, my` fields anchor the weight
 * label at the centerline midpoint for lines and at the Bezier midpoint
 * `(P0 + 2Q + P2) / 4` for curves. Locks out the «edge through unrelated
 * node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: DNode, b: DNode) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  const trimmed = trimEdgeGeom(geom, a.x, a.y, R, b.x, b.y, R)
  if (trimmed.kind === 'curve') {
    return {
      ...trimmed,
      mx: (a.x + 2 * trimmed.cx + b.x) / 4,
      my: (a.y + 2 * trimmed.cy + b.y) / 4,
    }
  }
  return { ...trimmed, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }
}

/** A tiny padlock drawn at (x, y) — the node-is-finalized marker. */
function Padlock({ x, y }: { x: number; y: number }) {
  return (
    <g aria-hidden="true">
      <path
        d={`M ${x - 5} ${y - 1} v -3.5 a 5 5 0 0 1 10 0 v 3.5`}
        fill="none"
        stroke="#7e1031"
        strokeWidth={2.2}
      />
      <rect
        x={x - 7.5}
        y={y - 1}
        width={15}
        height={11}
        rx={2.4}
        fill="#9f1239"
      />
    </g>
  )
}

const LAST = 4

export function DijkstraNegFail() {
  const [step, setStep] = useState(0)

  // distances, finalized set, current extracted vertex per step
  const dist: Record<string, number> =
    step === 0
      ? { s: 0, t: INF, u: INF }
      : { s: 0, t: 2, u: 1 }
  const finalized = new Set(
    step >= 3 ? ['s', 't', 'u'] : step === 2 ? ['s', 'u'] : step === 1 ? ['s'] : [],
  )
  const extracted = step === 1 ? 's' : step === 2 ? 'u' : step === 3 ? 't' : null
  const showFail = step >= 3 // the t→u relaxation that comes too late

  let note: string
  if (step === 0) {
    note =
      'Αρχικοποίηση: d(s) = 0, d(t) = d(u) = ∞. Καμία κορυφή δεν είναι οριστική. Ο Dijkstra θα εξάγει κάθε φορά την κορυφή με το μικρότερο d.'
  } else if (step === 1) {
    note =
      'Εξάγουμε το s (d = 0) και το οριστικοποιούμε. Χαλαρώνουμε τις ακμές του: d(t) = 0 + 2 = 2 και d(u) = 0 + 1 = 1.'
  } else if (step === 2) {
    note =
      'Ποια κορυφή έχει το μικρότερο d; Το u με d = 1 (το t έχει 2). Ο Dijkstra εξάγει το u και το ΟΡΙΣΤΙΚΟΠΟΙΕΙ — το κλειδώνει. Υπόσχεται: «η απόσταση του u είναι 1, τελείωσε».'
  } else if (step === 3) {
    note =
      'Εξάγουμε το t (d = 2) και χαλαρώνουμε την ακμή t→u: 2 + (−5) = −3. Το −3 είναι μικρότερο από το 1 — θα ήταν συντομότερη διαδρομή! Αλλά το u είναι ήδη κλειδωμένο· ο Dijkstra δεν το ξανακοιτάζει. Η βελτίωση χάνεται.'
  } else {
    note =
      'Ο Dijkstra τερματίζει και απαντά d(u) = 1. Λάθος: η πραγματικά συντομότερη διαδρομή είναι s→t→u με κόστος 2 + (−5) = −3. Μια αρνητική ακμή κατέρριψε την υπόθεση «μόλις οριστικοποιήσω μια κορυφή, τελείωσε».'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γιατί ο Dijkstra αποτυγχάνει με αρνητική ακμή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === 0
            ? 'Αρχή'
            : step === LAST
              ? 'Λάθος αποτέλεσμα'
              : `Εξάγεται: ${extracted}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Πράσινο = οριστικοποιημένη (κλειδωμένη) · κόκκινο = εξάγεται τώρα.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 440 322"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="dnf-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id="dnf-arr-red"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
          </defs>

          {/* edges */}
          {(
            [
              { a: S, b: T, w: 2, id: 'st' },
              { a: S, b: U, w: 1, id: 'su' },
              { a: T, b: U, w: -5, id: 'tu' },
            ] as const
          ).map(({ a, b, w, id }) => {
            const g = routedEdge(a, b)
            const failEdge = id === 'tu' && showFail
            const litByS =
              step >= 1 && (id === 'st' || id === 'su') && a.id === 's'
            const hot = failEdge || (step === 1 && litByS)
            const stroke = failEdge ? '#dc2626' : hot ? '#9f1239' : '#9b8a8d'
            const strokeWidth = hot ? 3.4 : 2
            const markerEnd = failEdge ? 'url(#dnf-arr-red)' : 'url(#dnf-arr)'
            return (
              <g key={id}>
                {g.kind === 'line' ? (
                  <line
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
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                  />
                )}
                <rect
                  x={g.mx - 13}
                  y={g.my - 11}
                  width={26}
                  height={20}
                  rx={4}
                  fill="#faf4ee"
                  stroke={failEdge ? '#dc2626' : hot ? '#9f1239' : '#cdbfc0'}
                />
                <text
                  x={g.mx}
                  y={g.my}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill={failEdge ? '#dc2626' : '#5a4a4d'}
                >
                  {w}
                </text>
              </g>
            )
          })}

          {/* the rejected −3 improvement */}
          {showFail && (
            <g>
              <rect
                x={U.x + 30}
                y={U.y - 26}
                width={120}
                height={48}
                rx={6}
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth={1.6}
              />
              <text
                x={U.x + 90}
                y={U.y - 9}
                textAnchor="middle"
                fontSize={11.5}
                fontWeight={700}
                fill="#dc2626"
              >
                2 + (−5) = −3
              </text>
              <text
                x={U.x + 90}
                y={U.y + 11}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="#b91c1c"
              >
                u κλειδωμένο → αγνοείται
              </text>
            </g>
          )}

          {/* nodes */}
          {NODES.map((n) => {
            const isExtracted = n.id === extracted
            const isFinal = finalized.has(n.id) && !isExtracted
            const fill = isExtracted
              ? '#9f1239'
              : isFinal
                ? '#d1fae5'
                : '#ffffff'
            const stroke = isExtracted
              ? '#7e1031'
              : isFinal
                ? '#059669'
                : '#9b8a8d'
            const txt = isExtracted ? '#ffffff' : '#1c1214'
            const badVictim = n.id === 'u' && showFail
            // distance label position: s above-left, t above, u below
            const lx = n.x
            const ly = n.id === 'u' ? n.y + R + 16 : n.y - R - 19
            return (
              <g key={n.id}>
                {badVictim && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R + 6}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.6}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill={txt}
                >
                  {n.id}
                </text>
                {finalized.has(n.id) && (
                  <Padlock x={n.x + R - 4} y={n.y - R + 2} />
                )}
                {/* distance label */}
                <rect
                  x={lx - 22}
                  y={ly - 10}
                  width={44}
                  height={20}
                  rx={4}
                  fill="#faf4ee"
                  stroke="#cdbfc0"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11.5}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  d={fmt(dist[n.id])}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* the two paths, once the failure is on screen */}
      {step >= 3 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-warn/50 bg-warn/10 px-3 py-2 text-sm">
            <div className="font-semibold text-fg">Η απάντηση του Dijkstra</div>
            <div className="mt-0.5 font-mono text-fg-muted">
              s → u · κόστος <span className="font-bold text-fg">1</span>
            </div>
          </div>
          <div className="rounded-lg border border-success/50 bg-success/10 px-3 py-2 text-sm">
            <div className="font-semibold text-fg">Η πραγματική συντομότερη</div>
            <div className="mt-0.5 font-mono text-fg-muted">
              s → t → u · κόστος{' '}
              <span className="font-bold text-fg">−3</span>
            </div>
          </div>
        </div>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
          Βήμα {step} / {LAST}
        </span>
      </div>
    </section>
  )
}
