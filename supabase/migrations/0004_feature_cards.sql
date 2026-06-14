-- =====================================================================
-- Editable icon+text "feature cards" for the homepage Why-AHS section,
-- the Investments pillars and the About principles.
-- =====================================================================
create table if not exists public.feature_cards (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('home_values','investment_pillars','about_principles')),
  icon        text not null default 'Sparkles',
  title       text not null,
  body        text not null default '',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_feature_cards_section on public.feature_cards(section);

alter table public.feature_cards enable row level security;
drop policy if exists "feature_cards public read" on public.feature_cards;
drop policy if exists "feature_cards staff write" on public.feature_cards;
create policy "feature_cards public read" on public.feature_cards for select using (true);
create policy "feature_cards staff write" on public.feature_cards for all using (public.is_staff()) with check (public.is_staff());

insert into public.feature_cards (section, icon, title, body, sort_order) values
('home_values','ShieldCheck','Built on Integrity & Escrow','Every transaction is escrow-backed and released against verified construction and title milestones.',1),
('home_values','Landmark','RAJUK & Cantonment Approved','Fully cleared land mutation titles and national building-safety compliance on every development.',2),
('home_values','TrendingUp','High-Yield Optimization','Dedicated consultants with unparalleled market insight engineer durable, appreciating returns.',3),
('home_values','Gem','Uncompromising Quality','European cabinetry, silent VRF cooling and premium materials with delivery assurance.',4),
('home_values','HandCoins','Off-Market Advisory','Private placement consultation and priority option letters for high-net-worth capital pools.',5),
('home_values','HardHat','Approved Standards','Guaranteed compliance with national building safety acts and accredited engineering oversight.',6),
('investment_pillars','TrendingUp','High-Yield Optimization','Portfolios structured for durable appreciation across Jolshiri and Dhaka growth corridors.',1),
('investment_pillars','FileText','Priority Option Letters','Secure first-right allocations on upcoming releases through private placement consultation.',2),
('investment_pillars','ShieldCheck','Escrow-Backed Capital','Funds released only against verified title and construction milestones — built on integrity.',3),
('investment_pillars','Globe2','NRB & Residency Support','Permanent residency pathways and remote reservation for overseas Bangladeshi investors.',4),
('about_principles','ShieldCheck','Integrity & Escrow','We register a formal escrow trail on every reservation, protecting buyers at each milestone.',1),
('about_principles','Building2','Approved Standards','RAJUK and Cantonment approvals with fully cleared land mutation titles before release.',2),
('about_principles','HeartHandshake','Social Impact','A commitment to philanthropy and community uplift woven through our development ethos.',3)
on conflict do nothing;
