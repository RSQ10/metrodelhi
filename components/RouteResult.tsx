'use client'
import { useState } from 'react'
import Link from 'next/link'
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

export default function RouteResult({ route }: { route: RouteData }) {
  const [expandedSeg, setExpandedSeg] = useState<number | null>(null)
  const [showGates, setShowGates] = useState(false)

  if (!route?.steps || !Array.isArray(route.steps)) return null

  const path = route.path ?? []
  const steps = route.steps
  const destination = steps[steps.length - 1]?.station ?? ''
  const gateData = EXIT_GATES[destination]

  // Build segments
  const segments: {
    boardStep: RouteStep
    stops: string[]
    endStep: RouteStep
    color: string
    line: string
    direction?: string
  }[] = []

  // The backend buildSteps function provides:
  // - 'board' step: has the initial line and direction.
  // - 'interchange' step: has the NEW line and NEW direction you are switching to.
  // - 'alight' step: marks the end of the journey.

  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i]
    
    // We only start a segment on 'board' or 'interchange'
    if (currentStep.action !== 'board' && currentStep.action !== 'interchange') continue
    
    // Find the step that ends this leg (the next interchange or the final alight)
    const nextIdx = steps.findIndex((s, j) => j > i && (s.action === 'interchange' || s.action === 'alight'))
    if (nextIdx === -1) break
    
    const nextStep = steps[nextIdx]
    
    // Use the line and direction directly from the current step (board/interchange)
    // as the backend already populates these correctly for the upcoming leg.
    const legLine = currentStep.line
    const legDirection = currentStep.direction

    const fromIdx = path.findIndex(p => p === currentStep.station)
    const toIdx = path.findIndex(p => p === nextStep.station)
    const stops = fromIdx !== -1 && toIdx !== -1 ? path.slice(fromIdx + 1, toIdx) : []
    
    const color = LINE_COLORS[legLine.toLowerCase()] || route.lines_used?.find(l => l.id === legLine)?.color || '#6b7280'
    
    segments.push({ 
      boardStep: currentStep, 
      stops, 
      endStep: nextStep, 
      color, 
      line: legLine, 
      direction: legDirection 
    })
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

      {/* ── Line pills ── */}
      <div className="flex gap-2 flex-wrap">
        {route.lines_used?.map(l => (
          <span
            key={l.id}
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: LINE_COLORS[l.id.toLowerCase()] || l.color }}
          >
            {l.name}
          </span>
        ))}
      </div>

      {/* ── Journey ── */}
      <div className="bg-[#141928] rounded-2xl border border-[#1e2538] p-5">
        <h3 className="text-sm font-semibold text-[#4a5270] uppercase tracking-widest mb-5">Journey</h3>

        {segments.map((seg, si) => (
          <div key={si}>
            {/* Board / interchange row */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center w-5 shrink-0">
                <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: seg.color }} />
                <div className="w-0.5 flex-1 min-h-[20px] mt-1" style={{ backgroundColor: seg.color + '60' }} />
              </div>
              <div className="pb-4 flex-1 min-w-0">
                <p className="font-semibold text-[#e2e8f8]">{seg.boardStep.station}</p>
                <span
                  className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                  style={{ backgroundColor: seg.color }}
                >
                  {LINE_NAMES[seg.line] ?? seg.line}
                </span>
                {seg.direction && (
                  <p className="text-xs text-[#4a5270] mt-1">towards {seg.direction}</p>
                )}
                {seg.boardStep.action === 'interchange' && (
                  <p className="text-xs text-[#4f8ef7] font-semibold mt-1">⇄ Change platform here</p>
                )}
              </div>
            </div>

            {/* Stops toggle */}
            {seg.stops.length > 0 && (
              <div>
                <button
                  onClick={() => setExpandedSeg(expandedSeg === si ? null : si)}
                  className="flex items-center gap-2 ml-9 mb-1 text-xs text-[#4a5270]
                    hover:text-[#e2e8f8] transition-colors py-1"
                >
                  <div className="w-0.5 h-4" style={{ backgroundColor: seg.color + '40' }} />
                  <span>{expandedSeg === si ? '▲ hide' : `▼ ${seg.stops.length} stop${seg.stops.length > 1 ? 's' : ''}`}</span>
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
        ))}

        {/* Destination */}
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
        <div className="flex items-center justify-between p-5 hover:bg-[#1a2030] transition-colors cursor-pointer" onClick={() => setShowGates(!showGates)}>
          <div>
            <h3 className="text-sm font-semibold text-[#4a5270] uppercase tracking-widest text-left">Exit Gates</h3>
            <p className="text-[#e2e8f8] font-medium mt-0.5 text-left">{destination}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`https://github.com/yourusername/metrodelhi/edit/main/constants/gates.ts`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] font-bold text-[#4f8ef7] hover:text-[#7ab0ff] uppercase tracking-wider transition-colors"
            >
              + Add Data
            </Link>
            <span className="text-[#4a5270] text-sm">{showGates ? '▲' : '▼'}</span>
          </div>
        </div>

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
