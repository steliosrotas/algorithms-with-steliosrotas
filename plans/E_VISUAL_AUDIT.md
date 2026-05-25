# E.4.5 — «Νιώσε»-Visual Audit of the Problem Bank

> **Audit pass for E.4.5 (per `plans/PHASE_E_PLAN.md` § E.4.5.0).** One walk
> through every transcribed entry in `content/practice/exercises.tsx`,
> applying the three-question test from the plan. Output is the chunked
> queue for the per-chunk retrofit turns (E.4.5.N).

---

## 1. Method

For each transcribed entry (statement ≠ null, solution ≠ null) the auditor
asked, in order:

1. **Does the statement describe a concrete scenario?** — physical setup,
   real-world process, labeled narrative graph, multi-character puzzle,
   geographic / spatial arrangement.
2. **If yes-to-1: does the solution open with a visual that depicts the
   scenario as described, before abstract modeling?**
3. **If yes-to-1 and no-to-2 → the entry is a gap.**

Per the binding standard in `PHASE_E_PLAN.md` § E.4.5 (and the
`front-set-7-ask2` precedent, commit `fb91716`):

- Abstract / formal problems are **not** flagged (e.g. «δείξε ότι
  $T(n) = 2T(n/2)+n$ είναι $O(n\log n)$» — there is no scenario to depict).
- Problems whose **existing** viz already depicts the scenario before the
  abstraction are **not** flagged. Crucially: when the algorithmic viz IS
  the natural picture of the scenario (e.g. `CoinChangeLab` showing coin
  stacks, `DutchFlagPartition` showing colored balls, `GasStationsGreedy`
  showing the road with stations, `RestaurantSpacingDP` showing the
  highway with restaurants, `GridGreedyVsOpt` showing the grid),
  no separate «Νιώσε» SVG is needed.
- Self-illustrative statements (the prose carries its own picture) are
  not flagged.

The bar — **good-quality, not minimum-viable** — is the same as the
lecture pages per `[[lecture-rework-standard]]`. Static SVG when one
snapshot suffices; **interactive when the scenario carries motion /
state / exploration** (the static-vs-interactive choice is per-problem,
not default-static). The audit notes a starting *hint* per entry but the
chunk executor decides honestly on the day.

---

## 2. Per-pool tally

The bank has 141 entries total. Of those:

- **21 untranscribed** (`statement: null`) — skipped, addressed in E.5
  not E.4.5. (`frontistirio-f10/f11/old-1/old-2/old-3` + 16 `exam-*`).
- **120 transcribed** — audited.

Of the 120 transcribed:

- **~90** are abstract / formal (asymptotic identities, recurrences,
  Master-Theorem applications, P/NP membership, loop-complexity traces,
  abstract algorithm-recognition MCQs, abstract graph problems with
  unnamed vertices, abstract `O/Ω/Θ` Σ/Λ pairs, etc.). Out of scope —
  no scenario to depict.
- **~26** describe a concrete scenario AND already open the solution
  with the appropriate viz (the algorithmic viz IS the scenario picture):
  - `pt2-th2-3` (ταμίας ρέστα → `CoinChangeLab` shows coin stacks)
  - `pt2-th4` (φοιτητές + αιτήματα → `WaitTimeShortestFirst` shows the
    request blocks with completion times)
  - `pt2-th3` (όνομα σκύλου / SCS → `ShortestSupersequenceTable` is the
    proper DP-on-prefixes picture; the «names» are abstract symbols)
  - `pt3-th2` (πλειοψηφικό «ιερογλυφικά» → `MajorityCandidateDivide`
    shows colored symbols)
  - `pt5-th4` (κολώνες φωτισμού → `LamppostsMISViz` shows the lamposts
    on a road with brightness)
  - `pt6-th2` (πλατφόρμα δόνησης γυμναστηρίου → `WeightedIntervalDP`
    shows the requested intervals on a timeline)
  - `front-set-1-ask3` & similar loop-complexity (the code IS the scene)
  - `front-set-4-ask5` (τραπεζικές κάρτες → `MajorityCandidateDivide`
    shows colored "cards")
  - `front-set-4-ask6` (σημαία της Ολλανδίας → `DutchFlagPartition`
    shows the colored balls)
  - `front-set-5-ask2` (βίδες/παξιμάδια → `NutsAndBolts`)
  - `front-set-5-ask6` (πόλεις + αξιοπιστία → `ReliabilityLogTransform`
    shows the graph in both languages)
  - `front-set-5-ask9` (×k vs +α — Σ/Λ in toy graphs → `MultVsAddPaths`)
  - `front-set-6-ask3` (εναλλασσόμενη υπακολουθία → `AlternatingPeaksValleys`
    shows the bar profile)
  - `front-set-6-ask5` (ρέστα → `CoinChangeLab`)
  - `front-set-6-ask6` (καθηγητής Μίδας + βενζίνη → `GasStationsGreedy`
    shows the road with stations)
  - `front-set-6-ask7` (Huffman ΚΑΣΤΑΝΑΣ → `HuffmanTreeBuilder` shows
    the tree being built)
  - `front-set-6-ask8` (αίθουσες/ταξί → `IntervalPartitionAnimator`)
  - `front-set-7-ask1` (ράβδοι χρυσού → `GoldbarMerges`)
  - `front-set-7-ask2` (λύκος/κατσίκα/λάχανο → **DONE** as the
    precedent — static SVG + `RiverCrossingStateGraph`, commit `fb91716`)
  - `front-set-7-ask4` (μηνιαίο vs ετήσιο ίντερνετ → `InternetPlanCounter`
    shows the calendar)
  - `front-set-7-ask5` (παιχνίδι σε πίνακα → `GridGreedyVsOpt` shows the
    grid)
  - `front-set-7-ask6` (τηλεφωνικό δίκτυο → `KruskalAnimator` shows the
    graph)
  - `front-set-7-ask7` (μοναδιαία διαστήματα σημείων → `UnitIntervalCover`
    shows the axis with points)
  - `front-set-7-ask8` (μαθήματα/αίθουσες → `IntervalPartitionAnimator`)
  - `front-set-8-ask4` (εστιατόρια/αυτοκινητόδρομος → `RestaurantSpacingDP`
    shows the highway with restaurants + exclusion zone)
- **4 transcribed are gaps** (definite) — listed in § 3 below.
- **2 transcribed are borderline gaps** — listed in § 4. Chunk executor
  decides per-problem.

Plus 1 gap already fixed: `front-set-7-ask2` (the precedent — commit
`fb91716`). Auditor double-checked: opening static SVG + scenario
caption + `RiverCrossingStateGraph` IS the binding pattern.

---

## 3. Definite gaps

Each row: `id` · scenario type · suggested visual sketch · chunk
assignment.

### 3.1 `pt1-th3` — Ιούνιος 2025 · Θέμα 3 — Επίσκεψη αξιοθέατων

- **Scenario type**: linear-sequence visit-problem with a binary
  transport choice — *n* αξιοθέατα in a city, each next hop is either
  taxi (cost *c_i*) or scooter rental (flat *S*, covers 4 hops).
- **What's missing**: solution opens with `(i) Θέλουμε...` text, then
  derives the recurrence, then mounts `<SightseeingDP />` (which is the
  *algorithmic* trace — values flowing into a `min` over OPT cells).
  Nothing depicts the city / sights / two transport options *as
  described*.
- **Suggested visual** (interactive recommended): a horizontal
  city strip with the *n* αξιοθέατα as numbered pins; below each gap,
  two icons — a taxi (🚖) showing cost *c_i*, a scooter (🛴) showing
  flat *S* with a 4-hop bracket spanning the rental. A slider/preset
  switches between «μόνο ταξί», «μόνο πατίνι», «μικτή» to feel the
  trade-off before the algorithm. Static SVG would also work (a
  single-snapshot of the city with the two transport options labeled)
  but the 4-hop bracket invites motion → interactive likely better.
- **Chunk**: A.

### 3.2 `pt4-th2-a` — Σεπτέμβριος 2024 · Θέμα 2α — Δίκτυο επαρχιακών πόλεων

- **Scenario type**: labeled geographic graph with narrative — *5
  επαρχιακές πόλεις* `A, B, C, D, E` connected by 8 highways; winter
  is coming and the prefecture wants the minimum total km of roads to
  plow so that every city remains reachable.
- **What's missing**: solution dives straight into «Το πρόβλημα είναι
  ένα ΕΕΔ. Η ιδέα της μη-μοναδικότητας…» and assigns weights via
  formula. No picture of the 5 cities + 8 roads + winter-snow context
  before the abstraction. Part (β) → `pt4-th2-b` mounts
  `<MstRunnerWithTies />` which shows the graph for Kruskal, but **(α)
  itself has zero visual** — and (α) is the one that frames the
  scenario.
- **Suggested visual** (static SVG): 5 city dots `A, B, C, D, E` in a
  pentagonal layout, 8 light grey roads labeled with the proposed
  weights (the triangle `A‑B‑C` weights 1,1,1 + the outer edges
  2/3/4/5/6), one snowflake / mountain motif top-right to anchor the
  winter context, caption «5 πόλεις · 8 δρόμοι · ίδιο υψόμετρο →
  ισόπεδες αποστάσεις». Static suffices — no motion in the (α) setup.
- **Chunk**: A.

### 3.3 `pt4-th4` — Σεπτέμβριος 2024 · Θέμα 4 — Διαφημίσεις χορηγών

- **Scenario type**: temporal slot-filling with narrative — first day
  of a festival, gap *T* between concert 1 ending and concert 2
  starting, *n* sponsor ads each with duration *t_i* and profit *p_i*;
  pick a subset that fits in *T* to maximise total profit.
- **What's missing**: solution opens with «Πρώτα η αναγνώριση — αυτό
  είναι Σακίδιο» (recognition only), then mounts `<KnapsackTable />`
  (the DP-table abstraction). No depiction of the festival timeline /
  concert ends / ad slots *as described* before that.
- **Suggested visual** (static SVG, but interactive defensible): a
  horizontal time bar labeled «Τέλος συναυλίας 1 → 0 min … T min →
  Έναρξη συναυλίας 2», below it a tray of *n* ad cards (each card =
  rectangle width ∝ *t_i*, label «€ *p_i*»). One «δείγμα γεμίσματος»
  drag-state if the executor wants it, but a clear static snapshot
  already lands the dichotomy «πόσος χρόνος χωράει vs πόση αξία
  παίρνω». Note: the (ε) επέκταση («σταθερό διάστημα `[s_i, s_i+t_i]`
  → WIS») then naturally re-uses the timeline.
- **Chunk**: A.

### 3.4 `front-set-6-ask1` — Φροντιστηριακό Σετ #6 · Άσκηση 1 — Ποδηλατική εκδρομή

- **Scenario type**: multi-day geographic route — *n* cities on a map
  connected by cycling routes (distances *d(u, v)*), nightly hotel
  cost *c(v)*, *m*-day trip from *s* to *t* with day-*k* distance cap
  *u(k)* and «no two consecutive nights in the same city».
- **What's missing**: solution opens with «Γιατί δεν είναι «απλό»
  shortest path» text, walks through the 3-step construction («αποστάσεις
  πόλεων → στρωματωμένος DAG → shortest path»), then mounts
  `<LayeredTripPlanner />`. The viz depicts the **layered DAG**
  (algorithmic abstraction). Nothing depicts the original *map of
  cities* + *day cap* concept before the construction begins.
- **Suggested visual** (interactive recommended): a small map of e.g.
  4 named cities (the same 4 used in `LayeredTripPlanner`) with
  edges labeled by *d*, each city tagged with its *c(v)*; a slider
  for the day index *k* showing the *u(k)* radius around each
  candidate next-stop city (which edges «χωράνε σήμερα»). After the
  reader plays for ~20 seconds the layered-DAG construction in the
  later viz reads as a natural follow-up («τώρα μάζεψε κάθε
  «επιτρεπτή» κίνηση κάθε ημέρας σε ένα στρώμα του γράφου»). Static
  SVG works as a fallback (a single labeled map + one day-cap
  example) but the *k* slider is what makes «η μέρα γίνεται διάσταση»
  click.
- **Chunk**: A.

---

## 4. Borderline gaps

These have a concrete scenario in the statement and the existing viz
overlaps significantly with the «Νιώσε» picture, but does not depict
the literal scenario as described. The chunk executor reads the entry
carefully and decides per-problem (per the binding standard: «*answer
honestly*. If the scenario is dynamic, build the interactive; do not
justify a static SVG by «it's faster»»).

### 4.1 `front-set-6-ask4` — Καθαριστήριο ρούχων (Γιώργος + 2 φάσεις)

- Scenario: Γιώργος single-server check phase + per-clothing parallel
  wash/dry phase; minimise makespan.
- Existing viz: `<LaundryFlowShop />` — Gantt timeline of three
  orderings (φθίνον p / αύξον p / φθίνον s) with the makespan readout.
- Decision: the Gantt **is** the operational picture and is what the
  exam expects the student to draw. A separate «Νιώσε» SVG (Γιώργος +
  pile of clothes + one washer + one dryer) would land the scenario
  but adds little beyond the Gantt. **Suggested**: skip unless the
  executor disagrees on second read. If retrofit: static SVG, simple
  shop scene with labeled stations.
- **Chunk**: B (only if executor confirms it's a real gap).

### 4.2 `front-set-7-ask9` — Το πάρτι της Alice

- Scenario: Alice + *n* candidate guests + acquaintance graph;
  constraints «κάθε καλεσμένος ≥ 5 φίλους + ≥ 5 άγνωστους».
- Existing viz: `<PartyDegreeFilter />` — interactive showing the
  acquaintance graph and the cascading peel filter.
- Decision: the graph already **is** the picture of the scenario (each
  node = guest, each edge = acquaintance). The two thresholds (5
  friends / 5 strangers) are conceptual and already named in the prose
  + viz. A separate «Νιώσε» (Alice + named guest list + friendship
  edges) would be a near-duplicate. **Suggested**: skip.
- **Chunk**: B (only if executor confirms — most likely skipped).

---

## 5. Chunks

### Chunk A — «Νιώσε»-visual retrofit for the 4 definite gaps (1 turn)

Entries (4):
- `pt1-th3` — αξιοθέατα + ταξί/πατίνι (interactive)
- `pt4-th2-a` — 5 πόλεις + 8 δρόμοι + χειμώνας (static SVG)
- `pt4-th4` — φεστιβάλ + ad slots (static SVG, interactive defensible)
- `front-set-6-ask1` — ποδηλατική εκδρομή σε χάρτη + ημέρες (interactive)

Why one chunk: small N (4); each is a distinct lecture + distinct
visual shape, so there's no natural lecture-based sub-grouping. Single
turn, four visuals, with the static-vs-interactive call made per-entry
during the turn per the binding standard.

Commit message: `feat(visuals-chunk-A): Νιώσε-visual retrofit for 4
bank entries` (4 entries: pt1-th3, pt4-th2-a, pt4-th4,
front-set-6-ask1).

### Chunk B — Borderline re-audit pass (1 turn, only if needed)

Entries (up to 2):
- `front-set-6-ask4` — Γιώργος καθαριστήριο
- `front-set-7-ask9` — Πάρτι της Alice

Action: chunk executor reads each entry carefully (statement +
existing viz behavior), confirms whether the gap is real, and either
(a) lands a static SVG of the literal scenario in the same shape as
the precedent, or (b) documents-and-skips with a one-sentence
justification appended to this file's § 4.

Expected outcome: at least one of the two stays skipped. If both
stay skipped, Chunk B is folded into the wrap-up of Chunk A's commit
(no separate turn needed).

---

## 6. Acceptance

Per `plans/PHASE_E_PLAN.md` § E.4.5:

- After the last chunk closes, the auditor re-runs the audit method on
  a **random sample of 5 entries** to confirm zero false negatives.
- A dedicated memory file (or an extension of `[[lecture-rework-standard]]`)
  records the binding standard as part of the final chunk's commit:
  **every transcribed problem describing a concrete scenario must
  open its solution with a good-quality illustrative anchor of the
  scenario as described, before any abstract modeling. Per-problem
  static-vs-interactive — never default-static when motion is the
  teaching surface.**
- Future transcriptions in E.5 must adopt this standard from the start
  (the per-paper PR description references this file).

---

## 7. Progress

- ☑ E.4.5.0 — audit pass (this file)
- ☑ E.4.5.A — Chunk A: 4 definite-gap visuals (done 2026-05-24)
  - `pt1-th3` → interactive `<SightseeingScene />` (3 strategies on n=5/c=4/S=10)
  - `pt4-th2-a` → static inline SVG (pentagonal 5-city layout, emerald A-B-C triangle, ❄ snowflakes)
  - `pt4-th4` → static inline SVG (♪ ♫ concert pictograms, T-bracket, width-proportional ad-card tray)
  - `front-set-6-ask1` → interactive `<CyclingTripScene />` (day-slider flips edge legality)
- ☐ E.4.5.B — Chunk B re-audit (optional turn; skip if both
  borderlines stay skipped)
