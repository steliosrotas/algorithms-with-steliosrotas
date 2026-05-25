'use client'

/**
 * DijkstraHandTrace — step-by-step Dijkstra trace on a per-problem graph.
 *
 * Two instances:
 *   • 'pt2-th2-1' — 6-vertex undirected graph (Παλαιό Θέμα #2 · Θέμα 2.1),
 *     source a.
 *   • 'pt3-th1' — 5-vertex DIRECTED graph with a non-negative cycle
 *     (Παλαιό Θέμα #3 · Θέμα 1), source s.
 *
 * Prev/Next walk the graph + table side by side. The current vertex is ringed
 * gold; finalised vertices turn green. Each relaxation is annotated under the
 * table as «εξετάζω u (d=…); ακμή (u,v): d[u]+ℓ=… {<,=,≥} d[v] → …». Bottom
 * card shows running output d[] and π[] for every vertex.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type Vec = { x: number; y: number }

type Instance = {
  title: string
  source: string
  directed: boolean
  nodes: { id: string; pos: Vec }[]
  edges: { u: string; v: string; w: number; curve?: number }[]
  /** Visible vertex column order in the table. */
  cols: string[]
}

const INSTANCES: Record<string, Instance> = {
  'pt2-th2-1': {
    title: 'Παλαιό Θέμα #2 · 2.1 — μη κατευθυνόμενος, αφετηρία a',
    source: 'a',
    directed: false,
    nodes: [
      { id: 'a', pos: { x: 70, y: 160 } },
      { id: 'b', pos: { x: 230, y: 70 } },
      { id: 'c', pos: { x: 230, y: 250 } },
      { id: 'd', pos: { x: 380, y: 160 } },
      { id: 'e', pos: { x: 540, y: 70 } },
      { id: 'f', pos: { x: 540, y: 250 } },
    ],
    edges: [
      { u: 'a', v: 'b', w: 4 },
      { u: 'a', v: 'c', w: 5 },
      { u: 'a', v: 'd', w: 1 },
      { u: 'b', v: 'c', w: 2 },
      { u: 'b', v: 'd', w: 3 },
      { u: 'b', v: 'e', w: 1 },
      { u: 'd', v: 'e', w: 5 },
      { u: 'e', v: 'f', w: 2 },
    ],
    cols: ['a', 'b', 'c', 'd', 'e', 'f'],
  },
  'pt3-th1': {
    title: 'Παλαιό Θέμα #3 · Θέμα 1 — κατευθυνόμενος + μη-αρνητικός κύκλος',
    source: 's',
    directed: true,
    nodes: [
      { id: 's', pos: { x: 70, y: 160 } },
      { id: 'a', pos: { x: 220, y: 70 } },
      { id: 'b', pos: { x: 380, y: 70 } },
      { id: 'c', pos: { x: 380, y: 250 } },
      { id: 'd', pos: { x: 540, y: 70 } },
    ],
    edges: [
      { u: 's', v: 'a', w: 2 },
      { u: 'a', v: 'b', w: 3 },
      { u: 'b', v: 'c', w: 1 },
      { u: 'c', v: 'a', w: 4, curve: 60 },
      { u: 'b', v: 'd', w: 6 },
    ],
    cols: ['s', 'a', 'b', 'c', 'd'],
  },
}

type RelaxEvent = {
  from: string
  to: string
  oldVal: number
  newVal: number
  weight: number
  accepted: boolean
  edgeKey: string
}

type Step = {
  /** Vertex selected as the next finalised — null on init step. */
  selected: string | null
  finalisedAfter: Set<string>
  d: Map<string, number>
  pi: Map<string, string | null>
  relaxations: RelaxEvent[]
  caption: string
}

const INF = Infinity

function adjacency(inst: Instance): Map<string, { v: string; w: number; key: string }[]> {
  const adj = new Map<string, { v: string; w: number; key: string }[]>()
  for (const n of inst.nodes) adj.set(n.id, [])
  for (const e of inst.edges) {
    const key = `${e.u}-${e.v}`
    adj.get(e.u)!.push({ v: e.v, w: e.w, key })
    if (!inst.directed) {
      adj.get(e.v)!.push({ v: e.u, w: e.w, key })
    }
  }
  return adj
}

function runDijkstra(inst: Instance): Step[] {
  const adj = adjacency(inst)
  const d = new Map<string, number>()
  const pi = new Map<string, string | null>()
  for (const n of inst.nodes) {
    d.set(n.id, n.id === inst.source ? 0 : INF)
    pi.set(n.id, null)
  }

  const finalised = new Set<string>()
  const steps: Step[] = []

  steps.push({
    selected: null,
    finalisedAfter: new Set(finalised),
    d: new Map(d),
    pi: new Map(pi),
    relaxations: [],
    caption: `Αρχικά: d[${inst.source}] = 0, όλες οι άλλες ∞. Καμία κορυφή ακόμα οριστική.`,
  })

  while (finalised.size < inst.nodes.length) {
    // pick vertex with min d among non-finalised
    let pick: string | null = null
    let pickVal = INF
    for (const n of inst.nodes) {
      if (finalised.has(n.id)) continue
      const v = d.get(n.id)!
      if (v < pickVal) {
        pickVal = v
        pick = n.id
      }
    }
    if (pick === null || pickVal === INF) break // unreachable rest

    finalised.add(pick)
    const events: RelaxEvent[] = []
    for (const out of adj.get(pick)!) {
      if (finalised.has(out.v)) continue
      const cand = pickVal + out.w
      const old = d.get(out.v)!
      const accept = cand < old
      events.push({
        from: pick,
        to: out.v,
        oldVal: old,
        newVal: accept ? cand : old,
        weight: out.w,
        accepted: accept,
        edgeKey: out.key,
      })
      if (accept) {
        d.set(out.v, cand)
        pi.set(out.v, pick)
      }
    }

    steps.push({
      selected: pick,
      finalisedAfter: new Set(finalised),
      d: new Map(d),
      pi: new Map(pi),
      relaxations: events,
      caption: `Εξάγω ${pick} (d=${pickVal}). Οριστικοποιείται. ${
        events.length === 0
          ? 'Καμία εξερχόμενη ακμή προς μη-οριστική κορυφή.'
          : 'Χαλαρώνω τις εξερχόμενες ακμές της.'
      }`,
    })
  }
  return steps
}

const R = 21

function fmt(v: number): string {
  return v === INF ? '∞' : String(v)
}

export function DijkstraHandTrace({ instance }: { instance: keyof typeof INSTANCES }) {
  const inst = INSTANCES[instance]
  const steps = useMemo(() => runDijkstra(inst), [inst])
  const [stepIdx, setStepIdx] = useState(0)
  const step = steps[stepIdx]

  const W = instance === 'pt2-th2-1' ? 620 : 620
  const H = 320

  const activeEdges = new Set<string>(step.relaxations.map((r) => r.edgeKey))
  const acceptedEdges = new Set<string>(
    step.relaxations.filter((r) => r.accepted).map((r) => r.edgeKey),
  )

  /**
   * Per-instance node rects + routedEdge closure (the two instances have
   * different node sets, so this is `useMemo`-keyed on `inst`). Mirrors B4's
   * ConstantShiftFail per-preset rect pattern and B6's DagSourceWalk per-preset
   * useMemo pattern.
   *
   * Hybrid carve-out: edges with `e.curve !== undefined` keep their hand-tuned
   * Bezier path because the arc IS a deliberate visual signal — the `c→a`
   * cycle edge of `pt3-th1` must bulge BELOW the row (curve=60) to disambiguate
   * the back-edge of the directed cycle from the forward `a→b→c` chain.
   * Routing it would either flatten it onto the straight chord (destroying the
   * cycle's geometric identity) or curve it the wrong way. Joins the carve-out
   * collection: WhyBFSFailsWeighted s-t (B2), DfsTreeBuilder back-edges (B3),
   * TopoOrderBuilder direction arcs (B6), NegativeCycleDetector a↔b + s→t (B6),
   * MstPreorderTSP tour overlay (B7.1 — separate pattern).
   */
  const routedStraight = useMemo(() => {
    const rects: NodeRect[] = inst.nodes.map((n) => ({
      id: n.id,
      x: n.pos.x - R,
      y: n.pos.y - R,
      w: 2 * R,
      h: 2 * R,
    }))
    const rectById = new Map(rects.map((r) => [r.id, r]))
    return (aId: string, bId: string) => {
      const aRect = rectById.get(aId)!
      const bRect = rectById.get(bId)!
      const ax = aRect.x + aRect.w / 2
      const ay = aRect.y + aRect.h / 2
      const bx = bRect.x + bRect.w / 2
      const by = bRect.y + bRect.h / 2
      const geom = trimEdgeGeom(routeEdge(aRect, bRect, rects), ax, ay, R, bx, by, R)
      const mx = geom.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * geom.cx) / 4
      const my = geom.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * geom.cy) / 4
      return { ...geom, mx, my }
    }
  }, [inst])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          {inst.title}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            className="rounded-md border border-border bg-bg-soft/40 p-1.5 text-fg-muted hover:bg-bg-soft"
            aria-label="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
            disabled={stepIdx === 0}
            className="rounded-md border border-border bg-bg-soft/40 p-1.5 text-fg-muted hover:bg-bg-soft disabled:opacity-40"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-fg-subtle">
            {stepIdx} / {steps.length - 1}
          </span>
          <button
            type="button"
            onClick={() => setStepIdx((s) => Math.min(steps.length - 1, s + 1))}
            disabled={stepIdx === steps.length - 1}
            className="rounded-md border border-border bg-bg-soft/40 p-1.5 text-fg-muted hover:bg-bg-soft disabled:opacity-40"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto block w-full max-w-3xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="dht-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id="dht-arr-hi"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
            </marker>
            <marker
              id="dht-arr-act"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
          </defs>

          {inst.edges.map((e) => {
            const key = `${e.u}-${e.v}`
            const active = activeEdges.has(key)
            const accepted = acceptedEdges.has(key)
            const stroke = accepted ? '#16a34a' : active ? '#9f1239' : '#bdb0b2'
            const strokeWidth = active ? 3.4 : 2
            const markerEnd = accepted
              ? 'url(#dht-arr-hi)'
              : active
                ? 'url(#dht-arr-act)'
                : inst.directed
                  ? 'url(#dht-arr)'
                  : undefined

            // Hand-tuned curve carve-out: edges with `e.curve` set keep their
            // bespoke Bezier (signals a directed back-edge like c→a in pt3-th1).
            if (e.curve !== undefined) {
              const a = inst.nodes.find((n) => n.id === e.u)!.pos
              const b = inst.nodes.find((n) => n.id === e.v)!.pos
              const mx = (a.x + b.x) / 2
              const my = (a.y + b.y) / 2 + e.curve
              const path = `M ${a.x + 18} ${a.y + 5} Q ${mx} ${my} ${b.x + 18} ${b.y + 5}`
              return (
                <g key={key}>
                  <path
                    d={path}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                  />
                  <rect x={mx - 12} y={my - 11} width={24} height={20} rx={4} fill="#faf4ee" stroke={stroke} />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#1c1214">
                    {e.w}
                  </text>
                </g>
              )
            }

            const g = routedStraight(e.u, e.v)
            return (
              <g key={key}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                  />
                )}
                <rect x={g.mx - 12} y={g.my - 11} width={24} height={20} rx={4} fill="#faf4ee" stroke={stroke} />
                <text x={g.mx} y={g.my} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#1c1214">
                  {e.w}
                </text>
              </g>
            )
          })}

          {inst.nodes.map((n) => {
            const isSelected = step.selected === n.id
            const isFinal = step.finalisedAfter.has(n.id)
            const isSource = n.id === inst.source
            const fill = isFinal ? '#dcfce7' : isSource ? '#fde2e4' : '#ffffff'
            const stroke = isSelected ? '#ca8a04' : isFinal ? '#16a34a' : '#9b8a8d'
            const strokeWidth = isSelected ? 4 : 2.4
            return (
              <g key={n.id}>
                <circle cx={n.pos.x} cy={n.pos.y} r={R} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                <text
                  x={n.pos.x}
                  y={n.pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
                <text
                  x={n.pos.x}
                  y={n.pos.y - R - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="#5b3a3c"
                >
                  d={fmt(step.d.get(n.id)!)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-bg-soft/30">
        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr className="border-b border-border bg-bg-soft/60 text-fg-muted">
              <th className="px-2 py-1.5 text-left font-semibold">Βήμα</th>
              {inst.cols.map((c) => (
                <th key={c} className="px-2 py-1.5 font-semibold font-mono">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.slice(0, stepIdx + 1).map((s, i) => (
              <tr key={i} className={i === stepIdx ? 'bg-accent/10' : ''}>
                <td className="px-2 py-1 text-left font-mono text-fg-muted">
                  {i === 0 ? 'αρχή' : `εξ. ${s.selected}`}
                </td>
                {inst.cols.map((c) => {
                  const final = s.finalisedAfter.has(c)
                  return (
                    <td
                      key={c}
                      className={'px-2 py-1 font-mono ' + (final ? 'font-bold text-success' : 'text-fg')}
                    >
                      {fmt(s.d.get(c)!)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-fg-muted">
        <div className="font-semibold text-fg">{step.caption}</div>
        {step.relaxations.length > 0 && (
          <ul className="mt-1 list-none space-y-0.5 font-mono">
            {step.relaxations.map((r, i) => (
              <li key={i}>
                {r.from} → {r.to}: d[{r.from}] + ℓ = {fmt(r.oldVal !== r.newVal ? r.newVal - r.weight : (step.d.get(r.from) ?? 0))} + {r.weight} ={' '}
                {(step.d.get(r.from) ?? 0) + r.weight} {r.accepted ? '< ' : '≥ '}
                {fmt(r.oldVal)}{' '}
                {r.accepted ? (
                  <span className="text-success">→ d[{r.to}] = {r.newVal}</span>
                ) : (
                  <span className="text-fg-subtle">→ καμία αλλαγή</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
