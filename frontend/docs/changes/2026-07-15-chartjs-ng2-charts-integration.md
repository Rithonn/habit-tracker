# Major Change: Chart Integration with Chart.js and ng2-charts

Date: 2026-07-15
Type: Behavior | Front-end Integration
Scope: Dashboard visualization, charting dependencies, app provider configuration

## Summary

Added a monthly line-chart capability to the dashboard slice using Chart.js with the ng2-charts Angular wrapper, so daily habit completion trends can be visualized from checkbox-driven entries.

## What Was Changed

1. Added chart dependencies:
- Installed `chart.js`
- Installed `ng2-charts`

2. Enabled chart providers globally:
- Updated `src/app/app.config.ts`
- Added `provideCharts(withDefaultRegisterables())`

3. Added a vertical-slice local chart component:
- Created `src/app/slices/dashboard/components/habit-trend-chart/habit-trend-chart.component.ts`
- Implemented a starter line chart with daily labels and completion values

4. Integrated chart into the dashboard page:
- Updated `src/app/slices/dashboard/pages/dashboard/dashboard-page.component.ts`
- Added local chart component import and rendering

5. Addressed server rendering compatibility:
- Updated `src/app/app.routes.server.ts`
- Switched server route render mode to `RenderMode.Client` to avoid prerender runtime failures caused by browser-only chart behavior

## Decision Record: Why Chart.js and ng2-charts

### Decision

Use Chart.js as the chart engine with ng2-charts as the Angular integration layer.

### Why This Was Chosen

1. Angular fit:
ng2-charts provides Angular-native bindings and removes manual canvas lifecycle code.

2. Fast iteration for habit tracking:
The dashboard needs frequent updates when daily checkboxes are toggled. This combo supports simple reactive updates.

3. Sufficient feature set:
Line charts, tooltips, legend behavior, and styling are enough for monthly completion trends.

4. Lower complexity than advanced alternatives:
Implementation overhead is smaller than ECharts or D3 for this stage of the project.

5. Popular and well-documented:
Both libraries have broad usage and clear docs, reducing integration risk.

### Alternatives Considered

1. Chart.js only:
Rejected for now because Angular integration would require more manual chart instance lifecycle handling.

2. ECharts:
Powerful but higher setup complexity than required for current needs.

3. Highcharts:
Strong enterprise option, but licensing considerations are unnecessary for this phase.

4. D3:
Most flexible but overkill and significantly more custom code for the planned charts.

## How This Adheres to Vertical Slice Architecture

1. Slice-local implementation:
Chart UI was added under the dashboard slice instead of global shared UI prematurely.

2. Minimal cross-cutting impact:
Only app-level provider configuration was added in `app.config.ts`, while feature logic remains in the slice.

3. Feature-owned evolution path:
Future chart-specific transformations, data adapters, and interactions can stay in `slices/dashboard`.

## Validation

- Build status: pass (`ng build`)
- Runtime fix applied for SSR/prerender chart error
- Dashboard slice now renders the chart component

## Follow-Up Actions

1. Replace starter data with real month-based daily entries from your habit model.
2. Add month selector and recompute chart labels for the selected month.
3. Add one dataset per tracked habit (walk/read/code/leather) or keep an aggregate completed-count series.
4. Add a companion notes panel for enjoyed and did-not-enjoy daily text entries.
