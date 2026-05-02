import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Delhi Metro — Route Finder',
  description: 'Find the best route between any two Delhi Metro stations. Real-time routes, interchange info, exit gates.',
  keywords: 'Delhi Metro, DMRC, route finder, metro map, Delhi transport',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080b12] text-[#e2e8f8]">
        {/* Top nav bar */}
        <header className="sticky top-0 z-50 border-b border-[#1e2538] bg-[#080b12]/90 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-[#4f8ef7] flex items-center justify-center text-sm font-bold text-white">
                🚇
              </div>
              <span className="font-semibold text-[#e2e8f8] tracking-tight">Delhi Metro</span>
            </a>
            <nav className="flex items-center gap-1">
              <a href="/" className="px-3 py-1.5 rounded-lg text-sm text-[#4a5270] hover:text-[#e2e8f8] hover:bg-[#141928] transition-all">
                Routes
              </a>
              <a href="/stations" className="px-3 py-1.5 rounded-lg text-sm text-[#4a5270] hover:text-[#e2e8f8] hover:bg-[#141928] transition-all">
                Stations
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
