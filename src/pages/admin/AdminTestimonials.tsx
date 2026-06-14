import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Trash2, Pencil, Plus, X, Loader2, Quote } from 'lucide-react'
import { useTestimonials } from '../../hooks/useData'
import { saveTestimonial, deleteTestimonial } from '../../lib/admin'
import { ImageDrop } from '../../components/admin/ImageDrop'
import { Spinner } from '../../components/ui/Primitives'
import type { Testimonial } from '../../lib/types'

const inputCls =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy-deep outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'

interface Draft {
  id?: string
  name: string
  role: string
  quote: string
  avatar_url: string
  rating: number
  sort_order: number
}
const empty: Draft = { name: '', role: '', quote: '', avatar_url: '', rating: 5, sort_order: 0 }

export default function AdminTestimonials() {
  const { data, isLoading } = useTestimonials()
  const qc = useQueryClient()
  const [draft, setDraft] = useState<Draft>(empty)
  const editing = !!draft.id

  const invalidate = () => qc.invalidateQueries({ queryKey: ['testimonials'] })
  const saveM = useMutation({
    mutationFn: () =>
      saveTestimonial({
        id: draft.id,
        name: draft.name,
        role: draft.role || null,
        quote: draft.quote,
        avatar_url: draft.avatar_url || null,
        rating: draft.rating,
        sort_order: draft.sort_order,
      }),
    onSuccess: () => {
      invalidate()
      setDraft(empty)
    },
  })
  const delM = useMutation({ mutationFn: (id: string) => deleteTestimonial(id), onSuccess: invalidate })

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }))

  function edit(t: Testimonial) {
    setDraft({
      id: t.id,
      name: t.name,
      role: t.role ?? '',
      quote: t.quote,
      avatar_url: t.avatar_url ?? '',
      rating: t.rating,
      sort_order: t.sort_order,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Testimonials</h2>
        <p className="text-sm text-ash">Client quotes shown on the homepage.</p>
      </div>

      {/* Editor */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 card-shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-navy-deep">
            {editing ? 'Edit testimonial' : 'Add testimonial'}
          </h3>
          {editing && (
            <button onClick={() => setDraft(empty)} className="inline-flex items-center gap-1 text-sm text-ash hover:text-clay">
              <X className="h-4 w-4" /> Cancel
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Name</span>
            <input className={inputCls} value={draft.name} onChange={(e) => set('name', e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Role / location</span>
            <input className={inputCls} value={draft.role} onChange={(e) => set('role', e.target.value)} placeholder="Investor, Dhaka" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Quote</span>
            <textarea className={`${inputCls} min-h-[90px]`} value={draft.quote} onChange={(e) => set('quote', e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Rating</span>
            <select className={inputCls} value={draft.rating} onChange={(e) => set('rating', Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </label>
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Photo</span>
            {draft.avatar_url ? (
              <div className="relative inline-block">
                <img src={draft.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
                <button onClick={() => set('avatar_url', '')} className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-clay text-white"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <ImageDrop compact folder="testimonials" label="Upload photo" onUploaded={(u) => set('avatar_url', u[0])} />
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => saveM.mutate()}
            disabled={!draft.name.trim() || !draft.quote.trim() || saveM.isPending}
            className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {saveM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editing ? 'Save' : 'Add testimonial'}
          </button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner className="text-gold-deep" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data?.map((t) => (
            <div key={t.id} className="rounded-2xl border border-black/5 bg-white p-5 card-shadow">
              <Quote className="h-6 w-6 text-gold/60" />
              <p className="mt-2 text-sm text-navy-deep/85">“{t.quote}”</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {t.avatar_url && <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                  <div>
                    <p className="text-sm font-semibold text-navy-deep">{t.name}</p>
                    <p className="text-xs text-gold-deep">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="mr-1 inline-flex items-center text-xs text-gold-deep"><Star className="h-3.5 w-3.5 fill-current" />{t.rating}</span>
                  <button onClick={() => edit(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-deep/70 hover:bg-navy/5"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirm(`Delete ${t.name}'s testimonial?`) && delM.mutate(t.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-clay hover:bg-clay/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
