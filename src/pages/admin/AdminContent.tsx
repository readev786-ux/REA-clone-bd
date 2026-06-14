import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Save, X, CheckCircle2 } from 'lucide-react'
import { useSiteContent } from '../../hooks/useData'
import { updateSiteContentValues } from '../../lib/queries'
import { Spinner } from '../../components/ui/Primitives'
import { ImageDrop } from '../../components/admin/ImageDrop'
import type { SiteContent } from '../../lib/types'

const inputCls =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy-deep outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'

export default function AdminContent() {
  const { data, isLoading } = useSiteContent()
  const qc = useQueryClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) {
      const init: Record<string, string> = {}
      data.forEach((r) => (init[r.key] = r.value))
      setValues(init)
    }
  }, [data])

  const original = useMemo(() => {
    const m: Record<string, string> = {}
    ;(data ?? []).forEach((r) => (m[r.key] = r.value))
    return m
  }, [data])

  const dirtyKeys = Object.keys(values).filter((k) => values[k] !== original[k])

  const groups = useMemo(() => {
    const map = new Map<string, SiteContent[]>()
    ;(data ?? []).forEach((r) => {
      const arr = map.get(r.group_name) ?? []
      arr.push(r)
      map.set(r.group_name, arr)
    })
    return [...map.entries()]
  }, [data])

  const mutation = useMutation({
    mutationFn: () => updateSiteContentValues(dirtyKeys.map((k) => ({ key: k, value: values[k] }))),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['site_content'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }))

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-gold-deep" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Site content</h2>
        <p className="text-sm text-ash">
          Edit the words and photos across the homepage, about and contact pages. Changes go live
          immediately after saving.
        </p>
      </div>

      {groups.map(([group, fields]) => (
        <section key={group} className="rounded-3xl border border-black/5 bg-white p-6 card-shadow">
          <h3 className="mb-5 font-display text-lg font-semibold text-navy-deep">{group}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' || f.type === 'image' ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">
                  {f.label || f.key}
                </label>

                {f.type === 'textarea' ? (
                  <textarea className={`${inputCls} min-h-[90px]`} value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.type === 'image' ? (
                  <div className="space-y-3">
                    {values[f.key] ? (
                      <div className="relative inline-block">
                        <img src={values[f.key]} alt="" className="h-32 w-52 rounded-xl object-cover" />
                        <button type="button" onClick={() => set(f.key, '')} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-clay text-white shadow">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <ImageDrop compact folder="content" label="Upload an image" onUploaded={(urls) => set(f.key, urls[0])} />
                    )}
                    <input className={inputCls} value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} placeholder="…or paste an image URL" />
                  </div>
                ) : (
                  <input className={inputCls} value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/90 px-5 py-3 card-shadow backdrop-blur">
        <p className="text-sm text-ash">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-forest">
              <CheckCircle2 className="h-4 w-4" /> Saved & live
            </span>
          ) : dirtyKeys.length ? (
            `${dirtyKeys.length} unsaved change${dirtyKeys.length === 1 ? '' : 's'}`
          ) : (
            'All changes saved'
          )}
        </p>
        <button
          onClick={() => mutation.mutate()}
          disabled={dirtyKeys.length === 0 || mutation.isPending}
          className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
    </div>
  )
}
