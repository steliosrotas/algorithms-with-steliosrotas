'use client'

/**
 * LayeredTripPlanner — front-set-6-ask1 («Σχεδιασμός ποδηλατικής
 * εκδρομής»).
 *
 * Multi-day trip with daily distance limits AND a no-consecutive-
 * nights constraint. The construction transforms the problem into a
 * layered DAG:
 *   • nodes  v_{i,p} for (city i, day p ∈ [0..m])
 *   • edges  v_{i,p-1} → v_{j,p} iff i ≠ j and d(i,j) ≤ u(p)
 *     with weight c(j) — the cost of the new overnight stay.
 * Shortest path from v_{s,0} to v_{t,m} in topological order gives
 * the cheapest legal trip.
 *
 * Concrete instance (n = 4 cities, m = 3 days):
 *   Distances d:  A-B=4, A-C=7, A-D=10, B-C=5, B-D=8, C-D=4
 *   Day limits:   u(1)=7, u(2)=9, u(3)=10
 *   Overnight c:  c(A)=3, c(B)=5, c(C)=2, c(D)=4
 *   s = A, t = D.
 * Optimal trip: A(0) → C(1) → A(2) → D(3) with cost c(C)+c(A)+c(D)
 * = 2 + 3 + 4 = 9, the unique minimum.
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type City = 'A' | 'B' | 'C' | 'D'
const CITIES: City[] = ['A', 'B', 'C', 'D']
const MAP_POS: Record<City, { x: number; y: number }> = {
  A: { x: 90, y: 70 },
  B: { x: 320, y: 70 },
  C: { x: 90, y: 240 },
  D: { x: 320, y: 240 },
}

const DIST: Record<City, Record<City, number>> = {
  A: { A: 0, B: 4, C: 7, D: 10 },
  B: { A: 4, B: 0, C: 5, D: 8 },
  C: { A: 7, B: 5, C: 0, D: 4 },
  D: { A: 10, B: 8, C: 4, D: 0 },
}
const COST: Record<City, number> = { A: 3, B: 5, C: 2, D: 4 }
const U = [0, 7, 9, 10] // u(1)=7, u(2)=9, u(3)=10; index 0 unused
const M = 3
const S: City = 'A'
const T: City = 'D'
const DAY_X = [70, 230, 390, 550]
const DAY_Y: Record<City, number> = { A: 50, B: 130, C: 210, D: 290 }
const NR = 18

type Slot = { city: City; day: number }

function slotKey(s: Slot) {
  return `${s.city}-${s.day}`
}

function legalMoves(from: Slot): Slot[] {
  if (from.day === M) return []
  const day = from.day + 1
  const limit = U[day]
  const out: Slot[] = []
  for (const c of CITIES) {
    if (c === from.city) continue
    if (DIST[from.city][c] <= limit) out.push({ city: c, day })
  }
  return out
}

/** Topological-order shortest-path DP. */
function solve() {
  const dist: Record<string, number> = {}
  const pred: Record<string, Slot | null> = {}
  for (const c of CITIES) for (let p = 0; p <= M; p++) dist[`${c}-${p}`] = Infinity
  const start: Slot = { city: S, day: 0 }
  dist[slotKey(start)] = 0
  pred[slotKey(start)] = null
  for (let p = 0; p < M; p++) {
    for (const c of CITIES) {
      const u: Slot = { city: c, day: p }
      const du = dist[slotKey(u)]
      if (!isFinite(du)) continue
      for (const v of legalMoves(u)) {
        const cand = du + COST[v.city]
        if (cand < dist[slotKey(v)]) {
          dist[slotKey(v)] = cand
          pred[slotKey(v)] = u
        }
      }
    }
  }
  const target = `${T}-${M}`
  const path: Slot[] = []
  let cur: Slot | null = { city: T, day: M }
  while (cur) {
    path.unshift(cur)
    cur = pred[slotKey(cur)] ?? null
  }
  return { dist, pred, path, totalCost: dist[target] }
}

const SOLUTION = solve()
const PATH_EDGES = new Set(
  SOLUTION.path.slice(0, -1).map(
    (u, i) => `${slotKey(u)}->${slotKey(SOLUTION.path[i + 1])}`,
  ),
)

/** All edges in the layered DAG — only outgoing from reachable slots,
 *  so unreachable day-1 cities (A and D) don't dangle edges. */
function allEdges(): { from: Slot; to: Slot }[] {
  const out: { from: Slot; to: Slot }[] = []
  for (let p = 0; p < M; p++) {
    for (const c of CITIES) {
      const u: Slot = { city: c, day: p }
      if (!isFinite(SOLUTION.dist[slotKey(u)])) continue
      for (const v of legalMoves(u)) out.push({ from: u, to: v })
    }
  }
  return out
}

const EDGES = allEdges()

/** «Map» tab rects: 4 cities at MAP_POS, radius NR+4 (matches the visible
 *  circle drawn in that tab). Undirected edges → center-to-center routing,
 *  no trim. */
const MAP_R = 22
const MAP_RECTS: NodeRect[] = CITIES.map((c) => ({
  id: c,
  x: MAP_POS[c].x - MAP_R,
  y: MAP_POS[c].y - MAP_R,
  w: 2 * MAP_R,
  h: 2 * MAP_R,
}))
const MAP_RECT_BY_ID = new Map<City, NodeRect>(
  MAP_RECTS.map((r) => [r.id as City, r]),
)

/** «DAG» tab rects: 16 slots = 4 cities × 4 days, radius NR. Directed
 *  edges → trim by NR so the arrowhead lands on the destination border. */
const DAG_RECTS: NodeRect[] = (() => {
  const out: NodeRect[] = []
  for (const c of CITIES) {
    for (let p = 0; p <= M; p++) {
      out.push({
        id: `${c}-${p}`,
        x: DAY_X[p] - NR,
        y: DAY_Y[c] - NR,
        w: 2 * NR,
        h: 2 * NR,
      })
    }
  }
  return out
})()
const DAG_RECT_BY_ID = new Map<string, NodeRect>(
  DAG_RECTS.map((r) => [r.id as string, r]),
)

function routedMapEdge(fromId: City, toId: City) {
  const a = MAP_RECT_BY_ID.get(fromId)!
  const b = MAP_RECT_BY_ID.get(toId)!
  return routeEdge(a, b, MAP_RECTS)
}

function routedDagEdge(fromKey: string, toKey: string) {
  const a = DAG_RECT_BY_ID.get(fromKey)!
  const b = DAG_RECT_BY_ID.get(toKey)!
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2
  const geom = routeEdge(a, b, DAG_RECTS)
  return trimEdgeGeom(geom, ax, ay, NR, bx, by, NR)
}

export function LayeredTripPlanner() {
  const [tab, setTab] = useState<'map' | 'dag'>('map')
  const [showSolution, setShowSolution] = useState(false)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πολυήμερη εκδρομή — από χάρτη σε στρωματωμένο DAG
        </div>
        <div className="flex overflow-hidden rounded-md border border-border text-xs">
          {(
            [
              { v: 'map' as const, label: 'Χάρτης πόλεων' },
              { v: 'dag' as const, label: 'Στρωματωμένος DAG' },
            ]
          ).map(({ v, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => setTab(v)}
              className={
                'border-l border-border px-3 py-1.5 transition first:border-l-0 ' +
                (tab === v
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        4 πόλεις, m = 3 ημέρες, ξεκίνα από <strong className="text-fg">A</strong>,
        τέλος στο <strong className="text-fg">D</strong>. Ημερήσια όρια απόστασης{' '}
        u(1)=7, u(2)=9, u(3)=10. Όχι διαμονή στην ίδια πόλη δύο συνεχόμενες
        ημέρες.
      </p>

      {tab === 'map' && (
        <>
          <div className="graph-canvas overflow-x-auto">
            <svg
              viewBox="0 0 410 320"
              className="mx-auto block w-full max-w-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              {(['A-B', 'A-C', 'A-D', 'B-C', 'B-D', 'C-D'] as const).map((key) => {
                const [a, b] = key.split('-') as [City, City]
                const na = MAP_POS[a]
                const nb = MAP_POS[b]
                const g = routedMapEdge(a, b)
                const mx = g.kind === 'line' ? (na.x + nb.x) / 2 : (na.x + nb.x + 2 * g.cx) / 4
                const my = g.kind === 'line' ? (na.y + nb.y) / 2 : (na.y + nb.y + 2 * g.cy) / 4
                return (
                  <g key={key}>
                    {g.kind === 'line' ? (
                      <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="#9b8a8d" strokeWidth={2} />
                    ) : (
                      <path d={g.d} fill="none" stroke="#9b8a8d" strokeWidth={2} />
                    )}
                    <rect x={mx - 12} y={my - 9} width={24} height={17} rx={3} fill="#faf4ee" stroke="#cdbfc0" />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill="#1c1214">
                      {DIST[a][b]}
                    </text>
                  </g>
                )
              })}
              {CITIES.map((c) => {
                const n = MAP_POS[c]
                const terminal = c === S || c === T
                return (
                  <g key={c}>
                    <circle cx={n.x} cy={n.y} r={NR + 4} fill={terminal ? '#fde2e4' : '#ffffff'} stroke={terminal ? '#9f1239' : '#9b8a8d'} strokeWidth={2.4} />
                    <text x={n.x} y={n.y - 3} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#1c1214">
                      {c}
                    </text>
                    <text x={n.x} y={n.y + 10} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill="#9f1239" fontFamily="ui-monospace, monospace">
                      c={COST[c]}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
          <p className="mt-2 text-xs text-fg-subtle">
            Ετικέτες κορυφών: «c=…» = κόστος διαμονής. Ετικέτες ακμών: αποστάσεις
            d(u, v). Ο γράφος <em>δεν λέει</em> από μόνος του πώς λύνεται το
            πρόβλημα. Άνοιξε το tab δίπλα.
          </p>
        </>
      )}

      {tab === 'dag' && (
        <>
          <div className="graph-canvas overflow-x-auto">
            <svg
              viewBox="0 0 620 370"
              className="mx-auto block w-full max-w-3xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="ltp-arr"
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
                  id="ltp-arr-hi"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
                </marker>
              </defs>

              {/* Day column headers */}
              {[0, 1, 2, 3].map((p) => (
                <text
                  key={p}
                  x={DAY_X[p]}
                  y={20}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#5a4a4d"
                >
                  Ημέρα {p}
                  {p > 0 ? ` · u=${U[p]}` : ' · αφετηρία'}
                </text>
              ))}
              {/* Vertical day separators */}
              {[0, 1, 2, 3].map((p) => (
                <line
                  key={`vsep-${p}`}
                  x1={DAY_X[p]}
                  y1={30}
                  x2={DAY_X[p]}
                  y2={345}
                  stroke="#ece6e7"
                  strokeDasharray="2 4"
                />
              ))}
              {/* City row labels (left margin) */}
              {CITIES.map((c) => (
                <text
                  key={`row-${c}`}
                  x={20}
                  y={DAY_Y[c]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={700}
                  fill="#5a4a4d"
                >
                  {c}
                </text>
              ))}

              {EDGES.map((e, i) => {
                const ax = DAY_X[e.from.day]
                const ay = DAY_Y[e.from.city]
                const bx = DAY_X[e.to.day]
                const by = DAY_Y[e.to.city]
                const g = routedDagEdge(slotKey(e.from), slotKey(e.to))
                const key = `${slotKey(e.from)}->${slotKey(e.to)}`
                const onOpt = PATH_EDGES.has(key)
                const mx = g.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * g.cx) / 4
                const my = g.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * g.cy) / 4
                const stroke = onOpt ? '#9f1239' : '#9b8a8d'
                const strokeWidth = onOpt ? 2.8 : 1.4
                const marker = onOpt ? 'url(#ltp-arr-hi)' : 'url(#ltp-arr)'
                return (
                  <g key={i} opacity={showSolution && !onOpt ? 0.25 : 1}>
                    {g.kind === 'line' ? (
                      <line
                        x1={g.x1}
                        y1={g.y1}
                        x2={g.x2}
                        y2={g.y2}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        markerEnd={marker}
                      />
                    ) : (
                      <path d={g.d} fill="none" stroke={stroke} strokeWidth={strokeWidth} markerEnd={marker} />
                    )}
                    <rect
                      x={mx - 11}
                      y={my - 8}
                      width={22}
                      height={15}
                      rx={3}
                      fill="#faf4ee"
                      stroke={onOpt ? '#9f1239' : '#cdbfc0'}
                    />
                    <text
                      x={mx}
                      y={my}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={9}
                      fontWeight={700}
                      fill="#1c1214"
                    >
                      c={COST[e.to.city]}
                    </text>
                  </g>
                )
              })}

              {/* Slots */}
              {CITIES.flatMap((c) =>
                [0, 1, 2, 3].map((p) => {
                  const key = `${c}-${p}`
                  const isStart = c === S && p === 0
                  const isEnd = c === T && p === M
                  const onPath = SOLUTION.path.some((s) => slotKey(s) === key)
                  const reachable = isFinite(SOLUTION.dist[key])
                  return (
                    <g key={key} opacity={!reachable ? 0.35 : 1}>
                      <circle
                        cx={DAY_X[p]}
                        cy={DAY_Y[c]}
                        r={NR}
                        fill={isStart || isEnd ? '#fde2e4' : '#ffffff'}
                        stroke={onPath && showSolution ? '#9f1239' : isStart || isEnd ? '#9f1239' : '#9b8a8d'}
                        strokeWidth={onPath && showSolution ? 3 : 2}
                      />
                      <text
                        x={DAY_X[p]}
                        y={DAY_Y[c]}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={700}
                        fill="#1c1214"
                      >
                        {c}
                      </text>
                      {showSolution && reachable && (
                        <text
                          x={DAY_X[p]}
                          y={DAY_Y[c] + NR + 10}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={9}
                          fontWeight={700}
                          fill="#9f1239"
                          fontFamily="ui-monospace, monospace"
                        >
                          {SOLUTION.dist[key]}
                        </text>
                      )}
                    </g>
                  )
                }),
              )}
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowSolution((v) => !v)}
              className="rounded-md border border-border bg-bg-soft/60 px-3 py-1.5 text-xs font-semibold text-fg hover:bg-bg-soft"
            >
              {showSolution
                ? 'Κρύψε λύση + dist[]'
                : 'Βρες βέλτιστη εκδρομή'}
            </button>
            {showSolution && (
              <div className="text-xs text-fg-muted">
                Βέλτιστο:{' '}
                <span className="font-mono font-bold text-danger">
                  {SOLUTION.path.map((s) => `${s.city}(${s.day})`).join(' → ')}
                </span>
                , κόστος{' '}
                <span className="font-mono font-bold text-fg">
                  {SOLUTION.totalCost}
                </span>{' '}
                = c(C)+c(A)+c(D) = 2+3+4.
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Το κόλπο:</span> δημιουργείς ένα
        αντίγραφο κάθε πόλης ανά ημέρα και βάζεις ακμές{' '}
        <span className="font-mono">v_(i,p-1) → v_(j,p)</span> μόνο όταν{' '}
        <span className="font-mono">i ≠ j</span> και{' '}
        <span className="font-mono">d(i,j) ≤ u(p)</span>, με βάρος{' '}
        <span className="font-mono">c(j)</span>. Ο γράφος είναι ακυκλικός (κάθε
        ακμή προχωράει κατά μία ημέρα), άρα συντομότερο μονοπάτι σε DAG.
        Πολυπλοκότητα <span className="font-mono">O(n²m)</span> για το DAG,
        συν <span className="font-mono">O(n³)</span> για όλα τα ζεύγη d(i,j) με
        Dijkstra — <span className="font-mono">O(n²(n+m))</span> συνολικά.
      </div>
    </section>
  )
}
