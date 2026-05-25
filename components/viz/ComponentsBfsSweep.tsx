'use client'

/**
 * ComponentsBfsSweep — the outer loop that finds every connected component.
 *
 * For the L06 problems `pt5-th1` and `front-set-5-ask5`. Both ask for the same
 * algorithm — "for i ← 1 to n: if v_i unmarked, run BFS(v_i)" — and the
 * load-bearing teaching point is that the OUTER LOOP is what makes the
 * algorithm explore every component, not BFS itself. Each new unmarked vertex
 * starts a fresh wave and the component counter c ticks +1.
 *
 * Two presets via `instance`:
 *   - `'pt5-th1'`  → an 11-vertex 3-component graph (numeric ids).
 *   - `'head-succ'`→ the 8-vertex a..h, 3-component graph from the front-set-5
 *     pseudocode. Adds a side panel showing the Head[] and Succ[] arrays
 *     being read by the algorithm.
 *
 * One step = one operation (outer-loop increment, BFS dequeue, neighbour scan,
 * or marking). Live counters: component count c, vertices visited, current
 * frontier, BFS queue snapshot.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type VId = string

type V = { id: VId; x: number; y: number; label?: string }
type E = { a: VId; b: VId }

type Instance = {
  vertices: V[]
  edges: E[]
  /** Canonical traversal order — the outer loop visits in this order. */
  order: VId[]
  /** Optional explicit component count for the side panel header. */
  componentsExpected: number
  /** SVG viewBox. */
  viewBox: string
}

// ── PRESETS ────────────────────────────────────────────────────────────────

const PT5_TH1: Instance = {
  // 11 vertices, 3 components:
  // A: {1,2,3,4} cycle/triangle-ish
  // B: {5,6,7}
  // C: {8,9,10,11}
  viewBox: '0 0 560 320',
  vertices: [
    { id: '1', x: 70, y: 80 },
    { id: '2', x: 150, y: 50 },
    { id: '3', x: 200, y: 130 },
    { id: '4', x: 100, y: 170 },
    { id: '5', x: 280, y: 70 },
    { id: '6', x: 340, y: 130 },
    { id: '7', x: 260, y: 180 },
    { id: '8', x: 420, y: 70 },
    { id: '9', x: 500, y: 100 },
    { id: '10', x: 510, y: 200 },
    { id: '11', x: 420, y: 220 },
  ],
  edges: [
    { a: '1', b: '2' },
    { a: '2', b: '3' },
    { a: '1', b: '4' },
    { a: '3', b: '4' },
    { a: '2', b: '4' },
    { a: '5', b: '6' },
    { a: '5', b: '7' },
    { a: '6', b: '7' },
    { a: '8', b: '9' },
    { a: '9', b: '10' },
    { a: '10', b: '11' },
    { a: '8', b: '11' },
    { a: '9', b: '11' },
  ],
  order: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
  componentsExpected: 3,
}

const HEAD_SUCC: Instance = {
  // The 8-letter graph from front-set-5-ask5: {a,b,c,d} - {e,f} - {g,h}.
  viewBox: '0 0 560 280',
  vertices: [
    { id: 'a', x: 70, y: 90 },
    { id: 'b', x: 150, y: 60 },
    { id: 'c', x: 200, y: 140 },
    { id: 'd', x: 90, y: 170 },
    { id: 'e', x: 290, y: 90 },
    { id: 'f', x: 360, y: 150 },
    { id: 'g', x: 460, y: 80 },
    { id: 'h', x: 480, y: 180 },
  ],
  edges: [
    { a: 'a', b: 'b' },
    { a: 'b', b: 'c' },
    { a: 'a', b: 'd' },
    { a: 'c', b: 'd' },
    { a: 'e', b: 'f' },
    { a: 'g', b: 'h' },
  ],
  order: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  componentsExpected: 3,
}

const INSTANCES: Record<string, Instance> = {
  'pt5-th1': PT5_TH1,
  'head-succ': HEAD_SUCC,
}

// ── STEP STATE ─────────────────────────────────────────────────────────────

type Phase =
  | 'init'
  /** Outer loop: about to check `mark[order[i]]`. */
  | 'outer-check'
  /** Started a new BFS: just marked `seed`, c++, queue = [seed]. */
  | 'bfs-start'
  /** BFS step: dequeue a vertex, currently scanning its neighbours. */
  | 'bfs-dequeue'
  /** Scan: highlighting neighbour at position `nbrIdx` of `current`. */
  | 'bfs-scan'
  /** All components found; algorithm halts. */
  | 'done'

type State = {
  phase: Phase
  /** Index into instance.order — the outer loop pointer. */
  outerI: number
  /** Currently running BFS, in FIFO order. */
  queue: VId[]
  /** Vertex dequeued and currently scanning its neighbour list. */
  current: VId | null
  /** Position within `current`'s neighbour list. */
  nbrIdx: number
  /** Map: vertex → component id (1..c). 0 = unmarked. */
  mark: Map<VId, number>
  /** Component counter. */
  c: number
  /** Whatever edge was just "used" to discover something — flashes briefly. */
  highlightEdge: { a: VId; b: VId } | null
  /** Caption shown under the graph. */
  caption: string
}

function emptyState(inst: Instance): State {
  const mark = new Map<VId, number>()
  for (const v of inst.vertices) mark.set(v.id, 0)
  return {
    phase: 'init',
    outerI: -1,
    queue: [],
    current: null,
    nbrIdx: 0,
    mark,
    c: 0,
    highlightEdge: null,
    caption: 'Έτοιμοι. Ο εξωτερικός βρόχος δεν έχει ξεκινήσει.',
  }
}

function neighboursOf(inst: Instance, v: VId): VId[] {
  const out: VId[] = []
  for (const e of inst.edges) {
    if (e.a === v) out.push(e.b)
    else if (e.b === v) out.push(e.a)
  }
  // Sort by `order` so the trace is deterministic and pedagogical.
  out.sort((p, q) => inst.order.indexOf(p) - inst.order.indexOf(q))
  return out
}

function nextStep(inst: Instance, s: State): State {
  if (s.phase === 'done') return s

  // INIT → enter the outer loop at i = 0.
  if (s.phase === 'init') {
    return {
      ...s,
      phase: 'outer-check',
      outerI: 0,
      caption: `Εξωτερικός βρόχος: i = 1, ελέγχω το ${inst.order[0]}.`,
    }
  }

  // OUTER-CHECK: is order[outerI] marked? If yes, advance. If no, start BFS.
  if (s.phase === 'outer-check') {
    const v = inst.order[s.outerI]
    if (s.mark.get(v) !== 0) {
      // Already marked → skip to next i.
      const ni = s.outerI + 1
      if (ni >= inst.order.length) {
        return {
          ...s,
          phase: 'done',
          caption: `Ο εξωτερικός βρόχος τελείωσε. Βρέθηκαν ${s.c} συνεκτικές συνιστώσες.`,
        }
      }
      return {
        ...s,
        outerI: ni,
        caption: `Το ${v} είναι ήδη μαρκαρισμένο (συνιστώσα ${s.mark.get(v)}). Συνεχίζω: i = ${ni + 1}.`,
      }
    }
    // Unmarked → new component.
    const mark = new Map(s.mark)
    const newC = s.c + 1
    mark.set(v, newC)
    return {
      ...s,
      phase: 'bfs-start',
      mark,
      c: newC,
      queue: [v],
      caption: `Το ${v} είναι ασημάδευτο → ΝΕΑ συνιστώσα ${newC}. Ξεκινώ BFS από ${v}.`,
    }
  }

  // BFS-START → dequeue the seed and begin scanning its neighbours.
  if (s.phase === 'bfs-start') {
    const v = s.queue[0]
    return {
      ...s,
      phase: 'bfs-scan',
      current: v,
      queue: s.queue.slice(1),
      nbrIdx: 0,
      caption: `BFS αφαιρεί το ${v} από την ουρά· σαρώνω τους γείτονές του.`,
    }
  }

  // BFS-DEQUEUE → start scanning the dequeued vertex's neighbour list.
  if (s.phase === 'bfs-dequeue') {
    const v = s.queue[0]
    return {
      ...s,
      phase: 'bfs-scan',
      current: v,
      queue: s.queue.slice(1),
      nbrIdx: 0,
      caption: `BFS αφαιρεί το ${v} από την ουρά· σαρώνω τους γείτονές του.`,
    }
  }

  // BFS-SCAN → look at neighbours[nbrIdx]. If unmarked, mark + enqueue.
  if (s.phase === 'bfs-scan' && s.current) {
    const nbrs = neighboursOf(inst, s.current)
    if (s.nbrIdx >= nbrs.length) {
      // Finished scanning this vertex.
      if (s.queue.length === 0) {
        // BFS done. Move outer loop forward.
        const ni = s.outerI + 1
        if (ni >= inst.order.length) {
          return {
            ...s,
            phase: 'done',
            current: null,
            caption: `Συνιστώσα ${s.c} ολοκληρώθηκε. Ο εξωτερικός βρόχος τελείωσε — ${s.c} συνιστώσες συνολικά.`,
          }
        }
        return {
          ...s,
          phase: 'outer-check',
          current: null,
          outerI: ni,
          caption: `Συνιστώσα ${s.c} ολοκληρώθηκε. Συνεχίζω εξωτερικό βρόχο: i = ${ni + 1}.`,
        }
      }
      // Still vertices in the queue — dequeue the next one.
      return {
        ...s,
        phase: 'bfs-dequeue',
        current: null,
        caption: `Επόμενος στην ουρά: ${s.queue[0]}.`,
      }
    }
    const u = nbrs[s.nbrIdx]
    if (s.mark.get(u) !== 0) {
      // Already marked — skip.
      return {
        ...s,
        nbrIdx: s.nbrIdx + 1,
        highlightEdge: { a: s.current, b: u },
        caption: `Ο γείτονας ${u} είναι ήδη μαρκαρισμένος. Παρακάμπτω.`,
      }
    }
    // Mark + enqueue.
    const mark = new Map(s.mark)
    mark.set(u, s.c)
    return {
      ...s,
      nbrIdx: s.nbrIdx + 1,
      mark,
      queue: [...s.queue, u],
      highlightEdge: { a: s.current, b: u },
      caption: `Ο γείτονας ${u} ήταν ασημάδευτος → μαρκάρω συνιστώσα ${s.c}, βάζω στην ουρά.`,
    }
  }

  return s
}

const COMPONENT_PALETTE = ['#7c3aed', '#0ea5a2', '#d97706', '#db2777', '#2563eb']

function colourForComponent(c: number): string {
  if (c === 0) return '#e7e3e4'
  return COMPONENT_PALETTE[(c - 1) % COMPONENT_PALETTE.length]
}

type Props = {
  instance?: 'pt5-th1' | 'head-succ'
  /** Show the Head[] / Succ[] arrays side panel (front-set-5-ask5). */
  showHeadSucc?: boolean
}

export function ComponentsBfsSweep({ instance = 'pt5-th1', showHeadSucc = false }: Props) {
  const inst = INSTANCES[instance] ?? PT5_TH1
  const [steps, setSteps] = useState<State[]>(() => [emptyState(inst)])
  const [k, setK] = useState(0)
  const [playing, setPlaying] = useState(false)

  // When the instance changes, reset.
  useEffect(() => {
    setSteps([emptyState(inst)])
    setK(0)
    setPlaying(false)
  }, [inst])

  const state = steps[Math.min(k, steps.length - 1)]

  function stepForward() {
    if (state.phase === 'done') return
    let arr = steps
    if (k + 1 >= arr.length) {
      arr = [...arr, nextStep(inst, arr[arr.length - 1])]
      setSteps(arr)
    }
    setK(k + 1)
  }

  function stepBack() {
    if (k === 0) return
    setK(k - 1)
  }

  function reset() {
    setSteps([emptyState(inst)])
    setK(0)
    setPlaying(false)
  }

  useEffect(() => {
    if (!playing) return
    if (state.phase === 'done') {
      setPlaying(false)
      return
    }
    const t = setTimeout(stepForward, 650)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, k])

  // Head[] / Succ[] arrays: the adjacency lists as two flat arrays. Head[v]
  // points into Succ[]. We render the canonical layout for the head-succ
  // preset.
  const headSucc = useMemo(() => {
    if (!showHeadSucc) return null
    const succ: { value: VId; ownerStart: VId }[] = []
    const head = new Map<VId, number>()
    for (const v of inst.order) {
      head.set(v, succ.length + 1) // 1-indexed
      for (const u of neighboursOf(inst, v)) succ.push({ value: u, ownerStart: v })
    }
    return { head, succ }
  }, [showHeadSucc, inst])

  // Highlight: when scanning v at nbrIdx, the head pointer for v lights, and
  // the Succ cell at (head[v] + nbrIdx − 1) lights.
  const succHi =
    headSucc && state.current
      ? (headSucc.head.get(state.current) ?? 1) - 1 + state.nbrIdx
      : -1

  const componentBuckets = useMemo(() => {
    const buckets: Map<number, VId[]> = new Map()
    for (const [v, c] of state.mark) {
      if (c === 0) continue
      const arr = buckets.get(c) ?? []
      arr.push(v)
      buckets.set(c, arr)
    }
    return buckets
  }, [state.mark])

  const visitedCount = Array.from(state.mark.values()).filter((c) => c > 0).length

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border bg-bg-soft/30">
      <div className="border-b border-border bg-bg-soft/50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Συνεκτικές συνιστώσες · ο εξωτερικός βρόχος
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Ο εξωτερικός βρόχος{' '}
          <code className="rounded bg-bg-soft px-1 text-[12px]">for i ← 1 to n</code>{' '}
          ψάχνει ασημάδευτη κορυφή· κάθε φορά που τη βρει, ξεκινά ένα φρέσκο BFS
          και ο μετρητής συνιστωσών c τικάρει +1.
        </p>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[1.4fr_1fr]">
        {/* Graph */}
        <div className="rounded-xl border border-border bg-bg-elevated p-3">
          <svg viewBox={inst.viewBox} className="w-full">
            {inst.edges.map((e, i) => {
              const ca = state.mark.get(e.a) ?? 0
              const cb = state.mark.get(e.b) ?? 0
              const sameComp = ca === cb && ca > 0
              const hi =
                state.highlightEdge &&
                ((state.highlightEdge.a === e.a && state.highlightEdge.b === e.b) ||
                  (state.highlightEdge.a === e.b && state.highlightEdge.b === e.a))
              const stroke = hi
                ? '#dc2626'
                : sameComp
                  ? colourForComponent(ca)
                  : '#cbb3b8'
              const sw = hi ? 4 : sameComp ? 2.4 : 1.6
              const pa = inst.vertices.find((v) => v.id === e.a)
              const pb = inst.vertices.find((v) => v.id === e.b)
              if (!pa || !pb) return null
              return (
                <line
                  key={i}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={stroke}
                  strokeWidth={sw}
                  opacity={sameComp || hi ? 1 : 0.6}
                />
              )
            })}
            {inst.vertices.map((v) => {
              const comp = state.mark.get(v.id) ?? 0
              const isCurrent = state.current === v.id
              const inQueue = state.queue.includes(v.id)
              const isStart =
                state.phase === 'outer-check' && inst.order[state.outerI] === v.id
              return (
                <g key={v.id}>
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={isCurrent ? 22 : 18}
                    fill={comp === 0 ? '#ffffff' : colourForComponent(comp)}
                    stroke={
                      isCurrent
                        ? '#dc2626'
                        : isStart
                          ? '#a16207'
                          : inQueue
                            ? '#0ea5a2'
                            : '#9b8a8d'
                    }
                    strokeWidth={isCurrent || isStart || inQueue ? 3.5 : 2}
                  />
                  <text
                    x={v.x}
                    y={v.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="13"
                    fontWeight="700"
                    fill={comp === 0 ? '#1c1214' : '#ffffff'}
                  >
                    {v.label ?? v.id}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className="mt-2 min-h-[2.5rem] text-sm text-fg-default">{state.caption}</p>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-bg-elevated p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Μετρητές
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
                <div className="text-[11px] uppercase text-fg-subtle">c (συνιστώσες)</div>
                <div className="text-xl font-bold tabular-nums">{state.c}</div>
              </div>
              <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
                <div className="text-[11px] uppercase text-fg-subtle">μαρκαρισμένα</div>
                <div className="text-xl font-bold tabular-nums">
                  {visitedCount} <span className="text-sm text-fg-muted">/ {inst.vertices.length}</span>
                </div>
              </div>
              <div className="col-span-2 rounded-md border border-border bg-bg-soft px-2 py-1.5">
                <div className="text-[11px] uppercase text-fg-subtle">ουρά BFS</div>
                <div className="font-mono text-sm">
                  {state.queue.length === 0 ? <span className="text-fg-subtle">∅</span> : `[${state.queue.join(', ')}]`}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg-elevated p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Συνιστώσες
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {[...componentBuckets.entries()]
                .sort((a, b) => a[0] - b[0])
                .map(([c, vs]) => (
                  <li key={c} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ background: colourForComponent(c) }}
                    />
                    <span className="font-semibold">C{c}:</span>
                    <span className="font-mono">{vs.sort((a, b) => inst.order.indexOf(a) - inst.order.indexOf(b)).join(', ')}</span>
                  </li>
                ))}
              {componentBuckets.size === 0 && (
                <li className="text-fg-subtle">καμία ακόμη.</li>
              )}
            </ul>
          </div>

          {showHeadSucc && headSucc && (
            <div className="rounded-xl border border-border bg-bg-elevated p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Head[] και Succ[]
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                Η ουρά διαβάζει το Head[v] για να μπει στη λίστα του v και κατόπιν
                το Succ[] κελί προς κελί.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="font-semibold text-fg-subtle">Head[v]</div>
                  <div className="mt-1 space-y-0.5 font-mono">
                    {inst.order.map((v) => (
                      <div
                        key={v}
                        className={cn(
                          'rounded px-1.5 py-0.5',
                          state.current === v
                            ? 'bg-amber-100 ring-1 ring-amber-400'
                            : 'bg-bg-soft',
                        )}
                      >
                        Head[{v}] = {headSucc.head.get(v)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-fg-subtle">
                    Succ[ ] (πλήθος {headSucc.succ.length})
                  </div>
                  <div className="mt-1 grid grid-cols-3 gap-0.5 font-mono">
                    {headSucc.succ.map((cell, i) => (
                      <div
                        key={i}
                        className={cn(
                          'rounded px-1 py-0.5 text-center',
                          i === succHi
                            ? 'bg-rose-200 ring-1 ring-rose-500'
                            : 'bg-bg-soft',
                        )}
                        title={`κελί ${i + 1} (γείτονας του ${cell.ownerStart})`}
                      >
                        {cell.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-bg-soft/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={stepBack}
            disabled={k === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft size={16} /> πίσω
          </button>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            disabled={state.phase === 'done'}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'παύση' : 'παίξε'}
          </button>
          <button
            type="button"
            onClick={stepForward}
            disabled={state.phase === 'done'}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
          >
            επόμενο <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft"
          >
            <RotateCcw size={14} /> reset
          </button>
        </div>
        <p className="text-xs text-fg-subtle">
          βήμα {k} · {state.phase === 'done' ? 'τέλος' : `φάση: ${state.phase}`}
        </p>
      </div>
    </div>
  )
}
