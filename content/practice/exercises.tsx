/**
 * Exercise bank — past-exam problems + frontistiria.
 *
 * SHAPE
 * -----
 * Each entry is one sub-exercise (one «Θέμα» / «Άσκηση»). The original
 * multi-problem papers are SPLIT — a paper like «Ιούνιος 2025» becomes 14
 * separate entries, each routed to the lecture it tests. Entries still
 * awaiting transcription carry `statement: null` and the UI renders an
 * "Άνοιξε το πρωτότυπο" link to `sourceFile`.
 *
 * SOURCE ATTRIBUTION
 * ------------------
 * Every entry carries a dated `source: ExamSource` value (e.g. `'june-2024'`,
 * `'sept-2025'`, `'frontistirio-2023-24'`). The UI surfaces the real exam
 * date via `SOURCE_LABELS[source]` (see `types.ts`) — the previous anonymised
 * «Παλαιό Θέμα #N» framing was dropped in Phase E (commit 6493d47).
 *
 * BADGES
 * ------
 * 2024 / 2025 sources are surfaced with the «Θέμα Εξετάσεων 2024/2025»
 * badge — see `RECENT_SOURCES` in `types.ts` and the `<ExerciseCard>`
 * rendering. They sort first in the practice hub.
 */

import type { Exercise } from './types'
import { InlineMath, BlockMath } from '@/components/math'
import { Callout } from '@/components/content/Callout'
import { ComplexityZooLab } from '@/components/viz/ComplexityZooLab'
import { AsymptoticVerdictExplorer } from '@/components/viz/AsymptoticVerdictExplorer'
import { FunctionOrderingRace } from '@/components/viz/FunctionOrderingRace'
import { LoopComplexityTrace } from '@/components/viz/LoopComplexityTrace'
import { SandwichTheoremViz } from '@/components/viz/SandwichTheoremViz'
import { ExpectedTimeBreakdown } from '@/components/viz/ExpectedTimeBreakdown'
import { ExponentiationBreaksO } from '@/components/viz/ExponentiationBreaksO'
import { RecurrenceClassifier } from '@/components/viz/RecurrenceClassifier'
import { RecurrenceSubstitution } from '@/components/viz/RecurrenceSubstitution'
import { FastExponentiation } from '@/components/viz/FastExponentiation'
import { OneZeroBinarySearch } from '@/components/viz/OneZeroBinarySearch'
import { MissingTermBinarySearch } from '@/components/viz/MissingTermBinarySearch'
import { RecurrenceTelescope } from '@/components/viz/RecurrenceTelescope'
import { CharEquationLab } from '@/components/viz/CharEquationLab'
import { InductionStepper } from '@/components/viz/InductionStepper'
import { UnequalSplitGeometric } from '@/components/viz/UnequalSplitGeometric'
import { StrengthenedGuess } from '@/components/viz/StrengthenedGuess'
import { MasterTheoremExtended } from '@/components/viz/MasterTheoremExtended'
import { DivideByNTrick } from '@/components/viz/DivideByNTrick'
import { StoogeSortViz } from '@/components/viz/StoogeSortViz'
import { BranchingContrast } from '@/components/viz/BranchingContrast'
import { MajorityCandidateDivide } from '@/components/viz/MajorityCandidateDivide'
import { DutchFlagPartition } from '@/components/viz/DutchFlagPartition'
import { MedianOfTwoSorted } from '@/components/viz/MedianOfTwoSorted'
import { SegmentCrossingsToInversions } from '@/components/viz/SegmentCrossingsToInversions'
import { NutsAndBolts } from '@/components/viz/NutsAndBolts'
import { QuicksortShufflingDefense } from '@/components/viz/QuicksortShufflingDefense'
import { InversionCounter } from '@/components/viz/InversionCounter'
import { ComponentsBfsSweep } from '@/components/viz/ComponentsBfsSweep'
import { NeighborhoodCostViz } from '@/components/viz/NeighborhoodCostViz'
import { RiverCrossingStateGraph } from '@/components/viz/RiverCrossingStateGraph'
import { RiverCrossingGame } from '@/components/viz/RiverCrossingGame'
import { PartyDegreeFilter } from '@/components/viz/PartyDegreeFilter'
import { ReliabilityLogTransform } from '@/components/viz/ReliabilityLogTransform'
import { LayeredSubsetsDAG } from '@/components/viz/LayeredSubsetsDAG'
import { DAGUnreliableTwoWays } from '@/components/viz/DAGUnreliableTwoWays'
import { MultVsAddPaths } from '@/components/viz/MultVsAddPaths'
import { LayeredTripPlanner } from '@/components/viz/LayeredTripPlanner'
import { CyclingTripScene } from '@/components/viz/CyclingTripScene'
import { ConstantShiftFail } from '@/components/viz/ConstantShiftFail'
import { MstCountingExplorer } from '@/components/viz/MstCountingExplorer'
import { DijkstraHandTrace } from '@/components/viz/DijkstraHandTrace'
import { DijkstraInvariantBreak } from '@/components/viz/DijkstraInvariantBreak'
import { MstRunnerWithTies } from '@/components/viz/MstRunnerWithTies'
import { SecondVsThirdEdgeMst } from '@/components/viz/SecondVsThirdEdgeMst'
import { MstPreorderTSP } from '@/components/viz/MstPreorderTSP'
import { DijkstraTreeVsMstTriangle } from '@/components/viz/DijkstraTreeVsMstTriangle'
import { MaxEdgeAsBridge } from '@/components/viz/MaxEdgeAsBridge'
import { KruskalAnimator } from '@/components/viz/KruskalAnimator'
import { PythagoreanQuadHash } from '@/components/viz/PythagoreanQuadHash'
import { PairSumHashStream } from '@/components/viz/PairSumHashStream'
import { MasterCase1Tree } from '@/components/viz/MasterCase1Tree'
import { MaxHeapKeyDecrease } from '@/components/viz/MaxHeapKeyDecrease'
import { CoinChangeLab } from '@/components/viz/CoinChangeLab'
import { AlternatingPeaksValleys } from '@/components/viz/AlternatingPeaksValleys'
import { GasStationsGreedy } from '@/components/viz/GasStationsGreedy'
import { GreedyColoringOrders } from '@/components/viz/GreedyColoringOrders'
import { InternetPlanCounter } from '@/components/viz/InternetPlanCounter'
import { GridGreedyVsOpt } from '@/components/viz/GridGreedyVsOpt'
import { UnitIntervalCover } from '@/components/viz/UnitIntervalCover'
import { IntervalPartitionAnimator } from '@/components/viz/IntervalPartitionAnimator'
import { TopoSortClassMatrix } from '@/components/viz/TopoSortClassMatrix'
import { WaitTimeShortestFirst } from '@/components/viz/WaitTimeShortestFirst'
import { LaundryFlowShop } from '@/components/viz/LaundryFlowShop'
import { TreeMatchingPeel } from '@/components/viz/TreeMatchingPeel'
import { HuffmanTreeBuilder } from '@/components/viz/HuffmanTreeBuilder'
import { HuffmanEncodeDecode } from '@/components/viz/HuffmanEncodeDecode'
import { GoldbarMerges } from '@/components/viz/GoldbarMerges'
import { FractionalVsZeroOneKnapsack } from '@/components/viz/FractionalVsZeroOneKnapsack'
import { DPTableLowerBound } from '@/components/viz/DPTableLowerBound'
import { SightseeingDP } from '@/components/viz/SightseeingDP'
import { SightseeingScene } from '@/components/viz/SightseeingScene'
import { LamppostsMISViz } from '@/components/viz/LamppostsMISViz'
import { RecursionExplosion } from '@/components/viz/RecursionExplosion'
import { WeightedIntervalDP } from '@/components/viz/WeightedIntervalDP'
import { RodCuttingDP } from '@/components/viz/RodCuttingDP'
import { RestaurantSpacingDP } from '@/components/viz/RestaurantSpacingDP'
import { ShortestSupersequenceTable } from '@/components/viz/ShortestSupersequenceTable'
import { KnapsackTable } from '@/components/viz/KnapsackTable'
import { KnapsackRatioVsDp } from '@/components/viz/KnapsackRatioVsDp'
import { KnapsackToIntervalScheduling } from '@/components/viz/KnapsackToIntervalScheduling'
import { MinMaxFlipExplainer } from '@/components/viz/MinMaxFlipExplainer'
import { DnaScoreAlignTable } from '@/components/viz/DnaScoreAlignTable'
import { NegativeCycleDetector } from '@/components/viz/NegativeCycleDetector'
import { GreedyVsDpRelaxation } from '@/components/viz/GreedyVsDpRelaxation'
import { DagAveragePathCost } from '@/components/viz/DagAveragePathCost'

/**
 * Every lecture slug, in order. Used so a paper that hits "all lectures"
 * doesn't need to enumerate 17 strings by hand.
 */
const ALL_LECTURES = [
  'lectures/L01-eisagogika',
  'lectures/L02-asymptotic-analysis',
  'lectures/L03-divide-and-conquer-i',
  'lectures/L04-divide-and-conquer-ii',
  'lectures/L05-divide-and-conquer-iii',
  'lectures/L06-graphs-i',
  'lectures/L07-graphs-ii',
  'lectures/L08-graphs-iii',
  'lectures/L09-graphs-iv',
  'lectures/L10-data-structures',
  'lectures/L11-greedy-i',
  'lectures/L12-greedy-ii',
  'lectures/L13-greedy-iii',
  'lectures/L14-dp-i',
  'lectures/L15-dp-ii',
  'lectures/L16-dp-iii',
  'lectures/L17-dp-iv',
]

export const EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // Φροντιστηριακά σετ — υπό μεταγραφή
  // Τα σετ #1–#8 έχουν μεταγραφεί ανά διάλεξη· τα παρακάτω εκκρεμούν.
  // ═══════════════════════════════════════════════════════════════════════
  // ── Φροντιστηριακό Σετ #9 — μεταγραμμένο & χωρισμένο ανά διάλεξη ───────
  {
    id: 'front-set-9-ask1',
    title: 'Φροντιστηριακό Σετ #9 · Άσκηση 1 — Ανταλλαγές & arbitrage (αρνητικός κύκλος)',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    weight: 23,
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>
          Σε ένα σύστημα ανταλλαγών υπάρχουν <InlineMath>{'n'}</InlineMath> είδη{' '}
          <InlineMath>{'c_1, \\dots, c_n'}</InlineMath> (μαζί με το ευρώ) και ένας
          πίνακας <InlineMath>{'R'}</InlineMath> με θετικές τιμές, όπου 1 μονάδα
          του είδους <InlineMath>{'c_i'}</InlineMath> αγοράζει{' '}
          <InlineMath>{'R[i,j]'}</InlineMath> μονάδες του είδους{' '}
          <InlineMath>{'c_j'}</InlineMath>. Για παράδειγμα, με 100 ευρώ αγοράζεται
          1 πληκτρολόγιο, που ανταλλάσσεται με 3 ποντίκια, που πουλιούνται 34
          ευρώ το ένα — καταλήγοντας σε 102 ευρώ, δηλαδή{' '}
          <InlineMath>{'0.01 \\cdot 3 \\cdot 34 = 1.02 > 1'}</InlineMath> (2%
          κέρδος).
        </p>
        <p>
          Προσδιορίστε έναν αποδοτικό αλγόριθμο που απαντά αν υπάρχει ακολουθία
          ειδών <InlineMath>{'\\langle c_{i_1}, c_{i_2}, \\dots, c_{i_k}\\rangle'}</InlineMath>{' '}
          τέτοια ώστε{' '}
          <InlineMath>{'R[i_1,i_2]\\cdot R[i_2,i_3]\\cdots R[i_k,i_1] > 1'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ζητάμε έναν <strong>κύκλο ανταλλαγών</strong> όπου το γινόμενο των
          λόγων ξεπερνά το 1 — δηλαδή ξεκινάς και καταλήγεις με{' '}
          <em>περισσότερο</em> από όσο είχες (αυτό λέγεται{' '}
          <strong>arbitrage</strong>).
        </p>
        <p>
          <strong>Το πρόβλημα μιλάει για γινόμενα — οι αλγόριθμοι γράφων μιλούν
          για αθροίσματα.</strong> Η γέφυρα είναι ο λογάριθμος: παίρνοντας{' '}
          <InlineMath>{'\\log'}</InlineMath>, ένα γινόμενο γίνεται άθροισμα.
          Φτιάχνουμε κατευθυνόμενο γράφο με έναν κόμβο ανά είδος και ακμή{' '}
          <InlineMath>{'(i,j)'}</InlineMath> με βάρος{' '}
          <InlineMath>{'w(i,j) = -\\log R[i,j]'}</InlineMath>.
        </p>
        <p>
          Τότε: <InlineMath>{'R[i_1,i_2]\\cdots R[i_k,i_1] > 1'}</InlineMath>{' '}
          <InlineMath>{'\\iff'}</InlineMath>{' '}
          <InlineMath>{'\\log R[i_1,i_2] + \\dots > 0'}</InlineMath>{' '}
          <InlineMath>{'\\iff'}</InlineMath>{' '}
          <InlineMath>{'w(i_1,i_2) + \\dots < 0'}</InlineMath>. Δηλαδή{' '}
          <strong>arbitrage υπάρχει ⟺ ο γράφος έχει κύκλο αρνητικού
          βάρους</strong>.
        </p>
        <p>
          <strong>Αλγόριθμος:</strong> τρέχουμε <strong>Bellman-Ford</strong>,
          που ξέρει ακριβώς να εντοπίζει αρνητικούς κύκλους. Προσοχή: ένας
          αρνητικός κύκλος μπορεί να μην είναι προσβάσιμος από μία τυχαία
          αφετηρία — γι&apos;αυτό προσθέτουμε μια εικονική κορυφή που συνδέεται με
          βάρος 0 σε όλους τους κόμβους και ξεκινάμε από εκεί. Αν ο Bellman-Ford
          βρει κύκλο αρνητικού βάρους, υπάρχει arbitrage· τον «ξεδιπλώνουμε»
          ακολουθώντας τους δείκτες προκατόχου για να δώσουμε την ακολουθία
          ειδών.
        </p>
        <p>
          <strong>Πολυπλοκότητα:</strong> ο γράφος είναι πλήρης,{' '}
          <InlineMath>{'|E| = \\Theta(n^2)'}</InlineMath>· η κατασκευή του{' '}
          <InlineMath>{'O(n^2)'}</InlineMath> και ο Bellman-Ford{' '}
          <InlineMath>{'O(|V|\\cdot|E|) = O(n^3)'}</InlineMath>. Πολυωνυμικός.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-9-ask2',
    title: 'Φροντιστηριακό Σετ #9 · Άσκηση 2 — Αίθουσες χωρίς 3 συνεχόμενες (DP)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    difficulty: 'hard',
    prerequisites: [
      'lectures/L14-dp-i',
      'lectures/L15-dp-ii',
      'lectures/L16-dp-iii',
      'lectures/L17-dp-iv',
    ],
    statement: null,
    solution: null,
  },
  {
    id: 'front-set-9-ask3',
    title: 'Φροντιστηριακό Σετ #9 · Άσκηση 3 — Αλυσίδα εστιατορίων στην εθνική οδό (DP)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'hard',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Ως υπεύθυνος δικτύου μιας αλυσίδας εστιατορίων πρέπει να επιλέξετε πού
          θα ανοίξουν καταστήματα κατά μήκος μιας νέας εθνικής οδού. Έχουν
          προεπιλεγεί <InlineMath>{'n'}</InlineMath> υποψήφιες θέσεις. Το
          αναμενόμενο κέρδος από το κατάστημα στη θέση{' '}
          <InlineMath>{'i'}</InlineMath> εξαρτάται από το αν ανοίγουν καταστήματα
          στις γειτονικές θέσεις <InlineMath>{'i-1'}</InlineMath> και{' '}
          <InlineMath>{'i+1'}</InlineMath>:
        </p>
        <ul>
          <li>
            σε καμία γειτονική → κέρδος <InlineMath>{'a_i'}</InlineMath>·
          </li>
          <li>
            σε μία από τις δύο → κέρδος <InlineMath>{'b_i'}</InlineMath>·
          </li>
          <li>
            και στις δύο → κέρδος <InlineMath>{'c_i'}</InlineMath>.
          </li>
        </ul>
        <p>
          Τα <InlineMath>{'c_1'}</InlineMath> και{' '}
          <InlineMath>{'c_n'}</InlineMath> δεν ορίζονται, και για κάθε θέση
          ισχύει <InlineMath>{'a_i \\ge b_i \\ge c_i \\ge 0'}</InlineMath>. Με
          είσοδο τις τριάδες <InlineMath>{'(a_i,b_i,c_i)'}</InlineMath>{' '}
          διατυπώστε αποδοτικό αλγόριθμο που επιλέγει τις θέσεις ώστε να
          μεγιστοποιηθεί το κέρδος.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Η δυσκολία εδώ: το κέρδος της θέσης <InlineMath>{'i'}</InlineMath>{' '}
          εξαρτάται και από την <InlineMath>{'i+1'}</InlineMath> — δηλαδή από το{' '}
          <strong>μέλλον</strong>. Λύση: όταν φτάνουμε στη θέση{' '}
          <InlineMath>{'i'}</InlineMath>, αποφασίζουμε «εκ των προτέρων» και για
          την <InlineMath>{'i+1'}</InlineMath>, ώστε να ξέρουμε πόσους γείτονες
          έχει τελικά η <InlineMath>{'i'}</InlineMath>.
        </p>
        <p>
          <strong>Τρεις καταστάσεις</strong> για το πρόθεμα θέσεων{' '}
          <InlineMath>{'\\{1,\\dots,i\\}'}</InlineMath>:
        </p>
        <ul>
          <li>
            <InlineMath>{'P_0(i)'}</InlineMath>: βέλτιστο κέρδος δεδομένου ότι{' '}
            <strong>δεν</strong> ανοίγει κατάστημα στη θέση{' '}
            <InlineMath>{'i'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'P_{1,0}(i)'}</InlineMath>: ανοίγει στη{' '}
            <InlineMath>{'i'}</InlineMath> αλλά <strong>όχι</strong> στη{' '}
            <InlineMath>{'i+1'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'P_{1,1}(i)'}</InlineMath>: ανοίγει και στη{' '}
            <InlineMath>{'i'}</InlineMath> και στη{' '}
            <InlineMath>{'i+1'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Βάση</strong> (<InlineMath>{'i=1'}</InlineMath>):{' '}
          <InlineMath>{'P_0(1)=0'}</InlineMath>,{' '}
          <InlineMath>{'P_{1,0}(1)=a_1'}</InlineMath> (η θέση 1 δεν έχει αριστερό
          γείτονα, και ο δεξής μένει κλειστός → 0 γείτονες),{' '}
          <InlineMath>{'P_{1,1}(1)=b_1'}</InlineMath> (1 γείτονας).
        </p>
        <p>
          <strong>Αναδρομές</strong> (<InlineMath>{'i \\ge 2'}</InlineMath>): όταν
          βάζουμε κατάστημα στη <InlineMath>{'i'}</InlineMath>, το κέρδος του
          εξαρτάται από το αν άνοιξε η <InlineMath>{'i-1'}</InlineMath> (το
          ξέρει η προηγούμενη κατάσταση) και η <InlineMath>{'i+1'}</InlineMath>{' '}
          (το διαλέγουμε τώρα):
        </p>
        <BlockMath>{'\\begin{aligned} P_0(i) &= \\max\\{P_0(i-1),\\ P_{1,0}(i-1)\\} \\\\ P_{1,0}(i) &= \\max\\{a_i + P_0(i-1),\\ \\ b_i + P_{1,1}(i-1)\\} \\\\ P_{1,1}(i) &= \\max\\{b_i + P_0(i-1),\\ \\ c_i + P_{1,1}(i-1)\\} \\end{aligned}'}</BlockMath>
        <p>
          Η απάντηση είναι το{' '}
          <InlineMath>{'\\max\\{P_0(n),\\ P_{1,0}(n)\\}'}</InlineMath> (στη
          θέση <InlineMath>{'n'}</InlineMath> δεν υπάρχει{' '}
          <InlineMath>{'i+1'}</InlineMath>). Υπολογίζουμε{' '}
          <InlineMath>{'3n'}</InlineMath> τιμές σε <InlineMath>{'O(1)'}</InlineMath>{' '}
          η καθεμία → <strong>χρόνος <InlineMath>{'O(n)'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-9-ask5',
    title: 'Φροντιστηριακό Σετ #9 · Άσκηση 5 — Μαγνητικός τομογράφος (weighted interval scheduling)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 5',
    weight: 30,
    difficulty: 'hard',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Ένα νοσοκομείο έχει έναν μαγνητικό τομογράφο και λαμβάνει{' '}
          <InlineMath>{'n'}</InlineMath> αιτήματα εξέτασης. Κάθε αίτημα{' '}
          <InlineMath>{'i'}</InlineMath> έχει χρόνο έναρξης{' '}
          <InlineMath>{'\\epsilon_i'}</InlineMath>, χρόνο λήξης{' '}
          <InlineMath>{'\\lambda_i'}</InlineMath> και βαρύτητα (βαθμό
          επείγοντος) <InlineMath>{'\\beta_i \\in [1,10]'}</InlineMath>. Δύο
          αιτήματα με επικαλυπτόμενα διαστήματα είναι ασύμβατα. Ζητείται
          υποσύνολο <InlineMath>{'\\Sigma'}</InlineMath> ανά δύο συμβατών
          αιτημάτων που μεγιστοποιεί το άθροισμα{' '}
          <InlineMath>{'\\sum_{i \\in \\Sigma}\\beta_i'}</InlineMath>.
        </p>
        <p>
          <strong>1.</strong> Είναι βέλτιστος ο άπληστος αλγόριθμος «ταξινόμησε
          κατά φθίνουσα βαρύτητα, διάλεξε το πρώτο, μετά το επόμενο συμβατό,
          κ.ο.κ.»;
        </p>
        <p>
          <strong>2.</strong> Βρείτε τη βέλτιστη τιμή με δυναμικό προγραμματισμό
          (δώστε την αναδρομική σχέση).
        </p>
        <p>
          <strong>3.</strong> Δώστε τον χρόνο εκτέλεσης και εκτελέστε στο
          παράδειγμα 8 αιτημάτων:{' '}
          <InlineMath>{'[0,20]\\,\\beta{=}3'}</InlineMath>,{' '}
          <InlineMath>{'[10,25]\\,\\beta{=}7'}</InlineMath>,{' '}
          <InlineMath>{'[25,50]\\,\\beta{=}7'}</InlineMath>,{' '}
          <InlineMath>{'[15,60]\\,\\beta{=}8'}</InlineMath>,{' '}
          <InlineMath>{'[40,70]\\,\\beta{=}5'}</InlineMath>,{' '}
          <InlineMath>{'[50,70]\\,\\beta{=}5'}</InlineMath>,{' '}
          <InlineMath>{'[70,80]\\,\\beta{=}9'}</InlineMath>,{' '}
          <InlineMath>{'[75,90]\\,\\beta{=}9'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτό είναι το κλασικό <strong>weighted interval scheduling</strong>:
          διαστήματα με «αξία», διάλεξε μη επικαλυπτόμενα με μέγιστη συνολική αξία.
        </p>
        <p>
          <strong>1. Ο άπληστος (κατά βαρύτητα) δεν είναι βέλτιστος.</strong>{' '}
          Αντιπαράδειγμα από το ίδιο στιγμιότυπο: επιλέγοντας πάντα την πιο
          επείγουσα συμβατή, ο άπληστος καταλήγει σε λύσεις όπως{' '}
          <InlineMath>{'\\{2,5,7\\}'}</InlineMath> (άθροισμα 21) ή{' '}
          <InlineMath>{'\\{4,8\\}'}</InlineMath> (17). Όμως η εφικτή λύση{' '}
          <InlineMath>{'\\{2,3,6,7\\}'}</InlineMath> έχει άθροισμα{' '}
          <InlineMath>{'28 > 21'}</InlineMath>. Μια ακριβή εξέταση μπορεί να
          «κλειδώνει» χρόνο που θα χωρούσε δύο φθηνότερες.
        </p>
        <p>
          <strong>2. Δυναμικός προγραμματισμός.</strong> Ταξινομούμε τα αιτήματα
          κατά αύξοντα χρόνο λήξης <InlineMath>{'\\lambda'}</InlineMath>. Για κάθε{' '}
          <InlineMath>{'i'}</InlineMath> ορίζουμε{' '}
          <InlineMath>{'p(i)'}</InlineMath> = ο μεγαλύτερος δείκτης{' '}
          <InlineMath>{'j < i'}</InlineMath> που είναι συμβατός με το{' '}
          <InlineMath>{'i'}</InlineMath> (αλλιώς 0). Με{' '}
          <InlineMath>{'X[i]'}</InlineMath> τη βέλτιστη τιμή για τα αιτήματα{' '}
          <InlineMath>{'1,\\dots,i'}</InlineMath>:
        </p>
        <BlockMath>{'X[i] = \\max\\{\\,\\beta_i + X[p(i)],\\ \\ X[i-1]\\,\\}, \\qquad X[0]=0.'}</BlockMath>
        <p>
          Η λογική: είτε <em>παίρνουμε</em> το <InlineMath>{'i'}</InlineMath>{' '}
          (κερδίζουμε <InlineMath>{'\\beta_i'}</InlineMath> και πηδάμε στο
          τελευταίο συμβατό <InlineMath>{'p(i)'}</InlineMath>), είτε το{' '}
          <em>αφήνουμε</em> (μένουμε στο <InlineMath>{'X[i-1]'}</InlineMath>).
        </p>
        <p>
          <strong>3. Χρόνος &amp; εκτέλεση.</strong> Ταξινόμηση{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath>· τα{' '}
          <InlineMath>{'p(i)'}</InlineMath> με δυαδική αναζήτηση{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath>· το γέμισμα του πίνακα{' '}
          <InlineMath>{'O(n)'}</InlineMath>. Σύνολο{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath>. Στο παράδειγμα (ήδη
          ταξινομημένο κατά <InlineMath>{'\\lambda'}</InlineMath>) έχουμε{' '}
          <InlineMath>{'p = (0,0,2,0,2,3,6,6)'}</InlineMath> και
        </p>
        <BlockMath>{'X = (0,\\ 3,\\ 7,\\ 14,\\ 14,\\ 14,\\ 19,\\ 28,\\ 28).'}</BlockMath>
        <p>
          Η βέλτιστη τιμή είναι <InlineMath>{'X[8] = 28'}</InlineMath>, που
          επιτυγχάνεται με το σύνολο{' '}
          <InlineMath>{'\\{2,3,6,7\\}'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-9-ask8',
    title: 'Φροντιστηριακό Σετ #9 · Άσκηση 8 — Αύξουσες υπακολουθίες (DP)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 8',
    weight: 35,
    difficulty: 'medium',
    prerequisites: ['lectures/L16-dp-iii'],
    statement: (
      <>
        <p>
          <strong>(α)</strong> Δίνεται πεπερασμένη ακολουθία{' '}
          <InlineMath>{'a_1, a_2, \\dots, a_n'}</InlineMath> (<InlineMath>{'n>1'}</InlineMath>).
          Λέμε ότι έχει γνήσια αύξουσα υπακολουθία αν υπάρχουν δείκτες{' '}
          <InlineMath>{'k \\le l'}</InlineMath> με{' '}
          <InlineMath>{'a_k < a_{k+1} < \\dots < a_l'}</InlineMath> (σε{' '}
          <strong>συνεχόμενες</strong> θέσεις). Δώστε αλγόριθμο ΔΠ που υπολογίζει
          το μήκος της μεγαλύτερης τέτοιας υπακολουθίας και τη θέση του πρώτου
          στοιχείου της.
        </p>
        <p>
          <strong>(β)</strong> Σχεδιάστε αλγόριθμο ΔΠ για την εύρεση της μέγιστης{' '}
          (όχι κατ&apos; ανάγκη συνεχόμενης) <strong>μονότονα αύξουσας
          υποακολουθίας</strong> σε χρόνο <InlineMath>{'O(n^2)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Συνεχόμενη αύξουσα «σερί».</strong> Εδώ η υπακολουθία είναι
          ένα <em>συνεχόμενο</em> κομμάτι του πίνακα. Ορίζουμε{' '}
          <InlineMath>{'c[i]'}</InlineMath> = μήκος της μεγαλύτερης αύξουσας
          σειράς που <strong>τελειώνει</strong> στη θέση{' '}
          <InlineMath>{'i'}</InlineMath>:
        </p>
        <BlockMath>{'c[i] = \\begin{cases} 1, & i=1 \\text{ ή } a_{i-1} \\ge a_i \\\\ c[i-1] + 1, & a_{i-1} < a_i \\end{cases}'}</BlockMath>
        <p>
          Σαρώνουμε μία φορά τον πίνακα κρατώντας το μέγιστο{' '}
          <InlineMath>{'c[i]'}</InlineMath> και τη θέση{' '}
          <InlineMath>{'i'}</InlineMath> όπου το πετύχαμε. Η θέση έναρξης της
          σειράς είναι τότε <InlineMath>{'i - c[i] + 1'}</InlineMath>. Χρόνος{' '}
          <InlineMath>{'O(n)'}</InlineMath>.
        </p>
        <p>
          <strong>(β) Μέγιστη αύξουσα υποακολουθία (LIS).</strong> Τώρα
          επιτρέπεται να πετάμε στοιχεία. Ορίζουμε{' '}
          <InlineMath>{'L[i]'}</InlineMath> = μήκος της μεγαλύτερης αύξουσας
          υποακολουθίας που <strong>τελειώνει</strong> στο{' '}
          <InlineMath>{'a_i'}</InlineMath>:
        </p>
        <BlockMath>{'L[i] = 1 + \\max\\{\\,L[j] : j < i \\text{ και } a_j < a_i\\,\\}'}</BlockMath>
        <p>
          (αν δεν υπάρχει τέτοιο <InlineMath>{'j'}</InlineMath>,{' '}
          <InlineMath>{'L[i]=1'}</InlineMath>). Για κάθε{' '}
          <InlineMath>{'i'}</InlineMath> κοιτάμε όλα τα προηγούμενα{' '}
          <InlineMath>{'j'}</InlineMath> — <InlineMath>{'O(n)'}</InlineMath>{' '}
          δουλειά ανά <InlineMath>{'i'}</InlineMath>, σύνολο{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>. Η απάντηση είναι το{' '}
          <InlineMath>{'\\max_i L[i]'}</InlineMath> (και ακολουθώντας
          δείκτες προκατόχου ανακατασκευάζουμε και την ίδια την υποακολουθία).
        </p>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #10 (Επανάληψη) — μεταγραμμένο ανά διάλεξη ──────
  {
    id: 'front-set-10-ask1',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 1 — Πολυωνυμικά φραγμένες συναρτήσεις',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Είναι πολυωνυμικά φραγμένη η συνάρτηση; (α){' '}
          <InlineMath>{'\\lceil \\log n \\rceil!'}</InlineMath> · (β){' '}
          <InlineMath>{'\\lceil \\log\\log n \\rceil!'}</InlineMath>
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          «Πολυωνυμικά φραγμένη» σημαίνει{' '}
          <InlineMath>{'f(n) \\le c \\cdot n^k'}</InlineMath> για κάποιες
          σταθερές. Το πρακτικό κριτήριο: η <InlineMath>{'f'}</InlineMath> είναι
          πολυωνυμικά φραγμένη <strong>αν και μόνο αν{' '}
          <InlineMath>{'\\log f(n) = O(\\log n)'}</InlineMath></strong> (παίρνοντας
          λογάριθμο, το <InlineMath>{'c\\,n^k'}</InlineMath> γίνεται{' '}
          <InlineMath>{'k\\log n + \\log c'}</InlineMath>).
        </p>
        <p>
          Το εργαλείο-κλειδί είναι ο τύπος{' '}
          <InlineMath>{'\\log(m!) = \\Theta(m\\log m)'}</InlineMath>.
        </p>
        <p>
          <strong>(α) <InlineMath>{'\\lceil\\log n\\rceil!'}</InlineMath></strong>{' '}
          Θέτουμε <InlineMath>{'m = \\lceil\\log n\\rceil = \\Theta(\\log n)'}</InlineMath>:
        </p>
        <BlockMath>{'\\log\\big(\\lceil\\log n\\rceil!\\big) = \\Theta(\\log n \\cdot \\log\\log n) = \\omega(\\log n).'}</BlockMath>
        <p>
          Είναι <em>μεγαλύτερο</em> από <InlineMath>{'O(\\log n)'}</InlineMath> —
          άρα η <InlineMath>{'\\lceil\\log n\\rceil!'}</InlineMath>{' '}
          <strong>δεν</strong> είναι πολυωνυμικά φραγμένη.
        </p>
        <p>
          <strong>(β) <InlineMath>{'\\lceil\\log\\log n\\rceil!'}</InlineMath></strong>{' '}
          Τώρα <InlineMath>{'m = \\Theta(\\log\\log n)'}</InlineMath>:
        </p>
        <BlockMath>{'\\log\\big(\\lceil\\log\\log n\\rceil!\\big) = \\Theta(\\log\\log n \\cdot \\log\\log\\log n) = o\\big((\\log\\log n)^2\\big) = o(\\log n).'}</BlockMath>
        <p>
          Είναι <em>μικρότερο</em> από <InlineMath>{'\\log n'}</InlineMath>, άρα{' '}
          <InlineMath>{'O(\\log n)'}</InlineMath> — η{' '}
          <InlineMath>{'\\lceil\\log\\log n\\rceil!'}</InlineMath>{' '}
          <strong>είναι</strong> πολυωνυμικά φραγμένη.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask2',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 2 — Πολυπλοκότητα τριπλού βρόχου',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Υπολογίστε την πολυπλοκότητα χρόνου του παρακάτω αλγορίθμου:</p>
        <pre>{`var ← 0
for i ← 0 to n-2 with step 1 do
  for j ← i to n with step 1 do
    for k ← 0 to 2√n with step 1 do
      var ← i + j + k`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          Μετράμε τους βρόχους από μέσα προς τα έξω:
        </p>
        <ul>
          <li>
            ο πιο εσωτερικός (<InlineMath>{'k'}</InlineMath>) τρέχει από 0 ως{' '}
            <InlineMath>{'2\\sqrt{n}'}</InlineMath> →{' '}
            <InlineMath>{'O(\\sqrt{n})'}</InlineMath> επαναλήψεις·
          </li>
          <li>
            ο μεσαίος (<InlineMath>{'j'}</InlineMath>) τρέχει από{' '}
            <InlineMath>{'i'}</InlineMath> ως <InlineMath>{'n'}</InlineMath> →{' '}
            <InlineMath>{'O(n)'}</InlineMath> επαναλήψεις·
          </li>
          <li>
            ο εξωτερικός (<InlineMath>{'i'}</InlineMath>) τρέχει από 0 ως{' '}
            <InlineMath>{'n-2'}</InlineMath> → <InlineMath>{'O(n)'}</InlineMath>{' '}
            επαναλήψεις·
          </li>
          <li>
            το σώμα <InlineMath>{'var \\leftarrow i+j+k'}</InlineMath> είναι{' '}
            <InlineMath>{'O(1)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Πολλαπλασιάζοντας:{' '}
          <InlineMath>{'O(n) \\cdot O(n) \\cdot O(\\sqrt{n}) \\cdot O(1) = O(n^{2.5})'}</InlineMath>.
        </p>
        <p>
          Ο ακριβής υπολογισμός με αθροίσματα{' '}
          <InlineMath>{'\\sum_{i=0}^{n-2}\\sum_{j=i}^{n}\\sum_{k=0}^{2\\sqrt{n}}1'}</InlineMath>{' '}
          δίνει κυρίαρχο όρο <InlineMath>{'n^{2.5}'}</InlineMath>, οπότε η
          πολυπλοκότητα είναι <strong><InlineMath>{'\\Theta(n^{2.5})'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask3',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 3 — Συντομότερα μονοπάτια με ίσα βάρη',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>
          Δίνεται γράφος <InlineMath>{'G=(V,E,W)'}</InlineMath> με{' '}
          <InlineMath>{'|V|'}</InlineMath> κόμβους, <InlineMath>{'|E|'}</InlineMath>{' '}
          ακμές και ένα ίδιο μη αρνητικό βάρος <InlineMath>{'W(e)=C'}</InlineMath>{' '}
          σε κάθε ακμή <InlineMath>{'e'}</InlineMath>. Η αναπαράσταση του γράφου
          είναι με λίστες γειτνίασης. Να δοθεί αλγόριθμος σε φυσική γλώσσα,
          βέλτιστης πολυπλοκότητας, που βρίσκει το κόστος του συντομότερου
          μονοπατιού από δεδομένο κόμβο <InlineMath>{'s'}</InlineMath> προς κάθε
          άλλο κόμβο.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το κλειδί: αφού <strong>όλες</strong> οι ακμές κοστίζουν το ίδιο{' '}
          <InlineMath>{'C'}</InlineMath>, το κόστος ενός μονοπατιού είναι απλώς{' '}
          <InlineMath>{'C \\times (\\text{πλήθος ακμών})'}</InlineMath>. Άρα
          «συντομότερο μονοπάτι» = «μονοπάτι με τις <strong>λιγότερες
          ακμές</strong>».
        </p>
        <p>
          Δεν χρειάζεται ο Dijkstra (που σπαταλά χρόνο σε ουρά προτεραιότητας) —
          αρκεί <strong>BFS</strong> από τον <InlineMath>{'s'}</InlineMath>. Η BFS
          επισκέπτεται τους κόμβους σε «στρώματα»: στρώμα 0 ο{' '}
          <InlineMath>{'s'}</InlineMath>, στρώμα 1 οι γείτονές του, κ.ο.κ. Το
          στρώμα ενός κόμβου = το ελάχιστο πλήθος ακμών ως αυτόν.
        </p>
        <p>
          <strong>Αλγόριθμος:</strong> τρέξε BFS από τον{' '}
          <InlineMath>{'s'}</InlineMath>· για κάθε κόμβο{' '}
          <InlineMath>{'u'}</InlineMath> θέσε{' '}
          <InlineMath>{'dist[u] = (\\text{στρώμα BFS του } u) \\times C'}</InlineMath>.
          Με λίστες γειτνίασης ο χρόνος είναι{' '}
          <InlineMath>{'O(|V| + |E|)'}</InlineMath> — γραμμικός και βέλτιστος
          (πρέπει τουλάχιστον να διαβάσουμε όλη την είσοδο).
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask4',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 4 — Δύο αναδρομές & Θεώρημα Κυριαρχίας',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Ένα πρόβλημα <InlineMath>{'\\Pi'}</InlineMath> επιλύεται με δύο
          αναδρομικούς αλγορίθμους για στιγμιότυπα μεγέθους{' '}
          <InlineMath>{'n'}</InlineMath>:
        </p>
        <p>
          <strong>i.</strong> Ο <InlineMath>{'A_1'}</InlineMath> διασπά το
          πρόβλημα σε 9 υποπροβλήματα μεγέθους <InlineMath>{'n/3'}</InlineMath>,
          τα επιλύει και συνθέτει τις λύσεις σε χρόνο{' '}
          <InlineMath>{'n'}</InlineMath>.
        </p>
        <p>
          <strong>ii.</strong> Ο <InlineMath>{'A_2'}</InlineMath> διασπά σε 2
          υποπροβλήματα μεγέθους <InlineMath>{'n/2'}</InlineMath>, τα επιλύει και
          συνθέτει σε χρόνο <InlineMath>{'cn'}</InlineMath> για κάποια σταθερά{' '}
          <InlineMath>{'c'}</InlineMath>.
        </p>
        <p>
          Γράψτε τις αναδρομικές εξισώσεις και επιλύστε τις με το Θεώρημα
          Κυριαρχίας.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το <strong>Θεώρημα Κυριαρχίας</strong> για{' '}
          <InlineMath>{'T(n) = aT(n/b) + f(n)'}</InlineMath> συγκρίνει τη
          συνάρτηση <InlineMath>{'f(n)'}</InlineMath> με τη «μαγική» δύναμη{' '}
          <InlineMath>{'n^{\\log_b a}'}</InlineMath>.
        </p>
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_1'}</InlineMath>:</strong>{' '}
          <InlineMath>{'T_1(n) = 9\\,T_1(n/3) + n'}</InlineMath>. Εδώ{' '}
          <InlineMath>{'a=9,\\ b=3'}</InlineMath>, οπότε{' '}
          <InlineMath>{'n^{\\log_3 9} = n^2'}</InlineMath>. Η{' '}
          <InlineMath>{'f(n)=n = O(n^{2-0.5})'}</InlineMath> είναι{' '}
          <em>μικρότερη</em> (περίπτωση 1) →{' '}
          <strong><InlineMath>{'T_1(n) = \\Theta(n^2)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_2'}</InlineMath>:</strong>{' '}
          <InlineMath>{'T_2(n) = 2\\,T_2(n/2) + cn'}</InlineMath>. Εδώ{' '}
          <InlineMath>{'a=2,\\ b=2'}</InlineMath>, οπότε{' '}
          <InlineMath>{'n^{\\log_2 2} = n'}</InlineMath>. Η{' '}
          <InlineMath>{'f(n)=cn = \\Theta(n)'}</InlineMath> είναι{' '}
          <em>ίδιας τάξης</em> (περίπτωση 2) →{' '}
          <strong><InlineMath>{'T_2(n) = \\Theta(n\\log n)'}</InlineMath></strong>.
        </p>
        <p>
          Ο <InlineMath>{'A_2'}</InlineMath> (όπως η mergesort) είναι σαφώς
          ταχύτερος από τον <InlineMath>{'A_1'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask5',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 5 — Επιδιόρθωση σωρού μετά από μείωση τιμής',
    topic: 'data-structures',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 5',
    difficulty: 'medium',
    prerequisites: ['lectures/L10-data-structures'],
    statement: (
      <>
        <p>
          Η ακολουθία <InlineMath>{'a_1, a_2, \\dots, a_n'}</InlineMath> είναι
          αποθηκευμένη στον μονοδιάστατο πίνακα <InlineMath>{'A'}</InlineMath> υπό
          δομή σωρού (max heap). Κάποιος όρος <InlineMath>{'a_i'}</InlineMath>{' '}
          αλλάζει και παίρνει <strong>μικρότερη</strong> τιμή· ο νέος πίνακας
          ενδέχεται να μην είναι πλέον σωρός.
        </p>
        <p>
          <strong>i.</strong> Δώστε σύντομα έναν αναδρομικό αλγόριθμο{' '}
          <InlineMath>{'RA(A,i)'}</InlineMath> που διατηρεί τη δομή σωρού.
        </p>
        <p>
          <strong>ii.</strong> Δώστε την αναδρομική σχέση{' '}
          <InlineMath>{'T(n)'}</InlineMath> για τη χείριστη περίπτωση. <strong>iii.</strong>{' '}
          Επιλύστε την, με <InlineMath>{'T(1)=\\Theta(1)'}</InlineMath>.
        </p>
        <p>
          <strong>iv.</strong> Εφαρμόστε για τον όρο <InlineMath>{'a_2'}</InlineMath>{' '}
          ενός σωρού με ρίζα 16 (πίνακας{' '}
          <InlineMath>{'A=[16,14,10,8,10,9,3,2,4,7]'}</InlineMath>), όταν αλλάζει
          τιμή από 14 σε 13 και από 14 σε 6.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Όταν μια τιμή <em>μικραίνει</em>, μπορεί να γίνει μικρότερη από κάποιο
          παιδί της — οπότε χαλάει η ιδιότητα «κάθε γονέας ≥ παιδιά». Πρέπει να
          την «βυθίσουμε» (sift-down).
        </p>
        <p>
          <strong>i. Ο αλγόριθμος <InlineMath>{'RA(A,i)'}</InlineMath>:</strong>{' '}
          βρες το μεγαλύτερο ανάμεσα στον <InlineMath>{'A[i]'}</InlineMath> και τα
          δύο παιδιά του (θέσεις <InlineMath>{'2i{+}1, 2i{+}2'}</InlineMath> σε
          0-based πίνακα). Αν το μεγαλύτερο είναι κάποιο παιδί, αντάλλαξέ το με
          τον <InlineMath>{'A[i]'}</InlineMath> και κάλεσε αναδρομικά τον{' '}
          <InlineMath>{'RA'}</InlineMath> στη θέση όπου κατέβηκε ο όρος. Αν ο{' '}
          <InlineMath>{'A[i]'}</InlineMath> είναι ήδη ο μεγαλύτερος (ή φύλλο),
          σταμάτα.
        </p>
        <p>
          <strong>ii–iii. Πολυπλοκότητα.</strong> Σε κάθε κλήση γίνεται σταθερή
          δουλειά και η αναδρομή κατεβαίνει σε ένα υποδέντρο. Το μεγαλύτερο
          υποδέντρο ενός σωρού <InlineMath>{'n'}</InlineMath> κόμβων έχει το πολύ{' '}
          <InlineMath>{'2n/3'}</InlineMath> κόμβους, άρα{' '}
          <InlineMath>{'T(n) \\le T(2n/3) + O(1)'}</InlineMath>. Με Θεώρημα
          Κυριαρχίας (<InlineMath>{'a=1, b=3/2'}</InlineMath>,{' '}
          <InlineMath>{'n^{\\log_{3/2}1}=1'}</InlineMath>,{' '}
          <InlineMath>{'f=\\Theta(1)'}</InlineMath>, περίπτωση 2):{' '}
          <strong><InlineMath>{'T(n) = O(\\log n)'}</InlineMath></strong> — όσο το
          ύψος του δέντρου.
        </p>
        <p>
          <strong>iv. Εφαρμογή.</strong> Ο <InlineMath>{'a_2'}</InlineMath> έχει
          παιδιά τους όρους με τιμές 8 και 10.
        </p>
        <ul>
          <li>
            <strong><InlineMath>{'14 \\to 13'}</InlineMath>:</strong> το 13 είναι
            ≥ και τα δύο παιδιά (8, 10) — καμία παραβίαση, ο πίνακας παραμένει
            σωρός. Καμία ανταλλαγή.
          </li>
          <li>
            <strong><InlineMath>{'14 \\to 6'}</InlineMath>:</strong> το 6 είναι
            μικρότερο από το μεγαλύτερο παιδί (10) → αντάλλαξε με το 10. Τώρα ο 6
            έχει παιδί τον όρο με τιμή 7· <InlineMath>{'6 < 7'}</InlineMath> →
            νέα ανταλλαγή. Πλέον ο 6 είναι φύλλο — τέλος. Δύο «βυθίσεις».
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'front-set-10-ask6',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 6 — Κολώνες φωτισμού (μέγιστο ανεξάρτητο σύνολο σε μονοπάτι)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'front-set-10-ask7',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 7 — CLIQUE: ∈ NP και ∈ P για σταθερό k',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 7',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>CLIQUE:</strong> δοθέντος μη κατευθυνόμενου γράφου{' '}
          <InlineMath>{'G'}</InlineMath> με <InlineMath>{'n'}</InlineMath>{' '}
          κόμβους και μη αρνητικού ακεραίου <InlineMath>{'k \\le n'}</InlineMath>,
          περιέχει ο <InlineMath>{'G'}</InlineMath>{' '}
          <InlineMath>{'k'}</InlineMath>-κλίκα; (Μια{' '}
          <InlineMath>{'k'}</InlineMath>-κλίκα είναι πλήρως συνδεδεμένος γράφος{' '}
          <InlineMath>{'k'}</InlineMath> κόμβων με{' '}
          <InlineMath>{'k(k-1)/2'}</InlineMath> ακμές.)
        </p>
        <p>
          <strong>i.</strong> Αποδείξτε ότι μια λύση επαληθεύεται σε πολυωνυμικό
          χρόνο (ανήκει στην NP). <strong>ii.</strong> Αποδείξτε ότι όταν το{' '}
          <InlineMath>{'k'}</InlineMath> έχει σταθερή τιμή (π.χ.{' '}
          <InlineMath>{'k=100'}</InlineMath>) το CLIQUE λύνεται σε πολυωνυμικό
          χρόνο (ανήκει στην P).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. CLIQUE <InlineMath>{'\\in'}</InlineMath> NP.</strong> Κάποιος
          μας δίνει ένα σύνολο κορυφών ως υποψήφια κλίκα. Επαληθεύουμε:
        </p>
        <ul>
          <li>
            ότι έχει ακριβώς <InlineMath>{'k'}</InlineMath> κορυφές —{' '}
            <InlineMath>{'O(k)'}</InlineMath>·
          </li>
          <li>
            ότι υπάρχουν <strong>όλες</strong> οι{' '}
            <InlineMath>{'k(k-1)/2'}</InlineMath> ακμές μεταξύ τους —{' '}
            <InlineMath>{'O(k^2)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Συνολικά <InlineMath>{'O(k^2) = O(n^2)'}</InlineMath> — πολυωνυμικός
          έλεγχος, άρα CLIQUE <InlineMath>{'\\in'}</InlineMath> NP.
        </p>
        <p>
          <strong>ii. Σταθερό <InlineMath>{'k'}</InlineMath> → P.</strong> Όταν το{' '}
          <InlineMath>{'k'}</InlineMath> είναι <em>σταθερά</em> (δεν μεγαλώνει με
          το <InlineMath>{'n'}</InlineMath>), δοκιμάζουμε όλα τα υποσύνολα{' '}
          <InlineMath>{'k'}</InlineMath> κορυφών:{' '}
          <InlineMath>{'\\binom{n}{k} = \\Theta(n^k)'}</InlineMath> πλήθος. Για
          καθένα ελέγχουμε τις ακμές σε <InlineMath>{'O(k^2)'}</InlineMath>.
          Συνολικά <InlineMath>{'O(n^k k^2)'}</InlineMath>· για{' '}
          <InlineMath>{'k=100'}</InlineMath> αυτό είναι{' '}
          <InlineMath>{'O(n^{100})'}</InlineMath>.
        </p>
        <p>
          Τεράστιος εκθέτης — αλλά <strong>σταθερός</strong>, άρα{' '}
          <InlineMath>{'O(n^{100})'}</InlineMath> είναι εξ ορισμού πολυωνυμικό:
          το CLIQUE με σταθερό <InlineMath>{'k'}</InlineMath> ανήκει στην P. (Η
          δυσκολία του γενικού CLIQUE κρύβεται ακριβώς στο ότι το{' '}
          <InlineMath>{'k'}</InlineMath> είναι μέρος της εισόδου.)
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask8',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 8 — INDEP: ∈ NP και ∈ P για σταθερό k',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 8',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>INDEP:</strong> δοθέντος μη κατευθυνόμενου γράφου{' '}
          <InlineMath>{'G'}</InlineMath> με <InlineMath>{'n'}</InlineMath>{' '}
          κόμβους και μη αρνητικού ακεραίου <InlineMath>{'k \\le n'}</InlineMath>,
          περιέχει ο <InlineMath>{'G'}</InlineMath>{' '}
          <InlineMath>{'k'}</InlineMath>-ανεξάρτητο σύνολο; (<InlineMath>{'k'}</InlineMath>{' '}
          κόμβοι που ανά 2 δεν συνδέονται με ακμή.)
        </p>
        <p>
          <strong>i.</strong> Αποδείξτε ότι ανήκει στην NP.{' '}
          <strong>ii.</strong> Αποδείξτε ότι για σταθερό{' '}
          <InlineMath>{'k'}</InlineMath> (π.χ. <InlineMath>{'k=1000'}</InlineMath>)
          λύνεται σε πολυωνυμικό χρόνο (ανήκει στην P).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το INDEP είναι το «καθρέφτισμα» του CLIQUE: ένα ανεξάρτητο σύνολο στον{' '}
          <InlineMath>{'G'}</InlineMath> είναι ακριβώς μια κλίκα στον{' '}
          <strong>συμπληρωματικό γράφο</strong> <InlineMath>{"G'"}</InlineMath>{' '}
          (ίδιες κορυφές, αντεστραμμένες ακμές).
        </p>
        <p>
          <strong>i. INDEP <InlineMath>{'\\in'}</InlineMath> NP.</strong> Δοθέντος
          ενός συνόλου <InlineMath>{'k'}</InlineMath> κορυφών, ελέγχουμε ότι έχει{' '}
          <InlineMath>{'k'}</InlineMath> στοιχεία (<InlineMath>{'O(k)'}</InlineMath>)
          και ότι <strong>καμία</strong> από τις{' '}
          <InlineMath>{'k(k-1)/2'}</InlineMath> πιθανές ακμές δεν υπάρχει
          ανάμεσά τους (<InlineMath>{'O(k^2)=O(n^2)'}</InlineMath>). Πολυωνυμική
          επαλήθευση.
        </p>
        <p>
          <strong>ii. Σταθερό <InlineMath>{'k'}</InlineMath> → P.</strong>{' '}
          Δοκιμάζουμε και τα <InlineMath>{'\\binom{n}{k}=\\Theta(n^k)'}</InlineMath>{' '}
          υποσύνολα <InlineMath>{'k'}</InlineMath> κορυφών, ελέγχοντας το καθένα
          σε <InlineMath>{'O(k^2)'}</InlineMath>. Συνολικά{' '}
          <InlineMath>{'O(n^k k^2)'}</InlineMath>· για{' '}
          <InlineMath>{'k=1000'}</InlineMath> δίνει{' '}
          <InlineMath>{'O(n^{1000})'}</InlineMath> — πελώριο, αλλά με{' '}
          <strong>σταθερό</strong> εκθέτη, άρα πολυωνυμικό. Το INDEP με σταθερό{' '}
          <InlineMath>{'k'}</InlineMath> ανήκει στην P.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask9',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 9 — Προβλήματα απόφασης D(Path), D(K)',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 9',
    difficulty: 'hard',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Θεωρήστε τα προβλήματα: <strong>ελαχιστοποίηση μονοπατιού</strong>{' '}
          ανάμεσα σε 2 κόμβους <InlineMath>{'s, t'}</InlineMath> ενός γράφου, και{' '}
          <strong>μεγιστοποίηση οφέλους ενός 0-1 σακιδίου</strong>.
        </p>
        <p>
          <strong>i.</strong> Δώστε τα αντίστοιχα προβλήματα απόφασης{' '}
          <InlineMath>{'D(Path)'}</InlineMath> και{' '}
          <InlineMath>{'D(K)'}</InlineMath>. <strong>ii.</strong> Αποδείξτε ότι
          μια λύση επαληθεύεται σε πολυωνυμικό χρόνο (ανήκουν στην NP).{' '}
          <strong>iii.</strong> Αποδείξτε ότι το <InlineMath>{'D(Path)'}</InlineMath>{' '}
          λύνεται σε πολυωνυμικό χρόνο (ανήκει στην P). <em>[Στο πρωτότυπο φύλλο
          το ερώτημα iii γράφει «<InlineMath>{'D(K)'}</InlineMath>» — προφανές
          τυπογραφικό, αφού το πρόβλημα του σακιδίου δεν είναι γνωστό ότι ανήκει
          στην P.]</em>
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ένα <strong>πρόβλημα απόφασης</strong> απαντά «ναι/όχι». Από ένα
          πρόβλημα βελτιστοποίησης το φτιάχνουμε βάζοντας ένα κατώφλι{' '}
          <InlineMath>{'k'}</InlineMath>.
        </p>
        <p>
          <strong>i.</strong>{' '}
          <InlineMath>{'D(Path)'}</InlineMath>: «υπάρχει μονοπάτι{' '}
          <InlineMath>{'s \\to t'}</InlineMath> με συνολικό κόστος{' '}
          <InlineMath>{'\\le k'}</InlineMath>;»{' '}
          <InlineMath>{'D(K)'}</InlineMath>: «υπάρχει επιλογή αντικειμένων με
          συνολικό βάρος εντός της χωρητικότητας και συνολικό όφελος{' '}
          <InlineMath>{'\\ge k'}</InlineMath>;»
        </p>
        <p>
          <strong>ii. Και τα δύο ∈ NP.</strong> Για το{' '}
          <InlineMath>{'D(Path)'}</InlineMath>: δοθέντος ενός μονοπατιού,
          αθροίζουμε τα κόστη των ακμών και ελέγχουμε αν είναι{' '}
          <InlineMath>{'\\le k'}</InlineMath> — <InlineMath>{'O(n)'}</InlineMath>.
          Για το <InlineMath>{'D(K)'}</InlineMath>: δοθέντων των επιλεγμένων
          αντικειμένων, αθροίζουμε βάρη (≤ χωρητικότητα;) και οφέλη (≥{' '}
          <InlineMath>{'k'}</InlineMath>;) — <InlineMath>{'O(n)'}</InlineMath>.
        </p>
        <p>
          <strong>iii. <InlineMath>{'D(Path)'}</InlineMath> ∈ P.</strong>{' '}
          Υπολογίζουμε το πραγματικό συντομότερο μονοπάτι{' '}
          <InlineMath>{'s \\to t'}</InlineMath> — π.χ. με{' '}
          <strong>Bellman-Ford</strong> σε <InlineMath>{'O(|V||E|)'}</InlineMath>{' '}
          (δουλεύει ακόμη και με αρνητικά βάρη, αρκεί να μην υπάρχει αρνητικός
          κύκλος) — και το συγκρίνουμε με το <InlineMath>{'k'}</InlineMath>. Άρα
          το <InlineMath>{'D(Path)'}</InlineMath> ανήκει στην P.
        </p>
        <p>
          <strong>Σημείωση:</strong> το <InlineMath>{'D(K)'}</InlineMath>{' '}
          (0-1 σακίδιο) είναι NP-complete — για αυτό μπορούμε να αποδείξουμε{' '}
          <em>μόνο</em> ότι ανήκει στην NP, όχι στην P.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask10',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 10 — Προβλήματα απόφασης D(MST), D(TSP)',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 10',
    difficulty: 'hard',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Θεωρήστε τα προβλήματα: <strong>ελαχιστοποίηση κόστους δέντρου
          επικάλυψης (MST)</strong> σε έναν γράφο, και{' '}
          <strong>ελαχιστοποίηση κόστους χαμιλτονιανού κύκλου (TSP)</strong> σε
          έναν πλήρη γράφο.
        </p>
        <p>
          <strong>i.</strong> Δώστε τα αντίστοιχα προβλήματα απόφασης{' '}
          <InlineMath>{'D(MST)'}</InlineMath> και{' '}
          <InlineMath>{'D(TSP)'}</InlineMath>. <strong>ii.</strong> Αποδείξτε ότι
          ανήκουν στην NP. <strong>iii.</strong> Αποδείξτε ότι το{' '}
          <InlineMath>{'D(MST)'}</InlineMath> λύνεται σε πολυωνυμικό χρόνο
          (ανήκει στην P).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Προβλήματα απόφασης.</strong>{' '}
          <InlineMath>{'D(MST)'}</InlineMath>: «υπάρχει δέντρο επικάλυψης με
          συνολικό κόστος <InlineMath>{'\\le k'}</InlineMath>;»{' '}
          <InlineMath>{'D(TSP)'}</InlineMath>: «υπάρχει χαμιλτονιανός κύκλος (σε
          πλήρη γράφο) με συνολικό κόστος <InlineMath>{'\\le k'}</InlineMath>;»
        </p>
        <p>
          <strong>ii. Και τα δύο ∈ NP.</strong> Για το{' '}
          <InlineMath>{'D(MST)'}</InlineMath>: δοθέντος ενός συνόλου ακμών,
          ελέγχουμε ότι αθροίζουν <InlineMath>{'\\le k'}</InlineMath>, ότι
          αγγίζουν όλες τις κορυφές και ότι δεν σχηματίζουν κύκλο (π.χ. με DFS,{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>). Για το{' '}
          <InlineMath>{'D(TSP)'}</InlineMath>: δοθέντος ενός κύκλου, ελέγχουμε ότι
          είναι χαμιλτονιανός — περνά από κάθε κορυφή ακριβώς μία φορά και κλείνει
          — και ότι αθροίζει <InlineMath>{'\\le k'}</InlineMath>{' '}
          (<InlineMath>{'O(n)'}</InlineMath>).
        </p>
        <p>
          <strong>iii. <InlineMath>{'D(MST)'}</InlineMath> ∈ P.</strong>{' '}
          Υπολογίζουμε το πραγματικό MST — π.χ. με τον{' '}
          <strong>Kruskal</strong> ή τον <strong>Prim</strong> σε πολυωνυμικό
          χρόνο (<InlineMath>{'O(|E|\\log|V|)'}</InlineMath>) — και συγκρίνουμε το
          βάρος του με το <InlineMath>{'k'}</InlineMath>. Άρα το{' '}
          <InlineMath>{'D(MST)'}</InlineMath> ανήκει στην P.
        </p>
        <p>
          <strong>Σημείωση:</strong> το <InlineMath>{'D(TSP)'}</InlineMath> είναι
          NP-complete — δεν ξέρουμε πολυωνυμικό αλγόριθμο. Παρότι τα δύο
          προβλήματα μοιάζουν («φθηνός υπογράφος που τα συνδέει όλα»), το ένα
          είναι εύκολο και το άλλο από τα δυσκολότερα.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask11',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 11 — Αναδρομή vs ΔΠ (πολυωνυμική αναδρομή)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 11',
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Θέλουμε να υπολογίσουμε με αναδρομικό αλγόριθμο την ακολουθία{' '}
          <InlineMath>{'a_1, a_2, \\dots, a_n'}</InlineMath> από τον τύπο
        </p>
        <BlockMath>{'a_n = 2\\max\\{a_{\\lfloor n/2\\rfloor},\\ a_{\\lfloor n/2\\rfloor+1}\\} + a_{\\lfloor n/2\\rfloor-1}'}</BlockMath>
        <p>
          με τους 3 αρχικούς όρους ίσους με 1. Δίνεται{' '}
          <InlineMath>{'\\log_2 3 = 1.585'}</InlineMath>. Έστω{' '}
          <InlineMath>{'RA(n)'}</InlineMath> ο αναδρομικός αλγόριθμος.
        </p>
        <p>
          <strong>i.</strong> Γράψτε σύντομα τον <InlineMath>{'RA(n)'}</InlineMath>.{' '}
          <strong>ii.</strong> Δείξτε ότι είναι πολυωνυμικός με πολυπλοκότητα{' '}
          <InlineMath>{'O(n^{1.585})'}</InlineMath>. <strong>iii.</strong> Με ΔΠ
          (<InlineMath>{'DA(n)'}</InlineMath>), πόσα υποπροβλήματα ορίζονται;{' '}
          <strong>iv.</strong> Δικαιολογήστε ότι ο <InlineMath>{'DA(n)'}</InlineMath>{' '}
          είναι γραμμικός. <strong>v.</strong> Ποιος είναι ταχύτερος;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Ο <InlineMath>{'RA(n)'}</InlineMath>:</strong> αν{' '}
          <InlineMath>{'n \\le 3'}</InlineMath> επίστρεψε 1· αλλιώς υπολόγισε
          αναδρομικά τα <InlineMath>{'RA(\\lfloor n/2\\rfloor)'}</InlineMath>,{' '}
          <InlineMath>{'RA(\\lfloor n/2\\rfloor+1)'}</InlineMath>,{' '}
          <InlineMath>{'RA(\\lfloor n/2\\rfloor-1)'}</InlineMath> και επίστρεψε{' '}
          <InlineMath>{'2\\max(\\text{πρώτα δύο}) + \\text{τρίτο}'}</InlineMath>.
        </p>
        <p>
          <strong>ii. Πολυπλοκότητα του <InlineMath>{'RA'}</InlineMath>.</strong>{' '}
          Κάθε κλήση γεννά <strong>3 κλήσεις μεγέθους ~<InlineMath>{'n/2'}</InlineMath></strong>{' '}
          και κάνει <InlineMath>{'O(1)'}</InlineMath> δουλειά:{' '}
          <InlineMath>{'T(n) = 3T(n/2) + O(1)'}</InlineMath>. Με Θεώρημα
          Κυριαρχίας <InlineMath>{'n^{\\log_2 3} = n^{1.585}'}</InlineMath>{' '}
          κυριαρχεί → <InlineMath>{'T(n) = \\Theta(n^{1.585})'}</InlineMath>.
          Πολυωνυμικός (αλλά υπεργραμμικός): το πρόβλημα είναι ότι ξαναϋπολογίζει
          τους ίδιους όρους ξανά και ξανά.
        </p>
        <p>
          <strong>iii. Υποπροβλήματα.</strong> Οι διαφορετικές τιμές που μας
          ενδιαφέρουν είναι ακριβώς οι{' '}
          <InlineMath>{'a_1, \\dots, a_n'}</InlineMath> — άρα{' '}
          <strong><InlineMath>{'n'}</InlineMath> υποπροβλήματα</strong> (τα 3
          πρώτα γνωστά εξαρχής).
        </p>
        <p>
          <strong>iv. Ο <InlineMath>{'DA(n)'}</InlineMath> είναι γραμμικός.</strong>{' '}
          Γεμίζουμε έναν πίνακα <InlineMath>{'n'}</InlineMath> θέσεων από αριστερά
          προς τα δεξιά· κάθε θέση υπολογίζεται <strong>μία φορά</strong> από ήδη
          γνωστές τιμές, με <InlineMath>{'O(1)'}</InlineMath> πράξεις. Σύνολο{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath>.
        </p>
        <p>
          <strong>v.</strong> Ο <InlineMath>{'DA(n)'}</InlineMath>{' '}
          (<InlineMath>{'\\Theta(n)'}</InlineMath>) είναι σαφώς ταχύτερος από τον{' '}
          <InlineMath>{'RA(n)'}</InlineMath>{' '}
          (<InlineMath>{'\\Theta(n^{1.585})'}</InlineMath>) — αυτή ακριβώς είναι η
          αξία της απομνημόνευσης.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask12',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 12 — Αναδρομή vs ΔΠ (εκθετική αναδρομή)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 12',
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Θέλουμε να υπολογίσουμε με αναδρομικό αλγόριθμο την ακολουθία{' '}
          <InlineMath>{'b_1, b_2, \\dots, b_n'}</InlineMath> από τον τύπο
        </p>
        <BlockMath>{'b_n = 2\\max\\{b_{n-1},\\ b_{n-2}\\} + b_{n-3}'}</BlockMath>
        <p>
          με τους 3 αρχικούς όρους ίσους με 1. Έστω{' '}
          <InlineMath>{'RB(n)'}</InlineMath> ο αναδρομικός αλγόριθμος· δίνεται{' '}
          <InlineMath>{'3^{1/3} = 1.44'}</InlineMath>.
        </p>
        <p>
          <strong>i.</strong> Γράψτε σύντομα τον <InlineMath>{'RB(n)'}</InlineMath>.{' '}
          <strong>ii.</strong> Δείξτε ότι είναι εκθετικός, με πολυπλοκότητα{' '}
          <InlineMath>{'\\Omega(1.44^n)'}</InlineMath>. <strong>iii.</strong> Με
          ΔΠ (<InlineMath>{'DB(n)'}</InlineMath>), πόσα υποπροβλήματα;{' '}
          <strong>iv.</strong> Δικαιολογήστε ότι ο{' '}
          <InlineMath>{'DB(n)'}</InlineMath> είναι γραμμικός. <strong>v.</strong>{' '}
          Ποιος είναι ταχύτερος;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Ο <InlineMath>{'RB(n)'}</InlineMath>:</strong> αν{' '}
          <InlineMath>{'n \\le 3'}</InlineMath> επίστρεψε 1· αλλιώς επίστρεψε{' '}
          <InlineMath>{'2\\max(RB(n-1), RB(n-2)) + RB(n-3)'}</InlineMath>.
        </p>
        <p>
          <strong>ii. Γιατί εκθετικός.</strong> Έστω{' '}
          <InlineMath>{'T(n)'}</InlineMath> ο χρόνος. Αφού καλεί τους{' '}
          <InlineMath>{'n-1, n-2, n-3'}</InlineMath>:{' '}
          <InlineMath>{'T(n) = T(n-1)+T(n-2)+T(n-3)+O(1) \\ge 3\\,T(n-3)'}</InlineMath>.
          Ξετυλίγοντας: <InlineMath>{'T(n) \\ge 3^{n/3} \\cdot T(0)'}</InlineMath>,
          και <InlineMath>{'3^{n/3} = (3^{1/3})^n = 1.44^n'}</InlineMath>. Άρα{' '}
          <InlineMath>{'T(n) = \\Omega(1.44^n)'}</InlineMath> — εκθετικός, επειδή
          το ίδιο υποπρόβλημα υπολογίζεται αμέτρητες φορές.
        </p>
        <p>
          <strong>iii. Υποπροβλήματα.</strong> Οι όροι{' '}
          <InlineMath>{'b_1,\\dots,b_n'}</InlineMath> →{' '}
          <strong><InlineMath>{'n'}</InlineMath> υποπροβλήματα</strong>.
        </p>
        <p>
          <strong>iv. Ο <InlineMath>{'DB(n)'}</InlineMath> είναι γραμμικός.</strong>{' '}
          Γεμίζουμε πίνακα <InlineMath>{'n'}</InlineMath> θέσεων αριστερά-δεξιά,
          κάθε <InlineMath>{'b_i'}</InlineMath> μία φορά σε{' '}
          <InlineMath>{'O(1)'}</InlineMath> από τους ήδη γνωστούς{' '}
          <InlineMath>{'b_{i-1}, b_{i-2}, b_{i-3}'}</InlineMath> →{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath>.
        </p>
        <p>
          <strong>v.</strong> Ο <InlineMath>{'DB(n)'}</InlineMath> είναι{' '}
          <em>αστρονομικά</em> ταχύτερος:{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath> έναντι{' '}
          <InlineMath>{'\\Omega(1.44^n)'}</InlineMath>. Η μόνη διαφορά είναι ότι
          ο ΔΠ θυμάται ό,τι υπολόγισε.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask13',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 13 — Συνεχές σακίδιο (άπληστος, βέλτιστος)',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 13',
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <>
        <p>
          Θεωρήστε το <strong>συνεχές</strong> πρόβλημα του σακιδίου:{' '}
          <InlineMath>{'\\max \\sum_{i=1}^{n} c_i x_i'}</InlineMath> με{' '}
          <InlineMath>{'\\sum_{i=1}^{n} a_i x_i \\le b'}</InlineMath> και{' '}
          <InlineMath>{'0 \\le x_i \\le 1'}</InlineMath>, με{' '}
          <InlineMath>{'c_i, a_i, b'}</InlineMath> ακέραιους.
        </p>
        <p>
          <strong>i.</strong> Περιγράψτε άπληστο αλγόριθμο{' '}
          <InlineMath>{'CONKNAPS'}</InlineMath> που επιστρέφει βέλτιστη λύση.{' '}
          <strong>ii.</strong> Πολυπλοκότητα. <strong>iii.</strong> Εφαρμόστε
          στο στιγμιότυπο <InlineMath>{'c=(16,9,7,15,10,1)'}</InlineMath>,{' '}
          <InlineMath>{'a=(8,5,4,9,6,1)'}</InlineMath>,{' '}
          <InlineMath>{'b=12'}</InlineMath>. <strong>iv.</strong> Έχει το 0-1
          σακίδιο πολυωνυμικό αλγόριθμο που επιστρέφει πάντα βέλτιστη λύση;{' '}
          <strong>v.</strong> Ποια η πολυπλοκότητα εύρεσης της βέλτιστης τιμής
          και ποια της δομής της βέλτιστης λύσης με ΔΠ στο 0-1 σακίδιο;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          «Συνεχές» σακίδιο σημαίνει ότι μπορούμε να πάρουμε{' '}
          <strong>κλάσμα</strong> κάθε αντικειμένου. Αυτό αλλάζει τα πάντα: ο
          άπληστος γίνεται βέλτιστος.
        </p>
        <p>
          <strong>i–ii. Αλγόριθμος <InlineMath>{'CONKNAPS'}</InlineMath>.</strong>{' '}
          Υπολόγισε για κάθε αντικείμενο τον λόγο{' '}
          <InlineMath>{'c_i/a_i'}</InlineMath> («αξία ανά μονάδα βάρους»),{' '}
          <InlineMath>{'O(n)'}</InlineMath>· ταξινόμησέ τα κατά{' '}
          <strong>φθίνον λόγο</strong>, <InlineMath>{'O(n\\log n)'}</InlineMath>·
          διέτρεξέ τα παίρνοντας κάθε αντικείμενο <em>ολόκληρο</em> όσο χωράει,
          και το τελευταίο <strong>κλασματικά</strong> για να γεμίσει ακριβώς το{' '}
          <InlineMath>{'b'}</InlineMath>. Σύνολο{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath>. Είναι βέλτιστος (επιχείρημα
          ανταλλαγής): αν αντικαθιστούσαμε λίγη ποσότητα ενός «καλού» λόγου με
          ενός χειρότερου, το κέρδος θα έπεφτε.
        </p>
        <p>
          <strong>iii. Εφαρμογή.</strong> Λόγοι:{' '}
          <InlineMath>{'16/8=2'}</InlineMath>, <InlineMath>{'9/5=1.8'}</InlineMath>,{' '}
          <InlineMath>{'7/4=1.75'}</InlineMath>, <InlineMath>{'15/9\\approx1.67'}</InlineMath>,{' '}
          <InlineMath>{'10/6\\approx1.67'}</InlineMath>,{' '}
          <InlineMath>{'1/1=1'}</InlineMath>. Με{' '}
          <InlineMath>{'b=12'}</InlineMath>: παίρνουμε ολόκληρο το αντικείμενο 1
          (<InlineMath>{'a=8'}</InlineMath>, μένει χώρος 4, κέρδος 16)· έπειτα το{' '}
          αντικείμενο 2 κατά <InlineMath>{'4/5'}</InlineMath>{' '}
          (<InlineMath>{'\\tfrac45\\cdot5=4'}</InlineMath>, κέρδος{' '}
          <InlineMath>{'\\tfrac45\\cdot9=7.2'}</InlineMath>). Συνολικό κέρδος{' '}
          <InlineMath>{'16+7.2 = 23.2'}</InlineMath>.
        </p>
        <p>
          <strong>iv.</strong> Όχι — το 0-1 σακίδιο (όπου{' '}
          <InlineMath>{'x_i \\in \\{0,1\\}'}</InlineMath>) είναι NP-complete, δεν
          έχει γνωστό πολυωνυμικό αλγόριθμο βέλτιστης λύσης.
        </p>
        <p>
          <strong>v.</strong> Με ΔΠ: η βέλτιστη <em>τιμή</em> βρίσκεται σε{' '}
          <InlineMath>{'O(nb)'}</InlineMath> (ψευδοπολυωνυμικό — πίνακας{' '}
          <InlineMath>{'(n+1)\\times(b+1)'}</InlineMath>)· η{' '}
          <em>δομή</em> της λύσης (ποια αντικείμενα) με οπισθοδρόμηση στον πίνακα
          σε <InlineMath>{'O(n)'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-10-ask14',
    title: 'Φροντιστηριακό Σετ #10 · Άσκηση 14 — 0-1 σακίδιο (άπληστος vs ΔΠ)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 14',
    difficulty: 'medium',
    prerequisites: ['lectures/L15-dp-ii'],
    statement: (
      <>
        <p>
          Θεωρήστε το <strong>0-1</strong> πρόβλημα του σακιδίου:{' '}
          <InlineMath>{'\\max \\sum c_i x_i'}</InlineMath> με{' '}
          <InlineMath>{'\\sum a_i x_i \\le b'}</InlineMath> και{' '}
          <InlineMath>{'x_i \\in \\{0,1\\}'}</InlineMath>.
        </p>
        <p>
          <strong>i.</strong> Περιγράψτε άπληστο αλγόριθμο{' '}
          <InlineMath>{'KNAPSACK'}</InlineMath> που επιστρέφει <em>εφικτή</em>{' '}
          λύση. <strong>ii.</strong> Πολυπλοκότητα. <strong>iii.</strong>{' '}
          Εφαρμόστε στο στιγμιότυπο{' '}
          <InlineMath>{'c=(16,9,7,15,10,1)'}</InlineMath>,{' '}
          <InlineMath>{'a=(8,5,4,9,6,1)'}</InlineMath>,{' '}
          <InlineMath>{'b=12'}</InlineMath>. <strong>iv.</strong> Μπορεί να
          επιστρέφει πάντα βέλτιστη λύση και να είναι πολυωνυμικός;{' '}
          <strong>v.</strong> Με ΔΠ, πόσα υποπροβλήματα; Δώστε την αναδρομική
          σχέση.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i–ii. Άπληστος <InlineMath>{'KNAPSACK'}</InlineMath>.</strong>{' '}
          Υπολόγισε τους λόγους <InlineMath>{'c_i/a_i'}</InlineMath>{' '}
          (<InlineMath>{'O(n)'}</InlineMath>), ταξινόμησε κατά φθίνον λόγο{' '}
          (<InlineMath>{'O(n\\log n)'}</InlineMath>), και διέτρεξε τη λίστα: πάρε{' '}
          ένα αντικείμενο <strong>ολόκληρο</strong> αν χωράει στον εναπομείναντα
          χώρο, αλλιώς προσπέρασέ το. Σύνολο{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath>. Επιστρέφει πάντα{' '}
          <em>εφικτή</em> (όχι κατ&apos; ανάγκη βέλτιστη) λύση.
        </p>
        <p>
          <strong>iii. Εφαρμογή.</strong> Λόγοι όπως πριν:{' '}
          <InlineMath>{'2,\\ 1.8,\\ 1.75,\\ 1.67,\\ 1.67,\\ 1'}</InlineMath>. Με{' '}
          <InlineMath>{'b=12'}</InlineMath>: αντικείμενο 1{' '}
          (<InlineMath>{'a=8'}</InlineMath>) χωράει → το παίρνουμε, μένει χώρος 4,
          κέρδος 16· αντικείμενο 2 (<InlineMath>{'a=5 > 4'}</InlineMath>) δεν
          χωράει → προσπερνάμε· αντικείμενο 3 (<InlineMath>{'a=4'}</InlineMath>)
          χωράει → το παίρνουμε, μένει χώρος 0, κέρδος{' '}
          <InlineMath>{'16+7=23'}</InlineMath>. Τέλος. Κέρδος{' '}
          <strong>23</strong> — εφικτή, αλλά όχι βέλτιστη.
        </p>
        <p>
          <strong>iv.</strong> Όχι. Το 0-1 σακίδιο είναι NP-complete· κανένας
          άπληστος (ούτε κανένας γνωστός πολυωνυμικός αλγόριθμος) δεν δίνει πάντα
          τη βέλτιστη λύση.
        </p>
        <p>
          <strong>v. Δυναμικός προγραμματισμός.</strong> Ο πίνακας{' '}
          <InlineMath>{'M'}</InlineMath> έχει <InlineMath>{'(n+1)'}</InlineMath>{' '}
          γραμμές και <InlineMath>{'(b+1)'}</InlineMath> στήλες →{' '}
          <strong><InlineMath>{'(n+1)(b+1)'}</InlineMath> υποπροβλήματα</strong>.
          Με <InlineMath>{'M[i,w]'}</InlineMath> = βέλτιστο κέρδος από τα πρώτα{' '}
          <InlineMath>{'i'}</InlineMath> αντικείμενα με χωρητικότητα{' '}
          <InlineMath>{'w'}</InlineMath>:
        </p>
        <BlockMath>{'M[i,w] = \\begin{cases} M[i-1,w], & a_i > w \\\\ \\max\\{\\,M[i-1,w],\\ \\ M[i-1,w-a_i]+c_i\\,\\}, & a_i \\le w \\end{cases}'}</BlockMath>
        <p>
          με <InlineMath>{'M[0,w]=0'}</InlineMath> και{' '}
          <InlineMath>{'M[i,0]=0'}</InlineMath>. Η απάντηση είναι το{' '}
          <InlineMath>{'M[n,b]'}</InlineMath>· χρόνος{' '}
          <InlineMath>{'O(nb)'}</InlineMath>.
        </p>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #11 (Επαγωγή) — μεταγραμμένο ανά διάλεξη ────────
  {
    id: 'front-set-11-ask1',
    title: 'Φροντιστηριακό Σετ #11 · Άσκηση 1 — Επαγωγή στην αρμονική σειρά',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    difficulty: 'easy',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
    ],
    statement: null,
    solution: null,
  },
  {
    id: 'front-set-11-ask2',
    title: 'Φροντιστηριακό Σετ #11 · Άσκηση 2 — Επαγωγική λύση αναδρομής T(n)',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Έστω <InlineMath>{'T(n) \\le 2\\,T(n/2) + C n'}</InlineMath> για κάποια
          σταθερά <InlineMath>{'C > 0'}</InlineMath>. Να δείξετε με{' '}
          <strong>επαγωγή</strong> ότι{' '}
          <InlineMath>{'T(n) \\le C\\,n\\log n'}</InlineMath> (λογάριθμος βάσης 2),
          για κάθε <InlineMath>{'n \\ge 2'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτή είναι η αναδρομή της <strong>mergesort</strong>: σπάμε στα δύο,
          λύνουμε αναδρομικά, συγχωνεύουμε σε γραμμικό χρόνο{' '}
          <InlineMath>{'Cn'}</InlineMath>. Θέλουμε να επιβεβαιώσουμε το γνωστό
          αποτέλεσμα <InlineMath>{'O(n\\log n)'}</InlineMath> με <strong>μέθοδο
          αντικατάστασης</strong> (μαντεύουμε τη λύση και την αποδεικνύουμε με
          επαγωγή).
        </p>
        <p>
          <strong>Βάση (<InlineMath>{'n=2'}</InlineMath>):</strong> διαλέγουμε τη
          σταθερά <InlineMath>{'C'}</InlineMath> αρκετά μεγάλη ώστε{' '}
          <InlineMath>{'T(2) \\le C\\cdot 2\\cdot\\log 2 = 2C'}</InlineMath>{' '}
          (πάντα εφικτό, αφού το <InlineMath>{'T(2)'}</InlineMath> είναι
          σταθερά).
        </p>
        <p>
          <strong>Επαγωγική υπόθεση (ισχυρή):</strong> έστω ότι{' '}
          <InlineMath>{'T(j) \\le C\\,j\\log j'}</InlineMath> για κάθε{' '}
          <InlineMath>{'2 \\le j < k'}</InlineMath>.
        </p>
        <p>
          <strong>Επαγωγικό βήμα</strong> (για{' '}
          <InlineMath>{'n = k'}</InlineMath>): εφαρμόζουμε την αναδρομή και
          αντικαθιστούμε το <InlineMath>{'T(k/2)'}</InlineMath> με την υπόθεση:
        </p>
        <BlockMath>{'\\begin{aligned} T(k) &\\le 2\\,T(k/2) + Ck \\le 2\\cdot C\\tfrac{k}{2}\\log\\tfrac{k}{2} + Ck \\\\ &= Ck\\,(\\log k - \\log 2) + Ck = Ck\\log k - Ck + Ck = Ck\\log k. \\end{aligned}'}</BlockMath>
        <p>
          Το <InlineMath>{'-Ck'}</InlineMath> από τον λογάριθμο{' '}
          (<InlineMath>{'\\log 2 = 1'}</InlineMath>) ακυρώνεται ακριβώς με το{' '}
          <InlineMath>{'+Ck'}</InlineMath> του κόστους συγχώνευσης — γι&apos;αυτό
          η εικασία <InlineMath>{'Cn\\log n'}</InlineMath> «κλείνει» τέλεια. Άρα{' '}
          <InlineMath>{'T(n) \\le C\\,n\\log n = O(n\\log n)'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-11-ask3',
    title: 'Φροντιστηριακό Σετ #11 · Άσκηση 3 — Σ/Λ ασυμπτωτικού συμβολισμού',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Σωστό ή Λάθος;</p>
        <p>
          <strong>(1)</strong> Αν <InlineMath>{'f(n) = o(g(n))'}</InlineMath>{' '}
          τότε <InlineMath>{'f(n) = O(g(n))'}</InlineMath>.
        </p>
        <p>
          <strong>(2)</strong>{' '}
          <InlineMath>{'\\omega(g(n)) \\cap o(g(n)) = \\emptyset'}</InlineMath>.
        </p>
        <p>
          <strong>(3)</strong> Αν <InlineMath>{'f(n) = O(g(n))'}</InlineMath>{' '}
          τότε <InlineMath>{'\\log f(n) = O(\\log g(n))'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(1) Σωστό.</strong> Το <InlineMath>{'o'}</InlineMath> είναι το
          «αυστηρά μικρότερο»: ο λόγος <InlineMath>{'f/g \\to 0'}</InlineMath>. Το{' '}
          <InlineMath>{'O'}</InlineMath> είναι το «μικρότερο ή ίσο». Το αυστηρό
          συνεπάγεται πάντα το χαλαρό — όπως το{' '}
          <InlineMath>{'<'}</InlineMath> συνεπάγεται το{' '}
          <InlineMath>{'\\le'}</InlineMath>. (Το αντίστροφο{' '}
          <em>δεν</em> ισχύει: <InlineMath>{'n = O(n)'}</InlineMath> αλλά{' '}
          <InlineMath>{'n \\ne o(n)'}</InlineMath>.)
        </p>
        <p>
          <strong>(2) Σωστό.</strong> Το <InlineMath>{'\\omega(g)'}</InlineMath>{' '}
          είναι οι συναρτήσεις αυστηρά <em>μεγαλύτερες</em> από την{' '}
          <InlineMath>{'g'}</InlineMath> (<InlineMath>{'f/g \\to \\infty'}</InlineMath>),
          ενώ το <InlineMath>{'o(g)'}</InlineMath> οι αυστηρά{' '}
          <em>μικρότερες</em> (<InlineMath>{'f/g \\to 0'}</InlineMath>). Μια
          συνάρτηση δεν γίνεται να κάνει και τα δύο — ο λόγος{' '}
          <InlineMath>{'f/g'}</InlineMath> δεν πάει ταυτόχρονα στο{' '}
          <InlineMath>{'0'}</InlineMath> και στο{' '}
          <InlineMath>{'\\infty'}</InlineMath>. Άρα η τομή είναι κενή.
        </p>
        <p>
          <strong>(3) Λάθος (ως έχει).</strong> Από{' '}
          <InlineMath>{'f \\le c\\,g'}</InlineMath> παίρνουμε{' '}
          <InlineMath>{'\\log f \\le \\log c + \\log g'}</InlineMath>. Για να
          είναι αυτό <InlineMath>{'O(\\log g)'}</InlineMath> πρέπει το{' '}
          <InlineMath>{'\\log g'}</InlineMath> να «καταπίνει» τη σταθερά{' '}
          <InlineMath>{'\\log c'}</InlineMath> — δηλαδή να μεγαλώνει. Αν η{' '}
          <InlineMath>{'g'}</InlineMath> είναι μικρή (π.χ. σταθερά κοντά στο 1),
          το <InlineMath>{'\\log g'}</InlineMath> μηδενίζεται και η συνεπαγωγή
          σπάει. <strong>Ισχύει μόνο με την προϋπόθεση{' '}
          <InlineMath>{'g(n) \\ge 2'}</InlineMath></strong> (τελικά για κάθε{' '}
          <InlineMath>{'n \\ge n_0'}</InlineMath>).
        </p>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #12 — μεταγραμμένο ανά διάλεξη ─────────────────
  {
    id: 'front-set-12-ask1',
    title: 'Φροντιστηριακό Σετ #12 · Άσκηση 1 — Σ/Λ ασυμπτωτικού συμβολισμού',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Σωστό ή Λάθος; (αιτιολογήστε)</p>
        <p>
          <strong>(α)</strong> Αν <InlineMath>{'f = O(g)'}</InlineMath> τότε{' '}
          <InlineMath>{'\\log f = O(\\log(c\\cdot g))'}</InlineMath>.
        </p>
        <p>
          <strong>(β)</strong> Αν <InlineMath>{'f = O(g)'}</InlineMath> τότε{' '}
          <InlineMath>{'2^f = O(2^g)'}</InlineMath>.
        </p>
        <p>
          <strong>(γ)</strong> Αν <InlineMath>{'f = o(g)'}</InlineMath> τότε{' '}
          <InlineMath>{'2^f = o(2^g)'}</InlineMath>.
        </p>
        <p>
          <strong>(δ)</strong> Αν <InlineMath>{'f_1 = O(g_1)'}</InlineMath> και{' '}
          <InlineMath>{'f_2 = O(g_2)'}</InlineMath> τότε{' '}
          <InlineMath>{'f_1 + f_2 = O(\\max(g_1, g_2))'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Λάθος (ως έχει).</strong> Από{' '}
          <InlineMath>{'f \\le c\\,g'}</InlineMath> έχουμε{' '}
          <InlineMath>{'\\log f \\le \\log c + \\log g'}</InlineMath>. Αυτό είναι{' '}
          <InlineMath>{'O(\\log g)'}</InlineMath> μόνο όταν το{' '}
          <InlineMath>{'\\log g'}</InlineMath> μεγαλώνει αρκετά ώστε να καλύψει
          τη σταθερά <InlineMath>{'\\log c'}</InlineMath>. <strong>Ισχύει με την
          προϋπόθεση <InlineMath>{'g(n) \\ge 2'}</InlineMath></strong> (τελικά).
        </p>
        <p>
          <strong>(β) Λάθος.</strong> Το ύψωμα σε εκθέτη «μεγεθύνει» τις
          διαφορές. Αντιπαράδειγμα: <InlineMath>{'f(n) = 2n'}</InlineMath>,{' '}
          <InlineMath>{'g(n) = n'}</InlineMath>. Πράγματι{' '}
          <InlineMath>{'f = O(g)'}</InlineMath>, αλλά{' '}
          <InlineMath>{'2^f = 2^{2n} = 4^n'}</InlineMath> ενώ{' '}
          <InlineMath>{'2^g = 2^n'}</InlineMath> — και{' '}
          <InlineMath>{'4^n = \\omega(2^n)'}</InlineMath>, σίγουρα όχι{' '}
          <InlineMath>{'O(2^n)'}</InlineMath>.
        </p>
        <p>
          <strong>(γ) Σωστό.</strong> Το <InlineMath>{'o'}</InlineMath> είναι πολύ
          ισχυρότερο: <InlineMath>{'f = o(g)'}</InlineMath> σημαίνει ότι η{' '}
          διαφορά <InlineMath>{'g - f \\to \\infty'}</InlineMath>. Τότε{' '}
          <InlineMath>{'\\frac{2^f}{2^g} = 2^{f-g} = \\frac{1}{2^{g-f}} \\to 0'}</InlineMath>,
          άρα <InlineMath>{'2^f = o(2^g)'}</InlineMath>.
        </p>
        <p>
          <strong>(δ) Σωστό.</strong> Από{' '}
          <InlineMath>{'f_1 \\le c_1 g_1'}</InlineMath> και{' '}
          <InlineMath>{'f_2 \\le c_2 g_2'}</InlineMath>:
        </p>
        <BlockMath>{'f_1 + f_2 \\le c_1 g_1 + c_2 g_2 \\le (c_1 + c_2)\\cdot\\max(g_1, g_2).'}</BlockMath>
        <p>
          Άρα <InlineMath>{'f_1 + f_2 = O(\\max(g_1, g_2))'}</InlineMath> — όταν
          προσθέτουμε δύο όρους, κυριαρχεί ο μεγαλύτερος.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-12-ask2',
    title: 'Φροντιστηριακό Σετ #12 · Άσκηση 2 — Κατάταξη συναρτήσεων σε τάξεις',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Κατατάξτε τις παρακάτω συναρτήσεις σε αύξουσα σειρά τάξης
          πολυπλοκότητας (ομαδοποιώντας όσες ανήκουν στην ίδια τάξη):
        </p>
        <p>
          <InlineMath>{'9^{500}'}</InlineMath> ·{' '}
          <InlineMath>{'7n'}</InlineMath> · <InlineMath>{'n'}</InlineMath> ·{' '}
          <InlineMath>{'n\\log n'}</InlineMath> ·{' '}
          <InlineMath>{'\\log(n!)'}</InlineMath> · <InlineMath>{'n^2'}</InlineMath> ·{' '}
          <InlineMath>{'7n^2'}</InlineMath> ·{' '}
          <InlineMath>{'\\tfrac{n(n-1)}{2}'}</InlineMath> ·{' '}
          <InlineMath>{'4^{\\log n}'}</InlineMath> ·{' '}
          <InlineMath>{'n^{\\log n}'}</InlineMath> ·{' '}
          <InlineMath>{'\\sum_{k=0}^{n}\\binom{n}{k}'}</InlineMath> ·{' '}
          <InlineMath>{'(n-1)!'}</InlineMath> · <InlineMath>{'n!'}</InlineMath>.
        </p>
        <p>Επιπλέον: γιατί ισχύει <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath>;</p>
      </>
    ),
    solution: (
      <>
        <p>
          Πρώτα <strong>απλοποιούμε</strong> κάθε συνάρτηση ώστε να φανεί η
          πραγματική της τάξη:
        </p>
        <ul>
          <li>
            <InlineMath>{'9^{500}'}</InlineMath> είναι{' '}
            <strong>σταθερά</strong> (τεράστια, αλλά δεν εξαρτάται από το{' '}
            <InlineMath>{'n'}</InlineMath>) → <InlineMath>{'\\Theta(1)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'7n'}</InlineMath> και <InlineMath>{'n'}</InlineMath> →{' '}
            <InlineMath>{'\\Theta(n)'}</InlineMath> (η σταθερά δεν μετράει).
          </li>
          <li>
            <InlineMath>{'n\\log n'}</InlineMath> και{' '}
            <InlineMath>{'\\log(n!)'}</InlineMath> → <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>{' '}
            (βλ. παρακάτω).
          </li>
          <li>
            <InlineMath>{'n^2'}</InlineMath>, <InlineMath>{'7n^2'}</InlineMath>,{' '}
            <InlineMath>{'\\tfrac{n(n-1)}{2}'}</InlineMath> και{' '}
            <InlineMath>{'4^{\\log n} = (2^2)^{\\log n} = n^2'}</InlineMath> →{' '}
            <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'n^{\\log n}'}</InlineMath> → υπερπολυωνυμική, αλλά
            υποεκθετική (ο εκθέτης μεγαλώνει με το{' '}
            <InlineMath>{'n'}</InlineMath>).
          </li>
          <li>
            <InlineMath>{'\\sum_{k=0}^{n}\\binom{n}{k} = 2^n'}</InlineMath>{' '}
            (ταυτότητα του διωνύμου) → <InlineMath>{'\\Theta(2^n)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'(n-1)!'}</InlineMath> και{' '}
            <InlineMath>{'n! = n\\cdot(n-1)!'}</InlineMath> → παραγοντικές, και{' '}
            <strong>διαφορετικής τάξης</strong> μεταξύ τους (ο λόγος{' '}
            <InlineMath>{'n!/(n-1)! = n \\to \\infty'}</InlineMath>).
          </li>
        </ul>
        <p>
          <strong>Τελική κατάταξη (αύξουσα):</strong>
        </p>
        <BlockMath>{'9^{500} \\prec \\{n, 7n\\} \\prec \\{n\\log n,\\ \\log(n!)\\} \\prec \\{n^2, 7n^2, \\tfrac{n(n-1)}{2}, 4^{\\log n}\\} \\prec n^{\\log n} \\prec 2^n \\prec (n-1)! \\prec n!'}</BlockMath>
        <p>
          <strong>Γιατί <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath>.</strong>{' '}
          <em>Άνω φράγμα:</em> <InlineMath>{'n! = 1\\cdot2\\cdots n \\le n\\cdot n\\cdots n = n^n'}</InlineMath>,
          άρα <InlineMath>{'\\log(n!) \\le n\\log n'}</InlineMath>.{' '}
          <em>Κάτω φράγμα:</em> ζευγαρώνουμε τους όρους —{' '}
          <InlineMath>{'(n!)^2 = \\prod_{k=1}^{n} k(n{-}k{+}1)'}</InlineMath>, και
          κάθε ζεύγος ικανοποιεί{' '}
          <InlineMath>{'k(n{-}k{+}1) \\ge n'}</InlineMath>, οπότε{' '}
          <InlineMath>{'(n!)^2 \\ge n^n'}</InlineMath> και{' '}
          <InlineMath>{'\\log(n!) \\ge \\tfrac{n}{2}\\log n'}</InlineMath>.
          Συνδυάζοντας: <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath>.
        </p>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #13 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────
  {
    id: 'front-set-13-ask1',
    title: 'Φροντιστηριακό Σετ #13 · Άσκηση 1 — Πολυπλοκότητα αναδρομικού προγράμματος',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δίνεται το παρακάτω πρόγραμμα. Να βρεθεί η πολυπλοκότητά του ως
          συνάρτηση του <InlineMath>{'n'}</InlineMath>.
        </p>
        <pre className="overflow-x-auto rounded bg-bg-soft p-3 text-sm">{`int two(int n) {
  int sum = 0;
  int i, j;
  if (n == 0)
    return 1;
  else
    for (i = 0; i <= n-1; i++)
      sum = sum + two(i);
}`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          Το πρόγραμμα, για είσοδο <InlineMath>{'n'}</InlineMath>, εκτελεί έναν
          βρόχο που καλεί τον εαυτό του <strong>μία φορά για κάθε</strong>{' '}
          <InlineMath>{'i = 0, 1, \\dots, n-1'}</InlineMath>. Άρα, αν{' '}
          <InlineMath>{'T(n)'}</InlineMath> είναι το πλήθος στοιχειωδών πράξεων:
        </p>
        <BlockMath>{'T(n) = T(0) + T(1) + \\dots + T(n-1)'}</BlockMath>
        <p>
          Γράφουμε την ίδια σχέση για <InlineMath>{'n-1'}</InlineMath>:
        </p>
        <BlockMath>{'T(n-1) = T(0) + T(1) + \\dots + T(n-2)'}</BlockMath>
        <p>
          <strong>Το κόλπο:</strong> αφαιρούμε τη δεύτερη από την πρώτη. Όλοι οι
          κοινοί όροι σβήνονται και μένει{' '}
          <InlineMath>{'T(n) - T(n-1) = T(n-1)'}</InlineMath>, δηλαδή:
        </p>
        <BlockMath>{'T(n) = 2\\,T(n-1)'}</BlockMath>
        <p>
          Αυτή είναι μια αναδρομή που <strong>διπλασιάζεται</strong> σε κάθε βήμα.
          Ξετυλίγοντάς την: <InlineMath>{'T(n) = 2\\,T(n-1) = 2^2\\,T(n-2) = \\dots = 2^n\\,T(0)'}</InlineMath>.
          Αφού για <InlineMath>{'n = 0'}</InlineMath> το πρόγραμμα κάνει σταθερή
          δουλειά, <InlineMath>{'T(0) = \\Theta(1)'}</InlineMath>, και άρα:
        </p>
        <BlockMath>{'T(n) = \\Theta(2^n)'}</BlockMath>
        <p>
          <strong>Συμπέρασμα:</strong> η πολυπλοκότητα είναι{' '}
          <strong>εκθετική</strong>. Ένα φαινομενικά αθώο πρόγραμμα με έναν απλό
          βρόχο γίνεται απαγορευτικά αργό, ακριβώς επειδή κάθε κλήση ξαναϋπολογίζει
          όλες τις προηγούμενες — το ίδιο φαινόμενο επικάλυψης υποπροβλημάτων που
          ο δυναμικός προγραμματισμός θεραπεύει με απομνημόνευση.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-13-ask2',
    title: 'Φροντιστηριακό Σετ #13 · Άσκηση 2 — Γραμμική ομογενής αναδρομή (χαρακτηριστικό πολυώνυμο)',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    problemNumber: 'Άσκηση 2',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Να λυθεί η γραμμική ομογενής αναδρομική σχέση με σταθερούς συντελεστές
        </p>
        <BlockMath>{'t_n = -3\\,t_{n-1} - 3\\,t_{n-2} - t_{n-3}'}</BlockMath>
        <p>
          με αρχικές συνθήκες <InlineMath>{'t_0 = 1'}</InlineMath>,{' '}
          <InlineMath>{'t_1 = -2'}</InlineMath>, <InlineMath>{'t_2 = -1'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Μια αναδρομή της μορφής{' '}
          <InlineMath>{'t_n = c_1 t_{n-1} + \\dots + c_k t_{n-k}'}</InlineMath>{' '}
          έχει αποδειχθεί ότι έχει λύσεις της μορφής{' '}
          <InlineMath>{'t_n = r^n'}</InlineMath>. Αντικαθιστούμε{' '}
          <InlineMath>{'t_n = r^n'}</InlineMath> και διαιρούμε με{' '}
          <InlineMath>{'r^{n-3}'}</InlineMath> για να βρούμε το{' '}
          <strong>χαρακτηριστικό πολυώνυμο</strong>:
        </p>
        <BlockMath>{'r^3 = -3r^2 - 3r - 1 \\;\\Longrightarrow\\; r^3 + 3r^2 + 3r + 1 = 0'}</BlockMath>
        <p>
          Αναγνωρίζουμε το ανάπτυγμα <InlineMath>{'(r+1)^3'}</InlineMath>:
        </p>
        <BlockMath>{'(r+1)^3 = 0 \\;\\Longrightarrow\\; r = -1 \\ \\text{(τριπλή ρίζα)}'}</BlockMath>
        <p>
          <strong>Όταν μια ρίζα έχει πολλαπλότητα</strong>{' '}
          <InlineMath>{'m'}</InlineMath>, δεν αρκεί ο όρος{' '}
          <InlineMath>{'r^n'}</InlineMath> — πρέπει να τον πολλαπλασιάσουμε με{' '}
          <InlineMath>{'n^0, n^1, \\dots, n^{m-1}'}</InlineMath>. Εδώ η ρίζα{' '}
          <InlineMath>{'-1'}</InlineMath> έχει πολλαπλότητα 3, οπότε η γενική
          λύση είναι:
        </p>
        <BlockMath>{'t_n = C_1(-1)^n + C_2\\,n\\,(-1)^n + C_3\\,n^2(-1)^n'}</BlockMath>
        <p>
          <strong>Βρίσκουμε τις σταθερές</strong> από τις αρχικές συνθήκες:
        </p>
        <BlockMath>{'t_0 = 1:\\quad C_1 = 1'}</BlockMath>
        <BlockMath>{'t_1 = -2:\\quad -C_1 - C_2 - C_3 = -2 \\;\\Rightarrow\\; C_2 + C_3 = 1'}</BlockMath>
        <BlockMath>{'t_2 = -1:\\quad C_1 + 2C_2 + 4C_3 = -1 \\;\\Rightarrow\\; 2C_2 + 4C_3 = -2'}</BlockMath>
        <p>
          Λύνοντας το σύστημα <InlineMath>{'C_2 + C_3 = 1'}</InlineMath> και{' '}
          <InlineMath>{'C_2 + 2C_3 = -1'}</InlineMath> παίρνουμε{' '}
          <InlineMath>{'C_3 = -2'}</InlineMath> και{' '}
          <InlineMath>{'C_2 = 3'}</InlineMath>. Άρα η κλειστή μορφή είναι:
        </p>
        <BlockMath>{'t_n = (-1)^n\\,(1 + 3n - 2n^2)'}</BlockMath>
      </>
    ),
  },
  {
    id: 'front-set-13-ask3',
    title: 'Φροντιστηριακό Σετ #13 · Άσκηση 3 — Εφαρμογές του Master Theorem',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    problemNumber: 'Άσκηση 3',
    difficulty: 'easy',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    formulaIds: ['master-theorem'],
    statement: (
      <>
        <p>
          Με χρήση του Master Theorem, να λυθούν οι αναδρομικές σχέσεις:
        </p>
        <BlockMath>{'(\\alpha)\\ \\ T(n) = 9\\,T(n/3) + n \\qquad (\\beta)\\ \\ T(n) = T(2n/3) + 1 \\qquad (\\gamma)\\ \\ T(n) = 3\\,T(n/4) + n\\log n'}</BlockMath>
      </>
    ),
    solution: (
      <>
        <p>
          Το Master Theorem για <InlineMath>{'T(n) = a\\,T(n/b) + f(n)'}</InlineMath>{' '}
          συγκρίνει το <InlineMath>{'f(n)'}</InlineMath> με το{' '}
          <InlineMath>{'n^{\\log_b a}'}</InlineMath>.
        </p>
        <p>
          <strong>(α) <InlineMath>{'T(n) = 9\\,T(n/3) + n'}</InlineMath>.</strong>{' '}
          Εδώ <InlineMath>{'a = 9'}</InlineMath>, <InlineMath>{'b = 3'}</InlineMath>,
          άρα <InlineMath>{'n^{\\log_3 9} = n^2'}</InlineMath>. Το{' '}
          <InlineMath>{'f(n) = n'}</InlineMath> είναι πολυωνυμικά{' '}
          <em>μικρότερο</em> από το <InlineMath>{'n^2'}</InlineMath> (1η περίπτωση
          — κυριαρχούν τα φύλλα του δέντρου αναδρομής). Άρα{' '}
          <InlineMath>{'T(n) = \\Theta(n^2)'}</InlineMath>.
        </p>
        <p>
          <strong>(β) <InlineMath>{'T(n) = T(2n/3) + 1'}</InlineMath>.</strong>{' '}
          Εδώ <InlineMath>{'a = 1'}</InlineMath>,{' '}
          <InlineMath>{'b = 3/2'}</InlineMath>, άρα{' '}
          <InlineMath>{'n^{\\log_{3/2} 1} = n^0 = 1'}</InlineMath>. Το{' '}
          <InlineMath>{'f(n) = 1 = \\Theta(n^{\\log_b a})'}</InlineMath> (2η
          περίπτωση — ισορροπία). Άρα{' '}
          <InlineMath>{'T(n) = \\Theta(\\log n)'}</InlineMath> — ακριβώς η
          συμπεριφορά της δυαδικής αναζήτησης.
        </p>
        <p>
          <strong>(γ) <InlineMath>{'T(n) = 3\\,T(n/4) + n\\log n'}</InlineMath>.</strong>{' '}
          Εδώ <InlineMath>{'a = 3'}</InlineMath>, <InlineMath>{'b = 4'}</InlineMath>,
          άρα <InlineMath>{'n^{\\log_4 3} \\approx n^{0.79}'}</InlineMath>. Το{' '}
          <InlineMath>{'f(n) = n\\log n'}</InlineMath> είναι πολυωνυμικά{' '}
          <em>μεγαλύτερο</em> (3η περίπτωση — κυριαρχεί η ρίζα). Ελέγχουμε και τη
          συνθήκη κανονικότητας:{' '}
          <InlineMath>{'3 \\cdot \\tfrac{n}{4}\\log\\tfrac{n}{4} \\le c \\cdot n\\log n'}</InlineMath>{' '}
          ισχύει π.χ. για <InlineMath>{'c = 3/4'}</InlineMath>. Άρα{' '}
          <InlineMath>{'T(n) = \\Theta(n\\log n)'}</InlineMath>.
        </p>
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 2024 / 2025 ΕΞΕΤΑΣΤΙΚΕΣ — υψηλή προτεραιότητα
  // ═══════════════════════════════════════════════════════════════════════
  // ── Ιούνιος 2025 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt1-th1-q1',
    title: 'Ιούνιος 2025 · Θέμα 1.1 — Σύγκριση σταθερών συναρτήσεων',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.1',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = \\log_n n'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = 4'}</InlineMath>, κύκλωσε ποιες από τις παρακάτω
          σχέσεις ισχύουν:
        </p>
        <p>
          (i) <InlineMath>{'f = O(g)'}</InlineMath> · (ii){' '}
          <InlineMath>{'f = o(g)'}</InlineMath> · (iii){' '}
          <InlineMath>{'f = \\Omega(g)'}</InlineMath> · (iv){' '}
          <InlineMath>{'f = \\omega(g)'}</InlineMath> · (v){' '}
          <InlineMath>{'f = \\Theta(g)'}</InlineMath> · (vi) οι{' '}
          <InlineMath>{'f, g'}</InlineMath> είναι μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πρώτα ξεκαθαρίζουμε τι είναι κάθε συνάρτηση. Ο{' '}
          <InlineMath>{'\\log_n n'}</InlineMath> είναι «σε ποια δύναμη υψώνω το{' '}
          <InlineMath>{'n'}</InlineMath> για να πάρω <InlineMath>{'n'}</InlineMath>;»
          — η απάντηση είναι πάντα <strong>1</strong>. Άρα{' '}
          <InlineMath>{'f(n) = 1'}</InlineMath> για κάθε <InlineMath>{'n > 1'}</InlineMath>.
          Και <InlineMath>{'g(n) = 4'}</InlineMath>. Έχουμε δηλαδή <strong>δύο
          θετικές σταθερές</strong>.
        </p>
        <p>
          Δύο σταθερές είναι πάντα «του ίδιου μεγέθους» ασυμπτωτικά:{' '}
          <InlineMath>{'1 \\le 1 \\cdot 4'}</InlineMath> δίνει{' '}
          <InlineMath>{'f = O(g)'}</InlineMath>, και{' '}
          <InlineMath>{'1 \\ge \\tfrac14 \\cdot 4'}</InlineMath> δίνει{' '}
          <InlineMath>{'f = \\Omega(g)'}</InlineMath>. Αφού ισχύουν και τα δύο,
          ισχύει και <InlineMath>{'f = \\Theta(g)'}</InlineMath>.
        </p>
        <p>
          Το <InlineMath>{'o'}</InlineMath> και το <InlineMath>{'\\omega'}</InlineMath>{' '}
          είναι «αυστηρά»: απαιτούν ο λόγος <InlineMath>{'f/g'}</InlineMath> να
          πηγαίνει στο <InlineMath>{'0'}</InlineMath> ή στο{' '}
          <InlineMath>{'\\infty'}</InlineMath>. Εδώ ο λόγος είναι σταθερά{' '}
          <InlineMath>{'1/4'}</InlineMath> — δεν πάει πουθενά. Άρα{' '}
          <strong>όχι</strong> <InlineMath>{'o'}</InlineMath>, <strong>όχι</strong>{' '}
          <InlineMath>{'\\omega'}</InlineMath>.
        </p>
        <p>
          <strong>Σωστές: (i), (iii), (v).</strong>
        </p>
        <p>
          Δες πώς δουλεύουν οι πέντε «κουμπιά» πάνω στις δύο σταθερές —
          ο λόγος <InlineMath>{'1/4'}</InlineMath> κάθεται μόνιμα ανάμεσα,
          αρνείται να φύγει στο 0 ή στο ∞:
        </p>
        <AsymptoticVerdictExplorer preset="pt1-th1-q1" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης για σταθερές.</strong> Όταν και οι δύο
          συναρτήσεις είναι θετικές σταθερές (ή απλοποιούνται σε σταθερές),
          ισχύουν αυτόματα <strong>O, Ω, Θ</strong> — και αυτόματα{' '}
          <strong>όχι o, όχι ω</strong>. Η ταυτότητα{' '}
          <InlineMath>{'\\log_n n = 1'}</InlineMath> είναι το «δόλωμα» που
          μετατρέπει το πρόβλημα σε αυτή την τετριμμένη περίπτωση.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q2',
    title: 'Ιούνιος 2025 · Θέμα 1.2 — Πολυωνυμικό vs υπερπολυωνυμικό',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.2',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = 2^{\\log_2 n}'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = n^{\\log_2 n}'}</InlineMath>, κύκλωσε ποιες σχέσεις
          ισχύουν: (i) <InlineMath>{'O'}</InlineMath> · (ii){' '}
          <InlineMath>{'o'}</InlineMath> · (iii) <InlineMath>{'\\Omega'}</InlineMath>{' '}
          · (iv) <InlineMath>{'\\omega'}</InlineMath> · (v){' '}
          <InlineMath>{'\\Theta'}</InlineMath> · (vi) μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το κόλπο εδώ είναι να <strong>απλοποιήσουμε</strong> πριν συγκρίνουμε.
          Το <InlineMath>{'2^{\\log_2 n}'}</InlineMath> είναι «2 υψωμένο στη
          δύναμη που γυρνάει πίσω το <InlineMath>{'n'}</InlineMath>» — δηλαδή{' '}
          <InlineMath>{'f(n) = n'}</InlineMath>. Απλό πολυώνυμο.
        </p>
        <p>
          Το <InlineMath>{'g(n) = n^{\\log_2 n}'}</InlineMath> έχει{' '}
          <strong>εκθέτη που μεγαλώνει</strong> μαζί με το{' '}
          <InlineMath>{'n'}</InlineMath>. Για <InlineMath>{'n = 1024'}</InlineMath>{' '}
          είναι <InlineMath>{'n^{10}'}</InlineMath>· για μεγαλύτερο{' '}
          <InlineMath>{'n'}</InlineMath> ο εκθέτης ανεβαίνει κι άλλο. Είναι{' '}
          <strong>υπερπολυωνυμική</strong> — ξεπερνά κάθε σταθερή δύναμη του{' '}
          <InlineMath>{'n'}</InlineMath>.
        </p>
        <p>
          Άρα το <InlineMath>{'g'}</InlineMath> «τρέχει» πολύ πιο γρήγορα από το{' '}
          <InlineMath>{'f'}</InlineMath>: ο λόγος{' '}
          <InlineMath>{'f/g = n / n^{\\log_2 n} \\to 0'}</InlineMath>. Αυτό
          σημαίνει <InlineMath>{'f = o(g)'}</InlineMath> — και το{' '}
          <InlineMath>{'o'}</InlineMath> συνεπάγεται πάντα και το{' '}
          <InlineMath>{'O'}</InlineMath>.
        </p>
        <p>
          <strong>Σωστές: (i), (ii).</strong>
        </p>
        <p>
          Δες το ρυθμό αύξησης πραγματικά: η <InlineMath>{'n'}</InlineMath> και η{' '}
          <InlineMath>{'n^{\\log n}'}</InlineMath> πλάι-πλάι, ο λόγος καταρρέει.
        </p>
        <AsymptoticVerdictExplorer preset="pt1-th1-q2" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: απλοποίησε ΠΡΙΝ συγκρίνεις.</strong> Όροι
          όπως <InlineMath>{'2^{\\log_2 n}'}</InlineMath>,{' '}
          <InlineMath>{'\\log(n^k)'}</InlineMath>, ή{' '}
          <InlineMath>{'\\log_a b'}</InlineMath> κρύβουν την πραγματική τάξη
          τους. Πρώτη κίνηση πάντα: ξεμπλέκεις τις ταυτότητες, μετά μπαίνεις
          στη σύγκριση. Εδώ <InlineMath>{'f = n'}</InlineMath> και{' '}
          <InlineMath>{'g = n^{\\log n}'}</InlineMath> — μια απλή «πολυωνυμικό
          vs υπερ-πολυωνυμικό» μάχη, αλλά μόνο αφού καθαρίσει η αριστερή πλευρά.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q3',
    title: 'Ιούνιος 2025 · Θέμα 1.3 — Άγνωστος εκθέτης',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.3',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = n^{1 + \\tan\\varphi}'}</InlineMath>, με{' '}
          <InlineMath>{'\\varphi \\in [0, 2\\pi]'}</InlineMath>, και{' '}
          <InlineMath>{'g(n) = n^2'}</InlineMath>, κύκλωσε ποιες σχέσεις ισχύουν:
          (i) <InlineMath>{'O'}</InlineMath> · (ii) <InlineMath>{'o'}</InlineMath>{' '}
          · (iii) <InlineMath>{'\\Omega'}</InlineMath> · (iv){' '}
          <InlineMath>{'\\omega'}</InlineMath> · (v) <InlineMath>{'\\Theta'}</InlineMath>{' '}
          · (vi) μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Η παγίδα είναι το <InlineMath>{'\\tan\\varphi'}</InlineMath>. Καθώς το{' '}
          <InlineMath>{'\\varphi'}</InlineMath> διατρέχει το{' '}
          <InlineMath>{'[0, 2\\pi]'}</InlineMath>, η εφαπτομένη παίρνει{' '}
          <strong>όλες τις πραγματικές τιμές</strong> — από{' '}
          <InlineMath>{'-\\infty'}</InlineMath> έως <InlineMath>{'+\\infty'}</InlineMath>{' '}
          (εκτοξεύεται κοντά στα <InlineMath>{'\\pi/2'}</InlineMath> και{' '}
          <InlineMath>{'3\\pi/2'}</InlineMath>).
        </p>
        <p>
          Άρα ο εκθέτης <InlineMath>{'1 + \\tan\\varphi'}</InlineMath> μπορεί να
          είναι <strong>οποιοσδήποτε πραγματικός αριθμός</strong>. Η{' '}
          <InlineMath>{'f'}</InlineMath> θα μπορούσε να είναι{' '}
          <InlineMath>{'n^{0.3}'}</InlineMath> (πολύ πιο αργή από{' '}
          <InlineMath>{'n^2'}</InlineMath>), ή <InlineMath>{'n^2'}</InlineMath>{' '}
          (ίδια), ή <InlineMath>{'n^{100}'}</InlineMath> (πολύ πιο γρήγορη).
        </p>
        <p>
          Αφού δεν μας δίνεται το <InlineMath>{'\\varphi'}</InlineMath>,{' '}
          <strong>καμία</strong> από τις σχέσεις (i)–(v) δεν ισχύει σίγουρα. Δεν
          μπορούμε να κατατάξουμε τις δύο συναρτήσεις χωρίς να ξέρουμε τον
          εκθέτη: <strong>σωστή είναι η (vi) — μη-συγκρίσιμες</strong> (με την
          έννοια ότι η σχέση τους είναι απροσδιόριστη).
        </p>
        <p>
          Σύρε το <InlineMath>{'\\varphi'}</InlineMath> και κοίτα τα verdicts να
          αλλάζουν: όταν περνά τα κρίσιμα <InlineMath>{'\\varphi'}</InlineMath>{' '}
          (όπου ο εκθέτης ισούται με 2), όλα τα chips κάνουν «flip». Η εκφώνηση
          δεν εγγυάται καμία συγκεκριμένη φ — άρα καμία σχέση δεν ισχύει σίγουρα.
        </p>
        <AsymptoticVerdictExplorer preset="pt1-th1-q3" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «παράμετρος που μπορεί να πάρει κάθε τιμή»</strong> →
          αυτόματο σήμα ότι η σχέση δεν είναι μονοσήμαντη. Η{' '}
          <InlineMath>{'\\tan\\varphi'}</InlineMath> είναι το κλασικό όχημα γι' αυτό:
          διατρέχει όλο το <InlineMath>{'\\mathbb{R}'}</InlineMath> καθώς το{' '}
          <InlineMath>{'\\varphi'}</InlineMath> διατρέχει το{' '}
          <InlineMath>{'[0, 2\\pi]'}</InlineMath>. Η σωστή απάντηση είναι
          «μη-συγκρίσιμες» — όχι «δεν ξέρω».
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q4',
    title: 'Ιούνιος 2025 · Θέμα 1.4 — Αναδρομή T(n) = T(√n) + 1',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.4',
    weight: 3,
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'T(n) = T(\\sqrt{n}) + 1'}</InlineMath>, κύκλωσε ποια
          ισχύουν:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'T(n) \\in o(n)'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'T(n) \\in O(1)'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'T(n) \\in o(2^n)'}</InlineMath>
          </li>
          <li>
            (iv) <InlineMath>{'T(n) \\in O(\\log_2 \\log_2 n)'}</InlineMath>
          </li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          Πρώτο σήμα: εμφανίζεται <InlineMath>{'\\sqrt{n}'}</InlineMath> στο
          όρισμα — Master Theorem δεν εφαρμόζεται κατευθείαν, χρειάζεται{' '}
          <strong>αλλαγή μεταβλητής</strong>. Το κλασικό κόλπο: θέτουμε{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'m = \\log_2 n'}</InlineMath>. Τότε{' '}
          <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath> και, με{' '}
          <InlineMath>{'S(m) = T(2^m)'}</InlineMath>, η αναδρομή γίνεται απλή:
        </p>
        <BlockMath>{'S(m) = S(m/2) + 1.'}</BlockMath>
        <p>
          Δες κάθε στάδιο της λύσης:
        </p>
        <RecurrenceSubstitution preset="pt1-th1-q4" />
        <p>
          Το ωραίο είναι ότι η νέα <InlineMath>{'S(m)'}</InlineMath> είναι αυτή
          ακριβώς της δυαδικής αναζήτησης: κάθε βήμα{' '}
          <strong>υποδιπλασιάζει</strong> το <InlineMath>{'m'}</InlineMath> και
          προσθέτει <InlineMath>{'1'}</InlineMath>· συνολικά{' '}
          <InlineMath>{'\\log_2 m'}</InlineMath> βήματα. Άρα{' '}
          <InlineMath>{'S(m) = \\Theta(\\log m)'}</InlineMath>, και
          επιστρέφοντας στο <InlineMath>{'n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\Theta(\\log m) = \\Theta(\\log\\log n).'}</BlockMath>
        <p>
          Το <InlineMath>{'\\log\\log n'}</InlineMath> μεγαλώνει{' '}
          <strong>εξαιρετικά αργά</strong> — για{' '}
          <InlineMath>{'n = 2^{64}'}</InlineMath> είναι 6. Ελέγχουμε:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'o(n)'}</InlineMath> ✓ (πολύ μικρότερο)
          </li>
          <li>
            (ii) <InlineMath>{'O(1)'}</InlineMath> ✗ (μεγαλώνει, σιγά αλλά
            μεγαλώνει)
          </li>
          <li>
            (iii) <InlineMath>{'o(2^n)'}</InlineMath> ✓
          </li>
          <li>
            (iv) <InlineMath>{'O(\\log_2\\log_2 n)'}</InlineMath> ✓ (ακριβώς η
            τάξη του)
          </li>
        </ul>
        <p>
          <strong>Σωστές: (i), (iii), (iv).</strong>
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «ρίζα στο όρισμα ⇒ θέτω n = 2ᵐ».</strong>{' '}
          Όποτε δεις <InlineMath>{'T(\\sqrt{n})'}</InlineMath> στην αναδρομή,
          αντικατάστησε <InlineMath>{'n = 2^m'}</InlineMath>· η ρίζα γίνεται
          υποδιπλασιασμός, Master Theorem εφαρμόζεται, και στο τέλος επιστρέφεις{' '}
          <InlineMath>{'m = \\log n'}</InlineMath>. Το χαρακτηριστικό σήμα στην
          απάντηση είναι ένα <strong>«διπλό log»</strong>:{' '}
          <InlineMath>{'\\log\\log n'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q5',
    title: 'Ιούνιος 2025 · Θέμα 1.5 — Master Theorem',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.5',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    formulaIds: ['master-theorem'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'T(n) = 2T(n/2) + n'}</InlineMath>, κύκλωσε ποια
          ισχύουν:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'O(n\\log_2 n)'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'o(n)'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'O(n)'}</InlineMath>
          </li>
          <li>
            (iv) <InlineMath>{'o(n^3)'}</InlineMath>
          </li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτή είναι η πιο κλασική αναδρομή — ταυτόσημη με τη{' '}
          <strong>συγχωνευτική ταξινόμηση</strong>. Master Theorem με{' '}
          <InlineMath>{'a = 2'}</InlineMath>, <InlineMath>{'b = 2'}</InlineMath>,{' '}
          <InlineMath>{'f(n) = n^1'}</InlineMath> (άρα d = 1). Συγκρίνουμε{' '}
          <InlineMath>{'d = 1'}</InlineMath> με{' '}
          <InlineMath>{'\\log_b a = \\log_2 2 = 1'}</InlineMath>: είναι{' '}
          <strong>ίσα</strong> — Περίπτωση 2. Δες το ζωντανά:
        </p>
        <RecurrenceClassifier preset="pt1-th1-q5" />
        <p>
          Η Περίπτωση 2 δίνει <InlineMath>{'T(n) = \\Theta(n \\log n)'}</InlineMath>:
          το δέντρο αναδρομής έχει <InlineMath>{'\\log_2 n'}</InlineMath> επίπεδα
          και κάθε επίπεδο κάνει συνολικά <InlineMath>{'\\Theta(n)'}</InlineMath>{' '}
          δουλειά (όπως στο σχήμα ράβδων που μένουν ίσες).
        </p>
        <p>Ελέγχουμε:</p>
        <ul>
          <li>
            (i) <InlineMath>{'O(n\\log n)'}</InlineMath> ✓
          </li>
          <li>
            (ii) <InlineMath>{'o(n)'}</InlineMath> ✗ —{' '}
            <InlineMath>{'n\\log n > n'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'O(n)'}</InlineMath> ✗ — ίδιος λόγος
          </li>
          <li>
            (iv) <InlineMath>{'o(n^3)'}</InlineMath> ✓ —{' '}
            <InlineMath>{'n\\log n \\ll n^3'}</InlineMath>
          </li>
        </ul>
        <p>
          <strong>Σωστές: (i), (iv).</strong>
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «η αναδρομή της mergesort».</strong> Όποτε δεις{' '}
          <InlineMath>{'2T(n/2) + n'}</InlineMath>, η απάντηση είναι{' '}
          <strong>πάντα</strong> <InlineMath>{'\\Theta(n\\log n)'}</InlineMath> —{' '}
          Master Theorem περίπτωση 2. Δεν χρειάζεται να ξεδιπλώσεις τίποτα: είναι
          η πιο κοινή αναδρομή του μαθήματος.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q6',
    title: 'Ιούνιος 2025 · Θέμα 1.6 — Άπληστο κριτήριο του Dijkstra',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.6',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Με ποιο άπληστο κριτήριο λειτουργεί ο αλγόριθμος του Dijkstra;</p>
        <p>
          (i) Επιλογή συντομότερου γείτονα από την τελευταία ακμή που
          προστέθηκε · (ii) Επιλογή της κορυφής με τη μικρότερη απόσταση από την
          αφετηρία · (iii) Επιλογή ακμής ελάχιστου βάρους σε μία δεδομένη τομή ·
          (iv) Επιλογή του συντομότερου σε πλήθος ακμών μονοπατιού.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Φαντάσου το κύμα.</strong> Ο Dijkstra είναι «κύμα από την{' '}
          <InlineMath>{'s'}</InlineMath>»: σε κάθε βήμα ακουμπάει την επόμενη
          πιο κοντινή κορυφή <em>συνολικά</em> από την αφετηρία, και την
          κλειδώνει για πάντα. Άρα κάθε φορά διαλέγει την κορυφή με τη{' '}
          <strong>μικρότερη τρέχουσα συνολική απόσταση</strong>{' '}
          <InlineMath>{'d(v)'}</InlineMath>.
        </p>
        <p>
          Πώς ξεχωρίζει από τα γειτονικά της αλγορίθμους; Καθένα από τα άλλα
          τρία κριτήρια ανήκει σε <em>άλλο</em> αλγόριθμο:
        </p>
        <ul>
          <li>
            (i) «συντομότερος γείτονας από την τελευταία ακμή» — μυωπική κίνηση
            που δεν αντιστοιχεί σε γνωστό αλγόριθμο· ο Dijkstra δεν κρατάει
            «τελευταία ακμή», κοιτάει όλη την απόσταση από την{' '}
            <InlineMath>{'s'}</InlineMath>.
          </li>
          <li>
            (iii) «ελάχιστη ακμή σε μία τομή» — κριτήριο του <strong>Prim</strong>{' '}
            (ΕΕΔ). Prim και Dijkstra μοιάζουν επικίνδυνα, αλλά το κλειδί στην
            ουρά αλλάζει: ο Prim κρατά «<em>μίας</em> ακμής κόστος προς το
            δέντρο», ο Dijkstra «<em>όλης</em> της διαδρομής από την s».
          </li>
          <li>
            (iv) «λιγότερες ακμές» — το <strong>BFS</strong>, που αγνοεί τα βάρη.
            Σωστό μόνο όταν όλα τα βάρη είναι ίσα.
          </li>
        </ul>
        <p>
          <strong>Σωστή: (ii).</strong>
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «ποιο κλειδί έχει η ουρά;».</strong> Όταν Σ/Λ
            ή πολλαπλή επιλογή ρωτά για κριτήριο σε ζυγισμένο γράφημα, γράψε
            δίπλα σε κάθε όνομα το κλειδί του: Dijkstra ↔{' '}
            <InlineMath>{'d[s] + \\ell'}</InlineMath> (συσσωρευτικό), Prim ↔{' '}
            <InlineMath>{'c(e)'}</InlineMath> (μόνο η μία ακμή), BFS ↔ ακμές
            (αγνοεί βάρη), Kruskal ↔ ταξινομημένη λίστα ακμών. Η σωστή απάντηση
            πέφτει μόνη της.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q7',
    title: 'Ιούνιος 2025 · Θέμα 1.7 — Πολυπλοκότητα δισδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.7',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Λύνουμε ένα πρόβλημα με δυναμικό προγραμματισμό συμπληρώνοντας έναν
          πίνακα με τιμές <InlineMath>{'\\text{OPT}(i,j)'}</InlineMath>, για{' '}
          <InlineMath>{'i = 1\\dots n'}</InlineMath> και{' '}
          <InlineMath>{'j = 1\\dots m'}</InlineMath>. Ποια από τα παρακάτω
          μπορούμε να πούμε με <strong>βεβαιότητα</strong> ότι{' '}
          <strong>δεν</strong> αντικατοπτρίζει τη χρονική πολυπλοκότητα;
        </p>
        <p>
          (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(mn)'}</InlineMath> · (iii){' '}
          <InlineMath>{'o(m^2 n^2)'}</InlineMath> · (iv){' '}
          <InlineMath>{'O(mn^2)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα σε μια γραμμή:</strong> ο πίνακας έχει{' '}
          <InlineMath>{'n \\cdot m'}</InlineMath> κελιά. Για να «λύσει» το
          πρόβλημα ο αλγόριθμος, πρέπει να γεμίσει <em>όλα</em> — δεν υπάρχει
          τρόπος να αποφύγει κανένα, γιατί δεν ξέρει εκ των προτέρων ποιο
          κελί θα χρειαστεί η τελική απάντηση. Άρα κάνει{' '}
          <strong>τουλάχιστον</strong>{' '}
          <InlineMath>{'n \\cdot m'}</InlineMath> πράξεις, δηλαδή{' '}
          <InlineMath>{'\\Omega(n \\cdot m)'}</InlineMath>.
        </p>
        <p>
          Από εκεί και πέρα κάθε υποψήφια εκφραστική «δηλώνει» έναν άνω
          φραγμό. Ο άνω φραγμός είναι συμβατός μόνο αν είναι{' '}
          <strong>μεγαλύτερος ή ίσος</strong> από αυτό το κατώφλι. Σύρε τα
          n, m και δες ποιες από τις τέσσερις επιλογές πέφτουν κάτω από το
          n·m:
        </p>
        <DPTableLowerBound preset="pt1-th1-q7" />
        <p>
          Από την εικόνα: μόνο το <InlineMath>{'O(n)'}</InlineMath> πέφτει
          κάτω από το κατώφλι (όταν <InlineMath>{'m > 1'}</InlineMath>, που
          είναι η ενδιαφέρουσα περίπτωση). Άρα{' '}
          <InlineMath>{'O(n)'}</InlineMath> <em>αποκλείεται με βεβαιότητα</em>:
          δεν έχεις χρόνο να αγγίξεις καν τα <InlineMath>{'n \\cdot m'}</InlineMath>{' '}
          κελιά. Τα άλλα τρία:
        </p>
        <ul>
          <li>
            <InlineMath>{'O(mn)'}</InlineMath>: ακριβώς στο κατώφλι — π.χ. αν
            κάθε κελί γεμίζει σε <InlineMath>{'O(1)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'o(m^2 n^2)'}</InlineMath>: η κλάση «αυστηρά μικρότερο
            από <InlineMath>{'m^2 n^2'}</InlineMath>» περιέχει το{' '}
            <InlineMath>{'O(mn)'}</InlineMath>, άρα ζει εύλογα πάνω από το
            κατώφλι.
          </li>
          <li>
            <InlineMath>{'O(mn^2)'}</InlineMath>: ψηλά πάνω από{' '}
            <InlineMath>{'mn'}</InlineMath> — εύλογο αν κάθε κελί θέλει{' '}
            <InlineMath>{'O(n)'}</InlineMath> δουλειά.
          </li>
        </ul>
        <p>
          <strong>Σωστή: (i).</strong>
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — το κατώφλι ενός πίνακα DP.</strong> Όταν
            το πρόβλημα ζητάει «ποια χρονική πολυπλοκότητα ΔΕΝ ταιριάζει σε
            έναν πίνακα DP <InlineMath>{'n \\times m'}</InlineMath>;»,{' '}
            <em>χωρίς να δίνει την αναδρομή</em>:
          </p>
          <ol className="ml-4 list-decimal space-y-1 text-sm">
            <li>
              Γράψε το πλήθος κελιών: <InlineMath>{'n \\cdot m'}</InlineMath>{' '}
              (ή <InlineMath>{'n'}</InlineMath> σε μονοδιάστατο). Αυτό είναι το{' '}
              <strong>κάτω φράγμα</strong>{' '}
              <InlineMath>{'\\Omega(n \\cdot m)'}</InlineMath>.
            </li>
            <li>
              Σύγκρινε κάθε υποψήφια κλάση με το κατώφλι. Ό,τι είναι{' '}
              <em>ασυμπτωτικά μικρότερο</em> είναι αδύνατο, ό,τι ≥ είναι
              εύλογο.
            </li>
            <li>
              Μην παρασύρεσαι από το <InlineMath>{'o'}</InlineMath> μικρό vs το{' '}
              <InlineMath>{'O'}</InlineMath> κεφαλαίο — ρώτα μόνο «μπορεί
              αυτή η κλάση να περιέχει κάτι ≥ <InlineMath>{'nm'}</InlineMath>;».
            </li>
          </ol>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q8',
    title: 'Ιούνιος 2025 · Θέμα 1.8 — Πολυπλοκότητα μονοδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.8',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Όμοια, λύνουμε ένα πρόβλημα με DP συμπληρώνοντας έναν πίνακα τιμών{' '}
          <InlineMath>{'\\text{OPT}(i)'}</InlineMath> για{' '}
          <InlineMath>{'i = 1\\dots n'}</InlineMath>. Ποια μπορούμε να πούμε με
          βεβαιότητα ότι <strong>δεν</strong> αντικατοπτρίζει τη χρονική
          πολυπλοκότητα;
        </p>
        <p>
          (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(n^2)'}</InlineMath> · (iii){' '}
          <InlineMath>{'O(1)'}</InlineMath> · (iv){' '}
          <InlineMath>{'O(\\log_2 n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Ίδιο μοτίβο, μία διάσταση.</strong> Ο πίνακας έχει τώρα{' '}
          <InlineMath>{'n'}</InlineMath> κελιά. Όλα πρέπει να γεμίσουν — άρα{' '}
          <InlineMath>{'\\Omega(n)'}</InlineMath> είναι το κατώφλι. Ό,τι είναι{' '}
          ασυμπτωτικά μικρότερο από <InlineMath>{'n'}</InlineMath> αποκλείεται
          αυτόματα.
        </p>
        <DPTableLowerBound preset="pt1-th1-q8" />
        <p>
          Από την εικόνα: το <InlineMath>{'O(1)'}</InlineMath> (σταθερός χρόνος)
          και το <InlineMath>{'O(\\log_2 n)'}</InlineMath> είναι και τα δύο
          ασυμπτωτικά μικρότερα από <InlineMath>{'n'}</InlineMath>· δεν
          προλαβαίνεις σε σταθερό ή λογαριθμικό χρόνο να αγγίξεις{' '}
          <InlineMath>{'n'}</InlineMath> κελιά. Τα{' '}
          <InlineMath>{'O(n)'}</InlineMath> και{' '}
          <InlineMath>{'O(n^2)'}</InlineMath> είναι πιθανά (το πρώτο αν κάθε
          κελί κάνει <InlineMath>{'O(1)'}</InlineMath> δουλειά, το δεύτερο αν
          κάνει <InlineMath>{'O(n)'}</InlineMath>).
        </p>
        <p>
          <strong>Σωστές: (iii) και (iv).</strong>
        </p>
        <Callout type="intuition">
          <strong>Το μοτίβο:</strong> «μέγεθος πίνακα = κάτω φράγμα». Στο 1D
          είναι <InlineMath>{'\\Omega(n)'}</InlineMath>, στο 2D{' '}
          <InlineMath>{'\\Omega(nm)'}</InlineMath>, στο 3D{' '}
          <InlineMath>{'\\Omega(nmp)'}</InlineMath> — και κάθε υποψήφια
          πολυπλοκότητα που πέφτει κάτω από αυτό απορρίπτεται αμέσως. Σταθερός
          (<InlineMath>{'O(1)'}</InlineMath>) και λογαριθμικός (
          <InlineMath>{'O(\\log n)'}</InlineMath>) είναι κλασικές παγίδες,
          γιατί μοιάζουν «πιθανοί» — αλλά είναι αδύνατο να γεμίσεις πίνακα{' '}
          <InlineMath>{'n'}</InlineMath> κελιών σε λιγότερο από{' '}
          <InlineMath>{'n'}</InlineMath> βήματα.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q9',
    title: 'Ιούνιος 2025 · Θέμα 1.9 — Προβλήματα εκτός P (αν P ≠ NP)',
    topic: 'intro',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.9',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>
          Εάν <InlineMath>{'P \\neq NP'}</InlineMath>, ποια από τα παρακάτω{' '}
          <strong>δεν</strong> ανήκουν στο <InlineMath>{'P'}</InlineMath>;
        </p>
        <p>
          (i) Κωδικοποίηση Huffman · (ii) Συντομότερο Μονοπάτι · (iii) Μακρύτερο
          Μονοπάτι · (iv) Ικανοποιησιμότητα Λογικών Προτάσεων (SAT).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το <InlineMath>{'P'}</InlineMath> είναι τα προβλήματα που λύνονται σε{' '}
          <strong>πολυωνυμικό χρόνο</strong>. Πάμε ένα-ένα:
        </p>
        <ul>
          <li>
            <strong>Huffman:</strong> έχουμε άπληστο αλγόριθμο{' '}
            <InlineMath>{'O(n\\log n)'}</InlineMath> — ανήκει στο{' '}
            <InlineMath>{'P'}</InlineMath>.
          </li>
          <li>
            <strong>Συντομότερο μονοπάτι:</strong> Dijkstra / Bellman-Ford,
            πολυωνυμικοί — ανήκει στο <InlineMath>{'P'}</InlineMath>.
          </li>
          <li>
            <strong>Μακρύτερο μονοπάτι:</strong> είναι NP-δύσκολο. Δεν ξέρουμε
            πολυωνυμικό αλγόριθμο, και αν <InlineMath>{'P \\neq NP'}</InlineMath>{' '}
            <strong>δεν</strong> ανήκει στο <InlineMath>{'P'}</InlineMath>.
          </li>
          <li>
            <strong>SAT:</strong> το «πρώτο» NP-πλήρες πρόβλημα. Αν{' '}
            <InlineMath>{'P \\neq NP'}</InlineMath>, <strong>δεν</strong> ανήκει
            στο <InlineMath>{'P'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
        <p>
          Δες τη θέση του καθενός στον ζωολογικό κήπο — πρόσεξε ιδιαίτερα το
          ζευγάρι «συντομότερο vs μακρύτερο μονοπάτι»: μοιάζουν, αλλά ζουν σε
          εντελώς διαφορετικές ζώνες.
        </p>
        <ComplexityZooLab focus="longest-path" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης για τέτοιες εκφωνήσεις.</strong> Για κάθε όνομα
          προβλήματος ρώτα τρία πράγματα, με τη σειρά: (1) «ξέρω πολυωνυμικό
          αλγόριθμο γι' αυτό;» — αν ναι, είναι στο <InlineMath>{'P'}</InlineMath>.
          (2) «είναι κλασικό NP-πλήρες που έχω συναντήσει;» (SAT, Vertex Cover,
          Knapsack, Hamilton, TSP, Longest Path) — αν ναι, εκτός P (υπό την
          εικασία <InlineMath>{'P \\neq NP'}</InlineMath>). (3) Αλλιώς,
          προσοχή: μπορεί να είναι «στο NP αλλά άγνωστης κατάστασης» — Graph
          Isomorphism, Integer Factorization. Πρόσεξε το μοτίβο «συντομότερο =
          εύκολο, μακρύτερο = δύσκολο»: αλλάζεις λέξη, αλλάζεις ζώνη.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th1-q10',
    title: 'Ιούνιος 2025 · Θέμα 1.10 — Γνωστά NP-πλήρη προβλήματα',
    topic: 'intro',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 1.10',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>Ποια από τα παρακάτω προβλήματα γνωρίζουμε ότι είναι NP-πλήρη;</p>
        <p>
          (i) Ισομορφισμός Γραφημάτων · (ii) Ικανοποιησιμότητα Λογικών
          Προτάσεων (SAT) · (iii) Παραγοντοποίηση Ακεραίων · (iv) Κύκλος
          Hamilton.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          «NP-πλήρες» σημαίνει: είναι στο <InlineMath>{'NP'}</InlineMath>{' '}
          <strong>και</strong> είναι από τα πιο δύσκολα του{' '}
          <InlineMath>{'NP'}</InlineMath> (κάθε άλλο πρόβλημα του{' '}
          <InlineMath>{'NP'}</InlineMath> ανάγεται σε αυτό). Δεν αρκεί απλώς «να
          είναι στο NP» — αυτό ισχύει για όλα τα παραπάνω.
        </p>
        <ul>
          <li>
            <strong>Ισομορφισμός γραφημάτων:</strong> είναι στο{' '}
            <InlineMath>{'NP'}</InlineMath>, αλλά <strong>δεν</strong> ξέρουμε αν
            είναι NP-πλήρες — πιστεύεται ότι δεν είναι. Παγίδα.
          </li>
          <li>
            <strong>SAT:</strong> το αρχετυπικό NP-πλήρες (θεώρημα Cook-Levin).
            ✓
          </li>
          <li>
            <strong>Παραγοντοποίηση ακεραίων:</strong> στο{' '}
            <InlineMath>{'NP'}</InlineMath>, αλλά δεν είναι γνωστό ότι είναι
            NP-πλήρες — γι' αυτό στηρίζεται και η κρυπτογραφία RSA. Παγίδα.
          </li>
          <li>
            <strong>Κύκλος Hamilton:</strong> κλασικό NP-πλήρες πρόβλημα. ✓
          </li>
        </ul>
        <p>
          <strong>Σωστές: (ii), (iv).</strong>
        </p>
        <p>
          Οι δύο παγίδες — Ισομορφισμός Γραφημάτων και Παραγοντοποίηση
          Ακεραίων — ζουν στην <strong>μεσαία</strong> ζώνη του κήπου: στο NP,
          αλλά άγνωστο αν είναι σε P ή NP-πλήρη. Δες πού:
        </p>
        <ComplexityZooLab focus="graph-iso" />
        <Callout type="warning">
          <strong>«Στο NP» ≠ «NP-πλήρες».</strong> Όλα τα NP-πλήρη είναι στο
          NP, αλλά το NP περιέχει και ολόκληρο το P, και τη μεσαία ζώνη των
          «άγνωστων». Όταν η εκφώνηση ρωτά «ποια <em>γνωρίζουμε</em> ότι είναι
          NP-πλήρη», η απάντηση πρέπει να αποκλείει και τα γνωστά-P (Huffman,
          shortest path, MST) και τα «άγνωστα» (Graph Iso, Integer Factor) —
          ακόμη κι αν τα δεύτερα δεν τα ξέρουμε σε P.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th2-a',
    title: 'Ιούνιος 2025 · Θέμα 2.1 — Ανίχνευση αρνητικού κύκλου',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 2.1',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L17-dp-iv'],
    statement: (
      <p>
        Ποιον αλγόριθμο χρησιμοποιούμε για να αποφασίσουμε αν ένα κατευθυνόμενο
        γράφημα έχει αρνητικό κύκλο; (Αρκεί να τον αναφέρεις ονομαστικά.)
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Ο αλγόριθμος Bellman-Ford</strong> — αλλά με ένα μικρό «κόλπο».
        </p>
        <p>
          <strong>Η ιδέα σε μία γραμμή.</strong> Η αναδρομή του Bellman-Ford
          ορίζει <InlineMath>{'\\text{OPT}(i, v)'}</InlineMath> = το συντομότερο{' '}
          <InlineMath>{'v\\to t'}</InlineMath> μονοπάτι που χρησιμοποιεί{' '}
          <strong>το πολύ <InlineMath>{'i'}</InlineMath> ακμές</strong> (
          <a href="/lectures/L17-dp-iv" className="underline">L17</a>). Αν δεν
          υπάρχει αρνητικός κύκλος, η συντομότερη διαδρομή είναι{' '}
          <em>απλή</em>, οπότε έχει το πολύ{' '}
          <InlineMath>{'n - 1'}</InlineMath> ακμές. Συμπέρασμα: η γραμμή{' '}
          <InlineMath>{'M[n-1, \\cdot]'}</InlineMath> πρέπει να είναι ίδια με την{' '}
          <InlineMath>{'M[n, \\cdot]'}</InlineMath> — γιατί ο εξτρά γύρος δεν
          έχει τι παραπάνω να βρει.
        </p>
        <p>
          <strong>Το κόλπο.</strong> Τρέξε <strong>έναν εξτρά γύρο</strong>{' '}
          (συνολικά <InlineMath>{'n'}</InlineMath>). Αν στον γύρο αυτόν κάποια
          τιμή <strong>μειώνεται ξανά</strong>, ο πίνακας ΔΕΝ συγκλίνει —
          υπάρχει μια κορυφή που γλιστράει σε κύκλο και μαζεύει «δωρεάν»
          μειώσεις κάθε φορά. Δηλαδή υπάρχει αρνητικός κύκλος προσβάσιμος προς
          το <InlineMath>{'t'}</InlineMath>. Αλλιώς, ο πίνακας είναι σταθερός
          και δεν υπάρχει.
        </p>
        <p>
          Εναλλάξτε τις δύο καρτέλες και πατήστε «Επόμενος γύρος» μέχρι τον
          γύρο ελέγχου. Στο «Χωρίς αρνητικό κύκλο» η γραμμή <InlineMath>{'i = n'}</InlineMath>{' '}
          είναι πανομοιότυπη με την <InlineMath>{'i = n - 1'}</InlineMath>· στο
          «Με αρνητικό κύκλο» η γραμμή <InlineMath>{'i = n'}</InlineMath>{' '}
          ΑΛΛΑΖΕΙ τιμή — και αυτό είναι το σήμα:
        </p>
        <NegativeCycleDetector />
        <p>
          <strong>Γιατί όχι Dijkstra;</strong> Ο Dijkstra (
          <a href="/lectures/L09-graphs-iv" className="underline">L09</a>)
          προϋποθέτει θετικά βάρη — «κλειδώνει» μια κορυφή μόλις την εξάγει.
          Μια αρνητική ακμή σπάει αυτή τη δέσμευση (δες{' '}
          <a href="/lectures/L17-dp-iv#%CE%B3%CE%B9%CE%B1%CF%84%CE%AF-%CE%BF-dijkstra-%CE%B1%CF%80%CE%BF%CF%84%CF%85%CE%B3%CF%87%CE%AC%CE%BD%CE%B5%CE%B9" className="underline">DijkstraNegFail</a>).
          Άρα ο Dijkstra ούτε καν τρέχει σωστά στο γράφημα — πόσο μάλλον να
          αποφασίσει αν υπάρχει αρνητικός κύκλος.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «έξτρα γύρος = ανιχνευτής».</strong>{' '}
            Όποτε σου ζητούν να αποφασίσεις αν υπάρχει αρνητικός κύκλος, η
            απάντηση είναι Bellman-Ford με <InlineMath>{'n'}</InlineMath> (όχι{' '}
            <InlineMath>{'n - 1'}</InlineMath>) γύρους. Το διαγνωστικό:{' '}
            <em>«μετά τους <InlineMath>{'n-1'}</InlineMath> γύρους ο πίνακας
            πρέπει να έχει συγκλίνει — αν δεν έχει, υπάρχει αρνητικός
            κύκλος»</em>. Σε εξετάσεις περιγράφεις το κόλπο με 2-3 γραμμές +
            πολυπλοκότητα <InlineMath>{'\\Theta(mn)'}</InlineMath> — και τελείωσες.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th2-b',
    title: 'Ιούνιος 2025 · Θέμα 2.2 — Πλήθος ελάχιστων συνδετικών δέντρων',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 2.2',
    weight: 11,
    difficulty: 'hard',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Δίνεται το παρακάτω μη-κατευθυνόμενο γράφημα με 6 κορυφές{' '}
          <InlineMath>{'A, B, C, D, E, F'}</InlineMath> και ακμές (με τα βάρη
          τους):
        </p>
        <ul>
          <li><InlineMath>{'C - D = 1'}</InlineMath></li>
          <li><InlineMath>{'B - E = 3'}</InlineMath></li>
          <li><InlineMath>{'A - C = 5'}</InlineMath></li>
          <li><InlineMath>{'A - B = 5'}</InlineMath></li>
          <li><InlineMath>{'C - B = 5'}</InlineMath></li>
          <li><InlineMath>{'D - E = 5'}</InlineMath></li>
          <li><InlineMath>{'D - F = 10'}</InlineMath></li>
        </ul>
        <p>
          (α΄) Πόσα διαφορετικά ελάχιστα επικαλύπτοντα δέντρα (ΕΕΔ) έχει το
          γράφημα; (β΄) Σχεδίασε τα διαφορετικά ΕΕΔ (αν υπάρχουν).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα σε μία γραμμή.</strong> Με διακριτά βάρη το ΕΕΔ είναι
          μοναδικό· μόλις εμφανιστούν <strong>ισοβαθμίες</strong>, ο Kruskal
          βρίσκεται σε <em>πραγματική επιλογή</em> και κάθε ανεξάρτητη επιλογή
          πολλαπλασιάζει το πλήθος των διαφορετικών ΕΕΔ. Άρα η συνταγή είναι:
          (α) βρες τι μπαίνει υποχρεωτικά, (β) μέτρα τις πραγματικές επιλογές
          στις ισόβαθμες ακμές.
        </p>
        <p>
          <strong>Βήμα 1 — οι 3 υποχρεωτικές ακμές.</strong> Σαρώνοντας με Kruskal:
        </p>
        <ul>
          <li>
            <InlineMath>{'C\\text{-}D = 1'}</InlineMath> — η φθηνότερη συνολικά,
            μπαίνει πάντα.
          </li>
          <li>
            <InlineMath>{'B\\text{-}E = 3'}</InlineMath> — η αμέσως επόμενη, δεν
            κλείνει κύκλο, μπαίνει πάντα.
          </li>
          <li>
            <InlineMath>{'D\\text{-}F = 10'}</InlineMath> — γέφυρα: η μόνη ακμή
            που αγγίζει την <InlineMath>{'F'}</InlineMath>. Χωρίς αυτήν η F
            αποκόπτεται, οπότε ανήκει σε κάθε ΕΕΔ.
          </li>
        </ul>
        <p>
          Με 3 σίγουρες ακμές, το γράφημα χωρίζεται σε τρεις «νησίδες»:{' '}
          <InlineMath>{'\\{A\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{C,D,F\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{B,E\\}'}</InlineMath>. Χρειαζόμαστε 2 ακόμα ακμές για
          να γίνουν δέντρο.
        </p>
        <p>
          <strong>Βήμα 2 — οι ισοβαθμίες.</strong> Οι 4 υπόλοιπες ακμές{' '}
          <InlineMath>{'A\\text{-}C, A\\text{-}B, C\\text{-}B, D\\text{-}E'}</InlineMath>{' '}
          έχουν όλες βάρος 5. Από τα 6 πιθανά ζευγάρια ακμών, ποια ενώνουν και
          τις 3 νησίδες χωρίς κύκλο; Κλικ σε κάθε ζεύγος:
        </p>
        <MstCountingExplorer />
        <p>
          <strong>Συμπέρασμα.</strong> 5 διαφορετικά ΕΕΔ, όλα με συνολικό κόστος{' '}
          <InlineMath>{'1 + 3 + 10 + 5 + 5 = 24'}</InlineMath>. Το άκυρο ζεύγος{' '}
          <InlineMath>{'\\{C\\text{-}B, D\\text{-}E\\}'}</InlineMath> ενώνει τις
          ίδιες δύο νησίδες δύο φορές και αφήνει την{' '}
          <InlineMath>{'A'}</InlineMath> αποκομμένη.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «υποχρεωτικά πρώτα, μετά οι ισοβαθμίες».</strong>{' '}
            Σε προβλήματα πλήθους ΕΕΔ: τρέξε Kruskal, βρες τις ακμές που μπαίνουν
            μονοσήμαντα (μοναδικά ελαφρύτερες σε μια τομή, γέφυρες), αναγνώρισε
            τις «νησίδες» που μένουν, και μέτρα μόνο τα έγκυρα ζευγάρια ακμών
            ίδιου βάρους που τις ενώνουν. Αυτό το «μέτρα τις επιλογές» κάνει
            το πρόβλημα συνδυαστικό — όχι «τρέξε άπληστο».
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th3',
    title: 'Ιούνιος 2025 · Θέμα 3 — Επίσκεψη αξιοθέατων (DP)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 3',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Θέλουμε να επισκεφτούμε μία ακολουθία από{' '}
          <InlineMath>{'n'}</InlineMath> αξιοθέατα{' '}
          <InlineMath>{'\\alpha_1, \\alpha_2, \\dots, \\alpha_n'}</InlineMath> σε
          μία πόλη. Οι μόνες επιλογές μετακίνησης είναι <strong>ταξί</strong> ή{' '}
          <strong>ηλεκτρικό πατίνι</strong>, του οποίου η μίσθωση ισχύει για{' '}
          <strong>4 διαδρομές</strong>. Με ταξί, η μετάβαση από το{' '}
          <InlineMath>{'\\alpha_{i-1}'}</InlineMath> στο{' '}
          <InlineMath>{'\\alpha_i'}</InlineMath> κοστίζει{' '}
          <InlineMath>{'c_i'}</InlineMath> (η μετάβαση στο πρώτο αξιοθέατο είναι
          δωρεάν). Η ενοικίαση πατινιού κοστίζει σταθερά{' '}
          <InlineMath>{'S'}</InlineMath>. Ορίζουμε{' '}
          <InlineMath>{'\\text{OPT}(i)'}</InlineMath> = το ελάχιστο κόστος για να
          επισκεφθούμε τα <InlineMath>{'\\alpha_1, \\dots, \\alpha_i'}</InlineMath>.
        </p>
        <p>
          (i) Ποια τιμή δίνει το ελάχιστο συνολικό κόστος; (ii) Όρισε αναδρομικά
          το <InlineMath>{'\\text{OPT}(i)'}</InlineMath>. (iii) Ποια είναι η
          χρονική πολυπλοκότητα και γιατί;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πριν τον τύπο, δες την ίδια σκηνή από τρεις γωνίες. n = 5 αξιοθέατα,
          σταθερό κόμιστρο <InlineMath>{'c_i = 4'}</InlineMath>, μίσθωση πατινιού{' '}
          <InlineMath>{'S = 10'}</InlineMath>. Πάτα τα τρία κουμπιά:
        </p>
        <SightseeingScene />
        <p>
          Η «μόνο ταξί» και η «μόνο πατίνι» καταλήγουν τυχαία στο ίδιο σύνολο
          κόστος (20), αλλά για εντελώς διαφορετικό λόγο: η ταξί πληρώνει ομοιόμορφα,
          η πατίνι σπαταλά την τελευταία μίσθωση. Η <em>μικτή</em> κερδίζει επειδή
          αναγνωρίζει ποια διαδρομή είναι «οικονομικότερη ως ταξί» και ποια «ως
          τμήμα μιας μίσθωσης». Η αναδρομή που έπεται απλά αυτοματοποιεί αυτή την
          απόφαση σε κάθε βήμα.
        </p>
        <p>
          <strong>(i)</strong> Θέλουμε να έχουμε επισκεφθεί <em>όλα</em> τα
          αξιοθέατα, δηλαδή μέχρι το <InlineMath>{'\\alpha_n'}</InlineMath>. Άρα
          η ζητούμενη τιμή είναι{' '}
          <strong>
            <InlineMath>{'\\text{OPT}(n)'}</InlineMath>
          </strong>
          .
        </p>
        <p>
          <strong>(ii) Πώς θα τη βρούμε.</strong> Στεκόμαστε στο{' '}
          <InlineMath>{'\\alpha_i'}</InlineMath> και ρωτάμε{' '}
          <em>πώς ήρθα εδώ;</em> Η <strong>τελευταία απόφαση</strong> είναι μόνο
          δύο επιλογές — και αυτό είναι το ζητούμενο για τη σχέση αναδρομής:
        </p>
        <ul>
          <li>
            <strong>🚖 Ταξί στο τελευταίο βήμα.</strong> Πλήρωσα{' '}
            <InlineMath>{'c_i'}</InlineMath> για το βήμα{' '}
            <InlineMath>{'\\alpha_{i-1} \\to \\alpha_i'}</InlineMath>, και πριν
            είχα λύσει βέλτιστα το πρόβλημα ως το{' '}
            <InlineMath>{'\\alpha_{i-1}'}</InlineMath>. Κόστος:{' '}
            <InlineMath>{'\\text{OPT}(i-1) + c_i'}</InlineMath>.
          </li>
          <li>
            <strong>🛴 Ένα ενοικιασμένο πατίνι.</strong> Μία μίσθωση καλύπτει
            έως 4 διαδρομές — οπότε αν το τελευταίο πατίνι με έφερε ως το{' '}
            <InlineMath>{'\\alpha_i'}</InlineMath>, ξεκίνησε στο{' '}
            <InlineMath>{'\\alpha_{i-4}'}</InlineMath>. Πλήρωσα σταθερά{' '}
            <InlineMath>{'S'}</InlineMath>, και πριν είχα λύσει βέλτιστα ως
            εκεί. Κόστος: <InlineMath>{'\\text{OPT}(i-4) + S'}</InlineMath>.
          </li>
        </ul>
        <p>
          Δεν ξέρουμε ποια απόφαση είναι η φθηνότερη — οπότε{' '}
          <strong>παίρνουμε το ελάχιστο</strong>:
        </p>
        <BlockMath>{'\\text{OPT}(i) = \\begin{cases} 0 & i = 0 \\\\ \\min\\{\\, \\text{OPT}(i-1) + c_i,\\ \\ \\text{OPT}(\\max(0,\\,i-4)) + S \\,\\} & i \\ge 1 \\end{cases}'}</BlockMath>
        <p>
          Το <InlineMath>{'\\max(0, i-4)'}</InlineMath> διορθώνει την πρώτη
          τετράδα αξιοθέατων: αν είσαι π.χ. στο{' '}
          <InlineMath>{'\\alpha_3'}</InlineMath>, ένα πατίνι από την αρχή
          κοστίζει απλώς <InlineMath>{'S'}</InlineMath>.
        </p>
        <p>
          <strong>Δες την αναδρομή να τρέχει.</strong> Στιγμιότυπο:{' '}
          <InlineMath>{'n = 5'}</InlineMath>, σταθερό κόμιστρο{' '}
          <InlineMath>{'c_i = 4'}</InlineMath>, μίσθωση πατινιού{' '}
          <InlineMath>{'S = 10'}</InlineMath>. Σε κάθε βήμα συγκρίνονται τα δύο
          βέλη — το κοντό ταξί (+4) και το μακρύ πατίνι (+10) — και κερδίζει το
          μικρότερο:
        </p>
        <SightseeingDP />
        <p>
          Το αποτέλεσμα: <InlineMath>{'\\text{OPT}(5) = 14'}</InlineMath>, με
          ένα πατίνι από <InlineMath>{'\\alpha_0'}</InlineMath> ως{' '}
          <InlineMath>{'\\alpha_4'}</InlineMath> (κόστος 10) και ένα ταξί για το
          τελευταίο βήμα <InlineMath>{'\\alpha_4 \\to \\alpha_5'}</InlineMath>{' '}
          (κόστος 4). Σύγκρινε με «μόνο ταξί»{' '}
          <InlineMath>{'5 \\cdot 4 = 20'}</InlineMath>: το πατίνι κερδίζει
          ξεκάθαρα, και η αναδρομή το βρίσκει χωρίς να δοκιμάσει χειροκίνητα
          συνδυασμούς.
        </p>
        <p>
          <strong>(iii) Πολυπλοκότητα.</strong> Έχουμε{' '}
          <InlineMath>{'n + 1'}</InlineMath> υποπροβλήματα{' '}
          <InlineMath>{'\\text{OPT}(0), \\dots, \\text{OPT}(n)'}</InlineMath>,
          και το καθένα υπολογίζεται σε <strong>σταθερό χρόνο</strong>{' '}
          <InlineMath>{'O(1)'}</InlineMath> — ένα{' '}
          <InlineMath>{'\\min'}</InlineMath> δύο ήδη υπολογισμένων τιμών. Άρα
          συνολικά{' '}
          <strong>
            <InlineMath>{'\\Theta(n)'}</InlineMath>
          </strong>{' '}
          — γραμμικός χρόνος.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «πώς ήρθα εδώ;».</strong> Όταν το πρόβλημα
          έχει μια <em>μικρή σταθερή πινακίδα επιλογών</em> για το{' '}
          <strong>τελευταίο βήμα</strong> (εδώ: ταξί ή πατίνι), η αναδρομή
          γράφεται σχεδόν μόνη της: για κάθε επιλογή, «πλήρωσα τοπικό κόστος +
          έλυσα βέλτιστα ό,τι έμεινε πριν». Παίρνεις min ή max. Το «πατίνι
          καλύπτει 4 διαδρομές» γίνεται «πήδα 4 θέσεις πίσω» —{' '}
          <em>η δομή του προβλήματος γίνεται δείκτης πίνακα</em>.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt1-th4',
    title: 'Ιούνιος 2025 · Θέμα 4 — Γρήγορη ύψωση σε δύναμη',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'Θέμα 4',
    weight: 25,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Σχεδίασε έναν αποδοτικό αλγόριθμο που, δοσμένων δύο θετικών ακεραίων{' '}
        <InlineMath>{'m'}</InlineMath> και <InlineMath>{'n'}</InlineMath>,
        υπολογίζει την τιμή <InlineMath>{'m^n'}</InlineMath>, και αιτιολόγησε την
        ορθότητα και την πολυπλοκότητά του. Για ευκολία θεώρησε ότι{' '}
        <InlineMath>{'n = 2^k'}</InlineMath> και ότι το γινόμενο δύο ακεραίων
        γίνεται σε σταθερό χρόνο.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Η αφελής λύση.</strong> Πολλαπλασίασε το{' '}
          <InlineMath>{'m'}</InlineMath> με τον εαυτό του{' '}
          <InlineMath>{'n-1'}</InlineMath> φορές → <InlineMath>{'O(n)'}</InlineMath>.
          Δουλεύει — αλλά είναι σπατάλη.
        </p>
        <p>
          <strong>Η ιδέα «διαίρει και κυρίευε»: τετραγώνισε αντί να
          πολλαπλασιάσεις.</strong> Παρατήρησε ότι
        </p>
        <BlockMath>{'m^n = m^{n/2} \\cdot m^{n/2} = \\bigl(m^{n/2}\\bigr)^2.'}</BlockMath>
        <p>
          Αν ξέρω το <InlineMath>{'m^{n/2}'}</InlineMath>, το{' '}
          <InlineMath>{'m^n'}</InlineMath> προκύπτει με <strong>έναν μόνο</strong>{' '}
          πολλαπλασιασμό. Όχι «το υπολογίζω δύο φορές» — το υπολογίζω{' '}
          <em>μία φορά</em> και το τετραγωνίζω. Δες τη διαφορά κλίμακας
          σπρώχνοντας το slider:
        </p>
        <FastExponentiation />
        <p>
          <strong>Ο αλγόριθμος.</strong>
        </p>
        <BlockMath>{'\\text{Power}(m, n) = \\begin{cases} 1 & n = 0 \\\\ \\bigl(\\text{Power}(m, n/2)\\bigr)^2 & n > 0 \\end{cases}'}</BlockMath>
        <p>
          <strong>Ορθότητα.</strong> Επαγωγή στο{' '}
          <InlineMath>{'n'}</InlineMath>. Βάση: <InlineMath>{'n = 0'}</InlineMath>,{' '}
          <InlineMath>{'m^0 = 1'}</InlineMath> ✓. Επαγωγικό βήμα: υποθέτουμε ότι
          η κλήση <InlineMath>{'\\text{Power}(m, n/2)'}</InlineMath> επιστρέφει
          σωστά το <InlineMath>{'m^{n/2}'}</InlineMath>· τότε η συνάρτηση
          επιστρέφει το τετράγωνό του, <InlineMath>{'(m^{n/2})^2 = m^n'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Μία αναδρομική κλήση στο μισό{' '}
          <InlineMath>{'n'}</InlineMath> + ένας <InlineMath>{'O(1)'}</InlineMath>{' '}
          πολλαπλασιασμός:
        </p>
        <BlockMath>{'T(n) = T(n/2) + O(1) \\;\\Longrightarrow\\; T(n) = O(\\log n).'}</BlockMath>
        <p>
          Από <InlineMath>{'O(n)'}</InlineMath> σε{' '}
          <InlineMath>{'O(\\log n)'}</InlineMath>: για{' '}
          <InlineMath>{'n = 10^6'}</InlineMath>, από ένα εκατομμύριο
          πολλαπλασιασμούς σε <strong>περίπου 20</strong>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «τετραγώνισε αντί να πολλαπλασιάσεις».</strong>{' '}
          Όποτε ζητείται «αποδοτικός υπολογισμός μιας δύναμης / στοιχείου σε
          γρήγορη πτώση», ψάξε για ταυτότητα της μορφής{' '}
          <InlineMath>{'f(n) = g(f(n/2))'}</InlineMath> με σταθερό κόστος{' '}
          <InlineMath>{'g'}</InlineMath>. Παραδείγματα: ύψωση σε δύναμη, ύψωση
          πίνακα σε δύναμη (για γρήγορο Fibonacci), modular exponentiation στην
          κρυπτογραφία.
        </Callout>
      </>
    ),
  },
  // ── Σεπτέμβριος 2025 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt2-th1-q1',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.1 — Άθροισμα τετραγώνων vs n²log n',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.1',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = \\sum_{i=1}^{n} i^2'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = n^2 \\log_2 n'}</InlineMath>, κύκλωσε ποιες
          σχέσεις ισχύουν: (i) <InlineMath>{'O'}</InlineMath> · (ii){' '}
          <InlineMath>{'o'}</InlineMath> · (iii) <InlineMath>{'\\Omega'}</InlineMath>{' '}
          · (iv) <InlineMath>{'\\omega'}</InlineMath> · (v){' '}
          <InlineMath>{'\\Theta'}</InlineMath> · (vi) μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πρώτα κλείνουμε το άθροισμα. Υπάρχει γνωστός τύπος:
        </p>
        <BlockMath>{'\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}.'}</BlockMath>
        <p>
          Αν δεν τον θυμάσαι, αρκεί η διαίσθηση: προσθέτεις{' '}
          <InlineMath>{'n'}</InlineMath> όρους, ο μεγαλύτερος είναι{' '}
          <InlineMath>{'n^2'}</InlineMath>, άρα το άθροισμα είναι «κάπου ανάμεσα
          σε <InlineMath>{'n^2'}</InlineMath> και <InlineMath>{'n \\cdot n^2'}</InlineMath>»
          — και πράγματι βγαίνει <InlineMath>{'f(n) = \\Theta(n^3)'}</InlineMath>.
        </p>
        <p>
          Άρα συγκρίνουμε <InlineMath>{'n^3'}</InlineMath> με{' '}
          <InlineMath>{'g(n) = n^2 \\log n'}</InlineMath>. Διαιρώντας:{' '}
          <InlineMath>{'n^3 / (n^2 \\log n) = n / \\log n \\to \\infty'}</InlineMath>.
          Το <InlineMath>{'n'}</InlineMath> νικάει εύκολα τον λογάριθμο, οπότε το{' '}
          <InlineMath>{'f'}</InlineMath> μεγαλώνει <strong>αυστηρά πιο γρήγορα</strong>.
        </p>
        <p>
          Αυτό σημαίνει <InlineMath>{'f = \\omega(g)'}</InlineMath> (αυστηρά
          μεγαλύτερο), το οποίο συνεπάγεται και{' '}
          <InlineMath>{'f = \\Omega(g)'}</InlineMath>.{' '}
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
        <AsymptoticVerdictExplorer preset="pt2-th1-q1" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: άθροισμα → κλείστος τύπος (ή φράγμα).</strong>{' '}
          Πριν συγκρίνεις, βάζε το άθροισμα σε «αναγνωρίσιμη» μορφή. Τα τρία
          πιο χρήσιμα κλειστά: <InlineMath>{'\\sum i = \\Theta(n^2)'}</InlineMath>,{' '}
          <InlineMath>{'\\sum i^2 = \\Theta(n^3)'}</InlineMath>,{' '}
          <InlineMath>{'\\sum 1/k = \\Theta(\\log n)'}</InlineMath>. Αν δεν θυμάσαι
          τον τύπο, φράξε: το άθροισμα n όρων με μέγιστο M είναι μεταξύ M και nM.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q2',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.2 — Αρμονικό άθροισμα vs log log n',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.2',
    weight: 3,
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Αν <InlineMath>{'f(n) = \\sum_{k=1}^{n} \\tfrac{1}{k}'}</InlineMath> και{' '}
        <InlineMath>{'g(n) = \\log_2\\!\\bigl(\\sqrt{\\log_2 n}\\bigr)'}</InlineMath>,
        κύκλωσε ποιες σχέσεις ισχύουν: (i) <InlineMath>{'O'}</InlineMath> · (ii){' '}
        <InlineMath>{'o'}</InlineMath> · (iii) <InlineMath>{'\\Omega'}</InlineMath>{' '}
        · (iv) <InlineMath>{'\\omega'}</InlineMath> · (v){' '}
        <InlineMath>{'\\Theta'}</InlineMath> · (vi) μη-συγκρίσιμες.
      </p>
    ),
    solution: (
      <>
        <p>
          Δύο «τρομακτικές» εκφράσεις — αλλά απλοποιούνται και οι δύο.
        </p>
        <p>
          <strong>Η <InlineMath>{'f'}</InlineMath>:</strong> το{' '}
          <InlineMath>{'\\sum_{k=1}^{n} 1/k'}</InlineMath> είναι ο{' '}
          <em>αρμονικός αριθμός</em>. Γνωστό αποτέλεσμα:{' '}
          <InlineMath>{'\\sum 1/k = \\Theta(\\log n)'}</InlineMath>.
        </p>
        <p>
          <strong>Η <InlineMath>{'g'}</InlineMath>:</strong> ξεδιπλώνουμε από
          μέσα προς τα έξω. Το <InlineMath>{'\\sqrt{x} = x^{1/2}'}</InlineMath>,
          και ο λογάριθμος μιας δύναμης κατεβάζει τον εκθέτη:
        </p>
        <BlockMath>{'g(n) = \\log_2\\bigl((\\log_2 n)^{1/2}\\bigr) = \\tfrac{1}{2}\\log_2(\\log_2 n) = \\Theta(\\log\\log n).'}</BlockMath>
        <p>
          Άρα συγκρίνουμε <InlineMath>{'\\log n'}</InlineMath> με{' '}
          <InlineMath>{'\\log\\log n'}</InlineMath>. Το{' '}
          <InlineMath>{'\\log\\log n'}</InlineMath> είναι «ο λογάριθμος του
          λογαρίθμου» — απίστευτα πιο αργό. Άρα το <InlineMath>{'f'}</InlineMath>{' '}
          μεγαλώνει αυστηρά πιο γρήγορα: <InlineMath>{'f = \\omega(g)'}</InlineMath>,
          άρα και <InlineMath>{'f = \\Omega(g)'}</InlineMath>.
        </p>
        <p>
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
        <AsymptoticVerdictExplorer preset="pt2-th1-q2" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: «τρομακτικές εκφράσεις απλοποιούνται όλες».</strong>{' '}
          Όταν δεις <InlineMath>{'\\sum 1/k'}</InlineMath>, σκέψου{' '}
          <InlineMath>{'\\Theta(\\log n)'}</InlineMath>. Όταν δεις{' '}
          <InlineMath>{'\\log(\\sqrt x)'}</InlineMath>, σκέψου{' '}
          <InlineMath>{'\\tfrac12 \\log x'}</InlineMath>. Σχεδόν κάθε «εξωτικός»
          όρος του L02 ανάγεται σε log, n, ή πολυώνυμο — μην παγώσεις απ' την
          εμφάνιση.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q3',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.3 — Master Theorem (περίπτωση 3)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.3',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    formulaIds: ['master-theorem'],
    statement: (
      <p>
        Αν <InlineMath>{'T(n) = 2T(n/2) + n^3'}</InlineMath>, κύκλωσε ποια
        ισχύουν: (i) <InlineMath>{'\\Omega(n^2)'}</InlineMath> · (ii){' '}
        <InlineMath>{'O(n^3)'}</InlineMath> · (iii){' '}
        <InlineMath>{'\\Theta(n^3 \\log_2 n)'}</InlineMath> · (iv){' '}
        <InlineMath>{'\\Theta(n^3)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Master Theorem με <InlineMath>{'a = 2'}</InlineMath>,{' '}
          <InlineMath>{'b = 2'}</InlineMath>, <InlineMath>{'f(n) = n^3'}</InlineMath>{' '}
          (άρα d = 3). Συγκρίνουμε <InlineMath>{'d = 3'}</InlineMath> με{' '}
          <InlineMath>{'\\log_b a = \\log_2 2 = 1'}</InlineMath>:{' '}
          <InlineMath>{'3 > 1'}</InlineMath>, <strong>Περίπτωση 3</strong>. Δες
          γιατί η ρίζα κυριαρχεί στη ράβδο «δουλειά ανά επίπεδο» — οι όροι
          φθίνουν γεωμετρικά:
        </p>
        <RecurrenceClassifier preset="pt2-th1-q3" />
        <p>
          Στην περίπτωση 3 κυριαρχεί ο όρος <InlineMath>{'f(n)'}</InlineMath>{' '}
          («τα φύλλα κάνουν λιγότερη δουλειά από τη ρίζα»):
        </p>
        <BlockMath>{'T(n) = \\Theta(f(n)) = \\Theta(n^3).'}</BlockMath>
        <p>Ελέγχουμε:</p>
        <ul>
          <li>
            (i) <InlineMath>{'\\Omega(n^2)'}</InlineMath> ✓ —{' '}
            <InlineMath>{'n^3 \\ge n^2'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'O(n^3)'}</InlineMath> ✓
          </li>
          <li>
            (iii) <InlineMath>{'\\Theta(n^3\\log n)'}</InlineMath> ✗ — δεν υπάρχει
            λογάριθμος (θα ήταν η Περίπτωση 2)
          </li>
          <li>
            (iv) <InlineMath>{'\\Theta(n^3)'}</InlineMath> ✓
          </li>
        </ul>
        <p>
          <strong>Σωστές: (i), (ii), (iv).</strong>
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «ακριβός συνδυασμός ⇒ ρίζα κυριαρχεί».</strong>{' '}
          Όταν το <InlineMath>{'f(n)'}</InlineMath> είναι πολυωνυμικά
          μεγαλύτερο από <InlineMath>{'n^{\\log_b a}'}</InlineMath>, η Περίπτωση
          3 σου χαρίζει την απάντηση: απλώς γράφεις{' '}
          <InlineMath>{'\\Theta(f(n))'}</InlineMath>. Παγίδα: αν διαφέρει μόνο
          κατά <InlineMath>{'\\log'}</InlineMath> (όχι πολυωνυμικά), πέφτεις
          στην επεκτεταμένη περίπτωση — όχι στην 3.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q4',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.4 — Αναδρομή T(n) = 2T(√n) + 1',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.4',
    weight: 3,
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'T(n) = 2T(\\sqrt{n}) + 1'}</InlineMath>, κύκλωσε ποια
          ισχύουν:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'\\Theta(n)'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'\\Theta(\\log_2 n)'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'\\Theta(\\sqrt{n})'}</InlineMath>
          </li>
          <li>
            (iv) <InlineMath>{'\\Omega(2^n)'}</InlineMath>
          </li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          Η ρίζα ξανά — ίδιο κόλπο όπως στο{' '}
          <InlineMath>{'T(\\sqrt{n})+1'}</InlineMath>: θέτουμε{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>· τώρα όμως ο συντελεστής 2
          μπροστά αλλάζει την κατάληξη — η νέα <InlineMath>{'S(m)'}</InlineMath>{' '}
          είναι <InlineMath>{'2S(m/2)+1'}</InlineMath>, που πέφτει στην{' '}
          <strong>Περίπτωση 1</strong> και δίνει Θ(m), όχι Θ(log m).
        </p>
        <RecurrenceSubstitution preset="pt2-th1-q4" />
        <p>
          Επιστρέφοντας <InlineMath>{'m = \\log_2 n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\Theta(\\log n).'}</BlockMath>
        <p>
          Ελέγχουμε: μόνο η (ii) είναι σωστή.{' '}
          <strong>Σωστή: (ii).</strong>
        </p>
        <Callout type="warning">
          <strong>Παγίδα — μη μπερδέψεις με το «T(√n)+1»!</strong> Το{' '}
          <InlineMath>{'T(\\sqrt{n})+1'}</InlineMath> δίνει{' '}
          <InlineMath>{'\\Theta(\\log\\log n)'}</InlineMath> (διπλό log)· το{' '}
          <InlineMath>{'2T(\\sqrt{n})+1'}</InlineMath> δίνει{' '}
          <InlineMath>{'\\Theta(\\log n)'}</InlineMath> (απλό log). Η διαφορά
          είναι ο συντελεστής μπροστά: a=1 → MT περίπτωση 2 στο S(m), a=2 → MT
          περίπτωση 1.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q5',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.5 — Αλγόριθμοι & αρνητικά βάρη',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.5',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Ποιος/οι από τους παρακάτω αλγόριθμους <strong>δεν</strong> λειτουργεί
          ορθά σε γραφήματα που έχουν αρνητικά βάρη στις ακμές τους;
        </p>
        <p>
          (i) Αλγόριθμος Prim · (ii) Αλγόριθμος Αναζήτησης κατά Πλάτος (BFS) ·
          (iii) Αλγόριθμος Dijkstra · (iv) Αλγόριθμος Bellman-Ford.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Πέρνα έναν-έναν.</strong> Ποιος αλγόριθμος <em>βασίζεται</em>{' '}
          στο ότι τα βάρη είναι μη αρνητικά;
        </p>
        <ul>
          <li>
            <strong>Prim</strong> (ΕΕΔ): η λογική «η φθηνότερη ακμή της αποκοπής
            ανήκει στο ΕΕΔ» δουλεύει ανεξάρτητα από πρόσημο — αρκεί τα βάρη να
            είναι σταθερά. ✓ δουλεύει με αρνητικά.
          </li>
          <li>
            <strong>Bellman-Ford</strong> ([L17](/lectures/L17-dp-iv)):
            σχεδιάστηκε ακριβώς γι' αρνητικά. Επαναπροσπαθεί κάθε ακμή σε κάθε
            γύρο, οπότε δεν «κλειδώνει» τίποτα πρόωρα. ✓
          </li>
          <li>
            <strong>BFS</strong>: αγνοεί τα βάρη συνολικά. Επιστρέφει «λιγότερες
            ακμές», όχι «μικρότερο άθροισμα» — οπότε δεν είναι αλγόριθμος ζυγισμένου
            shortest path καν, και τα αρνητικά δεν αλλάζουν αυτή του την ιδιότητα.
          </li>
          <li>
            <strong>Dijkstra</strong>: <strong>σπάει</strong>. Μόλις οριστικοποιεί
            μια κορυφή, δεν την ξανακοιτάζει· μια αρνητική ακμή που εμφανίζεται
            αργότερα θα μπορούσε να τη βελτιώσει, αλλά «είναι αργά».
          </li>
        </ul>
        <p>
          Δες ακριβώς τη στιγμή που σπάει — η <InlineMath>{'u'}</InlineMath>{' '}
          κλειδώνει στο <InlineMath>{'d = 1'}</InlineMath> ενώ η πραγματική της
          απόσταση είναι <InlineMath>{'-1'}</InlineMath>, και το ψέμα μεταφέρεται
          στο <InlineMath>{'t'}</InlineMath>:
        </p>
        <DijkstraInvariantBreak />
        <p>
          <strong>Σωστή: (iii).</strong>
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «ποιος αλγόριθμος εμπιστεύεται οριστικοποίηση;».</strong>{' '}
            Αν ένας αλγόριθμος κλειδώνει αμετάκλητα μια απόφαση (Dijkstra: κάθε
            κορυφή οριστική μόλις βγει από την ουρά), τότε μια αρνητική ακμή
            μπορεί να ακυρώσει την αναλλοίωτη και να σπάσει την ορθότητα. Prim
            δεν εμπιστεύεται «αποστάσεις από την s» — εμπιστεύεται «ένα-ένα κόστος
            ακμής σε τομή», που μένει σωστό. BFS αγνοεί βάρη ούτως ή άλλως.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q6',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.6 — Πολυπλοκότητα δισδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.6',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Λύνουμε ένα πρόβλημα με DP συμπληρώνοντας έναν πίνακα τιμών{' '}
          <InlineMath>{'\\text{OPT}(i,j)'}</InlineMath>, για{' '}
          <InlineMath>{'i = 1\\dots n'}</InlineMath>,{' '}
          <InlineMath>{'j = 1\\dots m'}</InlineMath>. Ποιες επιλογές μπορούμε να
          πούμε με <strong>βεβαιότητα</strong> ότι <strong>δεν</strong>{' '}
          αντικατοπτρίζουν τη χρονική πολυπλοκότητα;
        </p>
        <p>
          (i) <InlineMath>{'O(n^3)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(m)'}</InlineMath> · (iii) <InlineMath>{'O(n)'}</InlineMath>{' '}
          · (iv) <InlineMath>{'O(m^2 n^2)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Ίδιο μοτίβο, διαφορετικές υποψήφιες.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'n \\cdot m'}</InlineMath> κελιά — όλα πρέπει να γεμίσουν,
          άρα <InlineMath>{'\\Omega(n \\cdot m)'}</InlineMath>. Ό,τι είναι
          ασυμπτωτικά μικρότερο αποκλείεται.
        </p>
        <DPTableLowerBound preset="pt2-th1-q6" />
        <p>
          Από την εικόνα:
        </p>
        <ul>
          <li>
            <InlineMath>{'O(m)'}</InlineMath>: όταν{' '}
            <InlineMath>{'n > 1'}</InlineMath>, είναι μικρότερο του{' '}
            <InlineMath>{'nm'}</InlineMath>. <strong>Αδύνατο.</strong>
          </li>
          <li>
            <InlineMath>{'O(n)'}</InlineMath>: όταν{' '}
            <InlineMath>{'m > 1'}</InlineMath>, είναι μικρότερο του{' '}
            <InlineMath>{'nm'}</InlineMath>. <strong>Αδύνατο.</strong>
          </li>
          <li>
            <InlineMath>{'O(n^3)'}</InlineMath>: όταν{' '}
            <InlineMath>{'n \\ge m'}</InlineMath>, είναι{' '}
            <InlineMath>{'\\ge nm'}</InlineMath>. Εύλογο αν κάθε κελί θέλει{' '}
            <InlineMath>{'O(n^2)'}</InlineMath> δουλειά.
          </li>
          <li>
            <InlineMath>{'O(m^2 n^2)'}</InlineMath>: πολύ ψηλά πάνω από{' '}
            <InlineMath>{'nm'}</InlineMath> — εύλογο αν κάθε κελί θέλει{' '}
            <InlineMath>{'O(mn)'}</InlineMath> δουλειά.
          </li>
        </ul>
        <p>
          <strong>Σωστές: (ii), (iii).</strong>
        </p>
        <Callout type="warning">
          <strong>Παγίδα:</strong> οι όροι «μικρότερο» και «μεγαλύτερο»
          ασκούνται ασυμπτωτικά, όχι σε συγκεκριμένες τιμές{' '}
          <InlineMath>{'n, m'}</InlineMath>. Το <InlineMath>{'O(m)'}</InlineMath>{' '}
          μπορεί τυχαία να ισούται με <InlineMath>{'nm'}</InlineMath> αν{' '}
          <InlineMath>{'n = 1'}</InlineMath> — αλλά για κάθε ζεύγος{' '}
          <InlineMath>{'(n, m)'}</InlineMath> με <InlineMath>{'n \\to \\infty'}</InlineMath>,
          είναι αυστηρά μικρότερο. Αυτό αρκεί για να αποκλειστεί.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q7',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.7 — Πολυπλοκότητα μονοδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.7',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <p>
        Λύνουμε ένα πρόβλημα με DP συμπληρώνοντας έναν πίνακα τιμών{' '}
        <InlineMath>{'\\text{OPT}(i)'}</InlineMath> για{' '}
        <InlineMath>{'i = 1\\dots n'}</InlineMath>. Ποιες μπορούμε να πούμε με
        βεβαιότητα ότι <strong>δεν</strong> αντικατοπτρίζουν τη χρονική
        πολυπλοκότητα; (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
        <InlineMath>{'O(n^2)'}</InlineMath> · (iii) <InlineMath>{'O(1)'}</InlineMath>{' '}
        · (iv) <InlineMath>{'O(\\log_2 n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Ίδια ερώτηση με το{' '}
          <a href="#exercise:pt1-th1-q8" className="underline">pt1-th1-q8</a>.</strong>{' '}
          Ο πίνακας έχει <InlineMath>{'n'}</InlineMath> κελιά — όλα πρέπει να
          γεμίσουν, οπότε <InlineMath>{'\\Omega(n)'}</InlineMath>. Ό,τι
          ασυμπτωτικά μικρότερο αποκλείεται.
        </p>
        <DPTableLowerBound preset="pt2-th1-q7" />
        <p>
          Από την εικόνα: αποκλείονται <InlineMath>{'O(1)'}</InlineMath>{' '}
          (σταθερός χρόνος δεν αγγίζει <InlineMath>{'n'}</InlineMath> κελιά) και{' '}
          <InlineMath>{'O(\\log_2 n)'}</InlineMath> (μεγαλώνει πιο αργά από{' '}
          <InlineMath>{'n'}</InlineMath>). Τα <InlineMath>{'O(n)'}</InlineMath>{' '}
          και <InlineMath>{'O(n^2)'}</InlineMath> ζουν πάνω από το κατώφλι.
        </p>
        <p>
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
        <Callout type="key">
          Όταν εμφανιστούν 1D ερωτήσεις «ποια από τα παρακάτω ΔΕΝ είναι
          δυνατή», δες αμέσως τα δύο «μικρά» (σταθερό, λογαριθμικό). Σχεδόν
          πάντα κάποιο από αυτά είναι η σωστή απάντηση — γιατί κανένας 1D DP
          δεν χωράει σε λιγότερο από <InlineMath>{'\\Omega(n)'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q8',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.8 — Φράγματα πολυπλοκότητας της LCS',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.8',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L15-dp-ii'],
    formulaIds: ['lcs'],
    statement: (
      <>
        <p>
          Ποια από τα παρακάτω αποτελούν ορθά φράγματα στην πολυπλοκότητα της
          εύρεσης της <strong>μέγιστης κοινής υπακολουθίας</strong> δύο
          συμβολοσειρών με <InlineMath>{'m'}</InlineMath> και{' '}
          <InlineMath>{'n'}</InlineMath> χαρακτήρες;
        </p>
        <p>
          (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(n^2 m^2)'}</InlineMath> · (iii){' '}
          <InlineMath>{'O(n \\log_2 m)'}</InlineMath> · (iv){' '}
          <InlineMath>{'\\Theta(mn \\log_2 n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Πρώτα η αλήθεια για το LCS.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'(m+1)(n+1)'}</InlineMath> κελιά, κάθε ένα γεμίζει με{' '}
          μία σύγκριση + ένα <InlineMath>{'\\max'}</InlineMath> — δουλειά{' '}
          <InlineMath>{'O(1)'}</InlineMath>. Άρα ο αλγόριθμος τρέχει σε{' '}
          <strong><InlineMath>{'\\Theta(mn)'}</InlineMath></strong>. Όχι «κάπου
          γύρω στο <InlineMath>{'mn'}</InlineMath>» — <em>ακριβώς</em> τάξης{' '}
          <InlineMath>{'mn'}</InlineMath>.
        </p>
        <p>
          Η ερώτηση «ποιο είναι ορθό φράγμα;» γίνεται έτσι: <em>ποιο από τα
          τέσσερα ικανοποιείται από το <InlineMath>{'\\Theta(mn)'}</InlineMath>;</em>{' '}
          Για κάθε <InlineMath>{'O'}</InlineMath>-φράγμα ζητάς «είναι το{' '}
          <InlineMath>{'mn'}</InlineMath> μικρότερο ή ίσο με αυτή την κλάση;»
          Για ένα <InlineMath>{'\\Theta'}</InlineMath> ζητάς «είναι ακριβώς της
          ίδιας τάξης;» — αυστηρότερο.
        </p>
        <DPTableLowerBound preset="pt2-th1-q8" />
        <p>
          <strong>Σωστή: (ii) <InlineMath>{'O(n^2 m^2)'}</InlineMath>.</strong>{' '}
          Το (i) και το (iii) μένουν κάτω από <InlineMath>{'mn'}</InlineMath>,
          οπότε δεν αρκούν ως άνω φράγματα. Το (iv) σπάει επειδή το{' '}
          <InlineMath>{'\\Theta'}</InlineMath> απαιτεί <em>ακριβή</em>{' '}
          συμπεριφορά — ο αλγόριθμος δεν παίρνει επιπλέον λογαριθμικό
          παράγοντα.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «ποια είναι ακριβώς η πραγματική
            πολυπλοκότητα; και ποια κλάση τη χωράει;».</strong> Πριν κρίνεις τα
            φράγματα, βγάλε πρώτα την πραγματική τιμή. Μετά:{' '}
            <InlineMath>{'O(f)'}</InlineMath> σωστό αν{' '}
            <InlineMath>{'\\text{real} = O(f)'}</InlineMath>·{' '}
            <InlineMath>{'\\Omega(f)'}</InlineMath> σωστό αν{' '}
            <InlineMath>{'\\text{real} = \\Omega(f)'}</InlineMath>·{' '}
            <InlineMath>{'\\Theta(f)'}</InlineMath> σωστό μόνο αν είναι{' '}
            <em>και τα δύο</em>. Το <InlineMath>{'\\Theta'}</InlineMath> έχει
            «διπλή πόρτα» — εύκολο να ξεγλιστρήσει ένα παραπλήσιο φράγμα που
            είναι κοντά αλλά όχι ίδιο. Δες π.χ. το (iv) εδώ.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q9',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.9 — Προβλήματα εκτός P (αν P ≠ NP)',
    topic: 'intro',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.9',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>
          Εάν <InlineMath>{'P \\neq NP'}</InlineMath>, ποια προβλήματα{' '}
          <strong>δεν</strong> ανήκουν στο <InlineMath>{'P'}</InlineMath>;
        </p>
        <p>
          (i) 2-Ικανοποιησιμότητα (2-SAT) · (ii) Κάλυμμα Κορυφών (Vertex Cover) ·
          (iii) Σακίδιο (Knapsack) · (iv) Μέγιστο Επικαλύπτον Δέντρο.
        </p>
      </>
    ),
    solution: (
      <>
        <ul>
          <li>
            <strong>2-SAT:</strong> παρόλο που το γενικό SAT είναι NP-πλήρες, η
            ειδική περίπτωση με <em>δύο</em> μεταβλητές ανά όρο λύνεται σε{' '}
            πολυωνυμικό χρόνο — <strong>ανήκει στο <InlineMath>{'P'}</InlineMath></strong>.
          </li>
          <li>
            <strong>Κάλυμμα κορυφών:</strong> κλασικό NP-πλήρες — αν{' '}
            <InlineMath>{'P \\neq NP'}</InlineMath>, <strong>δεν</strong> ανήκει
            στο <InlineMath>{'P'}</InlineMath>. ✓
          </li>
          <li>
            <strong>Σακίδιο (απόφαση):</strong> NP-πλήρες — <strong>δεν</strong>{' '}
            ανήκει στο <InlineMath>{'P'}</InlineMath>. ✓
          </li>
          <li>
            <strong>Μέγιστο επικαλύπτον δέντρο:</strong> ίδιο με το ελάχιστο
            συνδετικό δέντρο, απλώς αντιστρέφεις τα βάρη — λύνεται με Kruskal/Prim
            σε <InlineMath>{'O(m\\log n)'}</InlineMath>, <strong>ανήκει στο{' '}
            <InlineMath>{'P'}</InlineMath></strong>.
          </li>
        </ul>
        <p>
          <strong>Σωστές: (ii), (iii).</strong>
        </p>
        <p>
          Η μεγάλη παγίδα εδώ είναι το <strong>2-SAT</strong>: φαίνεται σαν
          SAT, αλλά είναι ειδική περίπτωση που λύνεται πολυωνυμικά. Δες πού
          ακριβώς ζει:
        </p>
        <ComplexityZooLab focus="2sat" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: «μήπως είναι ειδική περίπτωση που πέφτει στο P;»</strong>{' '}
          Πολλά NP-πλήρη έχουν παραλλαγές που λύνονται γρήγορα: 2-SAT (vs SAT),
          ελάχιστο vs μακρύτερο μονοπάτι, MST (vs Steiner Tree στον γενικό
          ορισμό). Όταν δεις παραλλαγή με τη λέξη «δύο», «μέγιστο/ελάχιστο
          συνδετικό», ή κάποιον περιορισμό σε δομή, ρώτα αν η ειδική περίπτωση
          είναι σε P — συχνά ναι.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th1-q10',
    title: 'Σεπτέμβριος 2025 · Θέμα 1.10 — Προβλήματα άγνωστης NP-πληρότητας',
    topic: 'intro',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 1.10',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>
          Ποια από τα παρακάτω προβλήματα <strong>δεν γνωρίζουμε</strong> αν
          είναι NP-πλήρη;
        </p>
        <p>
          (i) Κωδικοποίηση Huffman · (ii) Μέγιστο Μονοπάτι (Longest Path) ·
          (iii) Παραγοντοποίηση Ακεραίων · (iv) Μονοπάτι Hamilton.
        </p>
      </>
    ),
    solution: (
      <>
        <ul>
          <li>
            <strong>Huffman:</strong> ξέρουμε πολυωνυμικό άπληστο αλγόριθμο{' '}
            <InlineMath>{'O(n\\log n)'}</InlineMath> — είναι στο{' '}
            <InlineMath>{'P'}</InlineMath>, άρα γνωρίζουμε τη θέση του.
          </li>
          <li>
            <strong>Μέγιστο μονοπάτι:</strong> γνωρίζουμε ότι είναι NP-πλήρες.
          </li>
          <li>
            <strong>Μονοπάτι Hamilton:</strong> γνωρίζουμε ότι είναι NP-πλήρες.
          </li>
          <li>
            <strong>Παραγοντοποίηση ακεραίων:</strong> είναι στο{' '}
            <InlineMath>{'NP'}</InlineMath>, αλλά <strong>δεν</strong> έχει
            αποδειχθεί ούτε ότι είναι στο <InlineMath>{'P'}</InlineMath> ούτε ότι
            είναι NP-πλήρες — η θέση του παραμένει <em>ανοιχτό ερώτημα</em>
            (πιστεύεται ότι δεν είναι NP-πλήρες· πάνω σε αυτή τη δυσκολία
            στηρίζεται η κρυπτογραφία RSA).
          </li>
        </ul>
        <p>
          <strong>Σωστή: (iii).</strong>
        </p>
        <p>
          Η Παραγοντοποίηση Ακεραίων ζει στη μεσαία (άγνωστη) ζώνη — μαζί με
          τον Ισομορφισμό Γραφημάτων. Δες:
        </p>
        <ComplexityZooLab focus="integer-factor" />
        <Callout type="key">
          <strong>«Δεν γνωρίζουμε αν είναι NP-πλήρες» είναι ξεχωριστή απάντηση.</strong>{' '}
          Δεν εννοεί «είναι NP-πλήρες» — εννοεί «είμαστε ακόμη αναποφάσιστοι».
          Μόνο δύο προβλήματα από όσα συναντάς στο μάθημα ζουν εκεί:
          Παραγοντοποίηση Ακεραίων και Ισομορφισμός Γραφημάτων. Όλα τα άλλα
          ονόματα (SAT, Hamilton, Vertex Cover, Knapsack, Longest Path) είναι
          ήδη ταξινομημένα: ή σε P, ή NP-πλήρη. Η ύπαρξη αυτής της «τρίτης
          απάντησης» είναι η κρυφή ευκολία του ερωτήματος — αν την ξεχάσεις,
          ψάχνεις απάντηση από λάθος δύο επιλογές.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th2-1',
    title: 'Σεπτέμβριος 2025 · Θέμα 2.1 — Εκτέλεση του αλγορίθμου Dijkstra',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 2.1',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Εφάρμοσε τον αλγόριθμο του Dijkstra στο παρακάτω γράφημα με αφετηρία
          την κορυφή <InlineMath>{'a'}</InlineMath>. Η απάντηση αρκεί να περιέχει
          τον πλήρη πίνακα που διατηρεί ο Dijkstra σε κάθε βήμα. Το γράφημα έχει
          6 κορυφές <InlineMath>{'a, b, c, d, e, f'}</InlineMath> και τις ακμές
          (με τα βάρη τους):
        </p>
        <ul>
          <li><InlineMath>{'a - d = 1'}</InlineMath></li>
          <li><InlineMath>{'a - c = 5'}</InlineMath></li>
          <li><InlineMath>{'a - b = 4'}</InlineMath></li>
          <li><InlineMath>{'c - b = 2'}</InlineMath></li>
          <li><InlineMath>{'d - b = 3'}</InlineMath></li>
          <li><InlineMath>{'d - e = 5'}</InlineMath></li>
          <li><InlineMath>{'b - e = 1'}</InlineMath></li>
          <li><InlineMath>{'e - f = 2'}</InlineMath></li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η μηχανή του Dijkstra σε δύο γραμμές.</strong> Κάθε βήμα:
          (1) εξήγαγε την κορυφή με τη μικρότερη τρέχουσα{' '}
          <InlineMath>{'d'}</InlineMath> — αυτή κλειδώνει· (2) χαλάρωσε όλες τις
          ακμές που φεύγουν από αυτήν, ενημερώνοντας τα <InlineMath>{'d'}</InlineMath>{' '}
          των μη οριστικών γειτόνων.
        </p>
        <p>
          Δες την να τρέχει ολοκληρωμένα — η ουρά εμφανής στο διάγραμμα, οι
          σταδιακές τιμές <InlineMath>{'d[\\cdot]'}</InlineMath> κάτω από κάθε
          κορυφή, και ο πλήρης «πίνακας ανά βήμα» που ζητά η εκφώνηση:
        </p>
        <DijkstraHandTrace instance="pt2-th2-1" />
        <p>
          <strong>Τα τρία κρίσιμα σημεία.</strong> (i) Όταν εξάγουμε την{' '}
          <InlineMath>{'d'}</InlineMath> (μικρότερη τρέχουσα = 1), η ακμή{' '}
          <InlineMath>{'d\\!-\\!b'}</InlineMath> δίνει <InlineMath>{'1+3=4'}</InlineMath>,
          ίδιο με το τρέχον <InlineMath>{'d[b]'}</InlineMath> — καμία βελτίωση,
          καμία αλλαγή. (ii) Όταν εξάγουμε την <InlineMath>{'b'}</InlineMath> (4),
          η ακμή <InlineMath>{'b\\!-\\!e'}</InlineMath> δίνει <InlineMath>{'4+1=5 < 6'}</InlineMath>{' '}
          — βελτιώνει το <InlineMath>{'d[e]'}</InlineMath>. (iii) Η σειρά
          οριστικοποίησης που προκύπτει είναι{' '}
          <InlineMath>{'a, d, b, c, e, f'}</InlineMath> — όχι αλφαβητική.
        </p>
        <p>
          <strong>Τελικές συντομότερες αποστάσεις από την{' '}
          <InlineMath>{'a'}</InlineMath>:</strong>{' '}
          <InlineMath>{'a{=}0,\\ d{=}1,\\ b{=}4,\\ c{=}5,\\ e{=}5,\\ f{=}7'}</InlineMath>.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — η «μεγάλη ζητούμενη έξοδος» είναι ο πίνακας ανά βήμα.</strong>{' '}
            Όταν η εκφώνηση λέει «αρκεί ο πίνακας που διατηρεί ο Dijkstra σε κάθε
            βήμα», σχεδίασέ τον ως πίνακα <em>κορυφές × βήματα</em>. Μία γραμμή
            ανά εξαγωγή· μόνο τα κελιά που χαλαρώθηκαν αλλάζουν. Αυτό είναι ταυτόχρονα
            (α) η απόδειξη ότι τρέξες σωστά τον αλγόριθμο και (β) η πηγή κάθε
            συντομότερης διαδρομής μέσω της <InlineMath>{'\\pi[\\cdot]'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th2-2',
    title: 'Σεπτέμβριος 2025 · Θέμα 2.2 — Κλάσεις όπου δουλεύει η τοπολογική ταξινόμηση',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 2.2',
    weight: 5,
    difficulty: 'easy',
    prerequisites: ['lectures/L12-greedy-ii'],
    statement: (
      <>
        <p>
          Σε ποιες από τις παρακάτω κλάσεις γραφημάτων ο αλγόριθμος της
          τοπολογικής ταξινόμησης επιστρέφει ορθά το ζητούμενο αποτέλεσμα{' '}
          <strong>για κάθε</strong> γράφημα της κλάσης;
        </p>
        <p>
          (i) Γραφήματα με θετικά βάρη στις ακμές τους · (ii) Άκυκλα
          κατευθυνόμενα γραφήματα · (iii) Δέντρα · (iv) Διμερή γραφήματα.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Πρώτα η συνθήκη.</strong> Η τοπολογική ταξινόμηση παράγει
          σωστό αποτέλεσμα <strong>αν και μόνο αν</strong> το γράφημα είναι{' '}
          <strong>DAG</strong> — κατευθυνόμενο και χωρίς κύκλους. Άρα μετατρέπεις
          την ερώτηση σε <em>«ποιες κλάσεις εγγυώνται και τα δύο;»</em> — και
          ψάχνεις αντιπαράδειγμα για όποια δεν εγγυάται.
        </p>
        <p>
          Πάτησε σε καθεμία από τις τέσσερις καρτέλες και «τρέξε» την τοπολογική
          ταξινόμηση. Οι σωστές κλάσεις βγάζουν ομαλά όλες τις κορυφές σε σειρά·
          οι λάθος κλάσεις κολλάνε σε κύκλο — και η εικόνα του κύκλου είναι αυτό
          ακριβώς που σου ζητάει η αντιπαράδειγμα-νοοτροπία:
        </p>
        <TopoSortClassMatrix />
        <p>
          <strong>(ii) DAG — ✓.</strong> Είναι ακριβώς η κλάση για την οποία
          ορίζεται. Στην καρτέλα «DAG» ο αλγόριθμος βγάζει επανειλημμένα κορυφή
          με εσώβαθμο 0 και τις βάζει όλες σε σειρά. Καμία έκπληξη — αυτή είναι
          η αναμενόμενη συμπεριφορά.
        </p>
        <p>
          <strong>(iii) Δέντρο — ✓.</strong> Ένα <em>κατευθυνόμενο</em>{' '}
          (ριζωμένο) δέντρο δεν έχει κύκλους εξ ορισμού — είναι ειδική περίπτωση
          DAG. Στην καρτέλα «Δέντρο» η ρίζα φεύγει πρώτη (εσώβαθμος 0), τα
          παιδιά αμέσως μετά κ.ο.κ. — η τοπολογική ταξινόμηση συμπίπτει
          ουσιαστικά με «BFS από τη ρίζα».
        </p>
        <p>
          <strong>(i) Θετικά βάρη — ✗.</strong> Η ιδιότητα «όλα τα βάρη &gt; 0»
          δεν λέει απολύτως τίποτα για το σχήμα του γραφήματος. Στην καρτέλα «Με
          θετικά βάρη», όλες οι ακμές έχουν θετικό βάρος αλλά το γράφημα κρύβει
          τον κύκλο <InlineMath>{'A \\to B \\to C \\to A'}</InlineMath> — ο
          αλγόριθμος κολλάει στο πρώτο βήμα γιατί <em>καμία</em> κορυφή δεν έχει
          εσώβαθμο 0. Αρκεί ΕΝΑ τέτοιο γράφημα για να καταρρίψει το «πάντα».
        </p>
        <p>
          <strong>(iv) Διμερές — ✗.</strong> Διμερές σημαίνει «οι κορυφές
          χωρίζονται σε δύο χρωματικές κλάσεις Α, Β και κάθε ακμή πάει από Α σε
          Β ή το αντίθετο». Αυτό αφήνει τους <em>άρτιους</em> κύκλους ελεύθερους.
          Στην καρτέλα «Διμερές» ο 4-κύκλος{' '}
          <InlineMath>{'A_1 \\to B_1 \\to A_2 \\to B_2 \\to A_1'}</InlineMath>{' '}
          είναι έγκυρος διμερής κύκλος — και πάλι κανείς εσώβαθμος δεν είναι 0.
          Πάλι ένα αντιπαράδειγμα αρκεί.
        </p>
        <p>
          <strong>Απάντηση: (ii) και (iii).</strong>
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «κλάση ⇒ ιδιότητα ⇒ DAG;».</strong> Όταν σε
            ρωτάνε «σε ποιες κλάσεις γραφημάτων δουλεύει σωστά ο αλγόριθμος Χ»,
            η σωστή πρώτη ερώτηση είναι: <em>«τι απαιτεί ο αλγόριθμος;»</em>.
            Για την τοπολογική ταξινόμηση αυτό είναι «κατευθυνόμενο + χωρίς
            κύκλους». Μετά για κάθε κλάση ρωτάς: <em>η ιδιότητα της κλάσης
            εγγυάται και τα δύο;</em>. Αν όχι, ψάχνεις αντιπαράδειγμα — όχι
            απόδειξη. Τα βάρη και η διμέρεια αφορούν εντελώς άλλες πτυχές
            (πλάτος και χρωματικότητα) — όχι ακυκλικότητα. Η παγίδα είναι να
            μπερδέψεις «δουλεύει σε <em>μερικά</em> γραφήματα της κλάσης»
            με «δουλεύει σε <em>κάθε</em> γράφημα της κλάσης».
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th2-3',
    title: 'Σεπτέμβριος 2025 · Θέμα 2.3 — Άπληστα ρέστα (αποτυγχάνει)',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 2.3',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>
          Εργαζόμαστε ως ταμίες σε κατάστημα. Τα χαρτονομίσματα/κέρματα που
          μπορούμε να επιστρέψουμε ως ρέστα έχουν αξία{' '}
          <InlineMath>{'1, 10, 25'}</InlineMath> ευρώ (απεριόριστα). Στόχος: όταν
          δίνουμε ρέστα, να χρησιμοποιούμε το <strong>μικρότερο πλήθος</strong>{' '}
          κερμάτων.
        </p>
        <p>
          Μπορούμε να πετύχουμε τον στόχο επιλέγοντας πάντα το κέρμα με τη{' '}
          <strong>μεγαλύτερη αξία που δεν ξεπερνά</strong> το υπόλοιπο ποσό; (i)
          ΝΑΙ · (ii) ΟΧΙ. Αιτιολόγησε την απάντηση.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Απάντηση: (ii) ΟΧΙ.</strong> Το άπληστο «πάντα το μεγαλύτερο
          κέρμα» <em>δεν</em> είναι βέλτιστο για το σύστημα{' '}
          <InlineMath>{'\\{1, 10, 25\\}'}</InlineMath>. Ένα αντιπαράδειγμα
          αρκεί.
        </p>
        <p>
          <strong>Το αντιπαράδειγμα — ρέστα <InlineMath>{'30'}</InlineMath>.</strong>{' '}
          Δες τον άπληστο να εκτυλίσσεται κέρμα-κέρμα στα αριστερά, και τη
          βέλτιστη λύση στα δεξιά. Στο τέλος ο άπληστος έχει στοιβάξει 6
          κέρματα ενώ η βέλτιστη έλυσε το πρόβλημα με 3:
        </p>
        <CoinChangeLab />
        <p>
          <strong>Πώς πέφτει στην παγίδα.</strong> Στο πρώτο βήμα ο κανόνας
          αρπάζει το <InlineMath>{'25'}</InlineMath> γιατί «χωράει». Μετά μένει
          υπόλοιπο <InlineMath>{'5'}</InlineMath> — και το σύστημα δεν έχει
          πεντάρικο. Αναγκαστικά πέντε κέρματα του <InlineMath>{'1'}</InlineMath>:{' '}
          <InlineMath>{'25 + 1 + 1 + 1 + 1 + 1 = 30'}</InlineMath>, 6 κέρματα
          συνολικά. Η βέλτιστη λύση αποφεύγει εντελώς το{' '}
          <InlineMath>{'25'}</InlineMath>:{' '}
          <InlineMath>{'10 + 10 + 10 = 30'}</InlineMath>, 3 κέρματα.
        </p>
        <p>
          <strong>Διπλή ματιά — ο ίδιος κανόνας στο σύστημα{' '}
          <InlineMath>{'\\{1, 5, 10, 25\\}'}</InlineMath>.</strong> Στο
          εργαλείο, η δεύτερη καρτέλα τρέχει την ίδια άπληστη λογική στο σύστημα
          του δολαρίου — εκεί ο κανόνας πετυχαίνει. Η εικόνα δείχνει ότι το αν
          ένας άπληστος κανόνας είναι σωστός{' '}
          <strong>εξαρτάται από το ίδιο το σύστημα νομισμάτων</strong>, όχι από
          τη «λογική» του κανόνα. Η ορθότητα γεννιέται από κάποιο{' '}
          <em>ιδιαίτερο</em> των τιμών (στο σύστημα δολαρίου, οι αξίες είναι
          τέτοιες ώστε ο κανόνας να μην μπορεί να αναγκαστεί σε μικρά κέρματα —
          δες την επόμενη άσκηση για την απόδειξη).
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «λογικοφανές ≠ βέλτιστο».</strong> Όταν
            βλέπεις «δείξε αν ο άπληστος είναι βέλτιστος», πρώτη κίνηση είναι
            να ψάξεις <em>αντιπαράδειγμα</em>, όχι απόδειξη. Ένα μικρό
            στιγμιότυπο που τον σπάει αρκεί για να ξεμπερδέψεις. Μόνο αν δεν
            βρίσκεις, ψάχνεις απόδειξη — και αυτή θα στηρίζεται σε ιδιότητες
            του συστήματος, όχι σε γενικό «είναι λογικός κανόνας».
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th3',
    title: 'Σεπτέμβριος 2025 · Θέμα 3 — Όνομα σκύλου (συντομότερη κοινή υπερακολουθία)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 3',
    weight: 20,
    difficulty: 'hard',
    prerequisites: ['lectures/L15-dp-ii'],
    statement: (
      <>
        <p>
          Ένα ζευγάρι με ονόματα <InlineMath>{'s_1'}</InlineMath> και{' '}
          <InlineMath>{'s_2'}</InlineMath> θέλει να ονομάσει τον σκύλο του με ένα
          όνομα που να <strong>περιέχει και τα δύο ονόματά τους ως
          υπακολουθίες</strong>, και να είναι το <strong>συντομότερο</strong>{' '}
          δυνατό. Π.χ. για ΓΑΒ και ΜΙΑΟΥ, το ΜΙΓΑΒΟΥ ή το ΓΜΙΑΟΥΒ είναι έγκυρα,
          αλλά όχι το ΓΑΒΜΙΑΟΥ (πολύ μακρύ). Σχεδίασε αλγόριθμο Δυναμικού
          Προγραμματισμού που βρίσκει το βέλτιστο μήκος για συμβολοσειρές{' '}
          <InlineMath>{'s_1, s_2'}</InlineMath> μηκών <InlineMath>{'m, n'}</InlineMath>.
        </p>
        <p>
          Ορίζουμε <InlineMath>{'\\text{OPT}(i,j)'}</InlineMath> = το μήκος της
          συντομότερης συμβολοσειράς που περιέχει ως υπακολουθίες τα πρώτα{' '}
          <InlineMath>{'i'}</InlineMath> στοιχεία της{' '}
          <InlineMath>{'s_1'}</InlineMath> και τα πρώτα{' '}
          <InlineMath>{'j'}</InlineMath> στοιχεία της{' '}
          <InlineMath>{'s_2'}</InlineMath>.
        </p>
        <p>
          (i) Το βέλτιστο μήκος δίνεται από την τιμή{' '}
          <InlineMath>{'\\text{OPT}(\\_,\\_)'}</InlineMath>. (ii) Γράψε την
          αναδρομική σχέση. (iii) Ποια η χρονική πολυπλοκότητα και γιατί;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η διαίσθηση — γιατί υπάρχει «δωρεάν χώρος».</strong> Αν
          απλώς κολλήσεις τα δύο ονόματα, παίρνεις κάτι σαν ΓΑΒΜΙΑΟΥ —{' '}
          <InlineMath>{'m + n = 8'}</InlineMath> γράμματα. Όμως αν τα δύο
          ονόματα μοιράζονται έστω ένα γράμμα (εδώ, το «Α»), μπορούμε να βάλουμε
          το κοινό γράμμα <em>μία</em> φορά και να αφήσουμε ν’ «εξυπηρετήσει»
          και τα δύο: ΓΑΒ + ΜΙΑΟΥ → ΜΙΓΑΒΟΥ, 7 γράμματα — εξοικονομήσαμε 1.
          Γενικά, κάθε κοινό γράμμα στη <em>σωστή θέση</em> μάς γλιτώνει 1.
          Μάλιστα ισχύει η ταυτότητα <InlineMath>{'|SCS| + |LCS| = m + n'}</InlineMath>:
          η συντομότερη υπερακολουθία και η μέγιστη κοινή υπακολουθία είναι
          δύο όψεις του ίδιου νομίσματος.
        </p>
        <p>
          <strong>(i)</strong> Θέλουμε όνομα που να περιέχει{' '}
          <em>ολόκληρα</em> και τα δύο ονόματα — δηλαδή και τα{' '}
          <InlineMath>{'m'}</InlineMath> στοιχεία της{' '}
          <InlineMath>{'s_1'}</InlineMath> και τα <InlineMath>{'n'}</InlineMath>{' '}
          της <InlineMath>{'s_2'}</InlineMath>. Άρα η ζητούμενη τιμή είναι{' '}
          <strong><InlineMath>{'\\text{OPT}(m, n)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(ii) Η αναδρομή.</strong> Χτίζουμε το όνομα γράμμα-γράμμα και
          κοιτάμε το <strong>τελευταίο</strong> γράμμα που γράφουμε. Είναι μία
          επιλογή με <em>δύο πραγματικές</em> κινήσεις:
        </p>
        <ul>
          <li>
            <strong>Αν <InlineMath>{'s_1[i] = s_2[j]'}</InlineMath>:</strong> το
            ίδιο γράμμα κλείνει και τα δύο prefixes. <em>Πάντα</em> συμφέρει
            να ζευγαρώσουμε εδώ — γλιτώνουμε ένα γράμμα. Κόστος 1, μένει το{' '}
            <InlineMath>{'\\text{OPT}(i-1, j-1)'}</InlineMath> — η διαγώνια
            κίνηση.
          </li>
          <li>
            <strong>Αν διαφέρουν:</strong> κάποιο από τα δύο γράμματα πρέπει να
            είναι το τελευταίο. Δοκίμασε και τα δύο και κράτα το{' '}
            <em>μικρότερο</em>: <InlineMath>{'1 + \\min\\{\\text{OPT}(i-1,j),\\, \\text{OPT}(i,j-1)\\}'}</InlineMath>{' '}
            — μία κίνηση πάνω (κρατάς το <InlineMath>{'s_1[i]'}</InlineMath>) ή
            αριστερά (κρατάς το <InlineMath>{'s_2[j]'}</InlineMath>).
          </li>
        </ul>
        <BlockMath>{'\\text{OPT}(i,j) = \\begin{cases} j & i = 0 \\\\ i & j = 0 \\\\ 1 + \\text{OPT}(i-1,j-1) & s_1[i] = s_2[j] \\\\ 1 + \\min\\{ \\text{OPT}(i-1,j),\\, \\text{OPT}(i,j-1) \\} & s_1[i] \\neq s_2[j] \\end{cases}'}</BlockMath>
        <p>
          Οι βασικές περιπτώσεις: αν η μία πλευρά τελείωσε, πρέπει απλώς να
          γράψουμε ό,τι μένει από την άλλη — <InlineMath>{'j'}</InlineMath>{' '}
          γράμματα από το <InlineMath>{'s_2'}</InlineMath> ή{' '}
          <InlineMath>{'i'}</InlineMath> από το <InlineMath>{'s_1'}</InlineMath>.
          Άρα το πρώτο «κενό prefix» κοστίζει ίσο με το μήκος του άλλου.
        </p>
        <p>
          Δες το να συμβαίνει — γέμισμα γραμμή-γραμμή για τα{' '}
          <InlineMath>{'s_1 = \\text{ΓΑΒ}'}</InlineMath> και{' '}
          <InlineMath>{'s_2 = \\text{ΜΙΑΟΥ}'}</InlineMath>, και μετά πέρασμα
          προς τα πίσω που <em>χτίζει</em> την υπερακολουθία γράμμα-γράμμα:
        </p>
        <ShortestSupersequenceTable />
        <p>
          <strong>(iii) Πολυπλοκότητα.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'(m+1)(n+1)'}</InlineMath> κελιά και κάθε κελί
          υπολογίζεται σε <InlineMath>{'O(1)'}</InlineMath> (μία σύγκριση, ένα{' '}
          <InlineMath>{'\\min'}</InlineMath>). Άρα{' '}
          <strong><InlineMath>{'\\Theta(mn)'}</InlineMath></strong> — ίδιος
          χρόνος με την LCS, που δεν είναι σύμπτωση: είναι το ίδιο πρόβλημα
          ντυμένο διαφορετικά.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «το αντίθετο του LCS πληρώνει την ίδια ταρίφα».</strong>{' '}
            Όποτε δεις «συντομότερη υπερακολουθία» / «μέγιστη κοινή
            υπακολουθία» / «edit distance χωρίς αντικατάσταση», ο πίνακας
            <InlineMath>{'(i, j)'}</InlineMath> πάνω σε προθέματα είναι ο{' '}
            σωστός φακός. Η διαφορά είναι ένας <InlineMath>{'\\max'}</InlineMath>{' '}
            ↔ <InlineMath>{'\\min'}</InlineMath>: για κάτι «μέγιστο μέσα στις
            ομοιότητες» χρησιμοποιείς max· για κάτι «ελάχιστο που τα χωράει και
            τα δύο» χρησιμοποιείς min. Σε όλες τις παραλλαγές, η πολυπλοκότητα
            είναι <InlineMath>{'\\Theta(mn)'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt2-th4',
    title: 'Σεπτέμβριος 2025 · Θέμα 4 — Χρονοπρογραμματισμός & χρόνος αναμονής',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'Θέμα 4',
    weight: 25,
    difficulty: 'hard',
    prerequisites: ['lectures/L12-greedy-ii'],
    statement: (
      <>
        <p>
          Έχουμε <InlineMath>{'n'}</InlineMath> φοιτητές/τριες· το άτομο{' '}
          <InlineMath>{'i'}</InlineMath> καταθέτει ένα αίτημα με χρόνο
          διεκπεραίωσης <InlineMath>{'t_i'}</InlineMath>. Τοποθετούμε τα{' '}
          <InlineMath>{'n'}</InlineMath> αιτήματα σε μια σειρά{' '}
          <InlineMath>{'\\pi'}</InlineMath> και τα διεκπεραιώνουμε ένα-ένα. Ο
          συνολικός χρόνος αναμονής του ατόμου <InlineMath>{'i'}</InlineMath>{' '}
          ισούται με τον χρόνο των αιτημάτων που διεκπεραιώθηκαν{' '}
          <strong>πριν</strong> το δικό του (με βάση τη σειρά{' '}
          <InlineMath>{'\\pi'}</InlineMath>) συν τον δικό του χρόνο{' '}
          <InlineMath>{'t_i'}</InlineMath>.
        </p>
        <p>
          (α) Με ποιο άπληστο κριτήριο επιλέγουμε τη σειρά{' '}
          <InlineMath>{'\\pi'}</InlineMath> ώστε να ελαχιστοποιήσουμε τον χρόνο
          αναμονής; (β) Απόδειξε τυπικά την ορθότητα του κριτηρίου.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Διευκρίνιση πρώτα — τι ακριβώς μετράμε.</strong> Ο χρόνος
          αναμονής του ατόμου <InlineMath>{'i'}</InlineMath> (όπως ορίζεται)
          είναι ο <em>χρόνος ολοκλήρωσης</em> του αιτήματός του —{' '}
          <InlineMath>{'f_i'}</InlineMath>. Αυτό που ζητάμε να ελαχιστοποιήσουμε
          είναι το <strong>συνολικό</strong> (ή ισοδύναμα, το μέσο) πλήθος{' '}
          <InlineMath>{'\\sum_i f_i'}</InlineMath>. (Ο χρόνος του τελευταίου
          ατόμου είναι πάντα <InlineMath>{'\\sum t_i'}</InlineMath>, σταθερός
          ανεξάρτητα από τη σειρά — άρα δεν έχει νόημα να ελαχιστοποιήσεις τον{' '}
          <em>μέγιστο</em> εδώ.)
        </p>
        <p>
          <strong>(α) Το κριτήριο: μικρότερος χρόνος πρώτα</strong> (Shortest
          Processing Time, SPT) — ταξινόμησε τα αιτήματα σε{' '}
          <strong>αύξουσα</strong> σειρά <InlineMath>{'t_i'}</InlineMath> και
          εκτέλεσέ τα έτσι.
        </p>
        <p>
          <strong>Γιατί δουλεύει διαισθητικά.</strong> Αν εκτελέσεις τα αιτήματα
          με σειρά <InlineMath>{'\\pi'}</InlineMath>, το{' '}
          <InlineMath>{'k'}</InlineMath>-οστό από αυτά συνεισφέρει τον χρόνο του{' '}
          <InlineMath>{'t_{\\pi(k)}'}</InlineMath> στους χρόνους{' '}
          <em>όλων</em> των επόμενων <InlineMath>{'n-k'}</InlineMath> αιτημάτων{' '}
          <strong>και</strong> στον δικό του. Άρα η συνολική του «τιμή» είναι{' '}
          <InlineMath>{'(n-k+1) \\cdot t_{\\pi(k)}'}</InlineMath> — τα αιτήματα
          στην <em>αρχή</em> πληρώνονται περισσότερες φορές. Όταν βαραίνεις
          περισσότερο όποια θέλεις, βάζεις πρώτα τα φτηνότερα (μικρότερα{' '}
          <InlineMath>{'t'}</InlineMath>). Αυτό ακριβώς λέει το SPT.
        </p>
        <p>
          Δες τη λογική να γίνεται μηχανική. Πέντε αιτήματα{' '}
          <InlineMath>{'t = [4, 1, 5, 2, 3]'}</InlineMath> ξεκινούν σε{' '}
          τυχαία/«αρχική» σειρά. Κάθε μπλοκ έχει πλάτος ίσο με τον{' '}
          <InlineMath>{'t'}</InlineMath> του και κάτω του γράφει τον χρόνο
          ολοκλήρωσης <InlineMath>{'f'}</InlineMath>. Πατάς ⇄ ανάμεσα σε δύο
          διαδοχικά αιτήματα και τα αντιμεταθέτεις· τα κίτρινα ⇄ μαρκάρουν τα
          «εκτός σειράς» ζεύγη — <strong>κάθε</strong> τέτοια ανταλλαγή μειώνει
          τη συνολική αναμονή. Συνέχισε ώσπου να μηδενιστούν οι αντιστροφές:
          έχεις φτάσει στο SPT (συνολική αναμονή <InlineMath>{'35'}</InlineMath>{' '}
          αντί για <InlineMath>{'55'}</InlineMath> της χειρότερης σειράς):
        </p>
        <WaitTimeShortestFirst />
        <p>
          <strong>(β) Απόδειξη ορθότητας (επιχείρημα ανταλλαγής).</strong> Στο
          εργαλείο είδες ότι κάθε ⇄ «εκτός σειράς» μικραίνει το άθροισμα — η
          απόδειξη απλώς γράφει αυτό σε μία γραμμή. Έστω βέλτιστη σειρά{' '}
          <InlineMath>{'S^*'}</InlineMath> που <strong>δεν</strong> είναι
          ταξινομημένη κατά αύξον <InlineMath>{'t'}</InlineMath>. Τότε υπάρχουν
          δύο <strong>διαδοχικά</strong> αιτήματα{' '}
          <InlineMath>{'i, j'}</InlineMath> (το <InlineMath>{'i'}</InlineMath>{' '}
          ακριβώς πριν το <InlineMath>{'j'}</InlineMath>) με{' '}
          <InlineMath>{'t_i > t_j'}</InlineMath> — δηλαδή «εκτός σειράς».
        </p>
        <p>
          <strong>Αντιμεταθέτουμε</strong> τα <InlineMath>{'i'}</InlineMath> και{' '}
          <InlineMath>{'j'}</InlineMath>. Τι αλλάζει;
        </p>
        <ul>
          <li>
            Όλα τα υπόλοιπα αιτήματα: ο χρόνος ολοκλήρωσής τους{' '}
            <strong>δεν αλλάζει</strong> — το ζευγάρι{' '}
            <InlineMath>{'\\{i,j\\}'}</InlineMath> καταλαμβάνει το ίδιο συνολικό
            διάστημα, απλώς με διαφορετική εσωτερική σειρά.
          </li>
          <li>
            Έστω <InlineMath>{'T'}</InlineMath> ο χρόνος που έχει περάσει πριν το
            ζευγάρι. <strong>Πριν:</strong> το <InlineMath>{'i'}</InlineMath>{' '}
            τελειώνει στο <InlineMath>{'T+t_i'}</InlineMath>, το{' '}
            <InlineMath>{'j'}</InlineMath> στο{' '}
            <InlineMath>{'T+t_i+t_j'}</InlineMath>. Άθροισμα:{' '}
            <InlineMath>{'2T + 2t_i + t_j'}</InlineMath>.
            <br />
            <strong>Μετά:</strong> το <InlineMath>{'j'}</InlineMath> τελειώνει
            στο <InlineMath>{'T+t_j'}</InlineMath>, το{' '}
            <InlineMath>{'i'}</InlineMath> στο{' '}
            <InlineMath>{'T+t_j+t_i'}</InlineMath>. Άθροισμα:{' '}
            <InlineMath>{'2T + 2t_j + t_i'}</InlineMath>.
          </li>
        </ul>
        <p>
          Η διαφορά (πριν − μετά) είναι{' '}
          <InlineMath>{'(2t_i + t_j) - (2t_j + t_i) = t_i - t_j > 0'}</InlineMath>.
          Δηλαδή η αντιμετάθεση <strong>μείωσε</strong> το συνολικό κόστος —
          αντίφαση με το ότι η <InlineMath>{'S^*'}</InlineMath> ήταν βέλτιστη.{' '}
          (Αυτή είναι ακριβώς η «−1 ανά κίτρινο ⇄» που είδες στο εργαλείο, σε
          τύπο.)
        </p>
        <p>
          Άρα καμία βέλτιστη λύση δεν έχει ζευγάρι «εκτός σειράς» — κάθε βέλτιστη
          λύση είναι ταξινομημένη κατά αύξον <InlineMath>{'t'}</InlineMath>,
          ακριβώς όπως κάνει ο άπληστος. <strong>∎</strong>
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κυριαρχεί η ταξινόμηση των{' '}
          <InlineMath>{'n'}</InlineMath> αιτημάτων κατά{' '}
          <InlineMath>{'t_i'}</InlineMath>: <InlineMath>{'O(n \\log n)'}</InlineMath>.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «οι θέσεις με βάρος δείχνουν τη σειρά».</strong>{' '}
            Όταν ζητείται ελαχιστοποίηση{' '}
            <InlineMath>{'\\sum_k w_k \\cdot t_{\\pi(k)}'}</InlineMath> ή{' '}
            <InlineMath>{'\\sum_i f_i'}</InlineMath> σε μία μηχανή, η σωστή
            σειρά είναι σχεδόν πάντα ταξινόμηση με κατάλληλο κλειδί που γράφεται
            σε δύο γραμμές: «αν αντιμεταθέσω δύο διαδοχικά εκτός σειράς, το
            άθροισμα πέφτει». Εδώ τα βάρη είναι <InlineMath>{'(n,n-1,\\dots,1)'}</InlineMath>{' '}
            (φθίνοντα) και το κλειδί είναι <InlineMath>{'t_i'}</InlineMath>{' '}
            αύξον. Σε παραλλαγές με «προθεσμίες», αλλάζει η αντικειμενική
            συνάρτηση (μέγιστη καθυστέρηση) και το κλειδί γίνεται{' '}
            <InlineMath>{'d_i'}</InlineMath> αύξον (EDF — δες τη διάλεξη). Σε
            δύο μηχανές με σειριακή + παράλληλη φάση, αλλάζει πάλι (φθίνον{' '}
            <InlineMath>{'p_i'}</InlineMath> — δες την άσκηση του καθαριστηρίου).
          </p>
        </Callout>
      </>
    ),
  },
  // ── Ιούνιος 2024 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt3-th1',
    title: 'Ιούνιος 2024 · Θέμα 1 — Κατασκευή γραφήματος & εκτέλεση Dijkstra',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2024',
    problemNumber: 'Θέμα 1',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>(α) (10 μονάδες)</strong> Να κατασκευάσεις ένα{' '}
          <strong>κατευθυνόμενο</strong> γράφημα με πέντε κορυφές, εκ των οποίων
          μία θα είναι η κορυφή-πηγή <InlineMath>{'s'}</InlineMath> (με
          εισερχόμενο βαθμό 0), <strong>5 ακμές</strong>, και ένα{' '}
          <strong>μη-αρνητικό κύκλο</strong>, για το οποίο ο αλγόριθμος του
          Dijkstra λειτουργεί σωστά. Να αιτιολογήσεις σύντομα την απάντησή σου.
        </p>
        <p>
          <strong>(β) (10 μονάδες)</strong> Να εφαρμόσεις πλήρως κατάλληλο
          αλγόριθμο στο γράφημα ώστε να υπολογίσεις σωστά τη συντομότερη απόσταση
          όλων των κορυφών από την <InlineMath>{'s'}</InlineMath>. Να
          κατασκευάσεις έναν πίνακα ο οποίος για κάθε βήμα θα δείχνει τις
          τρέχουσες αποστάσεις από την <InlineMath>{'s'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Τι ζητάμε από τον γράφο.</strong> Ο Dijkstra έχει ΜΙΑ
          προϋπόθεση: όλα τα βάρη <InlineMath>{'\\ell_e \\ge 0'}</InlineMath>. Ο
          «μη-αρνητικός κύκλος» δεν ενοχλεί καθόλου — αν διασχίσεις έναν κύκλο
          βάρους <InlineMath>{'\\ge 0'}</InlineMath>, στο τέλος έχεις πληρώσει το
          ίδιο ή περισσότερα, οπότε καμία βέλτιστη διαδρομή δεν θα ήθελε να τον
          κάνει. Άρα οι συντομότερες διαδρομές παραμένουν καλά ορισμένες.
        </p>
        <p>
          <strong>Ένα έγκυρο παράδειγμα.</strong> 5 κορυφές{' '}
          <InlineMath>{'s, a, b, c, d'}</InlineMath>· 5 ακμές, ένας κύκλος{' '}
          <InlineMath>{'a \\to b \\to c \\to a'}</InlineMath> με συνολικό βάρος{' '}
          <InlineMath>{'3 + 1 + 4 = 8 \\ge 0'}</InlineMath>:
        </p>
        <ul>
          <li><InlineMath>{'s \\to a'}</InlineMath>, βάρος <InlineMath>{'2'}</InlineMath></li>
          <li><InlineMath>{'a \\to b'}</InlineMath>, βάρος <InlineMath>{'3'}</InlineMath></li>
          <li><InlineMath>{'b \\to c'}</InlineMath>, βάρος <InlineMath>{'1'}</InlineMath></li>
          <li><InlineMath>{'c \\to a'}</InlineMath>, βάρος <InlineMath>{'4'}</InlineMath> — κλείνει τον κύκλο</li>
          <li><InlineMath>{'b \\to d'}</InlineMath>, βάρος <InlineMath>{'6'}</InlineMath></li>
        </ul>
        <p>
          Η <InlineMath>{'s'}</InlineMath> έχει εισερχόμενο βαθμό 0 ✓. Όλα τα
          βάρη <InlineMath>{'\\ge 0'}</InlineMath> ✓. Ο κύκλος είναι μη-αρνητικός ✓.
        </p>
        <p>
          <strong>(β) Dijkstra από την <InlineMath>{'s'}</InlineMath>, βήμα-βήμα.</strong>{' '}
          Δες τον αλγόριθμο να τρέχει στον γράφο πάνω-πάνω και τον πίνακα να
          γεμίζει· πρόσεξε τη στιγμή που φτάνουμε στην <InlineMath>{'c'}</InlineMath>{' '}
          και η ακμή <InlineMath>{'c \\to a'}</InlineMath> «προσπαθεί» να βελτιώσει
          την ήδη οριστική <InlineMath>{'a'}</InlineMath> — αλλά αποτυγχάνει, ακριβώς
          επειδή ο κύκλος είναι μη-αρνητικός:
        </p>
        <DijkstraHandTrace instance="pt3-th1" />
        <p>
          <strong>Συντομότερες αποστάσεις από την <InlineMath>{'s'}</InlineMath>:</strong>{' '}
          <InlineMath>{'s{=}0,\\ a{=}2,\\ b{=}5,\\ c{=}6,\\ d{=}11'}</InlineMath>.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «μη-αρνητικός κύκλος ≠ αρνητική ακμή».</strong>{' '}
            Σε κατευθυνόμενα ζυγισμένα γραφήματα, ο Dijkstra απαιτεί κάθε{' '}
            <em>ακμή</em> να είναι <InlineMath>{'\\ge 0'}</InlineMath> — όχι κάθε{' '}
            <em>κύκλος</em>. Ένας κύκλος βάρους ≥ 0 με όλα τα βάρη ακμών{' '}
            <InlineMath>{'\\ge 0'}</InlineMath> δεν επηρεάζει καθόλου την ορθότητα.
            Όταν η εκφώνηση σου ζητά να φτιάξεις γράφο «όπου δουλεύει ο Dijkstra»,
            είναι ευκολότερο να ξεκινήσεις με ΜΙΑ ακμή <InlineMath>{'< 0'}</InlineMath>{' '}
            ως «παγίδα να αποφύγεις» και να βάλεις όλα τα υπόλοιπα{' '}
            <InlineMath>{'\\ge 0'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt3-th2',
    title: 'Ιούνιος 2024 · Θέμα 2 — Πλειοψηφικό στοιχείο σε O(n log n)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'june-2024',
    problemNumber: 'Θέμα 2',
    weight: 30,
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <p>
        Ένας πίνακας <InlineMath>{'n'}</InlineMath> στοιχείων{' '}
        <InlineMath>{'[1\\dots n]'}</InlineMath> έχει ένα{' '}
        <strong>πλειοψηφικό στοιχείο</strong> αν γνήσια πάνω από τα μισά του
        στοιχεία είναι ίδια. Τα στοιχεία <strong>δεν</strong> είναι μεταξύ τους
        συγκρίσιμα (π.χ. ιερογλυφικά ή χρώματα), αλλά μπορούμε σε σταθερό χρόνο
        να αποφασίσουμε αν δύο στοιχεία είναι ίδια. Περίγραψε έναν αλγόριθμο που
        βρίσκει το πλειοψηφικό στοιχείο σε χρόνο <InlineMath>{'O(n\\log n)'}</InlineMath>{' '}
        και αιτιολόγησε την ορθότητά του.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Η παγίδα.</strong> Δεν μπορούμε να ταξινομήσουμε — τα στοιχεία
          δεν συγκρίνονται με <InlineMath>{'<'}</InlineMath>, μόνο με «ίδιο;».
          Δίχως ταξινόμηση, αδειάζει η εργαλειοθήκη: ούτε hash (δεν ξέρουμε «τι
          είναι» κάθε στοιχείο), ούτε αραιό μέτρημα. Μένει ένα: να γίνει το
          ίδιο το πρόβλημα μικρότερη παραλλαγή του εαυτού του — διαίρει και
          κυρίευε.
        </p>
        <p>
          <strong>Η μία και μοναδική παρατήρηση.</strong> Αν στο σύνολο{' '}
          <InlineMath>{'A'}</InlineMath> υπάρχει πλειοψηφικό στοιχείο{' '}
          <InlineMath>{'x'}</InlineMath> (πάνω από <InlineMath>{'n/2'}</InlineMath>{' '}
          εμφανίσεις), τότε αν κόψουμε το <InlineMath>{'A'}</InlineMath> στη μέση
          το <InlineMath>{'x'}</InlineMath> πρέπει να είναι πλειοψηφικό σε{' '}
          <em>τουλάχιστον ένα</em> από τα δύο μισά. Διαφορετικά θα είχε{' '}
          <InlineMath>{'\\le n/4'}</InlineMath> εμφανίσεις σε καθένα, σύνολο{' '}
          <InlineMath>{'\\le n/2'}</InlineMath> — αντίφαση. Άρα οι μόνοι
          υποψήφιοι του γονέα είναι τα δύο που γυρίζουν τα παιδιά.
        </p>
        <p>
          <strong>Ο αλγόριθμος <InlineMath>{'\\text{Majority}(A)'}</InlineMath>.</strong>
        </p>
        <ul>
          <li>
            <strong>Βάση.</strong> Πίνακας με 1 στοιχείο: αυτό είναι ο υποψήφιος.
          </li>
          <li>
            <strong>Διαίρει.</strong> Σπάσε στη μέση και πάρε αναδρομικά τους
            υποψήφιους <InlineMath>{'x_L, x_R'}</InlineMath> των δύο μισών.
          </li>
          <li>
            <strong>Κυρίευε.</strong> Σάρωσε ολόκληρο το <InlineMath>{'A'}</InlineMath>{' '}
            για κάθε υποψήφιο και μέτρα τις ισότητες (καθεμία{' '}
            <InlineMath>{'O(1)'}</InlineMath>). Αν κάποιο πλήθος ξεπερνά το{' '}
            <InlineMath>{'n/2'}</InlineMath>, αυτό είναι το πλειοψηφικό· αλλιώς
            δεν υπάρχει.
          </li>
        </ul>
        <p>
          Δες το να τρέχει σε 12 «ιερογλυφικά» — η ζώνη χρώματος δείχνει ποιο
          υπο-διάστημα δουλεύει αναδρομικά, η κίτρινη στεφάνη τον υποψήφιο που
          επιβίωσε στο τέλος:
        </p>
        <MajorityCandidateDivide preset="pt3-th2" />
        <p>
          <strong>Ορθότητα.</strong> Η παρατήρηση εγγυάται ότι αν υπάρχει
          πλειοψηφικό, εμφανίζεται ως υποψήφιος σε ένα τουλάχιστον μισό — άρα
          μπαίνει στο «κυρίευε». Το τελικό μέτρημα είναι εξαντλητικό, δίνει
          ψευδείς-θετικούς ποτέ.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Δύο αναδρομικές κλήσεις στο μισό, και{' '}
          <InlineMath>{'O(n)'}</InlineMath> δουλειά για το μέτρημα:
        </p>
        <BlockMath>{'T(n) = 2\\,T(n/2) + O(n) \\;\\Rightarrow\\; T(n) = O(n\\log n)'}</BlockMath>
        <p>
          Master Theorem, Περίπτωση 2 — η ίδια αναδρομή με τη συγχωνευτική
          ταξινόμηση.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «κυρίαρχο ⇒ κυρίαρχο σε ≥ 1 μισό».</strong>{' '}
          Όποτε σε εξέταση δεις πρόβλημα τύπου «βρες ένα στοιχείο που εμφανίζεται
          σε &gt; n/2 / &gt; n/k θέσεις» χωρίς δικαίωμα ταξινόμησης ή hash,
          σκέψου D&amp;C: σπάσε στη μέση, ζήτα έναν <em>υποψήφιο</em> από κάθε
          μισό, επαλήθευσε με μια γραμμική σάρωση. Είναι ακριβώς το ίδιο σχήμα
          με το «κυρίαρχο χρώμα» της διάλεξης — μόνο που εκεί τα παιδιά είναι 4
          (τεταρτημόρια), εδώ είναι 2.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt3-th3',
    title: 'Ιούνιος 2024 · Θέμα 3 — Τέλειο ταίριασμα σε δέντρο',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'june-2024',
    problemNumber: 'Θέμα 3',
    weight: 30,
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <p>
        Ένα <strong>τέλειο ταίριασμα</strong> σε ένα γράφημα είναι ένα σύνολο
        ακμών έτσι ώστε κάθε κορυφή να περιέχεται σε <strong>ακριβώς μία</strong>{' '}
        ακμή. Περίγραψε σε φυσική γλώσσα έναν <strong>άπληστο</strong> αλγόριθμο{' '}
        <strong>γραμμικού χρόνου</strong> που αποφασίζει αν ένα{' '}
        <strong>δέντρο</strong> έχει τέλειο ταίριασμα ή όχι, και αιτιολόγησε με
        1-2 προτάσεις την ορθότητά του (δηλαδή γιατί επέλεξες αυτό το κριτήριο
        άπληστης επιλογής).
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα — η επιλογή στα φύλλα δεν είναι επιλογή.</strong> Σε
          ένα δέντρο, ένα <strong>φύλλο</strong> <InlineMath>{'\\ell'}</InlineMath>{' '}
          (κορυφή βαθμού 1) έχει μία μόνο ακμή. Αν αυτή η ακμή{' '}
          <em>δεν</em> μπει στο ταίριασμα, το <InlineMath>{'\\ell'}</InlineMath>{' '}
          μένει ακάλυπτο — δεν υπάρχει εναλλακτική. Άρα κάθε τέλειο ταίριασμα{' '}
          <em>υποχρεώνεται</em> να την περιέχει. Ο άπληστος που την «κλειδώνει»
          αμέσως δεν θυσιάζει τίποτα.
        </p>
        <p>
          <strong>Ο αλγόριθμος, με μία πρόταση.</strong> Επανέλαβε: διάλεξε ένα
          φύλλο <InlineMath>{'\\ell'}</InlineMath>, βάλε την ακμή{' '}
          <InlineMath>{'\\{\\ell, p(\\ell)\\}'}</InlineMath> στο ταίριασμα,
          σβήσε και τις δύο κορυφές (μαζί με όλες τις ακμές τους), και
          συνέχισε στο υπολειπόμενο δάσος. Αν εμφανιστεί{' '}
          <strong>απομονωμένη κορυφή</strong>, το δέντρο{' '}
          <strong>δεν</strong> έχει τέλειο ταίριασμα· αν το δάσος αδειάσει,
          το ταίριασμα είναι ο πίνακας των ζευγαριών που μάζεψες.
        </p>
        <p>
          Δες την άπληστη μέθοδο σε δύο 6-κορυφή δέντρα της ίδιας οικογένειας —
          το πρώτο κλείνει καθαρά, το δεύτερο σπάει με δύο απομονωμένα παιδιά:
        </p>
        <TreeMatchingPeel />
        <p>
          <strong>Γιατί είναι σωστό (επιχείρημα ανταλλαγής + επαγωγή).</strong>{' '}
          Έστω βέλτιστο τέλειο ταίριασμα <InlineMath>{'M^*'}</InlineMath> και
          πάρε ένα φύλλο <InlineMath>{'\\ell'}</InlineMath> με γονέα{' '}
          <InlineMath>{'p'}</InlineMath>. Το <InlineMath>{'\\ell'}</InlineMath>{' '}
          έχει μόνο τον <InlineMath>{'p'}</InlineMath> για γείτονα, οπότε η
          ακμή <InlineMath>{'\\{\\ell, p\\}'}</InlineMath> ανήκει ήδη στο{' '}
          <InlineMath>{'M^*'}</InlineMath>. Ο άπληστος παίρνει αυτή τη ίδια
          ακμή — δεν χάνει τίποτα. Στο υπόλοιπο δάσος (n−2 κορυφές),{' '}
          <strong>επαγωγή στο μέγεθος</strong> κλείνει το επιχείρημα: αυτό που
          δουλεύει στα φύλλα δουλεύει σε όλο το δέντρο.
        </p>
        <p>
          <strong>Γραμμικός χρόνος.</strong> Κάθε κορυφή και κάθε ακμή
          εξετάζεται και αφαιρείται μία φορά →{' '}
          <InlineMath>{'O(n)'}</InlineMath>. Καθαρή υλοποίηση: μια FIFO ουρά
          από τρέχοντα φύλλα — όταν αφαιρείς τον γονέα{' '}
          <InlineMath>{'p'}</InlineMath>, οποιοσδήποτε γείτονάς του έμεινε με
          βαθμό 1 σπρώχνεται στην ουρά.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «οι αναγκαστικές κινήσεις είναι δωρεάν».</strong>{' '}
            Όποτε σε κάποιο πρόβλημα ένα στοιχείο έχει <em>μία μόνη επιλογή</em>{' '}
            (φύλλο με έναν γείτονα· κορυφή που υποχρεωτικά πρέπει να μπει στη
            λύση· μεταβλητή με μοναδική επιτρεπτή ανάθεση), βάλ' την πρώτη.
            Καμία βέλτιστη λύση δεν τη χάνει, οπότε ο άπληστος δεν θυσιάζει
            τίποτα· ταυτόχρονα <em>κάνει το πρόβλημα μικρότερο</em>, οπότε η
            επαγωγή κλείνει την απόδειξη. Το ίδιο μοτίβο βλέπεις στον Huffman:
            «βάλε τους δύο σπανιότερους ως αδέρφια στο βάθος» γιατί κάποιο
            βέλτιστο δέντρο τους έχει <em>ούτως ή άλλως</em> εκεί.
          </p>
        </Callout>
      </>
    ),
  },
  // ── Σεπτέμβριος 2024 — Θέμα 1 (5 προτάσεις Σωστό/Λάθος) ─────────────────
  {
    id: 'pt4-th1-q1',
    title: 'Σεπτέμβριος 2024 · Θέμα 1.1 — Σ/Λ: P ≠ NP και συντομότερο μονοπάτι',
    topic: 'intro',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 1 — Πρόταση 1',
    weight: 4,
    difficulty: 'easy',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Αν
        γνωρίζουμε ότι <InlineMath>{'P \\neq NP'}</InlineMath>, τότε το πρόβλημα
        της εύρεσης συντομότερου μονοπατιού ανάμεσα σε δύο κορυφές ενός
        γραφήματος <strong>δεν</strong> είναι πολυωνυμικά επιλύσιμο.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong>
        </p>
        <p>
          Το πρόβλημα του συντομότερου μονοπατιού <strong>λύνεται</strong> σε
          πολυωνυμικό χρόνο — το ξέρουμε καλά: BFS για γραφήματα χωρίς βάρη,
          Dijkstra σε <InlineMath>{'O(m\\log n)'}</InlineMath> για θετικά βάρη,
          Bellman-Ford σε <InlineMath>{'O(mn)'}</InlineMath> ακόμη και με
          αρνητικά βάρη. Δηλαδή ανήκει στο <InlineMath>{'P'}</InlineMath>.
        </p>
        <p>
          Η εικασία <InlineMath>{'P \\neq NP'}</InlineMath> αφορά τα{' '}
          <em>δύσκολα</em> προβλήματα (τα NP-πλήρη, όπως SAT, Hamilton, σακίδιο)
          — δεν λέει τίποτα «κακό» για τα προβλήματα που ήδη ξέρουμε να λύνουμε
          γρήγορα. Το συντομότερο μονοπάτι παραμένει στο{' '}
          <InlineMath>{'P'}</InlineMath> ανεξάρτητα από το αν{' '}
          <InlineMath>{'P = NP'}</InlineMath> ή όχι.
        </p>
        <ComplexityZooLab focus="shortest-path" />
        <Callout type="warning">
          <strong>Παγίδα της εικασίας.</strong> Η <InlineMath>{'P \\neq NP'}</InlineMath>{' '}
          ΔΕΝ «κλειδώνει» όλα τα προβλήματα γραφημάτων έξω από το P. Κλειδώνει
          μόνο όσα είναι NP-πλήρη (μακρύτερο μονοπάτι, Hamilton, TSP, ...). Όταν
          σε εκφώνηση Σ/Λ δεις την υπόθεση <InlineMath>{'P \\neq NP'}</InlineMath>{' '}
          να «αποδεικνύει» ότι κάτι ΔΕΝ είναι σε P, πρώτα ρώτα:{' '}
          <em>«είναι αυτό το κάτι ήδη γνωστό ότι είναι σε P;»</em> Αν ναι, η
          δήλωση είναι λάθος ανεξάρτητα από την εικασία. Εδώ, ο Dijkstra είναι η
          άμεση αντίφαση.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt4-th1-q2',
    title: 'Σεπτέμβριος 2024 · Θέμα 1.2 — Σ/Λ: f + g = Θ(max{f, g})',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 1 — Πρόταση 2',
    weight: 4,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Αν{' '}
        <InlineMath>{'f(n), g(n)'}</InlineMath> είναι θετικές συναρτήσεις με{' '}
        <InlineMath>{'f(n) \\neq g(n)'}</InlineMath>, τότε{' '}
        <InlineMath>{'f(n) + g(n) = \\Theta(\\max\\{f(n), g(n)\\})'}</InlineMath>.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΣΩΣΤΟ.</strong>
        </p>
        <p>
          Έστω <InlineMath>{'M = \\max\\{f(n), g(n)\\}'}</InlineMath>. Θα δείξουμε
          ότι το <InlineMath>{'f + g'}</InlineMath> είναι «σφηνωμένο» ανάμεσα σε
          δύο σταθερά πολλαπλάσια του <InlineMath>{'M'}</InlineMath> — αυτός είναι
          ο ορισμός του <InlineMath>{'\\Theta'}</InlineMath>.
        </p>
        <ul>
          <li>
            <strong>Κάτω φράγμα:</strong> το άθροισμα είναι τουλάχιστον όσο ο
            μεγαλύτερος όρος: <InlineMath>{'f + g \\ge M'}</InlineMath>. (Οι
            συναρτήσεις είναι θετικές, οπότε ο άλλος όρος μόνο προσθέτει.)
          </li>
          <li>
            <strong>Άνω φράγμα:</strong> κάθε όρος είναι το πολύ{' '}
            <InlineMath>{'M'}</InlineMath>, άρα{' '}
            <InlineMath>{'f + g \\le M + M = 2M'}</InlineMath>.
          </li>
        </ul>
        <BlockMath>{'M \\le f(n) + g(n) \\le 2M \\;\\Rightarrow\\; f + g = \\Theta(M).'}</BlockMath>
        <p>
          Πρόσεξε: η υπόθεση <InlineMath>{'f \\neq g'}</InlineMath> είναι{' '}
          <strong>άσχετη</strong> — η ιδιότητα ισχύει για <em>κάθε</em> ζεύγος
          θετικών συναρτήσεων. Είναι ένα «δόλωμα» που δεν αλλάζει τίποτα.
        </p>
        <p>
          Δες τη σφήνα ζωντανά — άλλαξε ζευγάρι <InlineMath>{'(f, g)'}</InlineMath>{' '}
          και κάνε <InlineMath>{'f = g'}</InlineMath>· η ιδιότητα ισχύει το ίδιο:
        </p>
        <SandwichTheoremViz preset="pt4-th1-q2" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «πιάσε σφήνα γύρω από το άγνωστο».</strong>{' '}
          Όταν μια ποσότητα <InlineMath>{'X'}</InlineMath> μπαίνει μεταξύ δύο
          εκφράσεων ίδιας τάξης (<InlineMath>{'c_1 \\cdot M \\le X \\le c_2 \\cdot M'}</InlineMath>),
          τότε <InlineMath>{'X \\in \\Theta(M)'}</InlineMath> αυτόματα. Δύο πρακτικές
          παραλλαγές: «το άθροισμα είναι μεταξύ του μέγιστου όρου και n φορές το
          μέγιστο» και «κάθε όρος αθροίσματος φράσσεται από σταθερές → άθροισμα Θ(n)».
        </Callout>
      </>
    ),
  },
  {
    id: 'pt4-th1-q3',
    title: 'Σεπτέμβριος 2024 · Θέμα 1.3 — Σ/Λ: ο Bellman-Ford είναι άπληστος;',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 1 — Πρόταση 3',
    weight: 4,
    difficulty: 'easy',
    prerequisites: ['lectures/L17-dp-iv'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Ο
        αλγόριθμος Bellman-Ford ανήκει στην κατηγορία των άπληστων αλγορίθμων.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong> Ο Bellman-Ford είναι{' '}
          <strong>δυναμικός προγραμματισμός</strong>, όχι άπληστος.
        </p>
        <p>
          <strong>Η παγίδα.</strong> Και οι δύο αλγόριθμοι «χαλαρώνουν» ακμές —
          αυτό μπορεί να μπερδέψει. Η <em>πραγματική</em> διαφορά είναι όχι σε
          τι κάνουν, αλλά <em>πώς το θυμούνται</em>:
        </p>
        <ul>
          <li>
            <strong>Άπληστος = «μία αμετάκλητη απόφαση τη φορά».</strong> Ο
            Dijkstra εξάγει την κορυφή με το μικρότερο{' '}
            <InlineMath>{'d'}</InlineMath>, την κλειδώνει, και ΔΕΝ την
            ξανακοιτάει — οριστικοποίηση είναι δέσμευση.
          </li>
          <li>
            <strong>DP = «ξαναγράφω ολόκληρο το διάνυσμα από το προηγούμενο».</strong>{' '}
            Ο Bellman-Ford κρατάει πίνακα{' '}
            <InlineMath>{'M[i, v]'}</InlineMath>· κάθε γύρος{' '}
            <InlineMath>{'i'}</InlineMath> γράφει μια καινούργια γραμμή{' '}
            διαβάζοντας ολόκληρη τη γραμμή <InlineMath>{'i-1'}</InlineMath>.
            Καμία κορυφή δεν «κλειδώνει» — μπορεί να ξαναγραφτεί όσες φορές
            θέλει.
          </li>
        </ul>
        <p>
          Δες τα δύο πρόσωπα στο ίδιο γράφημα, βήμα προς βήμα:
        </p>
        <GreedyVsDpRelaxation />
        <p>
          <strong>Η ίδια απάντηση, διαφορετική μηχανική.</strong> Και τα δύο
          βρίσκουν <InlineMath>{'d(s, t) = 6'}</InlineMath> — γιατί έτσι έχουν
          φτιαχτεί. Αλλά:
        </p>
        <ul>
          <li>
            Ο Dijkstra έκανε <strong>4 εξαγωγές + κλειδώματα</strong> και κάθε
            κορυφή κλειδώθηκε ακριβώς μία φορά — greedy.
          </li>
          <li>
            Ο Bellman-Ford έκανε <strong>3 γύρους</strong> και κάθε γραμμή του
            πίνακα διαβάζει την προηγούμενη — DP. Στο μέσο βήμα, το{' '}
            <InlineMath>{'M[2, b]'}</InlineMath> υπολογίστηκε από το{' '}
            <InlineMath>{'M[1, a] + 2 = 3'}</InlineMath>, ΞΑΝΑγράφοντας πάνω
            από την προηγούμενη τιμή 4 — χωρίς δέσμευση πουθενά.
          </li>
        </ul>
        <p>
          Είναι αυτή η διαφορά που επιτρέπει στον Bellman-Ford να δουλέψει με
          αρνητικά βάρη και να ανιχνεύει αρνητικούς κύκλους (
          <a href="#exercise:pt1-th2-a" className="underline">pt1-th2-a</a>),
          ενώ ο Dijkstra σπάει αμέσως μόλις δει το πρώτο αρνητικό. Το{' '}
          «κλείδωμα» δεν είναι λεπτομέρεια — είναι η ζωτική διαφορά στρατηγικής
          μνήμης.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «κλείδωμα ή πίνακας;».</strong> Το
            διαγνωστικό για άπληστο vs DP δεν είναι «πόσο γρήγορος είναι» ή
            «πόσο απλός φαίνεται», αλλά:
          </p>
          <ul>
            <li>
              <strong>Άπληστος</strong> ⇔ μία απόφαση το βήμα, αμετάκλητη·
              δομές: ουρά προτεραιότητας + locked set· πολυπλοκότητα συνήθως{' '}
              <InlineMath>{'O(m \\log n)'}</InlineMath> ή{' '}
              <InlineMath>{'O(m \\alpha(n))'}</InlineMath>.
            </li>
            <li>
              <strong>DP</strong> ⇔ πίνακας με υποπροβλήματα ταξινομημένα σε
              μια <em>μονότονη παράμετρο</em>, νέα γραμμή διαβάζει την
              προηγούμενη· πολυπλοκότητα συνήθως{' '}
              <InlineMath>{'\\Theta(\\text{μέγεθος πίνακα})'}</InlineMath>.
            </li>
          </ul>
          <p>
            Ο Bellman-Ford έχει πίνακα <InlineMath>{'M[i,v]'}</InlineMath>{' '}
            παραμετροποιημένο με «πλήθος ακμών», άρα DP. Άλλοι DP-σε-γραφήματα
            της διάλεξης: ανεξάρτητο σύνολο σε δέντρο (παραμετροποίηση με
            υποδέντρα), shortest path σε DAG (παραμετροποίηση με τοπολογική
            σειρά). Άπληστοι σε γραφήματα: Dijkstra, Prim, Kruskal — όλοι με
            «extract + lock» μηχανική.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt4-th1-q4',
    title: 'Σεπτέμβριος 2024 · Θέμα 1.4 — Σ/Λ: T(n) = 2T(n−1) + Θ(n)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 1 — Πρόταση 4',
    weight: 4,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Αν{' '}
        <InlineMath>{'T(n) = 2T(n-1) + \\Theta(n)'}</InlineMath>, τότε{' '}
        <InlineMath>{'T(n) = O(n^2)'}</InlineMath>.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong> Η πρόταση μοιάζει αληθοφανής («δύο αναδρομικές
          κλήσεις + γραμμική δουλειά → πρέπει να μοιάζει με mergesort») αλλά
          είναι τελείως λάθος. Η ζωτική διαφορά: <strong>μικραίνει κατά 1</strong>{' '}
          (όχι στο μισό). Σύγκρινε με το μάτι τα δύο δέντρα:
        </p>
        <BranchingContrast />
        <p>
          Στο <InlineMath>{'2T(n-1)'}</InlineMath> κάθε επίπεδο διπλασιάζει το
          πλήθος υποπροβλημάτων ΚΑΙ χρειάζονται <InlineMath>{'n'}</InlineMath>{' '}
          επίπεδα (όχι <InlineMath>{'\\log n'}</InlineMath>). Άρα τα φύλλα είναι{' '}
          <InlineMath>{'2^n'}</InlineMath> — εκθετικά. Ξεδιπλώνοντας:
        </p>
        <BlockMath>{'T(n) = 2T(n-1) + cn = 4T(n-2) + 2c(n-1) + cn = \\dots = 2^n\\,T(0) + \\text{(πολυωνυμικοί όροι)}.'}</BlockMath>
        <p>
          Μόνο ο όρος <InlineMath>{'2^n T(0)'}</InlineMath> είναι ήδη εκθετικός
          — άρα <InlineMath>{'T(n) = \\Theta(2^n)'}</InlineMath>, ούτε καν
          πολυωνυμικό φράγμα.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — δύο κλήσεις στο n−1 = εκθετικό, στο n/2 = πολυωνυμικό.</strong>{' '}
          Στις αναδρομές «πλήθος κλήσεων» × «πόσο μικραίνει» καθορίζει τα πάντα:
          <ul>
            <li>
              <InlineMath>{'2T(n-1)'}</InlineMath> → βάθος n, fanout 2 → 2ⁿ φύλλα → <strong>εκθετικό</strong>.
            </li>
            <li>
              <InlineMath>{'2T(n/2)'}</InlineMath> → βάθος log n, fanout 2 → n φύλλα → <strong>πολυωνυμικό</strong>.
            </li>
          </ul>
          Όποιος βλέπει <InlineMath>{'2T(n-1)'}</InlineMath> ή{' '}
          <InlineMath>{'aT(n-c)'}</InlineMath> για <InlineMath>{'a > 1'}</InlineMath>{' '}
          πρέπει αμέσως να ψάχνει για εκθετική απάντηση — όπως ακριβώς ο Hanoi.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt4-th1-q5',
    title: 'Σεπτέμβριος 2024 · Θέμα 1.5 — Σ/Λ: 1 + 2 + … + n = Θ(n²)',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 1 — Πρόταση 5',
    weight: 4,
    difficulty: 'easy',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>:{' '}
        <InlineMath>{'1 + 2 + \\cdots + n = \\Theta(n^2)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΣΩΣΤΟ.</strong>
        </p>
        <p>
          Το άθροισμα των πρώτων <InlineMath>{'n'}</InlineMath> φυσικών έχει
          κλειστό τύπο (ο θρύλος λέει ότι τον βρήκε ο Gauss μικρός):
        </p>
        <BlockMath>{'1 + 2 + \\cdots + n = \\frac{n(n+1)}{2} = \\frac{n^2 + n}{2}.'}</BlockMath>
        <p>
          Ο κυρίαρχος όρος είναι το <InlineMath>{'n^2/2'}</InlineMath> — μια
          σταθερά επί <InlineMath>{'n^2'}</InlineMath> — άρα{' '}
          <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
        </p>
        <p>
          <strong>Χωρίς τον τύπο:</strong> και πάλι το βλέπεις. Οι μισοί όροι
          (από τον <InlineMath>{'n/2'}</InlineMath> ως τον{' '}
          <InlineMath>{'n'}</InlineMath>) είναι ο καθένας{' '}
          <InlineMath>{'\\ge n/2'}</InlineMath>, άρα το άθροισμα είναι{' '}
          <InlineMath>{'\\ge (n/2)(n/2) = n^2/4'}</InlineMath> →{' '}
          <InlineMath>{'\\Omega(n^2)'}</InlineMath>. Και κάθε όρος είναι{' '}
          <InlineMath>{'\\le n'}</InlineMath>, άρα το άθροισμα{' '}
          <InlineMath>{'\\le n \\cdot n = n^2'}</InlineMath> →{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>. Μαζί: <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης: τύπος-κλειδί για κάθε αριθμητικό άθροισμα.</strong>{' '}
          <InlineMath>{'1 + 2 + \\cdots + n = n(n+1)/2 = \\Theta(n^2)'}</InlineMath>{' '}
          εμφανίζεται κάθε φορά που έχεις «εξωτερικό βρόχο 1..n, εσωτερικός 1..i»
          (διπλοί βρόχοι με κάτω τριγωνική δομή). Δεύτερο πιο συχνό:{' '}
          <InlineMath>{'\\sum i^2 = \\Theta(n^3)'}</InlineMath>. Αν τα ξέρεις
          απ' έξω, οι ασκήσεις πολυπλοκότητας λύνονται σε δύο γραμμές.
        </Callout>
      </>
    ),
  },
  // ── Σεπτέμβριος 2024 — Θέματα 2–4 (ολοκλήρωση του paper) ────────────────
  {
    id: 'pt4-th2-a',
    title: 'Σεπτέμβριος 2024 · Θέμα 2α — Δίκτυο δρόμων με μη-μοναδικό ΕΕΔ',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 2α',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Δίνεται ένα δίκτυο επαρχιακών πόλεων στο ίδιο υψόμετρο, συνδεδεμένων με
          αυτοκινητόδρομους. Εν όψει του χειμώνα, οι πόλεις θέλουν να μπορούν να
          καθαρίζουν το <strong>συντομότερο συνολικό μήκος δρόμων</strong> ώστε να
          παραμένει δυνατή η μετάβαση από κάθε πόλη σε κάθε άλλη. Το δίκτυο έχει
          5 πόλεις <InlineMath>{'A, B, C, D, E'}</InlineMath> και τους δρόμους:{' '}
          <InlineMath>{'A\\!-\\!B,\\ A\\!-\\!C,\\ A\\!-\\!E,\\ B\\!-\\!C,\\ B\\!-\\!D,\\ B\\!-\\!E,\\ C\\!-\\!D,\\ D\\!-\\!E'}</InlineMath>.
        </p>
        <p>
          <strong>(α)</strong> Δώσε κατάλληλα μήκη στους δρόμους ώστε να{' '}
          <strong>μην</strong> υπάρχει μοναδική βέλτιστη λύση, και αιτιολόγησε
          γιατί η λύση δεν είναι μοναδική.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πριν την αφαίρεση σε ΕΕΔ, δες το δίκτυο όπως θα του δώσουμε μήκη — οι
          τρεις ίσες ακμές του τριγώνου A-B-C είναι ο μηχανισμός της
          μη-μοναδικότητας:
        </p>
        <div className="not-prose my-4 flex justify-center">
          <svg
            viewBox="0 0 540 360"
            className="w-full max-w-2xl rounded-lg border border-border bg-bg-elevated"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Δίκτυο 5 επαρχιακών πόλεων A, B, C, D, E με 8 αυτοκινητόδρομους και χειμερινό φόντο. Το τρίγωνο A-B-C φέρει ίδιες ακμές βάρους 1· τα υπόλοιπα βάρη είναι 2 έως 6."
          >
            {/* Triangle ABC backing — soft tint to mark «κύκλος ίδιων βαρών» */}
            <polygon points="130,80 330,80 230,220" fill="rgb(16 185 129 / 0.10)" stroke="none" />

            {/* Snowflakes (decorative, χειμώνας motif) */}
            <text x="460" y="32" fontSize="18" fill="rgb(var(--fg-muted))" opacity="0.55">❄</text>
            <text x="500" y="52" fontSize="13" fill="rgb(var(--fg-muted))" opacity="0.5">❄</text>
            <text x="478" y="66" fontSize="11" fill="rgb(var(--fg-muted))" opacity="0.4">❄</text>
            <text x="505" y="28" fontSize="10" fill="rgb(var(--fg-muted))" opacity="0.45">❄</text>

            {/* Outer edges (weights 2..6) — drawn first so the triangle sits on top */}
            <line x1="130" y1="80" x2="90" y2="290" stroke="rgb(var(--fg-muted))" strokeWidth="2.5" />
            <line x1="330" y1="80" x2="470" y2="210" stroke="rgb(var(--fg-muted))" strokeWidth="2.5" />
            <path d="M 330 80 Q 220 380 90 290" fill="none" stroke="rgb(var(--fg-muted))" strokeWidth="2.5" />
            <line x1="230" y1="220" x2="470" y2="210" stroke="rgb(var(--fg-muted))" strokeWidth="2.5" />
            <line x1="470" y1="210" x2="90" y2="290" stroke="rgb(var(--fg-muted))" strokeWidth="2.5" />

            {/* Triangle edges (weight 1) — emerald, thicker, on top */}
            <line x1="130" y1="80" x2="330" y2="80" stroke="#10b981" strokeWidth="3.5" />
            <line x1="130" y1="80" x2="230" y2="220" stroke="#10b981" strokeWidth="3.5" />
            <line x1="330" y1="80" x2="230" y2="220" stroke="#10b981" strokeWidth="3.5" />

            {/* Weight labels (with bg rects so they read against the lines) */}
            {/* A-B mid: (230, 80) */}
            <rect x="222" y="60" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="#10b981" strokeWidth="1.5" />
            <text x="231" y="73" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#10b981">1</text>
            {/* A-C mid: (180, 150) */}
            <rect x="156" y="138" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="#10b981" strokeWidth="1.5" />
            <text x="165" y="151" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#10b981">1</text>
            {/* B-C mid: (280, 150) */}
            <rect x="289" y="138" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="#10b981" strokeWidth="1.5" />
            <text x="298" y="151" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#10b981">1</text>
            {/* A-E mid: (110, 185) */}
            <rect x="58" y="178" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--fg-muted))" strokeWidth="1" />
            <text x="67" y="191" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--fg))">2</text>
            {/* B-D mid: (400, 145) */}
            <rect x="396" y="135" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--fg-muted))" strokeWidth="1" />
            <text x="405" y="148" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--fg))">3</text>
            {/* B-E curve mid: (215, 283) */}
            <rect x="206" y="274" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--fg-muted))" strokeWidth="1" />
            <text x="215" y="287" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--fg))">4</text>
            {/* C-D mid: (350, 215) */}
            <rect x="342" y="205" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--fg-muted))" strokeWidth="1" />
            <text x="351" y="218" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--fg))">5</text>
            {/* D-E mid: (280, 250) */}
            <rect x="280" y="242" width="18" height="18" rx="3" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--fg-muted))" strokeWidth="1" />
            <text x="289" y="255" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--fg))">6</text>

            {/* City nodes — drawn last so they sit on top of all edges */}
            <circle cx="130" cy="80" r="22" fill="rgb(var(--bg))" stroke="rgb(var(--fg))" strokeWidth="2.5" />
            <text x="130" y="81" textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="700" fill="rgb(var(--fg))">A</text>
            <circle cx="330" cy="80" r="22" fill="rgb(var(--bg))" stroke="rgb(var(--fg))" strokeWidth="2.5" />
            <text x="330" y="81" textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="700" fill="rgb(var(--fg))">B</text>
            <circle cx="230" cy="220" r="22" fill="rgb(var(--bg))" stroke="rgb(var(--fg))" strokeWidth="2.5" />
            <text x="230" y="221" textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="700" fill="rgb(var(--fg))">C</text>
            <circle cx="470" cy="210" r="22" fill="rgb(var(--bg))" stroke="rgb(var(--fg))" strokeWidth="2.5" />
            <text x="470" y="211" textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="700" fill="rgb(var(--fg))">D</text>
            <circle cx="90" cy="290" r="22" fill="rgb(var(--bg))" stroke="rgb(var(--fg))" strokeWidth="2.5" />
            <text x="90" y="291" textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="700" fill="rgb(var(--fg))">E</text>

            {/* Caption */}
            <text x="270" y="342" textAnchor="middle" fontSize="11.5" fontStyle="italic" fill="rgb(var(--fg-muted))">
              5 πόλεις · 8 δρόμοι · στο ίδιο υψόμετρο επιτρέπονται ισοβαθμίες — εδώ στο τρίγωνο A-B-C.
            </text>
          </svg>
        </div>
        <p>
          Το πρόβλημα είναι ένα <strong>Ελάχιστο Επικαλύπτον Δέντρο (ΕΕΔ)</strong>:
          ζητάμε ένα δέντρο που κρατά όλες τις πόλεις συνδεδεμένες με{' '}
          <em>ελάχιστο συνολικό μήκος</em>.
        </p>
        <p>
          <strong>Η ιδέα της μη-μοναδικότητας.</strong> Με διακριτά βάρη το ΕΕΔ
          είναι μοναδικό. Για να έχουμε πολλά ΕΕΔ χρειαζόμαστε{' '}
          <em>ισοβαθμία</em> σε σημείο που δημιουργεί πραγματική επιλογή — και
          το πιο καθαρό τέτοιο σημείο είναι ένας <strong>κύκλος με ίδια ελάχιστα
          βάρη</strong>: στον κύκλο θα κρατήσουμε όλες τις ακμές πλην μίας, και
          αν είναι όλες ίδιες, δεν προτιμάται καμία.
        </p>
        <p>
          <strong>Μια καθαρή ανάθεση.</strong> Φτιάχνουμε ισόπλευρο τρίγωνο{' '}
          <InlineMath>{'A, B, C'}</InlineMath> με βάρος 1, και στις υπόλοιπες
          ακμές διακριτά, μεγαλύτερα βάρη:
        </p>
        <BlockMath>{'A\\!-\\!B = A\\!-\\!C = B\\!-\\!C = 1; \\quad A\\!-\\!E = 2,\\ B\\!-\\!D = 3,\\ B\\!-\\!E = 4,\\ C\\!-\\!D = 5,\\ D\\!-\\!E = 6.'}</BlockMath>
        <p>
          <strong>Γιατί 3 διαφορετικά ΕΕΔ;</strong> Για να συνδέσουμε τις
          A, B, C χρειαζόμαστε ακριβώς <strong>2</strong> από τις 3 ίδιες ακμές
          (η 3η θα έκλεινε τον κύκλο A-B-C). Οπότε υπάρχουν 3 ισόκυρες επιλογές{' '}
          <InlineMath>{'\\{A\\text{-}B, A\\text{-}C\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}B, B\\text{-}C\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}C, B\\text{-}C\\}'}</InlineMath>. Από την{' '}
          <strong>ιδιότητα κύκλου</strong>: στον κύκλο και οι τρεις ακμές είναι{' '}
          <em>ταυτόχρονα</em> οι «μέγιστες», οπότε η ιδιότητα δεν αποκλείει
          μοναδικά καμία.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «κύκλος ίδιων βαρών = πραγματική επιλογή».</strong>{' '}
            Όταν η εκφώνηση σου ζητά να φτιάξεις γράφο με μη-μοναδικό ΕΕΔ, ψάξε
            το <em>μικρότερο</em> κύκλο: τρίγωνο. Δώσε του 3 ίδια βάρη — αυτό
            ξεκλειδώνει 3 διαφορετικά ΕΕΔ. Στις υπόλοιπες ακμές μάζεψε διακριτά
            βάρη για να αποφύγεις «παράπλευρες» ισοβαθμίες που θα μπερδέψουν τη
            μέτρηση.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt4-th2-b',
    title: 'Σεπτέμβριος 2024 · Θέμα 2β — Εφαρμογή αλγορίθμου ΕΕΔ',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 2β',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <p>
        <strong>(β)</strong> Εφάρμοσε κατάλληλο αλγόριθμο — αναφέροντας
        υποχρεωτικά ποιος είναι — στο παραπάνω οδικό δίκτυο για να βρεις μία
        βέλτιστη λύση (με τα μήκη που έδωσες στο ερώτημα α).
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Ο κατάλληλος αλγόριθμος είναι ο Kruskal</strong> (ή Prim — δίνουν
          την ίδια τάξη). Ο Kruskal δουλεύει με τη λίστα ακμών, οπότε φαίνεται
          ξεκάθαρα ποια ακμή απορρίπτεται από την ιδιότητα κύκλου — που είναι
          ακριβώς το σημείο της μη-μοναδικότητας του (α).
        </p>
        <p>
          <strong>Τρεις σειρές, τρία διαφορετικά ΕΕΔ.</strong> Όταν ταξινομούμε
          τις ακμές, οι τρεις βάρους 1 είναι ισόβαθμες — όποια σειρά τους
          αλληλοδιαδέχονται, μία θα απορριφθεί (κλείνει το τρίγωνο). Πάτα τις
          τρεις καρτέλες — βλέπεις ποιο τρίγωνο-edge εκάστοτε «θυσιάζεται», και
          γιατί το συνολικό κόστος μένει σταθερό:
        </p>
        <MstRunnerWithTies />
        <p>
          <strong>Σε όλες τις σειρές το ΕΕΔ έχει συνολικό μήκος{' '}
          <InlineMath>{'1+1+2+3 = 7'}</InlineMath>.</strong> Αυτό απαντά και τι
          ζητούσε το (α): η λύση δεν είναι μοναδική — τρία διαφορετικά δέντρα,
          ίδιο κόστος.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «η σειρά του Kruskal είναι μηχανισμός επιλογής».</strong>{' '}
            Όταν δίνεις πολλαπλές «εξίσου βέλτιστες» λύσεις σε MST, η ευκολότερη
            παρουσίαση είναι: δείξε διαφορετικές σειρές εξέτασης των ισόβαθμων
            ακμών — κάθε σειρά παράγει διαφορετικό δέντρο. Το κόστος όμως
            παραμένει το ίδιο, γιατί κάθε ισόβαθμη μπαίνει ή φεύγει σε ισοδύναμη
            θέση.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt4-th3',
    title: 'Σεπτέμβριος 2024 · Θέμα 3 — Πλήθος μηδενικών σε 1ᵐ0ⁿ με δυαδική αναζήτηση',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 3',
    weight: 30,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δοσμένης μιας δυαδικής συμβολοσειράς <InlineMath>{'S'}</InlineMath> της
          μορφής <InlineMath>{'1^m 0^n'}</InlineMath> (όπου τα{' '}
          <InlineMath>{'m'}</InlineMath> και <InlineMath>{'n'}</InlineMath> είναι
          άγνωστα, αλλά το <InlineMath>{'k = m + n'}</InlineMath> γνωστό),
          περίγραψε σε <strong>φυσική γλώσσα</strong> έναν αλγόριθμο που βρίσκει
          το <InlineMath>{'n'}</InlineMath> — το πλήθος των εμφανίσεων του{' '}
          <InlineMath>{'0'}</InlineMath> — σε <InlineMath>{'O(\\log k)'}</InlineMath>{' '}
          χρόνο, και δικαιολόγησε την ορθότητα και την πολυπλοκότητά του.
        </p>
        <p>
          <em>Υπόδειξη:</em> ποια αναδρομική σχέση πρέπει να διέπει την{' '}
          <InlineMath>{'T(k)'}</InlineMath> ώστε να ισχύει{' '}
          <InlineMath>{'T(k) = O(\\log k)'}</InlineMath>;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η παρατήρηση-κλειδί: η συμβολοσειρά είναι ήδη ταξινομημένη.</strong>{' '}
          Πρώτα όλα τα <InlineMath>{'1'}</InlineMath>, μετά όλα τα{' '}
          <InlineMath>{'0'}</InlineMath>. Υπάρχει ένα μοναδικό{' '}
          <strong>σύνορο</strong> — βρες το, βρήκες και το{' '}
          <InlineMath>{'n'}</InlineMath>. Αυτή ακριβώς η ιδέα είναι η συνταγή της{' '}
          <strong>δυαδικής αναζήτησης</strong>: σε κάθε βήμα μισαρίζεις το
          διάστημα όπου ξέρεις ότι ζει το σύνορο.
        </p>
        <p>
          <strong>Ο αλγόριθμος.</strong> Κοίτα τον μεσαίο χαρακτήρα{' '}
          <InlineMath>{'S[\\text{mid}]'}</InlineMath>:
        </p>
        <ul>
          <li>
            <InlineMath>{'S[\\text{mid}] = 1'}</InlineMath> → όλα αριστερά είναι
            επίσης <InlineMath>{'1'}</InlineMath>· συνέχισε <strong>δεξιά</strong>.
          </li>
          <li>
            <InlineMath>{'S[\\text{mid}] = 0'}</InlineMath> → το σύνορο είναι
            στο mid ή πριν· συνέχισε <strong>αριστερά</strong>.
          </li>
        </ul>
        <p>
          Δες το να εκτελείται — οι σλάιντερ ρυθμίζουν m, n και το κουμπί
          «Επόμενο βήμα» κάνει μία σύγκριση κάθε φορά:
        </p>
        <OneZeroBinarySearch />
        <p>
          <strong>Ορθότητα — αναλλοίωτη.</strong> «Το σύνορο ζει εντός του
          τρέχοντος διαστήματος.» Επειδή η ακολουθία είναι μονότονη, κάθε
          σύγκριση συμπεραίνει ασφαλώς προς ποια κατεύθυνση να μειώσουμε.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε βήμα υποδιπλασιάζει το διάστημα με{' '}
          <InlineMath>{'O(1)'}</InlineMath> δουλειά:
        </p>
        <BlockMath>{'T(k) = T(k/2) + O(1) \\;\\Longrightarrow\\; T(k) = O(\\log k).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «αν η είσοδος έχει μοναδικό σύνορο, δυαδική αναζήτηση».</strong>{' '}
          Όποτε δεις μονότονη συνθήκη («πριν μια θέση Α, μετά Β»), η απάντηση
          είναι σχεδόν πάντα δυαδική αναζήτηση — <InlineMath>{'O(\\log k)'}</InlineMath>.
          Παραδείγματα: πρώτη εμφάνιση στοιχείου σε ταξινομημένο πίνακα, χαμένος
          όρος αριθμητικής προόδου (front-set-4-ask7), πρώτο/τελευταίο TRUE σε
          μονότονη συνάρτηση.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt4-th4',
    title: 'Σεπτέμβριος 2024 · Θέμα 4 — Διαφημίσεις χορηγών (Σακίδιο)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2024',
    problemNumber: 'Θέμα 4',
    weight: 40,
    difficulty: 'hard',
    prerequisites: ['lectures/L15-dp-ii'],
    statement: (
      <>
        <p>
          Στην πρώτη μέρα ενός φεστιβάλ παρουσιάζονται δύο συγκροτήματα. Από το
          τέλος της συναυλίας του πρώτου μέχρι την έναρξη του δεύτερου μεσολαβεί
          χρόνος <InlineMath>{'T'}</InlineMath>. Σε αυτό το διάστημα η
          διοργανώτρια εταιρεία θα προβάλει διαφημίσεις χορηγών (χωρίς
          επαναλήψεις). Έχουν καταθέσει προτάσεις <InlineMath>{'n'}</InlineMath>{' '}
          εταιρείες· η διαφήμιση <InlineMath>{'i'}</InlineMath> έχει διάρκεια{' '}
          <InlineMath>{'t_i'}</InlineMath> και αποφέρει κέρδος{' '}
          <InlineMath>{'p_i'}</InlineMath> (όλα θετικοί ακέραιοι). Ορίζουμε{' '}
          <InlineMath>{'\\text{OPT}(i, t)'}</InlineMath> = το μέγιστο κέρδος από
          τις διαφημίσεις <InlineMath>{'1, \\dots, i'}</InlineMath> με συνολική
          διάρκεια το πολύ <InlineMath>{'t'}</InlineMath>.
        </p>
        <p>
          (α) Ποια τιμή δίνει το μέγιστο κέρδος; (β) Γράψε τον αναδρομικό τύπο
          του <InlineMath>{'\\text{OPT}(i,t)'}</InlineMath>. (γ) Χρονική
          πολυπλοκότητα του υπολογισμού όλων των υποπροβλημάτων — αιτιολόγησε.
          (δ) Πολυπλοκότητα για τον <em>εντοπισμό</em> των διαφημίσεων που
          δίνουν το μέγιστο κέρδος. (ε) Σε ποιο γνωστό πρόβλημα αντιστοιχεί αν
          επιπλέον κάθε διαφήμιση πρέπει να προβληθεί σε σταθερό διάστημα{' '}
          <InlineMath>{'[s_i, s_i + t_i]'}</InlineMath> εντός του{' '}
          <InlineMath>{'[0, T]'}</InlineMath>;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πριν την αναγνώριση «αυτό είναι σακίδιο», δες τη σκηνή όπως τη γράφει η
          εκφώνηση — δύο συναυλίες, ένα κενό{' '}
          <InlineMath>{'T'}</InlineMath> λεπτών στη μέση, και ένας κατάλογος
          διαφημίσεων που πρέπει να χωρέσουν εκεί:
        </p>
        <div className="not-prose my-4 flex justify-center">
          <svg
            viewBox="0 0 620 320"
            className="w-full max-w-2xl rounded-lg border border-border bg-bg-elevated"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Πρώτη ημέρα φεστιβάλ. Μεταξύ του τέλους της πρώτης συναυλίας και της έναρξης της δεύτερης μεσολαβούν T=10 λεπτά. Ο κατάλογος έχει 5 διαφημίσεις με διαρκείες 3, 5, 4, 2, 6 και κέρδη 6, 8, 5, 4, 9. Πρέπει να επιλεγεί υποσύνολο που χωράει σε T λεπτά με μέγιστο συνολικό κέρδος."
          >
            {/* Left concert ending */}
            <text x="50" y="55" textAnchor="middle" fontSize="30" fill="#7c3aed" opacity="0.85">♪</text>
            <text x="50" y="85" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgb(var(--fg))">Συναυλία 1</text>
            <text x="50" y="98" textAnchor="middle" fontSize="9.5" fill="rgb(var(--fg-subtle))">τέλος</text>

            {/* Right concert starting */}
            <text x="570" y="55" textAnchor="middle" fontSize="30" fill="#7c3aed" opacity="0.85">♫</text>
            <text x="570" y="85" textAnchor="middle" fontSize="11" fontWeight="600" fill="rgb(var(--fg))">Συναυλία 2</text>
            <text x="570" y="98" textAnchor="middle" fontSize="9.5" fill="rgb(var(--fg-subtle))">έναρξη</text>

            {/* Time bracket showing T λεπτά */}
            <line x1="100" y1="58" x2="100" y2="78" stroke="rgb(var(--fg))" strokeWidth="2" />
            <line x1="100" y1="68" x2="520" y2="68" stroke="rgb(var(--fg))" strokeWidth="2" strokeDasharray="6,3" />
            <line x1="520" y1="58" x2="520" y2="78" stroke="rgb(var(--fg))" strokeWidth="2" />
            <text x="310" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="rgb(var(--fg))">T = 10 λεπτά διαθέσιμα</text>

            {/* Tick mark labels */}
            <text x="100" y="98" textAnchor="middle" fontSize="10" fill="rgb(var(--fg-subtle))">0 min</text>
            <text x="520" y="98" textAnchor="middle" fontSize="10" fill="rgb(var(--fg-subtle))">T min</text>

            {/* Divider */}
            <line x1="40" y1="130" x2="580" y2="130" stroke="rgb(var(--border))" strokeWidth="1" />

            {/* Catalog header */}
            <text x="310" y="155" textAnchor="middle" fontSize="12" fontWeight="600" fill="rgb(var(--fg))">Κατάλογος: 5 διαφημίσεις χορηγών (πλάτος ∝ διάρκεια)</text>

            {/* Ad cards */}
            {/* Ad 1: t=3, p=6 */}
            <rect x="90" y="180" width="66" height="64" rx="4" fill="rgb(245 158 11 / 0.15)" stroke="#d97706" strokeWidth="1.5" />
            <text x="123" y="198" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--fg))">Διαφ. 1</text>
            <text x="123" y="217" textAnchor="middle" fontSize="11" fill="rgb(var(--fg))">⏱ t = 3</text>
            <text x="123" y="235" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d97706">€ 6</text>
            {/* Ad 2: t=5, p=8 */}
            <rect x="168" y="180" width="90" height="64" rx="4" fill="rgb(245 158 11 / 0.15)" stroke="#d97706" strokeWidth="1.5" />
            <text x="213" y="198" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--fg))">Διαφ. 2</text>
            <text x="213" y="217" textAnchor="middle" fontSize="11" fill="rgb(var(--fg))">⏱ t = 5</text>
            <text x="213" y="235" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d97706">€ 8</text>
            {/* Ad 3: t=4, p=5 */}
            <rect x="270" y="180" width="78" height="64" rx="4" fill="rgb(245 158 11 / 0.15)" stroke="#d97706" strokeWidth="1.5" />
            <text x="309" y="198" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--fg))">Διαφ. 3</text>
            <text x="309" y="217" textAnchor="middle" fontSize="11" fill="rgb(var(--fg))">⏱ t = 4</text>
            <text x="309" y="235" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d97706">€ 5</text>
            {/* Ad 4: t=2, p=4 */}
            <rect x="360" y="180" width="54" height="64" rx="4" fill="rgb(245 158 11 / 0.15)" stroke="#d97706" strokeWidth="1.5" />
            <text x="387" y="198" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--fg))">Διαφ. 4</text>
            <text x="387" y="217" textAnchor="middle" fontSize="11" fill="rgb(var(--fg))">⏱ t = 2</text>
            <text x="387" y="235" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d97706">€ 4</text>
            {/* Ad 5: t=6, p=9 */}
            <rect x="426" y="180" width="102" height="64" rx="4" fill="rgb(245 158 11 / 0.15)" stroke="#d97706" strokeWidth="1.5" />
            <text x="477" y="198" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--fg))">Διαφ. 5</text>
            <text x="477" y="217" textAnchor="middle" fontSize="11" fill="rgb(var(--fg))">⏱ t = 6</text>
            <text x="477" y="235" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d97706">€ 9</text>

            {/* Sum hints */}
            <text x="310" y="275" textAnchor="middle" fontSize="11" fontStyle="italic" fill="rgb(var(--fg-muted))">
              Σύνολο διαρκειών αν τις πάρεις όλες: 3+5+4+2+6 = 20 min — υπερβαίνει T κατά 10.
            </text>
            <text x="310" y="296" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="rgb(var(--fg))">
              Επίλεξε υποσύνολο: <tspan fill="rgb(var(--fg-subtle))" fontWeight="400">Σ διαρκειών ≤ T,</tspan>{' '}
              <tspan fill="#d97706">max Σ κερδών</tspan>.
            </text>
          </svg>
        </div>
        <p>
          <strong>Πρώτα η αναγνώριση — αυτό είναι Σακίδιο.</strong> Άλλαξε
          ονόματα και η ταυτότητα είναι η ίδια: «διάρκεια»{' '}
          <InlineMath>{'t_i'}</InlineMath> ↔ βάρος αντικειμένου, «κέρδος»{' '}
          <InlineMath>{'p_i'}</InlineMath> ↔ αξία, «διαθέσιμος χρόνος»{' '}
          <InlineMath>{'T'}</InlineMath> ↔ χωρητικότητα σακιδίου. Όλα τα
          εργαλεία της διάλεξης μεταφέρονται αυτούσια.
        </p>
        <p>
          <strong>(α)</strong> Θέλουμε το μέγιστο κέρδος έχοντας στη διάθεσή μας{' '}
          <em>όλες</em> τις <InlineMath>{'n'}</InlineMath> διαφημίσεις και
          ολόκληρο τον χρόνο <InlineMath>{'T'}</InlineMath>. Άρα η ζητούμενη τιμή
          είναι <strong><InlineMath>{'\\text{OPT}(n, T)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(β) Η αναδρομή.</strong> Κοιτάμε τη διαφήμιση{' '}
          <InlineMath>{'i'}</InlineMath> — μέσα ή έξω; Αν δεν χωράει (
          <InlineMath>{'t_i > t'}</InlineMath>), είναι αναγκαστικά έξω. Αλλιώς
          δοκιμάζουμε και τα δύο και κρατάμε το καλύτερο. Όχι «πρώτα τα
          ακριβότερα» — αυτό είναι ακριβώς ο άπληστος που <em>δεν</em>{' '}
          δουλεύει στο 0-1 (δες <InlineMath>{'\\text{KnapsackGreedyFail}'}</InlineMath>{' '}
          στη διάλεξη). Δοκιμάζουμε ΚΑΙ ΤΑ ΔΥΟ και κρατάμε το max:
        </p>
        <BlockMath>{'\\text{OPT}(i,t) = \\begin{cases} 0 & i = 0 \\\\ \\text{OPT}(i-1,t) & t_i > t \\\\ \\max\\{\\, \\text{OPT}(i-1,t),\\ \\ p_i + \\text{OPT}(i-1,\\,t - t_i) \\,\\} & \\text{αλλιώς} \\end{cases}'}</BlockMath>
        <p>
          <strong>(γ) Πολυπλοκότητα.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'(n+1)(T+1)'}</InlineMath> κελιά και κάθε κελί
          υπολογίζεται σε <InlineMath>{'O(1)'}</InlineMath> (ένα{' '}
          <InlineMath>{'\\max'}</InlineMath>). Άρα{' '}
          <strong><InlineMath>{'\\Theta(nT)'}</InlineMath></strong>. <strong>Η
          παγίδα:</strong> το <InlineMath>{'T'}</InlineMath> είναι ένας
          αριθμός που γράφεται με <InlineMath>{'\\log T'}</InlineMath> δυφία,
          οπότε <InlineMath>{'nT'}</InlineMath> είναι <em>εκθετικό</em> ως προς
          το πραγματικό μέγεθος της εισόδου. Λέγεται{' '}
          <strong>ψευδοπολυωνυμικό</strong> — δουλεύει γρήγορα όταν το{' '}
          <InlineMath>{'T'}</InlineMath> είναι μικρό, αλλά εκρήγνυται όταν το{' '}
          <InlineMath>{'T'}</InlineMath> διπλασιάζεται μόνο σε bits. Δες τη
          συμπεριφορά του πίνακα στη λεκτοριακή έκδοση του σακιδίου:
        </p>
        <KnapsackTable />
        <p>
          <strong>(δ) Εντοπισμός των επιλεγμένων διαφημίσεων.</strong> Με
          έτοιμο τον πίνακα, ξεκινάμε από το{' '}
          <InlineMath>{'M[n][T]'}</InlineMath> και «ξεθάβουμε» τις επιλογές:
          για κάθε <InlineMath>{'i = n, n-1, \\dots, 1'}</InlineMath>, αν{' '}
          <InlineMath>{'M[i][w] = M[i-1][w]'}</InlineMath> η διαφήμιση{' '}
          <InlineMath>{'i'}</InlineMath> ΔΕΝ μπήκε (συνέχισε με ίδιο{' '}
          <InlineMath>{'w'}</InlineMath>)· αλλιώς ΜΠΗΚΕ, την προσθέτουμε στη
          λύση και αφαιρούμε τη διάρκεια (
          <InlineMath>{'w \\leftarrow w - t_i'}</InlineMath>). Μία σύγκριση ανά{' '}
          <InlineMath>{'i'}</InlineMath>· συνολικά{' '}
          <strong><InlineMath>{'O(n)'}</InlineMath></strong>. Στο εργαλείο
          παραπάνω, μετά το γέμισμα φωτίζονται ακριβώς αυτές οι διαφημίσεις.
        </p>
        <p>
          <strong>(ε) Όταν οι διαφημίσεις έχουν σταθερό παράθυρο.</strong> Αν
          η διαφήμιση <InlineMath>{'i'}</InlineMath> πρέπει να προβληθεί στο{' '}
          <em>συγκεκριμένο</em> διάστημα{' '}
          <InlineMath>{'[s_i, s_i + t_i]'}</InlineMath>, χάνεται η ελευθερία να
          τις βάλεις «όπου θες». Δύο διαφημίσεις με επικαλυπτόμενα παράθυρα
          συγκρούονται — δεν μπορούν και οι δύο να μπουν, ακόμα κι αν χωρούσαν
          χρονικά αθροιστικά. Αυτό μετατρέπει το πρόβλημα σε <strong>Σταθμισμένο
          Χρονοπρογραμματισμό Διαστημάτων</strong> (weighted interval
          scheduling) — το πρόβλημα του{' '}
          <a className="underline" href="/lectures/L14-dp-i">
            L14
          </a>
          . Δες την αλλαγή με το ίδιο σύνολο 5 διαφημίσεων: ο σακιδίου τις
          μετράει σαν «πόσος χρόνος» — μπορεί να πάρει μέχρι 4 από αυτές· ο
          χρονοπρογραμματισμός τις βλέπει σαν «μη-συμβατά διαστήματα» — μπορεί
          να πάρει το πολύ 3 και με χαμηλότερο κέρδος:
        </p>
        <KnapsackToIntervalScheduling />
        <p>
          Στο χρονοπρογραμματισμό η αναδρομή αλλάζει: αντί για «μέσα ή έξω με
          βάση χωρητικότητα», γίνεται «μέσα ή έξω με βάση συμβατότητα» —{' '}
          <InlineMath>{'\\text{OPT}(j) = \\max\\{\\text{OPT}(j-1),\\ p_j + \\text{OPT}(p(j))\\}'}</InlineMath>,
          όπου <InlineMath>{'p(j)'}</InlineMath> = ο δείκτης της τελευταίας
          διαφήμισης που τελειώνει πριν αρχίσει η <InlineMath>{'j'}</InlineMath>.
          Πολυπλοκότητα <InlineMath>{'O(n \\log n)'}</InlineMath> (κυρίως
          ταξινόμηση) — <em>γνήσια</em> πολυωνυμικό, σε αντίθεση με το ψευδο-
          πολυωνυμικό του σακιδίου.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «αναγνώρισε το γνωστό πρόβλημα κάτω από
            το ντύσιμο».</strong> Διαφημίσεις, αντικείμενα σε σακίδιο, projects
            με χρόνο και κέρδος — όλα μιλούν το ίδιο. Δύο διαγνωστικά:{' '}
            (i) «Επιλογή υποσυνόλου με συνολικό «βάρος» ≤ κάποιο όριο, για να
            μεγιστοποιήσω «αξία»» → 0-1 Σακίδιο, <InlineMath>{'\\Theta(nT)'}</InlineMath>{' '}
            ψευδοπολυωνυμικό. (ii) «Επιλογή χωρίς επικαλύψεις σε χρονική ευθεία,
            με βάρη» → Σταθμισμένος Χρονοπρογραμματισμός Διαστημάτων,{' '}
            <InlineMath>{'O(n \\log n)'}</InlineMath> γνήσια πολυωνυμικό. Η
            λέξη που τα ξεχωρίζει: <em>σταθερή θυρίδα</em> στον χρόνο. Αν
            υπάρχει, είσαι στο (ii)· αν είναι μόνο διάρκεια, είσαι στο (i).
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th1',
    title: 'Ιούνιος 2023 · Θέμα 1 — Συνεκτικές συνιστώσες γραφήματος',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2023',
    problemNumber: 'Θέμα 1',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>
          Δίνεται ένας απλός μη κατευθυνόμενος γράφος{' '}
          <InlineMath>{'G = (V, E, W)'}</InlineMath> με{' '}
          <InlineMath>{'|V|'}</InlineMath> κόμβους,{' '}
          <InlineMath>{'|E|'}</InlineMath> ακμές και{' '}
          <InlineMath>{'W'}</InlineMath> μια συνάρτηση βάρους στις ακμές. Η
          αναπαράσταση του <InlineMath>{'G'}</InlineMath> είναι σε{' '}
          <strong>λίστες γειτνίασης</strong>. Μια <em>συνεκτική συνιστώσα</em>{' '}
          του <InlineMath>{'G'}</InlineMath> είναι ένας υπογράφος του,
          μεγιστικός ως προς την έγκλιση, για τον οποίο ισχύει ότι για κάθε δύο
          κορυφές του υπάρχει μονοπάτι που τις συνδέει.
        </p>
        <p>
          <strong>i.</strong> Να δοθεί αλγόριθμος σε φυσική γλώσσα,{' '}
          <strong>βέλτιστης πολυπλοκότητας</strong>, που βρίσκει τις συνεκτικές
          συνιστώσες του <InlineMath>{'G'}</InlineMath>.{' '}
          <strong>ii.</strong> Να υπολογιστεί η πολυπλοκότητα του αλγορίθμου.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Διαίσθηση — γιατί αρκεί ένα BFS ανά συνιστώσα.</strong> Μια
          συνεκτική συνιστώσα είναι ένα «νησί» κόμβων: από οπουδήποτε μέσα της
          φτάνεις παντού μέσα της, αλλά καμία ακμή δεν την συνδέει με τίποτα έξω.
          Αν στείλουμε ένα «κύμα» BFS από ένα οποιοδήποτε σημείο του νησιού, το
          κύμα θα κατακλύσει <em>ακριβώς</em> το νησί και θα σταματήσει στο
          όριο. Όλοι όσοι ξεμένουν ασημάδευτοι ανήκουν σε <em>άλλο</em> νησί —
          ξεκινάμε νέο BFS από εκεί.
        </p>
        <p>
          <strong>Ο αλγόριθμος.</strong> Σύνδυασε δύο βρόχους: έναν εξωτερικό
          που ψάχνει την επόμενη ασημάδευτη κορυφή, κι έναν BFS που εξαντλεί τη
          συνιστώσα της.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`mark[v] ← false  για κάθε κορυφή v
c ← 0
for i ← 1 to |V|:
  if not mark[v_i]:
    c ← c + 1
    BFS(v_i)            // σημαδεύει όλη τη συνιστώσα του v_i με id c
return c, mark`}</pre>
        <p>
          Δοκίμασέ το ζωντανά — ο μετρητής{' '}
          <InlineMath>{'c'}</InlineMath> τικάρει +1 κάθε φορά που ο εξωτερικός
          βρόχος συναντά νέο, ασημάδευτο κόμβο και το αντίστοιχο κύμα BFS
          ανακαλύπτει τη συνιστώσα του:
        </p>
        <ComponentsBfsSweep instance="pt5-th1" />
        <p>
          <strong>ii. Πολυπλοκότητα.</strong> Αναλύουμε τις δύο πηγές δουλειάς
          ξεχωριστά:
        </p>
        <ul>
          <li>
            <strong>Κορυφές:</strong> κάθε <InlineMath>{'v \\in V'}</InlineMath>{' '}
            μπαίνει στην ουρά του BFS <em>το πολύ μία φορά</em>, αφού μόλις
            σημαδευτεί δεν ξανα-εξετάζεται. Σύνολο{' '}
            <InlineMath>{'O(|V|)'}</InlineMath>.
          </li>
          <li>
            <strong>Ακμές:</strong> με λίστες γειτνίασης, κάθε ακμή{' '}
            <InlineMath>{'\\{u,v\\}'}</InlineMath> εξετάζεται δύο φορές — μία
            στη λίστα του <InlineMath>{'u'}</InlineMath>, μία στη λίστα του{' '}
            <InlineMath>{'v'}</InlineMath>. Σύνολο{' '}
            <InlineMath>{'O(|E|)'}</InlineMath>.
          </li>
          <li>
            <strong>Εξωτερικός βρόχος:</strong> ακόμα μία πλήρης σάρωση όλων των
            κορυφών για έλεγχο του <InlineMath>{'\\text{mark}'}</InlineMath> →{' '}
            <InlineMath>{'O(|V|)'}</InlineMath>.
          </li>
        </ul>
        <BlockMath>{'T(G) = O(|V| + |E|)'}</BlockMath>
        <p>
          <strong>Γιατί είναι βέλτιστο.</strong> Οποιοσδήποτε αλγόριθμος πρέπει
          να «αγγίξει» τουλάχιστον κάθε κόμβο και κάθε ακμή της εισόδου — αλλιώς
          δεν μπορεί να ξέρει σε ποια συνιστώσα ανήκουν. Άρα{' '}
          <InlineMath>{'\\Omega(|V| + |E|)'}</InlineMath> είναι κάτω φράγμα για
          το πρόβλημα, και ο δικός μας αλγόριθμος το πετυχαίνει.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «νησιά μέσω επαναλαμβανόμενου BFS».</strong>{' '}
            Όποτε ζητείται να σπάσεις έναν γράφο σε <em>μέγιστα συνεκτικά
            κομμάτια</em> (συνεκτικές συνιστώσες, χρωματισμός με ελάχιστα
            χρώματα, ομαδοποίηση καταναλωτών σε δίκτυο), το πατέντο είναι
            πάντα το ίδιο: ένας εξωτερικός βρόχος <em>«βρες την επόμενη
            ασημάδευτη»</em> + ένα BFS/DFS που «σαρώνει» όλο το νησί. Κάθε
            κόμβος και ακμή πιάνονται σταθερές φορές → <InlineMath>{'\\Theta(|V| + |E|)'}</InlineMath>{' '}
            σε λίστες γειτνίασης, που είναι και το θεωρητικό κάτω φράγμα.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th1b',
    title: 'Ιούνιος 2023 · Θέμα 1 (Β ομάδας) — Σύγκριση εκθετικής με υπερ-πολυωνυμική',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'june-2023',
    problemNumber: 'Θέμα 1 (Β ομάδας)',
    weight: 20,
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Θεωρούμε την <InlineMath>{'f(n) = c^{\\sqrt{n\\log n}}'}</InlineMath> με{' '}
        <InlineMath>{'c > 1'}</InlineMath>. Βρες αν είναι{' '}
        <InlineMath>{'O\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</InlineMath> ή{' '}
        <InlineMath>{'\\Omega\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Και οι δύο παραστάσεις είναι τεράστιες — δεν συγκρίνονται με το μάτι.
          Το κόλπο: <strong>παίρνουμε λογάριθμο</strong> και στις δύο. Η σύγκριση
          δεν αλλάζει (ο λογάριθμος είναι γνησίως αύξων), αλλά οι αριθμοί
          γίνονται διαχειρίσιμοι.
        </p>
        <p>
          <strong>Αριστερή πλευρά:</strong>
        </p>
        <BlockMath>{'\\log f(n) = \\sqrt{n\\log n}\\,\\cdot\\,\\log c'}</BlockMath>
        <p>
          <strong>Δεξιά πλευρά:</strong>
        </p>
        <BlockMath>{'\\log\\!\\left((n\\log n)^{\\log^2 n}\\right) = \\log^2 n \\cdot \\log(n\\log n) = \\log^2 n\\,(\\log n + \\log\\log n)'}</BlockMath>
        <p>
          Για μεγάλα <InlineMath>{'n'}</InlineMath>, το{' '}
          <InlineMath>{'\\log(n\\log n) \\approx \\log n'}</InlineMath>, οπότε η
          δεξιά πλευρά είναι περίπου <InlineMath>{'\\log^3 n'}</InlineMath> —{' '}
          <strong>πολυλογαριθμική</strong>.
        </p>
        <p>
          <strong>Η σύγκριση.</strong> Η αριστερή πλευρά περιέχει το{' '}
          <InlineMath>{'\\sqrt{n\\log n} = \\sqrt{n}\\cdot\\sqrt{\\log n}'}</InlineMath>,
          δηλαδή έναν παράγοντα <InlineMath>{'\\sqrt{n} = n^{1/2}'}</InlineMath>{' '}
          — <strong>πολυωνυμικό</strong> ως προς το{' '}
          <InlineMath>{'n'}</InlineMath>. Κάθε θετική δύναμη του{' '}
          <InlineMath>{'n'}</InlineMath> (ακόμα και το{' '}
          <InlineMath>{'n^{1/2}'}</InlineMath>) τελικά «νικά» κάθε δύναμη του{' '}
          <InlineMath>{'\\log n'}</InlineMath>. Άρα:
        </p>
        <BlockMath>{'\\log f(n) = \\Theta\\!\\left(\\sqrt{n}\\,\\sqrt{\\log n}\\right) \\;\\gg\\; \\log^3 n = \\log\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</BlockMath>
        <p>
          Αφού ο λογάριθμος της <InlineMath>{'f(n)'}</InlineMath> ξεπερνά τον
          λογάριθμο της άλλης παράστασης, η ίδια η{' '}
          <InlineMath>{'f(n)'}</InlineMath> μεγαλώνει πολύ πιο γρήγορα:
        </p>
        <BlockMath>{'f(n) = \\Omega\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</BlockMath>
        <p>
          (Στην πραγματικότητα ισχύει και το ισχυρότερο{' '}
          <InlineMath>{'\\omega'}</InlineMath>.)
        </p>
        <p>
          Δες τη μάχη στους <em>λογαρίθμους</em> των δύο εκφράσεων — εκεί όπου
          η σύγκριση γίνεται διαχειρίσιμη («πολυωνυμικό vs πολυλογάριθμος»):
        </p>
        <AsymptoticVerdictExplorer preset="pt5-th1b" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: «log και στις δύο πλευρές».</strong> Όταν δεις
          εκθετικούς πύργους ή υπερβολικές δυνάμεις, πάρε λογάριθμο πρώτα. Η
          σύγκριση διατηρείται (γνησίως αύξων), αλλά μεταφέρεται σε αναγνωρίσιμες
          τάξεις (πολυώνυμα, polylog, σταθερές). Εδώ ο λογάριθμος μετατρέπει «τα
          δύο τέρατα» σε <InlineMath>{'\\sqrt{n\\log n}'}</InlineMath> vs{' '}
          <InlineMath>{'\\log^3 n'}</InlineMath> — η πρώτη περιέχει πολυωνυμικό
          παράγοντα <InlineMath>{'\\sqrt n'}</InlineMath>, νικάει αυτόματα.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th2-a',
    title: 'Ιούνιος 2023 · Θέμα 2Α — Κατάταξη της 2^√(log n)',
    topic: 'asymptotics',
    origin: 'past-exam',
    source: 'june-2023',
    problemNumber: 'Θέμα 2Α',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Η συνάρτηση <InlineMath>{'g(n) = 2^{\\sqrt{\\log n}}'}</InlineMath> είναι{' '}
        <InlineMath>{'\\Theta(n)'}</InlineMath>,{' '}
        <InlineMath>{'o(n)'}</InlineMath> ή{' '}
        <InlineMath>{'\\omega(n)'}</InlineMath>;
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Το κόλπο — ίδια βάση.</strong> Για να συγκρίνουμε την{' '}
          <InlineMath>{'g(n)'}</InlineMath> με το{' '}
          <InlineMath>{'n'}</InlineMath>, γράφουμε και τα δύο ως δυνάμεις του{' '}
          <InlineMath>{'2'}</InlineMath>:
        </p>
        <BlockMath>{'g(n) = 2^{\\sqrt{\\log n}}, \\qquad n = 2^{\\log n}'}</BlockMath>
        <p>
          Τώρα η σύγκριση ανάγεται στους <strong>εκθέτες</strong>:{' '}
          <InlineMath>{'\\sqrt{\\log n}'}</InlineMath> έναντι{' '}
          <InlineMath>{'\\log n'}</InlineMath>.
        </p>
        <p>
          Θέσε <InlineMath>{'x = \\log n'}</InlineMath>. Συγκρίνουμε{' '}
          <InlineMath>{'\\sqrt{x}'}</InlineMath> με <InlineMath>{'x'}</InlineMath>:
          για μεγάλα <InlineMath>{'x'}</InlineMath>, το{' '}
          <InlineMath>{'\\sqrt{x}'}</InlineMath> είναι πολύ μικρότερο. Άρα ο
          λόγος:
        </p>
        <BlockMath>{'\\frac{g(n)}{n} = 2^{\\sqrt{\\log n} - \\log n} \\xrightarrow[n\\to\\infty]{} 2^{-\\infty} = 0'}</BlockMath>
        <p>
          αφού ο εκθέτης <InlineMath>{'\\sqrt{\\log n} - \\log n \\to -\\infty'}</InlineMath>.
        </p>
        <p>
          <strong>Συγκεκριμένο παράδειγμα.</strong> Πάρε{' '}
          <InlineMath>{'n = 2^{100}'}</InlineMath>: τότε{' '}
          <InlineMath>{'\\log n = 100'}</InlineMath>,{' '}
          <InlineMath>{'\\sqrt{\\log n} = 10'}</InlineMath>, οπότε{' '}
          <InlineMath>{'g(n) = 2^{10} = 1024'}</InlineMath> ενώ{' '}
          <InlineMath>{'n = 2^{100}'}</InlineMath> — αστρονομικά μεγαλύτερο.
        </p>
        <p>
          Αφού ο λόγος <InlineMath>{'g(n)/n \\to 0'}</InlineMath>, η{' '}
          <InlineMath>{'g(n)'}</InlineMath> είναι{' '}
          <strong><InlineMath>{'o(n)'}</InlineMath></strong> — μεγαλώνει
          γνήσια πιο αργά από το <InlineMath>{'n'}</InlineMath>.
        </p>
        <AsymptoticVerdictExplorer preset="pt5-th2-a" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «ίδια βάση → σύγκριση εκθετών».</strong> Όταν
          συγκρίνεις <InlineMath>{'a^{u(n)}'}</InlineMath> και{' '}
          <InlineMath>{'a^{v(n)}'}</InlineMath>, αρκεί να συγκρίνεις τα{' '}
          <InlineMath>{'u(n)'}</InlineMath> και <InlineMath>{'v(n)'}</InlineMath>{' '}
          — η εκθετική είναι γνησίως αύξουσα. Εδώ:{' '}
          <InlineMath>{'n = 2^{\\log n}'}</InlineMath>, οπότε{' '}
          <InlineMath>{'g/n = 2^{\\sqrt{\\log n} - \\log n}'}</InlineMath>, και ο
          εκθέτης φεύγει στο <InlineMath>{'-\\infty'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th2-b',
    title: 'Ιούνιος 2023 · Θέμα 2Β — Δύο αλγόριθμοι D&C με Master Theorem',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'june-2023',
    problemNumber: 'Θέμα 2Β',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Ένα πρόβλημα <InlineMath>{'\\Pi'}</InlineMath> επιλύεται με τους
          παρακάτω δύο αναδρομικούς αλγορίθμους για στιγμιότυπα μεγέθους{' '}
          <InlineMath>{'n'}</InlineMath>:
        </p>
        <ul>
          <li>
            Ο <InlineMath>{'A_1'}</InlineMath> διασπά το πρόβλημα σε{' '}
            <strong>9</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/3'}</InlineMath> και συνθέτει τις λύσεις σε χρόνο{' '}
            <InlineMath>{'n'}</InlineMath>.
          </li>
          <li>
            Ο <InlineMath>{'A_2'}</InlineMath> διασπά το πρόβλημα σε{' '}
            <strong>2</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/2'}</InlineMath> και συνθέτει τις λύσεις σε χρόνο{' '}
            <InlineMath>{'cn'}</InlineMath> για κάποια σταθερά{' '}
            <InlineMath>{'c'}</InlineMath>.
          </li>
        </ul>
        <p>
          Γράψε τις αναδρομικές εξισώσεις χρόνου εκτέλεσης των{' '}
          <InlineMath>{'A_1, A_2'}</InlineMath> και λύσε τες με το Θεώρημα
          Κυριαρχίας.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Κάθε αλγόριθμος D&amp;C δίνει αναδρομή{' '}
          <InlineMath>{'T(n) = a\\,T(n/b) + f(n)'}</InlineMath>. Master Theorem
          συγκρίνει το <InlineMath>{'f(n)'}</InlineMath> με το{' '}
          <InlineMath>{'n^{\\log_b a}'}</InlineMath>· περίπτωση 1 αν f μικρότερο
          (φύλλα κυριαρχούν), περίπτωση 2 αν ίσα (κάθε επίπεδο το ίδιο),
          περίπτωση 3 αν f μεγαλύτερο (ρίζα κυριαρχεί).
        </p>
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_1'}</InlineMath>:</strong>{' '}
          <InlineMath>{'T_1(n) = 9\\,T_1(n/3) + n'}</InlineMath>. Με{' '}
          <InlineMath>{'a = 9,\\ b = 3'}</InlineMath>:{' '}
          <InlineMath>{'\\log_3 9 = 2'}</InlineMath>, άρα κατώφλι{' '}
          <InlineMath>{'n^2'}</InlineMath>. Το{' '}
          <InlineMath>{'f(n) = n'}</InlineMath> είναι πολυωνυμικά μικρότερο →{' '}
          <strong>περίπτωση 1</strong> → <InlineMath>{'\\Theta(n^2)'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="pt5-th2-b-A1" />
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_2'}</InlineMath>:</strong>{' '}
          <InlineMath>{'T_2(n) = 2\\,T_2(n/2) + cn'}</InlineMath>. Με{' '}
          <InlineMath>{'a = 2,\\ b = 2'}</InlineMath>:{' '}
          <InlineMath>{'\\log_2 2 = 1'}</InlineMath>, κατώφλι{' '}
          <InlineMath>{'n'}</InlineMath>. Το{' '}
          <InlineMath>{'f(n) = cn = \\Theta(n)'}</InlineMath> ταιριάζει — η{' '}
          αναδρομή της mergesort, <strong>περίπτωση 2</strong> →{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="pt5-th2-b-A2" />
        <p>
          Σύγκριση:{' '}
          <InlineMath>{'\\Theta(n\\log n) \\prec \\Theta(n^2)'}</InlineMath> — ο{' '}
          <InlineMath>{'A_2'}</InlineMath> νικάει με μεγάλη διαφορά.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — δύο σχήματα D&amp;C σε αντιπαράθεση.</strong>{' '}
          Όταν σου δίνουν περιγραφή τύπου «διασπά σε a κομμάτια μεγέθους n/b,
          συνδέει σε χρόνο f», γράψε αμέσως την αναδρομή{' '}
          <InlineMath>{'aT(n/b)+f'}</InlineMath> και εφάρμοσε Master Theorem. Η
          μόνη σύγκριση που πρέπει να κάνεις είναι d (εκθέτης του f) vs{' '}
          <InlineMath>{'\\log_b a'}</InlineMath>: μικρότερο→περίπτωση 1, ίσο→2,
          μεγαλύτερο→3.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th3-a',
    title: 'Ιούνιος 2023 · Θέμα 3Α — Το Hamiltonian Path ανήκει στο NP',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2023',
    problemNumber: 'Θέμα 3Α',
    weight: 5,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>Hamiltonian Path (Η):</strong> δίνεται γράφος{' '}
          <InlineMath>{'G'}</InlineMath> με <InlineMath>{'n'}</InlineMath>{' '}
          κόμβους και δύο κόμβοι <InlineMath>{'s'}</InlineMath> και{' '}
          <InlineMath>{'t'}</InlineMath>. Υπάρχει μονοπάτι από τον{' '}
          <InlineMath>{'s'}</InlineMath> στον <InlineMath>{'t'}</InlineMath> που
          περνά από κάθε κόμβο του <InlineMath>{'G'}</InlineMath> ακριβώς μία
          φορά;
        </p>
        <p>Δείξε ότι το πρόβλημα <InlineMath>{'H'}</InlineMath> ανήκει στην κλάση NP.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Τι σημαίνει «ανήκει στο NP».</strong> Όχι «λύνεται γρήγορα».
          Σημαίνει: <em>αν κάποιος μου ψιθυρίσει μια υποψήφια λύση</em>, μπορώ
          να την <em>επαληθεύσω</em> σε πολυωνυμικό χρόνο. Δεν χρειάζεται να
          βρίσκω εγώ τη λύση — αρκεί να την αναγνωρίζω.
        </p>
        <p>
          <strong>Το πιστοποιητικό.</strong> Για το Hamiltonian Path, ένα φυσικό
          πιστοποιητικό είναι μια προτεινόμενη ακολουθία κορυφών{' '}
          <InlineMath>{'v_1, v_2, \\ldots, v_n'}</InlineMath> — η σειρά με την
          οποία θα τις επισκεφθούμε.
        </p>
        <p>
          <strong>Ο επαληθευτής</strong> ελέγχει τρία πράγματα:
        </p>
        <ul>
          <li>
            <InlineMath>{'v_1 = s'}</InlineMath> και{' '}
            <InlineMath>{'v_n = t'}</InlineMath> (σωστά άκρα) —{' '}
            <InlineMath>{'O(1)'}</InlineMath>.
          </li>
          <li>
            η ακολουθία περιέχει <em>κάθε</em> κορυφή{' '}
            <strong>ακριβώς μία φορά</strong> — <InlineMath>{'O(n)'}</InlineMath>{' '}
            με ένα boolean σύνολο.
          </li>
          <li>
            κάθε διαδοχικό ζεύγος <InlineMath>{'(v_i, v_{i+1})'}</InlineMath>{' '}
            είναι πραγματική ακμή του <InlineMath>{'G'}</InlineMath> —{' '}
            <InlineMath>{'O(n)'}</InlineMath> έλεγχοι (με πίνακα γειτνίασης).
          </li>
        </ul>
        <p>
          Συνολικά <InlineMath>{'O(n)'}</InlineMath> έλεγχος — πολυωνυμικός.
          Άρα <InlineMath>{'H \\in \\text{NP}'}</InlineMath>.
        </p>
        <p>
          <strong>Πού ζει το Hamilton Path στον «ζωολογικό κήπο».</strong>{' '}
          Hamilton Path = NP-πλήρες. Παγίδα: συντομότερο μονοπάτι (στο{' '}
          <span className="text-success">P</span>) και μακρύτερο/Hamilton (στο{' '}
          <span className="text-danger">NPC</span>) έχουν διαφορά μιας λέξης
          αλλά δραματική διαφορά πολυπλοκότητας:
        </p>
        <ComplexityZooLab focus="hamilton-path" />
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «πιστοποιητικό + verifier».</strong> Για
            κάθε πρόβλημα του τύπου «υπάρχει X που ικανοποιεί …;», η ένταξη στο
            NP είναι ίδια συνταγή: όρισε ως πιστοποιητικό το ίδιο το X
            (μονοπάτι, υποσύνολο κορυφών, ανάθεση μεταβλητών), περίγραψε τους
            ελέγχους που πρέπει να περάσει, και δείξε ότι κάθε έλεγχος είναι
            πολυωνυμικός. Δεν μιλάς για αλγόριθμο εύρεσης — μόνο για επαλήθευση.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th3-b',
    title: 'Ιούνιος 2023 · Θέμα 3Β — Το πρόβλημα απόφασης MST σε NP και σε P',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2023',
    problemNumber: 'Θέμα 3Β',
    weight: 15,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>Minimum Spanning Tree (MST):</strong> δίνεται γράφος{' '}
          <InlineMath>{'G = (V, E, W)'}</InlineMath> με{' '}
          <InlineMath>{'n'}</InlineMath> κόμβους και μη αρνητικά βάρη στις ακμές
          μέσω της <InlineMath>{'W'}</InlineMath>. Να βρεθεί ένα συνδετικό
          δέντρο (spanning tree) ελαχίστου βάρους.
        </p>
        <p>
          <strong>i.</strong> Γράψε το αντίστοιχο πρόβλημα απόφασης{' '}
          <InlineMath>{'\\text{MST}_D'}</InlineMath>.{' '}
          <strong>ii.</strong> Δείξε ότι{' '}
          <InlineMath>{'\\text{MST}_D \\in \\text{NP}'}</InlineMath>.{' '}
          <strong>iii.</strong> Δείξε ότι{' '}
          <InlineMath>{'\\text{MST}_D \\in \\text{P}'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Βελτιστοποίηση → απόφαση μέσω κατωφλίου.</strong> Όταν
          έχουμε «βρες ελάχιστο X», το μετατρέπουμε σε «ναι/όχι» προσθέτοντας
          παράμετρο <InlineMath>{'k'}</InlineMath>:
        </p>
        <p>
          <InlineMath>{'\\text{MST}_D'}</InlineMath>: «Δίνεται γράφος{' '}
          <InlineMath>{'G = (V, E, W)'}</InlineMath> και ακέραιος{' '}
          <InlineMath>{'k'}</InlineMath>. Υπάρχει συνδετικό δέντρο του{' '}
          <InlineMath>{'G'}</InlineMath> με συνολικό βάρος{' '}
          <InlineMath>{'\\le k'}</InlineMath>;»
        </p>
        <p>
          <strong>ii. <InlineMath>{'\\text{MST}_D \\in \\text{NP}'}</InlineMath>.</strong>{' '}
          Πιστοποιητικό: ένα προτεινόμενο σύνολο ακμών{' '}
          <InlineMath>{'T \\subseteq E'}</InlineMath>. Ο επαληθευτής ελέγχει σε
          πολυωνυμικό χρόνο:
        </p>
        <ul>
          <li>
            <InlineMath>{'|T| = n - 1'}</InlineMath> ακμές — <InlineMath>{'O(1)'}</InlineMath>.
          </li>
          <li>
            το <InlineMath>{'T'}</InlineMath> είναι δέντρο που καλύπτει όλες
            τις κορυφές (συνεκτικό, χωρίς κύκλους) — ελέγχεται με BFS/DFS ή
            Union-Find σε <InlineMath>{'O(|V| + |E|)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\sum_{e \\in T} W(e) \\le k'}</InlineMath> — απλή άθροιση{' '}
            <InlineMath>{'O(n)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Όλα πολυωνυμικά → <InlineMath>{'\\text{MST}_D \\in \\text{NP}'}</InlineMath>.
        </p>
        <p>
          <strong>iii. <InlineMath>{'\\text{MST}_D \\in \\text{P}'}</InlineMath>.</strong>{' '}
          Η κλάση P είναι «λύνεται σε πολυωνυμικό χρόνο» — και για το MST έχουμε
          ολόκληρη μηχανή. Τρέξε <strong>Kruskal</strong> ή{' '}
          <strong>Prim</strong> σε <InlineMath>{'O(|E| \\log |V|)'}</InlineMath>,
          βρες το βάρος <InlineMath>{'W^*'}</InlineMath> του ΕΣΔ, και απάντησε
          «ναι» ⇔ <InlineMath>{'W^* \\le k'}</InlineMath>. Πολυωνυμικό →{' '}
          <InlineMath>{'\\text{MST}_D \\in \\text{P}'}</InlineMath>.
        </p>
        <p>
          <strong>Πού ζει το MST απόφασης στον «ζωολογικό κήπο».</strong>{' '}
          Στο P — μαζί με τα γνωστά «εύκολα»: BFS/DFS, shortest path, sorting.
          Όχι κοντά στο TSP. Η διαφορά είναι κρίσιμη: «βρες δέντρο» εύκολο,
          «βρες κύκλο» NP-πλήρες.
        </p>
        <ComplexityZooLab focus="mst-decision" />
        <p>
          <em>(Παρατήρηση: αφού <InlineMath>{'\\text{P} \\subseteq \\text{NP}'}</InlineMath>,
          το (iii) συνεπάγεται το (ii)· η άσκηση όμως απαιτεί ρητή απόδειξη και
          των δύο. Το πιστοποιητικό + verifier είναι ιστορικά η «πραγματική»
          απόδειξη ένταξης σε NP.)</em>
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «βελτιστοποίηση + κατώφλι = απόφαση».</strong>{' '}
            Κάθε πρόβλημα τύπου «βρες min/max X» μετατρέπεται σε{' '}
            <InlineMath>{'X_D'}</InlineMath>: «υπάρχει υποψήφιο με{' '}
            <InlineMath>{'X \\le k'}</InlineMath> (ή <InlineMath>{'\\ge k'}</InlineMath>);».
            Από εκεί, η ένταξη σε P έρχεται από τον αλγόριθμο βελτιστοποίησης
            (αν υπάρχει· τρέξ' τον, σύγκρινε με k)· η ένταξη σε NP από τον
            verifier ενός υποψήφιου X.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th4',
    title: 'Ιούνιος 2023 · Θέμα 4 — Κολώνες φωτισμού (μέγιστο ανεξάρτητο σύνολο σε μονοπάτι)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2023',
    problemNumber: 'Θέμα 4',
    weight: 40,
    difficulty: 'hard',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Ο δήμος θέλει να εγκαταστήσει κολώνες φωτισμού σε{' '}
          <InlineMath>{'n'}</InlineMath> πιθανές θέσεις κατά μήκος ενός δρόμου.
          Για εξοικονόμηση κόστους <strong>δεν</strong> τοποθετεί κολώνες σε δύο
          διαδοχικές θέσεις. Κάθε θέση <InlineMath>{'x_i'}</InlineMath> έχει
          φωτεινότητα <InlineMath>{'\\varphi_i'}</InlineMath>· στόχος είναι ένα{' '}
          υποσύνολο μη-διαδοχικών θέσεων με τη <strong>μέγιστη συνολική
          φωτεινότητα</strong> («μέγιστο ανεξάρτητο υποσύνολο»).
        </p>
        <p>
          Παράδειγμα 7 θέσεων με φωτεινότητες{' '}
          <InlineMath>{'[\\,8,\\ 40,\\ 20,\\ 16,\\ 32,\\ 36,\\ 24\\,]'}</InlineMath>{' '}
          (για <InlineMath>{'x_1, \\ldots, x_7'}</InlineMath>). Π.χ. τα ανεξάρτητα{' '}
          <InlineMath>{'\\{x_1,x_3,x_5,x_7\\}, \\{x_2,x_4,x_6\\}, \\{x_2,x_5,x_7\\}, \\{x_1,x_4,x_7\\}'}</InlineMath>{' '}
          έχουν φωτεινότητες <InlineMath>{'84, 92, 96, 48'}</InlineMath>.
        </p>
        <p>
          <strong>1.</strong> Ο εξής άπληστος αλγόριθμος επιλέγει το καλύτερο
          ανάμεσα στο σύνολο των κορυφών με <em>περιττούς</em> δείκτες και σε
          αυτό με <em>άρτιους</em> δείκτες. Είναι βέλτιστος; Αν όχι, δώσε
          αντιπαράδειγμα. <strong>2.</strong> Σχεδίασε αλγόριθμο δυναμικού
          προγραμματισμού που βρίσκει τη μέγιστη συνολική φωτεινότητα (δώσε την
          αναδρομική σχέση). <strong>3.</strong> Δώσε τον χρόνο εκτέλεσης —
          πρέπει να είναι πολυωνυμικός ως προς το <InlineMath>{'n'}</InlineMath>{' '}
          και ανεξάρτητος των τιμών φωτεινότητας. <strong>4.</strong> Εκτέλεσε
          τον αλγόριθμο στο παραπάνω παράδειγμα.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πρόκειται για το κλασικό <strong>«μέγιστο ανεξάρτητο σύνολο σε
          μονοπάτι»</strong>: επιλέγουμε κορυφές πάνω σε γραμμή χωρίς δύο
          γειτονικές, με μέγιστο άθροισμα βαρών. Παρακάτω, μία ενιαία οπτική
          απάντηση και στα 4 ερωτήματα — άπληστος που χάνει, η σχέση
          αναδρομής, η εκτέλεση, η ανάκτηση του ανεξάρτητου συνόλου.
        </p>
        <LamppostsMISViz />
        <p>
          <strong>1. Είναι ο άπληστος βέλτιστος; ΟΧΙ.</strong> Το ίδιο το
          στιγμιότυπο της εκφώνησης είναι αντιπαράδειγμα. Στην καρτέλα
          «Άπληστος odd/even» δες τα δύο ζευγάρια:
        </p>
        <ul>
          <li>
            Μονοί <InlineMath>{'\\{x_1,x_3,x_5,x_7\\}'}</InlineMath>:{' '}
            <InlineMath>{'8+20+32+24 = 84'}</InlineMath>.
          </li>
          <li>
            Ζυγοί <InlineMath>{'\\{x_2,x_4,x_6\\}'}</InlineMath>:{' '}
            <InlineMath>{'40+16+36 = 92'}</InlineMath>.
          </li>
        </ul>
        <p>
          Ο άπληστος επιστρέφει max(84, 92) = 92. Αλλά στην καρτέλα «Το
          πραγματικό βέλτιστο» φαίνεται το ανεξάρτητο{' '}
          <InlineMath>{'\\{x_2, x_5, x_7\\}'}</InlineMath> ={' '}
          <InlineMath>{'40+32+24 = 96 > 92'}</InlineMath>. Το βέλτιστο δεν
          είναι «όλα μονά» ή «όλα ζυγά» — είναι ένα μικτό σύνολο που σπάει το
          δίλημμα του άπληστου.
        </p>
        <p>
          <strong>2. Δυναμικός προγραμματισμός.</strong> Έστω{' '}
          <InlineMath>{'\\text{OPT}(i)'}</InlineMath> = η μέγιστη φωτεινότητα
          χρησιμοποιώντας μόνο τις θέσεις{' '}
          <InlineMath>{'x_1, \\ldots, x_i'}</InlineMath>. Στην θέση{' '}
          <InlineMath>{'x_i'}</InlineMath> ρωτάμε «μέσα ή έξω;»:
        </p>
        <ul>
          <li>
            <strong>ΕΞΩ:</strong> δεν βάζουμε κολώνα στο{' '}
            <InlineMath>{'x_i'}</InlineMath> → η λύση είναι{' '}
            <InlineMath>{'\\text{OPT}(i-1)'}</InlineMath>.
          </li>
          <li>
            <strong>ΜΕΣΑ:</strong> βάζουμε κολώνα → απαγορεύεται το{' '}
            <InlineMath>{'x_{i-1}'}</InlineMath>, οπότε κερδίζουμε{' '}
            <InlineMath>{'\\varphi_i + \\text{OPT}(i-2)'}</InlineMath>.
          </li>
        </ul>
        <BlockMath>{'\\text{OPT}(i) = \\begin{cases} 0 & i = 0 \\\\ \\varphi_1 & i = 1 \\\\ \\max\\{\\, \\text{OPT}(i-1),\\ \\ \\varphi_i + \\text{OPT}(i-2) \\,\\} & i \\ge 2 \\end{cases}'}</BlockMath>
        <p>
          Η ζητούμενη απάντηση είναι <InlineMath>{'\\text{OPT}(n)'}</InlineMath>.
        </p>
        <p>
          <strong>3. Χρόνος εκτέλεσης.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'n + 1'}</InlineMath> κελιά και κάθε κελί υπολογίζεται σε{' '}
          <InlineMath>{'O(1)'}</InlineMath> (ένα <InlineMath>{'\\max'}</InlineMath>{' '}
          δύο ήδη γνωστών τιμών) → συνολικά{' '}
          <strong><InlineMath>{'\\Theta(n)'}</InlineMath></strong>. Είναι
          πολυωνυμικός ως προς το <InlineMath>{'n'}</InlineMath> και{' '}
          <em>ανεξάρτητος</em> των τιμών φωτεινότητας — όσο μεγάλο κι αν είναι
          το <InlineMath>{'\\varphi_i'}</InlineMath>, ο πίνακας γεμίζει σε
          γραμμικό χρόνο.
        </p>
        <p>
          <strong>4. Εκτέλεση στο παράδειγμα.</strong> Στην καρτέλα «DP
          βήμα-βήμα» πάτησε «Επόμενο» και δες κάθε κελί να γεμίζει — τα
          βήματα είναι αυτά:
        </p>
        <BlockMath>{'\\begin{aligned} \\text{OPT}(0) &= 0 \\\\ \\text{OPT}(1) &= 8 \\\\ \\text{OPT}(2) &= \\max(8,\\ 40+0) = 40 \\\\ \\text{OPT}(3) &= \\max(40,\\ 20+8) = 40 \\\\ \\text{OPT}(4) &= \\max(40,\\ 16+40) = 56 \\\\ \\text{OPT}(5) &= \\max(56,\\ 32+40) = 72 \\\\ \\text{OPT}(6) &= \\max(72,\\ 36+56) = 92 \\\\ \\text{OPT}(7) &= \\max(92,\\ 24+72) = 96 \\end{aligned}'}</BlockMath>
        <p>
          Τελικός πίνακας:{' '}
          <InlineMath>{'[\\,0,\\ 8,\\ 40,\\ 40,\\ 56,\\ 72,\\ 92,\\ 96\\,]'}</InlineMath>.
          Η μέγιστη φωτεινότητα είναι{' '}
          <strong><InlineMath>{'\\text{OPT}(7) = 96'}</InlineMath></strong>, με
          ανεξάρτητο σύνολο <InlineMath>{'\\{x_2, x_5, x_7\\}'}</InlineMath> που
          ανακαλύπτεται από το πέρασμα προς τα πίσω (βλ. ίδια καρτέλα στο τέλος).
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «τοπικά διαζευτικά κριτήρια ψεύδονται».</strong>{' '}
          Όταν ο άπληστος «δοκίμασε μονούς, μετά ζυγούς» μοιάζει να χωράει όλες
          τις περιπτώσεις, ένα μικτό βέλτιστο σπάει την τοπική επιχειρηματολογία.
          Το σήμα: αν στο πρόβλημα <strong>μη-διαδοχικότητα</strong> ή
          <strong> ανάλογη απαγόρευση δύο γειτονικών</strong> + αυθαίρετα βάρη,
          σκέψου DP «κάθε στοιχείο μέσα/έξω» με αναδρομή στο
          <InlineMath>{'\\text{OPT}(i-1)'}</InlineMath> vs{' '}
          <InlineMath>{'v_i + \\text{OPT}(i-2)'}</InlineMath>. Η ίδια δομή
          γενικεύεται σε <em>«ανεξάρτητο σύνολο σε δέντρο»</em> (L17) με δύο
          τιμές A[v]/B[v] ανά κορυφή.
        </Callout>
      </>
    ),
  },
  // ── Φροντιστηριακά Σετ — μεταγραμμένες ασκήσεις ───────────────────────
  {
    id: 'front-set-1-ask0',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 0 — Σ/Λ ασυμπτωτικού συμβολισμού',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 0',
    difficulty: 'easy',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Χαρακτήρισε <strong>Σωστό / Λάθος</strong>:{' '}
        <InlineMath>{'n\\log n + 4n^3 + 2^{\\log n} = O(2^n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΣΩΣΤΟ.</strong> Δουλεύουμε σε δύο βήματα: πρώτα{' '}
          <em>απλοποιούμε</em> την αριστερή πλευρά, μετά συγκρίνουμε.
        </p>
        <p>
          <strong>Βήμα 1 — ο ύποπτος όρος.</strong> Το{' '}
          <InlineMath>{'2^{\\log n}'}</InlineMath> φαίνεται εκθετικό, αλλά δεν
          είναι: <InlineMath>{'2^{\\log_2 n} = n'}</InlineMath> (το{' '}
          <InlineMath>{'2'}</InlineMath> και ο <InlineMath>{'\\log_2'}</InlineMath>{' '}
          αλληλοαναιρούνται). Άρα η παράσταση είναι{' '}
          <InlineMath>{'n\\log n + 4n^3 + n'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 2 — ο κυρίαρχος όρος.</strong> Από τα τρία,{' '}
          <InlineMath>{'n\\log n,\\ 4n^3,\\ n'}</InlineMath>, το{' '}
          <InlineMath>{'4n^3'}</InlineMath> μεγαλώνει πιο γρήγορα. Ένα άθροισμα
          είναι πάντα <InlineMath>{'\\Theta'}</InlineMath> του μεγαλύτερου όρου
          του, άρα όλη η παράσταση είναι <InlineMath>{'\\Theta(n^3)'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 3 — η σύγκριση.</strong> Είναι{' '}
          <InlineMath>{'n^3 = O(2^n)'}</InlineMath>; Ναι — κάθε πολυώνυμο
          «χάνει» από κάθε εκθετική συνάρτηση. Άρα{' '}
          <InlineMath>{'\\Theta(n^3) = O(2^n)'}</InlineMath>, και η πρόταση είναι{' '}
          <strong>σωστή</strong>.
        </p>
        <AsymptoticVerdictExplorer preset="front-set-1-ask0" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «ψευδο-εκθετικοί» όροι.</strong> Όροι σαν{' '}
          <InlineMath>{'2^{\\log n}'}</InlineMath>,{' '}
          <InlineMath>{'3^{\\log_3 n}'}</InlineMath>,{' '}
          <InlineMath>{'c^{\\log_c n}'}</InlineMath> ΦΑΙΝΟΝΤΑΙ εκθετικοί αλλά
          είναι απλώς <InlineMath>{'n'}</InlineMath> μεταμφιεσμένο. Πιο γενικά:{' '}
          <InlineMath>{'a^{\\log_a x} = x'}</InlineMath>. Πάντα πρώτα απλοποίηση,
          μετά «κράτα τον κυρίαρχο», μετά εφαρμογή ιεραρχίας.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-1-ask1',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 1 — Διάταξη συναρτήσεων ανά ομάδα',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Διάταξε τις ακόλουθες συναρτήσεις ως προς την πολυπλοκότητα χρόνου,{' '}
          <strong>ανά ομάδα</strong> (από τη μικρότερη στη μεγαλύτερη τάξη):
        </p>
        <p>
          <strong>Ομάδα Α:</strong>{' '}
          <InlineMath>{'a_1 = \\log(\\log(500n))'}</InlineMath> ·{' '}
          <InlineMath>{'a_2 = 0{,}5\\log(n^{10}) - 5\\log n'}</InlineMath> ·{' '}
          <InlineMath>{'a_3 = (\\log n)^n'}</InlineMath> ·{' '}
          <InlineMath>{'a_4 = \\log(n^n) + 10n^{0{,}5}'}</InlineMath> ·{' '}
          <InlineMath>{'a_5 = \\underbrace{\\log n + \\cdots + \\log n}_{500\\ \\text{φορές}}'}</InlineMath>
        </p>
        <p>
          <strong>Ομάδα Β:</strong>{' '}
          <InlineMath>{'b_1 = \\binom{n}{n-4}'}</InlineMath> ·{' '}
          <InlineMath>{'b_2 = (4n)!'}</InlineMath> ·{' '}
          <InlineMath>{'b_3 = n^{n + n/2}'}</InlineMath> ·{' '}
          <InlineMath>{'b_4 = \\binom{n}{n/4}'}</InlineMath> ·{' '}
          <InlineMath>{'b_5 = n^{48}'}</InlineMath>
        </p>
        <p>
          <strong>Ομάδα Γ:</strong>{' '}
          <InlineMath>{'c_1 = 3^{n^2}'}</InlineMath> ·{' '}
          <InlineMath>{'c_2 = 13n^2'}</InlineMath> ·{' '}
          <InlineMath>{'c_3 = n^{13 + 1/n}'}</InlineMath> ·{' '}
          <InlineMath>{'c_4 = n^{n^n} + n!'}</InlineMath> ·{' '}
          <InlineMath>{'c_5 = 8^{3n\\log n}'}</InlineMath>
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Ομάδα Α — απλοποίηση κάθε όρου.</strong>
        </p>
        <ul>
          <li>
            <InlineMath>{'a_1 = \\log(\\log(500n)) = \\log(\\log 500 + \\log n) = \\Theta(\\log\\log n)'}</InlineMath>{' '}
            (η σταθερά <InlineMath>{'\\log 500'}</InlineMath> πνίγεται).
          </li>
          <li>
            <InlineMath>{'a_2 = 0{,}5\\cdot 10\\log n - 5\\log n = 5\\log n - 5\\log n = \\Theta(1)'}</InlineMath>{' '}
            — οι δύο όροι αλληλοαναιρούνται!
          </li>
          <li>
            <InlineMath>{'a_3 = (\\log n)^n = \\Theta((\\log n)^n)'}</InlineMath>{' '}
            — υπερ-εκθετική.
          </li>
          <li>
            <InlineMath>{'a_4 = \\log(n^n) + 10n^{0{,}5} = n\\log n + 10\\sqrt n = \\Theta(n\\log n)'}</InlineMath>{' '}
            (το <InlineMath>{'n\\log n'}</InlineMath> κυριαρχεί).
          </li>
          <li>
            <InlineMath>{'a_5 = 500\\log n = \\Theta(\\log n)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Διάταξη Α:{' '}
          <InlineMath>{'a_2\\,(\\Theta(1)) < a_1\\,(\\Theta(\\log\\log n)) < a_5\\,(\\Theta(\\log n)) < a_4\\,(\\Theta(n\\log n)) < a_3\\,(\\Theta((\\log n)^n))'}</InlineMath>.
        </p>
        <p>
          <strong>Ομάδα Β — δουλεύουμε με τάξεις μεγέθους.</strong>
        </p>
        <ul>
          <li>
            <InlineMath>{'b_1 = \\binom{n}{n-4} = \\binom{n}{4} = \\frac{n(n-1)(n-2)(n-3)}{24} = \\Theta(n^4)'}</InlineMath>{' '}
            — πολυωνυμική.
          </li>
          <li>
            <InlineMath>{'b_5 = n^{48} = \\Theta(n^{48})'}</InlineMath> —
            πολυωνυμική, μεγαλύτερου βαθμού.
          </li>
          <li>
            <InlineMath>{'b_4 = \\binom{n}{n/4}'}</InlineMath> — με προσέγγιση
            Stirling βγαίνει <strong>εκθετική</strong>, της μορφής{' '}
            <InlineMath>{'\\Theta(d^n\\cdot n^{-1/2})'}</InlineMath> για μια
            σταθερά <InlineMath>{'d \\approx 1{,}75 > 1'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'b_3 = n^{3n/2} = \\Theta(n^{3n/2})'}</InlineMath> —{' '}
            της μορφής <InlineMath>{'n^{\\Theta(n)}'}</InlineMath>, πολύ
            μεγαλύτερη από κάθε <InlineMath>{'d^n'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'b_2 = (4n)!'}</InlineMath> — παραγοντική, η μεγαλύτερη
            όλων (Stirling: <InlineMath>{'\\Theta(n^{4n+1/2}(4/e)^{4n})'}</InlineMath>).
          </li>
        </ul>
        <p>
          Η κλιμάκωση είναι: πολυώνυμο{' '}
          <InlineMath>{'<'}</InlineMath> εκθετικό{' '}
          <InlineMath>{'<'}</InlineMath>{' '}
          <InlineMath>{'n^{\\Theta(n)}'}</InlineMath>{' '}
          <InlineMath>{'<'}</InlineMath> παραγοντικό. Διάταξη Β:{' '}
          <InlineMath>{'b_1 < b_5 < b_4 < b_3 < b_2'}</InlineMath>.
        </p>
        <p>
          <strong>Ομάδα Γ — το κόλπο του λογαρίθμου.</strong> Όταν οι
          συναρτήσεις είναι «εκθετικού τύπου», τις συγκρίνουμε μέσω των{' '}
          <InlineMath>{'\\log c_i'}</InlineMath>:
        </p>
        <ul>
          <li>
            <InlineMath>{'\\log c_1 = \\log(3^{n^2}) = n^2\\log 3 = \\Theta(n^2)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_2 = \\log(13n^2) = \\Theta(\\log n)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_3 = (13 + 1/n)\\log n = \\Theta(\\log n)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_4 = \\log(n^{n^n} + n!) = \\Theta(n^n\\log n)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_5 = 3n\\log n\\cdot\\log 8 = \\Theta(n\\log n)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Τα <InlineMath>{'\\log c_2'}</InlineMath> και{' '}
          <InlineMath>{'\\log c_3'}</InlineMath> πέφτουν στην <em>ίδια</em>{' '}
          κλάση <InlineMath>{'\\Theta(\\log n)'}</InlineMath> — μόνο τότε
          συγκρίνουμε απευθείας τα <InlineMath>{'c_2, c_3'}</InlineMath>:{' '}
          αφού <InlineMath>{'2 < 13 + 1/n'}</InlineMath>, είναι{' '}
          <InlineMath>{'13n^2 < n^{13+1/n}'}</InlineMath>, άρα{' '}
          <InlineMath>{'c_2 < c_3'}</InlineMath>. Διάταξη Γ:{' '}
          <InlineMath>{'c_2 < c_3 < c_5 < c_1 < c_4'}</InlineMath>.
        </p>
        <p>
          Δες τις τρεις ομάδες να ταξινομούνται live καθώς αυξάνεται το{' '}
          <InlineMath>{'n'}</InlineMath> — οι μπάρες ξεκινούν μπερδεμένες και
          σταθεροποιούνται στην κανονική διάταξη:
        </p>
        <FunctionOrderingRace preset="fs1-ask1-A" />
        <FunctionOrderingRace preset="fs1-ask1-B" />
        <FunctionOrderingRace preset="fs1-ask1-C" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «πρώτα απλοποίησε σε Θ-class, μετά διάταξε».</strong>{' '}
          Σπάνια συγκρίνεις τις πραγματικές εκφράσεις — σχεδόν πάντα υπάρχει
          αλγεβρική απλοποίηση που τις φέρνει σε γνωστή τάξη (Θ(1), Θ(log n),
          Θ(n^k), Θ(2^n), Θ(n!)). Δύο εξωτικές περιπτώσεις: (α) δύο όροι
          αλληλοαναιρούνται → σταθερά· (β) δύο εκφράσεις πέφτουν στην ΙΔΙΑ
          Θ-class — μόνο τότε χρειάζεσαι λεπτότερη σύγκριση συντελεστών.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-1-ask3',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 3 — Πολυπλοκότητα με επαναλαμβανόμενο λογάριθμο',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Υπολόγισε την πολυπλοκότητα χρόνου του αλγορίθμου:</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`begin algorithm
  arg ← -1
  for i ← 1 to n with step 1 do
    m ← i
    while m > 0 do
      m ← log(m)
    end while
    for j ← 1 to m with step 1 do
      arg ← i · i · j
    end for
  end algorithm`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          Ο εξωτερικός βρόχος <InlineMath>{'i'}</InlineMath> τρέχει{' '}
          <InlineMath>{'n'}</InlineMath> φορές → <InlineMath>{'O(n)'}</InlineMath>.
          Μένει να βρούμε το κόστος του «σώματος» (η{' '}
          <InlineMath>{'\\text{while}'}</InlineMath> και ο δεύτερος{' '}
          <InlineMath>{'\\text{for}'}</InlineMath>).
        </p>
        <p>
          <strong>Ο βρόχος <InlineMath>{'\\text{while}'}</InlineMath>.</strong>{' '}
          Ξεκινά με <InlineMath>{'m = i'}</InlineMath> και κάθε φορά κάνει{' '}
          <InlineMath>{'m \\leftarrow \\log m'}</InlineMath> — εφαρμόζει
          λογάριθμο ξανά και ξανά. Πόσες φορές μπορείς να πάρεις λογάριθμο σε
          έναν αριθμό πριν αυτός πέσει στο <InlineMath>{'\\le 1'}</InlineMath>;{' '}
          Ακριβώς <InlineMath>{'\\log^*(n)'}</InlineMath> φορές — ο{' '}
          <strong>επαναλαμβανόμενος λογάριθμος</strong> (log star), μια
          συνάρτηση που μεγαλώνει απίστευτα αργά. Μετά απαιτείται το πολύ ένα
          ακόμα βήμα για να γίνει <InlineMath>{'m \\le 0'}</InlineMath> και να
          σταματήσει. Άρα η <InlineMath>{'\\text{while}'}</InlineMath> κάνει{' '}
          <InlineMath>{'O(\\log^* n)'}</InlineMath> επαναλήψεις.
        </p>
        <p>
          <strong>Ο δεύτερος <InlineMath>{'\\text{for}'}</InlineMath> — η
          παγίδα.</strong> Τρέχει <InlineMath>{'j'}</InlineMath> από{' '}
          <InlineMath>{'1'}</InlineMath> έως <InlineMath>{'m'}</InlineMath>.
          Όμως μόλις τελείωσε η <InlineMath>{'\\text{while}'}</InlineMath>, το{' '}
          <InlineMath>{'m'}</InlineMath> είναι <InlineMath>{'\\le 0'}</InlineMath>!{' '}
          Άρα ο βρόχος <InlineMath>{'j \\leftarrow 1 \\ldots m'}</InlineMath>{' '}
          δεν εκτελείται <em>ποτέ</em> → <InlineMath>{'O(1)'}</InlineMath>.
        </p>
        <p>
          <strong>Σύνθεση.</strong> Η <InlineMath>{'\\text{while}'}</InlineMath>{' '}
          και ο δεύτερος <InlineMath>{'\\text{for}'}</InlineMath> είναι{' '}
          <em>διαδοχικοί</em> (όχι ένας μέσα στον άλλον), άρα το κόστος του
          σώματος είναι <InlineMath>{'\\max\\{O(\\log^* n),\\ O(1)\\} = O(\\log^* n)'}</InlineMath>.
          Αυτό το σώμα είναι εμφωλευμένο στον εξωτερικό βρόχο, άρα:
        </p>
        <BlockMath>{'T(n) = O(n) \\cdot O(\\log^* n) = O(n\\log^* n)'}</BlockMath>
        <p>
          Δες το trace ζωντανά — η εσωτερική <code>for j ← 1 to m</code>{' '}
          εμφανίζεται με σήμα «trap» γιατί ΔΕΝ τρέχει ΠΟΤΕ (το{' '}
          <InlineMath>{'m'}</InlineMath> είναι ήδη <InlineMath>{'\\le 0'}</InlineMath>):
        </p>
        <LoopComplexityTrace preset="front-set-1-ask3" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «διάβασε το state ΠΡΙΝ από κάθε βρόχο».</strong>{' '}
          Η πιο συχνή παγίδα σε ανάλυση εμφωλευμένων: ο εσωτερικός βρόχος
          ΦΑΙΝΕΤΑΙ να τρέχει αλλά ΔΕΝ τρέχει επειδή το όριό του είναι ≤ 0 (ή
          δεν αλλάζει). Έλεγξε τις τιμές των μεταβλητών στο σημείο που μπαίνεις
          στον βρόχο. Δεύτερη παγίδα: <InlineMath>{'\\log^* n'}</InlineMath>{' '}
          (επαναλαμβανόμενος λογάριθμος) είναι σχεδόν σταθερά — γρήγορη
          εκτίμηση: για κάθε ρεαλιστικό <InlineMath>{'n'}</InlineMath>{' '}
          (ως 2^65536), <InlineMath>{'\\log^* n \\le 5'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask2',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 2 — Σ/Λ για αθροίσματα',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Χαρακτήρισε κάθε πρόταση <strong>Σωστό / Λάθος</strong>:</p>
        <p>
          (α) <InlineMath>{'\\sum_{k=1}^{n} \\tfrac{1}{k} = \\Theta(\\log n)'}</InlineMath>{' '}
          · (β) <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath> · (γ){' '}
          <InlineMath>{'2^n = \\Theta\\!\\left(\\sum_{k=0}^{n} \\binom{n}{k}\\right)'}</InlineMath>{' '}
          · (δ) <InlineMath>{'\\log(\\log n) = \\Theta(\\log(\\log n))'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) ΣΩΣΤΟ.</strong> Το{' '}
          <InlineMath>{'\\sum_{k=1}^n 1/k'}</InlineMath> είναι ο{' '}
          <em>αρμονικός αριθμός</em> <InlineMath>{'H_n'}</InlineMath>. Μια
          γνωστή — και πολύ χρήσιμη — ταυτότητα είναι{' '}
          <InlineMath>{'H_n \\approx \\ln n + \\gamma'}</InlineMath>, άρα{' '}
          <InlineMath>{'H_n = \\Theta(\\log n)'}</InlineMath>. (Διαισθητικά: τον
          φράσσεις με ολοκλήρωμα του <InlineMath>{'1/x'}</InlineMath>, που δίνει
          λογάριθμο.)
        </p>
        <p>
          <strong>(β) ΣΩΣΤΟ.</strong> Από την προσέγγιση Stirling,{' '}
          <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath>. Γρήγορη
          διαίσθηση: <InlineMath>{'\\log(n!) = \\sum_{k=1}^n \\log k'}</InlineMath>,
          και οι μισοί όροι είναι <InlineMath>{'\\ge \\log(n/2)'}</InlineMath>,
          δίνοντας κάτω φράγμα <InlineMath>{'\\Omega(n\\log n)'}</InlineMath>· το
          άνω <InlineMath>{'O(n\\log n)'}</InlineMath> είναι προφανές αφού κάθε
          όρος είναι <InlineMath>{'\\le \\log n'}</InlineMath>.
        </p>
        <p>
          <strong>(γ) ΣΩΣΤΟ.</strong> Εδώ δεν χρειάζεται καν ασυμπτωτική —
          ισχύει <em>ισότητα</em>. Το διωνυμικό θεώρημα λέει{' '}
          <InlineMath>{'\\sum_{k=0}^{n} \\binom{n}{k} = 2^n'}</InlineMath>{' '}
          ακριβώς. Άρα <InlineMath>{'2^n = \\Theta(2^n)'}</InlineMath> —
          τετριμμένα σωστό.
        </p>
        <p>
          <strong>(δ) ΣΩΣΤΟ.</strong> Κάθε συνάρτηση είναι{' '}
          <InlineMath>{'\\Theta'}</InlineMath> του εαυτού της — το{' '}
          <InlineMath>{'\\Theta'}</InlineMath> είναι ανακλαστικό. Είναι μια
          «δωρεάν» πρόταση που ελέγχει αν προσέχεις: η δεξιά και η αριστερή
          πλευρά είναι πανομοιότυπες.
        </p>
        <p>
          Δες τα δύο πιο διδακτικά υπο-ερωτήματα ζωντανά — η αρμονική σειρά
          συμπεριφέρεται σαν λογάριθμος, και ο λογάριθμος του παραγοντικού
          συμπεριφέρεται σαν <InlineMath>{'n\\log n'}</InlineMath>:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask2-a" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask2-b" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: αναγνώρισε τα τέσσερα «αναπόφευκτα» αθροίσματα.</strong>{' '}
          (α) <InlineMath>{'\\sum 1/k = \\Theta(\\log n)'}</InlineMath> (αρμονικό
          → λογάριθμος μέσω ολοκληρώματος του <InlineMath>{'1/x'}</InlineMath>).
          (β) <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath> (Stirling
          — ή απευθείας: οι μισοί όροι είναι <InlineMath>{'\\ge \\log(n/2)'}</InlineMath>).
          (γ) <InlineMath>{'\\sum \\binom{n}{k} = 2^n'}</InlineMath> ακριβώς (διωνυμικό
          θεώρημα). (δ) Ανακλαστικότητα — αν το αριστερό = δεξιό, η σχέση είναι
          τετριμμένα Θ.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask0',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 0 — Διάταξη συναρτήσεων κατά ρυθμό αύξησης',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 0',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Διάταξε κάθε ομάδα συναρτήσεων σε <strong>αύξουσα</strong> σειρά ρυθμού αύξησης.</p>
        <p>
          <strong>Ομάδα b:</strong>{' '}
          <InlineMath>{'b_1 = 2^n,\\ \\ b_2 = 4002^{\\,2^n},\\ \\ b_3 = 2^{\\,4002^n},\\ \\ b_4 = 4002^{4002},\\ \\ b_5 = 4002^{\\,n^2}'}</InlineMath>.
        </p>
        <p>
          <strong>Ομάδα f:</strong>{' '}
          <InlineMath>{'f_1 = n^{n+4} + n!,\\ \\ f_2 = n^{7\\sqrt{n}},\\ \\ f_3 = 4^{3n\\log n},\\ \\ f_4 = 7^{n^2},\\ \\ f_5 = n^{12 + 1/n}'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Όταν οι συναρτήσεις είναι «εκθετικοί πύργοι», το εργαλείο είναι ο{' '}
          <strong>λογάριθμος</strong>: συγκρίνουμε τους λογαρίθμους τους, που
          είναι πιο εύκολο, και η σειρά διατηρείται.
        </p>
        <p>
          <strong>Ομάδα b.</strong> Το <InlineMath>{'b_4 = 4002^{4002}'}</InlineMath>{' '}
          δεν εξαρτάται από το <InlineMath>{'n'}</InlineMath> — είναι{' '}
          <strong>σταθερά</strong>, <InlineMath>{'O(1)'}</InlineMath>, το
          μικρότερο. Για τα υπόλοιπα παίρνουμε λογάριθμο:
        </p>
        <BlockMath>{'\\log b_1 = n,\\quad \\log b_5 \\approx 12n^2,\\quad \\log b_2 \\approx 12\\cdot 2^n,\\quad \\log b_3 = 4002^{\\,n}.'}</BlockMath>
        <p>
          Συγκρίνοντας: <InlineMath>{'n < 12n^2 < 12\\cdot 2^n < 4002^n'}</InlineMath>.
          Άρα <strong><InlineMath>{'b_4 < b_1 < b_5 < b_2 < b_3'}</InlineMath></strong>.
        </p>
        <p>
          <strong>Ομάδα f.</strong> Ξανά με λογαρίθμους:{' '}
          <InlineMath>{'\\log f_5 = \\Theta(\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_2 = \\Theta(\\sqrt{n}\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_1 = \\Theta(n\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_3 = \\Theta(n\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_4 = \\Theta(n^2)'}</InlineMath>.
        </p>
        <p>
          Τα <InlineMath>{'f_1, f_3'}</InlineMath> πέφτουν στην ίδια κλάση{' '}
          (<InlineMath>{'n\\log n'}</InlineMath>) — χρειάζεται πιο λεπτή
          σύγκριση. Γράφουμε{' '}
          <InlineMath>{'f_3 = 4^{3n\\log n} = (n^{\\log 4})^{3n} = (n^2)^{3n} = n^{6n}'}</InlineMath>,
          ενώ <InlineMath>{'f_1 \\approx n^{n+4}'}</InlineMath>. Άρα{' '}
          <InlineMath>{'f_1 < f_3'}</InlineMath>. Τελική σειρά:{' '}
          <strong><InlineMath>{'f_5 < f_2 < f_1 < f_3 < f_4'}</InlineMath></strong>.
        </p>
        <p>
          Δες τους δύο διαγωνισμούς live. Πρόσεξε ιδιαίτερα στην ομάδα b: το{' '}
          <InlineMath>{'b_4 = 4002^{4002}'}</InlineMath> είναι τεράστια
          σταθερά — στο γράφημα φαίνεται γιγάντιο, αλλά οριακά πέφτει κάτω από
          τα παραμετρικά σε <InlineMath>{'n'}</InlineMath> μόλις αυτά πιάσουν
          την (τεράστια!) τιμή της σταθεράς.
        </p>
        <FunctionOrderingRace preset="fs2-ask0-b" />
        <FunctionOrderingRace preset="fs2-ask0-f" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «log και των δύο» για εκθετικούς πύργους.</strong>{' '}
          Όταν συγκρίνεις <InlineMath>{'a^{u(n)}'}</InlineMath> με{' '}
          <InlineMath>{'b^{v(n)}'}</InlineMath>, παίρνεις log:{' '}
          <InlineMath>{'u(n)\\log a'}</InlineMath> vs{' '}
          <InlineMath>{'v(n)\\log b'}</InlineMath>. Συνήθως αρκεί. Πρόσεξε
          σταθερές που μεταμφιέζονται σε «τέρατα» (<InlineMath>{'4002^{4002}'}</InlineMath>{' '}
          είναι σταθερά — όχι συνάρτηση του n!) και ζευγάρια που πέφτουν στην
          ίδια κλάση — εκεί χρειάζεσαι σύγκριση συντελεστών.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask1',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 1 — Αναμενόμενος χρόνος Σειριακής Αναζήτησης',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Υπολόγισε τον <strong>αναμενόμενο</strong> χρόνο εκτέλεσης μίας
          Σειριακής (γραμμικής) Αναζήτησης σε <InlineMath>{'n'}</InlineMath>{' '}
          διακριτά στοιχεία, όταν η πιθανότητα <InlineMath>{'p_i'}</InlineMath> να
          βρίσκεται το ζητούμενο στη θέση <InlineMath>{'i'}</InlineMath> είναι:
        </p>
        <ul>
          <li>θέσεις <InlineMath>{'1'}</InlineMath> έως <InlineMath>{'n/2'}</InlineMath>: η καθεμία με πιθανότητα <InlineMath>{'1/n'}</InlineMath>·</li>
          <li>θέσεις <InlineMath>{'n/2+1'}</InlineMath> έως <InlineMath>{'n-2'}</InlineMath>: η καθεμία με πιθανότητα <InlineMath>{'1/(2(n-4))'}</InlineMath>·</li>
          <li>θέσεις <InlineMath>{'n-1'}</InlineMath> και <InlineMath>{'n'}</InlineMath>: η καθεμία με πιθανότητα <InlineMath>{'1/8'}</InlineMath>·</li>
          <li>«δεν βρέθηκε»: με την υπόλοιπη πιθανότητα <InlineMath>{'1 - \\sum p_i'}</InlineMath>.</li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η βασική ιδέα.</strong> «Αναμενόμενος χρόνος» σημαίνει{' '}
          <strong>σταθμισμένος μέσος όρος</strong>: για κάθε δυνατή έκβαση,
          πολλαπλασιάζουμε την πιθανότητά της επί το κόστος της, και τα
          προσθέτουμε όλα.
        </p>
        <p>
          Στη σειριακή αναζήτηση, για να βρεις το στοιχείο της θέσης{' '}
          <InlineMath>{'i'}</InlineMath> κάνεις <InlineMath>{'i'}</InlineMath>{' '}
          συγκρίσεις (τις ελέγχεις μία-μία από την αρχή). Αν δεν βρεθεί,
          ελέγχεις και τις <InlineMath>{'n'}</InlineMath> θέσεις. Άρα:
        </p>
        <BlockMath>{'E[T] = \\sum_{i=1}^{n} p_i \\cdot i \\;+\\; p_{\\text{δεν βρέθηκε}} \\cdot (n{+}1).'}</BlockMath>
        <p>
          <strong>Πάνω φράγμα.</strong> Κάθε κόστος είναι το πολύ{' '}
          <InlineMath>{'n+1'}</InlineMath>, και οι πιθανότητες αθροίζουν σε{' '}
          <InlineMath>{'1'}</InlineMath>. Άρα{' '}
          <InlineMath>{'E[T] \\le (n+1)\\sum p = n+1 = O(n)'}</InlineMath>.
        </p>
        <p>
          <strong>Κάτω φράγμα.</strong> Κοίτα μόνο τις θέσεις{' '}
          <InlineMath>{'n-1'}</InlineMath> και <InlineMath>{'n'}</InlineMath>:
          έχουν συνολική πιθανότητα <InlineMath>{'1/8 + 1/8 = 1/4'}</InlineMath>{' '}
          και κόστος <InlineMath>{'\\ge n-1'}</InlineMath>. Μόνο αυτές
          συνεισφέρουν <InlineMath>{'\\ge \\tfrac14 (n-1) = \\Omega(n)'}</InlineMath>.
        </p>
        <p>
          Αφού <InlineMath>{'E[T]'}</InlineMath> είναι ταυτόχρονα{' '}
          <InlineMath>{'O(n)'}</InlineMath> και <InlineMath>{'\\Omega(n)'}</InlineMath>,
          ο αναμενόμενος χρόνος είναι <strong><InlineMath>{'\\Theta(n)'}</InlineMath></strong>.
          Παρά την «τρομακτική» κατανομή, η σειριακή αναζήτηση μένει γραμμική
          κατά μέσο όρο.
        </p>
        <p>
          Δες την συνεισφορά κάθε ζώνης ξεχωριστά — η ροζ ζώνη (οι δύο
          τελευταίες θέσεις με <InlineMath>{'p = 1/8'}</InlineMath> η καθεμία)
          από μόνη της φορτώνει <InlineMath>{'\\ge n/4'}</InlineMath> στον λογαριασμό:
        </p>
        <ExpectedTimeBreakdown />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «ψάξε για ζώνη που από μόνη της δίνει Ω(τάξης)».</strong>{' '}
          Για να αποδείξεις ασυμπτωτικά κάτω φράγμα σε αναμενόμενο χρόνο, αρκεί
          να βρεις ΜΙΑ ομάδα εκβάσεων με «αρκετή» πιθανότητα και «αρκετό»
          κόστος. Για άνω φράγμα, χρησιμοποίησε ότι κάθε κόστος είναι το πολύ
          το maximum (συνήθως <InlineMath>{'n+1'}</InlineMath>) και ότι οι
          πιθανότητες αθροίζουν σε 1. Συνήθως τα δύο φράγματα πέφτουν στην ίδια
          τάξη — άρα Θ.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask3',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 3 — Σ/Λ: συνεπαγωγές ασυμπτωτικών',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Χαρακτήρισε <strong>Σωστό / Λάθος</strong>:</p>
        <p>
          (α) <InlineMath>{'f(n) = O(g(n)) \\;\\Rightarrow\\; 2^{f(n)} = O(2^{g(n)})'}</InlineMath>{' '}
          · (β) <InlineMath>{'g(n) = \\sum_{k=1}^{n} \\sqrt[k]{k} = \\Theta(n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) ΛΑΘΟΣ.</strong> Η ερώτηση ζητάει αν η συνεπαγωγή ισχύει
          για <em>κάθε</em> <InlineMath>{'f, g'}</InlineMath> — οπότε ένα{' '}
          αντιπαράδειγμα την καταρρίπτει.
        </p>
        <p>
          Πάρε <InlineMath>{'f(n) = 2n'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = n'}</InlineMath>. Είναι{' '}
          <InlineMath>{'f = O(g)'}</InlineMath> ✓ (δύο πολυώνυμα ίδιου βαθμού).
          Όμως <InlineMath>{'2^{f} = 2^{2n} = 4^n'}</InlineMath> ενώ{' '}
          <InlineMath>{'2^{g} = 2^n'}</InlineMath> — και το{' '}
          <InlineMath>{'4^n'}</InlineMath> <strong>δεν</strong> είναι{' '}
          <InlineMath>{'O(2^n)'}</InlineMath> (ο λόγος{' '}
          <InlineMath>{'4^n/2^n = 2^n \\to \\infty'}</InlineMath>). Η εκθετικοποίηση
          «μεγεθύνει» τη σταθερά του εκθέτη — δεν διατηρεί το <InlineMath>{'O'}</InlineMath>.
        </p>
        <p>
          <strong>(β) ΣΩΣΤΟ.</strong> Κάθε όρος <InlineMath>{'\\sqrt[k]{k} = k^{1/k}'}</InlineMath>{' '}
          είναι «σφηνωμένος» ανάμεσα στο <InlineMath>{'1'}</InlineMath> και στο{' '}
          <InlineMath>{'2'}</InlineMath>: για <InlineMath>{'k \\ge 1'}</InlineMath>{' '}
          ισχύει <InlineMath>{'1 \\le k^{1/k} \\le 2'}</InlineMath> (το άνω φράγμα
          γιατί <InlineMath>{'k \\le 2^k'}</InlineMath>, άρα{' '}
          <InlineMath>{'k^{1/k} \\le 2'}</InlineMath>).
        </p>
        <p>
          Άρα το άθροισμα <InlineMath>{'n'}</InlineMath> τέτοιων όρων είναι
          ανάμεσα σε <InlineMath>{'n\\cdot 1 = n'}</InlineMath> και{' '}
          <InlineMath>{'n\\cdot 2 = 2n'}</InlineMath> — δηλαδή{' '}
          <InlineMath>{'g(n) = \\Theta(n)'}</InlineMath>.
        </p>
        <p>
          <strong>Για το (α) — δες τι σπάει.</strong> Πάρε{' '}
          <InlineMath>{'f = kn,\\ g = n'}</InlineMath>. Σταθερός λόγος{' '}
          <InlineMath>{'f/g = k'}</InlineMath> → <InlineMath>{'f = O(g)'}</InlineMath>.
          Αλλά μετά την εκθετικοποίηση, ο λόγος γίνεται{' '}
          <InlineMath>{'2^{(k-1)n}'}</InlineMath> και φεύγει στο ∞:
        </p>
        <ExponentiationBreaksO />
        <p>
          <strong>Για το (β) — η κλασική σφήνα.</strong> Κάθε όρος{' '}
          <InlineMath>{'k^{1/k}'}</InlineMath> είναι «σφηνωμένος» μεταξύ 1 και 2:
        </p>
        <SandwichTheoremViz preset="front-set-2-ask3-b" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: O ΔΕΝ διατηρείται κάτω από εκθετικοποίηση.</strong>{' '}
          Σταθερός παράγοντας στον εκθέτη γίνεται εκθετικός παράγοντας έξω:{' '}
          <InlineMath>{'2^{kn} = (2^n)^k'}</InlineMath>. Παρόμοιες παγίδες: το O
          ΔΕΝ διατηρείται και κάτω από <strong>τετράγωνο</strong>
          (<InlineMath>{'f = O(g) \\not\\Rightarrow f^2 = O(g)'}</InlineMath>, π.χ.{' '}
          <InlineMath>{'n = O(n)'}</InlineMath> αλλά <InlineMath>{'n^2 \\notin O(n)'}</InlineMath>) —
          αλλά διατηρείται κάτω από <strong>σταθερές δυνάμεις</strong> από κοινού (αν{' '}
          <InlineMath>{'f = O(g)'}</InlineMath> τότε <InlineMath>{'f^k = O(g^k)'}</InlineMath>).
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask5',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 5 — Τρεις ασυμπτωτικές κατατάξεις',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 5',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Για καθεμία απάντησε ποια σχέση ισχύει:</p>
        <p>
          (α) Η <InlineMath>{'g(n) = 2^{\\sqrt{\\log n}}'}</InlineMath> είναι{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath>, <InlineMath>{'o(n)'}</InlineMath>{' '}
          ή <InlineMath>{'\\omega(n)'}</InlineMath>; (β) Η{' '}
          <InlineMath>{'f(n) = n^2 2^n / 5^n'}</InlineMath> είναι{' '}
          <InlineMath>{'\\Theta(1)'}</InlineMath>, <InlineMath>{'o(1)'}</InlineMath>{' '}
          ή <InlineMath>{'\\omega(1)'}</InlineMath>;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α)</strong> Συγκρίνουμε την{' '}
          <InlineMath>{'g(n) = 2^{\\sqrt{\\log n}}'}</InlineMath> με την{' '}
          <InlineMath>{'n'}</InlineMath>. Κόλπο: γράψε και τις δύο ως δύναμη του{' '}
          <InlineMath>{'2'}</InlineMath>. Είναι{' '}
          <InlineMath>{'n = 2^{\\log n}'}</InlineMath>. Άρα συγκρίνουμε τους
          εκθέτες: <InlineMath>{'\\sqrt{\\log n}'}</InlineMath> έναντι{' '}
          <InlineMath>{'\\log n'}</InlineMath>.
        </p>
        <p>
          Η ρίζα ενός μεγάλου αριθμού είναι πολύ μικρότερη από τον ίδιο τον
          αριθμό: <InlineMath>{'\\sqrt{\\log n} \\ll \\log n'}</InlineMath>. Άρα
          ο εκθέτης της <InlineMath>{'g'}</InlineMath> είναι πολύ μικρότερος, και{' '}
          <strong><InlineMath>{'g(n) = o(n)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(β)</strong> Ξαναγράφουμε:{' '}
          <InlineMath>{'f(n) = n^2 \\cdot \\dfrac{2^n}{5^n} = n^2 \\left(\\tfrac{2}{5}\\right)^n'}</InlineMath>.
          Το <InlineMath>{'(2/5)^n'}</InlineMath> έχει βάση{' '}
          <InlineMath>{'< 1'}</InlineMath>, άρα <strong>μηδενίζεται εκθετικά</strong> —
          και η εκθετική κατάρρευση «νικάει» εύκολα τον πολυωνυμικό όρο{' '}
          <InlineMath>{'n^2'}</InlineMath>. Συνεπώς{' '}
          <InlineMath>{'f(n) \\to 0'}</InlineMath>, δηλαδή{' '}
          <strong><InlineMath>{'f(n) = o(1)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(α) ζωντανά</strong> — το ίδιο preset με την πρόταση{' '}
          <InlineMath>{'pt5\\text{-}th2\\text{-}a'}</InlineMath>, αφού το (α) είναι
          ίδια εκφώνηση:
        </p>
        <AsymptoticVerdictExplorer preset="pt5-th2-a" />
        <p>
          <strong>(β) ζωντανά</strong> — η εκθετική κατάρρευση της{' '}
          <InlineMath>{'(2/5)^n'}</InlineMath> κερδίζει εύκολα το{' '}
          <InlineMath>{'n^2'}</InlineMath>· ο λόγος f/1 πάει στο 0:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask5-b" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «βάση εκθετικού».</strong> Όταν δεις{' '}
          <InlineMath>{'a^n'}</InlineMath>: αν <InlineMath>{'a > 1'}</InlineMath>{' '}
          η συνάρτηση εκρήγνυται· αν <InlineMath>{'a < 1'}</InlineMath> καταρρέει
          εκθετικά· αν <InlineMath>{'a = 1'}</InlineMath> είναι σταθερά. Η εκθετική
          κατάρρευση είναι αρκετά γρήγορη ώστε να νικά κάθε πολυωνυμικό μπροστά
          της. Άρα <InlineMath>{'n^k \\cdot a^n \\to 0'}</InlineMath> για κάθε{' '}
          <InlineMath>{'k'}</InlineMath> και <InlineMath>{'a < 1'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask6',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 6 — Πολυπλοκότητα εμφωλευμένων βρόχων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 6',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Υπολόγισε τη χρονική πολυπλοκότητα του παρακάτω αλγορίθμου:</p>
        <pre><code>{`Algorithm 1:
  arg ← -1
  για i ← 1 έως 2n  (βήμα 1):
    για j ← i έως i²  (βήμα 1):
      arg ← CALC(j)

procedure CALC(w):
  res ← 0
  για i ← 1 έως √w  (βήμα 0.1):
    res ← res + log(i)
  return res`}</code></pre>
      </>
    ),
    solution: (
      <>
        <p>
          Δουλεύουμε <strong>από μέσα προς τα έξω</strong> — πρώτα η{' '}
          <InlineMath>{'\\text{CALC}'}</InlineMath>, μετά οι δύο βρόχοι.
        </p>
        <p>
          <strong>Η <InlineMath>{'\\text{CALC}(w)'}</InlineMath>.</strong> Ο
          βρόχος της πάει από <InlineMath>{'1'}</InlineMath> έως{' '}
          <InlineMath>{'\\sqrt{w}'}</InlineMath> με βήμα{' '}
          <InlineMath>{'0.1'}</InlineMath> — άρα κάνει{' '}
          <InlineMath>{'\\sqrt{w}/0.1 = 10\\sqrt{w}'}</InlineMath> επαναλήψεις. Το
          βήμα <InlineMath>{'0.1'}</InlineMath> είναι απλώς μια σταθερά· η{' '}
          <InlineMath>{'\\text{CALC}(w) = \\Theta(\\sqrt{w})'}</InlineMath>.
        </p>
        <p>
          <strong>Ο εσωτερικός βρόχος</strong> (για δεδομένο{' '}
          <InlineMath>{'i'}</InlineMath>): το <InlineMath>{'j'}</InlineMath>{' '}
          πάει από <InlineMath>{'i'}</InlineMath> έως{' '}
          <InlineMath>{'i^2'}</InlineMath> — περίπου <InlineMath>{'i^2'}</InlineMath>{' '}
          επαναλήψεις. Κάθε μία καλεί <InlineMath>{'\\text{CALC}(j)'}</InlineMath>{' '}
          με <InlineMath>{'j'}</InlineMath> το πολύ <InlineMath>{'i^2'}</InlineMath>,
          άρα κόστος το πολύ <InlineMath>{'\\Theta(\\sqrt{i^2}) = \\Theta(i)'}</InlineMath>.
          Συνολικά ο εσωτερικός βρόχος:{' '}
          <InlineMath>{'\\Theta(i^2) \\cdot \\Theta(i) = \\Theta(i^3)'}</InlineMath>.
        </p>
        <p>
          <strong>Ο εξωτερικός βρόχος:</strong> αθροίζουμε για{' '}
          <InlineMath>{'i = 1'}</InlineMath> έως <InlineMath>{'2n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\sum_{i=1}^{2n} \\Theta(i^3) = \\Theta\\!\\big((2n)^4\\big) = \\Theta(n^4).'}</BlockMath>
        <p>
          (Χρησιμοποιήσαμε <InlineMath>{'\\sum_{i=1}^{m} i^3 = \\Theta(m^4)'}</InlineMath>.)
          Η συνολική πολυπλοκότητα είναι{' '}
          <strong><InlineMath>{'\\Theta(n^4)'}</InlineMath></strong>.
        </p>
        <LoopComplexityTrace preset="front-set-2-ask6" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: από μέσα προς τα έξω, πολλαπλασίασε τάξεις.</strong>{' '}
          Για εμφωλευμένους βρόχους:
          (1) Ξεκίνα από την πιο εσωτερική διαδικασία (εδώ CALC) — μέτρα τις
          επαναλήψεις της ως συνάρτηση του ορίσματος.
          (2) Πολλαπλασίασε με τις επαναλήψεις του επόμενου επιπέδου.
          (3) Συνέχισε προς τα έξω.
          Πρόσεξε: βήμα μη-μοναδιαίο (π.χ. 0.1) είναι σταθερά — δεν αλλάζει την
          τάξη. Όριο βρόχου που εξαρτάται από το <InlineMath>{'i'}</InlineMath>{' '}
          (όπως <InlineMath>{'i'}</InlineMath> ως <InlineMath>{'i^2'}</InlineMath>) απαιτεί άθροισμα,
          όχι απλό πολλαπλασιασμό.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask7',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 7 — Πίνακας ασυμπτωτικών σχέσεων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 7',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Για κάθε ζεύγος συναρτήσεων <InlineMath>{'A, B'}</InlineMath>{' '}
          παρακάτω, ποιες σχέσεις ισχύουν (<InlineMath>{'A'}</InlineMath> ως προς{' '}
          <InlineMath>{'B'}</InlineMath>): <InlineMath>{'O,\\ o,\\ \\Omega,\\ \\omega,\\ \\Theta'}</InlineMath>;
          (Σταθερές: <InlineMath>{'k,\\ e,\\ c > 1'}</InlineMath>.)
        </p>
        <p>
          1) <InlineMath>{'\\log^k n'}</InlineMath> vs <InlineMath>{'n^e'}</InlineMath>{' '}
          · 2) <InlineMath>{'n^k'}</InlineMath> vs <InlineMath>{'c^n'}</InlineMath>{' '}
          · 3) <InlineMath>{'\\sqrt{n}'}</InlineMath> vs{' '}
          <InlineMath>{'n^{\\sin n}'}</InlineMath> · 4){' '}
          <InlineMath>{'2^n'}</InlineMath> vs <InlineMath>{'2^{n/2}'}</InlineMath>{' '}
          · 5) <InlineMath>{'n^{\\log c}'}</InlineMath> vs{' '}
          <InlineMath>{'c^{\\log n}'}</InlineMath> · 6){' '}
          <InlineMath>{'\\log(n!)'}</InlineMath> vs <InlineMath>{'\\log(n^n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <table>
          <thead>
            <tr><th>A vs B</th><th>O</th><th>o</th><th>Ω</th><th>ω</th><th>Θ</th></tr>
          </thead>
          <tbody>
            <tr><td>1) logᵏn vs nᵉ</td><td>Ναι</td><td>Ναι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td></tr>
            <tr><td>2) nᵏ vs cⁿ</td><td>Ναι</td><td>Ναι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td></tr>
            <tr><td>3) √n vs n^sin n</td><td>Όχι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td></tr>
            <tr><td>4) 2ⁿ vs 2^(n/2)</td><td>Όχι</td><td>Όχι</td><td>Ναι</td><td>Ναι</td><td>Όχι</td></tr>
            <tr><td>5) n^log c vs c^log n</td><td>Ναι</td><td>Όχι</td><td>Ναι</td><td>Όχι</td><td>Ναι</td></tr>
            <tr><td>6) log(n!) vs log(nⁿ)</td><td>Ναι</td><td>Όχι</td><td>Ναι</td><td>Όχι</td><td>Ναι</td></tr>
          </tbody>
        </table>
        <p>
          <strong>1) Πολυλογάριθμος vs πολυώνυμο.</strong> Κάθε δύναμη του{' '}
          <InlineMath>{'\\log n'}</InlineMath> «χάνει» από οποιαδήποτε θετική
          δύναμη του <InlineMath>{'n'}</InlineMath>: <InlineMath>{'\\log^k n = o(n^e)'}</InlineMath>{' '}
          (το επιβεβαιώνεις με <InlineMath>{'k'}</InlineMath> εφαρμογές του
          κανόνα L'Hôpital). Το <InlineMath>{'o'}</InlineMath> δίνει και{' '}
          <InlineMath>{'O'}</InlineMath>.
        </p>
        <p>
          <strong>2) Πολυώνυμο vs εκθετικό.</strong> Όμοια,{' '}
          <InlineMath>{'n^k = o(c^n)'}</InlineMath> — το εκθετικό κερδίζει πάντα.
        </p>
        <p>
          <strong>3) Η παγίδα.</strong> Ο εκθέτης{' '}
          <InlineMath>{'\\sin n'}</InlineMath> <em>ταλαντώνεται</em> ανάμεσα σε{' '}
          <InlineMath>{'-1'}</InlineMath> και <InlineMath>{'1'}</InlineMath>, οπότε
          η <InlineMath>{'n^{\\sin n}'}</InlineMath> πότε είναι πάνω και πότε
          κάτω από την <InlineMath>{'\\sqrt{n} = n^{0.5}'}</InlineMath>. Καμία
          σχέση δεν ισχύει σταθερά → <strong>μη-συγκρίσιμες</strong>.
        </p>
        <p>
          <strong>4)</strong> <InlineMath>{'2^n = (2^{n/2})^2'}</InlineMath> —
          το <InlineMath>{'2^n'}</InlineMath> είναι το τετράγωνο του{' '}
          <InlineMath>{'2^{n/2}'}</InlineMath>, άρα αυστηρά μεγαλύτερο:{' '}
          <InlineMath>{'2^n = \\omega(2^{n/2})'}</InlineMath> (και{' '}
          <InlineMath>{'\\Omega'}</InlineMath>).
        </p>
        <p>
          <strong>5) Ταυτότητα!</strong> Ισχύει{' '}
          <InlineMath>{'c^{\\log n} = n^{\\log c}'}</InlineMath> (παίρνοντας
          λογάριθμο, και οι δύο δίνουν <InlineMath>{'\\log c \\cdot \\log n'}</InlineMath>).
          Είναι <strong>ίσες</strong> → <InlineMath>{'\\Theta'}</InlineMath> (και{' '}
          <InlineMath>{'O, \\Omega'}</InlineMath>).
        </p>
        <p>
          <strong>6)</strong> <InlineMath>{'\\log(n^n) = n\\log n'}</InlineMath>,
          και <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath> (Stirling).
          Ίδια τάξη → <InlineMath>{'\\Theta'}</InlineMath>.
        </p>
        <p>
          Έξι ζευγάρια, έξι σύντομα verdict-explorers. Δες πώς κάθε
          γραμμή του πίνακα αντιστοιχεί σε διαφορετική «λογική»:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-1" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-2" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-3" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-4" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-5" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-6" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: αναγνώρισε ποια από τις «6 αρχέτυπες» μάχες είσαι σε.</strong>{' '}
          Σχεδόν κάθε σύγκριση ασυμπτωτικού πέφτει σε μία από αυτές:
          (1) πολυλογάριθμος vs πολυώνυμο,
          (2) πολυώνυμο vs εκθετικό,
          (3) ταλάντωση → ασύγκριτες,
          (4) ίδια βάση, διαφορετικός εκθέτης → τετράγωνο/κύβος,
          (5) η ταυτότητα <InlineMath>{'n^{\\log c} = c^{\\log n}'}</InlineMath>{' '}
          (κρυφή ισότητα),
          (6) log(n!) = Θ(log(n^n)) (Stirling).
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask4',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 4 — Ασυμπτωτική τάξη και διάταξη συναρτήσεων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 4',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Βρες την ασυμπτωτική συμπεριφορά των παρακάτω συναρτήσεων,
          προσδιορίζοντας για κάθε μία αν είναι{' '}
          <InlineMath>{'\\Theta(n^m \\log^k n)'}</InlineMath> ή{' '}
          <InlineMath>{'\\Theta(m^{n^k})'}</InlineMath> για κατάλληλες
          μη-αρνητικές ακέραιες τιμές των <InlineMath>{'k, m'}</InlineMath>:
        </p>
        <p>
          1. &nbsp;(α΄) <InlineMath>{'\\log\\!\\left(n^{\\log n} + 2^n\\right)'}</InlineMath>
          &nbsp;·&nbsp; (β΄) <InlineMath>{'\\sum_{k=1}^{n} k\\sqrt[k]{k}'}</InlineMath>
          &nbsp;·&nbsp; (γ΄) <InlineMath>{'5^{H_n},\\ \\ H_n = \\sum_{k=1}^{n}\\frac{1}{k}'}</InlineMath>
          &nbsp;·&nbsp; (δ΄) <InlineMath>{'\\log(n!)\\cdot\\sum_{i=1}^{n}\\frac{1}{2}'}</InlineMath>
        </p>
        <p>
          2. &nbsp;Να τις διατάξεις σε αύξουσα τάξη μεγέθους καθώς το{' '}
          <InlineMath>{'n'}</InlineMath> τείνει στο άπειρο.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Το κόλπο σε όλα τα ερωτήματα — «θεώρημα της σφήνας».</strong>{' '}
          Όταν μια συνάρτηση είναι δύσκολο να την υπολογίσεις απευθείας, βρίσκεις
          μια <em>μικρότερη</em> και μια <em>μεγαλύτερη</em> που την «κλείνουν»
          ανάμεσά τους. Αν και οι δύο φράχτες έχουν την <strong>ίδια τάξη</strong>,
          τότε ό,τι βρίσκεται ανάμεσά τους έχει αναγκαστικά κι αυτό την ίδια τάξη.
        </p>
        <p>
          <strong>(α΄) <InlineMath>{'\\log(n^{\\log n} + 2^n)'}</InlineMath>.</strong>{' '}
          Πρώτα ξεμπλέκουμε τον περίεργο όρο <InlineMath>{'n^{\\log n}'}</InlineMath>.
          Γράφουμε <InlineMath>{'n = 2^{\\log n}'}</InlineMath>, οπότε{' '}
          <InlineMath>{'n^{\\log n} = \\left(2^{\\log n}\\right)^{\\log n} = 2^{\\log^2 n}'}</InlineMath>.
          Αφού <InlineMath>{'\\log^2 n < n'}</InlineMath> τελικά, είναι{' '}
          <InlineMath>{'n^{\\log n} = 2^{\\log^2 n} \\le 2^n'}</InlineMath>. Άρα το
          άθροισμα μέσα στον λογάριθμο κλείνεται:
        </p>
        <BlockMath>{'2^n \\;\\le\\; n^{\\log n} + 2^n \\;\\le\\; 2\\cdot 2^n'}</BlockMath>
        <p>
          Παίρνοντας λογάριθμο και στα τρία:{' '}
          <InlineMath>{'n\\log 2 \\le \\log(n^{\\log n}+2^n) \\le \\log 2 + n\\log 2'}</InlineMath>.
          Και οι δύο φράχτες είναι <InlineMath>{'\\Theta(n)'}</InlineMath>, άρα{' '}
          <InlineMath>{'\\log(n^{\\log n}+2^n) = \\Theta(n) = \\Theta(n^1\\log^0 n)'}</InlineMath>
          &nbsp;— δηλαδή <InlineMath>{'m=1,\\ k=0'}</InlineMath>.
        </p>
        <p>
          <strong>(β΄) <InlineMath>{'\\sum_{k=1}^{n} k\\sqrt[k]{k}'}</InlineMath>.</strong>{' '}
          Ο όρος <InlineMath>{'\\sqrt[k]{k} = k^{1/k}'}</InlineMath> είναι ένας
          αριθμός πολύ κοντά στο <InlineMath>{'1'}</InlineMath>. Φράζουμε:
        </p>
        <ul>
          <li>
            <strong>Κάτω:</strong> <InlineMath>{'k^{1/k} \\ge 1'}</InlineMath> για{' '}
            <InlineMath>{'k\\ge 1'}</InlineMath>, άρα{' '}
            <InlineMath>{'k\\sqrt[k]{k} \\ge k'}</InlineMath> και{' '}
            <InlineMath>{'\\sum_{k=1}^{n} k = \\tfrac{n(n+1)}{2} = \\Theta(n^2)'}</InlineMath>.
          </li>
          <li>
            <strong>Πάνω:</strong> <InlineMath>{'k^{1/k} = 2^{(\\log k)/k} \\le 2^1 = 2'}</InlineMath>{' '}
            (γιατί <InlineMath>{'(\\log k)/k \\le 1'}</InlineMath>), άρα{' '}
            <InlineMath>{'k\\sqrt[k]{k} \\le 2k'}</InlineMath> και{' '}
            <InlineMath>{'\\sum_{k=1}^{n} 2k = n(n+1) = \\Theta(n^2)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Σφήνα: <InlineMath>{'\\Theta(n^2) \\le \\sum k\\sqrt[k]{k} \\le \\Theta(n^2)'}</InlineMath>,
          άρα το άθροισμα είναι <InlineMath>{'\\Theta(n^2) = \\Theta(n^2\\log^0 n)'}</InlineMath>
          &nbsp;— <InlineMath>{'m=2,\\ k=0'}</InlineMath>.
        </p>
        <p>
          <strong>(γ΄) <InlineMath>{'5^{H_n}'}</InlineMath>.</strong> Ο αρμονικός
          αριθμός μεγαλώνει σαν λογάριθμος:{' '}
          <InlineMath>{'H_n = \\sum_{k=1}^{n}\\tfrac1k \\approx \\ln n + \\gamma'}</InlineMath>{' '}
          (όπου <InlineMath>{'\\gamma\\approx 0{,}577'}</InlineMath> η σταθερά
          Euler). Άρα:
        </p>
        <BlockMath>{'5^{H_n} \\approx 5^{\\ln n + \\gamma} = 5^{\\ln n}\\cdot 5^{\\gamma} = n^{\\ln 5}\\cdot 5^{\\gamma}'}</BlockMath>
        <p>
          Επειδή <InlineMath>{'\\ln 5 \\approx 1{,}6'}</InlineMath>, βγαίνει{' '}
          <InlineMath>{'5^{H_n} = \\Theta(n^{\\ln 5}) \\approx \\Theta(n^{1{,}6})'}</InlineMath>.
          <strong> Προσοχή στην παγίδα:</strong> αυτό <em>δεν</em> γράφεται σε
          καμία από τις δύο ζητούμενες μορφές με ακέραιους εκθέτες — ο εκθέτης{' '}
          <InlineMath>{'1{,}6'}</InlineMath> πέφτει αυστηρά ανάμεσα:{' '}
          <InlineMath>{'n^1 < n^{1{,}6} < n^2'}</InlineMath>. (Αυστηρά: από{' '}
          <InlineMath>{'\\ln(n+1) \\le H_n \\le \\ln n + 1'}</InlineMath> παίρνεις{' '}
          <InlineMath>{'(n+1)^{\\ln 5} \\le 5^{H_n} \\le 5\\,n^{\\ln 5}'}</InlineMath>,
          και οι δύο φράχτες <InlineMath>{'\\Theta(n^{\\ln 5})'}</InlineMath>.)
        </p>
        <p>
          <strong>(δ΄) <InlineMath>{'\\log(n!)\\cdot\\sum_{i=1}^{n}\\tfrac12'}</InlineMath>.</strong>{' '}
          Δύο γνωστά κομμάτια πολλαπλασιασμένα. Από τον τύπο Stirling,{' '}
          <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath>. Το άθροισμα{' '}
          <InlineMath>{'\\sum_{i=1}^{n}\\tfrac12'}</InlineMath> είναι απλώς το{' '}
          <InlineMath>{'\\tfrac12'}</InlineMath> προστιθέμενο{' '}
          <InlineMath>{'n'}</InlineMath> φορές, δηλαδή{' '}
          <InlineMath>{'\\tfrac n2 = \\Theta(n)'}</InlineMath>. Γινόμενο:{' '}
          <InlineMath>{'\\Theta(n\\log n)\\cdot\\Theta(n) = \\Theta(n^2\\log n)'}</InlineMath>
          &nbsp;— <InlineMath>{'m=2,\\ k=1'}</InlineMath>.
        </p>
        <p>
          <strong>2. Διάταξη.</strong> Βάζουμε τις τέσσερις τάξεις από τη
          μικρότερη στη μεγαλύτερη:
        </p>
        <BlockMath>{'\\underbrace{\\Theta(n)}_{(\\alpha\')} \\;<\\; \\underbrace{\\Theta(n^{1{,}6})}_{(\\gamma\')} \\;<\\; \\underbrace{\\Theta(n^2)}_{(\\beta\')} \\;<\\; \\underbrace{\\Theta(n^2\\log n)}_{(\\delta\')}'}</BlockMath>
        <p>
          Δες τη «παγίδα» του (γ΄) ζωντανά — η <InlineMath>{'5^{H_n}'}</InlineMath>{' '}
          φαίνεται εκθετική, αλλά ο αρμονικός αριθμός στον εκθέτη την μετατρέπει σε
          πολυώνυμο <InlineMath>{'n^{\\ln 5} \\approx n^{1.6}'}</InlineMath>:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask4-c" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «σφήνωσε από κάτω και από πάνω».</strong> Όταν
          δεν μπορείς να υπολογίσεις απευθείας μια συνάρτηση, βρες μια μικρότερη
          και μια μεγαλύτερη με την ΙΔΙΑ ασυμπτωτική τάξη. Εδώ:{' '}
          <InlineMath>{'\\Theta(n^2) \\le \\sum k\\sqrt[k]{k} \\le \\Theta(n^2)'}</InlineMath>{' '}
          → πιάστηκε η μέση σε <InlineMath>{'\\Theta(n^2)'}</InlineMath>. Πρόσεξε
          επίσης το ψεύδο-εκθετικό <InlineMath>{'a^{H_n}'}</InlineMath>: ο{' '}
          <InlineMath>{'H_n \\approx \\ln n'}</InlineMath> μετατρέπει την σε{' '}
          <InlineMath>{'n^{\\ln a}'}</InlineMath> — πολυώνυμο με μη-ακέραιο εκθέτη.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask4',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 4 — Αναδρομή T(n) = T(n−1) + 2ⁿ',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική σχέση <InlineMath>{'T(n) = T(n-1) + 2^n'}</InlineMath>{' '}
        με αρχική συνθήκη <InlineMath>{'T(0) = 5'}</InlineMath>, και δώσε την
        ασυμπτωτική της τάξη.
      </p>
    ),
    solution: (
      <>
        <p>
          Master Theorem δεν εφαρμόζεται — το πρόβλημα μικραίνει{' '}
          <em>κατά 1</em>, όχι με διαίρεση. Πάμε σε{' '}
          <strong>τηλεσκόπηση</strong>: γράφουμε τη σχέση για διαδοχικά{' '}
          <InlineMath>{'n'}</InlineMath> και προσθέτουμε κατά μέλη — οι
          ενδιάμεσοι όροι αλληλοαναιρούνται. Πάτα «+ Επόμενη γραμμή» για να
          δεις τη συσσώρευση:
        </p>
        <RecurrenceTelescope preset="front-set-3-ask4" />
        <p>
          Συγκεντρωτικά: όλοι οι όροι <InlineMath>{'T(1), T(2), \\dots, T(n-1)'}</InlineMath>{' '}
          εμφανίζονται μία φορά θετικοί και μία αρνητικοί — διαγράφονται. Μένει
          μόνο
        </p>
        <BlockMath>{'T(n) - T(0) = \\sum_{i=1}^{n} 2^i = 2^{n+1} - 2.'}</BlockMath>
        <p>Με <InlineMath>{'T(0) = 5'}</InlineMath>:</p>
        <BlockMath>{'T(n) = 2^{n+1} + 3 = \\Theta(2^n).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «μικραίνει κατά 1 ⇒ τηλεσκόπηση».</strong>{' '}
          Για αναδρομές <InlineMath>{'T(n) = T(n-1) + g(n)'}</InlineMath>:
          γράψε τη σχέση για 1, 2, …, n, πρόσθεσε κατά μέλη, αναγνώρισε το{' '}
          άθροισμα <InlineMath>{'\\sum g(i)'}</InlineMath>. Η ασυμπτωτική του{' '}
          <InlineMath>{'T(n)'}</InlineMath> ταυτίζεται με αυτή του αθροίσματος:{' '}
          g=c → Θ(n), g=i → Θ(n²), g=2ⁱ → Θ(2ⁿ) (η σειρά κυριαρχείται από τον
          τελευταίο όρο).
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask1',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 1 — Κλειστός τύπος των αριθμών Fibonacci',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δίνεται η ακολουθία των αριθμών Fibonacci:
        </p>
        <BlockMath>{'F(n) = \\begin{cases} 0, & n = 0 \\\\ 1, & n = 1 \\\\ F(n-1) + F(n-2), & n \\ge 2 \\end{cases}'}</BlockMath>
        <p>
          Λύσε την αναδρομική σχέση (βρες κλειστό τύπο για το{' '}
          <InlineMath>{'F(n)'}</InlineMath>) και προσδιόρισε την ασυμπτωτική της
          τάξη.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Η <InlineMath>{'F(n) = F(n-1) + F(n-2)'}</InlineMath> είναι{' '}
          <strong>ομογενής γραμμική αναδρομή</strong> — κάθε όρος είναι
          σταθερός γραμμικός συνδυασμός προηγούμενων, χωρίς εξωτερικό
          προσθετέο. Η μέθοδος-εργαλείο για αυτές είναι η{' '}
          <strong>χαρακτηριστική εξίσωση</strong>: μάντεψε λύση{' '}
          <InlineMath>{'F(n) = x^n'}</InlineMath>, αντικατάστησε, βρες ρίζες,
          γράψε γενική λύση, βρες σταθερές από τις αρχικές συνθήκες. Δες κάθε
          βήμα ζωντανά (επιλεγμένη η καρτέλα Fibonacci):
        </p>
        <CharEquationLab initialMode="fib" />
        <p>
          <strong>Σύνοψη.</strong> Η χαρακτηριστική <InlineMath>{'x^2-x-1=0'}</InlineMath>{' '}
          δίνει δύο διαφορετικές ρίζες <InlineMath>{'\\varphi, \\psi'}</InlineMath>.
          Από τις <InlineMath>{'F_0=0, F_1=1'}</InlineMath> προκύπτει ο τύπος
          του Binet:
        </p>
        <BlockMath>{'F_n = \\frac{1}{\\sqrt5}\\,\\varphi^n - \\frac{1}{\\sqrt5}\\,\\psi^n'}</BlockMath>
        <p>
          Επειδή <InlineMath>{'|\\psi| < 1'}</InlineMath>, ο δεύτερος όρος
          φθίνει στο μηδέν. Κυριαρχεί ο πρώτος:
        </p>
        <BlockMath>{'F_n = \\Theta(\\varphi^n) \\approx \\Theta(1{,}618^n) - \\text{εκθετική.}'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «ομογενής γραμμική ⇒ χαρακτηριστική εξίσωση».</strong>{' '}
          Όποτε δεις <InlineMath>{'T(n) = c_1 T(n-1) + c_2 T(n-2) + \\cdots'}</InlineMath>{' '}
          χωρίς εξωτερικό όρο, ακολούθησε τη συνταγή σε 3 βήματα: (1) γράψε τη
          χαρακτηριστική πολυωνυμική εξίσωση, (2) βρες ρίζες — αν διαφορετικές,
          γενική λύση = γραμμικός συνδυασμός των <InlineMath>{'r_i^n'}</InlineMath>,
          αν διπλή πολλαπλασίαζε με n (δες front-set-3-ask2), (3) λύσε για τις
          σταθερές από τις αρχικές συνθήκες. Η ασυμπτωτική κυριαρχείται από τη{' '}
          ρίζα με μεγαλύτερο μέτρο.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask2',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 2 — Αναδρομή με διπλή ρίζα',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>Λύσε την αναδρομική σχέση:</p>
        <BlockMath>{'T(n) = \\begin{cases} 3, & n = 0 \\\\ 8, & n = 1 \\\\ 4\\,T(n-1) - 4\\,T(n-2), & n \\ge 2 \\end{cases}'}</BlockMath>
      </>
    ),
    solution: (
      <>
        <p>
          Πάλι ομογενής γραμμική → χαρακτηριστική εξίσωση. Η{' '}
          <strong>παγίδα εδώ</strong>: η εξίσωση{' '}
          <InlineMath>{'x^2 - 4x + 4 = 0'}</InlineMath> έχει{' '}
          <strong>διπλή ρίζα</strong> <InlineMath>{'x = 2'}</InlineMath>. Δύο
          πανομοιότυποι όροι <InlineMath>{'\\lambda_1 2^n + \\lambda_2 2^n'}</InlineMath>{' '}
          συνθλίβονται σε έναν — χάνουμε ένα βαθμό ελευθερίας και δεν μπορούμε
          να ικανοποιήσουμε δύο αρχικές συνθήκες. <strong>Το ×n κόλπο</strong>{' '}
          λύνει το πρόβλημα: ο δεύτερος όρος γίνεται{' '}
          <InlineMath>{'\\lambda_2 \\cdot n \\cdot 2^n'}</InlineMath>.
        </p>
        <CharEquationLab initialMode="double" />
        <p>
          <strong>Σύνοψη.</strong> Με <InlineMath>{'\\lambda_1 = 3, \\lambda_2 = 1'}</InlineMath>:
        </p>
        <BlockMath>{'T_n = 3\\cdot 2^n + n\\cdot 2^n = (n+3)\\,2^n = \\Theta(n\\,2^n).'}</BlockMath>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «πολλαπλότητα m ⇒ πολλαπλασίαζε με n^k».</strong>{' '}
          Όταν μια ρίζα <InlineMath>{'r'}</InlineMath> έχει πολλαπλότητα{' '}
          <InlineMath>{'m'}</InlineMath>, η συνεισφορά της στη γενική λύση είναι{' '}
          <InlineMath>{'\\lambda_0 r^n + \\lambda_1 n r^n + \\cdots + \\lambda_{m-1} n^{m-1} r^n'}</InlineMath>.
          Το γενικό κόλπο για χαμένα γραμμικά συστήματα. (Συνηθισμένη εξεταστική
          παγίδα: φοιτητής γράφει «<InlineMath>{'\\lambda_1 r^n + \\lambda_2 r^n'}</InlineMath>»{' '}
          και τα δύο λ συγχωνεύονται σε ένα — οι δύο αρχικές συνθήκες δίνουν
          αντιφατικό σύστημα.)
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask7',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 7 — Σύγκριση τριών αλγορίθμων D&C',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 7',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Μια ομάδα προγραμματιστών εργάζεται για την επίλυση ενός υπολογιστικού
          προβλήματος <InlineMath>{'P'}</InlineMath> και έχει δημιουργήσει 3
          διαφορετικούς αλγορίθμους «διαίρει και βασίλευε»:
        </p>
        <ul>
          <li>
            Τον αλγόριθμο <InlineMath>{'A_1'}</InlineMath> που διασπά το αρχικό
            πρόβλημα μεγέθους <InlineMath>{'n'}</InlineMath> σε{' '}
            <strong>4</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/4'}</InlineMath>, τα επιλύει και στη συνέχεια
            συνθέτει τις λύσεις τους σε χρόνο{' '}
            <InlineMath>{'12n'}</InlineMath>.
          </li>
          <li>
            Τον αλγόριθμο <InlineMath>{'A_2'}</InlineMath> που διασπά το αρχικό
            πρόβλημα μεγέθους <InlineMath>{'n'}</InlineMath> σε{' '}
            <strong>3</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/9'}</InlineMath>, τα επιλύει και στη συνέχεια
            συνθέτει τις λύσεις τους σε χρόνο{' '}
            <InlineMath>{'n^{7/6}'}</InlineMath>.
          </li>
          <li>
            Τον αλγόριθμο <InlineMath>{'A_4'}</InlineMath> που διασπά το αρχικό
            πρόβλημα μεγέθους <InlineMath>{'n'}</InlineMath> σε{' '}
            <strong>27</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/9'}</InlineMath>, τα επιλύει και στη συνέχεια
            συνθέτει τις λύσεις τους σε χρόνο{' '}
            <InlineMath>{'n^{11/12}'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>(Α)</strong> Γράψε τις αναδρομικές εξισώσεις που δίνουν τον
          χρόνο εκτέλεσης των <InlineMath>{'A_1, A_2, A_4'}</InlineMath> και
          λύσε τες με το Θεώρημα της Κυριαρχίας (Master Theorem).
        </p>
        <p>
          <strong>(Β)</strong> Ποιος είναι ο ασυμπτωτικά αποδοτικότερος
          αλγόριθμος για το πρόβλημα <InlineMath>{'P'}</InlineMath>; Δικαιολόγησε
          την απάντηση.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Κάθε αλγόριθμος δίνει αναδρομή{' '}
          <InlineMath>{'T(n) = a\\,T(n/b) + f(n)'}</InlineMath>. Εφαρμόζουμε
          Master Theorem σε καθέναν και βλέπουμε ποια περίπτωση «παίζει»:
        </p>
        <p>
          <strong>(Α) Αλγόριθμος <InlineMath>{'A_1'}</InlineMath>:</strong>{' '}
          <InlineMath>{'4T(n/4) + 12n'}</InlineMath>.{' '}
          <InlineMath>{'\\log_4 4 = 1'}</InlineMath>, και{' '}
          <InlineMath>{'f = \\Theta(n)'}</InlineMath> ταιριάζει — Περίπτωση 2 →{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="front-set-3-ask7-A1" />
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_2'}</InlineMath>:</strong>{' '}
          <InlineMath>{'3T(n/9) + n^{7/6}'}</InlineMath>.{' '}
          <InlineMath>{'\\log_9 3 = 1/2'}</InlineMath>. Το{' '}
          <InlineMath>{'f = n^{7/6}'}</InlineMath> είναι πολυωνυμικά μεγαλύτερο
          από <InlineMath>{'n^{1/2}'}</InlineMath> (διαφορά εκθέτη{' '}
          <InlineMath>{'2/3'}</InlineMath>) — <strong>Περίπτωση 3</strong> →{' '}
          <InlineMath>{'\\Theta(n^{7/6})'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="front-set-3-ask7-A2" />
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_4'}</InlineMath>:</strong>{' '}
          <InlineMath>{'27T(n/9) + n^{11/12}'}</InlineMath>.{' '}
          <InlineMath>{'\\log_9 27 = 3/2'}</InlineMath>. Το{' '}
          <InlineMath>{'f = n^{11/12}'}</InlineMath> είναι πολυωνυμικά μικρότερο
          από <InlineMath>{'n^{3/2}'}</InlineMath> (διαφορά{' '}
          <InlineMath>{'7/12'}</InlineMath>) — <strong>Περίπτωση 1</strong>,
          φύλλα κυριαρχούν →{' '}
          <InlineMath>{'\\Theta(n^{3/2})'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="front-set-3-ask7-A4" />
        <p>
          <strong>(Β) Σύγκριση.</strong>{' '}
          <InlineMath>{'n\\log n \\prec n^{7/6} \\prec n^{3/2}'}</InlineMath>{' '}
          (η <InlineMath>{'\\log n'}</InlineMath> χάνει από κάθε θετική δύναμη
          του <InlineMath>{'n'}</InlineMath> — L'Hôpital στο όριο{' '}
          <InlineMath>{'\\log n / n^{1/6} \\to 0'}</InlineMath>). Νικητής: ο{' '}
          <InlineMath>{'A_1'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «τρεις αλγόριθμοι, τρεις περιπτώσεις».</strong>{' '}
          Όταν συγκρίνεις πολλούς D&amp;C, μην προσπαθήσεις να μαντέψεις
          εμπειρικά — εφάρμοσε Master Theorem σε καθένα και διάταξε τις τελικές
          πολυπλοκότητες. Συχνή παγίδα: <InlineMath>{'n\\log n'}</InlineMath>{' '}
          νικάει κάθε <InlineMath>{'n^{1+\\varepsilon}'}</InlineMath>, παρότι
          εμφανίζεται «πιο τρομακτικό» λόγω log.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask8',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 8 — Απόδειξη T(n) = n log n με επαγωγή',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 8',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δείξε με τη βοήθεια της μαθηματικής επαγωγής ότι, όταν το{' '}
          <InlineMath>{'n'}</InlineMath> είναι ακριβής δύναμη του{' '}
          <InlineMath>{'2'}</InlineMath>, η λύση της αναδρομής
        </p>
        <BlockMath>{'T(n) = \\begin{cases} 2, & n = 2 \\\\ 2\\,T(n/2) + n, & n = 2^k,\\ k > 1 \\end{cases}'}</BlockMath>
        <p>
          είναι <InlineMath>{'T(n) = n\\log n'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Επειδή <InlineMath>{'n = 2^k'}</InlineMath>, κάνουμε{' '}
          <strong>επαγωγή στο <InlineMath>{'k'}</InlineMath></strong>: στόχος
          είναι <InlineMath>{'T(2^k) = k \\cdot 2^k'}</InlineMath> (το ίδιο με{' '}
          <InlineMath>{'n\\log n'}</InlineMath>). Δες γραμμή προς γραμμή τι
          κάνει κάθε βήμα — η αναγνώριση των τριών moves («ορισμός», «εφαρμογή
          IH», «log a + log b = log ab») είναι το ζητούμενο:
        </p>
        <InductionStepper preset="front-set-3-ask8" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης — επαγωγή σε αναδρομές πάντα ίδια συνταγή.</strong>{' '}
          (1) Βάση: επαλήθευσε στο μικρότερο n. (2) ΙΗ: «έστω ότι ισχύει για k».
          (3) Επαγωγικό βήμα: ξεκίνα από τον ορισμό της αναδρομής για k+1,
          εφάρμοσε την ΙΗ στις αναδρομικές κλήσεις (που είναι ≤ k), και χρησιμοποίησε
          αλγεβρικές ταυτότητες (log a+log b=log ab, n−1+1=n, …) για να καταλήξεις
          στον τύπο που υπόσχεσαι.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask9',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 9 — Master Theorem με λογαριθμικό όρο',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 9',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική εξίσωση{' '}
        <InlineMath>{'T(n) = 2\\,T(n/2) + n\\log n'}</InlineMath> με το Θεώρημα
        της Κυριαρχίας (Master Theorem).
      </p>
    ),
    solution: (
      <>
        <p>
          Πρώτη ένδειξη παγίδας: <InlineMath>{'f(n) = n\\log n'}</InlineMath>{' '}
          είναι μεγαλύτερο από <InlineMath>{'n^{\\log_2 2} = n'}</InlineMath>, αλλά{' '}
          <em>όχι πολυωνυμικά μεγαλύτερο</em> — η διαφορά είναι μόνο ένα log.
          Καμία από τις τρεις κλασικές περιπτώσεις δεν εφαρμόζεται. Δες γιατί:
        </p>
        <MasterTheoremExtended preset="front-set-3-ask9" />
        <p>
          <strong>Σύνοψη.</strong> Επεκτεταμένη περίπτωση: αν{' '}
          <InlineMath>{'f(n) = \\Theta(n^{\\log_b a}\\log^k n)'}</InlineMath>{' '}
          τότε <InlineMath>{'T(n) = \\Theta(n^{\\log_b a}\\log^{k+1} n)'}</InlineMath>{' '}
          — μία log δύναμη παραπάνω. Εδώ k=1, άρα:
        </p>
        <BlockMath>{'T(n) = \\Theta(n\\log^2 n).'}</BlockMath>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «log χωρίς πολυωνυμική απόσταση = +1 log».</strong>{' '}
          Όταν η f έχει την «καρδιά» του κατωφλιού{' '}
          <InlineMath>{'n^{\\log_b a}'}</InlineMath> και επιπλέον{' '}
          <InlineMath>{'\\log^k n'}</InlineMath> για κάποιο{' '}
          <InlineMath>{'k \\ge 0'}</InlineMath>, η απάντηση είναι το ίδιο
          κατώφλι επί <InlineMath>{'\\log^{k+1} n'}</InlineMath> — μία log
          δύναμη παραπάνω. Συμβουλή: γράψε πάντα το <InlineMath>{'k'}</InlineMath>{' '}
          ρητά, για να μη μετρήσεις λάθος.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask10',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 10 — Αναδρομή T(n) = T(√n) + 1',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 10',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική εξίσωση{' '}
        <InlineMath>{'T(n) = T(\\sqrt{n}) + 1'}</InlineMath> με αρχική συνθήκη{' '}
        <InlineMath>{'T(1) = O(1)'}</InlineMath>, και δώσε την ασυμπτωτική τάξη
        της <InlineMath>{'T(n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Το πρόβλημα δεν <em>διαιρείται</em> — μικραίνει με{' '}
          <strong>τετραγωνική ρίζα</strong>. Master Theorem δεν εφαρμόζεται
          κατευθείαν, χρειάζεται αλλαγή μεταβλητής. Δες τη συνταγή:
        </p>
        <RecurrenceSubstitution preset="front-set-3-ask10" />
        <p>
          <strong>Σύνοψη.</strong> Θέτω <InlineMath>{'n = 2^m'}</InlineMath>· η{' '}
          <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath>, ορίζω{' '}
          <InlineMath>{'S(m) = T(2^m)'}</InlineMath> και η αναδρομή γίνεται{' '}
          <InlineMath>{'S(m) = S(m/2) + 1'}</InlineMath>. Master Theorem
          (περίπτωση 2): <InlineMath>{'S(m) = \\Theta(\\log m)'}</InlineMath>.
          Επιστροφή <InlineMath>{'m = \\log n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\Theta(\\log\\log n).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — η «n = 2ᵐ» αντικατάσταση.</strong> Όποτε
          εμφανίζεται <InlineMath>{'\\sqrt{n}'}</InlineMath> ή{' '}
          <InlineMath>{'\\sqrt[k]{n}'}</InlineMath> στο όρισμα της αναδρομής,
          αυτή είναι η μόνη ασφαλής συνταγή. Το διπλό log στην απάντηση είναι
          το χαρακτηριστικό «αποτύπωμα» — όπως ακριβώς και στο pt1-th1-q4.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask1',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 1 — Αναδρομή T(n) = √n·T(√n) + n',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Βρες την ασυμπτωτική τάξη της <InlineMath>{'T(n)'}</InlineMath> όταν{' '}
        <InlineMath>{'T(n) = \\sqrt{n}\\;T(\\sqrt{n}) + n'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Δύο δυσκολίες ταυτόχρονα: ρίζα στο όρισμα <em>και</em> συντελεστής{' '}
          <InlineMath>{'\\sqrt{n}'}</InlineMath> μπροστά. Το κλειδί είναι ένα
          έξυπνο κόλπο: <strong>διαιρούμε και τις δύο πλευρές με n</strong> —
          ο συντελεστής εξαφανίζεται και αποκαλύπτεται μια ήδη γνωστή
          αναδρομή. Δες τα 5 στάδια:
        </p>
        <DivideByNTrick />
        <p>
          <strong>Σύνοψη.</strong> Με <InlineMath>{'S(n) = T(n)/n'}</InlineMath>{' '}
          η σχέση γίνεται <InlineMath>{'S(n) = S(\\sqrt{n}) + 1'}</InlineMath>{' '}
          (που λύνεται όπως το pt1-th1-q4 με{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>), δίνοντας{' '}
          <InlineMath>{'S(n) = \\Theta(\\log\\log n)'}</InlineMath>. Πολλαπλασιάζουμε
          με <InlineMath>{'n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = n \\cdot S(n) = \\Theta(n\\log\\log n).'}</BlockMath>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «διαίρεσε με n για να ξεθαμπώσεις τη μορφή».</strong>{' '}
          Όποτε η αναδρομή έχει συντελεστή <InlineMath>{'\\sqrt{n}'}</InlineMath>{' '}
          ή <InlineMath>{'n^c'}</InlineMath> μπροστά από{' '}
          <InlineMath>{'T(\\cdot)'}</InlineMath>, διαίρεσε και τις δύο πλευρές με{' '}
          το <InlineMath>{'f(n)'}</InlineMath> (συνήθως n) και όρισε{' '}
          <InlineMath>{'S(n) = T(n)/f(n)'}</InlineMath>. Συχνά αυτό απλοποιεί
          την αναδρομή σε γνωστή. Είναι το ίδιο κόλπο που χρησιμοποιείται και
          στην απόδειξη #1 της mergesort στο L03.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask2',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 2 — Ακριβής λύση με τη μέθοδο αντικατάστασης',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Βρες την <strong>ακριβή λύση</strong> της αναδρομής με τη μέθοδο της
          αντικατάστασης:
        </p>
        <BlockMath>{'T(n) = \\begin{cases} 1, & n = 1 \\\\ 2\\,T(n/2) + n, & n > 1 \\end{cases}'}</BlockMath>
      </>
    ),
    solution: (
      <>
        <p>
          Η <strong>μέθοδος αντικατάστασης</strong> δουλεύει σε δύο φάσεις:{' '}
          (1) <em>μαντεύεις</em> τη μορφή της λύσης, (2) την{' '}
          <em>αποδεικνύεις με επαγωγή</em>. Εδώ η εικασία{' '}
          <InlineMath>{'T(n) = n\\log n + n'}</InlineMath> προκύπτει από το ότι
          η <InlineMath>{'2T(n/2)+n'}</InlineMath> είναι η αναδρομή της
          mergesort — Θ(n log n) — αλλά θέλουμε ακριβή σταθερά. Δες κάθε γραμμή
          του επαγωγικού βήματος:
        </p>
        <InductionStepper preset="front-set-4-ask2" />
        <p>
          <strong>Πετυχημένο.</strong>{' '}
          <InlineMath>{'T(n) = n\\log n + n = \\Theta(n\\log n)'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «εικασία + απόδειξη με επαγωγή».</strong>{' '}
          Όταν το Master Theorem δεν είναι αρκετό (π.χ. χρειάζεσαι ακριβή
          σταθερά), η μέθοδος αντικατάστασης σε καλύπτει:
          <ul>
            <li>Μάντεψε την εικασία από οπτική αναγνώριση (mergesort = Θ(n log n)).</li>
            <li>Επαλήθευσε στη βάση.</li>
            <li>Στο επαγωγικό βήμα: αντικατάστησε την ΙΗ στις αναδρομικές κλήσεις και απλοποίησε με τις ταυτότητες του log.</li>
          </ul>
          Αν η επαγωγή σπάει με ένα «επιπλέον» όρο, ίσως χρειάζεσαι ενίσχυση
          της εικασίας — δες front-set-4-ask3.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask3',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 3 — Άνω φράγμα και το «κόλπο» της ενίσχυσης',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Βρες ένα άνω φράγμα (<InlineMath>{'O'}</InlineMath>) για την αναδρομή{' '}
        <InlineMath>{'T(n) = 8\\,T(n/2) + \\Theta(n^2)'}</InlineMath> με τη
        μέθοδο της αντικατάστασης.
      </p>
    ),
    solution: (
      <>
        <p>
          Με <InlineMath>{'a = 8,\\ b = 2'}</InlineMath> ξέρουμε ότι το{' '}
          <InlineMath>{'n^{\\log_2 8} = n^3'}</InlineMath> κυριαρχεί — Master
          Theorem περίπτωση 1 θα έδινε <InlineMath>{'\\Theta(n^3)'}</InlineMath>{' '}
          αν το <InlineMath>{'cn^2'}</InlineMath> ήταν πολυωνυμικά μικρότερο
          (που είναι). Αλλά αν θέλουμε να το <em>αποδείξουμε</em> με τη μέθοδο
          αντικατάστασης, πέφτουμε σε μια κλασική παγίδα: η «προφανής» εικασία{' '}
          <InlineMath>{'T \\le dn^3'}</InlineMath> δεν κλείνει την επαγωγή.
        </p>
        <StrengthenedGuess />
        <p>
          <strong>Σύνοψη.</strong> Η «πιο σφιχτή» εικασία{' '}
          <InlineMath>{"T(n) \\le dn^3 - d'n^2"}</InlineMath> κλείνει την επαγωγή
          για κάθε <InlineMath>{"d' \\ge c"}</InlineMath>. Άρα{' '}
          <InlineMath>{'T(n) = O(n^3)'}</InlineMath>.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «αν σπάει η επαγωγή, ΕΝΙΣΧΥΣΕ την εικασία».</strong>{' '}
          Είναι αντι-διαισθητικό αλλά συμβαίνει συνεχώς: μια σφιχτότερη υπόθεση{' '}
          αφήνει στην επαγωγή έναν επιπλέον αρνητικό όρο που μπορεί να
          απορροφήσει τον «παράδικο» θετικό όρο της σχέσης. Συνταγή: αν η
          εικασία <InlineMath>{'cn^k'}</InlineMath> αφήνει υπόλειμμα τάξης{' '}
          <InlineMath>{'n^{k-1}'}</InlineMath>, δοκίμασε{' '}
          <InlineMath>{"cn^k - c'n^{k-1}"}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask4',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 4 — Άνω φράγμα για άνιση αναδρομή',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Βρες ένα άνω φράγμα για την αναδρομή{' '}
        <InlineMath>{'T(n) = T(n/2) + T(n/4) + T(n/8) + n'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Master Theorem δεν εφαρμόζεται — τα υποπροβλήματα έχουν{' '}
          <em>διαφορετικό μέγεθος</em>. Η σωτηρία είναι μια απλή παρατήρηση:{' '}
          <InlineMath>{'1/2 + 1/4 + 1/8 = 7/8 < 1'}</InlineMath>. Κάθε επίπεδο
          συνολικά είναι μόνο 7/8 του προηγουμένου — γεωμετρική σειρά που
          συγκλίνει. Δες το ζωντανά και σύγκρινε με τις «οριακές» περιπτώσεις:
        </p>
        <UnequalSplitGeometric />
        <p>
          <strong>Επιβεβαίωση με αντικατάσταση.</strong> Εικασία{' '}
          <InlineMath>{'T(n) \\le cn'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) \\le \\tfrac{cn}{2} + \\tfrac{cn}{4} + \\tfrac{cn}{8} + n = \\tfrac{7cn}{8} + n.'}</BlockMath>
        <p>
          Θέλουμε <InlineMath>{'\\tfrac{7c}{8} + 1 \\le c'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'c \\ge 8'}</InlineMath>. Διαλέγουμε{' '}
          <InlineMath>{'c = 8'}</InlineMath>, η επαγωγή κλείνει →{' '}
          <InlineMath>{'T(n) = O(n)'}</InlineMath>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — άθροισμα κλασμάτων &lt;/=/&gt; 1.</strong>{' '}
          Για αναδρομές <InlineMath>{'\\sum T(c_i n) + n^d'}</InlineMath> με{' '}
          γραμμικό f, το κρίσιμο νούμερο είναι <InlineMath>{'r = \\sum c_i'}</InlineMath>:
          <ul>
            <li>r &lt; 1: γεωμετρικά φθίνουσα → η ρίζα κυριαρχεί → Θ(n).</li>
            <li>r = 1: όλα τα επίπεδα ίσα → +log n παράγοντας → Θ(n log n).</li>
            <li>r &gt; 1: τα φύλλα κυριαρχούν → Θ(n^{`{log_? r}`}).</li>
          </ul>
          Για άνισες αναδρομές, αυτό είναι ο πρώτος έλεγχος που πρέπει να
          κάνεις.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask5',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 5 — Ύποπτη κάρτα (πλειοψηφικό στοιχείο) με D&C',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 5',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Υποθέστε ότι είστε σύμβουλοι σε μία τράπεζα που την ενδιαφέρει ο
          εντοπισμός οικονομικών εγκλημάτων. Έχουν μία συλλογή από{' '}
          <InlineMath>{'n'}</InlineMath> τραπεζικές κάρτες που έχουν κατάσχει,
          επειδή υποπτεύονται ότι χρησιμοποιούνται σε απάτες. Κάθε κάρτα
          αντιστοιχεί σε ένα μοναδικό τραπεζικό λογαριασμό, ένας λογαριασμός
          μπορεί να έχει πολλές κάρτες, και δύο κάρτες λέγονται{' '}
          <strong>ισοδύναμες</strong> αν αντιστοιχούν στον ίδιο λογαριασμό.
        </p>
        <p>
          Ο λογαριασμός δεν διαβάζεται άμεσα από την κάρτα, όμως η τράπεζα
          διαθέτει μία «συσκευή ελέγχου ισοδυναμίας» που δέχεται δύο κάρτες και
          σε χρόνο <InlineMath>{'O(1)'}</InlineMath> επιστρέφει{' '}
          <strong>TRUE</strong> αν είναι ισοδύναμες, αλλιώς{' '}
          <strong>FALSE</strong>. Είναι η μόνη επιτρεπτή λειτουργία.
        </p>
        <p>
          <strong>Ερώτημα:</strong> σε ένα σύνολο{' '}
          <InlineMath>{'S'}</InlineMath> από <InlineMath>{'n'}</InlineMath>{' '}
          κάρτες, υπάρχει ένα σύνολο με <em>περισσότερες από{' '}
          <InlineMath>{'n/2'}</InlineMath></em> κάρτες ισοδύναμες μεταξύ τους
          (άρα ύποπτες); Ο απλοϊκός αλγόριθμος που συγκρίνει κάθε κάρτα με όλες
          τις υπόλοιπες κοστίζει <InlineMath>{'O(n^2)'}</InlineMath> και δεν
          γίνεται δεκτός. Σχεδιάστε σε φυσική γλώσσα έναν{' '}
          <strong>πιο αποδοτικό αλγόριθμο «διαίρει και βασίλευε»</strong> που
          επιστρέφει μία ύποπτη κάρτα αν υπάρχει τέτοιο σύνολο, ή{' '}
          <strong>NIL</strong> αλλιώς.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πίσω από την «τραπεζική» γλώσσα, το πρόβλημα είναι το κλασικό{' '}
          <strong>πλειοψηφικό στοιχείο</strong>: υπάρχει λογαριασμός που μοιράζονται
          πάνω από τις μισές κάρτες; Η μόνη «πρόσβαση» είναι η συσκευή ισοδυναμίας
          — δεν διαβάζουμε αριθμό, δεν συγκρίνουμε «πιο μικρό / πιο μεγάλο»,
          μόνο «ίδιο ή όχι». Αυτό κλείνει την πόρτα στην ταξινόμηση και στο
          hashing· μένει διαίρει και βασίλευε.
        </p>
        <p>
          <strong>Το λήμμα που ξεκλειδώνει το πρόβλημα.</strong> Αν υπάρχει
          λογαριασμός με πάνω από <InlineMath>{'n/2'}</InlineMath> κάρτες, τότε
          αν κόψουμε το σύνολο σε δύο μισά αυτός ο λογαριασμός είναι ύποπτος σε{' '}
          <em>τουλάχιστον ένα</em> από τα δύο μισά. Διαφορετικά θα είχε{' '}
          <InlineMath>{'\\le n/4'}</InlineMath> κάρτες σε καθένα → σύνολο{' '}
          <InlineMath>{'\\le n/2'}</InlineMath> — αντίφαση (αρχή περιστερώνα).
          Άρα οι υποψήφιοι του γονέα είναι το πολύ <strong>δύο</strong> — ένας
          από κάθε μισό.
        </p>
        <p>
          <strong>Ο αλγόριθμος <InlineMath>{'\\text{DC\\_CHECK}(T, n)'}</InlineMath>.</strong>
        </p>
        <ul>
          <li>
            <strong>Βάση.</strong> <InlineMath>{'n = 1'}</InlineMath>: η μοναδική
            κάρτα είναι υποψήφια. <InlineMath>{'n = 2'}</InlineMath>: ένα ερώτημα
            στη συσκευή — αν ταιριάζουν επίστρεψέ τη μία, αλλιώς NIL.
          </li>
          <li>
            <strong>Διαίρεση & αναδρομή.</strong> Σπάσε στη μέση, πάρε τον
            υποψήφιο του αριστερού μισού.
          </li>
          <li>
            <strong>Επαλήθευση 1.</strong> Αν υπάρχει, μέτρησε σε πόσες κάρτες
            όλου του <InlineMath>{'T'}</InlineMath> είναι ισοδύναμος — μία σάρωση{' '}
            <InlineMath>{'\\Theta(n)'}</InlineMath>. Πέρασε το{' '}
            <InlineMath>{'n/2'}</InlineMath>; Επιστροφή.
          </li>
          <li>
            <strong>Επαλήθευση 2.</strong> Αν όχι, πάρε τον υποψήφιο του δεξιού
            μισού και μέτρα τον με τον ίδιο τρόπο. Αν ούτε αυτός περνά, επίστρεψε
            NIL.
          </li>
        </ul>
        <p>
          Πάτησε «Επόμενο» — θα δεις 12 κάρτες (χρωματισμένες ανά λογαριασμό) να
          σπάνε αναδρομικά, να ανεβαίνουν δύο υποψήφιοι σε κάθε επίπεδο και η
          γραμμική σάρωση να επιβεβαιώνει στο ριζικό βήμα τη μία και μοναδική
          ύποπτη κάρτα:
        </p>
        <MajorityCandidateDivide preset="front-set-4-ask5" />
        <p>
          <strong>Πολυπλοκότητα.</strong> Δύο αναδρομικές κλήσεις στα μισά συν
          μία (ή το πολύ δύο) γραμμικές επαληθεύσεις:
        </p>
        <BlockMath>{'T(n) = 2\\,T(n/2) + \\Theta(n)'}</BlockMath>
        <p>
          Με <InlineMath>{'a = 2,\\ b = 2'}</InlineMath> και{' '}
          <InlineMath>{'f(n) = \\Theta(n) = \\Theta(n^{\\log_2 2})'}</InlineMath>{' '}
          → περίπτωση 2 του Master Theorem →{' '}
          <strong><InlineMath>{'T(n) = O(n\\log n)'}</InlineMath></strong>,
          σαφώς καλύτερο από το <InlineMath>{'O(n^2)'}</InlineMath> του αφελούς.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «μία πράξη O(1), και μόνο αυτή».</strong> Όποτε
          η εκφώνηση σου επιτρέπει μόνο μία «οντοτική» πράξη (συσκευή,
          βασικός τελεστής, query) σε σταθερό χρόνο, ξέχνα ταξινόμηση και hashing.
          Σκέψου αν μπορείς να σπάσεις το πρόβλημα στη μέση και να ζητήσεις από
          την αναδρομή έναν <em>συγκεκριμένο</em> εκπρόσωπο — μετά μία γραμμική
          επαλήθευση καθαρίζει τα ψευδώς θετικά. Είναι η ίδια λογική με το
          «κυρίαρχο χρώμα» της διάλεξης, σε <InlineMath>{'O(n\\log n)'}</InlineMath>{' '}
          αντί για <InlineMath>{'O(n^2\\log n)'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask6',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 6 — Ταξινόμηση 3 χρωμάτων (σημαία της Ολλανδίας)',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 6',
    difficulty: 'medium',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Δίνονται ένα ρομπότ και ένα καλάθι με χρωματιστές σφαίρες. Κάθε σφαίρα
          έχει ένα από τα χρώματα: κόκκινο{' '}
          <InlineMath>{'(0)'}</InlineMath>, μπλε{' '}
          <InlineMath>{'(1)'}</InlineMath>, πράσινο{' '}
          <InlineMath>{'(2)'}</InlineMath>. Θέλουμε το ρομπότ να τις ταξινομήσει
          χρωματικά, βάζοντας πρώτα τις κόκκινες, μετά τις μπλε και τέλος τις
          πράσινες.
        </p>
        <p>
          (α) Σχεδιάστε <strong>γραμμικό, επιτόπιο</strong> αλγόριθμο για το
          πρόβλημα. (β) Εξηγήστε πώς μια λύση αυτού του προβλήματος μπορεί να
          χρησιμοποιηθεί στον αλγόριθμο <strong>quicksort</strong>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το πρόβλημα λέγεται <em>«σημαία της Ολλανδίας»</em> (Dijkstra). Όλη η
          ιδέα: αφού οι τιμές είναι <strong>μόνο τρεις</strong>, μια πλήρης
          ταξινόμηση <InlineMath>{'O(n\\log n)'}</InlineMath> είναι σπατάλη —
          φτάνει ένας έξυπνος «εργοδηγός» που να σπρώχνει τις σφαίρες σε τρεις
          ζώνες καθώς περπατάει τον πίνακα μία φορά.
        </p>
        <p>
          <strong>(α) Τρεις δείκτες, τρεις αναλλοίωτες.</strong> Σκέψου τον
          πίνακα διαχωρισμένο σε τέσσερις ζώνες, με τρεις δείκτες ως σύνορα:
        </p>
        <ul>
          <li>
            <InlineMath>{'A[0..\\text{low}-1]'}</InlineMath> — ήδη όλα{' '}
            <InlineMath>{'0'}</InlineMath> (κόκκινες, οριστικές).
          </li>
          <li>
            <InlineMath>{'A[\\text{low}..\\text{mid}-1]'}</InlineMath> — ήδη όλα{' '}
            <InlineMath>{'1'}</InlineMath> (μπλε).
          </li>
          <li>
            <InlineMath>{'A[\\text{mid}..\\text{high}]'}</InlineMath> — η ζώνη
            «αγνώστων» που δεν έχει εξεταστεί ακόμη.
          </li>
          <li>
            <InlineMath>{'A[\\text{high}+1..n-1]'}</InlineMath> — ήδη όλα{' '}
            <InlineMath>{'2'}</InlineMath> (πράσινες, οριστικές).
          </li>
        </ul>
        <p>
          Η ζώνη των αγνώστων μικραίνει κατά μία θέση σε κάθε βήμα. Διαβάζουμε{' '}
          <InlineMath>{'A[\\text{mid}]'}</InlineMath>:
        </p>
        <ul>
          <li>
            <strong>0</strong> → αντάλλαξε με <InlineMath>{'A[\\text{low}]'}</InlineMath>,
            αύξησε <InlineMath>{'\\text{low}'}</InlineMath> και{' '}
            <InlineMath>{'\\text{mid}'}</InlineMath>.
          </li>
          <li>
            <strong>1</strong> → άφησέ το, αύξησε μόνο{' '}
            <InlineMath>{'\\text{mid}'}</InlineMath>.
          </li>
          <li>
            <strong>2</strong> → αντάλλαξε με{' '}
            <InlineMath>{'A[\\text{high}]'}</InlineMath>, <em>μείωσε</em>{' '}
            <InlineMath>{'\\text{high}'}</InlineMath>. Το{' '}
            <InlineMath>{'\\text{mid}'}</InlineMath> ΔΕΝ προχωρά — το στοιχείο
            που μόλις ήρθε από δεξιά δεν το έχουμε δει ακόμη.
          </li>
        </ul>
        <p>
          Πάτησε <strong>Επόμενο</strong> και δες τους τρεις δείκτες να
          δουλεύουν σε στιγμιότυπο 12 σφαιρών. Πρόσεξε τη στιγμή που εμφανίζεται
          το «2»: ο <span className="font-mono">mid</span> ΔΕΝ προχωρά —
          ένας ολόκληρος γύρος μπορεί να αποτύχει την πρώτη φορά:
        </p>
        <DutchFlagPartition />
        <p>
          Σταματάμε όταν <InlineMath>{'\\text{mid} > \\text{high}'}</InlineMath>{' '}
          — η ζώνη των αγνώστων άδειασε. Κάθε στοιχείο μπαίνει στη ζώνη του
          ακριβώς μία φορά → <strong><InlineMath>{'O(n)'}</InlineMath></strong>,
          μηδέν βοηθητική μνήμη.
        </p>
        <p>
          <strong>(β) Σχέση με την quicksort.</strong> Η κλασική quicksort
          σπάει τον πίνακα σε <strong>2</strong> μέρη: μικρότερα και μεγαλύτερα
          του pivot. Όταν η είσοδος έχει πολλά διπλότυπα (π.χ. πολλές κάρτες με
          την ίδια τιμή ίση με το pivot), αυτές σκορπίζονται και ξανα-ταξινομούνται
          άσκοπα. Με το trick της σημαίας κάνουμε <strong>3-way partition</strong>:
          <InlineMath>{'< p'}</InlineMath>, <InlineMath>{'= p'}</InlineMath>,{' '}
          <InlineMath>{'> p'}</InlineMath>. Το μεσαίο μέρος (όσα ισούνται με το
          pivot) είναι στη σωστή τους θέση και ΔΕΝ μπαίνει σε αναδρομή — η
          quicksort γίνεται πολύ πιο γρήγορη σε πίνακες με διπλότυπα. Δες το
          ίδιο μηχανικό αποτέλεσμα μ' ένα κλικ στην καρτέλα «3-way quicksort»
          παραπάνω.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «λίγες τιμές ⇒ partition, όχι sort».</strong>{' '}
          Όταν η εκφώνηση εγγυάται ότι οι διαφορετικές τιμές είναι σταθερό
          πλήθος (2, 3, k), σπάσε το πρόβλημα σε τόσες ζώνες με αμετάβλητα
          σύνορα και σάρωσε γραμμικά. Ο κανόνας «<em>mid δεν προχωρά μετά από
          swap με high</em>» είναι το λεπτό σημείο — γράφεις λάθος αναλλοίωτη
          αν το ξεχάσεις. Στο ίδιο μοτίβο πέφτουν: ταξινόμηση 0/1/2,
          partitioning ίσων στοιχείων στο quicksort, «τοποθέτησε όλα τα άρτια
          αριστερά» — όλα <InlineMath>{'O(n)'}</InlineMath> επιτόπια.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask7',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 7 — Ο χαμένος όρος αριθμητικής προόδου',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 7',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Δίνεται πίνακας <InlineMath>{'A[1, \\ldots, n]'}</InlineMath>. Τα
        στοιχεία του αντιστοιχούν σε όρους αριθμητικής προόδου, διατεταγμένα
        κατά αύξουσα σειρά. Ένας όρος <strong>απουσιάζει</strong>. Δώσε έναν
        αποδοτικό αλγόριθμο για την εύρεση του «χαμένου» όρου.
      </p>
    ),
    solution: (
      <>
        <p>
          Σε αριθμητική πρόοδο: <InlineMath>{'a_i = a_0 + i \\cdot d'}</InlineMath>.
          Τη διαφορά <InlineMath>{'d'}</InlineMath> τη βρίσκουμε από τα πρώτα
          στοιχεία. Επειδή λείπει ακριβώς ένας όρος, ο πίνακας «σπάει» στο κενό:
          <strong>πριν</strong> το κενό κάθε <InlineMath>{'A[i]'}</InlineMath>{' '}
          ισούται με τον αναμενόμενο <InlineMath>{'a_0 + i d'}</InlineMath>·{' '}
          <strong>μετά</strong> το κενό είναι όλα μετατοπισμένα κατά d. Η
          μονοτονία αυτή ακριβώς ξεκλειδώνει τη δυαδική αναζήτηση.
        </p>
        <p>
          <strong>Ο αλγόριθμος.</strong> Σε κάθε βήμα, σύγκρινε{' '}
          <InlineMath>{'A[\\text{mid}]'}</InlineMath> με τον αναμενόμενο{' '}
          <InlineMath>{'a_0 + \\text{mid} \\cdot d'}</InlineMath>:
        </p>
        <ul>
          <li>Ταιριάζει → το κενό είναι δεξιά· συνέχισε εκεί.</li>
          <li>Δεν ταιριάζει → το κενό είναι αριστερά (ή ακριβώς εδώ)· συνέχισε αριστερά.</li>
        </ul>
        <p>
          Δοκίμασέ το — οι σλάιντερ ρυθμίζουν n, d και θέση κενού:
        </p>
        <MissingTermBinarySearch />
        <p>
          Κάθε βήμα υποδιπλασιάζει τον πίνακα →{' '}
          <InlineMath>{'O(\\log n)'}</InlineMath>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «μετατόπιση κατά μία θέση = μονότονη συνθήκη»</strong>.
          Η εξάλειψη ενός στοιχείου από ταξινομημένο/υπολογίσιμο πίνακα δημιουργεί
          ένα <strong>σύνορο</strong> ίδιας μορφής με το{' '}
          <InlineMath>{'1^m 0^n'}</InlineMath> του pt4-th3. Αν μπορείς να ορίσεις{' '}
          «αναμενόμενη τιμή» στη θέση i και να δεις πότε αρχίζει η διαφορά,
          η δυαδική αναζήτηση παίζει — <InlineMath>{'O(\\log n)'}</InlineMath>{' '}
          αντί για <InlineMath>{'O(n)'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask8',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 8 — Διάμεσος δύο ταξινομημένων πινάκων',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 8',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <p>
        Έστω δύο πίνακες <InlineMath>{'X[1,\\ldots,n]'}</InlineMath> και{' '}
        <InlineMath>{'Y[1,\\ldots,n]'}</InlineMath>, με καθέναν να έχει{' '}
        <InlineMath>{'n'}</InlineMath> ταξινομημένους αριθμούς. Δώσε αλγόριθμο
        «διαίρει και βασίλευε» με χρόνο{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath> για την εύρεση της{' '}
        <strong>διάμεσης τιμής</strong> των δύο πινάκων μαζί.
      </p>
    ),
    solution: (
      <>
        <p>
          Το «εύκολο» θα ήταν να συγχωνεύσουμε σε έναν πίνακα{' '}
          <InlineMath>{'2n'}</InlineMath> στοιχείων και να διαβάσουμε τη μεσαία
          τιμή — αλλά αυτό είναι <InlineMath>{'O(n)'}</InlineMath>, και μας
          ζητείται <InlineMath>{'O(\\log n)'}</InlineMath>. Άρα δεν επιτρέπεται
          να αγγίξουμε όλα τα στοιχεία· πρέπει σε κάθε βήμα να{' '}
          <strong>πετάμε</strong> μισά στοιχεία με σιγουριά.
        </p>
        <p>
          <strong>Η ιδέα.</strong> Σύγκρινε τις διαμέσους των δύο πινάκων.
          Έστω <InlineMath>{'m_X'}</InlineMath> η διάμεσος του{' '}
          <InlineMath>{'X'}</InlineMath> και <InlineMath>{'m_Y'}</InlineMath>{' '}
          του <InlineMath>{'Y'}</InlineMath>. Αν{' '}
          <InlineMath>{'m_X < m_Y'}</InlineMath>:
        </p>
        <ul>
          <li>
            Όλα τα στοιχεία αριστερά της <InlineMath>{'m_X'}</InlineMath> είναι
            «πολύ μικρά» για να είναι η <strong>συνολική</strong> διάμεσος.
          </li>
          <li>
            Όλα τα στοιχεία δεξιά της <InlineMath>{'m_Y'}</InlineMath> είναι «πολύ
            μεγάλα» για να είναι η συνολική διάμεσος.
          </li>
        </ul>
        <p>
          Πετάμε <em>ίσα</em> πλήθη και από τις δύο πλευρές, οπότε η συνολική
          διάμεσος δεν αλλάζει θέση. Επαναλαμβάνουμε ώσπου να μείνουν δύο τιμές
          σε κάθε πίνακα — εκεί η διάμεσος είναι ο μέσος όρος των δύο μεσαίων.
        </p>
        <p>
          Δες το πάνω στο παράδειγμα της εκφώνησης:{' '}
          <InlineMath>{'X = [1,2,3,4,5,27,28,29,30]'}</InlineMath>,{' '}
          <InlineMath>{'Y = [-5,-4,-3,-2,-1,17,18,19,20]'}</InlineMath>. Σε
          λίγα βήματα οι ενεργές ζώνες συρρικνώνονται μέχρι την απάντηση{' '}
          <InlineMath>{'4{,}5'}</InlineMath>:
        </p>
        <MedianOfTwoSorted />
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε βήμα διπλασιάζει την «απόσταση»
          από την απάντηση με σταθερή δουλειά:
        </p>
        <BlockMath>{'T(n) = T(n/2) + O(1)'}</BlockMath>
        <p>
          Με <InlineMath>{'a = 1,\\ b = 2'}</InlineMath>:{' '}
          <InlineMath>{'n^{\\log_b a} = n^{\\log_2 1} = n^0 = 1'}</InlineMath>{' '}
          και <InlineMath>{'f(n) = O(1) = \\Theta(1)'}</InlineMath> → περίπτωση 2
          → <strong><InlineMath>{'T(n) = O(\\log n)'}</InlineMath></strong>.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «δυαδική αναζήτηση σε δύο μέτωπα».</strong>{' '}
          Όταν μια ποσότητα ορίζεται από <em>δύο</em> ταξινομημένες
          ακολουθίες (διάμεσος, k-οστό μικρότερο, παρτίσιον για merge), σκέψου
          αν μπορείς να συγκρίνεις τις διαμέσους τους και να πετάξεις ίσα
          πλήθη από κάθε πλευρά. Η συνταγή: «μην πετάξεις άνισα — η διάμεσος
          κρύβεται και στις δύο πλευρές». Κλασική παγίδα: όταν οι δύο πίνακες
          έχουν διαφορετικό μέγεθος, πρέπει να πετάς ίδιο αριθμό στοιχείων (όχι
          ίδιο ποσοστό), αλλιώς χάνεις την αναλλοίωτη.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask9',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 9 — Τομές ευθύγραμμων τμημάτων = αντιστροφές',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 9',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Έχουμε 2 σύνολα <InlineMath>{'n'}</InlineMath> σημείων: ένα σύνολο{' '}
          <InlineMath>{'\\{p_1, \\ldots, p_n\\}'}</InlineMath> στη γραμμή{' '}
          <InlineMath>{'y = 0'}</InlineMath> και ένα άλλο{' '}
          <InlineMath>{'\\{q_1, \\ldots, q_n\\}'}</InlineMath> στη γραμμή{' '}
          <InlineMath>{'y = 1'}</InlineMath>. Δημιουργούνται{' '}
          <InlineMath>{'n'}</InlineMath> ευθύγραμμα τμήματα, καθένα ενώνοντας το{' '}
          <InlineMath>{'p_i'}</InlineMath> με το{' '}
          <InlineMath>{'q_i'}</InlineMath>.
        </p>
        <p>
          Περίγραψε έναν αλγόριθμο «διαίρει και βασίλευε» που υπολογίζει{' '}
          <strong>πόσα ζεύγη τμημάτων τέμνονται</strong>, σε χρόνο{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath>. (Οι τιμές{' '}
          <InlineMath>{'p_i'}</InlineMath> και{' '}
          <InlineMath>{'q_i'}</InlineMath> είναι διακριτές.)
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Το πρόβλημα είναι μεταμφιεσμένο.</strong> Φαίνεται γεωμετρικό
          — αλλά κρύβει το ίδιο μέτρημα που λύσαμε στο L04. Αν διατάξουμε τα{' '}
          <InlineMath>{'n'}</InlineMath> τμήματα κατά το κάτω άκρο{' '}
          <InlineMath>{'p_i'}</InlineMath> (έτσι ώστε{' '}
          <InlineMath>{'p_1 < p_2 < \\cdots < p_n'}</InlineMath>), τότε ο
          πίνακας των πάνω άκρων <InlineMath>{'Q = (q_1, q_2, \\ldots, q_n)'}</InlineMath>{' '}
          είναι μια μετάθεση που <em>κωδικοποιεί τις τομές</em>:
        </p>
        <BlockMath>{'\\text{Τμήματα } i, j\\ \\text{(}\\,i < j\\,\\text{) τέμνονται}\\ \\iff\\ q_i > q_j.'}</BlockMath>
        <p>
          Γιατί; Αν <InlineMath>{'i < j'}</InlineMath> και{' '}
          <InlineMath>{'q_i > q_j'}</InlineMath>, τότε το τμήμα{' '}
          <InlineMath>{'i'}</InlineMath> ξεκινά αριστερά κάτω αλλά καταλήγει δεξιά
          πάνω — άρα κάποτε <em>πρέπει</em> να συναντηθεί με το τμήμα{' '}
          <InlineMath>{'j'}</InlineMath>, που πάει αντίθετα. Διαλέγει κάθε ζεύγος
          τμημάτων: τομή στο σχήμα ⇔ αντιστροφή στον <InlineMath>{'Q'}</InlineMath>:
        </p>
        <SegmentCrossingsToInversions />
        <p>
          Έτσι το ζητούμενο μετατρέπεται σε «<em>μέτρα τις αντιστροφές στον
          πίνακα <InlineMath>{'Q'}</InlineMath></em>» — ακριβώς το πρόβλημα του
          L04. Δες τα τμήματα και τον <InlineMath>{'Q'}</InlineMath>{' '}
          συγχρονισμένα στο εργαλείο παραπάνω.
        </p>
        <p>
          <strong>Ο αλγόριθμος (επέκταση της mergesort).</strong> Είναι ο{' '}
          <code>sort-and-count</code> που ορίσαμε στη διάλεξη:
        </p>
        <ul>
          <li>
            <strong>Διαίρεση:</strong> χώρισε τον <InlineMath>{'Q'}</InlineMath>{' '}
            σε αριστερό και δεξί μισό.
          </li>
          <li>
            <strong>Αναδρομή:</strong> μέτρησε τις αντιστροφές <em>μέσα</em> σε
            κάθε μισό και ταυτόχρονα ταξινόμησέ το.
          </li>
          <li>
            <strong>Συνδυασμός (merge-and-count):</strong> κατά τη συγχώνευση
            των δύο ταξινομημένων μισών, κάθε φορά που κατεβαίνει ένα στοιχείο
            του δεξιού μισού, πρόσθεσε τόσες αντιστροφές όσα μένουν στο αριστερό
            — μία γραμμική σάρωση.
          </li>
        </ul>
        <p>
          Δες το λοιπόν και επί του πραγματικού πίνακα: ο{' '}
          <InlineMath>{'Q'}</InlineMath> του παραδείγματος έχει 7 αντιστροφές,
          άρα 7 τομές. Πάτησε «Επόμενο» στον <code>InversionCounter</code> με
          τον δικό μας <InlineMath>{'Q'}</InlineMath> για να δεις τις
          merge-and-count προσθήκες:
        </p>
        <InversionCounter />
        <p>
          <strong>Πολυπλοκότητα.</strong>
        </p>
        <BlockMath>{'T(n) = 2\\,T(n/2) + O(n)'}</BlockMath>
        <p>
          Με <InlineMath>{'a = 2,\\ b = 2'}</InlineMath> και{' '}
          <InlineMath>{'f(n) = O(n) = \\Theta(n^{\\log_2 2})'}</InlineMath> →
          περίπτωση 2 →{' '}
          <strong><InlineMath>{'T(n) = O(n\\log n)'}</InlineMath></strong>.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «γεωμετρικό = αντιστροφές».</strong> Όταν
          ένα πρόβλημα ρωτάει «πόσα ζεύγη <em>α-α-α-α</em>» (τομές τμημάτων,
          αντιστροφές καρτών, ζεύγη με <InlineMath>{'A[i] > A[j]'}</InlineMath>,
          ποσοστιαία αποκλίσεις), προσπάθησε να γράψεις τη συνθήκη ως
          ανισότητα μεταξύ θέσεων και τιμών μετά από μία ταξινόμηση. Σχεδόν
          πάντα καταλήγεις σε «αντιστροφές» — και τότε ο
          <code>sort-and-count</code> δίνει <InlineMath>{'O(n\\log n)'}</InlineMath>.
          Παγίδα: η ταξινόμηση κατά το ένα άκρο είναι μέρος της λύσης, όχι
          προεργασία· χωρίς αυτή το «αντιστροφές» δεν είναι καν καλά ορισμένο.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask10',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 10 — Master Theorem με λογαριθμικό όρο',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 10',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική εξίσωση, προσδιορίζοντας την τάξη της{' '}
        (<InlineMath>{'\\Theta'}</InlineMath>), με{' '}
        <InlineMath>{'T(1) = 1'}</InlineMath>:{' '}
        <InlineMath>{'T(n) = 27\\,T(n/9) + (\\sqrt{n})^3 \\lg n'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Βήμα 1 — απλοποίησε το <InlineMath>{'f'}</InlineMath>:</strong>{' '}
          <InlineMath>{'(\\sqrt{n})^3 = n^{3/2}'}</InlineMath>, άρα{' '}
          <InlineMath>{'f(n) = n^{3/2}\\lg n'}</InlineMath>. Με{' '}
          <InlineMath>{'a = 27,\\ b = 9'}</InlineMath>:{' '}
          <InlineMath>{'\\log_9 27 = 3/2'}</InlineMath>, κατώφλι{' '}
          <InlineMath>{'n^{3/2}'}</InlineMath>. Η f είναι «ακριβώς πάνω στο
          κατώφλι» επί <InlineMath>{'\\log n'}</InlineMath> — η επεκτεταμένη
          περίπτωση. Δες τη συνταγή:
        </p>
        <MasterTheoremExtended preset="front-set-4-ask10" />
        <p>
          <strong>Αποτέλεσμα.</strong>
        </p>
        <BlockMath>{'T(n) = \\Theta(n^{3/2}\\log^2 n).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «log πάνω στο κατώφλι ⇒ +1 log».</strong>{' '}
          Όποτε δεις <InlineMath>{'f = n^{\\log_b a} \\cdot \\log^k n'}</InlineMath>,
          η απάντηση είναι το ίδιο κατώφλι επί <InlineMath>{'\\log^{k+1} n'}</InlineMath>.
          Συνηθισμένα παραδείγματα στις εξετάσεις: <InlineMath>{'k = 1'}</InlineMath>{' '}
          (συνηθέστατο), <InlineMath>{'k = 0'}</InlineMath> (αυτό είναι ακριβώς
          η Περίπτωση 2). Συμβουλή: γράψε ρητά το{' '}
          <InlineMath>{'\\log^k'}</InlineMath> ξεχωριστά από το κατώφλι για να
          μη ξεχάσεις το +1.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-e0-ask6',
    title: 'Φροντιστηριακό Σετ #4 · Επανάληψη E0 — Πολυπλοκότητα εμφωλευμένων βρόχων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση επανάληψης (E0)',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Υπολόγισε την πολυπλοκότητα χρόνου του παρακάτω αλγορίθμου:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`begin algorithm
  arg ← -1
  for i ← 1 to 2n with step 1 do
    for j ← i to i² with step 1 do
      arg ← CALC(j)
  end algorithm

procedure CALC(w)
  res ← 0
  for i ← 1 to w^0.5 with step 0.1 do
    res ← res + log(i)
  return res`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          Έχουμε <strong>τρεις εμφωλευμένους βρόχους</strong> (δύο στον κύριο
          αλγόριθμο, ένας μέσα στη <InlineMath>{'CALC'}</InlineMath>). Η συνολική
          πολυπλοκότητα είναι το <em>γινόμενο</em> των επαναλήψεων κάθε
          επιπέδου. Μετράμε ένα-ένα.
        </p>
        <p>
          <strong>1ος βρόχος</strong> (<InlineMath>{'i'}</InlineMath> από{' '}
          <InlineMath>{'1'}</InlineMath> έως <InlineMath>{'2n'}</InlineMath>):{' '}
          <InlineMath>{'2n'}</InlineMath> επαναλήψεις →{' '}
          <InlineMath>{'O(n)'}</InlineMath>.
        </p>
        <p>
          <strong>2ος βρόχος</strong> (<InlineMath>{'j'}</InlineMath> από{' '}
          <InlineMath>{'i'}</InlineMath> έως <InlineMath>{'i^2'}</InlineMath>):{' '}
          <InlineMath>{'i^2 - i + 1'}</InlineMath> επαναλήψεις. Στη χειρότερη
          περίπτωση <InlineMath>{'i = 2n'}</InlineMath>, άρα{' '}
          <InlineMath>{'(2n)^2 - 2n + 1 = 4n^2 - 2n + 1'}</InlineMath> →{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>.
        </p>
        <p>
          <strong>Η <InlineMath>{'CALC(w)'}</InlineMath>.</strong> Ο βρόχος{' '}
          τρέχει από <InlineMath>{'1'}</InlineMath> έως{' '}
          <InlineMath>{'w^{0{,}5}'}</InlineMath> με <em>βήμα{' '}
          <InlineMath>{'0{,}1'}</InlineMath></em> — δηλαδή{' '}
          <InlineMath>{'10'}</InlineMath> επαναλήψεις ανά μονάδα, σύνολο{' '}
          <InlineMath>{'10\\cdot w^{0{,}5}'}</InlineMath>. Εδώ το{' '}
          <InlineMath>{'w = j \\le i^2 \\le 4n^2'}</InlineMath>, άρα{' '}
          <InlineMath>{'w^{0{,}5} \\le 2n'}</InlineMath> και η{' '}
          <InlineMath>{'CALC'}</InlineMath> κάνει{' '}
          <InlineMath>{'\\le 10\\cdot 2n = 20n'}</InlineMath> βήματα →{' '}
          <InlineMath>{'O(n)'}</InlineMath> (ο υπολογισμός του{' '}
          <InlineMath>{'res'}</InlineMath> είναι <InlineMath>{'O(1)'}</InlineMath>).
        </p>
        <p>
          <strong>Συνολικά:</strong> αφού οι διαδικασίες είναι εμφωλευμένες,
          πολλαπλασιάζουμε:
        </p>
        <BlockMath>{'O(n)\\cdot O(n^2)\\cdot O(n) = O(n^4)'}</BlockMath>
        <p>
          (Με ακριβή υπολογισμό αθροισμάτων προκύπτει η ίδια τάξη,{' '}
          <InlineMath>{'\\Theta(n^4)'}</InlineMath>.)
        </p>
        <LoopComplexityTrace preset="front-set-4-e0-ask6" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: τρεις εμφωλευμένοι → πολλαπλασιασμός τριών τάξεων.</strong>{' '}
          Όταν όλοι οι βρόχοι έχουν ανεξάρτητα όρια στο <InlineMath>{'n'}</InlineMath>{' '}
          (ή σε φραγμένη συνάρτηση του εξωτερικού δείκτη), αρκεί πολλαπλασιασμός.
          Όταν όμως το όριο εξαρτάται από εξωτερικό δείκτη (π.χ.{' '}
          <InlineMath>{'j'}</InlineMath> από <InlineMath>{'i'}</InlineMath> έως{' '}
          <InlineMath>{'i^2'}</InlineMath>), προτίμα <em>άθροισμα</em>: η χονδρική
          εκτίμηση παίρνει το χειρότερο όριο, και κατά κανόνα ταυτίζεται με το
          πραγματικό άθροισμα μέχρι σταθερά.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-thema4',
    title: 'Φροντιστηριακό Σετ #4 · Θέμα 4 — Πολυπλοκότητα δύο αλγορίθμων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Θέμα 4',
    weight: 15,
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Βρες την πολυπλοκότητα των παρακάτω αλγορίθμων. Δώσε σύντομη
          αιτιολόγηση.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`Algorithm 1
  arg ← 1
  for i ← 1 to n with step 1 do
    for j ← 1 to i with step 1 do
      arg ← CALC(j)

procedure CALC(m)
  i ← 1;  s ← 1
  while s ≤ m do
    i ← i + 1
    s ← s + i
  return s`}</pre>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`Algorithm 2
  arg ← 0
  for i ← 1 to n with step 1 do
    for j ← 1 to n with step (2·j) do
      arg ← CALC(j)

procedure CALC(m)
  s ← m
  while s ≤ (2·m) do
    s ← s + 1
  return s`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Algorithm 1.</strong> Πρώτα η <InlineMath>{'CALC(m)'}</InlineMath>:
          σε κάθε επανάληψη το <InlineMath>{'i'}</InlineMath> αυξάνεται και το{' '}
          <InlineMath>{'s'}</InlineMath> γίνεται{' '}
          <InlineMath>{'1+2+3+\\cdots+i = \\tfrac{i(i+1)}{2}'}</InlineMath>. Ο
          βρόχος σταματά όταν <InlineMath>{'s > m'}</InlineMath>, δηλαδή όταν{' '}
          <InlineMath>{'\\tfrac{i(i+1)}{2} > m'}</InlineMath> — αυτό συμβαίνει για{' '}
          <InlineMath>{'i \\approx \\sqrt{2m}'}</InlineMath>. Άρα{' '}
          <InlineMath>{'CALC(m) = O(\\sqrt{m})'}</InlineMath>.
        </p>
        <p>
          Οι δύο εξωτερικοί βρόχοι (<InlineMath>{'i'}</InlineMath> έως{' '}
          <InlineMath>{'n'}</InlineMath>, <InlineMath>{'j'}</InlineMath> έως{' '}
          <InlineMath>{'i'}</InlineMath>) με κλήση{' '}
          <InlineMath>{'CALC(j)'}</InlineMath> δίνουν:
        </p>
        <BlockMath>{'\\sum_{i=1}^{n}\\sum_{j=1}^{i} O(\\sqrt{j}) = \\sum_{i=1}^{n} O(i^{3/2}) = O(n^{5/2})'}</BlockMath>
        <p>
          Άρα ο <strong>Algorithm 1</strong> είναι{' '}
          <InlineMath>{'\\Theta(n^{2{,}5})'}</InlineMath>.
        </p>
        <p>
          <strong>Algorithm 2.</strong> Η <InlineMath>{'CALC(m)'}</InlineMath>{' '}
          εδώ είναι απλή: το <InlineMath>{'s'}</InlineMath> ξεκινά από{' '}
          <InlineMath>{'m'}</InlineMath> και αυξάνεται κατά{' '}
          <InlineMath>{'1'}</InlineMath> ώσπου να φτάσει το{' '}
          <InlineMath>{'2m'}</InlineMath> → <InlineMath>{'m + 1'}</InlineMath>{' '}
          επαναλήψεις, δηλαδή <InlineMath>{'CALC(m) = O(m)'}</InlineMath>.
        </p>
        <p>
          <strong>Η παγίδα στον εσωτερικό βρόχο.</strong> Το βήμα είναι{' '}
          <InlineMath>{'(2\\cdot j)'}</InlineMath>: σε κάθε επανάληψη{' '}
          <InlineMath>{'j \\leftarrow j + 2j = 3j'}</InlineMath>. Άρα το{' '}
          <InlineMath>{'j'}</InlineMath> παίρνει τιμές{' '}
          <InlineMath>{'1, 3, 9, 27, \\ldots'}</InlineMath> — μόνο{' '}
          <InlineMath>{'O(\\log_3 n)'}</InlineMath> επαναλήψεις. Το άθροισμα του
          κόστους <InlineMath>{'CALC(j)'}</InlineMath> πάνω σε αυτές τις τιμές
          είναι γεωμετρική σειρά:
        </p>
        <BlockMath>{'\\sum_{j \\in \\{1,3,9,\\ldots,n\\}} O(j) = O(1 + 3 + 9 + \\cdots + n) = O(n)'}</BlockMath>
        <p>
          Ο εσωτερικός βρόχος (μαζί με τις κλήσεις) κοστίζει{' '}
          <InlineMath>{'O(n)'}</InlineMath>, και ο εξωτερικός{' '}
          <InlineMath>{'i'}</InlineMath> τον εκτελεί <InlineMath>{'n'}</InlineMath>{' '}
          φορές. Άρα ο <strong>Algorithm 2</strong> είναι{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>.
        </p>
        <p>
          Δες και τους δύο αλγορίθμους ζωντανά. Πρόσεξε στο Algo 1 ότι η CALC
          κρύβει αθροιστή <InlineMath>{'1+2+\\cdots+i'}</InlineMath> — σταματάει
          στο <InlineMath>{'i \\approx \\sqrt{2m}'}</InlineMath>, άρα{' '}
          <InlineMath>{'\\sqrt{m}'}</InlineMath> κόστος. Στο Algo 2 η παγίδα είναι
          το βήμα <InlineMath>{'(2 \\cdot j)'}</InlineMath>: σημαίνει{' '}
          <InlineMath>{'j \\leftarrow 3j'}</InlineMath> — γεωμετρικό, οπότε{' '}
          <InlineMath>{'\\log_3 n'}</InlineMath> επαναλήψεις:
        </p>
        <LoopComplexityTrace preset="front-set-4-thema4-a" />
        <LoopComplexityTrace preset="front-set-4-thema4-b" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «τι βήμα έχει ο βρόχος;»</strong>{' '}
          (1) <strong>Σταθερό βήμα +1</strong> → γραμμικός σε όριο.
          (2) <strong>Σταθερός πολλαπλασιαστής (×2, ×3, ...)</strong> →{' '}
          <em>λογαριθμικός</em> σε όριο. Η ψευδο-έκφραση «<code>step (2·j)</code>»
          είναι ύπουλη — δεν είναι σταθερό βήμα, είναι{' '}
          <InlineMath>{'j \\leftarrow j + 2j = 3j'}</InlineMath>.
          (3) <strong>Συνάρτηση του ορίσματος</strong> (CALC με while που χτίζει
          άθροισμα) → δες το αναλυτικά ποια ισότητα ικανοποιεί η συνθήκη τερματισμού.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask10',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 10 — Πυθαγόρεια τετράδα σε O(n²)',
    topic: 'data-structures',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 10',
    difficulty: 'hard',
    prerequisites: ['lectures/L10-data-structures'],
    statement: (
      <p>
        Μια <strong>Πυθαγόρεια τετράδα</strong> είναι ακέραιοι{' '}
        <InlineMath>{'(a, b, c, d)'}</InlineMath> με{' '}
        <InlineMath>{'d = \\sqrt{a^2 + b^2 + c^2}'}</InlineMath>, δηλαδή{' '}
        <InlineMath>{'a^2 + b^2 + c^2 = d^2'}</InlineMath>. Σχεδίασε αλγόριθμο{' '}
        <InlineMath>{'O(n^2)'}</InlineMath> που αποφασίζει αν υπάρχει Πυθαγόρεια
        τετράδα σε έναν πίνακα <InlineMath>{'n'}</InlineMath> διακριτών θετικών
        ακεραίων (επιτρέπεται η πολλαπλή χρήση ενός στοιχείου).
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Γιατί η αφελής αποτυγχάνει.</strong> Δοκιμή κάθε τετράδας{' '}
          <InlineMath>{'(a, b, c, d)'}</InlineMath> = τέσσερις εμφωλευμένοι βρόχοι ={' '}
          <InlineMath>{'O(n^4)'}</InlineMath>. Για <InlineMath>{'n = 1000'}</InlineMath>{' '}
          είναι <InlineMath>{'10^{12}'}</InlineMath> δοκιμές — μη πραγματοποιήσιμο. Ο
          στόχος <InlineMath>{'O(n^2)'}</InlineMath> σημαίνει: <em>όχι ολόκληρες τετράδες,
          ζευγάρωμα ζευγαριών</em>.
        </p>
        <p>
          <strong>Το κλειδί — μετακινούμε ένα τετράγωνο απέναντι.</strong>
        </p>
        <BlockMath>{'a^2 + b^2 + c^2 = d^2 \\;\\Longleftrightarrow\\; \\underbrace{a^2 + b^2}_{\\text{«αριστερό άθροισμα»}} \\;=\\; \\underbrace{d^2 - c^2}_{\\text{«δεξιά διαφορά»}}.'}</BlockMath>
        <p>
          Δύο διαφορετικά είδη ζεύγους με το ίδιο όνομα. Αν για κάποιο{' '}
          <InlineMath>{'(a, b)'}</InlineMath> και κάποιο <InlineMath>{'(c, d)'}</InlineMath>{' '}
          οι τιμές συμπίπτουν, βρήκαμε τετράδα. Πόσα ζεύγη; <InlineMath>{'O(n^2)'}</InlineMath>{' '}
          — ακριβώς όσα θέλουμε. Αν για κάθε «δεξιά διαφορά» κάναμε γραμμική σάρωση
          στις «αριστερές αθροίσεις», θα ξαναπέφταμε σε <InlineMath>{'O(n^4)'}</InlineMath>·
          γι' αυτό η αναζήτηση πρέπει να γίνει <InlineMath>{'O(1)'}</InlineMath>. Αυτό το
          κάνει ο <strong>πίνακας κατακερματισμού</strong>: χτίζεις όλες τις αριστερές
          τιμές μια φορά, μετά ρωτάς κάθε δεξιά.
        </p>
        <PythagoreanQuadHash />
        <p>
          <strong>Ο αλγόριθμος, με δομή.</strong>
        </p>
        <ul>
          <li>
            <strong>Φάση 1 — χτίσιμο.</strong> Για κάθε ζεύγος{' '}
            <InlineMath>{'(a, b)'}</InlineMath> ({' '}
            <InlineMath>{'O(n^2)'}</InlineMath> ζεύγη), βάλε στο hash set{' '}
            <InlineMath>{'H'}</InlineMath> το κλειδί <InlineMath>{'a^2 + b^2'}</InlineMath>.
            Κάθε εισαγωγή <InlineMath>{'O(1)'}</InlineMath> κατά μέσο όρο.
          </li>
          <li>
            <strong>Φάση 2 — ψάξιμο.</strong> Για κάθε ζεύγος{' '}
            <InlineMath>{'(c, d)'}</InlineMath> με <InlineMath>{'d > c'}</InlineMath>,
            υπολόγισε <InlineMath>{'d^2 - c^2'}</InlineMath> (θετικό) και ψάξε στο{' '}
            <InlineMath>{'H'}</InlineMath>. Αν βρεθεί → υπάρχει Πυθαγόρεια τετράδα.
          </li>
          <li>Αν τίποτα δεν ταιριάξει σε όλη τη Φάση 2, η απάντηση είναι «ΟΧΙ».</li>
        </ul>
        <p>
          <strong>Ορθότητα.</strong> Αν υπάρχει τετράδα με{' '}
          <InlineMath>{'a^2+b^2+c^2=d^2'}</InlineMath>, η τιμή{' '}
          <InlineMath>{'a^2+b^2'}</InlineMath> μπήκε σίγουρα στο{' '}
          <InlineMath>{'H'}</InlineMath> στη Φάση 1, και η ίδια τιμή θα ζητηθεί
          ως <InlineMath>{'d^2-c^2'}</InlineMath> στη Φάση 2 — άρα θα βρεθεί.
          Αντίστροφα, αν βρούμε ταίρι, η ισότητα ισχύει εξ ορισμού. Η πολλαπλή
          χρήση στοιχείου επιτρέπεται, άρα δεν χρειάζεται ειδικός χειρισμός για
          ίσα <InlineMath>{'a, b, c, d'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong>{' '}
          <InlineMath>{'O(n^2) + O(n^2) = O(n^2)'}</InlineMath> αναμενόμενος
          χρόνος και <InlineMath>{'O(n^2)'}</InlineMath> χώρος (για το{' '}
          <InlineMath>{'H'}</InlineMath>). Το hash είναι ο μετασχηματιστής:
          μετατρέπει «ψάξε αν υπάρχει» από γραμμικό σε σταθερό χρόνο, και
          ολόκληρο το πρόβλημα πέφτει δύο τάξεις πιο κάτω.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «meet in the middle» με hash.</strong>{' '}
            Όταν θες να αποφασίσεις αν υπάρχει συνδυασμός{' '}
            <InlineMath>{'k'}</InlineMath> στοιχείων που ικανοποιεί μία εξίσωση,
            κοίτα αν χωρίζεται σε «αριστερή πλευρά = δεξιά πλευρά» με κάθε
            πλευρά να αφορά <InlineMath>{'k/2'}</InlineMath> στοιχεία. Αν ναι:
            υπολόγισε όλες τις τιμές της μίας πλευράς (<InlineMath>{'O(n^{k/2})'}</InlineMath>)
            → βάλε σε hash → ρώτα για κάθε τιμή της άλλης (επίσης{' '}
            <InlineMath>{'O(n^{k/2})'}</InlineMath>). Συνολικά{' '}
            <InlineMath>{'O(n^{k/2})'}</InlineMath> αντί{' '}
            <InlineMath>{'O(n^k)'}</InlineMath>. Η Πυθαγόρεια τετράδα είναι το
            πιο καθαρό παράδειγμα του πρωτύπου με <InlineMath>{'k = 4'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask1',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 1 — Stooge Sort: ορθότητα & πολυπλοκότητα',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δίνεται ο αναδρομικός αλγόριθμος ταξινόμησης{' '}
          <strong>Stooge Sort</strong> <InlineMath>{'(A, l, r)'}</InlineMath>{' '}
          (ταξινομεί τον πίνακα <InlineMath>{'A'}</InlineMath> από τον δείκτη{' '}
          <InlineMath>{'l'}</InlineMath> έως τον <InlineMath>{'r'}</InlineMath>):
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`Stooge Sort(A, l, r):
  if A[l] > A[r] then Swap(A[l], A[r])
  if l + 1 > r then return
  k := ⌊(r - l + 1) / 3⌋
  Stooge Sort(A, l,     r - k)   // πρώτα 2/3
  Stooge Sort(A, l + k, r    )   // τελευταία 2/3
  Stooge Sort(A, l,     r - k)   // ξανά τα πρώτα 2/3`}</pre>
        <p>
          (α) Απόδειξε ότι η κλήση{' '}
          <InlineMath>{'\\text{Stooge Sort}(A, 1, n)'}</InlineMath> ταξινομεί
          σωστά έναν πίνακα μήκους <InlineMath>{'n'}</InlineMath>. (β) Γράψε την
          αναδρομική εξίσωση του χειρότερου χρόνου και την ακριβή τάξη{' '}
          (<InlineMath>{'\\Theta'}</InlineMath>).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Ορθότητα — επαγωγή στο μήκος n.</strong> Βάση: για n=1
          τετριμμένο, για n=2 η αρχική συγκριτική γραμμή κάνει τη δουλειά.
          Επαγωγική υπόθεση: σωστή ταξινόμηση για κάθε k &lt; n· κάθε
          αναδρομική κλήση γίνεται σε <InlineMath>{'2n/3 < n'}</InlineMath>,
          άρα είναι σωστή.
        </p>
        <p>
          Το «καρδιά» του επιχειρήματος για n μήκος: σκέψου τον πίνακα σε τρία
          ίσα τρίτα. Δες τις 3 κλήσεις και τι κάνει η καθεμία στα τρίτα:
        </p>
        <StoogeSortViz />
        <ul>
          <li>
            <strong>1η κλήση</strong>: ταξινομεί τα πρώτα 2/3 → τα{' '}
            <InlineMath>{'k'}</InlineMath> μεγαλύτερα αυτών μετακινούνται στο
            μεσαίο τρίτο.
          </li>
          <li>
            <strong>2η κλήση</strong>: ταξινομεί τα τελευταία 2/3 (μεσαίο +
            τελευταίο) → τα{' '}
            <InlineMath>{'k'}</InlineMath> μεγαλύτερα όλου του πίνακα
            καταλήγουν, ταξινομημένα, στο τελευταίο τρίτο.
          </li>
          <li>
            <strong>3η κλήση</strong>: ξαναταξινομεί τα πρώτα 2/3, που πλέον
            περιέχουν τα <InlineMath>{'2n/3'}</InlineMath> μικρότερα στοιχεία.
          </li>
        </ul>
        <p>
          <strong>(β) Πολυπλοκότητα.</strong> Κάθε κλήση: σταθερή δουλειά +
          τρεις αναδρομικές σε μέγεθος <InlineMath>{'2n/3'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = 3\\,T(2n/3) + O(1).'}</BlockMath>
        <p>
          Master Theorem με <InlineMath>{'a=3, b=3/2'}</InlineMath>:{' '}
          <InlineMath>{'n^{\\log_{3/2} 3} \\approx n^{2{,}71}'}</InlineMath>. Το{' '}
          <InlineMath>{'f = O(1)'}</InlineMath> είναι πολυωνυμικά μικρότερο →
          Περίπτωση 1:
        </p>
        <BlockMath>{'T(n) = \\Theta(n^{\\log_{3/2} 3}) \\approx \\Theta(n^{2{,}71}).'}</BlockMath>
        <p>
          Δηλαδή η Stooge Sort είναι <em>χειρότερη</em> και από την bubble{' '}
          <InlineMath>{'\\Theta(n^2)'}</InlineMath> — εξ ου και το όνομα.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «D&amp;C δεν εγγυάται ταχύτητα».</strong> Όταν
          βλέπεις «a αναδρομικές κλήσεις σε μέγεθος n/b», η πολυπλοκότητα
          εξαρτάται κρίσιμα από τη σχέση{' '}
          <InlineMath>{'a'}</InlineMath> vs <InlineMath>{'b'}</InlineMath>:
          <ul>
            <li>2T(n/2): n φύλλα → Θ(n log n) — γρήγορο.</li>
            <li>3T(2n/3): n^{`{log_{3/2} 3}`} ≈ n^{`{2.71}`} φύλλα — αργό.</li>
            <li>2T(n−1): 2ⁿ φύλλα — εκθετικό.</li>
          </ul>
          Όπως είδαμε στον Hanoi στο L03 — D&amp;C χωρίς «καλή» αναδρομή =
          βλακεία. Το λόγο εκθέτη δίνει το{' '}
          <InlineMath>{'\\log_{n_{old}/n_{new}}(a)'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask2',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 2 — Ταίριασμα βιδών με παξιμάδια',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Δίνονται <InlineMath>{'n'}</InlineMath> βίδες και{' '}
          <InlineMath>{'n'}</InlineMath> αντίστοιχα παξιμάδια, διαφορετικού
          διαμετρήματος. Μπορεί να ελεγχθεί αν ένα επιλεγμένο ζεύγος βίδας και
          παξιμαδιού ταιριάζει, με <strong>μία δοκιμή ταιριάσματος</strong>{' '}
          (που λέει «ταιριάζει» / «η βίδα είναι μικρότερη» / «μεγαλύτερη»). Δεν
          επιτρέπεται απευθείας σύγκριση δύο βιδών ή δύο παξιμαδιών.
        </p>
        <p>
          Σχεδίασε αλγόριθμο που ταιριάζει όλες τις βίδες με τα παξιμάδια, με
          αποδοτικότητα μέσης περίπτωσης{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Αφελής λύση.</strong> Σύγκρινε κάθε βίδα με όλα τα παξιμάδια
          ώσπου να βρεθεί το ταίρι της: <InlineMath>{'n'}</InlineMath> βίδες ×{' '}
          <InlineMath>{'n'}</InlineMath> παξιμάδια ={' '}
          <InlineMath>{'O(n^2)'}</InlineMath> δοκιμές. Στόχος μας{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath> κατά μέσο όρο.
        </p>
        <p>
          <strong>Η ιδέα — randomized quicksort, αλλά «cross-pivoted».</strong>{' '}
          Δεν επιτρέπεται βίδα-vs-βίδα ούτε παξιμάδι-vs-παξιμάδι· επιτρέπεται
          μόνο βίδα-vs-παξιμάδι. Άρα το pivot ΔΕΝ μπορεί να είναι από την ίδια
          ομάδα που διαμερίζεται — πρέπει να είναι από <em>την άλλη</em> ομάδα.
          Αυτό λύνεται με μία ωραία χορογραφία:
        </p>
        <ul>
          <li>
            <strong>1ο βήμα — Pick.</strong> Διάλεξε{' '}
            <em>τυχαία</em> ένα παξιμάδι <InlineMath>{'P'}</InlineMath>.
          </li>
          <li>
            <strong>2ο βήμα — Partition bolts.</strong> Δοκίμασε το{' '}
            <InlineMath>{'P'}</InlineMath> με κάθε βίδα. Αυτό χωρίζει τις
            βίδες σε τρεις ομάδες — μικρότερες, η <em>μία</em> ταιριαστή{' '}
            <InlineMath>{'B'}</InlineMath>, μεγαλύτερες.{' '}
            <InlineMath>{'\\Theta(n)'}</InlineMath> δοκιμές.
          </li>
          <li>
            <strong>3ο βήμα — Partition nuts.</strong> Η{' '}
            <InlineMath>{'B'}</InlineMath> γίνεται τώρα pivot για τα{' '}
            <em>παξιμάδια</em>: δοκίμασέ την με κάθε ένα και χώρισέ τα σε
            μικρότερα / ίσο (το <InlineMath>{'P'}</InlineMath>) / μεγαλύτερα.{' '}
            <InlineMath>{'\\Theta(n)'}</InlineMath> ακόμη δοκιμές.
          </li>
          <li>
            <strong>4ο βήμα — Recurse.</strong> «Μικρές» βίδες ταιριάζουν με
            «μικρά» παξιμάδια· «μεγάλες» με «μεγάλα». Αναδρομή στα δύο ζεύγη
            υπο-συνόλων.
          </li>
        </ul>
        <p>
          Δες ένα ολόκληρο επίπεδο της αναδρομής σε 8 παξιμάδια / 8 βίδες — από
          το «τυχαίο pivot» μέχρι τα δύο υπο-προβλήματα που γεννιούνται:
        </p>
        <NutsAndBolts />
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε επίπεδο κάνει{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath> δοκιμές και η τυχαία επιλογή
          pivot δίνει την ίδια ισορροπία μ' ένα κανονικό{' '}
          <strong>randomized quicksort</strong>. Επομένως ο αναμενόμενος χρόνος
          είναι <strong><InlineMath>{'\\Theta(n\\log n)'}</InlineMath></strong>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «cross-pivot ξεκλειδώνει την απαγόρευση».</strong>{' '}
          Όταν η εκφώνηση απαγορεύει σύγκριση μέσα στην ίδια ομάδα αλλά
          επιτρέπει «οντοτικό» έλεγχο μεταξύ δύο ομάδων, σκέψου: «μπορεί να
          παίξει η μία ομάδα τον ρόλο του pivot για την άλλη;». Σχεδόν πάντα
          ναι — και τότε η randomized quicksort προσαρμόζεται κατευθείαν, με{' '}
          <em>διπλάσιο</em> κόστος διαμέρισης ανά επίπεδο (ένας γύρος για
          κάθε ομάδα). Το αποτέλεσμα μένει{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath> αναμενόμενος — η σταθερά
          μόνο 2×.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask3',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 3 — Προστασία της Quicksort από σαμποτάζ',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Ένα σύστημα χρησιμοποιεί την <strong>Quicksort</strong> για να
          επεξεργαστεί δεδομένα που λαμβάνει από ένα δίκτυο. Θέλουμε να το
          προστατεύσουμε από «σαμποτάζ»: ένας κακόβουλος μπορεί να στείλει
          δεδομένα ειδικά διαμορφωμένα ώστε η Quicksort να εμφανίσει τη χειρότερη
          επίδοσή της.
        </p>
        <p>
          <strong>1.</strong> Αν η Quicksort διαλέγει πάντα το πρώτο στοιχείο ως
          pivot, τι δεδομένα θα έστελνε ο κακόβουλος; <strong>2.</strong>{' '}
          Πρότεινε μια απλή στρατηγική <em>γραμμικού χρόνου</em> που εγγυάται{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath> ανεξάρτητα από τα δεδομένα —{' '}
          χωρίς να αλλάξεις τον τρόπο επιλογής pivot.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>1. Η επίθεση.</strong> Σκέψου τι θέλει ο επιτιθέμενος: το pivot
          να μην είναι ποτέ κοντά στη μέση. Με pivot το πρώτο στοιχείο,
          αρκεί να στείλει είσοδο <em>ήδη ταξινομημένη</em>: το pivot είναι
          πάντα το ελάχιστο, το χώρισμα δίνει ένα κενό κομμάτι και ένα μεγέθους{' '}
          <InlineMath>{'n-1'}</InlineMath>, η αναδρομή γίνεται γραμμική σκάλα:
        </p>
        <BlockMath>{'T(n) = T(n-1) + \\Theta(n) = \\Theta(n^2)'}</BlockMath>
        <p>
          Δηλαδή ο επιτιθέμενος <em>«στραγγαλίζει»</em> την quicksort απλώς
          στέλνοντας ταξινομημένα δεδομένα — που δεν μοιάζουν καν επιθετικά.
        </p>
        <p>
          <strong>2. Η άμυνα — Fisher–Yates πριν την quicksort.</strong> Δεν
          επιτρέπεται να αλλάξουμε την επιλογή pivot, οπότε αλλάζουμε την{' '}
          <em>είσοδο</em>: εφαρμόζουμε μία τυχαία αναδιάταξη σε χρόνο{' '}
          <InlineMath>{'O(n)'}</InlineMath> πριν καλέσουμε τη quicksort.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`Fisher-Yates(A, n):
  for i from 0 to n-2:
    j = τυχαίος ακέραιος στο [i, n-1]
    swap(A[i], A[j])`}</pre>
        <p>
          Το λήμμα του Fisher–Yates: μετά τις <InlineMath>{'n-1'}</InlineMath>{' '}
          ανταλλαγές, κάθε μετάθεση είναι ισοπίθανη — η σειρά είναι ομοιόμορφα
          τυχαία. Έτσι το pivot=πρώτο, αν και «ντετερμινιστικό», βλέπει τυχαία
          είσοδο: η συμπεριφορά γίνεται ίδια με τη <em>randomized</em> quicksort,
          αναμενόμενος χρόνος{' '}
          <strong><InlineMath>{'O(n\\log n)'}</InlineMath></strong>. Ο
          επιτιθέμενος δεν μπορεί να προβλέψει το αποτέλεσμα της ανακάτεψης,
          οπότε δεν μπορεί να «στήσει» τη χειρότερη περίπτωση.
        </p>
        <p>
          Δες και τις δύο εκδοχές σε μια ταξινομημένη είσοδο 8 στοιχείων.
          Στην <strong>Επίθεση</strong> το δέντρο αναδρομής γίνεται μια
          αριστερή σκάλα και το σωρευτικό κόστος προσεγγίζει τις{' '}
          <InlineMath>{'\\binom{n}{2}'}</InlineMath> συγκρίσεις. Στην{' '}
          <strong>Άμυνα</strong>, ο Fisher–Yates ανακατεύει την ίδια είσοδο
          βήμα-βήμα και μετά η quicksort τρέχει σε ισορροπημένα δέντρα:
        </p>
        <QuicksortShufflingDefense />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «αν δεν αλλάζεις τον αλγόριθμο, ανακάτεψε
          την είσοδο».</strong> Όταν η εκφώνηση δεσμεύει μια ντετερμινιστική
          απόφαση (επιλογή pivot, σειρά εξέτασης) και ζητά ανθεκτικότητα σε
          «κακόβουλη» είσοδο, η συνταγή είναι να εισάγεις τυχαιότητα{' '}
          <em>πριν</em>: Fisher–Yates σε <InlineMath>{'O(n)'}</InlineMath> δίνει
          μετάθεση ομοιόμορφη — οπότε ο ντετερμινιστικός κώδικας βλέπει σχεδόν
          σίγουρα «καλή» είσοδο. Παγίδα: η τυχαία αναδιάταξη πρέπει να γίνει σε
          συνάρτηση που ο επιτιθέμενος δεν μπορεί να μιμηθεί (κρυπτογραφικά
          ασφαλής γεννήτρια, αν η εφαρμογή είναι εκτεθειμένη).
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask5',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 5 — Συνεκτικές συνιστώσες από λίστες γειτνίασης',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 5',
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>
          Δίνεται ένας μη κατευθυνόμενος γράφος <InlineMath>{'G'}</InlineMath> με{' '}
          <InlineMath>{'n'}</InlineMath> κορυφές και{' '}
          <InlineMath>{'m'}</InlineMath> ακμές, αποθηκευμένος ως{' '}
          <strong>λίστες γειτνίασης</strong> σε δύο γραμμικούς πίνακες:{' '}
          <InlineMath>{'\\text{Head}[1..n]'}</InlineMath> δείχνει για κάθε
          κορυφή πού αρχίζει η λίστα της μέσα στον{' '}
          <InlineMath>{'\\text{Succ}[\\,]'}</InlineMath>, και ο{' '}
          <InlineMath>{'\\text{Succ}'}</InlineMath> κρατά τους γείτονες
          σερί. Να δοθεί αλγόριθμος εύρεσης των συνεκτικών συνιστωσών του{' '}
          <InlineMath>{'G'}</InlineMath> και η πολυπλοκότητά του.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Διαίσθηση.</strong> Μια συνεκτική συνιστώσα είναι ένα{' '}
          «νησί» κόμβων — μπες οπουδήποτε μέσα, θα δεις όλο το νησί και
          τίποτα παραπάνω. Άρα: ένα BFS ανά συνιστώσα φτάνει. Ένας εξωτερικός
          βρόχος θα ψάχνει την «επόμενη ασημάδευτη» κορυφή για να ξεκινήσει
          το επόμενο κύμα.
        </p>
        <p>
          <strong>Ο αλγόριθμος (BFT — Breadth-First Traversal).</strong>
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`BFT(G):
  mark[v] ← false  για κάθε κορυφή v
  c ← 0
  for i ← 1 to n:
    if mark[v_i] == false:
      c ← c + 1
      BFS(v_i)        // νέα συνεκτική συνιστώσα — id c`}</pre>
        <p>
          Όταν το BFS «θέλει» τους γείτονες του{' '}
          <InlineMath>{'v'}</InlineMath>, διαβάζει το{' '}
          <InlineMath>{'\\text{Head}[v]'}</InlineMath> για να ξέρει από ποιο
          κελί του <InlineMath>{'\\text{Succ}'}</InlineMath> να αρχίσει, και
          προχωρά μέχρι την επόμενη <InlineMath>{'\\text{Head}'}</InlineMath>{' '}
          τιμή. Είναι ακριβώς αυτό που σου ζητούν να δεις:
        </p>
        <ComponentsBfsSweep instance="head-succ" showHeadSucc />
        <p>
          Στο παράδειγμα: το <InlineMath>{'\\text{BFS}'}</InlineMath> από το{' '}
          <InlineMath>{'a'}</InlineMath> κατακλύζει τα{' '}
          <InlineMath>{'b, c, d'}</InlineMath> (συνιστώσα 1)· από το{' '}
          <InlineMath>{'e'}</InlineMath> το <InlineMath>{'f'}</InlineMath>{' '}
          (συνιστώσα 2)· από το <InlineMath>{'g'}</InlineMath> το{' '}
          <InlineMath>{'h'}</InlineMath> (συνιστώσα 3).
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Ο εξωτερικός βρόχος είναι{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath>. Τα BFS μαζί διαβάζουν κάθε
          κορυφή το πολύ μία φορά και κάθε ακμή το πολύ δύο φορές (μία από
          κάθε άκρο της — η αναπαράσταση{' '}
          <InlineMath>{'\\text{Head}/\\text{Succ}'}</InlineMath> δίνει αμέσως
          τους γείτονες):
        </p>
        <BlockMath>{'\\Theta(n) + \\sum_{i=1}^{k}\\Theta(n_i + m_i) = \\Theta(n + m)'}</BlockMath>
        <p>
          όπου <InlineMath>{'k'}</InlineMath> το πλήθος των συνιστωσών και{' '}
          <InlineMath>{'n_i, m_i'}</InlineMath> οι κορυφές/ακμές της{' '}
          <InlineMath>{'i'}</InlineMath>-οστής. Βέλτιστο, αφού οποιοσδήποτε
          αλγόριθμος <em>πρέπει</em> να αγγίξει όλη την είσοδο.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «λίστες γειτνίασης = γραμμικός χρόνος».</strong>{' '}
            Όποτε η εκφώνηση τονίζει την αναπαράσταση με λίστες (ή{' '}
            <InlineMath>{'\\text{Head}/\\text{Succ}'}</InlineMath>), σε
            καθοδηγεί προς αλγόριθμο{' '}
            <InlineMath>{'\\Theta(n + m)'}</InlineMath>: σε αυτή την αναπαράσταση
            «βρες όλους τους γείτονες» κοστίζει{' '}
            <InlineMath>{'\\Theta(\\deg)'}</InlineMath> αντί για{' '}
            <InlineMath>{'\\Theta(n)'}</InlineMath> ανά κορυφή, οπότε το BFS/DFS
            βγαίνει συνολικά γραμμικό. Με πίνακα γειτνίασης ο ίδιος αλγόριθμος
            θα γινόταν <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask6',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 6 — Μονοπάτι μέγιστης αξιοπιστίας',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 6',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>
          Μια αποστολή πρέπει να δρομολογηθεί από μια πόλη{' '}
          <InlineMath>{'s'}</InlineMath> σε μια πόλη{' '}
          <InlineMath>{'t'}</InlineMath>. Το οδικό δίκτυο είναι γράφος{' '}
          <InlineMath>{'G = (X, A, P)'}</InlineMath>· για κάθε δρόμο{' '}
          <InlineMath>{'(i,j)'}</InlineMath>, η τιμή{' '}
          <InlineMath>{'P(i,j)'}</InlineMath> είναι η πιθανότητα να διασχιστεί
          χωρίς επιπτώσεις. Ζητάμε δρομολόγιο που <strong>μεγιστοποιεί την
          πιθανότητα</strong> να φτάσει η αποστολή στον{' '}
          <InlineMath>{'t'}</InlineMath> — δηλαδή μονοπάτι μέγιστης αξιοπιστίας.
        </p>
        <p>
          <strong>1.</strong> Επίλεξε τον κατάλληλο αλγόριθμο.{' '}
          <strong>2.</strong> Εφάρμοσέ τον στον γράφο με{' '}
          <InlineMath>{'X = \\{s, v_1, v_2, t\\}'}</InlineMath>,{' '}
          <InlineMath>{'A = \\{(s,v_1),(s,v_2),(v_1,v_2),(v_1,t),(v_2,t)\\}'}</InlineMath>,{' '}
          <InlineMath>{'P(s,v_1)=1,\\ P(s,v_2)=\\tfrac18,\\ P(v_1,v_2)=P(v_2,t)=\\tfrac12,\\ P(v_1,t)=\\tfrac1{16}'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η διαίσθηση πριν την άλγεβρα.</strong> Η αξιοπιστία ενός
          μονοπατιού είναι το <em>γινόμενο</em> των πιθανοτήτων στις ακμές του —
          κάθε νέα ακμή <em>πολλαπλασιάζει</em> την επιβίωση. Θέλουμε να
          μεγιστοποιήσουμε <em>γινόμενο</em>, αλλά ο Dijkstra ξέρει να
          ελαχιστοποιεί <em>άθροισμα</em>. Μας λείπει μια γέφυρα ανάμεσα στις
          δύο γλώσσες.
        </p>
        <p>
          <strong>Η γέφυρα — λογάριθμος.</strong> Ο λογάριθμος είναι ακριβώς ο
          μετατροπέας «γινόμενο → άθροισμα»:{' '}
          <InlineMath>{'\\log\\!\\left(\\prod P\\right) = \\sum \\log P'}</InlineMath>.
          Συν: επειδή ο λογάριθμος είναι αύξουσα συνάρτηση, διατηρεί τη σειρά —{' '}
          αν <InlineMath>{'\\prod P_1 > \\prod P_2'}</InlineMath>, τότε και{' '}
          <InlineMath>{'\\sum \\log P_1 > \\sum \\log P_2'}</InlineMath>.
        </p>
        <BlockMath>{'\\max \\prod P \\;\\Longleftrightarrow\\; \\max \\sum \\log P \\;\\Longleftrightarrow\\; \\min \\sum (-\\log P)'}</BlockMath>
        <p>
          Θέτουμε νέο βάρος <InlineMath>{'w(i,j) = -\\log_2 P(i,j)'}</InlineMath>.
          Αφού <InlineMath>{'P \\le 1'}</InlineMath>, είναι{' '}
          <InlineMath>{'w \\ge 0'}</InlineMath> — μη αρνητικά βάρη, οπότε ο{' '}
          <strong>Dijkstra</strong> εφαρμόζεται. Το συντομότερο μονοπάτι στον
          μετασχηματισμένο γράφο = μονοπάτι μέγιστης αξιοπιστίας στον αρχικό.
        </p>
        <p>
          <strong>Εφαρμογή στο συγκεκριμένο γράφημα.</strong> Με{' '}
          <InlineMath>{'-\\log_2'}</InlineMath>:{' '}
          <InlineMath>{'w(s,v_1)=0'}</InlineMath>,{' '}
          <InlineMath>{'w(s,v_2)=3'}</InlineMath>,{' '}
          <InlineMath>{'w(v_1,v_2)=1'}</InlineMath>,{' '}
          <InlineMath>{'w(v_2,t)=1'}</InlineMath>,{' '}
          <InlineMath>{'w(v_1,t)=4'}</InlineMath>. Άλλαξε το tab για να δεις
          την ίδια εικόνα και στις δύο γλώσσες· πέρνα από τις τρεις υποψήφιες
          διαδρομές για να συγκρίνεις:
        </p>
        <ReliabilityLogTransform />
        <p>
          Το συντομότερο μονοπάτι στα <InlineMath>{'w'}</InlineMath> έχει βάρος{' '}
          <InlineMath>{'2'}</InlineMath>, άρα το μονοπάτι μέγιστης αξιοπιστίας
          είναι <InlineMath>{'s \\to v_1 \\to v_2 \\to t'}</InlineMath> με
          αξιοπιστία <InlineMath>{'2^{-2} = 1/4'}</InlineMath>. Παρατήρησε ότι
          οι δύο «προφανείς» μονοπάτια <InlineMath>{'s \\to v_1 \\to t'}</InlineMath>{' '}
          και <InlineMath>{'s \\to v_2 \\to t'}</InlineMath> έχουν την ίδια
          αξιοπιστία <InlineMath>{'1/16'}</InlineMath> — και ο μετασχηματισμός
          το δείχνει αμέσως: <InlineMath>{'0+4=4 = 3+1'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «γινόμενο πάει σε άθροισμα με λογάριθμο».</strong>{' '}
            Όποτε δεις βελτιστοποίηση γινομένου (αξιοπιστία, πιθανότητα
            επιτυχίας, παράγοντες ποιότητας) ζητούμενη πάνω σε μονοπάτι, η πρώτη
            σου σκέψη είναι: «μπορώ να την κάνω άθροισμα;». Λογάριθμος συν
            πρόσημο φέρνει το πρόβλημα σε ένα γνωστό shortest-path πλαίσιο. Δες
            ποιο πρόσημο σώζει την «μη αρνητικότητα» (Dijkstra) και ποιο όχι
            (Bellman-Ford / DAG-relaxation).
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask7',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 7 — Μονοπάτι μέσα από διατεταγμένα υποσύνολα',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 7',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <p>
        Έστω <InlineMath>{'G = (V, E, W)'}</InlineMath> συνεκτικός, μη
        κατευθυνόμενος, πλήρης γράφος με{' '}
        <InlineMath>{'W: E \\to \\mathbb{R}'}</InlineMath>. Δίνονται ξένα ανά
        δύο υποσύνολα <InlineMath>{'C_1, C_2, \\ldots, C_k \\subseteq V'}</InlineMath>{' '}
        (<InlineMath>{'C_i \\cap C_j = \\emptyset'}</InlineMath>). Σχεδίασε
        πολυωνυμικό αλγόριθμο (με την πολυπλοκότητά του) που βρίσκει μονοπάτι
        ελαχίστου μήκους <InlineMath>{'k'}</InlineMath> κορυφών της μορφής{' '}
        <InlineMath>{'c_1 \\to c_2 \\to \\cdots \\to c_k'}</InlineMath>, με{' '}
        <InlineMath>{'c_i \\in C_i'}</InlineMath> για κάθε{' '}
        <InlineMath>{'i'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Πού «κολλάει» κανείς στην εκφώνηση.</strong> Ο γράφος είναι
          πλήρης (κάθε κορυφή με κάθε άλλη), τα βάρη είναι αυθαίρετα — και ο
          ορισμός του μονοπατιού φαίνεται ελεύθερος. Η περιοριστική φράση
          κρύβεται σε δύο λέξεις: <em>«της μορφής</em>{' '}
          <InlineMath>{'c_1 \\to c_2 \\to \\cdots \\to c_k'}</InlineMath>, με{' '}
          <InlineMath>{'c_i \\in C_i'}</InlineMath><em>»</em>. Αυτό κάνει τη
          σειρά των <InlineMath>{'C_i'}</InlineMath> προ-καθορισμένη — και η
          προ-καθορισμένη σειρά είναι <strong>χρυσάφι</strong> για συντομότερο
          μονοπάτι: σου χαρίζει τοπολογική διάταξη.
        </p>
        <p>
          <strong>Η κατασκευή — από πλήρη γράφο σε στρωματικό DAG.</strong>
        </p>
        <ul>
          <li>
            Κράτησε ως κορυφές μόνο τα στοιχεία των{' '}
            <InlineMath>{'C_1, \\ldots, C_k'}</InlineMath>, σε{' '}
            <InlineMath>{'k'}</InlineMath> «στρώματα» που τα σχεδιάζουμε ως
            στήλες.
          </li>
          <li>
            Βάλε κατευθυνόμενες ακμές <em>μόνο</em> από κάθε κορυφή του{' '}
            <InlineMath>{'C_i'}</InlineMath> προς κάθε κορυφή του{' '}
            <InlineMath>{'C_{i+1}'}</InlineMath>, με το αρχικό τους βάρος.
            (Ακμές εντός στρώματος ή πίσω σε προηγούμενο στρώμα{' '}
            <em>αφαιρούνται</em>.)
          </li>
          <li>
            Πρόσθεσε εικονική πηγή <InlineMath>{'s'}</InlineMath> με ακμές
            βάρους <InlineMath>{'0'}</InlineMath> προς όλο το{' '}
            <InlineMath>{'C_1'}</InlineMath>, και εικονικό προορισμό{' '}
            <InlineMath>{'t'}</InlineMath> με ακμές βάρους{' '}
            <InlineMath>{'0'}</InlineMath> από όλο το{' '}
            <InlineMath>{'C_k'}</InlineMath>. Έτσι δεν χρειάζεται να δοκιμάσεις
            «n εκκινήσεις» από όλο το <InlineMath>{'C_1'}</InlineMath>.
          </li>
        </ul>
        <p>
          Δοκίμασέ το στα δύο tabs σε ένα παράδειγμα 7 κορυφών χωρισμένων σε
          τρία υποσύνολα — δες πόσες ακμές εξαφανίζονται και πόσο καθαρή γίνεται
          η λύση:
        </p>
        <LayeredSubsetsDAG />
        <p>
          Το αποτέλεσμα είναι ένας <strong>ακυκλικός κατευθυνόμενος γράφος
          (DAG)</strong> με σαφή τοπολογική σειρά{' '}
          <InlineMath>{'s, C_1, \\ldots, C_k, t'}</InlineMath>. Τρέξε{' '}
          <strong>συντομότερο μονοπάτι σε DAG</strong> (τοπολογική ταξινόμηση +
          μία χαλάρωση ακμών — δες L09). Το ελάχιστο{' '}
          <InlineMath>{'s \\to t'}</InlineMath> μονοπάτι, αν αφαιρέσεις τα{' '}
          <InlineMath>{'s, t'}</InlineMath>, δίνει το ζητούμενο (χρειάζεται{' '}
          <InlineMath>{'k \\ge 2'}</InlineMath>).
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Το συντομότερο μονοπάτι σε DAG με
          τοπολογική ταξινόμηση κοστίζει{' '}
          <InlineMath>{'O(|V| + |E|)'}</InlineMath>. Αφού ο αρχικός γράφος είναι
          πλήρης, <InlineMath>{'|E| = O(|V|^2)'}</InlineMath>, άρα ο αλγόριθμος
          είναι <InlineMath>{'O(|V|^2)'}</InlineMath> — πολυωνυμικός.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «η προ-καθορισμένη σειρά υποσυνόλων
            φτιάχνει DAG».</strong> Όταν η εκφώνηση επιβάλλει σε ένα μονοπάτι να{' '}
            <em>περάσει διαδοχικά</em> από συγκεκριμένα στρώματα/φάσεις/χρώματα,
            δεν λύνεις γενικό shortest path — λύνεις shortest path σε DAG. Η
            σειρά είναι ήδη η τοπολογική σου. Στρώμα-στρώμα DAG με 0-βάρους
            ακμές σε εικονικό s/t είναι το προεπιλεγμένο pattern και βγάζει{' '}
            <InlineMath>{'O(|V| + |E|)'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask8',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 8 — Πιο αναξιόπιστο μονοπάτι σε DAG',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 8',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>
          Δίνεται κατευθυνόμενος <strong>ακυκλικός</strong> γράφος{' '}
          <InlineMath>{'G = (V, E)'}</InlineMath>· κάθε ακμή{' '}
          <InlineMath>{'(u,v)'}</InlineMath> έχει βάρος{' '}
          <InlineMath>{'r(u,v) \\in [0, 1]'}</InlineMath> που συμβολίζει την{' '}
          αξιοπιστία του διαύλου επικοινωνίας (πιθανότητα να μην αποτύχει η
          μετάδοση), με τις πιθανότητες ανεξάρτητες.
        </p>
        <p>
          Προσδιόρισε <strong>δύο</strong> αποδοτικούς αλγορίθμους για την
          εύρεση του <em>πιο αναξιόπιστου</em> μονοπατιού από δεδομένη κορυφή{' '}
          <InlineMath>{'s'}</InlineMath>: ο ένας να το αντιμετωπίζει ως πρόβλημα
          μονοπατιού <strong>μέγιστου</strong> κόστους, ο άλλος ως{' '}
          <strong>ελάχιστου</strong> κόστους, με κατάλληλους μετασχηματισμούς.
          Ποια η πολυπλοκότητα καθενός;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Τι σημαίνει «πιο αναξιόπιστο».</strong> Η αξιοπιστία ενός
          μονοπατιού είναι το γινόμενο <InlineMath>{'\\prod r_e'}</InlineMath>{' '}
          των ακμών του (ανεξάρτητα γεγονότα: όλες πρέπει να μην αποτύχουν).
          «Πιο αναξιόπιστο» = <strong>ελάχιστο γινόμενο</strong>. Όπως στην
          ask6, παίρνουμε λογάριθμο για να μετατρέψουμε το γινόμενο σε
          άθροισμα: <InlineMath>{'\\log\\prod r = \\sum \\log r'}</InlineMath>.
          Επειδή <InlineMath>{'r \\in [0,1]'}</InlineMath> κάθε{' '}
          <InlineMath>{'\\log r \\le 0'}</InlineMath> — και αυτό το πρόσημο
          ορίζει ποια διατύπωση θα διαλέξεις.
        </p>
        <p>
          <strong>Αλγόριθμος 1 — μονοπάτι μέγιστου κόστους (w ≥ 0).</strong>{' '}
          Θέσε <InlineMath>{'w = -\\log r'}</InlineMath>· επειδή{' '}
          <InlineMath>{'r \\le 1'}</InlineMath> έχεις{' '}
          <InlineMath>{'w \\ge 0'}</InlineMath>. Ελαχιστοποίηση του{' '}
          <InlineMath>{'\\prod r'}</InlineMath> ⟺ μεγιστοποίηση του{' '}
          <InlineMath>{'\\sum(-\\log r)'}</InlineMath> ⟺ ψάχνεις{' '}
          <strong>longest path σε DAG</strong>. Αφού ο γράφος είναι ακυκλικός,
          τοπολογική ταξινόμηση + χαλάρωση κρατώντας το <em>μέγιστο</em> σε
          κάθε κορυφή.
        </p>
        <p>
          <strong>Αλγόριθμος 2 — μονοπάτι ελάχιστου κόστους (w ≤ 0).</strong>{' '}
          Θέσε <InlineMath>{'w = \\log r \\le 0'}</InlineMath>. Ελαχιστοποίηση
          του <InlineMath>{'\\prod r'}</InlineMath> ⟺ ελαχιστοποίηση του{' '}
          <InlineMath>{'\\sum \\log r'}</InlineMath>. Εδώ είναι το λεπτό
          σημείο: τα βάρη είναι <strong>αρνητικά</strong>, οπότε ο{' '}
          <strong>Dijkstra δεν ισχύει</strong>. Όμως ο γράφος είναι DAG —
          μπορούμε να χαλαρώσουμε τις ακμές με τοπολογική σειρά κρατώντας το{' '}
          <em>ελάχιστο</em>, χωρίς να μας ενοχλούν τα αρνητικά (γιατί δεν
          υπάρχουν κύκλοι για να «τρέξει η αξία προς το μείον άπειρο»).
        </p>
        <p>
          Δες και τις δύο διατυπώσεις να καταλήγουν στο ίδιο μονοπάτι:
        </p>
        <DAGUnreliableTwoWays />
        <p>
          Από την κορυφή <InlineMath>{'A'}</InlineMath>, η πιο αναξιόπιστη
          διαδρομή στο παράδειγμα είναι{' '}
          <strong><InlineMath>{'A \\to C \\to D \\to F \\to H'}</InlineMath></strong>{' '}
          με αξιοπιστία <InlineMath>{'0{,}5 \\cdot 0{,}4 \\cdot 0{,}3 \\cdot 0{,}9 \\approx 0{,}054'}</InlineMath>{' '}
          — και οι δύο αλγόριθμοι το επιλέγουν.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Και οι δύο μέθοδοι (τοπολογική
          ταξινόμηση + ένα πέρασμα χαλάρωσης) κοστίζουν{' '}
          <InlineMath>{'\\Theta(|V| + |E|)'}</InlineMath>.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «DAG ξεκλειδώνει τα αρνητικά βάρη».</strong>{' '}
            Όταν το πρόσημο των βαρών «βρωμίζει» τον Dijkstra (κάποια ακμή
            έχει <InlineMath>{'w \\le 0'}</InlineMath>) και ο γράφος{' '}
            <em>τυχαίνει</em> να είναι ακυκλικός, μην ψάξεις Bellman-Ford — η
            τοπολογική σάρωση δουλεύει και είναι γρηγορότερη. Και ο διπλός
            μετασχηματισμός (max με <InlineMath>{'-\\log r'}</InlineMath> vs min
            με <InlineMath>{'\\log r'}</InlineMath>) είναι μαθηματικά ισοδύναμος —{' '}
            διάλεξε ό,τι κάνει το γράψιμο της αναδρομικής σχέσης πιο φυσικό.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask9',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 9 — Συντομότερο μονοπάτι & μετασχηματισμοί βαρών',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 9',
    difficulty: 'medium',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>
          Σ/Λ; Σε έναν γράφο με βάρη, το συντομότερο μονοπάτι μεταξύ δύο κορυφών{' '}
          <strong>δεν μεταβάλλεται</strong> αν όλα τα βάρη:
        </p>
        <p>
          <strong>Α.</strong> πολλαπλασιαστούν με τον ίδιο θετικό αριθμό.{' '}
          <strong>Β.</strong> αυξηθούν κατά τον ίδιο θετικό αριθμό (πρόσθεση).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Το ζητούμενο πίσω από την ερώτηση.</strong> «Δεν μεταβάλλεται
          το συντομότερο μονοπάτι» ισοδυναμεί με «η <em>σχετική σειρά</em> των
          μονοπατιών διατηρείται κάτω από τον μετασχηματισμό». Ένας
          μετασχηματισμός που διατηρεί τη σειρά για κάθε ζεύγος μονοπατιών —
          ανεξάρτητα από το πόσες ακμές έχουν — σώζει την απάντηση.
        </p>
        <p>
          <strong>Α. Πολλαπλασιασμός με θετικό αριθμό — ΣΩΣΤΟ.</strong> Έστω το
          συντομότερο μονοπάτι έχει άθροισμα βαρών{' '}
          <InlineMath>{'\\sum_i w_i'}</InlineMath> και κάθε άλλο μονοπάτι{' '}
          <InlineMath>{'\\sum_j w_j'}</InlineMath>, με{' '}
          <InlineMath>{'\\sum_i w_i < \\sum_j w_j'}</InlineMath>. Αν
          πολλαπλασιάσουμε κάθε ακμή με <InlineMath>{'a > 0'}</InlineMath>:
        </p>
        <BlockMath>{'a\\sum_i w_i = \\sum_i a\\,w_i \\;<\\; \\sum_j a\\,w_j = a\\sum_j w_j'}</BlockMath>
        <p>
          Η ανισότητα <strong>διατηρείται</strong> ως ολοκληρωμένη ταυτότητα —
          δηλαδή ο πολλαπλασιασμός σκαλώνει <em>όλα</em> τα μονοπάτια με τον
          ίδιο συντελεστή, ανεξάρτητα από το πλήθος των ακμών τους. Άρα το ίδιο
          μονοπάτι παραμένει το συντομότερο.
        </p>
        <p>
          <strong>Β. Πρόσθεση σταθεράς σε κάθε ακμή — ΛΑΘΟΣ.</strong> Η
          πρόσθεση μιας σταθεράς <InlineMath>{'\\alpha'}</InlineMath> δεν είναι
          πια «ομοιόμορφη» μεταξύ μονοπατιών: ένα μονοπάτι με{' '}
          <InlineMath>{'\\ell'}</InlineMath> ακμές χρεώνεται{' '}
          <InlineMath>{'\\ell \\cdot \\alpha'}</InlineMath> — το μέγεθος της
          προσαύξησης εξαρτάται από το πόσες ακμές έχει. Όσα μονοπάτια έχουν
          περισσότερες ακμές «πληρώνουν» αναλογικά περισσότερο, και ο νικητής
          μπορεί να αλλάξει.
        </p>
        <p>
          Σύρε ταυτόχρονα τα δύο sliders· δες ποιο πείραμα κρατάει το ίδιο
          αποτέλεσμα (×k) και ποιο σπάει (+α):
        </p>
        <MultVsAddPaths />
        <p>
          <strong>Αντιπαράδειγμα — κρατώντας το αριθμητικά.</strong> Δύο κορυφές
          με δύο μονοπάτια: A με <strong>3 ακμές</strong> βάρους{' '}
          <InlineMath>{'1'}</InlineMath> (σύνολο <InlineMath>{'3'}</InlineMath>),
          B με <strong>2 ακμές</strong> βάρους <InlineMath>{'2'}</InlineMath>{' '}
          (σύνολο <InlineMath>{'4'}</InlineMath>). Στην αρχή νικά η A
          (<InlineMath>{'3 < 4'}</InlineMath>). Προσθέτουμε{' '}
          <InlineMath>{'\\alpha = 10'}</InlineMath> σε κάθε ακμή:
        </p>
        <BlockMath>{'A: 3\\times 11 = 33, \\qquad B: 2\\times 12 = 24'}</BlockMath>
        <p>
          Τώρα νικά η B (<InlineMath>{'24 < 33'}</InlineMath>) — το συντομότερο
          μονοπάτι <strong>άλλαξε</strong>.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «×k κρατά τη σειρά, +α την σπάει».</strong>{' '}
            Όταν εξετάζεις αν ένας μετασχηματισμός βαρών διατηρεί συντομότερα
            μονοπάτια, ρώτησε: «είναι μονότονος <em>ανά μονοπάτι</em> με τρόπο
            ανεξάρτητο από το πλήθος ακμών;» Πολλαπλασιασμός με
            θετική σταθερά — ναι. Πρόσθεση σταθεράς — όχι, γιατί τιμωρεί
            ασύμμετρα τα πιο «μακριά» μονοπάτια. Αυτή η ίδια λογική εξηγεί
            γιατί η <em>τιπική «διόρθωση»</em> για αρνητικά βάρη («πρόσθεσε μια
            σταθερά + Dijkstra») είναι λάθος — δες αμέσως μετά την ask10 του{' '}
            σετ #7.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask11',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 11 — Ζεύγη με δοσμένο άθροισμα σε O(n)',
    topic: 'data-structures',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 11',
    difficulty: 'medium',
    prerequisites: ['lectures/L10-data-structures'],
    statement: (
      <p>
        Σχεδίασε αλγόριθμο που, δοθέντος ενός πίνακα{' '}
        <InlineMath>{'A'}</InlineMath> με <InlineMath>{'n'}</InlineMath>{' '}
        διαφορετικούς ακεραίους στο εύρος{' '}
        <InlineMath>{'\\{1, \\ldots, n^4\\}'}</InlineMath> και τιμή στόχο{' '}
        <InlineMath>{'x'}</InlineMath>, εκτυπώνει όλα τα ζεύγη{' '}
        <InlineMath>{'(i, j)'}</InlineMath> με{' '}
        <InlineMath>{'A[i] + A[j] = x'}</InlineMath>. Ο αναμενόμενος χρόνος
        πρέπει να είναι <InlineMath>{'O(n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Η πρώτη πιθανή ιδέα — και γιατί η μνήμη την σταματά.</strong>{' '}
          Άμεσος πίνακας: φτιάξε <InlineMath>{'V[1..n^4]'}</InlineMath>, γράψε{' '}
          <InlineMath>{'V[A[i]] = i'}</InlineMath>· για κάθε{' '}
          <InlineMath>{'A[i]'}</InlineMath>, διάβασε{' '}
          <InlineMath>{'V[x - A[i]]'}</InlineMath>. Λειτουργεί λογικά αλλά
          απαιτεί <InlineMath>{'n^4'}</InlineMath> κελιά — για{' '}
          <InlineMath>{'n = 1000'}</InlineMath> αυτό είναι{' '}
          <InlineMath>{'10^{12}'}</InlineMath> bytes. Πέφτει η μνήμη πριν η
          CPU.
        </p>
        <p>
          <strong>Το hash σπάει αυτόν τον δεσμό.</strong> Ένας πίνακας
          κατακερματισμού κρατά <em>μόνο</em> <InlineMath>{'n'}</InlineMath>{' '}
          εγγραφές αλλά εξακολουθεί να απαντά <InlineMath>{'O(1)'}</InlineMath>{' '}
          κατά μέσο όρο — δεν τον νοιάζει το μέγεθος της τιμής που ψάχνεις,
          μόνο πόσες τιμές υπάρχουν στη συλλογή. Αυτό είναι το βασικό κέρδος
          του hash σε σχέση με την άμεση διευθυνσιοδότηση.
        </p>
        <PairSumHashStream />
        <p>
          <strong>
            Ο αλγόριθμος — δύο περάσματα, καθαρά <InlineMath>{'O(n)'}</InlineMath>.
          </strong>
        </p>
        <ul>
          <li>
            <strong>Φάση 1.</strong> Για κάθε <InlineMath>{'i'}</InlineMath>,
            εισάγαγε στο hash <InlineMath>{'H'}</InlineMath> το ζεύγος (τιμή{' '}
            <InlineMath>{'A[i]'}</InlineMath>, δείκτης{' '}
            <InlineMath>{'i'}</InlineMath>). Συνολικά{' '}
            <InlineMath>{'n'}</InlineMath> εγγραφές,{' '}
            <InlineMath>{'O(n)'}</InlineMath> αναμενόμενα.
          </li>
          <li>
            <strong>Φάση 2.</strong> Για κάθε <InlineMath>{'i'}</InlineMath>,
            υπολόγισε το συμπλήρωμα{' '}
            <InlineMath>{'b = x - A[i]'}</InlineMath> και ψάξε το στο{' '}
            <InlineMath>{'H'}</InlineMath>. Αν βρεθεί σε δείκτη{' '}
            <InlineMath>{'j \\ne i'}</InlineMath>, εκτύπωσε το ζεύγος{' '}
            <InlineMath>{'(i, j)'}</InlineMath> (φιλτράρισμα{' '}
            <InlineMath>{'i < j'}</InlineMath> αρκεί για να μην το ξαναεκτυπώσεις).
          </li>
        </ul>
        <p>
          <strong>Πολυπλοκότητα.</strong>{' '}
          <InlineMath>{'O(n) + O(n) = O(n)'}</InlineMath> αναμενόμενος χρόνος
          και <InlineMath>{'O(n)'}</InlineMath> χώρος. Σε σύγκριση με τα{' '}
          <InlineMath>{'10^{12}'}</InlineMath> bytes της άμεσης διευθυνσιοδότησης
          — τρεις τάξεις μεγέθους εξοικονόμηση μνήμης, χωρίς απώλεια σε χρόνο.
        </p>
        <Callout type="intuition">
          <p>
            <strong>
              Πρότυπο σκέψης — «μεγάλο εύρος τιμών, λίγα στοιχεία → hash, όχι πίνακας».
            </strong>{' '}
            Όποτε η εκφώνηση λέει «τιμές στο{' '}
            <InlineMath>{'\\{1, \\ldots, U\\}'}</InlineMath>» με{' '}
            <InlineMath>{'U \\gg n'}</InlineMath>, ξέχνα την άμεση
            διευθυνσιοδότηση — θες χώρο που εξαρτάται από τα <em>στοιχεία</em>,
            όχι από το <em>εύρος</em>. Hash: <InlineMath>{'n'}</InlineMath>{' '}
            εγγραφές, <InlineMath>{'O(1)'}</InlineMath> αναμενόμενη αναζήτηση.
            Παγίδα: γράψε πάντα «αναμενόμενο» — με χειρότερη υλοποίηση το hash
            πέφτει σε <InlineMath>{'O(n^2)'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },

  // ── Σεπτέμβριος 2023 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt6-th1',
    title: 'Σεπτέμβριος 2023 · Θέμα 1 — BFS/DFS & εύρεση γειτόνων N(v)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2023',
    problemNumber: 'Θέμα 1',
    weight: 15,
    difficulty: 'easy',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>
          Δίνεται ένας μη κατευθυνόμενος γράφος <InlineMath>{'G = (V, E, W)'}</InlineMath> με <InlineMath>{'|V|'}</InlineMath> κόμβους, <InlineMath>{'|E| = \\Theta(|V|)'}</InlineMath> ακμές, και <InlineMath>{'\\Delta(v)'}</InlineMath> ο βαθμός του κόμβου <InlineMath>{'v'}</InlineMath>.
        </p>
        <p><strong>i.</strong> Να δοθεί η πολυπλοκότητα των <InlineMath>{'\\text{BFS}()'}</InlineMath>, <InlineMath>{'\\text{DFS}()'}</InlineMath> στον <InlineMath>{'G'}</InlineMath>.</p>
        <p><strong>ii.</strong> Να δοθεί αλγόριθμος σε φυσική γλώσσα που βρίσκει τους γείτονες <InlineMath>{'N(v)'}</InlineMath> ενός κόμβου <InlineMath>{'v'}</InlineMath> του <InlineMath>{'G'}</InlineMath> και να υπολογιστεί η πολυπλοκότητά του όταν: (α) η αναπαράσταση του <InlineMath>{'G'}</InlineMath> είναι με λίστες γειτνίασης· (β) η αναπαράσταση του <InlineMath>{'G'}</InlineMath> είναι με πίνακα γειτνίασης.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>i. Πολυπλοκότητα BFS/DFS.</strong> Και οι δύο διασχίσεις «αγγίζουν» κάθε κόμβο το πολύ μία φορά και κάθε ακμή σταθερό αριθμό φορών, άρα τρέχουν σε <InlineMath>{'O(|V| + |E|)'}</InlineMath>. Εδώ μας λέει η εκφώνηση ότι <InlineMath>{'|E| = \\Theta(|V|)'}</InlineMath> — ο γράφος είναι <em>αραιός</em>, οι ακμές μεγαλώνουν στον ίδιο ρυθμό με τους κόμβους. Άρα:</p>
        <BlockMath>{'O(|V| + |E|) = O(|V| + \\Theta(|V|)) = O(|V|)'}</BlockMath>
        <p>Γραμμικός χρόνος ως προς το πλήθος των κόμβων — όχι τετραγωνικός, παρότι ο πίνακας γειτνίασης θα ήταν <InlineMath>{'|V| \\times |V|'}</InlineMath> και θα έδινε από μόνος του <InlineMath>{'O(|V|^2)'}</InlineMath>. Η <em>επιλογή αναπαράστασης</em> είναι αυτή που σώζει.</p>
        <p><strong>ii. Εύρεση των γειτόνων <InlineMath>{'N(v)'}</InlineMath>.</strong> «Γείτονας» του <InlineMath>{'v'}</InlineMath> είναι κάθε κόμβος που συνδέεται μαζί του με ακμή. Το πόσο γρήγορα τους βρίσκουμε εξαρτάται <em>μόνο</em> από το πώς είναι αποθηκευμένος ο γράφος. Διάλεξε στο εργαλείο μια κορυφή{' '}
        <InlineMath>{'v'}</InlineMath> και δες ποιος δείκτης σταματά στο πραγματικό όριο και ποιος συνεχίζει να σαρώνει τυφλά:</p>
        <NeighborhoodCostViz />
        <p><strong>(α) Λίστες γειτνίασης.</strong> Ο γράφος κρατά, ανά κόμβο, μια λίστα με <em>ακριβώς</em> τους γείτονές του. Αλγόριθμος: «πήγαινε στη λίστα του <InlineMath>{'v'}</InlineMath> και διάβασέ την μέχρι το τέλος». Η λίστα έχει <InlineMath>{'\\Delta(v)'}</InlineMath> κελιά. Πληρώνεις <InlineMath>{'O(\\Delta(v))'}</InlineMath> — μόνο όσους γείτονες πραγματικά υπάρχουν.</p>
        <p><strong>(β) Πίνακας γειτνίασης.</strong> Ο γράφος κρατά πίνακα <InlineMath>{'|V| \\times |V|'}</InlineMath>· το κελί <InlineMath>{'[v][u]'}</InlineMath> λέει αν υπάρχει ακμή <InlineMath>{'v\\!-\\!u'}</InlineMath>. Αλγόριθμος: «σάρωσε ολόκληρη τη γραμμή <InlineMath>{'v'}</InlineMath> και κράτα τα κελιά που είναι <InlineMath>{'1'}</InlineMath>». Η γραμμή έχει <InlineMath>{'|V|'}</InlineMath> κελιά — τα διαβάζεις όλα, ακόμη κι αν ο <InlineMath>{'v'}</InlineMath> έχει μόνο 2 γείτονες. Χρόνος <InlineMath>{'O(|V|)'}</InlineMath>.</p>
        <p><strong>Το συμπέρασμα.</strong> Σε αραιό γράφο όπου ο μέσος βαθμός είναι μικρός, οι λίστες κερδίζουν με μεγάλη διαφορά: <InlineMath>{'O(\\Delta(v))'}</InlineMath> αντί για <InlineMath>{'O(|V|)'}</InlineMath> — και αυτή η διαφορά, αθροισμένη πάνω σε όλους τους κόμβους όλων των αλγορίθμων γραφημάτων (BFS, DFS, Dijkstra, Prim), είναι η διαφορά <InlineMath>{'\\Theta(|V|+|E|)'}</InlineMath> έναντι <InlineMath>{'\\Theta(|V|^2)'}</InlineMath>.</p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «η αναπαράσταση καθορίζει την πολυπλοκότητα».</strong>{' '}
            Πριν διατυπώσεις πολυπλοκότητα γραφο-αλγορίθμου, ρώτησε
            ΠΡΩΤΑ: «λίστες ή πίνακας;». Όταν η εκφώνηση δίνει{' '}
            <InlineMath>{'|E| = \\Theta(|V|)'}</InlineMath> (αραιός), είναι
            σχεδόν βέβαιο ότι περιμένει απάντηση γραμμική στο{' '}
            <InlineMath>{'|V|'}</InlineMath> — και τη γράφεις μόνο αν
            προϋποθέτεις λίστες γειτνίασης.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt6-th2',
    title: 'Σεπτέμβριος 2023 · Θέμα 2 — Χρονοπρογραμματισμός με βάρη (πλατφόρμα δόνησης)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2023',
    problemNumber: 'Θέμα 2',
    weight: 35,
    difficulty: 'hard',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>Το γυμναστήριο της γειτονιάς σας απέκτησε πρόσφατα μια υπερσύγχρονη πλατφόρμα δόνησης, ένα πολύ ακριβό όργανο που υπόσχεται μυϊκή ενδυνάμωση. Πολλοί αθλούμενοι θέλουν να τη χρησιμοποιήσουν: κάθε αίτημα <InlineMath>{'i'}</InlineMath> χαρακτηρίζεται από έναν χρόνο έναρξης <InlineMath>{'s_i'}</InlineMath>, έναν χρόνο λήξης <InlineMath>{'e_i'}</InlineMath> και μια συνδρομή <InlineMath>{'p_i'}</InlineMath> που είναι διατεθειμένος να πληρώσει. Υπάρχει μόνο μία πλατφόρμα, οπότε δεν μπορούν να εξυπηρετηθούν δύο αιτήματα που επικαλύπτονται χρονικά. Το γυμναστήριο θέλει να επιλέξει ένα υποσύνολο <InlineMath>{'S \\subseteq \\{1, 2, \\dots, n\\}'}</InlineMath> μη επικαλυπτόμενων αιτημάτων ώστε να μεγιστοποιηθεί το συνολικό άθροισμα των συνδρομών.</p>
        <p><strong>(Α)</strong> Θεωρήστε τον εξής άπληστο αλγόριθμο: ταξινόμησε τα αιτήματα κατά φθίνουσα συνδρομή, διάλεξε το πρώτο, και κατόπιν, σαρώνοντας τη λίστα, διάλεξε κάθε επόμενο αίτημα που είναι συμβατό (δεν επικαλύπτεται) με όσα έχεις ήδη επιλέξει. Επιλύει ο αλγόριθμος αυτός το παραπάνω πρόβλημα; Αν όχι, δώστε αντιπαράδειγμα.</p>
        <p><strong>(Β)</strong> Βρείτε την τιμή <InlineMath>{'P[n]'}</InlineMath> (συνολικό άθροισμα των συνδρομών) της βέλτιστης λύσης.</p>
        <p className="text-sm text-fg-subtle"><em>Σημείωση μεταγραφής: το πρωτότυπο είναι αχνό σκαναρισμένο φύλλο με <InlineMath>{'n = 7'}</InlineMath> αιτήματα. Παρακάτω διδάσκουμε πλήρως τη μέθοδο και τη δουλεύουμε σε ένα καθαρό, αντιπροσωπευτικό στιγμιότυπο.</em></p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(Α) Ο άπληστος «κατά συνδρομή» ΔΕΝ είναι βέλτιστος.</strong>{' '}
          Διαλέγοντας πάντα το ακριβότερο αίτημα ρισκάρεις να «μπλοκάρεις» δύο
          φθηνότερα που μαζί αξίζουν περισσότερο.
        </p>
        <p>
          <strong>Αντιπαράδειγμα.</strong> Τρία αιτήματα:{' '}
          <InlineMath>{'A = [0, 10]'}</InlineMath> με{' '}
          <InlineMath>{'p_A = 100'}</InlineMath>·{' '}
          <InlineMath>{'B = [0, 5]'}</InlineMath> με{' '}
          <InlineMath>{'p_B = 60'}</InlineMath>·{' '}
          <InlineMath>{'C = [6, 10]'}</InlineMath> με{' '}
          <InlineMath>{'p_C = 60'}</InlineMath>. Ο άπληστος ξεκινά με{' '}
          <InlineMath>{'A'}</InlineMath> (ακριβότερο, 100). Τότε{' '}
          <InlineMath>{'B'}</InlineMath> και <InlineMath>{'C'}</InlineMath>{' '}
          επικαλύπτονται με το <InlineMath>{'A'}</InlineMath> και απορρίπτονται
          → σύνολο 100. Η σωστή λύση{' '}
          <InlineMath>{'\\{B, C\\}'}</InlineMath> δεν επικαλύπτεται → σύνολο 120,
          νικάει.
        </p>
        <p>
          <strong>(Β) Η σωστή λύση: δυναμικός προγραμματισμός (weighted interval
          scheduling).</strong> Ίδιος αλγόριθμος με το{' '}
          <a href="/lectures/L14-dp-i#" className="underline">L14</a>, εφαρμοσμένος στα
          τρία αιτήματα του αντιπαραδείγματος. Παρακολούθησε τον πίνακα{' '}
          <InlineMath>{'M'}</InlineMath> να γεμίζει:
        </p>
        <WeightedIntervalDP instance="platform" />
        <p>
          <strong>Τα 4 βήματα του αλγορίθμου:</strong>
        </p>
        <p>
          <strong>Βήμα 1 — ταξινόμηση.</strong> Ταξινόμησε τα{' '}
          <InlineMath>{'n'}</InlineMath> αιτήματα κατά αύξοντα χρόνο λήξης{' '}
          <InlineMath>{'e_1 \\le e_2 \\le \\dots \\le e_n'}</InlineMath>. Στο
          παράδειγμα: <InlineMath>{'B = [0,5]'}</InlineMath>,{' '}
          <InlineMath>{'A = [0,10]'}</InlineMath>,{' '}
          <InlineMath>{'C = [6,10]'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 2 — προκάτοχος <InlineMath>{'p(j)'}</InlineMath>.</strong>{' '}
          Για κάθε αίτημα <InlineMath>{'j'}</InlineMath>: ο μεγαλύτερος δείκτης{' '}
          <InlineMath>{'i < j'}</InlineMath> με{' '}
          <InlineMath>{'e_i \\le s_j'}</InlineMath>. Στο παράδειγμα:{' '}
          <InlineMath>{'p(B) = 0'}</InlineMath>,{' '}
          <InlineMath>{'p(A) = 0'}</InlineMath>,{' '}
          <InlineMath>{'p(C) = 1'}</InlineMath> (το{' '}
          <InlineMath>{'B'}</InlineMath> λήγει στο 5, το{' '}
          <InlineMath>{'C'}</InlineMath> αρχίζει στο 6 → συμβατά).
        </p>
        <p>
          <strong>Βήμα 3 — αναδρομή.</strong> Έστω{' '}
          <InlineMath>{'P[j]'}</InlineMath> = μέγιστο άθροισμα χρησιμοποιώντας
          τα πρώτα <InlineMath>{'j'}</InlineMath> αιτήματα. Δυαδική απόφαση «το{' '}
          <InlineMath>{'j'}</InlineMath> μέσα ή έξω;»:
        </p>
        <BlockMath>{'P[j] = \\max\\bigl(\\,P[j-1],\\;\\; p_j + P[p(j)]\\,\\bigr), \\qquad P[0] = 0'}</BlockMath>
        <p>
          Στο παράδειγμα: <InlineMath>{'P[1] = 60'}</InlineMath> (μόνο{' '}
          <InlineMath>{'B'}</InlineMath>);{' '}
          <InlineMath>{'P[2] = \\max(60,\\ 100+0) = 100'}</InlineMath> (νικάει{' '}
          <InlineMath>{'A'}</InlineMath>); <strong>όμως</strong>{' '}
          <InlineMath>{'P[3] = \\max(100,\\ 60 + P[1]) = \\max(100,\\ 120) = 120'}</InlineMath>{' '}
          — το <InlineMath>{'C'}</InlineMath> «μέσα» κερδίζει, και η αναδρομή
          μέσω <InlineMath>{'P[p(C)] = P[1]'}</InlineMath> ανακτά αυτόματα το{' '}
          <InlineMath>{'B'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 4 — ανάκτηση.</strong>{' '}
          <InlineMath>{'P[n] = P[3] = 120'}</InlineMath>· πέρασμα προς τα πίσω
          βγάζει το ίδιο σύνολο{' '}
          <InlineMath>{'\\{B, C\\}'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Ταξινόμηση{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath>· υπολογισμός των{' '}
          <InlineMath>{'p(j)'}</InlineMath> σε{' '}
          <InlineMath>{'O(n)'}</InlineMath> με σάρωση δύο δεικτών (βλ. L14)·
          γέμισμα πίνακα <InlineMath>{'O(n)'}</InlineMath>. Σύνολο{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath>.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «greedy by price» δεν λύνει WIS.</strong> Στο
          μη-σταθμισμένο interval scheduling του{' '}
          <a href="/lectures/L11-greedy-i" className="underline">L11</a>, το
          «κατά πρώιμη λήξη» είναι αποδεδειγμένα βέλτιστο. Με βάρη όμως, ΚΑΝΕΝΑ
          απλό κριτήριο σειράς δεν δουλεύει — «κατά τιμή» αποτυγχάνει εδώ, «κατά
          λήξη» αποτυγχάνει σε ευρύτερες περιπτώσεις (βλ.{' '}
          <em>GreedyFailsWeighted</em> στο L14). Σήμα: μόλις δεις{' '}
          <em>«ζητούμε μέγιστο άθροισμα <strong>τιμών/βαρών</strong> μη
          επικαλυπτόμενων»</em>, στρώσε τον DP <strong>weighted interval
          scheduling</strong> με τα 4 βήματα — μην ψάχνεις απλό κριτήριο
          ταξινόμησης.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt6-th3',
    title: 'Σεπτέμβριος 2023 · Θέμα 3 — Master Theorem & επιδιόρθωση σωρού',
    topic: 'data-structures',
    origin: 'past-exam',
    source: 'sept-2023',
    problemNumber: 'Θέμα 3',
    weight: 25,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i', 'lectures/L10-data-structures'],
    statement: (
      <>
        <p><strong>(Α)</strong> Να επιλυθεί η αναδρομική εξίσωση <InlineMath>{'T(n) = 3\\,T(2n/3) + c'}</InlineMath>, όπου <InlineMath>{'T(1) = \\Theta(1)'}</InlineMath> και <InlineMath>{'c'}</InlineMath> μια σταθερά θετική, με χρήση του Θεωρήματος Κυριαρχίας (Master Theorem).</p>
        <p><strong>(Β)</strong> Η ακολουθία <InlineMath>{'t_1, t_2, \\dots, t_n'}</InlineMath> είναι αποθηκευμένη στον μονοδιάστατο πίνακα <InlineMath>{'H'}</InlineMath> υπό δομή σωρού (max-heap). Κάποιος όρος <InlineMath>{'t_s'}</InlineMath> αλλάζει και παίρνει μικρότερη τιμή. Ο νέος πίνακας <InlineMath>{'H'}</InlineMath> ενδέχεται να μην είναι πλέον σωρός.</p>
        <p><strong>i.</strong> Να δοθεί σύντομα ένας αναδρομικός αλγόριθμος <InlineMath>{'RA(H, i)'}</InlineMath> που διατηρεί στον <InlineMath>{'H'}</InlineMath> τη δομή σωρού. <strong>ii.</strong> Να δοθεί η αναδρομική σχέση <InlineMath>{'S(n)'}</InlineMath> που περιγράφει την πολυπλοκότητα του αλγορίθμου στη χείριστη περίπτωση. <strong>iii.</strong> Να επιλυθεί η <InlineMath>{'S(n)'}</InlineMath>, με <InlineMath>{'S(1) = \\Theta(1)'}</InlineMath>. <strong>iv.</strong> Εφαρμόστε τον αλγόριθμο για έναν εσωτερικό κόμβο που κρατούσε την τιμή <InlineMath>{'14'}</InlineMath>, όταν αυτή αλλάζει σε <InlineMath>{'13'}</InlineMath> και όταν αλλάζει σε <InlineMath>{'6'}</InlineMath> (τα παιδιά του κόμβου κρατούν τις τιμές <InlineMath>{'8'}</InlineMath> και <InlineMath>{'10'}</InlineMath>).</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(Α) Master Theorem — η περίπτωση 1, όπου τα φύλλα κυριαρχούν.</strong>{' '}
          Διαβάζοντας <InlineMath>{'T(n) = 3T(2n/3) + c'}</InlineMath> με τη γλώσσα του
          θεωρήματος: <InlineMath>{'a = 3'}</InlineMath> (πόσες κλήσεις ανά επίπεδο),{' '}
          <InlineMath>{'b = 3/2'}</InlineMath> (αφού{' '}
          <InlineMath>{'2n/3 = n/(3/2)'}</InlineMath>),{' '}
          <InlineMath>{'f(n) = c = \\Theta(1)'}</InlineMath>. Το «κατώφλι» του
          θεωρήματος είναι το{' '}
          <InlineMath>{'n^{\\log_b a} = n^{\\log_{3/2} 3} \\approx n^{2{,}71}'}</InlineMath>.
        </p>
        <p>
          Αυτό είναι <em>πολυωνυμικά μεγαλύτερο</em> από το{' '}
          <InlineMath>{'f(n) = \\Theta(1)'}</InlineMath> — οπότε το άθροισμα των
          φύλλων κερδίζει· περίπτωση 1.
        </p>
        <BlockMath>{'T(n) = \\Theta\\!\\left(n^{\\log_{3/2} 3}\\right) \\approx \\Theta(n^{2{,}71})'}</BlockMath>
        <p>
          Διαισθητικά: σε κάθε επίπεδο τριπλασιάζονται οι κόμβοι, ενώ το μέγεθος
          μειώνεται μόνο κατά <InlineMath>{'2/3'}</InlineMath>. Η δουλειά
          εκτοξεύεται προς τα κάτω. Δες πόσο διαφορετική γίνεται η εικόνα όταν
          μένει η ίδια διαίρεση αλλά αλλάξει μόνο το <InlineMath>{'a'}</InlineMath>:
        </p>
        <MasterCase1Tree />
        <p>
          Με την ίδια διαίρεση <InlineMath>{'2n/3'}</InlineMath> ανά κλήση, ένα
          μόνο μικρότερο <InlineMath>{'a'}</InlineMath> καταρρέει την απάντηση
          από <InlineMath>{'n^{2{,}71}'}</InlineMath> σε{' '}
          <InlineMath>{'\\log n'}</InlineMath>. Κράτα αυτή την εικόνα — θα μας
          χρειαστεί ξανά στο (Β-iii).
        </p>
        <p>
          <strong>
            (Β) i. Ο αλγόριθμος <InlineMath>{'RA(H, i)'}</InlineMath> — «βύθιση» (sift-down).
          </strong>{' '}
          Σε max-heap κάθε γονιός είναι <InlineMath>{'\\ge'}</InlineMath> από τα
          παιδιά του. Όταν ένας όρος <em>μικραίνει</em>, το μόνο που μπορεί να
          χαλάσει είναι: ο κόμβος να γίνει μικρότερος από κάποιο παιδί του.
          Προς τα πάνω δεν χρειάζεται έλεγχος — ο γονιός του ήταν ήδη μεγαλύτερος
          (και παραμένει, αφού η τιμή μειώθηκε). Άρα η επιδιόρθωση κατευθύνεται
          προς τα <strong>κάτω</strong>:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`RA(H, i):
  μέγιστο := i
  αν αριστερό παιδί υπάρχει και H[left] > H[μέγιστο]: μέγιστο := left
  αν δεξί παιδί υπάρχει και H[right] > H[μέγιστο]:    μέγιστο := right
  αν μέγιστο ≠ i:
      αντάλλαξε H[i] με H[μέγιστο]
      RA(H, μέγιστο)        // αναδρομή στο παιδί που πήρε τον κόμβο`}</pre>
        <p>
          Σύγκρινε τον κόμβο με τα δύο παιδιά του· αν κάποιο είναι μεγαλύτερο,
          αντάλλαξέ τον με το <em>μεγαλύτερο</em> παιδί (όχι με όποιο τύχει —
          αλλιώς θα παραβίαζε αμέσως ξανά την ιδιότητα με το άλλο αδέλφι) και
          επανάλαβε από εκεί. Σταματά όταν ο κόμβος είναι{' '}
          <InlineMath>{'\\ge'}</InlineMath> και από τα δύο παιδιά, ή φτάσει σε
          φύλλο.
        </p>
        <p>
          <strong>ii. Αναδρομική σχέση.</strong> Σε κάθε κλήση γίνεται σταθερή
          δουλειά (δύο συγκρίσεις, μία αντιμετάθεση) και το πολύ <em>μία</em>{' '}
          αναδρομική κλήση σε ένα από τα δύο υποδέντρα. Στη χείριστη περίπτωση
          το υποδέντρο ενός παιδιού έχει μέγεθος μέχρι{' '}
          <InlineMath>{'2n/3'}</InlineMath> κορυφές (όριο για ισοσταθμισμένο
          σωρό):
        </p>
        <BlockMath>{'S(n) = S(2n/3) + \\Theta(1)'}</BlockMath>
        <p>
          <strong>iii. Επίλυση.</strong> Αυτό είναι ακριβώς η περίπτωση{' '}
          <InlineMath>{'a = 1'}</InlineMath> του πάνω εργαλείου — ίδια διαίρεση
          με το (Α), αλλά <em>χωρίς</em> το τριπλό branching.{' '}
          <InlineMath>{'n^{\\log_{3/2} 1} = n^0 = 1'}</InlineMath>, ίσο με το{' '}
          <InlineMath>{'f(n) = \\Theta(1)'}</InlineMath> → <strong>περίπτωση 2</strong>:
        </p>
        <BlockMath>{'S(n) = \\Theta(\\log n)'}</BlockMath>
        <p>
          Λογικά: η βύθιση διασχίζει το πολύ ένα μονοπάτι από τον κόμβο μέχρι
          ένα φύλλο. Το ύψος ενός σωρού <InlineMath>{'n'}</InlineMath> στοιχείων
          είναι <InlineMath>{'\\Theta(\\log n)'}</InlineMath> — άρα το{' '}
          <InlineMath>{'\\log n'}</InlineMath> δεν είναι μαθηματικό τέχνασμα,
          είναι το <em>ύψος του δέντρου</em>.
        </p>
        <p>
          <strong>iv. Εφαρμογή — δύο σενάρια.</strong> Ο επηρεαζόμενος κόμβος
          είχε τιμή <InlineMath>{'14'}</InlineMath> με παιδιά{' '}
          <InlineMath>{'8'}</InlineMath> και <InlineMath>{'10'}</InlineMath>.
          Άλλαξε την τιμή — δες τι κάνει το <InlineMath>{'RA'}</InlineMath>:
        </p>
        <MaxHeapKeyDecrease />
        <ul>
          <li>
            <strong><InlineMath>{'14 \\to 13'}</InlineMath>:</strong> ο{' '}
            <InlineMath>{'RA'}</InlineMath> κάνει μία σύγκριση, αναγνωρίζει ότι{' '}
            <InlineMath>{'13 \\ge \\max(8, 10) = 10'}</InlineMath> και σταματά
            αμέσως — <strong>καμία αντιμετάθεση</strong>.
          </li>
          <li>
            <strong><InlineMath>{'14 \\to 6'}</InlineMath>:</strong> δύο
            αντιμεταθέσεις. Το <InlineMath>{'6'}</InlineMath> κατεβαίνει
            διαδοχικά κάτω από <InlineMath>{'10'}</InlineMath>, μετά κάτω από{' '}
            <InlineMath>{'9'}</InlineMath>, και σταματά όταν συναντήσει παιδί{' '}
            <InlineMath>{'\\le'}</InlineMath>. Συνολικά διασχίζει μονοπάτι
            μήκους <InlineMath>{'2'}</InlineMath> — γενικά μέχρι{' '}
            <InlineMath>{'\\le \\log_2 n'}</InlineMath>.
          </li>
        </ul>
        <Callout type="key">
          <p>
            <strong>
              Πρότυπο σκέψης — «κάθε σωρός-πράξη φωτογραφίζεται από το ύψος του δέντρου».
            </strong>{' '}
            Heapify-up, heapify-down, decrease-key, increase-key: όλες διασχίζουν
            ένα μονοπάτι από κορυφή σε ρίζα ή σε φύλλο. Άρα κοστίζουν{' '}
            <InlineMath>{'O(\\log n)'}</InlineMath>, και η αναδρομική τους
            σχέση είναι πάντα της μορφής{' '}
            <InlineMath>{'S(n) = S(\\text{παιδί ή γονέας}) + O(1)'}</InlineMath>,
            στην περίπτωση 2 του Master Theorem. Διαφορετική κατεύθυνση — ίδιο
            φράγμα. Σημείωσε επίσης την παγίδα του (i): πάντα ανταλλαγή με το{' '}
            <em>μεγαλύτερο</em> παιδί, ποτέ τυχαία επιλογή.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt6-th4',
    title: 'Σεπτέμβριος 2023 · Θέμα 4 — Υπόδεντρο ελάχιστου βάρους & κλάσεις P/NP',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2023',
    problemNumber: 'Θέμα 4',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Θεωρήστε ένα γράφο <InlineMath>{'G = (V, E, W)'}</InlineMath> με <InlineMath>{'|V| = n'}</InlineMath>, <InlineMath>{'|E| = m'}</InlineMath> και <InlineMath>{'W'}</InlineMath> μια συνάρτηση που ορίζει θετικά ακέραια βάρη στις πλευρές. Έστω <InlineMath>{'S \\subseteq V'}</InlineMath>. Θέλουμε να βρούμε ένα δέντρο <InlineMath>{'T = (V\', E\')'}</InlineMath> υπογράφο του <InlineMath>{'G'}</InlineMath> ελάχιστου βάρους που περιέχει το <InlineMath>{'S'}</InlineMath>. Θεωρήστε το πρόβλημα <InlineMath>{'\\Pi'}</InlineMath> όπου <InlineMath>{'|S| = n'}</InlineMath>.</p>
        <p><strong>(i)</strong> Να γραφεί το πρόβλημα απόφασης <InlineMath>{'\\Pi_A'}</InlineMath> του <InlineMath>{'\\Pi'}</InlineMath>. <strong>(ii)</strong> Να δειχθεί ότι <InlineMath>{'\\Pi_A'}</InlineMath> ανήκει στην κλάση <InlineMath>{'NP'}</InlineMath>. <strong>(iii)</strong> Να δειχθεί ότι <InlineMath>{'\\Pi_A'}</InlineMath> ανήκει στην κλάση <InlineMath>{'P'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η κρίσιμη παρατήρηση — μην πεις «δύσκολο» πριν διαβάσεις την υπόθεση.</strong>{' '}
          Όταν <InlineMath>{'|S| = n'}</InlineMath>, το <InlineMath>{'S'}</InlineMath>{' '}
          αναγκαστικά είναι όλο το <InlineMath>{'V'}</InlineMath>. Ένα δέντρο
          υπογράφος του <InlineMath>{'G'}</InlineMath> που «περιέχει το{' '}
          <InlineMath>{'S'}</InlineMath>» χρειάζεται να αγγίζει κάθε κορυφή —
          δηλαδή είναι <strong>συνδετικό δέντρο</strong>. Το{' '}
          <InlineMath>{'\\Pi'}</InlineMath> εκφυλίζεται στο γνωστό{' '}
          <strong>MST</strong>.{' '}
          <em>(Η πλήρης γενική εκδοχή με αυθαίρετο S είναι το Steiner Tree —
          NP-πλήρες — άρα η υπόθεση «|S| = n» είναι αυτή που κάνει το πρόβλημα
          εύκολο.)</em>
        </p>
        <p>
          <strong>(i) Πρόβλημα απόφασης <InlineMath>{'\\Pi_A'}</InlineMath>.</strong>{' '}
          Με κατώφλι: «Δοθέντος γράφου <InlineMath>{'G = (V, E, W)'}</InlineMath>{' '}
          και ακεραίου <InlineMath>{'k'}</InlineMath>, υπάρχει συνδετικό δέντρο
          του <InlineMath>{'G'}</InlineMath> με συνολικό βάρος{' '}
          <InlineMath>{'\\le k'}</InlineMath>;»
        </p>
        <p>
          <strong>(ii) <InlineMath>{'\\Pi_A \\in NP'}</InlineMath>.</strong>{' '}
          Πιστοποιητικό = το ίδιο το δέντρο <InlineMath>{'T'}</InlineMath>.
          Επαληθευτής: (α) <InlineMath>{'|T| = n - 1'}</InlineMath> ακμές· (β){' '}
          συνεκτικό + ακυκλικό (BFS/DFS σε <InlineMath>{'O(n + m)'}</InlineMath>)·
          (γ) <InlineMath>{'\\sum_e W(e) \\le k'}</InlineMath> (άθροιση{' '}
          <InlineMath>{'O(n)'}</InlineMath>). Όλα πολυωνυμικά →{' '}
          <InlineMath>{'\\Pi_A \\in NP'}</InlineMath>.
        </p>
        <p>
          <strong>(iii) <InlineMath>{'\\Pi_A \\in P'}</InlineMath>.</strong>{' '}
          Τρέξε <strong>Kruskal</strong> ή <strong>Prim</strong> σε{' '}
          <InlineMath>{'O(m \\log n)'}</InlineMath>, βρες το βάρος{' '}
          <InlineMath>{'W^*'}</InlineMath> του ΕΣΔ, απάντησε «ναι» αν{' '}
          <InlineMath>{'W^* \\le k'}</InlineMath>.
        </p>
        <p>
          Στον «ζωολογικό κήπο»: το MST απόφασης ζει στο{' '}
          <span className="text-success">P</span>. Παρόμοιο πρόβλημα Steiner
          Tree (αυθαίρετο S) θα ήταν NP-πλήρες — η υπόθεση{' '}
          <InlineMath>{'|S| = n'}</InlineMath> είναι το κλειδί.
        </p>
        <ComplexityZooLab focus="mst-decision" />
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «πρώτα διάβασε ποια ακριβώς εκδοχή».</strong>{' '}
            Πολλά «δύσκολα» προβλήματα έχουν εύκολη ειδική περίπτωση και αντίστροφα:
            Steiner Tree (αυθαίρετο S) NP-πλήρες, ίδιο πρόβλημα με|S| = n
            (MST) στο P· INDEP γενικό NP-πλήρες, σταθερό k στο P· longest path
            NP-πλήρες, shortest path στο P. Πάντα κοιτάς ΠΟΙΑ είναι η εκδοχή
            που σου ζητείται.
          </p>
        </Callout>
      </>
    ),
  },
  // ── Ιούνιος 2022 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt7-th1',
    title: 'Ιούνιος 2022 · Θέμα 1 — Ανεξάρτητο σύνολο: NP και P για σταθερό k',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2022',
    problemNumber: 'Θέμα 1',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Θεωρήστε το πρόβλημα του ανεξάρτητου συνόλου:</p>
        <p><strong>INDEP:</strong> Δοθέντος ενός μη κατευθυνόμενου γράφου <InlineMath>{'G'}</InlineMath> με <InlineMath>{'n'}</InlineMath> κόμβους και ενός μη αρνητικού ακεραίου <InlineMath>{'k \\le n'}</InlineMath>, περιέχει ο <InlineMath>{'G'}</InlineMath> <InlineMath>{'k'}</InlineMath>-ανεξάρτητο σύνολο; (Ένα <InlineMath>{'k'}</InlineMath>-ανεξάρτητο σύνολο είναι <InlineMath>{'k'}</InlineMath> κόμβοι που ανά 2 δεν συνδέονται με ακμή.)</p>
        <p><strong>i.</strong> Αποδείξτε ότι το πρόβλημα INDEP ανήκει στην κλάση <InlineMath>{'NP'}</InlineMath>.</p>
        <p><strong>ii.</strong> Αποδείξτε ότι όταν το <InlineMath>{'k'}</InlineMath> έχει σταθερή τιμή, π.χ. <InlineMath>{'k = 1000'}</InlineMath>, τότε το πρόβλημα INDEP ανήκει στην κλάση <InlineMath>{'P'}</InlineMath>. (Να περιγραφεί σύντομα σε φυσική γλώσσα ο αλγόριθμος και να δοθεί η πολυπλοκότητα.)</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. <InlineMath>{'\\text{INDEP} \\in NP'}</InlineMath>.</strong>{' '}
          Πιστοποιητικό = ένα σύνολο <InlineMath>{'U'}</InlineMath> από{' '}
          <InlineMath>{'k'}</InlineMath> κόμβους. Επαληθευτής: για κάθε από τα{' '}
          <InlineMath>{'\\binom{k}{2} = O(k^2)'}</InlineMath> ζεύγη μέσα στο{' '}
          <InlineMath>{'U'}</InlineMath>, ελέγχουμε ΟΤΙ ΔΕΝ υπάρχει ακμή
          (πίνακας γειτνίασης, <InlineMath>{'O(1)'}</InlineMath> ανά ζεύγος).
          Συνολικά <InlineMath>{'O(k^2) = O(n^2)'}</InlineMath> — πολυωνυμικό.
        </p>
        <p>
          <strong>ii. Σταθερό <InlineMath>{'k = 1000'}</InlineMath> →{' '}
          <InlineMath>{'\\text{INDEP} \\in P'}</InlineMath>.</strong>
        </p>
        <p>
          <strong>Ο αλγόριθμος (ωμή βία).</strong> Εξέτασε όλα τα{' '}
          <InlineMath>{'\\binom{n}{k}'}</InlineMath> υποσύνολα μεγέθους{' '}
          <InlineMath>{'k'}</InlineMath>. Για κάθε ένα, ένας{' '}
          <InlineMath>{'O(k^2)'}</InlineMath> έλεγχος. Αν βρεθεί έστω ένα
          ανεξάρτητο, απάντα «ΝΑΙ»· αλλιώς «ΟΧΙ».
        </p>
        <BlockMath>{'O\\!\\left(\\binom{n}{k} \\cdot k^2\\right) = O\\!\\left(n^k \\cdot k^2\\right)'}</BlockMath>
        <p>
          <strong>Γιατί αυτό είναι πολυωνυμικό.</strong> Το{' '}
          <InlineMath>{'k = 1000'}</InlineMath> είναι <em>σταθερά</em> — δεν
          μεγαλώνει με την είσοδο. Άρα <InlineMath>{'O(n^{1000})'}</InlineMath>{' '}
          είναι πολυώνυμο σταθερού βαθμού — εξ ορισμού πολυωνυμικό, άρα{' '}
          <InlineMath>{'\\text{INDEP} \\in P'}</InlineMath>.{' '}
          <em>Όχι πρακτικά γρήγορο — αλγοριθμικά πολυωνυμικό.</em>
        </p>
        <p>
          <strong>Η αντίθεση με τη γενική εκδοχή.</strong> Όταν το{' '}
          <InlineMath>{'k'}</InlineMath> είναι μέρος της εισόδου και μπορεί να
          φτάσει το <InlineMath>{'n/2'}</InlineMath>, το{' '}
          <InlineMath>{'n^k'}</InlineMath> γίνεται εκθετικό· τότε το INDEP είναι
          NP-πλήρες. Δες πού ζει στον «ζωολογικό κήπο» — και πρόσεξε τον
          συμπληρωματικό συγγενή του, το Vertex Cover:
        </p>
        <ComplexityZooLab focus="independent-set" />
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «σταθερά στην έκθεση είναι σταθερά».</strong>{' '}
            Όταν εμφανίζεται «σταθερό k» (ή «σταθερό d», «σταθερό αλφάβητο»…),
            ο <em>ορισμός</em> του «πολυωνυμικό» δεν επιτρέπει στο k να
            μεγαλώνει. Άρα <InlineMath>{'n^k = n^{1000}'}</InlineMath> είναι
            πολυωνυμικό. Παγίδα: μη μπερδέψεις το {' '}
            <InlineMath>{'n^k'}</InlineMath> με <InlineMath>{'2^n'}</InlineMath>{' '}
            ή <InlineMath>{'k^n'}</InlineMath> — μόνο το πρώτο είναι πολυωνυμικό.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt7-th2',
    title: 'Ιούνιος 2022 · Θέμα 2 — Αναδρομή vs δυναμικός προγραμματισμός',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2022',
    problemNumber: 'Θέμα 2',
    weight: 35,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>Θέλουμε να υπολογιστεί η ακολουθία <InlineMath>{'b_1, b_2, b_3, \\dots, b_n'}</InlineMath> που προκύπτει από τον αναδρομικό τύπο</p>
        <BlockMath>{'b_n = 2 \\max\\{b_{n-1},\\, b_{n-2}\\} + b_{n-3}'}</BlockMath>
        <p>με τους 3 αρχικούς όρους <InlineMath>{'b_1 = b_2 = b_3 = 1'}</InlineMath>. Έστω <InlineMath>{'RB(n)'}</InlineMath> ο αλγόριθμος που στηρίζεται απευθείας στην αναδρομική σχέση. (Δίνεται ότι <InlineMath>{'3^{1/3} = 1{,}44'}</InlineMath>.)</p>
        <p><strong>i.</strong> Γράψτε σε φυσική γλώσσα τον αλγόριθμο <InlineMath>{'RB(n)'}</InlineMath>. <strong>ii.</strong> Δείξτε ότι ο <InlineMath>{'RB(n)'}</InlineMath> είναι εκθετικός, με πολυπλοκότητα <InlineMath>{'\\Omega(1{,}44^{\\,n})'}</InlineMath>. <strong>iii.</strong> Αν χρησιμοποιήσουμε δυναμικό προγραμματισμό (αλγόριθμος <InlineMath>{'DB(n)'}</InlineMath>), πόσα υποπροβλήματα θα οριστούν; <strong>iv.</strong> Δικαιολογήστε ότι η πολυπλοκότητα του <InlineMath>{'DB(n)'}</InlineMath> είναι γραμμική. <strong>v.</strong> Ποιος αλγόριθμος είναι ταχύτερος;</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Ο αναδρομικός <InlineMath>{'RB(n)'}</InlineMath>{' '}
          σε φυσική γλώσσα.</strong>
        </p>
        <p className="rounded-md border border-border bg-bg-soft/40 px-3 py-2 text-sm">
          «Αν <InlineMath>{'n \\le 3'}</InlineMath>, επίστρεψε{' '}
          <InlineMath>{'1'}</InlineMath>. Αλλιώς, κάλεσε αναδρομικά τον εαυτό
          σου για να βρεις τα <InlineMath>{'RB(n-1)'}</InlineMath>,{' '}
          <InlineMath>{'RB(n-2)'}</InlineMath>,{' '}
          <InlineMath>{'RB(n-3)'}</InlineMath>, και επίστρεψε{' '}
          <InlineMath>{'2 \\max\\{RB(n-1), RB(n-2)\\} + RB(n-3)'}</InlineMath>.»
        </p>
        <p>
          <strong>ii. Γιατί είναι εκθετικός — και κάτω φράγμα{' '}
          <InlineMath>{'\\Omega(1{,}44^n)'}</InlineMath>.</strong> Ο{' '}
          <InlineMath>{'RB(n)'}</InlineMath> δεν θυμάται τίποτα: κάθε κλήση
          ξεκινά τους υπολογισμούς από την αρχή. Δες το δέντρο αναδρομής με
          <strong> τρία παιδιά ανά κόμβο</strong>, και μετά μετάβα στο
          «Memoized» για να συγκρίνεις:
        </p>
        <RecursionExplosion instance="tribonacci-max" />
        <p>
          Το κρίσιμο γεωμετρικό σημείο: κάθε κόμβος έχει{' '}
          <strong>3 παιδιά</strong> (<InlineMath>{'b(k-1), b(k-2), b(k-3)'}</InlineMath>),
          και η «αβαθέστερη» κλήση μειώνει το <InlineMath>{'n'}</InlineMath>{' '}
          κατά το πολύ 3. Άρα το δέντρο έχει βάθος{' '}
          <strong><InlineMath>{'\\ge n/3'}</InlineMath></strong> και
          διακλάδωση 3, οπότε:
        </p>
        <BlockMath>{'T(n) \\ge 3 \\cdot T(n-3) \\;\\Rightarrow\\; T(n) \\ge 3^{\\,n/3} = \\bigl(3^{1/3}\\bigr)^{n} = 1{,}44^{\\,n}'}</BlockMath>
        <p>
          Άρα <InlineMath>{'T(n) = \\Omega(1{,}44^{\\,n})'}</InlineMath> —
          εκθετικός. (Ο ακριβής αριθμός κλήσεων είναι κάπως μεγαλύτερος, αλλά
          μας αρκεί αυτό το κάτω φράγμα.)
        </p>
        <p>
          <strong>iii. Υποπροβλήματα του{' '}
          <InlineMath>{'DB(n)'}</InlineMath>.</strong> Τα διαφορετικά
          υποπροβλήματα είναι ακριβώς οι όροι που θέλουμε:{' '}
          <InlineMath>{'b_1, b_2, \\dots, b_n'}</InlineMath>. Πλήθος:{' '}
          <InlineMath>{'n'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath>.
        </p>
        <p>
          <strong>iv. Γιατί ο <InlineMath>{'DB(n)'}</InlineMath> είναι
          γραμμικός.</strong> Από κάτω προς τα πάνω: αρχικοποιεί{' '}
          <InlineMath>{'b_1 = b_2 = b_3 = 1'}</InlineMath>, και για{' '}
          <InlineMath>{'i = 4, \\dots, n'}</InlineMath> υπολογίζει{' '}
          <InlineMath>{'b_i = 2\\max\\{b_{i-1}, b_{i-2}\\} + b_{i-3}'}</InlineMath>{' '}
          διαβάζοντας τρεις ήδη αποθηκευμένες τιμές — δουλειά{' '}
          <InlineMath>{'O(1)'}</InlineMath> ανά όρο. Συνολικά{' '}
          <InlineMath>{'n \\cdot O(1) = \\Theta(n)'}</InlineMath>. Στην εικόνα,
          το «Memoized» επίπεδο: από εκατομμύρια κλήσεις σε μερικές δεκάδες —
          ίδια ακολουθία, μόνο που θυμάται.
        </p>
        <p>
          <strong>v. Ποιος είναι ταχύτερος.</strong>{' '}
          <InlineMath>{'DB(n) = \\Theta(n)'}</InlineMath> είναι ασύγκριτα
          ταχύτερος από{' '}
          <InlineMath>{'RB(n) = \\Omega(1{,}44^{\\,n})'}</InlineMath>. Η μόνη
          διαφορά τους: ο DP <em>θυμάται</em> αντί να ξαναϋπολογίζει — και
          αυτό μετατρέπει το <InlineMath>{'1{,}44^{\\,n}'}</InlineMath> σε{' '}
          <InlineMath>{'n'}</InlineMath>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «επικαλυπτόμενα ⇒ memoize».</strong> Όταν
          μια αναδρομή{' '}
          <InlineMath>{'T(n) = T(n-d_1) + T(n-d_2) + \\dots + T(n-d_k) + O(1)'}</InlineMath>{' '}
          με <InlineMath>{'k \\ge 2'}</InlineMath> εμφανίζεται «ξαναϋπολογίζω
          τα ίδια», η βελτίωση είναι μηχανική: αναγνώρισε ότι τα διαφορετικά
          ορίσματα είναι μόνο <InlineMath>{'n'}</InlineMath> — άρα γέμισε
          έναν πίνακα <InlineMath>{'b[1..n]'}</InlineMath> bottom-up.{' '}
          <em>Κάτω φράγμα εκθετικού</em>:{' '}
          <InlineMath>{'T(n) \\ge k \\cdot T(n - \\max d_i)'}</InlineMath>{' '}
          δίνει
          <InlineMath>{'\\Omega(k^{n / \\max d_i})'}</InlineMath> — δηλαδή
          εδώ <InlineMath>{'\\Omega(3^{n/3}) = \\Omega(1{,}44^n)'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt7-th3',
    title: 'Ιούνιος 2022 · Θέμα 3 — 0/1 σακίδιο: άπληστος vs δυναμικός',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2022',
    problemNumber: 'Θέμα 3',
    weight: 35,
    difficulty: 'hard',
    prerequisites: ['lectures/L15-dp-ii'],
    statement: (
      <>
        <p>Θεωρήστε το <strong>0-1 πρόβλημα του σακιδίου</strong>: μεγιστοποίησε <InlineMath>{'\\sum_{i=1}^{n} c_i x_i'}</InlineMath> υπό τον περιορισμό <InlineMath>{'\\sum_{i=1}^{n} a_i x_i \\le b'}</InlineMath>, με <InlineMath>{'x_i \\in \\{0, 1\\}'}</InlineMath>, όπου τα <InlineMath>{'c_i, a_i, b'}</InlineMath> είναι ακέραιοι.</p>
        <p><strong>i.</strong> Περιγράψτε σε φυσική γλώσσα έναν άπληστο αλγόριθμο <InlineMath>{'KNAPSACK(n, c_i, a_i, b)'}</InlineMath> που επιστρέφει μια εφικτή λύση. <strong>ii.</strong> Υπολογίστε την πολυπλοκότητά του. <strong>iii.</strong> Για το στιγμιότυπο <InlineMath>{'c = (16, 9, 7, 15, 10, 1)'}</InlineMath>, <InlineMath>{'a = (8, 5, 4, 9, 6, 1)'}</InlineMath>, <InlineMath>{'b = 12'}</InlineMath>, εφαρμόστε τον αλγόριθμο. <strong>iv.</strong> Μπορεί ο αλγόριθμος να επιστρέφει πάντα τη βέλτιστη λύση και να είναι πολυωνυμικός; <strong>v.</strong> Με δυναμικό προγραμματισμό, πόσα υποπροβλήματα χρειάζονται; Δώστε την αναδρομική σχέση.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Ο άπληστος αλγόριθμος.</strong> Για κάθε αντικείμενο
          υπολόγισε τον <em>λόγο αξίας ανά βάρος</em>{' '}
          <InlineMath>{'r_i = c_i / a_i'}</InlineMath>. Ταξινόμησε τα
          αντικείμενα κατά <em>φθίνον</em> <InlineMath>{'r_i'}</InlineMath>{' '}
          και σάρωσέ τα: όποιο χωράει ακόμη στο σακίδιο, μπαίνει· αλλιώς,
          προσπερνιέται. Διαίσθηση: «πρώτα τα πιο πυκνά σε αξία ανά κιλό».
        </p>
        <p>
          <strong>ii. Πολυπλοκότητα.</strong> Υπολογισμός λόγων{' '}
          <InlineMath>{'O(n)'}</InlineMath>, ταξινόμηση{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath>, σάρωση{' '}
          <InlineMath>{'O(n)'}</InlineMath>. Σύνολο{' '}
          <strong><InlineMath>{'O(n \\log n)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>iii. Εφαρμογή στο στιγμιότυπο.</strong> Με{' '}
          <InlineMath>{'c = (16,9,7,15,10,1)'}</InlineMath>,{' '}
          <InlineMath>{'a = (8,5,4,9,6,1)'}</InlineMath>,{' '}
          <InlineMath>{'b = 12'}</InlineMath>, οι λόγοι βγαίνουν ήδη φθίνοντες
          με αρχική σειρά αντικειμένων: <InlineMath>{'2 > 1{,}8 > 1{,}75 > 1{,}67 \\approx 1{,}67 > 1'}</InlineMath>.
          Παρακολούθησε τη σάρωση δίπλα-δίπλα με τον DP — και τα δύο
          τερματίζουν στις 23, αλλά ο δρόμος είναι διαφορετικός:
        </p>
        <KnapsackRatioVsDp />
        <p>
          Ο άπληστος βάζει τα αντικείμενα <InlineMath>{'\\{1, 3\\}'}</InlineMath>,
          με βάρος <InlineMath>{'8 + 4 = 12'}</InlineMath> και αξία{' '}
          <strong><InlineMath>{'23'}</InlineMath></strong>. Σε αυτή τη βάση
          εισόδου είναι όντως η βέλτιστη απάντηση — αλλά αυτό είναι{' '}
          <em>τύχη</em>: σε άλλη βάση ο ίδιος αλγόριθμος αποτυγχάνει (δες την
          επόμενη ερώτηση).
        </p>
        <p>
          <strong>iv. Όχι, δεν μπορεί να είναι ταυτόχρονα πολυωνυμικός και
          πάντα βέλτιστος.</strong> Το 0-1 σακίδιο είναι{' '}
          <strong>NP-δύσκολο</strong>· πολυωνυμικός αλγόριθμος που το λύνει
          πάντα βέλτιστα θα έδειχνε <InlineMath>{'P = NP'}</InlineMath>. Ο
          λόγος γιατί ο «λόγος αξίας/βάρους» αποτυγχάνει στο 0-1: ένα μικρό
          αντικείμενο με τέλειο λόγο μπορεί να «κλέψει» τη θέση που θα
          εκμεταλλευόταν καλύτερα ένας συνδυασμός — η διάλεξη το δείχνει
          ζωντανά με <strong>KnapsackGreedyFail</strong> (4 αντικείμενα, ίδιος
          άπληστος, αποτέλεσμα 7 αντί για βέλτιστο 10). Στο{' '}
          <em>κλασματικό</em> σακίδιο, όπου μπορείς να κόψεις, ο ίδιος
          άπληστος είναι αποδεδειγμένα βέλτιστος — εκεί η ταυτότητα «λόγος
          δείχνει σωστά» δεν σπάει επειδή δεν υπάρχει «κενό που δεν γεμίζει».
        </p>
        <p>
          <strong>v. Δυναμικός προγραμματισμός.</strong> Ορίζουμε{' '}
          <InlineMath>{'K(i, w)'}</InlineMath> = η μέγιστη αξία με τα πρώτα{' '}
          <InlineMath>{'i'}</InlineMath> αντικείμενα και χωρητικότητα{' '}
          <InlineMath>{'w'}</InlineMath>. Οι δείκτες παίρνουν{' '}
          <InlineMath>{'i \\in \\{0, \\dots, n\\}'}</InlineMath> και{' '}
          <InlineMath>{'w \\in \\{0, \\dots, b\\}'}</InlineMath>, άρα τα
          υποπροβλήματα είναι <InlineMath>{'(n+1)(b+1) = O(n \\cdot b)'}</InlineMath>.
          Αναδρομή — «μέσα ή έξω» για το αντικείμενο{' '}
          <InlineMath>{'i'}</InlineMath>:
        </p>
        <BlockMath>{'K(i, w) = \\begin{cases} K(i-1, w), & a_i > w \\\\[4pt] \\max\\bigl(K(i-1, w),\\; c_i + K(i-1, w - a_i)\\bigr), & a_i \\le w \\end{cases}'}</BlockMath>
        <p>
          με <InlineMath>{'K(0, w) = 0'}</InlineMath>. Δες τον πίνακα γεμάτο
          στο εργαλείο: το κάτω-δεξιά κελί{' '}
          <InlineMath>{'K(6, 12) = 23'}</InlineMath> επιβεβαιώνει το αποτέλεσμα
          του άπληστου σε αυτή τη βάση εισόδου· για άλλες είσοδες όμως, η
          ΔΥΟ τιμές αποκλίνουν, και ο DP είναι αυτός που λέει την αλήθεια.{' '}
          <strong>Παγίδα ορολογίας:</strong> το{' '}
          <InlineMath>{'O(nb)'}</InlineMath> είναι <em>ψευδοπολυωνυμικό</em> —
          εξαρτάται από την <em>τιμή</em> του <InlineMath>{'b'}</InlineMath>,
          όχι από τα δυφία της.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «μερικές φορές ο άπληστος βγαίνει, αλλά
            δεν υπολογίζεις σε αυτό».</strong> Σε ερωτήσεις «τρέξε greedy + DP
            στο ίδιο στιγμιότυπο», το γεγονός ότι συμπίπτουν δεν αποδεικνύει
            ότι ο άπληστος είναι γενικά σωστός — αποδεικνύει μόνο ότι σε αυτή τη
            βάση εισόδου τυχαίνει να βρει το βέλτιστο. Όταν σε ρωτούν «είναι ο
            άπληστος βέλτιστος;», η σωστή απάντηση είναι «όχι γενικά — το
            πρόβλημα είναι NP-δύσκολο» + ένα <em>αντιπαράδειγμα</em> (όχι το
            πρόσφατο στιγμιότυπο). Η ταυτότητα «λόγος = πυκνότητα αξίας» χρειάζεται{' '}
            «cut-and-fill» για να αποδειχθεί σωστή — άρα δουλεύει στο
            κλασματικό σακίδιο, σπάει στο 0-1.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'pt7-th4',
    title: 'Ιούνιος 2022 · Θέμα 4 — Προβλήματα απόφασης MST & TSP',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2022',
    problemNumber: 'Θέμα 4',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Θεωρήστε τα προβλήματα: ελαχιστοποίηση κόστους ενός δέντρου επικάλυψης (mst) σε ένα γράφο, και ελαχιστοποίηση του κόστους ενός Χαμιλτονιανού κύκλου (TSP) σε έναν πλήρη γράφο.</p>
        <p><strong>i.</strong> Να δοθούν τα αντίστοιχα προβλήματα απόφασης <InlineMath>{'D(ST)'}</InlineMath> και <InlineMath>{'D(TSP)'}</InlineMath>.</p>
        <p><strong>ii.</strong> Με την υπόθεση ότι <InlineMath>{'P \\ne NP'}</InlineMath>: το <InlineMath>{'D(ST)'}</InlineMath> ανήκει στην <InlineMath>{'P'}</InlineMath>; στην <InlineMath>{'NP'}</InlineMath>; είναι <InlineMath>{'NP'}</InlineMath>-complete; Και αντίστοιχα για το <InlineMath>{'D(TSP)'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Τα προβλήματα απόφασης.</strong> Κάθε{' '}
          «βρες min X» μετατρέπεται σε «υπάρχει X ≤ k;» με κατώφλι:
        </p>
        <ul>
          <li>
            <InlineMath>{'D(ST)'}</InlineMath>: «Δοθέντος γράφου{' '}
            <InlineMath>{'G'}</InlineMath> με βάρη και ακεραίου{' '}
            <InlineMath>{'k'}</InlineMath>, υπάρχει συνδετικό δέντρο του{' '}
            <InlineMath>{'G'}</InlineMath> με συνολικό βάρος{' '}
            <InlineMath>{'\\le k'}</InlineMath>;»
          </li>
          <li>
            <InlineMath>{'D(TSP)'}</InlineMath>: «Δοθέντος πλήρους γράφου{' '}
            <InlineMath>{'G'}</InlineMath> με βάρη και ακεραίου{' '}
            <InlineMath>{'k'}</InlineMath>, υπάρχει κύκλος Hamilton με συνολικό
            βάρος <InlineMath>{'\\le k'}</InlineMath>;»
          </li>
        </ul>
        <p>
          <strong>ii. Κατάταξη (με <InlineMath>{'P \\ne NP'}</InlineMath>).</strong>
        </p>
        <p>
          <strong><InlineMath>{'D(ST)'}</InlineMath>:</strong> στο{' '}
          <span className="text-success">P</span> — Kruskal/Prim σε{' '}
          <InlineMath>{'O(m \\log n)'}</InlineMath>. Άρα και στο NP. <em>Όχι</em>{' '}
          NP-complete: αν ήταν, τότε κάθε πρόβλημα του NP θα λυνόταν πολυωνυμικά
          και θα είχαμε <InlineMath>{'P = NP'}</InlineMath> — αντίφαση.
        </p>
        <p>
          <strong><InlineMath>{'D(TSP)'}</InlineMath>:</strong> στο{' '}
          <span className="text-danger">NP</span> — πιστοποιητικό = ο ίδιος ο
          κύκλος· verifier ελέγχει «κάθε κορυφή μία φορά» + «βάρος{' '}
          <InlineMath>{'\\le k'}</InlineMath>». <strong>NP-complete</strong>{' '}
          (κλασικό αποτέλεσμα). Με <InlineMath>{'P \\ne NP'}</InlineMath>, ΟΧΙ
          στο P.
        </p>
        <p>
          <strong>Το ηθικό δίδαγμα — δύο φράσεις, δύο ζώνες του «κήπου».</strong>{' '}
          Δύο προβλήματα που μοιάζουν επιφανειακά («φθηνό υπογράφημα που τα
          συνδέει όλα») έχουν δραματικά διαφορετική δυσκολία. Πάτα και τα δύο
          ονόματα στον ζωολογικό κήπο για να δεις την απόσταση:
        </p>
        <ComplexityZooLab focus="tsp" />
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «δέντρο εύκολο, κύκλος δύσκολο».</strong>{' '}
            Σε ερωτήσεις P/NP για γραφικά προβλήματα, αναγνώρισε σχεδόν αμέσως:
            spanning <em>tree</em> = MST = P· spanning <em>cycle</em> = Hamilton/TSP =
            NPC. Παρόμοια: shortest <em>path</em> = P· longest <em>path</em> = NPC.
            Η αλλαγή μιας λέξης («tree» → «cycle», «short» → «long») μπορεί να
            σε στείλει από εύκολο σε εκθετικό.
          </p>
        </Callout>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #6 — μεταγραμμένο & χωρισμένο ανά διάλεξη ───────
  {
    id: 'front-set-6-ask1',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 1 — Σχεδιασμός ποδηλατικής εκδρομής',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>Είναι διαθέσιμος χάρτης με <InlineMath>{'n'}</InlineMath> πόλεις που συνδέονται με ποδηλατικές διαδρομές. Μία διαδρομή που συνδέει δύο πόλεις <InlineMath>{'u, v'}</InlineMath> έχει απόσταση <InlineMath>{'d(v, u)'}</InlineMath>. Επιπλέον, το κόστος διανυκτέρευσης στην πόλη <InlineMath>{'v'}</InlineMath> είναι <InlineMath>{'c(v)'}</InlineMath>.</p>
        <p>Καλείστε να σχεδιάσετε μία εκδρομή που διαρκεί ακριβώς <InlineMath>{'m'}</InlineMath> ημέρες, ξεκινώντας από την πόλη <InlineMath>{'s'}</InlineMath> και έχοντας ως προορισμό την πόλη <InlineMath>{'t'}</InlineMath>, χωρίς διαμονή στην ίδια πόλη περισσότερες από μία συνεχόμενες ημέρες, και με μέγιστη διανυόμενη απόσταση την ημέρα <InlineMath>{'k'}</InlineMath> ίση με <InlineMath>{'u(k)'}</InlineMath>. Επιπλέον, θέλουμε να ελαχιστοποιηθεί το συνολικό κόστος διαμονής.</p>
        <p>Προσδιορίστε έναν αλγόριθμο με πολυπλοκότητα <InlineMath>{'O(n^2(n + m))'}</InlineMath> για τον σχεδιασμό εκδρομής σε <InlineMath>{'m'}</InlineMath> πόλεις <InlineMath>{'(s = v_0, v_1, \\dots, t = v_m)'}</InlineMath> με ελάχιστο κόστος <InlineMath>{'\\sum c(v_i)'}</InlineMath>, έτσι ώστε <InlineMath>{'d(v_{i-1}, v_i) \\le u(i)'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p>
          Πριν τη μοντελοποίηση, νιώσε γιατί η ημέρα ΔΕΝ είναι αμελητέα. Στο
          συγκεκριμένο δίκτυο 4 πόλεων, σύρε τη μπάρα και δες ποιες ποδηλατικές
          διαδρομές «χωράνε» στα όρια κάθε ημέρας:
        </p>
        <CyclingTripScene />
        <p>
          <strong>Γιατί δεν είναι «απλό» shortest path.</strong> Η εκδρομή έχει
          <em>τρεις συγχρόνους περιορισμούς</em>: «ακριβώς m ημέρες», «όχι δύο
          συνεχόμενες ημέρες στην ίδια πόλη», «η διαδρομή της p-στής ημέρας ≤
          u(p)». Αυτοί δεν χωράνε στον αρχικό γράφο των πόλεων — εκεί δεν
          υπάρχει η έννοια «ημέρα» και τα όρια αλλάζουν ανά μέρα. Το κόλπο
          είναι να <em>ενσωματώσεις τον χρόνο μέσα στον γράφο</em>.
        </p>
        <p>
          <strong>Βήμα 1 — αποστάσεις πόλεων.</strong> Πρώτα υπολογίζουμε όλες
          τις αποστάσεις <InlineMath>{'d(i, j)'}</InlineMath> μεταξύ ζευγών
          πόλεων με <InlineMath>{'n'}</InlineMath> εκτελέσεις Dijkstra (μία ανά
          πόλη ως αφετηρία), η καθεμία{' '}
          <InlineMath>{'O(n^2)'}</InlineMath> → συνολικά{' '}
          <InlineMath>{'O(n^3)'}</InlineMath>. (Αν ο γράφος είναι αραιός, οι
          αποστάσεις βγαίνουν φθηνότερα· κρατάμε όμως το γενικό όριο.)
        </p>
        <p>
          <strong>Βήμα 2 — στρωματωμένος (ακυκλικός) γράφος.</strong> Δημιουργούμε
          κόμβο <InlineMath>{'v_{i,p}'}</InlineMath> για κάθε πόλη{' '}
          <InlineMath>{'i'}</InlineMath> και κάθε ημέρα{' '}
          <InlineMath>{'p \\in \\{0, 1, \\dots, m\\}'}</InlineMath> — δηλαδή{' '}
          <InlineMath>{'n(m+1)'}</InlineMath> κόμβους. Βάζουμε ακμή{' '}
          <InlineMath>{'v_{i,p-1} \\to v_{j,p}'}</InlineMath> μόνο όταν:
        </p>
        <ul>
          <li>
            <InlineMath>{'i \\ne j'}</InlineMath> — αλλάζεις πόλη (ο
            περιορισμός «όχι δύο συνεχόμενες ημέρες στην ίδια»).
          </li>
          <li>
            <InlineMath>{'d(i, j) \\le u(p)'}</InlineMath> — η μετακίνηση χωράει
            στο όριο της ημέρας.
          </li>
        </ul>
        <p>
          Σε αυτήν την ακμή δίνουμε βάρος <InlineMath>{'c(j)'}</InlineMath> — το
          κόστος της νέας διανυκτέρευσης. Παρατήρησε: ο περιορισμός «ακριβώς m
          ημέρες» δεν χρειάζεται να μπει σε λογική του αλγορίθμου — έχει ήδη
          ενσωματωθεί στη γεωμετρία του γράφου, αφού το μονοπάτι από{' '}
          <InlineMath>{'v_{s,0}'}</InlineMath> σε{' '}
          <InlineMath>{'v_{t,m}'}</InlineMath> είναι υποχρεωτικά μήκους{' '}
          <InlineMath>{'m'}</InlineMath> ακμών (μία ανά ημέρα).
        </p>
        <p>
          Δες την κατασκευή σε δράση πάνω σε ένα μικρό παράδειγμα 4 πόλεων / 3
          ημερών:
        </p>
        <LayeredTripPlanner />
        <p>
          <strong>Βήμα 3 — συντομότερο μονοπάτι.</strong> Ο νέος γράφος είναι
          ακυκλικός (κάθε ακμή προχωράει αυστηρά κατά μία ημέρα), άρα το{' '}
          <InlineMath>{'v_{s,0} \\to v_{t,m}'}</InlineMath> shortest path
          βρίσκεται με μία σάρωση σε τοπολογική σειρά (ημέρα-ημέρα), σε χρόνο
          ανάλογο των ακμών, <InlineMath>{'O(n^2 m)'}</InlineMath>. Αν δεν
          υπάρχει τέτοιο μονοπάτι, η εκδρομή είναι αδύνατη με αυτά τα όρια.
        </p>
        <p>
          <strong>Συνολική πολυπλοκότητα.</strong>{' '}
          <InlineMath>{'O(n^3) + O(n^2 m) = O(n^2(n + m))'}</InlineMath> — όπως
          ζητείται.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «ο χρόνος γίνεται διάσταση του γράφου».</strong>{' '}
            Όταν ένα πρόβλημα έχει «φάσεις» (ημέρες, βήματα, χρώματα, καταστάσεις)
            με <em>διαφορετικούς περιορισμούς</em> ή <em>διαφορετικά κόστη</em>{' '}
            ανά φάση, ξεχωρίζεις τις φάσεις ως δεύτερη διάσταση. Κάθε φυσική
            κορυφή <InlineMath>{'i'}</InlineMath> γίνεται{' '}
            <InlineMath>{'(i, \\phi)'}</InlineMath> για κάθε φάση{' '}
            <InlineMath>{'\\phi'}</InlineMath>· οι ακμές προχωρούν τη φάση κατά
            ένα. Αυτό μετατρέπει σχεδόν κάθε «πολυφασικό» πρόβλημα σε shortest
            path σε DAG. Έλεγξε το αν είδες «k βήματα», «t ημέρες», «p στάδια»
            στην εκφώνηση.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-6-ask2',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 2 — 2η/3η ελαφρύτερη ακμή στο MST',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Έστω <InlineMath>{'G = (V, E)'}</InlineMath> ένας απλός συνεκτικός γράφος, του οποίου κάθε ακμή έχει διαφορετικό βάρος. Αποδείξτε αν τα ακόλουθα είναι σωστά ή λαθεμένα:</p>
        <p><strong>Α.</strong> Η ακμή με το <em>δεύτερο</em> μικρότερο βάρος ανήκει στο ελάχιστο δέντρο επικάλυψης (MST) του <InlineMath>{'G'}</InlineMath>.</p>
        <p><strong>Β.</strong> Η ακμή με το <em>τρίτο</em> μικρότερο βάρος ανήκει στο ελάχιστο δέντρο επικάλυψης (MST) του <InlineMath>{'G'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα της απόδειξης.</strong> Ο Kruskal σαρώνει ακμές κατά
          αύξον βάρος, κρατά κάθε ακμή εκτός αν κλείνει κύκλο. Όταν φτάνει στην{' '}
          <InlineMath>{'i'}</InlineMath>-στη ακμή, έχει ήδη τοποθετήσει το πολύ{' '}
          <InlineMath>{'i - 1'}</InlineMath> ακμές. Ένας κύκλος σε απλό γράφημα
          χρειάζεται <em>τουλάχιστον 3</em> ακμές — άρα η{' '}
          <InlineMath>{'i'}</InlineMath>-στη μπαίνει σίγουρα ⇔{' '}
          <InlineMath>{'i - 1 < 3'}</InlineMath> ⇔{' '}
          <InlineMath>{'i \\le 3'}</InlineMath>… όχι αρκετά: «μέχρι 3 ακμές
          τοποθετημένες» δεν είναι όλες, χρειάζεται προσοχή στο{' '}
          <InlineMath>{'i = 3'}</InlineMath>.
        </p>
        <p>
          Πάτα τις δύο καρτέλες και δες πού σπάει η γενίκευση:
        </p>
        <SecondVsThirdEdgeMst />
        <p>
          <strong>Α. ΣΩΣΤΟ.</strong> Στη 2η ακμή έχει τοποθετηθεί μόνο 1 ακμή —
          αδύνατο να κλείσει κύκλος (χρειάζεσαι ≥ 3). Άρα η 2η <em>πάντα</em>{' '}
          μπαίνει.
        </p>
        <p>
          <strong>Β. ΛΑΘΟΣ.</strong> Στην 3η ακμή έχουν τοποθετηθεί 2 ακμές —{' '}
          ακριβώς ο ελάχιστος αριθμός για να φτιαχτεί τρίγωνο. Αντιπαράδειγμα: το
          K₃ με βάρη 1, 2, 3 (πάνω). Η 3η (βάρους 3) απορρίπτεται.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «μέτρα τις ήδη τοποθετημένες ακμές».</strong>{' '}
            Για κάθε ισχυρισμό «η <InlineMath>{'i'}</InlineMath>-στη ελαφρύτερη
            ακμή ανήκει στο ΕΕΔ», η σωστή ερώτηση είναι: «πόσες ακμές έχει
            τοποθετήσει ο Kruskal πριν από αυτήν;». Αν είναι ≥ 2, μπορεί να
            σχηματιστεί κύκλος και ο ισχυρισμός σπάει με ένα τρίγωνο. Αν είναι
            &lt; 2 (δηλαδή <InlineMath>{'i \\le 2'}</InlineMath>), ο ισχυρισμός
            ισχύει πάντα. Η «μαγική γραμμή» είναι το{' '}
            <InlineMath>{'i = 3'}</InlineMath>.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-6-ask3',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 3 — Μέγιστη εναλλασσόμενη υπακολουθία σε O(n)',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Δίνεται ένας πίνακας <InlineMath>{'A'}</InlineMath> με <InlineMath>{'n'}</InlineMath> αριθμούς και ζητείται να βρεθεί, σε χρόνο <InlineMath>{'O(n)'}</InlineMath>, η υπακολουθία μέγιστου μήκους με την ιδιότητα:</p>
        <BlockMath>{'A[i_1] > A[i_2],\\;\\; A[i_2] < A[i_3],\\;\\; A[i_3] > A[i_4],\\;\\; A[i_4] < A[i_5],\\;\\; \\dots'}</BlockMath>
        <p>(εναλλάξ «πάνω-κάτω»). Η υπακολουθία δε χρειάζεται να βρίσκεται σε συνεχόμενες θέσεις.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Διαίσθηση — τοπίο με κορυφές και κοιλάδες.</strong> Φαντάσου
          τον πίνακα σαν προφίλ βουνού. Όσο η ακολουθία ανεβαίνει, βρίσκεσαι σε
          αύξουσα διαδρομή· όταν αλλάζει φορά, περνάς από ένα σημείο που είναι{' '}
          <em>τοπικό μέγιστο</em> (κορυφή) ή <em>τοπικό ελάχιστο</em>{' '}
          (κοιλάδα). Αυτά τα σημεία καμπής είναι ακριβώς αυτά που μας
          συμφέρουν.
        </p>
        <p>
          <strong>Ο άπληστος αλγόριθμος.</strong> Σάρωσε αριστερά → δεξιά·
          κράτα το πρώτο στοιχείο. Κάθε φορά που η φορά αλλάζει (από αύξουσα σε
          φθίνουσα ή αντίστροφα), η τελευταία θέση πριν την αλλαγή είναι κορυφή
          ή κοιλάδα και μπαίνει στην υπακολουθία. Στο τέλος μπαίνει και το
          τελευταίο στοιχείο.
        </p>
        <p>
          Δες τη σάρωση να τρέχει στο παράδειγμα της εκφώνησης. Στα ενδιάμεσα
          στοιχεία ενός μονότονου τμήματος, ο μετρητής δεν αυξάνει — μόνο οι
          αλλαγές φοράς προσθέτουν νέο κρίκο:
        </p>
        <AlternatingPeaksValleys />
        <p>
          <strong>Γιατί είναι βέλτιστη — μέγιστες μονότονες διαδρομές.</strong>{' '}
          Χώρισε τον πίνακα σε μέγιστα μονότονα τμήματα (αύξον, φθίνον,
          εναλλάξ). Σε <em>κάθε</em> εναλλασσόμενη υπακολουθία, από μία
          μονότονη διαδρομή χωράει το πολύ ένα στοιχείο «πάνω» και ένα «κάτω» —{' '}
          αλλιώς θα είχες δύο διαδοχικά στοιχεία στην ίδια φορά, που σπάει την
          εναλλαγή. Παίρνοντας τα άκρα κάθε μονότονης διαδρομής, ο άπληστος
          πετυχαίνει το μέγιστο επιτρεπτό μήκος.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Μία σάρωση του πίνακα — σταθερή
          δουλειά ανά θέση. Άρα <InlineMath>{'O(n)'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «αλλαγή φοράς = γεγονός».</strong> Όταν η
            εκφώνηση ζητά «επίλεξε το μέγιστο/ελάχιστο σύνολο με κανόνα
            σχέσης μεταξύ διαδοχικών στοιχείων» (εναλλαγή, αύξον, μη-φθίνον,
            μέσος όρος, ...), σκέψου την είσοδο ως σήμα και ψάξε τα{' '}
            <em>σημεία αλλαγής</em>. Συχνά η λύση είναι μία γραμμική σάρωση με
            έναν δείκτη φοράς.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-6-ask4',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 4 — Χρονοπρογραμματισμός πλυντηρίου (καθαριστήριο)',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L12-greedy-ii'],
    statement: (
      <>
        <p>Ο Γιώργος δουλεύει σε ένα καθαριστήριο ρούχων. Κάθε πρωί πρέπει να ελέγξει τα ρούχα για λεκέδες (για να τα επεξεργαστεί κατάλληλα) και στη συνέχεια να τα τοποθετήσει στο πλυντήριο και στο στεγνωτήριο. Ο Γιώργος μπορεί να επεξεργάζεται <em>ένα ρούχο κάθε φορά</em> για τον έλεγχο των λεκέδων, και κάθε ρούχο απαιτεί διαφορετικό χρόνο ελέγχου. Ωστόσο, τα ρούχα μπορούν να πλένονται και να στεγνώνουν <em>ταυτόχρονα</em>. Ο Γιώργος θέλει να τελειώσει όλη τη δουλειά όσο το δυνατόν γρηγορότερα, οπότε ψάχνει την καλύτερη σειρά ελέγχου των ρούχων.</p>
        <p>Ζητείται αποδοτικός αλγόριθμος που δίνει χρονοδιάγραμμα με τον μικρότερο δυνατό χρόνο ολοκλήρωσης.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Το μοντέλο.</strong> Για κάθε ρούχο{' '}
          <InlineMath>{'i'}</InlineMath>: <InlineMath>{'s_i'}</InlineMath> =
          χρόνος ελέγχου (γίνεται <em>σειριακά</em> — ένα μηχάνημα, ο Γιώργος)·{' '}
          <InlineMath>{'p_i'}</InlineMath> = χρόνος πλύσης + στεγνώματος
          (γίνεται <em>παράλληλα</em> — κάθε ρούχο έχει δικό του πλυντήριο). Μόλις
          ο έλεγχος ενός ρούχου τελειώσει, η πλύση/στέγνωμά του ξεκινά αμέσως
          στο παρασκήνιο, ενώ ο Γιώργος προχωρά στον έλεγχο του επόμενου. Ο
          συνολικός χρόνος (<strong>makespan</strong>) είναι όταν ολοκληρωθεί και
          η τελευταία πλύση:{' '}
          <InlineMath>{'\\;\\text{makespan} = \\max_i\\Big( \\sum_{j\\le i\\text{ στη σειρά}} s_j + p_i \\Big)'}</InlineMath>.
        </p>
        <p>
          <strong>Πού είναι η ένταση.</strong> Δύο φάσεις, αλλά μόνο μία είναι
          στενωπός — ο έλεγχος. Όσο γρήγορα και να ξεμπερδεύεις, αν αφήσεις στο
          τέλος <em>τη μεγαλύτερη πλύση</em>, εκείνη θα κρέμεται μόνη της αφού
          έχει τελειώσει η στενωπός. Άρα η σωστή ερώτηση δεν είναι «ποιον
          έλεγχο πρώτα» αλλά <em>«ποια πλύση πρέπει να ξεκινήσει νωρίς για να
          μη μείνει για το τέλος»</em>.
        </p>
        <p>
          <strong>Ο άπληστος κανόνας.</strong> Ταξινόμησε τα ρούχα κατά{' '}
          <em>φθίνον</em> <InlineMath>{'p_i'}</InlineMath> (Longest Processing
          Time first για την παράλληλη φάση) και έλεγξέ τα με αυτή τη σειρά. Η
          μεγαλύτερη πλύση ξεκινά πρώτη και τρέχει στο παρασκήνιο όσο γίνονται
          οι μικρότερες — έτσι «κρύβεται» πίσω από τους ελέγχους που έπονται.
        </p>
        <p>
          Δες το να γίνεται σε <InlineMath>{'5'}</InlineMath> ρούχα. Το ίδιο
          σύνολο εισόδων σε τρεις τάξεις: η «φθίνον <InlineMath>{'p'}</InlineMath>»
          (βέλτιστο) πετυχαίνει makespan{' '}
          <InlineMath>{'17'}</InlineMath>· η «αύξον <InlineMath>{'p'}</InlineMath>»
          (η αφελής SPT-στη-στενωπό) φτάνει <InlineMath>{'25'}</InlineMath>·
          ακόμη και η «φθίνον <InlineMath>{'s'}</InlineMath>» (αν φτιάχνεις
          πρώτα τους πιο αργούς ελέγχους) χάνει — η δουλειά στη στενωπό δεν
          είναι αυτό που σε «πληγώνει»:
        </p>
        <LaundryFlowShop />
        <p>
          <strong>Απόδειξη ορθότητας (επιχείρημα ανταλλαγής).</strong> Έστω
          βέλτιστο χρονοδιάγραμμα <InlineMath>{'S^*'}</InlineMath> που{' '}
          <em>δεν</em> ακολουθεί τη φθίνουσα σειρά κατά{' '}
          <InlineMath>{'p_i'}</InlineMath>. Τότε υπάρχουν δύο{' '}
          <strong>διαδοχικά</strong> ρούχα <InlineMath>{'i, j'}</InlineMath> (το{' '}
          <InlineMath>{'i'}</InlineMath> ακριβώς πριν το{' '}
          <InlineMath>{'j'}</InlineMath>) με{' '}
          <InlineMath>{'p_i < p_j'}</InlineMath> — «εκτός σειράς».
        </p>
        <p>
          <strong>Αντιμεταθέτουμε</strong> τα <InlineMath>{'i, j'}</InlineMath>{' '}
          (πρώτα <InlineMath>{'j'}</InlineMath>, μετά{' '}
          <InlineMath>{'i'}</InlineMath>) στη στενωπό. Τι αλλάζει;
        </p>
        <ul>
          <li>
            Όλα τα <em>άλλα</em> ρούχα: ούτε ο έλεγχός τους ούτε η πλύση τους
            μετακινείται — το ζεύγος <InlineMath>{'\\{i,j\\}'}</InlineMath>{' '}
            καταλαμβάνει στη στενωπό το ίδιο διάστημα{' '}
            <InlineMath>{'s_i + s_j'}</InlineMath> με την ίδια αρχή. Άρα και ο
            <em>μέγιστος</em> χρόνος λήξης ανάμεσα στα υπόλοιπα{' '}
            <strong>δεν αλλάζει</strong>.
          </li>
          <li>
            Έστω <InlineMath>{'T'}</InlineMath> ο χρόνος που έχει περάσει
            στη στενωπό πριν το ζευγάρι. <strong>Πριν:</strong>{' '}
            <InlineMath>{'i'}</InlineMath> τελειώνει έλεγχο στο{' '}
            <InlineMath>{'T+s_i'}</InlineMath> και πλύση στο{' '}
            <InlineMath>{'T+s_i+p_i'}</InlineMath>·{' '}
            <InlineMath>{'j'}</InlineMath> τελειώνει έλεγχο στο{' '}
            <InlineMath>{'T+s_i+s_j'}</InlineMath> και πλύση στο{' '}
            <InlineMath>{'T+s_i+s_j+p_j'}</InlineMath>. Το{' '}
            <em>χειρότερο</em> από τα δύο είναι{' '}
            <InlineMath>{'\\max(T+s_i+p_i,\\; T+s_i+s_j+p_j)'}</InlineMath>.
          </li>
          <li>
            <strong>Μετά:</strong>{' '}
            <InlineMath>{'j'}</InlineMath> τελειώνει πλύση στο{' '}
            <InlineMath>{'T+s_j+p_j'}</InlineMath>·{' '}
            <InlineMath>{'i'}</InlineMath> στο{' '}
            <InlineMath>{'T+s_j+s_i+p_i'}</InlineMath>. Το χειρότερο είναι{' '}
            <InlineMath>{'\\max(T+s_j+p_j,\\; T+s_i+s_j+p_i)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Όλοι οι τέσσερις όροι έχουν κοινό <InlineMath>{'T'}</InlineMath>·
          γράψε <InlineMath>{'\\Sigma = s_i+s_j'}</InlineMath>. Πριν το χειρότερο
          είναι <InlineMath>{'\\max(s_i+p_i,\\; \\Sigma+p_j)'}</InlineMath>·
          μετά είναι <InlineMath>{'\\max(s_j+p_j,\\; \\Sigma+p_i)'}</InlineMath>.
          Επειδή <InlineMath>{'p_j > p_i'}</InlineMath>:
        </p>
        <ul>
          <li>
            <InlineMath>{'\\Sigma + p_j > \\Sigma + p_i'}</InlineMath> — ο
            «κίνδυνος» <InlineMath>{'\\Sigma + p_j'}</InlineMath> εξαφανίστηκε.
          </li>
          <li>
            <InlineMath>{'\\Sigma + p_j > s_j + p_j'}</InlineMath> — άρα το νέο{' '}
            <InlineMath>{'s_j + p_j'}</InlineMath> ήταν ήδη κάτω από το παλιό
            μέγιστο.
          </li>
          <li>
            <InlineMath>{'\\Sigma + p_j > s_i + p_i'}</InlineMath> — άρα και ο
            άλλος όρος <InlineMath>{'s_i + p_i'}</InlineMath> ήταν ήδη κάτω από
            το παλιό μέγιστο.
          </li>
        </ul>
        <p>
          Άρα και τα δύο νέα τοπικά μέγιστα είναι{' '}
          <InlineMath>{'\\le \\Sigma + p_j'}</InlineMath> = παλιό μέγιστο: η
          συνολική χρονική στιγμή λήξης του ζεύγους <strong>δεν αυξήθηκε</strong>.
          Συνεχίζοντας τέτοιες ανταλλαγές μετατρέπουμε σταδιακά την{' '}
          <InlineMath>{'S^*'}</InlineMath> στη φθίνουσα σειρά{' '}
          <InlineMath>{'p_i'}</InlineMath> χωρίς ποτέ να χειροτερέψει το
          makespan. Άρα ο άπληστος είναι βέλτιστος. <strong>∎</strong>
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κυριαρχεί η ταξινόμηση των{' '}
          <InlineMath>{'n'}</InlineMath> ρούχων κατά{' '}
          <InlineMath>{'p_i'}</InlineMath>:{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath>.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «κρύβε το μακρύ πίσω από τη στενωπό».</strong>{' '}
            Όταν έχεις δύο φάσεις, μία σειριακή (στενωπός) και μία παράλληλη που
            ξεκινά μόλις τελειώσει η σειριακή ανά εργασία, ο σωστός άπληστος{' '}
            <em>αγνοεί</em> τη στενωπό για την επιλογή σειράς και ταξινομεί κατά
            φθίνον χρόνο της <em>παράλληλης</em> φάσης. Διαίσθηση: η σειρά
            ελέγχου καθορίζει ΜΟΝΟ πότε ξεκινάει η πλύση κάθε ρούχου· αν αφήσεις
            τη μεγαλύτερη πλύση για το τέλος, εκείνη θα κρέμεται μόνη της αφού
            τελειώσει η στενωπός. Σύγκρινε με την προηγούμενη άσκηση{' '}
            <em>(pt2-th4)</em>: εκεί δεν υπήρχε παράλληλη φάση, και το κλειδί
            ήταν αύξον <InlineMath>{'t_i'}</InlineMath> — επειδή τα αιτήματα
            νωρίς «καθυστερούν τους πάντες πίσω τους». Όταν προσθέτεις παράλληλη
            φάση, η λογική <em>αναστρέφεται</em>: το μακρύ μπαίνει πρώτο.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-6-ask5',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 5 — Ρέστα με τον ελάχιστο αριθμό νομισμάτων',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 5',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Θέλουμε να δώσουμε ρέστα <InlineMath>{'n'}</InlineMath> cents χρησιμοποιώντας τον ελάχιστο αριθμό νομισμάτων, από νομίσματα αξίας <InlineMath>{'1, 5, 10, 25'}</InlineMath> cents. Υπάρχει άπληστος αλγόριθμος που οδηγεί σε βέλτιστη λύση;</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Ο άπληστος.</strong> Σε κάθε βήμα δώσε το νόμισμα με τη
          μεγαλύτερη αξία που χωρά στο υπόλοιπο. Για το σύστημα{' '}
          <InlineMath>{'\\{1, 5, 10, 25\\}'}</InlineMath> ο κανόνας{' '}
          <strong>ΕΙΝΑΙ βέλτιστος</strong> — αλλά αυτό δεν είναι αυτονόητο και
          χρειάζεται απόδειξη με ιδιότητες του ίδιου του συστήματος.
        </p>
        <p>
          Δες τον κανόνα να τρέχει στο σύστημα του δολαρίου για ρέστα{' '}
          <InlineMath>{'30'}</InlineMath>. Στη δεύτερη καρτέλα κάνει ισοβαθμία
          με τη βέλτιστη (3 κέρματα = 3 κέρματα)· στην πρώτη βλέπεις τον ίδιο
          κανόνα να αποτυγχάνει στο σύστημα{' '}
          <InlineMath>{'\\{1, 10, 25\\}'}</InlineMath>:
        </p>
        <CoinChangeLab />
        <p>
          <strong>Απόδειξη ορθότητας — ανταλλαγή κερμάτων.</strong> Έστω
          οποιαδήποτε βέλτιστη λύση <InlineMath>{'O'}</InlineMath>. Στο{' '}
          <InlineMath>{'O'}</InlineMath> ισχύουν αναγκαστικά τα παρακάτω, αλλιώς
          μπορούμε να την «συμπιέσουμε» σε λύση με λιγότερα κέρματα:
        </p>
        <ul>
          <li>
            Το πολύ <strong>4</strong> κέρματα του{' '}
            <InlineMath>{'1'}</InlineMath>. (5 κέρματα του 1 → 1 κέρμα του 5,
            κερδίζουμε 4 κέρματα.)
          </li>
          <li>
            Το πολύ <strong>1</strong> κέρμα του <InlineMath>{'5'}</InlineMath>.
            (2 κέρματα του 5 → 1 κέρμα του 10.)
          </li>
          <li>
            Το πολύ <strong>2</strong> κέρματα του{' '}
            <InlineMath>{'10'}</InlineMath>. (3 κέρματα του 10 → 1 κέρμα του 25
            + 1 κέρμα του 5.)
          </li>
        </ul>
        <p>
          Έστω ότι ο άπληστος και η <InlineMath>{'O'}</InlineMath> διαφέρουν, και
          η πρώτη διαφορά (με ταξινόμηση φθίνουσα) είναι στη θέση{' '}
          <InlineMath>{'i'}</InlineMath>. Επειδή ο άπληστος βάζει πάντα το
          μεγαλύτερο δυνατό, <InlineMath>{'g_i > o_i'}</InlineMath>. Εξετάζουμε
          ανά περίπτωση:
        </p>
        <ul>
          <li>
            <strong><InlineMath>{'g_i = 25'}</InlineMath>:</strong> Η{' '}
            <InlineMath>{'O'}</InlineMath> πρέπει να συμπληρώσει αξία{' '}
            <InlineMath>{'\\ge 25'}</InlineMath> με νομίσματα ≤ 10. Με τα όρια
            από πάνω το πολύ:{' '}
            <InlineMath>{'2 \\cdot 10 + 1 \\cdot 5 + 4 \\cdot 1 = 29'}</InlineMath>
            . Αν αξιοποιεί ακριβώς <InlineMath>{'10 + 10 + 5 = 25'}</InlineMath>,
            αυτή η τριάδα αντικαθίσταται από ένα <InlineMath>{'25'}</InlineMath>{' '}
            κερδίζοντας 2 κέρματα — άτοπο για βέλτιστο.
          </li>
          <li>
            <strong><InlineMath>{'g_i = 10'}</InlineMath>:</strong> Η{' '}
            <InlineMath>{'O'}</InlineMath> πρέπει να συμπληρώσει{' '}
            <InlineMath>{'\\ge 10'}</InlineMath> με νομίσματα ≤ 5. Το πολύ{' '}
            <InlineMath>{'5 + 4 \\cdot 1 = 9 < 10'}</InlineMath>. Άτοπο.
          </li>
          <li>
            <strong><InlineMath>{'g_i = 5'}</InlineMath>:</strong> Η{' '}
            <InlineMath>{'O'}</InlineMath> πρέπει να συμπληρώσει{' '}
            <InlineMath>{'\\ge 5'}</InlineMath> με νομίσματα ≤ 1. Το πολύ{' '}
            <InlineMath>{'4 \\cdot 1 = 4 < 5'}</InlineMath>. Άτοπο.
          </li>
        </ul>
        <p>
          Σε κάθε περίπτωση αντίφαση. Άρα οι δύο λύσεις είναι ίδιες — ο άπληστος
          είναι βέλτιστος για αυτό το σύστημα.
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «η ορθότητα ζει στις αξίες».</strong>{' '}
            Η ίδια «λογική» (πάρε το μεγαλύτερο) δουλεύει για{' '}
            <InlineMath>{'\\{1, 5, 10, 25\\}'}</InlineMath> και αποτυγχάνει για{' '}
            <InlineMath>{'\\{1, 10, 25\\}'}</InlineMath>. Η απόδειξη δεν
            ξεκινά από τον κανόνα — ξεκινά από τα όρια στις ποσότητες κάθε
            κέρματος μέσα σε μια βέλτιστη λύση. Όταν βλέπεις «δείξτε ότι ο
            άπληστος είναι βέλτιστος», ψάξε τέτοιους κανόνες ανταλλαγής στο
            συγκεκριμένο στιγμιότυπο.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-6-ask6',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 6 — Ελάχιστες στάσεις για ανεφοδιασμό',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 6',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Ο καθηγητής Μίδας οδηγεί με αυτοκίνητο από μια αφετηρία προς έναν προορισμό. Η δεξαμενή καυσίμων του αυτοκινήτου, όταν είναι γεμάτη, έχει αρκετά καύσιμα ώστε να οδηγεί για <InlineMath>{'n'}</InlineMath> χιλιόμετρα, και ο χάρτης του δείχνει τις αποστάσεις μεταξύ των σταθμών καυσίμων στον δρόμο του. Ο καθηγητής θέλει να κάνει όσες λιγότερες στάσεις γίνεται. Δώστε έναν αποδοτικό (άπληστο) αλγόριθμο με τον οποίο ο καθηγητής Μίδας θα προσδιορίζει σε ποιούς σταθμούς πρέπει να κάνει στάση, και αποδείξτε ότι ο αλγόριθμός σας δίνει βέλτιστη λύση.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Διαίσθηση — «μη σταματάς αν δεν χρειάζεται».</strong> Κάθε
          στάση κοστίζει μία μονάδα στην απάντηση. Άρα προσπάθησε να αξιοποιήσεις
          όσο γίνεται το καύσιμο που έχεις: σε κάθε σταθμό, σταμάτα{' '}
          <em>μόνο</em> αν δεν χωράς να φτάσεις στον επόμενο.
        </p>
        <p>
          <strong>Ο άπληστος αλγόριθμος.</strong> Με γεμάτη δεξαμενή ξεκίνα·
          οδήγησε μέχρι τον <em>πιο μακρινό</em> σταθμό που χωρά στα{' '}
          <InlineMath>{'n'}</InlineMath> km εμβέλειας· κάνε στάση εκεί, γέμισε,
          επανάλαβε. Δεν παίρνεις ποτέ μια στάση που δεν χρειάζεται —{' '}
          προχωράς όσο πιο μακριά γίνεται κάθε φορά.
        </p>
        <p>
          <strong>Δες την απόδειξη να γίνεται γεωμετρική.</strong> Πάνω η
          άπληστη διαδρομή σε μια ευθεία, κάτω μια οποιαδήποτε άλλη βέλτιστη.
          Σε κάθε βήμα <InlineMath>{'k'}</InlineMath> ο μετρητής εκτυπώνει την
          ανισότητα <InlineMath>{'g_k \\ge o_k'}</InlineMath> — ο άπληστος δεν
          είναι ποτέ πιο πίσω. Στο τέλος, η άπληστη διαδρομή έχει σταματήσει το
          πολύ όσες φορές χρειάζεται οποιαδήποτε άλλη λύση:
        </p>
        <GasStationsGreedy />
        <p>
          <strong>Απόδειξη — «ο άπληστος μένει μπροστά» (επαγωγή).</strong>{' '}
          Έστω <InlineMath>{'g_1 < g_2 < \\dots'}</InlineMath> οι σταθμοί όπου
          σταματά ο άπληστος, και <InlineMath>{'o_1 < o_2 < \\dots'}</InlineMath>{' '}
          οι σταθμοί οποιασδήποτε βέλτιστης λύσης. Ισχυρισμός:{' '}
          <InlineMath>{'g_k \\ge o_k'}</InlineMath> για κάθε{' '}
          <InlineMath>{'k'}</InlineMath>.
        </p>
        <ul>
          <li>
            <em>Βάση</em> (<InlineMath>{'k = 1'}</InlineMath>): ο άπληστος
            επιλέγει για <InlineMath>{'g_1'}</InlineMath> τον πιο μακρινό σταθμό
            σε εμβέλεια <InlineMath>{'n'}</InlineMath> από την αφετηρία. Η{' '}
            <InlineMath>{'o_1'}</InlineMath> είναι κι αυτή σε εμβέλεια. Άρα{' '}
            <InlineMath>{'g_1 \\ge o_1'}</InlineMath>.
          </li>
          <li>
            <em>Επαγωγικό βήμα.</em> Έστω{' '}
            <InlineMath>{'g_k \\ge o_k'}</InlineMath>. Από το{' '}
            <InlineMath>{'g_k'}</InlineMath> ο άπληστος φτάνει το πολύ{' '}
            <InlineMath>{'g_k + n \\ge o_k + n'}</InlineMath>, δηλαδή πιο μακριά
            ή τουλάχιστον τόσο μακριά όσο η βέλτιστη από το{' '}
            <InlineMath>{'o_k'}</InlineMath>. Ο άπληστος ΔΙΑΛΕΓΕΙ τον πιο
            μακρινό μέσα σ' αυτή την εμβέλεια, άρα{' '}
            <InlineMath>{'g_{k+1} \\ge o_{k+1}'}</InlineMath>.
          </li>
        </ul>
        <p>
          Άρα μετά από <InlineMath>{'k'}</InlineMath> στάσεις, ο άπληστος έχει
          προχωρήσει τουλάχιστον όσο και η βέλτιστη. Άρα δεν χρειάζεται
          περισσότερες στάσεις από αυτή.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Μία σάρωση των{' '}
          <InlineMath>{'m'}</InlineMath> σταθμών →{' '}
          <InlineMath>{'O(m)'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «greedy stays ahead» για ορίζοντα
            μονόδρομο.</strong> Όταν η εκφώνηση παίρνει αποφάσεις σε γραμμικό
            ορίζοντα (κίνηση, χρόνος) και κάθε απόφαση «καίει» πόρο, ο άπληστος
            «πήγαινε όσο πιο μακριά μπορείς» έχει σταθερή απόδειξη: σύγκρισέ
            τον με μια οποιαδήποτε βέλτιστη με την ίδια αρχή· δείξε με επαγωγή
            ότι μετά από κάθε <InlineMath>{'k'}</InlineMath> κινήσεις έχει
            προχωρήσει τουλάχιστον όσο εκείνη. Άρα και τελειώνει το ίδιο γρήγορα
            ή νωρίτερα.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-6-ask7',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 7 — Κωδικοποίηση Huffman',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 7',
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <>
        <p>Δίνονται οι χαρακτήρες με τις συχνότητές τους: <InlineMath>{'A(0{,}31)'}</InlineMath>, <InlineMath>{'N(0{,}24)'}</InlineMath>, <InlineMath>{'T(0{,}20)'}</InlineMath>, <InlineMath>{'K(0{,}15)'}</InlineMath>, <InlineMath>{'\\Sigma(0{,}10)'}</InlineMath>.</p>
        <p><strong>α)</strong> Δείξτε τα διαδοχικά βήματα κατασκευής του δένδρου Huffman. <strong>β)</strong> Δώστε τον πίνακα κωδικοποίησης των χαρακτήρων. <strong>γ)</strong> Κωδικοποιήστε το «κείμενο» ΚΑΣΤΑΝΑΣ. <strong>δ)</strong> Αποκωδικοποιήστε το «μήνυμα» <InlineMath>{'0100100101101'}</InlineMath> (αγνοώντας τυχόν υπόλοιπο).</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>α) Κατασκευή του δένδρου.</strong> Ο Huffman είναι άπληστος
          με ένα μόνο κανόνα: <em>σε κάθε βήμα συγχωνεύει τους δύο κόμβους με
          τη μικρότερη συχνότητα</em> σε έναν νέο, με συχνότητα το άθροισμά
          τους. Με <InlineMath>{'n = 5'}</InlineMath> χαρακτήρες χρειάζονται{' '}
          <InlineMath>{'n - 1 = 4'}</InlineMath> συγχωνεύσεις. Πάμε βήμα-βήμα
          στο ίδιο εργαλείο που χρησιμοποίησε η διάλεξη — μόνο που τώρα ο
          αλγόριθμος τρέχει πάνω στις <em>δικές μας</em> συχνότητες:
        </p>
        <HuffmanTreeBuilder instance="kastanas" />
        <p>
          <strong>β) Πίνακας κωδικοποίησης.</strong> Δίνουμε{' '}
          <InlineMath>{'0'}</InlineMath> στο αριστερό και{' '}
          <InlineMath>{'1'}</InlineMath> στο δεξί παιδί, και διαβάζουμε το
          μονοπάτι ρίζα → φύλλο. Οι σπάνιοι χαρακτήρες (Σ, K) που έπεσαν στο
          βαθύτερο επίπεδο πληρώνουν τους μεγαλύτερους κώδικες (3 bits), ενώ
          οι συχνοί (A, N, T) γλιτώνουν με 2 bits:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`A = 11      N = 01      T = 00
K = 101     Σ = 100`}</pre>
        <p>
          Επιβεβαίωση απροθεματικότητας: κανένας κώδικας δεν είναι πρόθεμα
          κάποιου άλλου (π.χ. το 10 δεν εμφανίζεται μόνο του — μόνο σαν αρχή
          των 100 και 101, που και τα δύο τελειώνουν σε φύλλο). Αυτό κάνει
          την αποκωδικοποίηση μονοσήμαντη.
        </p>
        <p>
          <strong>γ + δ) Κωδικοποίηση «ΚΑΣΤΑΝΑΣ» και αποκωδικοποίηση
          0100100101101.</strong> Πατώντας «Επόμενο» στην καρτέλα{' '}
          <em>Κωδικοποίηση</em>, βλέπεις σε κάθε βήμα έναν χαρακτήρα της λέξης
          να αναζητείται στο δέντρο — η διαδρομή ρίζα→φύλλο{' '}
          <em>είναι</em> ο κώδικάς του. Στην καρτέλα{' '}
          <em>Αποκωδικοποίηση</em> διαβάζεις bit-bit, κατεβαίνεις στο δέντρο,
          και κάθε φορά που φτάνεις σε φύλλο εκπέμπεις τον χαρακτήρα και
          επιστρέφεις στη ρίζα:
        </p>
        <HuffmanEncodeDecode />
        <p>
          <strong>Επιβεβαίωση των απαντήσεων.</strong> Η λέξη ΚΑΣΤΑΝΑΣ γίνεται{' '}
          <InlineMath>{'\\underbrace{101}_{K}\\,\\underbrace{11}_{A}\\,\\underbrace{100}_{\\Sigma}\\,\\underbrace{00}_{T}\\,\\underbrace{11}_{A}\\,\\underbrace{01}_{N}\\,\\underbrace{11}_{A}\\,\\underbrace{100}_{\\Sigma}'}</InlineMath>
          {' '}
          δηλαδή <InlineMath>{'1011110000110111100'}</InlineMath> — 19 bits για
          8 χαρακτήρες, μέσος όρος 2,375 bits/χαρακτήρα.{' '}
          Η αποκωδικοποίηση του{' '}
          <InlineMath>{'0100100101101'}</InlineMath> δίνει{' '}
          <InlineMath>{'\\underbrace{01}_{N}\\,\\underbrace{00}_{T}\\,\\underbrace{100}_{\\Sigma}\\,\\underbrace{101}_{K}\\,\\underbrace{101}_{K}'}</InlineMath>
          {' '}= <strong>ΝΤΣΚΚ</strong>.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «η συχνότητα βάφει το βάθος».</strong>{' '}
            Όποτε σε εκφώνηση δίνονται συχνότητες/πιθανότητες χαρακτήρων και
            σου ζητούν «βέλτιστη κωδικοποίηση», ο αλγόριθμος είναι πάντα ο
            ίδιος: ταξινόμησε τα φύλλα κατά αύξουσα συχνότητα, συγχώνευσε τα
            δύο σπανιότερα, βάλε το άθροισμα πίσω. Η σπανιότητα γίνεται βάθος,
            το βάθος γίνεται μήκος κώδικα, το μήκος γίνεται κόστος{' '}
            <InlineMath>{'\\sum f_x \\cdot |c(x)|'}</InlineMath>. Δεν χρειάζεται
            ποτέ να «δοκιμάσεις άλλες συχνότητες» ως πρώτο ζευγάρι — η
            απόδειξη του Λήμματος 2 σου εγγυάται ότι κάποιο βέλτιστο δέντρο
            έχει εκεί τους δύο σπανιότερους.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-6-ask8',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 8 — Άπληστος χρωματισμός & ελάχιστα ταξί',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 8',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Δώστε έναν άπληστο αλγόριθμο χρωματισμού των κορυφών ενός γράφου με τον ελάχιστο δυνατό αριθμό χρωμάτων, ώστε γειτονικές κορυφές να μην έχουν το ίδιο χρώμα. Στη συνέχεια, δοθέντος ενός συνόλου ραντεβού (καθένα με χρόνο έναρξης και λήξης), βρείτε τον μικρότερο αριθμό ταξί που χρειάζονται ώστε να εξυπηρετηθούν όλα — κάθε ταξί δεν μπορεί να εξυπηρετεί επικαλυπτόμενα ραντεβού.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Μέρος 1 — άπληστος χρωματισμός.</strong> Πάρε τις κορυφές σε
          κάποια σειρά. Για καθεμία, δώσε της το <em>μικρότερο</em> χρώμα που
          δεν χρησιμοποιείται από έναν ήδη χρωματισμένο γείτονά της.
        </p>
        <p>
          <strong>Δεν είναι πάντα βέλτιστο — η σειρά μετράει.</strong> Στο ίδιο
          γράφο, με δύο διαφορετικές σειρές, ο ίδιος κανόνας δίνει 3 ή 4
          χρώματα. Δες το να γίνεται στο εξάγωνο με τις δύο διαγώνιες (3
          βέλτιστο, 4 με κακή σειρά):
        </p>
        <GreedyColoringOrders />
        <p>
          Παρατήρησε ότι το γενικό πρόβλημα ελάχιστου χρωματισμού γραφήματος
          είναι <strong>NP-δύσκολο</strong>: δεν περιμένουμε καμία άπληστη
          συνταγή να το λύνει βέλτιστα σε όλους τους γράφους. Όμως για ειδικές
          οικογένειες γράφων (π.χ. γράφοι διαστημάτων — δες αμέσως παρακάτω) ο
          άπληστος γίνεται βέλτιστος επειδή η δομή «τσέπης» επιτρέπει σωστή
          σειρά εξέτασης.
        </p>
        <p>
          <strong>Μέρος 2 — ελάχιστα ταξί ≡ διαμέριση διαστημάτων.</strong>{' '}
          Κάθε ραντεβού είναι χρονικό διάστημα· δύο ραντεβού «συγκρούονται» αν
          επικαλύπτονται· κάθε ταξί εξυπηρετεί μη-συγκρουόμενα ραντεβού. Είναι
          ακριβώς το πρόβλημα της διαμέρισης διαστημάτων από τη διάλεξη.
        </p>
        <p>
          <strong>Ο άπληστος.</strong> Ταξινόμησε τα ραντεβού κατά αύξοντα χρόνο
          έναρξης. Για κάθε ραντεβού: αν υπάρχει ταξί ελεύθερο τη στιγμή που
          ξεκινά, ανέθεσέ το εκεί· αλλιώς, άνοιξε νέο ταξί. Όταν τελειώνει ένα
          ραντεβού, το ταξί του ξαναγίνεται ελεύθερο.
        </p>
        <p>
          Δες τον αλγόριθμο να τρέχει σε ένα παράδειγμα με 8 ραντεβού όπου το{' '}
          <em>βάθος</em> είναι 4 (στιγμή με 4 ταυτόχρονα ραντεβού). Στη
          λειτουργία «Βάθος» η γραμμή σάρωσης βρίσκει το κάτω φράγμα· στη
          λειτουργία «Άπληστος» δες ότι ανοίγει ακριβώς 4 ταξί — όσο το βάθος:
        </p>
        <IntervalPartitionAnimator instance="taxi" />
        <p>
          <strong>Γιατί είναι βέλτιστος — επιχείρημα του βάθους.</strong> Έστω
          ότι ο άπληστος ανοίγει το <InlineMath>{'d'}</InlineMath>-οστό ταξί όταν
          εξετάζει κάποιο ραντεβού <InlineMath>{'j'}</InlineMath>. Αυτό σημαίνει
          ότι τα προηγούμενα <InlineMath>{'d-1'}</InlineMath> ταξί δεν είναι
          ελεύθερα τη στιγμή <InlineMath>{'s_j'}</InlineMath> — δηλαδή υπάρχουν{' '}
          <InlineMath>{'d-1'}</InlineMath> ραντεβού που ξεκίνησαν πριν και
          τελειώνουν μετά. Μαζί με το <InlineMath>{'j'}</InlineMath>, τη στιγμή{' '}
          <InlineMath>{'s_j'}</InlineMath> τρέχουν <InlineMath>{'d'}</InlineMath>{' '}
          ραντεβού. Άρα το βάθος είναι <InlineMath>{'\\ge d'}</InlineMath>. Αλλά
          κάθε λύση χρειάζεται <InlineMath>{'\\ge'}</InlineMath> βάθος ταξί. Ο
          άπληστος πετυχαίνει ακριβώς <InlineMath>{'d'}</InlineMath> → βέλτιστος.
        </p>
        <p>
          <strong>Η σύνδεση με τον χρωματισμό.</strong> Φτιάξε γράφο «επικάλυψης»:
          κόμβος ανά ραντεβού, ακμή ανάμεσα σε όσα συγκρούονται. Τότε «ελάχιστα
          ταξί» = «ελάχιστος χρωματισμός». Σε γενικό γράφο αυτό είναι
          NP-δύσκολο, αλλά εδώ ο γράφος είναι <em>γράφος διαστημάτων</em> και η
          σάρωση κατά χρόνο έναρξης (καλή σειρά) γίνεται βέλτιστη — γι' αυτό ο
          άπληστος δουλεύει εδώ ενώ απέτυχε στο μέρος 1.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong>{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath> από την ταξινόμηση. Η σάρωση
          είναι <InlineMath>{'O(n)'}</InlineMath> με κατάλληλη δομή (π.χ. min-heap
          για χρόνους ελευθερίας ταξί).
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «η σειρά είναι ο αλγόριθμος».</strong>{' '}
            Στους άπληστους χρωματισμούς, η «τέχνη» δεν είναι ο κανόνας
            επιλογής χρώματος (αυτός είναι πάντα «μικρότερο διαθέσιμο») — είναι
            η <em>σειρά</em>. Όταν η εκφώνηση είναι «δώστε άπληστο που να
            δίνει βέλτιστο», ψάξε ειδική δομή (γραφήματα διαστημάτων, δέντρα,
            χορδώδη) που να σου επιτρέπει «έξυπνη» σειρά. Όταν δεν υπάρχει
            δομή, παραδέξου ότι ο άπληστος δεν είναι πάντα βέλτιστος.
          </p>
        </Callout>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #7 — μεταγραμμένο & χωρισμένο ανά διάλεξη ───────
  {
    id: 'front-set-7-ask1',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 1 — Ένωση n ράβδων χρυσού με ελάχιστο κόστος',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <>
        <p>Δίνονται <InlineMath>{'n'}</InlineMath> ράβδοι χρυσού διαφορετικού βάρους. Θέλουμε να τις ενώσουμε σε μία. Το κόστος της ένωσης 2 ράβδων είναι ίσο με το άθροισμα των βαρών τους. Δώστε έναν αποδοτικό άπληστο αλγόριθμο που ελαχιστοποιεί το συνολικό κόστος. (Δεν ζητείται απόδειξη ορθότητας.) Να υπολογιστεί η πολυπλοκότητα.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα — κάθε ένωση πληρώνεται ξανά και ξανά.</strong> Όταν
          ενώνεις δύο ράβδους σε μία νέα με άθροισμα βαρών{' '}
          <InlineMath>{'s'}</InlineMath>, αυτή η νέα ράβδος θα ενωθεί κάποια
          στιγμή με μια άλλη — και το νέο κόστος θα περιλαμβάνει ξανά όλο το
          βάρος της <InlineMath>{'s'}</InlineMath>. Σε ένα δέντρο ενώσεων με{' '}
          <InlineMath>{'n'}</InlineMath> φύλλα-ράβδους, το βάρος{' '}
          <InlineMath>{'w_i'}</InlineMath> πληρώνεται μία φορά για κάθε ένωση
          στο μονοπάτι του προς τη ρίζα — δηλαδή{' '}
          <strong>βάθος<InlineMath>{'(i)'}</InlineMath></strong> φορές. Άρα:
        </p>
        <BlockMath>{'\\text{συνολικό κόστος} = \\sum_{i=1}^{n} w_i \\cdot d(i)'}</BlockMath>
        <p>
          Αυτό είναι κυριολεκτικά το{' '}
          <InlineMath>{'\\sum f_x \\cdot |c(x)|'}</InlineMath> του Huffman, με
          τα βάρη <InlineMath>{'w_i'}</InlineMath> στη θέση των{' '}
          <InlineMath>{'f_x'}</InlineMath> και το βάθος των φύλλων στη θέση του
          μήκους κώδικα. <strong>Είναι το ίδιο πρόβλημα με άλλη ορολογία.</strong>{' '}
          Άρα και ο αλγόριθμος είναι ο ίδιος.
        </p>
        <p>
          <strong>Ο άπληστος κανόνας: ένωσε κάθε φορά τις δύο ελαφρύτερες
          ράβδους.</strong> Έτσι οι ελαφρές πέφτουν βαθιά (επιτρέπεται —
          πληρώνονται πολλές φορές, αλλά είναι μικρές), και οι βαριές μένουν
          ψηλά (κρίσιμο — δεν πληρώνονται πολλές φορές).
        </p>
        <p>
          Δες δύο στρατηγικές δίπλα-δίπλα πάνω στις ίδιες ράβδους{' '}
          <InlineMath>{'\\{1, 2, 3, 4, 5\\}'}</InlineMath>. Στα δεξιά, μετράμε
          πόσες φορές πληρώθηκε κάθε αρχική ράβδος — αυτή είναι η{' '}
          «βάθος» στήλη που κάνει την παγίδα του αντι-άπληστου ορατή:
        </p>
        <GoldbarMerges />
        <p>
          <strong>Υλοποίηση με min-heap (ουρά προτεραιότητας με κλειδί το
          βάρος).</strong> Είναι η ίδια δομή που χρειάζεται ο Huffman:
        </p>
        <ul>
          <li>
            Κατασκευή του σωρού από όλα τα βάρη:{' '}
            <InlineMath>{'O(n)'}</InlineMath> (από{' '}
            <a className="underline" href="/lectures/L10-data-structures">
              L10
            </a>{' '}
            — bottom-up heapify).
          </li>
          <li>
            Επανέλαβε <InlineMath>{'n - 1'}</InlineMath> φορές: δύο{' '}
            <InlineMath>{'\\text{extract-min}'}</InlineMath> και ένα{' '}
            <InlineMath>{'\\text{insert}'}</InlineMath> του αθροίσματος —
            καθεμία πράξη <InlineMath>{'O(\\log n)'}</InlineMath>. Πρόσθεσε το
            άθροισμα στο συνολικό κόστος.
          </li>
        </ul>
        <p>
          <strong>Συνολικός χρόνος.</strong>{' '}
          <InlineMath>{'O(n) + (n-1) \\cdot O(\\log n) = O(n \\log n)'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «αν η ορολογία είναι άλλη αλλά η
            δομή ίδια, ο αλγόριθμος είναι ίδιος».</strong> Στις εξετάσεις
            θα δεις τον Huffman ντυμένο πολλούς τρόπους: ένωση χρυσού, σύνθεση
            αρχείων, συγκόλληση σχοινιών, μέτρηση συγκρούσεων σε{' '}
            <em>k</em>-merge. Το κοινό σύμπτωμα: «έχω{' '}
            <InlineMath>{'n'}</InlineMath> στοιχεία με βάρη, κάθε σύνθεση
            δύο στοιχείων κοστίζει το άθροισμά τους, να ελαχιστοποιήσω το
            συνολικό κόστος». Μη ψάχνεις άλλη ιδέα — είναι Huffman, χρειάζεσαι
            μόνο min-heap και τη φράση «δύο ελαφρύτερες».
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask2',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 2 — Λύκος, κατσίκα, λάχανο (αναζήτηση σε γράφο)',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>Ένας βαρκάρης βρίσκεται στην όχθη ενός ποταμού με ένα λάχανο, μια κατσίκα κι έναν λύκο, και θέλει να τα μεταφέρει στην απέναντι όχθη με τη βάρκα του. Περιορισμοί:</p>
        <ul>
          <li>Για να κινηθεί η βάρκα πρέπει οπωσδήποτε να είναι μέσα ο βαρκάρης.</li>
          <li>Όταν είναι ο βαρκάρης μέσα στη βάρκα, υπάρχει χώρος μόνο για ένα ακόμα αντικείμενο.</li>
          <li>Αν ο λύκος μείνει μόνος με την κατσίκα, θα τη φάει· ομοίως η κατσίκα θα φάει το λάχανο αν μείνουν μόνα.</li>
        </ul>
        <p>Πώς μπορεί να γίνει η μεταφορά;</p>
      </>
    ),
    solution: (
      <>
        <p>Πριν τη γραφο-μοντελοποίηση, παίξε τον γρίφο μόνος σου — οι κανόνες ζωντανεύουν αμέσως, και κάθε λάθος κίνηση φωτογραφίζει γιατί ο γράφος καταστάσεων θα έχει 10 (όχι 16) κόμβους:</p>
        <RiverCrossingGame />
        <p><strong>Η ιδέα — «κάνε το γρίφο γράφο».</strong> Δεν χρειάζεται «έξυπνη» έμπνευση. Το μόνο που θέλει ο γρίφος είναι η σωστή <em>μοντελοποίηση</em>: μόλις γίνει γράφος, ο αλγόριθμος που τον λύνει είναι BFS του βιβλίου — και το «δοκίμασα να περάσω τον λύκο πρώτα και έφαγε την κατσίκα» που μόλις είδες αντιστοιχεί σε μια ακμή που δεν υπάρχει στον γράφο.</p>
        <p>Συμβολίζουμε με <InlineMath>{'B'}</InlineMath> τον βαρκάρη, <InlineMath>{'C'}</InlineMath> το λάχανο, <InlineMath>{'G'}</InlineMath> την κατσίκα, <InlineMath>{'W'}</InlineMath> τον λύκο. Η <strong>κατάσταση</strong> του κόσμου περιγράφεται μονοσήμαντα από <em>ποιοι βρίσκονται στην απέναντι όχθη</em> — οι υπόλοιποι, εξ ορισμού, είναι στην αρχική. Υπάρχουν <InlineMath>{'2^4 = 16'}</InlineMath> δυνητικές υποσύνολα του <InlineMath>{'\\{B, C, G, W\\}'}</InlineMath>.</p>
        <p><strong>Κόμβοι:</strong> κάθε <em>ασφαλής</em> κατάσταση (αποκλείουμε αυτές όπου λύκος+κατσίκα ή κατσίκα+λάχανο μένουν μόνοι σε κάποια όχθη — εκεί ένα ζωντανό «φαγώνεται»). Μένουν <strong>10</strong> κόμβοι από τους 16.{' '}
        <strong>Ακμές:</strong> δύο καταστάσεις συνδέονται όταν περνάμε από τη μία στην άλλη με ένα νόμιμο πέρασμα: ο βαρκάρης{' '}
        <InlineMath>{'B'}</InlineMath> (και προαιρετικά <em>ένα</em> αντικείμενο από τη δική του όχθη) αλλάζουν πλευρά, και το αποτέλεσμα είναι κι αυτό ασφαλές.</p>
        <p><strong>Το πρόβλημα γίνεται μονοπάτι.</strong> «Όλα στην απέναντι όχθη» αντιστοιχεί στην κορυφή <InlineMath>{'\\{B,C,G,W\\}'}</InlineMath>· «αρχικά όλα στην αρχική όχθη» αντιστοιχεί στο{' '}
        <InlineMath>{'\\varnothing'}</InlineMath>. Ζητάμε μονοπάτι{' '}
        <InlineMath>{'\\varnothing \\to \\{B,C,G,W\\}'}</InlineMath>. Με{' '}
        <strong>BFS</strong> παίρνουμε ταυτόχρονα και τη βραχύτερη λύση.</p>
        <RiverCrossingStateGraph />
        <p>Το BFS βρίσκει συντομότερη λύση 7 περασμάτων:</p>
        <BlockMath>{'\\varnothing \\to \\{B,G\\} \\to \\{G\\} \\to \\{B,C,G\\} \\to \\{C\\} \\to \\{B,C,W\\} \\to \\{C,W\\} \\to \\{B,C,G,W\\}'}</BlockMath>
        <p>Σε λόγια: πέρνα την κατσίκα απέναντι· γύρνα μόνος· πέρνα το λάχανο· φέρε πίσω την κατσίκα· πέρνα τον λύκο· γύρνα μόνος· πέρνα ξανά την κατσίκα. Σε κάθε ενδιάμεση στιγμή ο λύκος δεν μένει ποτέ μόνος με την κατσίκα, ούτε η κατσίκα με το λάχανο — αυτή ακριβώς είναι η <em>ασφάλεια</em> που γίνεται γεωμετρία στον γράφο.</p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «πρόβλημα κατάστασης ⇒ γράφος καταστάσεων».</strong>{' '}
            Όποτε σου δίνουν γρίφο, παιχνίδι σε ταμπλό, ή σύστημα με «καταστάσεις
            + κανόνες μετάβασης», το ίδιο πατέντο: <em>κόμβοι = έγκυρες
            καταστάσεις</em>, <em>ακμές = επιτρεπτές μεταβάσεις</em>, και η
            ερώτηση «μπορώ να φτάσω από Α σε Β;» γίνεται BFS/DFS. Το χάρισμα
            είναι ότι πληρώνεις <InlineMath>{'O(|V| + |E|)'}</InlineMath> στο
            <em>μέγεθος του γράφου καταστάσεων</em>, όχι στον αρχικό χώρο
            αναζήτησης — και ο γράφος συχνά είναι <em>μικρός</em> (εδώ 10 κόμβοι
            έναντι 16 πιθανών).
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask3',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 3 — Άπληστη προσέγγιση του TSP μέσω MST',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Δίνεται ένας πλήρης γράφος <InlineMath>{'K_5 = (V, E, W)'}</InlineMath> με <InlineMath>{'|V| = 5'}</InlineMath> κόμβους, <InlineMath>{'|E| = m'}</InlineMath> ακμές και <InlineMath>{'W : E \\to \\mathbb{N}'}</InlineMath> συνάρτηση βαρών. Δώστε έναν άπληστο αλγόριθμο σε ψευδογλώσσα που βρίσκει μια <em>εφικτή</em> λύση του προβλήματος του πλανόδιου πωλητή (TSP). Υπολογίστε την πολυπλοκότητά του όταν ο γράφος είναι τάξης <InlineMath>{'n'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα — δανείσου το δέντρο.</strong> Το TSP (βέλτιστος κύκλος
          Hamilton) είναι NP-πλήρες, οπότε δεν περιμένουμε γρήγορο{' '}
          <em>βέλτιστο</em> αλγόριθμο. Αν όμως απλώς θέλουμε{' '}
          <em>εφικτό</em> κύκλο (όχι αναγκαστικά τον φθηνότερο), μπορούμε να
          δανειστούμε ένα MST: «ζωγράφισε» το δέντρο σε preorder, και κλείσε
          τον κύκλο.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`GREEDY-TSP(G, W):
  1. διάλεξε μια κορυφή r ως "ρίζα"
  2. υπολόγισε ένα MST T του G με ρίζα r (αλγόριθμος Prim)
  3. L := λίστα κορυφών κατά preorder διάσχιση του T
  4. επίστρεψε τον κύκλο Hamilton που επισκέπτεται
     τις κορυφές με τη σειρά L (και επιστρέφει στο r)`}</pre>
        <p>
          Δες τον σε δράση πάνω σε K₅: η preorder από v₁ μάς δίνει σειρά{' '}
          <span className="font-mono">v₁ → v₂ → v₅ → v₃ → v₄ → v₁</span> — έγκυρος
          κύκλος Hamilton με κόστος 23.
        </p>
        <MstPreorderTSP />
        <p>
          <strong>Γιατί δουλεύει.</strong> Η preorder διάσχιση επισκέπτεται κάθε
          κόμβο ακριβώς μία φορά — οπότε η σειρά L είναι μια μετάθεση όλων των
          κορυφών. Σε <em>πλήρη</em> γράφο, η ακμή ανάμεσα σε δύο διαδοχικές
          κορυφές της L υπάρχει πάντα· άρα ο κύκλος είναι πάντα εφικτός.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Prim σε πλήρες γράφο με πίνακα:{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>· preorder traversal:{' '}
          <InlineMath>{'O(n)'}</InlineMath>· σύνολο{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>.
        </p>
        <p>
          <em>(Όταν τα βάρη ικανοποιούν την τριγωνική ανισότητα, ο κύκλος έχει
          κόστος <InlineMath>{'\\le 2 \\cdot \\text{OPT}'}</InlineMath> — δηλαδή
          είναι αλγόριθμος 2-προσέγγισης. Χωρίς τριγωνική ανισότητα, μπορεί να
          είναι αυθαίρετα κακός.)</em>
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «αν δεν μπορείς να το λύσεις βέλτιστα,
            δανείσου από εύκολο συγγενή».</strong> TSP NP-πλήρες, MST σε P. Η
            προσέγγιση «κύκλος μέσω MST preorder» χρησιμοποιεί την ευκολία του
            ΕΕΔ ως «σκελετό» και πληρώνει το μετριασμό της λύσης. Κάθε φορά που
            δεις «δώσε γρήγορη εφικτή λύση σε NP-πλήρες πρόβλημα», ψάξε για
            παρόμοιο εύκολο πρόβλημα ως αρχικό βήμα.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask4',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 4 — Μηνιαίο vs ετήσιο πακέτο ίντερνετ',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Θέλουμε να επιλέξουμε τον τρόπο παροχής ίντερνετ στο σπίτι, με μηνιαίο πακέτο (χωρίς δέσμευση, μεταβλητή τιμή <InlineMath>{'p_i'}</InlineMath> τον μήνα <InlineMath>{'i'}</InlineMath>), ετήσιο συμβόλαιο (δέσμευση 12 μηνών, σταθερή τιμή <InlineMath>{'C'}</InlineMath>), ή κάποιον συνδυασμό τους σε ορίζοντα <InlineMath>{'n'}</InlineMath> μηνών. Ποιος είναι ένας άπληστος αλγόριθμος για αυτό το πρόβλημα;</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Ο φυσικός άπληστος.</strong> Σε κάθε μήνα{' '}
          <InlineMath>{'i'}</InlineMath> ο κανόνας ρωτά «μου συμφέρει ετήσιο
          τώρα;»: αν χωρούν 12 μήνες ως το τέλος και{' '}
          <InlineMath>{'C \\le \\sum_{k=i}^{i+11} p_k'}</InlineMath>, αγόρασε
          ετήσιο και πήδα στον μήνα <InlineMath>{'i+12'}</InlineMath>· αλλιώς
          αγόρασε μηνιαίο για τον <InlineMath>{'i'}</InlineMath> και προχώρα
          έναν μήνα.
        </p>
        <p>
          <strong>Δεν είναι βέλτιστος.</strong> Το ετήσιο πακέτο{' '}
          <em>δεσμεύει</em> 12 μήνες — αυτή η μνήμη είναι αόρατη στην τοπική
          σύγκριση «επόμενοι 12 vs ετήσιο». Ένα μικρό αντιπαράδειγμα τον σπάει
          δραματικά.
        </p>
        <p>
          <strong>Αντιπαράδειγμα.</strong>{' '}
          <InlineMath>{'n = 13'}</InlineMath>,{' '}
          <InlineMath>{'C = 12'}</InlineMath>, τιμές{' '}
          <InlineMath>{'p = (\\underbrace{1, \\dots, 1}_{12}, 1000)'}</InlineMath>
          . Δες την παράλληλη εξέλιξη μήνα-μήνα: η άπληστη επιλέγει ετήσιο στον
          μήνα 1 και χτυπά πάνω στους €1000 του μήνα 13· η βέλτιστη χάνει ένα
          €1 στον μήνα 1, αλλά καλύπτει με ετήσιο τους μήνες 2–13 και γλιτώνει
          τον αρπακτικό μήνα 13.
        </p>
        <InternetPlanCounter />
        <p>
          <strong>Πού είναι το σπάσιμο του άπληστου.</strong> Στον μήνα 1 ο
          κανόνας βλέπει σύνολο επόμενων 12 = <InlineMath>{'12 = C'}</InlineMath>{' '}
          → προτιμά ετήσιο (κόστος €12) και πηδά στον μήνα 13. Εκεί απομένει
          μόνο ένας μήνας, οπότε αναγκάζεται σε μηνιαίο{' '}
          <InlineMath>{'p_{13} = 1000'}</InlineMath>. Συνολικό κόστος:{' '}
          <InlineMath>{'12 + 1000 = 1012'}</InlineMath>. Η βέλτιστη λύση
          ξοδεύει μόλις <InlineMath>{'1 + 12 = 13'}</InlineMath> — η{' '}
          σχέση <strong>1012 / 13 ≈ 78×</strong> δείχνει πόσο κακή είναι η τοπική
          σύγκριση.
        </p>
        <p>
          <strong>Η σωστή προσέγγιση.</strong> Δυναμικός προγραμματισμός:{' '}
          <InlineMath>{'D[i]'}</InlineMath> = ελάχιστο κόστος για να καλυφθούν οι
          μήνες <InlineMath>{'i, i+1, \\dots, n'}</InlineMath>· αναδρομή{' '}
          <InlineMath>{'D[i] = \\min(p_i + D[i+1],\\, C + D[i+12])'}</InlineMath>
          , βάση <InlineMath>{'D[n+1] = 0'}</InlineMath>. Λύνεται σε{' '}
          <InlineMath>{'O(n)'}</InlineMath>.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «δέσμευση = μνήμη = όχι greedy».</strong>{' '}
            Όποτε μια απόφαση «κλειδώνει» μεγάλο μέλλον (συμβόλαια, ενοίκια
            χρονικού πλάτους, στρατηγικές αποθήκευσης), ο άπληστος που βλέπει
            μόνο τοπικά παράθυρα τυπικά αποτυγχάνει. Πρώτη αντίδραση: γράψε την
            αναδρομή του DP — συνήθως είναι μικρή και αποκαλύπτει αμέσως αν ο
            υποψήφιος άπληστος είναι ειδική περίπτωση.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask5',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 5 — Παιχνίδι διαδρομής σε πίνακα: αποτυγχάνει ο άπληστος',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 5',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Έστω ένας πίνακας ακεραίων <InlineMath>{'A'}</InlineMath> με <InlineMath>{'m'}</InlineMath> γραμμές και <InlineMath>{'n'}</InlineMath> στήλες. Παιχνίδι: ξεκινώντας από οποιοδήποτε κελί της κάτω γραμμής, προσπαθούμε να φτάσουμε σε κάποιο κελί της πάνω γραμμής, περνώντας από κελιά ελαχίστου συνολικού κόστους. Κόστος ενός κελιού <InlineMath>{'(i, j)'}</InlineMath> = ο αριθμός που αναγράφεται σε αυτό. Από ένα κελί κινούμαστε είτε ακριβώς επάνω, είτε διαγωνίως επάνω-αριστερά, είτε διαγωνίως επάνω-δεξιά.</p>
        <p>Θεωρήστε τον εξής άπληστο αλγόριθμο: επίλεξε στην κάτω γραμμή το κελί ελαχίστου κόστους, και σε κάθε βήμα επίλεξε το κελί ελαχίστου κόστους της αμέσως πιο πάνω γραμμής στο οποίο έχεις δικαίωμα να μεταβείς. Είναι ο αλγόριθμος βέλτιστος; Αν όχι, δώστε αντιπαράδειγμα.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Ο άπληστος ΔΕΝ είναι βέλτιστος.</strong> Διαλέγοντας πάντα το
          φθηνότερο επόμενο κελί, ο αλγόριθμος μπορεί να «παγιδευτεί»: ένα φθηνό
          κελί τώρα ίσως σε υποχρεώσει να περάσεις από ακριβά κελιά μετά.
        </p>
        <p>
          <strong>Δες το να συμβαίνει στον πίνακα της εκφώνησης.</strong> Ο
          άπληστος ξεκινά από το «3» (την κάτω-φθηνότερη θέση), αλλά κατευθύνεται
          προς γραμμές με ακριβά κελιά. Η βέλτιστη διαδρομή ξεκινά από το «5»
          δίπλα — όχι το φθηνότερο τοπικά — και αξιοποιεί τα κελιά «2» και «3»
          των πάνω γραμμών. Πάτα «Επόμ.» για να δεις την άπληστη διαδρομή· μετά
          γύρνα στη λειτουργία «Βέλτιστη» για το αντιπαράδειγμα:
        </p>
        <GridGreedyVsOpt />
        <p>
          <strong>Διαβολική λεπτομέρεια.</strong> Το «κλειδί» που χάνει ο
          άπληστος είναι το κελί με τιμή <strong>2</strong> στη δεύτερη γραμμή
          από πάνω: η βέλτιστη διαδρομή «θυσιάζει» την κάτω-φθηνότερη επιλογή
          για να φτάσει εκεί. Το «5» στην εκκίνηση κοστίζει 2 παραπάνω από το
          «3» — αλλά ξεκλειδώνει 3 πιο φθηνά κελιά στις πάνω γραμμές.
        </p>
        <p>
          <strong>Η σωστή προσέγγιση — DP.</strong>{' '}
          <InlineMath>{'D(i, j)'}</InlineMath> = ελάχιστο κόστος για να φτάσεις
          το κελί <InlineMath>{'(i, j)'}</InlineMath> από οποιοδήποτε κελί της
          κάτω γραμμής. Βάση: <InlineMath>{'D(1, j) = A[1][j]'}</InlineMath>.
          Επαγωγή: <InlineMath>{'D(i, j) = A[i][j] + \\min\\{D(i-1, j-1),\\, D(i-1, j),\\, D(i-1, j+1)\\}'}</InlineMath>
          (αγνοώντας θέσεις εκτός πίνακα). Η απάντηση είναι{' '}
          <InlineMath>{'\\min_j D(m, j)'}</InlineMath>. Χρόνος{' '}
          <InlineMath>{'O(mn)'}</InlineMath>.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «τοπικά φθηνό ≠ συνολικά φθηνό».</strong>{' '}
            Σε προβλήματα μονοπατιού σε πλέγμα ή γράφο, το «φθηνότερο επόμενο
            βήμα» αγνοεί τον κόμβο που ακολουθεί. Αν η συνέχεια της επιλογής
            φέρει ακριβά κελιά, ο άπληστος χάνει. Πάντα ψάξε αντιπαράδειγμα όπου
            ένα ακριβότερο πρώτο βήμα ξεκλειδώνει φθηνότερη μετέπειτα διαδρομή
            — και τότε σκέψου DP πάνω στο πλέγμα.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask6',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 6 — Αναβάθμιση τηλεφωνικού δικτύου (MST)',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 6',
    difficulty: 'easy',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Το τηλεφωνικό δίκτυο μιας χώρας πρέπει να αναβαθμιστεί για ταχύτερη μεταφορά δεδομένων. Το κόστος αναβάθμισης μιας γραμμής ανάμεσα σε δύο κόμβους είναι ανάλογο του μήκους της.</p>
        <p><strong>i.</strong> Διατυπώστε άπληστο αλγόριθμο που ελαχιστοποιεί το κόστος αναβάθμισης, έτσι ώστε για κάθε δύο κόμβους να υπάρχει ακριβώς μία αναβαθμισμένη διαδρομή σύνδεσης και το συνολικό κόστος να είναι το ελάχιστο δυνατό. <strong>ii.</strong> Δώστε την πολυπλοκότητα χρόνου.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Αναγνώριση του προβλήματος — δύο λέξεις, δύο διαγνώσεις.</strong>{' '}
          (α) «Για κάθε δύο κόμβους <em>ακριβώς μία</em> αναβαθμισμένη διαδρομή»
          → συνεκτικό + ακυκλικό = <strong>δέντρο</strong> (από{' '}
          [L06](/lectures/L06-graphs-i) ξέρουμε ότι «μοναδικό μονοπάτι ανά
          ζεύγος» χαρακτηρίζει το δέντρο). (β) «<em>Ελάχιστο</em> συνολικό
          κόστος». Άρα ψάχνουμε <strong>ΕΕΔ</strong> στον γράφο με κόμβους =
          τηλεφωνικοί κόμβοι, βάρη ακμών = κόστος αναβάθμισης.
        </p>
        <p>
          <strong>i. Ο αλγόριθμος.</strong> Εφαρμόζουμε έναν από τους δύο
          άπληστους:
        </p>
        <ul>
          <li>
            <strong>Kruskal:</strong> ταξινόμησε τις ακμές κατά αύξον κόστος·
            σάρωσέ τες με τη σειρά, κράτα μια ακμή αν τα άκρα της είναι σε
            διαφορετικά κομμάτια (έλεγχος με Union-Find σε σχεδόν σταθερό χρόνο).
            Δικαιολόγηση: η ιδιότητα αποκοπής εγγυάται ότι η φθηνότερη ακμή που
            ενώνει δύο κομμάτια ανήκει στο ΕΕΔ.
          </li>
          <li>
            <strong>Prim:</strong> ξεκίνα από έναν κόμβο, μεγάλωσε το δέντρο
            προσθέτοντας κάθε φορά την ελαφρύτερη ακμή που συνδέει το τρέχον
            δέντρο με νέο κόμβο (priority queue στις κορυφές).
          </li>
        </ul>
        <p>
          Δες τον Kruskal να τρέχει στον κανονικό γράφο της διάλεξης — σάρωση
          ακμών κατά αύξοντα κόστο, κάθε αποδοχή δείχνει δύο «πόλεις» να
          συγχωνεύονται, κάθε απόρριψη φωτίζει τον κύκλο που θα έκλεινε:
        </p>
        <KruskalAnimator />
        <p>
          <strong>ii. Πολυπλοκότητα.</strong> Και οι δύο τρέχουν σε{' '}
          <InlineMath>{'O(E \\log V)'}</InlineMath>: Kruskal κυριαρχείται από την
          ταξινόμηση των ακμών (Union-Find πρακτικά σταθερά)· Prim από τις{' '}
          <InlineMath>{'O(E)'}</InlineMath> πράξεις σωρού.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «μοναδικό μονοπάτι ⇒ δέντρο ⇒ ΕΕΔ».</strong>{' '}
            Όταν μια εκφώνηση σου ζητά «συνδέσε όλα τα Χ ώστε μεταξύ τους να
            υπάρχει ακριβώς ένα κρίσιμο μονοπάτι» (τηλεπικοινωνίες, νερό,
            ρεύμα, καλωδίωση δικτύου), η μετάφραση είναι σχεδόν αυτόματη: ΕΕΔ.
            Από εκεί, ο αλγόριθμος είναι Kruskal ή Prim — διάλεξε όποιον σου
            είναι πιο οικείος.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask7',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 7 — Ελάχιστα μοναδιαία διαστήματα που καλύπτουν σημεία',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 7',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Περιγράψτε έναν αποδοτικό αλγόριθμο ο οποίος, δεδομένου ενός συνόλου σημείων <InlineMath>{'\\{x_1, x_2, \\dots, x_n\\}'}</InlineMath> στον άξονα των πραγματικών αριθμών, καθορίζει το <em>μικρότερο</em> σύνολο κλειστών διαστημάτων μοναδιαίου μήκους που εμπεριέχει όλα τα δοθέντα σημεία.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Διαίσθηση — «το αριστερότερο πρέπει να καλυφθεί».</strong>{' '}
          Το αριστερότερο σημείο της εισόδου δεν μπορεί να αγνοηθεί — κάποιο
          διάστημα <em>πρέπει</em> να το περιέχει. Ποιο όμως; Από όλα τα
          μοναδιαία διαστήματα που το καλύπτουν, η ακραία περίπτωση είναι αυτό
          που ξεκινά ακριβώς στο σημείο και «απλώνεται» δεξιά. Αυτό πιάνει τα{' '}
          περισσότερα δυνατά επόμενα σημεία — άρα είναι η σωστή επιλογή.
        </p>
        <p>
          <strong>Ο άπληστος.</strong> Ταξινόμησε τα σημεία αύξοντα. Πάρε το
          αριστερότερο ακάλυπτο <InlineMath>{'y_i'}</InlineMath>, βάλε διάστημα{' '}
          <InlineMath>{'[y_i,\\, y_i + 1]'}</InlineMath>, σημείωσε όσα σημεία
          αυτό καλύπτει, και επανάλαβε.
        </p>
        <p>
          Δες τον να καλύπτει 9 σημεία με 4 διαστήματα. Η πορτοκαλί διακεκομμένη
          προεπισκόπηση δείχνει σε ποιο σημείο θα ξεκινήσει το επόμενο διάστημα
          — πάντα ευθυγραμμισμένο με το αριστερότερο πράσινο που δεν έχει
          καλυφθεί ακόμα:
        </p>
        <UnitIntervalCover />
        <p>
          <strong>Απόδειξη ορθότητας — επιχείρημα ανταλλαγής.</strong> Έστω{' '}
          <InlineMath>{'G'}</InlineMath> τα διαστήματα του άπληστου σε σειρά
          τοποθέτησης, και <InlineMath>{'O'}</InlineMath> τα διαστήματα μιας
          βέλτιστης λύσης σε σειρά αριστερού άκρου. Ισχυρισμός: μπορούμε να
          μετασχηματίσουμε την <InlineMath>{'O'}</InlineMath> σε διάταξη ίδια
          με την <InlineMath>{'G'}</InlineMath> χωρίς να αυξήσουμε το πλήθος
          διαστημάτων.
        </p>
        <p>
          Έστω το πρώτο διάστημα <InlineMath>{'I'}</InlineMath> της{' '}
          <InlineMath>{'O'}</InlineMath>: πρέπει να καλύπτει το{' '}
          <InlineMath>{'y_1'}</InlineMath>, οπότε ξεκινά κάπου στο{' '}
          <InlineMath>{'[y_1 - 1, y_1]'}</InlineMath>. Αντικατέστησέ το με το{' '}
          <InlineMath>{'[y_1, y_1 + 1]'}</InlineMath> (αυτό του άπληστου). Το
          νέο διάστημα καλύπτει το <InlineMath>{'y_1'}</InlineMath> και
          τουλάχιστον όσα σημεία κάλυπτε το αρχικό — γιατί ξεκινά πιο δεξιά,
          άρα τελειώνει πιο δεξιά, άρα δεν χάνει σημεία που ήταν στα δεξιά του
          αρχικού δεξιού άκρου. Επανάλαβε για το επόμενο διάστημα της{' '}
          <InlineMath>{'O'}</InlineMath>. Στο τέλος, η{' '}
          <InlineMath>{'O'}</InlineMath> έχει γίνει η{' '}
          <InlineMath>{'G'}</InlineMath> με ίδιο πλήθος. Άρα{' '}
          <InlineMath>{'|G| = |O|'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κυριαρχεί η ταξινόμηση:{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath>. Η σάρωση είναι{' '}
          <InlineMath>{'O(n)'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «το ακραίο στοιχείο σου λέει τι κάνεις».</strong>{' '}
            Σε προβλήματα κάλυψης με στιγμιότυπα ταξινομημένα στην ευθεία (ή
            ταξινομήσιμα), συχνά το αριστερότερο/δεξιότερο/μεγαλύτερο στοιχείο
            «αναγκάζει» τη μορφή της πρώτης απόφασης. Από εκεί ο αλγόριθμος
            βγαίνει αυτόματα: «κάλυψε το ακραίο, αφαίρεσε ό,τι συμπεριλήφθηκε,
            επανάλαβε».
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask8',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 8 — Κατανομή μαθημάτων σε αίθουσες',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 8',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Το Τμήμα Πληροφορικής ενός Πανεπιστημίου θέλει να κατανείμει ένα σύνολο <InlineMath>{'m'}</InlineMath> μαθημάτων στις διαθέσιμες αίθουσες (που είναι <InlineMath>{'n'}</InlineMath> το πλήθος, με το <InlineMath>{'n'}</InlineMath> αρκετά μεγάλο). Οποιοδήποτε μάθημα μπορεί να γίνει σε οποιαδήποτε αίθουσα, αρκεί να μην υπάρχουν χρονικές επικαλύψεις μεταξύ μαθημάτων της ίδιας αίθουσας. Θέλουμε να προγραμματίσουμε όλα τα μαθήματα χρησιμοποιώντας όσο το δυνατόν λιγότερες αίθουσες. Δώστε αποδοτικό άπληστο αλγόριθμο που αποφασίζει ποια αίθουσα θα φιλοξενήσει ποιο μάθημα. Δίνει ο αλγόριθμός σας βέλτιστο αποτέλεσμα;</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Είναι το πρόβλημα της διαμέρισης διαστημάτων.</strong> Κάθε
          μάθημα είναι ένα χρονικό διάστημα, δύο μαθήματα συγκρούονται αν
          επικαλύπτονται, κάθε αίθουσα φιλοξενεί μη-συγκρουόμενα μαθήματα. Με
          αυτή τη μετάφραση, η εκφώνηση γίνεται το γνώριμο «interval
          partitioning».
        </p>
        <p>
          <strong>Ο άπληστος.</strong> Ταξινόμησε τα μαθήματα κατά αύξοντα χρόνο
          έναρξης. Για κάθε μάθημα, αν υπάρχει ελεύθερη αίθουσα τη στιγμή που
          ξεκινά, βάλε το εκεί· αλλιώς άνοιξε νέα. Όταν ένα μάθημα τελειώνει, η
          αίθουσά του ξαναγίνεται ελεύθερη.
        </p>
        <p>
          Δες τον να τρέχει σε 11 μαθήματα όπου το βάθος (το μέγιστο πλήθος
          ταυτόχρονων μαθημάτων) είναι 3 — και ο άπληστος χρησιμοποιεί ακριβώς 3
          αίθουσες:
        </p>
        <IntervalPartitionAnimator instance="classroom" />
        <p>
          <strong>Δίνει βέλτιστο.</strong> Έστω ότι ανοίγει η αίθουσα νο.{' '}
          <InlineMath>{'d'}</InlineMath> όταν εξετάζεται κάποιο μάθημα{' '}
          <InlineMath>{'j'}</InlineMath>. Αυτό σημαίνει ότι οι{' '}
          <InlineMath>{'d-1'}</InlineMath> προηγούμενες αίθουσες έχουν όλες
          μαθήματα ενεργά τη στιγμή <InlineMath>{'s_j'}</InlineMath>. Επειδή τα
          μαθήματα σαρώνονται κατά χρόνο έναρξης, αυτά τα{' '}
          <InlineMath>{'d-1'}</InlineMath> μαθήματα ξεκίνησαν πριν την{' '}
          <InlineMath>{'s_j'}</InlineMath> και δεν έχουν τελειώσει — μαζί με
          το <InlineMath>{'j'}</InlineMath> δίνουν{' '}
          <InlineMath>{'d'}</InlineMath> μαθήματα ταυτόχρονα. Άρα το βάθος είναι{' '}
          <InlineMath>{'\\ge d'}</InlineMath>. Αλλά κάθε λύση χρειάζεται{' '}
          <InlineMath>{'\\ge'}</InlineMath> βάθος αίθουσες, και ο άπληστος
          πετυχαίνει ακριβώς <InlineMath>{'d'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong>{' '}
          <InlineMath>{'O(m \\log m)'}</InlineMath> από την ταξινόμηση
          ενάρξεων. Η σάρωση γίνεται <InlineMath>{'O(m \\log d)'}</InlineMath>{' '}
          με min-heap πάνω στους χρόνους λήξης ανοιχτών αιθουσών (κάθε ανάθεση
          είναι «βρες την αίθουσα που τελείωσε νωρίτερα»).
        </p>
        <Callout type="key">
          <p>
            <strong>Πρότυπο σκέψης — «μετάφρασε σε διαστήματα».</strong> Όταν
            ζητάς ελάχιστο πλήθος «μηχανημάτων» (αιθουσών, ταξί, διακομιστών,
            γραμμών παραγωγής) και κάθε εργασία έχει χρόνο έναρξης/λήξης, η
            μετάφραση είναι μηχανική: διαμέριση διαστημάτων → βάθος → άπληστος
            «πρώτη έναρξη + ελεύθερη μηχανή». Η απάντηση είναι πάντα ίση με το
            βάθος.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask9',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 9 — Το πάρτι της Alice (φιλτράρισμα γράφου)',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 9',
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>Η Alice θέλει να διοργανώσει ένα πάρτι. Έχει <InlineMath>{'n'}</InlineMath> υποψήφια άτομα και μια λίστα με τα ζεύγη ατόμων που ο ένας γνωρίζει τον άλλον. Θέλει να διαλέξει όσο το δυνατόν περισσότερα άτομα, με δύο περιορισμούς: <strong>(α)</strong> στο πάρτι, κάθε άτομο πρέπει να γνωρίζει τουλάχιστον άλλα 5 άτομα, και <strong>(β)</strong> κάθε άτομο πρέπει να έχει τουλάχιστον 5 άλλα άτομα που δε γνωρίζει. Δώστε αποδοτικό αλγόριθμο που δέχεται τη λίστα των <InlineMath>{'n'}</InlineMath> υποψηφίων και τα ζεύγη γνωριμιών, και παράγει την καλύτερη επιλογή. Δώστε τον χρόνο εκτέλεσης συναρτήσει του <InlineMath>{'n'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Μοντελοποίηση.</strong> Φτιάχνουμε γράφο <InlineMath>{'G'}</InlineMath>: κόμβος ανά υποψήφιο, ακμή ανάμεσα σε δύο που γνωρίζονται. Έστω τρέχον σύνολο καλεσμένων με <InlineMath>{'|V|'}</InlineMath> άτομα και ο βαθμός κάθε κόμβου <em>μέσα</em> σε αυτό το σύνολο. Ένας κόμβος <InlineMath>{'v'}</InlineMath> είναι <strong>«προβληματικός»</strong> αν:</p>
        <ul>
          <li><strong>(α)</strong> έχει βαθμό <InlineMath>{'< 5'}</InlineMath> (λιγότερους από 5 φίλους), ή</li>
          <li><strong>(β)</strong> έχει βαθμό <InlineMath>{'> |V| - 6'}</InlineMath> (αφήνει λιγότερους από 5 αγνώστους — οι μη γνωστοί του είναι <InlineMath>{'|V| - 1 - \\deg(v)'}</InlineMath>).</li>
        </ul>
        <p><strong>Ο άπληστος αλγόριθμος — επαναληπτικό φιλτράρισμα.</strong> Όσο υπάρχει προβληματικός κόμβος, αφαίρεσέ τον από το σύνολο και ενημέρωσε τους βαθμούς των γειτόνων του. Επανάλαβε μέχρι κανένας να μην παραβιάζει. Το σύνολο που μένει είναι η ζητούμενη <em>μεγαλύτερη</em> έγκυρη επιλογή.</p>
        <p>Δοκίμασέ τον σε ένα στιγμιότυπο όπου η αφαίρεση καθενός προβληματικού «γεννά» τον επόμενο — το χαρακτηριστικό cascading του αλγορίθμου:</p>
        <PartyDegreeFilter />
        <p><strong>Γιατί είναι ασφαλές (και βέλτιστο).</strong> Όταν ο{' '}
        <InlineMath>{'v'}</InlineMath> παραβιάζει το κριτήριο{' '}
        <strong>(α)</strong> τώρα — έχει λιγότερους από 5 φίλους — τότε σε{' '}
        <em>κάθε</em> υποσύνολο του τρέχοντος θα έχει ακόμη λιγότερους
        (η αφαίρεση κόμβων μόνο μειώνει βαθμούς). Άρα ΚΑΜΙΑ έγκυρη λύση δεν
        μπορεί να τον περιέχει — η αφαίρεσή του δεν χαλά τίποτα. Συμμετρικά,
        παραβίαση του κριτηρίου <strong>(β)</strong> «πάρα πολλούς γνωστούς»
        παραμένει σε κάθε υποσύνολο που τον περιλαμβάνει. Η αφαίρεση
        παραβατών δεν χαλά τους «καθαρούς»: για το <strong>(α)</strong> οι
        γείτονες χάνουν φίλο, αλλά αν αυτό τους κάνει προβληματικούς, θα
        αφαιρεθούν κι αυτοί σε επόμενο γύρο — και πάλι σωστά. Για το{' '}
        <strong>(β)</strong> η μείωση του <InlineMath>{'|V|'}</InlineMath>{' '}
        χαλαρώνει το κατώφλι. Άρα όταν σταματάμε, μένει το <em>μεγαλύτερο</em>{' '}
        έγκυρο σύνολο.</p>
        <p><strong>Πολυπλοκότητα.</strong> Κάθε «πέρασμα» (έλεγχος όλων των κόμβων + αφαίρεση ενός) κοστίζει <InlineMath>{'O(n^2)'}</InlineMath> για τους βαθμούς. Γίνονται το πολύ <InlineMath>{'n'}</InlineMath> τέτοια περάσματα (κάθε ένα αφαιρεί έστω και έναν κόμβο), άρα συνολικά <InlineMath>{'O(n^3)'}</InlineMath>. Με προσεκτικότερη υλοποίηση (κράτημα βαθμών + heap προτεραιοτήτων) πέφτει σε <InlineMath>{'O(n^2)'}</InlineMath>.</p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «αν παραβιάζει τώρα, παραβιάζει πάντα».</strong>{' '}
            Σε προβλήματα όπου ζητάμε <em>μέγιστο υποσύνολο</em> με τοπικό
            κανόνα που συμπεριφέρεται μονότονα στην αφαίρεση (βαθμός μειώνεται
            μόνο, κάλυψη μεγαλώνει μόνο), η σωστή στρατηγική είναι ο{' '}
            <strong>επαναληπτικός κανόνας αφαίρεσης</strong> — όχι ωμή
            αναζήτηση όλων των <InlineMath>{'2^n'}</InlineMath> υποσυνόλων.
            Το ίδιο σχήμα δίνει τον <em>k-core</em> ενός γραφήματος (αφαιρείς
            όποιον έχει <InlineMath>{'\\deg < k'}</InlineMath> μέχρι σταθερότητα),
            καθώς και αλγόριθμοι τύπου <em>peeling</em> σε bipartite matching.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask10',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 10 — Συντομότερο μονοπάτι με αρνητικά βάρη;',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 10',
    difficulty: 'medium',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>Ο καθηγητής Εξυπνούλης προτείνει τον ακόλουθο αλγόριθμο για την εύρεση της συντομότερης διαδρομής από τον κόμβο <InlineMath>{'s'}</InlineMath> στον κόμβο <InlineMath>{'t'}</InlineMath> σε έναν γράφο με ακμές αρνητικού βάρους: πρόσθεση μιας σταθεράς σε κάθε βάρος ακμής ώστε όλα τα βάρη να γίνουν θετικά, και κατόπιν εκτέλεση του αλγορίθμου του Dijkstra. Λειτουργεί τώρα σωστά ο αλγόριθμος;</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>ΟΧΙ, ο αλγόριθμος του Εξυπνούλη είναι λανθασμένος.</strong>{' '}
          Η ίδια αρχή που είδαμε στην <em>ask9 / πρόσθεση σταθεράς</em>: όταν
          προσθέτεις την ίδια ποσότητα σε κάθε ακμή, μονοπάτια με{' '}
          <em>περισσότερες</em> ακμές τιμωρούνται περισσότερο. Άρα ο
          μετασχηματισμός μπορεί να αλλάξει ποιο μονοπάτι είναι το συντομότερο.
        </p>
        <p>
          <strong>Το κρίσιμο σημείο.</strong> Αν προσθέσουμε σταθερά{' '}
          <InlineMath>{'c'}</InlineMath> σε <em>κάθε</em> ακμή, τότε ένα
          μονοπάτι με <InlineMath>{'\\ell'}</InlineMath> ακμές βλέπει το κόστος
          του να αυξάνεται κατά <InlineMath>{'c \\cdot \\ell'}</InlineMath>. Η
          αύξηση εξαρτάται από το <em>πλήθος ακμών</em> — δεν είναι ίδια για
          όλους. Ο Dijkstra απαιτεί μη-αρνητικά βάρη ακριβώς για να μη χρειαστεί
          ποτέ να ξανα-εξετάσει μια κορυφή, και η «πρόσθεση σταθεράς» δεν
          σέβεται αυτή την απαίτηση σε επίπεδο <em>μονοπατιών</em>, μόνο σε
          επίπεδο ακμών.
        </p>
        <p>
          <strong>Αντιπαράδειγμα.</strong> Κόμβοι{' '}
          <InlineMath>{'u, v, w'}</InlineMath> με ακμές{' '}
          <InlineMath>{'u \\to v'}</InlineMath> βάρους{' '}
          <InlineMath>{'-1'}</InlineMath>,{' '}
          <InlineMath>{'v \\to w'}</InlineMath> βάρους{' '}
          <InlineMath>{'-3'}</InlineMath>, και{' '}
          <InlineMath>{'u \\to w'}</InlineMath> βάρους{' '}
          <InlineMath>{'-3'}</InlineMath>. Το πραγματικό συντομότερο{' '}
          <InlineMath>{'u \\to w'}</InlineMath> είναι το{' '}
          <InlineMath>{'u \\to v \\to w'}</InlineMath> με κόστος{' '}
          <InlineMath>{'-1 + (-3) = -4'}</InlineMath>, έναντι{' '}
          <InlineMath>{'-3'}</InlineMath> της απευθείας ακμής. Σύρε τον slider
          για να δεις τον Dijkstra να γίνεται «σωστός για λάθος λόγο» στο
          ενδιάμεσο, και τελικά να επιστρέφει λάθος απάντηση όταν όλα τα βάρη
          έγιναν θετικά:
        </p>
        <ConstantShiftFail instance="ask10" />
        <p>
          <strong>Πιο συγκεκριμένα:</strong> προσθέτουμε{' '}
          <InlineMath>{'c = 4'}</InlineMath> σε όλα →{' '}
          <InlineMath>{'u \\to v = 3'}</InlineMath>,{' '}
          <InlineMath>{'v \\to w = 1'}</InlineMath>,{' '}
          <InlineMath>{'u \\to w = 1'}</InlineMath>. Η διαδρομή{' '}
          <InlineMath>{'u \\to v \\to w'}</InlineMath> κοστίζει τώρα{' '}
          <InlineMath>{'3 + 1 = 4'}</InlineMath>, ενώ η απευθείας{' '}
          <InlineMath>{'u \\to w'}</InlineMath> μόλις{' '}
          <InlineMath>{'1'}</InlineMath>. Ο Dijkstra επιστρέφει την απευθείας —
          λάθος απάντηση.
        </p>
        <p>
          <strong>Η σωστή λύση.</strong> Για γράφους με αρνητικά βάρη χωρίς
          αρνητικούς κύκλους, ο αλγόριθμος <strong>Bellman-Ford</strong>{' '}
          χειρίζεται σωστά τα αρνητικά σε χρόνο{' '}
          <InlineMath>{'O(|V| \\cdot |E|)'}</InlineMath>. Για γενική
          απελευθέρωση από το «πρόσημο», υπάρχει επίσης ο μετασχηματισμός{' '}
          <em>Johnson</em> (δες κατευθυνόμενα/προχωρημένα μαθήματα), που
          χρησιμοποιεί <em>vertex potentials</em>, όχι σταθερά ανά ακμή.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «δεν μπορείς να φτιάξεις τα αρνητικά με
            +σταθερά».</strong> Ο πειρασμός είναι μεγάλος: «πρόσθεσε τόσο ώστε
            να μην υπάρχουν αρνητικά, και μετά Dijkstra». Αλλά η ασύμμετρη
            επιβάρυνση ανά μήκος μονοπατιού καταστρέφει τη βελτιστότητα. Αν
            βλέπεις αρνητικά βάρη, η σωστή αντίδραση είναι{' '}
            <strong>Bellman-Ford</strong> (ή τοπολογική χαλάρωση αν ο γράφος
            είναι DAG, όπως στην ask8).
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask11',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 11 — Σωστό/Λάθος για MST και Dijkstra',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 11',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Να αποδείξετε αν είναι σωστές ή λάθος οι παρακάτω εκφράσεις:</p>
        <p><strong>(i)</strong> Αν ο γράφος <InlineMath>{'G'}</InlineMath> έχει περισσότερες από <InlineMath>{'|V| - 1'}</InlineMath> ακμές και υπάρχει μια μοναδική ακμή μέγιστου βάρους, τότε αυτή η ακμή δεν μπορεί να είναι τμήμα ενός ΔΕΕΚ (δέντρου επικάλυψης ελάχιστου κόστους).</p>
        <p><strong>(ii)</strong> Το δέντρο διαδρομών μικρότερου βάρους που υπολογίζεται από τον αλγόριθμο του Dijkstra είναι υποχρεωτικά ένα ΔΕΕΚ.</p>
        <p><strong>(iii)</strong> Έστω γράφος <InlineMath>{'G'}</InlineMath> με διαφορετικά βάρη σε κάθε ακμή. Τότε ο <InlineMath>{'G'}</InlineMath> έχει μοναδικό ΔΕΕΚ.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(i) ΛΑΘΟΣ.</strong> Η ιδιότητα κύκλου λέει ότι η μέγιστη ακμή{' '}
          <em>ενός κύκλου</em> δεν χρειάζεται να μπει στο ΕΕΔ — όχι «η μέγιστη
          ακμή ολόκληρου του γράφου». Η μοναδική μέγιστη του γράφου μπορεί να
          είναι <strong>γέφυρα</strong> και να μην ανήκει σε κανέναν κύκλο —
          οπότε υποχρεωτικά μπαίνει στο ΕΕΔ. Δες τον γράφο-αντιπαράδειγμα: 4
          ακμές &gt; |V| − 1 = 3, η <InlineMath>{'u\\!-\\!x = 10'}</InlineMath>{' '}
          είναι η μοναδική μέγιστη, αλλά γέφυρα προς την{' '}
          <InlineMath>{'x'}</InlineMath>:
        </p>
        <MaxEdgeAsBridge />
        <p>
          <strong>(ii) ΛΑΘΟΣ.</strong> Dijkstra-tree και ΕΕΔ ελαχιστοποιούν{' '}
          <em>διαφορετικά πράγματα</em>: ο Dijkstra τις αποστάσεις από τη ρίζα,
          το ΕΕΔ το συνολικό βάρος του δέντρου. Όταν αυτοί οι στόχοι συγκρούονται,
          παράγουν διαφορετικά δέντρα. Το αντιπαράδειγμα είναι ένα απλό τρίγωνο:
        </p>
        <DijkstraTreeVsMstTriangle />
        <p>
          <strong>(iii) ΣΩΣΤΟ — με διακριτά βάρη, ΕΕΔ μοναδικό.</strong>{' '}
          <em>Διαίσθηση μέσω ιδιότητας αποκοπής.</em> Για κάθε διαμέριση των
          κορυφών σε δύο σύνολα <InlineMath>{'A, V \\setminus A'}</InlineMath>,
          η <strong>μοναδική</strong> ελαφρύτερη ακμή που τη διασχίζει είναι
          αναγκαστικά μέρος <em>κάθε</em> ΕΕΔ.{' '}
          <em>Αυστηρή απόδειξη με ανταλλαγή.</em> Έστω δύο διαφορετικά ΕΕΔ{' '}
          <InlineMath>{'T_1, T_2'}</InlineMath>. Πάρε την ελαφρύτερη ακμή{' '}
          <InlineMath>{'e \\in T_1 \\setminus T_2'}</InlineMath>. Προσθήκη της
          στο <InlineMath>{'T_2'}</InlineMath> δημιουργεί έναν κύκλο, που
          περιέχει κάποια ακμή <InlineMath>{'f \\notin T_1'}</InlineMath>. Αφού
          τα βάρη είναι διακριτά, ή{' '}
          <InlineMath>{'w(e) < w(f)'}</InlineMath> (οπότε{' '}
          <InlineMath>{'T_2 - f + e'}</InlineMath> είναι ΕΕΔ φθηνότερο από{' '}
          <InlineMath>{'T_2'}</InlineMath> — αντίφαση) ή{' '}
          <InlineMath>{'w(f) < w(e)'}</InlineMath> (συμμετρικά, αντίφαση με τη
          βελτιστότητα του <InlineMath>{'T_1'}</InlineMath>). Άρα δεν υπάρχουν
          δύο διαφορετικά ΕΕΔ.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «ποια ακριβώς ιδιότητα κύκλου/αποκοπής;».</strong>{' '}
            Σ/Λ δηλώσεις για ΕΕΔ συχνά παρερμηνεύουν ποιες ακμές αποκλείει η
            ιδιότητα κύκλου. Διπλό test: (α) μπαίνει η ακμή σε κάποιον κύκλο; Αν
            όχι, είναι γέφυρα — μπαίνει πάντα. (β) Είναι η <em>μέγιστη</em> κάποιου
            κύκλου; Μόνο τότε η ιδιότητα κύκλου την «βγάζει». Παρόμοια: Dijkstra
            ≠ ΕΕΔ — διαφορετικοί στόχοι· διακριτά βάρη ⇒ μοναδικό ΕΕΔ (κλασική
            ερώτηση εξετάσεων).
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-7-ask12',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 12 — Σακίδιο: κλασματικό (άπληστο) vs 0-1',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 12',
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <>
        <p><strong>Το 0-1 σακίδιο:</strong> έχουμε <InlineMath>{'n'}</InlineMath> αντικείμενα, το <InlineMath>{'i'}</InlineMath>-οστό με βάρος <InlineMath>{'w[i]'}</InlineMath> και αξία <InlineMath>{'v[i]'}</InlineMath>, και μια τσάντα που σηκώνει βάρος <InlineMath>{'W'}</InlineMath>. Ποια αντικείμενα τοποθετούμε για να μεγιστοποιήσουμε την αξία;</p>
        <p><strong>Το κλασματικό σακίδιο:</strong> παραλλαγή όπου μπορούμε να πάρουμε ένα <em>κλάσμα</em> ενός αντικειμένου. Λύστε το με άπληστο αλγόριθμο, αποδείξτε την ορθότητά του, και συζητήστε αν υπάρχει άπληστος αλγόριθμος για το 0-1 σακίδιο.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα — δύο εκφράσεις του «πάρε το καλύτερο πρώτα», ένα
          απαγορευτικό κόψιμο που τις χωρίζει.</strong> Και τα δύο σακίδια
          ξεκινούν με τον ίδιο εύλογο κανόνα: «ταξινόμησε τα αντικείμενα κατά
          φθίνοντα λόγο αξίας προς βάρος{' '}
          <InlineMath>{'v_i / w_i'}</InlineMath> και βάλε τα στη σειρά». Η
          διαφορά είναι αν επιτρέπεται να βάλεις <em>φέτα</em>: στο κλασματικό
          ναι (και τότε ο άπληστος είναι βέλτιστος), στο 0-1 όχι (και τότε
          αποτυγχάνει).
        </p>
        <p>
          Δες τις δύο εκδοχές πάνω στο ίδιο στιγμιότυπο της εκφώνησης{' '}
          <InlineMath>{'w = (10, 20, 30)'}</InlineMath>,{' '}
          <InlineMath>{'v = (60, 80, 90)'}</InlineMath>,{' '}
          <InlineMath>{'W = 50'}</InlineMath> (λόγοι 6, 4, 3 — ήδη ταξινομημένοι):
        </p>
        <FractionalVsZeroOneKnapsack />
        <p>
          <strong>Γιατί το κλασματικό λύνεται άπληστα (επιχείρημα
          ανταλλαγής).</strong> Έστω βέλτιστη λύση που <em>δεν</em> ακολουθεί
          τη σειρά λόγων: δηλαδή έχει βάλει κάποιο μέρος{' '}
          <InlineMath>{'\\delta'}</InlineMath> από αντικείμενο{' '}
          <InlineMath>{'j'}</InlineMath> με χαμηλό λόγο{' '}
          <InlineMath>{'v_j / w_j'}</InlineMath>, ενώ έχει χώρο και άφησε έξω
          μέρος από αντικείμενο <InlineMath>{'i'}</InlineMath> με υψηλότερο
          λόγο <InlineMath>{'v_i / w_i'}</InlineMath>. Αντικαθιστούμε το{' '}
          <InlineMath>{'\\delta'}</InlineMath> κιλά του{' '}
          <InlineMath>{'j'}</InlineMath> με{' '}
          <InlineMath>{'\\delta'}</InlineMath> κιλά του{' '}
          <InlineMath>{'i'}</InlineMath>: το βάρος δεν αλλάζει, αλλά η αξία
          αλλάζει κατά{' '}
          <InlineMath>{'\\delta \\cdot (v_i/w_i - v_j/w_j) > 0'}</InlineMath>.
          Άρα η αρχική λύση δεν ήταν βέλτιστη — αντίφαση. Συμπέρασμα: το
          βέλτιστο γεμίζει την τσάντα κατά φθίνοντα λόγο.
        </p>
        <p>
          <strong>Γιατί ο ίδιος κανόνας σπάει στο 0-1.</strong> Στο
          αντιπαράδειγμα ο άπληστος παίρνει A (w=10, v=60) και B (w=20, v=80),
          γεμίζει 30 από 50 — μένουν 20 kg κενά, που δεν μπορούν να καλυφθούν
          γιατί το επόμενο C ζυγίζει 30, και «20 από C» απαγορεύεται. Ο
          άπληστος <em>δεν μπορεί να «δει»</em> ότι θυσιάζοντας το πρώτο
          αντικείμενο (το πιο «αποδοτικό» κατά λόγο) θα μπορούσε να
          συναρμολογήσει B + C = 50 kg / 170 αξία. Πολυπλοκότητα δομής:
          το 0-1 σακίδιο είναι NP-δύσκολο, οπότε δεν περιμένουμε καμία άπληστη
          συνταγή να το λύνει βέλτιστα. Λύνεται μόνο με δυναμικό προγραμματισμό
          ({' '}
          <a className="underline" href="/lectures/L15-dp-ii">
            L15
          </a>{' '}
          — πίνακας <InlineMath>{'M[i][w]'}</InlineMath>, χρόνος{' '}
          <InlineMath>{'O(nW)'}</InlineMath>: ψευδο-πολυωνυμικός).
        </p>
        <p>
          <strong>Πολυπλοκότητα του κλασματικού.</strong>{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath> από την ταξινόμηση των
          λόγων, και <InlineMath>{'O(n)'}</InlineMath> για το γέμισμα — άρα
          συνολικά <InlineMath>{'O(n \\log n)'}</InlineMath>.
        </p>
        <Callout type="warning">
          <p>
            <strong>Πρότυπο σκέψης — «αν δεν μπορείς να κόψεις, ο άπληστος
            είναι παγίδα».</strong> Όποτε δεις πρόβλημα στυλ «πάρε με όριο
            χωρητικότητας/προϋπολογισμού», ρώτα πρώτα:{' '}
            <em>μπορώ να πάρω «λίγο» από ένα αντικείμενο;</em> Αν ναι, η σειρά
            λόγων είναι ο σωστός άπληστος και η ορθότητα είναι ανταλλαγή. Αν
            όχι, πιθανότατα έχεις 0-1 (ή κάποιο NP-δύσκολο), και ο
            «εύλογος άπληστος» θα σου παρουσιάσει αντιπαράδειγμα στο
            διορθωτικό. Στην εξέταση: αν χωράει DP πίνακας, βγάλε αμέσως τον{' '}
            <InlineMath>{'M[i][w]'}</InlineMath>· αν όχι, δείξε το{' '}
            <InlineMath>{'(10, 20, 30)/(60, 80, 90)'}</InlineMath> ως
            counterexample και πες «NP-δύσκολο, χρειάζεται DP».
          </p>
        </Callout>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #8 — μεταγραμμένο & χωρισμένο ανά διάλεξη ───────
  {
    id: 'front-set-8-ask1',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 1 — Μέσο κόστος όλων των μονοπατιών σε DAG',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L17-dp-iv'],
    statement: (
      <>
        <p>Εύρεση του μέσου κόστους όλων των μονοπατιών, σε έναν κατευθυνόμενο ακυκλικό γράφο με βάρη <InlineMath>{'G = (V, E)'}</InlineMath>, από μία κορυφή έναρξης <InlineMath>{'s'}</InlineMath> προς μία κορυφή <InlineMath>{'t'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Πρώτη κίνηση — μετάφραση.</strong> «Μέσο κόστος όλων των
          μονοπατιών» είναι ένας λόγος δύο ποσοτήτων: το{' '}
          <em>άθροισμα</em> των κοστών δια το <em>πλήθος</em> τους. Δύο
          απαντήσεις που πρέπει να υπολογίσουμε ταυτόχρονα — και αν προσπαθούμε
          να μετρήσουμε μόνο τη μία (π.χ. μόνο το άθροισμα ή μόνο το πλήθος),
          δεν θα έχουμε αρκετή πληροφορία να σχηματίσουμε το όλο.
        </p>
        <p>
          <strong>Η ιδέα.</strong> Φανταστείτε ότι στεκόμαστε σε μια κορυφή{' '}
          <InlineMath>{'x'}</InlineMath> και ρωτάμε: «πόσα μονοπάτια ξεκινούν
          εδώ και τελειώνουν στο <InlineMath>{'t'}</InlineMath>, και τι κόστος
          έχουν;». Κάθε τέτοιο μονοπάτι ξεκινά με ΜΙΑ εξερχόμενη ακμή{' '}
          <InlineMath>{'(x, y)'}</InlineMath> και ύστερα γίνεται «πρόβλημα για
          τον <InlineMath>{'y'}</InlineMath>». Αν ξέρω την απάντηση για κάθε
          διάδοχο <InlineMath>{'y'}</InlineMath>, ξέρω και για το{' '}
          <InlineMath>{'x'}</InlineMath> — αυτή είναι η αναδρομή.
        </p>
        <p>
          <strong>Δύο τιμές ανά κορυφή.</strong> Όπως στο{' '}
          <a href="/lectures/L17-dp-iv" className="underline">ανεξάρτητο σύνολο σε δέντρο</a>{' '}
          του L17, μία τιμή δεν αρκεί — χρειαζόμαστε δύο:
        </p>
        <ul>
          <li>
            <InlineMath>{'count[x]'}</InlineMath> = πλήθος διακριτών μονοπατιών{' '}
            <InlineMath>{'x\\to t'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'sum[x]'}</InlineMath> = άθροισμα των κοστών αυτών των
            μονοπατιών.
          </li>
        </ul>
        <p>
          Με βάσεις <InlineMath>{'count[t] = 1, sum[t] = 0'}</InlineMath> (το
          «κενό» μονοπάτι από το <InlineMath>{'t'}</InlineMath> στον εαυτό
          του), οι αναδρομές είναι:
        </p>
        <BlockMath>{'count[x] = \\sum_{y:\\,(x,y)\\in E} count[y]'}</BlockMath>
        <BlockMath>{'sum[x] = \\sum_{y:\\,(x,y)\\in E} \\bigl(count[y]\\cdot w(x,y) + sum[y]\\bigr)'}</BlockMath>
        <p>
          <strong>Διαβάστε σε λόγια τη δεύτερη σχέση:</strong> κάθε ακμή{' '}
          <InlineMath>{'(x, y)'}</InlineMath> με βάρος{' '}
          <InlineMath>{'w(x, y)'}</InlineMath> προσφέρεται σε ΟΛΑ τα{' '}
          <InlineMath>{'count[y]'}</InlineMath> μονοπάτια που ξεκινούν μέσω
          αυτής (γι' αυτό πολλαπλασιάζουμε), και επιπλέον αθροίζονται τα ήδη
          υπολογισμένα κόστη <InlineMath>{'sum[y]'}</InlineMath>.
        </p>
        <p>
          <strong>Σειρά υπολογισμού.</strong> Επεξεργαζόμαστε τις κορυφές σε{' '}
          <strong>αντίστροφη τοπολογική σειρά</strong>, ξεκινώντας από το{' '}
          <InlineMath>{'t'}</InlineMath> και προχωρώντας προς το{' '}
          <InlineMath>{'s'}</InlineMath>: όταν φτάνουμε σε μια κορυφή, οι
          διάδοχοί της έχουν ήδη ολοκληρωθεί. Δες ένα συγκεκριμένο στιγμιότυπο
          να γεμίζει βήμα-βήμα:
        </p>
        <DagAveragePathCost />
        <p>
          <strong>Η απάντηση.</strong> Το ζητούμενο μέσο κόστος είναι ο λόγος{' '}
          <InlineMath>{'\\dfrac{sum[s]}{count[s]}'}</InlineMath>. Στο
          στιγμιότυπο της εικόνας: 4 διακριτά μονοπάτια, άθροισμα κοστών 42,
          οπότε <InlineMath>{'42/4 = 10{,}5'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε κορυφή επεξεργάζεται μία φορά,
          και κάθε ακμή <InlineMath>{'(x, y)'}</InlineMath> ψηφίζει ακριβώς μία
          φορά στο <InlineMath>{'count[x]'}</InlineMath> και στο{' '}
          <InlineMath>{'sum[x]'}</InlineMath>· συνολικά{' '}
          <InlineMath>{'\\Theta(V + E)'}</InlineMath>. Η τοπολογική ταξινόμηση
          γίνεται μία φορά σε <InlineMath>{'\\Theta(V + E)'}</InlineMath> με DFS.
        </p>
        <Callout type="intuition">
          <p>
            <strong>Πρότυπο σκέψης — «μέσος όρος ⇒ άθροισμα + πλήθος ΜΑΖΙ».</strong>{' '}
            Όποτε σου ζητούν μέσο όρο πάνω σε ολόκληρη οικογένεια αντικειμένων
            (μονοπάτια, δέντρα, λύσεις, υποακολουθίες), δεν αρκεί να
            υπολογίσεις μόνο το άθροισμα ή μόνο το πλήθος — χρειάζεσαι ΔΥΟ
            παράλληλες αναδρομές που γεμίζουν σε λοκ-στεπ. Το ίδιο τέχνασμα
            δουλεύει για: «μέσο μήκος συντομότερων μονοπατιών», «πλήθος
            βέλτιστων λύσεων», «πλήθος + κόστος συνδυασμών», ακόμα και
            «αναμενόμενη τιμή κάποιας τυχαίας πορείας σε DAG». Η συνταγή:
            παίρνεις τη γνωστή αναδρομή της μιας ποσότητας, βρίσκεις την
            παράλληλη αναδρομή της δεύτερης, και τις τρέχεις μαζί.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-8-ask2',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 2 — Βέλτιστη ευθυγράμμιση αλληλουχιών DNA',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L16-dp-iii'],
    statement: (
      <>
        <p>
          Έχουμε δύο αλληλουχίες DNA — δηλαδή δύο συμβολοσειρές πάνω σε ένα{' '}
          τετραγράμματο αλφάβητο <InlineMath>{'\\{A, T, G, C\\}'}</InlineMath>{' '}
          — και θέλουμε να τις <strong>ευθυγραμμίσουμε</strong> με τον καλύτερο
          δυνατό τρόπο. «Ευθυγράμμιση» όπως στη <a href="/lectures/L16-dp-iii" className="underline">L16</a>:
          βάζουμε τη μία κάτω από την άλλη σε στήλες· κάθε στήλη είτε ζευγαρώνει
          δύο γράμματα, είτε ζευγαρώνει ένα γράμμα με ένα <em>κενό</em>{' '}
          (παύλα). Αυτή τη φορά, ωστόσο, αντί για το ελάχιστο{' '}
          <em>κόστος</em>, ψάχνουμε το μέγιστο <strong>σκορ</strong>:
        </p>
        <ul>
          <li>ταύτιση (ίδια βάση): <InlineMath>{'+1'}</InlineMath> — επιβράβευση</li>
          <li>μη-ταύτιση (διαφορετική βάση): <InlineMath>{'-1'}</InlineMath> — μικρή ποινή</li>
          <li>κενό: <InlineMath>{'-2'}</InlineMath> — μεγαλύτερη ποινή</li>
        </ul>
        <p>
          Δίνονται <InlineMath>{'x = \\text{ATGGCA}'}</InlineMath> (μήκος 6) και{' '}
          <InlineMath>{'y = \\text{TCTATGG}'}</InlineMath> (μήκος 7). Βρες τη
          βέλτιστη βαθμολογία ευθυγράμμισης και ανάκτησε τουλάχιστον μία
          βέλτιστη ευθυγράμμιση.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Πρώτη κίνηση — δες τη διαφορά από τη διάλεξη.</strong>{' '}
          Η L16 έλεγε «ελάχιστο <em>κόστος</em>»· εδώ λέμε «μέγιστο{' '}
          <em>σκορ</em>». Η ταύτιση από <em>δωρεάν κίνηση</em>{' '}
          (κόστος 0) γίνεται <em>επιβράβευση</em> (+1)· η σύγκρουση από κόστος
          +1 γίνεται ποινή −1· το κενό από κόστος +1 γίνεται −2. Αυτό{' '}
          αναποδογυρίζει δύο πράγματα ταυτόχρονα:{' '}
          <strong>τα πρόσημα</strong> και <strong>τον τελεστή</strong>{' '}
          (από <span className="font-mono">min</span> σε{' '}
          <span className="font-mono">max</span>). Δες ένα και το αυτό κελί
          μέσα από τους δύο κόσμους και πρόσεξε ότι ο σκελετός — τρεις
          υποψήφιοι, μία επιλογή — μένει αυτούσιος:
        </p>
        <MinMaxFlipExplainer />
        <p>
          <strong>Η αναδρομή — ίδιο σχήμα, νέα νούμερα.</strong> Έστω{' '}
          <InlineMath>{'M[i][j]'}</InlineMath> το <em>μέγιστο σκορ</em>{' '}
          ευθυγράμμισης του προθέματος <InlineMath>{'y[1..i]'}</InlineMath>{' '}
          (γραμμές) με το πρόθεμα <InlineMath>{'x[1..j]'}</InlineMath>{' '}
          (στήλες). Η «τελευταία στήλη» της ευθυγράμμισης μπορεί να είναι ένα
          από τρία πράγματα — όπως στη διάλεξη, αλλά τώρα με σκορ:
        </p>
        <BlockMath>{'M[i][j] = \\max\\begin{cases} M[i-1][j-1] + \\sigma(y_i, x_j) & \\text{ταίριασμα } y_i \\text{ με } x_j \\\\ M[i-1][j] - 2 & \\text{κενό στο } x \\text{ (το } y_i \\text{ αταίριαστο)} \\\\ M[i][j-1] - 2 & \\text{κενό στο } y \\text{ (το } x_j \\text{ αταίριαστο)} \\end{cases}'}</BlockMath>
        <p>
          όπου <InlineMath>{'\\sigma(y_i, x_j) = +1'}</InlineMath> αν τα δύο
          γράμματα ταυτίζονται, αλλιώς <InlineMath>{'-1'}</InlineMath>.{' '}
          <strong>Βασικές περιπτώσεις:</strong> ευθυγράμμιση με την κενή
          συμβολοσειρά κοστίζει ένα κενό ανά γράμμα, άρα{' '}
          <InlineMath>{'M[i][0] = -2i'}</InlineMath> και{' '}
          <InlineMath>{'M[0][j] = -2j'}</InlineMath>· και{' '}
          <InlineMath>{'M[0][0] = 0'}</InlineMath>.
        </p>
        <p>
          <strong>Δες τον πίνακα να γεμίζει.</strong> Παρακάτω, ο{' '}
          8×7 πίνακας <InlineMath>{'M'}</InlineMath> για{' '}
          <InlineMath>{'x = \\text{ATGGCA}'}</InlineMath> και{' '}
          <InlineMath>{'y = \\text{TCTATGG}'}</InlineMath>. Στην καρτέλα{' '}
          «Γέμισμα», κάθε γραμμή αποκαλύπτει το{' '}
          <InlineMath>{'M[i][j]'}</InlineMath> σαν το <em>μέγιστο</em>{' '}
          τριών υποψηφίων· στο «Backtrack», περπατάμε το βέλτιστο μονοπάτι
          από το <InlineMath>{'(7, 6)'}</InlineMath> πίσω στο{' '}
          <InlineMath>{'(0, 0)'}</InlineMath>, και κάθε ακμή του γίνεται μία
          στήλη της ευθυγράμμισης· στα «Πολλαπλά βέλτιστα», ο χάρτης δείχνει
          ΟΛΑ τα κελιά από όπου περνά κάποιο βέλτιστο μονοπάτι:
        </p>
        <DnaScoreAlignTable />
        <p>
          <strong>Αποτέλεσμα.</strong> Το βέλτιστο σκορ είναι{' '}
          <InlineMath>{'M[7][6] = -6'}</InlineMath>. Από το «Backtrack»
          βλέπεις μία βέλτιστη ευθυγράμμιση που <em>συγκεντρώνει</em> τα
          ταιριάσματα στο μέσον:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft/40 p-3 font-mono text-sm leading-relaxed text-fg">
{`x:   −   −   −   A   T   G   G   C   A
     ·   ·   ·   ✓   ✓   ✓   ✓   ·   ·
y:   T   C   T   A   T   G   G   −   −`}
        </pre>
        <p>
          Τέσσερα ταιριάσματα (το «<strong>κοινό κομμάτι ATGG</strong>») και
          πέντε κενά — σκορ:{' '}
          <InlineMath>{'4 \\cdot (+1) + 5 \\cdot (-2) = -6'}</InlineMath>. Η
          συμβολοσειρά ATGG είναι, μάλιστα, η <em>μέγιστη κοινή υπακολουθία</em>{' '}
          (<a href="#exercise:pt2-th3" className="underline">LCS</a>) των{' '}
          <InlineMath>{'x, y'}</InlineMath> — δεν είναι σύμπτωση: το σκορ με{' '}
          <InlineMath>{'+1/-1'}</InlineMath> και αυστηρά αρνητικά κενά
          ωθεί τη βέλτιστη λύση να <em>κουμπώσει</em> όσες ταυτίσεις γίνεται,
          οπότε στρωτά «πιάνει» την LCS.
        </p>
        <Callout type="note">
          <strong>Δεν είναι μοναδική.</strong> Στην καρτέλα «Πολλαπλά βέλτιστα»
          φαίνονται πολλά κελιά κίτρινα — δηλαδή σε ΚΑΠΟΙΟ βέλτιστο μονοπάτι,
          αλλά όχι σε κάθε. Η εξεταστική απαντά «η (ή τις) βέλτιστη
          ευθυγράμμιση» επειδή υπάρχουν αρκετές ισόσκορες λύσεις (όλες με
          σκορ −6). Όσα κελιά είναι <em>πράσινα</em>{' '}
          — και ιδιαίτερα τα τέσσερα ταιριάσματα ATGG — βρίσκονται μέσα σε{' '}
          ΚΑΘΕ βέλτιστο: αυτά είναι ο σταθερός πυρήνας της απάντησης.
        </Callout>
        <p>
          <strong>Πολυπλοκότητα.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'(|y|+1) \\cdot (|x|+1)'}</InlineMath> κελιά και κάθε
          κελί υπολογίζεται σε <InlineMath>{'O(1)'}</InlineMath> από τρεις
          γείτονες, οπότε{' '}
          <InlineMath>{'\\Theta(|x| \\cdot |y|)'}</InlineMath> χρόνος και
          χώρος. Αν χρειαστεί μόνο η <em>τιμή</em> και όχι η ίδια η
          ευθυγράμμιση, αρκούν δύο γραμμές μνήμης{' '}
          <InlineMath>{'O(|x| + |y|)'}</InlineMath>· για να ανακτηθεί η{' '}
          ευθυγράμμιση σε γραμμικό χώρο, χρειάζεται{' '}
          <a href="/lectures/L16-dp-iii#hirschberg" className="underline">
            Hirschberg
          </a>{' '}
          (η ίδια ιδέα δουλεύει αυτούσια με max αντί min — απλώς αλλάζει η
          ορολογία).
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «ευθυγράμμιση με αναπρόσημο».</strong> Όταν
          μια εκφώνηση δίνει σκορ <em>θετικό για ταυτίσεις</em> και{' '}
          <em>αρνητικό για κενά/συγκρούσεις</em>, είναι η ίδια αλγοριθμική
          μηχανή με τη διάλεξη — αλλά:
          <ul>
            <li>
              <InlineMath>{'\\min \\to \\max'}</InlineMath>· νικάει η{' '}
              <em>μεγαλύτερη</em> τιμή του max αντί της μικρότερης του min.
            </li>
            <li>
              Οι σταθερές <InlineMath>{'\\delta, \\alpha'}</InlineMath> γίνονται{' '}
              <em>αρνητικές</em> (gap, mismatch penalty) και η{' '}
              <em>ταύτιση</em> γίνεται <em>θετική</em>.
            </li>
            <li>
              Τα <em>βελάκια</em> για το backtrack δείχνουν στον γείτονα
              που <em>μεγιστοποίησε</em> το άθροισμα — και η ευθυγράμμιση
              «κουμπώνει» τις ταυτίσεις σαν να ψάχνει LCS.
            </li>
          </ul>
          Παγίδα: μη γυρίσεις άθελα στη συνήθεια του{' '}
          <InlineMath>{'\\min'}</InlineMath> από τη διάλεξη — αν το κάνεις, ο
          πίνακάς σου θα «τιμωρεί» τις ταυτίσεις και θα προτιμά κενά
          παντού.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-8-ask3',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 3 — Τεμαχισμός ράβδου (rod cutting)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Το πρόβλημα τεμαχισμού μιας ράβδου: δίνεται μια ράβδος μήκους{' '}
          <InlineMath>{'n'}</InlineMath> cm, και το κέρδος πώλησης για κάθε
          δυνατό μήκος τμήματος (<InlineMath>{'V_k'}</InlineMath> για τμήμα{' '}
          μήκους <InlineMath>{'k'}</InlineMath>). Δώσε αλγόριθμο που βρίσκει
          τον πιο επικερδή τρόπο τεμαχισμού.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Βέλτιστη υποδομή — γιατί DP.</strong> Αν κόψουμε από μια
          ράβδο μήκους <InlineMath>{'i'}</InlineMath> ένα πρώτο κομμάτι μήκους{' '}
          <InlineMath>{'k'}</InlineMath>, ό,τι μένει (μήκους{' '}
          <InlineMath>{'i - k'}</InlineMath>) πρέπει κι αυτό να τεμαχιστεί{' '}
          <em>βέλτιστα</em> — αλλιώς θα μπορούσαμε να το βελτιώσουμε ξεχωριστά
          και να κερδίσουμε περισσότερα. Άρα{' '}
          <em>βέλτιστη λύση = βέλτιστη πρώτη κοπή + βέλτιστη λύση του
          υπολοίπου</em>. Αυτή είναι η σήμα ότι ζητάμε DP.
        </p>
        <p>
          <strong>Αναδρομική σχέση.</strong> Έστω{' '}
          <InlineMath>{'C(i)'}</InlineMath> = το μέγιστο κέρδος από ράβδο
          μήκους <InlineMath>{'i'}</InlineMath>. Δεν ξέρουμε ποιο πρώτο κομμάτι{' '}
          <InlineMath>{'k'}</InlineMath> είναι το βέλτιστο, οπότε{' '}
          <strong>δοκιμάζουμε όλα</strong>:
        </p>
        <BlockMath>{'C(i) = \\max_{1 \\le k \\le i}\\bigl(V_k + C(i-k)\\bigr), \\qquad C(0) = 0'}</BlockMath>
        <p>
          <strong>Δες την αναδρομή να τρέχει.</strong> Στιγμιότυπο:{' '}
          <InlineMath>{'n = 8'}</InlineMath>, τιμές{' '}
          <InlineMath>{'V = (1, 5, 8, 9, 10, 17, 17, 20)'}</InlineMath>. Πάτησε
          «Επόμενο» για να γεμίζεις τον πίνακα — σε κάθε{' '}
          <InlineMath>{'C(i)'}</InlineMath> κρέμεται μία στήλη από υποψήφια{' '}
          <InlineMath>{'V_k + C(i-k)'}</InlineMath>· κάνε hover πάνω σε κάθε{' '}
          <InlineMath>{'k'}</InlineMath> για να δεις τη συγκεκριμένη κοπή στη
          ράβδο:
        </p>
        <RodCuttingDP />
        <p>
          <strong>Πίνακας:</strong>{' '}
          <InlineMath>{'C = (0, 1, 5, 8, 10, 13, 17, 18, 22)'}</InlineMath>{' '}
          (μαζί με <InlineMath>{'C(0) = 0'}</InlineMath>). Για ράβδο 8 cm το
          μέγιστο κέρδος είναι{' '}
          <strong>
            <InlineMath>{'C(8) = 22'}</InlineMath>
          </strong>
          , με νικητή <InlineMath>{'k = 6'}</InlineMath>:{' '}
          <InlineMath>{'V_6 + C(2) = 17 + 5 = 22'}</InlineMath>. Η ράβδος
          κόβεται σε δύο κομμάτια <strong>6 cm + 2 cm</strong>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Για κάθε{' '}
          <InlineMath>{'i'}</InlineMath> δοκιμάζουμε{' '}
          <InlineMath>{'i'}</InlineMath> υποψήφια{' '}
          <InlineMath>{'k'}</InlineMath>, καθένα σε{' '}
          <InlineMath>{'O(1)'}</InlineMath>. Σύνολο{' '}
          <InlineMath>{'\\sum_{i=1}^{n} i = \\Theta(n^2)'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «δοκίμασε όλες τις πρώτες κοπές».</strong>{' '}
          Όταν το αντικείμενο που βελτιστοποιείς (ράβδος, σχοινί, αρχείο,
          ακολουθία) διασπάται σε <em>δύο</em> ανεξάρτητα κομμάτια — ένα{' '}
          «πρώτο» κι ένα «υπόλοιπο» — και η αντίστοιχη πράξη είναι αθροιστική,
          η αναδρομή είναι{' '}
          <InlineMath>{'C(i) = \\max_k V_k + C(i - k)'}</InlineMath>. Η
          δουλειά ανά κελί είναι <InlineMath>{'O(i)'}</InlineMath>· συνολικά{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>. Ομοιότητα με το{' '}
          <a href="#exercise:front-set-8-ask4" className="underline">
            άνοιγμα εστιατορίων
          </a>{' '}
          — εκεί το «κάθε <InlineMath>{'k'}</InlineMath>» γίνεται «κάθε
          πιθανός προκάτοχος», αλλά η ιδέα είναι ίδια.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-8-ask4',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 4 — Άνοιγμα εστιατορίων κατά μήκος δρόμου',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Σκέφτεστε να ανοίξετε μια σειρά εστιατορίων κατά μήκος ενός
          αυτοκινητόδρομου. Οι <InlineMath>{'n'}</InlineMath> πιθανές τοποθεσίες
          σχηματίζουν ευθεία γραμμή, με αποστάσεις από την αρχή (σε χιλιόμετρα,
          κατά αύξουσα σειρά){' '}
          <InlineMath>{'m_1 < m_2 < \\dots < m_n'}</InlineMath>. Σε κάθε
          τοποθεσία μπορείτε να ανοίξετε το πολύ ένα εστιατόριο· το
          προσδοκώμενο κέρδος από το άνοιγμα στην τοποθεσία{' '}
          <InlineMath>{'i'}</InlineMath> είναι{' '}
          <InlineMath>{'p_i > 0'}</InlineMath>. Δύο οποιαδήποτε εστιατόρια
          πρέπει να απέχουν τουλάχιστον <InlineMath>{'k'}</InlineMath>{' '}
          χιλιόμετρα. Δώστε αποδοτικό αλγόριθμο για τον υπολογισμό του μέγιστου
          συνολικού κέρδους.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα — «μέσα ή έξω» με χωρικό περιορισμό.</strong> Σε κάθε
          τοποθεσία υπάρχουν δύο επιλογές (ανοίγω ή όχι), και ο περιορισμός
          απόστασης μεταφράζεται σε «αν ανοίξω εδώ, ο τελευταίος επιτρεπτός
          γείτονας πρέπει να είναι αρκετά πιο πίσω». Κλασικός DP — η{' '}
          <a href="#exercise:pt5-th4" className="underline">μέγιστη
          ανεξάρτητη επιλογή σε μονοπάτι</a>{' '}
          γενικευμένη: αντί να απαγορεύεται μόνο ο άμεσος γείτονας, ο
          περιορισμός είναι ένα <em>γεωμετρικό</em>{' '}
          <InlineMath>{'k'}</InlineMath>-εμβαδό αποκλεισμού.
        </p>
        <p>
          <strong>Αναδρομική σχέση.</strong> Έστω{' '}
          <InlineMath>{'D(i)'}</InlineMath> = μέγιστο κέρδος χρησιμοποιώντας
          μόνο τοποθεσίες <InlineMath>{'1, \\dots, i'}</InlineMath>. Στο{' '}
          <InlineMath>{'i'}</InlineMath>:
        </p>
        <ul>
          <li>
            <strong>ΧΩΡΙΣ εστιατόριο στο{' '}
            <InlineMath>{'i'}</InlineMath></strong>: κέρδος{' '}
            <InlineMath>{'D(i-1)'}</InlineMath>.
          </li>
          <li>
            <strong>ΜΕ εστιατόριο στο <InlineMath>{'i'}</InlineMath></strong>:{' '}
            κερδίζουμε <InlineMath>{'p_i'}</InlineMath> + το βέλτιστο των{' '}
            «επιτρεπτών» προκατόχων. Ο τελευταίος επιτρεπτός είναι{' '}
            <InlineMath>{'j^*'}</InlineMath> = ο μεγαλύτερος{' '}
            <InlineMath>{'j < i'}</InlineMath> με{' '}
            <InlineMath>{'m_i - m_j \\ge k'}</InlineMath>. Κέρδος{' '}
            <InlineMath>{'p_i + D(j^*)'}</InlineMath>.
          </li>
        </ul>
        <BlockMath>{'D(i) = \\max\\bigl(D(i-1),\\; p_i + D(j^{*})\\bigr), \\quad D(0) = 0'}</BlockMath>
        <p>
          Αφού τα <InlineMath>{'m_j'}</InlineMath> είναι ταξινομημένα, το{' '}
          <InlineMath>{'j^*'}</InlineMath> βρίσκεται με <strong>δυαδική
          αναζήτηση</strong> σε <InlineMath>{'O(\\log n)'}</InlineMath>.
          (Ισοδύναμα: σάρωση δύο δεικτών σε αμορτιζάρισμα{' '}
          <InlineMath>{'O(n)'}</InlineMath> συνολικά, όπως το{' '}
          <InlineMath>{'p(j)'}</InlineMath> στο L14.)
        </p>
        <p>
          <strong>Δες την αναδρομή να τρέχει.</strong> Στιγμιότυπο από την
          εκφώνηση: <InlineMath>{'m = (5, 10, 20, 25, 40, 50)'}</InlineMath>,{' '}
          <InlineMath>{'p = (10, 30, 20, 50, 60, 40)'}</InlineMath>,{' '}
          <InlineMath>{'k = 15'}</InlineMath>. Πάτησε «Επόμενο» — η ζώνη
          αποκλεισμού πλάτους 15 km γύρω από κάθε{' '}
          <InlineMath>{'i'}</InlineMath> σαρώνει τον δρόμο και δείχνει ποιοι
          προκάτοχοι παραμένουν επιτρεπτοί:
        </p>
        <RestaurantSpacingDP />
        <p>
          Ο πίνακας: <InlineMath>{'D = (0, 10, 30, 30, 80, 140, 140)'}</InlineMath>.
          Μέγιστο κέρδος{' '}
          <strong>
            <InlineMath>{'D(6) = 140'}</InlineMath>
          </strong>
          , με βέλτιστη επιλογή τα εστιατόρια{' '}
          <InlineMath>{'\\{2, 4, 5\\}'}</InlineMath> (στα km 10, 25, 40). Δύο
          παρατηρήσεις:
        </p>
        <ul>
          <li>
            <InlineMath>{'D(3) = 30'}</InlineMath> ΟΧΙ{' '}
            <InlineMath>{'50'}</InlineMath>: το{' '}
            <InlineMath>{'m_3 = 20'}</InlineMath> απέχει από το{' '}
            <InlineMath>{'m_2 = 10'}</InlineMath> μόνο 10 km, λιγότερο από{' '}
            <InlineMath>{'k = 15'}</InlineMath>. Άρα αν πάρω το 3, μπορώ να
            «συμμαχήσω» το πολύ με το <InlineMath>{'D(1) = 10'}</InlineMath>{' '}
            (τοποθεσία 1 στο km 5, απέχει 15 ≥ k). Σύνολο 30, ίδιο με{' '}
            <InlineMath>{'D(2)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'D(6) = 140 = D(5)'}</InlineMath>: ο
            «κορυφαίος γείτονας» του 6 (στα km 50) που απέχει ≥ 15 km είναι το{' '}
            <InlineMath>{'j^* = 4'}</InlineMath> (στα km 25), που δίνει{' '}
            <InlineMath>{'40 + D(4) = 40 + 80 = 120 < D(5) = 140'}</InlineMath>.
            Άρα το <InlineMath>{'6'}</InlineMath> μένει ΕΞΩ.
          </li>
        </ul>
        <p>
          <strong>Πολυπλοκότητα.</strong>{' '}
          <InlineMath>{'O(n)'}</InlineMath> υποπροβλήματα, καθένα με μία
          δυαδική αναζήτηση <InlineMath>{'O(\\log n)'}</InlineMath> για το{' '}
          <InlineMath>{'j^*'}</InlineMath> → συνολικά{' '}
          <InlineMath>{'O(n \\log n)'}</InlineMath>. (Με σάρωση δύο δεικτών:{' '}
          <InlineMath>{'O(n)'}</InlineMath>.)
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «γείτονας με γεωμετρικό περιορισμό».</strong>{' '}
          Όταν η επιλογή σου σε κάθε σημείο έχει έναν «νεκρό χώρο» γύρω της
          (απόσταση, χρόνος, ποσότητα), η DP-αναδρομή «μέσα/έξω» γίνεται{' '}
          <InlineMath>{'D(i) = \\max(D(i-1),\\, p_i + D(j^*))'}</InlineMath>
          όπου <InlineMath>{'j^*'}</InlineMath> είναι ο τελευταίος επιτρεπτός
          προκάτοχος. Σχεδόν πάντα <em>δυαδική αναζήτηση ή δύο δείκτες</em> τον
          βρίσκει αμορτιζάρισμα γραμμικά. Σήμα: «πιθανές τοποθεσίες πάνω σε
          ευθεία/χρόνο, με ελάχιστη απόσταση μεταξύ επιλεγμένων» ⇒ ίδιος DP.
        </Callout>
      </>
    ),
  },
  // ═══════════════════════════════════════════════════════════════════════
  // Παλαιά θέματα — υπό μεταγραφή
  // Οι εξεταστικές 2022–2025 έχουν μεταγραφεί ανά διάλεξη· τα παλαιότερα εκκρεμούν.
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'exam-sept-2022',
    title: 'Σεπτέμβριος 2022 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2022',
    difficulty: 'hard',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>TSP:</strong> Δίνεται μια λίστα <InlineMath>{'n'}</InlineMath>{' '}
          πόλεων και οι αποστάσεις <InlineMath>{'c_{ij}'}</InlineMath> μεταξύ κάθε
          ζευγαριού πόλεων <InlineMath>{'i, j'}</InlineMath>. Να βρεθεί η
          συντομότερη διαδρομή που περνάει από κάθε πόλη ακριβώς μια φορά και
          επιστρέφει στην πόλη εκκίνησης.
        </p>
        <p>
          <strong>i.</strong> Να περιγραφεί σύντομα σε φυσική γλώσσα ένας
          αλγόριθμος <InlineMath>{'X'}</InlineMath> που βρίσκει τη βέλτιστη λύση{' '}
          <InlineMath>{'OPT'}</InlineMath> και να υπολογιστεί η πολυπλοκότητά του{' '}
          <InlineMath>{'C_X(n)'}</InlineMath>.
        </p>
        <p>
          <strong>ii.</strong> Να δοθεί σε φυσική γλώσσα ένας πολυωνυμικός
          αλγόριθμος <InlineMath>{'P'}</InlineMath> που βρίσκει μια εφικτή λύση{' '}
          <InlineMath>{'S'}</InlineMath> και να υπολογιστεί η πολυπλοκότητά του{' '}
          <InlineMath>{'C_P(n)'}</InlineMath>.
        </p>
        <p>
          <strong>iii.</strong> Να περιγραφεί σύντομα σε φυσική γλώσσα ένας
          αλγόριθμος <InlineMath>{'B'}</InlineMath> που κάνει χρήση ενός
          αλγόριθμου για το minimum cost spanning tree (να θεωρηθεί γνωστός) και
          που βρίσκει ένα κάτω φράγμα <InlineMath>{'b'}</InlineMath> της βέλτιστης
          λύσης <InlineMath>{'OPT'}</InlineMath>. Να υπολογιστεί η πολυπλοκότητα{' '}
          <InlineMath>{'C_B(n)'}</InlineMath>.
        </p>
        <p>
          <strong>iv.</strong> Να εφαρμοστούν οι αλγόριθμοι{' '}
          <InlineMath>{'P'}</InlineMath> και <InlineMath>{'B'}</InlineMath> στο
          παρακάτω στιγμιότυπο: πλήρες γράφημα 5 πόλεων{' '}
          <InlineMath>{'A, B, C, D, E'}</InlineMath> με αποστάσεις{' '}
          <InlineMath>{'AB=6'}</InlineMath>, <InlineMath>{'AC=4'}</InlineMath>,{' '}
          <InlineMath>{'AD=8'}</InlineMath>, <InlineMath>{'AE=2'}</InlineMath>,{' '}
          <InlineMath>{'BC=5'}</InlineMath>, <InlineMath>{'BD=8'}</InlineMath>,{' '}
          <InlineMath>{'BE=8'}</InlineMath>, <InlineMath>{'CD=9'}</InlineMath>,{' '}
          <InlineMath>{'CE=6'}</InlineMath>, <InlineMath>{'DE=7'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το <strong>TSP (Travelling Salesman Problem — πρόβλημα του πλανόδιου
          πωλητή)</strong> ζητάει έναν κύκλο που επισκέπτεται όλες τις πόλεις από
          μία φορά και κλείνει εκεί που ξεκίνησε, με το μικρότερο συνολικό κόστος.
          Είναι από τα πιο διάσημα <strong>NP-hard</strong> προβλήματα: δεν ξέρουμε
          πολυωνυμικό αλγόριθμο που να το λύνει βέλτιστα.
        </p>
        <p>
          <strong>i. Ο βέλτιστος αλγόριθμος X (ωμή βία).</strong> Αφού δεν ξέρουμε
          κάτι έξυπνο, δοκιμάζουμε <strong>όλες</strong> τις διατάξεις των πόλεων.
          Κρατάμε σταθερή την πόλη εκκίνησης (ο κύκλος είναι ίδιος όποια κι αν
          διαλέξουμε ως αρχή) και μεταθέτουμε τις υπόλοιπες{' '}
          <InlineMath>{'n-1'}</InlineMath>: αυτό δίνει{' '}
          <InlineMath>{'(n-1)!'}</InlineMath> διατάξεις (ή{' '}
          <InlineMath>{'(n-1)!/2'}</InlineMath> αν αγνοήσουμε τη φορά). Για καθεμία
          αθροίζουμε τα <InlineMath>{'n'}</InlineMath> βάρη και κρατάμε το ελάχιστο.
          Άρα <InlineMath>{'C_X(n) = O(n!)'}</InlineMath> — εκθετικός, άχρηστος
          για μεγάλο <InlineMath>{'n'}</InlineMath>.
        </p>
        <p>
          <strong>ii. Ένας πολυωνυμικός αλγόριθμος P (πλησιέστερος γείτονας).</strong>{' '}
          Αφού δεν προλαβαίνουμε τη βέλτιστη λύση, βρίσκουμε γρήγορα μια{' '}
          <em>εφικτή</em> (όχι απαραίτητα βέλτιστη). Άπληστη ιδέα: ξεκίνα από μια
          πόλη και κάθε φορά πήγαινε στην <strong>πλησιέστερη πόλη που δεν έχεις
          επισκεφθεί ακόμα</strong>· στο τέλος γύρνα στην αρχή. Σε κάθε ένα από τα{' '}
          <InlineMath>{'n'}</InlineMath> βήματα ψάχνουμε τον κοντινότερο μη
          επισκεφθέντα γείτονα σε <InlineMath>{'O(n)'}</InlineMath>, άρα{' '}
          <InlineMath>{'C_P(n) = O(n^2)'}</InlineMath>.
        </p>
        <p>
          <strong>iii. Κάτω φράγμα B μέσω MST.</strong> Θέλουμε έναν αριθμό που
          σίγουρα <em>δεν ξεπερνά</em> το <InlineMath>{'OPT'}</InlineMath>. Κλειδί:
          πάρε τη βέλτιστη διαδρομή του TSP και <strong>σβήσε μία ακμή της</strong>.
          Ό,τι μένει είναι ένα μονοπάτι που αγγίζει όλες τις πόλεις — δηλαδή ένα{' '}
          <strong>συνδετικό δέντρο (spanning tree)</strong>. Το ελάχιστο
          συνδετικό δέντρο (MST) είναι το φθηνότερο δυνατό spanning tree, οπότε{' '}
          <InlineMath>{'\\text{MST} \\le OPT - (\\text{μία ακμή}) \\le OPT'}</InlineMath>.
          Άρα ο <InlineMath>{'B'}</InlineMath> τρέχει απλώς έναν αλγόριθμο MST
          (Kruskal / Prim) και επιστρέφει <InlineMath>{'b = \\text{βάρος του MST}'}</InlineMath>.
          Με πυκνό γράφημα <InlineMath>{'C_B(n) = O(n^2 \\log n)'}</InlineMath>.
        </p>
        <p>
          <strong>iv. Εφαρμογή στο στιγμιότυπο.</strong>
        </p>
        <p>
          <strong>Αλγόριθμος P</strong> (πλησιέστερος γείτονας από το{' '}
          <InlineMath>{'A'}</InlineMath>): από το <InlineMath>{'A'}</InlineMath> ο
          κοντινότερος είναι ο <InlineMath>{'E'}</InlineMath> (2)· από τον{' '}
          <InlineMath>{'E'}</InlineMath> ο κοντινότερος αδιάβατος είναι ο{' '}
          <InlineMath>{'C'}</InlineMath> (6)· από τον <InlineMath>{'C'}</InlineMath>{' '}
          ο <InlineMath>{'B'}</InlineMath> (5)· μένει ο{' '}
          <InlineMath>{'D'}</InlineMath> (<InlineMath>{'BD=8'}</InlineMath>)·
          κλείνουμε με <InlineMath>{'DA=8'}</InlineMath>. Διαδρομή{' '}
          <InlineMath>{'A\\!-\\!E\\!-\\!C\\!-\\!B\\!-\\!D\\!-\\!A'}</InlineMath>,
          κόστος <InlineMath>{'S = 2+6+5+8+8 = 29'}</InlineMath>.
        </p>
        <p>
          <strong>Αλγόριθμος B</strong> (MST με Kruskal): παίρνουμε τις φθηνότερες
          ακμές χωρίς να σχηματίσουμε κύκλο —{' '}
          <InlineMath>{'AE=2'}</InlineMath>, <InlineMath>{'AC=4'}</InlineMath>,{' '}
          <InlineMath>{'BC=5'}</InlineMath>, <InlineMath>{'DE=7'}</InlineMath>.
          Βάρος MST <InlineMath>{'b = 2+4+5+7 = 18'}</InlineMath>.
        </p>
        <p>
          <strong>Συμπέρασμα:</strong> <InlineMath>{'18 \\le OPT \\le 29'}</InlineMath>.
          Ο <InlineMath>{'B'}</InlineMath> εγγυάται ότι καμία διαδρομή δεν κοστίζει
          λιγότερο από 18, και ο <InlineMath>{'P'}</InlineMath> μας δίνει μια
          πραγματική διαδρομή με κόστος 29.
        </p>
      </>
    ),
  },
  {
    id: 'exam-june-2021',
    title: 'Ιούνιος 2021 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2021',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2020',
    title: 'Σεπτέμβριος 2020 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2020',
    difficulty: 'hard',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Ένα σύνολο από <InlineMath>{'n'}</InlineMath> μαθητές δημοτικού πρέπει
          να μοιραστούν σε <InlineMath>{'k'}</InlineMath> σχολεία. Ο κάθε μαθητής
          πρέπει να γραφτεί σε σχολείο που απέχει το πολύ μισή ώρα από το σπίτι
          του· κατά συνέπεια, το σύνολο των εφικτών σχολείων διαφέρει από μαθητή
          σε μαθητή. Επιπλέον, κάθε σχολείο μπορεί να δεχτεί το πολύ{' '}
          <InlineMath>{'\\lceil n/k \\rceil'}</InlineMath> μαθητές. Για κάθε
          μαθητή <InlineMath>{'1 \\le i \\le n'}</InlineMath> μας δίνεται το
          σύνολο <InlineMath>{'S_i'}</InlineMath> των σχολείων στα οποία μπορεί να
          πάει. Δείξτε πώς από αυτή την πληροφορία και τον περιορισμό{' '}
          <InlineMath>{'\\lceil n/k \\rceil'}</InlineMath> μαθητές ανά σχολείο
          μπορείτε να κατασκευάσετε ένα πρόβλημα μεγιστοποίησης ροής, από τη λύση
          του οποίου να αποφανθείτε κατά πόσο οι εγγραφές είναι εφικτές.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Όταν ένα πρόβλημα ζητάει «αντιστοίχισε Α σε Β με χωρητικότητες», ένας
          δοκιμασμένος τρόπος είναι να το μετατρέψουμε σε{' '}
          <strong>ροή σε δίκτυο</strong>: φτιάχνουμε «σωλήνες» με χωρητικότητες
          και ρωτάμε πόσο «νερό» περνά.
        </p>
        <p>
          <strong>Κατασκευή του δικτύου.</strong>
        </p>
        <ul>
          <li>
            Μια <strong>πηγή</strong> <InlineMath>{'\\sigma'}</InlineMath> και
            ένας <strong>καταβόθρα</strong> <InlineMath>{'\\tau'}</InlineMath>.
          </li>
          <li>
            Ένας κόμβος για κάθε μαθητή και ένας για κάθε σχολείο.
          </li>
          <li>
            Ακμή <InlineMath>{'\\sigma \\to \\text{μαθητής } i'}</InlineMath> με
            χωρητικότητα <strong>1</strong> (κάθε μαθητής γράφεται το πολύ μία
            φορά).
          </li>
          <li>
            Ακμή <InlineMath>{'\\text{μαθητής } i \\to \\text{σχολείο } x'}</InlineMath>{' '}
            με χωρητικότητα <strong>1</strong>, για κάθε{' '}
            <InlineMath>{'x \\in S_i'}</InlineMath> (μόνο τα εφικτά σχολεία).
          </li>
          <li>
            Ακμή{' '}
            <InlineMath>{'\\text{σχολείο } x \\to \\tau'}</InlineMath> με
            χωρητικότητα <InlineMath>{'\\lceil n/k \\rceil'}</InlineMath> (το όριο
            θέσεων του σχολείου).
          </li>
        </ul>
        <p>
          <strong>Πώς αποφαινόμαστε.</strong> Υπολογίζουμε τη μέγιστη ροή από{' '}
          <InlineMath>{'\\sigma'}</InlineMath> στο <InlineMath>{'\\tau'}</InlineMath>.
          Κάθε μονάδα ροής είναι ένα μονοπάτι{' '}
          <InlineMath>{'\\sigma \\to i \\to x \\to \\tau'}</InlineMath> — δηλαδή
          «ο μαθητής <InlineMath>{'i'}</InlineMath> γράφεται στο σχολείο{' '}
          <InlineMath>{'x'}</InlineMath>». Οι χωρητικότητες εγγυώνται αυτόματα ότι
          κάθε μαθητής μπαίνει το πολύ σε ένα σχολείο και κάθε σχολείο δέχεται το
          πολύ <InlineMath>{'\\lceil n/k \\rceil'}</InlineMath> μαθητές.
        </p>
        <p>
          Αν η μέγιστη ροή είναι <strong>ίση με <InlineMath>{'n'}</InlineMath></strong>,
          τότε <em>όλοι</em> οι μαθητές τοποθετήθηκαν — οι εγγραφές είναι εφικτές.
          Αν είναι μικρότερη από <InlineMath>{'n'}</InlineMath>, κάποιοι μαθητές
          έμειναν χωρίς θέση — οι εγγραφές <strong>δεν</strong> είναι εφικτές.
        </p>
      </>
    ),
  },
  // ── Εξ αποστάσεως 2020 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────
  {
    id: 'pt11-th1',
    title: 'Εξ αποστάσεως 2020 · Θέμα 1 — Κορυφή «βουνού» σε O(log n) (διαίρει και βασίλευε)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'distance-2020',
    problemNumber: 'Θέμα 1',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L05-divide-and-conquer-iii'],
    statement: (
      <>
        <p>
          Δίνεται πίνακας <InlineMath>{'A'}</InlineMath> μεγέθους{' '}
          <InlineMath>{'n'}</InlineMath> με το χαρακτηριστικό ότι υπάρχει θέση{' '}
          <InlineMath>{'i'}</InlineMath> τέτοια ώστε η ακολουθία{' '}
          <InlineMath>{'A[1], A[2], \\dots, A[i]'}</InlineMath> είναι αυστηρώς
          αύξουσα, ενώ η ακολουθία{' '}
          <InlineMath>{'A[i+1], A[i+2], \\dots, A[n]'}</InlineMath> είναι αυστηρώς
          φθίνουσα. Δώστε αλγόριθμο που σε χρόνο{' '}
          <InlineMath>{'O(\\log n)'}</InlineMath> εντοπίζει τη θέση{' '}
          <InlineMath>{'i'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ένας τέτοιος πίνακας λέγεται «κορυφογραμμή βουνού»: ανεβαίνει μέχρι μια
          κορυφή και μετά κατεβαίνει. Η ωμή βία (σάρωση όλων) είναι{' '}
          <InlineMath>{'O(n)'}</InlineMath>. Για <InlineMath>{'O(\\log n)'}</InlineMath>{' '}
          χρειαζόμαστε <strong>δυαδική αναζήτηση</strong> — αλλά πρέπει να βρούμε
          ένα κριτήριο που να μας λέει «πήγαινε αριστερά ή δεξιά».
        </p>
        <p>
          <strong>Η ιδέα.</strong> Κοιτάμε το μεσαίο στοιχείο{' '}
          <InlineMath>{'A[m]'}</InlineMath> και τον δεξί του γείτονα{' '}
          <InlineMath>{'A[m+1]'}</InlineMath>. Δύο περιπτώσεις:
        </p>
        <ul>
          <li>
            Αν <InlineMath>{'A[m] < A[m+1]'}</InlineMath>: βρισκόμαστε ακόμα στο{' '}
            <strong>ανηφορικό</strong> κομμάτι, άρα η κορυφή είναι{' '}
            <strong>δεξιά</strong> — συνέχισε στο διάστημα{' '}
            <InlineMath>{'[m+1,\\ n]'}</InlineMath>.
          </li>
          <li>
            Αν <InlineMath>{'A[m] > A[m+1]'}</InlineMath>: βρισκόμαστε στο{' '}
            <strong>κατηφορικό</strong> κομμάτι (ή ακριβώς στην κορυφή), άρα η
            κορυφή είναι στη θέση <InlineMath>{'m'}</InlineMath> ή{' '}
            <strong>αριστερά</strong> — συνέχισε στο διάστημα{' '}
            <InlineMath>{'[1,\\ m]'}</InlineMath>.
          </li>
        </ul>
        <p>
          Σε κάθε βήμα κόβουμε το διάστημα στη μέση και κάνουμε{' '}
          <InlineMath>{'O(1)'}</InlineMath> δουλειά. Όταν το διάστημα γίνει ένα
          στοιχείο, αυτό είναι η κορυφή. Η αναδρομή είναι{' '}
          <InlineMath>{'T(n) = T(n/2) + O(1)'}</InlineMath>, που από το Master
          Theorem (ή τη δυαδική αναζήτηση) δίνει{' '}
          <InlineMath>{'T(n) = O(\\log n)'}</InlineMath>.
        </p>
        <p>
          <strong>Γιατί δουλεύει:</strong> σε ένα τέτοιο «βουνό» η σύγκριση δύο
          διαδοχικών στοιχείων μάς λέει με βεβαιότητα σε ποια πλαγιά είμαστε — και
          η κορυφή είναι πάντα στην πλευρά «προς τα πάνω». Έτσι ποτέ δεν πετάμε το
          μισό που περιέχει την κορυφή.
        </p>
      </>
    ),
  },
  {
    id: 'exam-distance-2020',
    title: 'Εξ αποστάσεως 2020 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'distance-2020',
    difficulty: 'hard',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Δώστε αλγόριθμο που παίρνει σαν είσοδο</p>
        <ul>
          <li>
            ένα κατευθυνόμενο γράφημα <InlineMath>{'G(V, E)'}</InlineMath> όπου
            κάθε ακμή <InlineMath>{'e \\in E'}</InlineMath> έχει χωρητικότητα{' '}
            <InlineMath>{'c_e > 0'}</InlineMath>, και
          </li>
          <li>
            μια μέγιστη ροή <InlineMath>{'f'}</InlineMath> επί του{' '}
            <InlineMath>{'G'}</InlineMath>,
          </li>
        </ul>
        <p>
          και σε χρόνο{' '}
          <InlineMath>{'O(|V| + |E|)'}</InlineMath> επιστρέφει μια ελάχιστη
          αποκοπή του <InlineMath>{'G'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το θεώρημα <strong>Μέγιστης Ροής – Ελάχιστης Αποκοπής</strong> λέει ότι
          η τιμή της μέγιστης ροής ισούται με τη χωρητικότητα της ελάχιστης
          αποκοπής. Εδώ <em>μας δίνεται ήδη</em> η μέγιστη ροή — άρα δεν χρειάζεται
          να την υπολογίσουμε· πρέπει μόνο να «διαβάσουμε» από αυτήν την αποκοπή.
        </p>
        <p>
          <strong>Βήμα 1 — Κατασκευή του γραφήματος υπολοίπων{' '}
          <InlineMath>{'G_f'}</InlineMath>.</strong> Για κάθε ακμή{' '}
          <InlineMath>{'(u,v)'}</InlineMath> με χωρητικότητα{' '}
          <InlineMath>{'c'}</InlineMath> και ροή{' '}
          <InlineMath>{'f(u,v)'}</InlineMath>: αν μένει αχρησιμοποίητη
          χωρητικότητα (<InlineMath>{'f(u,v) < c'}</InlineMath>) βάζουμε
          εμπρόσθια ακμή <InlineMath>{'u \\to v'}</InlineMath>· αν υπάρχει ροή
          (<InlineMath>{'f(u,v) > 0'}</InlineMath>) βάζουμε οπίσθια ακμή{' '}
          <InlineMath>{'v \\to u'}</InlineMath>. Αυτό είναι μία σάρωση όλων των
          ακμών: <InlineMath>{'O(|V| + |E|)'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 2 — BFS/DFS από την πηγή{' '}
          <InlineMath>{'s'}</InlineMath>.</strong> Στο{' '}
          <InlineMath>{'G_f'}</InlineMath>, βρες το σύνολο{' '}
          <InlineMath>{'A'}</InlineMath> όλων των κορυφών που είναι{' '}
          <strong>προσπελάσιμες</strong> από την <InlineMath>{'s'}</InlineMath>.
          Μία διάσχιση: <InlineMath>{'O(|V| + |E|)'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 3 — Επίστρεψε την αποκοπή{' '}
          <InlineMath>{'(A,\\ V \\setminus A)'}</InlineMath>.</strong>
        </p>
        <p>
          <strong>Γιατί είναι ελάχιστη.</strong> Αφού η <InlineMath>{'f'}</InlineMath>{' '}
          είναι <em>μέγιστη</em>, δεν υπάρχει μονοπάτι αύξησης{' '}
          <InlineMath>{'s \\to t'}</InlineMath> στο{' '}
          <InlineMath>{'G_f'}</InlineMath> — άρα ο προορισμός{' '}
          <InlineMath>{'t'}</InlineMath> δεν είναι προσπελάσιμος, δηλαδή{' '}
          <InlineMath>{'t \\notin A'}</InlineMath> και η{' '}
          <InlineMath>{'(A, V\\setminus A)'}</InlineMath> είναι όντως αποκοπή που
          χωρίζει <InlineMath>{'s'}</InlineMath> από{' '}
          <InlineMath>{'t'}</InlineMath>. Κάθε ακμή που βγαίνει από το{' '}
          <InlineMath>{'A'}</InlineMath> είναι <strong>κορεσμένη</strong> (αλλιώς
          θα υπήρχε εμπρόσθια ακμή στο <InlineMath>{'G_f'}</InlineMath> και ο
          γείτονας θα ήταν στο <InlineMath>{'A'}</InlineMath>) και κάθε ακμή που
          μπαίνει στο <InlineMath>{'A'}</InlineMath> έχει μηδενική ροή. Άρα η
          χωρητικότητα της αποκοπής ισούται ακριβώς με την τιμή της ροής — που
          είναι η μέγιστη. Από το θεώρημα, αυτή η αποκοπή είναι{' '}
          <strong>ελάχιστη</strong>. Συνολικός χρόνος:{' '}
          <InlineMath>{'O(|V| + |E|)'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'exam-feb-2019',
    title: 'Φεβρουάριος 2019 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'feb-2019',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2018',
    title: 'Ιούνιος 2018 — υπό μεταγραφή',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'june-2018',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2017',
    title: 'Σεπτέμβριος 2017 — υπό μεταγραφή',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'sept-2017',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-feb-2017',
    title: 'Φεβρουάριος 2017 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'feb-2017',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2016',
    title: 'Ιούνιος 2016 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2016',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Έχετε να επιλέξετε ανάμεσα σε δύο αλγορίθμους που λύνουν το ίδιο
          πρόβλημα διάστασης <InlineMath>{'n'}</InlineMath>. Ο{' '}
          <strong>A</strong> διαιρεί σε 2 υποπροβλήματα διάστασης{' '}
          <InlineMath>{'\\sqrt{n}'}</InlineMath> και συνδυάζει σε χρόνο{' '}
          <InlineMath>{'\\Theta(1)'}</InlineMath>. Ο <strong>B</strong> διαιρεί
          επίσης σε 2 υποπροβλήματα διάστασης <InlineMath>{'\\sqrt{n}'}</InlineMath>{' '}
          αλλά συνδυάζει σε χρόνο <InlineMath>{'\\Theta(\\log n)'}</InlineMath>.
          Ποια η πολυπλοκότητα <InlineMath>{'T(n)'}</InlineMath> καθενός; Ποιον θα
          επιλέγατε;
        </p>
        <p>
          <em>(Σημείωση μεταγραφής: το ακριβές κόστος συνδυασμού του B είναι
          αχνό στο σαρωμένο αντίγραφο· παρακάτω διδάσκεται πλήρως η τεχνική
          αλλαγής μεταβλητής, που λύνει κάθε τέτοια αναδρομή.)</em>
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Αναδρομές με <InlineMath>{'T(\\sqrt{n})'}</InlineMath> δεν λύνονται
          απευθείας με το Master Theorem. Το τέχνασμα είναι η{' '}
          <strong>αλλαγή μεταβλητής</strong>: θέτουμε{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'m = \\log_2 n'}</InlineMath>. Τότε{' '}
          <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath>, και αν ορίσουμε{' '}
          <InlineMath>{'S(m) = T(2^m)'}</InlineMath> η αναδρομή σε{' '}
          <InlineMath>{'\\sqrt{n}'}</InlineMath> γίνεται αναδρομή σε{' '}
          <InlineMath>{'m/2'}</InlineMath> — οικείο έδαφος.
        </p>
        <p>
          <strong>Αλγόριθμος A:</strong>{' '}
          <InlineMath>{'T_A(n) = 2\\,T_A(\\sqrt{n}) + \\Theta(1)'}</InlineMath>.
          Με <InlineMath>{'n = 2^m'}</InlineMath>:{' '}
          <InlineMath>{'S(m) = 2\\,S(m/2) + \\Theta(1)'}</InlineMath>. Από το
          Master Theorem (<InlineMath>{'a=2, b=2, d=0,\\ \\log_2 2 = 1 > 0'}</InlineMath>{' '}
          — 3η περίπτωση): <InlineMath>{'S(m) = \\Theta(m)'}</InlineMath>.
          Επιστρέφοντας στο <InlineMath>{'n'}</InlineMath>:{' '}
          <InlineMath>{'T_A(n) = \\Theta(m) = \\Theta(\\log n)'}</InlineMath>.
        </p>
        <p>
          <strong>Αλγόριθμος B:</strong>{' '}
          <InlineMath>{'T_B(n) = 2\\,T_B(\\sqrt{n}) + \\Theta(\\log n)'}</InlineMath>.
          Με <InlineMath>{'n = 2^m'}</InlineMath> το{' '}
          <InlineMath>{'\\log n'}</InlineMath> γίνεται{' '}
          <InlineMath>{'m'}</InlineMath>:{' '}
          <InlineMath>{'S(m) = 2\\,S(m/2) + \\Theta(m)'}</InlineMath>. Από το
          Master Theorem (2η περίπτωση,{' '}
          <InlineMath>{'\\log_2 2 = 1 = d'}</InlineMath>):{' '}
          <InlineMath>{'S(m) = \\Theta(m \\log m)'}</InlineMath>. Άρα{' '}
          <InlineMath>{'T_B(n) = \\Theta(\\log n \\cdot \\log\\log n)'}</InlineMath>.
        </p>
        <p>
          <strong>Επιλογή:</strong> αφού{' '}
          <InlineMath>{'\\log n \\prec \\log n \\cdot \\log\\log n'}</InlineMath>,
          ο <strong>αλγόριθμος A</strong> είναι ασυμπτωτικά ταχύτερος. Το «ακριβό»
          συνδυαστικό βήμα του B (<InlineMath>{'\\Theta(\\log n)'}</InlineMath>{' '}
          αντί <InlineMath>{'\\Theta(1)'}</InlineMath>) προσθέτει έναν παράγοντα{' '}
          <InlineMath>{'\\log\\log n'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'pt16-th3b',
    title: 'Ιούνιος 2016 · Θέμα 3.2–3.3 — Quicksort: εκτέλεση & δέντρο αναδρομής',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'june-2016',
    problemNumber: 'Θέμα 3.2–3.3',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          (3.2) Χρησιμοποιώντας τον αλγόριθμο Quicksort, ταξινομήστε τους
          χαρακτήρες <InlineMath>{'D, A, C, B, F, E, G'}</InlineMath> σε αύξουσα
          σειρά. (3.3) Δώστε το δέντρο των αναδρομικών κλήσεων.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ο Quicksort διαλέγει ένα <strong>pivot</strong>, χωρίζει τα στοιχεία σε
          «μικρότερα» και «μεγαλύτερα» από αυτό, και ταξινομεί αναδρομικά τα δύο
          μέρη. Παίρνουμε ως pivot το <strong>πρώτο στοιχείο</strong> κάθε
          υποπίνακα.
        </p>
        <p>
          <strong>(3.2) Εκτέλεση</strong> στο{' '}
          <InlineMath>{'[D, A, C, B, F, E, G]'}</InlineMath>:
        </p>
        <ul>
          <li>
            Pivot <InlineMath>{'D'}</InlineMath>: μικρότερα{' '}
            <InlineMath>{'[A, C, B]'}</InlineMath>, μεγαλύτερα{' '}
            <InlineMath>{'[F, E, G]'}</InlineMath> →{' '}
            <InlineMath>{'[A,C,B]\\ D\\ [F,E,G]'}</InlineMath>.
          </li>
          <li>
            Αριστερά <InlineMath>{'[A, C, B]'}</InlineMath>: pivot{' '}
            <InlineMath>{'A'}</InlineMath> → <InlineMath>{'[\\,]\\ A\\ [C,B]'}</InlineMath>·
            μετά <InlineMath>{'[C, B]'}</InlineMath>: pivot{' '}
            <InlineMath>{'C'}</InlineMath> → <InlineMath>{'[B]\\ C\\ [\\,]'}</InlineMath>.
            Αποτέλεσμα: <InlineMath>{'A, B, C'}</InlineMath>.
          </li>
          <li>
            Δεξιά <InlineMath>{'[F, E, G]'}</InlineMath>: pivot{' '}
            <InlineMath>{'F'}</InlineMath> → <InlineMath>{'[E]\\ F\\ [G]'}</InlineMath>.
            Αποτέλεσμα: <InlineMath>{'E, F, G'}</InlineMath>.
          </li>
        </ul>
        <p>
          Τελικό ταξινομημένο:{' '}
          <InlineMath>{'A, B, C, D, E, F, G'}</InlineMath>.
        </p>
        <p>
          <strong>(3.3) Δέντρο αναδρομικών κλήσεων</strong> (κάθε κόμβος = ένα
          κάλεσμα, με το pivot σε έντονη γραφή):
        </p>
        <pre className="overflow-x-auto rounded bg-bg-soft p-3 text-sm">{`            [D,A,C,B,F,E,G]  (pivot D)
             /              \\
      [A,C,B] (pivot A)   [F,E,G] (pivot F)
         \\                  /      \\
      [C,B] (pivot C)     [E]      [G]
        /
      [B]`}</pre>
        <p>
          Παρατήρησε ότι το δέντρο εδώ είναι αρκετά ισορροπημένο, οπότε το βάθος
          είναι <InlineMath>{'\\approx \\log n'}</InlineMath> και η εκτέλεση
          κοντά στη βέλτιστη περίπτωση <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>.
          Αν η είσοδος ήταν ήδη ταξινομημένη, το δέντρο θα εκφυλιζόταν σε αλυσίδα
          και ο χρόνος θα γινόταν <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'pt16-th4',
    title: 'Ιούνιος 2016 · Θέμα 4 — LCS των BANANA και BINARY',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2016',
    problemNumber: 'Θέμα 4',
    weight: 17,
    difficulty: 'medium',
    prerequisites: ['lectures/L16-dp-iii'],
    formulaIds: ['lcs'],
    statement: (
      <>
        <p>
          Έστω οι δύο ακολουθίες χαρακτήρων <code>BANANA</code> και{' '}
          <code>BINARY</code>. Θεωρήστε το πρόβλημα της μέγιστης κοινής
          υπακολουθίας (LCS). (α) Γράψτε την αναδρομική σχέση για το{' '}
          <InlineMath>{'C[i,j]'}</InlineMath>. (β) Συμπληρώστε τον πίνακα
          δυναμικού προγραμματισμού. (γ) Ποια είναι η μέγιστη κοινή υπακολουθία;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Αναδρομική σχέση.</strong>{' '}
          <InlineMath>{'C[i,j]'}</InlineMath> = μήκος της LCS των προθεμάτων{' '}
          <InlineMath>{'X_1\\cdots X_i'}</InlineMath> (από το{' '}
          <code>BANANA</code>) και <InlineMath>{'Y_1\\cdots Y_j'}</InlineMath>{' '}
          (από το <code>BINARY</code>):
        </p>
        <BlockMath>{'C[i,j] = \\begin{cases} 0 & i = 0 \\ \\text{ή}\\ j = 0 \\\\ 1 + C[i-1,j-1] & X_i = Y_j \\\\ \\max\\{C[i-1,j],\\ C[i,j-1]\\} & X_i \\ne Y_j \\end{cases}'}</BlockMath>
        <p>
          <strong>(β) Ο πίνακας</strong> (γραμμές = <code>BANANA</code>, στήλες =
          <code>BINARY</code>):
        </p>
        <BlockMath>{'\\begin{array}{c|ccccccc} & \\varnothing & B & I & N & A & R & Y \\\\ \\hline \\varnothing & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\\\ B & 0 & 1 & 1 & 1 & 1 & 1 & 1 \\\\ A & 0 & 1 & 1 & 1 & 2 & 2 & 2 \\\\ N & 0 & 1 & 1 & 2 & 2 & 2 & 2 \\\\ A & 0 & 1 & 1 & 2 & 3 & 3 & 3 \\\\ N & 0 & 1 & 1 & 2 & 3 & 3 & 3 \\\\ A & 0 & 1 & 1 & 2 & 3 & 3 & 3 \\end{array}'}</BlockMath>
        <p>
          <strong>(γ) Η LCS.</strong> Το κάτω-δεξιά κελί δίνει μήκος{' '}
          <InlineMath>{'C[6,6] = 3'}</InlineMath>. Κάνοντας πέρασμα προς τα πίσω
          (διαγώνια κίνηση όπου οι χαρακτήρες ταίριαξαν) παίρνουμε την υπακολουθία{' '}
          <code>BNA</code>: το <InlineMath>{'B'}</InlineMath> είναι κοινό,{' '}
          μετά το <InlineMath>{'N'}</InlineMath> (θέση 3 στο <code>BANANA</code>,
          θέση 3 στο <code>BINARY</code>), μετά το{' '}
          <InlineMath>{'A'}</InlineMath> (θέση 4 και 4). Το{' '}
          <code>BINARY</code> περιέχει μόνο από ένα{' '}
          <InlineMath>{'B, N, A'}</InlineMath>, οπότε μεγαλύτερη κοινή
          υπακολουθία δεν γίνεται — <strong>μήκος 3</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'pt16-th5',
    title: 'Ιούνιος 2016 · Θέμα 5 — Προβλήματα απόφασης ST, P και οι κλάσεις P / NP-complete',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2016',
    problemNumber: 'Θέμα 5',
    weight: 8,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Θεωρήστε τα προβλήματα βελτιστοποίησης: ελαχιστοποίηση κόστους δέντρου
          επικάλυψης (MST) και μεγιστοποίηση μονοπατιού (LP, longest path)
          ανάμεσα σε δύο κόμβους <InlineMath>{'s, t'}</InlineMath> ενός γράφου.
          (α) Να δοθούν τα αντίστοιχα προβλήματα απόφασης{' '}
          <InlineMath>{'ST'}</InlineMath> και <InlineMath>{'P'}</InlineMath>.
          (β) Με την υπόθεση ότι <InlineMath>{'P \\ne NP'}</InlineMath>: ποιο
          ανήκει στην κλάση <InlineMath>{'P'}</InlineMath> και ποιο στην{' '}
          <InlineMath>{'NP'}</InlineMath>-complete;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Προβλήματα απόφασης.</strong>
        </p>
        <p>
          <strong><InlineMath>{'ST'}</InlineMath>:</strong> «Δοθέντος γραφήματος{' '}
          <InlineMath>{'G'}</InlineMath> με βάρη στις ακμές και αριθμού{' '}
          <InlineMath>{'k'}</InlineMath>, υπάρχει συνδετικό δέντρο με συνολικό
          βάρος <InlineMath>{'\\le k'}</InlineMath>;»
        </p>
        <p>
          <strong><InlineMath>{'P'}</InlineMath>:</strong> «Δοθέντος γραφήματος{' '}
          <InlineMath>{'G'}</InlineMath> με βάρη, κόμβων{' '}
          <InlineMath>{'s, t'}</InlineMath> και αριθμού{' '}
          <InlineMath>{'k'}</InlineMath>, υπάρχει <em>απλό</em> μονοπάτι από{' '}
          <InlineMath>{'s'}</InlineMath> σε <InlineMath>{'t'}</InlineMath> με
          συνολικό βάρος <InlineMath>{'\\ge k'}</InlineMath>;»
        </p>
        <p>
          <strong>(β) Κατάταξη.</strong>
        </p>
        <p>
          <strong><InlineMath>{'ST \\in P'}</InlineMath>.</strong> Το Ελάχιστο
          Συνδετικό Δέντρο λύνεται σε πολυωνυμικό χρόνο{' '}
          <InlineMath>{'O(m\\log n)'}</InlineMath> (Kruskal/Prim)· υπολόγισε το
          ΕΣΔ και σύγκρινε το βάρος του με το <InlineMath>{'k'}</InlineMath>.
        </p>
        <p>
          <strong><InlineMath>{'P'}</InlineMath> είναι{' '}
          <InlineMath>{'NP'}</InlineMath>-complete.</strong> Η εύρεση{' '}
          <em>μεγαλύτερου</em> μονοπατιού (Longest Path) είναι κλασικό{' '}
          <InlineMath>{'NP'}</InlineMath>-πλήρες πρόβλημα: ανήκει στην{' '}
          <InlineMath>{'NP'}</InlineMath> (επαληθεύεις ένα δοσμένο μονοπάτι σε
          πολυωνυμικό χρόνο) και είναι <InlineMath>{'NP'}</InlineMath>-δύσκολο
          (περιέχει ως ειδική περίπτωση το Hamiltonian Path). Υπό{' '}
          <InlineMath>{'P \\ne NP'}</InlineMath> δεν έχει πολυωνυμικό αλγόριθμο.
        </p>
        <p>
          <strong>Το δίδαγμα:</strong> δύο προβλήματα που μοιάζουν συμμετρικά
          («ελάχιστο δέντρο» έναντι «μέγιστο μονοπάτι») έχουν εντελώς
          διαφορετική δυσκολία — το ένα εύκολο, το άλλο από τα δυσκολότερα στην{' '}
          <InlineMath>{'NP'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'exam-feb-2016',
    title: 'Φεβρουάριος 2016 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'feb-2016',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2015',
    title: 'Ιούνιος 2015 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2015',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-midterm-2012',
    title: 'Πρόοδος 2012 — υπό μεταγραφή',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'midterm-2012',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
      'lectures/L05-divide-and-conquer-iii',
      'lectures/L06-graphs-i',
      'lectures/L07-graphs-ii',
    ],
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2011',
    title: 'Σεπτέμβριος 2011 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2011',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2011',
    title: 'Ιούνιος 2011 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2011',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2010',
    title: 'Ιούνιος 2010 — υπό μεταγραφή',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'june-2010',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-midterm-2008',
    title: 'Πρόοδος 2008 — υπό μεταγραφή',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'midterm-2008',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
      'lectures/L05-divide-and-conquer-iii',
      'lectures/L06-graphs-i',
    ],
    statement: null,
    solution: null,
  },
]
