-- =====================================================================
-- Editable page content (text + images) keyed by a stable string.
-- The frontend reads these with code-side fallbacks; admins edit them
-- in the panel under "Site Content".
-- =====================================================================
create table if not exists public.site_content (
  key         text primary key,
  value       text not null default '',
  type        text not null default 'text' check (type in ('text','textarea','image','number')),
  group_name  text not null default 'General',
  label       text not null default '',
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.site_content enable row level security;
drop policy if exists "site_content public read" on public.site_content;
drop policy if exists "site_content staff write" on public.site_content;
create policy "site_content public read" on public.site_content for select using (true);
create policy "site_content staff write" on public.site_content for all using (public.is_staff()) with check (public.is_staff());

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

insert into public.site_content (key, value, type, group_name, label, sort_order) values
('home.hero.badge','Bangladesh Luxury Real Estate','text','Home · Hero','Badge text',1),
('home.hero.title_lead','A Legacy of','text','Home · Hero','Title — lead',2),
('home.hero.title_accent','Trust','text','Home · Hero','Title — gold word',3),
('home.hero.title_tail','& Vision','text','Home · Hero','Title — tail',4),
('home.hero.subtitle','Exclusive estates, master-planned townships and high-yield investment portfolios across Jolshiri Abashon and Dhaka — delivered with elite discipline, integrity and escrow-backed assurance.','textarea','Home · Hero','Subtitle',5),
('home.hero.image','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80','image','Home · Hero','Background image',6),
('home.hero.stat1_value','18+','text','Home · Hero','Stat 1 value',7),
('home.hero.stat1_label','Signature units released','text','Home · Hero','Stat 1 label',8),
('home.hero.stat2_value','8','text','Home · Hero','Stat 2 value',9),
('home.hero.stat2_label','Flagship developments','text','Home · Hero','Stat 2 label',10),
('home.hero.stat3_value','100%','text','Home · Hero','Stat 3 value',11),
('home.hero.stat3_label','RAJUK & Cantonment approved','text','Home · Hero','Stat 3 label',12),
('founder.kicker','A Legacy of Trust and Vision','text','Founder','Kicker',1),
('founder.heading','Visionary leadership, elite discipline','text','Founder','Heading',2),
('founder.body','AHS Properties & Development Ltd. is built on a legacy of elite discipline, integrity and visionary leadership. We merge innovative architecture with utility to deliver premium residential and commercial spaces across Bangladesh.','textarea','Founder','Bio',3),
('founder.name','DIG Md. Abu Kalam Siddique','text','Founder','Name',4),
('founder.role','Founder & Principal Broker','text','Founder','Role',5),
('founder.image','https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1100&q=80','image','Founder','Portrait',6),
('home.cta.title','Let us help you discover your next key investment in Bangladesh','text','Home · CTA','Title',1),
('home.cta.subtitle','Direct access to dedicated consultants with local and legal insights. Reserve a private consultation or request a live tour today.','textarea','Home · CTA','Subtitle',2),
('about.story.kicker','Our Story','text','About · Story','Kicker',1),
('about.story.heading','Innovative architecture, merging art with utility','text','About · Story','Heading',2),
('about.story.body1','Founded on a legacy of elite discipline and integrity, AHS Properties & Development Ltd. has become a trusted name in Bangladesh luxury real estate. Our dedicated consultants bring unparalleled market insight, local knowledge and legal clarity to every transaction.','textarea','About · Story','Paragraph 1',3),
('about.story.body2','From the green corridors of Jolshiri Abashon to elevated penthouses inside Dhaka Cantonment, we build on approved standards and deliver with uncompromising material quality and delivery assurance.','textarea','About · Story','Paragraph 2',4),
('about.story.image1','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80','image','About · Story','Image 1',5),
('about.story.image2','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80','image','About · Story','Image 2',6),
('about.stat1_value','8','text','About · Stats','Stat 1 value',1),
('about.stat1_label','Flagship developments','text','About · Stats','Stat 1 label',2),
('about.stat2_value','18+','text','About · Stats','Stat 2 value',3),
('about.stat2_label','Signature units','text','About · Stats','Stat 2 label',4),
('about.stat3_value','11+','text','About · Stats','Stat 3 value',5),
('about.stat3_label','Government partners','text','About · Stats','Stat 3 label',6),
('about.stat4_value','100%','text','About · Stats','Stat 4 value',7),
('about.stat4_label','Approved standards','text','About · Stats','Stat 4 label',8),
('about.leadership.heading','A founder defined by service & vision','text','About · Leadership','Heading',1),
('about.leadership.body','Our founder brings a lifetime of disciplined public service and an unwavering commitment to integrity, translating that ethos into how we build, sell and steward property.','textarea','About · Leadership','Body',2),
('contact.address1','Rajnigandha Tower Area, Dhaka Cantonment','text','Contact','Address line 1',1),
('contact.address2','VIP Road, Nayapaltan, Dhaka','text','Contact','Address line 2',2),
('contact.hours1','Sat – Thu · 10:00 AM – 7:00 PM','text','Contact','Hours line 1',3),
('contact.hours2','Friday by appointment','text','Contact','Hours line 2',4)
on conflict (key) do nothing;
