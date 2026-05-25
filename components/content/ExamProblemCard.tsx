'use client'

import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, GraduationCap, CheckCircle2, Circle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = {
  year: string
  weight?: string
  title?: string
  /**
   * Stable per-page identifier. Used as part of the localStorage key for the
   * "solved" toggle. If omitted we fall back to a hash of year+weight, which
   * is fine when those props are unique within a page.
   */
  id?: string
  children: ReactNode
}

/**
 * Legacy full-card mode of `<ExamProblem>` — kept for back-compat with the
 * children-based authoring pattern. New Phase E inline citations should use
 * the chip mode of `<ExamProblem>` (see `./ExamProblem.tsx`) which is a
 * server component and deep-links to the practice bank instead of inlining
 * the statement + solution.
 */
export function ExamProblemCard({
  year,
  weight,
  title = 'Θέμα εξετάσεων',
  id,
  children,
}: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() ?? ''
  // Strip leading slash to get a stable slug-like prefix.
  const slug = pathname.replace(/^\//, '')
  const fallbackId = `${year}|${weight ?? ''}`
  const storageKey = `${slug}:${id ?? fallbackId}`

  const hydrated = useAppStore((s) => s.hydrated)
  const isSolved = useAppStore((s) => s.isExerciseSolved)
  const toggleSolved = useAppStore((s) => s.toggleSolvedExercise)
  const solved = hydrated && isSolved(storageKey)

  return (
    <section
      className={cn(
        'my-6 overflow-hidden rounded-lg border bg-accent-soft/20 transition-colors',
        solved ? 'border-success/50 bg-success/5' : 'border-accent/40',
      )}
    >
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-accent-soft/40"
          aria-expanded={open}
        >
          <GraduationCap
            className={cn(
              'h-4 w-4 shrink-0',
              solved ? 'text-success' : 'text-accent',
            )}
            aria-hidden="true"
          />
          <span className="flex-1 text-sm font-semibold tracking-tight">
            {title} — {year}
            {weight && (
              <span className="ml-2 rounded-full bg-bg-elevated px-2 py-0.5 text-xs font-normal text-fg-muted">
                {weight}
              </span>
            )}
          </span>
          <span className="text-xs text-fg-muted">{open ? 'Κρύψε' : 'Δες'}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-fg-muted transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleSolved(storageKey)
          }}
          className={cn(
            'mr-3 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors',
            solved
              ? 'border-success/50 bg-success/10 text-success hover:bg-success/15'
              : 'border-border bg-bg-elevated text-fg-muted hover:border-accent/50 hover:text-fg',
          )}
          aria-pressed={solved}
          title={solved ? 'Σήμανε ως άλυτο' : 'Σήμανε ως λυμένο'}
        >
          {solved ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Λυμένο
            </>
          ) : (
            <>
              <Circle className="h-3.5 w-3.5" aria-hidden="true" />
              Άλυτο
            </>
          )}
        </button>
      </div>
      {open && (
        <div className="animate-fade-in border-t border-accent/30 bg-bg px-4 py-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </section>
  )
}
