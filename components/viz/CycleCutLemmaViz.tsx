'use client'

/**
 * CycleCutLemmaViz — the cut-cycle parity lemma, walked around (L09).
 *
 * "Every cycle crosses every cut an EVEN number of times" lands only when
 * the student physically walks the cycle and watches the count tick in
 * pairs: once you cross from A to V\A, you must cross back to close. Here
 * they pick a cycle, pick the partition by clicking vertices, then step:
 * each edge either takes them "across the line" (red, +1 to a counter) or
 * stays on the same side (green). The counter is always even, no matter
 * which cycle or which cut the student tries. That's the lemma — but a
 * picture they made. Built for L09.
 */

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MST_NODES,
  MST_EDGES,
  MST_POS,
  MST_NODE_R,
  MST_VIEW,
  edgeId,
  routeMstEdge,
} from './mst-graph'

type CyclePreset = {
  id: string
  label: string
  /** Vertices in walking order — the last edge closes the cycle back to walk[0]. */
  walk: string[]
}

const CYCLE_PRESETS: CyclePreset[] = [
  { id: 'tri-acd', label: 'Τρίγωνο A-C-D', walk: ['A', 'C', 'D'] },
  { id: 'tri-cdf', label: 'Τρίγωνο C-D-F', walk: ['C', 'D', 'F'] },
  { id: 'quad-acdb', label: 'Τετράγωνο A-C-D-B', walk: ['A', 'C', 'D', 'B'] },
  { id: 'hex-outer', label: 'Εξάγωνο A-B-E-G-F-C', walk: ['A', 'B', 'E', 'G', 'F', 'C'] },
]

const CUT_PRESETS: { label: string; set: string[] }[] = [
  { label: 'A = {A}', set: ['A'] },
  { label: 'A = {C, F}', set: ['C', 'F'] },
  { label: 'A = {A, E, F}', set: ['A', 'E', 'F'] },
  { label: 'A = {D}', set: ['D'] },
]

export function CycleCutLemmaViz() {
  const [cycleId, setCycleId] = useState(CYCLE_PRESETS[0].id)
  const [inA, setInA] = useState<Set<string>>(new Set(['A']))
  const [step, setStep] = useState(0)

  const cycle = CYCLE_PRESETS.find((c) => c.id === cycleId)!
  const k = cycle.walk.length

  const cycleEdges = useMemo(() => {
    const out: string[] = []
    for (let i = 0; i < k; i++) {
      const u = cycle.walk[i]
      const v = cycle.walk[(i + 1) % k]
      out.push(edgeId(u, v))
    }
    return out
  }, [cycle, k])

  const cycleEdgeSet = useMemo(() => new Set(cycleEdges), [cycleEdges])

  /** for each cycle edge, does it cross the current cut? */
  const crossingFlags = useMemo(() => {
    const out: boolean[] = []
    for (let i = 0; i < k; i++) {
      const u = cycle.walk[i]
      const v = cycle.walk[(i + 1) % k]
      out.push(inA.has(u) !== inA.has(v))
    }
    return out
  }, [cycle, k, inA])

  /** running crossing count after step i */
  const crossingsUpTo = useMemo(() => {
    const out: number[] = [0]
    let c = 0
    for (let i = 0; i < k; i++) {
      if (crossingFlags[i]) c++
      out.push(c)
    }
    return out
  }, [crossingFlags, k])

  const totalCrossings = crossingsUpTo[k]
  const isEven = totalCrossings % 2 === 0

  const last = k
  const curIdx = step === 0 ? -1 : step - 1
  const curCrossed = curIdx >= 0 ? crossingFlags[curIdx] : null

  function toggle(id: string) {
    setInA((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setStep(0)
  }

  function pickCycle(id: string) {
    setCycleId(id)
    setStep(0)
  }

  function pickCut(set: string[]) {
    setInA(new Set(set))
    setStep(0)
  }

  const trivial = inA.size === 0 || inA.size === MST_NODES.length

  /** A row of pills [v0] →/↔ [v1] →/↔ ... [v0] showing the cycle walk. */
  const walkStripItems: ReactNode[] = []
  for (let i = 0; i < k; i++) {
    const v = cycle.walk[i]
    const inSide = inA.has(v)
    const isCurFrom = curIdx === i
    walkStripItems.push(
      <span
        key={`v-${i}`}
        className={cn(
          'rounded border px-1.5 py-0.5 font-mono font-semibold',
          inSide
            ? 'border-sky-500 bg-sky-100 text-sky-900'
            : 'border-border bg-bg-soft text-fg-muted',
          isCurFrom && 'ring-2 ring-amber-400',
        )}
      >
        {v}
      </span>,
    )
    const crossed = crossingFlags[i]
    walkStripItems.push(
      <span
        key={`a-${i}`}
        className={cn(
          'rounded px-1.5 py-0.5 font-mono text-xs font-bold',
          crossed
            ? 'border border-rose-400 bg-rose-50 text-rose-700'
            : 'text-fg-subtle',
          curIdx === i && 'ring-1 ring-amber-400',
        )}
      >
        {crossed ? '↔ +1' : '→'}
      </span>,
    )
  }
  const v0 = cycle.walk[0]
  const inStart = inA.has(v0)
  walkStripItems.push(
    <span
      key="v-last"
      className={cn(
        'rounded border px-1.5 py-0.5 font-mono font-semibold',
        inStart
          ? 'border-sky-500 bg-sky-100 text-sky-900'
          : 'border-border bg-bg-soft text-fg-muted',
      )}
    >
      {v0}
    </span>,
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Λήμμα κύκλου-αποκοπής — μέτρα τις διασχίσεις
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          A = {`{${[...inA].sort().join(', ') || '∅'}}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Διάλεξε έναν κύκλο και μια αποκοπή. Πάτα «επόμενο» για να περπατήσεις
        γύρω-γύρω: κάθε ακμή που σε πάει «μέσα ↔ έξω» αυξάνει τον μετρητή.
      </p>

      {/* cycle picker */}
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Κύκλος
        </span>
        {CYCLE_PRESETS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pickCycle(c.id)}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
              c.id === cycleId
                ? 'border-amber-500 bg-amber-100 text-amber-900'
                : 'border-border text-fg-muted hover:bg-bg-soft',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* cut picker */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Αποκοπή
        </span>
        {CUT_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => pickCut(p.set)}
            className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-fg-muted transition-colors hover:bg-bg-soft"
          >
            {p.label}
          </button>
        ))}
        <span className="text-xs text-fg-subtle">
          (ή κλικ σε κορυφή για να την αλλάξεις πλευρά)
        </span>
      </div>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${MST_VIEW.w} ${MST_VIEW.h}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* cycle glow underlay */}
          {MST_EDGES.filter((e) => cycleEdgeSet.has(e.id)).map((e) => {
            const A = MST_POS.get(e.a)!
            const B = MST_POS.get(e.b)!
            const g = routeMstEdge(A, B)
            return g.kind === 'line' ? (
              <line
                key={`glow-${e.id}`}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke="#fb923c"
                strokeWidth={13}
                strokeOpacity={0.28}
                strokeLinecap="round"
              />
            ) : (
              <path
                key={`glow-${e.id}`}
                d={g.d}
                fill="none"
                stroke="#fb923c"
                strokeWidth={13}
                strokeOpacity={0.28}
                strokeLinecap="round"
              />
            )
          })}

          {/* edges */}
          {MST_EDGES.map((e) => {
            const A = MST_POS.get(e.a)!
            const B = MST_POS.get(e.b)!
            const g = routeMstEdge(A, B)
            const idxInCycle = cycleEdges.indexOf(e.id)
            const isOnCycle = idxInCycle >= 0
            const isCrossing = isOnCycle && crossingFlags[idxInCycle]
            const isCurrent = idxInCycle === curIdx
            let stroke = '#d4cccd'
            let width = 1.7
            let labelStroke = '#cdbfc0'
            let labelFill = '#5a4a4d'
            if (isCurrent) {
              stroke = isCrossing ? '#dc2626' : '#16a34a'
              width = 6
              labelStroke = isCrossing ? '#dc2626' : '#16a34a'
              labelFill = isCrossing ? '#b91c1c' : '#15803d'
            } else if (isOnCycle) {
              stroke = isCrossing ? '#f87171' : '#fdba74'
              width = 3.8
              labelStroke = isCrossing ? '#f87171' : '#fdba74'
              labelFill = isCrossing ? '#b91c1c' : '#b45309'
            }
            return (
              <g key={e.id}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={width}
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width}
                    strokeLinecap="round"
                  />
                )}
                {isOnCycle && (
                  <>
                    <rect
                      x={g.mx - 11}
                      y={g.my - 10}
                      width={22}
                      height={17}
                      rx={4}
                      fill="#faf4ee"
                      stroke={labelStroke}
                      strokeWidth={isCurrent ? 2 : 1}
                    />
                    <text
                      x={g.mx}
                      y={g.my - 1}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill={labelFill}
                    >
                      {e.w}
                    </text>
                  </>
                )}
              </g>
            )
          })}

          {/* nodes */}
          {MST_NODES.map((n) => {
            const isIn = inA.has(n.id)
            const isOnCycle = cycle.walk.includes(n.id)
            return (
              <g
                key={n.id}
                onClick={() => toggle(n.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={MST_NODE_R}
                  fill={isIn ? '#7dd3fc' : '#ffffff'}
                  stroke={isIn ? '#0284c7' : isOnCycle ? '#d97706' : '#9b8a8d'}
                  strokeWidth={isOnCycle ? 3 : 2.5}
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
      </div>

      <p className="mt-1.5 text-center text-xs text-fg-subtle">
        💡 Γαλάζιο = μέσα στο A · πορτοκαλί περίγραμμα = πάνω στον κύκλο ·
        κόκκινο = ακμή κύκλου που διασχίζει την αποκοπή.
      </p>

      {/* walk strip */}
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Περπάτημα
        </span>
        {walkStripItems}
      </div>

      {/* counter */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-fg-muted">Διασχίσεις μέχρι τώρα:</span>
        <span
          className={cn(
            'rounded border px-2 py-0.5 font-mono text-base font-bold',
            curIdx < 0
              ? 'border-border bg-bg-soft text-fg-muted'
              : 'border-amber-500 bg-amber-100 text-amber-900',
          )}
        >
          {crossingsUpTo[Math.max(0, step)]}
        </span>
        {step === k && !trivial && (
          <span
            className={cn(
              'rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
              isEven
                ? 'border-success bg-success/15 text-success'
                : 'border-danger bg-danger/15 text-danger',
            )}
          >
            σύνολο = {totalCrossings} · {isEven ? 'άρτιο ✓' : 'περιττό ✗'}
          </span>
        )}
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {trivial ? (
          <>
            Μια αποκοπή χωρίζει τις κορυφές σε δύο ΜΗ-ΚΕΝΑ μέρη. Διάλεξε από 1
            έως 6 κορυφές για το A.
          </>
        ) : step === 0 ? (
          <>
            Ο {cycle.label.toLowerCase()} είναι τονισμένος πορτοκαλί. Πάτα
            «επόμενο» για να περπατήσεις την πρώτη ακμή — αν σε πάει από «μέσα
            στο A» σε «έξω» (ή το ανάποδο), μετράει διάσχιση.
          </>
        ) : step < k ? (
          <>
            Ακμή{' '}
            <span className="font-mono font-semibold">
              {cycle.walk[curIdx]} → {cycle.walk[(curIdx + 1) % k]}
            </span>
            :{' '}
            {curCrossed ? (
              <strong className="text-danger">
                διασχίζει την αποκοπή — ο μετρητής +1.
              </strong>
            ) : (
              <strong className="text-success">
                μένουμε στην ίδια πλευρά — ο μετρητής δεν αλλάζει.
              </strong>
            )}{' '}
            Σύνολο μέχρι τώρα: {crossingsUpTo[step]}.
          </>
        ) : (
          <>
            Γυρίσαμε στο {v0} μετά από {k} ακμές, με{' '}
            <strong className="text-fg">{totalCrossings}</strong> διασχίσεις —{' '}
            {isEven ? (
              <strong className="text-success">
                άρτιο, όπως υπόσχεται το λήμμα ✓
              </strong>
            ) : (
              <strong className="text-danger">περιττό; αδύνατο.</strong>
            )}{' '}
            Κάθε «μέσα → έξω» πρέπει αργότερα να αντισταθμιστεί από ένα «έξω →
            μέσα» για να κλείσει ο κύκλος — γι' αυτό οι διασχίσεις βγαίνουν πάντα
            σε ζεύγη.
          </>
        )}
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
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={step === last}
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
          Βήμα {step} / {k}
        </span>
      </div>
    </section>
  )
}
