import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, CalendarClock } from 'lucide-react'
import type { Project } from '../lib/types'
import { formatStartingPrice, CATEGORY_LABELS } from '../lib/format'
import { Badge } from './ui/Primitives'

const statusTone: Record<string, 'green' | 'gold' | 'navy'> = {
  completed: 'green',
  ongoing: 'gold',
  upcoming: 'navy',
}

export function PropertyCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/developments/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-paper card-shadow border border-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.hero_image ?? ''}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/70 via-navy-ink/5 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge tone="gold">{CATEGORY_LABELS[project.category]}</Badge>
        </div>
        <div className="absolute right-4 top-4">
          <Badge tone={statusTone[project.status] ?? 'navy'}>
            <span className="capitalize">{project.status}</span>
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-1.5 text-white/90 text-sm">
          <MapPin className="h-4 w-4 shrink-0 text-gold" />
          <span className="truncate">{project.location}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-navy-deep leading-snug">
          {project.name}
        </h3>
        {project.tagline && (
          <p className="mt-2 text-sm text-ash line-clamp-2 leading-relaxed flex-1">
            {project.tagline}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between border-t border-black/5 pt-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-ash/80 font-mono">
              Starting
            </p>
            <p className="text-lg font-bold text-gold-deep">
              {formatStartingPrice(project.starting_price_bdt)}
            </p>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-xs text-ash">
              <CalendarClock className="h-3.5 w-3.5" />
              {project.completion ?? '—'}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold-deep transition-colors">
              View <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-paper border border-black/5 card-shadow">
      <div className="aspect-[4/3] skeleton" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-2/3 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-1/2 rounded skeleton" />
        <div className="mt-4 h-6 w-1/3 rounded skeleton" />
      </div>
    </div>
  )
}
