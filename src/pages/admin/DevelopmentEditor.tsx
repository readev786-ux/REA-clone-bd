import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2, Star, Loader2, X, GripVertical } from 'lucide-react'
import { Spinner } from '../../components/ui/Primitives'
import { ImageDrop } from '../../components/admin/ImageDrop'
import {
  createProjectWithUnits,
  updateProjectWithUnits,
  fetchProjectByIdWithUnits,
  emptyUnit,
  unitToDraft,
  type UnitDraft,
  type ProjectInput,
} from '../../lib/admin'
import type { ProjectCategory, ProjectStatus, UnitStatus, UnitType } from '../../lib/types'

const input =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy-deep outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash'

const categories: ProjectCategory[] = ['residential', 'commercial', 'township', 'investment']
const statuses: ProjectStatus[] = ['ongoing', 'completed', 'upcoming']
const unitTypes: UnitType[] = ['Villa', 'Apartment', 'Penthouse', 'Duplex', 'Plot', 'Commercial']
const unitStatuses: UnitStatus[] = ['Available', 'Reserved', 'Sold']

interface FormState {
  name: string
  tagline: string
  description: string
  category: ProjectCategory
  location: string
  address: string
  completion: string
  scheme: string
  co_broker: string
  starting_price_bdt: string
  status: ProjectStatus
  featured: boolean
  hero_image: string
  gallery: string[]
  amenities: string[]
}

const blank: FormState = {
  name: '',
  tagline: '',
  description: '',
  category: 'residential',
  location: 'Jolshiri Abashon, Dhaka',
  address: '',
  completion: '',
  scheme: '',
  co_broker: '',
  starting_price_bdt: '',
  status: 'ongoing',
  featured: false,
  hero_image: '',
  gallery: [],
  amenities: [],
}

export default function DevelopmentEditor() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState<FormState>(blank)
  const [units, setUnits] = useState<UnitDraft[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    fetchProjectByIdWithUnits(id!).then((p) => {
      if (p) {
        setForm({
          name: p.name,
          tagline: p.tagline ?? '',
          description: p.description ?? '',
          category: p.category,
          location: p.location,
          address: p.address ?? '',
          completion: p.completion ?? '',
          scheme: p.scheme ?? '',
          co_broker: p.co_broker ?? '',
          starting_price_bdt: p.starting_price_bdt ? String(p.starting_price_bdt) : '',
          status: p.status,
          featured: p.featured,
          hero_image: p.hero_image ?? '',
          gallery: p.gallery ?? [],
          amenities: p.amenities ?? [],
        })
        setUnits(p.units.map(unitToDraft))
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))

  function setUnit(key: string, patch: Partial<UnitDraft>) {
    setUnits((list) => list.map((u) => (u._key === key ? { ...u, ...patch } : u)))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('A development name is required.')
      window.scrollTo({ top: 0 })
      return
    }
    setSaving(true)
    setError('')
    const hero = form.hero_image || form.gallery[0] || null
    const payload: ProjectInput = {
      name: form.name.trim(),
      tagline: form.tagline || null,
      description: form.description || null,
      category: form.category,
      location: form.location || 'Dhaka',
      address: form.address || null,
      completion: form.completion || null,
      scheme: form.scheme || null,
      co_broker: form.co_broker || null,
      starting_price_bdt: form.starting_price_bdt ? Number(form.starting_price_bdt) : null,
      status: form.status,
      featured: form.featured,
      hero_image: hero,
      gallery: form.gallery,
      amenities: form.amenities.filter((a) => a.trim()),
    }
    try {
      if (isEdit) await updateProjectWithUnits(id!, payload, units)
      else await createProjectWithUnits(payload, units)
      await qc.invalidateQueries({ queryKey: ['projects'] })
      navigate('/admin/projects')
    } catch (err) {
      setError((err as Error).message || 'Could not save. Please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-gold-deep" />
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-8 pb-16">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/projects')}
          className="inline-flex items-center gap-2 text-sm font-medium text-ash hover:text-gold-deep"
        >
          <ArrowLeft className="h-4 w-4" /> Developments
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? 'Save changes' : 'Create development'}
        </button>
      </div>

      <h2 className="font-display text-2xl font-semibold text-navy-deep">
        {isEdit ? 'Edit development' : 'New development'}
      </h2>
      {error && <p className="rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>}

      {/* Basics */}
      <Section title="Basics">
        <Field label="Development name" full>
          <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. AHS Jolshiri Green Gardens" />
        </Field>
        <Field label="Tagline" full>
          <input className={input} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Short one-line summary" />
        </Field>
        <Field label="Description" full>
          <textarea className={`${input} min-h-[110px]`} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
        <Field label="Category">
          <select className={input} value={form.category} onChange={(e) => set('category', e.target.value as ProjectCategory)}>
            {categories.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={input} value={form.status} onChange={(e) => set('status', e.target.value as ProjectStatus)}>
            {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <input className={input} value={form.location} onChange={(e) => set('location', e.target.value)} />
        </Field>
        <Field label="Address">
          <input className={input} value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
      </Section>

      {/* Details */}
      <Section title="Details">
        <Field label="Completion">
          <input className={input} value={form.completion} onChange={(e) => set('completion', e.target.value)} placeholder="e.g. Q4 2026" />
        </Field>
        <Field label="Scheme">
          <input className={input} value={form.scheme} onChange={(e) => set('scheme', e.target.value)} placeholder="e.g. G+4 Residential Scheme" />
        </Field>
        <Field label="Co-broker">
          <input className={input} value={form.co_broker} onChange={(e) => set('co_broker', e.target.value)} />
        </Field>
        <Field label="Starting price (BDT)">
          <input className={input} type="number" value={form.starting_price_bdt} onChange={(e) => set('starting_price_bdt', e.target.value)} placeholder="15500000" />
        </Field>
        <Field label="Feature on homepage" full>
          <label className="inline-flex items-center gap-3 rounded-xl border border-navy/15 bg-white px-4 py-2.5">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-[#c79a3c]" />
            <span className="text-sm text-navy-deep">Show this development in the homepage Featured section</span>
          </label>
        </Field>
      </Section>

      {/* Imagery */}
      <Section title="Photos">
        <div className="sm:col-span-2">
          <p className={labelCls}>Cover photo</p>
          {form.hero_image ? (
            <div className="relative inline-block">
              <img src={form.hero_image} alt="cover" className="h-40 w-64 rounded-xl object-cover" />
              <button type="button" onClick={() => set('hero_image', '')} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-clay text-white shadow">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ImageDrop compact label="Upload a cover photo" onUploaded={(urls) => set('hero_image', urls[0])} />
          )}
        </div>

        <div className="sm:col-span-2">
          <p className={labelCls}>Gallery</p>
          {form.gallery.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.gallery.map((url) => (
                <div key={url} className="group relative overflow-hidden rounded-xl">
                  <img src={url} alt="" className="h-24 w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy-ink/50 opacity-0 transition group-hover:opacity-100">
                    <button type="button" title="Set as cover" onClick={() => set('hero_image', url)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy">
                      <Star className="h-4 w-4" />
                    </button>
                    <button type="button" title="Remove" onClick={() => set('gallery', form.gallery.filter((g) => g !== url))} className="flex h-8 w-8 items-center justify-center rounded-full bg-clay text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <ImageDrop compact onUploaded={(urls) => set('gallery', [...form.gallery, ...urls])} />
        </div>
      </Section>

      {/* Amenities */}
      <Section title="Amenities & features">
        <div className="space-y-2 sm:col-span-2">
          {form.amenities.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-ash/50" />
              <input
                className={input}
                value={a}
                onChange={(e) => set('amenities', form.amenities.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="e.g. Rooftop infinity deck"
              />
              <button type="button" onClick={() => set('amenities', form.amenities.filter((_, j) => j !== i))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-clay hover:bg-clay/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => set('amenities', [...form.amenities, ''])} className="inline-flex items-center gap-2 text-sm font-semibold text-gold-deep">
            <Plus className="h-4 w-4" /> Add amenity
          </button>
        </div>
      </Section>

      {/* Units */}
      <Section title="Units">
        <div className="space-y-3 sm:col-span-2">
          {units.map((u) => (
            <div key={u._key} className="grid grid-cols-2 gap-2 rounded-2xl border border-black/5 bg-white p-3 sm:grid-cols-12 sm:items-center">
              <input className={`${input} sm:col-span-3`} value={u.name} onChange={(e) => setUnit(u._key, { name: e.target.value })} placeholder="Unit name" />
              <select className={`${input} sm:col-span-2`} value={u.unit_type} onChange={(e) => setUnit(u._key, { unit_type: e.target.value as UnitType })}>
                {unitTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
              <input className={`${input} sm:col-span-1`} type="number" value={u.beds ?? ''} onChange={(e) => setUnit(u._key, { beds: e.target.value ? Number(e.target.value) : null })} placeholder="Beds" />
              <input className={`${input} sm:col-span-1`} type="number" value={u.baths ?? ''} onChange={(e) => setUnit(u._key, { baths: e.target.value ? Number(e.target.value) : null })} placeholder="Bath" />
              <input className={`${input} sm:col-span-2`} type="number" value={u.size_sqm ?? ''} onChange={(e) => setUnit(u._key, { size_sqm: e.target.value ? Number(e.target.value) : null })} placeholder="m²" />
              <input className={`${input} sm:col-span-2`} type="number" value={u.price_bdt ?? ''} onChange={(e) => setUnit(u._key, { price_bdt: e.target.value ? Number(e.target.value) : null })} placeholder="Price ৳" />
              <div className="flex items-center gap-2 sm:col-span-1">
                <select className={input} value={u.status} onChange={(e) => setUnit(u._key, { status: e.target.value as UnitStatus })}>
                  {unitStatuses.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button type="button" onClick={() => setUnits(units.filter((x) => x._key !== u._key))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-clay hover:bg-clay/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setUnits([...units, emptyUnit()])} className="inline-flex items-center gap-2 text-sm font-semibold text-gold-deep">
            <Plus className="h-4 w-4" /> Add unit
          </button>
        </div>
      </Section>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-gold inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? 'Save changes' : 'Create development'}
        </button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 card-shadow">
      <h3 className="mb-5 font-display text-lg font-semibold text-navy-deep">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={full ? 'block sm:col-span-2' : 'block'}>
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  )
}
