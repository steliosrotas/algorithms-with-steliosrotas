'use client'

/**
 * DijkstraProofViz — why the vertex Dijkstra settles really is settled (L09).
 *
 * The correctness proof is a four-link inequality chain that most students
 * accept on faith. This viz makes it concrete: Dijkstra is about to settle v;
 * the student picks ANY path s→v, the viz finds the first edge that leaves the
 * settled set S, and then reveals the chain one link at a time — each link
 * tied to a picture (the prefix P′, the settled endpoint, the definition of
 * π, Dijkstra's min-choice). Switching paths and watching the chain still end
 * at ≥ π(v) is the proof: no path can beat it. Built for L09.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type DNode = { id: string; x: number; y: number; inS: boolean }
const NODES: DNode[] = [
  { id: 's', x: 66, y: 116, inS: true },
  { id: 'x', x: 210, y: 84, inS: true },
  { id: 'y', x: 210, y: 240, inS: false },
  { id: 'v', x: 374, y: 162, inS: false },
]
const POS = new Map(NODES.map((n) => [n.id, n]))
const IN_S = new Set(NODES.filter((n) => n.inS).map((n) => n.id))
const R = 22
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

type DEdge = { from: string; to: string; w: number }
const EDGES: DEdge[] = [
  { from: 's', to: 'x', w: 5 },
  { from: 's', to: 'y', w: 14 },
  { from: 'x', to: 'v', w: 5 },
  { from: 'x', to: 'y', w: 8 },
  { from: 'y', to: 'v', w: 4 },
]
const edgeW = (a: string, b: string) =>
  EDGES.find((e) => e.from === a && e.to === b)!.w

/** the value labels the proof treats as already known */
const KNOWN: Record<string, string> = { s: 'd=0', x: 'd=5', y: 'π=13', v: 'π=10' }
const PI_V = 10

type PathDef = {
  id: string
  label: string
  nodes: string[]
}
const PATHS: PathDef[] = [
  { id: 'P1', label: 's → x → v', nodes: ['s', 'x', 'v'] },
  { id: 'P2', label: 's → x → y → v', nodes: ['s', 'x', 'y', 'v'] },
  { id: 'P3', label: 's → y → v', nodes: ['s', 'y', 'v'] },
]

type Solved = {
  edges: [string, string][]
  crossIdx: number
  xx: string // the proof's "x" — last settled vertex before leaving S
  yy: string // the proof's "y" — first vertex outside S
  prefixLen: number // ℓ(P′)
  total: number // ℓ(P)
  dX: number // d(x)
  crossW: number // ℓ(x,y)
  piY: number // π(y)
}

/** Walk the path, find the first edge that leaves S, total up the weights. */
function solve(path: PathDef): Solved {
  const edges: [string, string][] = []
  for (let i = 0; i + 1 < path.nodes.length; i++) {
    edges.push([path.nodes[i], path.nodes[i + 1]])
  }
  let crossIdx = edges.findIndex(([a, b]) => IN_S.has(a) && !IN_S.has(b))
  if (crossIdx < 0) crossIdx = 0
  const [xx, yy] = edges[crossIdx]
  let prefixLen = 0
  for (let i = 0; i < crossIdx; i++) prefixLen += edgeW(edges[i][0], edges[i][1])
  const total = edges.reduce((s, [a, b]) => s + edgeW(a, b), 0)
  const dX = xx === 's' ? 0 : 5
  const crossW = edgeW(xx, yy)
  const piY = yy === 'v' ? 10 : 13
  return { edges, crossIdx, xx, yy, prefixLen, total, dX, crossW, piY }
}

type EdgePath =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; mx: number; my: number }
  | { kind: 'curve'; d: string; mx: number; my: number }

function endpoints(a: DNode, b: DNode, r: number): EdgePath {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  const trimmed = trimEdgeGeom(geom, a.x, a.y, r, b.x, b.y, r)
  if (trimmed.kind === 'line') {
    return {
      kind: 'line',
      x1: trimmed.x1,
      y1: trimmed.y1,
      x2: trimmed.x2,
      y2: trimmed.y2,
      mx: (a.x + b.x) / 2,
      my: (a.y + b.y) / 2,
    }
  }
  return {
    kind: 'curve',
    d: trimmed.d,
    mx: (a.x + 2 * trimmed.cx + b.x) / 4,
    my: (a.y + 2 * trimmed.cy + b.y) / 4,
  }
}

function ChainRow({
  show,
  symbolic,
  numeric,
  strong,
}: {
  show: boolean
  symbolic: string
  numeric: string
  strong?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-sm transition-opacity',
        show ? 'opacity-100' : 'opacity-25',
        strong
          ? 'bg-success/10 font-bold text-success'
          : 'bg-bg-soft/60 text-fg-muted',
      )}
    >
      <span className="font-mono">{symbolic}</span>
      <span className="font-mono font-semibold">{show ? numeric : '—'}</span>
    </div>
  )
}

const LAST = 6

export function DijkstraProofViz() {
  const [pathId, setPathId] = useState('P2')
  const [step, setStep] = useState(0)
  const path = PATHS.find((p) => p.id === pathId)!
  const sol = useMemo(() => solve(path), [path])

  const pathEdgeSet = useMemo(
    () => new Set(sol.edges.map(([a, b]) => `${a}>${b}`)),
    [sol],
  )
  const crossKey = `${sol.xx}>${sol.yy}`
  const cross = sol.crossW
  const { xx, yy } = sol

  function pickPath(id: string) {
    setPathId(id)
    setStep(0)
  }

  const note = useMemo(() => {
    switch (step) {
      case 0:
        return `Ο Dijkstra πρόκειται να οριστικοποιήσει την κορυφή v: από όσες μένουν, αυτή έχει το μικρότερο π — εδώ π(v) = ${PI_V}. Για να είναι σωστό, καμία διαδρομή s→v δεν επιτρέπεται να κοστίζει λιγότερο. Διάλεξες τη διαδρομή ${path.label}, συνολικού μήκους ${sol.total}.`
      case 1:
        return `Η διαδρομή ξεκινά μέσα στο S (στην s) και τελειώνει έξω (στην v) — άρα κάπου ΒΓΑΙΝΕΙ. Σημείωσε την πρώτη ακμή που φεύγει από το S: η (${xx}, ${yy}). Το κομμάτι πριν από αυτήν, η P′, φτάνει ως την ${xx}.`
      case 2:
        return `Πρώτος κρίκος. Όλα τα βάρη είναι ≥ 0, οπότε ό,τι ακολουθεί την ακμή (${xx}, ${yy}) δεν μπορεί να εκπτώσει το κόστος: ℓ(P) ≥ ℓ(P′) + ℓ(${xx}, ${yy}).`
      case 3:
        return `Η ${xx} είναι ήδη οριστικοποιημένη — βρίσκεται μέσα στο S. Από την επαγωγική υπόθεση, το d(${xx}) είναι ήδη το συντομότερο s→${xx}, άρα ℓ(P′) ≥ d(${xx}).`
      case 4:
        return `Εξ ορισμού, το π(${yy}) είναι το ελάχιστο d(u) + ℓ(u, ${yy}) πάνω από κάθε οριστικοποιημένη u. Το d(${xx}) + ℓ(${xx}, ${yy}) είναι ακριβώς μία τέτοια επιλογή — άρα είναι ≥ π(${yy}).`
      case 5:
        return yy === 'v'
          ? `Εδώ η «y» της απόδειξης συμπίπτει με την ίδια την v, οπότε π(${yy}) = π(v) ήδη.`
          : `Ο Dijkstra διάλεξε την v επειδή είχε το ελάχιστο π. Άρα κάθε άλλη κορυφή που μένει — και η ${yy} — έχει π ≥ π(v).`
      default:
        return `Η αλυσίδα έκλεισε: ℓ(P) ≥ π(v) = ${PI_V}. Η διαδρομή που διάλεξες κοστίζει ${sol.total} ≥ ${PI_V}. Δοκίμασε κι άλλη διαδρομή — το συμπέρασμα δεν αλλάζει· γι' αυτό η οριστικοποίηση της v είναι ασφαλής. ∎`
    }
  }, [step, path, sol, xx, yy])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + path picker */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γιατί ο Dijkstra είναι σωστός — η αλυσίδα ανισοτήτων
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {PATHS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pickPath(p.id)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                pathId === p.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Πράσινο = μέσα στο S (οριστικοποιημένες) · μωβ = η διαδρομή P που
        διάλεξες · χρυσό = η πρώτη ακμή που φεύγει από το S.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 440 300"
          className="mx-auto block w-full max-w-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {[
              ['dp-grey', '#b3a3a5'],
              ['dp-path', '#7c3aed'],
              ['dp-cross', '#d97706'],
            ].map(([id, col]) => (
              <marker
                key={id}
                id={id}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6.5"
                markerHeight="6.5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={col} />
              </marker>
            ))}
          </defs>

          {/* the settled set S */}
          <ellipse
            cx={138}
            cy={100}
            rx={126}
            ry={70}
            fill="#22c55e"
            fillOpacity={0.08}
            stroke="#16a34a"
            strokeWidth={2}
            strokeDasharray="7 5"
          />
          <text x={56} y={44} fontSize={13} fontWeight={700} fill="#15803d">
            S — οριστικοποιημένες
          </text>

          {/* edges */}
          {EDGES.map((e) => {
            const A = POS.get(e.from)!
            const B = POS.get(e.to)!
            const g = endpoints(A, B, R)
            const key = `${e.from}>${e.to}`
            const onPath = pathEdgeSet.has(key)
            const isCross = key === crossKey && step >= 1
            let stroke = '#b3a3a5'
            let width = 1.8
            let marker = 'url(#dp-grey)'
            if (isCross) {
              stroke = '#d97706'
              width = 4.5
              marker = 'url(#dp-cross)'
            } else if (onPath) {
              stroke = '#7c3aed'
              width = 4
              marker = 'url(#dp-path)'
            }
            return (
              <g key={key}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={width}
                    markerEnd={marker}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width}
                    markerEnd={marker}
                  />
                )}
                <rect
                  x={g.mx - 10}
                  y={g.my - 9}
                  width={20}
                  height={16}
                  rx={3.5}
                  fill="#faf4ee"
                  stroke={isCross ? '#d97706' : onPath ? '#7c3aed' : '#cdbfc0'}
                  strokeWidth={isCross || onPath ? 1.8 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {NODES.map((n) => {
            const isV = n.id === 'v'
            const isXX = n.id === xx && step >= 1
            const isYY = n.id === yy && step >= 1
            return (
              <g key={n.id}>
                {isV && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R + 6}
                    fill="none"
                    stroke="#9f1239"
                    strokeWidth={2.5}
                    strokeDasharray="4 3"
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={n.inS ? '#d1fae5' : '#ffffff'}
                  stroke={
                    isXX
                      ? '#7c3aed'
                      : isYY
                        ? '#d97706'
                        : n.inS
                          ? '#059669'
                          : '#9b8a8d'
                  }
                  strokeWidth={isXX || isYY ? 3.5 : 2.5}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
                {/* known-value chip */}
                <rect
                  x={n.x - 20}
                  y={n.y + R + 3}
                  width={40}
                  height={17}
                  rx={4}
                  fill="#faf4ee"
                  stroke="#cdbfc0"
                />
                <text
                  x={n.x}
                  y={n.y + R + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10.5}
                  fontWeight={700}
                  fill="#5a4a4d"
                >
                  {KNOWN[n.id]}
                </text>
                {isV && (
                  <text
                    x={n.x}
                    y={n.y - R - 10}
                    textAnchor="middle"
                    fontSize={10.5}
                    fontWeight={700}
                    fill="#9f1239"
                  >
                    οριστικοποιείται
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* the inequality chain */}
      <div className="mt-3 space-y-1">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Η αλυσίδα — κάθε κρίκος ≥ ο επόμενος
        </div>
        <ChainRow
          show={step >= 2}
          symbolic={`ℓ(P) ≥ ℓ(P′) + ℓ(${xx},${yy})`}
          numeric={`${sol.total} ≥ ${sol.prefixLen} + ${cross}`}
        />
        <ChainRow
          show={step >= 3}
          symbolic={`     ≥ d(${xx}) + ℓ(${xx},${yy})`}
          numeric={`≥ ${sol.dX} + ${cross}`}
        />
        <ChainRow
          show={step >= 4}
          symbolic={`     ≥ π(${yy})`}
          numeric={`≥ ${sol.piY}`}
        />
        <ChainRow
          show={step >= 5}
          symbolic="     ≥ π(v)"
          numeric={`≥ ${PI_V}`}
          strong
        />
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={step === LAST}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {LAST}
        </span>
      </div>
    </section>
  )
}
