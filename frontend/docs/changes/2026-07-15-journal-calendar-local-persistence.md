# Major Change: Journal Calendar UX and Local Persistence

Date: 2026-07-15
Type: Behavior | Front-end UX
Scope: Dashboard journal interaction model, month selection continuity, browser persistence

## Summary

The dashboard journal flow was upgraded from a day dropdown to clickable calendar-style day cards, and state persistence was added so habit checkboxes and journal text survive local app restarts.

## What Was Changed

1. Reworked day selection UI in the dashboard journal panel:
- Replaced day select control with clickable day cards.
- Added weekday headers and aligned day cards in calendar format.
- Added visual states for selected day and days that already contain journal entries.

2. Improved selected-month continuity:
- Added per-month remembered day selection so reopening a month returns to the last selected journal day for that month.

3. Added local browser persistence:
- Persisted dashboard state in localStorage under key `habit-tracker:dashboard-state`.
- Persisted habit matrix entries, journal entries, and per-month selected day.
- Added browser-safe guards so persistence is only used in client runtime.

4. Updated dashboard state initialization:
- Dashboard now hydrates from persisted state when available.
- Falls back to seed demo data when no local persisted state exists.

## Why This Change Was Made

1. Better journaling UX:
A visual day-card model is faster and more intuitive than a select dropdown for month-based reflection.

2. Reduced user friction:
Users can reopen the app and continue without losing local edits.

3. Better feature cohesion in dashboard slice:
Journal behavior and state management remain local to the dashboard feature.

## How This Adheres to Vertical Slice Architecture

1. Slice-local implementation:
UI and state behavior changes were implemented within dashboard components/pages.

2. No unnecessary global abstractions:
Persistence is implemented directly in the dashboard page where the relevant state is owned.

3. Shared/core boundaries preserved:
No cross-slice coupling was introduced; behavior remains feature-contained.

## Migration Notes (If Applicable)

1. Existing users will keep seed data until they edit state; from then on, local data is persisted in browser storage.
2. To reset local dashboard state, clear browser localStorage entry `habit-tracker:dashboard-state`.

## Validation

- Build status: pass (`ng build`)
- Test status: not run in this change
- Manual checks: day cards render in month view and selections/journal edits remain after restart

## Follow-Up Actions

1. Add a user-facing "Reset Local Data" action in dashboard settings.
2. Optionally version the persisted payload to support future schema evolution.
