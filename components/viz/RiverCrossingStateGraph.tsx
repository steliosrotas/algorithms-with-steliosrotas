'use client'

/**
 * RiverCrossingStateGraph — modelling the wolf-goat-cabbage puzzle as BFS.
 *
 * For L06 problem front-set-7-ask2. The teaching arc is: "the puzzle has no
 * clever trick — model it, then BFS finds the answer mechanically". This viz
 * makes the model visible.
 *
 *   - Each NODE is a state of the world: which of {B, C, G, W} stand on the
 *     FAR bank. Of the 2^4 = 16 raw states, 6 are unsafe (goat+wolf alone, or
 *     cabbage+goat alone) and 10 are safe.
 *   - Each EDGE is a legal boat trip — B and possibly one passenger swap
 *     banks, provided both endpoints are safe.
 *   - The puzzle = shortest path from ∅ to {B,C,G,W} in this state graph.
 *
 * Two modes:
 *   - «Δες τις 10 ασφαλείς καταστάσεις» — explore the static graph; click any
 *     node to inspect the bank diagram for that state.
 *   - «Πάρε τη λύση 7 βημάτων» — step through the BFS-shortest path; the
 *     current edge lights, the move caption explains «ο βαρκάρης πήγε X», and
 *     a bank diagram redraws live.
 *
 * The 6 unsafe states are listed below as a "what you can't reach" footer so
 * the student sees why the picture has 10 nodes and not 16.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

const NODE_W = 64
const NODE_H = 28

// We encode a state as a 4-bit mask: B=1, C=2, G=4, W=8. The bit being SET
// means the character is on the FAR bank.
type StateId = number

const B = 1
const C = 2
const G = 4
const W = 8
const ALL = B | C | G | W

const NAMES: Record<number, string> = { [B]: 'B', [C]: 'C', [G]: 'G', [W]: 'W' }
const LABEL_EL: Record<number, string> = {
  [B]: 'βαρκάρης',
  [C]: 'λάχανο',
  [G]: 'κατσίκα',
  [W]: 'λύκος',
}

function setLabel(s: StateId): string {
  if (s === 0) return '∅'
  const parts: string[] = []
  for (const x of [B, C, G, W]) if ((s & x) !== 0) parts.push(NAMES[x])
  return `{${parts.join(',')}}`
}

function farBank(s: StateId): number[] {
  return [B, C, G, W].filter((x) => (s & x) !== 0)
}
function nearBank(s: StateId): number[] {
  return [B, C, G, W].filter((x) => (s & x) === 0)
}

// A bank is unsafe if it contains {G,W} or {C,G} but not B.
function isBankSafe(bank: number[]): boolean {
  const hasB = bank.includes(B)
  if (hasB) return true
  const set = new Set(bank)
  if (set.has(G) && set.has(W)) return false
  if (set.has(C) && set.has(G)) return false
  return true
}
function isSafe(s: StateId): boolean {
  return isBankSafe(farBank(s)) && isBankSafe(nearBank(s))
}

// Enumerate transitions: B switches sides, plus optionally one passenger that
// was on the same bank as B. The resulting state must be safe.
function transitionsOf(s: StateId): { to: StateId; passenger: number | 'alone' }[] {
  const out: { to: StateId; passenger: number | 'alone' }[] = []
  // B alone:
  const t0 = s ^ B
  if (isSafe(t0)) out.push({ to: t0, passenger: 'alone' })
  // B + passenger (must be on the SAME bank as B before crossing):
  for (const p of [C, G, W]) {
    const bOnFar = (s & B) !== 0
    const pOnFar = (s & p) !== 0
    if (bOnFar !== pOnFar) continue // not same bank → cannot ride together
    const t = (s ^ B) ^ p
    if (isSafe(t)) out.push({ to: t, passenger: p })
  }
  return out
}

const SAFE_STATES: StateId[] = []
for (let s = 0; s <= ALL; s++) if (isSafe(s)) SAFE_STATES.push(s)
const UNSAFE_STATES: StateId[] = []
for (let s = 0; s <= ALL; s++) if (!isSafe(s)) UNSAFE_STATES.push(s)

// Build the edge list (undirected, deduplicated).
const EDGES: { a: StateId; b: StateId; passenger: number | 'alone' }[] = []
{
  const seen = new Set<string>()
  for (const s of SAFE_STATES) {
    for (const t of transitionsOf(s)) {
      const key = s < t.to ? `${s}-${t.to}` : `${t.to}-${s}`
      if (seen.has(key)) continue
      seen.add(key)
      EDGES.push({ a: s, b: t.to, passenger: t.passenger })
    }
  }
}

// Layout: columns by far-bank size (0..4), rows stacked.
const POS: Record<StateId, { x: number; y: number }> = (() => {
  const byCol: Record<number, StateId[]> = {}
  for (const s of SAFE_STATES) {
    const c = farBank(s).length
    ;(byCol[c] ??= []).push(s)
  }
  const colX = [70, 200, 340, 480, 610]
  const map: Record<StateId, { x: number; y: number }> = {}
  for (const cStr of Object.keys(byCol)) {
    const col = Number(cStr)
    const items = byCol[col]
    const top = 60
    const gap = items.length === 1 ? 0 : 230 / (items.length - 1)
    items.forEach((s, i) => {
      const y = items.length === 1 ? 175 : top + i * gap
      map[s] = { x: colX[col], y }
    })
  }
  return map
})()

// One canonical 7-step solution path.
const SOLUTION: { from: StateId; to: StateId; passenger: number | 'alone'; greek: string }[] = [
  { from: 0, to: B | G, passenger: G, greek: 'Ο βαρκάρης πέρνα την κατσίκα απέναντι.' },
  { from: B | G, to: G, passenger: 'alone', greek: 'Γυρίζει μόνος του.' },
  { from: G, to: B | G | C, passenger: C, greek: 'Πέρνα το λάχανο απέναντι.' },
  { from: B | G | C, to: C, passenger: G, greek: 'Φέρνει πίσω την κατσίκα για ασφάλεια.' },
  { from: C, to: B | C | W, passenger: W, greek: 'Πέρνα τον λύκο απέναντι.' },
  { from: B | C | W, to: C | W, passenger: 'alone', greek: 'Γυρίζει μόνος του.' },
  { from: C | W, to: B | C | G | W, passenger: G, greek: 'Πέρνα ξανά την κατσίκα — όλοι απέναντι.' },
]

type Mode = 'explore' | 'solve'

export function RiverCrossingStateGraph() {
  const [mode, setMode] = useState<Mode>('explore')
  const [k, setK] = useState(0) // step in SOLUTION when mode === 'solve'
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState<StateId>(0) // for explore mode

  const currentState = mode === 'solve' ? (k === 0 ? 0 : SOLUTION[k - 1].to) : hovered

  function stepForward() {
    if (k >= SOLUTION.length) return
    setK(k + 1)
  }
  function stepBack() {
    if (k === 0) return
    setK(k - 1)
  }
  function reset() {
    setK(0)
    setPlaying(false)
  }

  useEffect(() => {
    if (!playing) return
    if (k >= SOLUTION.length) {
      setPlaying(false)
      return
    }
    const t = setTimeout(stepForward, 850)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, k])

  const activeEdge = useMemo(() => {
    if (mode !== 'solve' || k === 0) return null
    const step = SOLUTION[k - 1]
    return { a: step.from, b: step.to }
  }, [mode, k])

  const visited = useMemo(() => {
    if (mode !== 'solve') return new Set<StateId>()
    const s = new Set<StateId>([0])
    for (let i = 0; i < k; i++) s.add(SOLUTION[i].to)
    return s
  }, [mode, k])

  const NODE_RECTS: NodeRect[] = useMemo(
    () =>
      SAFE_STATES.map((s) => ({
        id: s,
        x: POS[s].x - NODE_W / 2,
        y: POS[s].y - NODE_H / 2,
        w: NODE_W,
        h: NODE_H,
      })),
    [],
  )

  const EDGE_GEOM = useMemo(() => {
    const byId = new Map<StateId, NodeRect>(NODE_RECTS.map((r) => [r.id as StateId, r]))
    return EDGES.map((e) => routeEdge(byId.get(e.a)!, byId.get(e.b)!, NODE_RECTS))
  }, [NODE_RECTS])

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border bg-bg-soft/30">
      <div className="border-b border-border bg-bg-soft/50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Λύκος / κατσίκα / λάχανο — γράφος καταστάσεων
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Κάθε <strong>κόμβος</strong> = ποιοι από{' '}
          <span className="font-mono">B·C·G·W</span> στέκονται στην <em>απέναντι</em>{' '}
          όχθη. Κάθε <strong>ακμή</strong> = ένα νόμιμο πέρασμα με τη βάρκα (ο
          βαρκάρης ± ένα αντικείμενο). Το πρόβλημα γίνεται μονοπάτι από{' '}
          <span className="font-mono">∅</span> ως <span className="font-mono">{`{B,C,G,W}`}</span>.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex flex-wrap gap-1 border-b border-border px-4 py-2">
        {(
          [
            { id: 'explore', label: 'Δες τις 10 ασφαλείς καταστάσεις' },
            { id: 'solve', label: 'Πάρε τη λύση 7 βημάτων (BFS)' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setMode(t.id)
              setK(0)
              setPlaying(false)
            }}
            className={cn(
              'rounded-md px-2.5 py-1 text-sm',
              mode === t.id
                ? 'bg-rose-100 font-semibold text-rose-900'
                : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Graph */}
        <div className="rounded-xl border border-border bg-bg-elevated p-3">
          <svg viewBox="0 0 680 360" className="w-full">
            {EDGES.map((e, i) => {
              const hi =
                activeEdge &&
                ((activeEdge.a === e.a && activeEdge.b === e.b) ||
                  (activeEdge.a === e.b && activeEdge.b === e.a))
              const isVisited = visited.has(e.a) && visited.has(e.b)
              const stroke = hi ? '#dc2626' : isVisited ? '#0ea5a2' : '#cbb3b8'
              const strokeWidth = hi ? 4 : isVisited ? 2.4 : 1.4
              const opacity = hi || isVisited ? 1 : 0.7
              const geom = EDGE_GEOM[i]
              if (geom.kind === 'curve') {
                return (
                  <path
                    key={i}
                    d={geom.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                  />
                )
              }
              return (
                <line
                  key={i}
                  x1={geom.x1}
                  y1={geom.y1}
                  x2={geom.x2}
                  y2={geom.y2}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                />
              )
            })}
            {SAFE_STATES.map((s) => {
              const p = POS[s]
              const isCurrent = mode === 'solve' && currentState === s
              const isHover = mode === 'explore' && hovered === s
              const inPath = visited.has(s)
              return (
                <g
                  key={s}
                  onMouseEnter={() => mode === 'explore' && setHovered(s)}
                  onClick={() => mode === 'explore' && setHovered(s)}
                  className={mode === 'explore' ? 'cursor-pointer' : ''}
                >
                  <rect
                    x={p.x - 32}
                    y={p.y - 14}
                    width={64}
                    height={28}
                    rx={6}
                    fill={
                      s === 0
                        ? '#fef3c7'
                        : s === ALL
                          ? '#dcfce7'
                          : inPath
                            ? '#ecfeff'
                            : '#ffffff'
                    }
                    stroke={
                      isCurrent
                        ? '#dc2626'
                        : isHover
                          ? '#0ea5a2'
                          : inPath
                            ? '#0ea5a2'
                            : '#9b8a8d'
                    }
                    strokeWidth={isCurrent || isHover ? 3 : 1.5}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="ui-monospace,SFMono-Regular,Menlo,Monaco,monospace"
                  >
                    {setLabel(s)}
                  </text>
                </g>
              )
            })}
            {/* Column captions */}
            {[0, 1, 2, 3, 4].map((c) => (
              <text
                key={c}
                x={[70, 200, 340, 480, 610][c]}
                y={340}
                textAnchor="middle"
                fontSize="10"
                fill="#7b6266"
              >
                {c} απέναντι
              </text>
            ))}
          </svg>

          {/* Bank diagram for the current state */}
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-md border border-border bg-bg-soft p-2 text-xs">
            <BankSide
              title="Αρχική όχθη"
              members={nearBank(currentState)}
              safe={isBankSafe(nearBank(currentState))}
            />
            <BankSide
              title="Απέναντι όχθη"
              members={farBank(currentState)}
              safe={isBankSafe(farBank(currentState))}
            />
          </div>
          <p className="mt-2 text-xs text-fg-muted">
            Κατάσταση: <span className="font-mono">{setLabel(currentState)}</span>
            {mode === 'explore' && ' — πέρνα τον δείκτη ή κάνε κλικ σε κόμβο.'}
          </p>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          {mode === 'solve' && (
            <div className="rounded-xl border border-border bg-bg-elevated p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Λύση BFS — 7 βήματα
              </p>
              <ol className="mt-2 space-y-1 text-sm">
                {SOLUTION.map((step, i) => {
                  const done = i < k
                  const active = i === k - 1
                  return (
                    <li
                      key={i}
                      className={cn(
                        'flex items-start gap-2 rounded px-2 py-1',
                        active && 'bg-rose-50 ring-1 ring-rose-300',
                        done && !active && 'text-fg-muted',
                      )}
                    >
                      <span className="font-mono text-[11px] tabular-nums">
                        {(i + 1).toString().padStart(2, '0')}.
                      </span>
                      <span>{step.greek}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}
          <div className="rounded-xl border border-border bg-bg-elevated p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              6 καταστάσεις αποκλείονται (απαγορευμένες)
            </p>
            <ul className="mt-2 space-y-0.5 font-mono text-[12px]">
              {UNSAFE_STATES.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
                  <span>{setLabel(s)}</span>
                  <span className="text-fg-subtle">— μένει {whyUnsafe(s)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-bg-soft/40 p-3 text-xs text-fg-muted">
            <p className="font-semibold text-fg-default">Γιατί 10 και όχι 16;</p>
            <p className="mt-1">
              Από τις <span className="font-mono">2^4 = 16</span> δυνητικές κατανομές,
              αποκλείονται όσες αφήνουν την κατσίκα μόνη με τον λύκο ή με το λάχανο
              σε κάποια από τις δύο όχθες. Μένουν 10 — και ακόμα κι αν δεν τα
              κρατούσες όλα στο μυαλό σου, το BFS τα ξεσκαλίζει αυτόματα.
            </p>
          </div>
        </div>
      </div>

      {mode === 'solve' && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-bg-soft/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={stepBack}
              disabled={k === 0}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronLeft size={16} /> πίσω
            </button>
            <button
              type="button"
              onClick={() => setPlaying(!playing)}
              disabled={k >= SOLUTION.length}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? 'παύση' : 'παίξε'}
            </button>
            <button
              type="button"
              onClick={stepForward}
              disabled={k >= SOLUTION.length}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
            >
              επόμενο <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft"
            >
              <RotateCcw size={14} /> reset
            </button>
          </div>
          <p className="text-xs text-fg-subtle tabular-nums">
            βήμα {k} / {SOLUTION.length}
          </p>
        </div>
      )}
    </div>
  )
}

function BankSide({
  title,
  members,
  safe,
}: {
  title: string
  members: number[]
  safe: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-md border p-2',
        safe ? 'border-emerald-300 bg-emerald-50/60' : 'border-rose-400 bg-rose-50',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          {title}
        </span>
        <span
          className={cn(
            'text-[10px] font-semibold',
            safe ? 'text-emerald-700' : 'text-rose-700',
          )}
        >
          {safe ? '✓ ασφαλές' : '✗ θα φαγωθούν'}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        {members.length === 0 ? (
          <span className="text-fg-subtle">∅</span>
        ) : (
          members.map((x) => (
            <span
              key={x}
              className="rounded bg-bg-elevated px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-border"
              title={LABEL_EL[x]}
            >
              {NAMES[x]}{' '}
              <span className="text-[9px] text-fg-subtle">({LABEL_EL[x]})</span>
            </span>
          ))
        )}
      </div>
    </div>
  )
}

function whyUnsafe(s: StateId): string {
  const far = farBank(s)
  const near = nearBank(s)
  const reasons: string[] = []
  if (!isBankSafe(far)) reasons.push(`απέναντι ${dangerName(far)}`)
  if (!isBankSafe(near)) reasons.push(`αρχικά ${dangerName(near)}`)
  return reasons.join(' · ')
}
function dangerName(bank: number[]): string {
  const set = new Set(bank)
  if (set.has(G) && set.has(W)) return 'λύκος+κατσίκα'
  if (set.has(C) && set.has(G)) return 'κατσίκα+λάχανο'
  return ''
}
