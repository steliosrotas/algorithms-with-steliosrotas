'use client'

/**
 * SecondVsThirdEdgeMst — front-set-6-ask2.
 *
 * Two side-by-side tabs:
 *   • «2η ακμή — μπαίνει πάντα»: any 3-vertex (or larger) graph where Kruskal
 *     has placed exactly ONE edge before. A cycle needs ≥ 3 edges, so two
 *     vertices joined by a single edge can never close one. Demonstrated on
 *     the triangle, but the property is general — slider for n.
 *   • «3η ακμή — μπορεί να απορριφθεί»: the canonical counterexample, a
 *     triangle K_3 with weights 1, 2, 3. After Kruskal adds 1 and 2, all
 *     three vertices are already connected — the weight-3 edge would close
 *     the cycle.
 */

import { useState } from 'react'
import { routeEdge, trimEdgeGeom, type NodeRect } from './edge-routing'

type Tab = 'second' | 'third'

const TRIANGLE_NODES = [
  { id: 'v₁', x: 100, y: 90 },
  { id: 'v₂', x: 220, y: 90 },
  { id: 'v₃', x: 160, y: 220 },
]

const TRIANGLE_EDGES = [
  { id: 'v1v2', from: 'v₁', to: 'v₂', w: 1 },
  { id: 'v2v3', from: 'v₂', to: 'v₃', w: 2 },
  { id: 'v1v3', from: 'v₁', to: 'v₃', w: 3 },
]

const R = 22

const NODE_RECTS: NodeRect[] = TRIANGLE_NODES.map((n) => ({
  id: n.id,
  x: n.x - R,
  y: n.y - R,
  w: 2 * R,
  h: 2 * R,
}))
const NODE_RECT_BY_ID = new Map(NODE_RECTS.map((r) => [r.id, r]))

function routedEdge(fromId: string, toId: string) {
  const aRect = NODE_RECT_BY_ID.get(fromId)!
  const bRect = NODE_RECT_BY_ID.get(toId)!
  const ax = aRect.x + aRect.w / 2
  const ay = aRect.y + aRect.h / 2
  const bx = bRect.x + bRect.w / 2
  const by = bRect.y + bRect.h / 2
  const geom = trimEdgeGeom(routeEdge(aRect, bRect, NODE_RECTS), ax, ay, R, bx, by, R)
  const mx = geom.kind === 'line' ? (ax + bx) / 2 : (ax + bx + 2 * geom.cx) / 4
  const my = geom.kind === 'line' ? (ay + by) / 2 : (ay + by + 2 * geom.cy) / 4
  return { ...geom, mx, my }
}

type EdgeState = 'unused' | 'accepted' | 'current-accept' | 'current-reject'

export function SecondVsThirdEdgeMst() {
  const [tab, setTab] = useState<Tab>('second')
  const [step, setStep] = useState(0)
  const totalSteps = tab === 'second' ? 3 : 4

  function setActiveTab(t: Tab) {
    setTab(t)
    setStep(0)
  }

  // Build current edge state per step.
  function edgeStateAt(step: number, eid: string): EdgeState {
    if (tab === 'second') {
      // step 0: nothing; step 1: e1 accepted; step 2: e2 highlighted as ACCEPT (it can never close cycle because only 1 edge is placed)
      if (step >= 2 && eid === 'v2v3') return 'accepted'
      if (step === 2 && eid === 'v2v3') return 'current-accept'
      if (step >= 1 && eid === 'v1v2') return 'accepted'
      return 'unused'
    }
    // tab === 'third'
    // step 0: nothing; step 1: e1 accepted; step 2: e2 accepted; step 3: e3 rejected
    if (step >= 2 && eid === 'v2v3') return 'accepted'
    if (step >= 1 && eid === 'v1v2') return 'accepted'
    if (step === 3 && eid === 'v1v3') return 'current-reject'
    return 'unused'
  }

  const captions =
    tab === 'second'
      ? [
          'Αρχή. Καμία ακμή στο δέντρο.',
          'Παίρνουμε την ελαφρύτερη (βάρος 1) — μπαίνει χωρίς ερωτήσεις.',
          'Παίρνουμε τη 2η ελαφρύτερη (βάρος 2). Στο δέντρο υπάρχει ΜΟΝΟ μία ακμή — κύκλος θα χρειαζόταν ≥ 3 ακμές. Άρα η 2η ΔΕΝ μπορεί να κλείσει κύκλο. Μπαίνει σίγουρα.',
        ]
      : [
          'Αρχή. Καμία ακμή στο δέντρο.',
          'Παίρνουμε την ελαφρύτερη (βάρος 1) — μπαίνει.',
          'Παίρνουμε τη 2η ελαφρύτερη (βάρος 2) — μπαίνει· έχουμε ήδη συνδέσει και τις 3 κορυφές.',
          'Παίρνουμε την 3η (βάρος 3). v₁ και v₃ είναι ΗΔΗ συνδεδεμένες μέσω v₂. Κλείνει κύκλο → απορρίπτεται. ✗',
        ]

  const finalText =
    tab === 'second'
      ? 'Συμπέρασμα: η 2η ελαφρύτερη ακμή ανήκει ΠΑΝΤΑ στο ΕΕΔ. Σωστό.'
      : 'Συμπέρασμα: η 3η ελαφρύτερη ακμή ΜΠΟΡΕΙ να απορριφθεί — λαθεμένη γενίκευση.'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          2η ή 3η ελαφρύτερη ακμή — ποια ανήκει πάντα στο ΕΕΔ;
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-md border border-border bg-bg-soft/40 px-2 py-1 text-[11px] text-fg-muted hover:bg-bg-soft"
          >
            ⟲
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-md border border-border bg-bg-soft/40 px-2 py-1 text-[11px] text-fg-muted hover:bg-bg-soft disabled:opacity-40"
          >
            ‹
          </button>
          <span className="font-mono text-[11px] text-fg-subtle">
            {step} / {totalSteps - 1}
          </span>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
            disabled={step === totalSteps - 1}
            className="rounded-md border border-border bg-bg-soft/40 px-2 py-1 text-[11px] text-fg-muted hover:bg-bg-soft disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('second')}
          className={
            'rounded-md border px-3 py-1.5 text-xs transition ' +
            (tab === 'second'
              ? 'border-success bg-success/10 text-success font-semibold'
              : 'border-border bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
          }
        >
          Α. 2η ακμή — πάντα μπαίνει ✓
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('third')}
          className={
            'rounded-md border px-3 py-1.5 text-xs transition ' +
            (tab === 'third'
              ? 'border-danger bg-danger/10 text-danger font-semibold'
              : 'border-border bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
          }
        >
          Β. 3η ακμή — μπορεί να φύγει ✗
        </button>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 320 280"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {TRIANGLE_EDGES.map((e) => {
            const g = routedEdge(e.from, e.to)
            const state = edgeStateAt(step, e.id)
            const accepted = state === 'accepted' || state === 'current-accept'
            const rejected = state === 'current-reject'
            const stroke = accepted ? '#16a34a' : rejected ? '#9f1239' : '#bdb0b2'
            const sw = accepted ? 3.6 : rejected ? 3.4 : 2
            return (
              <g key={e.id}>
                {g.kind === 'line' ? (
                  <line
                    x1={g.x1}
                    y1={g.y1}
                    x2={g.x2}
                    y2={g.y2}
                    stroke={stroke}
                    strokeWidth={sw}
                    strokeDasharray={rejected ? '5 4' : undefined}
                  />
                ) : (
                  <path
                    d={g.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={sw}
                    strokeDasharray={rejected ? '5 4' : undefined}
                  />
                )}
                <rect x={g.mx - 11} y={g.my - 10} width={22} height={20} rx={4} fill="#faf4ee" stroke={stroke} />
                <text x={g.mx} y={g.my} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#1c1214">
                  {e.w}
                </text>
              </g>
            )
          })}
          {TRIANGLE_NODES.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={R} fill="#ffffff" stroke="#1c1214" strokeWidth={1.8} />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#1c1214">
                {n.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-fg-muted">
        <div className="font-semibold text-fg">{captions[step]}</div>
        {step === totalSteps - 1 && (
          <div
            className={
              'mt-1.5 rounded border px-2 py-1 ' +
              (tab === 'second' ? 'border-success/40 text-success' : 'border-danger/40 text-danger')
            }
          >
            {finalText}
          </div>
        )}
      </div>
    </section>
  )
}
