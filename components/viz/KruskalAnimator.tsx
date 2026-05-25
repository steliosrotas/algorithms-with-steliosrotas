'use client'

/**
 * KruskalAnimator — Kruskal's algorithm building the MST edge by edge (L09).
 *
 * Kruskal ignores geometry: it sorts the edges by cost and sweeps them. An
 * edge joining two SEPARATE pieces is kept (cut property); an edge whose two
 * ends are ALREADY connected would close a cycle and is dropped (cycle
 * property). This viz shows both halves at once — the sorted edge strip with
 * a moving cursor, and the forest where each connected component has its own
 * colour. The student watches two coloured blobs merge into one colour when
 * an edge is accepted, and a rejected edge light up the very cycle it would
 * have closed. Built for L09.
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
  componentsOf,
  compColor,
  type MstEdge,
} from './mst-graph'

const SORTED: MstEdge[] = [...MST_EDGES].sort((a, b) => a.w - b.w)
const NEEDED = MST_NODES.length - 1 // 6 tree edges

type KStep = {
  edge: MstEdge
  accept: boolean
  treeEdges: Set<string>
}

/** Run Kruskal, recording one KStep per edge examined (until the tree is full). */
function runKruskal(): KStep[] {
  const parent = new Map(MST_NODES.map((n) => [n.id, n.id]))
  const find = (x: string): string => {
    let r = x
    while (parent.get(r) !== r) r = parent.get(r)!
    let c = x
    while (parent.get(c) !== c) {
      const nx = parent.get(c)!
      parent.set(c, r)
      c = nx
    }
    return r
  }
  const treeEdges = new Set<string>()
  const steps: KStep[] = []
  for (const e of SORTED) {
    if (treeEdges.size >= NEEDED) break
    const ra = find(e.a)
    const rb = find(e.b)
    const accept = ra !== rb
    if (accept) {
      treeEdges.add(e.id)
      if (ra < rb) parent.set(rb, ra)
      else parent.set(ra, rb)
    }
    steps.push({ edge: e, accept, treeEdges: new Set(treeEdges) })
  }
  return steps
}

/** Vertices on the tree path between src and dst (the cycle a rejected edge closes). */
function treePath(edges: Set<string>, src: string, dst: string): string[] {
  const adj = new Map<string, string[]>()
  for (const n of MST_NODES) adj.set(n.id, [])
  for (const e of MST_EDGES) {
    if (!edges.has(e.id)) continue
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

export function KruskalAnimator() {
  const steps = useMemo(() => runKruskal(), [])
  const last = steps.length // step 0 = init, step k = after examining the k-th edge
  const [step, setStep] = useState(0)

  const cur = step === 0 ? null : steps[step - 1]
  const treeEdges = useMemo(
    () => cur?.treeEdges ?? new Set<string>(),
    [cur],
  )
  const comps = useMemo(() => componentsOf(treeEdges), [treeEdges])
  const compCount = useMemo(() => new Set(comps.values()).size, [comps])

  /** the cycle a rejected current edge would close */
  const cyclePath = useMemo(() => {
    if (!cur || cur.accept) return [] as string[]
    // tree edges BEFORE this rejected edge = the same set (reject adds nothing)
    return treePath(treeEdges, cur.edge.a, cur.edge.b)
  }, [cur, treeEdges])
  const cycleEdgeSet = useMemo(() => {
    const s = new Set<string>()
    for (let i = 0; i + 1 < cyclePath.length; i++) {
      const u = cyclePath[i]
      const v = cyclePath[i + 1]
      s.add(u < v ? `${u}-${v}` : `${v}-${u}`)
    }
    return s
  }, [cyclePath])

  const note = useMemo(() => {
    if (!cur) {
      return 'Ταξινομούμε τις 12 ακμές κατά αύξον κόστος. Κάθε κορυφή ξεκινά σε δικό της σύνολο — ένα δάσος από 7 μεμονωμένες κορυφές, καθεμία με το δικό της χρώμα.'
    }
    const e = cur.edge
    if (cur.accept) {
      const tail =
        cur.treeEdges.size >= NEEDED
          ? ' Φτάσαμε τις 6 ακμές — το ΕΣΔ ολοκληρώθηκε, συνολικό κόστος 23. Οι υπόλοιπες ακμές δεν χρειάζονται καν να εξεταστούν.'
          : ''
      return `Ακμή {${e.a}, ${e.b}} κόστους ${e.w}: οι ${e.a} και ${e.b} ανήκουν σε ΔΙΑΦΟΡΕΤΙΚΑ σύνολα — η ακμή ενώνει δύο ξεχωριστά κομμάτια χωρίς να κλείσει κύκλο. Την προσθέτουμε στο ΕΣΔ και ενώνουμε τα δύο σύνολα σε ένα.${tail}`
    }
    const cyc = cyclePath.length
      ? cyclePath.join('–') + '–' + cyclePath[0]
      : ''
    return `Ακμή {${e.a}, ${e.b}} κόστους ${e.w}: οι ${e.a} και ${e.b} είναι ΗΔΗ στο ίδιο σύνολο (ίδιο χρώμα). Η ακμή θα έκλεινε τον κύκλο ${cyc} — και αφού οι ακμές σαρώνονται από τη φθηνότερη, αυτή είναι η ακριβότερη του κύκλου. Από την ιδιότητα κύκλου, την παραλείπουμε.`
  }, [cur, cyclePath])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Kruskal βήμα-βήμα — ένα δάσος που συγχωνεύεται
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {treeEdges.size >= NEEDED
            ? 'Ολοκληρώθηκε'
            : `${treeEdges.size}/6 ακμές · ${compCount} σύνολα`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κάθε χρώμα = ένα συνεκτικό κομμάτι του δάσους. Ακμή σε δύο χρώματα →
        ενώνει· ακμή σε ένα χρώμα → θα έκλεινε κύκλο.
      </p>

      {/* sorted-edge strip */}
      <div className="mb-2 flex flex-wrap gap-1">
        {SORTED.map((e, i) => {
          const processed = i < step
          const isCurrent = i === step - 1
          const decision = i < steps.length ? steps[i].accept : null
          const accepted = processed && decision === true
          const rejected = processed && decision === false
          const unused = step === last && i >= steps.length
          return (
            <div
              key={e.id}
              className={cn(
                'flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold transition-colors',
                isCurrent && 'ring-2 ring-amber-500',
                accepted && 'border-success/50 bg-success/10 text-success',
                rejected && 'border-danger/50 bg-danger/10 text-danger line-through',
                !processed && !unused && 'border-border bg-bg-soft text-fg-muted',
                unused && 'border-dashed border-border text-fg-subtle opacity-55',
              )}
            >
              {e.a}-{e.b}
              <span className="opacity-70">·{e.w}</span>
            </div>
          )
        })}
      </div>

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
            const isCurrent = cur?.edge.id === e.id
            const inCycle = cycleEdgeSet.has(e.id)
            let stroke = '#c9bcbe'
            let width = 1.8
            let dash: string | undefined
            if (isCurrent && cur && cur.accept) {
              stroke = compColor(comps.get(e.a)!).stroke
              width = 5.5
            } else if (isCurrent) {
              stroke = '#dc2626'
              width = 4
              dash = '6 4'
            } else if (isTree) {
              stroke = compColor(comps.get(e.a)!).stroke
              width = 3.6
            } else if (inCycle) {
              stroke = '#dc2626'
              width = 3
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
                  stroke={
                    isCurrent ? (cur?.accept ? '#059669' : '#dc2626') : '#cdbfc0'
                  }
                  strokeWidth={isCurrent ? 2 : 1}
                />
                <text
                  x={g.mx}
                  y={g.my - 1}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={isCurrent ? '#1c1214' : '#5a4a4d'}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {MST_NODES.map((n) => {
            const col = compColor(comps.get(n.id)!)
            const onCurrent =
              cur?.edge.id &&
              (cur.edge.a === n.id || cur.edge.b === n.id)
            return (
              <g key={n.id}>
                {onCurrent && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={MST_NODE_R + 6}
                    fill="none"
                    stroke={cur?.accept ? '#059669' : '#dc2626'}
                    strokeWidth={2.5}
                    strokeDasharray="4 3"
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={MST_NODE_R}
                  fill={col.fill}
                  stroke={col.stroke}
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
