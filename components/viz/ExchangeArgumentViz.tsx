'use client'

/**
 * ExchangeArgumentViz — the exchange-argument proofs of the cut and cycle
 * properties, stepped through (L09).
 *
 * Both proofs have the same shape: assume an MST that contradicts the claim,
 * add/remove one edge, a cycle (or a cut) appears, the cut-cycle parity lemma
 * hands you a SECOND edge, you swap, and the cost does not get worse. Reading
 * that is hard; watching the swap happen — the cycle forming, the parity
 * count, the cost panel updating — makes it click. A mode toggle puts the two
 * properties side by side so the student sees they are mirror images of one
 * argument. Built for L09.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MST_NODES,
  MST_EDGES,
  MST_POS,
  MST_NODE_R,
  MST_VIEW,
  routeMstEdge,
} from './mst-graph'

type Mode = 'cut' | 'cycle'

type Costs = {
  star?: number
  ce?: number
  cf?: number
  cmp?: '≤' | '<'
  prime?: number
}

type Frame = {
  tag: string
  tree: string[] // edges drawn as the slate "tree T*"
  cycle: string[] // edges glowing orange as the cycle C
  e: string | null // green edge
  eDashed: boolean // green dashed = claimed but not yet in the tree
  f: string | null // red edge
  fRemoved: boolean // red dashed = identified but removed
  amber: string[] // edges spotlighted amber (the parity reveal)
  sky: string[] // nodes coloured sky (one side of the cut)
  parity: number | null
  costs: Costs
  note: string
}

const set = (a: string[]) => new Set(a)

/* ---- cut property: e = A-C (cheapest crossing edge of cut {C,F}) ---- */
const CUT_TREE_STAR = ['E-G', 'C-F', 'C-D', 'B-E', 'A-B', 'F-G']
const CUT_TREE_PRIME = ['E-G', 'C-F', 'C-D', 'B-E', 'A-B', 'A-C']
const CUT_CYCLE = ['A-C', 'A-B', 'B-E', 'E-G', 'F-G', 'C-F']
const CUT_SKY = ['C', 'F']

const CUT_FRAMES: Frame[] = [
  {
    tag: 'Υπόθεση για άτοπο',
    tree: CUT_TREE_STAR,
    cycle: [],
    e: 'A-C',
    eDashed: true,
    f: null,
    fRemoved: false,
    amber: [],
    sky: CUT_SKY,
    parity: null,
    costs: {},
    note: 'Ιδιότητα αποκοπής: η ελάχιστη ακμή κάθε αποκοπής ανήκει σε κάποιο ΕΣΔ. Πάρε την αποκοπή A = {C, F}· η φθηνότερη ακμή που τη διασχίζει είναι η e = A-C (κόστος 3). Έστω, για άτοπο, ένα ΕΣΔ T* (γκρι) που ΔΕΝ περιέχει την e.',
  },
  {
    tag: 'Πρόσθεσε την e',
    tree: CUT_TREE_STAR,
    cycle: CUT_CYCLE,
    e: 'A-C',
    eDashed: false,
    f: null,
    fRemoved: false,
    amber: [],
    sky: CUT_SKY,
    parity: null,
    costs: {},
    note: 'Πρόσθεσε την e στο T*. Δέντρο + μία ακμή → σχηματίζεται ακριβώς ΕΝΑΣ κύκλος (πορτοκαλί). Εδώ ο κύκλος είναι όλο το εξωτερικό εξάγωνο A-C-F-G-E-B-A.',
  },
  {
    tag: 'Λήμμα κύκλου-αποκοπής',
    tree: CUT_TREE_STAR,
    cycle: CUT_CYCLE,
    e: 'A-C',
    eDashed: false,
    f: null,
    fRemoved: false,
    amber: ['F-G'],
    sky: CUT_SKY,
    parity: 2,
    costs: {},
    note: 'Η e ανήκει στον κύκλο ΚΑΙ διασχίζει την αποκοπή. Το λήμμα κύκλου-αποκοπής λέει: κάθε κύκλος διασχίζει κάθε αποκοπή άρτιο πλήθος φορών. Μέτρα τις ακμές του κύκλου που διασχίζουν το {C, F}: είναι 2.',
  },
  {
    tag: 'Η δεύτερη ακμή f',
    tree: CUT_TREE_STAR,
    cycle: CUT_CYCLE,
    e: 'A-C',
    eDashed: false,
    f: 'F-G',
    fRemoved: false,
    amber: [],
    sky: CUT_SKY,
    parity: 2,
    costs: {},
    note: 'Άρα, εκτός από την e, υπάρχει στον κύκλο και άλλη ακμή αποκοπής: η f = F-G (κόστος 12), με f ≠ e. Και οι δύο διασχίζουν το {C, F}.',
  },
  {
    tag: 'Ανταλλαγή',
    tree: CUT_TREE_PRIME,
    cycle: [],
    e: 'A-C',
    eDashed: false,
    f: 'F-G',
    fRemoved: true,
    amber: [],
    sky: CUT_SKY,
    parity: null,
    costs: { star: 32 },
    note: 'Αντάλλαξε: T′ = T* + e − f. Αφαιρώντας μια ακμή του κύκλου, τα πάντα μένουν συνδεδεμένα — το T′ είναι κι αυτό συνδετικό δέντρο, και τώρα περιέχει την e.',
  },
  {
    tag: 'Σύγκριση κόστους',
    tree: CUT_TREE_PRIME,
    cycle: [],
    e: 'A-C',
    eDashed: false,
    f: 'F-G',
    fRemoved: true,
    amber: [],
    sky: CUT_SKY,
    parity: null,
    costs: { star: 32, ce: 3, cf: 12, cmp: '≤', prime: 23 },
    note: 'Η e είναι η ΕΛΑΧΙΣΤΗ ακμή της αποκοπής και η f είναι κι αυτή ακμή αποκοπής → c_e ≤ c_f. Άρα cost(T′) ≤ cost(T*): βρήκαμε ΕΣΔ που περιέχει την e. ∎',
  },
]

/* ---- cycle property: f = A-D (max edge of the cycle A-C-D) ---- */
const CYC_TREE_STAR = ['E-G', 'C-F', 'A-C', 'B-E', 'A-B', 'A-D']
const CYC_TREE_NOF = ['E-G', 'C-F', 'A-C', 'B-E', 'A-B']
const CYC_TREE_PRIME = ['E-G', 'C-F', 'A-C', 'B-E', 'A-B', 'C-D']
const CYC_CYCLE = ['A-C', 'C-D', 'A-D']
const CYC_SKY = ['D']

const CYCLE_FRAMES: Frame[] = [
  {
    tag: 'Υπόθεση για άτοπο',
    tree: CYC_TREE_STAR,
    cycle: CYC_CYCLE,
    e: null,
    eDashed: false,
    f: 'A-D',
    fRemoved: false,
    amber: [],
    sky: [],
    parity: null,
    costs: {},
    note: 'Ιδιότητα κύκλου: η μέγιστη ακμή κάθε κύκλου δεν ανήκει σε κανένα ΕΣΔ. Πάρε τον κύκλο A-C-D· η ακριβότερη ακμή του είναι η f = A-D (κόστος 5). Έστω, για άτοπο, ένα ΕΣΔ T* που ΠΕΡΙΕΧΕΙ την f.',
  },
  {
    tag: 'Αφαίρεσε την f',
    tree: CYC_TREE_NOF,
    cycle: CYC_CYCLE,
    e: null,
    eDashed: false,
    f: 'A-D',
    fRemoved: true,
    amber: [],
    sky: CYC_SKY,
    parity: null,
    costs: {},
    note: 'Αφαίρεσε την f από το T*. Το δέντρο σπάει σε ΔΥΟ κομμάτια: η κορυφή D μόνη της (γαλάζιο) απέναντι σε όλες τις υπόλοιπες. Αυτός ο χωρισμός είναι μια αποκοπή.',
  },
  {
    tag: 'Λήμμα κύκλου-αποκοπής',
    tree: CYC_TREE_NOF,
    cycle: CYC_CYCLE,
    e: null,
    eDashed: false,
    f: 'A-D',
    fRemoved: true,
    amber: ['C-D'],
    sky: CYC_SKY,
    parity: 2,
    costs: {},
    note: 'Η f ανήκει στον κύκλο ΚΑΙ διασχίζει αυτή την αποκοπή. Το λήμμα: ο κύκλος διασχίζει την αποκοπή άρτιο πλήθος φορών — εδώ 2.',
  },
  {
    tag: 'Η δεύτερη ακμή e',
    tree: CYC_TREE_NOF,
    cycle: CYC_CYCLE,
    e: 'C-D',
    eDashed: false,
    f: 'A-D',
    fRemoved: true,
    amber: [],
    sky: CYC_SKY,
    parity: 2,
    costs: {},
    note: 'Άρα υπάρχει στον κύκλο και άλλη ακμή αποκοπής: η e = C-D (κόστος 4), με e ≠ f. Η e ξαναενώνει τα δύο κομμάτια.',
  },
  {
    tag: 'Ανταλλαγή',
    tree: CYC_TREE_PRIME,
    cycle: [],
    e: 'C-D',
    eDashed: false,
    f: 'A-D',
    fRemoved: true,
    amber: [],
    sky: CYC_SKY,
    parity: null,
    costs: { star: 24 },
    note: 'Αντάλλαξε: T′ = T* + e − f. Η e ξαναενώνει τα δύο κομμάτια → το T′ είναι κι αυτό συνδετικό δέντρο.',
  },
  {
    tag: 'Σύγκριση κόστους',
    tree: CYC_TREE_PRIME,
    cycle: [],
    e: 'C-D',
    eDashed: false,
    f: 'A-D',
    fRemoved: true,
    amber: [],
    sky: CYC_SKY,
    parity: null,
    costs: { star: 24, ce: 4, cf: 5, cmp: '<', prime: 23 },
    note: 'Η f είναι η ΜΕΓΙΣΤΗ ακμή του κύκλου → c_e < c_f. Άρα cost(T′) < cost(T*) — αλλά το T* υποτίθεται ελάχιστο. Άτοπο! Καμία ΕΣΔ δεν περιέχει τη μέγιστη ακμή του κύκλου. ∎',
  },
]

function CostPanel({ costs }: { costs: Costs }) {
  if (costs.star === undefined) return null
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between rounded-md bg-bg-soft/60 px-2.5 py-1.5 text-sm text-fg-muted">
        <span>κόστος του T*</span>
        <span className="font-mono font-semibold">{costs.star}</span>
      </div>
      {costs.ce !== undefined && (
        <div className="flex items-center justify-between rounded-md bg-bg-soft/60 px-2.5 py-1.5 text-sm text-fg-muted">
          <span>σύγκριση ακμών</span>
          <span className="font-mono font-semibold">
            c_e = {costs.ce} {costs.cmp} {costs.cf} = c_f
          </span>
        </div>
      )}
      {costs.prime !== undefined && (
        <div className="flex items-center justify-between rounded-md bg-success/10 px-2.5 py-1.5 text-sm font-bold text-success">
          <span>κόστος του T′ = T* − c_f + c_e</span>
          <span className="font-mono">
            {costs.prime} {costs.cmp} {costs.star}
          </span>
        </div>
      )}
    </div>
  )
}

export function ExchangeArgumentViz() {
  const [mode, setMode] = useState<Mode>('cut')
  const [step, setStep] = useState(0)
  const frames = mode === 'cut' ? CUT_FRAMES : CYCLE_FRAMES
  const last = frames.length - 1
  const f = frames[Math.min(step, last)]

  const treeSet = useMemo(() => set(f.tree), [f])
  const cycleSet = useMemo(() => set(f.cycle), [f])
  const amberSet = useMemo(() => set(f.amber), [f])
  const skySet = useMemo(() => set(f.sky), [f])

  function pickMode(m: Mode) {
    setMode(m)
    setStep(0)
  }

  const eW = f.e ? MST_EDGES.find((x) => x.id === f.e)?.w : null
  const fW = f.f ? MST_EDGES.find((x) => x.id === f.f)?.w : null

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + mode toggle */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Επιχείρημα ανταλλαγής — η απόδειξη βήμα-βήμα
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['cut', 'cycle'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => pickMode(m)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                mode === m
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {m === 'cut' ? 'Ιδιότητα αποκοπής' : 'Ιδιότητα κύκλου'}
            </button>
          ))}
        </div>
      </div>

      {/* phase + legend chips */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-accent/10 px-2 py-0.5 font-bold uppercase tracking-wider text-accent">
          {f.tag}
        </span>
        {f.e && (
          <span className="rounded border border-success/50 bg-success/10 px-1.5 py-0.5 font-mono font-semibold text-success">
            e = {f.e} ({eW})
          </span>
        )}
        {f.f && (
          <span className="rounded border border-danger/50 bg-danger/10 px-1.5 py-0.5 font-mono font-semibold text-danger">
            f = {f.f} ({fW})
          </span>
        )}
        {f.parity !== null && (
          <span className="rounded border border-amber-500/60 bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900">
            κύκλος ∩ αποκοπή = {f.parity} (άρτιο)
          </span>
        )}
      </div>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${MST_VIEW.w} ${MST_VIEW.h}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* cycle glow underlay */}
          {MST_EDGES.filter((e) => cycleSet.has(e.id)).map((e) => {
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
                strokeOpacity={0.4}
                strokeLinecap="round"
              />
            ) : (
              <path
                key={`glow-${e.id}`}
                d={g.d}
                fill="none"
                stroke="#fb923c"
                strokeWidth={13}
                strokeOpacity={0.4}
                strokeLinecap="round"
              />
            )
          })}

          {/* edges */}
          {MST_EDGES.map((e) => {
            const A = MST_POS.get(e.a)!
            const B = MST_POS.get(e.b)!
            const g = routeMstEdge(A, B)
            const isE = f.e === e.id
            const isF = f.f === e.id
            const isAmber = amberSet.has(e.id)
            const isTree = treeSet.has(e.id)
            let stroke = '#d4cccd'
            let width = 1.7
            let dash: string | undefined
            let labelStroke = '#cdbfc0'
            let labelText = '#5a4a4d'
            if (isE) {
              stroke = '#059669'
              width = 5.5
              dash = f.eDashed ? '7 5' : undefined
              labelStroke = '#059669'
              labelText = '#047857'
            } else if (isF) {
              stroke = '#dc2626'
              width = f.fRemoved ? 3 : 5.5
              dash = f.fRemoved ? '7 5' : undefined
              labelStroke = '#dc2626'
              labelText = '#b91c1c'
            } else if (isAmber) {
              stroke = '#d97706'
              width = 4.5
              labelStroke = '#d97706'
              labelText = '#b45309'
            } else if (isTree) {
              stroke = '#64748b'
              width = 3.4
              labelStroke = '#94a3b8'
              labelText = '#475569'
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
                    strokeDasharray={dash}
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width}
                    strokeDasharray={dash}
                    strokeLinecap="round"
                  />
                )}
                <rect
                  x={g.mx - 11}
                  y={g.my - 10}
                  width={22}
                  height={17}
                  rx={4}
                  fill="#faf4ee"
                  stroke={labelStroke}
                  strokeWidth={isE || isF || isAmber ? 2 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={labelText}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {MST_NODES.map((n) => {
            const inSky = skySet.has(n.id)
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={MST_NODE_R}
                  fill={inSky ? '#7dd3fc' : '#ffffff'}
                  stroke={inSky ? '#0284c7' : '#9b8a8d'}
                  strokeWidth={2.5}
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

      <CostPanel costs={f.costs} />

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {f.note}
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
          Βήμα {step} / {last}
        </span>
      </div>
    </section>
  )
}
