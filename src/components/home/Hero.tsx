import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, ChevronDown } from 'lucide-react'
import { Container } from '../ui/Primitives'

const categories = [
  { value: 'all', label: 'All categories' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'township', label: 'Township' },
  { value: 'investment', label: 'Investment' },
]

const stats = [
  { value: '18+', label: 'Signature units released' },
  { value: '8', label: 'Flagship developments' },
  { value: '100%', label: 'RAJUK & Cantonment approved' },
]

export function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    navigate(`/developments?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-navy-darker pt-24">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-ink/95 via-navy-darker/85 to-navy/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(223,173,66,0.18),transparent_45%)]" />
      </div>

      <Container className="relative z-10 py-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Bangladesh Luxury Real Estate
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl text-balance">
            A Legacy of <span className="text-gold-gradient">Trust</span> &amp; Vision
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Exclusive estates, master-planned townships and high-yield investment portfolios across
            Jolshiri Abashon and Dhaka — delivered with elite discipline, integrity and escrow-backed
            assurance.
          </p>

          {/* Search */}
          <form
            onSubmit={onSearch}
            className="glass mt-9 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 shrink-0 text-gold-deep" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by location, sector, or property..."
                className="w-full bg-transparent py-3 text-sm text-navy-deep placeholder:text-navy-deep/50 outline-none"
              />
            </div>
            <div className="relative sm:w-52">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-navy/10 bg-white/60 px-4 py-3 pr-9 text-sm font-medium text-navy-deep outline-none"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-deep/50" />
            </div>
            <button
              type="submit"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </form>

          {/* Stats */}
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-gold sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-white/60 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
