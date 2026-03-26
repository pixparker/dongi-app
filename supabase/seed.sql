-- ============================================================
-- Dongi MVP: Seed Data (local development only)
-- ============================================================
-- Creates 2 test users and a sample trip with expenses.
-- Login credentials:
--   ali    / password123
--   hossein / password123

-- 1. Create test users in auth.users
-- (The trigger will auto-create dongi.profiles rows)
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  (
    'a1111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'ali@dongi.local',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"username": "ali"}'::jsonb,
    '', '', '', ''
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'hossein@dongi.local',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"username": "hossein"}'::jsonb,
    '', '', '', ''
  );

-- 2. Create a sample trip
insert into dongi.trips (id, name, currency, start_date, created_by, invite_code)
values (
  'c3333333-3333-3333-3333-333333333333',
  'سفر آنتالیا',
  'TRY',
  '2026-04-01',
  'a1111111-1111-1111-1111-111111111111',
  'antalya1'
);

-- 3. Add members
insert into dongi.trip_members (trip_id, user_id, display_name, role) values
  ('c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'علی', 'creator'),
  ('c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'حسین', 'member');

-- 4. Add sample expenses
insert into dongi.expenses (id, trip_id, title, amount, payer_id, category, date, split_mode, status, created_by)
values
  ('d4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333',
   'ناهار رستوران', 500.00,
   'a1111111-1111-1111-1111-111111111111', 'food', '2026-04-01', 'equal', 'approved',
   'a1111111-1111-1111-1111-111111111111'),
  ('e5555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333',
   'تاکسی فرودگاه', 200.00,
   'b2222222-2222-2222-2222-222222222222', 'transport', '2026-04-01', 'equal', 'approved',
   'b2222222-2222-2222-2222-222222222222');

-- 5. Add expense shares (equal split between 2 members)
insert into dongi.expense_shares (expense_id, user_id, share) values
  ('d4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 250.00),
  ('d4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 250.00),
  ('e5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 100.00),
  ('e5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 100.00);

-- 6. Add a sample payment
insert into dongi.payments (trip_id, from_user_id, to_user_id, amount, date)
values (
  'c3333333-3333-3333-3333-333333333333',
  'b2222222-2222-2222-2222-222222222222',
  'a1111111-1111-1111-1111-111111111111',
  100.00,
  '2026-04-02'
);
