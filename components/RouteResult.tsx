'use client'
import { useState } from 'react'
import { LINE_COLORS, LINE_NAMES } from '@/constants/lines'
import { EXIT_GATES } from '@/constants/gates'
import SuggestGateModal from './SuggestGateModal'

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
  const [showGates, setShowGates]     = useState(false)
  const [suggestModal, setSuggestModal] = useState<{ gate: string; landmarks: string } | null>(null)

  if (!route?.steps || !Array.isArray(route.steps)) return null

  const path  = route.path ?? []
  const steps = route.steps
  const destination = steps[steps.length - 1]?.station ?? ''
  const gateData    = EXIT_GATES[destination]

  // Helper function to get accurate color for a line
  const getLineColor = (lineId: string): string => {
    const lineFromUsed = route.lines_used?.find(l => l.id === lineId)
    if (lineFromUsed?.color) return lineFromUsed.color
    return LINE_COLORS[lineId] || '#6b7280'
  }

  // Helper function to get accurate line name
  const getLineName = (lineId: string): string => {
    const lineFromUsed = route.lines_used?.find(l => l.id === lineId)
    if (lineFromUsed?.name) return lineFromUsed.name
    return LINE_NAMES[lineId] ?? lineId
  }

  // Build segments - only create a new segment when the line actually changes
  const segments: {
    boardStep: RouteStep
    stops: string[]
    endStep: RouteStep
    color: string
    lineName: string
  }[] = []

  let currentSegmentStart = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    
    // Only look for board actions to start a segment
    if (step.action !== 'board') continue
    
    // Find the next step where the line changes (interchange or alight)
    let nextIdx = -1
    let lineChanged = false
    
    for (let j = i + 1; j < steps.length; j++) {
      const nextStep = steps[j]
      
      // If we hit an alight, end the segment here
      if (nextStep.action === 'alight') {
        nextIdx = j
        break
      }
      
      // If we hit an interchange with a DIFFERENT line, end the segment
      if (nextStep.action === 'interchange' && nextStep.line !== step.line) {
        nextIdx = j
        lineChanged = true
        break
      }
    }
    
    if (nextIdx === -1) break
    
    const boardStep = step
    const endStep = steps[nextIdx]
    const fromIdx = path.findIndex(p => p === boardStep.station)
    const toIdx = path.findIndex(p => p === endStep.station)
    const stops = fromIdx !== -1 && toIdx !== -1 ? path.slice(fromIdx + 1, toIdx) : []
    
    const color = getLineColor(boardStep.line)
    const lineName = getLineName(boardStep.line)
    
    segments.push({ boardStep, stops, endStep, color, lineName })
    
    // Skip to the next board action if line changed
    if (lineChanged) {
      i = nextIdx - 1
    }
  }

  return (
    <div className="space-y-4 mt-8">

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-0 bg-[#0f1420]/80 backdrop-blur-xl rounded-2xl border border-[#1e2538]/50 overflow-hidden shadow-lg shadow-[#4f8ef7]/5">
        {[
          { val: `${Math.round(route.total_time)}`, label: 'mins', icon: '⏱️' },
          { val: `${route.total_stops}`, label: 'stops', icon: '🛑' },
          { val: `${route.interchanges}`, label: 'changes', icon: '🔄' },
          { val: `₹${route.fare}`, label: 'fare', icon: '💰' },
        ].map(({ val, label, icon }) => (
          <div key={label} className="flex flex-col items-center py-5 px-3 border-r border-[#1e2538]/30 last:border-0 hover:bg-[#1a2030]/50 transition-colors">
            <span className="text-lg mb-1">{icon}</span>
            <span className="text-2xl font-bold text-[#e2e8f8] font-mono">{val}</span>
            <span className="text-xs text-[#4a5270] mt-1 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Lines Used */}
      <div className="flex gap-2 flex-wrap">
        {route.lines_used?.map(l => (
          <span
            key={l.id}
            className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ backgroundColor: l.color, boxShadow: `0 4px 12px ${l.color}30` }}
          >
            {l.name}
          </span>
        ))}
      </div>

      {/* Journey */}
      <div className="bg-[#0f1420]/80 backdrop-blur-xl rounded-2xl border border-[#1e2538]/50 p-6 shadow-lg shadow-[#4f8ef7]/5">
        <h3 className="text-sm font-bold text-[#4a5270] uppercase tracking-widest mb-6">Journey Timeline</h3>

        {segments.map((seg, si) => (
          <div key={si}>
            {/* Board/Interchange */}
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className="w-4 h-4 rounded-full mt-1 shrink-0 shadow-lg" style={{ backgroundColor: seg.color, boxShadow: `0 0 12px ${seg.color}60` }} />
                <div className="w-1 flex-1 min-h-[20px] mt-1" style={{ backgroundColor: seg.color + '40' }} />
              </div>
              <div className="pb-4 flex-1 min-w-0">
                <p className="font-bold text-[#e2e8f8] text-base">{seg.boardStep.station}</p>
                
                {/* Line Badge */}
                <span
                  className="inline-block mt-2 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: seg.color, boxShadow: `0 4px 12px ${seg.color}40` }}
                >
                  {seg.lineName}
                </span>

                {/* Direction - Show if available */}
                {seg.boardStep.direction && (
                  <p className="text-xs text-[#7c8394] mt-2 font-medium">→ towards {seg.boardStep.direction}</p>
                )}

                {/* Interchange Indicator - Only show if this is an actual interchange (line change) */}
                {seg.boardStep.action === 'interchange' && si > 0 && (
                  <p className="text-xs text-[#4f8ef7] font-bold mt-2 flex items-center gap-1">
                    ⇄ Change platform here
                  </p>
                )}

                {/* Show next line info only for actual interchanges */}
                {seg.boardStep.action === 'interchange' && si + 1 < segments.length && (
                  <div className="mt-3 pt-3 border-t border-[#1e2538]/30">
                    <p className="text-xs text-[#4a5270] font-medium mb-1.5">Next line:</p>
                    <span
                      className="inline-block px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg"
                      style={{ backgroundColor: segments[si + 1].color, boxShadow: `0 4px 12px ${segments[si + 1].color}40` }}
                    >
                      {segments[si + 1].lineName}
                    </span>
                    {segments[si + 1].boardStep.direction && (
                      <p className="text-xs text-[#7c8394] mt-1.5 font-medium">→ towards {segments[si + 1].boardStep.direction}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stops Toggle */}
            {seg.stops.length > 0 && (
              <div>
                <button
                  onClick={() => setExpandedSeg(expandedSeg === si ? null : si)}
                  className="flex items-center gap-2 ml-10 mb-2 text-xs text-[#4a5270] hover:text-[#e2e8f8] transition-colors py-1.5 font-medium"
                >
                  <div className="w-1 h-3" style={{ backgroundColor: seg.color + '40' }} />
                  <span>{expandedSeg === si ? '▲ hide stops' : `▼ ${seg.stops.length} stop${seg.stops.length > 1 ? 's' : ''}`}</span>
                </button>

                {expandedSeg === si && seg.stops.map((stop, idx) => (
                  <div key={idx} className="flex gap-4 mb-2">
                    <div className="flex flex-col items-center w-6 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full border-2 mt-2 shrink-0 bg-[#0f1420]" style={{ borderColor: seg.color }} />
                      <div className="w-1 flex-1 min-h-[16px] mt-0.5" style={{ backgroundColor: seg.color + '30' }} />
                    </div>
                    <p className="text-sm text-[#7c8394] pb-3 flex-1 font-medium">{stop}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Destination */}
        <div className="flex gap-4 mt-4">
          <div className="flex flex-col items-center w-6 shrink-0">
            <div className="w-4 h-4 rounded-full mt-1 bg-emerald-500 shrink-0 shadow-lg shadow-emerald-500/40" />
          </div>
          <div className="pb-1 flex-1">
            <p className="font-bold text-emerald-400 text-base">{destination}</p>
            <p className="text-xs text-[#4a5270] mt-1 font-medium">✓ You have arrived</p>
          </div>
        </div>
      </div>

      {/* Exit Gates */}
      <div className="bg-[#0f1420]/80 backdrop-blur-xl rounded-2xl border border-[#1e2538]/50 overflow-hidden shadow-lg shadow-[#4f8ef7]/5">
        <button
          onClick={() => setShowGates(!showGates)}
          className="w-full flex items-center justify-between p-6 hover:bg-[#1a2030]/50 transition-colors"
        >
          <div>
            <h3 className="text-sm font-bold text-[#4a5270] uppercase tracking-widest text-left">Exit Gates</h3>
            <p className="text-[#e2e8f8] font-semibold mt-1 text-left">{destination}</p>
          </div>
          <span className="text-[#4a5270] text-lg">{showGates ? '▲' : '▼'}</span>
        </button>

        {showGates && (
          <div className="border-t border-[#1e2538]/30">
            {gateData ? (
              <>
                {gateData.gates.map((gate, i) => (
                  <div key={i} className="flex gap-3 px-6 py-4 border-b border-[#1e2538]/20 last:border-0 items-start group hover:bg-[#1a2030]/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4f8ef7]/20 to-[#7c3aed]/20 border border-[#4f8ef7]/30 flex items-center justify-center shrink-0">
                      <span className="text-[#4f8ef7] font-bold text-sm">{gate.gate.replace('Gate ', '')}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#c9cdd8] leading-snug font-medium">{gate.landmarks}</p>
                      {gate.has_lift && <span className="text-xs text-emerald-400 mt-1.5 inline-block font-semibold">♿ Lift available</span>}
                    </div>
                    <button
                      onClick={() => setSuggestModal({ gate: gate.gate, landmarks: gate.landmarks })}
                      className="p-2 rounded-lg bg-[#1e2538]/50 hover:bg-[#4f8ef7]/20 text-[#4a5270] hover:text-[#4f8ef7] transition-all opacity-0 group-hover:opacity-100"
                    >
                      <span className="text-sm">✏️</span>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSuggestModal({ gate: 'New Gate', landmarks: '' })}
                  className="w-full py-4 text-[#4a5270] hover:text-[#4f8ef7] text-xs font-bold uppercase tracking-widest hover:bg-[#1a2030]/50 transition-all border-t border-[#1e2538]/20"
                >
                  + Suggest missing gate
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center py-12 text-center px-6">
                <span className="text-4xl mb-3">🚪</span>
                <p className="text-[#e2e8f8] font-semibold">No gate data yet</p>
                <p className="text-[#4a5270] text-sm mt-1 mb-4">Help the community by adding exit gate information.</p>
                <button
                  onClick={() => setSuggestModal({ gate: 'Gate 1', landmarks: '' })}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#4f8ef7]/20 to-[#7c3aed]/20 border border-[#4f8ef7]/30 text-[#4f8ef7] text-xs font-bold hover:from-[#4f8ef7]/30 hover:to-[#7c3aed]/30 transition-all"
                >
                  + Add Gate Info
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {suggestModal && (
        <SuggestGateModal
          isOpen={!!suggestModal}
          station={destination}
          gate={suggestModal.gate}
          currentLandmarks={suggestModal.landmarks}
          onClose={() => setSuggestModal(null)}
        />
      )}
    </div>
  )
}
