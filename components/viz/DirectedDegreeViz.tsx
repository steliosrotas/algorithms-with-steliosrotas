'use client'

/**
 * DirectedDegreeViz — indeg/outdeg made operable for L08.
 *
 * Directed graphs split «βαθμός» into two halves: indeg(v) = how many edges
 * END at v, outdeg(v) = how many START at v. The identity
 *   Σ indeg(v) = Σ outdeg(v) = |A|
 * is obvious on paper («κάθε ακμή προσμετράται ακριβώς μία φορά σε κάθε
 * άθροισμα») and forgettable in practice. This viz mirrors L06's
 * HandshakeLemmaViz, directed-style:
 *   • Sweep mode  — directed edges drop in one-by-one. For each new (u → v),
 *     outdeg(u) ticks +1 and indeg(v) ticks +1; the global Σ-counters tick
 *     +1 each, in lock-step with |A|. By the end all three numbers agree.
 *   • Vertex mode — click any vertex; its incoming edges glow one colour and
 *     its outgoing edges the other; per-vertex indeg/outdeg badges become
 *     the headline. The asymmetry between «μπαίνουν» and «βγαίνουν» becomes
 *     a visual fact rather than a formula.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type DNode = { id: number; x: number; y: number }
const NODES: DNode[] = [
  { id: 1, x: 200, y: 60 },
  { id: 2, x: 320, y: 130 },
  { id: 3, x: 320, y: 250 },
  { id: 4, x: 200, y: 320 },
  { id: 5, x: 80, y: 250 },
  { id: 6, x: 80, y: 130 },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const R = 24
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

/** Eight directed edges: a 6-cycle plus two chords. */
const EDGES: { from: number; to: number }[] = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: 1 },
  { from: 2, to: 5 },
  { from: 3, to: 6 },
]
const M = EDGES.length // 8

type Mode = 'sweep' | 'vertex'

/**
 * Collision-aware edge routing: returns a straight segment trimmed to the
 * node borders (the steady-state case for this 6-node directed layout) or a
 * quadratic Bezier that bends around an unrelated node, also trimmed so the
 * arrowhead lands on the target border. The `mx, my` fields anchor the «next
 * edge» label at the centerline midpoint for lines and at the Bezier midpoint
 * `(P0 + 2Q + P2) / 4` for curves. Locks out the «edge through unrelated
 * node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: DNode, b: DNode) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  const trimmed = trimEdgeGeom(geom, a.x, a.y, R + 2, b.x, b.y, R + 2)
  if (trimmed.kind === 'curve') {
    return {
      ...trimmed,
      mx: (a.x + 2 * trimmed.cx + b.x) / 4,
      my: (a.y + 2 * trimmed.cy + b.y) / 4,
    }
  }
  return { ...trimmed, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }
}

export function DirectedDegreeViz() {
  const [mode, setMode] = useState<Mode>('sweep')
  const [k, setK] = useState(0) // edges placed so far in sweep mode
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState(2)

  // partial indeg/outdeg after k edges
  const { indeg, outdeg } = useMemo(() => {
    const ind = new Map<number, number>()
    const out = new Map<number, number>()
    NODES.forEach((n) => {
      ind.set(n.id, 0)
      out.set(n.id, 0)
    })
    for (let i = 0; i < k; i++) {
      const e = EDGES[i]
      out.set(e.from, (out.get(e.from) ?? 0) + 1)
      ind.set(e.to, (ind.get(e.to) ?? 0) + 1)
    }
    return { indeg: ind, outdeg: out }
  }, [k])

  const fullIndeg = useMemo(() => {
    const m = new Map<number, number>()
    NODES.forEach((n) => m.set(n.id, 0))
    EDGES.forEach((e) => m.set(e.to, (m.get(e.to) ?? 0) + 1))
    return m
  }, [])
  const fullOutdeg = useMemo(() => {
    const m = new Map<number, number>()
    NODES.forEach((n) => m.set(n.id, 0))
    EDGES.forEach((e) => m.set(e.from, (m.get(e.from) ?? 0) + 1))
    return m
  }, [])

  const sumIn = Array.from(indeg.values()).reduce((a, b) => a + b, 0)
  const sumOut = Array.from(outdeg.values()).reduce((a, b) => a + b, 0)
  const sumInFull = Array.from(fullIndeg.values()).reduce((a, b) => a + b, 0)
  const sumOutFull = Array.from(fullOutdeg.values()).reduce((a, b) => a + b, 0)

  useEffect(() => {
    if (!playing || mode !== 'sweep') return
    if (k >= M) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setK((x) => Math.min(M, x + 1)), 680)
    return () => clearTimeout(t)
  }, [playing, k, mode])

  const justAdded = mode === 'sweep' && k > 0 ? EDGES[k - 1] : null

  // for vertex mode: which edges hit the selected vertex, and how
  const incident = useMemo(() => {
    const ins: number[] = []
    const outs: number[] = []
    EDGES.forEach((e, i) => {
      if (e.to === selected) ins.push(i)
      if (e.from === selected) outs.push(i)
    })
    return { ins, outs }
  }, [selected])

  function reset() {
    setK(0)
    setPlaying(false)
  }

  // edge visual role
  type Role = 'next' | 'placed' | 'ghost' | 'in' | 'out' | 'other'
  function roleOf(i: number): Role {
    if (mode === 'vertex') {
      if (incident.ins.includes(i)) return 'in'
      if (incident.outs.includes(i)) return 'out'
      return 'other'
    }
    if (i < k) return 'placed'
    if (i === k) return 'next'
    return 'ghost'
  }

  function edgeStyle(role: Role) {
    switch (role) {
      case 'next':
        return { stroke: '#f59e0b', width: 3.4, marker: 'next', opacity: 1 }
      case 'placed':
        return { stroke: '#1d4ed8', width: 2.6, marker: 'placed', opacity: 1 }
      case 'ghost':
        return { stroke: '#d6d3d1', width: 1.6, marker: 'ghost', opacity: 1 }
      case 'in':
        return { stroke: '#16a34a', width: 3.4, marker: 'in', opacity: 1 }
      case 'out':
        return { stroke: '#9333ea', width: 3.4, marker: 'out', opacity: 1 }
      default:
        return { stroke: '#d6d3d1', width: 1.6, marker: 'ghost', opacity: 0.55 }
    }
  }

  let note: string
  if (mode === 'sweep') {
    if (k === 0) {
      note =
        'Καμία ακμή ακόμα. Όλα τα indeg, outdeg και Σ-αθροίσματα είναι 0. Πάτα «Επόμενη ακμή» ή ▶ — θα δούμε ότι κάθε νέα ακμή τικάρει ΕΝΑ outdeg και ΕΝΑ indeg.'
    } else if (k < M) {
      const e = EDGES[k - 1]
      note = `Ακμή #${k} = (${e.from} → ${e.to}). Τικ +1 στο outdeg(${e.from}) (η ακμή «βγαίνει» από εκεί), τικ +1 στο indeg(${e.to}) (η ακμή «μπαίνει» εκεί). Σ outdeg += 1, Σ indeg += 1, |A| += 1 — όλα μαζί.`
    } else {
      note = `Όλες οι ${M} ακμές μπήκαν. Σ indeg = ${sumIn}, Σ outdeg = ${sumOut}, |A| = ${M} — ίδιος αριθμός παντού. Είναι αναπόφευκτο: κάθε ακμή μετρήθηκε μία φορά ως «βγαίνει» (στο outdeg της κορυφής‐αφετηρίας) και μία φορά ως «μπαίνει» (στο indeg της κορυφής‐προορισμού).`
    }
  } else {
    const ins = incident.ins.map((i) => `(${EDGES[i].from}→${selected})`).join(', ') || '—'
    const outs = incident.outs.map((i) => `(${selected}→${EDGES[i].to})`).join(', ') || '—'
    note = `Κορυφή ${selected}: indeg = ${fullIndeg.get(selected)}, outdeg = ${fullOutdeg.get(selected)}. Εισερχόμενες (πράσινες): ${ins}. Εξερχόμενες (μωβ): ${outs}. Παρατήρησε ότι δεν είναι αναγκαστικά ίσα: η κατευθυντικότητα τα σπάει στα δύο.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Εσώβαθμος και εξώβαθμος σε κατευθυνόμενο γράφημα
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-border text-xs font-medium">
          {(['sweep', 'vertex'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'px-2.5 py-1 transition-colors',
                mode === m
                  ? 'bg-accent text-accent-fg'
                  : 'bg-bg-elevated text-fg-subtle hover:bg-bg-soft',
              )}
            >
              {m === 'sweep' ? 'Πρόσθεσε ακμές' : 'Κορυφή προς κορυφή'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        {mode === 'sweep'
          ? 'Κάθε νέα ακμή ανάβει στα ΔΥΟ άκρα της — αλλά τώρα τικάρει χωριστά το outdeg της αφετηρίας και το indeg του προορισμού. Πρόσεξε τους τρεις μετρητές δεξιά.'
          : 'Διάλεξε μια κορυφή — πράσινες οι ακμές που ΜΠΑΙΝΟΥΝ (indeg), μωβ αυτές που ΒΓΑΙΝΟΥΝ (outdeg).'}
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* graph */}
        <div className="graph-canvas">
          <svg
            viewBox="0 0 400 380"
            className="mx-auto block h-auto w-full max-w-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {(['placed', 'ghost', 'next', 'in', 'out'] as const).map((kind) => {
                const fill =
                  kind === 'placed'
                    ? '#1d4ed8'
                    : kind === 'next'
                      ? '#f59e0b'
                      : kind === 'in'
                        ? '#16a34a'
                        : kind === 'out'
                          ? '#9333ea'
                          : '#d6d3d1'
                return (
                  <marker
                    key={kind}
                    id={`dd-${kind}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={fill} />
                  </marker>
                )
              })}
            </defs>

            {/* edges */}
            {EDGES.map((e, i) => {
              const A = POS.get(e.from)!
              const B = POS.get(e.to)!
              const role = roleOf(i)
              const st = edgeStyle(role)
              const g = routedEdge(A, B)
              return (
                <g key={`e${i}`} opacity={st.opacity}>
                  {g.kind === 'line' ? (
                    <line
                      x1={g.x1}
                      y1={g.y1}
                      x2={g.x2}
                      y2={g.y2}
                      stroke={st.stroke}
                      strokeWidth={st.width}
                      markerEnd={`url(#dd-${st.marker})`}
                    />
                  ) : (
                    <path
                      d={g.d}
                      fill="none"
                      stroke={st.stroke}
                      strokeWidth={st.width}
                      markerEnd={`url(#dd-${st.marker})`}
                    />
                  )}
                  {role === 'next' && (
                    <text
                      x={g.mx}
                      y={g.my - 8}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={800}
                      fill="#b45309"
                    >
                      out({e.from})+1 · in({e.to})+1
                    </text>
                  )}
                </g>
              )
            })}

            {/* nodes */}
            {NODES.map((n) => {
              const i = mode === 'sweep' ? indeg.get(n.id) ?? 0 : fullIndeg.get(n.id) ?? 0
              const o = mode === 'sweep' ? outdeg.get(n.id) ?? 0 : fullOutdeg.get(n.id) ?? 0
              const justHit =
                justAdded && (justAdded.from === n.id || justAdded.to === n.id)
              const isSel = mode === 'vertex' && n.id === selected
              const fill = isSel ? '#1c1214' : justHit ? '#fef3c7' : '#ffffff'
              const stroke = isSel
                ? '#1c1214'
                : justHit
                  ? '#d97706'
                  : '#9b8a8d'
              const txt = isSel ? '#fffdf8' : '#1c1214'
              return (
                <g
                  key={`n${n.id}`}
                  onClick={() => mode === 'vertex' && setSelected(n.id)}
                  style={{ cursor: mode === 'vertex' ? 'pointer' : 'default' }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2.5}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill={txt}
                  >
                    v{n.id}
                  </text>
                  {/* in badge — top-left, green */}
                  <g transform={`translate(${n.x - 22} ${n.y - 18})`}>
                    <circle r={11} fill="#dcfce7" stroke="#16a34a" strokeWidth={1.5} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={800}
                      fill="#166534"
                    >
                      {i}
                    </text>
                  </g>
                  {/* out badge — bottom-right, purple */}
                  <g transform={`translate(${n.x + 22} ${n.y + 18})`}>
                    <circle r={11} fill="#f3e8ff" stroke="#9333ea" strokeWidth={1.5} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={800}
                      fill="#6b21a8"
                    >
                      {o}
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        {/* side panel: three counters + per-vertex grid + narration */}
        <div className="space-y-3">
          {/* big counters */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-50/40 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-emerald-800">
                Σ indeg
              </div>
              <div className="font-mono text-xl font-bold text-emerald-900">
                {mode === 'sweep' ? sumIn : sumInFull}
              </div>
            </div>
            <div className="rounded-lg border border-purple-500/40 bg-purple-50/40 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-purple-800">
                Σ outdeg
              </div>
              <div className="font-mono text-xl font-bold text-purple-900">
                {mode === 'sweep' ? sumOut : sumOutFull}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-bg-soft/40 px-2 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                |A|
              </div>
              <div className="font-mono text-xl font-bold text-fg">
                {mode === 'sweep' ? k : M}
              </div>
            </div>
          </div>

          {/* per-vertex grid */}
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              indeg / outdeg ανά κορυφή
            </div>
            <div className="grid grid-cols-6 gap-1 text-center">
              {NODES.map((n) => {
                const i = mode === 'sweep' ? indeg.get(n.id) ?? 0 : fullIndeg.get(n.id) ?? 0
                const o = mode === 'sweep' ? outdeg.get(n.id) ?? 0 : fullOutdeg.get(n.id) ?? 0
                const hot =
                  (mode === 'sweep' &&
                    justAdded &&
                    (justAdded.from === n.id || justAdded.to === n.id)) ||
                  (mode === 'vertex' && n.id === selected)
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => mode === 'vertex' && setSelected(n.id)}
                    className={cn(
                      'flex flex-col items-center rounded-md border px-1 py-1 transition-colors',
                      hot
                        ? 'border-amber-500 bg-amber-100 text-amber-900'
                        : 'border-border bg-bg-soft/50 text-fg',
                    )}
                  >
                    <span className="text-[10px] text-fg-subtle">v{n.id}</span>
                    <span className="font-mono text-xs font-bold">
                      <span className="text-emerald-700">{i}</span>
                      <span className="text-fg-subtle">/</span>
                      <span className="text-purple-700">{o}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* narration */}
          <div
            aria-live="polite"
            className="min-h-[6rem] rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted"
          >
            {note}
          </div>

          {/* equality verdict */}
          {mode === 'sweep' && k === M && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              Σ indeg = {sumIn} = Σ outdeg = {sumOut} = {M} = |A| ✓ — κάθε
              ακμή προσμετράται ακριβώς μία φορά σε κάθε άθροισμα.
            </div>
          )}
        </div>
      </div>

      {/* controls */}
      {mode === 'sweep' && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Καθαρά
          </button>
          <button
            type="button"
            onClick={() => setK((x) => Math.max(0, x - 1))}
            disabled={k === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Πίσω
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            disabled={k >= M}
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
            onClick={() => setK((x) => Math.min(M, x + 1))}
            disabled={k >= M}
            className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Επόμενη ακμή <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="ml-auto text-xs text-fg-subtle">
            {k} / {M} ακμές
          </span>
        </div>
      )}
    </section>
  )
}
