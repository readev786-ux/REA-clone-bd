// Domain + Supabase types for AHS Properties.
// Hand-maintained to match supabase/migrations.

export type ProjectCategory =
  | 'residential'
  | 'commercial'
  | 'township'
  | 'investment'
export type ProjectStatus = 'ongoing' | 'completed' | 'upcoming'
export type UnitStatus = 'Available' | 'Reserved' | 'Sold'
export type UnitType =
  | 'Villa'
  | 'Apartment'
  | 'Penthouse'
  | 'Duplex'
  | 'Plot'
  | 'Commercial'

export interface Project {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  category: ProjectCategory
  location: string
  address: string | null
  district: string | null
  completion: string | null
  scheme: string | null
  co_broker: string | null
  hero_image: string | null
  gallery: string[]
  amenities: string[]
  starting_price_bdt: number | null
  lat: number | null
  lng: number | null
  featured: boolean
  status: ProjectStatus
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  project_id: string
  name: string
  unit_type: UnitType
  beds: number | null
  baths: number | null
  size_sqm: number | null
  price_bdt: number | null
  status: UnitStatus
  floorplan_image: string | null
  description: string | null
  sort_order: number
  created_at: string
}

export interface ProjectWithUnits extends Project {
  units: Unit[]
}

export interface Inquiry {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string | null
  property_interest: string | null
  project_id: string | null
  source: 'contact' | 'property' | 'whatsapp' | 'newsletter'
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}

export interface Appointment {
  id: string
  name: string
  email: string | null
  phone: string | null
  preferred_date: string | null
  preferred_time: string | null
  project_id: string | null
  message: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  body: string | null
  cover_image: string | null
  author: string | null
  category: string | null
  read_minutes: number
  published: boolean
  published_at: string
  created_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url: string | null
  category: 'government' | 'accreditation' | 'client'
  sort_order: number
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  quote: string
  avatar_url: string | null
  rating: number
  sort_order: number
}

export interface Faq {
  id: string
  question: string
  answer: string
  category: string | null
  sort_order: number
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: 'admin' | 'staff' | 'viewer'
  created_at: string
}

// Minimal Database shape so the typed supabase client knows row types.
type Row<T> = T
export interface Database {
  public: {
    Tables: {
      projects: { Row: Row<Project>; Insert: Partial<Project>; Update: Partial<Project> }
      units: { Row: Row<Unit>; Insert: Partial<Unit>; Update: Partial<Unit> }
      inquiries: { Row: Row<Inquiry>; Insert: Partial<Inquiry>; Update: Partial<Inquiry> }
      appointments: { Row: Row<Appointment>; Insert: Partial<Appointment>; Update: Partial<Appointment> }
      blog_posts: { Row: Row<BlogPost>; Insert: Partial<BlogPost>; Update: Partial<BlogPost> }
      partners: { Row: Row<Partner>; Insert: Partial<Partner>; Update: Partial<Partner> }
      testimonials: { Row: Row<Testimonial>; Insert: Partial<Testimonial>; Update: Partial<Testimonial> }
      faqs: { Row: Row<Faq>; Insert: Partial<Faq>; Update: Partial<Faq> }
      profiles: { Row: Row<Profile>; Insert: Partial<Profile>; Update: Partial<Profile> }
    }
    Views: Record<string, never>
    Functions: { is_staff: { Args: Record<string, never>; Returns: boolean } }
    Enums: Record<string, never>
  }
}
