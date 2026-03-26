# Dongi (دنگی‌سفر)

Group trip expense manager. Persian UI, mobile-first.

## Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase (PostgreSQL)

## Getting Started

```bash
pnpm install
pnpm dev
```

App runs at [http://localhost:3001](http://localhost:3001).

## Environment

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Test Account

| Username | Password |
|----------|----------|
| testuser | test1234 |

## Database

Uses a dedicated `dongi` schema on Supabase to isolate from other projects.

Tables: `profiles`, `trips`, `trip_members`, `expenses`, `expense_shares`, `payments`, `audit_logs`

## Implementation Plan

See [docs/mvp/implementation-plan.md](docs/mvp/implementation-plan.md) for the phased roadmap.
