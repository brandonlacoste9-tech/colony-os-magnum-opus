const nodes = [
  { id: 'core', x: 50, y: 50, size: 22, tone: 'from-indigo-400 to-cyan-300', label: 'CODEX' },
  { id: 'mind', x: 24, y: 32, size: 12, tone: 'from-indigo-300 to-purple-300', label: 'Mind' },
  { id: 'memory', x: 72, y: 42, size: 10, tone: 'from-cyan-300 to-indigo-200', label: 'Memory' },
  { id: 'will', x: 64, y: 70, size: 11, tone: 'from-amber-300 to-pink-300', label: 'Will' },
  { id: 'body', x: 32, y: 68, size: 10, tone: 'from-emerald-300 to-amber-200', label: 'Body' },
  { id: 'orb-1', x: 14, y: 48, size: 8, tone: 'from-indigo-300 to-cyan-300', label: 'Sentinel Bee' },
  { id: 'orb-2', x: 86, y: 28, size: 7, tone: 'from-emerald-300 to-cyan-200', label: 'Learner Bee' },
  { id: 'orb-3', x: 78, y: 62, size: 8, tone: 'from-indigo-200 to-pink-200', label: 'Sensor Bee' },
  { id: 'orb-4', x: 46, y: 22, size: 7, tone: 'from-amber-200 to-indigo-200', label: 'Weaver Bee' },
]

const links: [string, string][] = [
  ['core', 'mind'],
  ['core', 'memory'],
  ['core', 'will'],
  ['core', 'body'],
  ['mind', 'orb-1'],
  ['memory', 'orb-2'],
  ['will', 'orb-3'],
  ['body', 'orb-4'],
]

export default function HiveField() {
  return (
    <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(5,9,20,0.8)] to-[rgba(11,18,36,0.8)]">
      <div className="absolute inset-0 opacity-60 blur-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(96,96,255,0.2),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(56,232,255,0.15),transparent_40%)]" />
      </div>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {links.map(([a, b]) => {
          const start = nodes.find((n) => n.id === a)
          const end = nodes.find((n) => n.id === b)
          if (!start || !end) return null
          return (
            <line
              key={`${a}-${b}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="url(#pulse)"
              strokeWidth="0.6"
              opacity="0.6"
            />
          )
        })}
        <defs>
          <linearGradient id="pulse" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(96,96,255,0.8)" />
            <stop offset="100%" stopColor="rgba(56,232,255,0.6)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative h-full w-full">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="group absolute flex flex-col items-center gap-1"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${node.tone} shadow-[0_0_25px_rgba(96,96,255,0.35)] animate-breath`}
              style={{ width: `${node.size}px`, height: `${node.size}px` }}
            >
              <div className="absolute inset-0 rounded-full blur-lg bg-white/20 opacity-60 animate-halo" />
              <div className="relative h-full w-full rounded-full border border-white/30 opacity-70" />
            </div>
            {node.label ? (
              <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {node.label}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_55%)] mix-blend-screen" />
    </div>
  )
}
