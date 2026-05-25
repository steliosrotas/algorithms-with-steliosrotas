'use client'

/**
 * UnionBySizeRace — why "smaller under larger" matters (L10).
 *
 * Two forests, the SAME sequence of unions run on both. The top one is
 * naive: it always hangs the existing tree under the freshly-added node,
 * and degenerates into a chain — a Find from the bottom costs n−1 hops.
 * The bottom one uses union by size: the small tree always goes under the
 * big one, so the forest stays flat. The student watches the depth counter
 * for the naive run climb 1,2,3,4 while union by size refuses to grow — the
 * single most convincing argument for the rule. Built for L10.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { forestNodeRects, layoutForest, type ForestLayout } from './uf-layout'
import { routeEdge, trimEdgeGeom } from './edge-routing'

const ELEMS = ['1', '2', '3', '4', '5']
/** union(a, b): a is a fresh element, b lives in the growing tree */
const UNIONS: [string, string][] = [
  ['1', '2'],
  ['3', '1'],
  ['4', '1'],
  ['5', '1'],
]
const NODE_R = 15
const LAYOUT = { nodeGap: 46, levelGap: 44, padX: 22, padY: 20, treeGap: 0.22 }
const CX = 160

type RaceStep = {
  naive: Record<string, string>
  ubs: Record<string, string>
  newNaive: string | null
  newUbs: string | null
  note: string
}

function find(parent: Record<string, string>, x: string): string {
  let r = x
  while (parent[r] !== r) r = parent[r]
  return r
}

function buildSteps(): RaceStep[] {
  const naive: Record<string, string> = {}
  const ubs: Record<string, string> = {}
  const size: Record<string, number> = {}
  for (const e of ELEMS) {
    naive[e] = e
    ubs[e] = e
    size[e] = 1
  }

  const steps: RaceStep[] = [
    {
      naive: { ...naive },
      ubs: { ...ubs },
      newNaive: null,
      newUbs: null,
      note: 'Πέντε μεμονωμένα στοιχεία — και οι δύο πλευρές ξεκινούν ίδιες. Θα τρέξουμε ΤΗΝ ΙΔΙΑ ακολουθία ενώσεων· η μόνη διαφορά είναι ποιο δέντρο κρεμιέται κάτω από ποιο.',
    },
  ]

  UNIONS.forEach(([a, b], k) => {
    // naive: hang root(b)'s tree under root(a)
    const rbNaive = find(naive, b)
    naive[rbNaive] = find(naive, a)

    // union by size: hang the smaller root under the larger
    const ra = find(ubs, a)
    const rb = find(ubs, b)
    let big = ra
    let small = rb
    if (size[ra] < size[rb]) {
      big = rb
      small = ra
    }
    ubs[small] = big
    size[big] += size[small]

    const note =
      k === 0
        ? `Union(${a}, ${b}): δύο μεμονωμένα στοιχεία — εδώ οι δύο στρατηγικές συμφωνούν. Από την επόμενη ένωση χωρίζουν.`
        : `Union(${a}, ${b}): ενώνουμε το νέο, μοναχικό ${a} με το δέντρο που περιέχει το ${b}. Πάνω: το ΔΕΝΤΡΟ κρεμιέται κάτω από το ${a} — κάθε κορυφή του κατεβαίνει ένα επίπεδο. Κάτω: το μικρό ${a} κρεμιέται κάτω από τη ρίζα του δέντρου — κανείς δεν κατεβαίνει.`

    steps.push({
      naive: { ...naive },
      ubs: { ...ubs },
      newNaive: rbNaive,
      newUbs: small,
      note,
    })
  })
  return steps
}

/** deepest leaf → root path, for the worst-case Find */
function deepestPath(
  parent: Record<string, string>,
  layout: ForestLayout,
): Set<string> {
  let deepest = ELEMS[0]
  let best = -1
  for (const e of ELEMS) {
    const d = layout.depth.get(e) ?? 0
    if (d > best) {
      best = d
      deepest = e
    }
  }
  const path = new Set<string>([deepest])
  let c = deepest
  while (parent[c] !== c) {
    c = parent[c]
    path.add(c)
  }
  return path
}

type Side = {
  parent: Record<string, string>
  layout: ForestLayout
  newNode: string | null
  rootFill: string
  rootStroke: string
}

function Forest({
  side,
  oy,
  showWorst,
}: {
  side: Side
  oy: number
  showWorst: boolean
}) {
  const { parent, layout, newNode } = side
  const ox = CX - layout.width / 2
  const worst = showWorst ? deepestPath(parent, layout) : new Set<string>()
  const { rects: nodeRects, rectById: nodeRectById } = forestNodeRects(
    layout,
    NODE_R,
    ox,
    oy,
  )
  const routedEdge = (childId: string, parentId: string) => {
    const cR = nodeRectById.get(childId)!
    const pR = nodeRectById.get(parentId)!
    const cx = cR.x + cR.w / 2
    const cy = cR.y + cR.h / 2
    const px = pR.x + pR.w / 2
    const py = pR.y + pR.h / 2
    const geom = routeEdge(cR, pR, nodeRects)
    return trimEdgeGeom(geom, cx, cy, NODE_R, px, py, NODE_R + 6)
  }
  const at = (id: string) => {
    const r = nodeRectById.get(id)!
    return { x: r.x + r.w / 2, y: r.y + r.h / 2 }
  }
  return (
    <g>
      {ELEMS.filter((e) => parent[e] !== e).map((c) => {
        const g = routedEdge(c, parent[c])
        const isNew = c === newNode
        const onWorst = worst.has(c) && worst.has(parent[c])
        const stroke = onWorst ? '#9f1239' : isNew ? '#d97706' : '#6b5d5f'
        const strokeWidth = onWorst || isNew ? 3.2 : 1.9
        return g.kind === 'line' ? (
          <line
            key={`e${c}`}
            x1={g.x1}
            y1={g.y1}
            x2={g.x2}
            y2={g.y2}
            stroke={stroke}
            strokeWidth={strokeWidth}
            markerEnd="url(#ubs-arrow)"
          />
        ) : (
          <path
            key={`e${c}`}
            d={g.d}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            markerEnd="url(#ubs-arrow)"
          />
        )
      })}
      {ELEMS.map((e) => {
        const p = at(e)
        const isRoot = parent[e] === e
        const isNew = e === newNode
        const onWorst = worst.has(e)
        return (
          <g key={`n${e}`}>
            {(isNew || onWorst) && (
              <circle
                cx={p.x}
                cy={p.y}
                r={NODE_R + 5}
                fill="none"
                stroke={onWorst ? '#9f1239' : '#d97706'}
                strokeWidth={2.3}
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={NODE_R}
              fill={isRoot ? side.rootFill : '#ffffff'}
              stroke={isRoot ? side.rootStroke : '#9b8a8d'}
              strokeWidth={2.4}
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13}
              fontWeight={700}
              fill="#1c1214"
            >
              {e}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function UnionBySizeRace() {
  const steps = useMemo(buildSteps, [])
  const last = steps.length - 1
  const [step, setStep] = useState(0)
  const cur = steps[step]

  const naiveLayout = useMemo(
    () => layoutForest(new Map(Object.entries(cur.naive)), LAYOUT),
    [cur],
  )
  const ubsLayout = useMemo(
    () => layoutForest(new Map(Object.entries(cur.ubs)), LAYOUT),
    [cur],
  )

  const dNaive = naiveLayout.maxDepth
  const dUbs = ubsLayout.maxDepth
  const atEnd = step === last

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Union by size — η ίδια ακολουθία, δύο στρατηγικές
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === 0 ? 'Αρχή' : `Ένωση ${step}/${last}`}
        </span>
      </div>

      {/* depth stat cards */}
      <div className="mb-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg border-2 border-[#dc2626]/40 bg-[#fef2f2] px-3 py-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#b91c1c]">
            Απλοϊκή ένωση
          </div>
          <div className="text-sm font-semibold text-[#7f1d1d]">
            βάθος:{' '}
            <span className="text-lg font-extrabold">{dNaive}</span> · χειρότερο
            Find {dNaive} {dNaive === 1 ? 'βήμα' : 'βήματα'}
          </div>
        </div>
        <div className="rounded-lg border-2 border-[#059669]/40 bg-[#ecfdf5] px-3 py-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#047857]">
            Union by size
          </div>
          <div className="text-sm font-semibold text-[#065f46]">
            βάθος:{' '}
            <span className="text-lg font-extrabold">{dUbs}</span> · χειρότερο
            Find {dUbs} {dUbs === 1 ? 'βήμα' : 'βήματα'}
          </div>
        </div>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 320 354"
          className="mx-auto block w-full max-w-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="ubs-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b5d5f" />
            </marker>
          </defs>

          <text
            x={CX}
            y={14}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="#b91c1c"
          >
            Απλοϊκή ένωση — αγνοεί τα μεγέθη
          </text>
          <Forest
            side={{
              parent: cur.naive,
              layout: naiveLayout,
              newNode: cur.newNaive,
              rootFill: '#fecaca',
              rootStroke: '#dc2626',
            }}
            oy={20}
            showWorst={atEnd}
          />

          <line
            x1={16}
            y1={244}
            x2={304}
            y2={244}
            stroke="#cdbfc0"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />

          <text
            x={CX}
            y={262}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="#047857"
          >
            Union by size — μικρό κάτω από μεγάλο
          </text>
          <Forest
            side={{
              parent: cur.ubs,
              layout: ubsLayout,
              newNode: cur.newUbs,
              rootFill: '#bbf7d0',
              rootStroke: '#059669',
            }}
            oy={264}
            showWorst={atEnd}
          />
        </svg>
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {cur.note}
        {atEnd && (
          <>
            {' '}
            <strong className="text-fg">
              Η απλοϊκή ένωση εκφυλίστηκε σε αλυσίδα {dNaive} επιπέδων· το union
              by size κράτησε το δέντρο ρηχό. Γενικά εγγυάται βάθος ≤ log₂n —
              ποτέ αλυσίδα.
            </strong>
          </>
        )}
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
