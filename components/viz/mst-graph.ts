/**
 * Shared weighted graph for the L09 MST visualisations.
 *
 * CutExplorer, ExchangeArgumentViz, PrimAnimator and KruskalAnimator all draw
 * the SAME graph — so a student watches one tree get built and proven four
 * different ways, and recognises it each time.
 *
 * It is a wheel graph: an outer 6-cycle A–B–E–G–F–C plus a hub D joined to
 * every rim vertex (12 edges). The drawing is planar — no edge crossings. All
 * 12 weights are distinct, so the minimum spanning tree is unique:
 *
 *   MST = { E-G 1, C-F 2, A-C 3, C-D 4, B-E 6, A-B 7 },  total cost 23.
 */

import { routeEdge, type NodeRect } from './edge-routing'

export type MstNode = { id: string; x: number; y: number }
export type MstEdge = { id: string; a: string; b: string; w: number }

export const MST_NODES: MstNode[] = [
  { id: 'A', x: 98, y: 60 },
  { id: 'B', x: 362, y: 60 },
  { id: 'C', x: 66, y: 196 },
  { id: 'D', x: 230, y: 188 },
  { id: 'E', x: 394, y: 196 },
  { id: 'F', x: 150, y: 320 },
  { id: 'G', x: 310, y: 320 },
]

/** Edge id is always the two endpoints in alphabetical order, joined by '-'. */
export const MST_EDGES: MstEdge[] = [
  // outer 6-cycle
  { id: 'A-B', a: 'A', b: 'B', w: 7 },
  { id: 'B-E', a: 'B', b: 'E', w: 6 },
  { id: 'E-G', a: 'E', b: 'G', w: 1 },
  { id: 'F-G', a: 'F', b: 'G', w: 12 },
  { id: 'C-F', a: 'C', b: 'F', w: 2 },
  { id: 'A-C', a: 'A', b: 'C', w: 3 },
  // spokes to the hub D
  { id: 'A-D', a: 'A', b: 'D', w: 5 },
  { id: 'B-D', a: 'B', b: 'D', w: 8 },
  { id: 'C-D', a: 'C', b: 'D', w: 4 },
  { id: 'D-E', a: 'D', b: 'E', w: 9 },
  { id: 'D-F', a: 'D', b: 'F', w: 10 },
  { id: 'D-G', a: 'D', b: 'G', w: 11 },
]

/** The six edges of the (unique) minimum spanning tree. */
export const MST_TREE_IDS: ReadonlySet<string> = new Set([
  'E-G',
  'C-F',
  'A-C',
  'C-D',
  'B-E',
  'A-B',
])

export const MST_TOTAL = 23

export const MST_POS = new Map(MST_NODES.map((n) => [n.id, n]))
export const MST_EDGE_BY_ID = new Map(MST_EDGES.map((e) => [e.id, e]))
export const MST_NODE_R = 21
export const MST_VIEW = { w: 460, h: 384 }

/** Canonical edge id for an unordered pair of vertices. */
export function edgeId(u: string, v: string): string {
  return u < v ? `${u}-${v}` : `${v}-${u}`
}

/** The other endpoint of an edge. */
export function other(e: MstEdge, u: string): string {
  return e.a === u ? e.b : e.a
}

/**
 * Endpoints of an edge trimmed to the node-circle border, plus the midpoint
 * where a weight label sits.
 */
export function trimmedEdge(a: MstNode, b: MstNode, r = MST_NODE_R) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  return {
    x1: a.x + ux * r,
    y1: a.y + uy * r,
    x2: b.x - ux * r,
    y2: b.y - uy * r,
    mx: (a.x + b.x) / 2,
    my: (a.y + b.y) / 2,
  }
}

/**
 * Bounding-square AABB per MST node, ready to feed `routeEdge`. Pre-computed
 * once at module scope so per-edge calls don't reallocate. Conservative for
 * circular nodes (the corners of the square poke out past the circle), but
 * correct: any collision the square triggers IS a collision with the circle
 * plus padding, never the reverse.
 */
const MST_RECTS: ReadonlyArray<NodeRect> = MST_NODES.map((n) => ({
  id: n.id,
  x: n.x - MST_NODE_R,
  y: n.y - MST_NODE_R,
  w: MST_NODE_R * 2,
  h: MST_NODE_R * 2,
}))

const MST_RECT_BY_ID = new Map(MST_RECTS.map((r) => [r.id, r] as const))

/**
 * Geometry for an MST edge — either a straight trimmed segment (the common
 * case for the planar wheel layout) or a quadratic Bezier curving around an
 * unrelated node (the structural lockout against the
 * `RiverCrossingStateGraph` class of bug, see [[phase-e46-edge-routing]]).
 *
 * Both variants expose `mx`/`my` for label placement and `x1,y1,x2,y2` for
 * any halo / underlay that wants centre-to-centre coordinates. Consumers
 * branch on `kind`: line → render `<line>`; curve → render
 * `<path d={d} fill="none">`.
 */
export type MstEdgeGeom =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; mx: number; my: number }
  | { kind: 'curve'; d: string; x1: number; y1: number; x2: number; y2: number; mx: number; my: number }

/**
 * Collision-aware edge routing on the shared MST layout. Returns a straight
 * line trimmed to the circle borders when the segment between two nodes clears
 * every other node (the steady-state case for the planar wheel); otherwise a
 * quadratic Bezier that curves around the obstructing node, with the label
 * anchor moved to the Bezier midpoint `(P0 + 2Q + P2) / 4` so the weight chip
 * tracks the bend.
 */
export function routeMstEdge(a: MstNode, b: MstNode, r = MST_NODE_R): MstEdgeGeom {
  const rectA = MST_RECT_BY_ID.get(a.id) ?? rectOf(a, r)
  const rectB = MST_RECT_BY_ID.get(b.id) ?? rectOf(b, r)
  const geom = routeEdge(rectA, rectB, MST_RECTS)

  if (geom.kind === 'line') {
    const trim = trimmedEdge(a, b, r)
    return {
      kind: 'line',
      x1: trim.x1,
      y1: trim.y1,
      x2: trim.x2,
      y2: trim.y2,
      mx: trim.mx,
      my: trim.my,
    }
  }

  return {
    kind: 'curve',
    d: geom.d,
    x1: a.x,
    y1: a.y,
    x2: b.x,
    y2: b.y,
    mx: (a.x + 2 * geom.cx + b.x) / 4,
    my: (a.y + 2 * geom.cy + b.y) / 4,
  }
}

function rectOf(n: MstNode, r: number): NodeRect {
  return { id: n.id, x: n.x - r, y: n.y - r, w: r * 2, h: r * 2 }
}

/**
 * Build an adjacency map id → incident edges (undirected).
 */
export function mstAdjacency(): Map<string, MstEdge[]> {
  const adj = new Map<string, MstEdge[]>()
  for (const n of MST_NODES) adj.set(n.id, [])
  for (const e of MST_EDGES) {
    adj.get(e.a)!.push(e)
    adj.get(e.b)!.push(e)
  }
  return adj
}

/**
 * The connected components of a sub-graph given by a set of edge ids,
 * returned as id → representative (the alphabetically smallest member).
 */
export function componentsOf(edgeIds: ReadonlySet<string>): Map<string, string> {
  const rep = new Map<string, string>()
  for (const n of MST_NODES) rep.set(n.id, n.id)
  const find = (x: string): string => {
    let r = x
    while (rep.get(r) !== r) r = rep.get(r)!
    return r
  }
  for (const e of MST_EDGES) {
    if (!edgeIds.has(e.id)) continue
    const ra = find(e.a)
    const rb = find(e.b)
    if (ra === rb) continue
    // keep the alphabetically smaller representative
    if (ra < rb) rep.set(rb, ra)
    else rep.set(ra, rb)
  }
  const out = new Map<string, string>()
  for (const n of MST_NODES) out.set(n.id, find(n.id))
  return out
}

/**
 * Seven fixed component colours, indexed by node A…G. A connected component
 * is always drawn in the colour of its alphabetically-smallest member, so the
 * colour is stable: when two components merge, the lower-lettered one wins.
 */
export const MST_COMP_COLORS: { fill: string; stroke: string }[] = [
  { fill: '#fda4af', stroke: '#e11d48' }, // A — rose
  { fill: '#7dd3fc', stroke: '#0284c7' }, // B — sky
  { fill: '#fcd34d', stroke: '#ca8a04' }, // C — amber
  { fill: '#c4b5fd', stroke: '#7c3aed' }, // D — violet
  { fill: '#6ee7b7', stroke: '#047857' }, // E — emerald
  { fill: '#fdba74', stroke: '#ea580c' }, // F — orange
  { fill: '#cbd5e1', stroke: '#475569' }, // G — slate
]

/** Colour for the component whose representative is `rep` (a node id A…G). */
export function compColor(rep: string): { fill: string; stroke: string } {
  const idx = rep.charCodeAt(0) - 65 // 'A' → 0
  return MST_COMP_COLORS[Math.max(0, Math.min(6, idx))]
}
