'use client'

/**
 * MaxHeapKeyDecrease — pt6-th3 part (B-iv). The two scenarios from the prompt
 * driven through the sift-down algorithm step by step.
 *
 * The internal node held 14 with children 8 and 10. The viz visualises an
 * affected subtree of 7 positions:
 *
 *         (X)
 *        /   \
 *       8     10
 *            /  \
 *           7    9
 *               / \
 *              4   5
 *
 * Scenario A (14 → 13): the value drops to 13 but stays above both children
 * — the algorithm makes one comparison and exits with 0 swaps.
 * Scenario B (14 → 6): the value drops below the larger child at every level
 * until the leaves — 2 swaps along the path X → P_R → P_RR before stopping
 * because 6 ≥ max(4, 5) = 5.
 *
 * Lands the headline of part B: in the worst case the sift travels from the
 * altered node to a leaf, exactly Θ(log n) comparisons. Built for L10 (Phase D).
 */

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type Pos = 'P_root' | 'P_L' | 'P_R' | 'P_RL' | 'P_RR' | 'P_RRL' | 'P_RRR'

const COORDS: Record<Pos, { x: number; y: number }> = {
  P_root: { x: 300, y: 60 },
  P_L: { x: 170, y: 150 },
  P_R: { x: 430, y: 150 },
  P_RL: { x: 360, y: 240 },
  P_RR: { x: 500, y: 240 },
  P_RRL: { x: 450, y: 330 },
  P_RRR: { x: 550, y: 330 },
}

const EDGES: [Pos, Pos][] = [
  ['P_root', 'P_L'],
  ['P_root', 'P_R'],
  ['P_R', 'P_RL'],
  ['P_R', 'P_RR'],
  ['P_RR', 'P_RRL'],
  ['P_RR', 'P_RRR'],
]

const NODE_R = 22

const NODE_RECTS: NodeRect[] = []
const NODE_RECT_BY_ID = new Map<Pos, NodeRect>()
for (const pos of Object.keys(COORDS) as Pos[]) {
  const c = COORDS[pos]
  const r: NodeRect = {
    id: pos,
    x: c.x - NODE_R,
    y: c.y - NODE_R,
    w: 2 * NODE_R,
    h: 2 * NODE_R,
  }
  NODE_RECTS.push(r)
  NODE_RECT_BY_ID.set(pos, r)
}

/** Routed parent→child edge, center-to-center (heap tree edges have no
 *  arrowhead, so no asymmetric trim). */
function routedEdge(from: Pos, to: Pos) {
  const a = NODE_RECT_BY_ID.get(from)!
  const b = NODE_RECT_BY_ID.get(to)!
  return routeEdge(a, b, NODE_RECTS)
}

const LEFT_CHILD: Partial<Record<Pos, Pos>> = {
  P_root: 'P_L',
  P_R: 'P_RL',
  P_RR: 'P_RRL',
}
const RIGHT_CHILD: Partial<Record<Pos, Pos>> = {
  P_root: 'P_R',
  P_R: 'P_RR',
  P_RR: 'P_RRR',
}

type Highlight = 'init' | 'compare' | 'swap' | 'done'

type Step = {
  values: Record<Pos, number>
  /** the node currently being processed by sift-down */
  current: Pos | null
  highlight: Highlight
  /** positions just swapped (for animation/coloring of the edge) */
  swap?: [Pos, Pos]
  swaps: number
  caption: string
}

const INIT: Record<Pos, number> = {
  P_root: 14,
  P_L: 8,
  P_R: 10,
  P_RL: 7,
  P_RR: 9,
  P_RRL: 4,
  P_RRR: 5,
}

const STEPS_A: Step[] = [
  {
    values: INIT,
    current: null,
    highlight: 'init',
    swaps: 0,
    caption:
      'Αρχική κατάσταση. Ο εσωτερικός κόμβος έχει τιμή 14 με παιδιά 8 και 10. Η ιδιότητα max-heap ισχύει: 14 ≥ 8 και 14 ≥ 10. (Οι υπόλοιπες θέσεις φαίνονται γιατί θα μπουν στο παιχνίδι στο σενάριο 14 → 6.)',
  },
  {
    values: { ...INIT, P_root: 13 },
    current: 'P_root',
    highlight: 'compare',
    swaps: 0,
    caption:
      'Η τιμή έγινε 13. Σύγκριση με το μεγαλύτερο παιδί: max(8, 10) = 10. Έχουμε 13 ≥ 10 ✓ — η ιδιότητα συνεχίζει να ισχύει.',
  },
  {
    values: { ...INIT, P_root: 13 },
    current: null,
    highlight: 'done',
    swaps: 0,
    caption:
      'Τέλος. ΚΑΜΙΑ αντιμετάθεση — το RA σταματά αμέσως. Ο σωρός παραμένει έγκυρος.',
  },
]

const AFTER_1: Record<Pos, number> = { ...INIT, P_root: 10, P_R: 6 }
const AFTER_2: Record<Pos, number> = { ...AFTER_1, P_R: 9, P_RR: 6 }

const STEPS_B: Step[] = [
  {
    values: INIT,
    current: null,
    highlight: 'init',
    swaps: 0,
    caption:
      'Αρχική κατάσταση: ο εσωτερικός κόμβος έχει 14, παιδιά 8 και 10. Η ιδιότητα ισχύει.',
  },
  {
    values: { ...INIT, P_root: 6 },
    current: 'P_root',
    highlight: 'compare',
    swaps: 0,
    caption:
      'Η τιμή έγινε 6. Σύγκριση: 6 vs max(8, 10) = 10. Έχουμε 6 ≥ 10; ΟΧΙ — η ιδιότητα παραβιάζεται.',
  },
  {
    values: AFTER_1,
    current: 'P_R',
    highlight: 'swap',
    swap: ['P_root', 'P_R'],
    swaps: 1,
    caption:
      'Αντιμετάθεση με το μεγαλύτερο παιδί. Το 10 ανεβαίνει στη ρίζα του υποδέντρου, το 6 κατεβαίνει στη θέση του 10. Η αναδρομή συνεχίζει από εκεί.',
  },
  {
    values: AFTER_1,
    current: 'P_R',
    highlight: 'compare',
    swaps: 1,
    caption:
      'Σύγκριση: 6 vs max(7, 9) = 9. Έχουμε 6 ≥ 9; ΟΧΙ — και πάλι παραβίαση.',
  },
  {
    values: AFTER_2,
    current: 'P_RR',
    highlight: 'swap',
    swap: ['P_R', 'P_RR'],
    swaps: 2,
    caption:
      'Δεύτερη αντιμετάθεση: το 9 ανεβαίνει, το 6 ξανακατεβαίνει — τώρα στη θέση του 9.',
  },
  {
    values: AFTER_2,
    current: 'P_RR',
    highlight: 'compare',
    swaps: 2,
    caption:
      'Σύγκριση: 6 vs max(4, 5) = 5. Έχουμε 6 ≥ 5 ✓ — η ιδιότητα επανήλθε.',
  },
  {
    values: AFTER_2,
    current: null,
    highlight: 'done',
    swaps: 2,
    caption:
      'Τέλος. 2 αντιμεταθέσεις, μονοπάτι μήκους 2 από την αρχική θέση μέχρι ένα φύλλο. Στη χείριστη περίπτωση η βύθιση φτάνει σε φύλλο — γι\' αυτό S(n) = Θ(log n).',
  },
]

type Scenario = 'A' | 'B'

function nodeFill(pos: Pos, step: Step) {
  // current sift target: deep red
  if (step.current === pos) return '#dc2626'
  // children of the current target during a compare: highlighted blue
  if (step.current && step.highlight === 'compare') {
    if (LEFT_CHILD[step.current] === pos || RIGHT_CHILD[step.current] === pos) return '#3b82f6'
  }
  // freshly-swapped partner (the one that received the higher value)
  if (step.swap) {
    if (step.swap[0] === pos || step.swap[1] === pos) {
      if (pos === step.swap[0]) return '#16a34a' // the higher value moved up here
    }
  }
  return '#f5f3f4'
}

function nodeStroke(pos: Pos, step: Step) {
  if (step.current === pos) return '#7f1d1d'
  if (step.current && step.highlight === 'compare') {
    if (LEFT_CHILD[step.current] === pos || RIGHT_CHILD[step.current] === pos) return '#1d4ed8'
  }
  if (step.swap && (step.swap[0] === pos || step.swap[1] === pos)) return '#15803d'
  return '#9b8a8d'
}

function nodeTextFill(pos: Pos, step: Step) {
  if (step.current === pos) return '#ffffff'
  if (step.current && step.highlight === 'compare') {
    if (LEFT_CHILD[step.current] === pos || RIGHT_CHILD[step.current] === pos) return '#ffffff'
  }
  if (step.swap && step.swap[0] === pos) return '#ffffff'
  return '#1c1214'
}

export function MaxHeapKeyDecrease() {
  const [scenario, setScenario] = useState<Scenario>('B')
  const [stepIdx, setStepIdx] = useState(0)

  const steps = scenario === 'A' ? STEPS_A : STEPS_B
  const step = steps[Math.min(stepIdx, steps.length - 1)]
  const lastIdx = steps.length - 1

  const switchScenario = (s: Scenario) => {
    setScenario(s)
    setStepIdx(0)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Επιδιόρθωση max-σωρού μετά από μείωση κλειδιού — RA(H, i)
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-md bg-bg-soft p-0.5">
          <button
            type="button"
            onClick={() => switchScenario('A')}
            className={cn(
              'rounded px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors',
              scenario === 'A'
                ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/25 dark:text-amber-200'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            14 → 13
          </button>
          <button
            type="button"
            onClick={() => switchScenario('B')}
            className={cn(
              'rounded px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors',
              scenario === 'B'
                ? 'bg-rose-500/15 text-rose-700 dark:bg-rose-500/25 dark:text-rose-200'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            14 → 6
          </button>
        </div>
      </div>

      {/* SVG tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 600 380"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {EDGES.map(([from, to], k) => {
            const swapped =
              step.swap &&
              ((step.swap[0] === from && step.swap[1] === to) ||
                (step.swap[0] === to && step.swap[1] === from))
            const stroke = swapped ? '#15803d' : '#c9bcbe'
            const strokeWidth = swapped ? 3.5 : 1.8
            const g = routedEdge(from, to)
            return g.kind === 'line' ? (
              <line
                key={k}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={swapped ? '0' : undefined}
              />
            ) : (
              <path
                key={k}
                d={g.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={swapped ? '0' : undefined}
              />
            )
          })}
          {/* root indicator: parent ellipsis */}
          <text
            x={COORDS.P_root.x}
            y={COORDS.P_root.y - 38}
            textAnchor="middle"
            fontSize={11}
            fontStyle="italic"
            fill="#9b8a8d"
          >
            … (υπόλοιπος σωρός)
          </text>
          <line
            x1={COORDS.P_root.x}
            y1={COORDS.P_root.y - 32}
            x2={COORDS.P_root.x}
            y2={COORDS.P_root.y - 23}
            stroke="#c9bcbe"
            strokeDasharray="2,3"
            strokeWidth={1.5}
          />
          {/* nodes */}
          {(Object.keys(COORDS) as Pos[]).map((pos) => {
            const v = step.values[pos]
            const c = COORDS[pos]
            return (
              <g key={pos}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={22}
                  fill={nodeFill(pos, step)}
                  stroke={nodeStroke(pos, step)}
                  strokeWidth={2.6}
                />
                <text
                  x={c.x}
                  y={c.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill={nodeTextFill(pos, step)}
                >
                  {v}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Status row */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-bg-soft/40 px-3 py-1.5 text-xs">
        <div className="font-semibold text-fg-subtle">
          Βήμα {stepIdx + 1} / {steps.length}
        </div>
        <div className="flex items-center gap-3">
          <span>
            <span className="text-fg-subtle">Αντιμεταθέσεις:</span>{' '}
            <span className="font-mono font-bold text-fg">{step.swaps}</span>
          </span>
          <span>
            <span className="text-fg-subtle">Φάση:</span>{' '}
            <span
              className={cn(
                'font-mono font-bold',
                step.highlight === 'init' && 'text-fg-muted',
                step.highlight === 'compare' && 'text-sky-600 dark:text-sky-300',
                step.highlight === 'swap' && 'text-success',
                step.highlight === 'done' &&
                  (step.swaps === 0
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-rose-700 dark:text-rose-300'),
              )}
            >
              {step.highlight === 'init' && 'αρχικό'}
              {step.highlight === 'compare' && 'σύγκριση'}
              {step.highlight === 'swap' && 'αντιμετάθεση'}
              {step.highlight === 'done' && 'τέλος'}
            </span>
          </span>
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[3.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg"
      >
        {step.caption}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
            disabled={stepIdx === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1 text-xs font-semibold text-fg hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Πίσω
          </button>
          <button
            type="button"
            onClick={() => setStepIdx((s) => Math.min(lastIdx, s + 1))}
            disabled={stepIdx === lastIdx}
            className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/15 disabled:opacity-40"
          >
            Επόμενο <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            className="ml-1 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-fg-muted hover:bg-bg-soft"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="text-[11px] text-fg-subtle">
          {scenario === 'A'
            ? 'Όταν το νέο κλειδί παραμένει ≥ από τα παιδιά, η σύγκριση κοστίζει O(1).'
            : 'Στη χείριστη περίπτωση: μονοπάτι από κόμβο σε φύλλο, μήκος ≤ ⌊log₂ n⌋.'}
        </div>
      </div>
    </section>
  )
}
