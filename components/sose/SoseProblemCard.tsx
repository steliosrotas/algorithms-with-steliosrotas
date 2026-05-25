'use client'

import { useState } from 'react'
import {
  ChevronDown,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Circle,
  Target,
  Radar,
  Flame,
} from 'lucide-react'
import {
  TOPIC_COLORS,
  TOPIC_LABELS,
  DIFFICULTY_LABELS,
  SOURCE_LABELS,
  ORIGIN_LABELS,
  ORIGIN_COLORS,
  RECENT_SOURCES,
} from '@/content/practice/types'
import { useFormulaSheet } from '@/components/practice/formula-sheet-store'
import { SectionComments } from '@/components/layout/SectionComments'
import { SectionCommentsProvider } from '@/components/layout/section-comments-context'
import { SosePrereqLinks } from './SosePrereqLinks'
import { RelatedProblems } from './RelatedProblems'
import type { ProblemPayload } from './SoseClient'

type Props = {
  payload: ProblemPayload
  solved: boolean
  onToggleSolved: () => void
  onJumpTo: (n: number) => void
}

const DIFFICULTY_COLORS = {
  easy: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  medium: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  hard: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

/**
 * The full crunch-mode problem view: header badges, prominent prereq
 * panel, statement, solve toggle, optional Assist + Solution toggles,
 * and (after solve / on-demand) the three coaching sections (Takeaway,
 * Exam radar, Παρόμοιες).
 *
 * Wraps its own `<SectionCommentsProvider slugOverride="practice">` so
 * comments left here share the canonical thread with the regular practice
 * library — both flows write to the same `slug=practice` rows.
 */
export function SoseProblemCard({
  payload,
  solved,
  onToggleSolved,
  onJumpTo,
}: Props) {
  const { exercise, position, coaching, related } = payload
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [coachingOpen, setCoachingOpen] = useState(false)
  const { openWithAssist } = useFormulaSheet()
  const hasFormulaIds = (exercise.formulaIds?.length ?? 0) > 0
  const handleAssist = () =>
    openWithAssist(exercise.formulaIds ?? [], exercise.memorizationNote)

  const hasTakeaway = coaching.takeaway != null
  const hasRadar = coaching.examRadar != null
  const hasAuthoredCoaching = hasTakeaway || hasRadar
  const hasAnyCoaching = hasAuthoredCoaching || related.length > 0

  return (
    <SectionCommentsProvider slugOverride="practice" pageTitleOverride="Practice hub">
      <article
        className={`rounded-xl border bg-bg-elevated shadow-sm transition ${
          solved
            ? 'border-success/50 bg-success/5'
            : 'border-border'
        }`}
      >
        {/* Header row */}
        <header className="flex flex-wrap items-start justify-between gap-3 p-5 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-mono font-bold tabular-nums text-rose-700 dark:text-rose-300">
              #{position}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ORIGIN_COLORS[exercise.origin]}`}
            >
              {exercise.origin === 'past-exam' && (
                <GraduationCap className="mr-1 inline-block h-3 w-3" aria-hidden />
              )}
              {exercise.origin === 'ai-generated' && (
                <Sparkles className="mr-1 inline-block h-3 w-3" aria-hidden />
              )}
              {ORIGIN_LABELS[exercise.origin]}
            </span>
            {exercise.source && (
              <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                {SOURCE_LABELS[exercise.source]}
              </span>
            )}
            {exercise.source && RECENT_SOURCES.has(exercise.source) && (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
                title="Πρόσφατο θέμα — υψηλή προτεραιότητα"
              >
                <Flame className="h-3 w-3" aria-hidden />
                Θέμα Εξετάσεων{' '}
                {exercise.source.endsWith('-2025') ? '2025' : '2024'}
              </span>
            )}
            {exercise.problemNumber && (
              <span className="rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[11px] font-mono font-semibold text-fg-muted">
                {exercise.problemNumber}
              </span>
            )}
            {exercise.weight != null && (
              <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-700 dark:text-rose-300">
                {exercise.weight}%
              </span>
            )}
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TOPIC_COLORS[exercise.topic]}`}
            >
              {TOPIC_LABELS[exercise.topic]}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${DIFFICULTY_COLORS[exercise.difficulty]}`}
            >
              {DIFFICULTY_LABELS[exercise.difficulty]}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleSolved}
            aria-pressed={solved}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              solved
                ? 'border-success/50 bg-success/10 text-success hover:bg-success/15'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg'
            }`}
          >
            {solved ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Λυμένη
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" aria-hidden />
                Σήμανε ως λυμένη
              </>
            )}
          </button>
        </header>

        {/* Title */}
        <h2 className="px-5 pb-3 text-xl font-bold tracking-tight">
          {exercise.title}
        </h2>

        {/* Prereq prompt — the just-in-time learning hook */}
        <div className="px-5 pb-5">
          <SosePrereqLinks
            prerequisites={exercise.prerequisites}
            position={position}
          />
        </div>

        {/* Statement */}
        <div className="border-t border-border px-5 py-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Εκφώνηση
          </h3>
          <div className="prose-content max-w-none text-[15px] leading-relaxed text-fg">
            {exercise.statement}
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap gap-2 border-t border-border bg-bg-soft/40 px-5 py-3">
          <button
            type="button"
            onClick={() => setSolutionOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-accent/50 hover:text-fg"
            aria-expanded={solutionOpen}
          >
            <ChevronDown
              className={`h-4 w-4 transition ${solutionOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
            {solutionOpen ? 'Απόκρυψη λύσης' : 'Δες τη λύση'}
          </button>
          {hasFormulaIds && (
            <button
              type="button"
              onClick={handleAssist}
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:border-amber-500 hover:bg-amber-500/20 dark:text-amber-300"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Assist με τυπολόγιο
            </button>
          )}
          {hasAnyCoaching && (
            <button
              type="button"
              onClick={() => setCoachingOpen((v) => !v)}
              aria-expanded={coachingOpen}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-purple-700 transition hover:border-purple-500 hover:bg-purple-500/20 dark:text-purple-300"
            >
              <ChevronDown
                className={`h-4 w-4 transition ${coachingOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
              {coachingOpen
                ? 'Απόκρυψη coaching'
                : hasAuthoredCoaching
                  ? 'Δες coaching + παρόμοιες'
                  : 'Δες παρόμοιες'}
            </button>
          )}
        </div>

        {solutionOpen && (
          <div className="border-t border-border px-5 py-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Λύση
            </h3>
            <div className="prose-content max-w-none text-[15px] leading-relaxed text-fg">
              {exercise.solution}
            </div>
          </div>
        )}

        {coachingOpen && hasAnyCoaching && (
          <div className="space-y-4 border-t border-border bg-purple-500/[0.02] px-5 py-5">
            {hasTakeaway && (
              <CoachingSection
                Icon={Target}
                title="Τι κρατάς από αυτή την άσκηση"
                colorClass="border-emerald-500/30 bg-emerald-500/5"
                titleColor="text-emerald-700 dark:text-emerald-300"
              >
                {coaching.takeaway}
              </CoachingSection>
            )}
            {hasRadar && (
              <CoachingSection
                Icon={Radar}
                title="Πώς θα το αναγνωρίσεις στην εξέταση"
                colorClass="border-rose-500/30 bg-rose-500/5"
                titleColor="text-rose-700 dark:text-rose-300"
              >
                {coaching.examRadar}
              </CoachingSection>
            )}
            {related.length > 0 && (
              <RelatedProblems related={related} onJumpTo={onJumpTo} />
            )}
            {!hasAuthoredCoaching && (
              <p className="text-xs italic text-fg-subtle">
                Coaching content για αυτή την άσκηση έρχεται σύντομα. Στο
                μεταξύ δες τις παρόμοιες παραπάνω.
              </p>
            )}
          </div>
        )}

        {/* Comments thread — bridged to slug=practice via the provider */}
        <div className="border-t border-border px-5 py-3">
          <SectionComments
            anchor={`exercise:${exercise.id}`}
            sectionTitle={exercise.title}
            className=""
            emptyLabel="Σχόλιο για την άσκηση"
          />
        </div>
      </article>
    </SectionCommentsProvider>
  )
}

function CoachingSection({
  Icon,
  title,
  colorClass,
  titleColor,
  children,
}: {
  Icon: typeof Target
  title: string
  colorClass: string
  titleColor: string
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <h4
        className={`mb-2 flex items-center gap-1.5 text-sm font-semibold ${titleColor}`}
      >
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h4>
      <div className="prose-content max-w-none text-[14px] leading-relaxed text-fg">
        {children}
      </div>
    </div>
  )
}
