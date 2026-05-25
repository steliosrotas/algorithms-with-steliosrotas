import { ShieldAlert } from 'lucide-react'

/**
 * Copyright / takedown notice for transcribed past-exam / frontistirio
 * problems. Currently unrendered (the per-card mount was removed
 * 2026-05-24, commit `c46a587`); kept for a possible future single-banner
 * mount on `/practice`. See `plans/EXAM_TRANSCRIPTION.md`.
 */
export function ExamTranscriptionNotice() {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-bg-soft/60 px-3 py-2 text-xs leading-relaxed text-fg-subtle">
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        Μεταγραφή θέματος από παλαιότερη εξέταση ή φροντιστήριο του μαθήματος. Το
        πρωτότυπο αρχείο δεν φιλοξενείται εδώ. Αν κάποιος/α διδάσκων/ουσα
        επιθυμεί την αφαίρεση του υλικού του/της, ας επικοινωνήσει μαζί μου —
        π.χ. αφήνοντας σχόλιο παρακάτω.
      </span>
    </div>
  )
}
