# Dongi MVP - Implementation Plan

> Group trip expense manager. Persian UI, mobile-first, Supabase + Next.js 16.

---

## How to Use This Plan

- Phases are sequential — each builds on the previous
- Status values: `Not Started` | `In Progress` | `Done`
- Each phase ends with a verification step before moving on

---

## Phase 1: Database Schema & Security

**Status:** `Done`

**Purpose:** Create all database tables, relationships, and row-level security so every subsequent phase has a working data layer.

**Scope:**
- Supabase migration with 7 tables: `profiles`, `trips`, `trip_members`, `expenses`, `expense_shares`, `payments`, `audit_logs`
- Auto-create `profiles` row on user signup (Postgres trigger on `auth.users`)
- Generate unique `invite_code` per trip
- RLS policies: all data scoped to trip membership
- Seed file for local development
- Generate TypeScript types from schema (`src/types/database.ts`)

**Key files:**
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/seed.sql`
- `src/types/database.ts` (auto-generated)

**Verify:** Run `supabase db reset`. Open Studio (localhost:54323). Insert test rows. Confirm RLS blocks cross-trip access.

---

## Phase 2: Authentication

**Status:** `Done`

**Purpose:** Let users register, log in, log out, and protect all app routes behind auth.

**Scope:**
- Server actions: `register`, `login`, `logout` (username/password via Supabase Auth)
- Username mapped to `{username}@dongi.local` email (confirmation disabled)
- Middleware: redirect unauthenticated users to `/login`, authenticated users away from auth pages
- Wire login/register page forms to server actions with error handling
- Implement `use-session` hook (auth state + profile)
- Add `name` prop to `InputField` component for form submission

**Key files:**
- Create: `src/app/(auth)/actions.ts`
- Modify: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Modify: `src/lib/supabase/middleware.ts`
- Modify: `src/hooks/use-session.ts`
- Modify: `src/components/ui/input-field.tsx`

**Verify:** Register a user. Log out. Confirm `/trips` redirects to `/login`. Log in. Confirm redirect back to `/trips`.

---

## Phase 3: Trips CRUD

**Status:** `Done`

**Purpose:** Users can create, view, update, and delete trips with real data instead of mock arrays.

**Scope:**
- Server actions: `createTrip`, `updateTrip`, `deleteTrip`
- On create: insert trip + add creator as member with role `creator`
- Trips list page: fetch trips where current user is a member (server component)
- Trip dashboard: fetch real trip details, members, expense summary
- Trip settings: wire update/delete forms
- Implement `use-trip` hook

**Key files:**
- Create: `src/app/(app)/trips/actions.ts`
- Modify: `src/app/(app)/trips/page.tsx`, `trips/new/page.tsx`
- Modify: `src/app/(app)/trips/[tripId]/page.tsx`, `[tripId]/settings/page.tsx`
- Modify: `src/hooks/use-trip.ts`

**Verify:** Create a trip. See it in the list. Open dashboard — real name/currency shown. Update settings. Delete trip.

---

## Phase 4: Members, Expenses & Payments CRUD

**Status:** `Done`

**Purpose:** Full create/read/delete for all trip entities — the core data entry layer.

**Scope:**

*Members:*
- Actions: `addMember`, `promoteMember`, `removeMember`
- Members page: real data, promote/remove buttons, display invite link

*Expenses:*
- Actions: `createExpense` (with shares), `updateExpense`, `deleteExpense` (soft)
- New expense form: real member list, 3 split modes (equal / percentage / fixed)
- Expense list: real data, status pills for pending items

*Payments:*
- Actions: `createPayment`, `deletePayment` (soft)
- New payment form: real member selectors
- Implement `use-expenses` and `use-payments` hooks

**Key files:**
- Create: `src/app/(app)/trips/[tripId]/members/actions.ts`
- Create: `src/app/(app)/trips/[tripId]/expenses/actions.ts`
- Create: `src/app/(app)/trips/[tripId]/payments/actions.ts`
- Modify: all pages under `trips/[tripId]/`
- Modify: `src/hooks/use-expenses.ts`, `src/hooks/use-payments.ts`

**Verify:** Create expenses with all 3 split modes — check `expense_shares` rows. Record a payment. Soft-delete an expense — gone from UI, still in DB.

---

## Phase 5: Business Logic (Balances & Settlement)

**Status:** `Done`

**Purpose:** The financial brain — calculate who owes whom and recommend the fewest transfers to settle up.

**Scope:**
- `calculateMemberBalances()`: per member `balance = totalPaid - totalShare + received - sent` (approved expenses only)
- `calculateSettlements()`: greedy min-transfer algorithm (match largest debtor with largest creditor)
- `calculateExpenseShares()`: reusable share preview for the new-expense form
- Persian number formatting: `toPersianNumber()`, `formatCurrency()`, `timeAgo()`
- Wire into trip dashboard (totals, per-member balances) and payments page (settlement suggestions)

**Key files:**
- Modify: `src/lib/calculations.ts` (core implementation)
- Modify: `src/lib/utils.ts` (formatters)
- Modify: `src/app/(app)/trips/[tripId]/page.tsx` (dashboard)
- Modify: `src/app/(app)/trips/[tripId]/payments/page.tsx` (settlements)

**Verify:** 3+ members, mixed expenses and payments. Dashboard balances are correct. Settlement recommendations sum to zero across all members.

---

## Phase 6: Invite System

**Status:** `Done`

**Purpose:** Let trip creators share a link so others can join a trip.

**Scope:**
- Invite page (`/invite/[code]`): fetch trip by code (public), show join button or redirect to login
- Server action: `joinTrip(inviteCode)` — add user as member
- Post-login redirect: if user came from an invite link, auto-join after login
- Members page: copy-invite-link button
- Admin action to regenerate invite code

**Key files:**
- Create: `src/app/invite/actions.ts`
- Modify: `src/app/invite/[code]/page.tsx`
- Modify: `src/app/(auth)/actions.ts` (post-login redirect)
- Modify: `src/app/(app)/trips/[tripId]/members/page.tsx`

**Verify:** Copy invite link. Open in incognito. Register. Confirm auto-joined to the trip.

---

## Phase 7: UX & Performance — Skeleton Loading & Router Caching

**Status:** `Done`

**Purpose:** Eliminate loading flickers and unnecessary Supabase fetches on navigation by adding skeleton loading states to all main routes. With `loading.tsx` files, Next.js 16 caches rendered pages in the client-side Router Cache (30s TTL), making back-navigation instant.

**Scope:**
- Reusable `Skeleton` component (`animate-pulse` placeholder)
- `loading.tsx` for trips list, trip dashboard, expenses, payments, members
- Each skeleton matches the real page layout (cards, headers, avatars)
- No changes to existing files — purely additive

**Key files:**
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/app/(app)/trips/loading.tsx`
- Create: `src/app/(app)/trips/[tripId]/loading.tsx`
- Create: `src/app/(app)/trips/[tripId]/expenses/loading.tsx`
- Create: `src/app/(app)/trips/[tripId]/payments/loading.tsx`
- Create: `src/app/(app)/trips/[tripId]/members/loading.tsx`

**Verify:** Navigate between routes — skeleton shows instantly (no blank screen). Click "ثبت هزینه جدید" then press back — dashboard appears from cache (no re-fetch within 30s). Create an expense — after redirect, fresh data appears.

---

## Phase 8: Dashboard Expense Breakdown Chart

**Status:** `Not Started`

**Purpose:** Give users a visual breakdown of trip spending by category so they can quickly see where money goes.

**Scope:**
- Pie chart on trip dashboard (below recent expenses) showing expenses grouped by category
- Each slice shows category name, amount, and percentage
- Uses approved, non-deleted expenses only
- Client component using a lightweight chart library (e.g. `recharts`)

**Key files:**
- Create: `src/components/charts/expense-pie-chart.tsx`
- Modify: `src/app/(app)/trips/[tripId]/page.tsx` (add chart below expenses)

**Verify:** Dashboard with 5+ expenses across different categories displays correct pie chart with matching amounts and percentages.

---

## Phase 9: Approval Workflow & Polling Sync

**Status:** `Not Started`

**Purpose:** Admins can gate member-submitted expenses, and all users see live updates without manual refresh.

**Scope:**

*Approval:*
- Actions: `approveExpense`, `rejectExpense` (admin/creator only)
- Conditional pending status on creation (when `require_approval` is on and submitter is regular member)
- Admin UI: approve/reject buttons, pending count badge on dashboard

*Polling:*
- Implement `use-polling` hook: generic interval fetcher (10s), pause on hidden tab
- Wire into `use-trip`, `use-expenses`, `use-payments`

**Key files:**
- Modify: `src/app/(app)/trips/[tripId]/expenses/actions.ts`
- Modify: `src/app/(app)/trips/[tripId]/expenses/page.tsx`
- Modify: `src/app/(app)/trips/[tripId]/page.tsx`
- Modify: `src/hooks/use-polling.ts`
- Modify: `src/hooks/use-trip.ts`, `use-expenses.ts`, `use-payments.ts`

**Verify:** Approval: create trip with approval on, submit expense as member, confirm pending, approve as admin, confirm in calculations. Polling: two browsers, add expense in one, appears in the other within 10s.

---

## Phase 10: Audit Logging

**Status:** `Not Started`

**Purpose:** Record every create/update/delete so the team has a transparent change history.

**Scope:**
- Audit helper: `logAudit(tripId, entityType, entityId, action, before, after, userId)`
- Call from every server action that mutates data
- History page: fetch real audit logs, Persian descriptions, relative timestamps

**Key files:**
- Create: `src/lib/audit.ts`
- Modify: all server action files (add audit calls)
- Modify: `src/app/(app)/trips/[tripId]/history/page.tsx`

**Verify:** Create, edit, delete an expense. History page shows all 3 events with correct details.

---

## Phase 11: Deployment & E2E Verification

**Status:** `Not Started`

**Purpose:** Ship to production and verify the full user journey works end-to-end.

**Scope:**
- Create Supabase Cloud project, run all migrations
- Deploy to Vercel, set environment variables
- Optional: add `manifest.json` for PWA install prompt

**E2E Checklist:**
- [ ] Register / login / logout
- [ ] Create trip, appears in list
- [ ] Invite link -> join trip (cross-user)
- [ ] Add expenses (equal, percentage, fixed splits)
- [ ] Dashboard balances correct
- [ ] Record payment, balances update
- [ ] Settlement recommendations correct
- [ ] Approval workflow (pending -> approved -> in calculations)
- [ ] Audit history shows all operations
- [ ] Polling sync across two browsers
- [ ] RTL layout + Persian numerals correct
- [ ] Usable on mobile screen

---

## Architecture Reference

```
src/
  app/
    (auth)/          # login, register, auth actions
    (app)/           # protected routes
      trips/         # list, create
        [tripId]/    # dashboard, expenses, payments, members, history, settings
    invite/[code]/   # public invite page
  components/ui/     # Button, Card, InputField, Avatar, PageHeader, StatusPill, BottomNav
  hooks/             # use-session, use-trip, use-expenses, use-payments, use-polling
  lib/
    supabase/        # client.ts, server.ts, middleware.ts
    calculations.ts  # balance & settlement logic
    constants.ts     # enums (split modes, roles, statuses, categories)
    utils.ts         # cn(), formatters
    audit.ts         # audit log helper
  types/             # TypeScript types + auto-generated DB types
supabase/
  migrations/        # SQL schema + RLS
  seed.sql           # dev test data
```
