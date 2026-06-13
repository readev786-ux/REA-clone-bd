import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, MapPinned } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Container } from '../components/ui/Primitives'
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard'
import { useProjects } from '../hooks/useData'
import type { Project } from '../lib/types'

const categories = [
  { value: 'all', label: 'All' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'township', label: 'Township' },
  { value: 'investment', label: 'Investment' },
]
const statuses = [
  { value: 'all', label: 'All stages' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
]

type SortKey = 'featured' | 'price-asc' | 'price-desc'

export default function Developments() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? 'all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState<SortKey>('featured')

  const { data, isLoading } = useProjects({ search, category, status })

  function updateCategory(value: string) {
    setCategory(value)
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete('category')
    else next.set('category', value)
    setParams(next, { replace: true })
  }

  const sorted = useMemo(() => {
    const list: Project[] = [...(data ?? [])]
    if (sort === 'price-asc')
      list.sort((a, b) => (a.starting_price_bdt ?? 0) - (b.starting_price_bdt ?? 0))
    if (sort === 'price-desc')
      list.sort((a, b) => (b.starting_price_bdt ?? 0) - (a.starting_price_bdt ?? 0))
    return list
  }, [data, sort])

  return (
    <>
      <PageHeader
        kicker="Developments & Schemes"
        title="Exclusive Estates & Investment Portfolios"
        intro="Filter by coastal zones, property categories or budgets to discover your next address across Jolshiri Abashon and Dhaka."
        crumb="Developments"
      />

      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 border-b border-black/5 bg-sand/85 backdrop-blur-md">
        <Container className="py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-navy/12 bg-white px-4 py-2.5">
              <Search className="h-4.5 w-4.5 text-gold-deep" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by location, sector, or property..."
                className="w-full bg-transparent text-sm text-navy-deep placeholder:text-ash/60 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-ash" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-full border border-navy/12 bg-white px-4 py-2.5 text-sm font-medium text-navy-deep outline-none"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-navy/12 bg-white px-4 py-2.5 text-sm font-medium text-navy-deep outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => updateCategory(c.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  category === c.value
                    ? 'bg-navy text-white'
                    : 'border border-navy/12 bg-white text-navy-deep/70 hover:border-gold hover:text-gold-deep'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <section className="py-14">
        <Container>
          {!isLoading && (
            <p className="mb-8 text-sm text-ash">
              <span className="font-semibold text-navy-deep">{sorted.length}</span> development
              {sorted.length === 1 ? '' : 's'} found
            </p>
          )}

          {isLoading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-navy/15 bg-white/50 py-24 text-center">
              <MapPinned className="h-12 w-12 text-gold-deep/60" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-navy-deep">
                No Development Projects Found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-ash">
                Try adjusting your search or filters — or contact our Estate Desk for off-market
                opportunities.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((p) => (
                <PropertyCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
