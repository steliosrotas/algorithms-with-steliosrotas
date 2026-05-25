'use client'

/**
 * MultVsAddPaths — front-set-5-ask9 («Συντομότερο μονοπάτι & μετασχηματισμοί
 * βαρών»).
 *
 * Same 2-path graph s → … → t shown with two sliders:
 *  • k (πολλαπλασιαστής, > 0): each edge weight w becomes k·w. The
 *    ordering between paths never changes — green verdict locks in.
 *  • α (πρόσθεση, ≥ 0): each edge weight becomes w + α. A path with
 *    ℓ edges pays ℓ·α extra. The path with FEWER edges may overtake
 *    one with more edges past a threshold.
 *
 * The instance: path A (3 edges, base weights 1+1+1 = 3) vs path B
 * (2 edges, base weights 2+2 = 4). At α=0, A wins (3 < 4). At α=10,
 * A pays +30 → 33 while B pays +20 → 24, so B wins. The ×k panel,
 * by contrast, scales both by the same factor — order is preserved.
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type CNode = { id: string; x: number; y: number }

const S: CNode = { id: 's', x: 50, y: 145 }
const T: CNode = { id: 't', x: 460, y: 145 }
const A1: CNode = { id: 'a₁', x: 170, y: 65 }
const A2: CNode = { id: 'a₂', x: 290, y: 65 }
const B1: CNode = { id: 'b', x: 250, y: 225 }
const R = 21

const PATH_A: { from: CNode; to: CNode; base: number }[] = [
  { from: S, to: A1, base: 1 },
  { from: A1, to: A2, base: 1 },
  { from: A2, to: T, base: 1 },
]
const PATH_B: { from: CNode; to: CNode; base: number }[] = [
  { from: S, to: B1, base: 2 },
  { from: B1, to: T, base: 2 },
]

const ALL_NODES: CNode[] = [S, A1, A2, B1, T]
const NODE_RECTS: NodeRect[] = ALL_NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r]))

function routedEdge(a: CNode, b: CNode) {
  const aRect = NODE_RECT_BY_ID.get(a.id)!
  const bRect = NODE_RECT_BY_ID.get(b.id)!
  const geom = trimEdgeGeom(routeEdge(aRect, bRect, NODE_RECTS), a.x, a.y, R, b.x, b.y, R)
  const mx = geom.kind === 'line' ? (a.x + b.x) / 2 : (a.x + b.x + 2 * geom.cx) / 4
  const my = geom.kind === 'line' ? (a.y + b.y) / 2 : (a.y + b.y + 2 * geom.cy) / 4
  return { ...geom, mx, my }
}

type Panel = 'mult' | 'add'

function PathGraph({
  panel,
  factor,
  shift,
}: {
  panel: Panel
  factor: number
  shift: number
}) {
  const transform = (w: number) => (panel === 'mult' ? w * factor : w + shift)
  const totalA = PATH_A.reduce((s, e) => s + transform(e.base), 0)
  const totalB = PATH_B.reduce((s, e) => s + transform(e.base), 0)
  const winner: 'A' | 'B' = totalA <= totalB ? 'A' : 'B'

  return (
    <div className="rounded-lg border border-border bg-bg-soft/30 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {panel === 'mult'
            ? 'Πολλαπλασιασμός w → k · w'
            : 'Πρόσθεση w → w + α'}
        </div>
        <span
          className={
            'rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ' +
            (winner === 'A'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-amber-100 text-amber-700')
          }
        >
          Νικητής: διαδρομή {winner}
        </span>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 510 290"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id={`mvap-arr-${panel}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id={`mvap-arr-A-${panel}`}
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
              id={`mvap-arr-B-${panel}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#b45309"
              />
            </marker>
          </defs>

          <text x={255} y={22} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1d4ed8">
            Διαδρομή A — {PATH_A.length} ακμές
          </text>
          <text x={255} y={278} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">
            Διαδρομή B — {PATH_B.length} ακμές
          </text>

          {([
            { edges: PATH_A, color: '#1d4ed8', light: '#dbeafe', isWinner: winner === 'A', marker: `url(#mvap-arr-A-${panel})` },
            { edges: PATH_B, color: '#b45309', light: '#fef3c7', isWinner: winner === 'B', marker: `url(#mvap-arr-B-${panel})` },
          ]).flatMap(({ edges, color, light, isWinner, marker }) =>
            edges.map((e, i) => {
              const g = routedEdge(e.from, e.to)
              const w = transform(e.base)
              const label = panel === 'mult'
                ? `${factor}·${e.base}=${w}`
                : `${e.base}+${shift}=${w}`
              const stroke = isWinner ? color : '#bdb0b2'
              const strokeWidth = isWinner ? 3.2 : 1.8
              const markerEnd = isWinner ? marker : `url(#mvap-arr-${panel})`
              return (
                <g key={`${color}-${i}`}>
                  {g.kind === 'line' ? (
                    <line
                      x1={g.x1}
                      y1={g.y1}
                      x2={g.x2}
                      y2={g.y2}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      markerEnd={markerEnd}
                    />
                  ) : (
                    <path
                      d={g.d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      markerEnd={markerEnd}
                    />
                  )}
                  <rect
                    x={g.mx - 30}
                    y={g.my - 11}
                    width={60}
                    height={20}
                    rx={4}
                    fill={isWinner ? light : '#faf4ee'}
                    stroke={isWinner ? color : '#cdbfc0'}
                  />
                  <text
                    x={g.mx}
                    y={g.my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight={700}
                    fill="#1c1214"
                    fontFamily="ui-monospace, monospace"
                  >
                    {label}
                  </text>
                </g>
              )
            }),
          )}

          {[S, A1, A2, B1, T].map((n) => {
            const terminal = n.id === 's' || n.id === 't'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={terminal ? '#fde2e4' : '#ffffff'}
                  stroke={terminal ? '#9f1239' : '#9b8a8d'}
                  strokeWidth={2}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
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

      <div className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
        <div
          className={
            'rounded-md border px-2 py-1.5 ' +
            (winner === 'A' ? 'border-blue-300 bg-blue-50' : 'border-border bg-bg-soft/40')
          }
        >
          <div className="font-semibold text-fg">A · {PATH_A.length} ακμές</div>
          <div className="font-mono text-fg-muted">
            σύνολο ={' '}
            <span className="text-lg font-bold text-fg">{totalA}</span>
          </div>
        </div>
        <div
          className={
            'rounded-md border px-2 py-1.5 ' +
            (winner === 'B' ? 'border-amber-300 bg-amber-50' : 'border-border bg-bg-soft/40')
          }
        >
          <div className="font-semibold text-fg">B · {PATH_B.length} ακμές</div>
          <div className="font-mono text-fg-muted">
            σύνολο ={' '}
            <span className="text-lg font-bold text-fg">{totalB}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MultVsAddPaths() {
  const [k, setK] = useState(1)
  const [alpha, setAlpha] = useState(0)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 text-sm font-semibold tracking-tight text-fg">
        Πολλαπλασιασμός με k vs πρόσθεση α — ο ίδιος γράφος, δύο
        μετασχηματισμοί
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Δύο διαδρομές s → t. <strong className="text-blue-700">A</strong>: 3 ακμές
        βάρους 1 (σύνολο 3). <strong className="text-amber-700">B</strong>: 2
        ακμές βάρους 2 (σύνολο 4). Στην αρχή νικά η A. Σύρε τα δύο sliders και δες
        ποιο πείραμα κρατάει την ίδια απάντηση και ποιο όχι.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <PathGraph panel="mult" factor={k} shift={0} />
        <PathGraph panel="add" factor={1} shift={alpha} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
          <label className="flex items-center justify-between text-xs text-fg-muted">
            <span className="font-semibold text-fg">Πολλαπλασιαστής k</span>
            <span className="font-mono font-bold text-fg">×{k}</span>
          </label>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={k}
            aria-label="Πολλαπλασιαστής k"
            onChange={(e) => setK(Number(e.target.value))}
            className="mt-1 h-1.5 w-full cursor-pointer accent-accent"
          />
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
          <label className="flex items-center justify-between text-xs text-fg-muted">
            <span className="font-semibold text-fg">Πρόσθεση α</span>
            <span className="font-mono font-bold text-fg">+{alpha}</span>
          </label>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={alpha}
            aria-label="Πρόσθεση α"
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="mt-1 h-1.5 w-full cursor-pointer accent-accent"
          />
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-xs leading-relaxed text-fg-muted">
          <span className="font-semibold text-fg">Α. Πολλαπλασιασμός:</span>{' '}
          ισχύει η <span className="font-mono">a · ∑wᵢ &lt; a · ∑wⱼ</span> ⇔{' '}
          <span className="font-mono">∑wᵢ &lt; ∑wⱼ</span> για κάθε a &gt; 0. Η σειρά
          των διαδρομών διατηρείται — <strong className="text-fg">ίδιος νικητής</strong>.
        </div>
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs leading-relaxed text-fg-muted">
          <span className="font-semibold text-fg">Β. Πρόσθεση:</span> κάθε ακμή
          χρεώνεται <span className="font-mono">+α</span>· διαδρομή με ℓ ακμές
          πληρώνει <span className="font-mono">ℓ · α</span>. Όσο μεγαλώνει το α, οι
          διαδρομές με λιγότερες ακμές γίνονται σχετικά φθηνότερες — και κάποια
          στιγμή <strong className="text-fg">ο νικητής αλλάζει</strong>.
        </div>
      </div>
    </section>
  )
}
