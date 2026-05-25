'use client'

/**
 * PartyDegreeFilter — iterative removal until every node satisfies both
 * degree constraints (front-set-7-ask9, "Alice's party").
 *
 * The original problem uses threshold k=5: each person at the party needs
 * ≥5 friends AND ≥5 strangers. For a clean SVG we run the same algorithm
 * with k=2 on 10 people — small enough to lay out, large enough to show the
 * cascade. The mechanics are identical for any k.
 *
 * The graph is engineered so the algorithm takes 3 visible removal steps:
 *   - Step 1: remove the "social butterfly" (vertex 8) — too many friends, can't
 *     leave room for 2 strangers. Removing 8 reduces everyone's friend-count by 1.
 *   - Step 2: that drops vertices 9 and 10 below the friend-floor — remove 9 first.
 *   - Step 3: remove 10. After this the remaining 7 people all satisfy both
 *     constraints, and the algorithm halts.
 *
 * Each step shows the violating-degree highlight, what gets removed, and how
 * the surrounding degrees update — that's the load-bearing teaching point.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const K_FRIENDS = 2
const K_STRANGERS = 2

type V = { id: number; x: number; y: number }
type E = { a: number; b: number }

// 1..6: a cycle in the middle. 7: above-left, friend to {1,2,3}. 8: outside-right,
// social butterfly. 9: top, friend to {1, 8}. 10: bottom, friend to {6, 8}.
const VERTICES: V[] = [
  { id: 1, x: 250, y: 110 },
  { id: 2, x: 320, y: 140 },
  { id: 3, x: 320, y: 220 },
  { id: 4, x: 250, y: 260 },
  { id: 5, x: 180, y: 220 },
  { id: 6, x: 180, y: 140 },
  { id: 7, x: 70, y: 80 },
  { id: 8, x: 470, y: 180 },
  { id: 9, x: 250, y: 30 },
  { id: 10, x: 250, y: 340 },
]
const EDGES: E[] = [
  // C_6 cycle:
  { a: 1, b: 2 },
  { a: 2, b: 3 },
  { a: 3, b: 4 },
  { a: 4, b: 5 },
  { a: 5, b: 6 },
  { a: 6, b: 1 },
  // 7's three friends:
  { a: 7, b: 1 },
  { a: 7, b: 2 },
  { a: 7, b: 3 },
  // 8 the social butterfly (9 edges = everyone else):
  { a: 8, b: 1 },
  { a: 8, b: 2 },
  { a: 8, b: 3 },
  { a: 8, b: 4 },
  { a: 8, b: 5 },
  { a: 8, b: 6 },
  { a: 8, b: 7 },
  { a: 8, b: 9 },
  { a: 8, b: 10 },
  // 9: connected to 1 (and 8 already above):
  { a: 9, b: 1 },
  // 10: connected to 6 (and 8 already above):
  { a: 10, b: 6 },
]

type StepEvent = {
  removed: number | null
  caption: string
  /** Which vertex IDs are highlighted as "currently violating". */
  violating: number[]
}

// Build the sequence of step events ahead of time so prev/next is trivial.
function buildSteps(): { events: StepEvent[]; finalParty: number[] } {
  const adj = new Map<number, Set<number>>()
  for (const v of VERTICES) adj.set(v.id, new Set())
  for (const e of EDGES) {
    adj.get(e.a)!.add(e.b)
    adj.get(e.b)!.add(e.a)
  }
  const present = new Set<number>(VERTICES.map((v) => v.id))

  function violatorsOf(present: Set<number>): number[] {
    const n = present.size
    const tooFew: number[] = []
    const tooMany: number[] = []
    for (const v of present) {
      const friendsInside = [...adj.get(v)!].filter((u) => present.has(u)).length
      const strangers = n - 1 - friendsInside
      if (friendsInside < K_FRIENDS) tooFew.push(v)
      if (strangers < K_STRANGERS) tooMany.push(v)
    }
    return [...new Set([...tooFew, ...tooMany])].sort((a, b) => a - b)
  }

  const events: StepEvent[] = []
  events.push({
    removed: null,
    caption: `Αρχικό σύνολο 10 ατόμων. Κάθε άτομο πρέπει να έχει ≥${K_FRIENDS} φίλους ΚΑΙ ≥${K_STRANGERS} αγνώστους μέσα στο σύνολο.`,
    violating: violatorsOf(present),
  })

  // Removal strategy: pick the violator with the LARGEST «πόση απόκλιση» — but
  // for clarity here we just pick by largest degree (the social butterfly
  // case), then smallest. This matches the prose narrative.
  while (true) {
    const viols = violatorsOf(present)
    if (viols.length === 0) break
    // Choose: vertices with too many friends first (degree > n-1-K_STRANGERS),
    // breaking ties by largest degree. Else vertices with too few friends,
    // breaking ties by smallest degree.
    const n = present.size
    const overFull = viols
      .map((v) => ({
        v,
        d: [...adj.get(v)!].filter((u) => present.has(u)).length,
      }))
      .filter((x) => x.d > n - 1 - K_STRANGERS)
      .sort((a, b) => b.d - a.d || a.v - b.v)
    const underFull = viols
      .map((v) => ({
        v,
        d: [...adj.get(v)!].filter((u) => present.has(u)).length,
      }))
      .filter((x) => x.d < K_FRIENDS)
      .sort((a, b) => a.d - b.d || a.v - b.v)
    const pick = overFull.length > 0 ? overFull[0].v : underFull[0].v
    const dPick = [...adj.get(pick)!].filter((u) => present.has(u)).length
    const tooMany = dPick > n - 1 - K_STRANGERS
    present.delete(pick)
    const newViols = violatorsOf(present)
    events.push({
      removed: pick,
      caption: tooMany
        ? `Αφαιρώ τον ${pick}: είχε ${dPick} φίλους (από ${n - 1} άλλους) → μόνο ${n - 1 - dPick} αγνώστους (< ${K_STRANGERS}).`
        : `Αφαιρώ τον ${pick}: είχε μόνο ${dPick} φίλους στην παρέα (< ${K_FRIENDS}).`,
      violating: newViols,
    })
  }

  events.push({
    removed: null,
    caption: `Σταθερό σύνολο — όλοι οι παραμένοντες έχουν ≥${K_FRIENDS} φίλους ΚΑΙ ≥${K_STRANGERS} αγνώστους. Το πάρτι ολοκληρώθηκε.`,
    violating: [],
  })
  return { events, finalParty: [...present].sort((a, b) => a - b) }
}

const SCRIPT = buildSteps()

export function PartyDegreeFilter() {
  const [k, setK] = useState(0)
  const [playing, setPlaying] = useState(false)

  const present = useMemo(() => {
    const s = new Set<number>(VERTICES.map((v) => v.id))
    for (let i = 1; i <= k; i++) {
      const r = SCRIPT.events[i]?.removed
      if (r != null) s.delete(r)
    }
    return s
  }, [k])

  const ev = SCRIPT.events[k]

  // Live degree of each present vertex.
  const degree = useMemo(() => {
    const d = new Map<number, number>()
    for (const v of present) {
      const adj = EDGES.filter(
        (e) =>
          (e.a === v && present.has(e.b)) || (e.b === v && present.has(e.a)),
      ).length
      d.set(v, adj)
    }
    return d
  }, [present])

  const n = present.size

  function reset() {
    setK(0)
    setPlaying(false)
  }
  function back() {
    if (k > 0) setK(k - 1)
  }
  function forward() {
    if (k < SCRIPT.events.length - 1) setK(k + 1)
  }

  useEffect(() => {
    if (!playing) return
    if (k >= SCRIPT.events.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(forward, 1100)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, k])

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border bg-bg-soft/30">
      <div className="border-b border-border bg-bg-soft/50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πάρτι της Alice — επαναληπτική αφαίρεση
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Όσο υπάρχει κάποιος που παραβιάζει το κριτήριο, αφαίρεσέ τον· επαναλάβε
          μέχρι σταθερότητα.{' '}
          <em>
            Για να χωράει στο διάγραμμα δείχνουμε k = {K_FRIENDS} σε 10 άτομα·
            ο αλγόριθμος είναι ο ίδιος για k = 5 ή για άλλο k.
          </em>
        </p>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[1.5fr_1fr]">
        {/* Graph */}
        <div className="rounded-xl border border-border bg-bg-elevated p-3">
          <svg viewBox="0 0 540 380" className="w-full">
            {EDGES.map((e, i) => {
              const isPresent = present.has(e.a) && present.has(e.b)
              const pa = VERTICES.find((v) => v.id === e.a)
              const pb = VERTICES.find((v) => v.id === e.b)
              if (!pa || !pb) return null
              return (
                <line
                  key={i}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={isPresent ? '#9b8a8d' : '#e7e3e4'}
                  strokeWidth={isPresent ? 1.8 : 1}
                  opacity={isPresent ? 1 : 0.5}
                  strokeDasharray={isPresent ? undefined : '3 3'}
                />
              )
            })}
            {VERTICES.map((v) => {
              const here = present.has(v.id)
              const removedNow = ev.removed === v.id
              const violating = ev.violating.includes(v.id)
              const d = degree.get(v.id) ?? 0
              return (
                <g key={v.id} opacity={here || removedNow ? 1 : 0.25}>
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={removedNow ? 22 : 18}
                    fill={
                      removedNow
                        ? '#fecaca'
                        : violating
                          ? '#fef3c7'
                          : here
                            ? '#dcfce7'
                            : '#f5f5f4'
                    }
                    stroke={
                      removedNow
                        ? '#dc2626'
                        : violating
                          ? '#d97706'
                          : here
                            ? '#15803d'
                            : '#a8a29e'
                    }
                    strokeWidth={removedNow || violating ? 3 : 2}
                    strokeDasharray={!here && !removedNow ? '3 2' : undefined}
                  />
                  <text
                    x={v.x}
                    y={v.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="700"
                    fill={here ? '#14532d' : removedNow ? '#7f1d1d' : '#57534e'}
                  >
                    {v.id}
                  </text>
                  {here && (
                    <text
                      x={v.x}
                      y={v.y + 28}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="ui-monospace,SFMono-Regular,Menlo,Monaco,monospace"
                      fill={violating ? '#92400e' : '#65a30d'}
                    >
                      d={d}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          <p className="mt-2 min-h-[2.5rem] text-sm text-fg-default">{ev.caption}</p>
        </div>

        {/* Side panel: degree table + constraints */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-bg-elevated p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Κατάσταση συνόλου
            </p>
            <p className="mt-2 text-sm">
              <span className="font-semibold">n = {n}</span> άτομα στο τρέχον σύνολο.
            </p>
            <p className="text-xs text-fg-muted">
              Έγκυρος βαθμός: {K_FRIENDS} ≤ d ≤ {Math.max(0, n - 1 - K_STRANGERS)}{' '}
              <span className="text-fg-subtle">(αρκετοί φίλοι, αρκετοί άγνωστοι)</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-elevated p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Βαθμοί
            </p>
            <div className="mt-2 grid grid-cols-5 gap-1 font-mono text-[11px]">
              {VERTICES.map((v) => {
                const here = present.has(v.id)
                const d = degree.get(v.id) ?? 0
                const violating = ev.violating.includes(v.id)
                const tooFew = here && d < K_FRIENDS
                const tooMany = here && n - 1 - d < K_STRANGERS
                return (
                  <div
                    key={v.id}
                    className={cn(
                      'rounded px-1.5 py-1 text-center',
                      !here
                        ? 'bg-bg-soft text-fg-subtle line-through'
                        : violating
                          ? 'bg-amber-100 ring-1 ring-amber-400'
                          : 'bg-emerald-50 ring-1 ring-emerald-200',
                    )}
                    title={
                      here
                        ? tooFew
                          ? `vertex ${v.id}: μόνο ${d} φίλοι`
                          : tooMany
                            ? `vertex ${v.id}: μόνο ${n - 1 - d} άγνωστοι`
                            : `vertex ${v.id}: εντάξει`
                        : `vertex ${v.id}: αφαιρέθηκε`
                    }
                  >
                    <div className="font-bold">{v.id}</div>
                    <div className="text-fg-muted">d={here ? d : '–'}</div>
                  </div>
                )
              })}
            </div>
            {ev.violating.length > 0 && (
              <p className="mt-2 text-xs text-amber-800">
                Παραβιάζουν: <span className="font-mono font-semibold">{ev.violating.join(', ')}</span>
              </p>
            )}
          </div>
          <div className="rounded-xl border border-border bg-bg-soft/40 p-3 text-xs text-fg-muted">
            <p>
              <span className="font-semibold text-fg-default">Γιατί αυτό λειτουργεί:</span>{' '}
              όταν ένας προβληματικός κόμβος έχει &lt; {K_FRIENDS} φίλους τώρα, σε
              ΟΠΟΙΟΔΗΠΟΤΕ υποσύνολο του τρέχοντος θα έχει το πολύ τόσους — άρα
              δεν χάνουμε ποτέ έγκυρη λύση αφαιρώντας τον. Συμμετρικά για τους
              αγνώστους.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-bg-soft/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={back}
            disabled={k === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft size={16} /> πίσω
          </button>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            disabled={k >= SCRIPT.events.length - 1}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'παύση' : 'παίξε'}
          </button>
          <button
            type="button"
            onClick={forward}
            disabled={k >= SCRIPT.events.length - 1}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft disabled:opacity-40"
          >
            επόμενο <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm hover:bg-bg-soft"
          >
            <RotateCcw size={14} /> reset
          </button>
        </div>
        <p className="text-xs text-fg-subtle tabular-nums">
          βήμα {k} / {SCRIPT.events.length - 1}
          {k === SCRIPT.events.length - 1 && (
            <>
              {' '}· τελικό πάρτι: <span className="font-mono">{SCRIPT.finalParty.join(', ')}</span>{' '}
              ({SCRIPT.finalParty.length} άτομα)
            </>
          )}
        </p>
      </div>
    </div>
  )
}
