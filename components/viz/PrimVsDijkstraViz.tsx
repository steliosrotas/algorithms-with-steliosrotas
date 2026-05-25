'use client'

/**
 * PrimVsDijkstraViz — both algorithms, same graph, side by side (L09).
 *
 * "Prim and Dijkstra look almost identical" is the most common student trap
 * in this lecture. The Callout that says "the key is local vs cumulative"
 * doesn't fix the confusion — running them in lock-step does. On the shared
 * MST graph from a common start, they agree for a while, then diverge at
 * the moment one picks F (α=2, the cheap edge C-F) while the other picks D
 * (d=5, the cheap path A-D). They end at two DIFFERENT trees: Prim has
 * cost 23 (the MST), Dijkstra cost 24 (an SPT). And Prim's tree gives a
 * worse A→D path. The two answers are different on purpose — different
 * problems, different optima. Built for L09.
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
type Kind = 'prim' | 'dijkstra'

type AlgStep = {
  added: string
  edgeAdded: string | null
  treeNodes: Set<string>
  treeEdges: Set<string>
  keys: Record<string, number>
  parent: Record<string, string | null>
}

function runAlgo(kind: Kind): AlgStep[] {
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
  const steps: AlgStep[] = []

  while (inTree.size < MST_NODES.length) {
    let u: string | null = null
    for (const n of MST_NODES) {
      if (inTree.has(n.id)) continue
      if (
        u === null ||
        key[n.id] < key[u] ||
        (key[n.id] === key[u] && n.id < u)
      ) {
        u = n.id
      }
    }
    if (u === null) break
    inTree.add(u)
    const edgeAdded = par[u] ? edgeId(u, par[u]!) : null
    if (edgeAdded) treeEdges.add(edgeAdded)

    for (const e of adj.get(u)!) {
      const v = other(e, u)
      if (inTree.has(v)) continue
      const candidate = kind === 'prim' ? e.w : key[u] + e.w
      if (candidate < key[v]) {
        key[v] = candidate
        par[v] = u
      }
    }

    steps.push({
      added: u,
      edgeAdded,
      treeNodes: new Set(inTree),
      treeEdges: new Set(treeEdges),
      keys: { ...key },
      parent: { ...par },
    })
  }
  return steps
}

const PRIM_STEPS = runAlgo('prim')
const DIJK_STEPS = runAlgo('dijkstra')
const N_STEPS = Math.max(PRIM_STEPS.length, DIJK_STEPS.length)
const LAST = N_STEPS - 1

const fmt = (x: number) => (x === INF ? '∞' : String(x))

/** Trace the path between two nodes through the tree edges. */
function treePath(treeEdges: Set<string>, src: string, dst: string): string[] {
  const adj = new Map<string, string[]>()
  for (const n of MST_NODES) adj.set(n.id, [])
  for (const e of MST_EDGES) {
    if (!treeEdges.has(e.id)) continue
    adj.get(e.a)!.push(e.b)
    adj.get(e.b)!.push(e.a)
  }
  const prev = new Map<string, string | null>([[src, null]])
  const queue = [src]
  while (queue.length) {
    const u = queue.shift()!
    if (u === dst) break
    for (const v of adj.get(u)!) {
      if (!prev.has(v)) {
        prev.set(v, u)
        queue.push(v)
      }
    }
  }
  if (!prev.has(dst)) return []
  const path: string[] = []
  let c: string | null = dst
  while (c !== null) {
    path.push(c)
    c = prev.get(c) ?? null
  }
  return path.reverse()
}

function pathCost(treeEdges: Set<string>, src: string, dst: string): number {
  const p = treePath(treeEdges, src, dst)
  if (p.length < 2) return 0
  let c = 0
  for (let i = 1; i < p.length; i++) {
    const e = MST_EDGE_BY_ID.get(edgeId(p[i - 1], p[i]))
    if (e) c += e.w
  }
  return c
}

function Panel({
  step,
  kind,
  label,
  keySym,
  finalCost,
}: {
  step: AlgStep
  kind: Kind
  label: string
  keySym: string
  finalCost: number
}) {
  const treeNodes = step.treeNodes
  const treeEdges = step.treeEdges
  const outside = MST_NODES.filter((n) => !treeNodes.has(n.id))

  const accent = kind === 'prim' ? '#059669' : '#7c3aed'
  const accentBg = kind === 'prim' ? '#d1fae5' : '#ede9fe'
  const accentText = kind === 'prim' ? '#047857' : '#5b21b6'

  const cumCost = useMemo(() => {
    let c = 0
    for (const id of treeEdges) {
      const e = MST_EDGE_BY_ID.get(id)
      if (e) c += e.w
    }
    return c
  }, [treeEdges])

  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span
          className="rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: accentBg, color: accentText }}
        >
          {label}
        </span>
        <span className="font-mono text-[10px] text-fg-subtle">
          κλειδί = {kind === 'prim' ? 'φθηνή ακμή' : 'συνολικό κόστος'}
        </span>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${MST_VIEW.w} ${MST_VIEW.h}`}
          className="block w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {MST_EDGES.map((e) => {
            const A = MST_POS.get(e.a)!
            const B = MST_POS.get(e.b)!
            const g = routeMstEdge(A, B)
            const isTree = treeEdges.has(e.id)
            const isAdded = e.id === step.edgeAdded
            let stroke = '#d4cccd'
            let width = 1.5
            if (isTree) {
              stroke = accent
              width = isAdded ? 5 : 3.4
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
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width}
                    strokeLinecap="round"
                  />
                )}
                <rect
                  x={g.mx - 10}
                  y={g.my - 9}
                  width={20}
                  height={16}
                  rx={4}
                  fill="#faf4ee"
                  stroke={isTree ? accent : '#cdbfc0'}
                  strokeWidth={isAdded ? 2 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill={isTree ? accentText : '#5a4a4d'}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {MST_NODES.map((n) => {
            const inTree = treeNodes.has(n.id)
            const isAdded = n.id === step.added
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={MST_NODE_R}
                  fill={inTree ? accentBg : '#ffffff'}
                  stroke={isAdded ? '#d97706' : inTree ? accent : '#9b8a8d'}
                  strokeWidth={isAdded ? 3.5 : 2.5}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
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

      {/* PQ strip */}
      <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10.5px]">
        <span className="font-semibold uppercase tracking-wider text-fg-subtle">
          Ουρά
        </span>
        {outside.length === 0 ? (
          <span className="text-fg-muted">— άδεια</span>
        ) : (
          [...outside]
            .sort((a, b) => step.keys[a.id] - step.keys[b.id])
            .map((n) => (
              <span
                key={n.id}
                className="rounded border border-border bg-bg-soft px-1 py-0.5 font-mono font-semibold text-fg-muted"
              >
                {n.id}:{fmt(step.keys[n.id])}
              </span>
            ))
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded border border-border bg-bg-soft px-1.5 py-0.5 font-mono text-fg-muted">
          {keySym} = {fmt(step.keys[step.added] ?? 0)}
        </span>
        <span className="rounded border border-border bg-bg-soft px-1.5 py-0.5 font-mono text-fg-muted">
          δέντρο: {treeNodes.size}/7
        </span>
        <span className="rounded border border-border bg-bg-soft px-1.5 py-0.5 font-mono text-fg-muted">
          κόστος: {cumCost}
          {step.treeNodes.size === MST_NODES.length && (
            <span className="ml-1 font-bold text-fg">/{finalCost}</span>
          )}
        </span>
      </div>
    </div>
  )
}

const PRIM_FINAL = (() => {
  const last = PRIM_STEPS[PRIM_STEPS.length - 1]
  let c = 0
  for (const id of last.treeEdges) {
    const e = MST_EDGE_BY_ID.get(id)
    if (e) c += e.w
  }
  return c
})()
const DIJK_FINAL = (() => {
  const last = DIJK_STEPS[DIJK_STEPS.length - 1]
  let c = 0
  for (const id of last.treeEdges) {
    const e = MST_EDGE_BY_ID.get(id)
    if (e) c += e.w
  }
  return c
})()

const FIRST_DIVERGENCE = (() => {
  for (let i = 0; i < N_STEPS; i++) {
    if (PRIM_STEPS[i]?.added !== DIJK_STEPS[i]?.added) return i
  }
  return -1
})()

export function PrimVsDijkstraViz() {
  const [step, setStep] = useState(0)
  const primCur = PRIM_STEPS[Math.min(step, PRIM_STEPS.length - 1)]
  const dijCur = DIJK_STEPS[Math.min(step, DIJK_STEPS.length - 1)]
  const diverged = primCur.added !== dijCur.added
  const isFinal = step === LAST

  const note = useMemo(() => {
    if (step === FIRST_DIVERGENCE) {
      const pk = primCur.keys[primCur.added]
      const dk = dijCur.keys[dijCur.added]
      return (
        <>
          <strong className="text-amber-700">
            Εδώ χωρίζονται οι δρόμοι.
          </strong>{' '}
          Ο Prim κοιτάει «τη φθηνότερη ακμή που με συνδέει με το δέντρο» — η{' '}
          <span className="font-mono">C-F</span> έχει κόστος μόλις 2, οπότε
          παίρνει την <strong>{primCur.added}</strong> (α={pk}). Ο Dijkstra
          κοιτάει «το συνολικό κόστος της διαδρομής από την {START}» — η{' '}
          <span className="font-mono">A-D</span> κοστίζει 5 ευθεία, ενώ η{' '}
          <span className="font-mono">A-C-F</span> κοστίζει 5 κι αυτή· με
          ισοβαθμία υπερτερεί αλφαβητικά η <strong>{dijCur.added}</strong> (d=
          {dk}). Διαφορετικό κριτήριο → διαφορετική επόμενη κορυφή → διαφορετικά
          δέντρα.
        </>
      )
    }
    if (diverged) {
      return (
        <>
          Τα δύο δέντρα έχουν προχωρήσει διαφορετικά. Ο Prim πήρε την{' '}
          <strong>{primCur.added}</strong> με α={fmt(primCur.keys[primCur.added])}.
          Ο Dijkstra πήρε την <strong>{dijCur.added}</strong> με d=
          {fmt(dijCur.keys[dijCur.added])}.
        </>
      )
    }
    if (step === 0) {
      return (
        <>
          Και οι δύο ξεκινούν από την {START} με κενό σύνολο. Έλα να τους δούμε
          βήμα-βήμα — όσο τα κλειδιά τους συμπίπτουν, παίρνουν την ίδια κορυφή.
        </>
      )
    }
    return (
      <>
        Βήμα {step}: και οι δύο πήραν την{' '}
        <strong className="text-fg">{primCur.added}</strong> — ο Prim με α=
        {fmt(primCur.keys[primCur.added])}, ο Dijkstra με d=
        {fmt(dijCur.keys[dijCur.added])}. Ίδια κορυφή, διαφορετικός λόγος.
      </>
    )
  }, [step, primCur, dijCur, diverged])

  // final-state comparison: A→D path through each tree
  const primAD = pathCost(
    PRIM_STEPS[PRIM_STEPS.length - 1].treeEdges,
    START,
    'D',
  )
  const dijAD = pathCost(
    DIJK_STEPS[DIJK_STEPS.length - 1].treeEdges,
    START,
    'D',
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Prim εναντίον Dijkstra — ίδιο γράφημα, διαφορετική στρατηγική
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Βήμα {step}/{LAST}
          {step === FIRST_DIVERGENCE && ' · απόκλιση'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Και οι δύο αλγόριθμοι παίρνουν διαδοχικά την κορυφή με το μικρότερο
        κλειδί. Πρόσεξε τι σημαίνει «κλειδί» σε κάθε περίπτωση.
      </p>

      {/* side-by-side panels */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Panel
          step={primCur}
          kind="prim"
          label="Prim — ΕΣΔ"
          keySym="α"
          finalCost={PRIM_FINAL}
        />
        <Panel
          step={dijCur}
          kind="dijkstra"
          label="Dijkstra — συντομότερες διαδρομές"
          keySym="d"
          finalCost={DIJK_FINAL}
        />
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 min-h-[5rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          step === FIRST_DIVERGENCE
            ? 'border-amber-400 bg-amber-50 text-fg'
            : 'border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {note}
      </div>

      {/* final comparison */}
      {isFinal && (
        <div className="mt-3 rounded-lg border border-border bg-bg-soft/60 p-3 text-sm">
          <div className="mb-2 font-semibold text-fg">
            Τι έβγαλε καθένας — και γιατί έχει σημασία
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-success/40 bg-success/5 p-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-success">
                Prim
              </div>
              <div className="text-fg-muted">
                Συνολικό κόστος δέντρου:{' '}
                <strong className="text-fg">{PRIM_FINAL}</strong> (ελάχιστο ✓ —
                ΕΣΔ)
              </div>
              <div className="text-fg-muted">
                Διαδρομή στο δέντρο από {START} στην D:{' '}
                <strong className="text-fg">κόστος {primAD}</strong>
              </div>
            </div>
            <div className="rounded-md border border-purple-300 bg-purple-50/60 p-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Dijkstra
              </div>
              <div className="text-fg-muted">
                Συνολικό κόστος δέντρου:{' '}
                <strong className="text-fg">{DIJK_FINAL}</strong> (όχι ΕΣΔ —
                μεγαλύτερο)
              </div>
              <div className="text-fg-muted">
                Συντομότερη διαδρομή από {START} στην D:{' '}
                <strong className="text-fg">κόστος {dijAD} ✓</strong>
              </div>
            </div>
          </div>
          <p className="mt-2 text-fg-muted">
            Διαφορετικοί στόχοι, διαφορετικά βέλτιστα: το ΕΣΔ ελαχιστοποιεί το{' '}
            <strong>συνολικό κόστος</strong>· οι συντομότερες διαδρομές
            ελαχιστοποιούν την <strong>απόσταση από την πηγή</strong>. Το ένα
            δεν αντικαθιστά το άλλο.
          </p>
        </div>
      )}

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
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={step === LAST}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        {FIRST_DIVERGENCE >= 0 && (
          <button
            type="button"
            onClick={() => setStep(FIRST_DIVERGENCE)}
            className="inline-flex items-center gap-1 rounded-md border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100"
          >
            Στην απόκλιση
          </button>
        )}
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
          Βήμα {step} / {LAST}
        </span>
      </div>
    </section>
  )
}
