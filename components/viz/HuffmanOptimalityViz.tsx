'use client'

/**
 * HuffmanOptimalityViz — why Huffman is optimal, in two moving parts.
 *
 *  1. The identity. Take the Huffman tree T (the lecture's a–f instance). Its
 *     two rarest leaves, e and f, are siblings. Collapse them into one compound
 *     leaf ω with frequency f(ω) = f(e) + f(f). The cost drops by EXACTLY f(ω):
 *
 *         cost(T′) = cost(T) − f(ω)        224 → 210,  f(ω) = 14
 *
 *  2. The induction. That identity is the engine of the optimality proof: a
 *     cheaper rival Z would, after the same collapse, give a cheaper Z′ — but
 *     T′ is the Huffman tree for n−1 characters, optimal by the inductive
 *     hypothesis. Contradiction. The argument is revealed one box at a time.
 *
 * Step through with prev/next. Built for L13.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type TNode = { id: string; x: number; y: number; freq: number; char?: string }

const NODES: Record<string, TNode> = {
  a: { id: 'a', x: 60, y: 118, freq: 45, char: 'a' },
  c: { id: 'c', x: 148, y: 266, freq: 12, char: 'c' },
  b: { id: 'b', x: 236, y: 266, freq: 13, char: 'b' },
  f: { id: 'f', x: 324, y: 340, freq: 5, char: 'f' },
  e: { id: 'e', x: 412, y: 340, freq: 9, char: 'e' },
  d: { id: 'd', x: 500, y: 266, freq: 16, char: 'd' },
  n14: { id: 'n14', x: 368, y: 266, freq: 14 },
  n25: { id: 'n25', x: 192, y: 192, freq: 25 },
  n30: { id: 'n30', x: 434, y: 192, freq: 30 },
  n55: { id: 'n55', x: 313, y: 118, freq: 55 },
  root: { id: 'root', x: 187, y: 44, freq: 100 },
}

const EDGES: { from: string; to: string; bit: 0 | 1 }[] = [
  { from: 'root', to: 'a', bit: 0 },
  { from: 'root', to: 'n55', bit: 1 },
  { from: 'n55', to: 'n25', bit: 0 },
  { from: 'n55', to: 'n30', bit: 1 },
  { from: 'n25', to: 'c', bit: 0 },
  { from: 'n25', to: 'b', bit: 1 },
  { from: 'n30', to: 'n14', bit: 0 },
  { from: 'n30', to: 'd', bit: 1 },
  { from: 'n14', to: 'f', bit: 0 },
  { from: 'n14', to: 'e', bit: 1 },
]

const COST_T = 224
const F_OMEGA = 14
const COST_T1 = COST_T - F_OMEGA // 210

const LAST = 5

const NOTES = [
  'Αυτό είναι το δέντρο T που χτίζει ο αλγόριθμος Huffman για τους 6 χαρακτήρες. Οι δύο σπανιότεροι — e (9) και f (5) — κατέληξαν αδέλφια στο βαθύτερο σημείο. Θέλουμε να αποδείξουμε ότι αυτό το T είναι βέλτιστο.',
  'Η κρίσιμη κίνηση: συρρίκνωση. Ενώνουμε τα δύο αδέλφια e, f σε έναν σύνθετο χαρακτήρα ω με συχνότητα f(ω) = 9 + 5 = 14. Μένει δέντρο T′ με 5 χαρακτήρες — και το κόστος έπεσε ακριβώς κατά 14.',
  'Τώρα η απόδειξη με άτοπο. Διάβασε το πρώτο κουτί.',
  'Η ίδια συρρίκνωση εφαρμόζεται και στους δύο υποψηφίους. Δεύτερο κουτί.',
  'Αφαιρώντας το ίδιο 14, η ανισότητα μεταφέρεται στα μικρότερα δέντρα. Τρίτο κουτί.',
  'Και εδώ σκάει η αντίφαση — η απόδειξη ολοκληρώθηκε. Τέταρτο κουτί.',
]

const BOXES: { tag: string; body: string }[] = [
  {
    tag: 'Υπόθεση για άτοπο',
    body: 'Έστω ότι το T δεν είναι βέλτιστο — υπάρχει δέντρο Z με cost(Z) < cost(T). Από το Λήμμα 2, μπορούμε να το πάρουμε με τους δύο σπανιότερους, e και f, αδέλφια.',
  },
  {
    tag: 'Συρρίκνωση',
    body: 'Συρρικνώνουμε τα e, f σε έναν σύνθετο χαρακτήρα ω — και στα δύο δέντρα. Παίρνουμε Z′ και T′ με 5 χαρακτήρες. Όπως μόλις είδαμε, χάνεται ακριβώς f(ω): cost(Z′) = cost(Z) − 14 και cost(T′) = cost(T) − 14.',
  },
  {
    tag: 'Αφαίρεση',
    body: 'Αφαιρούμε το ίδιο 14 και από τις δύο πλευρές της cost(Z) < cost(T). Η ανισότητα επιβιώνει: cost(Z′) < cost(T′). Δηλαδή το Z′ θα ήταν φθηνότερο από το T′.',
  },
  {
    tag: 'Άτοπο ∎',
    body: 'Όμως το T′ είναι ακριβώς το δέντρο που παράγει η Huffman για 5 χαρακτήρες — και από την επαγωγική υπόθεση είναι βέλτιστο. Δεν γίνεται κανένα Z′ να είναι φθηνότερο. Άτοπο: άρα το T ήταν εξαρχής βέλτιστο.',
  },
]

export function HuffmanOptimalityViz() {
  const [step, setStep] = useState(0)

  const collapsed = step >= 1
  const revealedBoxes = Math.max(0, step - 1)

  /** A node is a drawable leaf in the current view. */
  const isLeaf = (id: string) => {
    if (collapsed && id === 'n14') return true
    if (id === 'n14') return false
    return !!NODES[id].char
  }
  /** Hidden once e, f are folded into ω. */
  const hidden = (id: string) => collapsed && (id === 'e' || id === 'f')
  const hotEF = step === 0
  const hotOmega = step >= 1

  const { rects: nodeRects, rectById: nodeRectById } = useMemo(() => {
    const rects: NodeRect[] = []
    const byId = new Map<string, NodeRect>()
    for (const n of Object.values(NODES)) {
      if (hidden(n.id)) continue
      const r = isLeaf(n.id) ? 22 : 19
      const rect: NodeRect = {
        id: n.id,
        x: n.x - r,
        y: n.y - r,
        w: 2 * r,
        h: 2 * r,
      }
      rects.push(rect)
      byId.set(n.id, rect)
    }
    return { rects, rectById: byId }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed])

  /** Routed parent→child edge geometry, center-to-center. Bit labels are
   *  anchored at the segment midpoint (or Bezier midpoint when a curve fires). */
  const routedEdge = (fromId: string, toId: string) => {
    const a = nodeRectById.get(fromId)!
    const b = nodeRectById.get(toId)!
    return routeEdge(a, b, nodeRects)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γιατί η Huffman είναι βέλτιστη — η ταυτότητα και η επαγωγή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {collapsed ? 'Δέντρο T′' : 'Δέντρο T'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Συρρίκνωσε τους δύο σπανιότερους σε έναν σύνθετο χαρακτήρα ω και δες το
        κόστος να πέφτει ακριβώς κατά f(ω).
      </p>

      {/* tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 560 392"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {EDGES.map((e) => {
            if (collapsed && (e.to === 'e' || e.to === 'f')) return null
            const p = NODES[e.from]
            const c = NODES[e.to]
            const isEF = e.from === 'n14'
            const g = routedEdge(e.from, e.to)
            const baseMx = g.kind === 'line' ? (p.x + c.x) / 2 : (p.x + c.x + 2 * g.cx) / 4
            const baseMy = g.kind === 'line' ? (p.y + c.y) / 2 : (p.y + c.y + 2 * g.cy) / 4
            const dx = c.x - p.x
            const dy = c.y - p.y
            const L = Math.hypot(dx, dy) || 1
            const stroke = hotEF && isEF ? '#9f1239' : '#b6a6a8'
            const strokeWidth = hotEF && isEF ? 3.4 : 1.8
            return (
              <g key={`${e.from}-${e.to}`}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                  />
                ) : (
                  <path d={g.d} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
                )}
                <text
                  x={baseMx + (-dy / L) * 11}
                  y={baseMy + (dx / L) * 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={800}
                  fill="#8a787b"
                >
                  {e.bit}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {Object.values(NODES).map((n) => {
            if (hidden(n.id)) return null
            const leaf = isLeaf(n.id)
            const omega = collapsed && n.id === 'n14'
            const isHot =
              (hotEF && (n.id === 'e' || n.id === 'f')) ||
              (hotOmega && n.id === 'n14')
            const r = leaf ? 22 : 19
            let fill = '#ffffff'
            let stroke = '#9b8a8d'
            if (omega) {
              fill = isHot ? '#fde68a' : '#fef0c8'
              stroke = '#d97706'
            } else if (leaf) {
              fill = isHot ? '#9f1239' : '#fde2e4'
              stroke = isHot ? '#7e1031' : '#e0607a'
            }
            const labelFill = isHot && leaf && !omega ? '#ffffff' : '#1c1214'
            return (
              <g key={n.id}>
                {isHot && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r + 5}
                    fill="none"
                    stroke={omega ? '#d97706' : '#7e1031'}
                    strokeWidth={3}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.4}
                />
                {omega ? (
                  <>
                    <text
                      x={n.x}
                      y={n.y - 5}
                      textAnchor="middle"
                      fontSize={15}
                      fontWeight={800}
                      fill="#92400e"
                    >
                      ω
                    </text>
                    <text
                      x={n.x}
                      y={n.y + 10}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      fill="#92400e"
                    >
                      {n.freq}
                    </text>
                  </>
                ) : leaf ? (
                  <>
                    <text
                      x={n.x}
                      y={n.y - 5}
                      textAnchor="middle"
                      fontSize={15}
                      fontWeight={800}
                      fill={labelFill}
                    >
                      {n.char}
                    </text>
                    <text
                      x={n.x}
                      y={n.y + 10}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={600}
                      fill={isHot ? '#ffe0e6' : '#5a4a4d'}
                    >
                      {n.freq}
                    </text>
                  </>
                ) : (
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={700}
                    fill="#1c1214"
                  >
                    {n.freq}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* cost panel */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-sm">
            <span className="text-fg-muted">cost(T) = </span>
            <span className="font-mono text-lg font-bold tabular-nums text-fg">
              {COST_T}
            </span>
          </span>
          {collapsed && (
            <>
              <span className="text-sm">
                <span className="text-fg-muted">cost(T′) = </span>
                <span className="font-mono text-lg font-bold tabular-nums text-accent">
                  {COST_T1}
                </span>
              </span>
              <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-sm font-bold text-accent">
                διαφορά = f(ω) = 14
              </span>
            </>
          )}
        </div>
        {collapsed && (
          <p className="mt-1.5 font-mono text-[13px] text-fg">
            cost(T′) = cost(T) − f(ω) → 210 = 224 − 14
          </p>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {step === 1 ? (
          <span>
            <span className="font-semibold text-fg">{NOTES[1]}</span> Τα e, f
            κάθονταν ένα επίπεδο πιο κάτω από το ω· χάνοντας εκείνο το επίπεδο
            χάνεις f(e)+f(f) = 14 από το κόστος — ούτε δυφίο παραπάνω, ούτε
            λιγότερο.
          </span>
        ) : (
          NOTES[step]
        )}
      </div>

      {/* induction boxes */}
      {revealedBoxes > 0 && (
        <ol className="mt-2 space-y-1.5">
          {BOXES.slice(0, revealedBoxes).map((box, i) => {
            const conclusion = i === 3
            return (
              <li
                key={box.tag}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm leading-relaxed',
                  conclusion
                    ? 'border-success/40 bg-success/10 text-fg'
                    : 'border-border bg-bg-elevated text-fg-muted',
                )}
              >
                <span
                  className={cn(
                    'mr-1.5 inline-block rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider',
                    conclusion
                      ? 'bg-success/20 text-success'
                      : 'bg-accent/10 text-accent',
                  )}
                >
                  {i + 1}. {box.tag}
                </span>
                {box.body}
              </li>
            )
          })}
        </ol>
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
          Επόμενο
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
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {LAST}
        </span>
      </div>
    </section>
  )
}
