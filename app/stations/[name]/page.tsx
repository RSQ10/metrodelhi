'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FUNCTIONS_URL } from '@/lib/supabase'
import { EXIT_GATES } from '@/constants/gates'
import { LINE_COLORS } from '@/constants/lines'

export default function StationDetail() {
  const params = useParams()
  const router = useRouter()
  const decoded = decodeURIComponent(params.name as string ?? '')
  const [info, setInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${FUNCTIONS_URL}/stations?q=${encodeURIComponent(decoded)}`)
      .then(r => r.json())
      .then(d => {
        const match = (d.stations ?? []).find((s: any) => s.name.toLowerCase() === decoded.toLowerCase())
        setInfo(match ?? null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [decoded])

  const gates = EXIT_GATES[decoded] ?? null

  const UNDERGROUND = ['kashmere gate', 'rajiv chowk', 'new delhi', 'central secretariat', 'mandi house',
    'hauz khas', 'kalkaji mandir', 'iit', 'khan market', 'jor bagh', 'patel chowk', 'chandni chowk',
    'chawri bazar', 'vishwa vidyalaya', 'vidhan sabha', 'civil lines', 'janpath', 'lal qila',
    'jama masjid', 'delhi gate', 'ito', 'aiims', 'green park', 'malviya nagar']

  const isUnderground = UNDERGROUND.includes(decoded.toLowerCase())

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/stations" className="inline-flex items-center gap-1.5 text-[#4f8ef7] text-sm mb-6 hover:text-[#7ab0ff] transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Stations
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e2e8f8] leading-tight">{decoded}</h1>
        <div className="flex gap-2 mt-2 flex-wrap">
          {info?.is_interchange && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-400">
              ⇄ Interchange
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-xs font-bold border border-[#1e2538] bg-[#141928] text-[#4a5270]">
            {isUnderground ? '🕳 Underground' : '🏗 Elevated'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Lines */}
        <div className="bg-[#141928] rounded-2xl border border-[#1e2538] p-5">
          <h2 className="text-xs font-bold text-[#4a5270] uppercase tracking-widest mb-4">Lines</h2>
          <div className="space-y-2.5">
            {(info?.lines ?? []).map((line: string, i: number) => {
              const color = LINE_COLORS[line.toLowerCase()] || info?.line_colors?.[i] || '#6b7280'
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-[#e2e8f8] text-sm capitalize">
                    {line.replace('branch', ' Branch')} Line
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Exit gates */}
        <div className="bg-[#141928] rounded-2xl border border-[#1e2538] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[#4a5270] uppercase tracking-widest">Exit Gates</h2>
            <Link
              href={`https://github.com/yourusername/metrodelhi/edit/main/constants/gates.ts`}
              target="_blank"
              className="text-[10px] font-bold text-[#4f8ef7] hover:text-[#7ab0ff] uppercase tracking-wider transition-colors"
            >
              + Add Data
            </Link>
          </div>
          {gates ? (
            <div className="space-y-0 divide-y divide-[#1e2538]">
              {gates.gates.map((gate, i) => (
                <div key={i} className="flex gap-3 py-3.5 first:pt-0 last:pb-0 items-start">
                  <div className="w-9 h-9 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20
                    flex items-center justify-center shrink-0">
                    <span className="text-[#4f8ef7] font-bold text-sm">{gate.gate.replace('Gate ', '')}</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#c9cdd8] leading-snug">{gate.landmarks}</p>
                    {gate.has_lift && <p className="text-xs text-emerald-400 mt-1">♿ Lift available</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">🚪</p>
              <p className="text-[#e2e8f8] font-medium text-sm">No gate data yet</p>
              <p className="text-[#4a5270] text-xs mt-1">Gate info hasn't been added for this station.</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-[#141928] rounded-2xl border border-[#1e2538] p-5">
          <h2 className="text-xs font-bold text-[#4a5270] uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/?from=${encodeURIComponent(decoded)}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl
                bg-[#1e2538] hover:bg-[#2a3350] border border-[#2a3350] hover:border-[#3a4568]
                text-[#e2e8f8] text-sm font-medium transition-all"
            >
              🟢 Set as From
            </Link>
            <Link
              href={`/?to=${encodeURIComponent(decoded)}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl
                bg-[#1e2538] hover:bg-[#2a3350] border border-[#2a3350] hover:border-[#3a4568]
                text-[#e2e8f8] text-sm font-medium transition-all"
            >
              🔴 Set as To
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
