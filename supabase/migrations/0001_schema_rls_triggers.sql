-- =====================================================================
-- AHS Properties & Development Ltd. — schema, RLS, triggers
-- Apply with the Supabase CLI (`supabase db push`) or paste into the
-- SQL editor of a fresh project.
-- =====================================================================

-- ---------- Tables ----------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'viewer' check (role in ('admin','staff','viewer')),
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  tagline             text,
  description         text,
  category            text not null default 'residential'
                      check (category in ('residential','commercial','township','investment')),
  location            text not null default 'Dhaka',
  address             text,
  district            text,
  completion          text,
  scheme              text,
  co_broker           text,
  hero_image          text,
  gallery             text[] not null default '{}',
  amenities           text[] not null default '{}',
  starting_price_bdt  bigint,
  lat                 double precision,
  lng                 double precision,
  featured            boolean not null default false,
  status              text not null default 'ongoing'
                      check (status in ('ongoing','completed','upcoming')),
  sort_order          int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.units (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects(id) on delete cascade,
  name            text not null,
  unit_type       text not null default 'Apartment'
                  check (unit_type in ('Villa','Apartment','Penthouse','Duplex','Plot','Commercial')),
  beds            int,
  baths           int,
  size_sqm        numeric,
  price_bdt       bigint,
  status          text not null default 'Available'
                  check (status in ('Available','Reserved','Sold')),
  floorplan_image text,
  description     text,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create table if not exists public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text,
  phone             text,
  message           text,
  property_interest text,
  project_id        uuid references public.projects(id) on delete set null,
  source            text not null default 'contact'
                    check (source in ('contact','property','whatsapp','newsletter')),
  status            text not null default 'new'
                    check (status in ('new','contacted','closed')),
  created_at        timestamptz not null default now()
);

create table if not exists public.appointments (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text,
  phone           text,
  preferred_date  date,
  preferred_time  text,
  project_id      uuid references public.projects(id) on delete set null,
  message         text,
  status          text not null default 'pending'
                  check (status in ('pending','confirmed','cancelled')),
  created_at      timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  body          text,
  cover_image   text,
  author        text default 'AHS Editorial Desk',
  category      text default 'Insights',
  read_minutes  int not null default 5,
  published     boolean not null default true,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create table if not exists public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  category    text not null default 'government'
              check (category in ('government','accreditation','client')),
  sort_order  int not null default 0
);

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  quote       text not null,
  avatar_url  text,
  rating      int not null default 5,
  sort_order  int not null default 0
);

create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  category    text default 'General',
  sort_order  int not null default 0
);

create index if not exists idx_units_project on public.units(project_id);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_inquiries_status on public.inquiries(status);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_blog_published on public.blog_posts(published);

-- ---------- Helper + triggers ----------------------------------------
create or replace function public.is_staff()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','staff')
  );
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Row Level Security ---------------------------------------
alter table public.profiles      enable row level security;
alter table public.projects      enable row level security;
alter table public.units         enable row level security;
alter table public.inquiries     enable row level security;
alter table public.appointments  enable row level security;
alter table public.blog_posts    enable row level security;
alter table public.partners      enable row level security;
alter table public.testimonials  enable row level security;
alter table public.faqs          enable row level security;

create policy "profiles read own"   on public.profiles for select using (auth.uid() = id or public.is_staff());
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

create policy "projects public read" on public.projects for select using (true);
create policy "projects staff write" on public.projects for all using (public.is_staff()) with check (public.is_staff());

create policy "units public read"    on public.units for select using (true);
create policy "units staff write"    on public.units for all using (public.is_staff()) with check (public.is_staff());

create policy "blog public read"     on public.blog_posts for select using (published or public.is_staff());
create policy "blog staff write"     on public.blog_posts for all using (public.is_staff()) with check (public.is_staff());

create policy "partners public read" on public.partners for select using (true);
create policy "partners staff write" on public.partners for all using (public.is_staff()) with check (public.is_staff());

create policy "testimonials public read" on public.testimonials for select using (true);
create policy "testimonials staff write" on public.testimonials for all using (public.is_staff()) with check (public.is_staff());

create policy "faqs public read"     on public.faqs for select using (true);
create policy "faqs staff write"     on public.faqs for all using (public.is_staff()) with check (public.is_staff());

-- Leads: anyone may submit (validated), only staff may read / manage.
create policy "inquiries public insert" on public.inquiries for insert with check (
  char_length(name) between 1 and 120
  and (email is null or char_length(email) <= 160)
  and (phone is null or char_length(phone) <= 40)
  and (message is null or char_length(message) <= 4000)
);
create policy "inquiries staff read"   on public.inquiries for select using (public.is_staff());
create policy "inquiries staff update" on public.inquiries for update using (public.is_staff());
create policy "inquiries staff delete" on public.inquiries for delete using (public.is_staff());

create policy "appointments public insert" on public.appointments for insert with check (
  char_length(name) between 1 and 120
  and (email is null or char_length(email) <= 160)
  and (phone is null or char_length(phone) <= 40)
  and (message is null or char_length(message) <= 4000)
);
create policy "appointments staff read"   on public.appointments for select using (public.is_staff());
create policy "appointments staff update" on public.appointments for update using (public.is_staff());
create policy "appointments staff delete" on public.appointments for delete using (public.is_staff());
