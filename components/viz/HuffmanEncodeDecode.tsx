'use client'

/**
 * HuffmanEncodeDecode — encoder + decoder on the ΚΑΣΤΑΝΑΣ tree.
 *
 * Tab «Κωδικοποίηση»: walks the word ΚΑΣΤΑΝΑΣ character by character. Each
 * step picks the next letter, traces the root→leaf path on the live tree,
 * and appends that path's bits to the output. The student SEES how K→101
 * is «go right at the root, go left into the {Σ,K} subtree, go right to K».
 *
 * Tab «Αποκωδικοποίηση»: walks the bitstream 0100100101101 ONE bit at a
 * time. The current position is a node in the tree; every 0 dips left,
 * every 1 dips right; when the position lands on a leaf, the character is
 * emitted and the cursor jumps back to the root. The «πρόθεμα» property
 * lives in this animation — there is no ambiguity at any step.
 *
 * Built for front-set-6-ask7. The tree shape and codes match the Huffman
 * preset «kastanas» in HuffmanTreeBuilder.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

type TreeNode = {
  id: string
  x: number
  y: number
  char?: string
  freq?: number
  code?: string
  /** [leftChildId, rightChildId] — undefined for leaves */
  children?: [string, string]
}

const NODES: Record<string, TreeNode> = {
  root: { id: 'root', x: 280, y: 36, freq: 1.0, children: ['n044', 'n056'] },
  n044: { id: 'n044', x: 140, y: 108, freq: 0.44, children: ['T', 'N'] },
  n056: { id: 'n056', x: 420, y: 108, freq: 0.56, children: ['n025', 'A'] },
  T: { id: 'T', x: 60, y: 180, char: 'T', freq: 0.2, code: '00' },
  N: { id: 'N', x: 220, y: 180, char: 'N', freq: 0.24, code: '01' },
  n025: { id: 'n025', x: 340, y: 180, freq: 0.25, children: ['sigma', 'K'] },
  A: { id: 'A', x: 500, y: 180, char: 'A', freq: 0.31, code: '11' },
  sigma: { id: 'sigma', x: 280, y: 252, char: 'Σ', freq: 0.1, code: '100' },
  K: { id: 'K', x: 400, y: 252, char: 'K', freq: 0.15, code: '101' },
}

/** parent edges: child → { parent, bit } */
const PARENT: Record<string, { parent: string; bit: '0' | '1' }> = {}
;(Object.values(NODES) as TreeNode[]).forEach((n) => {
  if (n.children) {
    PARENT[n.children[0]] = { parent: n.id, bit: '0' }
    PARENT[n.children[1]] = { parent: n.id, bit: '1' }
  }
})

const CODES: Record<string, string> = {
  A: '11',
  N: '01',
  T: '00',
  K: '101',
  Σ: '100',
}

const LEAF_BY_CHAR: Record<string, string> = {
  T: 'T',
  N: 'N',
  A: 'A',
  K: 'K',
  Σ: 'sigma',
}

const LEAF_R = 22
const INTERNAL_R = 19

const NODE_RECTS: NodeRect[] = []
const NODE_RECT_BY_ID = new Map<string, NodeRect>()
for (const n of Object.values(NODES) as TreeNode[]) {
  const r = n.char ? LEAF_R : INTERNAL_R
  const rect: NodeRect = {
    id: n.id,
    x: n.x - r,
    y: n.y - r,
    w: 2 * r,
    h: 2 * r,
  }
  NODE_RECTS.push(rect)
  NODE_RECT_BY_ID.set(n.id, rect)
}

/** Routed parent→child edge, center-to-center (Huffman edges have no
 *  arrowhead, so no asymmetric trim). Returns the midpoint anchor for the
 *  bit label (line midpoint for a straight edge, Bezier midpoint for a curve). */
function routedEdge(parent: TreeNode, child: TreeNode) {
  const pR = NODE_RECT_BY_ID.get(parent.id)!
  const cR = NODE_RECT_BY_ID.get(child.id)!
  const g = routeEdge(pR, cR, NODE_RECTS)
  const mx =
    g.kind === 'line' ? (parent.x + child.x) / 2 : (parent.x + child.x + 2 * g.cx) / 4
  const my =
    g.kind === 'line' ? (parent.y + child.y) / 2 : (parent.y + child.y + 2 * g.cy) / 4
  return { g, mx, my }
}

/** Path from root to a node (sequence of nodeIds including both endpoints). */
function pathFromRoot(target: string): string[] {
  const out: string[] = []
  let cur: string | undefined = target
  while (cur) {
    out.unshift(cur)
    cur = PARENT[cur]?.parent
  }
  return out
}

/* ─────────────────────────── encode ─────────────────────────── */

const WORD = 'ΚΑΣΤΑΝΑΣ'.split('')

type EncStep = {
  /** the character being encoded this step */
  charIndex: number
  /** root-to-leaf path of node ids (after step is applied) */
  path: string[]
  /** appended bits */
  bits: string
  /** total accumulated bits */
  output: string
}

function buildEncodeSteps(): EncStep[] {
  const steps: EncStep[] = []
  let out = ''
  WORD.forEach((ch, i) => {
    const leafId = LEAF_BY_CHAR[ch]
    const path = pathFromRoot(leafId)
    const bits = CODES[ch]
    out += bits
    steps.push({ charIndex: i, path, bits, output: out })
  })
  return steps
}

const ENC_STEPS = buildEncodeSteps()

/* ─────────────────────────── decode ─────────────────────────── */

const BITS = '0100100101101'.split('')

type DecStep = {
  /** how many bits consumed so far (so 0 = start, BITS.length = end) */
  consumed: number
  /** current node id (cursor) */
  cur: string
  /** root-to-cur path */
  path: string[]
  /** decoded characters so far */
  decoded: string
  /** the bit just read this step, if any */
  bit?: '0' | '1'
  /** did we just emit a character? */
  emitted?: string
}

function buildDecodeSteps(): DecStep[] {
  const steps: DecStep[] = []
  // initial state — at root, nothing consumed
  steps.push({ consumed: 0, cur: 'root', path: ['root'], decoded: '' })
  let cur = 'root'
  let decoded = ''
  for (let i = 0; i < BITS.length; i++) {
    const bit = BITS[i] as '0' | '1'
    const next = NODES[cur].children![bit === '0' ? 0 : 1]
    cur = next
    let emitted: string | undefined
    if (NODES[cur].char) {
      emitted = NODES[cur].char!
      decoded += emitted
    }
    const path = pathFromRoot(cur)
    steps.push({
      consumed: i + 1,
      cur,
      path,
      decoded,
      bit,
      emitted,
    })
    if (emitted) {
      // after emitting, conceptually jump back to root; the NEXT step will
      // be from root, so we already capture that by setting cur=root here.
      cur = 'root'
    }
  }
  return steps
}

const DEC_STEPS = buildDecodeSteps()

/* ─────────────────────────── component ─────────────────────────── */

type Mode = 'encode' | 'decode'

export function HuffmanEncodeDecode() {
  const [mode, setMode] = useState<Mode>('encode')
  const [encStep, setEncStep] = useState(0)
  const [decStep, setDecStep] = useState(0)

  const step = mode === 'encode' ? encStep : decStep
  const setStep = mode === 'encode' ? setEncStep : setDecStep
  const last = (mode === 'encode' ? ENC_STEPS.length : DEC_STEPS.length) - 1

  /** highlighted edges (parent→child pairs along the path) */
  const activeEdges = useMemo(() => {
    if (mode === 'encode') {
      if (encStep < 0) return new Set<string>()
      const s = ENC_STEPS[encStep]
      const set = new Set<string>()
      for (let i = 0; i < s.path.length - 1; i++) {
        set.add(`${s.path[i]}→${s.path[i + 1]}`)
      }
      return set
    } else {
      const s = DEC_STEPS[decStep]
      const set = new Set<string>()
      for (let i = 0; i < s.path.length - 1; i++) {
        set.add(`${s.path[i]}→${s.path[i + 1]}`)
      }
      return set
    }
  }, [mode, encStep, decStep])

  /** node currently emphasized — the leaf being read (encode) or cursor (decode) */
  const focusNode = mode === 'encode' ? ENC_STEPS[encStep]?.path.at(-1) : DEC_STEPS[decStep]?.cur

  const swapMode = (m: Mode) => {
    setMode(m)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Κωδικοποίηση & αποκωδικοποίηση πάνω στο δέντρο Huffman
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {mode === 'encode' ? `Βήμα ${step}/${ENC_STEPS.length - 1}` : `Bit ${step}/${BITS.length}`}
        </span>
      </div>

      <div className="mb-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => swapMode('encode')}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
            mode === 'encode'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-bg-soft text-fg-muted hover:bg-bg-soft/70',
          )}
        >
          Κωδικοποίηση «ΚΑΣΤΑΝΑΣ»
        </button>
        <button
          type="button"
          onClick={() => swapMode('decode')}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
            mode === 'decode'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-bg-soft text-fg-muted hover:bg-bg-soft/70',
          )}
        >
          Αποκωδικοποίηση 0100100101101
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr,1fr]">
        {/* tree SVG */}
        <div className="graph-canvas overflow-x-auto">
          <svg
            viewBox="0 0 560 296"
            className="mx-auto block w-full max-w-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* edges */}
            {(Object.values(NODES) as TreeNode[]).map((parent) => {
              if (!parent.children) return null
              return parent.children.map((childId, ci) => {
                const child = NODES[childId]
                const isActive = activeEdges.has(`${parent.id}→${childId}`)
                const stroke = isActive ? '#d97706' : '#9b8a8d'
                const strokeWidth = isActive ? 3.5 : 1.8
                const { g, mx, my } = routedEdge(parent, child)
                return (
                  <g key={`${parent.id}-${childId}`}>
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
                      x={mx}
                      y={my}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={800}
                      fill={isActive ? '#92400e' : '#9f1239'}
                    >
                      {ci === 0 ? '0' : '1'}
                    </text>
                  </g>
                )
              })
            })}

            {/* nodes */}
            {(Object.values(NODES) as TreeNode[]).map((n) => {
              const isLeaf = !!n.char
              const isFocus = n.id === focusNode
              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isLeaf ? 22 : 19}
                    fill={
                      isLeaf
                        ? isFocus
                          ? '#fde68a'
                          : '#fde2e4'
                        : isFocus
                          ? '#fed7aa'
                          : '#ffffff'
                    }
                    stroke={isFocus ? '#d97706' : isLeaf ? '#e0607a' : '#9b8a8d'}
                    strokeWidth={isFocus ? 3 : 2}
                  />
                  {isLeaf ? (
                    <>
                      <text
                        x={n.x}
                        y={n.y - 5}
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight={800}
                        fill="#1c1214"
                      >
                        {n.char}
                      </text>
                      <text
                        x={n.x}
                        y={n.y + 9}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={700}
                        fill="#9f1239"
                        fontFamily="ui-monospace, monospace"
                      >
                        {n.code}
                      </text>
                    </>
                  ) : (
                    <text
                      x={n.x}
                      y={n.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={700}
                      fill="#1c1214"
                    >
                      {n.freq?.toFixed(2)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* input / output panels */}
        <div className="flex flex-col gap-2">
          {mode === 'encode' ? <EncodePanel step={encStep} /> : <DecodePanel step={decStep} />}
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep(Math.min(last, step + 1))}
          disabled={step >= last}
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
      </div>
    </section>
  )
}

function EncodePanel({ step }: { step: number }) {
  const s = ENC_STEPS[step]
  return (
    <>
      <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Λέξη
        </div>
        <div className="flex flex-wrap gap-1">
          {WORD.map((c, i) => (
            <span
              key={i}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md border font-mono text-base font-bold',
                i === s.charIndex
                  ? 'border-amber-500 bg-amber-500/20 text-fg'
                  : i < s.charIndex
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-border bg-bg-elevated text-fg-muted',
              )}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="mt-2 text-xs text-fg-muted">
          Τρέχων χαρακτήρας:{' '}
          <span className="font-mono font-bold text-amber-600 dark:text-amber-300">
            {WORD[s.charIndex]}
          </span>{' '}
          → κώδικας{' '}
          <span className="font-mono font-bold text-amber-600 dark:text-amber-300">
            {s.bits}
          </span>
          .
        </div>
      </div>
      <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Έξοδος (bits)
        </div>
        <p className="break-all font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
          {s.output}
        </p>
        <p className="mt-1 text-[11px] text-fg-subtle">{s.output.length} bits</p>
      </div>
    </>
  )
}

function DecodePanel({ step }: { step: number }) {
  const s = DEC_STEPS[step]
  return (
    <>
      <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Bitstream — διαβάζουμε αριστερά προς τα δεξιά
        </div>
        <div className="flex flex-wrap gap-0.5 font-mono">
          {BITS.map((b, i) => (
            <span
              key={i}
              className={cn(
                'inline-flex h-7 w-6 items-center justify-center rounded border text-sm font-bold',
                i + 1 === s.consumed
                  ? 'border-amber-500 bg-amber-500/25 text-fg'
                  : i < s.consumed - 1
                    ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'border-border bg-bg-elevated text-fg-muted',
              )}
            >
              {b}
            </span>
          ))}
        </div>
        {s.bit !== undefined && (
          <div className="mt-2 text-xs text-fg-muted">
            Bit{' '}
            <span className="font-mono font-bold text-amber-600 dark:text-amber-300">{s.bit}</span>{' '}
            → πήγαινε {s.bit === '0' ? 'αριστερά' : 'δεξιά'}.
          </div>
        )}
        {s.emitted && (
          <div className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Φύλλο! Εκπέμπω «{s.emitted}» και επιστρέφω στη ρίζα.
          </div>
        )}
      </div>
      <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Αποκωδικοποιημένο μήνυμα
        </div>
        <p className="break-all font-mono text-base font-bold text-emerald-700 dark:text-emerald-300">
          {s.decoded || '(κενό)'}
        </p>
      </div>
    </>
  )
}
