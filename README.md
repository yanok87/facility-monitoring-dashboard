# Facility Monitoring Dashboard

A **Fence**-style dashboard for monitoring portfolio health and covenant compliance across multiple credit facilities. Built for Capital Providers and Asset Originators to see total exposure, facility-level summaries, and drill into covenant metrics and asset-level detail in one place.

**Tech stack:** Next.js (App Router), TypeScript, Material UI, TanStack React Query.

---

## What You See (Dashboard)

The UI is designed so everything important is visible and easy to scan:

- **Hero section** — Total exposure by currency, number of facilities, compliant vs in-breach counts at a glance.
- **Facility cards** — One card per facility with name, asset class, covenant status (COMPLIANT / BREACH), exposure, and covenant rate vs threshold. Selection is synced with the URL so you can share or bookmark a facility.
- **Facility detail** — After selecting a facility: covenant metric, computed rate vs threshold with a progress indicator, included/excluded asset counts, and a **portfolio table** with expandable rows. Excluded rows are visually distinguished (grey for “other status”, red for past due / delinquent / defaulted / written off), with a small legend explaining the colors. Raw asset fields (e.g. `maturity_date`) are shown in title case in the expanded section.
- **Error handling** — If the overview or facility detail request fails, the app shows a clear message and a **Retry** button for facility detail.

The UI is built with **Material UI (MUI)** and a **central color and typography scheme** in `src/theme/` so the dashboard stays consistent and easy to change.

**Why colors and fonts live in the theme**

- **Single source of truth** — All palette and type styles are defined in `colors.ts` and `theme.ts`. Components use theme tokens (e.g. `variant="h3"`, `color="text.secondary"`, `colors.primary.main`) instead of hardcoded hex values or font sizes, so there are no magic numbers scattered across the app.
- **Consistency** — One palette (primary, secondary, success, error, warning, background, text) and one typography scale (including custom variants like `heroValue`, `cardTitle`, `valueLarge`, plus overline, caption, body, headings) give a uniform look and clear hierarchy (page title, section labels, stats, body copy).
- **Easy rebrand / restyle** — Changing the look (e.g. new primary color, different font, or adjusted sizes) is done in one place; the rest of the UI follows automatically. Shadows and key component overrides (e.g. cards, buttons) are also in the theme.
- **Semantic meaning** — Colors map to intent (success for compliant, error for breach, text.secondary for supporting copy), so the UI stays readable and accessible without ad‑hoc styling.

---

## Data Normalization

Facilities come from different originators with different field names, status vocabularies, and date formats. The app handles this in a **service layer** so the UI only sees one shape:

- **Ports & adapters** — The core `FacilityService` depends on two ports: covenant source and portfolio source. Adapters (file or HTTP) implement these ports. Raw data is never used directly in the UI.
- **Normalized types** — The domain defines a single vocabulary: `NormalizedStatus` (e.g. `current`, `delinquent`, `written_off`), `NormalizedAssetRow` (same columns for every facility), `NormalizedFacilityDetail`, `NormalizedOverview`. See `src/domain/types.ts`.
- **Status normalization** — `normalize-status.ts` maps originator-specific strings (e.g. `"open"`, `"Open"`, `"OPEN"`, `"performing"`, `"PERFORMING"`) to `NormalizedStatus`, so the table and filters behave consistently.
- **Asset normalization** — `normalize-asset.ts` maps each facility’s raw portfolio schema to `NormalizedAssetRow` (id, amount, outstandingAmount, status, isEligible, daysPastDue, exclusion flags, etc.). Facility-specific fields are kept in `rawDetail` for the expandable row without the UI needing to know each schema.
- **Single service** — `FacilityService` uses the covenant and portfolio adapters, calls the normalization helpers, and returns only normalized models. The API routes and the UI never touch raw files or API shapes.

This keeps the dashboard consistent and user-friendly even when new facilities with different schemas are added.

---

## TanStack React Query (Data Fetching & Caching)

The dashboard uses **TanStack React Query** for all server data (overview and facility detail).

**How it’s used**

- **Overview** — One query with key `["overview"]`; fetches `/api/overview` and caches the result.
- **Facility detail** — One query per facility with key `["facility-detail", facilityId]`; fetches `/api/facilities/[id]/detail` when a facility is selected.

**Why it’s useful**

- **No refetch on every click** — Switching to another facility and back uses the cached detail if it’s still considered “fresh”, so the app doesn’t hit the server again until data is stale.
- **Stale-until-midnight** — Both queries use `staleTime: getStaleTimeUntilMidnightUTC()`. Data is treated as fresh for the rest of the current calendar day (UTC), so we avoid unnecessary refetches when the data only updates daily.
- **Cache lifetime** — Unused query data is kept in memory for 30 minutes (`gcTime`), so revisiting a facility later in the session still benefits from cache when appropriate.
- **Loading and error states** — React Query provides `isLoading`, `isError`, and `refetch`, which we use for the loading spinner, error message, and Retry button.

The client only talks to the Next.js API routes (`/api/overview`, `/api/facilities/[id]/detail`). Those routes use the same `FacilityService` whether the server is wired to file adapters or HTTP adapters, so switching to real APIs does not require any change to the React Query setup.

---

## Using Real APIs Instead of Files

By default, the app reads from **local JSON files** (covenant results and per-facility portfolios). To use real backend APIs instead:

1. **Configure URLs** in `src/config/urls.ts`:
   - `COVENANT_URL` — endpoint that returns covenant results (same shape as `data/covenant_results.json`).
   - `PORTFOLIO_URL_1`, `PORTFOLIO_URL_2`, `PORTFOLIO_URL_3` — endpoints that return portfolio data for each facility (order matches `FACILITY_IDS`).

2. **Switch adapters** in `src/server/facility-service.server.ts`:
   - Comment out the block that uses `createFileAdapters(basePath)`.
   - Uncomment the block that uses `createHttpAdaptersFromUrls()` and `new FacilityService(covenant, portfolio)`.

3. Restart the dev server. The API routes (`/api/overview`, `/api/facilities/[id]/detail`) will now pull data from your configured URLs via the HTTP adapters. No client or React Query changes are needed.

The HTTP adapters expect the same response shapes as the file-backed data (covenant results and facility-specific portfolio JSON). If your backend differs, add a thin mapping in the adapters or in the service layer so the rest of the app still receives normalized data.

---

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard loads the overview and, when you select a facility, its detail. Data is read from the `data/` folder by default (see above for switching to real APIs).

---

## Project Structure (relevant parts)

- `src/app/` — Next.js App Router: page, layout, API routes (`/api/overview`, `/api/facilities/[id]/detail`), and dashboard components (HeroExposure, FacilityCards, FacilityDetail).
- `src/domain/` — Normalized types and re-exports for the UI.
- `src/ports/` — Interfaces for covenant and portfolio data sources.
- `src/adapters/file/` — File-based implementations (reads from `data/`).
- `src/adapters/http/` — HTTP implementations (use `src/config/urls.ts`).
- `src/services/` — `FacilityService` and normalization (status, asset).
- `src/server/` — Creates the single `FacilityService` instance used by API routes (file or HTTP adapters).
- `src/theme/` — Central colors and MUI theme.
- `src/lib/query-utils.ts` — `getStaleTimeUntilMidnightUTC()` for React Query `staleTime`.
- `data/` — Local JSON for covenant results and facility portfolios (used when file adapters are enabled).

---
