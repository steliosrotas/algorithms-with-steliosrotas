'use client'

/**
 * BigOPlayground — an interactive growth-rate chart for L02.
 *
 * Toggle complexity classes on/off and drag the n-range. The y-axis is
 * scaled so n² always spans the full height: as you increase n, the
 * sub-quadratic curves visibly flatten and the super-quadratic ones pin
 * to the ceiling — and the readout shows the raw operation counts blowing
 * up. The point a learner should feel: asymptotic class beats every
 * constant factor.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type GrowthFn = { id: string; label: string; color: string; f: (n: number) => number }

const FUNCTIONS: GrowthFn[] = [
  { id: 'log', label: 'log₂n', color: 'rgb(22 163 74)', f: (n) => Math.log2(n) },
  { id: 'n', label: 'n', color: 'rgb(37 99 235)', f: (n) => n },
  { id: 'nlogn', label: 'n·log₂n', color: 'rgb(147 51 234)', f: (n) => n * Math.log2(n) },
  { id: 'n2', label: 'n²', color: 'rgb(234 88 12)', f: (n) => n * n },
  { id: 'n3', label: 'n³', color: 'rgb(202 138 4)', f: (n) => n * n * n },
  { id: 'exp', label: '2ⁿ', color: 'rgb(225 29 72)', f: (n) => 2 ** n },
]

const PLOT = { x0: 64, x1: 686, yTop: 44, yBot: 348 }
// Number of polyline samples per curve. At low slider values (nMax = 5)
// sampling only at integer n leaves the chart with ≤ 5 segments per curve
// — visibly corner-y for n², n·log n, 2ⁿ. 200 samples puts each segment
// below ~1 px regardless of the slider position.
const SAMPLES = 200

function fmt(v: number): string {
  if (v >= 1e7) return v.toExponential(1).replace('e+', '·10^')
  return Math.round(v).toLocaleString('el-GR')
}

export function BigOPlayground() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    log: true,
    n: true,
    nlogn: false,
    n2: true,
    n3: false,
    exp: true,
  })
  const [nMax, setNMax] = useState(20)

  const yCap = nMax * nMax // n² reaches exactly the top of the chart
  const xFor = (n: number) =>
    PLOT.x0 + ((n - 1) / Math.max(nMax - 1, 1)) * (PLOT.x1 - PLOT.x0)
  const yFor = (v: number) =>
    PLOT.yBot - (Math.min(v, yCap) / yCap) * (PLOT.yBot - PLOT.yTop)

  const active = FUNCTIONS.filter((fn) => enabled[fn.id])
  const lines = active.map((fn) => {
    // Stop the polyline at the first point that overshoots the y-cap: any
    // further samples would all clamp to PLOT.yTop and draw a misleading
    // horizontal trail along the top of the chart, hiding the fact that the
    // curve is exploding upward. We mark the overflow x so we can drop an
    // upward arrow there instead.
    const pts: string[] = []
    let overflowX: number | null = null
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / (SAMPLES - 1)
      const n = 1 + t * (nMax - 1)
      const v = fn.f(n)
      const x = xFor(n)
      pts.push(`${x.toFixed(1)},${yFor(v).toFixed(1)}`)
      if (v > yCap) {
        overflowX = x
        break
      }
    }
    return {
      fn,
      points: pts.join(' '),
      endVal: fn.f(nMax),
      endY: yFor(fn.f(nMax)),
      overflowX,
    }
  })

  const yTicks = [0, 0.25, 0.5, 0.75, 1]
  const xTickStep = Math.max(1, Math.round(nMax / 6))
  const xTicks: number[] = []
  for (let n = 1; n <= nMax; n += xTickStep) xTicks.push(n)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold tracking-tight text-fg">
        BigO Playground — σύγκρινε ρυθμούς αύξησης
      </div>

      {/* function toggles */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {FUNCTIONS.map((fn) => (
          <button
            key={fn.id}
            type="button"
            onClick={() => setEnabled((e) => ({ ...e, [fn.id]: !e[fn.id] }))}
            aria-pressed={enabled[fn.id]}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-sm transition-colors',
              enabled[fn.id]
                ? 'border-border-strong bg-bg-soft text-fg'
                : 'border-border text-fg-subtle hover:text-fg',
            )}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: enabled[fn.id] ? fn.color : 'transparent',
                border: `1.5px solid ${fn.color}`,
              }}
            />
            {fn.label}
          </button>
        ))}
      </div>

      {/* chart */}
      <svg viewBox="0 0 720 400" className="w-full" role="img" aria-label="Διάγραμμα ρυθμών αύξησης">
        <style>{`
          .bp-grid { stroke: rgb(var(--border)); stroke-width: 0.5; stroke-dasharray: 2 3; }
          .bp-axis { stroke: rgb(var(--border-strong)); stroke-width: 1; }
          .bp-tick { font: 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-subtle)); }
          .bp-axislabel { font: 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
        `}</style>

        {/* y grid + ticks */}
        {yTicks.map((t) => {
          const y = PLOT.yBot - t * (PLOT.yBot - PLOT.yTop)
          return (
            <g key={`y-${t}`}>
              <line x1={PLOT.x0} x2={PLOT.x1} y1={y} y2={y} className="bp-grid" />
              <text x={PLOT.x0 - 6} y={y + 3} textAnchor="end" className="bp-tick">
                {fmt(t * yCap)}
              </text>
            </g>
          )
        })}
        {/* x grid + ticks */}
        {xTicks.map((n) => (
          <g key={`x-${n}`}>
            <line x1={xFor(n)} x2={xFor(n)} y1={PLOT.yTop} y2={PLOT.yBot} className="bp-grid" />
            <text x={xFor(n)} y={PLOT.yBot + 16} textAnchor="middle" className="bp-tick">
              {n}
            </text>
          </g>
        ))}

        {/* axes */}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.yBot} y2={PLOT.yBot} className="bp-axis" />
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.yTop} y2={PLOT.yBot} className="bp-axis" />
        <text x={(PLOT.x0 + PLOT.x1) / 2} y="392" textAnchor="middle" className="bp-axislabel">
          μέγεθος εισόδου n
        </text>
        <text
          x="16"
          y={(PLOT.yTop + PLOT.yBot) / 2}
          textAnchor="middle"
          className="bp-axislabel"
          transform={`rotate(-90, 16, ${(PLOT.yTop + PLOT.yBot) / 2})`}
        >
          πλήθος πράξεων
        </text>

        {/* function curves */}
        {lines.map(({ fn, points, endY, overflowX }) => (
          <g key={fn.id}>
            <polyline points={points} fill="none" stroke={fn.color} strokeWidth={2.5} strokeLinejoin="round" />
            {overflowX !== null && (
              <text
                x={overflowX}
                y={PLOT.yTop - 5}
                textAnchor="middle"
                fontSize={15}
                fontWeight={700}
                fill={fn.color}
                aria-label="συνεχίζει εκτός ορίων προς τα πάνω"
              >
                ↑
              </text>
            )}
            <text
              x={PLOT.x1 + 6}
              y={Math.max(PLOT.yTop + 4, Math.min(endY + 3, PLOT.yBot))}
              className="bp-tick"
              fill={fn.color}
              fontWeight={700}
            >
              {fn.label}
            </text>
          </g>
        ))}
      </svg>

      {/* n-range slider */}
      <div className="mt-2 flex items-center gap-3">
        <label htmlFor="bp-nmax" className="shrink-0 text-sm text-fg-muted">
          εύρος n:
        </label>
        <input
          id="bp-nmax"
          type="range"
          min={5}
          max={40}
          value={nMax}
          onChange={(e) => setNMax(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <span className="w-12 text-right font-mono text-sm text-fg">1–{nMax}</span>
      </div>

      {/* readout */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πλήθος πράξεων στο n = {nMax}
        </div>
        {active.length === 0 ? (
          <span className="text-sm italic text-fg-subtle">
            Διάλεξε τουλάχιστον μία συνάρτηση παραπάνω.
          </span>
        ) : (
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {lines.map(({ fn, endVal }) => (
              <span key={fn.id} className="font-mono text-sm" style={{ color: fn.color }}>
                {fn.label} = {fmt(endVal)}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
