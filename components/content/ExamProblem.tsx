/**
 * ExamProblem — past-exam citation, dual-mode.
 *
 * Two ways to use this on a lecture page (Phase E):
 *
 * 1. **Inline chip mode (preferred for Phase E.1).** Pass `relatedExerciseId`.
 *    The component looks the exercise up in the practice bank, renders a
 *    compact rose-tinted citation chip — date + problem number + title +
 *    one-sentence «αν δεις X → Y» pattern cue + deep-link to
 *    `/practice#exercise:<id>` — and stays a server component (zero JS
 *    shipped). Use this when the lecture prose hits a moment the student
 *    should recognise as an actual exam problem.
 *
 * 2. **Legacy full-card mode (kept for back-compat).** Pass `year` +
 *    `children` (the problem statement + worked solution). The component
 *    delegates to the client-side `<ExamProblemCard>` which renders the old
 *    collapsible card with the «Λυμένο» toggle. New lecture pages should
 *    NOT use this — use chip mode + the practice bank entry instead.
 *
 * The dispatch is automatic: if `relatedExerciseId` is set, chip mode wins.
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import { GraduationCap, Flame, ArrowRight, AlertTriangle } from 'lucide-react'
import { EXERCISES } from '@/content/practice/exercises'
import { SOURCE_LABELS, RECENT_SOURCES } from '@/content/practice/types'
import { ExamProblemCard } from './ExamProblemCard'

type ChipProps = {
  /** Bank entry id this citation points to (e.g. `'pt1-th3-q1'`). Switches the component into chip mode. */
  relatedExerciseId: string
  /** One-sentence recognition cue. «Αν δεις X στην εκφώνηση, σκέψου Y.» */
  pattern?: ReactNode
  /** Optional title override (defaults to `exercise.title`). */
  title?: string
  // The card-mode props are forbidden in chip mode.
  year?: never
  weight?: never
  id?: never
  children?: never
}

type CardProps = {
  year: string
  weight?: string
  title?: string
  /** Stable per-page id for the "λυμένο" toggle's localStorage key. */
  id?: string
  children: ReactNode
  // The chip-mode props are forbidden in card mode.
  relatedExerciseId?: never
  pattern?: never
}

type Props = ChipProps | CardProps

function isChipMode(props: Props): props is ChipProps {
  return typeof props.relatedExerciseId === 'string' && props.relatedExerciseId.length > 0
}

export function ExamProblem(props: Props) {
  if (isChipMode(props)) {
    return (
      <ExamProblemChip
        relatedExerciseId={props.relatedExerciseId}
        pattern={props.pattern}
        title={props.title}
      />
    )
  }
  return (
    <ExamProblemCard
      year={props.year}
      weight={props.weight}
      title={props.title}
      id={props.id}
    >
      {props.children}
    </ExamProblemCard>
  )
}

type ChipImplProps = {
  relatedExerciseId: string
  pattern?: ReactNode
  title?: string
}

/** Drop the leading `'<Date> · Θέμα X — '` (or `'… · Άσκηση N — '`) prefix
 * the bank convention puts on every transcribed `title`. The chip header
 * already renders that prefix from `source` + `problemNumber`; without
 * stripping, the chip's title line would echo it. */
function stripBankTitlePrefix(title: string): string {
  const sep = ' — '
  const idx = title.indexOf(sep)
  return idx >= 0 ? title.slice(idx + sep.length) : title
}

function ExamProblemChip({ relatedExerciseId, pattern, title }: ChipImplProps) {
  const ex = EXERCISES.find((e) => e.id === relatedExerciseId)

  if (!ex) {
    // In development, surface the broken citation prominently so the author
    // notices. In production we render nothing — a missing bank entry is
    // never worth showing the student a stub.
    if (process.env.NODE_ENV !== 'production') {
      return (
        <aside
          className="not-prose my-5 rounded-lg border-l-4 border-l-amber-500 border-amber-300/60 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
          role="note"
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {'<ExamProblem relatedExerciseId="'}
            {relatedExerciseId}
            {'">'} — δεν βρέθηκε στο practice bank.
          </span>
        </aside>
      )
    }
    return null
  }

  const sourceLabel = ex.source ? SOURCE_LABELS[ex.source] : null
  const isRecent = ex.source ? RECENT_SOURCES.has(ex.source) : false
  const recentYear =
    ex.source && ex.source.endsWith('-2025') ? '2025' : '2024'
  // The chip header already shows sourceLabel · problemNumber, but bank
  // titles by convention include that same prefix (`'Σεπτέμβριος 2025 · Θέμα 2.1 — <real title>'`).
  // Strip the prefix so we don't render it twice.
  const displayTitle = title ?? stripBankTitlePrefix(ex.title)

  return (
    <aside className="not-prose my-5 overflow-hidden rounded-lg border border-l-4 border-l-rose-500 border-rose-300/60 bg-rose-50/70 shadow-sm dark:border-rose-400/30 dark:bg-rose-400/10">
      <Link
        href={`/practice#exercise:${ex.id}`}
        className="group block px-4 py-3.5 transition-colors hover:bg-rose-100/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:hover:bg-rose-400/15"
      >
        {/* Header strip: «Από τις εξετάσεις» + Flame chip if 2024/2025 */}
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-300">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Από τις εξετάσεις
          </span>
          {isRecent && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-rose-500/60 bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
              title="Πρόσφατο θέμα — υψηλή προτεραιότητα"
            >
              <Flame className="h-2.5 w-2.5" aria-hidden="true" />
              {recentYear}
            </span>
          )}
          {ex.weight != null && (
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-700 dark:text-rose-200">
              {ex.weight}%
            </span>
          )}
        </div>

        {/* Citation line: source date · problem number — title */}
        <p className="mb-1.5 text-[0.95rem] leading-snug text-rose-950 dark:text-rose-100">
          {sourceLabel && (
            <>
              <span className="font-semibold">{sourceLabel}</span>
              {ex.problemNumber && (
                <>
                  {' · '}
                  <span className="font-mono text-[0.875rem]">
                    {ex.problemNumber}
                  </span>
                </>
              )}
              {' — '}
            </>
          )}
          <span className="italic">{displayTitle}</span>
        </p>

        {/* Pattern cue (optional): one-line recognition signal */}
        {pattern && (
          <div className="mb-2 text-sm leading-relaxed text-rose-900/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 dark:text-rose-100/90">
            {pattern}
          </div>
        )}

        {/* CTA — visible affordance that the whole block is a link */}
        <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-rose-700 transition-colors group-hover:text-rose-900 dark:text-rose-300 dark:group-hover:text-rose-100">
          Δες την άσκηση
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    </aside>
  )
}
