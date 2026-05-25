'use client'

/**
 * GreedyVsDpRelaxation — Dijkstra (commit-and-forget) vs Bellman-Ford (re-read-
 * and-revisit), shown side-by-side on the same toy graph.
 *
 * Pt4-Th1.3 is the T/F «Ο Bellman-Ford είναι άπληστος;». The textbook answer is
 * "no, it's DP" but the *reason* — and the reason a student gets the question
 * wrong — is that the two algorithms LOOK similar (both relax edges). The
 * difference is mechanical: Dijkstra extracts the minimum-tentative-distance
 * vertex, LOCKS it, never revisits — a single irrevocable commitment per step
 * (the greedy signature). Bellman-Ford rebuilds M[i,v] from M[i-1,*] every
 * round — each vertex's value is REREAD and possibly RE-COMPUTED across the
 * full table (the DP signature).
 *
 * This viz puts both on the same 4-vertex/all-positive-weights graph (so they
 * agree on the answer, which is the only thing that confuses students into
 * thinking they're the same algorithm). 5 unified steps:
 *   0 = init
 *   1 = Dijkstra extracts s + BF round 1
 *   2 = Dijkstra extracts a + BF round 2
 *   3 = Dijkstra extracts b + BF round 3 (= n−1, BF done)
 *   4 = Dijkstra extracts t + BF unchanged (already converged)
 *
 * Built for L17 problem pt4-th1-q3.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type GDNode = { id: string; x: number; y: number }
const NODES: GDNode[] = [
  { id: 's', x: 60, y: 110 },
  { id: 'a', x: 175, y: 50 },
  { id: 'b', x: 175, y: 170 },
  { id: 't', x: 290, y: 110 },
]
const VERTS = ['s', 'a', 'b', 't']

type GDEdge = { from: string; to: string; w: number }
const EDGES: GDEdge[] = [
  { from: 's', to: 'a', w: 1 },
  { from: 's', to: 'b', w: 4 },
  { from: 'a', to: 'b', w: 2 },
  { from: 'a', to: 't', w: 8 },
  { from: 'b', to: 't', w: 3 },
]
const R = 21
const INF = Infinity
const fmt = (d: number) => (d === INF ? '∞' : String(d))

const NODE_RECTS: NodeRect[] = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r]))

function routedEdge(aId: string, bId: string) {
  const aRect = NODE_RECT_BY_ID.get(aId)!
  const bRect = NODE_RECT_BY_ID.get(bId)!
  const ax = aRect.x + aRect.w / 2
  const ay = aRect.y + aRect.h / 2
  const bx = bRect.x + bRect.w / 2
  const by = bRect.y + bRect.h / 2
  const geom = trimEdgeGeom(routeEdge(aRect, bRect, NODE_RECTS), ax, ay, R, bx, by, R)
  const mx = geom.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * geom.cx) / 4
  const my = geom.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * geom.cy) / 4
  return { ...geom, mx, my }
}

/* ------------------------------------------------------------------ */
/* Pre-computed traces for both algorithms.                            */
/* ------------------------------------------------------------------ */

// Dijkstra: 4 extractions in order s, a, b, t.
type DijkstraStep = {
  extracted: string | null
  dist: Record<string, number>
  locked: string[]
  relaxedEdges: Array<{ from: string; to: string; oldVal: number; newVal: number }>
}
const DIJKSTRA: DijkstraStep[] = [
  // step 0: init
  {
    extracted: null,
    dist: { s: 0, a: INF, b: INF, t: INF },
    locked: [],
    relaxedEdges: [],
  },
  // step 1: extract s → relax s→a, s→b
  {
    extracted: 's',
    dist: { s: 0, a: 1, b: 4, t: INF },
    locked: ['s'],
    relaxedEdges: [
      { from: 's', to: 'a', oldVal: INF, newVal: 1 },
      { from: 's', to: 'b', oldVal: INF, newVal: 4 },
    ],
  },
  // step 2: extract a (smallest tentative=1) → relax a→b (4 → 3), a→t (INF → 9)
  {
    extracted: 'a',
    dist: { s: 0, a: 1, b: 3, t: 9 },
    locked: ['s', 'a'],
    relaxedEdges: [
      { from: 'a', to: 'b', oldVal: 4, newVal: 3 },
      { from: 'a', to: 't', oldVal: INF, newVal: 9 },
    ],
  },
  // step 3: extract b (smallest tentative=3) → relax b→t (9 → 6)
  {
    extracted: 'b',
    dist: { s: 0, a: 1, b: 3, t: 6 },
    locked: ['s', 'a', 'b'],
    relaxedEdges: [{ from: 'b', to: 't', oldVal: 9, newVal: 6 }],
  },
  // step 4: extract t → no outgoing, done
  {
    extracted: 't',
    dist: { s: 0, a: 1, b: 3, t: 6 },
    locked: ['s', 'a', 'b', 't'],
    relaxedEdges: [],
  },
]

// BF (from s, ≤ i edges to v): n-1 = 3 rounds; step 0 = init.
type BFRow = Record<string, number>
const BF: BFRow[] = [
  // i = 0
  { s: 0, a: INF, b: INF, t: INF },
  // i = 1
  { s: 0, a: 1, b: 4, t: INF },
  // i = 2
  { s: 0, a: 1, b: 3, t: 7 },
  // i = 3 — final
  { s: 0, a: 1, b: 3, t: 6 },
]

// Per round, which vertex(es) improved AND the rule that produced the new value.
type BFImprovement = { v: string; via: string; through: string }
const BF_IMPS: BFImprovement[][] = [
  [], // round 0
  // round 1: a via s→a; b via s→b
  [
    { v: 'a', via: 'M[0,s] + 1', through: 's→a' },
    { v: 'b', via: 'M[0,s] + 4', through: 's→b' },
  ],
  // round 2: b via a→b (3 < 4); t via b→t with M[1,b]=4 → 7
  [
    { v: 'b', via: 'M[1,a] + 2', through: 'a→b' },
    { v: 't', via: 'M[1,b] + 3', through: 'b→t' },
  ],
  // round 3: t via b→t with M[2,b]=3 → 6
  [{ v: 't', via: 'M[2,b] + 3', through: 'b→t' }],
]

// For step 4 (which extends Dijkstra), BF stays at row 3.
const LAST_STEP = 4

/** Mini graph SVG, shared by both panels. Highlights vary by side. */
function MiniGraph({
  highlightedEdges,
  vertexState,
  panel,
}: {
  highlightedEdges: Set<string>
  vertexState: Record<string, 'locked' | 'extract' | 'improved' | 'idle'>
  panel: 'dijkstra' | 'bf'
}) {
  const accent = panel === 'dijkstra' ? '#0f766e' : '#9f1239'
  const markerHi =
    panel === 'dijkstra' ? 'url(#gd-arr-d)' : 'url(#gd-arr-b)'

  return (
    <svg
      viewBox="0 0 350 220"
      className="block w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="gd-arr"
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
          id="gd-arr-d"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e" />
        </marker>
        <marker
          id="gd-arr-b"
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
        const g = routedEdge(e.from, e.to)
        const hot = highlightedEdges.has(`${e.from}->${e.to}`)
        const stroke = hot ? accent : '#9b8a8d'
        const strokeWidth = hot ? 3.2 : 1.6
        const markerEnd = hot ? markerHi : 'url(#gd-arr)'
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
              x={g.mx - 9}
              y={g.my - 9}
              width={18}
              height={16}
              rx={3}
              fill="#faf4ee"
              stroke={hot ? accent : '#cdbfc0'}
            />
            <text
              x={g.mx}
              y={g.my - 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={10}
              fontWeight={700}
              fill="#1c1214"
            >
              {e.w}
            </text>
          </g>
        )
      })}

      {NODES.map((n) => {
        const state = vertexState[n.id] ?? 'idle'
        const fill =
          state === 'extract'
            ? panel === 'dijkstra'
              ? '#bbf7d0'
              : '#fecdd3'
            : state === 'locked'
              ? '#d1fae5'
              : state === 'improved'
                ? '#fef3c7'
                : '#ffffff'
        const stroke =
          state === 'extract'
            ? accent
            : state === 'locked'
              ? '#0f766e'
              : state === 'improved'
                ? '#d97706'
                : '#9b8a8d'
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={R}
              fill={fill}
              stroke={stroke}
              strokeWidth={state === 'idle' ? 1.8 : 2.6}
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
              {n.id}
            </text>
            {state === 'locked' && (
              <g transform={`translate(${n.x + R - 4} ${n.y - R - 2})`}>
                <circle r={7} fill="#0f766e" />
                <text
                  x={0}
                  y={1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={9}
                  fontWeight={900}
                  fill="white"
                >
                  ✓
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function GreedyVsDpRelaxation() {
  const [step, setStep] = useState(0)
  const djk = DIJKSTRA[Math.min(step, DIJKSTRA.length - 1)]
  const bfRow = Math.min(step, BF.length - 1)
  const bfImps = BF_IMPS[Math.min(step, BF_IMPS.length - 1)]

  // edges to highlight per panel
  const djkEdges = new Set(
    djk.relaxedEdges.map((e) => `${e.from}->${e.to}`),
  )
  const bfEdges = new Set(bfImps.map((im) => im.through))

  // per-panel vertex coloring
  const djkVState: Record<string, 'locked' | 'extract' | 'idle'> = {}
  for (const v of djk.locked) djkVState[v] = 'locked'
  if (djk.extracted) djkVState[djk.extracted] = 'extract'

  const bfVState: Record<string, 'improved' | 'idle'> = {}
  for (const im of bfImps) bfVState[im.v] = 'improved'

  // step narration
  const narration: { d: string; b: string; contrast: string } = (() => {
    if (step === 0) {
      return {
        d: 'Αρχικοποίηση. d[s] = 0, όλες οι άλλες αποστάσεις ∞. Καμία κορυφή δεν είναι κλειδωμένη.',
        b: 'Αρχικοποίηση. M[0, s] = 0, όλες οι άλλες ∞. Η γραμμή 0 του πίνακα είναι έτοιμη — από εδώ θα διαβάσουμε στον γύρο 1.',
        contrast:
          'Διαφορά εκκίνησης: ο Dijkstra ξεκινάει με μία ουρά προτεραιότητας· ο Bellman-Ford γεμίζει ΟΛΟΚΛΗΡΗ τη γραμμή M[0] του πίνακα.',
      }
    }
    if (step === 1) {
      return {
        d: 'Εξάγουμε s (d = 0, μικρότερο της ουράς) και ΤΟ ΚΛΕΙΔΩΝΟΥΜΕ — δηλώνουμε ότι το d[s] = 0 είναι ΟΡΙΣΤΙΚΟ. Χαλαρώνουμε τις εξερχόμενες ακμές: d[a] = 1, d[b] = 4.',
        b: 'Γύρος 1. Διαβάζουμε ΟΛΟΚΛΗΡΗ τη γραμμή M[0] και υπολογίζουμε ολόκληρη τη γραμμή M[1]. Βελτιώθηκαν a (∞ → 1) και b (∞ → 4) — κανείς δεν κλειδώνει.',
        contrast:
          'Το ίδιο νούμερο, δύο δομές: ο Dijkstra «επιλέγει + κλειδώνει» μία κορυφή· ο Bellman-Ford «γράφει μια ολόκληρη γραμμή» χωρίς δεσμεύσεις.',
      }
    }
    if (step === 2) {
      return {
        d: 'Εξάγουμε a (d = 1, νέο ελάχιστο). Κλειδώνει. Χαλαρώνουμε a→b (4 → 3) και a→t (∞ → 9). Σημείωσε ότι το b ΑΛΛΑΖΕΙ ΤΩΡΑ — δεν είχε ακόμα κλειδωθεί.',
        b: 'Γύρος 2. Διαβάζουμε τη γραμμή M[1] και γράφουμε τη γραμμή M[2]. Το M[2, b] = M[1, a] + 2 = 3 — δηλαδή το b ΥΠΟΛΟΓΙΣΤΗΚΕ ΑΠΟ ΤΗΝ ΑΡΧΗ, διαβάζοντας ξανά τη γραμμή M[1]. Το M[2, t] = 7 (μέσω b→t με M[1,b]=4).',
        contrast:
          'Εδώ φαίνεται η διαφορά: ο Dijkstra ΑΛΛΑΞΕ την τρέχουσα τιμή του b επειδή δεν είχε κλειδωθεί ακόμα — ένα update μόνο. Ο Bellman-Ford ΞΑΝΑΫΠΟΛΟΓΙΣΕ ολόκληρη τη γραμμή — αν το a είχε αρνητική ακμή, η εκτίμηση του ΟΛΟΥ θα ξαναγραφόταν.',
      }
    }
    if (step === 3) {
      return {
        d: 'Εξάγουμε b (d = 3). Κλειδώνει. Χαλαρώνουμε b→t (9 → 6).',
        b: 'Γύρος 3 (n − 1, τελευταίος). Γράφουμε τη γραμμή M[3]. Το M[3, t] = M[2, b] + 3 = 6 — διαβάζοντας πάλι την προηγούμενη γραμμή. Η τιμή του b έχει ξαναγραφτεί ολόκληρη, χωρίς κανείς να την έχει «κλειδώσει» πουθενά.',
        contrast:
          'Ο Dijkstra έκανε τρεις αμετάκλητες δεσμεύσεις (s, a, b) μέχρι τώρα. Ο Bellman-Ford έχει αναθεωρήσει ΤΡΕΙΣ φορές το ΙΔΙΟ διάνυσμα — αυτό είναι DP.',
      }
    }
    return {
      d: 'Εξάγουμε t (d = 6). Κλειδώνει. Τέλος του Dijkstra: 4 εξαγωγές, 4 αμετάκλητες δεσμεύσεις.',
      b: 'Ο πίνακας έχει συγκλίνει στη γραμμή 3. Καμία επόμενη γραμμή δεν θα είχε διαφορά (n − 1 αρκούν).',
      contrast:
        'Τελικό σκορ ίδιο (d[t] = 6) — αλλά η μηχανική διαφορετική: 4 ΕΞΑΓΩΓΕΣ-και-ΚΛΕΙΔΩΣΕΙΣ (greedy commitments) vs 3 ΓΡΑΜΜΕΣ ΠΟΥ ΞΑΝΑΓΡΑΦΟΥΝ ΟΛΕΣ ΤΙΣ ΤΙΜΕΣ ΑΠΟ ΤΗΝ ΠΡΟΗΓΟΥΜΕΝΗ (DP).',
    }
  })()

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Greedy ή DP; Dijkstra (αριστερά) vs Bellman-Ford (δεξιά), ίδιο γράφημα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Βήμα {step} / {LAST_STEP}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Πηγή: <span className="font-semibold">s</span>. Ίδιος προορισμός, ίδιο
        τελικό αποτέλεσμα (d[t] = 6) — μηχανισμός εντελώς διαφορετικός.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* ============================== DIJKSTRA ============================== */}
        <div className="rounded-lg border border-emerald-300/50 bg-emerald-50/40 p-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Dijkstra · greedy
            </span>
            <span className="text-[0.65rem] text-emerald-700">
              «extract-min + lock»
            </span>
          </div>
          <div className="graph-canvas overflow-x-auto">
            <MiniGraph
              highlightedEdges={djkEdges}
              vertexState={djkVState}
              panel="dijkstra"
            />
          </div>
          {/* Distance vector + locked badges */}
          <div className="mt-2 grid grid-cols-4 gap-1 font-mono text-xs">
            {VERTS.map((v) => {
              const isLocked = djk.locked.includes(v)
              const isExtracted = djk.extracted === v
              return (
                <div
                  key={`djk-${v}`}
                  className={cn(
                    'flex flex-col items-center rounded border px-1 py-1',
                    isExtracted
                      ? 'border-emerald-500 bg-emerald-200 font-bold'
                      : isLocked
                        ? 'border-emerald-500 bg-emerald-100'
                        : 'border-border bg-bg-soft/40',
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-fg">{v}</span>
                    {isLocked && (
                      <Lock
                        className="h-2.5 w-2.5 text-emerald-700"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="text-fg-muted">{fmt(djk.dist[v])}</div>
                </div>
              )
            })}
          </div>
          <p className="mt-2 min-h-[3.5rem] text-xs leading-relaxed text-fg-muted">
            {narration.d}
          </p>
        </div>

        {/* ============================== BELLMAN-FORD ============================== */}
        <div className="rounded-lg border border-rose-300/50 bg-rose-50/40 p-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Bellman-Ford · DP
            </span>
            <span className="text-[0.65rem] text-rose-700">
              «rewrite the next row»
            </span>
          </div>
          <div className="graph-canvas overflow-x-auto">
            <MiniGraph
              highlightedEdges={bfEdges}
              vertexState={bfVState}
              panel="bf"
            />
          </div>
          {/* M[i,v] table */}
          <div className="mt-2 overflow-x-auto">
            <div
              className="grid w-fit gap-0.5 font-mono text-xs"
              style={{ gridTemplateColumns: `2.4rem repeat(4, 2.4rem)` }}
            >
              <div className="flex h-6 items-center justify-center text-[0.6rem] font-semibold text-fg-subtle">
                M
              </div>
              {VERTS.map((v) => (
                <div
                  key={`bfh-${v}`}
                  className="flex h-6 items-center justify-center text-xs font-bold text-fg"
                >
                  {v}
                </div>
              ))}
              {BF.map((row, i) => {
                const revealed = i <= bfRow
                const isCurrent = i === bfRow
                return (
                  <div key={`bfrow-${i}`} className="contents">
                    <div
                      className={cn(
                        'flex h-7 items-center justify-center rounded text-[0.7rem] font-bold',
                        isCurrent
                          ? 'bg-rose-200 text-rose-900'
                          : 'text-fg-subtle',
                      )}
                    >
                      i={i}
                    </div>
                    {VERTS.map((v) => {
                      const improvedHere =
                        revealed && isCurrent && bfImps.some((im) => im.v === v)
                      let cls = 'border-border bg-bg-soft/40 text-fg-muted'
                      if (!revealed)
                        cls = 'border-dashed border-border text-transparent'
                      else if (improvedHere)
                        cls = 'border-rose-500 bg-rose-200 font-bold text-fg'
                      else if (isCurrent)
                        cls = 'border-rose-300 bg-rose-50 text-fg'
                      return (
                        <div
                          key={`bfc-${i}-${v}`}
                          className={cn(
                            'flex h-7 items-center justify-center rounded border text-xs',
                            cls,
                          )}
                        >
                          {revealed ? fmt(row[v]) : '·'}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
          {bfImps.length > 0 && (
            <div className="mt-1.5 space-y-0.5 text-[0.7rem] font-mono text-rose-700">
              {bfImps.map((im, k) => (
                <div key={k}>
                  M[{bfRow},{im.v}] ← {im.via} ({im.through})
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 min-h-[3.5rem] text-xs leading-relaxed text-fg-muted">
            {narration.b}
          </p>
        </div>
      </div>

      {/* contrast strip */}
      <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-900">
        <strong>Διαφορά μηχανισμού:</strong> {narration.contrast}
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
          onClick={() => setStep((s) => Math.min(LAST_STEP, s + 1))}
          disabled={step === LAST_STEP}
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
        <span className="ml-auto text-[0.7rem] font-medium text-fg-subtle">
          🟢 «κλείδωμα» = αμετάκλητη απόφαση (greedy) · 🟥 «νέα γραμμή» =
          αναθεώρηση όλων (DP)
        </span>
      </div>
    </section>
  )
}
