'use client'

/**
 * DfsTreeBuilder — see the DFS tree appear as the recursion descends (L07).
 *
 * The recursive DFS has a HIDDEN OUTPUT: the «DFS-tree» — the n−1 edges along
 * which the algorithm actually descended. Every other graph edge is a «back
 * edge», which (in undirected DFS) always closes a cycle to an ANCESTOR in
 * the tree. The lecture talks about this implicitly via the recursion stack;
 * here it's visible.
 *
 * What you see:
 *  - LEFT — the graph G itself. Tree edges light up crimson and bold as the
 *    recursion uses them; back edges light up dashed orange when scanned
 *    (and stay dashed forever afterwards).
 *  - RIGHT — the DFS tree T being drawn from the root downward: every
 *    "discover v from u" event drops a new child v under u and connects it
 *    with a crimson edge; back edges appear in the tree drawing as dashed
 *    upward arcs to the ancestor they close to.
 *  - Stack panel — the live recursion call stack: top frame = where the
 *    recursion is "right now".
 *  - Narration — one short line per step.
 *
 * Convention: neighbours scanned in ascending id order, so the order matches
 * the lecture's worked example 1→2→3→5→4→6→7→8.
 */

import { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { L06_GRAPH, neighbors, edgeKey, routeL06GraphEdge } from './graph-types'
import type { GraphNodeId } from './graph-types'
import { routeEdge, type NodeRect } from './edge-routing'

// --- precomputed DFS run -----------------------------------------------------

type Event =
  | { kind: 'tree'; from: GraphNodeId; to: GraphNodeId }
  | { kind: 'back'; from: GraphNodeId; to: GraphNodeId }
  | { kind: 'backtrack'; from: GraphNodeId }

/**
 * Recursive DFS from 1, neighbours ascending, recording every discovery,
 * every back-edge encounter (first time only — when scanned from the deeper
 * endpoint), and every backtrack.
 */
function dfsTrace(): { events: Event[]; treeParent: Map<GraphNodeId, GraphNodeId> } {
  const events: Event[] = []
  const visited = new Set<GraphNodeId>([1])
  const parent = new Map<GraphNodeId, GraphNodeId>()
  const seenEdge = new Set<string>()

  function rec(u: GraphNodeId, parentOfU: GraphNodeId | null) {
    const list = neighbors(L06_GRAPH, u)
    for (const v of list) {
      if (parentOfU !== null && v === parentOfU) continue // skip the way we came
      const ek = edgeKey(u, v)
      if (visited.has(v)) {
        if (!seenEdge.has(ek)) {
          seenEdge.add(ek)
          events.push({ kind: 'back', from: u, to: v })
        }
      } else {
        seenEdge.add(ek)
        visited.add(v)
        parent.set(v, u)
        events.push({ kind: 'tree', from: u, to: v })
        rec(v, u)
      }
    }
    events.push({ kind: 'backtrack', from: u })
  }
  rec(1, null)
  return { events, treeParent: parent }
}

// --- tree layout -------------------------------------------------------------
/**
 * Hand-tuned layout for the DFS tree rooted at 1 on L06_GRAPH.
 * Coordinates inside a 360 × 380 viewBox.
 */
const TREE_POS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 36 },
  2: { x: 200, y: 102 },
  3: { x: 200, y: 168 },
  5: { x: 122, y: 234 },
  7: { x: 290, y: 234 },
  4: { x: 70, y: 322 },
  6: { x: 170, y: 322 },
  8: { x: 290, y: 322 },
}

/** Tree parent map for the canonical DFS run rooted at 1. */
const TREE_PARENT: Record<number, number> = {
  2: 1,
  3: 2,
  5: 3,
  4: 5,
  6: 5,
  7: 3,
  8: 7,
}

/**
 * Collision rects for the right-pane DFS-tree drawing. Radius 22 = visible
 * r=20 + 2 px padding so any future tree-layout edit that puts an unrelated
 * tree node on a tree-edge centreline auto-curves the edge instead of
 * clipping silently. The back edges keep their hand-tuned 36 px perpendicular
 * offset by design — they are a visual signal («back edge to ancestor»)
 * rather than collision routing, mirroring the WhyBFSFailsWeighted s-t arc
 * carve-out in chunk B2.
 */
const TREE_RECTS: NodeRect[] = Object.entries(TREE_POS).map(([idStr, p]) => ({
  id: Number(idStr),
  x: p.x - 22,
  y: p.y - 22,
  w: 44,
  h: 44,
}))
const TREE_RECT_BY_ID = new Map(TREE_RECTS.map((r) => [r.id, r]))

function routeTreeEdge(a: number, b: number) {
  const ra = TREE_RECT_BY_ID.get(a)!
  const rb = TREE_RECT_BY_ID.get(b)!
  return routeEdge(ra, rb, TREE_RECTS)
}

// --- component ---------------------------------------------------------------
export function DfsTreeBuilder() {
  const { events } = useMemo(() => dfsTrace(), [])
  const total = events.length

  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  // derive state for step k (= after the first k events)
  const treeEdges = useMemo(() => {
    const out: { from: number; to: number }[] = []
    for (let i = 0; i < step; i++) {
      const e = events[i]
      if (e.kind === 'tree') out.push({ from: e.from, to: e.to })
    }
    return out
  }, [events, step])

  const backEdges = useMemo(() => {
    const out: { from: number; to: number }[] = []
    for (let i = 0; i < step; i++) {
      const e = events[i]
      if (e.kind === 'back') out.push({ from: e.from, to: e.to })
    }
    return out
  }, [events, step])

  // recursion stack
  const stack = useMemo(() => {
    const s: number[] = []
    for (let i = 0; i < step; i++) {
      const e = events[i]
      if (e.kind === 'tree') {
        if (s.length === 0) s.push(e.from)
        if (!s.includes(e.from)) {
          // shouldn't happen with this trace
        }
        s.push(e.to)
      } else if (e.kind === 'backtrack') {
        if (s.length > 0 && s[s.length - 1] === e.from) s.pop()
      }
    }
    if (step === 0) s.push(1) // very first state: root just placed
    return s
  }, [events, step])

  // visited set after step k
  const visitedSet = useMemo(() => {
    const v = new Set<number>([1])
    for (let i = 0; i < step; i++) {
      const e = events[i]
      if (e.kind === 'tree') v.add(e.to)
    }
    return v
  }, [events, step])

  // active node (current top of recursion stack)
  const activeNode = stack.length > 0 ? stack[stack.length - 1] : null

  // autoplay
  useEffect(() => {
    if (!playing) return
    if (step >= total) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => Math.min(total, s + 1)), 950)
    return () => clearTimeout(t)
  }, [playing, step, total])

  // narration
  let narration = ''
  if (step === 0) {
    narration = 'Ξεκινάμε από την κορυφή 1 — αυτή είναι η ρίζα του DFS-δέντρου. Πάτα «Βήμα» ή ▶.'
  } else {
    const e = events[step - 1]
    if (e.kind === 'tree') {
      narration = `Από την ${e.from}, ο πρώτος μη-επισκεμμένος γείτονας είναι η ${e.to} → κατεβαίνουμε. Νέα ακμή του DFS-δέντρου: {${e.from}, ${e.to}}.`
    } else if (e.kind === 'back') {
      narration = `Στην ${e.from}, ο γείτονας ${e.to} είναι ΗΔΗ επισκεμμένος (και δεν είναι ο γονιός). Η ακμή {${e.from}, ${e.to}} είναι ΟΠΙΣΘΙΑ ΑΚΜΗ — κλείνει κύκλο πίσω σε πρόγονο.`
    } else {
      narration = `Η ${e.from} δεν έχει άλλο μη-επισκεμμένο γείτονα → backtrack: γυρνάμε στον γονιό.`
    }
  }

  const verdictReady = step >= total
  const treeEdgeKeys = new Set(treeEdges.map((e) => edgeKey(e.from, e.to)))
  const backEdgeKeys = new Set(backEdges.map((e) => edgeKey(e.from, e.to)))

  function jump(d: number) {
    setStep((s) => Math.min(total, Math.max(0, s + d)))
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Το «κρυφό» αποτέλεσμα του DFS — το DFS-δέντρο
        </div>
        <span className="text-xs text-fg-subtle">
          Πορεία από κορυφή 1, γείτονες σε αύξουσα σειρά
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* graph G */}
        <div className="graph-canvas">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Γράφημα G
          </div>
          <svg viewBox={L06_GRAPH.viewBox} className="block h-auto w-full" role="img">
            {L06_GRAPH.edges.map((e, i) => {
              const g = routeL06GraphEdge(e.a, e.b)
              const ek = edgeKey(e.a, e.b)
              const isTree = treeEdgeKeys.has(ek)
              const isBack = backEdgeKeys.has(ek)
              const stroke = isTree ? '#9f1239' : isBack ? '#d97706' : '#cbb8ba'
              const sw = isTree ? 4 : isBack ? 3 : 1.5
              const dash = isBack ? '5 4' : undefined
              return g.kind === 'line' ? (
                <line
                  key={`g-${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeDasharray={dash}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`g-${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeDasharray={dash}
                  strokeLinecap="round"
                />
              )
            })}
            {L06_GRAPH.nodes.map((n) => {
              const isActive = n.id === activeNode
              const inStack = stack.includes(n.id)
              const isVisited = visitedSet.has(n.id)
              const fill = isActive ? '#9f1239' : isVisited ? '#d1fae5' : '#ffffff'
              const stroke = isActive ? '#7e1031' : isVisited ? '#059669' : '#9b8a8d'
              const txt = isActive ? '#ffffff' : isVisited ? '#065f46' : '#1c1214'
              return (
                <g key={`g-n-${n.id}`} transform={`translate(${n.x} ${n.y})`}>
                  <circle r={23} fill={fill} stroke={stroke} strokeWidth={2.5} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={15}
                    fontWeight={700}
                    fill={txt}
                  >
                    {n.id}
                  </text>
                  {inStack && !isActive && (
                    <circle
                      r={29}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      opacity={0.6}
                    />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* DFS tree T */}
        <div className="graph-canvas">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            DFS-δέντρο T
          </div>
          <svg viewBox="0 0 360 380" className="block h-auto w-full" role="img">
            {/* tree edges */}
            {Object.entries(TREE_PARENT).map(([childStr, par]) => {
              const child = Number(childStr)
              if (!visitedSet.has(child)) return null
              const g = routeTreeEdge(par, child)
              return g.kind === 'line' ? (
                <line
                  key={`t-${child}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="#9f1239"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`t-${child}`}
                  d={g.d}
                  fill="none"
                  stroke="#9f1239"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                />
              )
            })}
            {/* back edges as dashed arcs to ancestor */}
            {backEdges.map((be, i) => {
              const A = TREE_POS[be.from]
              const B = TREE_POS[be.to]
              if (!A || !B) return null
              // curve outward to the right if going up; choose based on x
              const midX = (A.x + B.x) / 2
              const midY = (A.y + B.y) / 2
              // perpendicular offset for the curve
              const dx = B.x - A.x
              const dy = B.y - A.y
              const len = Math.hypot(dx, dy) || 1
              const px = -dy / len
              const py = dx / len
              const cx = midX + px * 36
              const cy = midY + py * 36
              return (
                <path
                  key={`back-${i}`}
                  d={`M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              )
            })}
            {/* nodes */}
            {Object.entries(TREE_POS).map(([idStr, pos]) => {
              const id = Number(idStr)
              if (!visitedSet.has(id)) return null
              const isActive = id === activeNode
              const fill = isActive ? '#9f1239' : '#d1fae5'
              const stroke = isActive ? '#7e1031' : '#059669'
              const txt = isActive ? '#ffffff' : '#065f46'
              return (
                <g key={`tn-${id}`} transform={`translate(${pos.x} ${pos.y})`}>
                  <circle r={20} fill={fill} stroke={stroke} strokeWidth={2.5} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill={txt}
                  >
                    {id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* stack + narration */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.6fr]">
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Στοίβα αναδρομής
            </span>
            <span className="text-[11px] text-fg-subtle">δεξιά = top</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {stack.length === 0 ? (
              <span className="text-sm italic text-fg-subtle">(άδεια)</span>
            ) : (
              stack.map((id, i) => (
                <span
                  key={`s-${id}-${i}`}
                  className={cn(
                    'inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md border px-1.5 font-mono text-sm font-semibold',
                    i === stack.length - 1
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border-strong bg-bg-elevated text-fg',
                  )}
                >
                  {id}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
          {narration}
        </div>
      </div>

      {verdictReady && (
        <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          <strong>Τελείωσε.</strong> Το DFS-δέντρο έχει 7 ακμές = n − 1, ακριβώς όσες
          χρειάζονται για να συνδέσουν 8 κορυφές. Οι υπόλοιπες 4 ακμές του G (
          {Array.from(backEdgeKeys).join(', ')}) είναι ΟΠΙΣΘΙΕΣ ΑΚΜΕΣ — όλες κλείνουν
          κύκλο πίσω σε πρόγονο στο δέντρο. <em>Στο μη-κατευθυνόμενο DFS δεν υπάρχουν
          άλλα είδη μη-δεντρικών ακμών</em> — αυτή η παρατήρηση μας χρειάζεται στο L08.
        </div>
      )}

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setStep(0)
            setPlaying(false)
          }}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Καθαρά
        </button>
        <button
          type="button"
          onClick={() => jump(-1)}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Πίσω
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= total}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          {playing ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" /> Παύση
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" /> Παίξε
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => jump(1)}
          disabled={step >= total}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Βήμα <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          Συμβάν {step} / {total}
        </span>
      </div>
    </section>
  )
}
