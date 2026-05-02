'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import StationPicker from '@/components/StationPicker'
import RouteResult from '@/components/RouteResult'
import { useRouteStore } from '@/lib/store'
import { FUNCTIONS_URL } from '@/lib/supabase'

function HomeContent() {
  const { fromStation, toStation, setFrom, setTo, swapStations } = useRouteStore()
  const [loading, setLoading] = useState(false)
  const [route, setRoute]     = useState<any>(null)
  const [error, setError]     = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const f = searchParams.get('from'), t = searchParams.get('to')
    if (f) setFrom(decodeURIComponent(f))
    if (t) setTo(decodeURIComponent(t))
  }, [searchParams])
  const findRoute = async () => {
    if (!fromStation || !toStation) return
    if (fromStation === toStation) { setError('Please select two different stations.'); return }
    setLoading(true); setRoute(null); setError(null)
    try {
      const res  = await fetch(`${FUNCTIONS_URL}/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromStation, to: toStation }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setRoute(data)
    } catch { setError('Could not connect. Check your internet.') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#e2e8f8] tracking-tight">Route Finder</h1>
        <p className="text-[#4a5270] mt-2 text-sm">Find the fastest route between any two Delhi Metro stations</p>
      </div>

      {/* Picker card */}
      <div className="bg-[#141928] rounded-2xl border border-[#1e2538] p-5 shadow-xl shadow-black/20">
        <label className="block text-[10px] font-bold text-[#4a5270] uppercase tracking-widest mb-2">From</label>
        <StationPicker
          placeholder="Select departure station"
          value={fromStation}
          onSelect={(s) => { setFrom(s); setRoute(null); setError(null) }}
        />

        {/* Swap */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#1e2538]" />
          <button
            onClick={() => { swapStations(); setRoute(null) }}
            className="w-9 h-9 rounded-xl bg-[#1e2538] hover:bg-[#2a3350] border border-[#2a3350]
              hover:border-[#3a4568] flex items-center justify-center transition-all duration-200
              text-[#4a5270] hover:text-[#e2e8f8] active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <div className="flex-1 h-px bg-[#1e2538]" />
        </div>

        <label className="block text-[10px] font-bold text-[#4a5270] uppercase tracking-widest mb-2">To</label>
        <StationPicker
          placeholder="Select destination station"
          value={toStation}
          onSelect={(s) => { setTo(s); setRoute(null); setError(null) }}
        />

        <button
          onClick={findRoute}
          disabled={!fromStation || !toStation || loading}
          className="w-full mt-5 py-3.5 rounded-xl font-semibold text-white text-sm
            bg-[#4f8ef7] hover:bg-[#3a7ef0] disabled:bg-[#1e2538] disabled:text-[#4a5270]
            transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Finding route...
            </>
          ) : 'Find Route →'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 px-4 py-3 rounded-xl bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {route && <RouteResult route={route} />}
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}
