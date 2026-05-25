'use client'

/**
 * MstCountingExplorer — pt1-th2-b («Πόσα διαφορετικά ΕΕΔ έχει ο γράφος;»).
 *
 * 6-vertex weighted graph with mandatory edges and ties.
 *   • C-D = 1, B-E = 3, D-F = 10 — mandatory (uniquely cheapest in their cuts /
 *     bridges). They're added in every MST.
 *   • A-C = A-B = C-B = D-E = 5 — four ties of weight 5, where Kruskal has
 *     a real choice. After mandatory edges we have THREE islands
 *     {A}, {C,D,F}, {B,E}; we need 2 of those 4 weight-5 edges to merge them
 *     without forming a cycle.
 *   • Enumeration of valid pairs:
 *       1. {A-C, A-B}   — A↔{C,D,F} and A↔{B,E}    ✓
 *       2. {A-C, C-B}   — A↔{C,D,F} and {C,D,F}↔{B,E}  ✓
 *       3. {A-C, D-E}   — A↔{C,D,F} and {C,D,F}↔{B,E}  ✓
 *       4. {A-B, C-B}   — A↔{B,E} and {C,D,F}↔{B,E}  ✓
 *       5. {A-B, D-E}   — A↔{B,E} and {C,D,F}↔{B,E}  ✓
 *       6. {C-B, D-E}   — both connect {C,D,F}↔{B,E}, A LEFT ALONE  ✗
 *   • Total cost always 1+3+10+5+5 = 24.
 *
 * The viz lays the graph out with mandatory edges in red + tie edges in
 * gold, then 6 pair-cards on the right; clicking a card lights up the two
 * edges + shows the verdict «καλύπτει και τις 3 νησίδες;».
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type NodeId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

const NODES: Record<NodeId, { x: number; y: number }> = {
  A: { x: 95, y: 70 },
  B: { x: 360, y: 70 },
  C: { x: 95, y: 200 },
  D: { x: 230, y: 200 },
  E: { x: 360, y: 200 },
  F: { x: 230, y: 320 },
}
const R = 22

const NODE_RECTS: NodeRect[] = (Object.keys(NODES) as NodeId[]).map((id) => ({
  id,
  x: NODES[id].x - R,
  y: NODES[id].y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r]))

function routedEdge(aId: NodeId, bId: NodeId) {
  const aRect = NODE_RECT_BY_ID.get(aId)!
  const bRect = NODE_RECT_BY_ID.get(bId)!
  const ax = aRect.x + aRect.w / 2
  const ay = aRect.y + aRect.h / 2
  const bx = bRect.x + bRect.w / 2
  const by = bRect.y + bRect.h / 2
  const geom = trimEdgeGeom(routeEdge(aRect, bRect, NODE_RECTS), ax, ay, R, bx, by, R)
  const mx = geom.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * geom.cx) / 4
  const my = geom.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * geom.cy) / 4
  return { ...geom, mx, my }
}

type Edge = { id: string; a: NodeId; b: NodeId; w: number; kind: 'mandatory' | 'tie' }

const EDGES: Edge[] = [
  { id: 'CD', a: 'C', b: 'D', w: 1, kind: 'mandatory' },
  { id: 'BE', a: 'B', b: 'E', w: 3, kind: 'mandatory' },
  { id: 'DF', a: 'D', b: 'F', w: 10, kind: 'mandatory' },
  { id: 'AC', a: 'A', b: 'C', w: 5, kind: 'tie' },
  { id: 'AB', a: 'A', b: 'B', w: 5, kind: 'tie' },
  { id: 'CB', a: 'C', b: 'B', w: 5, kind: 'tie' },
  { id: 'DE', a: 'D', b: 'E', w: 5, kind: 'tie' },
]

type Pair = { id: string; e1: string; e2: string; valid: boolean; reason: string }

const PAIRS: Pair[] = [
  { id: 'p1', e1: 'AC', e2: 'AB', valid: true, reason: 'A → {C,D,F} με A-C και A → {B,E} με A-B.' },
  { id: 'p2', e1: 'AC', e2: 'CB', valid: true, reason: 'A → {C,D,F} με A-C και {C,D,F} → {B,E} με C-B.' },
  { id: 'p3', e1: 'AC', e2: 'DE', valid: true, reason: 'A → {C,D,F} με A-C και {C,D,F} → {B,E} με D-E.' },
  { id: 'p4', e1: 'AB', e2: 'CB', valid: true, reason: 'A → {B,E} με A-B και {B,E} → {C,D,F} με C-B.' },
  { id: 'p5', e1: 'AB', e2: 'DE', valid: true, reason: 'A → {B,E} με A-B και {C,D,F} → {B,E} με D-E.' },
  { id: 'p6', e1: 'CB', e2: 'DE', valid: false, reason: 'Και οι δύο ενώνουν {C,D,F} ↔ {B,E} — η νησίδα {A} μένει αποκομμένη.' },
]

const ISLAND_COLOR: Record<NodeId, string> = {
  A: '#fda4af', // rose
  C: '#fcd34d', D: '#fcd34d', F: '#fcd34d', // amber — {C,D,F}
  B: '#7dd3fc', E: '#7dd3fc', // sky — {B,E}
}

export function MstCountingExplorer() {
  const [pairId, setPairId] = useState<string>('p1')
  const pair = PAIRS.find((p) => p.id === pairId)!
  const chosenTieEdges = new Set([pair.e1, pair.e2])
  const validCount = PAIRS.filter((p) => p.valid).length

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 text-sm font-semibold tracking-tight text-fg">
        Πόσα ΕΕΔ; — μέτρα τις πραγματικές επιλογές στις ισοβαθμίες
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Τρεις «νησίδες» (χρωματισμένες) προκύπτουν μετά τις υποχρεωτικές ακμές.
        Πρέπει να διαλέξεις 2 από τις 4 ακμές βάρους 5 ώστε να ενωθούν και οι
        τρεις σε ένα δέντρο. Κλικ σε ζευγάρι → ανάβει στον γράφο και κρίνει.
      </p>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="graph-canvas overflow-x-auto">
          <svg
            viewBox="0 0 480 380"
            className="mx-auto block w-full max-w-xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            {EDGES.map((e) => {
              const g = routedEdge(e.a, e.b)
              const mandatory = e.kind === 'mandatory'
              const chosenTie = e.kind === 'tie' && chosenTieEdges.has(e.id)
              const unchosenTie = e.kind === 'tie' && !chosenTieEdges.has(e.id)
              const stroke = mandatory
                ? '#9f1239'
                : chosenTie
                  ? '#16a34a'
                  : '#d4a373'
              const strokeWidth = mandatory ? 3.6 : chosenTie ? 3.6 : 2
              const dashed = unchosenTie ? '4 4' : undefined
              return (
                <g key={e.id}>
                  {g.kind === 'line' ? (
                    <line
                      x1={g.x1}
                      y1={g.y1}
                      x2={g.x2}
                      y2={g.y2}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashed}
                    />
                  ) : (
                    <path
                      d={g.d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashed}
                    />
                  )}
                  <rect
                    x={g.mx - 14}
                    y={g.my - 11}
                    width={28}
                    height={21}
                    rx={4}
                    fill="#faf4ee"
                    stroke={stroke}
                  />
                  <text
                    x={g.mx}
                    y={g.my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={700}
                    fill="#1c1214"
                  >
                    {e.w}
                  </text>
                </g>
              )
            })}
            {(Object.keys(NODES) as NodeId[]).map((id) => {
              const n = NODES[id]
              return (
                <g key={id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R}
                    fill={ISLAND_COLOR[id]}
                    stroke="#1c1214"
                    strokeWidth={1.5}
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
                    {id}
                  </text>
                </g>
              )
            })}
          </svg>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-[#9f1239]" />
              υποχρεωτική
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-4 rounded-sm bg-[#16a34a]" />
              επιλεγμένη ισοβαθμία
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-4 rounded-sm"
                style={{ background: 'repeating-linear-gradient(90deg,#d4a373 0 2px,transparent 2px 4px)' }}
              />
              διαθέσιμη βάρους 5
            </span>
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            6 ζευγάρια ακμών βάρους 5 — {validCount} έγκυρα
          </div>
          <div className="space-y-1.5">
            {PAIRS.map((p) => {
              const active = p.id === pairId
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPairId(p.id)}
                  className={
                    'block w-full rounded-lg border px-3 py-2 text-left text-xs transition ' +
                    (active
                      ? p.valid
                        ? 'border-success bg-success/10'
                        : 'border-danger bg-danger/10'
                      : p.valid
                        ? 'border-border bg-bg-soft/40 hover:border-success/60'
                        : 'border-border bg-bg-soft/40 hover:border-danger/60')
                  }
                >
                  <div className="font-mono font-semibold text-fg">
                    {`{${edgeLabel(p.e1)}, ${edgeLabel(p.e2)}}`}{' '}
                    <span className={p.valid ? 'text-success' : 'text-danger'}>
                      {p.valid ? '✓' : '✗'}
                    </span>
                  </div>
                  {active && (
                    <div className="mt-1 text-[11px] leading-snug text-fg-muted">
                      {p.reason}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-[11px] leading-relaxed text-fg-muted">
            <div className="font-semibold text-fg">
              5 διαφορετικά ΕΕΔ — κάθε έγκυρο ζευγάρι παράγει ένα.
            </div>
            <div className="mt-0.5 font-mono">
              Συνολικό κόστος καθενός: 1 + 3 + 10 + 5 + 5 = 24.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function edgeLabel(id: string): string {
  // id ∈ {'AC','AB','CB','DE'}
  return `${id[0]}-${id[1]}`
}
