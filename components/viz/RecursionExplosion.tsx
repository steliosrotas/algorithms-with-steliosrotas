'use client'

/**
 * RecursionExplosion — overlapping-subproblems explosion, naive vs memoized.
 *
 * Two `instance` presets share the exact same UI:
 *  - 'fibonacci' (default, used in the L14 lecture page): each call branches
 *    into k−1 and k−2; base case k ≤ 1.
 *  - 'tribonacci-max' (used in pt7-th2 — bₙ = 2·max(bₙ₋₁, bₙ₋₂) + bₙ₋₃): each
 *    call branches into k−1, k−2, k−3; base case k ≤ 3. The recursion tree
 *    has THREE children per node, so the lower-bound argument
 *    T(n) ≥ 3 · T(n−3)  ⇒  T(n) ≥ 3^(n/3) = 1.44ⁿ becomes a visible feature
 *    of the picture: every node has three downward edges, the smallest
 *    descendant drops the argument by only 3.
 *
 * Clicking any node lights up every other call of the same value — in naive
 * mode that's overlapping subproblems made physical, in memoized mode it's
 * one real computation plus a handful of instant cache hits. A growth table
 * carries the feeling past the drawable range — fib(30) is 2.7M naive calls
 * against 59 memoized, b(20) is millions against ~60.
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type Mode = 'naive' | 'memo'
type Kind = 'compute' | 'hit' | 'base'

type FibNode = {
  uid: string
  k: number
  depth: number
  kind: Kind
  children: FibNode[]
}

type Instance = 'fibonacci' | 'tribonacci-max'

type Config = {
  /** how each call branches — children get k − d for each d in deltas */
  deltas: number[]
  /** base case: k ≤ baseCutoff returns immediately */
  baseCutoff: number
  label: string
  /** UI lower/upper bounds for the n slider */
  nMin: number
  nMax: number
  defaultN: number
  /** the size of the function-call counter in the growth table */
  growthRows: number[]
  title: string
  hint: string
  intro: string
  /** label used in click-annotation: e.g. «fib({k})» or «b{k}» */
  callLabel: (k: number) => string
  nodeLabel: (k: number) => string
  /** label used in the legend for "the selected call" */
  selectedLegend: string
}

const CONFIGS: Record<Instance, Config> = {
  fibonacci: {
    deltas: [1, 2],
    baseCutoff: 1,
    label: 'fib',
    nMin: 3,
    nMax: 7,
    defaultN: 5,
    growthRows: [10, 20, 30],
    title: 'Το δέντρο αναδρομής του Fibonacci',
    hint:
      'Σύρε το n και δες το δέντρο κλήσεων. Πάτησε έναν κόμβο για να φωτιστεί κάθε άλλη κλήση του ίδιου fib(k).',
    intro: 'Αφελής: εκθετική, ≈ 2ⁿ. Memoization: γραμμική, 2n−1. Στο fib(30) η διαφορά είναι ήδη εκατομμύρια προς δεκάδες.',
    callLabel: (k) => `fib(${k})`,
    nodeLabel: (k) => `F${k}`,
    selectedLegend: 'fib(k)',
  },
  'tribonacci-max': {
    deltas: [1, 2, 3],
    baseCutoff: 3,
    label: 'b',
    nMin: 4,
    nMax: 6,
    defaultN: 6,
    growthRows: [10, 15, 20],
    title: 'Το δέντρο αναδρομής της bₙ = 2·max(bₙ₋₁, bₙ₋₂) + bₙ₋₃',
    hint:
      'Κάθε κλήση παράγει ΤΡΕΙΣ κλήσεις (b(k−1), b(k−2), b(k−3)). Άρα κάθε κόμβος έχει 3 παιδιά — και η μικρότερη κλήση ρίχνει το όρισμα μόνο κατά 3.',
    intro:
      'Αφελής: εκθετική. Με βάθος ≥ n/3 και διακλάδωση 3, το δέντρο έχει ≥ 3^(n/3) = 1,44ⁿ κόμβους — εκθετικά πολλούς. Με DP: γραμμική (n κλήσεις).',
    callLabel: (k) => `b(${k})`,
    nodeLabel: (k) => `b${k}`,
    selectedLegend: 'b(k)',
  },
}

const SLOT_W = 38
const LEVEL_H = 60
const R = 17
const MARGIN = 26

function buildNaive(n: number, cfg: Config): FibNode {
  let counter = 0
  function rec(k: number, depth: number): FibNode {
    const uid = `x${counter++}`
    if (k <= cfg.baseCutoff) return { uid, k, depth, kind: 'base', children: [] }
    const children = cfg.deltas.map((d) => rec(k - d, depth + 1))
    return { uid, k, depth, kind: 'compute', children }
  }
  return rec(n, 0)
}

function buildMemo(n: number, cfg: Config): FibNode {
  const computed = new Set<number>()
  let counter = 0
  function rec(k: number, depth: number): FibNode {
    const uid = `x${counter++}`
    if (computed.has(k)) return { uid, k, depth, kind: 'hit', children: [] }
    computed.add(k)
    if (k <= cfg.baseCutoff) return { uid, k, depth, kind: 'base', children: [] }
    const children = cfg.deltas.map((d) => rec(k - d, depth + 1))
    return { uid, k, depth, kind: 'compute', children }
  }
  return rec(n, 0)
}

function naiveCalls(n: number, cfg: Config): number {
  const c: number[] = new Array(Math.max(n + 1, cfg.baseCutoff + 1)).fill(1)
  for (let k = cfg.baseCutoff + 1; k <= n; k++) {
    c[k] = 1 + cfg.deltas.reduce((s, d) => s + (k - d >= 0 ? c[k - d] : 0), 0)
  }
  return c[n] ?? 1
}

function memoCalls(n: number, cfg: Config): number {
  if (n <= cfg.baseCutoff) return 1
  const computed = new Set<number>()
  let count = 0
  function rec(k: number) {
    count++
    if (computed.has(k)) return
    computed.add(k)
    if (k <= cfg.baseCutoff) return
    for (const d of cfg.deltas) rec(k - d)
  }
  rec(n)
  return count
}

type Positioned = { uid: string; k: number; depth: number; kind: Kind; x: number; y: number }

function layoutTree(root: FibNode) {
  const pos = new Map<string, { x: number; y: number }>()
  let slot = 0
  function assign(node: FibNode): number {
    let x: number
    if (node.children.length === 0) {
      x = slot * SLOT_W
      slot += 1
    } else {
      const xs = node.children.map(assign)
      x = (xs[0] + xs[xs.length - 1]) / 2
    }
    pos.set(node.uid, { x, y: node.depth * LEVEL_H })
    return x
  }
  assign(root)

  const nodes: Positioned[] = []
  const edges: { from: string; to: string }[] = []
  function walk(node: FibNode) {
    const p = pos.get(node.uid)!
    nodes.push({ uid: node.uid, k: node.k, depth: node.depth, kind: node.kind, x: p.x, y: p.y })
    for (const c of node.children) {
      edges.push({ from: node.uid, to: c.uid })
      walk(c)
    }
  }
  walk(root)
  return { nodes, edges }
}

interface Props {
  instance?: Instance
}

export function RecursionExplosion({ instance = 'fibonacci' }: Props) {
  const cfg = CONFIGS[instance]
  const [n, setN] = useState(cfg.defaultN)
  const [mode, setMode] = useState<Mode>('naive')
  const [selectedK, setSelectedK] = useState<number | null>(null)

  const { nodes, edges } = useMemo(
    () => layoutTree(mode === 'naive' ? buildNaive(n, cfg) : buildMemo(n, cfg)),
    [n, mode, cfg],
  )

  /**
   * Collision-aware edge routing — rects live in the rendered (post-MARGIN)
   * coordinate frame so `routeEdge` operates on the same geometry the SVG
   * actually draws. Layout depends on (n, mode, cfg) transitively via `nodes`.
   */
  const { rects: nodeRects, rectById: nodeRectById } = useMemo(() => {
    const rects: NodeRect[] = []
    const byId = new Map<string, NodeRect>()
    for (const nd of nodes) {
      const r: NodeRect = {
        id: nd.uid,
        x: nd.x + MARGIN - R,
        y: nd.y + MARGIN - R,
        w: 2 * R,
        h: 2 * R,
      }
      rects.push(r)
      byId.set(nd.uid, r)
    }
    return { rects, rectById: byId }
  }, [nodes])

  /** Routed parent→child edge geometry, center-to-center (recursion-tree
   *  edges have no arrowheads). */
  const routedEdge = (fromUid: string, toUid: string) => {
    const aR = nodeRectById.get(fromUid)!
    const bR = nodeRectById.get(toUid)!
    return routeEdge(aR, bR, nodeRects)
  }

  const naive = naiveCalls(n, cfg)
  const memo = memoCalls(n, cfg)
  const ratio = memo > 0 ? naive / memo : 1
  const ratioLabel = ratio >= 10 ? Math.round(ratio).toString() : (Math.round(ratio * 10) / 10).toString()

  const maxX = Math.max(...nodes.map((nd) => nd.x))
  const maxY = Math.max(...nodes.map((nd) => nd.y))
  const vbW = maxX + 2 * MARGIN
  const vbH = maxY + 2 * MARGIN

  const sameK = selectedK == null ? [] : nodes.filter((nd) => nd.k === selectedK)
  const selCount = sameK.length
  const selHits = sameK.filter((nd) => nd.kind === 'hit').length

  function changeN(value: number) {
    setN(value)
    setSelectedK(null)
  }
  function changeMode(m: Mode) {
    setMode(m)
    setSelectedK(null)
  }
  function reset() {
    setN(cfg.defaultN)
    setMode('naive')
    setSelectedK(null)
  }

  let note: string
  if (selectedK != null) {
    if (mode === 'naive') {
      note =
        selCount > 1
          ? `Το ${cfg.callLabel(selectedK)} υπολογίζεται ${selCount} φορές μέσα σ' αυτό το δέντρο — και κάθε φορά ξεκινά τον υπολογισμό απ' το μηδέν. Αυτή ακριβώς είναι η επικάλυψη υποπροβλημάτων που κάνει την αφελή αναδρομή εκθετική.`
          : `Το ${cfg.callLabel(selectedK)} εμφανίζεται μόνο μία φορά εδώ — από τους λίγους κόμβους που δεν επαναλαμβάνονται. Πάτησε ένα μικρότερο k για να δεις την επικάλυψη.`
    } else {
      const hits = selHits
      note =
        hits > 0
          ? `Το ${cfg.callLabel(selectedK)} υπολογίζεται μία μόνο φορά. Ζητείται άλλες ${hits} ${hits === 1 ? 'φορά' : 'φορές'} — και κάθε φορά είναι cache hit (πράσινος κόμβος): η τιμή επιστρέφεται αμέσως, χωρίς κανένα υποδέντρο από κάτω.`
          : `Το ${cfg.callLabel(selectedK)} υπολογίζεται μία φορά και εδώ ζητείται μόνο μία φορά — δεν χρειάστηκε cache hit.`
    }
  } else if (mode === 'naive') {
    note =
      instance === 'tribonacci-max'
        ? 'Κάθε κύκλος είναι μία κλήση της b(). Κάθε κόμβος έχει 3 παιδιά (b(k−1), b(k−2), b(k−3)) — η μικρότερη κλήση ρίχνει το όρισμα μόνο κατά 3, άρα το δέντρο έχει βάθος ≥ n/3. Πάτησε έναν κόμβο για να δεις την επικάλυψη — ή γύρνα στο «Memoized».'
        : 'Κάθε κύκλος είναι μία κλήση της fib(). Το δέντρο σχεδόν διπλασιάζεται σε κάθε επίπεδο, γιατί το ίδιο fib(k) ξαναϋπολογίζεται απ’ την αρχή ξανά και ξανά. Πάτησε έναν κόμβο για να το δεις — ή γύρνα στο «Memoized».'
  } else {
    note =
      instance === 'tribonacci-max'
        ? 'Με memoization κάθε b(k) υπολογίζεται μία μόνο φορά. Όλες οι άλλες κλήσεις είναι cache hits (πράσινοι κόμβοι), χωρίς υποδέντρο. Από εκθετικό σε γραμμικό — αυτό κάνει ο DP.'
        : 'Με memoization κάθε fib(k) υπολογίζεται μία μόνο φορά. Κάθε επόμενη φορά που ζητείται, η τιμή επιστρέφεται έτοιμη από τον πίνακα — ο πράσινος κόμβος «cache hit», χωρίς υποδέντρο. Το ίδιο n, αλλά το δέντρο κατέρρευσε.'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + mode tabs */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">{cfg.title}</div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['naive', 'memo'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => changeMode(m)}
              className={cn(
                'rounded px-2.5 py-0.5 text-xs font-medium transition-colors',
                mode === m
                  ? m === 'naive'
                    ? 'bg-danger text-white'
                    : 'bg-success text-white'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {m === 'naive' ? 'Αφελής' : 'Memoized'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">{cfg.hint}</p>

      {/* n slider */}
      <div className="mb-3 flex items-center gap-3">
        <span className="shrink-0 font-mono text-sm font-bold text-fg">
          {cfg.label}(<span className="text-accent">{n}</span>)
        </span>
        <input
          type="range"
          min={cfg.nMin}
          max={cfg.nMax}
          value={n}
          aria-label="Τιμή του n"
          onChange={(e) => changeN(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-accent"
        />
        <span className="shrink-0 text-xs text-fg-subtle">n = {n}</span>
      </div>

      {/* the recursion tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${Math.max(vbW, 280)}px` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {edges.map((e) => {
            const g = routedEdge(e.from, e.to)
            return g.kind === 'line' ? (
              <line
                key={`${e.from}-${e.to}`}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke="#b6a6a8"
                strokeWidth={1.6}
              />
            ) : (
              <path
                key={`${e.from}-${e.to}`}
                d={g.d}
                fill="none"
                stroke="#b6a6a8"
                strokeWidth={1.6}
              />
            )
          })}

          {/* nodes */}
          {nodes.map((nd) => {
            const isSel = selectedK != null && nd.k === selectedK
            let fill = '#ffffff'
            let stroke = '#9b8a8d'
            if (nd.kind === 'base') {
              fill = '#f1eae4'
              stroke = '#b6a6a8'
            }
            if (nd.kind === 'hit') {
              fill = '#dcfce7'
              stroke = '#16a34a'
            }
            if (isSel) {
              fill = '#fde68a'
              stroke = '#d97706'
            }
            return (
              <g
                key={nd.uid}
                role="button"
                tabIndex={0}
                aria-label={`${cfg.callLabel(nd.k)}${nd.kind === 'hit' ? ', cache hit' : ''}`}
                onClick={() => setSelectedK((cur) => (cur === nd.k ? null : nd.k))}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    setSelectedK((cur) => (cur === nd.k ? null : nd.k))
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {isSel && (
                  <circle
                    cx={nd.x + MARGIN}
                    cy={nd.y + MARGIN}
                    r={R + 4}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth={2.4}
                  />
                )}
                <circle
                  cx={nd.x + MARGIN}
                  cy={nd.y + MARGIN}
                  r={R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.2}
                />
                <text
                  x={nd.x + MARGIN}
                  y={nd.y + MARGIN}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={800}
                  fill="#1c1214"
                >
                  {cfg.nodeLabel(nd.k)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* legend */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-subtle">
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-[#9b8a8d] bg-white align-middle" />
          νέος υπολογισμός
        </span>
        {mode === 'memo' && (
          <span>
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-[#16a34a] bg-[#dcfce7] align-middle" />
            cache hit — έτοιμη τιμή
          </span>
        )}
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border-2 border-[#d97706] bg-[#fde68a] align-middle" />
          επιλεγμένο {cfg.selectedLegend}
        </span>
      </div>

      {/* dual call counter */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center',
            mode === 'naive' ? 'border-danger/50 bg-danger/10' : 'border-border bg-bg-soft/40',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Αφελής αναδρομή
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {naive.toLocaleString('el')}
          </div>
          <div className="text-xs text-fg-subtle">κλήσεις της {cfg.label}()</div>
        </div>
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center',
            mode === 'memo' ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/40',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Με memoization
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {memo.toLocaleString('el')}
          </div>
          <div className="text-xs text-fg-subtle">κλήσεις της {cfg.label}()</div>
        </div>
      </div>
      <p className="mt-1.5 text-center text-xs text-fg-muted">
        Για {cfg.callLabel(n)} το memoization κάνει{' '}
        <span className="font-bold text-accent">{ratioLabel}×</span> λιγότερες κλήσεις.
      </p>

      {/* growth table — past the drawable range */}
      <div className="mt-3 overflow-x-auto">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πέρα από το δέντρο — πόσες κλήσεις χρειάζονται
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-fg-subtle">
              <th className="py-1.5 pr-3 font-semibold">{cfg.label}(n)</th>
              <th className="py-1.5 pr-3 text-right font-semibold">Αφελής</th>
              <th className="py-1.5 text-right font-semibold">Memoization</th>
            </tr>
          </thead>
          <tbody>
            {cfg.growthRows.map((gn) => (
              <tr key={gn} className="border-b border-border/60">
                <td className="py-1.5 pr-3 font-mono tabular-nums text-fg">{cfg.label}({gn})</td>
                <td className="py-1.5 pr-3 text-right font-mono font-semibold tabular-nums text-danger">
                  {naiveCalls(gn, cfg).toLocaleString('el')}
                </td>
                <td className="py-1.5 text-right font-mono font-semibold tabular-nums text-success">
                  {memoCalls(gn, cfg).toLocaleString('el')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-1 text-xs text-fg-subtle">{cfg.intro}</p>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* reset */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Επαναφορά
        </button>
      </div>
    </section>
  )
}
