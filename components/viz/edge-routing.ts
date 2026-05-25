/**
 * edge-routing.ts — collision-aware edge routing for graph vizzes.
 *
 * Returns a straight segment when the line between two node centres clears
 * every non-endpoint node (inflated by `padding`), or a quadratic Bezier that
 * curves AROUND the closest in-the-way node otherwise. Designed to retire the
 * RiverCrossingStateGraph hand-fix from commit `e75b4cb` and to be adopted by
 * every graph viz under `components/viz/` (Phase E task E.4.6).
 *
 * The function is pure: no DOM, no React. The output is either a straight
 * `<line x1 y1 x2 y2>`-style record or a `<path d="M … Q … …">` string ready
 * to drop into SVG. Endpoints are centre-to-centre by design (matches every
 * existing rect-node viz); boundary-to-boundary for circular nodes is a future
 * option.
 */

export type NodeRect = {
  /** Top-left corner x. */
  x: number
  /** Top-left corner y. */
  y: number
  /** Width. */
  w: number
  /** Height. */
  h: number
  /** Stable identity used to exclude endpoint nodes from collision testing. */
  id: string | number
}

export type EdgeGeom =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'curve'; d: string; cx: number; cy: number }

export interface RouteOptions {
  /** Pixels to inflate non-endpoint rects when collision-testing. Default 4. */
  padding?: number
  /** Minimum perpendicular offset of the control point (px). Default 0. */
  minBulge?: number
  /** Cap on retry attempts when the first curve still clips. Default 3. */
  maxRetries?: number
}

const DEFAULT_PADDING = 4
const DEFAULT_MIN_BULGE = 0
const DEFAULT_MAX_RETRIES = 3
const SAFETY_MARGIN = 8
const RETRY_GROWTH = 1.5
const CURVE_SAMPLE_COUNT = 8

/**
 * Compute an edge geometry from `a` to `b` that doesn't pass through any other
 * node in `allNodes`. Returns a straight line when possible, a quadratic
 * Bezier otherwise.
 */
export function routeEdge(
  a: NodeRect,
  b: NodeRect,
  allNodes: ReadonlyArray<NodeRect>,
  options?: RouteOptions,
): EdgeGeom {
  const padding = options?.padding ?? DEFAULT_PADDING
  const minBulge = options?.minBulge ?? DEFAULT_MIN_BULGE
  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES

  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2

  const others = allNodes.filter((n) => n.id !== a.id && n.id !== b.id)
  const colliders = others.filter((n) =>
    segmentIntersectsRect(ax, ay, bx, by, n, padding),
  )

  if (colliders.length === 0) {
    return { kind: 'line', x1: ax, y1: ay, x2: bx, y2: by }
  }

  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy)
  if (len === 0) {
    // Coincident endpoints — nothing geometric we can do; ship a degenerate line.
    return { kind: 'line', x1: ax, y1: ay, x2: bx, y2: by }
  }

  // Unit perpendicular (rotated 90° CCW from segment direction).
  const px = -dy / len
  const py = dx / len
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2

  // Pick the curving side. Curve away from the perpendicular side that carries
  // more collider mass — that's the side where the bulge does the most work.
  // Ties fall back to curving away from the centroid of all non-endpoint nodes,
  // which keeps the curve in the layout's empty space (e.g. for a row of nodes
  // at the top of a graph, curve up not down into the cluster).
  let massPos = 0
  let massNeg = 0
  for (const c of colliders) {
    const cx = c.x + c.w / 2
    const cy = c.y + c.h / 2
    const sigma = (cx - ax) * px + (cy - ay) * py
    if (sigma > 0) massPos += sigma
    else if (sigma < 0) massNeg += -sigma
  }
  let s: 1 | -1
  if (massPos > massNeg) s = -1
  else if (massNeg > massPos) s = 1
  else {
    let cxSum = 0
    let cySum = 0
    let count = 0
    for (const n of others) {
      cxSum += n.x + n.w / 2
      cySum += n.y + n.h / 2
      count++
    }
    if (count === 0) {
      s = 1
    } else {
      const sigmaCentroid = (cxSum / count - ax) * px + (cySum / count - ay) * py
      s = sigmaCentroid > 0 ? -1 : 1
    }
  }

  // For each collider compute the bulge needed so the Bezier passes ABOVE
  // (in the +s·perp sense) its rect at parameter t_c. The Bezier's perp
  // offset at t is 2·t·(1−t)·bulge in the +s direction (cross-axis term
  // cancels because the control point sits on the perpendicular bisector,
  // making the parallel coord linear in t). Clearance requires:
  //   s·(2·t·(1−t)·bulge) − sigma_c  ≥  perpExtent_c + padding
  // ⇒ bulge ≥ (perpExtent_c + padding + s·sigma_c) / (2·t·(1−t))
  // perpExtent is the rect's AABB projection onto the perpendicular direction.
  // Colliders parked past the endpoints (t ∉ (0,1)) don't constrain the
  // curve's interior — the retry loop catches anything pathological.
  let bulge = minBulge
  for (const c of colliders) {
    const cx = c.x + c.w / 2
    const cy = c.y + c.h / 2
    const t = ((cx - ax) * dx + (cy - ay) * dy) / (len * len)
    if (t <= 0 || t >= 1) continue
    const denom = 2 * t * (1 - t)
    if (denom < 1e-6) continue
    const sigma = (cx - ax) * px + (cy - ay) * py
    const perpExtent = (c.w * Math.abs(px)) / 2 + (c.h * Math.abs(py)) / 2
    const needed = (perpExtent + padding + s * sigma) / denom
    if (needed > bulge) bulge = needed
  }
  bulge = Math.max(bulge + SAFETY_MARGIN, minBulge)

  // Verify + retry. Grow the bulge if any non-endpoint rect still intersects
  // the polyline approximation of the Bezier.
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const qx = mx + s * px * bulge
    const qy = my + s * py * bulge
    if (curveClearsAll(ax, ay, qx, qy, bx, by, others, padding)) {
      return { kind: 'curve', d: bezierPath(ax, ay, qx, qy, bx, by), cx: qx, cy: qy }
    }
    bulge *= RETRY_GROWTH
  }

  // Hard fallback — return the last attempt even if degenerate input prevents
  // a clean route. Better a slightly-clipped curve than throwing at render.
  const qx = mx + s * px * bulge
  const qy = my + s * py * bulge
  return { kind: 'curve', d: bezierPath(ax, ay, qx, qy, bx, by), cx: qx, cy: qy }
}

/**
 * Segment-vs-AABB intersection test (Liang-Barsky slab test). The rect is
 * inflated by `padding` on every side. Returns true when the segment
 * intersects the inflated rect at any point including its boundary.
 */
export function segmentIntersectsRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rect: NodeRect,
  padding = 0,
): boolean {
  const minX = rect.x - padding
  const minY = rect.y - padding
  const maxX = rect.x + rect.w + padding
  const maxY = rect.y + rect.h + padding

  const dx = x2 - x1
  const dy = y2 - y1

  let tEnter = 0
  let tExit = 1

  // Each slab contributes a (p, q) pair: p·t ≤ q. Negative p ⇒ entry constraint
  // (raises tEnter); positive p ⇒ exit constraint (lowers tExit); p == 0
  // means the segment is parallel to the slab, and q < 0 means it lies
  // entirely outside.
  const checks: ReadonlyArray<readonly [number, number]> = [
    [-dx, x1 - minX],
    [dx, maxX - x1],
    [-dy, y1 - minY],
    [dy, maxY - y1],
  ]
  for (const [p, q] of checks) {
    if (p === 0) {
      if (q < 0) return false
      continue
    }
    const t = q / p
    if (p < 0) {
      if (t > tExit) return false
      if (t > tEnter) tEnter = t
    } else {
      if (t < tEnter) return false
      if (t < tExit) tExit = t
    }
  }
  return tEnter <= tExit
}

/** Perpendicular distance from point (px, py) to the line through (x1,y1)-(x2,y2). */
export function perpDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  px: number,
  py: number,
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len === 0) return Math.hypot(px - x1, py - y1)
  return Math.abs(dy * (px - x1) - dx * (py - y1)) / len
}

/**
 * Sample the quadratic Bezier and check that the polyline approximation
 * doesn't intersect any non-endpoint rect (inflated by padding).
 */
export function curveClearsAll(
  ax: number,
  ay: number,
  qx: number,
  qy: number,
  bx: number,
  by: number,
  others: ReadonlyArray<NodeRect>,
  padding: number,
): boolean {
  const samples: Array<readonly [number, number]> = []
  for (let i = 0; i <= CURVE_SAMPLE_COUNT; i++) {
    const t = i / CURVE_SAMPLE_COUNT
    const omt = 1 - t
    const x = omt * omt * ax + 2 * omt * t * qx + t * t * bx
    const y = omt * omt * ay + 2 * omt * t * qy + t * t * by
    samples.push([x, y] as const)
  }
  for (let i = 0; i < samples.length - 1; i++) {
    const [x1, y1] = samples[i]
    const [x2, y2] = samples[i + 1]
    for (const n of others) {
      if (segmentIntersectsRect(x1, y1, x2, y2, n, padding)) return false
    }
  }
  return true
}

function bezierPath(
  ax: number,
  ay: number,
  qx: number,
  qy: number,
  bx: number,
  by: number,
): string {
  return `M ${fmt(ax)} ${fmt(ay)} Q ${fmt(qx)} ${fmt(qy)} ${fmt(bx)} ${fmt(by)}`
}

function fmt(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2)
}

/**
 * Trim an `EdgeGeom` so both endpoints sit on the borders of circles of radius
 * `rA` / `rB` centered at the original (untrimmed) endpoints `(ax, ay)` and
 * `(bx, by)`. Used by directed-graph vizzes whose arrowheads must land on the
 * node boundary, not inside it.
 *
 * For lines, this is a standard linear trim along the segment direction.
 * For quadratic Beziers, the trim runs along the tangent at each endpoint —
 * tangent(0) = Q − P0, tangent(1) = P1 − Q — so the returned curve keeps the
 * SAME control point and the tangent direction at each endpoint is preserved
 * (arrowheads still point correctly). This is not a mathematically exact
 * Bezier re-parametrisation, but for the small bulges this utility produces
 * the visual difference is sub-pixel.
 */
export function trimEdgeGeom(
  geom: EdgeGeom,
  ax: number,
  ay: number,
  rA: number,
  bx: number,
  by: number,
  rB: number,
): EdgeGeom {
  if (geom.kind === 'line') {
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len
    return {
      kind: 'line',
      x1: ax + ux * rA,
      y1: ay + uy * rA,
      x2: bx - ux * rB,
      y2: by - uy * rB,
    }
  }
  const { cx, cy } = geom
  const tsx = cx - ax
  const tsy = cy - ay
  const tsl = Math.hypot(tsx, tsy) || 1
  const ttx = bx - cx
  const tty = by - cy
  const ttl = Math.hypot(ttx, tty) || 1
  const x1 = ax + (tsx / tsl) * rA
  const y1 = ay + (tsy / tsl) * rA
  const x2 = bx - (ttx / ttl) * rB
  const y2 = by - (tty / ttl) * rB
  return {
    kind: 'curve',
    d: bezierPath(x1, y1, cx, cy, x2, y2),
    cx,
    cy,
  }
}
