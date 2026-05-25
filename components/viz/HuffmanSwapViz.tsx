'use client'

/**
 * HuffmanSwapViz — Lemma 1 (the rarer character must sit deeper) as a puzzle.
 *
 * A fixed binary tree with four leaf slots at depths 1, 2, 3, 3 holds four
 * characters whose frequencies start scrambled into the WORST arrangement: the
 * most frequent character sits at the deepest leaf. The student clicks any two
 * leaves and swaps them. After each swap the panel shows the exact cost change
 *
 *     βελτίωση = (f(X) − f(Y)) · (d(X) − d(Y))
 *
 * — the same product the lecture's proof uses. A swap helps precisely when a
 * frequent character was sitting below a rarer one (an inversion); swapping a
 * pair already in order makes things worse. Reach cost 65 — no inversion left —
 * and the tree is optimal. That IS Lemma 1: any inversion can be removed for a
 * strict gain, so an optimal tree has none. Built for L13.
 */

import { useState } from 'react'
import { RotateCcw, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type Slot = { id: string; x: number; y: number; depth: number }
type Internal = { id: string; x: number; y: number }
type Edge = { from: string; to: string; bit: 0 | 1 }

const ROOT = { id: 'root', x: 220, y: 46 }
const INTERNAL: Internal[] = [
  { id: 'i1', x: 330, y: 138 },
  { id: 'i2', x: 425, y: 224 },
]
const SLOTS: Slot[] = [
  { id: 's1', x: 110, y: 138, depth: 1 },
  { id: 's2', x: 238, y: 224, depth: 2 },
  { id: 's3', x: 352, y: 304, depth: 3 },
  { id: 's4', x: 468, y: 304, depth: 3 },
]
const EDGES: Edge[] = [
  { from: 'root', to: 's1', bit: 0 },
  { from: 'root', to: 'i1', bit: 1 },
  { from: 'i1', to: 's2', bit: 0 },
  { from: 'i1', to: 'i2', bit: 1 },
  { from: 'i2', to: 's3', bit: 0 },
  { from: 'i2', to: 's4', bit: 1 },
]

/** Four characters with distinct frequencies. */
const FREQ: Record<string, number> = { A: 20, B: 9, C: 7, D: 2 }

/** Worst start: the most frequent character (A) buried at the deepest leaf. */
const START: Record<string, string> = { s1: 'D', s2: 'C', s3: 'A', s4: 'B' }

/** Unique minimum cost for these frequencies on depths {1,2,3,3}. */
const OPTIMAL_COST = 65

const POS: Record<string, { x: number; y: number }> = {
  root: ROOT,
  ...Object.fromEntries(INTERNAL.map((n) => [n.id, n])),
  ...Object.fromEntries(SLOTS.map((n) => [n.id, n])),
}

/** Per-node bounding rects sized to each node's visible radius (root=13,
 *  internal=11, leaf=23). Module-scope since the layout is static. */
const NODE_RECTS: NodeRect[] = [
  { id: 'root', x: ROOT.x - 13, y: ROOT.y - 13, w: 26, h: 26 },
  ...INTERNAL.map((n) => ({ id: n.id, x: n.x - 11, y: n.y - 11, w: 22, h: 22 })),
  ...SLOTS.map((s) => ({ id: s.id, x: s.x - 23, y: s.y - 23, w: 46, h: 46 })),
]
const NODE_RECT_BY_ID = new Map<string, NodeRect>(
  NODE_RECTS.map((r) => [r.id as string, r]),
)

/** Routed parent→child edge geometry, center-to-center (no arrowheads). */
function routedEdge(fromId: string, toId: string) {
  const a = NODE_RECT_BY_ID.get(fromId)!
  const b = NODE_RECT_BY_ID.get(toId)!
  return routeEdge(a, b, NODE_RECTS)
}

type SwapLog = {
  x: string
  y: string
  fx: number
  fy: number
  dx: number
  dy: number
  improvement: number
  before: number
  after: number
}

function costOf(assign: Record<string, string>): number {
  return SLOTS.reduce((s, slot) => s + FREQ[assign[slot.id]] * slot.depth, 0)
}

export function HuffmanSwapViz() {
  const [assign, setAssign] = useState<Record<string, string>>(START)
  const [selected, setSelected] = useState<string[]>([])
  const [log, setLog] = useState<SwapLog | null>(null)

  const cost = costOf(assign)
  const solved = cost === OPTIMAL_COST
  const slotById = new Map(SLOTS.map((s) => [s.id, s]))

  function toggle(slotId: string) {
    setSelected((sel) => {
      if (sel.includes(slotId)) return sel.filter((s) => s !== slotId)
      if (sel.length >= 2) return sel
      return [...sel, slotId]
    })
  }

  function doSwap() {
    if (selected.length !== 2) return
    const [a, b] = selected
    const sa = slotById.get(a) as Slot
    const sb = slotById.get(b) as Slot
    const ca = assign[a]
    const cb = assign[b]
    const before = cost
    const next = { ...assign, [a]: cb, [b]: ca }
    const after = costOf(next)
    setLog({
      x: ca,
      y: cb,
      fx: FREQ[ca],
      fy: FREQ[cb],
      dx: sa.depth,
      dy: sb.depth,
      improvement: before - after,
      before,
      after,
    })
    setAssign(next)
    setSelected([])
  }

  function reset() {
    setAssign(START)
    setSelected([])
    setLog(null)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Λήμμα 1 — ο σπανιότερος χαρακτήρας πρέπει να κάθεται βαθύτερα
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            solved ? 'bg-success/15 text-success' : 'bg-accent/10 text-accent',
          )}
        >
          {solved ? 'Βέλτιστο' : `Κόστος ${cost}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κάνε κλικ σε <span className="font-semibold text-fg">δύο φύλλα</span> και
        αντάλλαξέ τα. Στόχος: βρες την ανάθεση με το ελάχιστο κόστος (65).
      </p>

      {/* tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 540 360"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {EDGES.map((e) => {
            const p = POS[e.from]
            const c = POS[e.to]
            const g = routedEdge(e.from, e.to)
            const baseMx = g.kind === 'line' ? (p.x + c.x) / 2 : (p.x + c.x + 2 * g.cx) / 4
            const baseMy = g.kind === 'line' ? (p.y + c.y) / 2 : (p.y + c.y + 2 * g.cy) / 4
            const dx = c.x - p.x
            const dy = c.y - p.y
            const L = Math.hypot(dx, dy) || 1
            return (
              <g key={`${e.from}-${e.to}`}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke="#b6a6a8"
                    strokeWidth={1.8}
                  />
                ) : (
                  <path d={g.d} fill="none" stroke="#b6a6a8" strokeWidth={1.8} />
                )}
                <text
                  x={baseMx + (-dy / L) * 11}
                  y={baseMy + (dx / L) * 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={800}
                  fill="#8a787b"
                >
                  {e.bit}
                </text>
              </g>
            )
          })}

          {/* depth guides */}
          {[1, 2, 3].map((d) => {
            const y = d === 1 ? 138 : d === 2 ? 224 : 304
            return (
              <text
                key={d}
                x={20}
                y={y}
                dominantBaseline="central"
                fontSize={10}
                fontWeight={700}
                fill="#9b8a8d"
              >
                βάθος {d}
              </text>
            )
          })}

          {/* root */}
          <circle
            cx={ROOT.x}
            cy={ROOT.y}
            r={13}
            fill="#ffffff"
            stroke="#9b8a8d"
            strokeWidth={2.2}
          />
          <text
            x={ROOT.x}
            y={ROOT.y - 24}
            textAnchor="middle"
            fontSize={10}
            fontWeight={700}
            fill="#9b8a8d"
          >
            ρίζα
          </text>

          {/* internal nodes */}
          {INTERNAL.map((n) => (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={11}
              fill="#ffffff"
              stroke="#9b8a8d"
              strokeWidth={2.2}
            />
          ))}

          {/* leaves */}
          {SLOTS.map((slot) => {
            const ch = assign[slot.id]
            const isSel = selected.includes(slot.id)
            return (
              <g
                key={slot.id}
                role="button"
                tabIndex={0}
                aria-label={`Φύλλο με χαρακτήρα ${ch}, συχνότητα ${FREQ[ch]}, βάθος ${slot.depth}`}
                onClick={() => toggle(slot.id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    toggle(slot.id)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {isSel && (
                  <circle
                    cx={slot.x}
                    cy={slot.y}
                    r={28}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth={3}
                  />
                )}
                <circle
                  cx={slot.x}
                  cy={slot.y}
                  r={23}
                  fill={isSel ? '#fde68a' : '#fde2e4'}
                  stroke={isSel ? '#d97706' : '#e0607a'}
                  strokeWidth={2.4}
                />
                <text
                  x={slot.x}
                  y={slot.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={18}
                  fontWeight={800}
                  fill="#1c1214"
                >
                  {ch}
                </text>
                <text
                  x={slot.x}
                  y={slot.y + 39}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#5a4a4d"
                >
                  f = {FREQ[ch]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* cost readout */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Κόστος Σ f·βάθος
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {cost}
        </span>
        <span className="text-sm text-fg-muted">/ βέλτιστο: {OPTIMAL_COST}</span>
        {solved && (
          <span className="ml-auto rounded-md bg-success/15 px-2 py-0.5 text-sm font-bold text-success">
            ✓ καμία αντιστροφή
          </span>
        )}
      </div>

      {/* swap result / proof panel */}
      <div
        aria-live="polite"
        className="mt-2 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5 text-sm leading-relaxed text-fg-muted"
      >
        {solved ? (
          <p>
            <span className="font-semibold text-fg">
              Κάθε συχνότερος χαρακτήρας κάθεται τουλάχιστον τόσο ψηλά όσο κάθε
              σπανιότερος — καμία αντιστροφή.
            </span>{' '}
            Καμία ανταλλαγή δεν μπορεί πια να μειώσει το κόστος. Αυτό ακριβώς λέει
            το Λήμμα 1: αφού κάθε αντιστροφή αφαιρείται με γνήσιο κέρδος, ένα
            βέλτιστο δέντρο δεν έχει καμία.
          </p>
        ) : !log ? (
          <p>
            Ψάξε για μια <span className="font-semibold text-fg">αντιστροφή</span>:
            δύο φύλλα όπου ο <em>συχνότερος</em> χαρακτήρας κάθεται{' '}
            <em>βαθύτερα</em> από τον σπανιότερο. Αντάλλαξέ τα και δες το κόστος.
          </p>
        ) : (
          <div className="space-y-1.5">
            <p className="font-semibold text-fg">
              Ανταλλαγή: {log.x} ⇄ {log.y}
            </p>
            <p className="font-mono text-[13px] text-fg">
              βελτίωση = (f({log.x}) − f({log.y})) · (βάθ({log.x}) − βάθ({log.y}))
              = ({log.fx} − {log.fy}) · ({log.dx} − {log.dy}) ={' '}
              <span
                className={cn(
                  'font-bold',
                  log.improvement > 0
                    ? 'text-success'
                    : log.improvement < 0
                      ? 'text-danger'
                      : 'text-fg-muted',
                )}
              >
                {log.improvement > 0 ? '+' : ''}
                {log.improvement}
              </span>
            </p>
            {log.improvement > 0 ? (
              <p>
                <span className="font-semibold text-success">
                  ✓ Το κόστος έπεσε κατά {log.improvement}
                </span>{' '}
                ({log.before} → {log.after}). Ήταν αντιστροφή: ο συχνότερος
                χαρακτήρας καθόταν βαθύτερα. Και οι δύο παράγοντες του γινομένου
                έχουν το ίδιο πρόσημο → θετικό γινόμενο → γνήσια βελτίωση.
              </p>
            ) : log.improvement < 0 ? (
              <p>
                <span className="font-semibold text-danger">
                  ✗ Το κόστος ανέβηκε κατά {-log.improvement}
                </span>{' '}
                ({log.before} → {log.after}). Αυτό το ζευγάρι ήταν ήδη στη σωστή
                σειρά — η ανταλλαγή το χάλασε. Ξαναπάτησέ το για να το αναιρέσεις.
              </p>
            ) : (
              <p>
                Το κόστος δεν άλλαξε ({log.before}). Τα δύο φύλλα έχουν το{' '}
                <span className="font-semibold text-fg">ίδιο βάθος</span>, οπότε η
                διαφορά βάθους είναι 0 — και το γινόμενο μηδέν.
              </p>
            )}
          </div>
        )}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={doSwap}
          disabled={selected.length !== 2}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          Αντάλλαξε τα 2 επιλεγμένα
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          {selected.length} / 2 επιλεγμένα
        </span>
      </div>
    </section>
  )
}
