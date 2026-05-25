'use client'

/**
 * DijkstraTreeVsMstTriangle — front-set-7-ask11 (ii).
 *
 * Counterexample to «το δέντρο συντομότερων διαδρομών του Dijkstra είναι MST»:
 * a triangle u-v-w with edge weights u-v = 1, v-w = 1, u-w = 2.
 *
 * Two side-by-side panels on the SAME graph:
 *   • Dijkstra from u → tree {(u,v), (u,w)}, total 3. Minimises distance from
 *     the root: dist(v)=1, dist(w)=2 — both shortest possible.
 *   • MST → tree {(u,v), (v,w)}, total 2. Minimises TOTAL tree weight.
 *
 * The point: minimising «distance from root for every node» and minimising
 * «total edge weight» are different objectives. They can — and here do —
 * produce different trees.
 */

import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

const NODES = [
  { id: 'u', x: 120, y: 80 },
  { id: 'v', x: 270, y: 80 },
  { id: 'w', x: 195, y: 220 },
]

const EDGES = [
  { id: 'uv', a: 'u', b: 'v', w: 1 },
  { id: 'vw', a: 'v', b: 'w', w: 1 },
  { id: 'uw', a: 'u', b: 'w', w: 2 },
]

const R = 22

const NODE_RECTS: NodeRect[] = NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r]))

function routedEdge(aId: string, bId: string) {
  const aRect = NODE_RECT_BY_ID.get(aId)!
  const bRect = NODE_RECT_BY_ID.get(bId)!
  const ax = aRect.x + aRect.w / 2
  const ay = aRect.y + aRect.h / 2
  const bx = bRect.x + bRect.w / 2
  const by = bRect.y + bRect.h / 2
  const geom = trimEdgeGeom(routeEdge(aRect, bRect, NODE_RECTS), ax, ay, R, bx, by, R)
  const mx = geom.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * geom.cx) / 4
  const my = geom.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * geom.cy) / 4
  return { ...geom, mx, my }
}

function Panel({
  title,
  treeEdges,
  totalCost,
  caption,
  rootHighlight,
  totalLabel,
}: {
  title: string
  treeEdges: Set<string>
  totalCost: number
  caption: string
  rootHighlight: boolean
  totalLabel: string
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-soft/30 p-3">
      <div className="mb-2 text-xs font-semibold text-fg">{title}</div>
      <svg
        viewBox="0 0 390 280"
        className="mx-auto block w-full max-w-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        {EDGES.map((e) => {
          const g = routedEdge(e.a, e.b)
          const inTree = treeEdges.has(e.id)
          const stroke = inTree ? '#16a34a' : '#cdbfc0'
          const sw = inTree ? 3.6 : 1.6
          const dashed = !inTree
          return (
            <g key={e.id}>
              {g.kind === 'line' ? (
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeDasharray={dashed ? '4 3' : undefined}
                />
              ) : (
                <path
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeDasharray={dashed ? '4 3' : undefined}
                />
              )}
              <rect x={g.mx - 11} y={g.my - 10} width={22} height={20} rx={4} fill="#faf4ee" stroke={stroke} />
              <text x={g.mx} y={g.my} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#1c1214">
                {e.w}
              </text>
            </g>
          )
        })}
        {NODES.map((n) => {
          const isRoot = rootHighlight && n.id === 'u'
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={R}
                fill={isRoot ? '#fde2e4' : '#ffffff'}
                stroke={isRoot ? '#9f1239' : '#1c1214'}
                strokeWidth={isRoot ? 3 : 1.8}
              />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill="#1c1214">
                {n.id}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-2 rounded border border-accent/30 bg-accent/5 px-2 py-1.5 text-[11px] leading-relaxed text-fg-muted">
        {caption}
        <div className="mt-1 font-mono text-fg">
          {totalLabel} = <span className="text-success font-semibold">{totalCost}</span>
        </div>
      </div>
    </div>
  )
}

export function DijkstraTreeVsMstTriangle() {
  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 text-sm font-semibold tracking-tight text-fg">
        Δέντρο Dijkstra vs ΕΕΔ — ίδιος γράφος, διαφορετικοί στόχοι
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Τρίγωνο u-v-w με βάρη (u,v)=1, (v,w)=1, (u,w)=2. Στο ίδιο γράφημα οι δύο
        αλγόριθμοι παράγουν <strong>διαφορετικά</strong> δέντρα. Αντιπαράδειγμα
        στη δήλωση «Dijkstra-tree = ΕΕΔ».
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <Panel
          title="Δέντρο Dijkstra από ρίζα u"
          treeEdges={new Set(['uv', 'uw'])}
          totalCost={3}
          totalLabel="συνολικό βάρος"
          caption="Επιλέγει την απευθείας ακμή (u,w)=2 γιατί την οριστικοποιεί στο 2 — ίσο με τη φθηνότερη διαδρομή u→v→w. Αποστάσεις από u: v=1, w=2 (βέλτιστες)."
          rootHighlight
        />
        <Panel
          title="ΕΕΔ (Kruskal/Prim)"
          treeEdges={new Set(['uv', 'vw'])}
          totalCost={2}
          totalLabel="συνολικό βάρος"
          caption="Διαλέγει τις δύο ακμές βάρους 1, αποφεύγει τη βάρους 2. Το συνολικό κόστος είναι 2 — βέλτιστο για ΕΕΔ — αλλά η απόσταση u→w στο δέντρο γίνεται τώρα 2 (μέσω v), όχι 2 με απευθείας ακμή."
          rootHighlight={false}
        />
      </div>

      <div className="mt-3 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Διαφορετικά δέντρα ⇒ η δήλωση είναι Λάθος.</span>{' '}
        Ο Dijkstra ελαχιστοποιεί <em>αποστάσεις από τη ρίζα</em>· το ΕΕΔ
        ελαχιστοποιεί το <em>συνολικό βάρος</em> του δέντρου. Όταν αυτοί οι δύο
        στόχοι συγκρούονται, διαλέγουν διαφορετικές ακμές.
      </div>
    </section>
  )
}
