import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'gold' | 'navy' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2'

const variants: Record<Variant, string> = {
  gold: 'btn-gold hover:-translate-y-0.5',
  navy: 'bg-navy text-white hover:bg-navy-deep hover:-translate-y-0.5 shadow-lg shadow-navy/20',
  outline: 'border border-navy/20 text-navy hover:border-gold hover:text-gold-deep bg-white/40',
  ghost: 'text-navy hover:bg-navy/5',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-base px-8 py-4',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  to?: string
  href?: string
  children: ReactNode
}

export function Button({
  variant = 'gold',
  size = 'md',
  to,
  href,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

export function Badge({
  children,
  tone = 'gold',
  className = '',
}: {
  children: ReactNode
  tone?: 'gold' | 'navy' | 'green' | 'clay' | 'muted'
  className?: string
}) {
  const tones: Record<string, string> = {
    gold: 'bg-gold-wash text-gold-deep border-gold/30',
    navy: 'bg-navy/5 text-navy border-navy/15',
    green: 'bg-mint/15 text-forest border-forest/20',
    clay: 'bg-clay/10 text-clay border-clay/20',
    muted: 'bg-black/5 text-ash border-black/10',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export function SectionHeading({
  kicker,
  title,
  intro,
  align = 'center',
  light = false,
}: {
  kicker?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'center' | 'left'
  light?: boolean
}) {
  return (
    <div
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${
        align === 'center' ? 'items-center' : ''
      }`}
    >
      {kicker && <p className="kicker mb-3">{kicker}</p>}
      <h2
        className={`text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.1] font-semibold text-balance ${
          light ? 'text-white' : 'text-navy-deep'
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/70' : 'text-ash'}`}>
          {intro}
        </p>
      )}
    </div>
  )
}

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>
}
