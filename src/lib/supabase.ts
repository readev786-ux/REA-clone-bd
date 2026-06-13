import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey) {
  // Fail loudly in dev so misconfiguration is obvious.
  // eslint-disable-next-line no-console
  console.error(
    'Missing Supabase env vars. Copy .env.example to .env and set ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '8801625555700'
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string) ||
  'ahsproperiesdevelopmentltd@gmail.com'
