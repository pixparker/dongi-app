-- ============================================================
-- Dongi MVP: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles       enable row level security;
alter table public.trips           enable row level security;
alter table public.trip_members    enable row level security;
alter table public.expenses        enable row level security;
alter table public.expense_shares  enable row level security;
alter table public.payments        enable row level security;
alter table public.audit_logs      enable row level security;

-- ============================================================
-- Helper: check if current user is a member of a trip
-- ============================================================
create or replace function public.is_trip_member(p_trip_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id and user_id = auth.uid()
  );
$$;

-- Helper: check if current user is admin/creator of a trip
create or replace function public.is_trip_admin(p_trip_id uuid)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id
      and user_id = auth.uid()
      and role in ('creator', 'admin')
  );
$$;

-- ============================================================
-- Profiles
-- ============================================================
-- Any authenticated user can read profiles
create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can update only their own profile
create policy "profiles_update"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- Trips
-- ============================================================
-- Any authenticated user can read trips (needed for invite flow).
-- Trips contain no sensitive data (name, currency, dates).
-- Expense/payment data is separately protected.
create policy "trips_select"
  on public.trips for select
  to authenticated
  using (true);

-- Any authenticated user can create a trip
create policy "trips_insert"
  on public.trips for insert
  to authenticated
  with check (created_by = auth.uid());

-- Only admin/creator can update trip
create policy "trips_update"
  on public.trips for update
  to authenticated
  using (public.is_trip_admin(id))
  with check (public.is_trip_admin(id));

-- Only creator can delete trip
create policy "trips_delete"
  on public.trips for delete
  to authenticated
  using (created_by = auth.uid());

-- ============================================================
-- Trip Members
-- ============================================================
-- Trip members can see fellow members
create policy "trip_members_select"
  on public.trip_members for select
  to authenticated
  using (public.is_trip_member(trip_id));

-- Admin/creator can add members, or user can add themselves (join via invite)
create policy "trip_members_insert"
  on public.trip_members for insert
  to authenticated
  with check (
    public.is_trip_admin(trip_id)
    or user_id = auth.uid()
  );

-- Admin/creator can update members (e.g. promote role)
create policy "trip_members_update"
  on public.trip_members for update
  to authenticated
  using (public.is_trip_admin(trip_id))
  with check (public.is_trip_admin(trip_id));

-- Admin/creator can remove members
create policy "trip_members_delete"
  on public.trip_members for delete
  to authenticated
  using (public.is_trip_admin(trip_id));

-- ============================================================
-- Expenses
-- ============================================================
-- Trip members can read expenses
create policy "expenses_select"
  on public.expenses for select
  to authenticated
  using (public.is_trip_member(trip_id));

-- Trip members can create expenses
create policy "expenses_insert"
  on public.expenses for insert
  to authenticated
  with check (public.is_trip_member(trip_id) and created_by = auth.uid());

-- Admin/creator or expense creator can update
create policy "expenses_update"
  on public.expenses for update
  to authenticated
  using (
    public.is_trip_admin(trip_id)
    or created_by = auth.uid()
  );

-- ============================================================
-- Expense Shares
-- ============================================================
-- Trip members can read shares (via expense's trip_id)
create policy "expense_shares_select"
  on public.expense_shares for select
  to authenticated
  using (
    exists (
      select 1 from public.expenses e
      where e.id = expense_id and public.is_trip_member(e.trip_id)
    )
  );

-- Trip members can insert shares (when creating an expense)
create policy "expense_shares_insert"
  on public.expense_shares for insert
  to authenticated
  with check (
    exists (
      select 1 from public.expenses e
      where e.id = expense_id and public.is_trip_member(e.trip_id)
    )
  );

-- Admin or expense creator can delete shares (when editing expense)
create policy "expense_shares_delete"
  on public.expense_shares for delete
  to authenticated
  using (
    exists (
      select 1 from public.expenses e
      where e.id = expense_id
        and (public.is_trip_admin(e.trip_id) or e.created_by = auth.uid())
    )
  );

-- ============================================================
-- Payments
-- ============================================================
-- Trip members can read payments
create policy "payments_select"
  on public.payments for select
  to authenticated
  using (public.is_trip_member(trip_id));

-- Trip members can create payments
create policy "payments_insert"
  on public.payments for insert
  to authenticated
  with check (public.is_trip_member(trip_id));

-- Admin or payment creator can update (soft delete)
create policy "payments_update"
  on public.payments for update
  to authenticated
  using (
    public.is_trip_admin(trip_id)
    or from_user_id = auth.uid()
  );

-- ============================================================
-- Audit Logs
-- ============================================================
-- Trip members can read audit logs
create policy "audit_logs_select"
  on public.audit_logs for select
  to authenticated
  using (public.is_trip_member(trip_id));

-- Trip members can insert audit logs (from server actions)
create policy "audit_logs_insert"
  on public.audit_logs for insert
  to authenticated
  with check (public.is_trip_member(trip_id) and user_id = auth.uid());
