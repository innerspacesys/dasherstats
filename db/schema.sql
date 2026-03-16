create extension if not exists pgcrypto;

create table if not exists public.dashes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dash_date date not null,
  driver_name text,
  start_odometer numeric,
  end_odometer numeric,
  start_time time,
  end_time time,
  gross_amount numeric(10,2) not null check (gross_amount >= 0),
  tax_rate numeric(5,4) not null default 0.35,
  payout_account text,
  payout_note text,
  created_at timestamptz not null default now()
);

alter table public.dashes enable row level security;

create policy "users can view their own dashes"
on public.dashes
for select
using (auth.uid() = user_id);

create policy "users can insert their own dashes"
on public.dashes
for insert
with check (auth.uid() = user_id);

create policy "users can update their own dashes"
on public.dashes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete their own dashes"
on public.dashes
for delete
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  return new;
end;
$$;

-- Optional trigger placeholder if you want to add profile setup later.
