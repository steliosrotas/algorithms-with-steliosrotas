'use client'

/**
 * DagSourceWalk — why every DAG must contain a source (a vertex with no
 * incoming edge). This is the engine of the «τοπολογική διάταξη ⇔ DAG»
 * theorem, and it is pure proof-by-contradiction: hard to feel from prose.
 *
 * You start anywhere and walk edges BACKWARD — each step jumps to a
 * predecessor of the current vertex. Two presets:
 *   • DAG: the walk always jams against a vertex with no predecessors. That
 *     stuck vertex is a source — so a source must exist.
 *   • «Χωρίς πηγή»: every vertex has an incoming edge, so the walk can never
 *     jam — and with finitely many vertices it must revisit one, closing a
 *     cycle. A graph with a cycle is not a DAG. Contradiction.
 * Built for L12.
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type Node = { id: string; x: number; y: number }
type Preset = {
  nodes: Node[]
  edges: [string, string][]
  acyclic: boolean
}

const PRESETS: Record<'dag' | 'source-free', Preset> = {
  dag: {
    nodes: [
      { id: 'A', x: 66, y: 162 },
      { id: 'B', x: 182, y: 84 },
      { id: 'C', x: 300, y: 162 },
      { id: 'D', x: 418, y: 162 },
      { id: 'E', x: 534, y: 162 },
      { id: 'F', x: 182, y: 240 },
    ],
    edges: [
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'D'],
      ['D', 'E'],
      ['A', 'F'],
      ['F', 'C'],
    ],
    acyclic: true,
  },
  'source-free': {
    nodes: [
      { id: 'C', x: 300, y: 164 },
      { id: 'A', x: 168, y: 86 },
      { id: 'B', x: 168, y: 242 },
      { id: 'D', x: 444, y: 86 },
      { id: 'E', x: 444, y: 242 },
    ],
    edges: [
      ['C', 'A'],
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'D'],
      ['D', 'E'],
      ['E', 'C'],
    ],
    acyclic: false,
  },
}

const VIEW_W = 600
const VIEW_H = 304
const R = 24

export function DagSourceWalk() {
  const [preset, setPreset] = useState<'dag' | 'source-free'>('dag')
  const [path, setPath] = useState<string[]>([])
  const [ended, setEnded] = useState<'cycle' | 'source' | null>(null)
  const [cycleStart, setCycleStart] = useState<number | null>(null)

  const cfg = PRESETS[preset]
  const { rects: nodeRects, rectById: nodeRectById } = useMemo(() => {
    const rects: NodeRect[] = cfg.nodes.map((n) => ({
      id: n.id,
      x: n.x - R,
      y: n.y - R,
      w: 2 * R,
      h: 2 * R,
    }))
    const byId = new Map(rects.map((r) => [r.id as string, r]))
    return { rects, rectById: byId }
  }, [cfg])

  /** Routed directed edge, symmetric trim by R so the arrowhead lands on
   *  the destination border. */
  const routedEdge = (fromId: string, toId: string) => {
    const a = nodeRectById.get(fromId)!
    const b = nodeRectById.get(toId)!
    const ax = a.x + a.w / 2
    const ay = a.y + a.h / 2
    const bx = b.x + b.w / 2
    const by = b.y + b.h / 2
    const geom = routeEdge(a, b, nodeRects)
    return trimEdgeGeom(geom, ax, ay, R, bx, by, R)
  }

  const preds = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const n of cfg.nodes) m.set(n.id, [])
    for (const [u, v] of cfg.edges) m.get(v)!.push(u)
    return m
  }, [cfg])

  const current = path.length ? path[path.length - 1] : null

  // which vertices can be clicked right now
  const clickable = useMemo(() => {
    if (ended) return new Set<string>()
    if (path.length === 0) return new Set(cfg.nodes.map((n) => n.id))
    return new Set(preds.get(current!) ?? [])
  }, [ended, path, current, preds, cfg])

  // edges traversed by the walk so far: key `${from}->${to}`
  const traversed = useMemo(() => {
    const s = new Set<string>()
    for (let k = 1; k < path.length; k++) s.add(`${path[k]}->${path[k - 1]}`)
    return s
  }, [path])

  // edges that close the cycle, when one was found
  const cycleEdges = useMemo(() => {
    const s = new Set<string>()
    if (ended !== 'cycle' || cycleStart === null) return s
    const m = path.length - 1
    s.add(`${path[cycleStart]}->${path[m]}`)
    for (let k = cycleStart; k < m; k++) s.add(`${path[k + 1]}->${path[k]}`)
    return s
  }, [ended, cycleStart, path])

  const cycleNodes = useMemo(() => {
    if (ended !== 'cycle' || cycleStart === null) return new Set<string>()
    return new Set(path.slice(cycleStart))
  }, [ended, cycleStart, path])

  function clickNode(id: string) {
    if (ended || !clickable.has(id)) return
    if (path.length === 0) {
      setPath([id])
      if ((preds.get(id) ?? []).length === 0) setEnded('source')
      return
    }
    const seen = path.indexOf(id)
    if (seen !== -1) {
      // revisited a vertex — the walk has closed a cycle
      setCycleStart(seen)
      setEnded('cycle')
      return
    }
    const next = [...path, id]
    setPath(next)
    if ((preds.get(id) ?? []).length === 0) setEnded('source')
  }

  function choosePreset(p: 'dag' | 'source-free') {
    setPreset(p)
    setPath([])
    setEnded(null)
    setCycleStart(null)
  }

  function reset() {
    setPath([])
    setEnded(null)
    setCycleStart(null)
  }

  let note: string
  if (path.length === 0) {
    note =
      'Διάλεξε μια κορυφή για αφετηρία — οποιαδήποτε. Από εκεί θα ακολουθήσουμε ακμές ΠΡΟΣ ΤΑ ΠΙΣΩ, πηγαίνοντας κάθε φορά σε έναν προκάτοχο.'
  } else if (ended === 'source') {
    note = `Κόλλησες στην ${current}: δεν έχει καμία εισερχόμενη ακμή — είναι ΠΗΓΗ. Σε ένα DAG η αναζήτηση προς τα πίσω δεν μπορεί να συνεχίζεται για πάντα, οπότε σταματά αναγκαστικά σε μια πηγή. Άρα κάθε DAG έχει πηγή.`
  } else if (ended === 'cycle') {
    const revisit = path[cycleStart!]
    const ring = path.slice(cycleStart!)
    note = `Ξαναβρέθηκες στην ${revisit}! Ακολουθώντας ακμές προς τα πίσω, η διαδρομή ${ring.join(' ← ')} ← ${revisit} έκλεισε κύκλο. Αν καμία κορυφή δεν ήταν πηγή, η αναζήτηση προς τα πίσω δεν θα τελείωνε ποτέ — και με πεπερασμένες κορυφές, αυτό σημαίνει αναγκαστικά κύκλο. Άτοπο για DAG: άρα κάθε DAG έχει πηγή.`
  } else {
    const list = (preds.get(current!) ?? []).join(', ')
    note = `Είσαι στην ${current}. Ακολούθησε μια ακμή προς τα πίσω: κάνε κλικ σε έναν προκάτοχό της — ${list}.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + preset toggle */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Αναζήτηση πηγής — ακολούθα ακμές προς τα πίσω
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['dag', 'source-free'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => choosePreset(p)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                preset === p
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {p === 'dag' ? 'DAG' : 'Χωρίς πηγή'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        {preset === 'dag'
          ? 'Κάθε DAG: δες πού σε οδηγεί το περπάτημα προς τα πίσω.'
          : 'Εδώ ΚΑΘΕ κορυφή έχει εισερχόμενη ακμή (καμία πηγή). Δες τι αναγκαστικά συμβαίνει.'}
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {[
              ['dsw-grey', '#9b8a8d'],
              ['dsw-blue', '#2563eb'],
              ['dsw-green', '#16a34a'],
              ['dsw-red', '#dc2626'],
            ].map(([id, color]) => (
              <marker
                key={id}
                id={id}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
              </marker>
            ))}
          </defs>

          {/* edges */}
          {cfg.edges.map(([u, v], i) => {
            const g = routedEdge(u, v)
            const key = `${u}->${v}`
            let color = '#9b8a8d'
            let mk = 'dsw-grey'
            let w = 1.8
            if (cycleEdges.has(key)) {
              color = '#dc2626'
              mk = 'dsw-red'
              w = 3.4
            } else if (traversed.has(key)) {
              color = '#2563eb'
              mk = 'dsw-blue'
              w = 3.2
            } else if (!ended && v === current && clickable.has(u)) {
              color = '#16a34a'
              mk = 'dsw-green'
              w = 2.6
            }
            return g.kind === 'line' ? (
              <line
                key={`e${i}`}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke={color}
                strokeWidth={w}
                markerEnd={`url(#${mk})`}
              />
            ) : (
              <path
                key={`e${i}`}
                d={g.d}
                fill="none"
                stroke={color}
                strokeWidth={w}
                markerEnd={`url(#${mk})`}
              />
            )
          })}

          {/* nodes */}
          {cfg.nodes.map((n) => {
            const inPath = path.includes(n.id)
            const isCurrent = n.id === current && !ended
            const canClick = clickable.has(n.id)
            const inCycle = cycleNodes.has(n.id)
            const isSource = ended === 'source' && n.id === current

            let fill = '#ffffff'
            let stroke = '#9f1239'
            const textFill = '#1c1214'
            if (inCycle) {
              fill = '#fecaca'
              stroke = '#dc2626'
            } else if (isSource) {
              fill = '#86efac'
              stroke = '#15803d'
            } else if (isCurrent) {
              fill = '#fde68a'
              stroke = '#d97706'
            } else if (inPath) {
              fill = '#dbeafe'
              stroke = '#2563eb'
            }

            return (
              <g
                key={n.id}
                role="button"
                tabIndex={canClick ? 0 : -1}
                aria-label={`Κορυφή ${n.id}`}
                onClick={() => clickNode(n.id)}
                onKeyDown={(e) => {
                  if (canClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    clickNode(n.id)
                  }
                }}
                style={{ cursor: canClick ? 'pointer' : 'default' }}
              >
                {/* clickable halo */}
                {canClick && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R + 6}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth={2.4}
                    strokeDasharray="4 3"
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.6}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={17}
                  fontWeight={800}
                  fill={textFill}
                >
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* path breadcrumb */}
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Διαδρομή
        </span>
        {path.length === 0 ? (
          <span className="text-sm text-fg-muted">— (διάλεξε αφετηρία)</span>
        ) : (
          <span className="font-mono text-sm font-bold text-fg">
            {path.join(' ← ')}
          </span>
        )}
        {ended === 'source' && (
          <span className="ml-auto rounded-md bg-success/15 px-2 py-0.5 text-sm font-bold text-success">
            ✓ βρέθηκε πηγή
          </span>
        )}
        {ended === 'cycle' && (
          <span className="ml-auto rounded-md bg-danger/15 px-2 py-0.5 text-sm font-bold text-danger">
            ✗ βρέθηκε κύκλος
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          {preset === 'dag'
            ? 'Σε DAG: το περπάτημα πίσω σταματά σε πηγή.'
            : 'Χωρίς πηγή: το περπάτημα πίσω κλείνει κύκλο.'}
        </span>
      </div>
    </section>
  )
}
