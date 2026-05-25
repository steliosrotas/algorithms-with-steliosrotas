'use client'

/**
 * RootedTreeReroot — the same tree, rooted at any vertex you pick (L06).
 *
 * Replaces the static rooted-tree SVG. The point: rooting is a CHOICE.
 * Pick any vertex as root, the tree re-hangs from there, and the
 * parent/child/leaf structure is recomputed. The same edge set; different
 * root → different hierarchy.
 *
 * Layout: BFS from the root assigns each vertex to a level. Within a
 * level we order vertices by their parent's x then by id, then spread the
 * level evenly. Parent edges point upward. Hover (or click) a vertex on
 * the right panel to see its parent / children / depth.
 *
 * Built for L06.
 */

import { useMemo, useState } from 'react'
import { routeEdge, type NodeRect } from './edge-routing'

type RNode = { id: string }
type REdge = { a: string; b: string }

// 7-vertex tree: A — B, C; B — D, E; C — F, G  (root-as-A starter)
const NODES: RNode[] = [
  { id: 'A' },
  { id: 'B' },
  { id: 'C' },
  { id: 'D' },
  { id: 'E' },
  { id: 'F' },
  { id: 'G' },
]
const EDGES: REdge[] = [
  { a: 'A', b: 'B' },
  { a: 'A', b: 'C' },
  { a: 'B', b: 'D' },
  { a: 'B', b: 'E' },
  { a: 'C', b: 'F' },
  { a: 'C', b: 'G' },
]

function neighbours(id: string): string[] {
  const out: string[] = []
  for (const e of EDGES) {
    if (e.a === id) out.push(e.b)
    else if (e.b === id) out.push(e.a)
  }
  return out
}

type RootedView = {
  parent: Map<string, string | null>
  children: Map<string, string[]>
  depth: Map<string, number>
  levels: string[][]
}

function rootAt(root: string): RootedView {
  const parent = new Map<string, string | null>()
  const children = new Map<string, string[]>()
  const depth = new Map<string, number>()
  for (const n of NODES) children.set(n.id, [])

  parent.set(root, null)
  depth.set(root, 0)
  let frontier = [root]
  const levels: string[][] = [[root]]
  const seen = new Set([root])
  while (frontier.length) {
    const next: string[] = []
    for (const v of frontier) {
      for (const u of neighbours(v)) {
        if (seen.has(u)) continue
        seen.add(u)
        parent.set(u, v)
        children.get(v)!.push(u)
        depth.set(u, (depth.get(v) ?? 0) + 1)
        next.push(u)
      }
    }
    if (next.length) levels.push(next)
    frontier = next
  }
  // sort each level by parent id then by id (deterministic layout)
  for (const lvl of levels) {
    lvl.sort((a, b) => {
      const pa = parent.get(a) ?? ''
      const pb = parent.get(b) ?? ''
      if (pa !== pb) return pa < pb ? -1 : 1
      return a < b ? -1 : 1
    })
  }
  return { parent, children, depth, levels }
}

const W = 540
const H = 320
const TOP = 36
const BOT = H - 36

function layout(view: RootedView): Map<string, { x: number; y: number }> {
  const pos = new Map<string, { x: number; y: number }>()
  const maxDepth = view.levels.length - 1
  const stepY = maxDepth > 0 ? (BOT - TOP) / maxDepth : 0
  view.levels.forEach((lvl, i) => {
    const y = TOP + i * stepY
    const n = lvl.length
    lvl.forEach((id, j) => {
      const x = ((j + 1) * W) / (n + 1)
      pos.set(id, { x, y })
    })
  })
  return pos
}

export function RootedTreeReroot() {
  const [root, setRoot] = useState<string>('A')
  const [hover, setHover] = useState<string | null>(null)

  const view = useMemo(() => rootAt(root), [root])
  const pos = useMemo(() => layout(view), [view])

  // Collision rects rebuild per root because the layout itself does. Visible
  // r=17 + 1 px = 18 for the AABB. Lets any future re-rooting that puts a
  // sibling on a parent-edge centreline auto-curve.
  const nodeRects = useMemo<NodeRect[]>(() => {
    const out: NodeRect[] = []
    for (const [id, p] of pos.entries()) {
      out.push({ id, x: p.x - 18, y: p.y - 18, w: 36, h: 36 })
    }
    return out
  }, [pos])
  const rectById = useMemo(() => new Map(nodeRects.map((r) => [r.id, r])), [nodeRects])

  const focused = hover ?? root
  const parent = view.parent.get(focused) ?? null
  const kids = view.children.get(focused) ?? []
  const d = view.depth.get(focused) ?? 0
  const isLeaf = kids.length === 0 && focused !== root

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δένδρο με ρίζα — διάλεξε ρίζα, το δένδρο ξανακρεμιέται
        </div>
        <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Ρίζα: {root}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Το ίδιο σύνολο 6 ακμών — μόνο η <em>ρίζα</em> αλλάζει. Κλικ σε
        οποιαδήποτε κορυφή για να την κάνεις ρίζα· οι έννοιες «γονέας»,
        «παιδί», «φύλλο» ορίζονται με βάση την επιλογή σου.
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* drawing */}
        <div className="graph-canvas">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto block h-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* edges */}
            {EDGES.map((e, i) => {
              const rA = rectById.get(e.a)!
              const rB = rectById.get(e.b)!
              const g = routeEdge(rA, rB, nodeRects)
              const childA = view.parent.get(e.a) === e.b
              const childB = view.parent.get(e.b) === e.a
              const onPathToFocused =
                (focused === e.a && view.parent.get(e.a) === e.b) ||
                (focused === e.b && view.parent.get(e.b) === e.a)
              const stroke = onPathToFocused
                ? '#9f1239'
                : childA || childB
                  ? '#3f3535'
                  : '#cdc6c5'
              const sw = onPathToFocused ? 4 : 2.5
              return g.kind === 'line' ? (
                <line
                  key={`re${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`re${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
              )
            })}
            {NODES.map((n) => {
              const p = pos.get(n.id)!
              const isRoot = n.id === root
              const childrenOf = view.children.get(n.id) ?? []
              const isLeafLocal = childrenOf.length === 0 && !isRoot
              const fill = isRoot ? '#9f1239' : isLeafLocal ? '#d1fae5' : '#ffffff'
              const stroke = isRoot ? '#7e1031' : isLeafLocal ? '#16a34a' : '#9b8a8d'
              const txt = isRoot ? '#ffffff' : isLeafLocal ? '#065f46' : '#1c1214'
              const isFoc = n.id === focused
              return (
                <g
                  key={`rn${n.id}`}
                  transform={`translate(${p.x} ${p.y})`}
                  className="cursor-pointer"
                  onClick={() => setRoot(n.id)}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Κορυφή ${n.id}`}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      setRoot(n.id)
                    }
                  }}
                >
                  <circle r={22} fill="transparent" />
                  {isFoc && (
                    <circle r={21} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
                  )}
                  <circle r={17} fill={fill} stroke={stroke} strokeWidth={2.5} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={700}
                    fill={txt}
                  >
                    {n.id}
                  </text>
                  {/* depth tag */}
                  <text
                    x={0}
                    y={-22}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={600}
                    fill="#9b8a8d"
                  >
                    d={view.depth.get(n.id) ?? '—'}
                  </text>
                </g>
              )
            })}
            {/* "ρίζα" tag */}
            <text
              x={pos.get(root)!.x + 24}
              y={pos.get(root)!.y - 16}
              fontSize={11}
              fontWeight={700}
              fill="#9f1239"
            >
              ρίζα
            </text>
          </svg>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-[11px] text-fg-subtle">
            <LegendDot color="#9f1239" label="ρίζα" />
            <LegendDot color="#d1fae5" stroke="#16a34a" label="φύλλο (χωρίς παιδιά)" />
            <LegendDot color="#ffffff" stroke="#9b8a8d" label="ενδιάμεση" />
          </div>
        </div>

        {/* focused info */}
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
            <div className="mb-1 text-[11px] uppercase tracking-wider text-fg-subtle">
              Επιλεγμένη κορυφή
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-fg">{focused}</span>
              <span className="text-xs text-fg-subtle">
                βάθος d = {d}
                {focused === root && ' (ρίζα)'}
                {isLeaf && ' · φύλλο'}
              </span>
            </div>
          </div>
          <Pair label="Γονέας" value={parent ?? '— (είναι ρίζα)'} />
          <Pair
            label="Παιδιά"
            value={kids.length === 0 ? '— (είναι φύλλο)' : kids.join(', ')}
          />

          <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
            Πάτα μια άλλη κορυφή για να γίνει αυτή η ρίζα — οι ακμές δεν αλλάζουν,
            αλλά οι ρόλοι (γονέας/παιδί/φύλλο) ανακαθορίζονται. Αυτό κρύβει το
            ότι το «ριζωμένο δένδρο» είναι το αρχικό δένδρο <em>συν μία επιλογή</em>.
          </div>
        </div>
      </div>
    </section>
  )
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-sm font-semibold text-fg">{value}</div>
    </div>
  )
}

function LegendDot({
  color,
  stroke,
  label,
}: {
  color: string
  stroke?: string
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-3 w-3 rounded-full"
        style={{ background: color, border: `1.5px solid ${stroke ?? color}` }}
      />
      {label}
    </span>
  )
}
