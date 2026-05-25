'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  GraduationCap,
  Search,
  Sparkles,
  BookOpen,
  Layers,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import type { Exercise, Topic, Origin } from '@/content/practice/types'
import { TopicFilter } from './TopicFilter'
import { ExerciseCard, PRACTICE_SOLVED_PREFIX } from './ExerciseCard'
import { useAppStore } from '@/lib/store'

type Props = {
  exercises: Exercise[]
}

type OriginFilter = 'all' | Origin

export function ExerciseLibrary({ exercises }: Props) {
  const [topics, setTopics] = useState<Set<Topic>>(new Set())
  const [originFilter, setOriginFilter] = useState<OriginFilter>('past-exam')
  const [unsolvedOnly, setUnsolvedOnly] = useState(false)

  // Solved state — drives both the "Άλυτα μόνο" filter and the summary chip
  const hydrated = useAppStore((s) => s.hydrated)
  const solvedSet = useAppStore((s) => s.solvedExercises)
  const isSolved = (id: string) =>
    hydrated && solvedSet.has(`${PRACTICE_SOLVED_PREFIX}:${id}`)

  // Deep links to `/practice#exercise:<id>` come from <ExamRadar> badges,
  // SOSE coaching panels, and cross-references inside problem solutions.
  // The default origin filter is 'past-exam', so any frontistirio or lecture
  // exercise linked from one of those badges would be hidden, the anchor
  // target would not exist in the DOM, and the browser's native
  // scroll-to-anchor would silently do nothing. Clear ALL filters when a
  // `#exercise:<id>` hash is present, then programmatically scroll once the
  // filtered list has re-rendered.
  useEffect(() => {
    const applyHashTarget = () => {
      if (typeof window === 'undefined') return
      const hash = window.location.hash
      if (!hash.startsWith('#exercise:')) return
      const targetId = decodeURIComponent(hash.slice('#exercise:'.length))
      if (!targetId) return
      setOriginFilter('all')
      setTopics(new Set())
      setUnsolvedOnly(false)
      // Two rAFs: first to let React commit the filter changes, second to
      // wait for the layout pass that paints the newly-visible card.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(`exercise:${targetId}`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
    }
    applyHashTarget()
    window.addEventListener('hashchange', applyHashTarget)
    return () => window.removeEventListener('hashchange', applyHashTarget)
  }, [])

  const handleTopicToggle = (t: Topic) => {
    setTopics((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  // Topic counts for the filter chips
  const topicCounts = useMemo(() => {
    const c: Partial<Record<Topic, number>> = {}
    for (const ex of exercises) c[ex.topic] = (c[ex.topic] ?? 0) + 1
    return c
  }, [exercises])

  // Origin counts
  const originCounts = useMemo(() => {
    const c: Partial<Record<Origin, number>> = {}
    for (const ex of exercises) c[ex.origin] = (c[ex.origin] ?? 0) + 1
    return c
  }, [exercises])

  // Filter (excluding solved-state — applied separately so we can compute
  // accurate solved counts within the current scope)
  const inScope = useMemo(() => {
    return exercises.filter((ex) => {
      if (topics.size > 0 && !topics.has(ex.topic)) return false
      if (originFilter !== 'all' && ex.origin !== originFilter) return false
      return true
    })
  }, [exercises, topics, originFilter])

  const solvedInScope = useMemo(
    () => inScope.filter((ex) => isSolved(ex.id)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inScope, hydrated, solvedSet],
  )

  const filtered = useMemo(() => {
    if (!unsolvedOnly) return inScope
    return inScope.filter((ex) => !isSolved(ex.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inScope, unsolvedOnly, hydrated, solvedSet])

  // Sort: past-exams first, sorted by recent year, then by problem number;
  // lectures and ai-generated below
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const orderRank = (o: Origin) =>
        o === 'past-exam' ? 0 : o === 'lecture' ? 1 : 2
      const ra = orderRank(a.origin)
      const rb = orderRank(b.origin)
      if (ra !== rb) return ra - rb
      // Within the same origin, group by source (dated paper), then by the
      // printed problem number. Sources are kebab-case slugs like
      // 'june-2025'; ordering them lexically gives a stable, semester-aware
      // grouping (june-2024 < june-2025 < sept-2024 < sept-2025).
      const la = a.source ?? ''
      const lb = b.source ?? ''
      if (la !== lb) return la.localeCompare(lb, 'en')
      return (a.problemNumber ?? '').localeCompare(b.problemNumber ?? '', 'el')
    })
  }, [filtered])

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
          <Search className="h-4 w-4 text-fg-muted" aria-hidden />
          Φίλτρα
        </div>
        <div className="space-y-3">
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-fg-subtle">
              Πηγή
            </div>
            <div className="flex flex-wrap gap-2">
              <OriginChip
                active={originFilter === 'past-exam'}
                onClick={() => setOriginFilter('past-exam')}
                label={`Παλαιά θέματα (${originCounts['past-exam'] ?? 0})`}
                icon={<GraduationCap className="h-3 w-3" />}
                color="purple"
              />
              <OriginChip
                active={originFilter === 'lecture'}
                onClick={() => setOriginFilter('lecture')}
                label={`Από διαλέξεις (${originCounts.lecture ?? 0})`}
                icon={<BookOpen className="h-3 w-3" />}
                color="blue"
              />
              <OriginChip
                active={originFilter === 'ai-generated'}
                onClick={() => setOriginFilter('ai-generated')}
                label={`AI παραλλαγές (${originCounts['ai-generated'] ?? 0})`}
                icon={<Sparkles className="h-3 w-3" />}
                color="yellow"
              />
              <OriginChip
                active={originFilter === 'all'}
                onClick={() => setOriginFilter('all')}
                label={`Όλες (${exercises.length})`}
                icon={<Layers className="h-3 w-3" />}
                color="neutral"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-fg-subtle">
              Topic
            </div>
            <TopicFilter
              selected={topics}
              onChange={handleTopicToggle}
              onClear={() => setTopics(new Set())}
              counts={topicCounts}
            />
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-fg-subtle">
              Πρόοδος
            </div>
            <button
              type="button"
              onClick={() => setUnsolvedOnly((v) => !v)}
              aria-pressed={unsolvedOnly}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                unsolvedOnly
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              <Circle className="h-3 w-3" aria-hidden />
              Άλυτα μόνο
            </button>
          </div>
        </div>
      </div>

      {/* Summary + result count */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-fg-muted">
        <div>
          Δείχνει{' '}
          <span className="font-semibold text-fg tabular-nums">{sorted.length}</span>{' '}
          από <span className="tabular-nums">{exercises.length}</span> ασκήσεις.
        </div>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
            inScope.length > 0 && solvedInScope === inScope.length
              ? 'border-success/50 bg-success/10 text-success'
              : 'border-border bg-bg-elevated text-fg-muted'
          }`}
          aria-live="polite"
        >
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          <span>
            <strong className="tabular-nums">{solvedInScope}</strong>{' '}
            <span className="tabular-nums">/ {inScope.length}</span> λυμένα
            {inScope.length !== exercises.length && (
              <span className="ml-1 text-fg-subtle">(στα φίλτρα)</span>
            )}
          </span>
        </div>
      </div>

      {/* Exercise list */}
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-bg-soft/50 p-8 text-center text-sm text-fg-muted">
          Καμία άσκηση δεν ταιριάζει στα τρέχοντα φίλτρα.
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  )
}

function OriginChip({
  active,
  onClick,
  label,
  icon,
  color,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
  color: 'purple' | 'blue' | 'yellow' | 'neutral'
}) {
  const colorClass = active
    ? color === 'purple'
      ? 'border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300'
      : color === 'blue'
        ? 'border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300'
        : color === 'yellow'
          ? 'border-yellow-500 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300'
          : 'border-accent bg-accent text-white'
    : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${colorClass}`}
    >
      {icon}
      {label}
    </button>
  )
}
