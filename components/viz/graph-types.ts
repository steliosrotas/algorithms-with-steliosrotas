/**
 * Shared graph data + types for the algorithm visualisations.
 *
 * `L06_GRAPH` is the 8-vertex graph introduced in L06 and reused throughout
 * the graph lectures (L07 BFS/DFS traces, and later L08/L09). Keeping it here
 * as one constant means every visualization and every worked trace agrees on
 * the same vertices, edges and adjacency order — no drift between a diagram
 * and the prose that describes it.
 */

import { routeEdge, type EdgeGeom, type NodeRect } from './edge-routing'

export type GraphNodeId = number

export type GraphNode = {
  id: GraphNodeId
  /** SVG coordinates inside the graph's `viewBox`. */
  x: number
  y: number
  /** Display label; defaults to the id. */
  label?: string
}

export type GraphEdge = {
  a: GraphNodeId
  b: GraphNodeId
}

export type GraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  /** SVG viewBox, e.g. "0 0 600 420". */
  viewBox: string
}

/**
 * Visual state of a node during a traversal trace.
 * - `idle`     — not yet touched
 * - `frontier` — discovered, waiting in the queue / on the stack
 * - `active`   — being processed right now
 * - `visited`  — fully processed
 * - `error`    — the learner clicked it out of turn
 */
export type NodeStatus = 'idle' | 'frontier' | 'active' | 'visited' | 'error'

/**
 * The L06 graph: V = {1..8}, m = 11 edges. Natural drawing layout — the
 * same picture used in the L06/L07 lecture slides.
 */
export const L06_GRAPH: GraphData = {
  viewBox: '0 0 600 430',
  nodes: [
    { id: 1, x: 235, y: 64 },
    { id: 2, x: 130, y: 192 },
    { id: 3, x: 332, y: 186 },
    { id: 4, x: 112, y: 322 },
    { id: 5, x: 286, y: 322 },
    { id: 6, x: 286, y: 388 },
    { id: 7, x: 470, y: 72 },
    { id: 8, x: 476, y: 252 },
  ],
  edges: [
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 2, b: 3 },
    { a: 2, b: 4 },
    { a: 2, b: 5 },
    { a: 3, b: 5 },
    { a: 3, b: 7 },
    { a: 3, b: 8 },
    { a: 4, b: 5 },
    { a: 5, b: 6 },
    { a: 7, b: 8 },
  ],
}

/**
 * The same graph, laid out by BFS level with root s = 1. Used for the
 * banded "BFS levels" diagram. Levels: L0={1}, L1={2,3}, L2={4,5,7,8},
 * L3={6}.
 */
export const L06_BFS_TREE: GraphData = {
  viewBox: '0 0 620 400',
  nodes: [
    { id: 1, x: 310, y: 58 },
    { id: 2, x: 210, y: 150 },
    { id: 3, x: 410, y: 150 },
    { id: 4, x: 108, y: 242 },
    { id: 5, x: 250, y: 242 },
    { id: 7, x: 392, y: 242 },
    { id: 8, x: 524, y: 242 },
    { id: 6, x: 250, y: 334 },
  ],
  edges: L06_GRAPH.edges,
}

/** Adjacency in ascending-id order — the canonical neighbour order for traces. */
export function neighbors(graph: GraphData, id: GraphNodeId): GraphNodeId[] {
  const out: GraphNodeId[] = []
  for (const e of graph.edges) {
    if (e.a === id) out.push(e.b)
    else if (e.b === id) out.push(e.a)
  }
  return out.sort((p, q) => p - q)
}

/** Order-independent key for an edge, so {a,b} and {b,a} compare equal. */
export function edgeKey(a: GraphNodeId, b: GraphNodeId): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

/** True when edge `e` is the edge between `a` and `b` (in either direction). */
export function sameEdge(e: GraphEdge, a: GraphNodeId, b: GraphNodeId): boolean {
  return edgeKey(e.a, e.b) === edgeKey(a, b)
}

/**
 * Conservative collision-rect radius for the L06_GRAPH consumers. Picked one
 * pixel above the largest visible node radius across the family
 * (`GraphRepresentations` and `DfsTreeBuilder` use r=23; the rest use r=22),
 * so the routed edge stays clear of every consumer's circles regardless of
 * the radius the caller draws with. The 4 px collision padding inside
 * `routeEdge` is applied on top.
 */
const L06_GRAPH_RECT_R = 24
const L06_BFS_TREE_RECT_R = 23

function buildRects(
  nodes: ReadonlyArray<{ id: GraphNodeId; x: number; y: number }>,
  r: number,
): NodeRect[] {
  return nodes.map((n) => ({
    id: n.id,
    x: n.x - r,
    y: n.y - r,
    w: 2 * r,
    h: 2 * r,
  }))
}

const L06_GRAPH_RECTS = buildRects(L06_GRAPH.nodes, L06_GRAPH_RECT_R)
const L06_BFS_TREE_RECTS = buildRects(L06_BFS_TREE.nodes, L06_BFS_TREE_RECT_R)
const L06_GRAPH_RECT_BY_ID = new Map(L06_GRAPH_RECTS.map((r) => [r.id, r]))
const L06_BFS_TREE_RECT_BY_ID = new Map(L06_BFS_TREE_RECTS.map((r) => [r.id, r]))

/**
 * Collision-aware edge geometry for any pair of vertices on the canonical
 * L06_GRAPH layout. Returns a straight `kind: 'line'` segment (centre-to-
 * centre — byte-identical to the existing direct `<line>` rendering) when
 * the segment clears every non-endpoint node, or a quadratic Bezier
 * `kind: 'curve'` that bulges around the closest in-the-way node otherwise.
 *
 * Consumers branch on `g.kind === 'line' ? <line …> : <path d={g.d} … />`
 * — styling, stroke, animation are unchanged. See `edge-routing.ts` for the
 * routing algorithm and `plans/E_EDGE_ROUTING_AUDIT.md` for the wider Phase
 * E.4.6 retrofit.
 */
export function routeL06GraphEdge(a: GraphNodeId, b: GraphNodeId): EdgeGeom {
  const ra = L06_GRAPH_RECT_BY_ID.get(a)
  const rb = L06_GRAPH_RECT_BY_ID.get(b)
  if (!ra || !rb) {
    throw new Error(`routeL06GraphEdge: unknown vertex id ${ra ? b : a}`)
  }
  return routeEdge(ra, rb, L06_GRAPH_RECTS)
}

/**
 * Collision-aware edge geometry on the BFS-levels layout of the same graph
 * (`L06_BFS_TREE`). Same line-vs-curve contract as `routeL06GraphEdge`.
 */
export function routeL06BfsTreeEdge(a: GraphNodeId, b: GraphNodeId): EdgeGeom {
  const ra = L06_BFS_TREE_RECT_BY_ID.get(a)
  const rb = L06_BFS_TREE_RECT_BY_ID.get(b)
  if (!ra || !rb) {
    throw new Error(`routeL06BfsTreeEdge: unknown vertex id ${ra ? b : a}`)
  }
  return routeEdge(ra, rb, L06_BFS_TREE_RECTS)
}
