'use client'

/**
 * SightseeingScene — the «Νιώσε» picture for pt1-th3.
 *
 * Three concrete strategies on the n=5 sights / c=4 / S=10 instance:
 *   - μόνο ταξί:    5 short hops, each c=4 → total 20.
 *   - μόνο πατίνι:  2 rentals (α₀→α₄ uses all 4 hops; α₄→α₅ uses one of 4
 *                   and wastes the rest) → total 2·S = 20.
 *   - μικτή (βέλτ.): one scooter for α₀→α₄ + one taxi α₄→α₅ → 10 + 4 = 14.
 *
 * Purpose: let the reader feel the geometry of the two transport options
 * (short taxi hops vs long-but-flat scooter rentals) BEFORE the DP
 * recurrence in SightseeingDP fires. The trade-off lives in the picture.
 */

import { useState } from 'react'

const N = 5
const C = 4
const S = 10

type Strategy = 'taxi' | 'scooter' | 'mix'

type Seg = { kind: 'taxi' | 'scooter'; from: number; to: number; cost: number }

const ROUTES: Record<Strategy, { segs: Seg[]; total: number }> = {
  taxi: {
    segs: Array.from({ length: N }, (_, i) => ({ kind: 'taxi', from: i, to: i + 1, cost: C })),
    total: N * C,
  },
  scooter: {
    segs: [
      { kind: 'scooter', from: 0, to: 4, cost: S },
      { kind: 'scooter', from: 4, to: 5, cost: S },
    ],
    total: 2 * S,
  },
  mix: {
    segs: [
      { kind: 'scooter', from: 0, to: 4, cost: S },
      { kind: 'taxi', from: 4, to: 5, cost: C },
    ],
    total: S + C,
  },
}

const SLOT_W = 90
const X0 = 50
const Y_BASE = 110
const VB_W = X0 + SLOT_W * N + 40
const VB_H = 220

function pinX(i: number) {
  return X0 + i * SLOT_W
}

export function SightseeingScene() {
  const [strategy, setStrategy] = useState<Strategy>('mix')
  const r = ROUTES[strategy]
  const taxiCount = r.segs.filter((s) => s.kind === 'taxi').length
  const scootCount = r.segs.filter((s) => s.kind === 'scooter').length

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Νιώσε την επιλογή — n = 5 αξιοθέατα, c = 4 ανά βήμα, S = 10 ανά μίσθωση
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Σύνολο: {r.total}
        </span>
      </div>

      <div role="group" aria-label="Στρατηγική μετακίνησης" className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStrategy('taxi')}
          aria-pressed={strategy === 'taxi'}
          className={
            'rounded-md border px-3 py-1 text-xs font-medium transition ' +
            (strategy === 'taxi'
              ? 'border-amber-500 bg-amber-100 text-amber-900 dark:bg-amber-500/25 dark:text-amber-100'
              : 'border-border bg-bg text-fg-subtle hover:text-fg')
          }
        >
          🚖 Μόνο ταξί
        </button>
        <button
          type="button"
          onClick={() => setStrategy('scooter')}
          aria-pressed={strategy === 'scooter'}
          className={
            'rounded-md border px-3 py-1 text-xs font-medium transition ' +
            (strategy === 'scooter'
              ? 'border-sky-500 bg-sky-100 text-sky-900 dark:bg-sky-500/25 dark:text-sky-100'
              : 'border-border bg-bg text-fg-subtle hover:text-fg')
          }
        >
          🛴 Μόνο πατίνι
        </button>
        <button
          type="button"
          onClick={() => setStrategy('mix')}
          aria-pressed={strategy === 'mix'}
          className={
            'rounded-md border px-3 py-1 text-xs font-medium transition ' +
            (strategy === 'mix'
              ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/25 dark:text-emerald-100'
              : 'border-border bg-bg text-fg-subtle hover:text-fg')
          }
        >
          ✨ Μικτή (βέλτιστο)
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${VB_W}px` }}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={
            strategy === 'taxi'
              ? 'Πέντε διαδοχικά ταξί από α₀ ως α₅, καθένα κοστίζει 4, σύνολο 20.'
              : strategy === 'scooter'
                ? 'Δύο μισθώσεις πατινιού: α₀→α₄ καλύπτει 4 βήματα και α₄→α₅ καλύπτει 1, καθεμία 10, σύνολο 20.'
                : 'Ένα πατίνι α₀→α₄ (10) και ένα ταξί α₄→α₅ (4), σύνολο 14.'
          }
        >
          <defs>
            <marker id="sgs-arrow-taxi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#d97706" />
            </marker>
            <marker id="sgs-arrow-scoot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* baseline */}
          <line
            x1={pinX(0)}
            y1={Y_BASE}
            x2={pinX(N)}
            y2={Y_BASE}
            stroke="rgb(var(--border-strong))"
            strokeWidth={1.5}
          />

          {/* pins */}
          {Array.from({ length: N + 1 }, (_, i) => i).map((i) => (
            <g key={i}>
              <circle
                cx={pinX(i)}
                cy={Y_BASE}
                r={18}
                fill="rgb(var(--bg))"
                stroke="rgb(var(--fg-muted))"
                strokeWidth={2}
              />
              <text
                x={pinX(i)}
                y={Y_BASE + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight={700}
                fill="rgb(var(--fg))"
              >
                α{i}
              </text>
              <text
                x={pinX(i)}
                y={Y_BASE + 38}
                textAnchor="middle"
                fontSize={10}
                fill="rgb(var(--fg-subtle))"
              >
                {i === 0 ? 'αρχή' : `αξιοθέατο ${i}`}
              </text>
            </g>
          ))}

          {/* segments */}
          {r.segs.map((seg, idx) => {
            const isTaxi = seg.kind === 'taxi'
            const cx = (pinX(seg.from) + pinX(seg.to)) / 2
            const startX = pinX(seg.from) + 18
            const endX = pinX(seg.to) - 18
            const y = isTaxi ? Y_BASE - 6 : Y_BASE + 6
            const arcY = isTaxi ? Y_BASE - 54 : Y_BASE + 68
            const labelY = isTaxi ? Y_BASE - 60 : Y_BASE + 84
            const color = isTaxi ? '#d97706' : '#0284c7'
            const span = seg.to - seg.from
            return (
              <g key={idx}>
                <path
                  d={`M ${startX} ${y} Q ${cx} ${arcY} ${endX} ${y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  markerEnd={isTaxi ? 'url(#sgs-arrow-taxi)' : 'url(#sgs-arrow-scoot)'}
                />
                <text
                  x={cx}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={color}
                >
                  {isTaxi ? `🚖 ταξί · +${seg.cost}` : `🛴 πατίνι · +${seg.cost}`}
                </text>
                {!isTaxi && (
                  <text
                    x={cx}
                    y={labelY + 13}
                    textAnchor="middle"
                    fontSize={9.5}
                    fontStyle="italic"
                    fill={color}
                  >
                    καλύπτει {span} {span === 1 ? 'βήμα (3 χαμένα)' : 'βήματα'}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <p className="mt-2 text-xs text-fg-subtle">
        {strategy === 'taxi' && (
          <>
            5 διαδοχικά ταξί × 4 = <strong>20</strong>. Πληρώνεις κάθε βήμα ξεχωριστά — όσα κι αν είναι.
          </>
        )}
        {strategy === 'scooter' && (
          <>
            Μία μίσθωση καλύπτει έως 4 διαδρομές. Για 5 βήματα χρειάζονται{' '}
            <strong>δύο</strong> μισθώσεις: η δεύτερη καλύπτει μόνο 1 βήμα και σπαταλά τα 3
            υπόλοιπα — τιμωρεί τη μη-ευθυγραμμισμένη χρήση. Σύνολο 2 · 10 = <strong>20</strong>.
          </>
        )}
        {strategy === 'mix' && (
          <>
            Ένα πατίνι «καταναλώνεται πλήρως» στα 4 βήματα α₀ → α₄ (10) και το τελευταίο βήμα
            α₄ → α₅ είναι φθηνότερο ως ταξί (4). Σύνολο <strong>14</strong> — αυτό ακριβώς
            βρίσκει η αναδρομή που έπεται.
          </>
        )}{' '}
        <span className="text-fg-muted">
          ({scootCount} πατίνι · {taxiCount} ταξί)
        </span>
      </p>
    </section>
  )
}
