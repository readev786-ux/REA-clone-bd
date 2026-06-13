import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Star, Trash2, ExternalLink, MapPin, Pencil, Plus, Upload } from 'lucide-react'
import { useProjects } from '../../hooks/useData'
import { deleteProject, updateProject } from '../../lib/queries'
import { Spinner } from '../../components/ui/Primitives'
import { formatStartingPrice, CATEGORY_LABELS } from '../../lib/format'
import type { Project } from '../../lib/types'

export default function AdminProjects() {
  const { data, isLoading } = useProjects()
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['projects'] })

  const featureMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      updateProject(id, { featured }),
    onSuccess: invalidate,
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: invalidate,
  })

  function onDelete(p: Project) {
    if (confirm(`Delete "${p.name}"? This also removes its units and cannot be undone.`)) {
      deleteMutation.mutate(p.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-deep">Developments</h2>
          <p className="text-sm text-ash">
            Create, edit and manage every listing — units, amenities and photos included.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/import" className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy-deep hover:border-gold">
            <Upload className="h-4 w-4" /> Import CSV
          </Link>
          <Link to="/admin/projects/new" className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
            <Plus className="h-4 w-4" /> New development
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="text-gold-deep" />
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 card-shadow sm:flex-row sm:items-center"
            >
              <img
                src={p.hero_image ?? ''}
                alt={p.name}
                className="h-20 w-full rounded-xl object-cover sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg font-semibold text-navy-deep">{p.name}</p>
                  <span className="rounded-full bg-gold-wash px-2.5 py-0.5 text-xs font-medium text-gold-deep">
                    {CATEGORY_LABELS[p.category]}
                  </span>
                  <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium capitalize text-navy">
                    {p.status}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ash">
                  <MapPin className="h-4 w-4" /> {p.location} · {formatStartingPrice(p.starting_price_bdt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => featureMutation.mutate({ id: p.id, featured: !p.featured })}
                  title={p.featured ? 'Unfeature' : 'Feature on homepage'}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${
                    p.featured
                      ? 'bg-gold text-navy'
                      : 'border border-navy/15 text-navy-deep/70 hover:border-gold'
                  }`}
                >
                  <Star className={`h-4 w-4 ${p.featured ? 'fill-current' : ''}`} />
                  {p.featured ? 'Featured' : 'Feature'}
                </button>
                <Link
                  to={`/admin/projects/${p.id}/edit`}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-navy/15 px-3 text-sm font-semibold text-navy-deep/80 hover:border-gold hover:text-gold-deep"
                  title="Edit development"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
                <Link
                  to={`/developments/${p.slug}`}
                  target="_blank"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy-deep/70 hover:border-gold hover:text-gold-deep"
                  title="View live"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => onDelete(p)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-clay/20 text-clay hover:bg-clay/5"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
