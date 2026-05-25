'use client'

/**
 * DirectedReachExplorer — what changes when BFS «ακολουθεί ΜΟΝΟ τις
 * εξερχόμενες ακμές» (L08).
 *
 * The prose says: "η διάσχιση επεκτείνεται φυσικά — από κορυφή u ακολουθούμε
 * μόνο τις ακμές που βγαίνουν από την u". The student nods, but the
 * consequence — that reach is now asymmetric, and that from a sink you reach
 * almost nothing — is invisible without seeing it. This viz lets the student
 * pick any source s and watch BFS sweep outward, with a tab switching
 * between
 *   • «Κατευθυνόμενο» — follow only out-edges; reach can be much smaller
 *   • «Αν ξεχάσουμε τις φορές» — undirected BFS; always reaches everything
 *
 * The graph is a clean source/sink DAG with one cross-fan: from v1 reach is
 * the whole graph (6/6), from v5 or v6 reach is just the vertex itself (1/6).
 * The same graph, same student, two click choices — and a 6× gap in the
 * verdict. The directional asymmetry stops being a definition and becomes a
 * fact about the picture.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type RNode = { id: number; x: number; y: number; label: string }
const NODES: RNode[] = [
  { id: 1, x: 200, y: 60, label: 'v1' },
  { id: 2, x: 96, y: 158, label: 'v2' },
  { id: 3, x: 304, y: 158, label: 'v3' },
  { id: 4, x: 200, y: 232, label: 'v4' },
  { id: 5, x: 110, y: 320, label: 'v5' },
  { id: 6, x: 290, y: 320, label: 'v6' },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const N = NODES.length
const R = 22
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

/** A source/sink DAG: v1 fans out to v2,v3 → v4 → v5,v6 (no back-edges). */
const EDGES: { from: number; to: number }[] = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 4, to: 6 },
]

type Mode = 'directed' | 'undirected'

function adjacency(mode: Mode): Map<number, number[]> {
  const adj = new Map<number, number[]>()
  for (const n of NODES) adj.set(n.id, [])
  for (const e of EDGES) {
    adj.get(e.from)!.push(e.to)
    if (mode === 'undirected') adj.get(e.to)!.push(e.from)
  }
  return adj
}

function bfsLevels(adj: Map<number, number[]>, s: number): number[][] {
  const seen = new Set([s])
  const levels: number[][] = [[s]]
  let frontier = [s]
  while (frontier.length) {
    const next: number[] = []
    for (const u of frontier) {
      for (const v of adj.get(u) ?? []) {
        if (!seen.has(v)) {
          seen.add(v)
          next.push(v)
        }
      }
    }
    if (next.length) levels.push(next.sort((a, b) => a - b))
    frontier = next
  }
  return levels
}

/**
 * Collision-aware edge routing: straight segment trimmed to the node borders
 * when the centerline clears every other node, or a quadratic Bezier that
 * bends around the offending node, also trimmed so the arrowhead lands on
 * the target border. The `trimPad` argument lets the ghost reverse edges
 * keep their wider visual gap (R + 8) so they sit alongside the forward
 * edge in undirected mode. Locks out the «edge through unrelated node»
 * class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: RNode, b: RNode, trimPad: number) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  return trimEdgeGeom(geom, a.x, a.y, trimPad, b.x, b.y, trimPad)
}

export function DirectedReachExplorer() {
  const [source, setSource] = useState(1)
  const [mode, setMode] = useState<Mode>('directed')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const levels = useMemo(() => bfsLevels(adjacency(mode), source), [mode, source])
  const lastStep = levels.length // 0 = nothing, levels.length = all revealed
  const reached = useMemo(() => {
    const out = new Set<number>()
    for (let i = 0; i < step; i++) for (const v of levels[i]) out.add(v)
    return out
  }, [step, levels])
  const frontier = useMemo(() => {
    if (step === 0 || step > levels.length) return new Set<number>()
    return new Set(levels[step - 1])
  }, [step, levels])

  // dual reach (the OTHER mode), so the side panel can quote the gap
  const dualLevels = useMemo(
    () => bfsLevels(adjacency(mode === 'directed' ? 'undirected' : 'directed'), source),
    [mode, source],
  )
  const dualReached = new Set(dualLevels.flat())

  // reset when source or mode changes
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [source, mode])

  useEffect(() => {
    if (!playing) return
    if (step >= lastStep) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => Math.min(lastStep, s + 1)), 700)
    return () => clearTimeout(t)
  }, [playing, step, lastStep])

  const settled = step >= lastStep && lastStep > 0

  let note: string
  if (step === 0) {
    note = `Αφετηρία s = v${source}. Πάτα «Επόμενο» ή ▶ για να αρχίσει το BFS. Στο tab «${mode === 'directed' ? 'Κατευθυνόμενο' : 'Αδιάφορη φορά'}» θα δούμε σε ποιες κορυφές φτάνουμε.`
  } else if (step <= lastStep && step <= levels.length) {
    const lvl = levels[step - 1]
    if (step === 1) {
      note = `Επίπεδο L0 = {v${source}} — η αφετηρία.`
    } else {
      const nice = lvl.map((id) => `v${id}`).join(', ')
      note =
        mode === 'directed'
          ? `Επίπεδο L${step - 1}: ακολουθώντας ΜΟΝΟ τις εξερχόμενες ακμές, ανακαλύπτουμε {${nice}}.`
          : `Επίπεδο L${step - 1}: αγνοώντας τις φορές (αμφίδρομη μετάβαση), ανακαλύπτουμε {${nice}}.`
    }
  } else {
    note = `Καλύφθηκαν ${reached.size}/${N} κορυφές.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Από πού φτάνεις πού — με και χωρίς τις φορές
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['directed', 'undirected'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                mode === m
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {m === 'directed' ? 'Κατευθυνόμενο' : 'Αδιάφορη φορά'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-xs text-fg-subtle">
        Κάνε κλικ σε οποιαδήποτε κορυφή για να την κάνεις αφετηρία s.
        Πρόσεξε πώς από ίδια s, η ίδια εικόνα δίνει εντελώς διαφορετική
        ετυμηγορία στα δύο tabs.
      </p>

      {/* phase + reached chips */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-bg-soft px-2 py-0.5 font-medium text-fg-muted">
          Αφετηρία <span className="font-bold text-fg">v{source}</span>
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-bold uppercase tracking-wider',
            mode === 'directed'
              ? 'bg-accent/10 text-accent'
              : 'bg-fg/10 text-fg',
          )}
        >
          {mode === 'directed' ? 'Κατευθυνόμενο' : 'Αδιάφορη φορά'}
        </span>
        <span className="rounded-md bg-bg-soft px-2 py-0.5 font-medium text-fg-muted">
          Φτάσαμε σε {reached.size + frontier.size}/{N}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* graph */}
        <div className="graph-canvas">
          <svg
            viewBox="0 0 400 380"
            className="mx-auto block h-auto w-full max-w-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="dr-fwd-off"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6.5"
                markerHeight="6.5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#c9c2bd" />
              </marker>
              <marker
                id="dr-fwd-on"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6.5"
                markerHeight="6.5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1d4ed8" />
              </marker>
              <marker
                id="dr-back-ghost"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6.5"
                markerHeight="6.5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#c9c2bd" />
              </marker>
            </defs>

            {/* edges: forward (real) plus, in undirected mode, ghost reverse */}
            {EDGES.map((e, i) => {
              const A = POS.get(e.from)!
              const B = POS.get(e.to)!
              const explored =
                reached.has(e.from) &&
                (reached.has(e.to) || frontier.has(e.to))
              const g = routedEdge(A, B, R + 2)
              const stroke = explored ? '#1d4ed8' : '#c9c2bd'
              const strokeWidth = explored ? 2.8 : 1.8
              const markerEnd = explored ? 'url(#dr-fwd-on)' : 'url(#dr-fwd-off)'
              return g.kind === 'line' ? (
                <line
                  key={`fwd${i}`}
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
                  key={`fwd${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={markerEnd}
                />
              )
            })}
            {mode === 'undirected' &&
              EDGES.map((e, i) => {
                const A = POS.get(e.to)!
                const B = POS.get(e.from)!
                const g = routedEdge(A, B, R + 8)
                return g.kind === 'line' ? (
                  <line
                    key={`rev${i}`}
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke="#c9c2bd"
                    strokeWidth={1.4}
                    strokeDasharray="4 3"
                    markerEnd="url(#dr-back-ghost)"
                    opacity={0.7}
                  />
                ) : (
                  <path
                    key={`rev${i}`}
                    d={g.d}
                    fill="none"
                    stroke="#c9c2bd"
                    strokeWidth={1.4}
                    strokeDasharray="4 3"
                    markerEnd="url(#dr-back-ghost)"
                    opacity={0.7}
                  />
                )
              })}

            {/* nodes */}
            {NODES.map((n) => {
              const isStart = n.id === source
              const isF = frontier.has(n.id)
              const isR = reached.has(n.id)
              const isMissed = settled && !isR
              const fill = isF
                ? '#2563eb'
                : isR
                  ? '#bfdbfe'
                  : '#ffffff'
              const stroke = isMissed
                ? '#dc2626'
                : isR || isF
                  ? '#1d4ed8'
                  : '#9b8a8d'
              return (
                <g
                  key={`n${n.id}`}
                  onClick={() => setSource(n.id)}
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
                  {isF && (
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
                    fontSize={13}
                    fontWeight={700}
                    fill={isF ? '#ffffff' : '#1c1214'}
                  >
                    {n.label}
                  </text>
                  {isStart && (
                    <>
                      <circle
                        cx={n.x + 18}
                        cy={n.y - 17}
                        r={10}
                        fill="#9f1239"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <text
                        x={n.x + 18}
                        y={n.y - 17}
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
                </g>
              )
            })}
          </svg>
          <p className="mt-1 text-center text-xs text-fg-subtle">
            💡 Κάνε κλικ σε άλλη κορυφή για άλλη αφετηρία — δοκίμασε ειδικά
            v5 ή v6 και άλλαξε tab.
          </p>
        </div>

        {/* side panel */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                'rounded-lg border px-2 py-1.5',
                mode === 'directed'
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-border bg-bg-soft/40',
              )}
            >
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                Κατευθυνόμενο
              </div>
              <div className="font-mono text-xl font-bold text-fg">
                {mode === 'directed' ? reached.size : dualReached.size} / {N}
              </div>
            </div>
            <div
              className={cn(
                'rounded-lg border px-2 py-1.5',
                mode === 'undirected'
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-border bg-bg-soft/40',
              )}
            >
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                Αδιάφορη φορά
              </div>
              <div className="font-mono text-xl font-bold text-fg">
                {mode === 'undirected' ? reached.size : dualReached.size} /{' '}
                {N}
              </div>
            </div>
          </div>

          {/* gap callout — only after the BFS has settled, to avoid spoilers */}
          {settled && (
            <div
              className={cn(
                'rounded-lg border px-3 py-2 text-sm',
                mode === 'directed' && reached.size < N
                  ? 'border-amber-500/50 bg-amber-50 text-amber-900'
                  : 'border-emerald-500/50 bg-emerald-50 text-emerald-900',
              )}
            >
              {mode === 'directed' && reached.size < N && (
                <>
                  Από την v{source} σε <b>κατευθυνόμενο</b> mode φτάνεις σε{' '}
                  {reached.size} κορυφές, ενώ αν αγνοούσαμε τις φορές θα έφτανες
                  σε {dualReached.size}. Η διαφορά τους ({dualReached.size -
                    reached.size}) είναι κορυφές «πάνω» από την v{source} στη
                  ροή του γραφήματος — δεν υπάρχει εξερχόμενη ακμή που να σε
                  πάει εκεί.
                </>
              )}
              {mode === 'directed' && reached.size === N && (
                <>
                  Από την v{source} φτάνεις σε ΟΛΕΣ τις κορυφές ακόμα και
                  σεβόμενος τις φορές — η v{source} είναι «πάνω» στη ροή του
                  γραφήματος.
                </>
              )}
              {mode === 'undirected' && (
                <>
                  Αν αγνοούσαμε τις φορές, ένα BFS από την v{source} φτάνει σε{' '}
                  {reached.size}/{N}. Στο κατευθυνόμενο tab θα δεις πόσες χάνεις
                  μόλις σεβαστείς τις φορές.
                </>
              )}
            </div>
          )}

          {/* narration */}
          <div
            aria-live="polite"
            className="min-h-[4.5rem] rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted"
          >
            {note}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setStep(0)
            setPlaying(false)
          }}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Από την αρχή
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Πίσω
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= lastStep}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          {playing ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" /> Παύση
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" /> Παίξε
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(lastStep, s + 1))}
          disabled={step >= lastStep}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          Βήμα {step} / {lastStep}
        </span>
      </div>
    </section>
  )
}
