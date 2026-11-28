-- AZ Digital Solutions: secure admin access for reviews and enquiries
-- Run this AFTER the existing root setup.sql in Supabase SQL Editor.
-- 1) Create an admin account in Supabase Dashboard > Authentication > Users.
-- 2) Copy that user's UUID.
-- 3) Replace THE_ADMIN_AUTH_USER_UUID below and run the INSERT statement separately.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_az_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_az_admin() from public;
grant execute on function public.is_az_admin() to authenticated;

drop policy if exists "Admins can read own admin record" on public.admin_users;
create policy "Admins can read own admin record"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "AZ admins can read all reviews" on public.reviews;
create policy "AZ admins can read all reviews"
  on public.reviews for select to authenticated
  using (public.is_az_admin());

drop policy if exists "AZ admins can update reviews" on public.reviews;
create policy "AZ admins can update reviews"
  on public.reviews for update to authenticated
  using (public.is_az_admin())
  with check (public.is_az_admin());

drop policy if exists "AZ admins can delete reviews" on public.reviews;
create policy "AZ admins can delete reviews"
  on public.reviews for delete to authenticated
  using (public.is_az_admin());

drop policy if exists "AZ admins can read enquiries" on public.enquiries;
create policy "AZ admins can read enquiries"
  on public.enquiries for select to authenticated
  using (public.is_az_admin());

grant select on public.admin_users to authenticated;
grant select, update, delete on public.reviews to authenticated;
grant select on public.enquiries to authenticated;

-- Add the first administrator after creating the Auth user:
-- INSERT INTO public.admin_users (user_id)
-- VALUES ('THE_ADMIN_AUTH_USER_UUID');
