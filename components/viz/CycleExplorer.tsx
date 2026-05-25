'use client'

/**
 * CycleExplorer — build a cycle vertex by vertex; the 4 conditions self-check (L06).
 *
 * Replaces the static "1→2→4→5→3→1" SVG. The reader walks a candidate
 * cycle by clicking vertices in order on the canonical L06 graph; the viz
 * verifies the four conditions live as the walk grows:
 *
 *   (a) each consecutive pair is an edge of G,
 *   (b) k ≥ 3 (interior length, ruling out the 2-vertex back-and-forth),
 *   (c) all interior vertices distinct,
 *   (d) the closing edge {v₁, vₖ} exists.
 *
 * Three preset buttons land the three failure modes (back-and-forth on a
 * single edge; revisit before closing; valid 5-cycle). When all four are
 * green the verdict reads "ΚΥΚΛΟΣ μήκους k" and the cycle highlights.
 * Built for L06.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { L06_GRAPH, edgeKey, routeL06GraphEdge } from './graph-types'

const EDGE_SET = new Set(L06_GRAPH.edges.map((e) => edgeKey(e.a, e.b)))

type PresetKey = 'valid' | 'tooShort' | 'revisit'
const PRESETS: { key: PresetKey; label: string; walk: number[]; tagline: string }[] = [
  {
    key: 'valid',
    label: 'Έγκυρος κύκλος',
    walk: [1, 2, 4, 5, 3, 1],
    tagline: 'Η διαδρομή 1→2→4→5→3→1 περνά τέσσερις ελέγχους — k=5, διακριτές, και η ακμή {3,1} υπάρχει.',
  },
  {
    key: 'tooShort',
    label: 'Πήγαινε-έλα (k=2)',
    walk: [1, 2, 1],
    tagline: 'Η διαδρομή 1→2→1 «κλείνει», αλλά μετράει την ίδια ακμή δύο φορές. Ο όρος k ≥ 3 αποκλείει ακριβώς αυτό.',
  },
  {
    key: 'revisit',
    label: 'Επανεπίσκεψη',
    walk: [1, 2, 3, 5, 2],
    tagline: 'Η διαδρομή ξαναπερνά από την 2 πριν κλείσει στη 1 — οι κορυφές δεν είναι όλες διακριτές, δεν είναι κύκλος.',
  },
]

function isAdjacent(a: number, b: number) {
  return EDGE_SET.has(edgeKey(a, b))
}

export function CycleExplorer() {
  const [walk, setWalk] = useState<number[]>([1])

  const closed = walk.length >= 2 && walk[walk.length - 1] === walk[0]
  const interior = closed ? walk.slice(0, -1) : walk
  const interiorLen = interior.length

  const stepChecks = useMemo(() => {
    // for each consecutive pair, was it an edge?
    const res: { from: number; to: number; ok: boolean }[] = []
    for (let i = 1; i < walk.length; i++) {
      res.push({ from: walk[i - 1], to: walk[i], ok: isAdjacent(walk[i - 1], walk[i]) })
    }
    return res
  }, [walk])

  const allEdgesOk = stepChecks.every((s) => s.ok)
  const interiorDistinct = new Set(interior).size === interiorLen
  const longEnough = interiorLen >= 3
  const closesOk = closed && allEdgesOk

  const verdict: { tone: 'idle' | 'good' | 'bad'; text: string } = (() => {
    if (!closed) {
      if (walk.length === 1)
        return {
          tone: 'idle',
          text: 'Διάλεξε διαδοχικές κορυφές για να χτίσεις μια διαδρομή· κλείσε την επιστρέφοντας στην αρχή.',
        }
      const last = stepChecks[stepChecks.length - 1]
      if (last && !last.ok)
        return {
          tone: 'bad',
          text: `Δεν υπάρχει ακμή { ${last.from}, ${last.to} } — η ${last.to} δεν είναι γείτονας της ${last.from}. Πάτα «Πίσω».`,
        }
      return {
        tone: 'idle',
        text: `Καλά μέχρι εδώ. Πρέπει να επιστρέψεις στην κορυφή ${walk[0]} για να κλείσει σε κύκλο.`,
      }
    }
    // closed
    if (!allEdgesOk)
      return {
        tone: 'bad',
        text: 'Η διαδρομή κλείνει, αλλά μία ή περισσότερες ακμές δεν υπάρχουν.',
      }
    if (!longEnough)
      return {
        tone: 'bad',
        text: `k = ${interiorLen} < 3 — απλά πήγαινε-έλα στην ίδια ακμή. Δεν θεωρείται κύκλος.`,
      }
    if (!interiorDistinct)
      return {
        tone: 'bad',
        text: 'Κάποια κορυφή επαναλαμβάνεται πριν το κλείσιμο — οι ενδιάμεσες κορυφές πρέπει να είναι διακριτές.',
      }
    return {
      tone: 'good',
      text: `ΚΥΚΛΟΣ μήκους ${interiorLen}. Και οι τέσσερις όροι ικανοποιούνται.`,
    }
  })()

  function tryAppend(id: number) {
    if (closed) return // already done
    const last = walk[walk.length - 1]
    if (id === last) return // ignore double click
    setWalk([...walk, id])
  }
  function undo() {
    if (walk.length > 1) setWalk(walk.slice(0, -1))
  }
  function reset() {
    setWalk([1])
  }
  function loadPreset(p: PresetKey) {
    setWalk(PRESETS.find((x) => x.key === p)!.walk.slice())
  }

  // edges to render bold (the ones in the walk, that ARE edges of G)
  const walkEdgeSet = useMemo(() => {
    const s = new Set<string>()
    stepChecks.forEach((sc) => {
      if (sc.ok) s.add(edgeKey(sc.from, sc.to))
    })
    return s
  }, [stepChecks])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Χτίσε έναν κύκλο — οι τέσσερις όροι ζωντανά
        </div>
        <div className="inline-flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => loadPreset(p.key)}
              className="rounded-md border border-border px-2 py-1 text-xs font-medium text-fg-subtle transition-colors hover:bg-bg-soft hover:text-fg"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Κάνε κλικ σε κορυφές για να βαδίσεις. Επιστροφή στην αρχή «κλείνει» τη διαδρομή.
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* graph */}
        <div className="graph-canvas">
          <svg
            viewBox={L06_GRAPH.viewBox}
            className="mx-auto block h-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {L06_GRAPH.edges.map((e, i) => {
              const g = routeL06GraphEdge(e.a, e.b)
              const on = walkEdgeSet.has(edgeKey(e.a, e.b))
              const stroke = on ? (verdict.tone === 'good' ? '#059669' : '#9f1239') : '#cdc6c5'
              const sw = on ? 4.5 : 2
              return g.kind === 'line' ? (
                <line
                  key={`e${i}`}
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
                  key={`e${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
              )
            })}
            {L06_GRAPH.nodes.map((n) => {
              const idxIn = interior.indexOf(n.id)
              const inWalk = idxIn >= 0
              const isStart = n.id === walk[0] && walk.length >= 1
              const isEnd = !closed && n.id === walk[walk.length - 1]
              const fill = inWalk
                ? verdict.tone === 'good'
                  ? '#a7f3d0'
                  : '#fde68a'
                : '#ffffff'
              const stroke = isStart || isEnd ? '#9f1239' : inWalk ? '#d97706' : '#9b8a8d'
              return (
                <g
                  key={`n${n.id}`}
                  transform={`translate(${n.x} ${n.y})`}
                  className="cursor-pointer"
                  onClick={() => tryAppend(n.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Κορυφή ${n.id}`}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      tryAppend(n.id)
                    }
                  }}
                >
                  <circle r={28} fill="transparent" />
                  <circle r={22} fill={fill} stroke={stroke} strokeWidth={2.5} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={700}
                    fill="#1c1214"
                  >
                    {n.id}
                  </text>
                  {/* order labels */}
                  {inWalk && (
                    <g transform="translate(20 -18)">
                      <circle r={10} fill="#1c1214" />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={700}
                        fill="#fef3c7"
                      >
                        {idxIn + 1}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* right panel */}
        <div className="space-y-3">
          {/* the walk */}
          <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
            <div className="mb-1 text-[11px] uppercase tracking-wider text-fg-subtle">
              Η διαδρομή σου
            </div>
            <div className="font-mono text-sm leading-relaxed text-fg">
              {walk.length === 0 ? '—' : walk.join(' → ')}
              {!closed && walk.length > 1 && <span className="text-fg-subtle"> …</span>}
            </div>
          </div>

          {/* the four checks */}
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Οι τέσσερις όροι
            </div>
            <ul className="space-y-1 text-sm">
              <Check
                ok={allEdgesOk}
                label="κάθε διαδοχικό ζευγάρι είναι ακμή του G"
                done={walk.length >= 2}
              />
              <Check
                ok={longEnough}
                label="k ≥ 3 (όχι πήγαινε-έλα)"
                done={closed}
                value={`k = ${closed ? interiorLen : interior.length}`}
              />
              <Check
                ok={interiorDistinct}
                label="όλες οι κορυφές διακριτές"
                done={walk.length >= 2}
              />
              <Check
                ok={closesOk}
                label="η ακμή {v₁, vₖ} κλείνει τον κύκλο"
                done={closed}
              />
            </ul>
          </div>

          {/* verdict */}
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm font-medium',
              verdict.tone === 'good' &&
                'border-emerald-500/40 bg-emerald-50 text-emerald-800',
              verdict.tone === 'bad' && 'border-rose-500/40 bg-rose-50 text-rose-800',
              verdict.tone === 'idle' && 'border-border bg-bg-soft/40 text-fg-muted',
            )}
          >
            {verdict.text}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Καθαρά
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={walk.length <= 1}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" /> Πίσω
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          {closed ? 'κλειστή διαδρομή' : 'σε εξέλιξη'}
        </span>
      </div>
    </section>
  )
}

function Check({
  ok,
  label,
  done,
  value,
}: {
  ok: boolean
  label: string
  done: boolean
  value?: string
}) {
  const icon = !done ? '·' : ok ? '✓' : '✗'
  const cls = !done
    ? 'text-fg-subtle'
    : ok
      ? 'text-emerald-700'
      : 'text-rose-700'
  return (
    <li className="flex items-center gap-2">
      <span className={cn('font-mono text-base font-bold', cls)} aria-hidden="true">
        {icon}
      </span>
      <span className={cn(done ? 'text-fg' : 'text-fg-subtle')}>{label}</span>
      {value && (
        <span className="ml-auto rounded bg-bg-soft px-1.5 py-0.5 font-mono text-xs text-fg-muted">
          {value}
        </span>
      )}
    </li>
  )
}
