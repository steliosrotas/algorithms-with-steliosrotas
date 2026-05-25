'use client'

/**
 * RiverCrossingGame — playable «λύκος / κατσίκα / λάχανο» puzzle
 * (front-set-7-ask2). The student picks who the boatman ferries across;
 * illegal configurations trigger a clear «X έφαγε Y» message and freeze
 * the game until reset.
 *
 * This is the Νιώσε surface for the problem: every rule is felt by
 * playing it, before the state-graph abstraction in
 * `<RiverCrossingStateGraph />` formalises «κόμβοι = ασφαλείς
 * καταστάσεις · ακμές = επιτρεπτές μεταβάσεις».
 *
 * Character visuals are emojis (🧑 βαρκάρης, 🐺 λύκος, 🐐 κατσίκα,
 * 🥬 λάχανο) — not circles with letters — so the scene reads
 * literally on first glance.
 */

import { useCallback, useState } from 'react'
import { RotateCcw } from 'lucide-react'

type Side = 'L' | 'R'
type Char = 'boatman' | 'wolf' | 'goat' | 'cabbage'
type Passenger = 'alone' | Exclude<Char, 'boatman'>

const EMOJI: Record<Char, string> = {
  boatman: '🧑',
  wolf: '🐺',
  goat: '🐐',
  cabbage: '🥬',
}
const NAMES: Record<Char, string> = {
  boatman: 'βαρκάρης',
  wolf: 'λύκος',
  goat: 'κατσίκα',
  cabbage: 'λάχανο',
}

type Move = { passenger: Passenger; to: Side }

type GameState = {
  pos: Record<Char, Side>
  moves: Move[]
  status: 'playing' | 'failed' | 'won'
  failure?: string
}

const INITIAL: GameState = {
  pos: { boatman: 'L', wolf: 'L', goat: 'L', cabbage: 'L' },
  moves: [],
  status: 'playing',
}

function checkFailure(pos: Record<Char, Side>): string | null {
  const sides: Side[] = ['L', 'R']
  for (const s of sides) {
    if (pos.boatman === s) continue // guarded
    const w = pos.wolf === s
    const g = pos.goat === s
    const c = pos.cabbage === s
    const bank = s === 'L' ? 'αρχική όχθη' : 'απέναντι όχθη'
    if (w && g) return `🐺 + 🐐 χωρίς βαρκάρη στην ${bank} — ο λύκος έφαγε την κατσίκα.`
    if (g && c) return `🐐 + 🥬 χωρίς βαρκάρη στην ${bank} — η κατσίκα έφαγε το λάχανο.`
  }
  return null
}

function isWon(pos: Record<Char, Side>): boolean {
  return pos.boatman === 'R' && pos.wolf === 'R' && pos.goat === 'R' && pos.cabbage === 'R'
}

/* ── geometry ──────────────────────────────────────────────────────────── */
const VB_W = 720
const VB_H = 280
const LEFT_BANK = { x: 0, w: 240 }
const RIGHT_BANK = { x: 480, w: 240 }
// Slot positions for non-boatman characters on each bank
const LEFT_SLOTS = [40, 100, 160]
const RIGHT_SLOTS = [520, 580, 640]
const CHAR_Y = 175
const BOAT_Y = 180

export function RiverCrossingGame() {
  const [state, setState] = useState<GameState>(INITIAL)
  const { pos, status, failure, moves } = state
  const boatSide = pos.boatman

  const tryMove = useCallback(
    (passenger: Passenger) => {
      setState((cur) => {
        if (cur.status !== 'playing') return cur
        const here = cur.pos.boatman
        if (passenger !== 'alone' && cur.pos[passenger] !== here) return cur
        const there: Side = here === 'L' ? 'R' : 'L'
        const newPos = { ...cur.pos, boatman: there }
        if (passenger !== 'alone') newPos[passenger] = there
        const fail = checkFailure(newPos)
        const won = !fail && isWon(newPos)
        return {
          pos: newPos,
          moves: [...cur.moves, { passenger, to: there }],
          status: fail ? 'failed' : won ? 'won' : 'playing',
          failure: fail ?? undefined,
        }
      })
    },
    [],
  )

  const reset = useCallback(() => setState(INITIAL), [])
  const undo = useCallback(() => {
    setState((cur) => {
      if (cur.moves.length === 0) return cur
      // Replay all but the last from initial
      const replay = cur.moves.slice(0, -1)
      let s: GameState = INITIAL
      for (const m of replay) {
        const here = s.pos.boatman
        const there: Side = here === 'L' ? 'R' : 'L'
        const np = { ...s.pos, boatman: there }
        if (m.passenger !== 'alone') np[m.passenger] = there
        const f = checkFailure(np)
        s = {
          pos: np,
          moves: [...s.moves, m],
          status: f ? 'failed' : isWon(np) ? 'won' : 'playing',
          failure: f ?? undefined,
        }
      }
      return s
    })
  }, [])

  // Which non-boatman characters render on each bank, in fixed order
  const nonBoatmanOrder: Array<Exclude<Char, 'boatman'>> = ['wolf', 'goat', 'cabbage']
  const leftChars = nonBoatmanOrder.filter((c) => pos[c] === 'L')
  const rightChars = nonBoatmanOrder.filter((c) => pos[c] === 'R')

  const boatX = boatSide === 'L' ? 200 : 470 // dock edge
  const boatmanX = boatSide === 'L' ? 215 : 485

  const statusBadge = (() => {
    if (status === 'won')
      return (
        <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-100">
          🎉 Νίκη σε {moves.length} περάσματα
        </span>
      )
    if (status === 'failed')
      return (
        <span className="shrink-0 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-800 dark:bg-rose-500/25 dark:text-rose-100">
          ❌ Παράνομη κατάσταση
        </span>
      )
    return (
      <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
        Περάσματα: {moves.length}
      </span>
    )
  })()

  const canMove = (p: Passenger) => status === 'playing' && (p === 'alone' || pos[p] === boatSide)

  type ButtonSpec = { p: Passenger; label: string }
  const buttons: ButtonSpec[] = [
    { p: 'alone', label: 'Πέρασε μόνος' },
    { p: 'wolf', label: 'Με τον 🐺 λύκο' },
    { p: 'goat', label: 'Με την 🐐 κατσίκα' },
    { p: 'cabbage', label: 'Με το 🥬 λάχανο' },
  ]

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δοκίμασε τον γρίφο — μετάφερε όλους απέναντι χωρίς να φαγωθεί κανείς
        </div>
        {statusBadge}
      </div>

      <div role="group" aria-label="Επιλογές περάσματος" className="mb-3 flex flex-wrap gap-2">
        {buttons.map(({ p, label }) => (
          <button
            key={p}
            type="button"
            onClick={() => tryMove(p)}
            disabled={!canMove(p)}
            className={
              'rounded-md border px-3 py-1 text-xs font-medium transition ' +
              (canMove(p)
                ? 'border-border bg-bg text-fg hover:border-accent hover:text-accent'
                : 'cursor-not-allowed border-border bg-bg-soft text-fg-subtle opacity-60')
            }
            aria-disabled={!canMove(p)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={undo}
          disabled={moves.length === 0}
          className={
            'ml-auto inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-medium transition ' +
            (moves.length > 0
              ? 'border-border bg-bg text-fg-subtle hover:text-fg'
              : 'cursor-not-allowed border-border bg-bg-soft text-fg-subtle opacity-60')
          }
        >
          ↩ Αναίρεση
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-3 py-1 text-xs font-medium text-fg-subtle transition hover:text-fg"
          aria-label="Επαναφορά παιχνιδιού"
        >
          <RotateCcw className="h-3 w-3" /> Επαναφορά
        </button>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${VB_W}px` }}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`Σκηνή ποταμού. Αρχική όχθη: ${leftChars.length ? leftChars.map((c) => NAMES[c]).join(', ') : 'άδεια'}${
            boatSide === 'L' ? ' + βαρκάρης' : ''
          }. Απέναντι όχθη: ${rightChars.length ? rightChars.map((c) => NAMES[c]).join(', ') : 'άδεια'}${
            boatSide === 'R' ? ' + βαρκάρης' : ''
          }.`}
        >
          {/* Banks (grass green tint) */}
          <rect x={LEFT_BANK.x} y={70} width={LEFT_BANK.w} height={170} fill="rgb(132 204 22 / 0.30)" />
          <rect x={RIGHT_BANK.x} y={70} width={RIGHT_BANK.w} height={170} fill="rgb(132 204 22 / 0.30)" />
          {/* River (blue tint) */}
          <rect x={LEFT_BANK.w} y={70} width={RIGHT_BANK.x - LEFT_BANK.w} height={170} fill="rgb(59 130 246 / 0.30)" />
          {/* Wave lines */}
          {[110, 145, 180, 215].map((y) => (
            <path
              key={`wave-${y}`}
              d={`M ${LEFT_BANK.w + 10} ${y} q 18 -6 36 0 t 36 0 t 36 0 t 36 0 t 36 0 t 36 0`}
              stroke="rgb(59 130 246 / 0.5)"
              strokeWidth={1.5}
              fill="none"
            />
          ))}

          {/* Bank labels */}
          <text x={LEFT_BANK.w / 2} y={48} textAnchor="middle" fontSize={14} fontWeight={600} fill="rgb(var(--fg))">
            Αρχική όχθη
          </text>
          <text x={(LEFT_BANK.w + RIGHT_BANK.x) / 2} y={48} textAnchor="middle" fontSize={13} fontStyle="italic" fill="rgb(var(--fg-subtle))">
            ποταμός
          </text>
          <text x={RIGHT_BANK.x + RIGHT_BANK.w / 2} y={48} textAnchor="middle" fontSize={14} fontWeight={600} fill="rgb(var(--fg))">
            Απέναντι όχθη
          </text>

          {/* Boat (drawn under the boatman) */}
          <path
            d={`M ${boatX} ${BOAT_Y + 18} L ${boatX + 70} ${BOAT_Y + 18} L ${boatX + 62} ${BOAT_Y + 36} L ${boatX + 8} ${BOAT_Y + 36} Z`}
            fill="rgb(180 83 9)"
            stroke="rgb(120 53 15)"
            strokeWidth={2}
          />
          <text x={boatX + 35} y={BOAT_Y + 50} textAnchor="middle" fontSize={10} fontStyle="italic" fill="rgb(var(--fg-muted))">
            βάρκα
          </text>

          {/* Boatman emoji on the boat */}
          <text
            x={boatmanX + 20}
            y={BOAT_Y + 12}
            textAnchor="middle"
            fontSize={28}
            aria-label={`Βαρκάρης στην ${boatSide === 'L' ? 'αρχική' : 'απέναντι'} όχθη.`}
          >
            {EMOJI.boatman}
          </text>

          {/* Left-bank characters */}
          {leftChars.map((c, i) => (
            <g key={`L-${c}`}>
              <text
                x={LEFT_SLOTS[i]}
                y={CHAR_Y}
                textAnchor="middle"
                fontSize={32}
                aria-label={NAMES[c]}
              >
                {EMOJI[c]}
              </text>
              <text
                x={LEFT_SLOTS[i]}
                y={CHAR_Y + 22}
                textAnchor="middle"
                fontSize={10}
                fill="rgb(var(--fg))"
              >
                {NAMES[c]}
              </text>
            </g>
          ))}

          {/* Right-bank characters */}
          {rightChars.map((c, i) => (
            <g key={`R-${c}`}>
              <text
                x={RIGHT_SLOTS[i]}
                y={CHAR_Y}
                textAnchor="middle"
                fontSize={32}
                aria-label={NAMES[c]}
              >
                {EMOJI[c]}
              </text>
              <text
                x={RIGHT_SLOTS[i]}
                y={CHAR_Y + 22}
                textAnchor="middle"
                fontSize={10}
                fill="rgb(var(--fg))"
              >
                {NAMES[c]}
              </text>
            </g>
          ))}

          {/* Failure / win overlay */}
          {status === 'failed' && (
            <>
              <rect x={0} y={0} width={VB_W} height={VB_H} fill="rgb(244 63 94 / 0.10)" />
              <text x={VB_W / 2} y={VB_H - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill="rgb(190 18 60)">
                {failure}
              </text>
            </>
          )}
          {status === 'won' && (
            <>
              <rect x={0} y={0} width={VB_W} height={VB_H} fill="rgb(16 185 129 / 0.10)" />
              <text x={VB_W / 2} y={VB_H - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill="rgb(4 120 87)">
                🎉 Όλοι απέναντι, σώοι και αβλαβείς — σε {moves.length} περάσματα.
              </text>
            </>
          )}

          {/* Rule caption (only when playing) */}
          {status === 'playing' && (
            <text x={VB_W / 2} y={VB_H - 12} textAnchor="middle" fontSize={11.5} fontStyle="italic" fill="rgb(var(--fg-muted))">
              Χωρίς τον βαρκάρη: 🐺 + 🐐 ⇒ φάγωμα · 🐐 + 🥬 ⇒ φάγωμα
            </text>
          )}
        </svg>
      </div>

      <p className="mt-3 text-xs text-fg-subtle">
        Η βέλτιστη λύση είναι 7 περασμάτων (κατσίκα · μόνος · λάχανο · κατσίκα πίσω · λύκος ·
        μόνος · κατσίκα). Αν δοκιμάσεις «λύκο πρώτα» θα δεις άμεσα το φάγωμα — το ίδιο
        μηνύμα που θα έβλεπες σαν κόκκινη ακμή στον γράφο καταστάσεων.
      </p>
    </section>
  )
}
