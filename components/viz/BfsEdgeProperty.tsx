'use client'

/**
 * BfsEdgeProperty — «καμία ακμή δεν πηδά επίπεδο» γίνεται 11 κλικ (L07).
 *
 * The lecture states (callout): if {x, y} is an edge of G, then the BFS-tree
 * levels of x and y differ by AT MOST 1. The student is asked to take this
 * on faith and trust the «αν πηδούσε 2 επίπεδα… αντίφαση» argument. Here
 * the property becomes an operation:
 *
 *  - Tab «Σαρώνουμε τις 11 ακμές»: step through each edge of the L06 graph
 *    one at a time. The edge highlights, the two endpoint levels light up,
 *    and Δlevel = |L(x) − L(y)| ticks visibly. After all 11, the counter
 *    panel shows 7 tree edges (Δ = 1) + 4 same-level edges (Δ = 0) and NO
 *    edge with Δ ≥ 2. The property lands by 11 separate checks.
 *
 *  - Tab «Γιατί δεν υπάρχει Δ ≥ 2;»: pick any two vertices and see their
 *    BFS levels and Δ. If Δ ≥ 2 the panel argues why this contradicts BFS:
 *    «αν υπήρχε ακμή {x, y} με L(x) = i, L(y) = j ≥ i+2, τότε όταν το BFS
 *    σάρωσε το Li θα είχε ανακαλύψει την y ως γείτονα της x — οπότε η y θα
 *    ήταν στο Li+1, όχι στο Lj.» For real edges the picker confirms Δ ≤ 1
 *    every time.
 *
 * Built for L07. Uses L06_BFS_TREE for the banded layered drawing.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { L06_GRAPH, L06_BFS_TREE, neighbors, sameEdge, routeL06BfsTreeEdge } from './graph-types'

const LEVEL_BAND_Y = [14, 106, 198, 290]
const LEVEL_BAND_H = 88

/** distance map from start = 1 using BFS. */
function bfsLevels() {
  const dist = new Map<number, number>()
  dist.set(1, 0)
  let frontier = [1]
  let i = 0
  while (frontier.length > 0) {
    const next: number[] = []
    for (const u of frontier) {
      for (const v of neighbors(L06_GRAPH, u)) {
        if (!dist.has(v)) {
          dist.set(v, i + 1)
          next.push(v)
        }
      }
    }
    frontier = next
    i++
  }
  return dist
}

type Tab = 'scan' | 'adv'

export function BfsEdgeProperty() {
  const level = useMemo(() => bfsLevels(), [])
  const [tab, setTab] = useState<Tab>('scan')

  // Scan tab state
  const [k, setK] = useState(0) // edges 0..M revealed; current edge = k - 1
  const M = L06_GRAPH.edges.length

  // Adversary tab state: pick two vertices x, y (any vertices, even without an edge)
  const [x, setX] = useState<number>(1)
  const [y, setY] = useState<number>(6)
  const pair = { x, y }

  const lx = level.get(pair.x) ?? 0
  const ly = level.get(pair.y) ?? 0
  const delta = Math.abs(lx - ly)
  const isEdge = L06_GRAPH.edges.some((e) => sameEdge(e, pair.x, pair.y))

  // running counts for the scan tab
  const { tree, same, jump } = useMemo(() => {
    let tree = 0
    let same = 0
    let jump = 0
    for (let i = 0; i < k; i++) {
      const e = L06_GRAPH.edges[i]
      const d = Math.abs((level.get(e.a) ?? 0) - (level.get(e.b) ?? 0))
      if (d === 0) same++
      else if (d === 1) tree++
      else jump++
    }
    return { tree, same, jump }
  }, [k, level])

  const currentEdge = k > 0 ? L06_GRAPH.edges[k - 1] : null
  const currentDelta = currentEdge
    ? Math.abs((level.get(currentEdge.a) ?? 0) - (level.get(currentEdge.b) ?? 0))
    : 0

  function reset() {
    setK(0)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Καμία ακμή του G δεν πηδά επίπεδο στο BFS-δέντρο
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-border text-xs font-medium">
          {(['scan', 'adv'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'px-2.5 py-1 transition-colors',
                tab === t
                  ? 'bg-accent text-accent-fg'
                  : 'bg-bg-elevated text-fg-subtle hover:bg-bg-soft',
              )}
            >
              {t === 'scan' ? 'Σαρώνουμε τις 11 ακμές' : 'Γιατί δεν υπάρχει Δ ≥ 2;'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* graph */}
        <div className="graph-canvas">
          <svg viewBox={L06_BFS_TREE.viewBox} className="block h-auto w-full" role="img">
            {LEVEL_BAND_Y.map((y, i) => (
              <g key={`band-${i}`}>
                <rect
                  x={6}
                  y={y}
                  width={608}
                  height={LEVEL_BAND_H}
                  rx={8}
                  fill="#9f1239"
                  fillOpacity={0.05}
                  stroke="#9f1239"
                  strokeOpacity={0.25}
                  strokeDasharray="6 4"
                />
                <text x={18} y={y + 22} fontSize={12} fontWeight={700} fill="#9f1239" fillOpacity={0.7}>
                  L{i}
                </text>
              </g>
            ))}
            {/* edges */}
            {L06_BFS_TREE.edges.map((e, i) => {
              const g = routeL06BfsTreeEdge(e.a, e.b)
              const d = Math.abs((level.get(e.a) ?? 0) - (level.get(e.b) ?? 0))
              let stroke = '#cbb8ba'
              let sw = 1.5
              let dash: string | undefined = undefined
              if (tab === 'scan') {
                if (i < k - 1) {
                  // already-scanned: colour by Δ
                  stroke = d === 0 ? '#7c3aed' : '#9f1239'
                  sw = 2.5
                  dash = d === 0 ? '5 3' : undefined
                } else if (i === k - 1) {
                  stroke = '#f59e0b'
                  sw = 5
                }
              } else {
                stroke = d === 1 ? '#9f1239' : '#7c3aed'
                sw = 2.5
                dash = d === 0 ? '5 3' : undefined
              }
              return g.kind === 'line' ? (
                <line
                  key={`e-${i}`}
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
                  key={`e-${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeDasharray={dash}
                  strokeLinecap="round"
                />
              )
            })}
            {/* hypothetical edge in adv tab */}
            {tab === 'adv' && !isEdge && pair.x !== pair.y && (
              (() => {
                const g = routeL06BfsTreeEdge(pair.x, pair.y)
                return g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke="#dc2626"
                    strokeWidth={3}
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    opacity={0.8}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth={3}
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    opacity={0.8}
                  />
                )
              })()
            )}
            {/* nodes */}
            {L06_BFS_TREE.nodes.map((n) => {
              let fill = '#ffffff'
              let stroke = '#9b8a8d'
              const txt = '#1c1214'
              const onCurrentEdge =
                tab === 'scan' && currentEdge && (currentEdge.a === n.id || currentEdge.b === n.id)
              const inAdvPair = tab === 'adv' && (n.id === pair.x || n.id === pair.y)
              if (onCurrentEdge || inAdvPair) {
                fill = '#fef3c7'
                stroke = '#d97706'
              }
              return (
                <g
                  key={`n-${n.id}`}
                  transform={`translate(${n.x} ${n.y})`}
                  className={tab === 'adv' ? 'cursor-pointer' : ''}
                  onClick={() => {
                    if (tab !== 'adv') return
                    // click cycles: first click sets x, next sets y
                    if (n.id === pair.x) return // no-op if it's x
                    if (n.id === pair.y) return
                    setY(pair.x)
                    setX(n.id)
                  }}
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
                </g>
              )
            })}
          </svg>
        </div>

        {/* panels */}
        <div className="space-y-3">
          {tab === 'scan' ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-rose-300/60 bg-rose-50 px-2 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-rose-700">Δ = 1</div>
                  <div className="font-mono text-2xl font-bold text-rose-900">{tree}</div>
                  <div className="text-[10px] text-rose-700">δέντρο</div>
                </div>
                <div className="rounded-lg border border-violet-300/60 bg-violet-50 px-2 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-violet-700">Δ = 0</div>
                  <div className="font-mono text-2xl font-bold text-violet-900">{same}</div>
                  <div className="text-[10px] text-violet-700">ίδιο επίπεδο</div>
                </div>
                <div className="rounded-lg border border-amber-300/60 bg-amber-50 px-2 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-amber-700">Δ ≥ 2</div>
                  <div className="font-mono text-2xl font-bold text-amber-900">{jump}</div>
                  <div className="text-[10px] text-amber-700">πήδημα</div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
                {currentEdge ? (
                  <>
                    Ακμή #{k}: <span className="font-mono font-bold">{`{${currentEdge.a}, ${currentEdge.b}}`}</span>
                    {' · '}L({currentEdge.a}) = {level.get(currentEdge.a)}, L({currentEdge.b}) = {level.get(currentEdge.b)}
                    {' · '}<strong>Δ = {currentDelta}</strong>
                    {currentDelta === 1 && ' — ακμή δέντρου.'}
                    {currentDelta === 0 && ' — ακμή στο ίδιο επίπεδο.'}
                    {currentDelta >= 2 && ' — αυτό ΔΕΝ θα έπρεπε να συμβαίνει!'}
                  </>
                ) : (
                  <>Πάτα «Επόμενη ακμή» για να ξεκινήσει η σάρωση.</>
                )}
              </div>

              {k >= M && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  <strong>11/11 ακμές ελέγχθηκαν.</strong> 7 ακμές με Δ = 1 (δέντρο), 4
                  με Δ = 0 (ίδιο επίπεδο), 0 με Δ ≥ 2. Η ιδιότητα ισχύει για ΚΑΘΕ
                  ακμή του γραφήματος.
                </div>
              )}
            </>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                  Επιλογή ζεύγους
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-fg-subtle">x = </span>
                    <select
                      value={pair.x}
                      onChange={(e) => setX(Number(e.target.value))}
                      className="rounded border border-border bg-bg-elevated px-1 py-0.5 text-sm font-mono"
                    >
                      {L06_GRAPH.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.id}
                        </option>
                      ))}
                    </select>
                    <span className="ml-2 text-fg-subtle">L(x) = {lx}</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle">y = </span>
                    <select
                      value={pair.y}
                      onChange={(e) => setY(Number(e.target.value))}
                      className="rounded border border-border bg-bg-elevated px-1 py-0.5 text-sm font-mono"
                    >
                      {L06_GRAPH.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.id}
                        </option>
                      ))}
                    </select>
                    <span className="ml-2 text-fg-subtle">L(y) = {ly}</span>
                  </div>
                  <div className="border-t border-border pt-2 text-fg">
                    Δ = |L(x) − L(y)| = <strong className="font-mono">{delta}</strong>
                    {isEdge ? (
                      <span className="ml-2 inline-flex rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-semibold text-rose-800">
                        υπάρχει ακμή στο G
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex rounded bg-fg-subtle/10 px-1.5 py-0.5 text-[11px] font-semibold text-fg-subtle">
                        ΔΕΝ υπάρχει ακμή
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
                {isEdge && delta <= 1 && (
                  <>
                    Πραγματική ακμή του G, και Δ ≤ 1 — η ιδιότητα ισχύει ✓.
                  </>
                )}
                {!isEdge && delta <= 1 && (
                  <>
                    Δεν υπάρχει αυτή η ακμή στο G — οπότε δεν θα παραβίαζε τίποτα
                    ούτως ή άλλως. Δοκίμασε ένα ζεύγος με μεγαλύτερη διαφορά
                    επιπέδων.
                  </>
                )}
                {!isEdge && delta >= 2 && (
                  <>
                    <strong>Υποθετική ακμή με Δ = {delta}.</strong> Αν υπήρχε στο G,
                    θα κατέρρεε το BFS: όταν σαρώναμε το L<sub>{Math.min(lx, ly)}</sub> και
                    βρισκόμασταν στην κορυφή{' '}
                    <span className="font-mono font-bold">{lx < ly ? pair.x : pair.y}</span>,
                    η ακμή θα είχε «αποκαλύψει» την άλλη κορυφή ως γείτονα — οπότε
                    αυτή θα είχε μπει στο L<sub>{Math.min(lx, ly) + 1}</sub>, όχι στο L
                    <sub>{Math.max(lx, ly)}</sub>. Αντίφαση. Γι' αυτό κανένα Δ ≥ 2 δεν
                    είναι δυνατό για ΥΠΑΡΚΤΗ ακμή.
                  </>
                )}
                {isEdge && delta >= 2 && (
                  <>
                    <strong>Αδύνατο!</strong> Δεν θα έπρεπε να βλέπεις αυτή τη
                    γραμμή — υπάρχει bug στα δεδομένα.
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* controls */}
      {tab === 'scan' && (
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
