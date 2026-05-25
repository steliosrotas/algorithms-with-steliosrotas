/**
 * Shared forest layout for the L10 union-find visualisations.
 *
 * A union-find forest is nothing but a set of parent pointers: every
 * element points at its parent, and a root points at itself. layoutForest
 * turns such a map into screen coordinates — each tree drawn root-at-top,
 * children fanned out below, separate trees packed left to right — so
 * UnionFindForest, UnionBySizeRace and PathCompressionViz can all share one
 * tidy-tree placement and stay visually consistent.
 */

import type { NodeRect } from './edge-routing'

export type Pt = { x: number; y: number }

export type ForestLayout = {
  /** element id → pixel centre */
  pos: Map<string, Pt>
  /** element id → depth (number of edges up to its root) */
  depth: Map<string, number>
  /** roots, left to right */
  roots: string[]
  width: number
  height: number
  maxDepth: number
}

type LayoutOpts = {
  nodeGap?: number
  levelGap?: number
  /** gap between separate trees, measured in node-units */
  treeGap?: number
  padX?: number
  padY?: number
}

/** numeric-aware id comparison so '2' sorts before '10' */
function cmpId(a: string, b: string): number {
  const na = Number(a)
  const nb = Number(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a < b ? -1 : a > b ? 1 : 0
}

export function layoutForest(
  parent: Map<string, string>,
  opts: LayoutOpts = {},
): ForestLayout {
  const nodeGap = opts.nodeGap ?? 46
  const levelGap = opts.levelGap ?? 68
  const treeGap = opts.treeGap ?? 0.45
  const padX = opts.padX ?? 30
  const padY = opts.padY ?? 32

  const ids = [...parent.keys()]
  const children = new Map<string, string[]>()
  for (const id of ids) children.set(id, [])
  const roots: string[] = []
  for (const id of ids) {
    const p = parent.get(id)
    if (p === undefined || p === id) roots.push(id)
    else children.get(p)!.push(id)
  }
  for (const list of children.values()) list.sort(cmpId)
  roots.sort(cmpId)

  const unitX = new Map<string, number>()
  const depth = new Map<string, number>()
  let cursor = 0
  let maxDepth = 0

  function place(id: string, d: number): void {
    depth.set(id, d)
    if (d > maxDepth) maxDepth = d
    const kids = children.get(id) ?? []
    if (kids.length === 0) {
      unitX.set(id, cursor)
      cursor += 1
      return
    }
    for (const k of kids) place(k, d + 1)
    const first = unitX.get(kids[0])!
    const last = unitX.get(kids[kids.length - 1])!
    unitX.set(id, (first + last) / 2)
  }

  for (const r of roots) {
    place(r, 0)
    cursor += treeGap
  }

  const pos = new Map<string, Pt>()
  let maxX = 0
  for (const id of ids) {
    const x = padX + (unitX.get(id) ?? 0) * nodeGap
    const y = padY + (depth.get(id) ?? 0) * levelGap
    pos.set(id, { x, y })
    if (x > maxX) maxX = x
  }

  return {
    pos,
    depth,
    roots,
    width: maxX + padX,
    height: padY + maxDepth * levelGap + padY,
    maxDepth,
  }
}

/**
 * Build collision-aware `NodeRect[]` from a `ForestLayout` for use with
 * `routeEdge()` (Phase E.4.6 edge routing). Each circular node becomes its
 * bounding square `2·nodeR` wide centred at `pos`. Optional `(ox, oy)`
 * shifts the rects into an absolute SVG coordinate frame (used by
 * `UnionBySizeRace`, which stacks two forests on the same SVG).
 *
 * Returns both the array (for `allNodes` arg) and a Map keyed by element id
 * (for endpoint lookup in a per-file `routedEdge` helper).
 */
export function forestNodeRects(
  layout: ForestLayout,
  nodeR: number,
  ox: number = 0,
  oy: number = 0,
): { rects: NodeRect[]; rectById: Map<string, NodeRect> } {
  const rects: NodeRect[] = []
  const rectById = new Map<string, NodeRect>()
  for (const [id, p] of layout.pos.entries()) {
    const r: NodeRect = {
      id,
      x: p.x + ox - nodeR,
      y: p.y + oy - nodeR,
      w: 2 * nodeR,
      h: 2 * nodeR,
    }
    rects.push(r)
    rectById.set(id, r)
  }
  return { rects, rectById }
}
