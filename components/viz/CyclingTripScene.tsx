'use client'

/**
 * CyclingTripScene — the «Νιώσε» picture for front-set-6-ask1.
 *
 * 4-city cycling map matching `LayeredTripPlanner`'s instance:
 *   A(c=3) B(c=5) C(c=2) D(c=4); distances A-B=4, A-C=7, A-D=10, B-C=5,
 *   B-D=8, C-D=4; day caps u(1)=7, u(2)=9, u(3)=10.
 *
 * The reader operates the day slider; the per-day cap u(k) is drawn over
 * the legend and each edge flips between «νόμιμη σήμερα» (green, solid)
 * and «παράνομη σήμερα» (red-dashed). The legality of an edge depends on
 * the day, NOT on the topology — that is exactly the insight the layered-
 * DAG construction in `LayeredTripPlanner` formalises: the day must be
 * encoded as a second graph dimension because the rules change per phase.
 */

import { useState } from 'react'

type City = 'A' | 'B' | 'C' | 'D'
const CITIES: City[] = ['A', 'B', 'C', 'D']
const POS: Record<City, { x: number; y: number }> = {
  A: { x: 110, y: 90 },
  B: { x: 410, y: 90 },
  C: { x: 110, y: 280 },
  D: { x: 410, y: 280 },
}
const COST: Record<City, number> = { A: 3, B: 5, C: 2, D: 4 }
const DIST: Record<City, Record<City, number>> = {
  A: { A: 0, B: 4, C: 7, D: 10 },
  B: { A: 4, B: 0, C: 5, D: 8 },
  C: { A: 7, B: 5, C: 0, D: 4 },
  D: { A: 10, B: 8, C: 4, D: 0 },
}
const U = [0, 7, 9, 10] // U[1..3]
const NR = 24
const VB_W = 540
const VB_H = 380

const EDGES: { a: City; b: City; d: number }[] = []
for (let i = 0; i < CITIES.length; i++) {
  for (let j = i + 1; j < CITIES.length; j++) {
    const a = CITIES[i]
    const b = CITIES[j]
    EDGES.push({ a, b, d: DIST[a][b] })
  }
}

function midpoint(a: City, b: City) {
  return { x: (POS[a].x + POS[b].x) / 2, y: (POS[a].y + POS[b].y) / 2 }
}

export function CyclingTripScene() {
  const [day, setDay] = useState(2)
  const u = U[day]
  const legalCount = EDGES.filter((e) => e.d <= u).length

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Νιώσε το όριο — 4 πόλεις, 6 διαδρομές, όριο ημέρας u(k)
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Νόμιμες σήμερα: {legalCount} / {EDGES.length}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
        <label htmlFor="cts-day" className="font-medium text-fg-subtle">
          Ημέρα k:
        </label>
        <input
          id="cts-day"
          type="range"
          min={1}
          max={3}
          step={1}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-bg-soft"
          aria-label="Επίλεξε ημέρα από 1 έως 3"
        />
        <span className="font-mono text-fg" aria-live="polite">
          k = {day} → u({day}) = <strong>{u}</strong> km
        </span>
        <div className="ml-auto flex items-center gap-3 text-fg-subtle">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-6 rounded-full bg-emerald-500" /> νόμιμη
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-[3px] w-6 rounded-full border-t-2 border-dashed border-rose-500" />{' '}
            παράνομη
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${VB_W}px` }}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`Χάρτης 4 πόλεων (A, B, C, D) με 6 διαδρομές. Την ημέρα ${day} το όριο είναι ${u} km και ${legalCount} από τις 6 διαδρομές είναι νόμιμες.`}
        >
          {/* edges */}
          {EDGES.map(({ a, b, d }) => {
            const legal = d <= u
            const stroke = legal ? '#10b981' : '#f43f5e'
            const m = midpoint(a, b)
            return (
              <g key={`${a}-${b}`}>
                <line
                  x1={POS[a].x}
                  y1={POS[a].y}
                  x2={POS[b].x}
                  y2={POS[b].y}
                  stroke={stroke}
                  strokeWidth={legal ? 3 : 2}
                  strokeDasharray={legal ? '0' : '6,4'}
                  opacity={legal ? 1 : 0.7}
                />
                {/* label background for legibility */}
                <rect
                  x={m.x - 26}
                  y={m.y - 11}
                  width={52}
                  height={22}
                  rx={4}
                  fill="rgb(var(--bg-elevated))"
                  stroke={stroke}
                  strokeWidth={1}
                />
                <text
                  x={m.x}
                  y={m.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={700}
                  fill={stroke}
                >
                  d = {d}
                </text>
              </g>
            )
          })}

          {/* cities */}
          {CITIES.map((c) => (
            <g key={c}>
              <circle
                cx={POS[c].x}
                cy={POS[c].y}
                r={NR}
                fill="rgb(var(--bg))"
                stroke="rgb(var(--fg))"
                strokeWidth={2.5}
              />
              <text
                x={POS[c].x}
                y={POS[c].y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fontWeight={700}
                fill="rgb(var(--fg))"
              >
                {c}
              </text>
              <text
                x={POS[c].x}
                y={POS[c].y + NR + 16}
                textAnchor="middle"
                fontSize={11}
                fill="rgb(var(--fg-subtle))"
              >
                <tspan fontStyle="italic">διανυκτέρευση</tspan> c({c}) = <tspan fontWeight={700}>{COST[c]}</tspan>
              </text>
            </g>
          ))}

          {/* caption strip */}
          <text
            x={VB_W / 2}
            y={VB_H - 8}
            textAnchor="middle"
            fontSize={11}
            fontStyle="italic"
            fill="rgb(var(--fg-muted))"
          >
            Η ίδια διαδρομή μπορεί να είναι παράνομη σήμερα και νόμιμη αύριο — το όριο u(k)
            αλλάζει.
          </text>
        </svg>
      </div>

      <p className="mt-2 text-xs text-fg-subtle">
        Σύρε τη μπάρα: στην <strong>ημέρα 1</strong> με όριο 7 km, δύο διαδρομές είναι
        αδύνατες (A-D = 10, B-D = 8). Στην <strong>ημέρα 2</strong> (όριο 9) μένει μόνο
        η A-D εκτός. Στην <strong>ημέρα 3</strong> (όριο 10) και οι 6 περνούν. Αυτή η
        εξάρτηση του γράφου από τη φάση είναι ακριβώς ο λόγος που η λύση «σπάει» την κάθε
        πόλη σε <code className="rounded bg-bg-soft px-1 font-mono">(πόλη, ημέρα)</code>{' '}
        ζεύγη — ο χρόνος γίνεται δεύτερη διάσταση του γράφου.
      </p>
    </section>
  )
}
