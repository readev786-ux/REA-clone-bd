-- =====================================================================
-- Public `media` storage bucket for admin-uploaded development photos.
-- Public read; staff-only write (mirrors public.is_staff()).
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media staff insert" on storage.objects;
drop policy if exists "media staff update" on storage.objects;
drop policy if exists "media staff delete" on storage.objects;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media staff insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());
create policy "media staff update" on storage.objects
  for update using (bucket_id = 'media' and public.is_staff());
create policy "media staff delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_staff());
