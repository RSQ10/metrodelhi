'use client'
import { useState, useEffect, useRef } from 'react'
import { FUNCTIONS_URL } from '@/lib/supabase'
import { LINE_COLORS } from '@/constants/lines'

interface Station {
  name: string
  is_interchange: boolean
  lines: string[]
  line_colors: string[]
}

interface Props {
  placeholder: string
  value: string
  onSelect: (s: string) => void
}

export default function StationPicker({ placeholder, value, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fetchStations = async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${FUNCTIONS_URL}/stations?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setStations(data.stations ?? [])
    } catch { }
    finally { setLoading(false) }
  }

  useEffect(() => { if (open) fetchStations('') }, [open])
  useEffect(() => {
    const t = setTimeout(() => { if (open) fetchStations(query) }, 280)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (name: string) => {
    onSelect(name)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl
          bg-[#141928] border border-[#1e2538] hover:border-[#2a3350]
          text-left transition-all duration-200 group"
      >
        <span className={value ? 'text-[#e2e8f8] font-medium' : 'text-[#4a5270]'}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#4a5270] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 rounded-xl bg-[#0f1420]
          border border-[#1e2538] shadow-2xl shadow-black/50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-[#1e2538]">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search station..."
              className="w-full px-3 py-2 rounded-lg bg-[#141928] border border-[#1e2538]
                text-[#e2e8f8] placeholder-[#4a5270] text-sm outline-none
                focus:border-[#4f8ef7] transition-colors"
            />
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : stations.length === 0 ? (
              <p className="text-center text-[#4a5270] text-sm py-8">No stations found</p>
            ) : (
              stations.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => handleSelect(s.name)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#141928]
                    transition-colors border-b border-[#1e2538]/50 last:border-0 text-left"
                >
                  <span className="text-[#e2e8f8] text-sm font-medium">
                    {s.is_interchange ? '⇄ ' : ''}{s.name}
                  </span>
                  <div className="flex gap-1 ml-2 shrink-0">
                    {(s.lines ?? []).map((line, ci) => {
                      const color = LINE_COLORS[line.toLowerCase()] || s.line_colors?.[ci] || '#6b7280'
                      return (
                        <span
                          key={ci}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {line.replace('branch', '').toUpperCase()}
                        </span>
                      )
                    })}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
