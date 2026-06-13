import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BedDouble,
  Bath,
  Maximize,
  CalendarClock,
  Building2,
  CheckCircle2,
  MapPin,
  Users,
  Tag,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Container, Badge, Spinner } from '../components/ui/Primitives'
import { InquiryForm } from '../components/Forms'
import { useProject } from '../hooks/useData'
import { formatBDT, formatArea, CATEGORY_LABELS } from '../lib/format'
import type { Unit } from '../lib/types'

const unitStatusTone: Record<Unit['status'], 'green' | 'gold' | 'muted'> = {
  Available: 'green',
  Reserved: 'gold',
  Sold: 'muted',
}

export default function DevelopmentDetail() {
  const { slug } = useParams()
  const { data: project, isLoading } = useProject(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-[72px]">
        <Spinner className="text-gold-deep" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-[72px] text-center">
        <h1 className="font-display text-3xl font-semibold text-navy-deep">Development not found</h1>
        <Link to="/developments" className="text-gold-deep underline">
          Back to Developments Catalog
        </Link>
      </div>
    )
  }

  const facts = [
    { icon: Building2, label: 'Scheme', value: project.scheme },
    { icon: CalendarClock, label: 'Completion', value: project.completion },
    { icon: Tag, label: 'Category', value: CATEGORY_LABELS[project.category] },
    { icon: Users, label: 'Co-Broker', value: project.co_broker },
  ].filter((f) => f.value)

  const bbox =
    project.lat && project.lng
      ? `${project.lng - 0.012}%2C${project.lat - 0.008}%2C${project.lng + 0.012}%2C${
          project.lat + 0.008
        }`
      : null

  return (
    <>
      <PageHeader
        kicker={`${CATEGORY_LABELS[project.category]} · ${project.location}`}
        title={project.name}
        intro={project.tagline ?? undefined}
        crumb={project.name}
        image={project.hero_image ?? undefined}
      />

      <Container className="py-14">
        <Link
          to="/developments"
          className="inline-flex items-center gap-2 text-sm font-medium text-ash transition hover:text-gold-deep"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Developments Catalog
        </Link>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="mt-7 grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
            <div className="overflow-hidden rounded-3xl sm:col-span-2 sm:row-span-2">
              <img
                src={project.gallery[0]}
                alt={project.name}
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
            {project.gallery.slice(1, 5).map((src, i) => (
              <div key={i} className="overflow-hidden rounded-2xl">
                <img
                  src={src}
                  alt={`${project.name} ${i + 2}`}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.7fr_1fr]">
          {/* Main column */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="gold">{CATEGORY_LABELS[project.category]}</Badge>
              <Badge tone="navy">
                <span className="capitalize">{project.status}</span>
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-sm text-ash">
                <MapPin className="h-4 w-4 text-gold-deep" />
                {project.address ?? project.location}
              </span>
            </div>

            <h2 className="mt-6 font-display text-2xl font-semibold text-navy-deep">Overview</h2>
            <p className="mt-3 leading-relaxed text-ash">{project.description}</p>

            {/* Key facts */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 card-shadow"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-wash text-gold-deep">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ash">{f.label}</p>
                    <p className="font-semibold text-navy-deep">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {project.amenities.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-2xl font-semibold text-navy-deep">
                  Amenities & Features
                </h2>
                <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {project.amenities.map((a) => (
                    <div key={a} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                      <span className="text-sm text-navy-deep/90">{a}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Units */}
            {project.units.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-2xl font-semibold text-navy-deep">
                  Available Units
                </h2>
                <div className="mt-5 overflow-hidden rounded-2xl border border-black/5 card-shadow">
                  <div className="hidden grid-cols-[1.6fr_repeat(4,0.8fr)_0.9fr] gap-4 bg-navy px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white/80 sm:grid">
                    <span>Unit</span>
                    <span>Type</span>
                    <span>Beds</span>
                    <span>Area</span>
                    <span>Price</span>
                    <span className="text-right">Status</span>
                  </div>
                  <div className="divide-y divide-black/5 bg-white">
                    {project.units.map((u) => (
                      <div
                        key={u.id}
                        className="grid grid-cols-2 gap-3 px-6 py-4 text-sm sm:grid-cols-[1.6fr_repeat(4,0.8fr)_0.9fr] sm:items-center"
                      >
                        <span className="col-span-2 font-semibold text-navy-deep sm:col-span-1">
                          {u.name}
                        </span>
                        <span className="text-ash">{u.unit_type}</span>
                        <span className="inline-flex items-center gap-1 text-ash">
                          <BedDouble className="h-4 w-4 sm:hidden" />
                          {u.beds ? `${u.beds} bed` : '—'}
                        </span>
                        <span className="text-ash">
                          {u.size_sqm ? `${u.size_sqm} m²` : '—'}
                        </span>
                        <span className="font-semibold text-gold-deep">{formatBDT(u.price_bdt)}</span>
                        <span className="sm:text-right">
                          <Badge tone={unitStatusTone[u.status]}>{u.status}</Badge>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Location */}
            {bbox && (
              <>
                <h2 className="mt-12 font-display text-2xl font-semibold text-navy-deep">Location</h2>
                <div className="mt-5 overflow-hidden rounded-2xl border border-black/5 card-shadow">
                  <iframe
                    title="Location map"
                    className="h-72 w-full"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${project.lat}%2C${project.lng}`}
                  />
                </div>
              </>
            )}
          </div>

          {/* Sidebar — sticky inquiry */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-black/5 bg-white p-7 card-shadow">
              <p className="text-xs uppercase tracking-wide text-ash">Starting from</p>
              <p className="mt-1 font-display text-3xl font-bold text-gold-deep">
                {formatBDT(project.starting_price_bdt)}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 border-y border-black/5 py-4 text-sm text-ash">
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-gold-deep" />
                  {project.units.length} units
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-gold-deep" /> Premium fit-out
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Maximize className="h-4 w-4 text-gold-deep" />
                  {formatArea(project.units[0]?.size_sqm)}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold text-navy-deep">
                Request a private tour
              </h3>
              <p className="mt-1 text-sm text-ash">
                Submit a pre-reservation and a senior consultant will arrange your live presentation.
              </p>
              <div className="mt-5">
                <InquiryForm
                  source="property"
                  projectId={project.id}
                  propertyInterest={project.name}
                />
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
