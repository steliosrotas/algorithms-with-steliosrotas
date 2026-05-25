'use client'

/**
 * HandshakeLemmaViz — Σ deg(v) = 2m, by physically counting (L06).
 *
 * The lemma reads obvious on paper and forgettable in practice. Here the
 * student sees it happen: edges enter one by one onto the canonical L06
 * graph, and for each new edge the per-vertex degree counters at BOTH of
 * its endpoints tick +1, while the global "ακμές m" counter ticks +1 and
 * the "Σ deg" counter ticks +2. By the time all 11 edges are in, Σ deg = 22
 * and 2m = 22 — same number — because every edge was counted in exactly
 * two degrees. There is also a "per-vertex" tab that flips the lens: click
 * any vertex and its incident edges light up — that's literally its degree.
 *
 * Built for L06. Uses the shared L06_GRAPH so degree counts agree with
 * every other viz on the site.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { L06_GRAPH, neighbors, routeL06GraphEdge } from './graph-types'

const IDS = [1, 2, 3, 4, 5, 6, 7, 8]
const NODE = new Map(L06_GRAPH.nodes.map((n) => [n.id, n]))
const EDGES = L06_GRAPH.edges
const M = EDGES.length // 11

type Mode = 'sweep' | 'vertex'

export function HandshakeLemmaViz() {
  const [mode, setMode] = useState<Mode>('sweep')
  const [k, setK] = useState(0) // 0..M edges placed so far
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState(2)

  // partial degrees after k edges
  const degree = useMemo(() => {
    const d = new Map<number, number>()
    for (const id of IDS) d.set(id, 0)
    for (let i = 0; i < k; i++) {
      const e = EDGES[i]
      d.set(e.a, (d.get(e.a) ?? 0) + 1)
      d.set(e.b, (d.get(e.b) ?? 0) + 1)
    }
    return d
  }, [k])

  const fullDeg = useMemo(() => {
    const d = new Map<number, number>()
    for (const id of IDS) d.set(id, neighbors(L06_GRAPH, id).length)
    return d
  }, [])

  const totalDeg = Array.from(degree.values()).reduce((a, b) => a + b, 0)

  useEffect(() => {
    if (!playing || mode !== 'sweep') return
    if (k >= M) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setK((x) => Math.min(x + 1, M)), 620)
    return () => clearTimeout(t)
  }, [playing, k, mode])

  const justAdded = mode === 'sweep' && k > 0 ? EDGES[k - 1] : null

  // for "vertex" mode: which edges touch the selected vertex
  const incidentSet = useMemo(() => {
    const s = new Set<number>()
    EDGES.forEach((e, i) => {
      if (e.a === selected || e.b === selected) s.add(i)
    })
    return s
  }, [selected])

  function reset() {
    setK(0)
    setPlaying(false)
  }

  // step narration in sweep mode
  let note: string
  if (mode === 'sweep') {
    if (k === 0) {
      note =
        'Δεν έχουμε προσθέσει καμία ακμή. Όλοι οι βαθμοί είναι 0 και 2m = 0. Πάτα «Επόμενη ακμή» ή ▶.'
    } else if (k < M) {
      const e = EDGES[k - 1]
      note = `Ακμή #${k} = {${e.a}, ${e.b}}: τικ +1 στον deg(${e.a}), τικ +1 στον deg(${e.b}). Σ deg += 2. Το m πήγε στο ${k}, άρα 2m = ${2 * k}.`
    } else {
      note = `Όλες οι ${M} ακμές μέσα. Σ deg = ${totalDeg} και 2m = ${2 * M} — ίδιος αριθμός. Δεν θα μπορούσαν να είναι διαφορετικοί: κάθε ακμή προσμετρήθηκε σε δύο βαθμούς, μία φορά για κάθε άκρο.`
    }
  } else {
    const inc = Array.from(incidentSet)
      .map((i) => `{${EDGES[i].a}, ${EDGES[i].b}}`)
      .join(', ')
    note = `Η κορυφή ${selected} έχει βαθμό ${fullDeg.get(selected)}. Οι ακμές που την ακουμπούν είναι: ${inc}. Ο βαθμός είναι ΑΚΡΙΒΩΣ το πλήθος αυτών των ακμών — γι' αυτό κάθε ακμή «πληρώνει» +1 στον deg κάθε άκρου της.`
  }

  // visual state per edge
  const edgeStateAt = (i: number): 'in' | 'next' | 'ghost' => {
    if (mode === 'vertex') return incidentSet.has(i) ? 'in' : 'ghost'
    if (i < k) return 'in'
    if (i === k) return 'next'
    return 'ghost'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Λήμμα της χειραψίας — μετράμε ακμή προς ακμή
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
          ? 'Κάθε νέα ακμή ανάβει στα δύο της άκρα — οι μετρητές βαθμού τικάρουν +1+1. Σύγκρινε στο τέλος το Σ deg με το 2m.'
          : 'Διάλεξε μια κορυφή — ανάβουν μόνο οι ακμές που την ακουμπούν. Ο βαθμός της είναι το πλήθος τους.'}
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* the graph */}
        <div className="graph-canvas">
          <svg
            viewBox={L06_GRAPH.viewBox}
            className="mx-auto block h-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {EDGES.map((e, i) => {
              const A = NODE.get(e.a)!
              const B = NODE.get(e.b)!
              const g = routeL06GraphEdge(e.a, e.b)
              const st = edgeStateAt(i)
              const stroke =
                st === 'in' ? '#9f1239' : st === 'next' ? '#f59e0b' : '#d6d3d1'
              const sw = st === 'in' ? 4 : st === 'next' ? 4 : 1.5
              const dash = st === 'ghost' ? '4 4' : undefined
              // Label anchor: for a line, the segment midpoint; for a curve,
              // the Bezier midpoint (P0 + 2Q + P2) / 4 = (M + Q) / 2 — keeps
              // the "+1 +1" tag pinned to the visible edge in both cases.
              const lx =
                g.kind === 'line' ? (A.x + B.x) / 2 : (A.x + B.x + 2 * g.cx) / 4
              const ly =
                g.kind === 'line' ? (A.y + B.y) / 2 : (A.y + B.y + 2 * g.cy) / 4
              return (
                <g key={`e${i}`}>
                  {g.kind === 'line' ? (
                    <line
                      x1={g.x1}
                      y1={g.y1}
                      x2={g.x2}
                      y2={g.y2}
                      stroke={stroke}
                      strokeWidth={sw}
                      strokeDasharray={dash}
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d={g.d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={sw}
                      strokeDasharray={dash}
                      strokeLinecap="round"
                    />
                  )}
                  {st === 'next' && (
                    <text
                      x={lx}
                      y={ly - 8}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill="#b45309"
                    >
                      +1 +1
                    </text>
                  )}
                </g>
              )
            })}
            {L06_GRAPH.nodes.map((n) => {
              const d = degree.get(n.id) ?? 0
              const isJustHit =
                justAdded && (justAdded.a === n.id || justAdded.b === n.id)
              const isSel = mode === 'vertex' && n.id === selected
              const fill = isSel
                ? '#9f1239'
                : isJustHit
                  ? '#fef3c7'
                  : '#ffffff'
              const stroke = isSel
                ? '#7e1031'
                : isJustHit
                  ? '#d97706'
                  : '#9b8a8d'
              const txt = isSel ? '#ffffff' : '#1c1214'
              return (
                <g
                  key={`n${n.id}`}
                  transform={`translate(${n.x} ${n.y})`}
                  className={mode === 'vertex' ? 'cursor-pointer' : ''}
                  onClick={() => mode === 'vertex' && setSelected(n.id)}
                >
                  <circle r={28} fill="transparent" />
                  <circle r={22} fill={fill} stroke={stroke} strokeWidth={2.5} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill={txt}
                  >
                    {n.id}
                  </text>
                  {/* degree badge — pinned at lower right */}
                  <g transform="translate(18 16)">
                    <circle r={10} fill="#1c1214" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={700}
                      fill="#fef3c7"
                    >
                      {mode === 'vertex' ? (fullDeg.get(n.id) ?? 0) : d}
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        {/* counters + degree table */}
        <div className="space-y-3">
          {/* big counters */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                Σ deg(v)
              </div>
              <div className="font-mono text-2xl font-bold text-fg">
                {mode === 'sweep'
                  ? totalDeg
                  : Array.from(fullDeg.values()).reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                2m
              </div>
              <div className="font-mono text-2xl font-bold text-fg">
                {mode === 'sweep' ? 2 * k : 2 * M}
                <span className="ml-2 text-xs font-medium text-fg-subtle">
                  (m = {mode === 'sweep' ? k : M})
                </span>
              </div>
            </div>
          </div>

          {/* per-vertex degree row */}
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              deg(v) ανά κορυφή
            </div>
            <div className="grid grid-cols-8 gap-1 text-center">
              {IDS.map((id) => {
                const d = mode === 'sweep' ? (degree.get(id) ?? 0) : (fullDeg.get(id) ?? 0)
                const hot =
                  (mode === 'sweep' &&
                    justAdded &&
                    (justAdded.a === id || justAdded.b === id)) ||
                  (mode === 'vertex' && id === selected)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => mode === 'vertex' && setSelected(id)}
                    className={cn(
                      'flex flex-col items-center rounded-md border px-1 py-1 transition-colors',
                      hot
                        ? 'border-amber-500 bg-amber-100 text-amber-900'
                        : 'border-border bg-bg-soft/50 text-fg',
                    )}
                  >
                    <span className="text-[10px] text-fg-subtle">v={id}</span>
                    <span className="font-mono text-sm font-bold">{d}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* narration */}
          <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
            {note}
          </div>

          {/* equality verdict */}
          {mode === 'sweep' && k === M && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              Σ deg(v) = {totalDeg} = 2 · {M} = 2m ✓ — αυτό είναι το λήμμα της
              χειραψίας.
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
