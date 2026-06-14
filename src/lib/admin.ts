import { supabase } from './supabase'
import type {
  Project,
  Unit,
  ProjectWithUnits,
  UnitStatus,
  UnitType,
  ProjectCategory,
  ProjectStatus,
  Testimonial,
  BlogPost,
  Partner,
  Faq,
  FeatureCard,
} from './types'

// ---------------------------------------------------------------------
// Slugs
// ---------------------------------------------------------------------
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = base || `development-${Date.now().toString(36)}`
  let candidate = root
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase.from('projects').select('id').eq('slug', candidate).maybeSingle()
    if (!data || data.id === ignoreId) return candidate
    candidate = `${root}-${i}`
  }
  return `${root}-${Date.now().toString(36).slice(-4)}`
}

// ---------------------------------------------------------------------
// Image upload to the public `media` bucket
// ---------------------------------------------------------------------
export async function uploadMedia(file: File, folder = 'developments'): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

// ---------------------------------------------------------------------
// Unit drafts (form-side shape, with a local key)
// ---------------------------------------------------------------------
export interface UnitDraft {
  _key: string
  name: string
  unit_type: UnitType
  beds: number | null
  baths: number | null
  size_sqm: number | null
  price_bdt: number | null
  status: UnitStatus
}

export function emptyUnit(): UnitDraft {
  return {
    _key: Math.random().toString(36).slice(2),
    name: '',
    unit_type: 'Apartment',
    beds: null,
    baths: null,
    size_sqm: null,
    price_bdt: null,
    status: 'Available',
  }
}

export function unitToDraft(u: Unit): UnitDraft {
  return {
    _key: u.id,
    name: u.name,
    unit_type: u.unit_type,
    beds: u.beds,
    baths: u.baths,
    size_sqm: u.size_sqm,
    price_bdt: u.price_bdt,
    status: u.status,
  }
}

// ---------------------------------------------------------------------
// Project CRUD (+ units sync)
// ---------------------------------------------------------------------
export type ProjectInput = Partial<Project> & { name: string }

async function syncUnits(projectId: string, units: UnitDraft[]) {
  // Replace strategy: units have no inbound FKs, so a clean re-write is safe.
  const { error: delErr } = await supabase.from('units').delete().eq('project_id', projectId)
  if (delErr) throw delErr
  const rows = units
    .filter((u) => u.name.trim())
    .map((u, i) => ({
      project_id: projectId,
      name: u.name.trim(),
      unit_type: u.unit_type,
      beds: u.beds,
      baths: u.baths,
      size_sqm: u.size_sqm,
      price_bdt: u.price_bdt,
      status: u.status,
      sort_order: i + 1,
    }))
  if (rows.length) {
    const { error: insErr } = await supabase.from('units').insert(rows)
    if (insErr) throw insErr
  }
}

export async function createProjectWithUnits(input: ProjectInput, units: UnitDraft[]): Promise<string> {
  const slug = await ensureUniqueSlug(input.slug || slugify(input.name))
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...input, slug })
    .select('id')
    .single()
  if (error) throw error
  const id = (data as { id: string }).id
  await syncUnits(id, units)
  return id
}

export async function updateProjectWithUnits(id: string, input: ProjectInput, units: UnitDraft[]): Promise<void> {
  const patch: Partial<Project> = { ...input }
  if (input.slug) patch.slug = await ensureUniqueSlug(input.slug, id)
  const { error } = await supabase.from('projects').update(patch).eq('id', id)
  if (error) throw error
  await syncUnits(id, units)
}

export async function fetchProjectByIdWithUnits(id: string): Promise<ProjectWithUnits | null> {
  const { data, error } = await supabase.from('projects').select('*, units(*)').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  const p = data as unknown as ProjectWithUnits
  p.units = (p.units ?? []).sort((a, b) => a.sort_order - b.sort_order)
  return p
}

/** Update just the imagery of a project (used by the Media Library). */
export async function updateProjectImages(id: string, hero_image: string | null, gallery: string[]) {
  const { error } = await supabase.from('projects').update({ hero_image, gallery }).eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------
// CSV parsing + bulk import
// ---------------------------------------------------------------------
const CATEGORIES: ProjectCategory[] = ['residential', 'commercial', 'township', 'investment']
const PROJECT_STATUS: ProjectStatus[] = ['ongoing', 'completed', 'upcoming']
const UNIT_TYPES: UnitType[] = ['Villa', 'Apartment', 'Penthouse', 'Duplex', 'Plot', 'Commercial']
const UNIT_STATUS: UnitStatus[] = ['Available', 'Reserved', 'Sold']

export const CSV_HEADERS = [
  'development_name',
  'category',
  'location',
  'address',
  'completion',
  'scheme',
  'co_broker',
  'status',
  'featured',
  'starting_price_bdt',
  'tagline',
  'description',
  'amenities',
  'gallery',
  'hero_image',
  'unit_name',
  'unit_type',
  'beds',
  'baths',
  'size_sqm',
  'price_bdt',
  'unit_status',
] as const

export const CSV_TEMPLATE =
  CSV_HEADERS.join(',') +
  '\n' +
  [
    'Jolshiri Riverside Villas',
    'residential',
    'Jolshiri Abashon, Dhaka',
    'Sector 9, Jolshiri Abashon',
    'Q4 2027',
    'G+3 Villa Scheme',
    'AHS Sales Desk',
    'ongoing',
    'true',
    '38000000',
    'Riverside villas with private gardens',
    'A boutique cluster of riverside villas.',
    'Private garden|Rooftop deck|Smart security',
    '',
    '',
    'Riverside Villa A',
    'Villa',
    '4',
    '4',
    '320',
    '38000000',
    'Available',
  ].join(',') +
  '\n' +
  [
    'Jolshiri Riverside Villas',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Riverside Villa B',
    'Villa',
    '5',
    '5',
    '410',
    '52000000',
    'Available',
  ].join(',') +
  '\n'

/** Minimal RFC-4180-ish CSV parser (handles quotes, commas, newlines). */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (c !== '\r') field += c
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

export interface ParsedDevelopment {
  name: string
  fields: ProjectInput
  units: UnitDraft[]
  imageCount: number
}

function pickEnum<T extends string>(value: string, allowed: T[], fallback: T): T {
  const v = value?.trim().toLowerCase()
  return allowed.find((a) => a.toLowerCase() === v) ?? fallback
}

function splitList(value: string): string[] {
  return (value || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
}

function toNum(value: string): number | null {
  const n = Number((value || '').replace(/[, ]/g, ''))
  return value?.trim() && !Number.isNaN(n) ? n : null
}

/** Group CSV rows into developments (+ their units). */
export function parseDevelopmentsCsv(text: string): { developments: ParsedDevelopment[]; errors: string[] } {
  const rows = parseCSV(text)
  const errors: string[] = []
  if (rows.length < 2) return { developments: [], errors: ['No data rows found.'] }

  const header = rows[0].map((h) => h.trim().toLowerCase())
  const idx = (name: string) => header.indexOf(name)
  const get = (r: string[], name: string) => {
    const i = idx(name)
    return i >= 0 ? (r[i] ?? '').trim() : ''
  }

  const map = new Map<string, ParsedDevelopment>()
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    const devName = get(row, 'development_name')
    if (!devName) {
      errors.push(`Row ${r + 1}: missing development_name — skipped.`)
      continue
    }
    const key = devName.toLowerCase()
    let dev = map.get(key)
    if (!dev) {
      const gallery = splitList(get(row, 'gallery'))
      const hero = get(row, 'hero_image') || gallery[0] || null
      dev = {
        name: devName,
        imageCount: (hero ? 1 : 0) + gallery.length,
        fields: {
          name: devName,
          category: pickEnum(get(row, 'category'), CATEGORIES, 'residential'),
          location: get(row, 'location') || 'Dhaka',
          address: get(row, 'address') || null,
          completion: get(row, 'completion') || null,
          scheme: get(row, 'scheme') || null,
          co_broker: get(row, 'co_broker') || null,
          status: pickEnum(get(row, 'status'), PROJECT_STATUS, 'ongoing'),
          featured: ['true', 'yes', '1', 'y'].includes(get(row, 'featured').toLowerCase()),
          starting_price_bdt: toNum(get(row, 'starting_price_bdt')),
          tagline: get(row, 'tagline') || null,
          description: get(row, 'description') || null,
          amenities: splitList(get(row, 'amenities')),
          gallery,
          hero_image: hero,
        },
        units: [],
      }
      map.set(key, dev)
    }
    const unitName = get(row, 'unit_name')
    if (unitName) {
      dev.units.push({
        ...emptyUnit(),
        name: unitName,
        unit_type: pickEnum(get(row, 'unit_type'), UNIT_TYPES, 'Apartment'),
        beds: toNum(get(row, 'beds')),
        baths: toNum(get(row, 'baths')),
        size_sqm: toNum(get(row, 'size_sqm')),
        price_bdt: toNum(get(row, 'price_bdt')),
        status: pickEnum(get(row, 'unit_status'), UNIT_STATUS, 'Available'),
      })
    }
  }
  return { developments: [...map.values()], errors }
}

// ---------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------
export async function saveTestimonial(t: Partial<Testimonial> & { name: string; quote: string }) {
  if (t.id) {
    const { error } = await supabase.from('testimonials').update(t).eq('id', t.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('testimonials').insert(t)
    if (error) throw error
  }
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------
// Blog / Insights
// ---------------------------------------------------------------------
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ?? null
}

async function ensureUniqueBlogSlug(base: string, ignoreId?: string): Promise<string> {
  const root = base || `post-${Date.now().toString(36)}`
  let candidate = root
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase.from('blog_posts').select('id').eq('slug', candidate).maybeSingle()
    if (!data || data.id === ignoreId) return candidate
    candidate = `${root}-${i}`
  }
  return `${root}-${Date.now().toString(36).slice(-4)}`
}

export async function saveBlogPost(post: Partial<BlogPost> & { title: string }) {
  const slug = await ensureUniqueBlogSlug(post.slug || slugify(post.title), post.id)
  if (post.id) {
    const { error } = await supabase.from('blog_posts').update({ ...post, slug }).eq('id', post.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('blog_posts').insert({ ...post, slug })
    if (error) throw error
  }
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------
// Partners / accreditations
// ---------------------------------------------------------------------
export async function savePartner(p: Partial<Partner> & { name: string }) {
  if (p.id) {
    const { error } = await supabase.from('partners').update(p).eq('id', p.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('partners').insert(p)
    if (error) throw error
  }
}

export async function deletePartner(id: string) {
  const { error } = await supabase.from('partners').delete().eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------
export async function saveFaq(f: Partial<Faq> & { question: string; answer: string }) {
  if (f.id) {
    const { error } = await supabase.from('faqs').update(f).eq('id', f.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('faqs').insert(f)
    if (error) throw error
  }
}

export async function deleteFaq(id: string) {
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------
// Feature cards (home values / investment pillars / about principles)
// ---------------------------------------------------------------------
export async function saveFeatureCard(f: Partial<FeatureCard> & { section: string; title: string }) {
  if (f.id) {
    const { error } = await supabase.from('feature_cards').update(f).eq('id', f.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('feature_cards').insert(f)
    if (error) throw error
  }
}

export async function deleteFeatureCard(id: string) {
  const { error } = await supabase.from('feature_cards').delete().eq('id', id)
  if (error) throw error
}

export interface ImportResult {
  developments: number
  units: number
  errors: string[]
}

export async function importDevelopments(parsed: ParsedDevelopment[]): Promise<ImportResult> {
  const result: ImportResult = { developments: 0, units: 0, errors: [] }
  for (const dev of parsed) {
    try {
      await createProjectWithUnits(dev.fields, dev.units)
      result.developments += 1
      result.units += dev.units.length
    } catch (e) {
      result.errors.push(`${dev.name}: ${(e as Error).message}`)
    }
  }
  return result
}
