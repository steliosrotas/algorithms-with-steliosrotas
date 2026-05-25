import { describe, expect, it } from 'vitest'
import {
  curveClearsAll,
  perpDistance,
  routeEdge,
  segmentIntersectsRect,
  trimEdgeGeom,
  type NodeRect,
} from './edge-routing'
import {
  MST_EDGES,
  MST_NODES,
  MST_NODE_R,
  MST_POS,
  routeMstEdge,
  trimmedEdge,
} from './mst-graph'

// Two 64×28 rectangles at column-2 (x=200) and column-3 (x=340), centred
// rows. Mirrors the RiverCrossingStateGraph layout shape so the regression
// case below is faithful.
function rect(id: string | number, cx: number, cy: number, w = 64, h = 28): NodeRect {
  return { id, x: cx - w / 2, y: cy - h / 2, w, h }
}

describe('routeEdge — straight case', () => {
  it('returns a line when no other node sits on the path', () => {
    const a = rect('a', 100, 100)
    const b = rect('b', 400, 100)
    const c = rect('c', 250, 250) // far below the line
    const out = routeEdge(a, b, [a, b, c])
    expect(out.kind).toBe('line')
    if (out.kind === 'line') {
      expect(out.x1).toBeCloseTo(100)
      expect(out.y1).toBeCloseTo(100)
      expect(out.x2).toBeCloseTo(400)
      expect(out.y2).toBeCloseTo(100)
    }
  })

  it('ignores nodes that share an endpoint id', () => {
    // A node with id 'a' that is geometrically distinct from rect a (matches
    // the case where the data accidentally re-uses an endpoint id). It still
    // gets excluded from collision testing — that is the contract.
    const a = rect('a', 100, 100)
    const b = rect('b', 400, 100)
    const sneaky: NodeRect = { id: 'a', x: 220, y: 88, w: 60, h: 24 }
    const out = routeEdge(a, b, [a, b, sneaky])
    expect(out.kind).toBe('line')
  })

  it('handles coincident endpoints without throwing', () => {
    const a = rect('a', 100, 100)
    const b = rect('b', 100, 100)
    const out = routeEdge(a, b, [a, b])
    expect(out.kind).toBe('line')
  })
})

describe('routeEdge — collision case', () => {
  it('curves around a node sitting on the straight line', () => {
    const a = rect('a', 100, 100)
    const b = rect('b', 500, 100)
    const blocker = rect('mid', 300, 100) // dead centre on the line
    const out = routeEdge(a, b, [a, b, blocker])
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(out.d).toMatch(/^M [\d.]+ [\d.]+ Q [\d.]+ [\d.]+ [\d.]+ [\d.]+$/)
      // Curve control point must sit off the segment line.
      expect(perpDistance(100, 100, 500, 100, out.cx, out.cy)).toBeGreaterThan(20)
      // And the resulting curve must actually clear the blocker.
      expect(
        curveClearsAll(100, 100, out.cx, out.cy, 500, 100, [blocker], 4),
      ).toBe(true)
    }
  })

  it('regression: RCSG long-horizontal edge curves around the col-2 box', () => {
    // Faithful reconstruction of the {C}↔{B,C,G} edge from
    // RiverCrossingStateGraph: col-1 node {C} at (200, 130), col-3 node
    // {B,C,G} at (480, 130), with {B,G} sitting in col-2 at (340, 130).
    // The straight edge runs through the {B,G} rect; routeEdge must bend it.
    const c = rect('C', 200, 130)
    const bcg = rect('BCG', 480, 130)
    const bg = rect('BG', 340, 130)
    const allNodes: NodeRect[] = [c, bcg, bg]
    const out = routeEdge(c, bcg, allNodes)
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(
        curveClearsAll(200, 130, out.cx, out.cy, 480, 130, [bg], 4),
      ).toBe(true)
    }
  })

  it('breaks ties by curving away from the centroid of other nodes', () => {
    // Cluster below the segment line; expect the curve to go UP (cy < 100).
    const a = rect('a', 100, 100)
    const b = rect('b', 500, 100)
    const blocker = rect('blocker', 300, 100) // on the line — sigma=0 tie
    const cluster = [
      rect('c1', 200, 220),
      rect('c2', 300, 220),
      rect('c3', 400, 220),
    ]
    const out = routeEdge(a, b, [a, b, blocker, ...cluster])
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(out.cy).toBeLessThan(100)
    }
  })

  it('curves away from multiple in-the-way nodes on the same side', () => {
    const a = rect('a', 60, 100)
    const b = rect('b', 540, 100)
    const m1 = rect('m1', 220, 100)
    const m2 = rect('m2', 380, 100)
    const out = routeEdge(a, b, [a, b, m1, m2])
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(
        curveClearsAll(60, 100, out.cx, out.cy, 540, 100, [m1, m2], 4),
      ).toBe(true)
    }
  })
})

describe('segmentIntersectsRect', () => {
  it('detects a horizontal segment passing through a rect', () => {
    const r = rect('r', 200, 100)
    expect(segmentIntersectsRect(0, 100, 400, 100, r, 0)).toBe(true)
  })

  it('returns false when the segment runs clear of the rect', () => {
    const r = rect('r', 200, 100)
    expect(segmentIntersectsRect(0, 200, 400, 200, r, 0)).toBe(false)
  })

  it('respects the padding parameter (near-miss becomes hit)', () => {
    const r = rect('r', 200, 100) // y-extent: 86..114
    // y=120 is 6 px below the rect's bottom edge.
    expect(segmentIntersectsRect(0, 120, 400, 120, r, 0)).toBe(false)
    expect(segmentIntersectsRect(0, 120, 400, 120, r, 8)).toBe(true)
  })

  it('detects an endpoint sitting inside the rect', () => {
    const r = rect('r', 200, 100)
    expect(segmentIntersectsRect(200, 100, 600, 100, r, 0)).toBe(true)
  })

  it('handles a segment parallel to a slab that runs alongside the rect', () => {
    const r = rect('r', 200, 100)
    // Vertical segment with dx==0, sitting clear of the rect's x-extent.
    expect(segmentIntersectsRect(500, 0, 500, 400, r, 0)).toBe(false)
    // Same vertical segment, on top of the rect's x-extent.
    expect(segmentIntersectsRect(200, 0, 200, 400, r, 0)).toBe(true)
  })
})

describe('perpDistance', () => {
  it('returns 0 for a point on the line', () => {
    expect(perpDistance(0, 0, 10, 0, 5, 0)).toBeCloseTo(0)
  })

  it('returns the y-offset for a horizontal line', () => {
    expect(perpDistance(0, 0, 10, 0, 5, 3)).toBeCloseTo(3)
  })

  it('falls back to point-to-point distance for a degenerate segment', () => {
    expect(perpDistance(5, 5, 5, 5, 8, 9)).toBeCloseTo(5)
  })
})

describe('trimEdgeGeom', () => {
  it('trims a line to circles of radius rA / rB along the segment direction', () => {
    const geom = { kind: 'line' as const, x1: 0, y1: 0, x2: 100, y2: 0 }
    const trimmed = trimEdgeGeom(geom, 0, 0, 10, 100, 0, 20)
    expect(trimmed.kind).toBe('line')
    if (trimmed.kind === 'line') {
      expect(trimmed.x1).toBeCloseTo(10)
      expect(trimmed.y1).toBeCloseTo(0)
      expect(trimmed.x2).toBeCloseTo(80)
      expect(trimmed.y2).toBeCloseTo(0)
    }
  })

  it('trims a curve along tangent directions and keeps the control point', () => {
    // Quadratic Bezier from (0,0) via (50, -40) to (100, 0).
    // Tangent at source = (50, -40); at target = (50, 40). Both have length
    // sqrt(50² + 40²) ≈ 64.03; trimming by 10 moves the endpoints 10/64.03 of
    // the way along each tangent.
    const geom = { kind: 'curve' as const, d: '', cx: 50, cy: -40 }
    const trimmed = trimEdgeGeom(geom, 0, 0, 10, 100, 0, 10)
    expect(trimmed.kind).toBe('curve')
    if (trimmed.kind === 'curve') {
      expect(trimmed.cx).toBe(50)
      expect(trimmed.cy).toBe(-40)
      // d-string should contain the new endpoints and the original Q.
      expect(trimmed.d).toMatch(/^M [\d.-]+ [\d.-]+ Q 50 -40 [\d.-]+ [\d.-]+$/)
    }
  })

  it('does not divide by zero on a zero-length tangent', () => {
    const geom = { kind: 'curve' as const, d: '', cx: 0, cy: 0 }
    expect(() => trimEdgeGeom(geom, 0, 0, 10, 100, 0, 10)).not.toThrow()
  })
})

describe('routeMstEdge — MST layout', () => {
  it('every MST_EDGES entry routes as a straight line on the current planar layout', () => {
    // The shared L09 wheel is planar by construction — no edge passes through
    // an unrelated node. A regression here means someone has moved a node or
    // added an edge that introduces a collision, which the line/curve split
    // is supposed to catch.
    for (const e of MST_EDGES) {
      const A = MST_POS.get(e.a)!
      const B = MST_POS.get(e.b)!
      const geom = routeMstEdge(A, B)
      expect(geom.kind, `edge ${e.id} unexpectedly bent`).toBe('line')
      if (geom.kind === 'line') {
        const ref = trimmedEdge(A, B)
        // Line case must be byte-identical to the legacy trimmedEdge output —
        // that's the contract that lets every consumer migrate without any
        // visual change in steady state.
        expect(geom.x1).toBeCloseTo(ref.x1)
        expect(geom.y1).toBeCloseTo(ref.y1)
        expect(geom.x2).toBeCloseTo(ref.x2)
        expect(geom.y2).toBeCloseTo(ref.y2)
        expect(geom.mx).toBeCloseTo(ref.mx)
        expect(geom.my).toBeCloseTo(ref.my)
      }
    }
  })

  it('curves an MST edge when an unrelated node is moved onto its centerline', () => {
    // Simulate the kind of edit a future layout change could introduce: take
    // the A–B edge (the top of the wheel) and confirm that if a node were
    // sitting on its centerline, routeEdge would return a curve. We do this
    // by re-routing through edge-routing.routeEdge directly with a perturbed
    // rect list, since routeMstEdge reads the module-scope MST_RECTS.
    const A = MST_POS.get('A')!
    const B = MST_POS.get('B')!
    const midX = (A.x + B.x) / 2
    const midY = (A.y + B.y) / 2
    const perturbedRects: NodeRect[] = MST_NODES.map((n) => ({
      id: n.id,
      x: (n.id === 'D' ? midX : n.x) - MST_NODE_R,
      y: (n.id === 'D' ? midY : n.y) - MST_NODE_R,
      w: MST_NODE_R * 2,
      h: MST_NODE_R * 2,
    }))
    const rectA = perturbedRects.find((r) => r.id === 'A')!
    const rectB = perturbedRects.find((r) => r.id === 'B')!
    const geom = routeEdge(rectA, rectB, perturbedRects)
    expect(geom.kind).toBe('curve')
  })
})
