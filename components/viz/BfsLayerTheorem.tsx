'use client'

/**
 * BfsLayerTheorem — «Li = όλες οι κορυφές σε απόσταση i» γίνεται ορατό (L07).
 *
 * The lecture states this as a theorem in a callout — Li equals exactly the
 * vertices at distance i from s — and asks the student to take it on faith.
 * This viz turns it into a side-by-side check: the learner picks any target
 * vertex t; in the LEFT pane the BFS wave expands layer by layer until t
 * lights up at level L(t); in the RIGHT pane a separate "minimum distance"
 * scan walks the unique shortest path from s to t in d edges. Then the
 * verdict bar reads L(t) = d(s,t) — equal by definition, not coincidence.
 *
 * To make «why not earlier?» visible, a follow-up panel argues both
 * directions:
 *   - «δεν εμφανίζεται νωρίτερα»: a vertex of distance d has every walk
 *     from s of length ≥ d, so the BFS wave can't carry it inward before
 *     step d.
 *   - «δεν εμφανίζεται αργότερα»: at step d the wave has visited every
 *     neighbour at distance d−1, so any new vertex with such a neighbour
 *     joins now — and t has at least one.
 *
 * Built for L07. Uses L06_BFS_TREE for the banded canvas.
 */

import { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { L06_BFS_TREE, L06_GRAPH, neighbors, routeL06BfsTreeEdge } from './graph-types'

/** distance + parent for shortest path, from start vertex 1. */
function bfsDistances() {
  const dist = new Map<number, number>()
  const parent = new Map<number, number>()
  const layers: number[][] = []
  dist.set(1, 0)
  let frontier: number[] = [1]
  let i = 0
  while (frontier.length > 0) {
    layers.push([...frontier])
    const next: number[] = []
    for (const u of frontier) {
      for (const v of neighbors(L06_GRAPH, u)) {
        if (!dist.has(v)) {
          dist.set(v, i + 1)
          parent.set(v, u)
          next.push(v)
        }
      }
    }
    frontier = next
    i++
  }
  return { dist, parent, layers }
}

function shortestPath(parent: Map<number, number>, target: number): number[] {
  const path: number[] = []
  let cur: number | undefined = target
  while (cur !== undefined) {
    path.unshift(cur)
    cur = parent.get(cur)
  }
  return path
}

const TARGETS = [2, 3, 4, 5, 7, 8, 6] as const

const LEVEL_BAND_Y = [14, 106, 198, 290] // matches the L06_BFS_TREE bands
const LEVEL_BAND_H = 88

export function BfsLayerTheorem() {
  const { dist, parent, layers } = useMemo(() => bfsDistances(), [])
  const maxLayer = layers.length // 4
  const [target, setTarget] = useState<number>(6)
  const [waveStep, setWaveStep] = useState<number>(0) // how many layers visible so far
  const [playing, setPlaying] = useState(false)

  // when target changes, reset the wave to its arrival step − 1, so the
  // student can step through into it.
  useEffect(() => {
    setWaveStep(0)
    setPlaying(false)
  }, [target])

  // autoplay (advances one layer per tick until full)
  useEffect(() => {
    if (!playing || waveStep >= maxLayer) {
      if (waveStep >= maxLayer) setPlaying(false)
      return
    }
    const t = setTimeout(() => setWaveStep((w) => Math.min(maxLayer, w + 1)), 950)
    return () => clearTimeout(t)
  }, [playing, waveStep, maxLayer])

  const d = dist.get(target) ?? 0
  const path = shortestPath(parent, target)
  const targetArrived = waveStep > d // strictly after target's layer fully visible

  // node sets that have been discovered by the wave through waveStep
  const discovered = new Set<number>()
  for (let i = 0; i < waveStep; i++) {
    for (const v of layers[i]) discovered.add(v)
  }
  const frontierThisStep = waveStep > 0 ? new Set(layers[waveStep - 1]) : new Set<number>()

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Θεώρημα — L<sub>i</sub> = όλες οι κορυφές σε απόσταση i
        </div>
        <span className="text-xs text-fg-subtle">
          Διάλεξε στόχο t, παρακολούθησε το BFS-«κύμα» και σύγκρινε
        </span>
      </div>

      {/* target picker */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Στόχος t =
        </span>
        {TARGETS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTarget(id)}
            className={cn(
              'inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold transition-colors',
              target === id
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-elevated text-fg hover:bg-bg-soft',
            )}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* left: BFS wave */}
        <div className="graph-canvas">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            BFS-«κύμα» — επίπεδα L₀, L₁, L₂, L₃
          </div>
          <svg viewBox={L06_BFS_TREE.viewBox} className="block h-auto w-full" role="img">
            {LEVEL_BAND_Y.map((y, i) => (
              <g key={`band-${i}`}>
                <rect
                  x={6}
                  y={y}
                  width={608}
                  height={LEVEL_BAND_H}
                  rx={8}
                  fill={i < waveStep ? '#9f1239' : '#cbb8ba'}
                  fillOpacity={i < waveStep ? 0.08 : 0.04}
                  stroke={i < waveStep ? '#9f1239' : '#a3a3a3'}
                  strokeOpacity={0.3}
                  strokeDasharray="6 4"
                />
                <text x={18} y={y + 22} fontSize={12} fontWeight={700} fill="#9f1239" fillOpacity={i < waveStep ? 0.85 : 0.4}>
                  L{i} {i < waveStep ? '— ενεργό' : '— ακόμα'}
                </text>
              </g>
            ))}
            {/* edges */}
            {L06_BFS_TREE.edges.map((e, i) => {
              const g = routeL06BfsTreeEdge(e.a, e.b)
              return g.kind === 'line' ? (
                <line
                  key={`e-${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="#9b8a8d"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`e-${i}`}
                  d={g.d}
                  fill="none"
                  stroke="#9b8a8d"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              )
            })}
            {/* nodes */}
            {L06_BFS_TREE.nodes.map((n) => {
              const isTarget = n.id === target
              const isDiscovered = discovered.has(n.id)
              const onFrontier = frontierThisStep.has(n.id)
              const fill = isTarget
                ? '#9f1239'
                : isDiscovered
                  ? onFrontier
                    ? '#fef3c7'
                    : '#d1fae5'
                  : '#ffffff'
              const stroke = isTarget
                ? '#7e1031'
                : isDiscovered
                  ? onFrontier
                    ? '#d97706'
                    : '#059669'
                  : '#9b8a8d'
              const txt = isTarget ? '#ffffff' : isDiscovered ? '#065f46' : '#1c1214'
              return (
                <g key={`n-${n.id}`} transform={`translate(${n.x} ${n.y})`}>
                  {isTarget && (
                    <circle r={28} fill="none" stroke="#9f1239" strokeWidth={2} strokeDasharray="3 3" />
                  )}
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

        {/* right: distance & shortest path */}
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Συντομότερη διαδρομή 1 → t
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {path.map((v, i) => (
                <span key={`p-${v}-${i}`} className="contents">
                  <span
                    className={cn(
                      'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold',
                      v === target
                        ? 'border-accent bg-accent text-accent-fg'
                        : 'border-emerald-500/50 bg-emerald-50 text-emerald-800',
                    )}
                  >
                    {v}
                  </span>
                  {i < path.length - 1 && <span className="text-fg-subtle">→</span>}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-fg-subtle">
              Μήκος (πλήθος ακμών) ={' '}
              <span className="font-mono font-bold text-fg">{path.length - 1}</span>
              {' '}— αυτή είναι η <strong>απόσταση d(1, {target})</strong>.
            </div>
          </div>

          {/* verdict box */}
          <div
            className={cn(
              'rounded-lg border px-3 py-2.5 text-sm leading-relaxed',
              targetArrived
                ? 'border-emerald-500/40 bg-emerald-50 text-emerald-900'
                : 'border-amber-400/50 bg-amber-50 text-amber-900',
            )}
          >
            {targetArrived ? (
              <>
                <strong>✓ Επιβεβαίωση.</strong> Η {target} εμφανίστηκε στο L
                <sub>{d}</sub>, ακριβώς στο βήμα {d} του BFS-«κύματος». Άρα{' '}
                <span className="font-mono">L({target}) = {d} = d(1, {target})</span>.
                Το θεώρημα μόλις είδαμε να συμβαίνει.
              </>
            ) : (
              <>
                <strong>Το κύμα δεν έχει φτάσει ακόμα την t = {target}.</strong> Είμαστε
                στο βήμα {waveStep} / {maxLayer}. Συνέχισε με «Επόμενο επίπεδο» — η
                στόχος-κορυφή έχει απόσταση {d}, άρα θα ενεργοποιηθεί στο βήμα {d}.
              </>
            )}
          </div>

          <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-xs leading-relaxed text-fg-muted">
            <p className="mb-1.5">
              <strong>«Γιατί δεν εμφανίζεται νωρίτερα;»</strong> Κάθε κορυφή απόστασης d
              έχει την πιο σύντομη διαδρομή της με d ακμές. Το BFS-κύμα προχωράει μία
              ακμή ανά βήμα — άρα στο βήμα i &lt; d δεν υπάρχει τρόπος να την έχει
              «αγγίξει» ακόμα.
            </p>
            <p>
              <strong>«Γιατί δεν αργεί;»</strong> Στο βήμα d−1 το κύμα έχει αγγίξει ΟΛΟΥΣ
              τους γείτονες της t που απέχουν d−1. Στο επόμενο βήμα το κύμα τους
              σαρώνει — η t εντοπίζεται τότε. Άρα όχι αργότερα από το d.
            </p>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setWaveStep(0)
            setPlaying(false)
          }}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Καθαρά
        </button>
        <button
          type="button"
          onClick={() => setWaveStep((w) => Math.max(0, w - 1))}
          disabled={waveStep === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Πίσω
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={waveStep >= maxLayer}
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
          onClick={() => setWaveStep((w) => Math.min(maxLayer, w + 1))}
          disabled={waveStep >= maxLayer}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο επίπεδο <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          Επίπεδο {waveStep} / {maxLayer}
        </span>
      </div>
    </section>
  )
}
