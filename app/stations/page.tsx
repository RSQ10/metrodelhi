'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FUNCTIONS_URL } from '@/lib/supabase'

interface Station {
  name: string
  is_interchange: boolean
  lines: string[]
  line_colors: string[]
}

export default function StationsPage() {
  const [query, setQuery]       = useState('')
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading]   = useState(false)

  const fetchStations = async (q: string) => {
    setLoading(true)
    try {
      const res  = await fetch(`${FUNCTIONS_URL}/stations?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setStations(data.stations ?? [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStations('') }, [])
  useEffect(() => {
    const t = setTimeout(() => fetchStations(query), 280)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e2e8f8]">All Stations</h1>
        <p className="text-[#4a5270] text-sm mt-1">{stations.length} stations across all lines</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5270]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search any station..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141928] border border-[#1e2538]
            text-[#e2e8f8] placeholder-[#4a5270] outline-none focus:border-[#4f8ef7] transition-colors"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#141928] rounded-2xl border border-[#1e2538] divide-y divide-[#1e2538] overflow-hidden">
          {stations.map((s) => (
            <Link
              key={s.name}
              href={`/stations/${encodeURIComponent(s.name)}`}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-[#1a2030] transition-colors group"
            >
              <div>
                <span className="text-[#e2e8f8] text-sm font-medium group-hover:text-white transition-colors">
                  {s.is_interchange ? '⇄ ' : ''}{s.name}
                </span>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {(s.line_colors ?? []).map((color, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {(s.lines?.[i] ?? '').replace('branch', '').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <svg className="w-4 h-4 text-[#4a5270] group-hover:text-[#e2e8f8] transition-colors shrink-0 ml-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
