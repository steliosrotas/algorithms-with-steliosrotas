'use client'

/**
 * StrongConnectivityViz — the two-BFS test for strong connectivity (L08).
 *
 * A directed graph is strongly connected iff every pair of vertices is
 * mutually reachable. Checking all n² pairs is wasteful; the lemma collapses
 * it to ONE arbitrary vertex s: G is strongly connected iff
 *   (1) s reaches everyone in G, and
 *   (2) s reaches everyone in Gʳᵉᵛ  (= everyone reaches s in G).
 *
 * The viz lets the student PICK s by clicking any vertex, then watch both
 * BFS runs play out level by level, with the edge-reversal shown in between.
 * Trying different s values shows the verdict never changes — the lemma made
 * tangible. A toggle flips between a strongly connected graph and one missing
 * a single back-edge. Built for L08.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type DNode = { id: string; x: number; y: number }

const NODES: DNode[] = [
  { id: '1', x: 192, y: 46 },
  { id: '2', x: 308, y: 112 },
  { id: '3', x: 308, y: 234 },
  { id: '4', x: 192, y: 300 },
  { id: '5', x: 76, y: 234 },
  { id: '6', x: 76, y: 112 },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const N = NODES.length
const R = 21
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

/** Directed 6-cycle + two chords. The cycle alone is already strongly
 *  connected; the chords just make the BFS layers branch. */
const CYCLE: [string, string][] = [
  ['1', '2'], ['2', '3'], ['3', '4'],
  ['4', '5'], ['5', '6'], ['6', '1'],
]
const CHORDS: [string, string][] = [['2', '6'], ['3', '5']]

const EDGES: Record<'strong' | 'weak', [string, string][]> = {
  strong: [...CYCLE, ...CHORDS],
  // remove the single back-edge 6→1: now nobody can return to vertex 1
  weak: [...CYCLE.filter(([a, b]) => !(a === '6' && b === '1')), ...CHORDS],
}

function adjacency(
  edges: [string, string][],
  reversed: boolean,
): Map<string, string[]> {
  const adj = new Map<string, string[]>()
  for (const n of NODES) adj.set(n.id, [])
  for (const [a, b] of edges) {
    const [from, to] = reversed ? [b, a] : [a, b]
    adj.get(from)!.push(to)
  }
  return adj
}

/** BFS from s, returned as the list of levels L₀, L₁, … */
function bfsLevels(adj: Map<string, string[]>, s: string): string[][] {
  const seen = new Set([s])
  const levels: string[][] = [[s]]
  let frontier = [s]
  while (frontier.length) {
    const next: string[] = []
    for (const u of frontier) {
      for (const v of adj.get(u) ?? []) {
        if (!seen.has(v)) {
          seen.add(v)
          next.push(v)
        }
      }
    }
    if (next.length) levels.push(next)
    frontier = next
  }
  return levels
}

type Frame = {
  graphDir: 'G' | 'Grev'
  reached: Set<string>
  frontier: Set<string>
  note: string
  cond1: boolean | null
  cond2: boolean | null
  verdict: 'pending' | 'yes' | 'no'
}

function buildFrames(which: 'strong' | 'weak', start: string): Frame[] {
  const fwd = adjacency(EDGES[which], false)
  const rev = adjacency(EDGES[which], true)
  const gLevels = bfsLevels(fwd, start)
  const gReached = new Set(gLevels.flat())
  const cond1 = gReached.size === N
  const frames: Frame[] = []

  frames.push({
    graphDir: 'G',
    reached: new Set(),
    frontier: new Set(),
    note: `Αφετηρία s = ${start}. Κάνε κλικ σε οποιαδήποτε κορυφή για να τη δοκιμάσεις ως s — το λήμμα λέει ότι κάθε επιλογή δίνει την ίδια ετυμηγορία. Πάτα «Επόμενο».`,
    cond1: null,
    cond2: null,
    verdict: 'pending',
  })

  gLevels.forEach((lvl, i) => {
    const reached = new Set(gLevels.slice(0, i + 1).flat())
    frames.push({
      graphDir: 'G',
      reached,
      frontier: new Set(lvl),
      note:
        i === 0
          ? `BFS στο G από την s = ${start}. Επίπεδο L₀ = {${start}} — η ίδια η αφετηρία.`
          : `BFS στο G, επίπεδο L${i}: ακολουθώντας τις ακμές προς τα ΕΞΩ ανακαλύπτουμε ${lvl.join(', ')}. Καλύφθηκαν ${reached.size}/${N}.`,
      cond1: null,
      cond2: null,
      verdict: 'pending',
    })
  })

  frames.push({
    graphDir: 'G',
    reached: gReached,
    frontier: new Set(),
    note: cond1
      ? `Συνθήκη 1 ✓ — από την s φτάνουμε ΚΑΘΕ κορυφή (${N}/${N}). Μένει η συνθήκη 2: φτάνεται η s από όλους;`
      : `Συνθήκη 1 ✗ — το BFS κάλυψε μόνο ${gReached.size}/${N} κορυφές. Υπάρχει κορυφή που η s ΔΕΝ τη φτάνει.`,
    cond1,
    cond2: null,
    verdict: 'pending',
  })

  if (!cond1) {
    frames.push({
      graphDir: 'G',
      reached: gReached,
      frontier: new Set(),
      note: `Αφού απέτυχε η συνθήκη 1, το G ΔΕΝ είναι ισχυρά συνεκτικό. Ο αλγόριθμος σταματά εδώ — δεν χρειάζεται καν το δεύτερο BFS.`,
      cond1,
      cond2: null,
      verdict: 'no',
    })
    return frames
  }

  frames.push({
    graphDir: 'Grev',
    reached: new Set(),
    frontier: new Set(),
    note: `Αντιστρέφουμε τη φορά ΚΑΘΕ ακμής → Gʳᵉᵛ. Στο Gʳᵉᵛ, «η s φτάνει την v» σημαίνει «στο αρχικό G η v φτάνει την s» — άρα ένα BFS εδώ ελέγχει ακριβώς τη συνθήκη 2.`,
    cond1,
    cond2: null,
    verdict: 'pending',
  })

  const revLevels = bfsLevels(rev, start)
  const revReached = new Set(revLevels.flat())
  const cond2 = revReached.size === N

  revLevels.forEach((lvl, i) => {
    const reached = new Set(revLevels.slice(0, i + 1).flat())
    frames.push({
      graphDir: 'Grev',
      reached,
      frontier: new Set(lvl),
      note:
        i === 0
          ? `BFS στο Gʳᵉᵛ από την ίδια s = ${start}. Επίπεδο L₀ = {${start}}.`
          : `BFS στο Gʳᵉᵛ, επίπεδο L${i}: φτάνουμε ${lvl.join(', ')}. Καλύφθηκαν ${reached.size}/${N}.`,
      cond1,
      cond2: null,
      verdict: 'pending',
    })
  })

  frames.push({
    graphDir: 'Grev',
    reached: revReached,
    frontier: new Set(),
    note: cond2
      ? `Συνθήκη 2 ✓ — στο Gʳᵉᵛ η s φτάνει τους πάντες, άρα στο αρχικό G οι πάντες φτάνουν την s (${N}/${N}).`
      : `Συνθήκη 2 ✗ — στο Gʳᵉᵛ το BFS κάλυψε μόνο ${revReached.size}/${N}. Υπάρχει κορυφή που ΔΕΝ φτάνει την s.`,
    cond1,
    cond2,
    verdict: 'pending',
  })

  frames.push({
    graphDir: 'Grev',
    reached: revReached,
    frontier: new Set(),
    note: cond2
      ? `Ισχύουν ΚΑΙ οι δύο συνθήκες. Άρα κάθε ζεύγος κορυφών u, v συνδέεται αμφίδρομα μέσω της s (u → s → v και v → s → u). Το G ΕΙΝΑΙ ισχυρά συνεκτικό.`
      : `Η συνθήκη 1 ίσχυε, αλλά η 2 όχι. Άρα το G ΔΕΝ είναι ισχυρά συνεκτικό.`,
    cond1,
    cond2,
    verdict: cond2 ? 'yes' : 'no',
  })
  return frames
}

/**
 * Collision-aware edge routing: returns a straight segment trimmed to the
 * node borders (the steady-state case for this 6-node directed layout) or a
 * quadratic Bezier that bends around an unrelated node, also trimmed so the
 * arrowhead lands on the target border. Locks out the «edge through unrelated
 * node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: DNode, b: DNode) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  return trimEdgeGeom(geom, a.x, a.y, R + 2, b.x, b.y, R + 2)
}

function CondPill({
  n,
  label,
  state,
}: {
  n: number
  label: string
  state: boolean | null
}) {
  const cls =
    state === null
      ? 'border-border bg-bg-soft/50 text-fg-subtle'
      : state
        ? 'border-success/45 bg-success/10 text-success'
        : 'border-danger/45 bg-danger/10 text-danger'
  const mark = state === null ? '•' : state ? '✓' : '✗'
  return (
    <div className={cn('flex-1 rounded-lg border px-2.5 py-1.5 text-xs', cls)}>
      <div className="flex items-center gap-1.5 font-semibold">
        <span className="text-sm leading-none">{mark}</span>
        Συνθήκη {n}
      </div>
      <div className="mt-0.5 leading-snug opacity-90">{label}</div>
    </div>
  )
}

export function StrongConnectivityViz() {
  const [which, setWhich] = useState<'strong' | 'weak'>('strong')
  const [start, setStart] = useState('1')
  const [step, setStep] = useState(0)

  const frames = useMemo(() => buildFrames(which, start), [which, start])
  const last = frames.length - 1
  const f = frames[Math.min(step, last)]

  const drawEdges = EDGES[which].map(([a, b]) =>
    f.graphDir === 'Grev' ? ([b, a] as const) : ([a, b] as const),
  )
  const settled = f.frontier.size === 0 && f.reached.size > 0

  function pickStart(id: string) {
    setStart(id)
    setStep(0)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ισχυρή συνεκτικότητα — δύο BFS, στο G και στο Gʳᵉᵛ
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['strong', 'weak'] as const).map((key) => (
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
              {key === 'strong' ? 'Ισχυρά συνεκτικό' : 'Λείπει μία ακμή'}
            </button>
          ))}
        </div>
      </div>

      {/* phase + reached chips */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-bold uppercase tracking-wider',
            f.graphDir === 'G'
              ? 'bg-accent/10 text-accent'
              : 'bg-fg/10 text-fg',
          )}
        >
          {f.graphDir === 'G' ? 'Γράφημα G' : 'Γράφημα Gʳᵉᵛ (αντεστραμμένο)'}
        </span>
        <span className="rounded-md bg-bg-soft px-2 py-0.5 font-medium text-fg-muted">
          Καλύφθηκαν {f.reached.size}/{N}
        </span>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 384 346"
          className="mx-auto block w-full max-w-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="sc-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#b3a3a5" />
            </marker>
            <marker
              id="sc-arr-on"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1d4ed8" />
            </marker>
          </defs>

          {/* edges */}
          {drawEdges.map(([from, to], i) => {
            const A = POS.get(from)!
            const B = POS.get(to)!
            const g = routedEdge(A, B)
            const explored = f.reached.has(from) && f.reached.has(to)
            const stroke = explored ? '#1d4ed8' : '#c9bcbe'
            const strokeWidth = explored ? 2.7 : 1.8
            const markerEnd = explored ? 'url(#sc-arr-on)' : 'url(#sc-arr)'
            return g.kind === 'line' ? (
              <line
                key={i}
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
                key={i}
                d={g.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                markerEnd={markerEnd}
              />
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const isStart = n.id === start
            const isFrontier = f.frontier.has(n.id)
            const isReached = f.reached.has(n.id)
            const isMissed = settled && !isReached
            const fill = isFrontier
              ? '#2563eb'
              : isReached
                ? '#bfdbfe'
                : '#ffffff'
            const stroke = isMissed
              ? '#dc2626'
              : isReached || isFrontier
                ? '#1d4ed8'
                : '#9b8a8d'
            return (
              <g
                key={n.id}
                onClick={() => pickStart(n.id)}
                style={{ cursor: 'pointer' }}
              >
                {isStart && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R + 10}
                    fill="none"
                    stroke="#9f1239"
                    strokeWidth={2.5}
                  />
                )}
                {isFrontier && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R + 5}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={3}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                  strokeDasharray={isMissed ? '4 3' : undefined}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill={isFrontier ? '#ffffff' : '#1c1214'}
                >
                  {n.id}
                </text>
                {isStart && (
                  <>
                    <circle
                      cx={n.x + 17}
                      cy={n.y - 18}
                      r={10}
                      fill="#9f1239"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                    <text
                      x={n.x + 17}
                      y={n.y - 18}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={700}
                      fill="#ffffff"
                    >
                      s
                    </text>
                  </>
                )}
                {isMissed && (
                  <text
                    x={n.x + 18}
                    y={n.y + 17}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={15}
                    fontWeight={700}
                    fill="#dc2626"
                  >
                    ✗
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <p className="mt-1.5 text-center text-xs text-fg-subtle">
        💡 Κάνε κλικ σε κορυφή για να αλλάξεις την αφετηρία s — η ετυμηγορία
        δεν αλλάζει.
      </p>

      {/* condition pills */}
      <div className="mt-2 flex gap-2">
        <CondPill n={1} label="η s φτάνει όλους (BFS στο G)" state={f.cond1} />
        <CondPill
          n={2}
          label="όλοι φτάνουν την s (BFS στο Gʳᵉᵛ)"
          state={f.cond2}
        />
      </div>

      {/* verdict */}
      {f.verdict !== 'pending' && (
        <div
          className={cn(
            'mt-2 rounded-lg border px-3 py-2 text-sm font-semibold',
            f.verdict === 'yes'
              ? 'border-success/40 bg-success/10 text-success'
              : 'border-danger/40 bg-danger/10 text-danger',
          )}
        >
          {f.verdict === 'yes'
            ? '✓ Το γράφημα είναι ισχυρά συνεκτικό'
            : '✗ Το γράφημα ΔΕΝ είναι ισχυρά συνεκτικό'}
        </div>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {f.note}
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
          Βήμα {Math.min(step, last)} / {last}
        </span>
      </div>
    </section>
  )
}
