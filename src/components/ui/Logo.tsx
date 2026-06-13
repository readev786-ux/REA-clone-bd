import { Link } from 'react-router-dom'

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="AHS Properties home">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-darker shadow-lg ring-1 ring-gold/30">
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
          <path
            d="M32 12 L50 52 H42 L38.4 43 H25.6 L22 52 H14 Z M28.2 36 H35.8 L32 26 Z"
            fill="#dfad42"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display text-lg font-bold tracking-tight ${
              light ? 'text-white' : 'text-navy-deep'
            }`}
          >
            AHS Properties
          </span>
          <span
            className={`mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] ${
              light ? 'text-gold/90' : 'text-gold-deep'
            }`}
          >
            & Development Ltd.
          </span>
        </span>
      )}
    </Link>
  )
}
