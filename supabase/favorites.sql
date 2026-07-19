create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.favorites enable row level security;

drop policy if exists "users can read own favorites" on public.favorites;
create policy "users can read own favorites"
on public.favorites
for select
using (auth.uid() = user_id);

drop policy if exists "users can insert own favorites" on public.favorites;
create policy "users can insert own favorites"
on public.favorites
for insert
with check (auth.uid() = user_id);

drop policy if exists "users can update own favorites" on public.favorites;
create policy "users can update own favorites"
on public.favorites
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete own favorites" on public.favorites;
create policy "users can delete own favorites"
on public.favorites
for delete
using (auth.uid() = user_id);
