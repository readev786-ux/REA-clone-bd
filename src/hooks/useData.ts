import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchAllUnits,
  fetchAppointments,
  fetchBlogPost,
  fetchBlogPosts,
  fetchFaqs,
  fetchFeaturedProjects,
  fetchInquiries,
  fetchPartners,
  fetchProjectBySlug,
  fetchProjects,
  fetchSiteContent,
  fetchTestimonials,
  type ProjectFilters,
} from '../lib/queries'

export const useProjects = (filters: ProjectFilters = {}) =>
  useQuery({ queryKey: ['projects', filters], queryFn: () => fetchProjects(filters) })

export const useFeaturedProjects = () =>
  useQuery({ queryKey: ['projects', 'featured'], queryFn: fetchFeaturedProjects })

export const useProject = (slug: string | undefined) =>
  useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProjectBySlug(slug!),
    enabled: !!slug,
  })

export const useAllUnits = () =>
  useQuery({ queryKey: ['units', 'all'], queryFn: fetchAllUnits })

export const useBlogPosts = () =>
  useQuery({ queryKey: ['blog'], queryFn: fetchBlogPosts })

export const useBlogPost = (slug: string | undefined) =>
  useQuery({ queryKey: ['blog', slug], queryFn: () => fetchBlogPost(slug!), enabled: !!slug })

export const usePartners = () =>
  useQuery({ queryKey: ['partners'], queryFn: fetchPartners })

export const useTestimonials = () =>
  useQuery({ queryKey: ['testimonials'], queryFn: fetchTestimonials })

export const useFaqs = () => useQuery({ queryKey: ['faqs'], queryFn: fetchFaqs })

export const useSiteContent = () =>
  useQuery({ queryKey: ['site_content'], queryFn: fetchSiteContent, staleTime: 300_000 })

/** Returns a getter `c(key, fallback)` for editable page content. */
export function useContent() {
  const { data } = useSiteContent()
  const map = useMemo(() => {
    const m: Record<string, string> = {}
    ;(data ?? []).forEach((r) => {
      m[r.key] = r.value
    })
    return m
  }, [data])
  return (key: string, fallback = ''): string => {
    const v = map[key]
    return v !== undefined && v !== '' ? v : fallback
  }
}

// Admin
import { fetchAllBlogPosts } from '../lib/admin'

export const useAllBlogPosts = (enabled = true) =>
  useQuery({ queryKey: ['blog', 'all'], queryFn: fetchAllBlogPosts, enabled })

export const useInquiries = (enabled: boolean) =>
  useQuery({ queryKey: ['inquiries'], queryFn: fetchInquiries, enabled })

export const useAppointments = (enabled: boolean) =>
  useQuery({ queryKey: ['appointments'], queryFn: fetchAppointments, enabled })
