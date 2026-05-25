'use client'

/**
 * OddCycleProof — Case 2 of the bipartiteness theorem, made operable (L08).
 *
 * The proof: if BFS produces an edge (x, y) joining two vertices of the SAME
 * level Lⱼ, the graph has an odd cycle. Take z = lca(x, y) on level Lᵢ; the
 * tree paths z→x and z→y each have length j − i, and the edge (x, y) adds 1,
 * so the cycle has length 1 + 2(j − i) — always odd.
 *
 * This viz walks the construction step by step on a fixed BFS tree: mark the
 * bad edge, find z, trace each tree path, close the cycle, and watch the
 * length formula fill in to an odd number. A static diagram lets a student
 * memorise the picture; stepping through it lets them rebuild the proof.
 * Built for L08.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type PNode = { id: string; x: number; level: number }

const ROW_Y = (lvl: number) => 56 + lvl * 86

const NODES: PNode[] = [
  { id: 's', x: 210, level: 0 },
  { id: 'a', x: 130, level: 1 },
  { id: 'b', x: 290, level: 1 },
  { id: 'c', x: 80, level: 2 },
  { id: 'd', x: 170, level: 2 },
  { id: 'e', x: 256, level: 2 },
  { id: 'g', x: 340, level: 2 },
  { id: 'x', x: 80, level: 3 },
  { id: 'y', x: 170, level: 3 },
]
const NODE_R = 20
const NODE_RECTS: ReadonlyArray<NodeRect> = NODES.map((n) => ({
  id: n.id,
  x: n.x - NODE_R,
  y: ROW_Y(n.level) - NODE_R,
  w: NODE_R * 2,
  h: NODE_R * 2,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r] as const))

/**
 * Collision-aware edge routing on the level-banded BFS tree layout: returns
 * a straight segment (the steady-state case for every tree edge here) or a
 * quadratic Bezier that bends around an unrelated node. Center-to-center,
 * no border trim (this viz draws lines from centre to centre). Locks out
 * the «edge through unrelated node» class of bug structurally per Phase
 * E.4.6.
 */
function routedEdge(aId: string, bId: string) {
  const rectA = NODE_RECT_BY_ID.get(aId)!
  const rectB = NODE_RECT_BY_ID.get(bId)!
  return routeEdge(rectA, rectB, NODE_RECTS)
}

type PEdge = { id: string; a: string; b: string }
const TREE: PEdge[] = [
  { id: 'sa', a: 's', b: 'a' },
  { id: 'sb', a: 's', b: 'b' },
  { id: 'ac', a: 'a', b: 'c' },
  { id: 'ad', a: 'a', b: 'd' },
  { id: 'be', a: 'b', b: 'e' },
  { id: 'bg', a: 'b', b: 'g' },
  { id: 'cx', a: 'c', b: 'x' },
  { id: 'dy', a: 'd', b: 'y' },
]

const LAST = 6

/** edge ids highlighted as part of the cycle at a given step */
function cycleEdges(step: number): Set<string> {
  const s = new Set<string>()
  if (step >= 3) {
    s.add('ac')
    s.add('cx')
  }
  if (step >= 4) {
    s.add('ad')
    s.add('dy')
  }
  if (step >= 5) s.add('xy')
  return s
}

const NOTES: string[] = [
  'Αυτό είναι ένα BFS-δέντρο. Οι ακμές του δέντρου κατεβαίνουν πάντα ακριβώς ένα επίπεδο. Όμως η ακμή x–y ενώνει δύο κορυφές του ΙΔΙΟΥ επιπέδου — από αυτήν θα κατασκευάσουμε έναν περιττό κύκλο.',
  'Πρώτα τα άκρα της «κακής» ακμής: οι x και y βρίσκονται και οι δύο στο επίπεδο Lⱼ, εδώ με j = 3.',
  'z = lca(x, y) — ο χαμηλότερος κοινός πρόγονος: η κορυφή όπου τα δύο μονοπάτια από τη ρίζα προς τα x και y χωρίζουν. Εδώ z = a, στο επίπεδο Lᵢ με i = 1.',
  'Μονοπάτι μέσα στο δέντρο από το z στο x. Κάθε ακμή κατεβαίνει ένα επίπεδο, άρα το μήκος του είναι ακριβώς j − i = 3 − 1 = 2.',
  'Ομοίως, το μονοπάτι z → y μέσα στο δέντρο έχει κι αυτό μήκος j − i = 2.',
  'Η ακμή x–y, μήκους 1, κλείνει τον κύκλο: x → c → z → d → y → x.',
  'Συνολικό μήκος κύκλου = (j − i) + (j − i) + 1 = 2 + 2 + 1 = 5. ΠΕΡΙΤΤΟΣ! Βρήκαμε περιττό κύκλο — άρα το γράφημα δεν είναι διμερές.',
]

function FormulaRow({
  show,
  label,
  value,
  strong,
}: {
  show: boolean
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-opacity',
        show ? 'opacity-100' : 'opacity-30',
        strong
          ? 'bg-danger/10 font-bold text-danger'
          : 'bg-bg-soft/60 text-fg-muted',
      )}
    >
      <span>{label}</span>
      <span className="font-mono font-semibold">{show ? value : '—'}</span>
    </div>
  )
}

export function OddCycleProof() {
  const [step, setStep] = useState(0)
  const cyc = cycleEdges(step)

  const nodeKind = (id: string): 'z' | 'xy' | 'path' | 'plain' => {
    if (id === 'a' && step >= 2) return 'z'
    if ((id === 'x' || id === 'y') && step >= 1) return 'xy'
    if (id === 'c' && step >= 3) return 'path'
    if (id === 'd' && step >= 4) return 'path'
    return 'plain'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Κατασκευή περιττού κύκλου από ακμή ίδιου επιπέδου
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Βήμα {step}/{LAST}
        </span>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 420 372"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* level bands */}
          {[0, 1, 2, 3].map((lvl) => (
            <g key={lvl}>
              <rect
                x={16}
                y={ROW_Y(lvl) - 30}
                width={388}
                height={60}
                rx={8}
                fill="#9b8a8d"
                fillOpacity={0.05}
                stroke="#9b8a8d"
                strokeOpacity={0.3}
                strokeDasharray="5 4"
              />
              <text
                x={28}
                y={ROW_Y(lvl) - 13}
                fontSize={11}
                fontWeight={700}
                fill="#9b8a8d"
              >
                L{lvl}
                {lvl === 1 && step >= 2 ? '  (i = 1 — επίπεδο του z)' : ''}
                {lvl === 3 && step >= 1 ? '  (j = 3 — επίπεδο των x, y)' : ''}
              </text>
            </g>
          ))}

          {/* tree edges */}
          {TREE.map((e) => {
            const g = routedEdge(e.a, e.b)
            const on = cyc.has(e.id)
            const stroke = on ? '#d97706' : '#bdb0b2'
            const strokeWidth = on ? 4.5 : 2
            return g.kind === 'line' ? (
              <line
                key={e.id}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            ) : (
              <path
                key={e.id}
                d={g.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )
          })}

          {/* the same-level "bad" edge */}
          {(() => {
            const g = routedEdge('x', 'y')
            const stroke = step >= 5 ? '#d97706' : '#dc2626'
            const strokeWidth = step >= 5 ? 4.5 : 3.5
            const dash = step >= 5 ? undefined : '6 4'
            return g.kind === 'line' ? (
              <line
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={dash}
              />
            ) : (
              <path
                d={g.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={dash}
              />
            )
          })()}

          {/* nodes */}
          {NODES.map((n) => {
            const kind = nodeKind(n.id)
            const fill =
              kind === 'z'
                ? '#fda4af'
                : kind === 'xy'
                  ? '#bfdbfe'
                  : kind === 'path'
                    ? '#fcd34d'
                    : '#ffffff'
            const stroke =
              kind === 'z'
                ? '#e11d48'
                : kind === 'xy'
                  ? '#2563eb'
                  : kind === 'path'
                    ? '#d97706'
                    : '#9b8a8d'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={ROW_Y(n.level)}
                  r={20}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                />
                <text
                  x={n.x}
                  y={ROW_Y(n.level)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
                {kind === 'z' && (
                  <>
                    <circle
                      cx={n.x + 17}
                      cy={ROW_Y(n.level) - 17}
                      r={10}
                      fill="#e11d48"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                    <text
                      x={n.x + 17}
                      y={ROW_Y(n.level) - 17}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={700}
                      fill="#ffffff"
                    >
                      z
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* length formula */}
      <div className="mt-3 space-y-1">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Μήκος κύκλου
        </div>
        <FormulaRow show={step >= 3} label="μονοπάτι z → x" value="j − i = 2" />
        <FormulaRow show={step >= 4} label="μονοπάτι z → y" value="j − i = 2" />
        <FormulaRow show={step >= 5} label="ακμή x – y" value="1" />
        <FormulaRow
          show={step >= 6}
          label="Σύνολο = 2 + 2 + 1"
          value="5 — περιττό"
          strong
        />
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[4.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {NOTES[step]}
      </div>

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
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={step === LAST}
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
      </div>
    </section>
  )
}
