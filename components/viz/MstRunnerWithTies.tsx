'use client'

/**
 * MstRunnerWithTies — pt4-th2-a/b («Δίκτυο δρόμων με μη-μοναδικό ΕΕΔ»).
 *
 * 5-city graph A–B–C–D–E with the cost assignment from (α):
 *   A-B = A-C = B-C = 1   (the triangle of ties)
 *   A-E = 2, B-D = 3, B-E = 4, C-D = 5, D-E = 6
 *
 * Three tabs walk Kruskal under three different tie-break orderings of the
 * weight-1 edges. All three produce a valid MST with cost 1+1+2+3 = 7, but
 * the tree itself differs — the «non-unique MST» observation made operational.
 *
 *   Σειρά 1: A-B → A-C → (B-C rejects) → A-E → B-D
 *   Σειρά 2: A-B → B-C → (A-C rejects) → A-E → B-D
 *   Σειρά 3: B-C → A-B → (A-C rejects) → A-E → B-D
 *
 * In each tab the 5th edge of the triangle is rejected exactly when it would
 * close the A-B-C cycle. The cost ledger and the running tree are shown live.
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type NodeId = 'A' | 'B' | 'C' | 'D' | 'E'

const NODES: Record<NodeId, { x: number; y: number }> = {
  A: { x: 110, y: 80 },
  B: { x: 330, y: 80 },
  C: { x: 220, y: 200 },
  D: { x: 440, y: 200 },
  E: { x: 110, y: 280 },
}
const R = 22

const NODE_RECTS: NodeRect[] = (Object.keys(NODES) as NodeId[]).map((id) => ({
  id,
  x: NODES[id].x - R,
  y: NODES[id].y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r]))

function routedEdge(aId: NodeId, bId: NodeId) {
  const aRect = NODE_RECT_BY_ID.get(aId)!
  const bRect = NODE_RECT_BY_ID.get(bId)!
  const ax = aRect.x + aRect.w / 2
  const ay = aRect.y + aRect.h / 2
  const bx = bRect.x + bRect.w / 2
  const by = bRect.y + bRect.h / 2
  const geom = trimEdgeGeom(routeEdge(aRect, bRect, NODE_RECTS), ax, ay, R, bx, by, R)
  const mx = geom.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * geom.cx) / 4
  const my = geom.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * geom.cy) / 4
  return { ...geom, mx, my }
}

type Edge = { id: string; a: NodeId; b: NodeId; w: number }

const EDGES: Edge[] = [
  { id: 'AB', a: 'A', b: 'B', w: 1 },
  { id: 'AC', a: 'A', b: 'C', w: 1 },
  { id: 'BC', a: 'B', b: 'C', w: 1 },
  { id: 'AE', a: 'A', b: 'E', w: 2 },
  { id: 'BD', a: 'B', b: 'D', w: 3 },
  { id: 'BE', a: 'B', b: 'E', w: 4 },
  { id: 'CD', a: 'C', b: 'D', w: 5 },
  { id: 'DE', a: 'D', b: 'E', w: 6 },
]

type Order = 'o1' | 'o2' | 'o3'

const ORDERINGS: Record<Order, { label: string; sequence: string[] }> = {
  o1: { label: 'Σειρά 1: A-B, A-C, B-C', sequence: ['AB', 'AC', 'BC', 'AE', 'BD'] },
  o2: { label: 'Σειρά 2: A-B, B-C, A-C', sequence: ['AB', 'BC', 'AC', 'AE', 'BD'] },
  o3: { label: 'Σειρά 3: B-C, A-B, A-C', sequence: ['BC', 'AB', 'AC', 'AE', 'BD'] },
}

type StepRecord = {
  edgeId: string
  accept: boolean
  acceptedSoFar: Set<string>
  reason: string
}

function simulate(seq: string[]): StepRecord[] {
  const parent = new Map<NodeId, NodeId>()
  ;(Object.keys(NODES) as NodeId[]).forEach((n) => parent.set(n, n))
  const find = (x: NodeId): NodeId => {
    let r = x
    while (parent.get(r) !== r) r = parent.get(r)!
    return r
  }
  const accepted = new Set<string>()
  const steps: StepRecord[] = []
  for (const eid of seq) {
    const e = EDGES.find((ed) => ed.id === eid)!
    const ra = find(e.a)
    const rb = find(e.b)
    if (ra !== rb) {
      accepted.add(eid)
      if (ra < rb) parent.set(rb, ra)
      else parent.set(ra, rb)
      steps.push({
        edgeId: eid,
        accept: true,
        acceptedSoFar: new Set(accepted),
        reason: `${e.a}-${e.b} (${e.w}): ενώνει διαφορετικά κομμάτια → προστίθεται.`,
      })
    } else {
      steps.push({
        edgeId: eid,
        accept: false,
        acceptedSoFar: new Set(accepted),
        reason: `${e.a}-${e.b} (${e.w}): θα έκλεινε τον κύκλο A-B-C → απορρίπτεται.`,
      })
    }
  }
  return steps
}

export function MstRunnerWithTies() {
  const [order, setOrder] = useState<Order>('o1')
  const [stepIdx, setStepIdx] = useState(0)

  const steps = simulate(ORDERINGS[order].sequence)
  const visibleSteps = steps.slice(0, stepIdx + 1)
  const lastStep = visibleSteps[visibleSteps.length - 1]
  const acceptedEdges = lastStep?.acceptedSoFar ?? new Set<string>()
  const currentEdge = lastStep?.edgeId
  const currentAccept = lastStep?.accept

  function setTab(o: Order) {
    setOrder(o)
    setStepIdx(0)
  }

  const totalCost = Array.from(acceptedEdges).reduce((sum, eid) => {
    const e = EDGES.find((ed) => ed.id === eid)
    return sum + (e?.w ?? 0)
  }, 0)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 text-sm font-semibold tracking-tight text-fg">
        Kruskal με ισοβαθμίες — τρεις σειρές, τρία διαφορετικά ΕΕΔ
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {(Object.keys(ORDERINGS) as Order[]).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setTab(o)}
            className={
              'rounded-md border px-3 py-1.5 text-xs transition ' +
              (order === o
                ? 'border-accent bg-accent text-white font-semibold'
                : 'border-border bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
            }
          >
            {ORDERINGS[o].label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="graph-canvas overflow-x-auto">
          <svg
            viewBox="0 0 540 340"
            className="mx-auto block w-full max-w-xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            {EDGES.map((e) => {
              const g = routedEdge(e.a, e.b)
              const isAccepted = acceptedEdges.has(e.id)
              const isCurrent = currentEdge === e.id
              const stroke = isAccepted
                ? '#16a34a'
                : isCurrent && !currentAccept
                  ? '#9f1239'
                  : '#bdb0b2'
              const sw = isAccepted ? 3.6 : isCurrent ? 3.4 : 2
              return (
                <g key={e.id}>
                  {g.kind === 'line' ? (
                    <line
                      x1={g.x1}
                      y1={g.y1}
                      x2={g.x2}
                      y2={g.y2}
                      stroke={stroke}
                      strokeWidth={sw}
                      strokeDasharray={isCurrent && !currentAccept ? '4 4' : undefined}
                    />
                  ) : (
                    <path
                      d={g.d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={sw}
                      strokeDasharray={isCurrent && !currentAccept ? '4 4' : undefined}
                    />
                  )}
                  <rect
                    x={g.mx - 12}
                    y={g.my - 11}
                    width={24}
                    height={20}
                    rx={4}
                    fill="#faf4ee"
                    stroke={stroke}
                  />
                  <text
                    x={g.mx}
                    y={g.my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={700}
                    fill="#1c1214"
                  >
                    {e.w}
                  </text>
                </g>
              )
            })}
            {(Object.keys(NODES) as NodeId[]).map((id) => (
              <g key={id}>
                <circle cx={NODES[id].x} cy={NODES[id].y} r={R} fill="#ffffff" stroke="#1c1214" strokeWidth={1.8} />
                <text x={NODES[id].x} y={NODES[id].y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill="#1c1214">
                  {id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Σάρωση κατά σειρά
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStepIdx(0)}
                className="rounded-md border border-border bg-bg-soft/40 px-2 py-1 text-[11px] text-fg-muted hover:bg-bg-soft"
              >
                ⟲
              </button>
              <button
                type="button"
                onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
                disabled={stepIdx === 0}
                className="rounded-md border border-border bg-bg-soft/40 px-2 py-1 text-[11px] text-fg-muted hover:bg-bg-soft disabled:opacity-40"
              >
                ‹
              </button>
              <span className="font-mono text-[11px] text-fg-subtle">
                {stepIdx + 1} / {steps.length}
              </span>
              <button
                type="button"
                onClick={() => setStepIdx((s) => Math.min(steps.length - 1, s + 1))}
                disabled={stepIdx === steps.length - 1}
                className="rounded-md border border-border bg-bg-soft/40 px-2 py-1 text-[11px] text-fg-muted hover:bg-bg-soft disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>

          <ol className="space-y-1.5 text-xs">
            {steps.map((s, i) => {
              const e = EDGES.find((ed) => ed.id === s.edgeId)!
              const past = i <= stepIdx
              return (
                <li
                  key={i}
                  className={
                    'flex items-start gap-2 rounded-md border px-2 py-1.5 transition ' +
                    (i === stepIdx
                      ? s.accept
                        ? 'border-success bg-success/10'
                        : 'border-danger bg-danger/10'
                      : past
                        ? 'border-border bg-bg-soft/40'
                        : 'border-border/40 bg-bg-soft/10 text-fg-subtle')
                  }
                >
                  <span className="font-mono font-semibold">{i + 1}.</span>
                  <span className="flex-1">
                    <span className="font-mono">
                      {e.a}-{e.b} ({e.w})
                    </span>{' '}
                    <span className={s.accept ? 'text-success' : 'text-danger'}>
                      {s.accept ? '✓ μπαίνει' : '✗ κύκλος'}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-[11px] leading-relaxed text-fg-muted">
            <div className="font-semibold text-fg">
              {lastStep?.reason ?? ''}
            </div>
            <div className="mt-1 font-mono">
              Κόστος ΕΕΔ μέχρι τώρα:{' '}
              <span className="text-fg">{totalCost}</span>
              {acceptedEdges.size === 4 && (
                <span className="ml-2 inline-block rounded bg-success/20 px-1.5 py-0.5 text-success">
                  ολοκληρώθηκε
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-fg-subtle">
        Πάτα τις τρεις καρτέλες για να αλλάξεις σειρά εξέτασης των ισόβαθμων ακμών —
        το τελικό ΕΕΔ αλλάζει σε καθεμία (ποια από τις A-B / A-C / B-C μπαίνουν),
        αλλά το συνολικό κόστος μένει σταθερά <span className="font-mono">7</span>.
        Αυτή ακριβώς η ελευθερία είναι η <em>μη-μοναδικότητα</em>.
      </p>
    </section>
  )
}
