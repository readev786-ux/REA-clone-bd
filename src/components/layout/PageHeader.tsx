import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Container } from '../ui/Primitives'

export function PageHeader({
  kicker,
  title,
  intro,
  crumb,
  image = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80',
}: {
  kicker?: string
  title: ReactNode
  intro?: ReactNode
  crumb?: string
  image?: string
}) {
  return (
    <section className="relative overflow-hidden bg-navy-darker pt-[72px]">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-darker/90 via-navy-darker/80 to-navy-darker" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(223,173,66,0.16),transparent_50%)]" />
      </div>
      <Container className="relative z-10 py-16 sm:py-20">
        <nav className="flex items-center gap-1.5 text-xs text-white/50">
          <Link to="/" className="transition hover:text-gold">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gold/90">{crumb ?? title}</span>
        </nav>
        {kicker && <p className="kicker mt-6 text-gold/80">{kicker}</p>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl text-balance">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</p>}
      </Container>
    </section>
  )
}
