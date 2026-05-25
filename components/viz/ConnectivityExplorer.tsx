'use client'

/**
 * ConnectivityExplorer — components made visible by flood fill (L06).
 *
 * The lecture defines a connected component as "the maximal set of
 * vertices that can reach each other". Definitions like that stay vague
 * until the student sees the wall: pick a vertex on a 3-piece graph and
 * watch a flood fill spread out until it physically can't cross — that
 * boundary IS the component. Two modes:
 *
 *   Tab «Διάλεξε αφετηρία» — click a vertex; its component lights up by
 *   BFS waves; the other components stay grey, materialising the
 *   "δεν φτάνουν όλοι σε όλους" gap.
 *
 *   Tab «Έκοψε ακμή» — start from a connected single-piece graph; the
 *   user removes any "bridge" edge, the indicator flips from «1 συνιστώσα»
 *   to «2 συνιστώσες» and the graph splits into two coloured halves.
 *
 * Built for L06.
 */

import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type CNode = { id: string; x: number; y: number }
type CEdge = { a: string; b: string; bridge?: boolean }

// --- Tab 1 graph: three disconnected components -----------------------------
const TRI_NODES: CNode[] = [
  // component A — left cluster (5)
  { id: 'a1', x: 70, y: 80 },
  { id: 'a2', x: 150, y: 50 },
  { id: 'a3', x: 220, y: 100 },
  { id: 'a4', x: 130, y: 160 },
  { id: 'a5', x: 60, y: 200 },
  // component B — top right (2)
  { id: 'b1', x: 380, y: 60 },
  { id: 'b2', x: 440, y: 130 },
  // component C — bottom right (4)
  { id: 'c1', x: 320, y: 220 },
  { id: 'c2', x: 400, y: 250 },
  { id: 'c3', x: 470, y: 200 },
  { id: 'c4', x: 480, y: 280 },
]
const TRI_EDGES: CEdge[] = [
  { a: 'a1', b: 'a2' },
  { a: 'a2', b: 'a3' },
  { a: 'a1', b: 'a4' },
  { a: 'a4', b: 'a3' },
  { a: 'a4', b: 'a5' },
  { a: 'b1', b: 'b2' },
  { a: 'c1', b: 'c2' },
  { a: 'c2', b: 'c3' },
  { a: 'c2', b: 'c4' },
  { a: 'c3', b: 'c4' },
]

// --- Tab 2 graph: one connected, two bridges -------------------------------
const BR_NODES: CNode[] = [
  { id: 'L1', x: 60, y: 80 },
  { id: 'L2', x: 140, y: 50 },
  { id: 'L3', x: 130, y: 150 },
  { id: 'L4', x: 60, y: 200 },
  { id: 'M', x: 240, y: 130 },
  { id: 'R1', x: 350, y: 60 },
  { id: 'R2', x: 420, y: 130 },
  { id: 'R3', x: 350, y: 200 },
]
const BR_EDGES: CEdge[] = [
  { a: 'L1', b: 'L2' },
  { a: 'L2', b: 'L3' },
  { a: 'L1', b: 'L4' },
  { a: 'L3', b: 'L4' },
  { a: 'L2', b: 'M', bridge: true }, // bridge!
  { a: 'M', b: 'R1', bridge: true }, // bridge!
  { a: 'R1', b: 'R2' },
  { a: 'R2', b: 'R3' },
  { a: 'R1', b: 'R3' },
]

type Tab = 'fill' | 'cut'

function neighbours(edges: CEdge[], id: string, removed: Set<number>): string[] {
  const out: string[] = []
  edges.forEach((e, i) => {
    if (removed.has(i)) return
    if (e.a === id) out.push(e.b)
    else if (e.b === id) out.push(e.a)
  })
  return out
}

function bfsLayers(
  nodes: CNode[],
  edges: CEdge[],
  removed: Set<number>,
  seed: string,
): string[][] {
  const seen = new Set([seed])
  const layers: string[][] = [[seed]]
  let frontier = [seed]
  while (frontier.length) {
    const next: string[] = []
    for (const v of frontier) {
      for (const u of neighbours(edges, v, removed)) {
        if (seen.has(u)) continue
        seen.add(u)
        next.push(u)
      }
    }
    if (next.length) layers.push(next)
    frontier = next
  }
  return layers
}

function components(nodes: CNode[], edges: CEdge[], removed: Set<number>): string[][] {
  const seen = new Set<string>()
  const comps: string[][] = []
  for (const n of nodes) {
    if (seen.has(n.id)) continue
    const layers = bfsLayers(nodes, edges, removed, n.id)
    const comp = layers.flat()
    for (const v of comp) seen.add(v)
    comps.push(comp)
  }
  return comps
}

const COMP_COLORS = [
  { fill: '#fda4af', stroke: '#e11d48', light: '#fff1f2' },
  { fill: '#fcd34d', stroke: '#ca8a04', light: '#fffbeb' },
  { fill: '#86efac', stroke: '#16a34a', light: '#f0fdf4' },
  { fill: '#93c5fd', stroke: '#2563eb', light: '#eff6ff' },
]

// --- collision rects, one per graph (visible node radius r=16 + 1 px) ---
const NODE_R = 16
const RECT_R = NODE_R + 1
function buildRects(nodes: CNode[]): NodeRect[] {
  return nodes.map((n) => ({
    id: n.id,
    x: n.x - RECT_R,
    y: n.y - RECT_R,
    w: 2 * RECT_R,
    h: 2 * RECT_R,
  }))
}
const TRI_RECTS = buildRects(TRI_NODES)
const TRI_RECT_BY_ID = new Map(TRI_RECTS.map((r) => [r.id, r]))
const BR_RECTS = buildRects(BR_NODES)
const BR_RECT_BY_ID = new Map(BR_RECTS.map((r) => [r.id, r]))

function routeTriEdge(a: string, b: string) {
  return routeEdge(TRI_RECT_BY_ID.get(a)!, TRI_RECT_BY_ID.get(b)!, TRI_RECTS)
}
function routeBrEdge(a: string, b: string) {
  return routeEdge(BR_RECT_BY_ID.get(a)!, BR_RECT_BY_ID.get(b)!, BR_RECTS)
}

export function ConnectivityExplorer() {
  const [tab, setTab] = useState<Tab>('fill')

  // ---------- Tab 1: flood-fill from a seed ----------
  const [seed, setSeed] = useState<string>('a1')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const layers = useMemo(
    () => bfsLayers(TRI_NODES, TRI_EDGES, new Set(), seed),
    [seed],
  )
  const last = layers.length

  useEffect(() => {
    if (!playing) return
    if (step >= last) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => s + 1), 500)
    return () => clearTimeout(t)
  }, [playing, step, last])

  const distOf = useMemo(() => {
    const m = new Map<string, number>()
    layers.forEach((lyr, i) => lyr.forEach((v) => m.set(v, i)))
    return m
  }, [layers])

  const triComps = useMemo(() => components(TRI_NODES, TRI_EDGES, new Set()), [])
  const seedComp = triComps.findIndex((c) => c.includes(seed))
  const seedColor = COMP_COLORS[seedComp % COMP_COLORS.length]

  // ---------- Tab 2: cut a bridge ----------
  const [removed, setRemoved] = useState<Set<number>>(new Set())
  const cutComps = useMemo(
    () => components(BR_NODES, BR_EDGES, removed),
    [removed],
  )
  const compOfBr = useMemo(() => {
    const m = new Map<string, number>()
    cutComps.forEach((c, i) => c.forEach((v) => m.set(v, i)))
    return m
  }, [cutComps])

  function pickSeed(id: string) {
    setSeed(id)
    setStep(0)
    setPlaying(false)
  }
  function reset1() {
    setStep(0)
    setPlaying(false)
  }
  function reset2() {
    setRemoved(new Set())
  }
  function toggleEdge(i: number) {
    setRemoved((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  // narration for tab 1
  const fillFilled = Array.from(distOf.values()).filter((d) => d <= step - 1).length
  const fillFrontier = step > 0 ? (layers[step - 1]?.length ?? 0) : 0
  let fillNote: string
  if (step === 0) {
    fillNote = `Διάλεξε κορυφή, ή πάτα ▶. Το «κύμα» θα ανάψει τη συνιστώσα όπου ανήκει αυτή η κορυφή.`
  } else if (step < last) {
    fillNote = `Κύμα #${step}: άναψαν ${fillFrontier} κορυφές σε απόσταση ${step - 1} από την αφετηρία.`
  } else {
    fillNote = `Τέλος. Το κύμα γέμισε ${fillFilled} κορυφές — τη συνιστώσα όπου ανήκει η ${seed}. Οι άλλες ${TRI_NODES.length - fillFilled} κορυφές έμειναν γκρι: από την ${seed} ΔΕΝ υπάρχει διαδρομή που να φτάνει σε αυτές. Δοκίμασε κορυφή από άλλη συνιστώσα.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header tabs */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Συνεκτικότητα & συνιστώσες — δες πού φτάνει το «κύμα»
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-border text-xs font-medium">
          {(['fill', 'cut'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'px-2.5 py-1 transition-colors',
                tab === t
                  ? 'bg-accent text-accent-fg'
                  : 'bg-bg-elevated text-fg-subtle hover:bg-bg-soft',
              )}
            >
              {t === 'fill' ? 'Διάλεξε αφετηρία' : 'Έκοψε ακμή'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'fill' && (
        <>
          <p className="mb-3 text-xs text-fg-subtle">
            Τρεις ασύνδετοι «νησιώτες». Κλικ σε όποια κορυφή θες — ή ▶ — και δες
            πώς το κύμα μένει εγκλωβισμένο στη συνιστώσα του.
          </p>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="graph-canvas">
              <svg
                viewBox="0 0 530 320"
                className="mx-auto block h-auto w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {TRI_EDGES.map((e, i) => {
                  const g = routeTriEdge(e.a, e.b)
                  const lit =
                    (distOf.get(e.a) ?? Infinity) <= step - 1 &&
                    (distOf.get(e.b) ?? Infinity) <= step - 1
                  const stroke = lit ? seedColor.stroke : '#d6d3d1'
                  const sw = lit ? 3.5 : 2
                  return g.kind === 'line' ? (
                    <line
                      key={`te${i}`}
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
                      key={`te${i}`}
                      d={g.d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={sw}
                      strokeLinecap="round"
                    />
                  )
                })}
                {TRI_NODES.map((n) => {
                  const d = distOf.get(n.id)
                  const lit = d !== undefined && d <= step - 1
                  const fill = lit ? seedColor.fill : '#ffffff'
                  const stroke = lit ? seedColor.stroke : '#9b8a8d'
                  const isSeed = n.id === seed
                  return (
                    <g
                      key={`tn${n.id}`}
                      transform={`translate(${n.x} ${n.y})`}
                      className="cursor-pointer"
                      onClick={() => pickSeed(n.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Κορυφή ${n.id}`}
                    >
                      <circle r={22} fill="transparent" />
                      <circle r={16} fill={fill} stroke={stroke} strokeWidth={2.5} />
                      {isSeed && (
                        <circle
                          r={20}
                          fill="none"
                          stroke={seedColor.stroke}
                          strokeWidth={1.5}
                          strokeDasharray="3 2"
                        />
                      )}
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={700}
                        fill={lit ? '#1c1214' : '#5a4a4d'}
                      >
                        {n.id}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                {triComps.map((c, i) => {
                  const isSeedComp = c.includes(seed)
                  const col = COMP_COLORS[i % COMP_COLORS.length]
                  return (
                    <div
                      key={i}
                      className={cn(
                        'rounded-md border-2 px-2 py-1.5',
                        isSeedComp ? '' : 'opacity-60',
                      )}
                      style={{
                        borderColor: col.stroke,
                        background: col.light,
                      }}
                    >
                      <div
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: col.stroke }}
                      >
                        Συνιστώσα {i + 1}
                      </div>
                      <div className="font-mono text-sm font-bold text-fg">
                        {c.length} κορυφές
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
                {fillNote}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={reset1}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Καθαρά
                </button>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  disabled={step >= last}
                  className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {playing ? (
                    <>
                      <Pause className="h-4 w-4" aria-hidden="true" /> Παύση
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" aria-hidden="true" /> Παίξε
                    </>
                  )}
                </button>
                <span className="ml-auto text-xs text-fg-subtle">
                  κύμα {step} / {last}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'cut' && (
        <>
          <p className="mb-3 text-xs text-fg-subtle">
            Ένα γράφημα συνεκτικό — μία συνιστώσα. Κλικ σε μια ακμή για να την
            «κόψεις». Δύο γέφυρες είναι σημαδεμένες με διακεκομμένο: αν τις
            κόψεις, ολόκληρο το γράφημα σπάει.
          </p>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="graph-canvas">
              <svg
                viewBox="0 0 500 280"
                className="mx-auto block h-auto w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {BR_EDGES.map((e, i) => {
                  const g = routeBrEdge(e.a, e.b)
                  const cut = removed.has(i)
                  const isBr = e.bridge
                  const stroke = cut ? '#dc2626' : isBr ? '#0ea5e9' : '#9b8a8d'
                  const sw = cut ? 1.5 : isBr ? 3 : 2.5
                  const dash = cut || isBr ? '5 4' : undefined
                  // Render BOTH the visible edge and the 20-px hit target with
                  // matching geometry — line case stays two <line>s, curve
                  // case stays two <path>s so the click target follows the
                  // visible arc instead of running along the straight chord.
                  return (
                    <g key={`be${i}`}>
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
                            strokeWidth={20}
                            className="cursor-pointer"
                            onClick={() => toggleEdge(i)}
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
                            strokeWidth={20}
                            className="cursor-pointer"
                            onClick={() => toggleEdge(i)}
                          />
                        </>
                      )}
                    </g>
                  )
                })}
                {BR_NODES.map((n) => {
                  const ci = compOfBr.get(n.id) ?? 0
                  const col = COMP_COLORS[ci % COMP_COLORS.length]
                  return (
                    <g key={`bn${n.id}`} transform={`translate(${n.x} ${n.y})`}>
                      <circle r={16} fill={col.fill} stroke={col.stroke} strokeWidth={2.5} />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
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

            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  Αριθμός συνιστωσών
                </div>
                <div className="font-mono text-3xl font-bold text-fg">{cutComps.length}</div>
                <div className="mt-1 text-xs text-fg-muted">
                  Πλήθος κομματιών: {cutComps.map((c) => c.length).join(' + ')}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
                {removed.size === 0
                  ? 'Όλες οι ακμές μέσα — μία συνιστώσα. Πάτα μια ακμή για να την αφαιρέσεις και παρατήρησε ποιες σπάνε τη συνεκτικότητα.'
                  : cutComps.length === 1
                    ? `Αφαιρέθηκαν ${removed.size} ακμές, το γράφημα μένει συνεκτικό — αυτές δεν ήταν γέφυρες.`
                    : `Αφαιρέθηκαν ${removed.size} ακμές → ${cutComps.length} συνιστώσες. Οι «γέφυρες» (γαλάζιες) είναι ακμές που η αφαίρεσή τους αυξάνει το πλήθος συνιστωσών.`}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={reset2}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Επανάφερε όλες τις ακμές
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
