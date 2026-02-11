# K-Beauty Commerce Radar - Dashboard

Next.js dashboard for K-Beauty cross-platform ranking intelligence.

- **Deploy**: TBD (Vercel)
- **Data Source**: Supabase (shared with k-beauty-commerce-radar)

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, Lucide React icons
- Supabase JS (direct queries, no API routes for data)
- Vercel (Hobby tier)

## Architecture

- **Server Components by default** - all data fetching in Server Components
- **Client Components only for**: NavPills, TopBar (search, locale toggle), CategoryPills
- **URL-based routing** - `?tab=ranking&cat=skincare` via searchParams
- **No SWR/React Query** - Server Components handle caching

## Database Tables (Supabase, shared with k-beauty-commerce-radar)

| Table | Purpose |
|-------|---------|
| `brands` | Brand master (name, name_kr, category, region) |
| `commerce_rankings` | Daily ranking snapshots (rank_position, platform, region) |
| `weekly_brand_metrics` | Weekly scores (leader/growth/new_leader/cross_border) |
| `company_profiles` | Korean company info (legal_name, ticker) |

## Project Structure

```
src/
  app/
    page.tsx                    # Dashboard (tab routing)
    layout.tsx                  # Root layout + fonts + LocaleProvider
    globals.css                 # Tailwind v4 @theme + component CSS
    brand/[name]/page.tsx       # Brand detail page
    api/search/route.ts         # Search autocomplete API
  components/
    layout/
      top-bar.tsx               # Search + locale toggle (Client)
      nav-pills.tsx             # Tab navigation (Client)
      category-pills.tsx        # Category selector (Client)
    dashboard/
      region-column.tsx         # KR/US/AE column (Server)
      platform-toggle.tsx       # <details> per platform (Server)
      rank-row.tsx              # Single ranking row (Server)
    signal/
      top-rankers-list.tsx      # Top Rankers tab (Server)
      climbers-list.tsx         # Risers tab (Server)
      new-entrants-list.tsx     # New Entrants tab (Server)
      crossborder-list.tsx      # Cross-border Winners tab (Server)
  lib/
    supabase.ts                 # Dual client (browser/server)
    queries.ts                  # 12 query functions (ported from Python)
    brands.ts                   # K-Beauty brand set + helpers
    constants.ts                # Platform/region/category configs
    types.ts                    # TypeScript interfaces
  i18n/
    provider.tsx                # EN/KR Context + localStorage
    types.ts / en.ts / ko.ts   # Translation files
```

## Rules

### MUST
- Set `maxDuration = 55` on all API routes calling external APIs
- Always `await` async work (Vercel terminates after response)
- Use `getSupabaseAdmin()` for server-side queries only
- Validate inputs with Zod on API routes

### SHOULD
- Prefer Server Components for data fetching
- Keep Client Components minimal (interactivity only)

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```
