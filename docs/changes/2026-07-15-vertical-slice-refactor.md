# Major Change: Vertical Slice Refactor

Date: 2026-07-15
Type: Architecture
Scope: Front-end structure and routing

## Summary

The Angular app was reorganized from the default starter layout into a vertical slice (feature-first) architecture.

## What Was Changed

1. Introduced feature slices under `src/app/slices/`:
- `auth`
- `dashboard`
- `history`

2. Added per-slice route files:
- `src/app/slices/auth/auth.routes.ts`
- `src/app/slices/dashboard/dashboard.routes.ts`
- `src/app/slices/history/history.routes.ts`

3. Added initial page components inside each slice:
- login/register pages in `auth`
- dashboard page in `dashboard`
- history page in `history`

4. Rewired root app routing in `src/app/app.routes.ts` to compose routes from slices.

5. Replaced default Angular starter template with an app shell:
- `src/app/app.html`
- `src/app/app.scss`
- `src/app/app.ts`

6. Added shared domain models under `src/app/shared/models/`:
- `user.model.ts`
- `habit.model.ts`
- `habit-entry.model.ts`

7. Updated app test to reflect the shell changes:
- `src/app/app.spec.ts`

8. Fixed TypeScript spec config for newer TS behavior:
- added `rootDir` in `tsconfig.spec.json`

## Why This Change Was Made

1. Feature cohesion:
Putting routes, pages, and future services/stores together reduces context switching and improves maintainability.

2. Faster feature delivery:
A slice can be developed end-to-end without touching unrelated folders.

3. Better scaling:
As habits/auth/history grow, each slice can evolve independently.

4. Cleaner ownership:
Teams can own slices rather than cross-cutting technical layers.

## How This Adheres to Vertical Slice Architecture

1. Feature-first directory strategy:
Code is grouped by business capability (`auth`, `dashboard`, `history`) rather than by file type globally.

2. Slice-local routing:
Each feature controls its own route definition and can expand with local guards/components/services.

3. Shared and core boundaries:
Cross-feature models live in `shared`; app-wide concerns can live in `core` when introduced.

4. Reduced coupling:
Root router composes slices rather than embedding all feature internals directly.

## Notes for Future Changes

When adding a new feature:

1. Create `src/app/slices/<feature>/`
2. Add `<feature>.routes.ts`
3. Add `pages/` for routed UI and `components/` for local UI reuse
4. Add `services/` or `store/` inside the same slice when needed
5. Register that slice in `src/app/app.routes.ts`
6. Add a new entry in `docs/changes/` for major architecture or behavior changes
# 2026-07-15: Vertical Slice Refactor

## Summary

The app was reorganized from the Angular starter layout into a vertical-slice structure so features are grouped by business domain instead of file type.

## What Changed

- Added feature slices under `src/app/slices`:
  - `auth`
  - `dashboard`
  - `history`
- Added per-slice route files:
  - `src/app/slices/auth/auth.routes.ts`
  - `src/app/slices/dashboard/dashboard.routes.ts`
  - `src/app/slices/history/history.routes.ts`
- Added page components inside each slice under `pages/...`.
- Updated root routing in `src/app/app.routes.ts` to compose routes from all slices.
- Replaced the default Angular placeholder template with an app shell in:
  - `src/app/app.html`
  - `src/app/app.scss`
- Added shared domain models in `src/app/shared/models`.
- Updated app test expectation to match the new shell.

## Why It Changed

- The default starter layout does not scale well as feature count grows.
- Vertical slices reduce cross-folder navigation and keep related code together.
- Feature-level route ownership makes future lazy loading and team collaboration easier.
- This structure better supports upcoming habit-tracker features (auth, habits, history, API integration).

## How This Adheres to Vertical Slice

- Each feature owns its route definitions and page components.
- Business capabilities are modeled as slices (`auth`, `dashboard`, `history`) rather than global type buckets.
- Shared elements are limited to truly reusable models/utilities in `shared`.
- Cross-cutting concerns remain reserved for `core` (to be introduced as needed).

## Follow-Up Guidance

For new features:

1. Create `src/app/slices/<feature>`.
2. Keep routes, pages, and feature services inside that slice.
3. Only move code to `shared` when at least two slices need it.
4. Keep `core` for global concerns (interceptors, app-wide guards, platform setup).

## Impact

- No behavior regression expected for existing pages.
- Route navigation is now feature-composed and easier to evolve.
- Project structure is now aligned with the architecture described in the main README.
