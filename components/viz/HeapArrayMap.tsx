'use client'

/**
 * HeapArrayMap — the heap IS the array (L10).
 *
 * The one fact a heap rests on: a balanced binary tree needs no pointers,
 * because an element's index already encodes its place in the tree.
 * parent(i) = ⌊i/2⌋, leftChild(i) = 2i, rightChild(i) = 2i + 1. A printed
 * formula stays abstract — so here the student clicks any element and
 * watches its parent and children light up in BOTH the tree and the array,
 * with the index arithmetic evaluated live for that exact i. Built for L10.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { routeEdge, type NodeRect } from './edge-routing'

/** a valid min-heap, read 1-indexed as H[1..10] */
const HEAP = [2, 5, 8, 9, 11, 14, 18, 20, 21, 13]
const N = HEAP.length

/** tree position of the 1-based index i */
function nodePos(i: number) {
  const lvl = Math.floor(Math.log2(i))
  const slots = 2 ** lvl
  const slot = i - slots
  return {
    x: 44 + ((slot + 0.5) * 492) / slots,
    y: 46 + lvl * 74,
  }
}

const NODE_R = 21

const NODE_RECTS: NodeRect[] = []
const NODE_RECT_BY_ID = new Map<number, NodeRect>()
for (let i = 1; i <= N; i++) {
  const p = nodePos(i)
  const r: NodeRect = {
    id: i,
    x: p.x - NODE_R,
    y: p.y - NODE_R,
    w: 2 * NODE_R,
    h: 2 * NODE_R,
  }
  NODE_RECTS.push(r)
  NODE_RECT_BY_ID.set(i, r)
}

/** Routed child→parent edge, center-to-center (no arrowheads on heap edges). */
function routedEdge(childI: number, parentI: number) {
  const cR = NODE_RECT_BY_ID.get(childI)!
  const pR = NODE_RECT_BY_ID.get(parentI)!
  return routeEdge(cR, pR, NODE_RECTS)
}

type Rel = 'self' | 'parent' | 'child' | 'none'

const FILL: Record<Rel, string> = {
  self: '#9f1239',
  parent: '#fde68a',
  child: '#bfdbfe',
  none: '#ffffff',
}
const STROKE: Record<Rel, string> = {
  self: '#7e1031',
  parent: '#d97706',
  child: '#2563eb',
  none: '#9b8a8d',
}
const CELL: Record<Rel, string> = {
  self: 'border-[#7e1031] bg-[#9f1239] text-white',
  parent: 'border-[#d97706] bg-[#fde68a] text-[#7c2d12]',
  child: 'border-[#2563eb] bg-[#bfdbfe] text-[#1e3a8a]',
  none: 'border-border bg-bg-soft text-fg-muted hover:border-border-strong',
}

function FormulaCard({
  title,
  accent,
  formula,
  result,
  active,
}: {
  title: string
  accent: string
  formula: string
  result: string
  active: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 px-3 py-2 transition-opacity',
        active ? 'opacity-100' : 'opacity-55',
      )}
      style={{ borderColor: accent }}
    >
      <div
        className="text-[11px] font-bold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {title}
      </div>
      <div className="mt-0.5 font-mono text-sm font-semibold text-fg">
        {formula}
      </div>
      <div className="text-xs text-fg-muted">{result}</div>
    </div>
  )
}

export function HeapArrayMap() {
  const [sel, setSel] = useState(4)

  const parent = sel > 1 ? sel >> 1 : null
  const left = 2 * sel <= N ? 2 * sel : null
  const right = 2 * sel + 1 <= N ? 2 * sel + 1 : null

  const relOf = (i: number): Rel => {
    if (i === sel) return 'self'
    if (i === parent) return 'parent'
    if (i === left || i === right) return 'child'
    return 'none'
  }

  const note = (() => {
    const parts: string[] = [`Επιλεγμένο: H[${sel}] = ${HEAP[sel - 1]}.`]
    if (parent === null) {
      parts.push('Είναι η ρίζα του σωρού — δεν έχει γονέα.')
    } else {
      parts.push(
        `Ο γονέας του είναι στη θέση ⌊${sel}/2⌋ = ${parent}: το H[${parent}] = ${HEAP[parent - 1]}.`,
      )
    }
    if (left === null && right === null) {
      parts.push(
        `Είναι φύλλο: το 2·${sel} = ${2 * sel} ξεπερνά το n = ${N}, άρα δεν έχει παιδιά.`,
      )
    } else {
      const kids: string[] = []
      if (left !== null)
        kids.push(`αριστερό στο 2·${sel} = ${left} (H[${left}] = ${HEAP[left - 1]})`)
      if (right !== null)
        kids.push(
          `δεξί στο 2·${sel}+1 = ${right} (H[${right}] = ${HEAP[right - 1]})`,
        )
      else kids.push(`δεξί παιδί στο ${2 * sel + 1} > ${N} — δεν υπάρχει`)
      parts.push(`Παιδιά: ${kids.join(', ')}.`)
    }
    return parts.join(' ')
  })()

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ο σωρός ΕΙΝΑΙ ο πίνακας — δείκτες από καθαρή αριθμητική
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          H[{sel}] = {HEAP[sel - 1]}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Πάτησε οποιονδήποτε κόμβο του δέντρου ή κελί του πίνακα — ο γονέας ⌊i/2⌋
        και τα παιδιά 2i, 2i+1 ανάβουν ταυτόχρονα και στις δύο όψεις.
      </p>

      {/* tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 580 318"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {HEAP.map((_, k) => k + 1)
            .filter((i) => i > 1)
            .map((i) => {
              const g = routedEdge(i, i >> 1)
              const hot = i === sel || i >> 1 === sel
              const stroke = hot ? '#9f1239' : '#c9bcbe'
              const strokeWidth = hot ? 3 : 1.8
              return g.kind === 'line' ? (
                <line
                  key={`e${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`e${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              )
            })}
          {/* nodes */}
          {HEAP.map((v, k) => {
            const i = k + 1
            const p = nodePos(i)
            const rel = relOf(i)
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`Στοιχείο H[${i}] με τιμή ${v}`}
                onClick={() => setSel(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSel(i)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={21}
                  fill={FILL[rel]}
                  stroke={STROKE[rel]}
                  strokeWidth={2.6}
                />
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={700}
                  fill={rel === 'self' ? '#ffffff' : '#1c1214'}
                >
                  {v}
                </text>
                <text
                  x={p.x}
                  y={p.y + 34}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill="#9b8a8d"
                >
                  i = {i}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* array */}
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {HEAP.map((v, k) => {
          const i = k + 1
          const rel = relOf(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              aria-label={`Στοιχείο H[${i}] με τιμή ${v}`}
              className={cn(
                'flex w-[3rem] flex-col items-center rounded-md border-2 py-1 transition-colors',
                CELL[rel],
              )}
            >
              <span className="text-sm font-bold">{v}</span>
              <span className="text-[10px] font-semibold opacity-75">H[{i}]</span>
            </button>
          )
        })}
      </div>

      {/* formula cards */}
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <FormulaCard
          title="Γονέας — ⌊i/2⌋"
          accent="#d97706"
          formula={parent === null ? '— (η ρίζα)' : `⌊${sel}/2⌋ = ${parent}`}
          result={
            parent === null
              ? 'Η ρίζα δεν έχει γονέα.'
              : `H[${parent}] = ${HEAP[parent - 1]}`
          }
          active={parent !== null}
        />
        <FormulaCard
          title="Αριστερό παιδί — 2i"
          accent="#2563eb"
          formula={`2·${sel} = ${2 * sel}`}
          result={
            left === null
              ? `${2 * sel} > n = ${N} — δεν υπάρχει`
              : `H[${left}] = ${HEAP[left - 1]}`
          }
          active={left !== null}
        />
        <FormulaCard
          title="Δεξί παιδί — 2i+1"
          accent="#2563eb"
          formula={`2·${sel}+1 = ${2 * sel + 1}`}
          result={
            right === null
              ? `${2 * sel + 1} > n = ${N} — δεν υπάρχει`
              : `H[${right}] = ${HEAP[right - 1]}`
          }
          active={right !== null}
        />
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>
    </section>
  )
}
