import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Loader2, GripVertical } from 'lucide-react'
import { useFaqs } from '../../hooks/useData'
import { saveFaq, deleteFaq } from '../../lib/admin'
import { Spinner } from '../../components/ui/Primitives'
import type { Faq } from '../../lib/types'

const inputCls =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy-deep outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'

interface Draft {
  id?: string
  question: string
  answer: string
  category: string
  sort_order: number
}
const empty: Draft = { question: '', answer: '', category: 'General', sort_order: 0 }

export default function AdminFaqs() {
  const { data, isLoading } = useFaqs()
  const qc = useQueryClient()
  const [draft, setDraft] = useState<Draft>(empty)
  const editing = !!draft.id
  const invalidate = () => qc.invalidateQueries({ queryKey: ['faqs'] })

  const saveM = useMutation({
    mutationFn: () => saveFaq({ id: draft.id, question: draft.question, answer: draft.answer, category: draft.category || null, sort_order: draft.sort_order }),
    onSuccess: () => { invalidate(); setDraft(empty) },
  })
  const delM = useMutation({ mutationFn: (id: string) => deleteFaq(id), onSuccess: invalidate })
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }))

  function edit(f: Faq) {
    setDraft({ id: f.id, question: f.question, answer: f.answer, category: f.category ?? 'General', sort_order: f.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">FAQ</h2>
        <p className="text-sm text-ash">Questions and answers shown on the FAQ page.</p>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-6 card-shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-navy-deep">{editing ? 'Edit question' : 'Add question'}</h3>
          {editing && <button onClick={() => setDraft(empty)} className="inline-flex items-center gap-1 text-sm text-ash hover:text-clay"><X className="h-4 w-4" /> Cancel</button>}
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Question</span>
            <input className={inputCls} value={draft.question} onChange={(e) => set('question', e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Answer</span>
            <textarea className={`${inputCls} min-h-[110px]`} value={draft.answer} onChange={(e) => set('answer', e.target.value)} />
          </label>
          <label className="block w-48">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">Category</span>
            <input className={inputCls} value={draft.category} onChange={(e) => set('category', e.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={() => saveM.mutate()} disabled={!draft.question.trim() || !draft.answer.trim() || saveM.isPending} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50">
            {saveM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editing ? 'Save' : 'Add question'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner className="text-gold-deep" /></div>
      ) : (
        <div className="space-y-3">
          {data?.map((f) => (
            <div key={f.id} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 card-shadow">
              <GripVertical className="mt-1 h-4 w-4 shrink-0 text-ash/40" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy-deep">{f.question}</p>
                <p className="mt-1 text-sm text-ash">{f.answer}</p>
                {f.category && <span className="mt-2 inline-block rounded-full bg-gold-wash px-2.5 py-0.5 text-xs font-medium text-gold-deep">{f.category}</span>}
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => edit(f)} className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-deep/70 hover:bg-navy/5"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => confirm('Delete this question?') && delM.mutate(f.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-clay hover:bg-clay/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
