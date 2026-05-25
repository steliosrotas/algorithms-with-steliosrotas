'use client'

/**
 * PathBuilder — walk a path; non-simple paths get scissored to simple ones (L06).
 *
 * Two ideas live in this one viz. First, what a path actually is: a
 * sequence of vertices where each consecutive pair is an edge. Click on a
 * non-neighbour and the link flashes red — not a path. Second, the
 * shortest-path-is-always-simple intuition: if your walk visits the same
 * vertex twice, you can clip out the loop between the two visits and end
 * up with a strictly shorter path. The "Ψαλίδι" button performs the cut
 * live, the length counter drops, and the verdict flips from «μη απλή» to
 * «απλή». Built for L06 on the canonical L06_GRAPH.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, Scissors, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { L06_GRAPH, edgeKey, routeL06GraphEdge } from './graph-types'

const EDGE_SET = new Set(L06_GRAPH.edges.map((e) => edgeKey(e.a, e.b)))

type PresetKey = 'simple' | 'nonSimple' | 'notAPath'
const PRESETS: { key: PresetKey; label: string; walk: number[]; note: string }[] = [
  {
    key: 'simple',
    label: 'Απλή διαδρομή',
    walk: [1, 2, 5, 6],
    note: 'Διαδρομή 1→2→5→6 με όλες τις κορυφές διαφορετικές. Μήκος 3.',
  },
  {
    key: 'nonSimple',
    label: 'Μη απλή — με κύκλο μέσα',
    walk: [1, 2, 3, 5, 2, 4],
    note: 'Η διαδρομή 1→2→3→5→2→4 επανεπισκέπτεται την 2. Πάτα το ψαλίδι — θα κόψει το κομμάτι 2…2 και θα δώσει μικρότερη διαδρομή με τα ίδια άκρα.',
  },
  {
    key: 'notAPath',
    label: 'Δεν είναι διαδρομή',
    walk: [1, 5],
    note: 'Δεν υπάρχει ακμή {1, 5}. Η ακολουθία ΔΕΝ είναι διαδρομή.',
  },
]

function isAdjacent(a: number, b: number) {
  return EDGE_SET.has(edgeKey(a, b))
}

/** find the first repeat (i, j) with walk[i] = walk[j], i < j, j minimal */
function firstRepeat(walk: number[]): [number, number] | null {
  const seen = new Map<number, number>()
  for (let j = 0; j < walk.length; j++) {
    const id = walk[j]
    if (seen.has(id)) return [seen.get(id)!, j]
    seen.set(id, j)
  }
  return null
}

export function PathBuilder() {
  const [walk, setWalk] = useState<number[]>([1, 2, 3, 5, 2, 4])
  const [highlightCut, setHighlightCut] = useState<[number, number] | null>(null)

  const stepChecks = useMemo(() => {
    const res: { from: number; to: number; ok: boolean }[] = []
    for (let i = 1; i < walk.length; i++) {
      res.push({ from: walk[i - 1], to: walk[i], ok: isAdjacent(walk[i - 1], walk[i]) })
    }
    return res
  }, [walk])

  const isPath = walk.length >= 1 && stepChecks.every((s) => s.ok)
  const repeat = firstRepeat(walk)
  const isSimple = isPath && repeat === null
  const length = Math.max(0, walk.length - 1)

  function tryAppend(id: number) {
    if (walk.length === 0) {
      setWalk([id])
      return
    }
    if (id === walk[walk.length - 1]) return
    setWalk([...walk, id])
    setHighlightCut(null)
  }
  function undo() {
    if (walk.length > 0) setWalk(walk.slice(0, -1))
    setHighlightCut(null)
  }
  function reset() {
    setWalk([1])
    setHighlightCut(null)
  }
  function loadPreset(p: PresetKey) {
    setWalk(PRESETS.find((x) => x.key === p)!.walk.slice())
    setHighlightCut(null)
  }
  function scissor() {
    if (!repeat) return
    const [i, j] = repeat
    setHighlightCut([i, j])
    // delay the cut so the highlight is visible
    setTimeout(() => {
      setWalk((w) => [...w.slice(0, i), ...w.slice(j)])
      setHighlightCut(null)
    }, 700)
  }

  const verdict: { tone: 'good' | 'bad' | 'idle'; text: string } = (() => {
    if (walk.length <= 1)
      return { tone: 'idle', text: 'Διάλεξε κορυφές για να χτίσεις διαδρομή.' }
    if (!isPath) {
      const bad = stepChecks.find((s) => !s.ok)!
      return {
        tone: 'bad',
        text: `Δεν υπάρχει ακμή { ${bad.from}, ${bad.to} } — δεν είναι διαδρομή. «Πίσω» για να διορθώσεις.`,
      }
    }
    if (!isSimple) {
      const [i, j] = repeat!
      return {
        tone: 'bad',
        text: `Μη απλή διαδρομή — η κορυφή ${walk[i]} εμφανίζεται στις θέσεις ${i + 1} και ${j + 1}. Ανάμεσά τους κρύβεται κύκλος. Πάτα το ψαλίδι για να τον κόψεις και να μείνει μικρότερη διαδρομή με τα ίδια άκρα.`,
      }
    }
    return {
      tone: 'good',
      text: `Απλή διαδρομή μήκους ${length} από την ${walk[0]} στην ${walk[walk.length - 1]}.`,
    }
  })()

  const walkEdgeSet = useMemo(() => {
    const s = new Set<string>()
    stepChecks.forEach((sc) => {
      if (sc.ok) s.add(edgeKey(sc.from, sc.to))
    })
    return s
  }, [stepChecks])

  // edges between cut indices (inclusive of i..j-1 step)
  const cutEdgeSet = useMemo(() => {
    if (!highlightCut) return new Set<string>()
    const [i, j] = highlightCut
    const s = new Set<string>()
    for (let k = i; k < j; k++) s.add(edgeKey(walk[k], walk[k + 1]))
    return s
  }, [highlightCut, walk])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Φτιάξε μια διαδρομή — και αν διπλώνει, ψαλιδίζεται
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
        Κλικ στις κορυφές για να βαδίσεις. Επιτρέπεται να επιστρέψεις σε κορυφή — αλλά μετά η διαδρομή θα είναι «μη απλή».
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
              const k = edgeKey(e.a, e.b)
              const inCut = cutEdgeSet.has(k)
              const inWalk = walkEdgeSet.has(k)
              const stroke = inCut
                ? '#dc2626'
                : inWalk
                  ? isSimple
                    ? '#059669'
                    : '#9f1239'
                  : '#cdc6c5'
              const sw = inCut ? 5 : inWalk ? 4.5 : 2
              const dash = inCut ? '6 4' : undefined
              return g.kind === 'line' ? (
                <line
                  key={`e${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeDasharray={dash}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  key={`e${i}`}
                  d={g.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeDasharray={dash}
                  strokeLinecap="round"
                />
              )
            })}
            {L06_GRAPH.nodes.map((n) => {
              const visits = walk.filter((id) => id === n.id).length
              const inWalk = visits > 0
              const isStart = n.id === walk[0]
              const isEnd = n.id === walk[walk.length - 1]
              const fill = !inWalk
                ? '#ffffff'
                : visits > 1
                  ? '#fecaca'
                  : isSimple
                    ? '#a7f3d0'
                    : '#fde68a'
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
                  {visits > 1 && (
                    <g transform="translate(20 -18)">
                      <circle r={10} fill="#dc2626" />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={700}
                        fill="#ffffff"
                      >
                        ×{visits}
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
          <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-wider text-fg-subtle">
                Η διαδρομή σου
              </span>
              <span className="rounded-md bg-bg-soft px-2 py-0.5 font-mono text-xs text-fg-muted">
                μήκος {length}
              </span>
            </div>
            <div className="font-mono text-sm leading-relaxed text-fg">
              {walk.length === 0 ? '—' : walk.join(' → ')}
            </div>
          </div>

          {/* status badges */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Badge ok={isPath} label="διαδρομή;" />
            <Badge ok={isSimple} label="απλή;" />
          </div>

          {/* verdict */}
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm leading-relaxed',
              verdict.tone === 'good' &&
                'border-emerald-500/40 bg-emerald-50 text-emerald-800',
              verdict.tone === 'bad' && 'border-rose-500/40 bg-rose-50 text-rose-800',
              verdict.tone === 'idle' && 'border-border bg-bg-soft/40 text-fg-muted',
            )}
          >
            {verdict.text}
          </div>

          {/* scissor explanation */}
          {!isSimple && isPath && repeat && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              <strong>Γιατί κόβει η ψαλίδα:</strong> ανάμεσα στις δύο εμφανίσεις της
              κορυφής {walk[repeat[0]]} (θέση {repeat[0] + 1} και {repeat[1] + 1}) η
              διαδρομή φτιάχνει έναν κύκλο. Διαγράφοντας αυτό το ενδιάμεσο κομμάτι,
              τα άκρα μένουν τα ίδια αλλά το μήκος πέφτει κατά {repeat[1] - repeat[0]}.
              Αυτή είναι η απόδειξη που λέει «η συντομότερη διαδρομή είναι πάντα απλή».
            </div>
          )}
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
        <button
          type="button"
          onClick={scissor}
          disabled={!repeat || !isPath}
          className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Scissors className="h-4 w-4" aria-hidden="true" /> Ψαλίδι (κόψε τον κύκλο)
        </button>
      </div>
    </section>
  )
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-md border px-2 py-1.5',
        ok
          ? 'border-emerald-500/40 bg-emerald-50 text-emerald-800'
          : 'border-rose-500/40 bg-rose-50 text-rose-800',
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className="font-mono text-base font-bold">{ok ? '✓' : '✗'}</span>
    </div>
  )
}
