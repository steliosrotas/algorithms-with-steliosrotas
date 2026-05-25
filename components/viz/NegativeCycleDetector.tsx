'use client'

/**
 * NegativeCycleDetector — the extra-round trick that turns Bellman-Ford into a
 * negative-cycle detector.
 *
 * Pt1-Th2.1 asks "ποιον αλγόριθμο για αρνητικό κύκλο;" — the answer "Bellman-
 * Ford" lives or dies on the n-th round trick: run one MORE round than the n−1
 * BF actually needs, and watch whether anything still drops. Two tabs over
 * 4-vertex graphs:
 *  - «Χωρίς αρνητικό κύκλο»: the table stabilises by round n−1, the extra
 *    round n leaves the row unchanged → verdict: NO negative cycle.
 *  - «Με αρνητικό κύκλο»: a small a↔b cycle with sum −2; the table NEVER
 *    stabilises — round n still tightens M values → verdict: YES neg cycle.
 * Same control panel and table layout as BellmanFordAnimator, but each tab
 * runs n = V.length rounds (one beyond BF's standard limit) and a verdict
 * chip flips red the moment row n differs from row n−1.
 *
 * Built for L17 problem pt1-th2-a.
 */

import { useMemo, useState, type ReactNode } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type NCNode = { id: string; x: number; y: number }
type NCEdge = { from: string; to: string; w: number; curve?: number }

type Scenario = {
  label: string
  blurb: string
  nodes: NCNode[]
  edges: NCEdge[]
  dest: string
  hasNegCycle: boolean
  /** Note specific to round n (the extra check round). */
  checkNote: string
}

const SAFE: Scenario = {
  label: 'Χωρίς αρνητικό κύκλο',
  blurb:
    'Κανονικό γράφημα με όλα τα βάρη θετικά. Ο Bellman-Ford σταθεροποιείται και ο γύρος ελέγχου δεν αλλάζει τίποτα.',
  nodes: [
    { id: 's', x: 70, y: 150 },
    { id: 'a', x: 220, y: 80 },
    { id: 'b', x: 220, y: 220 },
    { id: 't', x: 380, y: 150 },
  ],
  edges: [
    { from: 's', to: 'a', w: 4 },
    { from: 'a', to: 'b', w: 1 },
    { from: 'b', to: 't', w: 3 },
    { from: 's', to: 't', w: 10, curve: 70 },
    { from: 'a', to: 't', w: 8 },
  ],
  dest: 't',
  hasNegCycle: false,
  checkNote:
    'Γύρος ελέγχου (n = 4). Καμία τιμή δεν αλλάζει από τον προηγούμενο γύρο — ο πίνακας έχει συγκλίνει. Συμπέρασμα: ΔΕΝ υπάρχει αρνητικός κύκλος. Η συντομότερη απόσταση s→t είναι 8 = 4 + 1 + 3, μέσω s→a→b→t.',
}

const UNSAFE: Scenario = {
  label: 'Με αρνητικό κύκλο',
  blurb:
    'Οι ακμές a→b (−3) και b→a (+1) σχηματίζουν κύκλο με συνολικό βάρος −2. Κάθε γύρος του κύκλου ρίχνει τις αποστάσεις λίγο ακόμα — δεν θα συγκλίνουν ποτέ.',
  nodes: [
    { id: 's', x: 70, y: 150 },
    { id: 'a', x: 220, y: 80 },
    { id: 'b', x: 220, y: 220 },
    { id: 't', x: 380, y: 150 },
  ],
  edges: [
    { from: 's', to: 'a', w: 1 },
    { from: 'a', to: 'b', w: -3, curve: 18 },
    { from: 'b', to: 'a', w: 1, curve: 18 },
    { from: 'b', to: 't', w: 4 },
    { from: 's', to: 't', w: 10, curve: 70 },
  ],
  dest: 't',
  hasNegCycle: true,
  checkNote:
    'Γύρος ελέγχου (n = 4). Η τιμή του a έπεσε ακόμα — από 1 σε −1 — γιατί μια διαδρομή με μία επιπλέον στροφή στον κύκλο a→b→a γλιτώνει 2 μονάδες κάθε φορά. Αφού κάτι άλλαξε στον γύρο ελέγχου, ο πίνακας ΔΕΝ θα συγκλίνει ποτέ: σε κάθε επόμενο γύρο θα πέφτει κι άλλο. Συμπέρασμα: ΥΠΑΡΧΕΙ αρνητικός κύκλος προσβάσιμος από το s προς το t.',
}

const SCENARIOS: Scenario[] = [SAFE, UNSAFE]

const INF = Infinity
const fmt = (d: number) => (d === INF ? '∞' : String(d))
const R = 23

type RoundData = { M: Record<string, number>; improvedFrom: Record<string, string> }

/** Run BF on a scenario, going for V.length rounds (one beyond BF's n−1 limit). */
function runScenario(scn: Scenario): RoundData[] {
  const verts = scn.nodes.map((n) => n.id)
  const rounds = verts.length // EXTRA round = the check
  const data: RoundData[] = []
  const init: Record<string, number> = {}
  for (const v of verts) init[v] = v === scn.dest ? 0 : INF
  data.push({ M: init, improvedFrom: {} })
  for (let i = 1; i <= rounds; i++) {
    const prev = data[i - 1].M
    const cur: Record<string, number> = { ...prev }
    const improvedFrom: Record<string, string> = {}
    for (const v of verts) {
      let best = prev[v]
      let bestVia: string | null = null
      for (const e of scn.edges) {
        if (e.from !== v) continue
        const cand = e.w + prev[e.to]
        if (cand < best) {
          best = cand
          bestVia = e.to
        }
      }
      if (bestVia !== null && best < prev[v]) {
        cur[v] = best
        improvedFrom[v] = bestVia
      }
    }
    data.push({ M: cur, improvedFrom })
  }
  return data
}

function trim(a: NCNode, b: NCNode, r: number) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  return {
    x1: a.x + (dx / len) * r,
    y1: a.y + (dy / len) * r,
    x2: b.x - (dx / len) * r,
    y2: b.y - (dy / len) * r,
  }
}

/** Compute a quadratic-curve midpoint for the label of a curved edge. */
function curvedPath(a: NCNode, b: NCNode, r: number, curve: number) {
  const { x1, y1, x2, y2 } = trim(a, b, r)
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  // perpendicular unit vector (right-hand)
  const px = -dy / len
  const py = dx / len
  const cx = mx + px * curve
  const cy = my + py * curve
  return {
    d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`,
    // label half-way between the two endpoints AND the control point (true
    // tangent midpoint of a quadratic Bézier)
    lx: 0.25 * x1 + 0.5 * cx + 0.25 * x2,
    ly: 0.25 * y1 + 0.5 * cy + 0.25 * y2,
  }
}

export function NegativeCycleDetector() {
  const [tab, setTab] = useState(0)
  const scn = SCENARIOS[tab]
  const verts = scn.nodes.map((n) => n.id)
  const POS = useMemo(() => new Map(scn.nodes.map((n) => [n.id, n])), [scn])
  const { rects: nodeRects, rectById: nodeRectById } = useMemo(() => {
    const rects: NodeRect[] = scn.nodes.map((n) => ({
      id: n.id,
      x: n.x - R,
      y: n.y - R,
      w: 2 * R,
      h: 2 * R,
    }))
    const byId = new Map(rects.map((r) => [r.id as string, r]))
    return { rects, rectById: byId }
  }, [scn])
  /** Routed STRAIGHT edge geometry (only used when `e.curve` is unset).
   *  Curved edges keep their hand-tuned `curve` value — they are visual
   *  signals (the wide s→t shortcut, the anti-parallel a↔b cycle pair),
   *  not collision routing. Mirrors the WhyBFSFailsWeighted carve-out
   *  precedent from Chunk B2. */
  const routedStraightEdge = (fromId: string, toId: string) => {
    const a = nodeRectById.get(fromId)!
    const b = nodeRectById.get(toId)!
    const ax = a.x + a.w / 2
    const ay = a.y + a.h / 2
    const bx = b.x + b.w / 2
    const by = b.y + b.h / 2
    const geom = routeEdge(a, b, nodeRects)
    return trimEdgeGeom(geom, ax, ay, R, bx, by, R)
  }
  const data = useMemo(() => runScenario(scn), [scn])
  const rounds = verts.length // n
  const LAST = rounds // step counter goes 0..n; step n = check round
  const [step, setStep] = useState(0)

  // Reset step when scenario changes
  const setTabReset = (t: number) => {
    setTab(t)
    setStep(0)
  }

  const M = data[Math.min(step, LAST)].M
  const improvedFrom = step >= 1 && step <= LAST ? data[step].improvedFrom : {}
  const improvedSet = new Set(Object.keys(improvedFrom))
  const viaEdges = new Set(
    Object.entries(improvedFrom).map(([v, w]) => `${v}->${w}`),
  )
  const inCheckRound = step === LAST

  // Did anything change in this check round?
  const anyImproved = improvedSet.size > 0

  let note: string
  if (step === 0) {
    note =
      'Αρχικοποίηση (γύρος 0). Μόνο η κορυφή-στόχος t έχει M = 0· οι υπόλοιπες ∞.'
  } else if (step < LAST) {
    const list = [...improvedSet]
      .map((v) => `${v}: ${fmt(data[step - 1].M[v])} → ${fmt(data[step].M[v])}`)
      .join(' · ')
    note = `Γύρος ${step}. Κάθε κορυφή διαβάζει τις τιμές του γύρου ${step - 1} και δοκιμάζει βελτίωση μέσω μιας εξερχόμενης ακμής.${list ? ` Βελτιώθηκαν — ${list}.` : ' Καμία βελτίωση σε αυτόν τον γύρο.'}`
  } else {
    note = scn.checkNote
  }

  // Verdict chip — only meaningful at the check round
  const verdictKnown = step >= LAST
  const verdictNegCycle = scn.hasNegCycle

  // SVG viewBox — give the curved label room
  const viewBox = '0 0 450 300'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ο γύρος-ελέγχου του Bellman-Ford — ανίχνευση αρνητικού κύκλου
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === 0
            ? 'Αρχή'
            : step === LAST
              ? anyImproved
                ? 'Άλλαξε!'
                : 'Σταθερό'
              : `Γύρος ${step} / ${rounds - 1}`}
        </span>
      </div>

      {/* tabs */}
      <div className="mb-3 inline-flex rounded-lg border border-border bg-bg-soft/40 p-0.5">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setTabReset(i)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-semibold transition-colors',
              tab === i
                ? 'bg-accent text-accent-fg shadow'
                : 'text-fg-subtle hover:text-fg',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs text-fg-subtle">{scn.blurb}</p>

      {/* graph */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={viewBox}
          className="mx-auto block w-full max-w-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="nc-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id="nc-arr-hi"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
            <marker
              id="nc-arr-cycle"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
          </defs>

          {/* edges */}
          {scn.edges.map((e, i) => {
            const A = POS.get(e.from)!
            const B = POS.get(e.to)!
            const hot = viaEdges.has(`${e.from}->${e.to}`)
            const neg = e.w < 0
            const inUnsafeCycle =
              scn.hasNegCycle &&
              ((e.from === 'a' && e.to === 'b') ||
                (e.from === 'b' && e.to === 'a'))

            let lx: number
            let ly: number
            let edgeNode: ReactNode
            const stroke = hot ? '#9f1239' : inUnsafeCycle ? '#dc2626' : '#9b8a8d'
            const strokeWidth = hot ? 3.4 : inUnsafeCycle ? 2.6 : 1.8
            const marker = hot
              ? 'url(#nc-arr-hi)'
              : inUnsafeCycle
                ? 'url(#nc-arr-cycle)'
                : 'url(#nc-arr)'
            const dasharray = inUnsafeCycle && !hot ? '4 3' : undefined

            if (e.curve) {
              // Hand-tuned curve — kept by design. The a↔b anti-parallel
              // pair (curve=18) needs deliberate opposite bulges to not
              // overlap; the long s→t shortcut (curve=70) needs a wide
              // swoop over the row to read as a single direct edge.
              const c = curvedPath(A, B, R, e.curve)
              lx = c.lx
              ly = c.ly
              edgeNode = (
                <path
                  d={c.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                  strokeDasharray={dasharray}
                />
              )
            } else {
              const g = routedStraightEdge(e.from, e.to)
              lx = g.kind === 'line' ? (A.x + B.x) / 2 : (A.x + B.x + 2 * g.cx) / 4
              ly = g.kind === 'line' ? (A.y + B.y) / 2 : (A.y + B.y + 2 * g.cy) / 4
              edgeNode =
                g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={marker}
                    strokeDasharray={dasharray}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    markerEnd={marker}
                    strokeDasharray={dasharray}
                  />
                )
            }

            return (
              <g key={`e${i}`}>
                {edgeNode}
                <rect
                  x={lx - 13}
                  y={ly - 10}
                  width={26}
                  height={18}
                  rx={3.5}
                  fill={neg ? '#fee2e2' : '#faf4ee'}
                  stroke={neg ? '#dc2626' : hot ? '#9f1239' : '#cdbfc0'}
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={700}
                  fill={neg ? '#dc2626' : '#1c1214'}
                >
                  {e.w}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {scn.nodes.map((n) => {
            const improved = improvedSet.has(n.id)
            const isDest = n.id === scn.dest
            const fill = isDest ? '#fde2e4' : '#ffffff'
            const stroke = improved ? '#9f1239' : isDest ? '#9f1239' : '#9b8a8d'
            const labelAbove = n.id !== 'b'
            const ly = labelAbove ? n.y - R - 16 : n.y + R + 16
            return (
              <g key={n.id}>
                {improved && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={R + 5}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
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
                  fontSize={15}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
                <rect
                  x={n.x - 24}
                  y={ly - 10}
                  width={48}
                  height={20}
                  rx={4}
                  fill={improved ? '#fef3c7' : '#faf4ee'}
                  stroke={improved ? '#d97706' : '#cdbfc0'}
                />
                <text
                  x={n.x}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11.5}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  M={fmt(M[n.id])}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* the M table — rows 0..n */}
      <div className="mt-3 overflow-x-auto">
        <div
          className="grid w-fit gap-1 font-mono"
          style={{ gridTemplateColumns: `3.4rem repeat(${verts.length}, 3rem)` }}
        >
          <div className="flex h-8 items-center justify-center text-[0.68rem] font-semibold text-fg-subtle">
            M[i,v]
          </div>
          {verts.map((v) => (
            <div
              key={`h${v}`}
              className={cn(
                'flex h-8 items-center justify-center text-sm font-bold',
                v === scn.dest ? 'text-accent' : 'text-fg',
              )}
            >
              {v}
            </div>
          ))}
          {data.map((rd, i) => {
            const revealed = i <= step
            const isCheckRow = i === LAST
            return (
              <div key={`r${i}`} className="contents">
                <div
                  className={cn(
                    'flex h-10 items-center justify-center rounded text-xs font-bold',
                    i === step
                      ? 'bg-accent/15 text-accent'
                      : 'text-fg-subtle',
                  )}
                >
                  i={i}
                  {isCheckRow && revealed ? ' ⚑' : ''}
                </div>
                {verts.map((v) => {
                  const improved =
                    revealed &&
                    i === step &&
                    step >= 1 &&
                    improvedSet.has(v)
                  let cls = 'border-border bg-bg-soft/40 text-fg-muted'
                  if (!revealed)
                    cls = 'border-dashed border-border text-transparent'
                  else if (isCheckRow && improved)
                    cls = 'border-rose-500 bg-rose-200 font-bold text-rose-900'
                  else if (improved)
                    cls = 'border-accent bg-accent/25 font-bold text-fg'
                  else if (i === step)
                    cls = 'border-accent/40 bg-accent/5 text-fg'
                  return (
                    <div
                      key={`${i}-${v}`}
                      className={cn(
                        'flex h-10 items-center justify-center rounded border text-sm',
                        cls,
                      )}
                    >
                      {revealed ? fmt(rd.M[v]) : '·'}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-fg-subtle">
        Πορτοκαλί = βελτιώθηκε σε αυτόν τον γύρο · ⚑ = ο γύρος ελέγχου (i = n).
        Στον γύρο ελέγχου: ροζ ⇒ ο αλγόριθμος βρήκε αρνητικό κύκλο.
      </p>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[5.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* verdict chip — only at check round */}
      {verdictKnown && (
        <div
          className={cn(
            'mt-2 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold',
            verdictNegCycle
              ? 'bg-rose-100 text-rose-900'
              : 'bg-emerald-100 text-emerald-900',
          )}
        >
          {verdictNegCycle ? (
            <>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Ο γύρος ελέγχου άλλαξε τιμές → ΥΠΑΡΧΕΙ αρνητικός κύκλος.
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Ο γύρος ελέγχου δεν άλλαξε τίποτα → ΔΕΝ υπάρχει αρνητικός κύκλος.
            </>
          )}
        </div>
      )}

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={step === LAST}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {step < rounds - 1
            ? 'Επόμενος γύρος'
            : step === rounds - 1
              ? 'Γύρος ελέγχου (n)'
              : 'Τέλος'}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span
          className={cn(
            'ml-auto text-xs font-medium',
            inCheckRound ? 'text-accent' : 'text-fg-subtle',
          )}
        >
          Βήμα {step} / {LAST}{inCheckRound ? ' — γύρος ελέγχου' : ''}
        </span>
      </div>
    </section>
  )
}
