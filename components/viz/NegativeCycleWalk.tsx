'use client'

/**
 * NegativeCycleWalk — why a negative cycle destroys "shortest path".
 *
 * If a path can pass through a cycle whose weights sum to a negative number,
 * there is no shortest path at all: every extra lap shaves a fixed amount off
 * the cost, forever. This viz lets the student click "one more lap" and watch
 * the running total of an s→t route fall by 3 each time — plotted as a line
 * that plunges off the bottom toward −∞. That picture is what "δεν υπάρχει
 * συντομότερη διαδρομή" actually means. Built for L17.
 */

import { useState } from 'react'
import { RotateCcw, RefreshCw } from 'lucide-react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type NNode = { id: string; x: number; y: number }
const S: NNode = { id: 's', x: 56, y: 150 }
const NA: NNode = { id: 'a', x: 190, y: 74 }
const NB: NNode = { id: 'b', x: 190, y: 224 }
const NC: NNode = { id: 'c', x: 322, y: 150 }
const NT: NNode = { id: 't', x: 452, y: 150 }
const ALL_NODES: ReadonlyArray<NNode> = [S, NA, NB, NC, NT]
const R = 24
const NODE_RECTS: ReadonlyArray<NodeRect> = ALL_NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

const BASE_COST = 4 // s→a→b→c→t with zero extra laps
const PER_LAP = -3 // one lap of a→b→c→a: 2 + 1 + (−6)
const MAX_LAPS = 8

const costAt = (laps: number) => BASE_COST + PER_LAP * laps

/**
 * Collision-aware edge routing: returns a straight segment trimmed to the
 * node borders (the steady-state case for this 5-node directed layout) or a
 * quadratic Bezier that bends around an unrelated node, also trimmed so the
 * arrowhead lands on the target border. The `mx, my` fields anchor the weight
 * label at the centerline midpoint for lines and at the Bezier midpoint
 * `(P0 + 2Q + P2) / 4` for curves. Locks out the «edge through unrelated
 * node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: NNode, b: NNode) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  const geom = routeEdge(rectA, rectB, NODE_RECTS)
  const trimmed = trimEdgeGeom(geom, a.x, a.y, R, b.x, b.y, R)
  if (trimmed.kind === 'curve') {
    return {
      ...trimmed,
      mx: (a.x + 2 * trimmed.cx + b.x) / 4,
      my: (a.y + 2 * trimmed.cy + b.y) / 4,
    }
  }
  return { ...trimmed, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }
}

// chart geometry
const CH_X0 = 46
const CH_STEP = 50
const CH_TOP = BASE_COST // 4
const CH_BOT = costAt(MAX_LAPS) // −20
const CH_YTOP = 30
const CH_YBOT = 158
const chX = (i: number) => CH_X0 + i * CH_STEP
const chY = (cost: number) =>
  CH_YTOP + ((CH_TOP - cost) / (CH_TOP - CH_BOT)) * (CH_YBOT - CH_YTOP)

export function NegativeCycleWalk() {
  const [laps, setLaps] = useState(0)
  const total = costAt(laps)
  const atMax = laps >= MAX_LAPS

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Αρνητικός κύκλος — η συντομότερη διαδρομή εξαφανίζεται
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {laps} {laps === 1 ? 'γύρος' : 'γύροι'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Η διαδρομή s→t περνά από τον κύκλο a→b→c→a, που έχει άθροισμα βαρών −3.
      </p>

      <div className="graph-canvas overflow-x-auto">
        {/* the graph */}
        <svg
          viewBox="0 0 510 258"
          className="mx-auto block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="ncw-g"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id="ncw-c"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
            <marker
              id="ncw-r"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
          </defs>

          {/* edges */}
          {(
            [
              { a: S, b: NA, w: 0, kind: 'plain' },
              { a: NA, b: NB, w: 2, kind: 'cycle' },
              { a: NB, b: NC, w: 1, kind: 'cycle' },
              { a: NC, b: NA, w: -6, kind: 'neg' },
              { a: NC, b: NT, w: 1, kind: 'plain' },
            ] as const
          ).map(({ a, b, w, kind }) => {
            const g = routedEdge(a, b)
            const color =
              kind === 'neg' ? '#dc2626' : kind === 'cycle' ? '#9f1239' : '#9b8a8d'
            const marker =
              kind === 'neg' ? 'url(#ncw-r)' : kind === 'cycle' ? 'url(#ncw-c)' : 'url(#ncw-g)'
            const strokeWidth = kind === 'plain' ? 2 : 3
            return (
              <g key={`${a.id}-${b.id}`}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    markerEnd={marker}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    markerEnd={marker}
                  />
                )}
                <rect
                  x={g.mx - 13}
                  y={g.my - 11}
                  width={26}
                  height={20}
                  rx={4}
                  fill="#faf4ee"
                  stroke={color}
                />
                <text
                  x={g.mx}
                  y={g.my}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill={kind === 'neg' ? '#dc2626' : '#1c1214'}
                >
                  {w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {[S, NA, NB, NC, NT].map((n) => {
            const onCycle = n.id === 'a' || n.id === 'b' || n.id === 'c'
            const terminal = n.id === 's' || n.id === 't'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={onCycle ? '#fde2e4' : terminal ? '#e8e3df' : '#ffffff'}
                  stroke={onCycle ? '#9f1239' : '#6b5b5e'}
                  strokeWidth={2.6}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>

        <p className="mt-1 text-center text-xs font-medium text-[#9f1239]">
          Ο κύκλος a→b→c→a: 2 + 1 + (−6) = −3 ανά γύρο.
        </p>

        {/* the plunging cost chart */}
        <svg
          viewBox="0 0 510 196"
          className="mx-auto mt-1 block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* zero line */}
          <line
            x1={28}
            y1={chY(0)}
            x2={486}
            y2={chY(0)}
            stroke="#bdb0b2"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <text x={20} y={chY(0)} textAnchor="end" dominantBaseline="central" fontSize={10} fontWeight={600} fill="#9b8a8d">
            0
          </text>
          <text x={20} y={chY(BASE_COST)} textAnchor="end" dominantBaseline="central" fontSize={10} fontWeight={600} fill="#9b8a8d">
            {BASE_COST}
          </text>

          {/* x-axis ticks */}
          {Array.from({ length: MAX_LAPS + 1 }, (_, i) => (
            <text
              key={`tick-${i}`}
              x={chX(i)}
              y={178}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="#9b8a8d"
            >
              {i}
            </text>
          ))}
          <text x={chX(MAX_LAPS / 2)} y={193} textAnchor="middle" fontSize={10} fontWeight={700} fill="#5a4a4d">
            γύροι στον κύκλο
          </text>

          {/* the plunge line */}
          {laps > 0 && (
            <polyline
              points={Array.from({ length: laps + 1 }, (_, i) =>
                `${chX(i)},${chY(costAt(i))}`,
              ).join(' ')}
              fill="none"
              stroke="#dc2626"
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* points */}
          {Array.from({ length: laps + 1 }, (_, i) => {
            const last = i === laps
            return (
              <circle
                key={`pt-${i}`}
                cx={chX(i)}
                cy={chY(costAt(i))}
                r={last ? 6 : 4}
                fill={last ? '#dc2626' : '#9f1239'}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            )
          })}

          {/* current-cost label on the last point */}
          <g>
            <rect
              x={chX(laps) - 24}
              y={chY(total) + (total > 0 ? 12 : -32)}
              width={48}
              height={20}
              rx={5}
              fill="#dc2626"
            />
            <text
              x={chX(laps)}
              y={chY(total) + (total > 0 ? 22 : -22)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fontWeight={800}
              fill="#ffffff"
            >
              {total}
            </text>
          </g>

          {/* −∞ hint at max */}
          {atMax && (
            <text
              x={chX(MAX_LAPS) + 8}
              y={chY(CH_BOT) - 4}
              textAnchor="start"
              fontSize={13}
              fontWeight={800}
              fill="#dc2626"
            >
              → −∞
            </text>
          )}
        </svg>
      </div>

      {/* running cost */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-center">
        <span className="font-mono text-sm text-fg-muted">
          Κόστος = {BASE_COST} − 3 × {laps} ={' '}
        </span>
        <span className="font-mono text-xl font-bold text-fg">{total}</span>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className={
          'mt-2 rounded-lg border px-3 py-2 text-sm leading-relaxed ' +
          (atMax
            ? 'border-danger/50 bg-danger/10 text-fg-muted'
            : 'border-border bg-bg-soft/50 text-fg-muted')
        }
      >
        {laps === 0
          ? 'Η απλή διαδρομή s→a→b→c→t κοστίζει 4. Πάτα «άλλος ένας γύρος» — αντί να βγει στο t, η διαδρομή ξαναγυρίζει τον κύκλο.'
          : atMax
            ? 'Κάθε γύρος αφαιρεί 3 από το κόστος, και μπορείς να γυρίζεις όσες φορές θέλεις. Δεν υπάρχει κάτω όριο: το κόστος βυθίζεται στο −∞. Γι’ αυτό, όταν μια διαδρομή s→t περνά από αρνητικό κύκλο, ΔΕΝ υπάρχει συντομότερη διαδρομή.'
            : `Με ${laps} ${laps === 1 ? 'γύρο' : 'γύρους'} το κόστος έπεσε στο ${total}. Κάθε επιπλέον γύρος αφαιρεί άλλα 3 — και τίποτα δεν σε σταματά να συνεχίσεις.`}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setLaps((l) => Math.min(MAX_LAPS, l + 1))}
          disabled={atMax}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Άλλος ένας γύρος
        </button>
        <button
          type="button"
          onClick={() => setLaps(0)}
          disabled={laps === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          {laps} / {MAX_LAPS} γύροι
        </span>
      </div>
    </section>
  )
}
