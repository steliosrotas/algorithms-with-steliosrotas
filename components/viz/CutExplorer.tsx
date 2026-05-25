'use client'

/**
 * CutExplorer — the cut property, made something you operate (L09).
 *
 * "For ANY cut, the cheapest crossing edge is in the MST" is an abstract
 * claim a student can read and still not believe. Here they build the cut
 * themselves: click vertices to drop them into the set A, watch D(A) — the
 * crossing edges — light up gold, and the minimum one turn green. With the
 * MST shown faintly underneath, the punchline lands every single time:
 * whatever cut you draw, its cheapest crossing edge is a tree edge. The
 * theorem stops being a sentence and becomes a pattern you cannot break.
 * Built for L09.
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MST_NODES,
  MST_EDGES,
  MST_POS,
  MST_NODE_R,
  MST_VIEW,
  MST_TREE_IDS,
  routeMstEdge,
} from './mst-graph'

const PRESETS: { label: string; set: string[] }[] = [
  { label: 'A = {D}', set: ['D'] },
  { label: 'A = {C, F}', set: ['C', 'F'] },
  { label: 'A = αριστερή πλευρά', set: ['A', 'C', 'F'] },
  { label: 'A = {B, E, G}', set: ['B', 'E', 'G'] },
]

export function CutExplorer() {
  const [inA, setInA] = useState<Set<string>>(new Set(['C', 'F']))
  const [showMst, setShowMst] = useState(true)

  function toggle(id: string) {
    setInA((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const crossing = useMemo(
    () => MST_EDGES.filter((e) => inA.has(e.a) !== inA.has(e.b)),
    [inA],
  )
  const minEdge = useMemo(() => {
    let m: (typeof MST_EDGES)[number] | null = null
    for (const e of crossing) if (!m || e.w < m.w) m = e
    return m
  }, [crossing])
  const crossingIds = useMemo(() => new Set(crossing.map((e) => e.id)), [crossing])
  const minInMst = minEdge ? MST_TREE_IDS.has(minEdge.id) : false

  const trivial = inA.size === 0 || inA.size === MST_NODES.length

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Εξερευνητής αποκοπών — φτιάξε τη δική σου αποκοπή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          A = {`{${[...inA].sort().join(', ') || '∅'}}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κάνε κλικ σε κορυφή για να μπει / βγει από το σύνολο A · γαλάζιο = μέσα
        στο A · χρυσό = ακμές αποκοπής D(A) · πράσινο = η ελάχιστη.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${MST_VIEW.w} ${MST_VIEW.h}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* MST halo underneath */}
          {showMst &&
            MST_EDGES.filter((e) => MST_TREE_IDS.has(e.id)).map((e) => {
              const A = MST_POS.get(e.a)!
              const B = MST_POS.get(e.b)!
              const g = routeMstEdge(A, B)
              return g.kind === 'line' ? (
                <line
                  key={`halo-${e.id}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="#34d399"
                  strokeWidth={12}
                  strokeOpacity={0.35}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`halo-${e.id}`}
                  d={g.d}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth={12}
                  strokeOpacity={0.35}
                  strokeLinecap="round"
                />
              )
            })}

          {/* edges */}
          {MST_EDGES.map((e) => {
            const A = MST_POS.get(e.a)!
            const B = MST_POS.get(e.b)!
            const g = routeMstEdge(A, B)
            const isCross = crossingIds.has(e.id)
            const isMin = minEdge?.id === e.id
            let stroke = '#c9bcbe'
            let width = 1.8
            if (isMin) {
              stroke = '#059669'
              width = 5.5
            } else if (isCross) {
              stroke = '#d97706'
              width = 3
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
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width}
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
                  stroke={isMin ? '#059669' : isCross ? '#d97706' : '#cdbfc0'}
                  strokeWidth={isMin || isCross ? 2 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={isMin ? '#047857' : isCross ? '#b45309' : '#5a4a4d'}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {MST_NODES.map((n) => {
            const isIn = inA.has(n.id)
            return (
              <g
                key={n.id}
                onClick={() => toggle(n.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={MST_NODE_R}
                  fill={isIn ? '#7dd3fc' : '#ffffff'}
                  stroke={isIn ? '#0284c7' : '#9b8a8d'}
                  strokeWidth={2.5}
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
              </g>
            )
          })}
        </svg>
      </div>

      <p className="mt-1.5 text-center text-xs text-fg-subtle">
        💡 Κάνε κλικ στις κορυφές — η ελάχιστη ακμή της αποκοπής βγαίνει πάντα
        ακμή του ΕΣΔ.
      </p>

      {/* D(A) chips */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          D(A)
        </span>
        {trivial || crossing.length === 0 ? (
          <span className="text-xs text-fg-muted">— καμία ακμή αποκοπής</span>
        ) : (
          [...crossing]
            .sort((a, b) => a.w - b.w)
            .map((e) => {
              const isMin = minEdge?.id === e.id
              return (
                <span
                  key={e.id}
                  className={cn(
                    'rounded border px-1.5 py-0.5 font-mono text-xs font-semibold',
                    isMin
                      ? 'border-success/55 bg-success/10 text-success'
                      : 'border-border bg-bg-soft text-fg-muted',
                  )}
                >
                  {e.a}-{e.b}·{e.w}
                </span>
              )
            })
        )}
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className={cn(
          'mt-2 min-h-[3.5rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          trivial
            ? 'border-border bg-bg-soft/50 text-fg-muted'
            : 'border-success/40 bg-success/10 text-fg-muted',
        )}
      >
        {trivial ? (
          'Μια αποκοπή χωρίζει τις κορυφές σε δύο ΜΗ ΚΕΝΑ μέρη. Διάλεξε από 1 ως 6 κορυφές για το A.'
        ) : (
          <>
            Η αποκοπή A = {`{${[...inA].sort().join(', ')}}`} έχει{' '}
            {crossing.length} ακμές αποκοπής. Η ελάχιστη είναι η{' '}
            <strong className="text-fg">
              {minEdge!.a}-{minEdge!.b}
            </strong>{' '}
            με κόστος {minEdge!.w} —{' '}
            {minInMst ? (
              <strong className="text-success">
                και είναι ακμή του ΕΣΔ ✓
              </strong>
            ) : (
              <strong className="text-danger">δεν είναι ακμή του ΕΣΔ</strong>
            )}
            . Αυτό λέει η ιδιότητα αποκοπής — και ισχύει για όποια αποκοπή κι αν
            φτιάξεις.
          </>
        )}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setInA(new Set(p.set))}
            className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:bg-bg-soft"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowMst((v) => !v)}
          className={cn(
            'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            showMst
              ? 'border-success/50 bg-success/10 text-success'
              : 'border-border text-fg-muted hover:bg-bg-soft',
          )}
        >
          {showMst ? '✓ ΕΣΔ ορατό' : 'Δείξε το ΕΣΔ'}
        </button>
        <button
          type="button"
          onClick={() => setInA(new Set())}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Καθάρισε
        </button>
      </div>
    </section>
  )
}
