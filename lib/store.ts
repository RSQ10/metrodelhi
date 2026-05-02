'use client'
import { create } from 'zustand'

interface RouteStore {
  fromStation: string
  toStation:   string
  setFrom:     (s: string) => void
  setTo:       (s: string) => void
  swapStations: () => void
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  fromStation:  '',
  toStation:    '',
  setFrom:      (s) => set({ fromStation: s }),
  setTo:        (s) => set({ toStation: s }),
  swapStations: () => set((st) => ({ fromStation: st.toStation, toStation: st.fromStation })),
}))
