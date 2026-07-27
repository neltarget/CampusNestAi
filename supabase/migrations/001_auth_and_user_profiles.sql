-- CampusNest AI: Auth & User Profiles Migration
-- Run this in your Supabase SQL Editor

-- =========================================================================
-- 1. PROFILES TABLE
-- =========================================================================
-- Linked to auth.users via foreign key.
-- Stores application-specific user data without duplicating auth info.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role text not null default 'student' check (role in ('student', 'landlord')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  );
  return new;
end;
$$;

-- Trigger: fire after a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

-- =========================================================================
-- 2. SEARCH HISTORY TABLE
-- =========================================================================

create table public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  search_query text not null,
  structured_search jsonb,
  recommendations jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.search_history enable row level security;

-- Policies: users can only access their own search history
create policy "Users can view own search history"
  on public.search_history for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own search history"
  on public.search_history for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own search history"
  on public.search_history for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Index for fast lookups
create index search_history_user_id_idx on public.search_history (user_id, created_at desc);

-- =========================================================================
-- 3. GRANT ACCESS (Data API)
-- =========================================================================
-- Ensure the tables are accessible via the REST API

grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, delete on public.search_history to anon, authenticated;
