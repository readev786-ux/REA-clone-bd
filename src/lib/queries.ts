import { supabase } from './supabase'
import type {
  Appointment,
  BlogPost,
  Faq,
  Inquiry,
  Partner,
  FeatureCard,
  Project,
  ProjectWithUnits,
  SiteContent,
  Testimonial,
  Unit,
} from './types'

export interface ProjectFilters {
  search?: string
  category?: string
  status?: string
  minPrice?: number
  maxPrice?: number
}

export async function fetchProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  let q = supabase.from('projects').select('*').order('sort_order', { ascending: true })

  if (filters.category && filters.category !== 'all') q = q.eq('category', filters.category)
  if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
  if (filters.search) {
    const s = `%${filters.search}%`
    q = q.or(`name.ilike.${s},location.ilike.${s},tagline.ilike.${s},scheme.ilike.${s}`)
  }
  if (filters.minPrice) q = q.gte('starting_price_bdt', filters.minPrice)
  if (filters.maxPrice) q = q.lte('starting_price_bdt', filters.maxPrice)

  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectWithUnits | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, units(*)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const project = data as unknown as ProjectWithUnits
  project.units = (project.units ?? []).sort((a, b) => a.sort_order - b.sort_order)
  return project
}

export async function fetchAllUnits(): Promise<(Unit & { project: Project })[]> {
  const { data, error } = await supabase
    .from('units')
    .select('*, project:projects(*)')
    .order('price_bdt', { ascending: true })
  if (error) throw error
  return (data ?? []) as unknown as (Unit & { project: Project })[]
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ?? null
}

export async function fetchPartners(): Promise<Partner[]> {
  const { data, error } = await supabase.from('partners').select('*').order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase.from('faqs').select('*').order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchSiteContent(): Promise<SiteContent[]> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('group_name')
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function updateSiteContentValues(rows: { key: string; value: string }[]) {
  for (const r of rows) {
    const { error } = await supabase.from('site_content').update({ value: r.value }).eq('key', r.key)
    if (error) throw error
  }
}

export async function fetchFeatureCards(): Promise<FeatureCard[]> {
  const { data, error } = await supabase
    .from('feature_cards')
    .select('*')
    .order('section')
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

// ---- Lead capture (public insert) ------------------------------------
export interface InquiryInput {
  name: string
  email?: string
  phone?: string
  message?: string
  property_interest?: string
  project_id?: string | null
  source?: Inquiry['source']
}

export async function submitInquiry(input: InquiryInput): Promise<void> {
  const { error } = await supabase.from('inquiries').insert({
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    message: input.message || null,
    property_interest: input.property_interest || null,
    project_id: input.project_id || null,
    source: input.source || 'contact',
  })
  if (error) throw error
}

export interface AppointmentInput {
  name: string
  email?: string
  phone?: string
  preferred_date?: string
  preferred_time?: string
  project_id?: string | null
  message?: string
}

export async function submitAppointment(input: AppointmentInput): Promise<void> {
  const { error } = await supabase.from('appointments').insert({
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    preferred_date: input.preferred_date || null,
    preferred_time: input.preferred_time || null,
    project_id: input.project_id || null,
    message: input.message || null,
  })
  if (error) throw error
}

// ---- Admin reads / writes (RLS-gated to staff) -----------------------
export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']) {
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
  if (error) throw error
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  if (error) throw error
}

export async function upsertProject(project: Partial<Project>) {
  const { error } = await supabase.from('projects').upsert(project)
  if (error) throw error
}

export async function updateProject(id: string, patch: Partial<Project>) {
  const { error } = await supabase.from('projects').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
