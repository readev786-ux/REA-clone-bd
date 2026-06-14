import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ExternalLink, Newspaper } from 'lucide-react'
import { useAllBlogPosts } from '../../hooks/useData'
import { deleteBlogPost } from '../../lib/admin'
import { Spinner } from '../../components/ui/Primitives'
import { formatDate } from '../../lib/format'
import type { BlogPost } from '../../lib/types'

export default function AdminBlog() {
  const { data, isLoading } = useAllBlogPosts()
  const qc = useQueryClient()
  const delM = useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog'] })
      qc.invalidateQueries({ queryKey: ['blog', 'all'] })
    },
  })

  function onDelete(p: BlogPost) {
    if (confirm(`Delete "${p.title}"?`)) delM.mutate(p.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-deep">Insights</h2>
          <p className="text-sm text-ash">Articles published to the Insights page.</p>
        </div>
        <Link to="/admin/blog/new" className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner className="text-gold-deep" /></div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy/15 bg-white py-20 text-center">
          <Newspaper className="h-10 w-10 text-gold-deep/60" />
          <p className="text-sm text-ash">No articles yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((p) => (
            <div key={p.id} className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 card-shadow sm:flex-row sm:items-center">
              <img src={p.cover_image ?? ''} alt={p.title} className="h-20 w-full rounded-xl object-cover sm:w-32" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg font-semibold text-navy-deep">{p.title}</p>
                  <span className="rounded-full bg-gold-wash px-2.5 py-0.5 text-xs font-medium text-gold-deep">{p.category}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.published ? 'bg-mint/15 text-forest' : 'bg-black/5 text-ash'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ash">{p.author} · {formatDate(p.published_at)} · {p.read_minutes} min</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/admin/blog/${p.id}/edit`} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-navy/15 px-3 text-sm font-semibold text-navy-deep/80 hover:border-gold hover:text-gold-deep">
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
                <Link to={`/insights/${p.slug}`} target="_blank" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy-deep/70 hover:border-gold" title="View live">
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button onClick={() => onDelete(p)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-clay/20 text-clay hover:bg-clay/5">
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
