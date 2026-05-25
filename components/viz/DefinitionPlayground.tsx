'use client'

/**
 * DefinitionPlayground — operate the (c, n₀) definition of Big-O.
 *
 * The most abstract sentence in L02 is «∃ c, n₀ τέτοια ώστε ∀ n ≥ n₀, T(n) ≤
 * c·f(n)». A struggling student reads that as four symbols with no handle —
 * "is c big or small? what makes n₀ valid? why do we even need both?". The
 * viz turns that sentence into something they DRIVE:
 *
 *   • Three preset cases over the same T(n) = 3n² − 100n + 6:
 *       1. σφιχτό: f(n) = n² — there IS a c that pins T from n₀ = 1.
 *       2. χαλαρό: f(n) = n³ — ANY positive c works, but the smaller it is,
 *          the further right n₀ gets. The bound holds, just loosely.
 *       3. αδύνατο: f(n) = n — NO c is enough. Whatever c the student picks,
 *          T's quadratic curve catches up and overtakes c·n.
 *
 *   • Slider for c. The chart redraws T(n) (solid) and c·f(n) (dashed).
 *     The viz scans n = 1..NMAX and finds the smallest n₀ where
 *     T(n) ≤ c·f(n) holds from then on, then shades the "valid zone".
 *
 *   • Verdict block translates the picture back into the formal sentence.
 *     The teaching moment in case 3: as you slide c higher, the crossover
 *     moves further right — but it never goes away. That is what
 *     "T ∉ O(n)" actually looks like.
 *
 * Built for L02.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type CaseId = 'tight' | 'loose' | 'impossible'

type CaseDef = {
  id: CaseId
  label: string
  tab: string
  f: (n: number) => number
  fLabel: string
  cMin: number
  cMax: number
  cStep: number
  cDefault: number
  nMax: number
  blurb: string
}

// T(n) is fixed across all three cases — only f changes.
const T = (n: number) => 3 * n * n - 100 * n + 6
const T_LABEL = '3n² − 100n + 6'

const CASES: CaseDef[] = [
  {
    id: 'tight',
    label: 'T(n) ∈ O(n²)',
    tab: 'Σφιχτό φράγμα · f(n) = n²',
    f: (n) => n * n,
    fLabel: 'n²',
    cMin: 1.5,
    cMax: 6,
    cStep: 0.1,
    cDefault: 3,
    nMax: 250,
    blurb:
      'Η T και η f είναι ίδιας τάξης. Διάλεξε c ≥ 3 και ο όρος −100n δεν χρειάζεται καν να βοηθήσει — η ανισότητα ισχύει από n₀ = 1.',
  },
  {
    id: 'loose',
    label: 'T(n) ∈ O(n³)',
    tab: 'Χαλαρό φράγμα · f(n) = n³',
    f: (n) => n * n * n,
    fLabel: 'n³',
    cMin: 0.01,
    cMax: 1,
    cStep: 0.01,
    cDefault: 0.1,
    nMax: 350,
    blurb:
      'Η f αυξάνεται γρηγορότερα από την T. Άρα ΟΠΟΙΟΔΗΠΟΤΕ θετικό c δουλεύει — απλώς όσο μικρότερο το c, τόσο πιο δεξιά πρέπει να ξεκινήσει το n₀. Αυτή είναι η εικόνα ενός «αληθινού αλλά χαλαρού» άνω φράγματος.',
  },
  {
    id: 'impossible',
    label: 'T(n) ∉ O(n)',
    tab: 'Αδύνατο φράγμα · f(n) = n',
    f: (n) => n,
    fLabel: 'n',
    cMin: 1,
    cMax: 200,
    cStep: 1,
    cDefault: 50,
    nMax: 250,
    blurb:
      'Η T είναι τετραγωνική και η f γραμμική. Όσο μεγάλο c κι αν διαλέξεις, η ευθεία c·n χάνει τελικά από την παραβολή T(n). Το σημείο τομής γλιστράει δεξιά καθώς ανεβάζεις το c — αλλά ΔΕΝ εξαφανίζεται ποτέ. Έτσι ακριβώς μοιάζει το «T ∉ O(n)».',
  },
]

const PLOT = { x0: 56, x1: 740, yTop: 28, yBot: 280 }

function fmt(v: number): string {
  if (!Number.isFinite(v)) return '∞'
  if (Math.abs(v) >= 1e6) return v.toExponential(1)
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('el-GR')
  if (Math.abs(v) >= 10) return Math.round(v).toString()
  return v.toFixed(2).replace(/\.?0+$/, '')
}

export function DefinitionPlayground() {
  const [caseId, setCaseId] = useState<CaseId>('tight')
  const c = useCaseSlider(caseId)

  const def = CASES.find((d) => d.id === caseId)!
  const { cVal, setC } = c

  // Sample T and c·f along the n range.
  const { tPts, cfPts, n0, failsForever, yMin, yMax } = useMemo(() => {
    const tVals: { n: number; v: number }[] = []
    const cfVals: { n: number; v: number }[] = []
    let lastFail = 0
    for (let n = 1; n <= def.nMax; n++) {
      const tv = T(n)
      const cv = cVal * def.f(n)
      tVals.push({ n, v: tv })
      cfVals.push({ n, v: cv })
      if (tv > cv) lastFail = n
    }
    const n0 = lastFail + 1
    const failsForever = lastFail === def.nMax

    // Joint y-range. Clip the c·f tail when it explodes way above T so the
    // shape of T stays readable.
    const tMin = Math.min(...tVals.map((p) => p.v))
    const tMax = Math.max(...tVals.map((p) => p.v))
    const span = Math.max(tMax - tMin, 1)
    const yCeil = tMax + span * 0.2
    const yFloor = Math.min(tMin, 0) - span * 0.05
    return {
      tPts: tVals,
      cfPts: cfVals,
      n0,
      failsForever,
      yMin: yFloor,
      yMax: yCeil,
    }
  }, [cVal, def])

  const xFor = (n: number) =>
    PLOT.x0 + ((n - 1) / Math.max(def.nMax - 1, 1)) * (PLOT.x1 - PLOT.x0)
  const yFor = (v: number) => {
    const t = (v - yMin) / Math.max(yMax - yMin, 1)
    const clamped = Math.max(0, Math.min(1, t))
    return PLOT.yBot - clamped * (PLOT.yBot - PLOT.yTop)
  }

  // Build a polyline that stops at the first point that goes out of the
  // chart's [yMin, yMax] window. Otherwise yFor() clamps every subsequent
  // sample to the same yTop/yBot, drawing a misleading horizontal trail
  // along the edge of the chart and hiding the fact that the curve is
  // exploding upward (or downward). The returned `overflow` is where to
  // drop a ↑ / ↓ arrow so the truncation reads as «continues off-screen».
  const buildLine = (
    pts: { n: number; v: number }[],
  ): { points: string; overflow: { x: number; dir: 'up' | 'down' } | null } => {
    const out: string[] = []
    let overflow: { x: number; dir: 'up' | 'down' } | null = null
    for (const p of pts) {
      const x = xFor(p.n)
      out.push(`${x.toFixed(1)},${yFor(p.v).toFixed(1)}`)
      if (p.v > yMax) {
        overflow = { x, dir: 'up' }
        break
      }
      if (p.v < yMin) {
        overflow = { x, dir: 'down' }
        break
      }
    }
    return { points: out.join(' '), overflow }
  }
  const tBuilt = buildLine(tPts)
  const cfBuilt = buildLine(cfPts)
  const tLine = tBuilt.points
  const cfLine = cfBuilt.points

  const validBand =
    !failsForever && n0 <= def.nMax
      ? { x: xFor(n0), w: xFor(def.nMax) - xFor(n0) }
      : null

  const tickStep = Math.max(1, Math.round(def.nMax / 6))
  const xTicks: number[] = []
  for (let n = tickStep; n <= def.nMax; n += tickStep) xTicks.push(n)
  if (xTicks[0] !== 1) xTicks.unshift(1)

  const yTicks = useMemo(() => {
    const out: number[] = []
    const span = yMax - yMin
    const step = niceStep(span / 5)
    const start = Math.ceil(yMin / step) * step
    for (let v = start; v <= yMax; v += step) out.push(v)
    return out
  }, [yMin, yMax])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + case tabs */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          (c, n₀) — λειτούργησε τον ορισμό
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">
          T(n) = {T_LABEL}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {CASES.map((cd) => (
          <button
            key={cd.id}
            type="button"
            onClick={() => setCaseId(cd.id)}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              cd.id === caseId
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:bg-bg-soft hover:text-fg',
            )}
            aria-pressed={cd.id === caseId}
          >
            {cd.tab}
          </button>
        ))}
      </div>

      {/* chart */}
      <svg
        viewBox="0 0 780 340"
        className="w-full"
        role="img"
        aria-label={`Γράφημα T(n) και c·${def.fLabel} για c = ${cVal}`}
      >
        <style>{`
          .dp-grid { stroke: rgb(var(--border)); stroke-width: 0.5; stroke-dasharray: 2 3; }
          .dp-axis { stroke: rgb(var(--border-strong)); stroke-width: 1; }
          .dp-tick { font: 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-subtle)); }
          .dp-axislabel { font: 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
          .dp-zero { stroke: rgb(var(--border-strong)); stroke-width: 0.75; stroke-dasharray: 1 2; }
        `}</style>

        {/* valid band — only when an n₀ exists */}
        {validBand ? (
          <g>
            <rect
              x={validBand.x}
              y={PLOT.yTop}
              width={validBand.w}
              height={PLOT.yBot - PLOT.yTop}
              fill="rgb(34 197 94 / 0.10)"
            />
            <line
              x1={validBand.x}
              x2={validBand.x}
              y1={PLOT.yTop}
              y2={PLOT.yBot}
              stroke="rgb(34 197 94)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text
              x={validBand.x + 6}
              y={PLOT.yTop + 14}
              className="dp-tick"
              fill="rgb(34 197 94)"
              fontWeight={700}
            >
              n₀ = {n0} — από εδώ, T ≤ c·{def.fLabel}
            </text>
          </g>
        ) : null}

        {/* y grid + ticks */}
        {yTicks.map((t) => (
          <g key={`y-${t}`}>
            <line x1={PLOT.x0} x2={PLOT.x1} y1={yFor(t)} y2={yFor(t)} className="dp-grid" />
            <text x={PLOT.x0 - 6} y={yFor(t) + 3} textAnchor="end" className="dp-tick">
              {fmt(t)}
            </text>
          </g>
        ))}
        {/* zero line if visible */}
        {yMin < 0 && yMax > 0 ? (
          <line x1={PLOT.x0} x2={PLOT.x1} y1={yFor(0)} y2={yFor(0)} className="dp-zero" />
        ) : null}
        {/* x grid + ticks */}
        {xTicks.map((n) => (
          <g key={`x-${n}`}>
            <line x1={xFor(n)} x2={xFor(n)} y1={PLOT.yTop} y2={PLOT.yBot} className="dp-grid" />
            <text x={xFor(n)} y={PLOT.yBot + 14} textAnchor="middle" className="dp-tick">
              {n}
            </text>
          </g>
        ))}

        {/* axes */}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.yBot} y2={PLOT.yBot} className="dp-axis" />
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.yTop} y2={PLOT.yBot} className="dp-axis" />
        <text
          x={(PLOT.x0 + PLOT.x1) / 2}
          y={PLOT.yBot + 30}
          textAnchor="middle"
          className="dp-axislabel"
        >
          μέγεθος εισόδου n
        </text>

        {/* the two curves */}
        <polyline
          points={cfLine}
          fill="none"
          stroke="rgb(234 88 12)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        {cfBuilt.overflow && (
          <text
            x={cfBuilt.overflow.x}
            y={
              cfBuilt.overflow.dir === 'up'
                ? PLOT.yTop - 5
                : PLOT.yBot + 14
            }
            textAnchor="middle"
            fontSize={15}
            fontWeight={700}
            fill="rgb(234 88 12)"
            aria-label={
              cfBuilt.overflow.dir === 'up'
                ? 'συνεχίζει εκτός ορίων προς τα πάνω'
                : 'συνεχίζει εκτός ορίων προς τα κάτω'
            }
          >
            {cfBuilt.overflow.dir === 'up' ? '↑' : '↓'}
          </text>
        )}
        <polyline points={tLine} fill="none" stroke="rgb(37 99 235)" strokeWidth={2.5} />
        {tBuilt.overflow && (
          <text
            x={tBuilt.overflow.x}
            y={
              tBuilt.overflow.dir === 'up'
                ? PLOT.yTop - 5
                : PLOT.yBot + 14
            }
            textAnchor="middle"
            fontSize={15}
            fontWeight={700}
            fill="rgb(37 99 235)"
            aria-label={
              tBuilt.overflow.dir === 'up'
                ? 'συνεχίζει εκτός ορίων προς τα πάνω'
                : 'συνεχίζει εκτός ορίων προς τα κάτω'
            }
          >
            {tBuilt.overflow.dir === 'up' ? '↑' : '↓'}
          </text>
        )}

        {/* legend */}
        <g transform={`translate(${PLOT.x0 + 10}, 296)`}>
          <line x1={0} x2={26} y1={0} y2={0} stroke="rgb(37 99 235)" strokeWidth={2.5} />
          <text x={32} y={4} className="dp-axislabel" fill="rgb(var(--fg))">
            T(n)
          </text>
          <line
            x1={100}
            x2={126}
            y1={0}
            y2={0}
            stroke="rgb(234 88 12)"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          <text x={132} y={4} className="dp-axislabel" fill="rgb(var(--fg))">
            c · {def.fLabel} = {fmt(cVal)} · {def.fLabel}
          </text>
        </g>
      </svg>

      {/* c slider */}
      <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <label
          htmlFor="def-c"
          className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          Σταθερά c
        </label>
        <input
          id="def-c"
          type="range"
          min={def.cMin}
          max={def.cMax}
          step={def.cStep}
          value={cVal}
          onChange={(e) => setC(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <div className="shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-sm font-bold text-accent">
          c = {cVal.toFixed(def.cStep < 0.1 ? 2 : 1)}
        </div>
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 rounded-lg border px-3 py-2.5 text-sm leading-relaxed',
          !failsForever
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
            : 'border-red-500/50 bg-red-500/10 text-red-950 dark:text-red-100',
        )}
      >
        {!failsForever ? (
          <>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider opacity-80">
                ✓ Επιτυχία — βρέθηκαν μάρτυρες
              </span>
              <span className="font-mono text-[13px]">
                (c, n₀) = ({cVal.toFixed(def.cStep < 0.1 ? 2 : 1)}, {n0})
              </span>
            </div>
            <div className="text-fg-muted">
              Για κάθε n ≥ <strong className="font-mono text-fg">{n0}</strong>, ισχύει
              T(n) ≤ <strong className="font-mono text-fg">{fmt(cVal)}</strong>·{def.fLabel}.
              Άρα <strong>T ∈ {def.label}</strong>.
            </div>
          </>
        ) : (
          <>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider opacity-80">
                ✗ Αποτυχία — η ανισότητα δεν κρατάει
              </span>
              <span className="font-mono text-[13px]">c = {fmt(cVal)}</span>
            </div>
            <div className="text-fg-muted">
              Μέχρι το n = <strong className="font-mono text-fg">{def.nMax}</strong> η T(n)
              ξαναξεπερνά την c·{def.fLabel} —{' '}
              {caseId === 'impossible' ? (
                <>
                  και θα συνεχίσει για πάντα, γιατί το{' '}
                  <span className="font-mono">n²</span> «καταβροχθίζει» το γραμμικό{' '}
                  <span className="font-mono">c·n</span> όσο μεγάλο c κι αν διαλέξεις.
                </>
              ) : (
                <>
                  ανέβασε το c πιο πάνω για να μετακινήσεις τη πορτοκαλί καμπύλη πάνω από
                  την μπλε σε όλο το εύρος.
                </>
              )}
              {' '}Άρα <strong>δεν υπάρχει</strong> τέτοιο n₀.
            </div>
          </>
        )}
      </div>

      {/* case blurb */}
      <p className="mt-2 text-xs leading-relaxed text-fg-subtle">{def.blurb}</p>
    </section>
  )
}

// Per-case slider state — remember the last c the user set for each case.
function useCaseSlider(caseId: CaseId) {
  const [byCase, setByCase] = useState<Record<CaseId, number>>(() => {
    const init: Record<CaseId, number> = { tight: 3, loose: 0.1, impossible: 50 }
    return init
  })
  return {
    cVal: byCase[caseId],
    setC: (v: number) => setByCase((s) => ({ ...s, [caseId]: v })),
  }
}

function niceStep(roughStep: number): number {
  if (roughStep <= 0) return 1
  const exp = Math.floor(Math.log10(roughStep))
  const base = roughStep / 10 ** exp
  let nice: number
  if (base < 1.5) nice = 1
  else if (base < 3) nice = 2
  else if (base < 7) nice = 5
  else nice = 10
  return nice * 10 ** exp
}
