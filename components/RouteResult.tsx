'use client'
import { useState } from 'react'
import { LINE_COLORS, LINE_NAMES } from '@/constants/lines'
import { EXIT_GATES } from '@/constants/gates'

interface RouteStep {
  station: string
  line: string
  action: 'board' | 'interchange' | 'alight'
  direction?: string
}

interface RouteData {
  path: string[]
  lines_used: { id: string; name: string; color: string }[]
  total_time: number
  total_stops: number
  fare: number
  interchanges: number
  steps: RouteStep[]
}

// Resolve the correct hex color for a line id, preferring server-supplied colors
function resolveColor(lineId: string, linesUsed: RouteData['lines_used']): string {
  return (
    linesUsed?.find(l => l.id === lineId)?.color ??
    LINE_COLORS[lineId] ??
    '#6b7280'
  )
}

// Case-insensitive station index lookup so mismatched casing never hides stops
function findStation(path: string[], name: string): number {
  const lower = name.toLowerCase()
  return path.findIndex(p => p.toLowerCase() === lower)
}

export default function RouteResult({ route }: { route: RouteData }) {
  const [expandedSeg, setExpandedSeg] = useState<number | null>(null)
  const [showGates, setShowGates]     = useState(false)

  if (!route?.steps || !Array.isArray(route.steps)) return null

  const path        = route.path ?? []
  const steps       = route.steps
  const destination = steps[steps.length - 1]?.station ?? ''
  const gateData    = EXIT_GATES[destination]

  // ── Build segments ──────────────────────────────────────────────────────────
  // Each segment = one continuous ride on a single line, from a board/interchange
  // step to the next interchange/alight step.
  // The COLOR must come from the step that BOARDS the segment (step.line),
  // not from the *next* step — that's what was mixing colors at interchanges.
  const segments: {
    boardStep: RouteStep   // the step where we get on this line
    stops: string[]        // intermediate stations (not shown by default)
    endStep: RouteStep     // where we get off / change
    color: string          // line color for THIS segment
    lineName: string       // human-readable line name for THIS segment
  }[] = []

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    if (step.action !== 'board' && step.action !== 'interchange') continue

    const nextIdx = steps.findIndex(
      (s, j) => j > i && (s.action === 'interchange' || s.action === 'alight')
    )
    if (nextIdx === -1) break

    const nextStep = steps[nextIdx]
    const fromIdx  = findStation(path, step.station)
    const toIdx    = findStation(path, nextStep.station)
    const stops    = fromIdx !== -1 && toIdx !== -1 ? path.slice(fromIdx + 1, toIdx) : []

    // Color & name come from THIS segment's line id (step.line), not nextStep
    const color    = resolveColor(step.line, route.lines_used)
    const lineName = LINE_NAMES[step.line] ?? step.line

    segments.push({ boardStep: step, stops, endStep: nextStep, color, lineName })
  }

  return (
    <div className="space-y-3 mt-4">

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-4 divide-x divide-[#1e2538] bg-[#141928] rounded-2xl border border-[#1e2538] overflow-hidden">
        {[
          { val: `${Math.round(route.total_time)}`, label: 'mins' },
          { val: `${route.total_stops}`, label: 'stops' },
          { val: `${route.interchanges}`, label: 'changes' },
          { val: `₹${route.fare}`, label: 'fare' },
        ].map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center py-4">
            <span className="text-2xl font-bold text-[#e2e8f8] font-mono">{val}</span>
            <span className="text-xs text-[#4a5270] mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Line pills (ordered by journey) ── */}
      <div className="flex gap-2 flex-wrap">
        {route.lines_used?.map(l => (
          <span
            key={l.id}
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: l.color }}
          >
            {l.name}
          </span>
        ))}
      </div>

      {/* ── Journey ── */}
      <div className="bg-[#141928] rounded-2xl border border-[#1e2538] p-5">
        <h3 className="text-sm font-semibold text-[#4a5270] uppercase tracking-widest mb-5">Journey</h3>

        {segments.map((seg, si) => {
          const isInterchange = seg.boardStep.action === 'interchange'
          // The color that was active BEFORE this segment (for the interchange dot split)
          const prevColor = si > 0 ? segments[si - 1].color : null

          return (
            <div key={si}>
              {/* ── Board / Interchange row ── */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center w-5 shrink-0">
                  {/* 
                    At an interchange the dot is split: top half = previous line color,
                    bottom half = new line color, making the color transition obvious.
                    At a board point it's a solid dot of the new line color.
                  */}
                  {isInterchange && prevColor ? (
                    <div className="w-4 h-4 rounded-full mt-0.5 shrink-0 overflow-hidden flex flex-col border-2"
                      style={{ borderColor: seg.color }}>
                      <div className="flex-1" style={{ backgroundColor: prevColor }} />
                      <div className="flex-1" style={{ backgroundColor: seg.color }} />
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: seg.color }} />
                  )}
                  <div className="w-0.5 flex-1 min-h-[20px] mt-1"
                    style={{ backgroundColor: seg.color + '60' }} />
                </div>

                <div className="pb-4 flex-1 min-w-0">
                  <p className="font-semibold text-[#e2e8f8]">{seg.boardStep.station}</p>

                  {/* Line badge — always this segment's color */}
                  <span
                    className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                    style={{ backgroundColor: seg.color }}
                  >
                    {seg.lineName}
                  </span>

                  {/* Direction — always shown when present */}
                  {seg.boardStep.direction && (
                    <p className="text-xs text-[#4a5270] mt-1">
                      towards <span className="text-[#c9cdd8] font-medium">{seg.boardStep.direction}</span>
                    </p>
                  )}

                  {/* Interchange notice with both line colors */}
                  {isInterchange && prevColor && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: prevColor }} />
                      <span className="text-[10px] text-[#4a5270]">→</span>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                      <span className="text-[10px] text-[#4f8ef7] font-semibold">Change platform</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Intermediate stops toggle ── */}
              {seg.stops.length > 0 && (
                <div>
                  <button
                    onClick={() => setExpandedSeg(expandedSeg === si ? null : si)}
                    className="flex items-center gap-2 ml-9 mb-1 text-xs text-[#4a5270]
                      hover:text-[#e2e8f8] transition-colors py-1"
                  >
                    <div className="w-0.5 h-4" style={{ backgroundColor: seg.color + '40' }} />
                    <span>
                      {expandedSeg === si
                        ? '▲ hide'
                        : `▼ ${seg.stops.length} stop${seg.stops.length > 1 ? 's' : ''}`}
                    </span>
                  </button>

                  {expandedSeg === si && seg.stops.map((stop, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center w-5 shrink-0">
                        <div className="w-2 h-2 rounded-full border mt-2 shrink-0 bg-[#141928]"
                          style={{ borderColor: seg.color }} />
                        <div className="w-0.5 flex-1 min-h-[16px] mt-0.5"
                          style={{ backgroundColor: seg.color + '40' }} />
                      </div>
                      <p className="text-sm text-[#4a5270] pb-3 flex-1">{stop}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* ── Destination ── */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center w-5 shrink-0">
            <div className="w-3 h-3 rounded-full mt-1 bg-emerald-500 shrink-0" />
          </div>
          <div className="pb-1 flex-1">
            <p className="font-semibold text-emerald-400">{destination}</p>
            <p className="text-xs text-[#4a5270] mt-0.5">You have arrived</p>
          </div>
        </div>
      </div>

      {/* ── Exit Gates ── */}
      <div className="bg-[#141928] rounded-2xl border border-[#1e2538] overflow-hidden">
        <button
          onClick={() => setShowGates(!showGates)}
          className="w-full flex items-center justify-between p-5 hover:bg-[#1a2030] transition-colors"
        >
          <div>
            <h3 className="text-sm font-semibold text-[#4a5270] uppercase tracking-widest text-left">Exit Gates</h3>
            <p className="text-[#e2e8f8] font-medium mt-0.5 text-left">{destination}</p>
          </div>
          <span className="text-[#4a5270] text-sm">{showGates ? '▲' : '▼'}</span>
        </button>

        {showGates && (
          <div className="border-t border-[#1e2538]">
            {gateData ? (
              gateData.gates.map((gate, i) => (
                <div key={i} className="flex gap-3 px-5 py-3.5 border-b border-[#1e2538]/50 last:border-0 items-start">
                  <div className="w-9 h-9 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20
                    flex items-center justify-center shrink-0">
                    <span className="text-[#4f8ef7] font-bold text-sm">
                      {gate.gate.replace('Gate ', '')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#c9cdd8] leading-snug">{gate.landmarks}</p>
                    {gate.has_lift && (
                      <span className="text-xs text-emerald-400 mt-1 inline-block">♿ Lift available</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-10 text-center px-4">
                <span className="text-3xl mb-2">🚪</span>
                <p className="text-[#e2e8f8] font-medium">No gate data yet</p>
                <p className="text-[#4a5270] text-sm mt-1">Gate info for this station hasn't been added yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
