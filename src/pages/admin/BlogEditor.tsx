import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, X } from 'lucide-react'
import { Spinner } from '../../components/ui/Primitives'
import { ImageDrop } from '../../components/admin/ImageDrop'
import { fetchBlogPostById, saveBlogPost, slugify } from '../../lib/admin'

const inputCls =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy-deep outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash'

interface Form {
  title: string
  slug: string
  excerpt: string
  body: string
  cover_image: string
  author: string
  category: string
  read_minutes: number
  published: boolean
}
const blank: Form = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  cover_image: '',
  author: 'AHS Editorial Desk',
  category: 'Insights',
  read_minutes: 5,
  published: true,
}

export default function BlogEditor() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [form, setForm] = useState<Form>(blank)
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    fetchBlogPostById(id!).then((p) => {
      if (p) {
        setForm({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? '',
          body: p.body ?? '',
          cover_image: p.cover_image ?? '',
          author: p.author ?? 'AHS Editorial Desk',
          category: p.category ?? 'Insights',
          read_minutes: p.read_minutes,
          published: p.published,
        })
        setSlugTouched(true)
      }
      setLoading(false)
    })
  }, [id, isEdit])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('A title is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await saveBlogPost({
        id,
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        body: form.body || null,
        cover_image: form.cover_image || null,
        author: form.author || null,
        category: form.category || null,
        read_minutes: form.read_minutes,
        published: form.published,
      })
      qc.invalidateQueries({ queryKey: ['blog'] })
      qc.invalidateQueries({ queryKey: ['blog', 'all'] })
      navigate('/admin/blog')
    } catch (err) {
      setError((err as Error).message || 'Could not save.')
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner className="text-gold-deep" /></div>
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate('/admin/blog')} className="inline-flex items-center gap-2 text-sm font-medium text-ash hover:text-gold-deep">
          <ArrowLeft className="h-4 w-4" /> Insights
        </button>
        <button type="submit" disabled={saving} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? 'Save changes' : 'Publish post'}
        </button>
      </div>

      <h2 className="font-display text-2xl font-semibold text-navy-deep">{isEdit ? 'Edit article' : 'New article'}</h2>
      {error && <p className="rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>}

      <div className="space-y-4 rounded-3xl border border-black/5 bg-white p-6 card-shadow">
        <label className="block">
          <span className={labelCls}>Title</span>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => {
              set('title', e.target.value)
              if (!slugTouched) set('slug', slugify(e.target.value))
            }}
          />
        </label>
        <label className="block">
          <span className={labelCls}>URL slug</span>
          <input className={inputCls} value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }} />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className={labelCls}>Category</span>
            <input className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)} />
          </label>
          <label className="block">
            <span className={labelCls}>Author</span>
            <input className={inputCls} value={form.author} onChange={(e) => set('author', e.target.value)} />
          </label>
          <label className="block">
            <span className={labelCls}>Read minutes</span>
            <input type="number" className={inputCls} value={form.read_minutes} onChange={(e) => set('read_minutes', Number(e.target.value) || 1)} />
          </label>
        </div>

        <div>
          <span className={labelCls}>Cover image</span>
          {form.cover_image ? (
            <div className="relative inline-block">
              <img src={form.cover_image} alt="" className="h-40 w-64 rounded-xl object-cover" />
              <button type="button" onClick={() => set('cover_image', '')} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-clay text-white"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <ImageDrop compact folder="blog" label="Upload a cover image" onUploaded={(u) => set('cover_image', u[0])} />
          )}
        </div>

        <label className="block">
          <span className={labelCls}>Excerpt</span>
          <textarea className={`${inputCls} min-h-[70px]`} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
        </label>
        <label className="block">
          <span className={labelCls}>Body (one paragraph per line)</span>
          <textarea className={`${inputCls} min-h-[260px] font-sans`} value={form.body} onChange={(e) => set('body', e.target.value)} />
        </label>

        <label className="inline-flex items-center gap-3 rounded-xl border border-navy/15 px-4 py-2.5">
          <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 accent-[#c79a3c]" />
          <span className="text-sm text-navy-deep">Published (visible on the Insights page)</span>
        </label>
      </div>
    </form>
  )
}
