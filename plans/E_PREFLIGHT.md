# Phase E — Pre-flight audit

> Mandatory pre-step before E.1 executes. Captures the state of the repo on
> 2026-05-24 with respect to the five surfaces Phase E will touch:
> inline `<ExamProblem>` citations, the prose-vs-pseudocode balance on
> Algorithm blocks, the SOSE flow's 2024/2025 + pattern-pair handling, and
> the transcription queue. The five sub-tasks of § 4 of `PHASE_E_PLAN.md`
> map 1:1 to the five sub-sections below. The findings here drive E.1's
> per-lecture sequencing, gate E.5, and surface the three open questions
> that need a user decision before E.1 lands its first commit.

Snapshot date: **2026-05-24**.
Branch: `algorithms-class-version` (≡ the renamed `feat/site-wide-rollout`
referenced in [[site-wide-rollout]] memory).

---

## 1. Branch & repository state

- **Current branch:** `algorithms-class-version`, tracking `fork/algorithms-class-version`.
- **`origin/main`:** PR #3 was MERGED as commit `d9cef54` after the memory
  was last updated. The 5 commits on the current branch ahead of `origin/main`
  are all post-merge bug-fixes (`7fea886`, `4890bed`, `e9d7685`, `8f4cf15`,
  `c46a587`) — no new content. Memory file [[site-wide-rollout]] needs an
  update reflecting "PR #3 MERGED", which Phase E pre-flight does at the
  end of this commit.
- **No new exam content from `origin/main` since PR #3.** `git log
  origin/main --oneline -20` shows only the merge commit + the same Phase D
  / dark-mode chrome / bug-fix history that already lives on this branch.
  Stelios has not pushed independent exam material since.
- **`material/past_exams/`** — UNTRACKED locally. Contains 4 PDFs:
  - `Algorithms-June-2024.pdf` (304 KB)
  - `Algorithms-September-2024.pdf` (888 KB)
  - `Algorithms-June-2025.pdf` (4.1 MB)
  - `Algorithms-Sep-2025.pdf` (618 KB)
  The directory is not in `.gitignore`. **OPEN QUESTION #1** (see § 6).
- **`private_material/`** — NOT present locally. The directory is git-ignored
  (`.gitignore` rule `/private_material`). E.5 (transcription completion)
  needs these raw PDFs to be uploaded by the user before it can start.
- **Other untracked items** (informational, not Phase E inputs):
  `plans/SP_HANDOFF.md`, `supabase/SETUP.md`, `supabase/setup.sql`.

---

## 2. Inline `<ExamProblem>` audit

**Headline finding: zero inline `<ExamProblem>` usage across all 17 lecture
MDX pages.** Confirmed via `Grep('<ExamProblem', app/(content)/lectures)` —
no matches in any lecture file. The component is registered in
`mdx-components.tsx` (line 217) but is currently dead code on the lecture
side. (`<ExamProblem>` does have prior use **outside** the lecture pages — it
appears in archived SP plans under `/plans/03-signals.md` and similar
historical files. Those are documentation, not live MDX.)

### What the component currently is

`components/content/ExamProblem.tsx` (124 lines). Props:
`year: string, weight?: string, title?: string, id?: string, children`.
Renders a collapsible card with a «Λυμένο» toggle persisted to
`localStorage` via `useAppStore.isExerciseSolved`. NO `relatedExerciseId`,
NO `pattern` prop yet — Phase E.1 must add them.

### Existing parallel pattern (important)

`<ExamRadar>` already exposes a `relatedExerciseIds?: string[]` field that
renders each id as a clickable chip deep-linking to
`/practice#exercise:<id>`. **Phase D wired this on 15 of 17 lectures**:
`Grep('relatedExerciseIds:\s*\[', app/(content)/lectures)` finds **83
references**, with only L05 and L07 (the documented-and-skipped empty
pools) having none. So the deep-link infrastructure is proven in
production; Phase E.1 just needs to bring the same idea to the body-prose
level (one inline chip at the moment a concept first lands) rather than
the radar-aggregation level (a list at the end of a lecture).

`<ExamProblem>` should therefore be extended with the same `relatedExerciseId`
field (singular, since one inline chip cites one bank entry) plus the new
`pattern?: ReactNode` prop that names the recognition cue.

### Per-lecture pool size (the "Παλαιά Θέματα #1–#7" 2024/2025 set)

Computed by `LectureExercises`'s logic — an exercise is counted for the
lecture that is the LATEST among its `prerequisites`. Numbers are the
candidate pool E.1 can draw inline citations from. **"Recent" = anonymized
labels Παλαιό Θέμα #1 through #7**, which the comment in
`content/practice/exercises.tsx:217` confirms are the 2024/2025 papers
(see § 6, Q2).

| Lecture | Total | Recent (#1–#7) | Older past | Frontistirio | Inline-citation density |
|---|---:|---:|---:|---:|---|
| L01 Εισαγωγικά | 5 | 5 | 0 | 0 | rich — 5 recent candidates |
| L02 Ασυμπτωτική | 23 | 9 | 0 | 14 | very rich |
| L03 D&C I | 22 | 8 | 0 | 14 | very rich |
| L04 D&C II | 8 | 1 | 0 | 7 | adequate |
| L05 D&C III | **0** | 0 | 0 | 0 | **empty — skip inline, document** |
| L06 Γραφήματα I | 6 | 2 | 1 | 3 | adequate |
| L07 Γραφήματα II | **1** | 0 | 1 | 0 | **near-empty — skip inline, document** |
| L08 Γραφήματα III | 7 | 0 | 0 | 7 | adequate (frontistirio only) |
| L09 Γραφήματα IV | 16 | 12 | 0 | 4 | very rich |
| L10 Δομές | 3 | 1 | 0 | 2 | thin but feasible |
| L11 Greedy I | 9 | 1 | 0 | 8 | adequate |
| L12 Greedy II | 3 | 2 | 0 | 1 | thin |
| L13 Greedy III | 4 | 1 | 0 | 3 | thin |
| L14 DP I | 10 | 8 | 0 | 2 | very rich |
| L15 DP II | 4 | 4 | 0 | 0 | rich (all recent) |
| L16 DP III | **1** | 0 | 0 | 1 | **near-empty — skip inline, document** |
| L17 DP IV | 19 | 2 | 14 | 3 | very rich (but 14 older are untranscribed — E.5) |

**Recommended E.1 sequencing** (rich-pool lectures first to lock the
component's shape on real material; sparse-pool lectures get a
documented-and-skipped pass):

1. L09 (12 recent · MST / Dijkstra are the most-tested algorithms in the bank)
2. L14 (8 recent · DP opener — sets the template for DP lectures)
3. L02 (9 recent + 14 frontistirio · sets the template for foundational lectures)
4. L03 (8 recent + 14 frontistirio · mergesort / master theorem)
5. L15 (4 recent · knapsack/LCS — every recent paper has a DP question)
6. L01, L04, L06, L08, L10, L11, L12, L13, L17 (one inline citation each)
7. L05, L07, L16 — **documented-and-skipped** (parallels the Phase D
   precedent — pool is too sparse to host a natural inline citation,
   already amply surfaced by the bottom `<LectureExercises>` block)

### Per-lecture natural anchor points (where inline citations belong)

Indicative reading of each lecture's heading structure (from
`Grep('^## ', app/(content)/lectures)`). Each anchor is the section where
the page first teaches the pattern an exam problem tests. E.1's per-lecture
turn finalises the exact line numbers and the chip text.

- **L01** `Εισαγωγικά` — natural anchors: the «Τρεις τύποι πολυπλοκότητας»
  block (line 216) for the asymptotic warm-up exam problems; the
  «Δυαδική αναζήτηση» Algorithm block (line 125) for the L02-warmup exam Θ.1.
- **L02** `Ασυμπτωτική` — primary anchor: «Ο ορισμός — μια μηχανή με δύο
  κουμπιά» (line 89) for the «δείξε ότι f = O(g)»-style problems that
  populate every recent paper.  Secondary: «Δύο σημαντικά αποτελέσματα για
  τους ρυθμούς αύξησης» (line 408) for the limit-ratio exam problems.
- **L03** `D&C I` — anchors at the master-theorem section (line 662) for
  «εφάρμοσε το master theorem» problems; at the Hanoi section (line 601)
  for the «D&C ≠ γρήγορο» trap problems.
- **L04** `D&C II` — single anchor at the Karatsuba section (line 442) —
  Karatsuba is the recent paper's flagship D&C-II problem.
- **L05** — documented-and-skipped (pool empty).
- **L06** `Γραφήματα I` — anchor at «Τι θα ρωτήσουμε — τα προβλήματα των
  L07–L09» (line 291) for modeling problems that disguise graph problems.
- **L07** — documented-and-skipped (pool near-empty).
- **L08** `Γραφήματα III` — anchor at «Ισχυρή συνεκτικότητα» (line 262)
  for the 2-BFS strong-connectivity problems in the frontistirio pool.
- **L09** `Γραφήματα IV` — multiple anchors (use the 1–3 budget):
  «Ο αλγόριθμος Dijkstra» (line 113) for source-shortest-paths;
  «Ο αλγόριθμος του Prim» (line 341) and «Ο αλγόριθμος του Kruskal»
  (line 411) for MST construction; «Prim ή Kruskal;» (line 480) for the
  «which MST algorithm» exam discriminator.
- **L10** `Δομές` — anchor at the union-find section (line 225) — that is
  what the recent paper's L10 problem tests.
- **L11** `Greedy I` — anchor at «Χρονοπρογραμματισμός διαστημάτων»
  (line 70) for interval-scheduling problems; or at «Διαμέριση διαστημάτων»
  (line 191) for partition problems.
- **L12** `Greedy II` — anchor at the «Χρονοπρογραμματισμός με ελάχιστη
  καθυστέρηση» Algorithm block (line 96) for EDF problems.
- **L13** `Greedy III` — anchor at the «Κωδικοποίηση Huffman» Algorithm
  block (line 139).
- **L14** `DP I` — anchor at the «Σταθμισμένος χρονοπρογραμματισμός»
  Algorithm block (line 184) — every recent paper has a WIS-equivalent.
- **L15** `DP II` — anchor at the «0/1 Σακίδιο» Algorithm block (line 134)
  and the «LCS» Algorithm block (line 264).
- **L16** — documented-and-skipped (pool near-empty; the lone frontistirio
  problem is amply surfaced by `<LectureExercises>`).
- **L17** `DP IV` — anchor at the «Ανεξάρτητο σύνολο σε δέντρα» Algorithm
  block (line 96); at «Ο αλγόριθμος Bellman-Ford» Algorithm block
  (line 214); 14 of the older 16 problems here are untranscribed (E.5
  gates inline citation for those — they cannot be cited until they have
  a real bank entry to deep-link to).

---

## 3. Algorithm prose-vs-pseudocode audit

**Headline finding: ZERO `<Pseudocode>` usage anywhere in the codebase** —
not on any lecture MDX, not in any exercise solution.
`Grep('<Pseudocode', app/(content)/lectures)` = 0 matches.
`Grep('<Pseudocode', content/practice/exercises.tsx)` = 0 matches.
The component is registered (`mdx-components.tsx:226`) and the
[[pseudocode-philosophy]] rule says it must stay «παρόν αλλά κλειστό-by-default»
— this is technically satisfied by absence, but **also means the verdict
for Phase E.4's prose-vs-pseudocode question is the same on every lecture:
prose is currently primary by absence of pseudocode**. No Algorithm block
is "pseudocode doing all the work alone" — pseudocode is entirely absent.

### What the actual gap is for E.4

Not prose-leadership (already true). The two missing pieces, per the plan:

1. **No Algorithm block has a `keywords` prop** — the «λέξεις-κλειδιά»
   chip strip that [[pseudocode-philosophy]] calls «το load-bearing πράγμα».
   `RecallCard` exposes `keywords` (and is used at every lecture's
   «Κλείδωσε τη γνώση» section), but the Algorithm block itself does not
   surface the vocabulary at the moment of first teaching.
2. **No Algorithm block has a `nutshell` prop** — the 3-sentence
   memorizable version. `Algorithm` currently has `idea?: string` (a one-
   line italic lead under the title); that is shorter than a nutshell and
   styled as a tag-line, not as a structured 3-sentence anchor.

### Algorithm block catalogue (per lecture, location + name)

Every block currently has its `idea` filled in (the italic one-liner) and
its complexity tag. None has a `<Pseudocode>` child. Total: **35 blocks
across 15 lectures**; L02 and L06 have 0 (by design — those lectures
introduce notation/definitions, not named algorithms).

| Lecture | Algorithm blocks |
|---|---|
| L01 | `Δυαδική αναζήτηση` (line 129) |
| L02 | — |
| L03 | `Bubble sort` (117), `Insertion sort` (136), `Συγχώνευση 2 ταξ. πινάκων` (292), `Mergesort` (328), `Πύργος του Hanoi` (609) |
| L04 | `Μέτρηση αντιστροφών — brute` (155), `merge-and-count` (230), `sort-and-count` (262), `Κυρίαρχο χρώμα — D&C` (383), `Karatsuba` (548) |
| L05 | `Closest-Pair` (190) |
| L06 | — |
| L07 | `DFS` (109), `BFS` (294) |
| L08 | `Συνεκτικές συνιστώσες` (64), `Έλεγχος διμερότητας` (180), `Έλεγχος ισχυρής συνεκτικότητας` (295) |
| L09 | `Dijkstra` (131), `Prim` (345), `Kruskal` (418) |
| L10 | `Heapify-up` (111), `Heapify-down` (137), `Συνεκτικές συνιστώσες με union-find` (247) |
| L11 | `Χρονοπρογραμματισμός διαστημάτων (EFT)` (123), `Διαμέριση διαστημάτων` (221) |
| L12 | `Earliest Deadline First` (96), `Τοπολογική διάταξη` (250) |
| L13 | `Κωδικοποίηση Huffman` (139) |
| L14 | `Σταθμισμένος χρονοπρογραμματισμός (DP)` (184) |
| L15 | `0/1 Σακίδιο` (134), `LCS` (264) |
| L16 | `Ευθυγράμμιση συμβολοσειρών` (149), `Hirschberg` (238) |
| L17 | `Ανεξάρτητο σύνολο μέγιστου βάρους σε δέντρο` (96), `Bellman-Ford` (214) |

**Verdict per block: ✓ prose-first** (every block has prose children + no
pseudocode), **✗ no `keywords` prop, ✗ no `nutshell` prop**. The block-level
verdict is uniform — the E.4 work is the same shape on every Algorithm
block. (Pseudocode-leading regressions are zero; the philosophy-violation
to fear is the *opposite* direction — pseudocode being added later without
nutshell+keywords first.)

### What E.4 needs to do per lecture

1. Extend `<Algorithm>` (`components/content/Algorithm.tsx`) with two new
   optional props: `keywords?: string[]` (chip strip styled like
   `RecallCard.keywords`) and `nutshell?: ReactNode` (a structured
   3-sentence block, distinct from the italic `idea` tag-line).
2. Author both per Algorithm block, lecture-by-lecture. The `RecallCard`
   at the end of each lecture is the source of truth for what the
   keywords/nutshell SHOULD say — copy + tighten.
3. Leave pseudocode absent for now (no regression). If E.4 wants to add
   pseudocode somewhere, it must be collapsed-by-default per
   [[pseudocode-philosophy]] — and only after nutshell+keywords are in
   place above it.

---

## 4. SOSE flow audit

Files read in full: `app/practice/sose-to-eksamino/page.tsx` (54 lines),
`lib/sose.ts` (239 lines), `components/sose/SoseClient.tsx`,
`components/sose/SoseLanding.tsx`, `components/sose/SoseProblemCard.tsx`.

### Current SOSE_PATH ordering

`SOSE_PATH` (`lib/sose.ts:79`) sorts every exercise by:
1. `theoryDepth(prerequisites)` ascending — exercises whose latest
   prerequisite is earliest in the syllabus come first. Empty
   `prerequisites: []` → depth `-1` (warm-ups sort to the front).
2. `difficulty` ascending — easy → medium → hard.
3. `origin` ascending — past-exam → frontistirio → lecture → ai-generated.
4. `id.localeCompare` (deterministic tie-break).

**This means 2024/2025 problems are NOT prioritised at any tier**. The
sort tiebreak on `origin` puts past-exam before frontistirio inside the
same theory-depth + difficulty bucket, but that's the existing behaviour
— not an explicit 2024/2025 lift. **`RECENT_SOURCES` is never referenced
in `lib/sose.ts` or in any of the `components/sose/*.tsx` files.**

### Recency surface in SoseProblemCard

`SoseProblemCard` (`components/sose/SoseProblemCard.tsx`) does NOT badge
recent problems. It renders the `origin` chip, the `paperLabel` chip, the
`source` chip if present, plus topic/difficulty/weight. But the
2024/2025 priority badge (the «Θέμα Εξετάσεων 2024/2025» Flame chip
defined in `ExerciseCard.tsx:92`) is NOT rendered in SOSE. Even if it
were, every recent paper in the bank has `paperLabel: 'Παλαιό Θέμα #N'`
and no `source` field, so the `RECENT_SOURCES.has(exercise.source)` guard
in `ExerciseCard.tsx` is dead code right now — see § 6 Q2.

### Pattern pairs — surfacing

`coachingFor` / `ExerciseCoaching` (`content/practice/types.ts:209`) has
three optional fields: `takeaway`, `examRadar`, `relatedIds`. The
`relatedIds` field is what manually-curated pattern-pair links go in
TODAY — and `findRelated` (`lib/sose.ts:118`) auto-derives a fall-back list
by prereq-overlap + same-difficulty if no override is set. **There is no
distinct «πρότυπο σκέψης / ίδια άσκηση, άλλο όνομα» annotation** — every
related-problem link is just a generic "Παρόμοιες" item in the coaching
panel, with no separation between "related-by-prereq" and "isomorphic
pattern in different cover-story". E.3's `<RelatedPair>` component is
genuinely net-new surfacing, not a re-styling of an existing one.

### Pattern catalogue («πρότυπα σκέψης» tab) — not present

The SOSE flow has no entry point to a cross-problem pattern catalogue
today. SoseLanding's hero is the just-in-time pitch + CTA only. E.6's
«πρότυπα σκέψης» tab is net-new.

### Keyword vocabulary in coaching

The coaching panel renders `takeaway` (Target icon) and `examRadar`
(Radar icon) as full prose blocks. **There is no chip-strip rendering of
Algorithm keywords on demand** — the keywords don't exist on Algorithm
blocks yet (gated by E.4), and even once they do, surfacing them in SOSE
requires authoring a per-problem mapping (problem → which Algorithm's
keyword strip to render). E.6 builds this.

### Verdict on SOSE flow for Phase E

- 2024/2025 prioritisation: **not implemented anywhere** — neither in
  `SOSE_PATH` ordering nor in `SoseProblemCard`'s rendering.
- Pattern-pair surfacing: **not implemented** — generic "Παρόμοιες" only.
- Keyword-strip on demand: **not implemented** — Algorithm has no
  keywords prop yet (gated by E.4).
- Pattern catalogue tab: **not present** — net-new for E.6.

E.6's scope is therefore: (a) re-weight `SOSE_PATH` to lift 2024/2025
problems by ~one rank without breaking the just-in-time theory-progression
core (probably as the first tiebreak under `theoryDepth`); (b) render the
Flame chip on `SoseProblemCard` for entries in the 2024/2025 set; (c) bolt
`<RelatedPair>` into the coaching panel; (d) add a keyword-strip toggle
that pulls from the Algorithm-block keyword authoring; (e) add a
«πρότυπα σκέψης» tab populated from `plans/E_PATTERN_PAIRS.md`.

---

## 5. Transcription queue (E.5 backlog)

`Grep('statement:\s*null', content/practice/exercises.tsx) = 21`.
Per-entry details (id · paperLabel · topic · difficulty · target lectures):

### Frontistirio (5 entries)

| id | paperLabel | topic | diff | target lectures |
|---|---|---|---|---|
| `frontistirio-f10`  | Φροντιστηριακό Σετ #9  | dp              | hard   | L14, L15, L16, L17 |
| `frontistirio-f11`  | Φροντιστηριακό Σετ #10 | dp              | hard   | ALL_LECTURES |
| `frontistirio-old-1`| Φροντιστηριακό Σετ #11 | asymptotics     | easy   | L01, L02 |
| `frontistirio-old-2`| Φροντιστηριακό Σετ #12 | divide-conquer  | medium | L03, L04 |
| `frontistirio-old-3`| Φροντιστηριακό Σετ #13 | graphs          | medium | L06, L07, L08 |

### Past-exam (16 entries)

| id | paperLabel | topic | diff | target lectures |
|---|---|---|---|---|
| `exam-sept-2022`    | Παλαιό Θέμα #8  | graphs         | hard | ALL_LECTURES |
| `exam-june-2021`    | Παλαιό Θέμα #9  | dp             | hard | ALL_LECTURES |
| `exam-sept-2020`    | Παλαιό Θέμα #10 | graphs         | hard | ALL_LECTURES |
| `exam-distance-2020`| Παλαιό Θέμα #11 | graphs         | hard | ALL_LECTURES |
| `exam-feb-2019`     | Παλαιό Θέμα #12 | graphs         | hard | ALL_LECTURES |
| `exam-june-2018`    | Παλαιό Θέμα #13 | greedy         | hard | ALL_LECTURES |
| `exam-sept-2017`    | Παλαιό Θέμα #14 | greedy         | hard | ALL_LECTURES |
| `exam-feb-2017`     | Παλαιό Θέμα #15 | graphs         | hard | ALL_LECTURES |
| `exam-june-2016`    | Παλαιό Θέμα #16 | dp             | hard | ALL_LECTURES |
| `exam-feb-2016`     | Παλαιό Θέμα #17 | graphs         | hard | ALL_LECTURES |
| `exam-june-2015`    | Παλαιό Θέμα #18 | graphs         | hard | ALL_LECTURES |
| `exam-midterm-2012` | Παλαιό Θέμα #19 | divide-conquer | medium | L01–L07 |
| `exam-sept-2011`    | Παλαιό Θέμα #20 | dp             | hard | ALL_LECTURES |
| `exam-june-2011`    | Παλαιό Θέμα #21 | graphs         | hard | ALL_LECTURES |
| `exam-june-2010`    | Παλαιό Θέμα #22 | greedy         | hard | ALL_LECTURES |
| `exam-midterm-2008` | Παλαιό Θέμα #23 | divide-conquer | medium | L01–L06 |

### Blocker on E.5

The raw source files for the past-exam entries are scanned PDFs/images
that live in `private_material/oldtests/` (and the frontistirio decks in
`private_material/inclass/`). **Neither directory exists on this machine.**
The .gitignore policy (`/private_material`) keeps them local-only by
design — see [[pr-workflow]] and `plans/EXAM_TRANSCRIPTION.md`. **E.5
cannot start until the user uploads `private_material/` to this work
tree.** Three options for the user (§ 6 Q3): upload all 21, upload a
subset by priority, or skip E.5 for this Phase E and revisit later.

The 4 PDFs in `material/past_exams/` are the 2024/2025 papers, which are
ALREADY transcribed (split across «Παλαιά Θέματα #1–#7»). They do not
contribute to E.5's backlog.

---

## 6. Open questions for the user — ANSWERED 2026-05-24

### Q1 — `material/past_exams/` tracking policy

> **ANSWER: (a) Commit them.** Done in commit `f516ec3` («chore(past-exams):
> commit the public 2024/2025 papers»). The 4 PDFs are now tracked.

The 4 PDFs are publicly downloadable from the K17 course site and would
make the lecture-page inline citations resolvable without the user having
to ship them out-of-band.

- **(a) Commit them.** ← chosen
- (b) Ignore them like `private_material/`.
- (c) Leave as-is, untracked.

### Q2 — Inline-citation chip text: anonymized vs dated

> **ANSWER: De-anonymize site-wide, not just for inline citations.**
> User: «it should not be anonymous it should tell them exactly from where
> it is, no need to keep anything private from students». The chip text
> will read «Ιούνιος 2024 · Θ.3» (or equivalent for each date). The bank
> migrates from `paperLabel: 'Παλαιό Θέμα #N'` to `source: 'june-2024'`
> etc. — task **E.0** below. `RECENT_SOURCES.has(ex.source)` (currently
> dead code) starts firing for the #1–#7 entries automatically.

CLAUDE.md says «2024 / 2025 past-exam problems are tagged with a
prominent badge (`Θέμα Εξετάσεων 2024`, `Θέμα Εξετάσεων 2025`)». The plan
mock-up suggests «Θέμα Εξετάσεων Ιουνίου 2024 — Θ.3 [Δες την άσκηση →]».
The previous bank used anonymized labels; that policy is now dropped.

- **(a) De-anonymize.** ← chosen, extended bank-wide
- (b) Stay fully anonymized.
- (c) Anonymized label + a non-dated «recent» flame badge.

### Q3 — E.5 transcription scope (and `private_material/` policy)

> **ANSWER: Un-gitignore `private_material/` entirely.** User: «Un-gitignore
> everything». The `.gitignore` rule that hid `/private_material` was
> removed. The raw older Ζησιμόπουλος archive PDFs will be tracked once
> the user uploads them to this work tree. E.5 (transcription completion)
> can then proceed without local-only constraints.

- (a) Upload all 21 raw entries.
- (b) Upload a priority subset.
- (c) Defer E.5 to a follow-up phase.
- **(b/extension) Un-gitignore everything; user uploads PDFs at their
  cadence.** ← chosen — E.5 scope still depends on what gets uploaded.

---

## 7. Pre-flight code-change decisions

### `ExamTranscriptionNotice` component

Per the plan note (§ 4 of `PHASE_E_PLAN.md`, "Pre-flight code change"):
the per-card render of `<ExamTranscriptionNotice />` was removed from
`ExerciseCard.tsx` on 2026-05-24 (commit `c46a587`). The component file
at `components/content/ExamTranscriptionNotice.tsx` is left in place but
unrendered.

Three options (per plan note): (a) leave as-is, (b) mount a single
discreet notice on `/practice`, (c) delete the component file entirely.

**Recommendation: (a) leave as-is for now**, decide in E.7's integration
sweep. Mounting a single notice on `/practice` would be one line of MDX,
deletable in seconds; deleting the file now forecloses option (b). The
component does no harm sitting in the tree unrendered.

### Memory updates done by this pre-flight commit

- **[[site-wide-rollout]]** — flip the open-PR status: «PR #3 was MERGED
  on 2026-05-?? as commit `d9cef54` into `origin/main`; the branch was
  renamed to `algorithms-class-version`. Phase E work continues on the
  same branch ahead of `origin/main`.»
- **`phase-e-preflight.md`** (new memory file) — records this pre-flight
  was done and points to `plans/E_PREFLIGHT.md`.

---

## 8. Open commitments created by this pre-flight

None. This document is research + documentation; no behaviour change.

---

## 9. Next task — E.0 (bank de-anonymization), then E.1.0 (component extension)

With Q1+Q2+Q3 answered, two preparatory tasks precede the per-lecture E.1
passes. **They land in this order:**

### Step 1 — Task E.0 — Bank de-anonymization migration

Full spec in `PHASE_E_PLAN.md` § 4.5 (added in the policy-update commit).
TL;DR: refactor `content/practice/exercises.tsx` to drop
`paperLabel: 'Παλαιό Θέμα #N'` in favor of dated `source: 'june-2024'`
etc.; update the ~4 components that read `paperLabel`; verify the
`RECENT_SOURCES`-based Flame chip fires for #1–#7 entries; surface the
same Flame chip on `SoseProblemCard`. Single self-contained turn.

### Step 2 — Task E.1.0 — `<ExamProblem>` component extension

Once E.0 lands and the bank is dated:

1. Extend `<ExamProblem>` (`components/content/ExamProblem.tsx`) with:
   - `relatedExerciseId?: string` — the bank id the chip deep-links to.
   - `pattern?: ReactNode` — the recognition cue, one sentence.
   - A compact "chip" rendering mode (current full-card stays as the
     default for back-compat, opt-in via `display="chip"` or by passing
     `relatedExerciseId` to switch).
2. Wire the chip to `/practice#exercise:<relatedExerciseId>` (the anchor
   `ExerciseCard` already sets — see `ExerciseCard.tsx:61`).
3. Chip text uses the date from `SOURCE_LABELS[ex.source]` (now reliable
   after E.0).
4. Add to mdx-components.tsx as needed (already registered).
5. typecheck + lint + build (the user's [[local-build-env]] rule applies:
   no `npm run build` while `npm run dev` runs).
6. Commit as `feat(exam-problem): add inline citation chip mode for E.1`.

### Step 3 onwards — Per-lecture E.1 passes

L09 (rich pool, highest-tested algorithms) → L14 → L02 → L03 → L15 → L01
→ L04 → L06 → L08 → L10 → L11 → L12 → L13 → L17. L05, L07, L16 documented-
and-skipped per the Phase D precedent.
