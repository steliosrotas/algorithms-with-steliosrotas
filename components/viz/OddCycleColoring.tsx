'use client'

/**
 * OddCycleColoring — the lemma «διμερές ⇒ καμία περιττή κύκλος», made visible (L08).
 *
 * The lemma is asserted in two lines: "in an odd cycle, alternating colours
 * eventually clash". On paper that's a parity argument; in the brain it's
 * forgettable. Here the student picks the cycle length k ∈ {3..8} and walks
 * an alternating 2-colouring around the polygon. Each new vertex is forced
 * into the OPPOSITE colour of its predecessor — there is no other choice.
 * At step k the cycle closes; the viz then evaluates the closing edge
 * v_{k−1}—v₀:
 *   even k → endpoints in different colours → ✓
 *   odd  k → endpoints in the SAME colour   → ✗
 * The closing edge lights red on the odd case and a verdict pill makes the
 * lemma's contrapositive explicit. Built for L08.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

const RED = '#ef4444'
const BLUE = '#3b82f6'
const GRAY = '#a8a29e'

const MIN_K = 3
const MAX_K = 8
const NODE_R = 22

function ringPositions(k: number, cx = 200, cy = 190, r = 140) {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < k; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / k
    out.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) })
  }
  return out
}

function colorWord(i: number) {
  return i % 2 === 0 ? 'κόκκινο' : 'μπλε'
}

export function OddCycleColoring() {
  const [k, setK] = useState(5)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const positions = useMemo(() => ringPositions(k), [k])
  const nodeRects = useMemo<NodeRect[]>(
    () =>
      positions.map((p, i) => ({
        id: i,
        x: p.x - NODE_R,
        y: p.y - NODE_R,
        w: NODE_R * 2,
        h: NODE_R * 2,
      })),
    [positions],
  )
  const lastStep = k + 1 // 0=none, 1..k=color v0..v_{k-1}, k+1=evaluate closing edge

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [k])

  useEffect(() => {
    if (!playing) return
    if (step >= lastStep) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => Math.min(lastStep, s + 1)), 700)
    return () => clearTimeout(t)
  }, [playing, step, lastStep])

  const isOdd = k % 2 === 1
  const atEnd = step === lastStep
  const conflict = atEnd && isOdd

  // edges (i → i+1 mod k); the LAST edge (k-1 → 0) is the closing edge
  const edges: [number, number][] = []
  for (let i = 0; i < k; i++) edges.push([i, (i + 1) % k])
  const closingIdx = k - 1

  // colour of v_i once it is reached (step > i)
  function nodeFill(i: number) {
    if (step <= i) return GRAY
    return i % 2 === 0 ? RED : BLUE
  }
  function nodeStroke(i: number) {
    if (step <= i) return '#737373'
    return i % 2 === 0 ? '#b91c1c' : '#1d4ed8'
  }
  function nodeTextColor(i: number) {
    return step <= i ? '#1c1214' : '#ffffff'
  }

  // edge tone: gray until both endpoints coloured; coloured-ok green; conflict red
  function edgeProps(idx: number) {
    const [a, b] = edges[idx]
    const aColored = step > a
    const bColored = step > b
    const both = aColored && bColored
    if (!both) return { stroke: '#c9c2bd', width: 2.4, dash: undefined as string | undefined }
    const aCol = a % 2 === 0 ? 'r' : 'b'
    const bCol = b % 2 === 0 ? 'r' : 'b'
    const diff = aCol !== bCol
    const isClosing = idx === closingIdx
    if (isClosing && atEnd) {
      return diff
        ? { stroke: '#16a34a', width: 5, dash: undefined }
        : { stroke: '#dc2626', width: 5, dash: undefined }
    }
    return diff
      ? { stroke: '#9ca3af', width: 2.6, dash: undefined }
      : { stroke: '#dc2626', width: 4, dash: undefined }
  }

  let note: string
  if (step === 0) {
    note = `Κύκλος μήκους k = ${k}. Θα δοκιμάσουμε εναλλάξ χρωματισμό: άρτιο index → κόκκινο, περιττό → μπλε. Η ΚΑΘΕ επόμενη κορυφή είναι αναγκασμένη να πάρει το αντίθετο χρώμα από την προηγούμενη — η ακμή ανάμεσά τους το απαιτεί.`
  } else if (step <= k) {
    const i = step - 1
    if (i === 0) {
      note = `Κορυφή v0 → κόκκινο. (Αυθαίρετη επιλογή — αν την κάναμε μπλε, θα είχαμε απλώς ανταλλαγμένα χρώματα.)`
    } else {
      note = `Κορυφή v${i} → ${colorWord(i)}. Η ακμή v${i - 1}–v${i} απαιτεί διαφορετικό χρώμα από την v${i - 1} (που ήταν ${colorWord(i - 1)}).`
    }
  } else if (conflict) {
    const c = colorWord(k - 1)
    note = `Η κλείνουσα ακμή v${k - 1}–v0 έχει ΙΔΙΟ χρώμα στα δύο άκρα: ${c} ↔ κόκκινο. Αντίφαση — δεν υπάρχει έγκυρος 2-χρωματισμός. (Δεν θα γλίτωνε αν αρχίζαμε με μπλε: θα συναντιόμασταν σε μπλε.)`
  } else {
    note = `Η κλείνουσα ακμή v${k - 1}–v0 έχει ΔΙΑΦΟΡΕΤΙΚΑ χρώματα: ${colorWord(k - 1)} ↔ κόκκινο. Ο 2-χρωματισμός κλείνει επιτυχώς — άρτιος κύκλος ⇒ διμερής υπογράφος.`
  }

  function reset() {
    setStep(0)
    setPlaying(false)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Άρτιο ή περιττό μήκος — δοκίμασε να χρωματίσεις τον κύκλο εναλλάξ
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              'rounded-md px-2 py-0.5 font-bold uppercase tracking-wider',
              isOdd
                ? 'bg-red-100 text-red-800'
                : 'bg-emerald-100 text-emerald-800',
            )}
          >
            k = {k} · {isOdd ? 'περιττό' : 'άρτιο'}
          </span>
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Άρτιο index → κόκκινο, περιττό → μπλε. Πάτα «Επόμενο» και δες αν η
        κλείνουσα ακμή σπάει.
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* the cycle */}
        <div className="graph-canvas">
          <svg
            viewBox="0 0 400 380"
            className="mx-auto block h-auto w-full max-w-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* edges first so nodes overlap them */}
            {edges.map((e, idx) => {
              const A = positions[e[0]]
              const B = positions[e[1]]
              // Collision-aware routing: chord of a regular polygon, so any
              // other vertex on the circle stays clear of every interior
              // chord — steady-state is a straight line. Locks out the
              // «edge through unrelated node» class of bug structurally
              // per Phase E.4.6.
              const g = routeEdge(nodeRects[e[0]], nodeRects[e[1]], nodeRects)
              const ep = edgeProps(idx)
              const isClosing = idx === closingIdx
              const dash = isClosing && step < lastStep ? '4 4' : undefined
              const mx = g.kind === 'curve' ? (A.x + 2 * g.cx + B.x) / 4 : (A.x + B.x) / 2
              const my = g.kind === 'curve' ? (A.y + 2 * g.cy + B.y) / 4 : (A.y + B.y) / 2
              return (
                <g key={`e${idx}`}>
                  {g.kind === 'line' ? (
                    <line
                      x1={g.x1}
                      y1={g.y1}
                      x2={g.x2}
                      y2={g.y2}
                      stroke={ep.stroke}
                      strokeWidth={ep.width}
                      strokeLinecap="round"
                      strokeDasharray={dash}
                    />
                  ) : (
                    <path
                      d={g.d}
                      fill="none"
                      stroke={ep.stroke}
                      strokeWidth={ep.width}
                      strokeLinecap="round"
                      strokeDasharray={dash}
                    />
                  )}
                  {isClosing && atEnd && (
                    <text
                      x={mx}
                      y={my - 8}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={800}
                      fill={conflict ? '#dc2626' : '#16a34a'}
                    >
                      {conflict ? '✗ ίδιο χρώμα' : '✓ διαφορετικό'}
                    </text>
                  )}
                </g>
              )
            })}

            {/* nodes */}
            {positions.map((p, i) => {
              const reached = step > i
              return (
                <g key={`v${i}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={22}
                    fill={nodeFill(i)}
                    stroke={nodeStroke(i)}
                    strokeWidth={2.5}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={700}
                    fill={nodeTextColor(i)}
                  >
                    v{i}
                  </text>
                  {reached && (
                    <text
                      x={p.x}
                      y={p.y + 38}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      fill={i % 2 === 0 ? '#b91c1c' : '#1d4ed8'}
                    >
                      {colorWord(i)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* side panel */}
        <div className="space-y-3">
          {/* k slider */}
          <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-fg-subtle">
              <span>Μήκος κύκλου k</span>
              <span className="font-mono text-fg">{k}</span>
            </div>
            <input
              type="range"
              min={MIN_K}
              max={MAX_K}
              step={1}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-[10px] text-fg-subtle">
              {Array.from({ length: MAX_K - MIN_K + 1 }, (_, i) => MIN_K + i).map(
                (v) => (
                  <span
                    key={v}
                    className={cn(
                      v === k && 'font-bold text-fg',
                      v % 2 === 1 ? 'text-red-700/60' : 'text-emerald-700/60',
                    )}
                  >
                    {v}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* parity ledger */}
          <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
            <div className="mb-1 text-[11px] uppercase tracking-wider text-fg-subtle">
              Χρώμα ανά κορυφή
            </div>
            <div
              className={cn(
                'grid gap-1 text-center',
                k <= 5 && 'grid-cols-5',
                k === 6 && 'grid-cols-6',
                k === 7 && 'grid-cols-7',
                k === 8 && 'grid-cols-8',
              )}
            >
              {Array.from({ length: k }, (_, i) => {
                const reached = step > i
                return (
                  <div
                    key={i}
                    className={cn(
                      'rounded-md border px-1 py-1 text-[10px] font-bold',
                      !reached && 'border-border bg-bg-elevated text-fg-subtle',
                      reached && i % 2 === 0 && 'border-red-400 bg-red-100 text-red-800',
                      reached && i % 2 === 1 && 'border-blue-400 bg-blue-100 text-blue-800',
                    )}
                  >
                    v{i}
                  </div>
                )
              })}
            </div>
          </div>

          {/* narration */}
          <div
            aria-live="polite"
            className="min-h-[5.5rem] rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted"
          >
            {note}
          </div>

          {/* verdict */}
          {atEnd && (
            <div
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-semibold',
                conflict
                  ? 'border-red-500/50 bg-red-50 text-red-800'
                  : 'border-emerald-500/50 bg-emerald-50 text-emerald-800',
              )}
            >
              {conflict
                ? `✗ Περιττός κύκλος (k = ${k}) ⇒ ΟΧΙ διμερής. Καμία επιλογή 2 χρωμάτων δεν δουλεύει.`
                : `✓ Άρτιος κύκλος (k = ${k}) ⇒ διμερής. Άρτια indices κόκκινα, περιττά μπλε — όλες οι ακμές αλλάζουν χρώμα.`}
            </div>
          )}
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Από την αρχή
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Πίσω
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= lastStep}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          {playing ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" /> Παύση
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" /> Παίξε
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(lastStep, s + 1))}
          disabled={step >= lastStep}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          Βήμα {step} / {lastStep}
        </span>
      </div>
    </section>
  )
}
