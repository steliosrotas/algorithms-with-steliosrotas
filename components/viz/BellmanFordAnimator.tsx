'use client'

/**
 * BellmanFordAnimator — step Bellman-Ford round by round.
 *
 * The flagship for L17's second half. One step = one full round. The viz keeps
 * two views in sync: the M[i,v] table fills row by row, and the graph shows the
 * current distances with the edges that produced this round's improvements lit
 * up. The thing a static page cannot show: the "wave" — after round i, M[i,v]
 * is exactly the best v→t path using AT MOST i edges, so M[s] drops 20 → 10 → 6
 * as it discovers paths with one more edge each round. A final check round
 * shows convergence (and that no negative cycle exists). Built for L17 on a
 * 5-vertex graph with one negative edge and no negative cycle.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type BFNode = { id: string; x: number; y: number }
const NODES: BFNode[] = [
  { id: 's', x: 60, y: 150 },
  { id: 'a', x: 200, y: 65 },
  { id: 'b', x: 200, y: 235 },
  { id: 'c', x: 340, y: 150 },
  { id: 't', x: 470, y: 150 },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const VERTS = ['s', 'a', 'b', 'c', 't']

type BFEdge = { from: string; to: string; w: number }
const EDGES: BFEdge[] = [
  { from: 's', to: 'a', w: 5 },
  { from: 's', to: 'b', w: 12 },
  { from: 'a', to: 'b', w: 3 },
  { from: 'b', to: 'c', w: -4 },
  { from: 'c', to: 'a', w: 7 },
  { from: 'b', to: 't', w: 8 },
  { from: 'c', to: 't', w: 2 },
]
const DEST = 't'
const ROUNDS = VERTS.length - 1 // 4
const INF = Infinity
const R = 23
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

const fmt = (d: number) => (d === INF ? '∞' : String(d))

type Improvement = { v: string; oldVal: number; newVal: number; via: string }
type RoundData = { M: Record<string, number>; improvements: Improvement[] }

/** Run Bellman-Ford toward DEST, recording one RoundData per round. */
function runBF(): RoundData[] {
  const data: RoundData[] = []
  const init: Record<string, number> = {}
  for (const v of VERTS) init[v] = v === DEST ? 0 : INF
  data.push({ M: init, improvements: [] })
  for (let i = 1; i <= ROUNDS; i++) {
    const prev = data[i - 1].M
    const cur: Record<string, number> = { ...prev }
    const improvements: Improvement[] = []
    for (const v of VERTS) {
      let best = prev[v]
      let bestVia: string | null = null
      for (const e of EDGES) {
        if (e.from !== v) continue
        const cand = e.w + prev[e.to]
        if (cand < best) {
          best = cand
          bestVia = e.to
        }
      }
      if (bestVia !== null && best < prev[v]) {
        cur[v] = best
        improvements.push({ v, oldVal: prev[v], newVal: best, via: bestVia })
      }
    }
    data.push({ M: cur, improvements })
  }
  return data
}

/**
 * Collision-aware edge routing: returns a straight segment trimmed to the
 * node borders (the steady-state case for this 5-node directed layout) or a
 * quadratic Bezier that bends around an unrelated node, also trimmed so the
 * arrowhead lands on the target border. The `mx, my` fields anchor the weight
 * label at the centerline midpoint for lines and at the Bezier midpoint
 * `(P0 + 2Q + P2) / 4` for curves. Locks out the «edge through unrelated
 * node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: BFNode, b: BFNode) {
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

/** "wave" notes — what M[s] means after each round. */
const WAVE: Record<number, string> = {
  1: ' Η πληροφορία ξεκίνησε από το t και απλώθηκε μία ακμή μακριά — στο b και στο c.',
  2: ' Το M[s] = 20 είναι το καλύτερο s→t μονοπάτι με ≤ 2 ακμές: s→b→t.',
  3: ' Το M[s] = 10 είναι το καλύτερο s→t μονοπάτι με ≤ 3 ακμές: s→b→c→t.',
  4: ' Το M[s] = 6 είναι το καλύτερο s→t μονοπάτι με ≤ 4 ακμές: s→a→b→c→t — η τελική απάντηση.',
}

const LAST = ROUNDS + 1 // step 5 = the convergence-check round

export function BellmanFordAnimator() {
  const data = useMemo(() => runBF(), [])
  const [step, setStep] = useState(0)

  const rowIdx = Math.min(step, ROUNDS) // the M row currently in focus
  const M = data[rowIdx].M
  const improvements =
    step >= 1 && step <= ROUNDS ? data[step].improvements : []
  const improvedSet = new Set(improvements.map((im) => im.v))
  const viaEdges = new Set(improvements.map((im) => `${im.v}->${im.via}`))

  let note: string
  if (step === 0) {
    note =
      'Αρχικοποίηση (γύρος 0). M[0, t] = 0 — η t απέχει 0 από τον εαυτό της. Κάθε άλλη κορυφή ∞: δεν υπάρχει ακόμη μονοπάτι με 0 ακμές.'
  } else if (step <= ROUNDS) {
    const list = improvements
      .map(
        (im) =>
          `${im.v}: ${fmt(im.oldVal)} → ${fmt(im.newVal)} (μέσω ${im.v}→${im.via})`,
      )
      .join(' · ')
    note =
      `Γύρος ${step}. Κάθε κορυφή δοκιμάζει να βελτιωθεί μέσω μιας εξερχόμενης ακμής, διαβάζοντας τις τιμές του γύρου ${step - 1}. Βελτιώθηκαν — ${list}.` +
      (WAVE[step] ?? '')
  } else {
    note =
      'Γύρος ελέγχου. Καμία τιμή δεν αλλάζει πια → ο πίνακας έχει συγκλίνει, και αφού τίποτα δεν μειώθηκε δεν υπάρχει αρνητικός κύκλος. Συντομότερη απόσταση s→t = 6, μέσω s→a→b→c→t.'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Bellman-Ford βήμα-βήμα — οι γύροι γεμίζουν τον πίνακα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === 0
            ? 'Γύρος 0'
            : step === LAST
              ? 'Συντομότερη s→t = 6'
              : `Γύρος ${step} / ${ROUNDS}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Ζητάμε τις συντομότερες αποστάσεις προς το{' '}
        <span className="font-semibold text-accent">t</span>. M[i, v] = καλύτερο
        v→t μονοπάτι με ≤ i ακμές.
      </p>

      {/* graph */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 530 290"
          className="mx-auto block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="bf-arr"
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
              id="bf-arr-hi"
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

          {/* edges */}
          {EDGES.map((e, i) => {
            const A = POS.get(e.from)!
            const B = POS.get(e.to)!
            const g = routedEdge(A, B)
            const hot = viaEdges.has(`${e.from}->${e.to}`)
            const neg = e.w < 0
            const stroke = hot ? '#9f1239' : '#9b8a8d'
            const strokeWidth = hot ? 3.4 : 1.8
            const markerEnd = hot ? 'url(#bf-arr-hi)' : 'url(#bf-arr)'
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
                  x={g.mx - 12}
                  y={g.my - 10}
                  width={24}
                  height={18}
                  rx={3.5}
                  fill={neg ? '#fee2e2' : '#faf4ee'}
                  stroke={neg ? '#dc2626' : hot ? '#9f1239' : '#cdbfc0'}
                />
                <text
                  x={g.mx}
                  y={g.my}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={700}
                  fill={neg ? '#dc2626' : '#1c1214'}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const improved = improvedSet.has(n.id)
            const isDest = n.id === DEST
            const fill = isDest ? '#fde2e4' : '#ffffff'
            const stroke = improved ? '#9f1239' : isDest ? '#9f1239' : '#9b8a8d'
            const labelAbove = n.id !== 'b'
            const ly = labelAbove ? n.y - R - 16 : n.y + R + 16
            return (
              <g key={n.id}>
                {improved && (
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
                  strokeWidth={2.6}
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
                {/* distance label */}
                <rect
                  x={n.x - 24}
                  y={ly - 10}
                  width={48}
                  height={20}
                  rx={4}
                  fill={improved ? '#fef3c7' : '#faf4ee'}
                  stroke={improved ? '#d97706' : '#cdbfc0'}
                />
                <text
                  x={n.x}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11.5}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  M={fmt(M[n.id])}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* the M table */}
      <div className="mt-3 overflow-x-auto">
        <div
          className="grid w-fit gap-1 font-mono"
          style={{ gridTemplateColumns: '3.4rem repeat(5, 3rem)' }}
        >
          {/* header */}
          <div className="flex h-8 items-center justify-center text-[0.68rem] font-semibold text-fg-subtle">
            M[i,v]
          </div>
          {VERTS.map((v) => (
            <div
              key={`h${v}`}
              className={cn(
                'flex h-8 items-center justify-center text-sm font-bold',
                v === DEST ? 'text-accent' : 'text-fg',
              )}
            >
              {v}
            </div>
          ))}
          {/* rows */}
          {data.map((rd, i) => {
            const revealed = i <= rowIdx
            return (
              <div key={`r${i}`} className="contents">
                <div
                  className={cn(
                    'flex h-10 items-center justify-center rounded text-xs font-bold',
                    i === rowIdx
                      ? 'bg-accent/15 text-accent'
                      : 'text-fg-subtle',
                  )}
                >
                  i={i}
                </div>
                {VERTS.map((v) => {
                  const improved =
                    revealed &&
                    i === step &&
                    step >= 1 &&
                    step <= ROUNDS &&
                    improvedSet.has(v)
                  const isAnswer =
                    i === ROUNDS && v === 's' && step >= ROUNDS
                  let cls =
                    'border-border bg-bg-soft/40 text-fg-muted'
                  if (!revealed)
                    cls = 'border-dashed border-border text-transparent'
                  else if (isAnswer)
                    cls = 'border-success bg-success/25 font-bold text-fg'
                  else if (improved)
                    cls = 'border-accent bg-accent/25 font-bold text-fg'
                  else if (i === rowIdx)
                    cls = 'border-accent/40 bg-accent/5 text-fg'
                  return (
                    <div
                      key={`${i}-${v}`}
                      className={cn(
                        'flex h-10 items-center justify-center rounded border text-sm',
                        cls,
                      )}
                    >
                      {revealed ? fmt(rd.M[v]) : '·'}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-fg-subtle">
        Πορτοκαλί = βελτιώθηκε σε αυτόν τον γύρο · πράσινο = η τελική απόσταση
        s→t.
      </p>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
          {step < ROUNDS
            ? 'Επόμενος γύρος'
            : step === ROUNDS
              ? 'Γύρος ελέγχου'
              : 'Επόμενο'}
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
