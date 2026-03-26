-- ============================================================
-- Dongi MVP: Initial Schema
-- ============================================================

-- Helper: generate short random invite codes
create or replace function public.generate_invite_code(len int default 8)
returns text
language sql
volatile
as $$
  select string_agg(
    substr('abcdefghjkmnpqrstuvwxyz23456789', ceil(random() * 30)::int, 1), ''
  )
  from generate_series(1, len);
$$;

-- ============================================================
-- 1. Profiles (public mirror of auth.users)
-- ============================================================
create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  username   text unique not null,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Trips
-- ============================================================
create table public.trips (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  currency         text not null default 'TRY',
  start_date       date not null default current_date,
  image_url        text,
  require_approval boolean not null default false,
  invite_code      text unique not null default public.generate_invite_code(),
  created_by       uuid not null references public.profiles(id),
  created_at       timestamptz not null default now()
);

create index idx_trips_invite_code on public.trips(invite_code);
create index idx_trips_created_by on public.trips(created_by);

-- ============================================================
-- 3. Trip Members
-- ============================================================
create table public.trip_members (
  id           uuid primary key default gen_random_uuid(),
  trip_id      uuid not null references public.trips(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  role         text not null default 'member' check (role in ('creator', 'admin', 'member')),
  joined_at    timestamptz not null default now(),
  unique (trip_id, user_id)
);

create index idx_trip_members_trip on public.trip_members(trip_id);
create index idx_trip_members_user on public.trip_members(user_id);

-- ============================================================
-- 4. Expenses
-- ============================================================
create table public.expenses (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references public.trips(id) on delete cascade,
  title       text not null,
  amount      numeric(12, 2) not null check (amount > 0),
  payer_id    uuid not null references public.profiles(id),
  category    text not null default 'other' check (category in ('food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other')),
  date        date not null default current_date,
  description text,
  split_mode  text not null default 'equal' check (split_mode in ('equal', 'percentage', 'fixed')),
  status      text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_by  uuid not null references public.profiles(id),
  created_at  timestamptz not null default now(),
  is_deleted  boolean not null default false
);

create index idx_expenses_trip on public.expenses(trip_id);
create index idx_expenses_payer on public.expenses(payer_id);
create index idx_expenses_not_deleted on public.expenses(trip_id) where is_deleted = false;

-- ============================================================
-- 5. Expense Shares
-- ============================================================
create table public.expense_shares (
  id         uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  user_id    uuid not null references public.profiles(id),
  share      numeric(12, 2) not null check (share >= 0),
  unique (expense_id, user_id)
);

create index idx_expense_shares_expense on public.expense_shares(expense_id);
create index idx_expense_shares_user on public.expense_shares(user_id);

-- ============================================================
-- 6. Payments (settlements between members)
-- ============================================================
create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  trip_id      uuid not null references public.trips(id) on delete cascade,
  from_user_id uuid not null references public.profiles(id),
  to_user_id   uuid not null references public.profiles(id),
  amount       numeric(12, 2) not null check (amount > 0),
  date         date not null default current_date,
  created_at   timestamptz not null default now(),
  is_deleted   boolean not null default false,
  check (from_user_id <> to_user_id)
);

create index idx_payments_trip on public.payments(trip_id);
create index idx_payments_not_deleted on public.payments(trip_id) where is_deleted = false;

-- ============================================================
-- 7. Audit Logs
-- ============================================================
create table public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references public.trips(id) on delete cascade,
  entity_type text not null,
  entity_id   uuid not null,
  action      text not null check (action in ('create', 'update', 'delete')),
  before      jsonb,
  after       jsonb,
  user_id     uuid not null references public.profiles(id),
  created_at  timestamptz not null default now()
);

create index idx_audit_logs_trip on public.audit_logs(trip_id);
create index idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
