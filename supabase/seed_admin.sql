-- =====================================================================
-- Optional: provision an initial admin user from scratch.
--
-- Easiest path: create the user in the Supabase dashboard
-- (Authentication → Users → Add user, email + password, auto-confirm),
-- then run only the final UPDATE below to promote them to admin.
--
-- The block below creates the auth user directly via SQL for a fully
-- automated, "ready to go" setup. Change the email/password first.
-- =====================================================================
do $$
declare
  uid uuid;
begin
  if exists (select 1 from auth.users where email = 'admin@ahsproperties.com') then
    select id into uid from auth.users where email = 'admin@ahsproperties.com';
  else
    uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'admin@ahsproperties.com',
      -- Choose a strong password here before running this script.
      extensions.crypt('CHANGE_ME_to_a_strong_password', extensions.gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}',
      '{"full_name":"AHS Administrator"}', now(), now(), '', '', '', ''
    );
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid, uid::text,
      jsonb_build_object('sub', uid::text, 'email', 'admin@ahsproperties.com', 'email_verified', true),
      'email', now(), now(), now()
    );
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (uid, 'admin@ahsproperties.com', 'AHS Administrator', 'admin')
  on conflict (id) do update set role = 'admin';
end $$;

-- Promote an existing user to admin (use after dashboard signup):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
