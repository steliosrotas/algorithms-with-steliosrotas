'use client'

/**
 * MutualReachabilityExplorer — the definition behind «ισχυρά συνεκτικό» (L08).
 *
 * Strong connectivity is built on top of «αμοιβαία προσπελάσιμη»: u and v
 * are mutually reachable when both u → v AND v → u exist. A graph is
 * strongly connected when EVERY pair is mutually reachable. The static SVG
 * the page used to lead this section with — two example graphs side by side
 * — tells the student that, but lets them only read; it never asks them to
 * use the definition. This viz replaces it with a pair tester.
 *
 *   1. Pick a graph: «Ισχυρά συνεκτικό» (full 5-cycle) or «Λείπει ακμή»
 *      (cycle minus 5 → 1).
 *   2. Click two vertices to form an ordered pair u, v.
 *   3. The side panel shows both BFS reaches and a pair-verdict pill.
 *   4. The «Δοκίμασε όλα τα ζεύγη» button sweeps every unordered pair and
 *      tallies how many are mutually reachable — yielding the
 *      strong-connectivity verdict the graph deserves.
 *
 * The «no» graph has its 5 → 1 edge missing; the broken pairs (anything
 * paired with 1 in the «from 5,4,3,2 → 1» direction) cluster around vertex 1,
 * which is exactly how the prose described it. Built for L08.
 */

import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type MNode = { id: number; x: number; y: number }

const NODES: MNode[] = [
  { id: 1, x: 200, y: 48 },
  { id: 2, x: 340, y: 148 },
  { id: 3, x: 286, y: 308 },
  { id: 4, x: 114, y: 308 },
  { id: 5, x: 60, y: 148 },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const R = 22
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

const CYCLE: [number, number][] = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 1],
]

const EDGES: Record<'yes' | 'no', [number, number][]> = {
  yes: CYCLE,
  no: CYCLE.filter(([a, b]) => !(a === 5 && b === 1)),
}

function adjacency(edges: [number, number][]) {
  const adj = new Map<number, number[]>()
  for (const n of NODES) adj.set(n.id, [])
  for (const [a, b] of edges) adj.get(a)!.push(b)
  return adj
}

function shortestPath(
  adj: Map<number, number[]>,
  s: number,
  t: number,
): number[] | null {
  if (s === t) return [s]
  const parent = new Map<number, number>()
  parent.set(s, -1)
  let frontier = [s]
  while (frontier.length) {
    const next: number[] = []
    for (const u of frontier) {
      for (const v of adj.get(u) ?? []) {
        if (!parent.has(v)) {
          parent.set(v, u)
          if (v === t) {
            // reconstruct
            const out: number[] = []
            let cur: number | undefined = t
            while (cur !== undefined && cur !== -1) {
              out.unshift(cur)
              cur = parent.get(cur)
            }
            return out
          }
          next.push(v)
        }
      }
    }
    frontier = next
  }
  return null
}

/**
 * Collision-aware edge routing: straight segment trimmed to the node borders
 * when the centerline clears every other node, or a quadratic Bezier that
 * bends around the offending node, also trimmed so the arrowhead lands on
 * the target border. Locks out the «edge through unrelated node» class of
 * bug structurally per Phase E.4.6.
 */
function routedEdge(a: MNode, b: MNode) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  return trimEdgeGeom(geom, a.x, a.y, R + 2, b.x, b.y, R + 2)
}

function edgeKey(a: number, b: number) {
  return `${a}→${b}`
}

type PairResult = { ab: number[] | null; ba: number[] | null }

function pairResult(
  edges: [number, number][],
  u: number,
  v: number,
): PairResult {
  const adj = adjacency(edges)
  return {
    ab: shortestPath(adj, u, v),
    ba: shortestPath(adj, v, u),
  }
}

function allPairsMutual(edges: [number, number][]): { mutual: number; total: number } {
  let mutual = 0
  let total = 0
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      total++
      const r = pairResult(edges, NODES[i].id, NODES[j].id)
      if (r.ab && r.ba) mutual++
    }
  }
  return { mutual, total }
}

export function MutualReachabilityExplorer() {
  const [which, setWhich] = useState<'yes' | 'no'>('yes')
  const [u, setU] = useState<number | null>(2)
  const [v, setV] = useState<number | null>(5)
  const [allMode, setAllMode] = useState(false)

  // reset selection when graph changes
  useEffect(() => {
    setU(2)
    setV(5)
    setAllMode(false)
  }, [which])

  const edges = EDGES[which]
  const result = useMemo(
    () => (u !== null && v !== null ? pairResult(edges, u, v) : null),
    [edges, u, v],
  )
  const tally = useMemo(() => allPairsMutual(edges), [edges])

  function handleClick(id: number) {
    if (u === null) {
      setU(id)
      return
    }
    if (v === null) {
      setV(id === u ? null : id)
      return
    }
    // both set — start new pair
    if (id === u) {
      setU(null)
      return
    }
    if (id === v) {
      setV(null)
      return
    }
    // shift: drop old u, promote v to u, set new v
    setU(v)
    setV(id)
  }

  function clearPair() {
    setU(null)
    setV(null)
  }

  // path edges (for highlighting)
  const abEdges = new Set<string>()
  const baEdges = new Set<string>()
  if (result?.ab) {
    for (let i = 0; i < result.ab.length - 1; i++)
      abEdges.add(edgeKey(result.ab[i], result.ab[i + 1]))
  }
  if (result?.ba) {
    for (let i = 0; i < result.ba.length - 1; i++)
      baEdges.add(edgeKey(result.ba[i], result.ba[i + 1]))
  }

  const verdict: 'mutual' | 'oneWay' | 'none' | 'sameNode' | 'incomplete' = !result
    ? 'incomplete'
    : u === v
      ? 'sameNode'
      : result.ab && result.ba
        ? 'mutual'
        : result.ab || result.ba
          ? 'oneWay'
          : 'none'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Αμοιβαία προσπέλαση — δοκίμασε ζεύγη
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['yes', 'no'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setWhich(key)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                which === key
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {key === 'yes' ? 'Ισχυρά συνεκτικό' : 'Λείπει ακμή 5→1'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-xs text-fg-subtle">
        Κάνε κλικ σε δύο κορυφές — η πρώτη γίνεται u (μπλε), η δεύτερη v
        (πορτοκαλί). Πρέπει να υπάρχουν ΚΑΙ τα δύο μονοπάτια u → v και v → u
        για να είναι το ζεύγος «αμοιβαία προσπελάσιμο».
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* graph */}
        <div className="graph-canvas">
          <svg
            viewBox="0 0 400 360"
            className="mx-auto block h-auto w-full max-w-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="mr-arr"
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
                id="mr-arr-ab"
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
                id="mr-arr-ba"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6.5"
                markerHeight="6.5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
              </marker>
            </defs>

            {/* edges */}
            {edges.map(([a, b], i) => {
              const A = POS.get(a)!
              const B = POS.get(b)!
              const g = routedEdge(A, B)
              const key = edgeKey(a, b)
              const ab = abEdges.has(key)
              const ba = baEdges.has(key)
              const stroke = ab && ba ? '#7c3aed' : ab ? '#1d4ed8' : ba ? '#d97706' : '#c9bcbe'
              const sw = ab || ba ? 3 : 1.8
              const marker = ab && ba ? 'mr-arr-ab' : ab ? 'mr-arr-ab' : ba ? 'mr-arr-ba' : 'mr-arr'
              return g.kind === 'line' ? (
                <line
                  key={i}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={sw}
                  markerEnd={`url(#${marker})`}
                />
              ) : (
                <path
                  key={i}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  markerEnd={`url(#${marker})`}
                />
              )
            })}

            {/* nodes */}
            {NODES.map((n) => {
              const isU = n.id === u
              const isV = n.id === v
              const fill = isU ? '#1d4ed8' : isV ? '#d97706' : '#ffffff'
              const stroke = isU ? '#1e40af' : isV ? '#b45309' : '#9b8a8d'
              const txtColor = isU || isV ? '#ffffff' : '#1c1214'
              return (
                <g
                  key={n.id}
                  onClick={() => handleClick(n.id)}
                  style={{ cursor: 'pointer' }}
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
                    fill={txtColor}
                  >
                    {n.id}
                  </text>
                  {(isU || isV) && (
                    <text
                      x={n.x}
                      y={n.y - 36}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={800}
                      fill={isU ? '#1e40af' : '#b45309'}
                    >
                      {isU ? 'u' : 'v'}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          <p className="mt-1 text-center text-xs text-fg-subtle">
            💡 Δοκίμασε στο «Λείπει ακμή» το ζεύγος u = 5, v = 1: από 5 δεν
            φτάνεις πια στην 1.
          </p>
        </div>

        {/* side panel */}
        <div className="space-y-3">
          {/* pair tests */}
          <div className="rounded-lg border border-border bg-bg-soft/40 p-2.5">
            <div className="mb-1 text-[11px] uppercase tracking-wider text-fg-subtle">
              Ζεύγος που εξετάζεις
            </div>
            <div className="mb-2 font-mono text-sm text-fg">
              u = {u ?? '—'} , v = {v ?? '—'}
            </div>

            {/* u→v */}
            <div
              className={cn(
                'flex items-start justify-between gap-2 rounded-md border px-2 py-1.5 text-xs',
                !result
                  ? 'border-border bg-bg-elevated text-fg-subtle'
                  : result.ab
                    ? 'border-blue-500/50 bg-blue-50 text-blue-900'
                    : 'border-red-500/50 bg-red-50 text-red-900',
              )}
            >
              <div>
                <span className="font-bold">u → v:</span>{' '}
                {!result
                  ? 'περιμένει ζεύγος…'
                  : result.ab
                    ? result.ab.join(' → ')
                    : 'δεν υπάρχει διαδρομή'}
              </div>
              {result && (
                <span className="font-bold">{result.ab ? '✓' : '✗'}</span>
              )}
            </div>

            {/* v→u */}
            <div
              className={cn(
                'mt-1.5 flex items-start justify-between gap-2 rounded-md border px-2 py-1.5 text-xs',
                !result
                  ? 'border-border bg-bg-elevated text-fg-subtle'
                  : result.ba
                    ? 'border-amber-500/50 bg-amber-50 text-amber-900'
                    : 'border-red-500/50 bg-red-50 text-red-900',
              )}
            >
              <div>
                <span className="font-bold">v → u:</span>{' '}
                {!result
                  ? 'περιμένει ζεύγος…'
                  : result.ba
                    ? result.ba.join(' → ')
                    : 'δεν υπάρχει διαδρομή'}
              </div>
              {result && (
                <span className="font-bold">{result.ba ? '✓' : '✗'}</span>
              )}
            </div>

            {/* pair verdict */}
            <div
              className={cn(
                'mt-2 rounded-md px-2 py-1.5 text-xs font-semibold',
                verdict === 'mutual' && 'border border-emerald-500/50 bg-emerald-50 text-emerald-800',
                verdict === 'oneWay' && 'border border-amber-500/50 bg-amber-50 text-amber-900',
                verdict === 'none' && 'border border-red-500/50 bg-red-50 text-red-900',
                verdict === 'sameNode' && 'border border-border bg-bg-elevated text-fg-subtle',
                verdict === 'incomplete' && 'border border-border bg-bg-elevated text-fg-subtle',
              )}
            >
              {verdict === 'mutual' && '✓ Αμοιβαία προσπελάσιμα'}
              {verdict === 'oneWay' && '⇆ Μόνο μία κατεύθυνση δουλεύει — όχι αμοιβαία'}
              {verdict === 'none' && '✗ Καμία διαδρομή προς καμία κατεύθυνση'}
              {verdict === 'sameNode' && 'Διάλεξε δύο ΔΙΑΦΟΡΕΤΙΚΕΣ κορυφές'}
              {verdict === 'incomplete' && 'Διάλεξε δύο κορυφές για να ξεκινήσεις'}
            </div>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={clearPair}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-fg transition-colors hover:bg-bg-soft"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Καθαρά
              </button>
              <button
                type="button"
                onClick={() => setAllMode((x) => !x)}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                  allMode
                    ? 'bg-accent text-accent-fg hover:opacity-90'
                    : 'border border-border text-fg hover:bg-bg-soft',
                )}
              >
                Δοκίμασε όλα τα ζεύγη{' '}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* all-pairs panel */}
          {allMode && (
            <AllPairsPanel which={which} edges={edges} tally={tally} />
          )}
        </div>
      </div>
    </section>
  )
}

function AllPairsPanel({
  which,
  edges,
  tally,
}: {
  which: 'yes' | 'no'
  edges: [number, number][]
  tally: { mutual: number; total: number }
}) {
  // build the full pair matrix
  const cells = useMemo(() => {
    const ids = NODES.map((n) => n.id)
    return ids.map((a) =>
      ids.map((b) => {
        if (a === b) return null
        const r = pairResult(edges, a, b)
        const both = !!(r.ab && r.ba)
        const oneWay = !both && !!(r.ab || r.ba)
        return { both, oneWay, ab: !!r.ab, ba: !!r.ba }
      }),
    )
  }, [edges])
  const ids = NODES.map((n) => n.id)
  const verdict = tally.mutual === tally.total

  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 p-2.5">
      <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-fg-subtle">
        <span>Όλα τα ζεύγη — αμοιβαία προσπελάσιμα;</span>
        <span className="font-mono text-fg">
          {tally.mutual} / {tally.total}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center font-mono text-[10px]">
          <thead>
            <tr>
              <th className="border border-border p-0.5"></th>
              {ids.map((b) => (
                <th key={b} className="border border-border p-0.5 text-fg-subtle">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, i) => (
              <tr key={i}>
                <th className="border border-border p-0.5 text-fg-subtle">{ids[i]}</th>
                {row.map((cell, j) =>
                  cell === null ? (
                    <td
                      key={j}
                      className="border border-border bg-bg-elevated p-0.5 text-fg-subtle"
                    >
                      —
                    </td>
                  ) : (
                    <td
                      key={j}
                      className={cn(
                        'border border-border p-0.5',
                        cell.both && 'bg-emerald-100 text-emerald-800',
                        !cell.both && cell.oneWay && 'bg-amber-100 text-amber-800',
                        !cell.both && !cell.oneWay && 'bg-red-100 text-red-800',
                      )}
                    >
                      {cell.both ? '✓' : cell.oneWay ? '½' : '✗'}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1 text-[10px] text-fg-subtle">
        ✓ αμοιβαία · ½ μονόδρομη · ✗ καμία διαδρομή · — διαγώνιος
      </p>
      <div
        className={cn(
          'mt-2 rounded-md border px-2 py-1.5 text-xs font-semibold',
          verdict
            ? 'border-emerald-500/50 bg-emerald-50 text-emerald-800'
            : 'border-red-500/50 bg-red-50 text-red-900',
        )}
      >
        {verdict
          ? `✓ ΟΛΑ τα ${tally.total} ζεύγη αμοιβαία — άρα ${which === 'yes' ? 'το γράφημα είναι ισχυρά συνεκτικό' : 'το γράφημα είναι ισχυρά συνεκτικό'}.`
          : `✗ Μόνο ${tally.mutual} από ${tally.total} ζεύγη αμοιβαία — άρα ΔΕΝ είναι ισχυρά συνεκτικό. Τα κίτρινα/κόκκινα κελιά είναι όσα σπάει η ακμή 5 → 1 που λείπει.`}
      </div>
    </div>
  )
}
