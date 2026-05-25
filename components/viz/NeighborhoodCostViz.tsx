'use client'

/**
 * NeighborhoodCostViz — finding N(v) in list vs matrix, side by side.
 *
 * For L06 problem pt6-th1, which asks for the cost of «βρες τους γείτονες του
 * v» under each representation. The lecture's `GraphRepresentations` already
 * shows the two structures statically; this viz makes the *cost difference*
 * visible — the same vertex v is queried on both sides and a pointer walks:
 *   - left:  ONLY the deg(v) cells of v's adjacency list → ticks Δ(v) times.
 *   - right: the WHOLE row of the adjacency matrix (|V| cells, regardless of
 *     how few neighbours v actually has) → ticks |V| times.
 * Below: a bar chart for |V| ∈ {8, 16, 32, 64, 128} with Δ kept at its
 * canonical value (3 ≈ Θ(1) for sparse), so the gap "for the same v" widens
 * dramatically as the graph scales.
 *
 * Uses the canonical L06_GRAPH (8 vertices, m = 11) for the visible trace, and
 * Δ(v) is the actual degree from that graph. The scale slider keeps Δ fixed
 * (sparse-graph mental model).
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { L06_GRAPH, neighbors } from './graph-types'

const IDS = [1, 2, 3, 4, 5, 6, 7, 8]
const N = IDS.length

const SCALES = [8, 16, 32, 64, 128] as const

export function NeighborhoodCostViz() {
  const [v, setV] = useState<number>(3) // a vertex with a few neighbours, not too many
  const [scale, setScale] = useState<(typeof SCALES)[number]>(8)
  const [k, setK] = useState(0)
  const [playing, setPlaying] = useState(false)

  const nbrs = useMemo(() => neighbors(L06_GRAPH, v), [v])
  const degV = nbrs.length

  // Total "ticks" of the animation: the longer of the two scans (matrix = N).
  const totalTicks = N

  // List has degV cells, matrix has N cells. At tick t:
  //   listPointer  = min(t, degV) -- stops when list is exhausted.
  //   matrixPointer = min(t, N).
  const listPointer = Math.min(k, degV)
  const matrixPointer = Math.min(k, N)

  function reset() {
    setK(0)
    setPlaying(false)
  }
  function stepBack() {
    if (k === 0) return
    setK(k - 1)
  }
  function stepForward() {
    if (k >= totalTicks) return
    setK(k + 1)
  }
  useEffect(() => {
    if (!playing) return
    if (k >= totalTicks) {
      setPlaying(false)
      return
    }
    const t = setTimeout(stepForward, 450)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, k])

  useEffect(() => {
    setK(0)
    setPlaying(false)
  }, [v])

  // Row of the adjacency matrix for vertex v.
  const row = IDS.map((u) => (u !== v && nbrs.includes(u) ? 1 : 0))

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border bg-bg-soft/30">
      <div className="border-b border-border bg-bg-soft/50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Εύρεση N(v) — λίστα vs πίνακας
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Διάλεξε κορυφή{' '}
          <span className="font-semibold">v = {v}</span> (βαθμός Δ(v) = {degV}). Παρακολούθησε:
          η λίστα διαβάζει <strong>μόνο</strong> τα Δ(v) κελιά της· ο πίνακας
          σαρώνει <strong>ολόκληρη</strong> τη γραμμή — όλα τα |V| = {N} κελιά,
          ανεξάρτητα πόσοι γείτονες υπάρχουν.
        </p>
      </div>

      <div className="space-y-3 p-4">
        {/* Vertex picker */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            v =
          </span>
          {IDS.map((id) => {
            const d = neighbors(L06_GRAPH, id).length
            return (
              <button
                key={id}
                type="button"
                onClick={() => setV(id)}
                className={cn(
                  'rounded-md border px-2 py-1 text-sm tabular-nums',
                  id === v
                    ? 'border-rose-700 bg-rose-50 font-semibold text-rose-900'
                    : 'border-border bg-bg-elevated hover:bg-bg-soft',
                )}
                title={`Δ(${id}) = ${d}`}
              >
                {id}
                <span className="ml-1 text-[10px] text-fg-subtle">·{d}</span>
              </button>
            )
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {/* List view */}
          <div className="rounded-xl border border-border bg-bg-elevated p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold">Λίστα γειτνίασης</p>
              <p className="text-xs text-fg-subtle">διάβασε μέχρι το τέλος της λίστας</p>
            </div>
            <div className="mt-3 rounded-md border border-border bg-bg-soft p-2 font-mono text-sm">
              <span className="font-semibold">L[{v}]</span> ={' '}
              {nbrs.length === 0 ? (
                <span className="text-fg-subtle">∅</span>
              ) : (
                nbrs.map((u, i) => {
                  const reached = i < listPointer
                  const current = i === listPointer - 1
                  return (
                    <span
                      key={i}
                      className={cn(
                        'mx-0.5 inline-block rounded px-1.5 py-0.5',
                        current
                          ? 'bg-rose-200 ring-1 ring-rose-500'
                          : reached
                            ? 'bg-emerald-100 ring-1 ring-emerald-400'
                            : 'bg-bg-elevated ring-1 ring-border',
                      )}
                    >
                      {u}
                    </span>
                  )
                })
              )}
              <span className="ml-2 text-fg-subtle">→ NULL</span>
            </div>
            <p className="mt-3 text-xs text-fg-muted">
              κελιά που διαβάστηκαν:{' '}
              <span className="font-bold tabular-nums text-fg-default">
                {listPointer}
              </span>{' '}
              / Δ(v) = {degV}
            </p>
            <div className="mt-2 h-2 rounded-full bg-bg-soft">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${(listPointer / Math.max(degV, 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Matrix view */}
          <div className="rounded-xl border border-border bg-bg-elevated p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold">Πίνακας γειτνίασης</p>
              <p className="text-xs text-fg-subtle">σάρωσε ΟΛΗ τη γραμμή v</p>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full font-mono text-[12px]">
                <thead>
                  <tr>
                    <th className="px-1 text-fg-subtle"></th>
                    {IDS.map((u) => (
                      <th
                        key={u}
                        className={cn(
                          'px-1.5 text-fg-subtle',
                          u === IDS[matrixPointer - 1] && 'text-rose-700',
                        )}
                      >
                        {u}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pr-1 font-semibold text-fg-default">
                      A[{v}]
                    </td>
                    {row.map((cell, i) => {
                      const reached = i < matrixPointer
                      const current = i === matrixPointer - 1
                      return (
                        <td
                          key={i}
                          className={cn(
                            'mx-0.5 px-1.5 py-1 text-center ring-1',
                            current
                              ? 'bg-rose-200 ring-rose-500'
                              : reached
                                ? cell === 1
                                  ? 'bg-emerald-100 ring-emerald-400'
                                  : 'bg-bg-soft ring-border'
                                : 'bg-bg-elevated ring-border',
                          )}
                        >
                          {cell}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-fg-muted">
              κελιά που εξετάστηκαν:{' '}
              <span className="font-bold tabular-nums text-fg-default">
                {matrixPointer}
              </span>{' '}
              / |V| = {N}
            </p>
            <div className="mt-2 h-2 rounded-full bg-bg-soft">
              <div
                className="h-2 rounded-full bg-rose-500"
                style={{ width: `${(matrixPointer / N) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={stepBack}
              disabled={k === 0}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronLeft size={16} /> πίσω
            </button>
            <button
              type="button"
              onClick={() => setPlaying(!playing)}
              disabled={k >= totalTicks}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? 'παύση' : 'παίξε'}
            </button>
            <button
              type="button"
              onClick={stepForward}
              disabled={k >= totalTicks}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
            >
              επόμενο <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft"
            >
              <RotateCcw size={14} /> reset
            </button>
          </div>
          <p className="text-xs text-fg-subtle tabular-nums">
            τικ {k} / {totalTicks}
          </p>
        </div>

        {/* Scaling bar chart */}
        <div className="rounded-xl border border-border bg-bg-elevated p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold">
              Σε μεγαλύτερο γράφημα — το χάσμα μεγαλώνει
            </p>
            <p className="text-xs text-fg-subtle">
              σταθερός βαθμός Δ(v) = {degV} (αραιός γράφος)
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {SCALES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScale(s)}
                className={cn(
                  'rounded-md border px-2 py-1 text-xs tabular-nums',
                  s === scale
                    ? 'border-rose-700 bg-rose-50 font-semibold text-rose-900'
                    : 'border-border bg-bg-soft hover:bg-bg-elevated',
                )}
              >
                |V| = {s}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <CostBar
              label={`λίστα — Δ(v) = ${degV}`}
              value={degV}
              max={scale}
              colour="#10b981"
            />
            <CostBar
              label={`πίνακας — |V| = ${scale}`}
              value={scale}
              max={scale}
              colour="#e11d48"
            />
          </div>
          <p className="mt-3 text-sm text-fg-muted">
            Λόγος{' '}
            <span className="font-bold tabular-nums text-fg-default">
              |V| / Δ(v) = {(scale / Math.max(degV, 1)).toFixed(1)}×
            </span>
            . Σε αραιά γραφήματα (σύνηθες) ο πίνακας πληρώνει σταθερά{' '}
            <InlineMath>O(|V|)</InlineMath> ανά κορυφή, ενώ η λίστα πληρώνει{' '}
            <InlineMath>O(\Delta(v))</InlineMath> — το χάσμα ανοίγει με το{' '}
            <InlineMath>|V|</InlineMath>.
          </p>
        </div>
      </div>
    </div>
  )
}

function CostBar({
  label,
  value,
  max,
  colour,
}: {
  label: string
  value: number
  max: number
  colour: string
}) {
  const pct = max === 0 ? 0 : (value / max) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-fg-muted">{label}</span>
        <span className="font-mono font-semibold text-fg-default">{value} κελιά</span>
      </div>
      <div className="mt-1 h-3 rounded-full bg-bg-soft">
        <div
          className="h-3 rounded-full"
          style={{ width: `${pct}%`, background: colour }}
        />
      </div>
    </div>
  )
}

// Local inline-math helper so we don't need a heavy KaTeX import for two
// labels; the page already provides global math rendering for $...$ strings.
function InlineMath({ children }: { children: string }) {
  return (
    <code className="rounded bg-bg-soft px-1 font-mono text-[12px]">{children}</code>
  )
}
