# AHS Properties & Development Ltd. — Luxury Real Estate Platform

A full rebuild and UI/UX + functionality overhaul of the AHS Properties marketing
site, re-architected as a **production-ready full-stack application** with a
**Supabase** backend (Postgres + Auth + Row Level Security) and a modern
**React + Vite + TypeScript + Tailwind v4** frontend.

> Brand: AHS Properties & Development Ltd. — accredited luxury residential,
> commercial and township developments across Jolshiri Abashon and Dhaka,
> Bangladesh.

---

## ✨ What's inside

### Public site
- **Cinematic hero** with live property search (keyword + category) that routes
  into the developments catalog.
- **Developments catalog** with real-time search, category chips, stage filter,
  price sorting and graceful empty states — all backed by the database.
- **Development detail** pages: image gallery, overview, key facts, amenities,
  an availability **units table** (beds / area / price / status), an
  **OpenStreetMap** location embed and a sticky inquiry form.
- **Investments & Townships** hub with investment pillars and curated projects.
- **About** — founder spotlight, company legacy, principles and a live
  **Government & Regulatory Partners** accreditation grid.
- **Insights** blog (list + article) sourced from the database.
- **Contact** — contact cards, office map, a message form **and** an Estate Desk
  **appointment booking** calendar.
- **FAQ** accordion, animated **WhatsApp** float button, full responsive design,
  glassmorphism navbar, scroll reveals and SEO meta tags.

### Admin CMS (`/admin`, auth-gated)
- Supabase email/password login (staff-only via RLS).
- Dashboard with live KPIs and recent leads.
- Manage **inquiries** and **appointments** (status workflow).
- Manage **developments** (feature toggle, delete, quick view).

### Backend (Supabase)
- 9 tables: `projects`, `units`, `inquiries`, `appointments`, `blog_posts`,
  `partners`, `testimonials`, `faqs`, `profiles`.
- **Row Level Security** everywhere: public read for content, validated public
  insert for leads, staff-only reads/writes for management.
- `is_staff()` helper, `updated_at` trigger, `handle_new_user` profile trigger,
  and security-hardened functions.
- Seed data for 8 developments / 18 units / 12 partners / 6 FAQs / 4 articles.

---

## 🧱 Tech stack

| Layer        | Choice                                                        |
|--------------|---------------------------------------------------------------|
| Frontend     | React 18, Vite 5, TypeScript, React Router 6                  |
| Styling      | Tailwind CSS v4 (`@tailwindcss/vite`), Inter / Fraunces / JetBrains Mono |
| Data         | TanStack Query (React Query)                                   |
| Backend      | Supabase (Postgres, Auth, RLS)                                |
| Icons        | lucide-react                                                  |

---

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (defaults already point at a live Supabase project)
cp .env.example .env

# 3. Run the dev server
npm run dev          # http://localhost:5173

# 4. Production build
npm run build && npm run preview
```

The `.env.example` ships with a working Supabase URL and **publishable** key.
The publishable key is safe to expose in the browser — every table is protected
by Row Level Security.

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
VITE_WHATSAPP_NUMBER=8801625555700
VITE_CONTACT_EMAIL=ahsproperiesdevelopmentltd@gmail.com
```

### Admin access

| Field    | Value                                       |
|----------|---------------------------------------------|
| URL      | `/admin`                                    |
| Email    | `admin@ahsproperties.com`                   |
| Password | Set during setup — **not** stored in this repo |

> The live demo's admin password is shared out-of-band (never committed). When
> you provision your own backend, choose a strong password in
> `supabase/seed_admin.sql` before running it.

---

## 🛠 Provision Supabase from scratch

To stand up your **own** backend (instead of the bundled one):

1. Create a new project at [supabase.com](https://supabase.com).
2. In the SQL editor, run, in order:
   - `supabase/migrations/0001_schema_rls_triggers.sql`
   - `supabase/seed.sql`
   - `supabase/seed_admin.sql` (creates `admin@ahsproperties.com`; set your own strong password in the file first)
3. Copy your project URL and **publishable key** (Project Settings → API) into `.env`.

Or with the Supabase CLI:

```bash
supabase link --project-ref <ref>
supabase db push          # applies migrations
psql "$DATABASE_URL" -f supabase/seed.sql
```

---

## 📁 Project structure

```
.
├── index.html
├── src/
│   ├── lib/            # supabase client, types, queries, formatters
│   ├── hooks/          # useAuth (context), useData (React Query)
│   ├── components/
│   │   ├── layout/     # Navbar, Footer, PageHeader, Layout
│   │   ├── ui/         # Primitives, Logo, Reveal
│   │   ├── home/       # Hero
│   │   ├── PropertyCard, Forms, PartnersMarquee, WhatsAppButton
│   ├── pages/          # Home, Developments(+detail), Investments, About,
│   │   │               # Insights(+detail), Contact, Faq, NotFound
│   │   └── admin/      # Login, AdminLayout, Dashboard, Inquiries,
│   │                   # Appointments, Projects
│   ├── App.tsx         # routes + providers
│   └── index.css       # Tailwind v4 theme (brand tokens, glass, animations)
└── supabase/
    ├── migrations/0001_schema_rls_triggers.sql
    ├── seed.sql
    └── seed_admin.sql
```

---

## 🎨 Design language

A warm, editorial luxury system — **deep navy (#1e2a4a)**, **heritage gold
(#dfad42)** and **terracotta (#b84822)** on an off-white canvas, with
frosted-glass surfaces (the "Allys" backdrop-blur navbar), Fraunces display
serifs and subtle scroll-reveal motion.

---

## 📦 Deployment

Any static host works (Vercel, Netlify, Cloudflare Pages, Render). Build command
`npm run build`, output `dist/`. Set the `VITE_*` environment variables in your
host's dashboard. Because the SPA uses client-side routing, add a catch-all
rewrite to `/index.html`.
