# Daily Habit Tracker (Angular First, Go Later)

This guide is designed so you can start with zero hosting cost.
You will build the full front-end first, persist data locally, and then connect a Go API when ready.

## 1) What You Will Build

- Angular web app with:
  - Register and login pages
  - Habit dashboard
  - Daily check-off actions
  - History view for past entries
  - Local persistence so entries remain after browser restarts
- Later phase:
  - Replace local storage with a Go REST API + database

## 2) Cost-Free Plan (Phase by Phase)

- Phase 1: Angular app + localStorage persistence (free)
- Phase 2: Optional local Go API on your machine (still free)
- Phase 3: Deploy when ready (can stay free on hobby tiers)

## 3) Prerequisites

Install these once:

- Node.js LTS (v20+ recommended)
- Angular CLI

PowerShell commands:

```powershell
node -v
npm -v
npm install -g @angular/cli
ng version
```

## 4) Create the Angular Project

From your workspace root:

```powershell
ng new habit-tracker --routing --style=scss
cd habit-tracker
ng serve -o
```

Choose defaults unless you have a preference.

## 5) Generate the Feature Skeleton

Run:

```powershell
ng g c features/auth/login
ng g c features/auth/register
ng g c features/dashboard/habit-dashboard
ng g c features/habits/habit-form
ng g c features/history/history-calendar

ng g s core/services/auth
ng g s core/services/habit
ng g s core/services/storage
ng g s core/services/session

ng g guard core/guards/auth
ng g interceptor core/interceptors/auth
```

Suggested folder structure:

```text
src/app/
  core/
    guards/
    interceptors/
    services/
  features/
    auth/
      login/
      register/
    dashboard/
      habit-dashboard/
    habits/
      habit-form/
    history/
      history-calendar/
  shared/
    components/
    models/
    utils/
```

## 6) Define Front-End Data Models

Create model files in src/app/shared/models:

- user.model.ts
- habit.model.ts
- habit-entry.model.ts

Use this shape:

```ts
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  archived?: boolean;
}

export interface HabitEntry {
  id: string;
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}
```

## 7) Implement Local Persistence First

Use localStorage keys:

- ht_users
- ht_current_user
- ht_habits
- ht_entries

StorageService responsibilities:

- getItem<T>(key)
- setItem<T>(key, value)
- removeItem(key)
- clearAll()

This gives persistence across logins on the same browser/device at zero cost.

## 8) Authentication (Front-End Local Version)

AuthService methods:

- register(name, email, password)
- login(email, password)
- logout()
- getCurrentUser()
- isAuthenticated()

Notes:

- For this local phase, you can store a simple hashed value or plain password while prototyping.
- For production, never store plain passwords in localStorage. Use backend auth.

AuthGuard:

- Allow navigation only if authenticated
- Redirect to /login otherwise

## 9) Habit Management

HabitService methods:

- listHabits(userId)
- createHabit(payload)
- updateHabit(habitId, payload)
- archiveHabit(habitId)
- deleteHabit(habitId) optional

Entry methods (in HabitService or separate EntryService):

- toggleEntry(habitId, date)
- setEntry(habitId, date, completed)
- getEntriesByDateRange(startDate, endDate)
- getDailyStatus(date)

Rule to enforce:

- One entry per habit per date

## 10) App Routes

Set app routes like this:

```ts
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: HabitDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: HistoryCalendarComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
];
```

## 11) Dashboard Features

In HabitDashboardComponent implement:

- Welcome header with user name
- Habit list with today checkboxes
- Add habit button
- Today completion summary
- Quick streak indicator (optional)

Simple completion formula:

- completionRate = completedToday / totalActiveHabits

## 12) History Page Features

In HistoryCalendarComponent implement:

- Date selector or mini calendar
- Selected-day entries
- Week and month summaries
- Optional heatmap style grid later

This page is where users check past entries after login.

## 13) UI Kit (Optional but Helpful)

Add Angular Material:

```powershell
ng add @angular/material
```

Useful components:

- MatToolbar
- MatCard
- MatCheckbox
- MatDatepicker
- MatDialog
- MatSnackBar

## 14) Front-End Testing Checklist

Minimum manual checks:

- Register new user
- Logout/login with same user
- Add 2-3 habits
- Mark habits complete today
- Reload browser, verify data still there
- Open history and verify previous dates
- Verify route guard redirects when logged out

Run tests/build:

```powershell
ng test
ng build
```

## 15) How to Transition to Go Backend Later

Keep your Angular interfaces as-is and swap service implementations.

### 15.1 API contract to target

Auth:

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET /api/v1/auth/me

Habits:

- GET /api/v1/habits
- POST /api/v1/habits
- PUT /api/v1/habits/:id
- DELETE /api/v1/habits/:id

Entries:

- GET /api/v1/entries?start=YYYY-MM-DD&end=YYYY-MM-DD
- PUT /api/v1/entries/:habitId/:date

### 15.2 Angular migration approach

- Introduce environment.apiBaseUrl
- Replace localStorage calls with HttpClient calls
- Keep UI components unchanged
- Keep AuthGuard unchanged except token validation behavior

### 15.3 Go stack recommendation (later)

- Go + Gin or Fiber
- PostgreSQL
- GORM or sqlc
- JWT auth
- Docker Compose for local dev

## 16) Suggested Implementation Order (Fastest Path)

1. Project creation and route skeleton
2. Models and storage service
3. Auth (register/login/logout) + guard
4. Habit CRUD on dashboard
5. Daily toggle and summary
6. History page date filtering
7. UI polish and validation
8. Swap to Go API when ready

## 17) What "Persistence Across Logins" Means Right Now

In this front-end-first phase, persistence works on the same browser/device through localStorage.

When you move to Go + database, persistence becomes account-based across devices and browsers.

## 18) Optional Next Step After This Guide

Once your Angular version works, create the Go API with the same model shapes and endpoint names to avoid refactoring the UI.

---

If you follow this file in order, you will have a working daily habit tracker front-end with login and historical tracking before paying for any hosting.
