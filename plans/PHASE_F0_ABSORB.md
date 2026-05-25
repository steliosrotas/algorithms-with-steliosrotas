# Phase F.0 — Absorb Stelios's PR #4 transcriptions

> Created 2026-05-25 during the merge of `origin/main` into
> `algorithms-class-version`. The merge auto-resolved 28 of Stelios's
> transcribed entries into our bank but **~70 more entries** were on
> his side of conflict regions and the resolver preferred ours
> (preserving [[phase-e0-bank-dedeanonymization]] + Phase D quality
> pass). Those entries are recoverable from `origin/main`.

## Why this is a separate phase, not done in the merge

Stelios's transcriptions are **functional and valuable** (they fill in
~70 past-exam problems we don't yet have content for) but they were
authored before our Phase D problem-rework standard. They:

- Use the old `paperLabel: 'Παλαιό Θέμα #N'` format (would break our
  `Exercise` type as-is — needs translation to dated `source:`).
- Use the old title pattern `'Παλαιό Θέμα #N · Θέμα X — …'` (needs
  translation to `'<SourceLabel> · Θέμα X — …'`).
- Often present the algorithm in a single block of prose, without the
  [[lecture-rework-standard]] structure: intuition-first, keyword chips,
  ThinkingPattern callouts, ExamRadar wiring, RecallCard memorisation
  hooks, interactive vizzes where a concept can click.
- Don't carry the [[pseudocode-philosophy]] rule (natural-language
  primary, pseudocode collapsed-by-default).

Bringing them in *as-is* would give us coverage but dilute the bank's
quality bar. The user's call (2026-05-25): «I dont want to rush them,
maybe schedule then within the plan to cover them later».

## Recovery — how to retrieve a deferred entry

Each entry exists verbatim on `origin/main`. To recover one:

```bash
# 1. Find Stelios's version of the entry
git show origin/main:content/practice/exercises.tsx | \
  awk "/id: '${ENTRY_ID}'/,/^  \\},/"
```

## Reformatting recipe (per entry)

When absorbing an entry into our bank, apply these transformations:

1. **Drop** `paperLabel: 'Παλαιό Θέμα #N',` or `paperLabel: 'Φροντιστηριακό Σετ #N',`.
2. **Insert** `source: '<dated>',` right after `origin:`. Mapping:
   - `Παλαιό Θέμα #8` → `'sept-2022'`
   - `Παλαιό Θέμα #9` → `'june-2021'`
   - `Παλαιό Θέμα #10` → `'sept-2020'`
   - `Παλαιό Θέμα #11` → `'distance-2020'`
   - `Παλαιό Θέμα #13` → `'june-2018'`
   - `Παλαιό Θέμα #14` → `'sept-2017'`
   - `Παλαιό Θέμα #15` → `'feb-2017'`
   - `Παλαιό Θέμα #16` → `'june-2016'`
   - `Φροντιστηριακό Σετ #N` (1-10) → `'frontistirio-2023-24'`
   - `Φροντιστηριακό Σετ #N` (11-13) → `'frontistirio-misc'`
3. **Rewrite the title** from `'Παλαιό Θέμα #N · Θέμα X — Y'` to
   `'<SourceLabel> · Θέμα X — Y'` using `SOURCE_LABELS` from
   `content/practice/types.ts` (e.g. `Παλαιό Θέμα #11` → `Εξ αποστάσεως 2020`,
   `Παλαιό Θέμα #16` → `Ιούνιος 2016`).
4. **Keep** `problemNumber`, `weight`, `topic`, `prerequisites`,
   `difficulty`, `statement`, `solution`, `origin` exactly as Stelios
   wrote them. (`difficulty` may be re-judged during the quality pass.)
5. If our bank had a placeholder for the same ID (e.g. `exam-sept-2022`
   with `statement: null`), **replace it** with the absorbed entry +
   delete the placeholder.

## Quality pass after absorption

Stelios's content gives us the seed. The full Phase D-equivalent pass
on each absorbed entry should:

- Rewrite the solution prose to [[lecture-rework-standard]] (intuition
  first, concrete before abstract, no skipped steps).
- Apply [[pseudocode-philosophy]] (natural-language primary; pseudocode
  collapsed-by-default; keyword chips; nutshell summary).
- Add interactives wherever a concept can click (recursion trees, DP
  tables, graph walks — re-use existing vizzes where possible).
- Wire ThinkingPattern + ExamRadar entries on the host lecture page.
- Add RecallCard memorisation hooks if the problem teaches a reusable
  technique.

## Deferred entries (70 total — recovered from origin/main)

### Past-exam entries (66)

- **pt8 (Παλαιό Θέμα #8 → sept-2022) — 3 entries.** `pt8-th1` (TSP),
  `pt8-th2` (LCS), `pt8-th3`.
- **pt9 (Παλαιό Θέμα #9 → june-2021) — 17 entries.** `pt9-q1` … `pt9-q15`
  (Σ/Λ + ΠΕ), `pt9-th1`, `pt9-th2`.
- **pt10 (Παλαιό Θέμα #10 → sept-2020) — 4 entries.** `pt10-th1` …
  `pt10-th4`.
- **pt11 (Παλαιό Θέμα #11 → distance-2020) — 3 entries.** `pt11-th2`,
  `pt11-th3`, `pt11-th4`. (`pt11-th1` already absorbed.)
- **pt13 (Παλαιό Θέμα #13 → june-2018) — 14 entries.** `pt13-th1` …
  `pt13-th15` (one short).
- **pt14 (Παλαιό Θέμα #14 → sept-2017) — 13 entries.** `pt14-th1`,
  `pt14-th4` … `pt14-th9`, `pt14-th11` … `pt14-th16`.
- **pt15 (Παλαιό Θέμα #15 → feb-2017) — 9 entries.** `pt15-th1`,
  `pt15-th2`, `pt15-th3`, `pt15-th7`, `pt15-th8`, `pt15-th10`,
  `pt15-th12`, `pt15-th14`, `pt15-th15`.
- **pt16 (Παλαιό Θέμα #16 → june-2016) — 7 entries.** `pt16-th1a`,
  `pt16-th1b`, `pt16-th1c`, `pt16-th2a`, `pt16-th2b`, `pt16-th2c`,
  `pt16-th3a`. (`pt16-th3b`, `pt16-th4`, `pt16-th5` already absorbed.)

### Frontistirio entries (4)

- **front-set-9-ask2** (Φροντιστηριακό Σετ #9 → frontistirio-2023-24):
  "Αίθουσες χωρίς 3 συνεχόμενες (DP)". Placeholder currently has
  `statement: null`. (4 of 5 ask entries already absorbed.)
- **front-set-10-ask6** (Φροντιστηριακό Σετ #10 → frontistirio-2023-24):
  "Κολώνες φωτισμού (μέγιστο ανεξάρτητο σύνολο σε μονοπάτι)". 13 of 14
  ask entries already absorbed.
- **front-set-11-ask1** (Φροντιστηριακό Σετ #11 → frontistirio-misc):
  "Επαγωγή στην αρμονική σειρά". 2 of 3 ask entries already absorbed.

## Sequencing

This is **not blocking**. The merged bank already has the 28 absorbed
entries shipping to students; the deferred 70 are paper-by-paper work
that fits naturally between [[phase-d-problem-rework]] (done) and any
fresh Phase E task that touches `exercises.tsx`.

Suggested cadence (mirror of Phase D — one paper per turn, stop and
show the user, ~3-6 entries per turn):

- F.0.1 — Absorb pt8 (3 entries, sept-2022).
- F.0.2 — Absorb pt9 part 1 (q1–q10, 10 entries, june-2021).
- F.0.3 — Absorb pt9 part 2 (q11–q15 + th1 + th2, 7 entries).
- F.0.4 — Absorb pt10 (4 entries, sept-2020).
- F.0.5 — Absorb pt11 remainder + the 3 frontistirio entries (6 total).
- F.0.6 — Absorb pt13 (14 entries, june-2018).
- F.0.7 — Absorb pt14 (13 entries, sept-2017).
- F.0.8 — Absorb pt15 (9 entries, feb-2017).
- F.0.9 — Absorb pt16 remainder (7 entries, june-2016).

The quality pass per absorbed entry happens in the same turn — bringing
the prose to [[lecture-rework-standard]] is the heavier lift, the
reformatting is mechanical.
