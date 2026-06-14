import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import { useFeatureCards } from '../../hooks/useData'
import { saveFeatureCard, deleteFeatureCard } from '../../lib/admin'
import { ICON_NAMES, getIcon } from '../../lib/icons'
import { Spinner } from '../../components/ui/Primitives'
import type { FeatureCard, FeatureSection } from '../../lib/types'

const inputCls =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy-deep outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'

const SECTIONS: { value: FeatureSection; label: string }[] = [
  { value: 'home_values', label: 'Home · Why AHS' },
  { value: 'investment_pillars', label: 'Investments · Pillars' },
  { value: 'about_principles', label: 'About · Principles' },
]
const sectionLabel = (s: string) => SECTIONS.find((x) => x.value === s)?.label ?? s

interface Draft {
  id?: string
  section: FeatureSection
  icon: string
  title: string
  body: string
  sort_order: number
}
const empty: Draft = { section: 'home_values', icon: 'ShieldCheck', title: '', body: '', sort_order: 0 }

export default function AdminFeatureCards() {
  const { data, isLoading } = useFeatureCards()
  const qc = useQueryClient()
  const [draft, setDraft] = useState<Draft>(empty)
  const editing = !!draft.id
  const invalidate = () => qc.invalidateQueries({ queryKey: ['feature_cards'] })

  const saveM = useMutation({
    mutationFn: () => saveFeatureCard(draft),
    onSuccess: () => { invalidate(); setDraft(empty) },
  })
  const delM = useMutation({ mutationFn: (id: string) => deleteFeatureCard(id), onSuccess: invalidate })
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }))

  function edit(c: FeatureCard) {
    setDraft({ id: c.id, section: c.section, icon: c.icon, title: c.title, body: c.body, sort_order: c.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const PreviewIcon = getIcon(draft.icon)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Feature cards</h2>
        <p className="text-sm text-ash">The icon + text cards in the homepage "Why AHS", Investments and About sections.</p>
      </div>

      {/* Editor */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 card-shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-navy-deep">{editing ? 'Edit card' : 'Add card'}</h3>
          {editing && <button onClick={() => setDraft(empty)} className="inline-flex items-center gap-1 text-sm text-ash hover:text-clay"><X className="h-4 w-4" /> Cancel</button>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Section</span>
            <select className={inputCls} value={draft.section} onChange={(e) => set('section', e.target.value as FeatureSection)}>
              {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Icon</span>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold"><PreviewIcon className="h-5 w-5" /></span>
              <select className={inputCls} value={draft.icon} onChange={(e) => set('icon', e.target.value)}>
                {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Title</span>
            <input className={inputCls} value={draft.title} onChange={(e) => set('title', e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Body</span>
            <textarea className={`${inputCls} min-h-[80px]`} value={draft.body} onChange={(e) => set('body', e.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={() => saveM.mutate()} disabled={!draft.title.trim() || saveM.isPending} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50">
            {saveM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editing ? 'Save' : 'Add card'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner className="text-gold-deep" /></div>
      ) : (
        SECTIONS.map((s) => {
          const cards = (data ?? []).filter((c) => c.section === s.value)
          return (
            <div key={s.value}>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-deep">{sectionLabel(s.value)}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {cards.map((c) => {
                  const Icon = getIcon(c.icon)
                  return (
                    <div key={c.id} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 card-shadow">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold"><Icon className="h-5 w-5" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy-deep">{c.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-ash">{c.body}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button onClick={() => edit(c)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-deep/70 hover:bg-navy/5"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => confirm('Delete this card?') && delM.mutate(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-clay hover:bg-clay/10"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
