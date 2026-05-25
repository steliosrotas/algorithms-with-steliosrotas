/**
 * Shared types for practice exercises and quiz questions.
 *
 * These are the canonical taxonomies used by the topic filter and the
 * "go read this lecture" cross-links.
 */

import type { ReactNode } from 'react'

export type Topic =
  | 'intro'
  | 'asymptotics'
  | 'divide-conquer'
  | 'graphs'
  | 'data-structures'
  | 'greedy'
  | 'dp'

export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * Where an exercise comes from. Past-exam problems are the most valuable —
 * the UI prioritises them and tags 2024/2025 with a year badge.
 */
export type Origin =
  | 'past-exam'
  | 'frontistirio'
  | 'lecture'
  | 'ai-generated'

/**
 * Year/source tag for past-exam-derived problems. `undefined` means the
 * exercise is from the lecture deck or a frontistirio.
 *
 * Naming convention: `{semester}-{year}` where semester is `june` (Α
 * εξεταστική), `sept` (Β/επανάληψη), or `midterm` (πρόοδος).
 */
export type ExamSource =
  | 'june-2025'
  | 'sept-2025'
  | 'june-2024'
  | 'sept-2024'
  | 'june-2023'
  | 'sept-2023'
  | 'june-2022'
  | 'sept-2022'
  | 'june-2021'
  | 'sept-2020'
  | 'feb-2019'
  | 'june-2018'
  | 'sept-2018'
  | 'feb-2017'
  | 'sept-2017'
  | 'feb-2016'
  | 'june-2016'
  | 'june-2015'
  | 'midterm-2012'
  | 'june-2011'
  | 'sept-2011'
  | 'june-2010'
  | 'midterm-2008'
  | 'distance-2020'
  | 'frontistirio-2023-24'
  | 'frontistirio-misc'

export const TOPIC_LABELS: Record<Topic, string> = {
  intro: 'Εισαγωγικά',
  asymptotics: 'Ασυμπτωτική ανάλυση',
  'divide-conquer': 'Διαίρει & κυρίευε',
  graphs: 'Γραφήματα',
  'data-structures': 'Δομές δεδομένων',
  greedy: 'Άπληστοι αλγόριθμοι',
  dp: 'Δυναμικός προγραμματισμός',
}

export const TOPIC_COLORS: Record<Topic, string> = {
  intro: 'border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300',
  asymptotics: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  'divide-conquer': 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  graphs: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  'data-structures': 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  greedy: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  dp: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Εύκολο',
  medium: 'Μέτριο',
  hard: 'Δύσκολο',
}

export const SOURCE_LABELS: Record<ExamSource, string> = {
  'june-2025': 'Ιούνιος 2025',
  'sept-2025': 'Σεπτέμβριος 2025',
  'june-2024': 'Ιούνιος 2024',
  'sept-2024': 'Σεπτέμβριος 2024',
  'june-2023': 'Ιούνιος 2023',
  'sept-2023': 'Σεπτέμβριος 2023',
  'june-2022': 'Ιούνιος 2022',
  'sept-2022': 'Σεπτέμβριος 2022',
  'june-2021': 'Ιούνιος 2021',
  'sept-2020': 'Σεπτέμβριος 2020',
  'feb-2019': 'Φεβρουάριος 2019',
  'june-2018': 'Ιούνιος 2018',
  'sept-2018': 'Σεπτέμβριος 2018',
  'feb-2017': 'Φεβρουάριος 2017',
  'sept-2017': 'Σεπτέμβριος 2017',
  'feb-2016': 'Φεβρουάριος 2016',
  'june-2016': 'Ιούνιος 2016',
  'june-2015': 'Ιούνιος 2015',
  'midterm-2012': 'Πρόοδος 2012',
  'june-2011': 'Ιούνιος 2011',
  'sept-2011': 'Σεπτέμβριος 2011',
  'june-2010': 'Ιούνιος 2010',
  'midterm-2008': 'Πρόοδος 2008',
  'distance-2020': 'Εξ αποστάσεως 2020',
  'frontistirio-2023-24': 'Φροντιστήριο 2023–24',
  'frontistirio-misc': 'Φροντιστήριο',
}

/**
 * Whether this exam source counts as a "recent priority" badge.
 * The UI highlights these with a coloured 2024/2025 chip.
 */
export const RECENT_SOURCES = new Set<ExamSource>([
  'june-2025',
  'sept-2025',
  'june-2024',
  'sept-2024',
])

export const ORIGIN_LABELS: Record<Origin, string> = {
  'past-exam': 'Παλαιό θέμα',
  frontistirio: 'Από φροντιστήριο',
  lecture: 'Από διαλέξεις',
  'ai-generated': 'AI-generated παραλλαγή',
}

export const ORIGIN_COLORS: Record<Origin, string> = {
  'past-exam': 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  frontistirio: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  lecture: 'border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'ai-generated': 'border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
}

/**
 * A worked exercise — statement + step-by-step solution.
 *
 * For algorithms exercises sourced from scanned PDFs/JPGs, `statement` and
 * `solution` are `null` and the UI renders an "Άνοιξε το πρωτότυπο" link
 * to `sourceFile` instead. Transcription happens lecture-by-lecture as we
 * move through the syllabus.
 */
export type Exercise = {
  id: string
  title: string
  topic: Topic
  origin: Origin
  source?: ExamSource
  /** Problem label as printed on the original, e.g. "ΘΕΜΑ 1", "Άσκηση 2β". */
  problemNumber?: string
  /** Weight on the exam, e.g. 25 for "25%". May be undefined if the original doesn't state it. */
  weight?: number
  difficulty: Difficulty
  /** Section slugs the reader needs to know (renders as chips with deep links). */
  prerequisites: string[]
  /**
   * IDs of cheat-sheet entries that are needed to solve this. Used by the
   * assist toggle to highlight relevant entries in the slide-out panel.
   */
  formulaIds?: string[]
  /**
   * When the assist toggle is on and the problem needs something that's
   * NOT in the cheat sheet, this note nudges the student to memorize it.
   */
  memorizationNote?: ReactNode
  /**
   * Original-source file path under /public/material/. UI shows this as
   * "Άνοιξε το πρωτότυπο PDF/εικόνα" — non-negotiable fallback for
   * problems we haven't transcribed yet.
   */
  sourceFile?: string
  /**
   * The problem statement. `null` when not yet transcribed (the UI then
   * falls back to the sourceFile link).
   */
  statement: ReactNode | null
  /**
   * The worked solution. `null` when not yet authored.
   */
  solution: ReactNode | null
}

/**
 * Per-exercise coaching that powers the «Σώσε το εξάμηνο» (crunch) flow.
 *
 * - `takeaway`: durable pattern to walk away with — NOT a restatement of
 *   the solution.
 * - `examRadar`: recognition cues. «Αν δεις X στην εκφώνηση, σκέψου Y.»
 * - `relatedIds`: optional override of the auto-derived "παρόμοιες" list.
 */
export type ExerciseCoaching = {
  takeaway?: ReactNode
  examRadar?: ReactNode
  relatedIds?: string[]
}

/**
 * A T/F or MCQ question for the quiz modes.
 */
export type QuizQuestion =
  | {
      id: string
      type: 'true-false'
      topic: Topic
      difficulty: Difficulty
      source?: ExamSource
      prerequisites: string[]
      question: ReactNode
      correctAnswer: boolean
      explanation: ReactNode
    }
  | {
      id: string
      type: 'multiple-choice'
      topic: Topic
      difficulty: Difficulty
      source?: ExamSource
      prerequisites: string[]
      question: ReactNode
      choices: ReactNode[]
      correctAnswer: number
      explanation: ReactNode
    }

/**
 * Section slug → human-readable title + URL. Used by the prerequisite
 * chips so we render "L06 · Γραφήματα I" instead of "lectures/L06-graphs-i".
 *
 * Kept in sync with content/sections.ts. When you add a lecture there,
 * add its slug here.
 */
export const SECTION_TITLES: Record<string, string> = {
  'lectures/L01-eisagogika': 'L01 · Εισαγωγικά',
  'lectures/L02-asymptotic-analysis': 'L02 · Ασυμπτωτική ανάλυση',
  'lectures/L03-divide-and-conquer-i': 'L03 · D&C I (mergesort, master)',
  'lectures/L04-divide-and-conquer-ii': 'L04 · D&C II (inversions, multiplication)',
  'lectures/L05-divide-and-conquer-iii': 'L05 · D&C III (closest pair)',
  'lectures/L06-graphs-i': 'L06 · Γραφήματα I (BFS)',
  'lectures/L07-graphs-ii': 'L07 · Γραφήματα II (DFS, topo, SCC)',
  'lectures/L08-graphs-iii': 'L08 · Γραφήματα III (shortest paths)',
  'lectures/L09-graphs-iv': 'L09 · Γραφήματα IV (MST)',
  'lectures/L10-data-structures': 'L10 · Δομές δεδομένων',
  'lectures/L11-greedy-i': 'L11 · Greedy I (interval scheduling)',
  'lectures/L12-greedy-ii': 'L12 · Greedy II (lateness, topo sort)',
  'lectures/L13-greedy-iii': 'L13 · Greedy III (Huffman)',
  'lectures/L14-dp-i': 'L14 · DP I',
  'lectures/L15-dp-ii': 'L15 · DP II (knapsack)',
  'lectures/L16-dp-iii': 'L16 · DP III (LCS, edit distance)',
  'lectures/L17-dp-iv': 'L17 · DP IV (DP on graphs)',
}
