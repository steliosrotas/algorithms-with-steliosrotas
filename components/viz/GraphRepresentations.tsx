'use client'

/**
 * GraphRepresentations — the same graph, three synced views.
 *
 * L06's mechanical core is: a graph picture, an adjacency matrix and an
 * adjacency list are *the same information*. Students rarely feel that.
 * Here, selecting a vertex lights it up in all three at once — its node
 * and incident edges in the drawing, its row/column in the matrix, its
 * row in the list — and a cost line contrasts "scan a whole row (n)" vs
 * "read exactly deg(v)". Built for L06; reuses the shared L06_GRAPH so it
 * agrees with every other graph viz and trace on the site.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { L06_GRAPH, neighbors, routeL06GraphEdge } from './graph-types'

const IDS = [1, 2, 3, 4, 5, 6, 7, 8]

export function GraphRepresentations() {
  const [sel, setSel] = useState(2)

  const adj = useMemo(() => {
    const m = new Map<number, number[]>()
    for (const id of IDS) m.set(id, neighbors(L06_GRAPH, id))
    return m
  }, [])

  const nb = adj.get(sel) ?? []
  const deg = nb.length
  const nbSet = new Set(nb)
  const isAdj = (i: number, j: number) => (adj.get(i) ?? []).includes(j)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Μία πληροφορία, τρεις όψεις — σχήμα, πίνακας, λίστα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Κορυφή {sel}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Διάλεξε κορυφή — με κλικ στο σχήμα, στον πίνακα ή στη λίστα.
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* the drawing */}
        <div className="graph-canvas">
          <svg
            viewBox={L06_GRAPH.viewBox}
            className="mx-auto block h-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {L06_GRAPH.edges.map((e, i) => {
              const g = routeL06GraphEdge(e.a, e.b)
              const incident = e.a === sel || e.b === sel
              const stroke = incident ? '#9f1239' : '#9b8a8d'
              const sw = incident ? 4 : 2
              return g.kind === 'line' ? (
                <line
                  key={`e${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`e${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
              )
            })}
            {L06_GRAPH.nodes.map((n) => {
              const isSel = n.id === sel
              const isNb = nbSet.has(n.id)
              const fill = isSel ? '#9f1239' : isNb ? '#fef3c7' : '#ffffff'
              const stroke = isSel ? '#7e1031' : isNb ? '#d97706' : '#9b8a8d'
              const text = isSel ? '#ffffff' : isNb ? '#92400e' : '#1c1214'
              return (
                <g
                  key={`n${n.id}`}
                  transform={`translate(${n.x} ${n.y})`}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Κορυφή ${n.id}`}
                  onClick={() => setSel(n.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      setSel(n.id)
                    }
                  }}
                >
                  <circle r={38} fill="transparent" />
                  <circle r={23} fill={fill} stroke={stroke} strokeWidth={2.5} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={15}
                    fontWeight={700}
                    fill={text}
                  >
                    {n.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* matrix + list */}
        <div className="space-y-3">
          {/* adjacency matrix */}
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Πίνακας γειτνίασης
            </div>
            <div
              className="grid w-fit gap-px text-[11px]"
              style={{ gridTemplateColumns: 'repeat(9, 1.6rem)' }}
            >
              <div className="h-6" />
              {IDS.map((j) => (
                <button
                  key={`ch${j}`}
                  type="button"
                  onClick={() => setSel(j)}
                  className={cn(
                    'flex h-6 items-center justify-center rounded font-mono font-bold transition-colors',
                    j === sel ? 'bg-accent text-accent-fg' : 'text-fg-subtle hover:bg-bg-soft',
                  )}
                >
                  {j}
                </button>
              ))}
              {IDS.map((i) => (
                <div key={`row${i}`} className="contents">
                  <button
                    type="button"
                    onClick={() => setSel(i)}
                    className={cn(
                      'flex h-6 items-center justify-center rounded font-mono font-bold transition-colors',
                      i === sel ? 'bg-accent text-accent-fg' : 'text-fg-subtle hover:bg-bg-soft',
                    )}
                  >
                    {i}
                  </button>
                  {IDS.map((j) => {
                    const one = isAdj(i, j)
                    const inRow = i === sel
                    const inCol = j === sel
                    return (
                      <div
                        key={`c${i}-${j}`}
                        className={cn(
                          'flex h-6 items-center justify-center rounded font-mono',
                          inRow && one && 'bg-rose-500/30 font-bold text-fg',
                          inRow && !one && 'bg-rose-500/5 text-fg-subtle',
                          !inRow && inCol && one && 'bg-accent/15 text-fg',
                          !inRow && inCol && !one && 'bg-accent/5 text-fg-subtle',
                          !inRow && !inCol && 'text-fg-subtle',
                        )}
                      >
                        {one ? 1 : 0}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-fg-subtle">
              Γραμμή {sel} = οι γείτονες· η στήλη {sel} έχει την ίδια πληροφορία
              (συμμετρία Aᵢⱼ = Aⱼᵢ).
            </p>
          </div>

          {/* adjacency list */}
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Λίστα γειτνίασης
            </div>
            <div className="space-y-0.5">
              {IDS.map((v) => {
                const row = adj.get(v) ?? []
                const active = v === sel
                return (
                  <button
                    key={`l${v}`}
                    type="button"
                    onClick={() => setSel(v)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md border px-2 py-1 text-left transition-colors',
                      active
                        ? 'border-accent/40 bg-accent/5'
                        : 'border-transparent hover:bg-bg-soft',
                    )}
                  >
                    <span className="font-mono text-sm font-bold text-fg">{v}</span>
                    <span className="text-fg-subtle">→</span>
                    <span className="flex flex-wrap gap-1">
                      {row.map((u) => (
                        <span
                          key={u}
                          className={cn(
                            'inline-flex h-5 w-5 items-center justify-center rounded font-mono text-xs',
                            active
                              ? 'bg-rose-500/25 font-bold text-fg'
                              : 'bg-bg-soft text-fg-muted',
                          )}
                        >
                          {u}
                        </span>
                      ))}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* info + cost */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5 text-sm">
        <div className="font-semibold text-fg">
          Κορυφή {sel} · βαθμός deg({sel}) = {deg} · γείτονες:{' '}
          <span className="font-mono">{nb.join(', ') || '—'}</span>
        </div>
        <div className="mt-1 leading-relaxed text-fg-muted">
          Για να βρεις τους γείτονες της {sel}: ο <strong>πίνακας</strong> σαρώνει
          ολόκληρη τη γραμμή — 8 κελιά, ανεξάρτητα από το πόσοι είναι. Η{' '}
          <strong>λίστα</strong> διαβάζει ακριβώς {deg}, όσος και ο βαθμός.
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSel((s) => (s === 1 ? 8 : s - 1))}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Προηγούμενη
        </button>
        <button
          type="button"
          onClick={() => setSel((s) => (s === 8 ? 1 : s + 1))}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          Επόμενη κορυφή
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
