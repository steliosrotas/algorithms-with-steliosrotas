'use client'

/**
 * TreeThreeProperties — «οποιεσδήποτε δύο από τις τρεις ⇒ η τρίτη» (L06).
 *
 * The theorem says: for a graph with n vertices, of {συνεκτικό, ακυκλικό,
 * έχει n−1 ακμές}, any two imply the third. As a paragraph that's
 * forgettable. As a toy with a "what's true RIGHT NOW" panel beside it,
 * it becomes operational.
 *
 * The student starts from a tree on 6 vertices. All three indicators are
 * green. Toggle ANY single edge and watch:
 *   • add an extra edge → ακυκλικό flips red (a cycle appears), συνεκτικό
 *     stays green; the n−1 counter now reads "n ακμές" — red.
 *   • remove a tree edge → συνεκτικό flips red (a component splits off),
 *     ακυκλικό stays green; the counter reads "n−2" — red.
 *   • only when all three are green is it a tree (preset button).
 *
 * The headline observation lives in a real-time block at the bottom:
 * "Αυτή τη στιγμή είναι αλήθεια X από 3 — δένδρο ⇔ και οι τρεις πράσινες."
 * Built for L06.
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type TNode = { id: string; x: number; y: number }
type TEdge = { id: string; a: string; b: string }

// 6 vertices arranged around a centre — gives clean tree pictures
const NODES: TNode[] = [
  { id: 'A', x: 80, y: 80 },
  { id: 'B', x: 230, y: 50 },
  { id: 'C', x: 380, y: 80 },
  { id: 'D', x: 80, y: 230 },
  { id: 'E', x: 230, y: 260 },
  { id: 'F', x: 380, y: 230 },
]
// Collision rects — visible r=22 + 1 px so the rect strictly contains the
// circle. Routes every candidate edge (incl. the "ghost" diagonals AE, BF,
// DF) around any other node that would clip the segment.
const NODE_R = 22
const RECT_R = NODE_R + 1
const TT_RECTS: NodeRect[] = NODES.map((n) => ({
  id: n.id,
  x: n.x - RECT_R,
  y: n.y - RECT_R,
  w: 2 * RECT_R,
  h: 2 * RECT_R,
}))
const TT_RECT_BY_ID = new Map(TT_RECTS.map((r) => [r.id, r]))
function routeTTEdge(a: string, b: string) {
  return routeEdge(TT_RECT_BY_ID.get(a)!, TT_RECT_BY_ID.get(b)!, TT_RECTS)
}

// All candidate edges we ever expose (some are "ghost", student adds them)
const ALL_EDGES: TEdge[] = [
  { id: 'AB', a: 'A', b: 'B' },
  { id: 'BC', a: 'B', b: 'C' },
  { id: 'BE', a: 'B', b: 'E' },
  { id: 'AD', a: 'A', b: 'D' },
  { id: 'CF', a: 'C', b: 'F' },
  { id: 'DE', a: 'D', b: 'E' },
  { id: 'EF', a: 'E', b: 'F' },
  { id: 'AE', a: 'A', b: 'E' },
  { id: 'BF', a: 'B', b: 'F' },
  { id: 'DF', a: 'D', b: 'F' },
]

type Preset = {
  key: string
  label: string
  on: string[]
  hint: string
}
const TREE_EDGES = ['AB', 'BC', 'BE', 'AD', 'CF'] // a spanning tree (5 = n-1)
const PRESETS: Preset[] = [
  {
    key: 'tree',
    label: 'Δένδρο',
    on: ['AB', 'BC', 'BE', 'AD', 'CF'],
    hint: 'Και οι τρεις ιδιότητες πράσινες — το γράφημα είναι δένδρο.',
  },
  {
    key: 'extra',
    label: '+1 ακμή → κύκλος',
    on: ['AB', 'BC', 'BE', 'AD', 'CF', 'DE'],
    hint: 'Πρόσθεσα την ακμή D–E. Δημιουργήθηκε κύκλος A–B–E–D–A: «ακυκλικό» πέφτει στο κόκκινο. «Συνεκτικό» μένει πράσινο. «n−1 ακμές» πέφτει στο κόκκινο (έχουμε n=6).',
  },
  {
    key: 'remove',
    label: '−1 ακμή → ασύνδετο',
    on: ['AB', 'BC', 'AD', 'CF'],
    hint: 'Αφαίρεσα την ακμή B–E. Η E (και κανείς άλλος εκτός) δεν συνδέεται πια — «συνεκτικό» πέφτει. «Ακυκλικό» μένει πράσινο. «n−1 ακμές» πέφτει (έχουμε n−2).',
  },
  {
    key: 'countOnly',
    label: 'n−1 ακμές, αλλά ΟΧΙ δένδρο',
    on: ['AB', 'BC', 'AE', 'CF', 'EF'],
    hint: 'Ακριβώς 5 = n−1 ακμές, αλλά υπάρχει κύκλος A–B–C–F–E–A ΚΑΙ η D είναι μόνη της. Δείχνει ότι η ιδιότητα «n−1 ακμές» μόνη της ΔΕΝ φτιάχνει δένδρο — χρειάζεσαι δύο από τις τρεις.',
  },
]

function neighboursOf(edges: TEdge[], on: Set<string>, id: string): string[] {
  const out: string[] = []
  for (const e of edges) {
    if (!on.has(e.id)) continue
    if (e.a === id) out.push(e.b)
    else if (e.b === id) out.push(e.a)
  }
  return out
}

function isConnected(on: Set<string>): boolean {
  if (NODES.length === 0) return true
  const start = NODES[0].id
  const seen = new Set([start])
  const stack = [start]
  while (stack.length) {
    const v = stack.pop()!
    for (const u of neighboursOf(ALL_EDGES, on, v)) {
      if (!seen.has(u)) {
        seen.add(u)
        stack.push(u)
      }
    }
  }
  return seen.size === NODES.length
}

/** does an active subgraph contain ANY cycle? DFS with parent. */
function hasCycle(on: Set<string>): boolean {
  const seen = new Set<string>()
  for (const root of NODES.map((n) => n.id)) {
    if (seen.has(root)) continue
    const stack: Array<{ v: string; parent: string | null }> = [
      { v: root, parent: null },
    ]
    seen.add(root)
    while (stack.length) {
      const { v, parent } = stack.pop()!
      for (const u of neighboursOf(ALL_EDGES, on, v)) {
        if (u === parent) continue
        if (seen.has(u)) return true
        seen.add(u)
        stack.push({ v: u, parent: v })
      }
    }
  }
  return false
}

/** find ONE cycle to highlight (set of edge ids around it), or null */
function findCycle(on: Set<string>): Set<string> | null {
  const stack: Array<{ v: string; parent: string | null; trail: string[] }> = []
  const seen = new Set<string>()
  for (const root of NODES.map((n) => n.id)) {
    if (seen.has(root)) continue
    seen.add(root)
    stack.push({ v: root, parent: null, trail: [] })
    const parentOf = new Map<string, string | null>([[root, null]])
    while (stack.length) {
      const { v, parent } = stack.pop()!
      for (const e of ALL_EDGES) {
        if (!on.has(e.id)) continue
        const u = e.a === v ? e.b : e.b === v ? e.a : null
        if (u === null) continue
        if (u === parent) continue
        if (seen.has(u)) {
          // cycle: walk u up to v via parentOf
          const cycleEdges = new Set<string>()
          cycleEdges.add(e.id)
          // backtrack: find LCA of v and u using parentOf
          const path = (start: string) => {
            const p: string[] = []
            let cur: string | null = start
            while (cur !== null) {
              p.push(cur)
              cur = parentOf.get(cur) ?? null
            }
            return p
          }
          const pv = path(v)
          const pu = path(u)
          const setU = new Set(pu)
          let lca: string | null = null
          for (const node of pv) {
            if (setU.has(node)) {
              lca = node
              break
            }
          }
          const collect = (start: string) => {
            let cur = start
            while (cur !== lca) {
              const par = parentOf.get(cur) ?? null
              if (par === null) break
              const edge = ALL_EDGES.find(
                (ed) =>
                  on.has(ed.id) &&
                  ((ed.a === cur && ed.b === par) ||
                    (ed.b === cur && ed.a === par)),
              )
              if (edge) cycleEdges.add(edge.id)
              cur = par
            }
          }
          collect(v)
          collect(u)
          return cycleEdges
        }
        seen.add(u)
        parentOf.set(u, v)
        stack.push({ v: u, parent: v, trail: [] })
      }
    }
  }
  return null
}

const N = NODES.length

export function TreeThreeProperties() {
  const [on, setOn] = useState<Set<string>>(new Set(TREE_EDGES))

  const m = on.size
  const connected = useMemo(() => isConnected(on), [on])
  const acyclic = useMemo(() => !hasCycle(on), [on])
  const countOK = m === N - 1
  const trueCount = [connected, acyclic, countOK].filter(Boolean).length
  const isTree = trueCount === 3

  const cycleSet = useMemo(() => (!acyclic ? findCycle(on) : null), [on, acyclic])

  // identify isolated/disconnected sub-component for highlight
  const compOf = useMemo(() => {
    const m = new Map<string, number>()
    let comp = 0
    for (const n of NODES) {
      if (m.has(n.id)) continue
      const seen = new Set([n.id])
      const stack = [n.id]
      while (stack.length) {
        const v = stack.pop()!
        for (const u of neighboursOf(ALL_EDGES, on, v)) {
          if (!seen.has(u)) {
            seen.add(u)
            stack.push(u)
          }
        }
      }
      for (const v of seen) m.set(v, comp)
      comp++
    }
    return m
  }, [on])
  const totalComps = new Set(compOf.values()).size

  function toggle(id: string) {
    setOn((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function preset(p: Preset) {
    setOn(new Set(p.on))
  }
  function reset() {
    setOn(new Set(TREE_EDGES))
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δένδρο = «οποιεσδήποτε δύο από τις τρεις»
        </div>
        <div className="inline-flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => preset(p)}
              className="rounded-md border border-border px-2 py-1 text-xs font-medium text-fg-subtle transition-colors hover:bg-bg-soft hover:text-fg"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Κάνε κλικ σε μια ακμή (συμπαγής → αφαίρεση, διακεκομμένη → προσθήκη). Οι
        τρεις δείκτες δεξιά ανανεώνονται ζωντανά.
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* graph */}
        <div className="graph-canvas">
          <svg
            viewBox="0 0 460 320"
            className="mx-auto block h-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {ALL_EDGES.map((e) => {
              const g = routeTTEdge(e.a, e.b)
              const isOn = on.has(e.id)
              const inCycle = cycleSet?.has(e.id) ?? false
              const stroke = inCycle ? '#dc2626' : isOn ? '#1c1214' : '#cfc6c5'
              const sw = inCycle ? 4.5 : isOn ? 3 : 1.5
              const dash = isOn ? undefined : '5 4'
              return (
                <g key={e.id}>
                  {g.kind === 'line' ? (
                    <>
                      <line
                        x1={g.x1}
                        y1={g.y1}
                        x2={g.x2}
                        y2={g.y2}
                        stroke={stroke}
                        strokeWidth={sw}
                        strokeDasharray={dash}
                        strokeLinecap="round"
                      />
                      <line
                        x1={g.x1}
                        y1={g.y1}
                        x2={g.x2}
                        y2={g.y2}
                        stroke="transparent"
                        strokeWidth={18}
                        className="cursor-pointer"
                        onClick={() => toggle(e.id)}
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d={g.d}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={sw}
                        strokeDasharray={dash}
                        strokeLinecap="round"
                      />
                      <path
                        d={g.d}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={18}
                        className="cursor-pointer"
                        onClick={() => toggle(e.id)}
                      />
                    </>
                  )}
                </g>
              )
            })}
            {NODES.map((n) => {
              const ci = compOf.get(n.id) ?? 0
              const baseFill = totalComps === 1 ? '#ffffff' : ci === 0 ? '#fde68a' : '#bfdbfe'
              const stroke = totalComps === 1 ? '#9b8a8d' : ci === 0 ? '#d97706' : '#2563eb'
              return (
                <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                  <circle r={22} fill={baseFill} stroke={stroke} strokeWidth={2.5} />
                  <text
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

        {/* indicators */}
        <div className="space-y-3">
          <Indicator
            ok={connected}
            label="Συνεκτικό"
            note={
              connected
                ? `1 συνιστώσα — όλοι φτάνουν σε όλους.`
                : `${totalComps} συνιστώσες — υπάρχουν κορυφές που δεν φτάνουν μεταξύ τους.`
            }
          />
          <Indicator
            ok={acyclic}
            label="Ακυκλικό"
            note={
              acyclic
                ? 'Κανένας κύκλος.'
                : 'Υπάρχει κύκλος — οι κόκκινες ακμές δείχνουν έναν.'
            }
          />
          <Indicator
            ok={countOK}
            label="Έχει n − 1 ακμές"
            note={`m = ${m}, n − 1 = ${N - 1}. ${
              m < N - 1
                ? `Λείπουν ${N - 1 - m}.`
                : m > N - 1
                  ? `Έχει ${m - (N - 1)} παραπάνω.`
                  : 'Ακριβώς n − 1.'
            }`}
          />

          {/* verdict bar */}
          <div
            className={cn(
              'rounded-lg border px-3 py-2.5 text-sm',
              isTree
                ? 'border-emerald-500/40 bg-emerald-50'
                : 'border-amber-500/40 bg-amber-50',
            )}
          >
            <div
              className={cn(
                'font-semibold',
                isTree ? 'text-emerald-800' : 'text-amber-900',
              )}
            >
              {isTree ? 'Δένδρο ✓' : `${trueCount} / 3 ιδιότητες αληθεύουν τώρα`}
            </div>
            <div
              className={cn(
                'mt-1 text-xs leading-relaxed',
                isTree ? 'text-emerald-900' : 'text-amber-900',
              )}
            >
              {isTree
                ? 'Και οι τρεις ιδιότητες πράσινες. Το γράφημα είναι δένδρο.'
                : trueCount === 2
                  ? 'Δύο πράσινες, μία κόκκινη; Δε γίνεται! Πειραματίσου — δεν θα βρεις περίπτωση που να ξεγλιστράει το θεώρημα. Αν δύο ισχύουν, ισχύει και η τρίτη.'
                  : 'Λίγα ικανοποιούνται για να είναι δένδρο — δοκίμασε να προσθέσεις/αφαιρέσεις ακμές.'}
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Επαναφορά στο δένδρο
          </button>
        </div>
      </div>
    </section>
  )
}

function Indicator({
  ok,
  label,
  note,
}: {
  ok: boolean
  label: string
  note: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2',
        ok
          ? 'border-emerald-500/40 bg-emerald-50'
          : 'border-rose-500/40 bg-rose-50',
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn('text-sm font-semibold', ok ? 'text-emerald-800' : 'text-rose-800')}>
          {label}
        </span>
        <span className={cn('font-mono text-lg font-bold', ok ? 'text-emerald-700' : 'text-rose-700')}>
          {ok ? '✓' : '✗'}
        </span>
      </div>
      <div className={cn('text-xs leading-relaxed', ok ? 'text-emerald-900' : 'text-rose-900')}>
        {note}
      </div>
    </div>
  )
}
