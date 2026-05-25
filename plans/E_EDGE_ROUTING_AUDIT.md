# Phase E.4.6 — Edge-routing retrofit audit

> Produced by E.4.6.0 (`feat(viz/edge-routing): …`) as the queue for the
> per-viz retrofit chunks E.4.6.1…N. One chunk per turn going forward,
> same cadence as Phases A–D.

The shared utility `components/viz/edge-routing.ts` (`routeEdge(a, b,
allNodes, options?)`) is **already in use** in `RiverCrossingStateGraph.tsx`
(the point-fix from commit `e75b4cb` is gone). Every viz in the table below
is a candidate for the same retrofit: replace hand-rolled `<line>` / `<path>`
edge rendering with a `routeEdge()` call that runs collision-aware routing
by construction.

**Most retrofits will be visual no-ops** — the existing layouts were chosen
to avoid edge-through-node bugs, and routeEdge returns a straight line when
the segment clears every non-endpoint rect. Any straight line that comes
back curved is either fixing a latent bug (good, ship it) or a false
positive on a near-miss (rare — file a follow-up to widen the rect's
padding or shrink the node).

**Honest scope.** This audit covers vizzes that draw edges *between
rect-or-circle nodes whose positions are determined by a layout function*.
Out of scope: chart axes, sliders, sparklines, Gantt bars, DP tables,
sort-comparison arrows, trees rendered with hard-coded path strings (no
positioned «nodes» per se), and overlay annotations.

---

## Layout families & retrofit chunks

Group by shared layout / node-rect convention. Each chunk = one turn.

### Chunk B1 — L09 MST family (shared `mst-graph.ts`) ✅ DONE 2026-05-25

7 circular nodes (`MST_NODE_R = 21`), 12 weighted edges, planar wheel
layout. Edges are drawn with `trimmedEdge()` (boundary-to-boundary) as
`<line>`. Layout has no straight edges that pass through unrelated nodes
today, so the retrofit will be a no-op in steady state — but locks the
class of bug out structurally for any future edit that re-positions a
node or adds an edge.

- `components/viz/PrimAnimator.tsx` ✅
- `components/viz/KruskalAnimator.tsx` ✅
- `components/viz/ReverseDeleteAnimator.tsx` ✅
- `components/viz/CutExplorer.tsx` ✅
- `components/viz/ExchangeArgumentViz.tsx` ✅
- `components/viz/CycleCutLemmaViz.tsx` ✅
- `components/viz/PrimVsDijkstraViz.tsx` ✅
- `components/viz/DijkstraProofViz.tsx` ✅ (custom 4-node directed layout — folded in)
- `components/viz/DijkstraAnimator.tsx` ✅ (custom 6-node directed layout, NOT mst-graph — folded in)
- `components/viz/DijkstraInvariantBreak.tsx` ✅ (custom 4-node layout — folded in for symmetry)

**Retrofit shape (as executed).** For the 7 mst-graph consumers: a new
`routeMstEdge(a, b)` helper in `mst-graph.ts` pre-computes `MST_RECTS` at
module scope and dispatches to `routeEdge()`; the line case returns
fields byte-identical to `trimmedEdge()` so consumers see no visual
delta in steady state, while the curve case carries the Bezier d-string
plus a label-anchor at the Bezier midpoint `(P0 + 2Q + P2) / 4`. Each
consumer's edge map (and any halo/glow underlay map) gained a
`g.kind === 'line' ? <line> : <path d={g.d} fill="none">` branch —
styling/coloring/animation logic untouched. For the 3 directed-graph
vizzes a new `trimEdgeGeom()` helper in `edge-routing.ts` trims both
endpoints to circle borders for line AND curve cases (tangent-direction
trim on curves, so arrowheads still land on the boundary). 5 new tests
in `edge-routing.test.ts` lock both the byte-identical contract (over
all 12 MST_EDGES) and the perturbed-collision case. See
[[phase-e46-chunk-b1]].

### Chunk B2 — L08 directed / undirected base graphs ✅ DONE 2026-05-25

Bespoke layouts per viz, mix of `<rect>` and `<circle>` nodes. Most are
hand-positioned 5–10 node graphs.

- `components/viz/StrongConnectivityViz.tsx` ✅ (directed, 6 nodes R=21)
- `components/viz/DirectedDegreeViz.tsx` ✅ (directed, 6 nodes R=24; mx/my label anchor)
- `components/viz/DirectedReachExplorer.tsx` ✅ (directed, 6 nodes R=22; fwd trimPad=R+2, ghost reverse trimPad=R+8)
- `components/viz/MutualReachabilityExplorer.tsx` ✅ (directed, 5 nodes R=22)
- `components/viz/OddCycleProof.tsx` ✅ (undirected level-banded, 9 nodes r=20; tree edges + same-level "bad" edge)
- `components/viz/OddCycleColoring.tsx` ✅ (undirected ring, dynamic k ∈ {3..8} r=22; useMemo rects; closing-edge label anchored at Bezier midpoint)
- `components/viz/ComponentSweep.tsx` ✅ (undirected 3-component, 13 nodes r=18, 14 edges)
- `components/viz/WhyBFSFailsWeighted.tsx` ✅ (4 nodes R=22; 3 detour edges retrofitted, the s-t arc stays hand-crafted by design — explicit comment)
- `components/viz/BipartiteChecker.tsx` ✅ (undirected level-banded, dynamic between two layouts; useMemo rects)

**Retrofit shape (as executed).** Mirror of Chunk B1's patterns, applied
per viz with no new shared helper:

- For the 4 directed graphs: build module-scope `NODE_RECTS` +
  `NODE_RECT_BY_ID` from each viz's NODES, plus a per-file `routedEdge(a,
  b)` that calls `routeEdge() → trimEdgeGeom()` with trim radius `R + 2`
  (preserves the pre-retrofit border gap byte-identical for the line
  case). `DirectedReachExplorer` takes a `trimPad` parameter so the
  ghost reverse edges keep their `R + 8` wider gap.
  `DirectedDegreeViz`'s `routedEdge` additionally returns `mx, my` so the
  "next edge" label anchors at the Bezier midpoint when a curve fires.
- For the 4 static-layout undirected graphs (OddCycleProof,
  ComponentSweep) and the dynamic-layout ones (OddCycleColoring,
  BipartiteChecker): same shape minus the `trimEdgeGeom` step (these
  vizzes draw center-to-center). The dynamic vizzes build `nodeRects`
  via `useMemo` so the routing recomputes when `k`/`which` changes.
- WhyBFSFailsWeighted is hybrid: the 3 detour edges adopt the standard
  pattern; the s-t arc is a deliberate visual-separation design choice
  (over-the-top curve) and intentionally bypasses `routeEdge`. The
  exception is documented inline in the `routedEdge` JSDoc.
- Every consumer that previously used a local `endpoints()` / `trim()`
  helper now branches on `g.kind === 'line' ? <line …> : <path d={g.d}
  fill="none" …>`. Styling, marker arrows, strokeDasharray, opacity all
  carry over unchanged.

**Steady-state visual contract:** every edge in every B2 viz routes as
a line on the current layout — verified by inspection (none of the
layouts have an unrelated node sitting on any edge centerline). The line
case is byte-identical to the pre-retrofit output (same as B1). No
user-visible change today; the value is structural lockout per the
audit's standing thesis.

**No new tests required.** B2 introduces no new helper (the building
blocks `routeEdge` and `trimEdgeGeom` were both tested in B1's 20-test
suite, which still passes 20/20). A future layout edit that breaks
collision-freeness would surface as a visible curve in the viz — that's
the regression channel.

### Chunk B3 — L06 / L07 base-graph vizzes ✅ DONE 2026-05-25

The «graphs from first principles» catalogue. Most are 6–12 node hand-
positioned graphs.

- `components/viz/GraphRepresentations.tsx` ✅ (L06_GRAPH, r=23; shared helper)
- `components/viz/HandshakeLemmaViz.tsx` ✅ (L06_GRAPH, r=22; shared helper; «+1 +1» label anchor via Bezier midpoint)
- `components/viz/PathBuilder.tsx` ✅ (L06_GRAPH, r=22; shared helper)
- `components/viz/ConnectivityExplorer.tsx` ✅ (TWO graphs: TRI 11 nodes / BR 8 nodes, both r=16; per-file rects; dual-line click target now `<path>` when curved)
- `components/viz/CycleExplorer.tsx` ✅ (L06_GRAPH, r=22; shared helper)
- `components/viz/TreeThreeProperties.tsx` ✅ (6 nodes r=22; per-file `TT_RECTS`; dual-line click target now `<path>` when curved)
- `components/viz/RootedTreeReroot.tsx` ✅ (7-node dynamic tree, r=17; per-file `nodeRects` via `useMemo` since layout recomputes per root)
- `components/viz/MetroModelingViz.tsx` ✅ (TWO graphs: 12-station map r=11 / 3-node R-B-G mini line-graph r=18; per-file rects; «μέσω X» label anchor via Bezier midpoint)
- `components/viz/DfsTreeBuilder.tsx` ✅ (G half uses shared helper; T half uses per-file `TREE_RECTS` r=22 for tree edges; dashed-orange back-edge arcs KEEP their hand-tuned 36 px perpendicular offset by design — visual signal not collision routing, mirrors `WhyBFSFailsWeighted` carve-out)
- `components/viz/GenericSearchExplorer.tsx` ✅ (covered transitively via `GraphCanvas` retrofit)
- `components/viz/BfsLayerTheorem.tsx` ✅ (L06_BFS_TREE, r=22; shared helper)
- `components/viz/BfsEdgeProperty.tsx` ✅ (L06_BFS_TREE, r=22; shared helper; hypothetical-edge red overlay in adv tab also routed)
- `components/viz/ComplexityTightVsLoose.tsx` ✅ **out-of-scope, documented-skipped** (bar chart with `<rect>` heights; no inter-node edges between positioned nodes)
- `components/viz/GraphCanvas.tsx` ✅ (parametrised renderer — builds `nodeRects` from `graph.nodes` per render with `nodeRadius + 1`; no `useMemo`, no `'use client'` so it stays server-renderable for direct MDX usage; transitively covers `GenericSearchExplorer`, `TraversalGame`, and L07's two direct `<GraphCanvas>` instances)

**Retrofit shape (as executed).** Two new shared helpers in
`components/viz/graph-types.ts`: `routeL06GraphEdge(a, b)` over module-scope
`L06_GRAPH_RECTS` (r=24) and `routeL06BfsTreeEdge(a, b)` over
`L06_BFS_TREE_RECTS` (r=23) — each one px above the largest visible radius
across the consumer family, so a single helper covers vizzes drawing at
r=22 and r=23 without per-file rect tuning. Each consumer branches on
`g.kind === 'line' ? <line> : <path d={g.d} fill="none">`. The 4 bespoke
layouts (`ConnectivityExplorer`, `TreeThreeProperties`, `RootedTreeReroot`,
`MetroModelingViz`) build module-scope `NODE_RECTS` per the B2 pattern;
`RootedTreeReroot` uses `useMemo` because its layout recomputes per root.

**The dual-line click-target pattern needed an upgrade.** Two B3 vizzes
(`ConnectivityExplorer` BR graph, `TreeThreeProperties`) render each
toggle-able edge as a visible thin line + a fat invisible 18-20 px stroke
for `onClick`. Pre-retrofit, both were `<line>`s with identical coords —
fine. Post-retrofit, when the visible edge curves, the hit target also
needs to be `<path d={g.d}>` with `stroke-width=20`, so the click area
follows the arc instead of running along the straight chord. Standing
lesson for B4..B7: any «dual-render for hit area» pattern needs the same
treatment on curves.

**Label-anchor formula for curve cases.** Two B3 vizzes
(`HandshakeLemmaViz`'s «+1 +1» tag, `MetroModelingViz`'s «μέσω X» label
on the mini line-graph) place a text label at the midpoint of each
visible edge. For lines that's `(A.x + B.x) / 2, (A.y + B.y) / 2`. For a
quadratic Bezier with control point `Q`, the t=0.5 midpoint is `(P0 + 2Q +
P2) / 4 = (M + Q) / 2`. Both vizzes adopt this formula; the label
shorthand `(ax + bx + 2*g.cx) / 4` is the same calculation written
inline.

**Steady-state visual contract:** every edge in every B3 viz routes as a
line on the current layouts (verified by inspection — none have an
unrelated node sitting on any edge centreline). The line case is
byte-identical to the pre-retrofit output. No user-visible change today;
the value is structural lockout per the audit's standing thesis.

**No new tests required.** B3 introduces no new helper at the
`edge-routing.ts` level (the two new helpers in `graph-types.ts` are
trivial wrappers over `routeEdge`). The building blocks `routeEdge` /
`trimEdgeGeom` were both locked by B1's 20-test suite (still 20/20).

### Chunk B4 — L17 Bellman-Ford family ✅ DONE 2026-05-25

L17's flagship DP/shortest-path graph set: 4 weighted directed graphs (Bellman-
Ford trace, negative-cycle plunge, Dijkstra-on-negative-edge counterexample,
constant-shift counterexample with 2 presets) and 2 undirected tree-DP graphs.

- `components/viz/BellmanFordAnimator.tsx` ✅ (directed, 5 nodes R=23, 7 edges)
- `components/viz/NegativeCycleWalk.tsx` ✅ (directed, 5 nodes R=24, 5 edges incl. the a→b→c→a negative cycle)
- `components/viz/DijkstraNegFail.tsx` ✅ (directed, 3 nodes R=25, 3 edges)
- `components/viz/ConstantShiftFail.tsx` ✅ (directed, per-preset rects: l17 has 6 nodes R=22 + 2 paths, ask10 has 3 nodes R=22 + 2 paths; `Preset` type extended with `nodeRects` + `nodeRectById` fields built by a `buildRects()` helper)
- `components/viz/TreeIndependentSet.tsx` ✅ (undirected tree, 6 nodes r=26, 5 tree edges; center-to-center, no trim)
- `components/viz/WhyTwoTreeValues.tsx` ✅ (undirected tree, 4 nodes R=27, 3 tree edges; center-to-center, no trim; dashed-edge `strokeDasharray` carries through to `<path>` for the illegal {p,c} case)

**Retrofit shape (as executed).** Mirror of Chunk B2's patterns, applied
per viz with no new shared helper:

- For the 4 directed graphs: build module-scope `NODE_RECTS` +
  `NODE_RECT_BY_ID` from each viz's NODES, plus a per-file `routedEdge(a,
  b)` that calls `routeEdge() → trimEdgeGeom()` with trim radius `R`
  (preserves the pre-retrofit border gap byte-identical for the line
  case — every L17 directed viz's prior local `trim()` used `r = R`, not
  `R + 2`). Each returns `mx, my` for the weight-label anchor at the
  centerline midpoint for lines and at the Bezier midpoint
  `(P0 + 2Q + P2) / 4` for curves.
- `ConstantShiftFail` is the only file in chunk B4 that needed a non-
  trivial structural change: the `Preset` type gained `nodeRects` +
  `nodeRectById` fields and a `buildRects(paths)` helper scans both pathA
  + pathB to collect every distinct node. The `routedEdge` signature
  takes `(a, b, rects, rectById)` so it works with whichever preset is
  active at render time. The l17 preset has 6 nodes (s,a,t,b,c,d), the
  ask10 preset has 3 (u,v,w).
- For the 2 undirected tree graphs: same shape minus the `trimEdgeGeom`
  step (tree edges have no arrowheads — draw center-to-center). Their
  `routedEdge` returns the raw `EdgeGeom` (`{kind: 'line', x1,…} |
  {kind: 'curve', d, cx, cy}`) — no `mx, my` since neither viz has
  edge labels.
- `WhyTwoTreeValues`'s dashed-edge styling for the illegal {p,c}
  scenario passes `strokeDasharray` through the line/path branch
  unchanged.
- Every consumer branches on `g.kind === 'line' ? <line …> : <path
  d={g.d} fill="none" …>`. Styling, marker arrows, strokeDasharray,
  opacity all carry over unchanged.

**Steady-state visual contract:** every edge in every B4 viz routes as
a line on the current layout — verified by hand against each viz's
node coordinates that no unrelated node sits on any edge centerline
(closest candidate was the b→t edge in `BellmanFordAnimator`, which
clears c by ~41 px against an inflated padding of R+padding ≈ 27 px).
The line case is byte-identical to the pre-retrofit output. No
user-visible change today; the value is structural lockout per the
audit's standing thesis.

**No new tests required.** B4 introduces no new helper (the building
blocks `routeEdge` and `trimEdgeGeom` were both tested in B1's 20-test
suite, which still passes 20/20). A future layout edit that breaks
collision-freeness would surface as a visible curve in the viz — that's
the regression channel.

### Chunk B5 — L10 Union-Find / heap forest layouts ✅ DONE 2026-05-25

Tree-shaped layouts with parent-child arrows or undirected tree edges.

- `components/viz/UnionFindForest.tsx` ✅ (forest, 7 nodes r=17, directed; dynamic per-step layout via `useMemo`; asymmetric trim NODE_R / NODE_R+7)
- `components/viz/UnionBySizeRace.tsx` ✅ (TWO forests stacked, 5 nodes r=15 each, directed; per-render rects with per-side offsets `(ox, oy)` via the new `forestNodeRects` helper; asymmetric trim NODE_R / NODE_R+6)
- `components/viz/PathCompressionViz.tsx` ✅ (forest, 7 nodes r=16, directed; dynamic per-step layout via `useMemo`; asymmetric trim NODE_R / NODE_R+7)
- `components/viz/BinaryHeapAnimator.tsx` ✅ (binary tree, 7..8 nodes r=19, undirected; per-render rects via `useMemo` keyed on `n`)
- `components/viz/HeapArrayMap.tsx` ✅ (binary tree, 10 nodes r=21, undirected; module-scope rects since `HEAP` is constant)
- `components/viz/HeapsortAnimator.tsx` ✅ (binary tree, 0..6 nodes r=18, undirected; per-render rects via `useMemo` keyed on `n`)
- `components/viz/HuffmanTreeBuilder.tsx` ✅ (Huffman tree, 2 instances `lecture` + `kastanas`, dynamic visibility through step-based merges; per-node radius 23 leaf / 20 internal; per-render rects via `useMemo` keyed on `(data, mergeIndex, step)`; bit-label anchor at segment midpoint or Bezier midpoint when curved)
- `components/viz/HuffmanSwapViz.tsx` ✅ (static Huffman tree, 7 nodes — root r=13, internals r=11, leaves r=23, undirected; module-scope per-node rects; bit-label with perpendicular offset)
- `components/viz/HuffmanOptimalityViz.tsx` ✅ (Huffman tree with collapse step; per-node radius 22 leaf / 19 internal; per-render rects via `useMemo` keyed on `collapsed`; hidden {e,f} excluded post-collapse; bit-label with perpendicular offset)
- `components/viz/TreeMatchingPeel.tsx` ✅ (2 tree instances `ok` + `fail`, 6 nodes r=14 each, undirected; per-instance rects via `useMemo` keyed on `tree`)

**Retrofit shape (as executed).** One new shared helper `forestNodeRects(layout, nodeR, ox, oy)` added to `uf-layout.ts`: walks `layout.pos`, returns `{rects, rectById}` with per-node bounding squares sized to the node radius and optionally translated by `(ox, oy)` for vizzes that stack multiple forests on the same SVG. Used by all 3 union-find consumers. Each consumer (uf, heap, Huffman, TreeMatchingPeel) defines a per-file `routedEdge(...)` that calls `routeEdge() → trimEdgeGeom()` (uf family, directed) or `routeEdge()` alone (heap / Huffman / TreeMatchingPeel, undirected center-to-center). The uf family preserves asymmetric trim radii (child = NODE_R, parent = NODE_R + 6 or +7) to keep the arrowhead's pre-existing gap byte-identical for the line case. Every consumer branches on `g.kind === 'line' ? <line> : <path d={g.d} fill="none">`.

**Per-node radii where they vary.** `HuffmanSwapViz` has three distinct node-radius classes (root=13, internal=11, leaf=23) and uses an explicit `NODE_RECTS` array with per-node sizing. `HuffmanTreeBuilder` and `HuffmanOptimalityViz` use `isLeaf(id)` to branch between leaf (23 / 22) and internal (20 / 19) radii when building rects.

**Dynamic layouts handled per file.**
- uf family: layout depends on the step (parent map changes). `useMemo` keyed on `layout`.
- heaps: layout depends on heap size `n`. `useMemo` keyed on `n`.
- HuffmanTreeBuilder: visibility set depends on step (and instance). `useMemo` keyed on `(data, mergeIndex, step)`.
- HuffmanOptimalityViz: visibility set depends on `collapsed` (post-step-1 hides {e,f}). `useMemo` keyed on `collapsed`.
- TreeMatchingPeel: per-instance, switches on tab. `useMemo` keyed on `tree`.

**Edge-label anchor formula for curve cases.** Two Huffman vizzes (`HuffmanSwapViz`, `HuffmanOptimalityViz`) and `HuffmanTreeBuilder` draw bit labels (0/1) on each edge. The line-case anchor is the segment midpoint `((p.x + c.x) / 2, (p.y + c.y) / 2)`. The curve-case anchor uses the Bezier midpoint `((p.x + c.x + 2·cx) / 4, (p.y + c.y + 2·cy) / 4)` — the t=0.5 point of `P0-Q-P2`. `HuffmanSwap` / `HuffmanOptimality` additionally apply a perpendicular offset `(±(-dy/L)·11, ±(dx/L)·11)` using the segment direction; the perp direction may be slightly off-tangent in a curve case, but trees in this family don't curve in steady state.

**Steady-state visual contract:** every edge in every B5 viz routes as a line on the current layouts — verified by inspection (tree layouts are by construction collision-free: each level sits in its own horizontal row, children fan out, no unrelated node sits on any parent→child centerline). The line case is byte-identical to the pre-retrofit output for every consumer; the union-find family also preserves the asymmetric arrowhead gap byte-identical. No user-visible change today; the value is structural lockout per the audit's standing thesis.

**No new tests required.** B5 introduces one new helper at the layout level (`forestNodeRects` in `uf-layout.ts` — trivial coordinate translation, not collision logic). The collision building blocks `routeEdge` / `trimEdgeGeom` were both locked by B1's 20-test suite (still 20/20 pass). A future layout edit that breaks collision-freeness would surface as a visible curve in the viz — that's the regression channel.

**Standing lessons for B6..B7:**
- **Stacked-forest pattern.** When a single SVG stacks multiple sub-graphs with per-sub-graph offsets (here `UnionBySizeRace`'s top + bottom forests at `oy=20` / `oy=264`), build a separate rect set per sub-graph in the offset coordinate frame. The `(ox, oy)` parameter on `forestNodeRects` makes this trivial. Don't share a single rect set across sub-graphs — collision testing across sub-graphs is generally not the intended semantics, and the offsets would have to be applied per-sub-graph anyway.
- **Per-node varying radius.** When a viz has multiple node-radius classes (root, internal, leaf), define an explicit per-node rect rather than a single radius — `NodeRect` carries its own `(w, h)` so this is natively supported. Don't oversize all rects to the largest radius unless the layout has plenty of margin to absorb the over-conservatism (well-spaced trees in B5 absorb it fine; tighter layouts wouldn't).

### Chunk B6 — L12 topo / DAG family ✅ DONE 2026-05-25

L12's topological-sort and DAG-shortest-path catalogue plus the L17
negative-cycle detector. Mostly static directed layouts with weight
labels; two with per-tab layouts; one hybrid (some edges hand-crafted);
one carve-out where the arc IS the visual identity.

- `components/viz/TopologicalSortViz.tsx` ✅ (directed, 7 nodes R=22, 8 edges; module-scope rects; symmetric trim by R)
- `components/viz/TopoOrderBuilder.tsx` ✅ **out-of-scope carve-out** (single-row slot layout with hand-tuned quadratic arcs encoding forward/backward direction; routing would either flatten arcs to lines [destroying the visual] or return direction-inconsistent bulges; mirrors `WhyBFSFailsWeighted` and `DfsTreeBuilder` precedents; inline comment documents the carve-out)
- `components/viz/DagSourceWalk.tsx` ✅ (directed, 2 presets with DIFFERENT layouts: dag has 6 nodes / source-free has 5 nodes; R=24; per-preset rects via `useMemo` keyed on `cfg`; symmetric trim by R)
- `components/viz/LayeredSubsetsDAG.tsx` ✅ (TWO tabs with DIFFERENT layouts: tab `complete` uses NODES_COMPLETE with s/t hidden at (0,0) — module-scope `COMPLETE_RECTS` includes only the 7 visible {a..g} nodes, undirected center-to-center routing; tab `dag` uses NODES_LAYERED with all 9 nodes — module-scope `LAYERED_RECTS` + directed routing with trim by R=18 for arrowhead gap; weight labels anchor at Bezier midpoint when curved)
- `components/viz/LayeredTripPlanner.tsx` ✅ (TWO tabs with DIFFERENT layouts: tab `map` is 4-city K₄ with MAP_R=22 [NR+4 matches the visible circle stroke], undirected center-to-center routing — module-scope `MAP_RECTS`; tab `dag` is the 16-slot layered DAG = 4 cities × 4 days at `(DAY_X[p], DAY_Y[c])`, NR=18, directed with trim — module-scope `DAG_RECTS` keyed by `${city}-${day}`)
- `components/viz/DAGUnreliableTwoWays.tsx` ✅ (directed, 8 nodes R=19, 12 edges; module-scope rects from the `NODES` Record; symmetric trim by R; mode toggle [max/min relaxation] does NOT change the layout — same rects across both modes)
- `components/viz/DagAveragePathCost.tsx` ✅ (directed, 6 nodes R=22, 8 edges; module-scope rects from `NODES` array; symmetric trim by R; weight-label anchor at segment midpoint or Bezier midpoint when curved)
- `components/viz/NegativeCycleDetector.tsx` ✅ **hybrid** (mirrors `WhyBFSFailsWeighted` from B2: 2 scenarios with R=23; straight edges go through `routedStraightEdge → routeEdge → trimEdgeGeom`, but edges with the `curve` prop set keep their hand-tuned `curvedPath()` because the curve IS a deliberate visual signal — the anti-parallel a↔b cycle pair at curve=18 must bulge in opposite directions to not overlap, and the long s→t shortcut at curve=70 needs a wide swoop above the row to read as a single direct edge; per-scenario rects via `useMemo` keyed on `scn`; inline comment in `routedStraightEdge` JSDoc documents the carve-out reasoning)

**Retrofit shape (as executed).** Three patterns applied per file, all
mirrors of B2/B4 precedents — no new shared helper:

- **Single static layout (4 files):** `TopologicalSortViz`,
  `DAGUnreliableTwoWays`, `DagAveragePathCost` (no `TopoOrderBuilder`,
  see carve-out). Module-scope `NODE_RECTS` + `NODE_RECT_BY_ID`,
  per-file `routedEdge(from, to)` calling `routeEdge() → trimEdgeGeom()`
  with symmetric trim radius R. Weight-label anchor branches on
  `g.kind` for line vs Bezier midpoint.
- **Multi-preset / multi-tab dynamic layout (3 files):** `DagSourceWalk`
  (2 presets), `LayeredSubsetsDAG` (2 tabs with different node sets),
  `LayeredTripPlanner` (2 tabs with different node sets). Either
  per-render `useMemo` keyed on the preset/scenario, OR module-scope
  rect sets per tab (LayeredSubsetsDAG / LayeredTripPlanner — both
  layouts are constant, just used in different tabs). `LayeredSubsetsDAG`
  introduces TWO routing functions per file (`routedCompleteEdge` /
  `routedLayeredEdge`) because the two tabs have different
  directed/undirected semantics — standing pattern for B7's
  per-problem vizzes with multiple scenarios.
- **Hybrid (1 file):** `NegativeCycleDetector`. Straight edges retrofit;
  edges with the `curve` prop set keep their hand-tuned curve. The
  per-render `routedStraightEdge` is only called when `e.curve` is unset.
  An explicit `let edgeNode: ReactNode` (with `type ReactNode` imported
  from react) holds either `<line>`, the routed `<path>`, or the
  hand-tuned `<path>` to unify the downstream label-and-rect rendering.

**Carve-out (1 file): `TopoOrderBuilder`.** All edges intentionally
rendered as quadratic Bezier arcs over a SINGLE-ROW slot layout. The
arc bulge `26 + span * 30` is direction-encoding (forward edges curve
up-right, backward edges curve up-left — color + arc-direction
together make the green/red verdict readable at a glance). The slot
row puts every non-endpoint node ON the segment between any two
endpoints, so `routeEdge`'s collider-mass tie-break would degenerate
and return either straight lines (destroying the visual) or
direction-inconsistent bulges. The carve-out is documented inline in
JSDoc, mirroring the `WhyBFSFailsWeighted` (B2) and `DfsTreeBuilder`
back-edge (B3) precedents.

**Per-node uniform radius across the chunk.** Every B6 viz uses a
single radius for every node — no per-node varying radii like
`HuffmanSwapViz` from B5 — so the rect-build is a one-line
`map → NodeRect`.

**Weight-label anchor pattern (recurrence from B1/B2/B4/B5).** Every
B6 viz that draws a weight label on the segment midpoint uses the same
branch:

```ts
const mx = g.kind === 'line'
  ? (A.x + B.x) / 2
  : (A.x + B.x + 2 * g.cx) / 4   // Bezier midpoint (P0 + 2Q + P2) / 4
const my = g.kind === 'line'
  ? (A.y + B.y) / 2
  : (A.y + B.y + 2 * g.cy) / 4
```

`A`, `B` are the untrimmed node centers — the label stays anchored to
the actual edge whether routed straight or curved.

**Steady-state visual contract:** every retrofitted edge in every B6
viz routes as a line on the current layouts — verified by inspection.
No B6 layout has an unrelated node sitting on any edge centerline. The
line case is byte-identical to the pre-retrofit `trim()` output. No
user-visible change today; the value is structural lockout per the
audit's standing thesis.

**No new tests required.** `routeEdge` / `trimEdgeGeom` were both
locked by B1's 20-test suite (still 20/20 pass). The hybrid carve-out
pattern (`NegativeCycleDetector`) is documented inline; a future
layout edit that flips a previously-straight edge to a curve will
surface as a visible bend in the viz — that's the regression channel.

**Standing lessons for B7:**
- **Per-tab routing functions.** When a viz has multiple tabs with
  different directed/undirected semantics (LayeredSubsetsDAG `complete`
  is undirected, `dag` is directed), define a separate `routedXEdge`
  per tab rather than a unified helper. The trim/no-trim choice is
  per-tab, and unifying them via a flag makes the call sites uglier.
- **Hand-tuned curve = visual signal, not collision routing.** When a
  viz already curves an edge by hand for a non-collision reason
  (anti-parallel disambiguation, long-shortcut signalling,
  direction-encoding bulge), keep that curve as a documented carve-out.
  The `routeEdge` adoption rule does not apply when the curve itself is
  the teaching surface. So far: `WhyBFSFailsWeighted` s-t arc (B2),
  `DfsTreeBuilder` back-edge arcs (B3), `TopoOrderBuilder` direction
  arcs (B6), `NegativeCycleDetector` a↔b cycle pair + s→t shortcut (B6).
- **Multi-layout via per-tab module-scope rect sets.** When two
  layouts are constant but used in different tabs (LayeredSubsetsDAG,
  LayeredTripPlanner), define both rect sets at module scope and pick
  the right `routed*Edge` per tab — cleaner than `useMemo` keyed on
  tab when the layouts don't depend on render state.

### Chunk B7 — Problem-bank scenario graphs

Bespoke per-problem layouts, mostly 4–7 nodes. Re-split into 5 sub-chunks
along «shares-a-layout-shape» lines after a per-file survey (one chunk per
turn). Survey: 17 IN-SCOPE vizzes (5 sub-chunks below) · 13 OUT-OF-SCOPE
(chart / Gantt / scene-illustration / DP-table / interval-bar layouts —
listed at the end of this section) · 4 CARVE-OUTS (deliberate visual
encoding that `routeEdge` would destroy — listed in the carve-outs block) ·
1 already DONE in E.4.6.0 (`RiverCrossingStateGraph`).

- `components/viz/RiverCrossingStateGraph.tsx` ✅ **DONE** (E.4.6.0)

#### B7.1 — Small bespoke MST / triangle weighted graphs ✅ DONE 2026-05-25

6 undirected weighted graphs of 3..6 nodes, R≈22, with local `trim(a, b, r)`
helpers and weight labels in `<rect>+<text>` at the segment midpoint. Mirror
of the B2/B4 per-file pattern: build module-scope `NODE_RECTS` +
`NODE_RECT_BY_ID` and a per-file `routedEdge(a, b)` calling
`routeEdge() → trimEdgeGeom()` with symmetric trim R. `MstPreorderTSP` has
an asymmetric trim for the tour-arrow edges (mirror of B5's UF pattern).
`DijkstraTreeVsMstTriangle` has a Panel sub-component that gets shared
module-scope rects.

- `components/viz/MstCountingExplorer.tsx` ✅ (6 nodes R=22, 7 undirected edges, weighted, mandatory/tie styling)
- `components/viz/MstPreorderTSP.tsx` ✅ (5 nodes R=22, 10 undirected edges + 5 directed tour edges with asymmetric trim R-6/R+4)
- `components/viz/MstRunnerWithTies.tsx` ✅ (5 nodes R=22, 8 undirected weighted edges, accept/reject styling)
- `components/viz/SecondVsThirdEdgeMst.tsx` ✅ (3-node triangle R=22, 3 undirected weighted edges)
- `components/viz/MaxEdgeAsBridge.tsx` ✅ (4 nodes R=22, 4 undirected weighted edges incl. dangling x via bridge)
- `components/viz/DijkstraTreeVsMstTriangle.tsx` ✅ (3-node triangle R=22, 3 undirected weighted edges, rendered twice via `Panel` component — module-scope rects shared across both panels)

#### B7.2 — Directed weighted path graphs ✅ DONE 2026-05-25

4 directed weighted graphs with arrowhead markers and weight labels.
`DijkstraHandTrace` is a hybrid: 2 instances (one undirected, one directed
with a hand-tuned `c→a` curve carve-out, mirror of `WhyBFSFailsWeighted`
B2 + `NegativeCycleDetector` B6).

- `components/viz/MultVsAddPaths.tsx` ✅ (5 nodes R=21 shared across 2 panels, 5 directed weighted edges per panel; module-scope rects shared by both Panel renders)
- `components/viz/ReliabilityLogTransform.tsx` ✅ (4 nodes R=22, 5 directed weighted edges, focused-edge highlight via `activeEdges` Set)
- `components/viz/GreedyVsDpRelaxation.tsx` ✅ (4 nodes R=21, 5 directed weighted edges; MiniGraph rendered twice with module-scope rects shared; `POS` dropped as redundant)
- `components/viz/DijkstraHandTrace.tsx` ✅ **hybrid** (instance `pt2-th2-1` is 6-node undirected R=21 with 8 weighted edges; instance `pt3-th1` is 5-node directed R=21 with 5 edges including a hand-tuned `c→a` cycle curve at `curve=60` that stays as a documented carve-out — back-edge bulge below the row disambiguates from the forward chain; per-instance `routedStraight` closure via `useMemo` keyed on `inst`; only straight edges retrofit)

**Retrofit shape (as executed).** Three patterns applied per file, all
mirrors of B7.1 / B4 / B6 precedents — no new shared helper:

- **Module-scope rects, single layout (3 files):** `MultVsAddPaths`,
  `ReliabilityLogTransform`, `GreedyVsDpRelaxation`. Build module-scope
  `NODE_RECTS` + `NODE_RECT_BY_ID`, per-file `routedEdge(a, b)` calling
  `routeEdge() → trimEdgeGeom()` with symmetric trim R. Weight-label
  anchor branches on `g.kind` for line midpoint vs Bezier midpoint
  `(A + B + 2·Q) / 4`. Sub-components (`Panel` in `MultVsAddPaths`,
  `MiniGraph` in `GreedyVsDpRelaxation`) close over the module-scope
  rects — no per-render rect rebuild, no per-panel rect duplication.
- **Per-instance `useMemo` (1 file):** `DijkstraHandTrace`. The two
  instances have DIFFERENT node sets (6 vs 5 nodes, different ids and
  positions), so the routing closure rebuilds per instance. Mirror of
  B6's `DagSourceWalk` per-preset `useMemo` and B4's `ConstantShiftFail`
  per-preset `buildRects()`. The closure captures `rects` and the
  `rectById` map, returns `{...geom, mx, my}` with the standard
  Bezier-midpoint label anchor branch.
- **Hybrid carve-out (1 file):** `DijkstraHandTrace`. Edges with
  `e.curve !== undefined` keep their hand-tuned Bezier (`M ${a.x+18}
  ${a.y+5} Q ${mx} ${my} ${b.x+18} ${b.y+5}`); only `e.curve === undefined`
  edges call `routedStraight`. Joins the carve-out collection:
  `WhyBFSFailsWeighted` s-t (B2), `DfsTreeBuilder` back-edges (B3),
  `TopoOrderBuilder` direction arcs (B6), `NegativeCycleDetector`
  a↔b + s→t (B6), `MstPreorderTSP` tour overlay (B7.1).

**Side cleanup.** Dropped 4 local `trim(a, b, r)` helpers + the `POS`
map in `GreedyVsDpRelaxation` (`routedEdge` indexes via `NODE_RECT_BY_ID`
directly).

**Steady-state visual contract:** every retrofitted edge in every B7.2
viz routes as a line on the current layouts — verified by inspection
(path graphs s→…→t are by construction collision-free; the only
would-be collision is the `c→a` back-edge in `pt3-th1` of
`DijkstraHandTrace`, which uses the documented hand-tuned carve-out).
The line case is byte-identical to the pre-retrofit `trim()` output.
No user-visible change today; the value is structural lockout per the
audit's standing thesis.

**No new tests required.** `routeEdge` / `trimEdgeGeom` were both
locked by B1's 20-test suite (still 20/20 pass). The hybrid carve-out
pattern (`DijkstraHandTrace`) is documented inline in the `routedStraight`
useMemo's JSDoc.

**Standing lessons for B7.3..B7.5:**
- **Multi-instance via per-instance `useMemo`.** When a viz has multiple
  instances/presets with different node sets, build the `routedEdge`
  closure via `useMemo` keyed on the active instance — mirror of B6's
  `DagSourceWalk` and B4's `ConstantShiftFail`. The closure captures
  the per-instance `rects` array and `rectById` map.
- **Hybrid carve-outs use the `WhyBFSFailsWeighted` precedent verbatim.**
  When some edges carry a `curve` (or equivalent visual-signal) field,
  branch on it at the call site and call the routed helper only on the
  straight branch. Don't try to unify them through `routeEdge` — the
  hand-tuned curve IS the teaching surface.

#### B7.3 — Tree-shape vizzes (B5 mirror) ✅ DONE 2026-05-25

3 tree-shaped vizzes retrofitted: binary tree, Huffman tree, recursion tree.
Mirror of B5's three sub-groups (heap, Huffman, problem-bank tree). No new
shared helper.

- `components/viz/MaxHeapKeyDecrease.tsx` ✅ (7 named positions with module-scope COORDS — `Pos` enum keys; `NODE_R = 22`; undirected center-to-center; module-scope `NODE_RECTS` + `NODE_RECT_BY_ID<Pos, NodeRect>`; stroke-dasharray carries through to `<path>` for the swapped-edge styling)
- `components/viz/HuffmanEncodeDecode.tsx` ✅ (9-node static Huffman tree on the ΚΑΣΤΑΝΑΣ instance; per-node varying radii leaf=22 / internal=19 with explicit per-node `NodeRect.{w,h}`; module-scope `NODE_RECTS` + `NODE_RECT_BY_ID<string, NodeRect>`; `routedEdge(parent, child)` returns `{g, mx, my}` with line-midpoint OR Bezier-midpoint `(A + B + 2·Q) / 4` for the bit label anchor — mirror of `HuffmanTreeBuilder` from B5)
- `components/viz/RecursionExplosion.tsx` ✅ (dynamic recursion tree, layout depends on `(n, mode, cfg)` transitively via `nodes`; per-render `nodeRects`/`nodeRectById` via `useMemo([nodes])`; **rects are built in the rendered, post-MARGIN coordinate frame** so `routeEdge` operates on the same geometry the SVG actually draws — standing lesson for any viz that adds a render-time offset to its node positions; dropped now-unused `posByUid` map; mirror of `BinaryHeapAnimator` from B5)

**Retrofit shape (as executed).** Three patterns applied per file, all
mirrors of B5 precedents — no new shared helper:

- **Module-scope rects, single static layout (1 file):** `MaxHeapKeyDecrease`.
  Mirror of `HeapArrayMap` (B5). One radius, uniform `NODE_R`, rects built
  at module load by iterating the COORDS record.
- **Module-scope rects with per-node varying radii (1 file):**
  `HuffmanEncodeDecode`. Mirror of `HuffmanSwapViz` (B5). Per-node radius
  set via `n.char ? LEAF_R : INTERNAL_R`, explicit per-node `NodeRect.{w,h}`
  (the standing lesson from B5: don't oversize all rects to the largest
  radius when the layout has limited margin; the leaf/internal split here
  is 22 / 19 over a ~70 px row gap so the size delta matters for the
  collision test).
- **Per-render `useMemo` rects, dynamic layout (1 file):**
  `RecursionExplosion`. Mirror of `BinaryHeapAnimator` (B5). The layout
  itself is already memoized over `(n, mode, cfg)` upstream; the rect set
  re-memos keyed on the resulting `nodes` array. **Rendered positions
  include a `+MARGIN` offset** that the pre-retrofit code applied at edge
  draw time. The rects bake this offset in so `routeEdge` sees the same
  pixel-space geometry the user does — without this, collision testing
  would be misaligned by `MARGIN` in both axes. Standing lesson for any
  future viz that translates node positions at render time: build rects in
  the post-translation frame, not the layout's native frame.

Every consumer branches on `g.kind === 'line' ? <line> : <path d={g.d}
fill="none">`. The Huffman bit label uses the standard line-or-Bezier
midpoint formula (mirror of B5/B6/B7.1/B7.2). The `MaxHeapKeyDecrease`
swapped-edge `stroke-dasharray` carries through to both the line and path
branches unchanged. The `RecursionExplosion` edges are plain (no
labels/dasharray/markers) so the branch is a clean line/path swap.

**Steady-state visual contract:** every retrofitted edge in every B7.3
viz routes as a line on the current layouts — verified by inspection. The
tree shapes (binary heap, Huffman, recursion tree) are by construction
collision-free: each level sits in its own horizontal row, children fan
out below their parent, no unrelated node sits on any parent→child
centerline. The line case is byte-identical to the pre-retrofit `<line
x1=parent.x …>` output. No user-visible change today; the value is
structural lockout per the audit's standing thesis.

**No new tests required.** `routeEdge` / `trimEdgeGeom` were both locked
by B1's 20-test suite (still 20/20 pass). The collision-free tree
construction means the retry loop never fires; a future layout edit that
breaks collision-freeness would surface as a visible curve in the viz —
that's the regression channel.

**Standing lessons for B7.4..B7.5:**
- **Post-translation rect frame.** When a viz renders nodes at a
  translated position (e.g. `<circle cx={nd.x + MARGIN} cy={nd.y + MARGIN}
  />`), build the `NodeRect[]` in that same translated frame
  (`x: nd.x + MARGIN - R`) so `routeEdge` works on the geometry the SVG
  actually draws. Native-frame rects would silently misalign collision
  testing by the offset.

#### B7.4 — Multi-instance / multi-tab graphs (B6 mirror)

2 vizzes with multiple presets / tabs that have DIFFERENT node sets. Mirror
of B6's `LayeredSubsetsDAG` / `LayeredTripPlanner` pattern — either per-tab
module-scope rect sets or per-render `useMemo` keyed on the active instance.

- `components/viz/ComponentsBfsSweep.tsx` (2 presets via `instance` prop: `pt5-th1` = 11 nodes / 3 components / 13 undirected edges; `head-succ` = 8 nodes / 3 components / 6 undirected edges. No weights. Renders without trim — circles drawn center-to-center.)
- `components/viz/TopoSortClassMatrix.tsx` (4 tabs each with a different directed graph: weights = 4 nodes / 4 edges; dag = 5/5; tree = 7/6; bipartite = 6/7. Weight labels on tab `weights`; arrows on every tab.)

#### B7.5 — Bespoke graph scenarios

3 standalone scenario graphs that don't fit any other sub-chunk.

- `components/viz/PartyDegreeFilter.tsx` (10-node static graph, undirected, no weights, no trim. Dynamic edge visibility based on the `present` set.)
- `components/viz/GreedyColoringOrders.tsx` (6-node hexagon + 2 diagonals, undirected, no weights, no trim. Static layout.)
- `components/viz/CyclingTripScene.tsx` (4-city K₄ from E.4.5.A, 6 undirected weighted edges. Edge color/dasharray switches based on day-slider — `useMemo` not needed since layout doesn't depend on state.)

#### Out of scope — confirmed no-inter-node-edges in B7

These render `<line>` / `<path>` for chart axes, sliders, timelines, Gantt
bars, DP tables, alignment tapes, scene-illustration banks-and-boat, or
number-line layouts. They do not draw edges between positioned graph nodes.

- `FloodFillGrid.tsx` — pixel grid, BFS over cells (no graph edges; cells are pixels)
- `InternetPlanCounter.tsx` — 13-month timeline with decision blocks
- `KnapsackToIntervalScheduling.tsx` — 5 ad cards + Gantt-style interval row
- `LamppostsMISViz.tsx` — street + lampposts on a number line (the `<line>` is the road's dashed center)
- `UnitIntervalCover.tsx` — number line with points + unit intervals (the `<line>` is the axis)
- `LaundryFlowShop.tsx` — Gantt-style flow-shop schedule
- `RestaurantSpacingDP.tsx` — restaurants on a number-line road with exclusion zones
- `RiverCrossingGame.tsx` — scene illustration (banks/river/boat/character emojis) — no graph nodes/edges
- `AlignmentBuilder.tsx` — alignment tape (TapeColumn-per-step) — string columns, not graph
- `WeightedIntervalDP.tsx` — interval bars + DP table (the `<line>` is a column divider)
- `RodCuttingDP.tsx` — horizontal rod bar visualization, not a graph
- `PjExplorer.tsx` — interval rows on a timeline with a compatibility-zone shade
- `GreedyFailsWeighted.tsx` — interval Gantt with pick/skip decisions
- `PathBuilder.tsx` — ✅ ALREADY DONE in B3 (L06 base graph viz; legitimate dual-listing)

#### Carve-outs in B7 — hand-tuned visuals where the curve IS the teaching surface

These DO draw edges between positioned nodes but the curve is a deliberate
visual encoding that `routeEdge` would destroy. Collection joins:
`WhyBFSFailsWeighted` (B2), `DfsTreeBuilder` back-edges (B3),
`TopoOrderBuilder` (B6), `NegativeCycleDetector` (B6), the `DijkstraHandTrace`
`c→a` curve (B7.2 hybrid).

- `SegmentCrossingsToInversions.tsx` — two parallel rails (top/bottom) with line segments crossing between them. The crossings ARE the teaching surface; auto-routing would either route around the inversions (destroying the «τομή ⇔ αντιστροφή» visual) or curve them and break the geometric isomorphism. Documented carve-out.
- `SightseeingScene.tsx` — pins on a baseline; taxi segments drawn as Bezier arcs ABOVE the line, scooter segments as arcs BELOW. The arc DIRECTION encodes transport type. `routeEdge` doesn't know about this convention.
- `SightseeingDP.tsx` — same scene layout as `SightseeingScene` (sights on a baseline + taxi-above / scooter-below arcs encoding transport type during DP step-through).
- `EditGraphViz.tsx` — DP grid (m × n cells) where edges only connect ADJACENT cells (right / down / diagonal). By construction every edge is collision-free (adjacent cells are at unit distance, no third cell lies on any segment). Retrofit value is zero. Documented carve-out.

---

## Out of scope — confirmed no-inter-node-edges (chart / table / Gantt only)

These render `<line>`/`<path>` but for chart axes, sliders, sparklines,
table grids, Gantt bars, or recursion-tree branches without rect-positioned
nodes. They do not exhibit the «edge through unrelated node» class of bug.

- `BigOPlayground.tsx`, `DefinitionPlayground.tsx`, `LimitRatioPlot.tsx`,
  `OscillatorComparison.tsx`, `StrictVsLooseExplorer.tsx`,
  `AsymptoticVerdictExplorer.tsx`, `SandwichTheoremViz.tsx`,
  `ExponentiationBreaksO.tsx`, `HierarchyRace.tsx`, `FasterComputerLab.tsx`
  — function-growth charts
- `LogVsLinearRace.tsx`, `ComplexityCasesExplorer.tsx`,
  `InstanceDimensionLab.tsx`, `ComplexityTightVsLoose.tsx` — bar / formula
  comparisons
- `SortRace.tsx`, `TwoPointerMerge.tsx`, `MergeSortAnimator.tsx`,
  `InversionCounter.tsx`, `InversionTypeExplorer.tsx`,
  `DominantColourProof.tsx`, `DominantColourBoard.tsx`,
  `RecursionTreeBranching.tsx`, `KaratsubaStep.tsx`, `HanoiAnimator.tsx`,
  `SplitRatioExplorer.tsx`, `DecisionTreeLowerBound.tsx`,
  `OneDClosestPair.tsx`, `QuadrantSplitFail.tsx`, `MedianLineSplit.tsx`,
  `StripJustification.tsx`, `DeltaHalfBoxes.tsx`, `PresortTrick.tsx`,
  `PeakFinder.tsx`, `ClosestPairScan.tsx` — array / grid / chart vizzes
- `IntervalScheduling.tsx`, `IntervalPartitionAnimator.tsx`,
  `GreedyHorizon.tsx`, `GreedyStaysAhead.tsx`, `LatenessScheduler.tsx`,
  `LatenessExchangeViz.tsx`, `GasStationsGreedy.tsx`,
  `AlternatingPeaksValleys.tsx`, `GridGreedyVsOpt.tsx` — Gantt / interval
  bars
- `KnapsackTable.tsx`, `KnapsackGreedyFail.tsx`, `KnapsackWhyTwoVars.tsx`,
  `PseudoPolyExplorer.tsx`, `SubsequenceExplorer.tsx`, `LcsTable.tsx`,
  `EditDistanceTable.tsx`, `TwoRowSweep.tsx`, `HirschbergViz.tsx`,
  `PjScan.tsx`, `DPTableLowerBound.tsx` — DP tables / 2D grids
- `CompressionCostLab.tsx`, `PrefixDecoder.tsx` — Huffman bars / decoder
  tree-walk
- `BinarySearchViz.tsx`, `RecallDrill.tsx`, `TraversalGame.tsx` —
  array-state UIs

(Each is one quick `Read` to confirm in the chunk turn it lives in — do
not retrofit blindly. If on second read a viz here actually draws edges
between positioned nodes, promote it to a Chunk B7 sub-batch.)

---

## Adoption rules (binding for every chunk turn)

1. **Build `NodeRect[]` from the viz's existing layout map.** For
   rectangular nodes, the rect IS the AABB. For circular nodes, use the
   bounding square `{x: cx-r, y: cy-r, w: 2r, h: 2r}` — conservative, but
   correct.
2. **Always include ALL graph nodes in `allNodes`.** Endpoint filtering is
   done by `routeEdge` via `id` matching.
3. **Stable ids.** Whatever the viz uses to identify nodes (numeric state,
   letter, index) must be passed as `NodeRect.id` so endpoint exclusion
   works.
4. **Adopt the geometry, not the style.** `routeEdge` returns geometry
   only (`{kind: 'line', x1,y1,x2,y2}` or `{kind: 'curve', d, cx, cy}`).
   Stroke colour, width, dasharray, animation — all stay in the consumer.
5. **No new client-side dependencies.** `routeEdge` is pure and runs at
   render time. No state, no effects, no reflow cost (it's a few μs per
   edge).
6. **Per-chunk acceptance.** `typecheck` + `lint` + `test` + `build` all
   pass. Spot-check the retrofitted viz in light + dark + mobile widths.
   Most retrofits should be visual no-ops; any straight-line-becomes-curve
   that is NOT a latent bug fix is a follow-up (file it, don't suppress).
