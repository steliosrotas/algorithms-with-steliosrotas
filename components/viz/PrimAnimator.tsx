'use client'

/**
 * PrimAnimator — Prim's algorithm building the MST one vertex at a time (L09).
 *
 * Prim grows a SINGLE tree. At every step the cut is "vertices already in the
 * tree" vs "vertices still outside"; the cut property guarantees the cheapest
 * edge crossing that line belongs to the MST, so Prim adds it and never looks
 * back. This viz makes that cut visible — green tree vs white outside, gold
 * dashed = the crossing edges Prim is choosing between — and shows the key
 * α[v] of every outside vertex: the cost of its cheapest SINGLE edge to the
 * tree, NOT a running distance from the start. That α-vs-d distinction is the
 * one thing students confuse between Prim and Dijkstra. Built for L09.
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
  MST_EDGE_BY_ID,
  edgeId,
  other,
  routeMstEdge,
  mstAdjacency,
} from './mst-graph'

const INF = Infinity
const START = 'A'

type Relax = { v: string; oldKey: number; newKey: number }
type PrimStep = {
  added: string
  edgeAdded: string | null
  treeNodes: Set<string>
  treeEdges: Set<string>
  keys: Record<string, number>
  relaxations: Relax[]
}

/** Run Prim once, recording one PrimStep per extract-min. */
function runPrim(): PrimStep[] {
  const key: Record<string, number> = {}
  const par: Record<string, string | null> = {}
  for (const n of MST_NODES) {
    key[n.id] = INF
    par[n.id] = null
  }
  key[START] = 0

  const adj = mstAdjacency()
  const inTree = new Set<string>()
  const treeEdges = new Set<string>()
  const steps: PrimStep[] = []

  while (inTree.size < MST_NODES.length) {
    let u: string | null = null
    for (const n of MST_NODES) {
      if (inTree.has(n.id)) continue
      if (u === null || key[n.id] < key[u]) u = n.id
    }
    if (u === null) break
    inTree.add(u)
    const edgeAdded = par[u] ? edgeId(u, par[u]!) : null
    if (edgeAdded) treeEdges.add(edgeAdded)

    const relaxations: Relax[] = []
    for (const e of adj.get(u)!) {
      const v = other(e, u)
      if (inTree.has(v)) continue
      if (e.w < key[v]) {
        relaxations.push({ v, oldKey: key[v], newKey: e.w })
        key[v] = e.w
        par[v] = u
      }
    }
    steps.push({
      added: u,
      edgeAdded,
      treeNodes: new Set(inTree),
      treeEdges: new Set(treeEdges),
      keys: { ...key },
      relaxations,
    })
  }
  return steps
}

const fmt = (d: number) => (d === INF ? '∞' : String(d))

export function PrimAnimator() {
  const steps = useMemo(() => runPrim(), [])
  const last = steps.length - 1
  const [step, setStep] = useState(0)
  const cur = steps[step]

  const treeNodes = cur.treeNodes
  const treeEdges = cur.treeEdges
  const outside = MST_NODES.filter((n) => !treeNodes.has(n.id))

  /** the vertex extract-min will grab next (smallest finite key outside) */
  const nextPick = useMemo(() => {
    let best: string | null = null
    for (const n of outside) {
      if (cur.keys[n.id] === INF) continue
      if (best === null || cur.keys[n.id] < cur.keys[best]) best = n.id
    }
    return best
  }, [outside, cur.keys])

  /** edges with exactly one endpoint inside the tree — the cut D(tree) */
  const crossing = useMemo(() => {
    const s = new Set<string>()
    for (const e of MST_EDGES) {
      const inA = treeNodes.has(e.a)
      const inB = treeNodes.has(e.b)
      if (inA !== inB) s.add(e.id)
    }
    return s
  }, [treeNodes])

  const note = useMemo(() => {
    if (step === 0) {
      const rs = cur.relaxations
        .slice()
        .sort((a, b) => a.newKey - b.newKey)
        .map((r) => `α[${r.v}]=${r.newKey}`)
        .join(', ')
      return `Ξεκινάμε από την κορυφή ${START}: μπαίνει μόνη της στο δέντρο. Κάθε γείτονάς της παίρνει κλειδί ίσο με το κόστος της ακμής που τη συνδέει με την ${START} — ${rs}. Οι υπόλοιπες μένουν με α = ∞.`
    }
    const e = cur.edgeAdded ? MST_EDGE_BY_ID.get(cur.edgeAdded) : null
    const before = [...treeNodes].filter((x) => x !== cur.added).sort()
    const head = e
      ? `Αποκοπή: το δέντρο {${before.join(', ')}} απέναντι στις υπόλοιπες. Η φθηνότερη ακμή που τη διασχίζει είναι η {${e.a}, ${e.b}} με κόστος ${e.w} — από την ιδιότητα αποκοπής ανήκει σίγουρα στο ΕΣΔ. Την προσθέτουμε μαζί με την κορυφή ${cur.added}.`
      : ''
    const relax =
      cur.relaxations.length === 0
        ? ' Κανένα κλειδί δεν μειώθηκε.'
        : ' Ενημερώνουμε κλειδιά: ' +
          cur.relaxations
            .map((r) => `α[${r.v}] ${fmt(r.oldKey)} → ${r.newKey}`)
            .join(', ') +
          '.'
    const tail =
      step === last
        ? ' Μπήκαν και οι 7 κορυφές — το ΕΣΔ ολοκληρώθηκε: 6 ακμές, συνολικό κόστος 23.'
        : ''
    return head + relax + tail
  }, [step, last, cur, treeNodes])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Prim βήμα-βήμα — ένα δέντρο που μεγαλώνει
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === last ? 'Ολοκληρώθηκε' : `Δέντρο: ${treeNodes.size}/7 κορυφές`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Πράσινο = στο δέντρο · χρυσό διακεκομμένο = ακμές που διασχίζουν την
        αποκοπή · παχιά πράσινη = μόλις προστέθηκε · α[v] = κόστος της φθηνότερης
        ακμής προς το δέντρο.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${MST_VIEW.w} ${MST_VIEW.h}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {MST_EDGES.map((e) => {
            const A = MST_POS.get(e.a)!
            const B = MST_POS.get(e.b)!
            const g = routeMstEdge(A, B)
            const isTree = treeEdges.has(e.id)
            const isAdded = e.id === cur.edgeAdded
            const isCross = crossing.has(e.id)
            const isNextEdge =
              isCross &&
              nextPick !== null &&
              (e.a === nextPick || e.b === nextPick) &&
              e.w === cur.keys[nextPick]
            let stroke = '#c9bcbe'
            let width = 1.8
            let dash: string | undefined
            if (isTree) {
              stroke = '#059669'
              width = isAdded ? 5.5 : 3.6
            } else if (isCross) {
              stroke = isNextEdge ? '#d97706' : '#e0b878'
              width = isNextEdge ? 3.4 : 2.2
              dash = '6 4'
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
                  stroke={isTree ? '#059669' : isNextEdge ? '#d97706' : '#cdbfc0'}
                  strokeWidth={isAdded || isNextEdge ? 2 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={isTree ? '#047857' : isNextEdge ? '#b45309' : '#5a4a4d'}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {MST_NODES.map((n) => {
            const inTree = treeNodes.has(n.id)
            const isAdded = n.id === cur.added && step > 0
            const isStart = n.id === START
            const isNext = n.id === nextPick
            const k = cur.keys[n.id]
            return (
              <g key={n.id}>
                {isNext && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={MST_NODE_R + 6}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    strokeDasharray="4 3"
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={MST_NODE_R}
                  fill={inTree ? '#d1fae5' : '#ffffff'}
                  stroke={
                    isAdded ? '#d97706' : inTree ? '#059669' : '#9b8a8d'
                  }
                  strokeWidth={isAdded ? 3.5 : 2.5}
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
                {/* key chip for outside vertices */}
                {!inTree && (
                  <>
                    <rect
                      x={n.x - 18}
                      y={n.y - MST_NODE_R - 18}
                      width={36}
                      height={17}
                      rx={4}
                      fill={isNext ? '#fef3c7' : '#faf4ee'}
                      stroke={isNext ? '#d97706' : '#cdbfc0'}
                    />
                    <text
                      x={n.x}
                      y={n.y - MST_NODE_R - 9}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10.5}
                      fontWeight={700}
                      fill="#1c1214"
                    >
                      α={fmt(k)}
                    </text>
                  </>
                )}
                {isStart && (
                  <text
                    x={n.x}
                    y={n.y + MST_NODE_R + 13}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill="#9b8a8d"
                  >
                    αφετηρία
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* priority queue strip */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Ουρά
        </span>
        {outside.length === 0 ? (
          <span className="text-xs text-fg-muted">άδεια — όλες μπήκαν</span>
        ) : (
          [...outside]
            .sort((a, b) => cur.keys[a.id] - cur.keys[b.id])
            .map((n) => {
              const isNext = n.id === nextPick
              return (
                <span
                  key={n.id}
                  className={cn(
                    'rounded border px-1.5 py-0.5 font-mono text-xs font-semibold',
                    isNext
                      ? 'border-amber-500 bg-amber-100 text-amber-900'
                      : 'border-border bg-bg-soft text-fg-muted',
                  )}
                >
                  {n.id}:{fmt(cur.keys[n.id])}
                </span>
              )
            })
        )}
        {nextPick && (
          <span className="ml-1 text-xs text-fg-subtle">
            → extract-min παίρνει την {nextPick}
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
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
