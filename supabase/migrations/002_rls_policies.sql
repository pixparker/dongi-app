-- ============================================================
-- Dongi MVP: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
alter table dongi.profiles       enable row level security;
alter table dongi.trips           enable row level security;
alter table dongi.trip_members    enable row level security;
alter table dongi.expenses        enable row level security;
alter table dongi.expense_shares  enable row level security;
alter table dongi.payments        enable row level security;
alter table dongi.audit_logs      enable row level security;

-- ============================================================
-- Helper: check if current user is a member of a trip
-- ============================================================
create or replace function dongi.is_trip_member(p_trip_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from dongi.trip_members
    where trip_id = p_trip_id and user_id = auth.uid()
  );
$$;

-- Helper: check if current user is admin/creator of a trip
create or replace function dongi.is_trip_admin(p_trip_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from dongi.trip_members
    where trip_id = p_trip_id
      and user_id = auth.uid()
      and role in ('creator', 'admin')
  );
$$;

-- ============================================================
-- Profiles
-- ============================================================
create policy "profiles_select"
  on dongi.profiles for select
  to authenticated
  using (true);

create policy "profiles_update"
  on dongi.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- Trips
-- ============================================================
-- Any authenticated user can read trips (needed for invite flow).
create policy "trips_select"
  on dongi.trips for select
  to authenticated
  using (true);

create policy "trips_insert"
  on dongi.trips for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "trips_update"
  on dongi.trips for update
  to authenticated
  using (dongi.is_trip_admin(id))
  with check (dongi.is_trip_admin(id));

create policy "trips_delete"
  on dongi.trips for delete
  to authenticated
  using (created_by = auth.uid());

-- ============================================================
-- Trip Members
-- ============================================================
create policy "trip_members_select"
  on dongi.trip_members for select
  to authenticated
  using (dongi.is_trip_member(trip_id));

create policy "trip_members_insert"
  on dongi.trip_members for insert
  to authenticated
  with check (
    dongi.is_trip_admin(trip_id)
    or user_id = auth.uid()
  );

create policy "trip_members_update"
  on dongi.trip_members for update
  to authenticated
  using (dongi.is_trip_admin(trip_id))
  with check (dongi.is_trip_admin(trip_id));

create policy "trip_members_delete"
  on dongi.trip_members for delete
  to authenticated
  using (dongi.is_trip_admin(trip_id));

-- ============================================================
-- Expenses
-- ============================================================
create policy "expenses_select"
  on dongi.expenses for select
  to authenticated
  using (dongi.is_trip_member(trip_id));

create policy "expenses_insert"
  on dongi.expenses for insert
  to authenticated
  with check (dongi.is_trip_member(trip_id) and created_by = auth.uid());

create policy "expenses_update"
  on dongi.expenses for update
  to authenticated
  using (
    dongi.is_trip_admin(trip_id)
    or created_by = auth.uid()
  );

-- ============================================================
-- Expense Shares
-- ============================================================
create policy "expense_shares_select"
  on dongi.expense_shares for select
  to authenticated
  using (
    exists (
      select 1 from dongi.expenses e
      where e.id = expense_id and dongi.is_trip_member(e.trip_id)
    )
  );

create policy "expense_shares_insert"
  on dongi.expense_shares for insert
  to authenticated
  with check (
    exists (
      select 1 from dongi.expenses e
      where e.id = expense_id and dongi.is_trip_member(e.trip_id)
    )
  );

create policy "expense_shares_delete"
  on dongi.expense_shares for delete
  to authenticated
  using (
    exists (
      select 1 from dongi.expenses e
      where e.id = expense_id
        and (dongi.is_trip_admin(e.trip_id) or e.created_by = auth.uid())
    )
  );

-- ============================================================
-- Payments
-- ============================================================
create policy "payments_select"
  on dongi.payments for select
  to authenticated
  using (dongi.is_trip_member(trip_id));

create policy "payments_insert"
  on dongi.payments for insert
  to authenticated
  with check (dongi.is_trip_member(trip_id));

create policy "payments_update"
  on dongi.payments for update
  to authenticated
  using (
    dongi.is_trip_admin(trip_id)
    or from_user_id = auth.uid()
  );

-- ============================================================
-- Audit Logs
-- ============================================================
create policy "audit_logs_select"
  on dongi.audit_logs for select
  to authenticated
  using (dongi.is_trip_member(trip_id));

create policy "audit_logs_insert"
  on dongi.audit_logs for insert
  to authenticated
  with check (dongi.is_trip_member(trip_id) and user_id = auth.uid());
