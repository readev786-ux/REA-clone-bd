import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Loader2, ShieldCheck } from 'lucide-react'
import { usePartners } from '../../hooks/useData'
import { savePartner, deletePartner } from '../../lib/admin'
import { ImageDrop } from '../../components/admin/ImageDrop'
import { Spinner } from '../../components/ui/Primitives'
import type { Partner } from '../../lib/types'

const inputCls =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy-deep outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'
const categories: Partner['category'][] = ['government', 'accreditation', 'client']

interface Draft {
  id?: string
  name: string
  category: Partner['category']
  logo_url: string
  sort_order: number
}
const empty: Draft = { name: '', category: 'government', logo_url: '', sort_order: 0 }

export default function AdminPartners() {
  const { data, isLoading } = usePartners()
  const qc = useQueryClient()
  const [draft, setDraft] = useState<Draft>(empty)
  const editing = !!draft.id
  const invalidate = () => qc.invalidateQueries({ queryKey: ['partners'] })

  const saveM = useMutation({
    mutationFn: () =>
      savePartner({ id: draft.id, name: draft.name, category: draft.category, logo_url: draft.logo_url || null, sort_order: draft.sort_order }),
    onSuccess: () => { invalidate(); setDraft(empty) },
  })
  const delM = useMutation({ mutationFn: (id: string) => deletePartner(id), onSuccess: invalidate })
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }))

  function edit(p: Partner) {
    setDraft({ id: p.id, name: p.name, category: p.category, logo_url: p.logo_url ?? '', sort_order: p.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Partners & accreditations</h2>
        <p className="text-sm text-ash">Logos shown on the homepage marquee and the About page.</p>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-6 card-shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-navy-deep">{editing ? 'Edit partner' : 'Add partner'}</h3>
          {editing && <button onClick={() => setDraft(empty)} className="inline-flex items-center gap-1 text-sm text-ash hover:text-clay"><X className="h-4 w-4" /> Cancel</button>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Name</span>
            <input className={inputCls} value={draft.name} onChange={(e) => set('name', e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Category</span>
            <select className={inputCls} value={draft.category} onChange={(e) => set('category', e.target.value as Partner['category'])}>
              {categories.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Logo</span>
            {draft.logo_url ? (
              <div className="relative inline-block rounded-xl bg-navy p-3">
                <img src={draft.logo_url} alt="" className="h-14 w-14 object-contain" />
                <button onClick={() => set('logo_url', '')} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-clay text-white"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <ImageDrop compact folder="partners" label="Upload a logo (transparent PNG/SVG best)" onUploaded={(u) => set('logo_url', u[0])} />
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={() => saveM.mutate()} disabled={!draft.name.trim() || saveM.isPending} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50">
            {saveM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editing ? 'Save' : 'Add partner'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner className="text-gold-deep" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 card-shadow">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} className="h-10 w-10 object-contain" /> : <ShieldCheck className="h-6 w-6 text-gold" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-deep">{p.name}</p>
                <p className="text-xs capitalize text-ash">{p.category}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => edit(p)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-deep/70 hover:bg-navy/5"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => confirm(`Delete ${p.name}?`) && delM.mutate(p.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-clay hover:bg-clay/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
