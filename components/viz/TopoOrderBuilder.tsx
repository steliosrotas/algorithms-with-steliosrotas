'use client'

/**
 * TopoOrderBuilder — what a topological order actually IS, by operating it.
 *
 * The vertices sit in a left-to-right row of slots. Every edge is drawn as an
 * arc and coloured by direction: green if it points right (forward), red if it
 * points left (backward). A topological order is exactly an arrangement with
 * NO red arcs. Click two vertices to swap their slots and chase the count to
 * zero. Two presets drive the ⇔-theorem home: the DAG can always be fixed
 * (and in more than one way), the cyclic graph never can — the cycle always
 * leaves at least one arc pointing back. Built for L12.
 */

import { useState } from 'react'
import { RotateCcw, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Edge = [string, string]
type Preset = {
  vertices: string[]
  edges: Edge[]
  initial: string[]
  acyclic: boolean
}

const PRESETS: Record<'dag' | 'cyclic', Preset> = {
  dag: {
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      ['A', 'C'],
      ['B', 'C'],
      ['C', 'D'],
      ['C', 'E'],
      ['D', 'F'],
      ['E', 'F'],
    ],
    initial: ['F', 'E', 'D', 'C', 'B', 'A'],
    acyclic: true,
  },
  cyclic: {
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'D'],
      ['D', 'B'],
      ['D', 'E'],
    ],
    initial: ['C', 'A', 'B', 'E', 'D'],
    acyclic: false,
  },
}

const VIEW_W = 620
const VIEW_H = 268
const SLOT_PAD = 48
const SLOT_Y = 210
const R = 22

export function TopoOrderBuilder() {
  const [preset, setPreset] = useState<'dag' | 'cyclic'>('dag')
  const [order, setOrder] = useState<string[]>(PRESETS.dag.initial)
  const [selected, setSelected] = useState<string | null>(null)

  const cfg = PRESETS[preset]
  const n = order.length
  const slotOf = new Map(order.map((v, i) => [v, i]))
  const slotX = (i: number) =>
    SLOT_PAD + (i * (VIEW_W - 2 * SLOT_PAD)) / (n - 1)

  const backward = cfg.edges.filter(
    ([u, v]) => slotOf.get(u)! > slotOf.get(v)!,
  ).length
  const solved = backward === 0

  function choosePreset(p: 'dag' | 'cyclic') {
    setPreset(p)
    setOrder(PRESETS[p].initial)
    setSelected(null)
  }

  function clickVertex(id: string) {
    if (selected === null) {
      setSelected(id)
      return
    }
    if (selected === id) {
      setSelected(null)
      return
    }
    const i = order.indexOf(selected)
    const j = order.indexOf(id)
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    setOrder(next)
    setSelected(null)
  }

  function shuffle() {
    const next = [...order]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    setOrder(next)
    setSelected(null)
  }

  function reset() {
    setOrder(cfg.initial)
    setSelected(null)
  }

  let note: string
  if (solved) {
    note =
      'Καμία ακμή προς τα πίσω — κάθε βέλος δείχνει δεξιά. Αυτή η σειρά είναι μια έγκυρη τοπολογική διάταξη. Δοκίμασε «Ανακάτεψε»: θα βρεις κι άλλες — ένα DAG έχει συνήθως πολλές.'
  } else if (!cfg.acyclic && backward === 1) {
    note =
      'Έμεινε 1 ακμή προς τα πίσω — και δεν πέφτει άλλο. Ο κύκλος B→C→D→B δεν χωράει σε μία γραμμή: όπου κι αν βάλεις τις B, C, D, ένα από τα τρία βέλη του κύκλου θα δείχνει πάντα αριστερά. Γι’ αυτό ένα γράφημα με κύκλο ΔΕΝ έχει τοπολογική διάταξη.'
  } else {
    note =
      selected === null
        ? 'Κάνε κλικ σε μια κορυφή για να τη διαλέξεις, μετά σε μια δεύτερη για να ανταλλάξουν θέσεις. Στόχος: όλες οι ακμές πράσινες.'
        : `Διάλεξες την ${selected}. Κάνε κλικ σε μια άλλη κορυφή για να ανταλλάξουν θέσεις — ή ξανά στην ${selected} για ακύρωση.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + preset toggle */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Τοπολογική διάταξη — βάλε κάθε βέλος να δείχνει δεξιά
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['dag', 'cyclic'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => choosePreset(p)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                preset === p
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {p === 'dag' ? 'DAG (άκυκλο)' : 'Γράφημα με κύκλο'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        <span className="font-semibold text-green-700">Πράσινο</span> = ακμή που
        δείχνει εμπρός · <span className="font-semibold text-red-700">κόκκινο</span>{' '}
        = ακμή που δείχνει πίσω.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="tob-fwd"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
            </marker>
            <marker
              id="tob-back"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
          </defs>

          {/*
            Edges as arcs — DESIGN-ARC carve-out, deliberately bypassing
            `routeEdge()` (Chunk B6, mirrors the WhyBFSFailsWeighted
            precedent from Chunk B2 and the DfsTreeBuilder back-edge arcs
            from Chunk B3). The arc IS the visual identity here: every
            edge bulges UP above the single row of slot-nodes, with the
            arc's apex height proportional to slot span (`26 + span * 30`).
            That bulge encodes direction visually — forward edges curve
            up-right (green), backward edges curve up-left (red), with
            the marker on the arc's far end making "this points right" or
            "this points left" readable at a glance.

            All nodes sit at y = SLOT_Y on a single row, so a straight
            segment between any two slots is collinear with every node
            in between — passing `routeEdge` the slot row would either
            return a straight line at y = topY (above the row, no
            collisions if we anchored at topY) which destroys the
            direction visual entirely, OR return a curve with smaller
            and direction-inconsistent bulge if we anchored at slot
            centers (since every non-endpoint slot sits ON the segment,
            the collider-mass tie-break degenerates).

            Keeping the hand-tuned arc preserves the pedagogy. Adoption
            rule from `plans/E_EDGE_ROUTING_AUDIT.md` § Adoption rules
            does not apply when the arc itself is the teaching surface.
          */}
          {cfg.edges.map(([u, v], idx) => {
            const p = slotOf.get(u)!
            const q = slotOf.get(v)!
            const xp = slotX(p)
            const xq = slotX(q)
            const topY = SLOT_Y - R - 3
            const span = Math.abs(p - q)
            const ctrlY = topY - (26 + span * 30)
            const forward = p < q
            return (
              <path
                key={`e${idx}`}
                d={`M ${xp} ${topY} Q ${(xp + xq) / 2} ${ctrlY} ${xq} ${topY}`}
                fill="none"
                stroke={forward ? '#16a34a' : '#dc2626'}
                strokeWidth={forward ? 2.2 : 2.8}
                markerEnd={forward ? 'url(#tob-fwd)' : 'url(#tob-back)'}
              />
            )
          })}

          {/* slot baseline */}
          <line
            x1={slotX(0)}
            y1={SLOT_Y + R + 14}
            x2={slotX(n - 1)}
            y2={SLOT_Y + R + 14}
            stroke="#cdbfc0"
            strokeWidth={1.5}
          />

          {/* vertices */}
          {order.map((id, i) => {
            const x = slotX(i)
            const isSel = selected === id
            return (
              <g
                key={id}
                role="button"
                tabIndex={0}
                aria-label={`Κορυφή ${id}, θέση ${i + 1}`}
                onClick={() => clickVertex(id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    clickVertex(id)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {isSel && (
                  <circle
                    cx={x}
                    cy={SLOT_Y}
                    r={R + 6}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth={3}
                  />
                )}
                <circle
                  cx={x}
                  cy={SLOT_Y}
                  r={R}
                  fill={isSel ? '#fde68a' : '#ffffff'}
                  stroke={isSel ? '#d97706' : '#9f1239'}
                  strokeWidth={2.4}
                />
                <text
                  x={x}
                  y={SLOT_Y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  fontWeight={800}
                  fill="#1c1214"
                >
                  {id}
                </text>
                {/* slot index */}
                <text
                  x={x}
                  y={SLOT_Y + R + 27}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="#9b8a8d"
                >
                  θέση {i + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* readout */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Ακμές προς τα πίσω
        </span>
        <span
          className={cn(
            'font-mono text-2xl font-bold tabular-nums',
            solved ? 'text-success' : 'text-danger',
          )}
        >
          {backward}
        </span>
        {solved && (
          <span className="ml-auto rounded-md bg-success/15 px-2 py-0.5 text-sm font-bold text-success">
            ✓ έγκυρη τοπολογική διάταξη
          </span>
        )}
        {!cfg.acyclic && backward === 1 && (
          <span className="ml-auto rounded-md bg-danger/15 px-2 py-0.5 text-sm font-bold text-danger">
            αδύνατο να φτάσει στο 0
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={shuffle}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Ανακάτεψε
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
      </div>
    </section>
  )
}
