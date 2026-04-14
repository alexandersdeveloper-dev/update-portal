# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create optimized production build to /dist
npm run preview  # Preview production build locally
```

No test framework is configured.

## Environment

Requires a `.env` file with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

React SPA (Vite) backed by **Supabase** (Postgres + Auth). It's a public transparency compliance portal for the municipality of Parintins, Brazil, tracking compliance with Brazilian public transparency requirements.

### Routing ([src/main.jsx](src/main.jsx))

| Path | Component | Notes |
|---|---|---|
| `/` | `App` | Public — category cards with search |
| `/dashboard` | `Dashboard` | Public — score overview and charts |
| `/informacoes` | `Informacoes` | Public — static info page |
| `/login` | `Login` | Auth form |
| `/admin` | `Admin` | Protected — redirects to `/login` if no session |

`/`, `/dashboard`, and `/informacoes` share the `Layout` wrapper ([src/components/Layout.jsx](src/components/Layout.jsx)), which renders the header, nav, footer, and modal triggers. `/login` and `/admin` render standalone.

### Supabase schema

Three main tables, fetched with nested selects (`categories(*, criteria(*, subitems(*)))`):

- **categories** — `id, name, description, icon, tone, order`
- **criteria** — `id, category_id, code, text, importance ('essencial'|'obrigatoria'|'recomendada'), order`
- **subitems** — `id, criterion_id, label, order, counts_for_score`
- **responses** — `subitem_id (unique), status ('atendido'|'parcial'|'nao_atendido'|'nao_aplicavel'), updated_at`

### Scoring

Scores are computed client-side in [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx) and [src/pages/Admin.jsx](src/pages/Admin.jsx) (same logic, duplicated):
- `atendido` = 1.0, `parcial` = 0.5, `nao_atendido` = 0.0; `nao_aplicavel` and `null` are excluded
- Each criterion is averaged across its subitems, then weighted by importance (`essencial`=2, `obrigatoria`=1.5, `recomendada`=1)
- Category score = weighted average of its criteria; Overall score = simple average of category scores
- Color thresholds: ≥80% green, ≥50% yellow, <50% red

### Key files

- [src/App.jsx](src/App.jsx) — Public portal page: fetches categories + responses from Supabase, animated search bar filtering across titles/criteria/subitems/importance labels, supports `location.state.expandCategoryId` from Dashboard navigation
- [src/Card.jsx](src/Card.jsx) — Expandable card for a single category. Renders a progress bar, criteria list with importance chips, status icons, last-update date, and a PDF export button via `@react-pdf/renderer`
- [src/CategoryPDF.jsx](src/CategoryPDF.jsx) — `@react-pdf/renderer` document definition for per-category PDF export
- [src/pages/Admin.jsx](src/pages/Admin.jsx) — Full CRUD admin panel: edit category/criterion/subitem metadata, set response statuses via `StatusSelector`, toggle "edit mode" to expose add/delete controls. Auth-gated via `useAuth`
- [src/hooks/useAuth.js](src/hooks/useAuth.js) — Wraps `supabase.auth` session state, `signIn`, and `signOut`
- [src/lib/supabase.js](src/lib/supabase.js) — Creates and exports the Supabase client from env vars
- [src/styles.css](src/styles.css) — All public styles using CSS custom properties; responsive breakpoint at `max-width: 820px`; dark mode via `[data-theme="dark"]` on `<html>`, toggled by cookie `preferred_theme`
- [src/admin.css](src/admin.css) — Admin-specific styles

### External dependencies (CDN)

Bootstrap Icons and Google Fonts (Manrope, Sora) are loaded via CDN in [index.html](index.html) — not bundled via npm.
