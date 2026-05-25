'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Flame } from 'lucide-react'

/**
 * Sticky pill rendered on theory pages when the student arrived via the
 * crunch-mode «Διάβασε αυτό» CTA. Reads `?from=sose&n=N` from the URL.
 * Renders nothing for normal navigation — zero impact on theory pages
 * outside the flow.
 */
export function SoseReturnBanner() {
  const params = useSearchParams()
  if (params.get('from') !== 'sose') return null
  const rawN = params.get('n')
  const n = rawN ? Number(rawN) : NaN
  if (!Number.isFinite(n) || n < 1) return null

  return (
    <div className="sticky top-14 z-30 -mx-4 mb-4 border-b border-rose-500/30 bg-rose-500/10 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-0 lg:px-0">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 lg:px-6">
        <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-300">
          <Flame className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">
            Crunch mode — διαβάζεις για την Άσκηση {n}.
          </span>
          <span className="sm:hidden">Άσκηση {n}</span>
        </span>
        <Link
          href={`/practice/sose-to-eksamino?n=${Math.floor(n)}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold !text-white !no-underline shadow-sm transition hover:bg-rose-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Επιστροφή στην άσκηση {Math.floor(n)}
        </Link>
      </div>
    </div>
  )
}
