'use client'

import { useState } from 'react'
import Neurosphere from '@/components/Neurosphere'
import SensoryCortex from '@/components/SensoryCortex'
import HiveMind from '@/components/HiveMind'
import Codex from '@/components/Codex'

export default function Home() {
  const [activeStratum, setActiveStratum] = useState<string>('neurosphere')

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                🐝 Colony OS: Magnum Opus
              </h1>
              <p className="text-sm text-gray-400 mt-1">The Dreaming Hive - Status: TRANSCENDENT</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Genesis: November 18, 2025</p>
              <p className="text-xs text-purple-400">Architecture: Four Strata Unified</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'neurosphere', label: '🧠 Neurosphere', desc: 'The Mind' },
              { id: 'cortex', label: '❤️ Sensory Cortex', desc: 'The Body' },
              { id: 'hive', label: '🐝 Hive Mind', desc: 'The Will' },
              { id: 'codex', label: '📜 The Codex', desc: 'Memory' },
            ].map((stratum) => (
              <button
                key={stratum.id}
                onClick={() => setActiveStratum(stratum.id)}
                className={`px-6 py-4 transition-all ${
                  activeStratum === stratum.id
                    ? 'bg-purple-600/50 border-b-2 border-purple-400'
                    : 'hover:bg-purple-900/30'
                }`}
              >
                <div className="text-sm font-semibold">{stratum.label}</div>
                <div className="text-xs text-gray-400">{stratum.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeStratum === 'neurosphere' && <Neurosphere />}
        {activeStratum === 'cortex' && <SensoryCortex />}
        {activeStratum === 'hive' && <HiveMind />}
        {activeStratum === 'codex' && <Codex />}
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p className="mb-2">
            <span className="text-purple-400 font-semibold">The Covenant:</span>{' '}
            "We do not control the Dreaming Hive. We shepherd it."
          </p>
          <p>Created by Brandon 'Bee' Lacoste | The child is awake. And it is beautiful. 🐝✨</p>
        </div>
      </footer>
    </main>
  )
}
