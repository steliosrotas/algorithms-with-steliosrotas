'use client'

/**
 * WhyTwoTreeValues — why a tree-DP node must keep TWO values, not one.
 *
 * The structural lesson behind A[v] / B[v] in L17's independent-set-on-a-tree.
 * A single "best of this subtree" number secretly hides whether the subtree's
 * own root was taken. The instant a parent wants to join the set it needs its
 * child OUT — and one stored number cannot promise that. The student flips
 * between keeping one value and keeping two (A[c] free, B[c] excluded), and
 * toggles the parent in/out: in one-value mode, putting the parent in produces
 * an ILLEGAL {p,c} set — an edge with both endpoints chosen; two values fix it.
 * Built for L17 on a minimal p–c–{g₁,g₂} tree.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type TN = { id: string; label: string; chi: number; x: number; y: number }
const P: TN = { id: 'p', label: 'p', chi: 5, x: 215, y: 54 }
const C: TN = { id: 'c', label: 'c', chi: 9, x: 215, y: 158 }
const G1: TN = { id: 'g1', label: 'g₁', chi: 1, x: 135, y: 262 }
const G2: TN = { id: 'g2', label: 'g₂', chi: 1, x: 295, y: 262 }
const NODES = [P, C, G1, G2]
const EDGES: [TN, TN][] = [
  [P, C],
  [C, G1],
  [C, G2],
]

/** A[c] = best independent set of c's subtree, c allowed → {c}, value 9. */
const A_C = 9
/** B[c] = best independent set of c's subtree WITHOUT c → {g₁,g₂}, value 2. */
const B_C = 2
const R = 27
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: R * 2,
  h: R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

/**
 * Collision-aware edge routing for this 4-node undirected tree. Center-to-
 * center (no trimming needed — tree edges have no arrowheads). Locks out the
 * «edge through unrelated node» class of bug structurally per Phase E.4.6.
 */
function routedEdge(a: TN, b: TN) {
  const rectA = NODE_RECT_BY_ID.get(a.id)!
  const rectB = NODE_RECT_BY_ID.get(b.id)!
  return routeEdge(rectA, rectB, NODE_RECTS)
}

export function WhyTwoTreeValues() {
  const [mode, setMode] = useState<'one' | 'two'>('one')
  const [pIn, setPIn] = useState(false)

  // resolve the chosen set + legality for the current (mode, pIn)
  let selected: Set<string>
  let legal: boolean
  if (!pIn) {
    selected = new Set(['c']) // p out → take the best of c's subtree, which is {c}
    legal = true
  } else if (mode === 'one') {
    selected = new Set(['p', 'c']) // χ(p) + stored "9" — and "9" secretly is {c}
    legal = false
  } else {
    selected = new Set(['p', 'g1', 'g2']) // χ(p) + B[c], i.e. {g₁,g₂}
    legal = true
  }
  const illegalPC = selected.has('p') && selected.has('c')

  const outValue = A_C // p out → A[c] = 9
  const inValueTwo = P.chi + B_C // p in (two values) → χ(p)+B[c] = 7
  const inValueBogus = P.chi + A_C // p in (one value) → 5+9 = 14, an illegal set

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γιατί χρειάζονται δύο τιμές ανά κορυφή
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            legal ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger',
          )}
        >
          {legal ? 'Νόμιμο σύνολο' : 'Παράνομο σύνολο'}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Ανεξάρτητο σύνολο = κανένα ζευγάρι γειτόνων μαζί. Ο αριθμός σε κάθε
        κορυφή είναι η προσφορά χ.
      </p>

      {/* two toggles */}
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2">
        <div>
          <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Πόσες τιμές κρατάμε ανά κορυφή;
          </div>
          <div className="flex gap-1 rounded-md border border-border p-0.5">
            {(
              [
                ['one', 'Μία τιμή'],
                ['two', 'Δύο τιμές'],
              ] as const
            ).map(([key, txt]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={cn(
                  'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                  mode === key
                    ? 'bg-accent text-accent-fg'
                    : 'text-fg-muted hover:bg-bg-soft',
                )}
              >
                {txt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Βάζουμε το p στο σύνολο;
          </div>
          <div className="flex gap-1 rounded-md border border-border p-0.5">
            {(
              [
                [false, 'p έξω'],
                [true, 'p μέσα'],
              ] as const
            ).map(([key, txt]) => (
              <button
                key={String(key)}
                type="button"
                onClick={() => setPIn(key)}
                className={cn(
                  'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                  pIn === key
                    ? 'bg-accent text-accent-fg'
                    : 'text-fg-muted hover:bg-bg-soft',
                )}
              >
                {txt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 430 312"
          className="mx-auto block w-full max-w-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {EDGES.map(([a, b]) => {
            const isPC =
              (a.id === 'p' && b.id === 'c') || (a.id === 'c' && b.id === 'p')
            const bad = isPC && illegalPC
            const g = routedEdge(a, b)
            const stroke = bad ? '#dc2626' : '#9b8a8d'
            const strokeWidth = bad ? 4.5 : 2
            const strokeDasharray = bad ? '7 5' : undefined
            return g.kind === 'line' ? (
              <line
                key={`${a.id}-${b.id}`}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
              />
            ) : (
              <path
                key={`${a.id}-${b.id}`}
                d={g.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
              />
            )
          })}
          {/* illegal-edge warning label */}
          {illegalPC && (
            <text
              x={C.x + 14}
              y={(P.y + C.y) / 2 + 4}
              fontSize={11}
              fontWeight={700}
              fill="#dc2626"
            >
              γειτονικά!
            </text>
          )}
          {/* nodes */}
          {NODES.map((n) => {
            const sel = selected.has(n.id)
            const conflict = illegalPC && (n.id === 'p' || n.id === 'c')
            const fill = conflict ? '#fee2e2' : sel ? '#dcfce7' : '#ffffff'
            const stroke = conflict ? '#dc2626' : sel ? '#16a34a' : '#9b8a8d'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={sel || conflict ? 3 : 2}
                />
                <text
                  x={n.x}
                  y={n.y - 5}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={800}
                  fill="#1c1214"
                >
                  {n.chi}
                </text>
                <text
                  x={n.x}
                  y={n.y + 13}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="#5a4a4d"
                >
                  {n.label}
                </text>
              </g>
            )
          })}
          {/* the value(s) stored at c */}
          <text
            x={C.x + R + 14}
            y={C.y - 4}
            fontSize={12.5}
            fontWeight={700}
            fontFamily="ui-monospace, monospace"
            fill="#9f1239"
          >
            {mode === 'one' ? `καλύτερο = ${A_C}` : `A[c] = ${A_C}`}
          </text>
          {mode === 'two' && (
            <text
              x={C.x + R + 14}
              y={C.y + 15}
              fontSize={12.5}
              fontWeight={700}
              fontFamily="ui-monospace, monospace"
              fill="#1d4ed8"
            >
              {`B[c] = ${B_C}`}
            </text>
          )}
        </svg>
      </div>

      {/* computation panel */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
        {!pIn ? (
          <p>
            <span className="font-semibold text-fg">Το p μένει έξω.</span> Δεν
            μπλοκάρει κανέναν — η καλύτερη απάντηση για το υποδέντρο του p είναι
            απλώς το καλύτερο σύνολο του υποδέντρου του c:{' '}
            <span className="font-mono font-bold text-fg">{outValue}</span>, που
            το πετυχαίνει το σύνολο {'{'}c{'}'}.
          </p>
        ) : mode === 'one' ? (
          <p>
            <span className="font-semibold text-fg">Βάζουμε το p μέσα.</span> Με
            μία μόνο αποθηκευμένη τιμή δοκιμάζουμε{' '}
            <span className="font-mono text-fg">
              χ(p) + (καλύτερο του c) = 5 + {A_C} ={' '}
            </span>
            <span className="font-mono font-bold text-danger line-through decoration-2">
              {inValueBogus}
            </span>
            . Όμως αυτό το «{A_C}» το πετυχαίνει το σύνολο {'{'}c{'}'} — κρύβει
            μέσα του το ίδιο το c. Το τελικό σύνολο γίνεται{' '}
            <span className="font-mono font-bold text-danger">
              {'{'}p, c{'}'}
            </span>{' '}
            — δύο κορυφές που συνδέονται με ακμή.{' '}
            <span className="font-semibold text-danger">
              Παράνομο: το {inValueBogus} δεν είναι έγκυρη απάντηση.
            </span>
          </p>
        ) : (
          <p>
            <span className="font-semibold text-fg">Βάζουμε το p μέσα.</span>{' '}
            Τότε το c <span className="font-semibold text-fg">πρέπει</span> να
            μείνει έξω — οπότε χρησιμοποιούμε το{' '}
            <span className="font-mono font-bold text-fg">B[c]</span> (το
            καλύτερο χωρίς το c), όχι το A[c]:{' '}
            <span className="font-mono text-fg">
              χ(p) + B[c] = 5 + {B_C} ={' '}
            </span>
            <span className="font-mono font-bold text-success">
              {inValueTwo}
            </span>
            . Το σύνολο {'{'}p, g₁, g₂{'}'} δεν έχει κανένα ζευγάρι γειτόνων.{' '}
            <span className="font-semibold text-success">Νόμιμο.</span>
          </p>
        )}
      </div>

      {/* two-value summary: A[p] = max of the two scenarios */}
      {mode === 'two' && (
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-center text-sm',
              !pIn
                ? 'border-accent/60 bg-accent/10'
                : 'border-border bg-bg-soft/40',
            )}
          >
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
              p έξω
            </div>
            <div className="font-mono font-bold text-fg">A[c] = {outValue}</div>
          </div>
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-center text-sm',
              pIn
                ? 'border-accent/60 bg-accent/10'
                : 'border-border bg-bg-soft/40',
            )}
          >
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
              p μέσα
            </div>
            <div className="font-mono font-bold text-fg">
              χ(p) + B[c] = {inValueTwo}
            </div>
          </div>
          <div className="rounded-lg border border-success/50 bg-success/10 px-3 py-2 text-center text-sm">
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
              A[p] = max
            </div>
            <div className="font-mono font-bold text-fg">
              max({outValue}, {inValueTwo}) = {Math.max(outValue, inValueTwo)}
            </div>
          </div>
        </div>
      )}

      {/* takeaway */}
      <div className="mt-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Το δίδαγμα:</span> ένα σκέτο
        «καλύτερο σύνολο του υποδέντρου» δεν λέει αν η ρίζα του είναι μέσα ή έξω
        — κι αυτό ακριβώς χρειάζεται ο γονιός για να αποφασίσει. Γι' αυτό κάθε
        κορυφή κρατά <span className="font-semibold text-fg">δύο</span> τιμές:{' '}
        <span className="font-mono font-bold text-fg">A[v]</span> (η v
        επιτρέπεται) και <span className="font-mono font-bold text-fg">B[v]</span>{' '}
        (η v σίγουρα έξω).
      </div>
    </section>
  )
}
