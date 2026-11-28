-- AZ Digital Solutions website database setup
-- Run this entire file in Supabase Dashboard > SQL Editor.
-- Public reviews are instantly visible after insertion; no approval queue is used.
create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 70),
  city text not null check (char_length(trim(city)) between 2 and 80),
  service text not null check (char_length(trim(service)) between 2 and 100),
  rating int not null check (rating between 1 and 5),
  review text not null check (char_length(trim(review)) between 10 and 1200),
  photo_url text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reviews_visible_created_idx
  on public.reviews (is_visible, created_at desc);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 80),
  phone text not null check (char_length(trim(phone)) between 6 and 20),
  email text,
  service text not null check (char_length(trim(service)) between 2 and 100),
  message text not null check (char_length(trim(message)) between 3 and 1500),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists "Public can read visible reviews" on public.reviews;
create policy "Public can read visible reviews"
  on public.reviews for select to anon, authenticated
  using (is_visible = true);

drop policy if exists "Public can submit reviews" on public.reviews;
create policy "Public can submit reviews"
  on public.reviews for insert to anon, authenticated
  with check (
    is_visible = true
    and rating between 1 and 5
    and char_length(trim(name)) between 2 and 70
    and char_length(trim(city)) between 2 and 80
    and char_length(trim(review)) between 10 and 1200
  );

drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (
    char_length(trim(name)) between 2 and 80
    and char_length(trim(phone)) between 6 and 20
    and char_length(trim(message)) between 3 and 1500
  );

-- No public UPDATE or DELETE policies are created.
-- Create a Storage bucket named review-photos in Dashboard > Storage:
-- Public bucket: ON; file size limit: 2 MB; allowed MIME types:
-- image/jpeg, image/png, image/webp.
-- Then run the storage policies below.

drop policy if exists "Public can upload review photos" on storage.objects;
create policy "Public can upload review photos"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'review-photos'
    and lower(storage.extension(name)) in ('jpg','jpeg','png','webp')
  );

drop policy if exists "Public can view review photos" on storage.objects;
create policy "Public can view review photos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'review-photos');

-- Important security note:
-- This starter policy enables instant public submissions. Add CAPTCHA verification
-- and server-side rate limiting (e.g. Supabase Edge Function + Turnstile) before
-- promoting the form widely. Browser-only cooldowns are not a security boundary.
