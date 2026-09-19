-- ============================================================
-- EtsyAI security fixes
-- Run this once in Supabase Dashboard -> SQL Editor -> New query
-- Safe to re-run if needed - it cleans up before recreating rules.
-- ============================================================

-- 1. See what policies currently exist (just for your own reference).
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('user_profiles', 'listings', 'keyword_searches');


-- 2. Remove every existing policy on these 3 tables, whatever they
--    are currently named, so we start from a clean, known state.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('user_profiles', 'listings', 'keyword_searches')
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;


-- 3. Make sure row level security is switched on for all 3 tables.
alter table public.user_profiles enable row level security;
alter table public.listings enable row level security;
alter table public.keyword_searches enable row level security;


-- 4. user_profiles: a user can only ever see or create their own row.
--    There is deliberately NO update policy here - plan and credits
--    can only be changed by the server (using the service role key),
--    never directly from the browser. This is what stops someone
--    opening dev tools and giving themselves a paid plan for free.
create policy "select_own_profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "insert_own_profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);


-- 5. Whatever plan/credits value a signup request tries to insert,
--    force it back to the real free-tier defaults. This closes the
--    hole where someone could sign up with plan: "pro" directly.
create or replace function public.enforce_default_profile()
returns trigger as $$
begin
  new.plan := 'free';
  new.credits := 5;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_enforce_default_profile on public.user_profiles;

create trigger trg_enforce_default_profile
  before insert on public.user_profiles
  for each row execute function public.enforce_default_profile();


-- 6. listings: a user can only read, create, edit or delete their own
--    listings. This is what stops anyone viewing or editing someone
--    else's saved listing by guessing its id.
create policy "select_own_listings"
  on public.listings for select
  using (auth.uid() = user_id);

create policy "insert_own_listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "update_own_listings"
  on public.listings for update
  using (auth.uid() = user_id);

create policy "delete_own_listings"
  on public.listings for delete
  using (auth.uid() = user_id);


-- 7. keyword_searches: same rule - only the owner can see or add rows.
create policy "select_own_keywords"
  on public.keyword_searches for select
  using (auth.uid() = user_id);

create policy "insert_own_keywords"
  on public.keyword_searches for insert
  with check (auth.uid() = user_id);


-- ============================================================
-- Optional cleanup (read before running - this permanently
-- deletes rows):
-- Some old test listings may have been created without being
-- logged in, so they have a blank user_id. Those rows are now
-- invisible to everyone (safe, but also useless clutter).
-- To remove them:
--
-- delete from public.listings where user_id is null;
-- ============================================================
