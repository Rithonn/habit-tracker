# Angular for React Developers

This is a practical reference for developers coming from React.

Use this as a translation guide while building features in Angular.

## 1. Quick Mental Model Mapping

| React | Angular |
|---|---|
| Component function | Component class + template |
| JSX | HTML template with directives |
| Props | `@Input()` |
| Callback props | `@Output()` + `EventEmitter` |
| useState | Component fields or Signals |
| useEffect | Lifecycle hooks (`ngOnInit`, `ngOnDestroy`) |
| Context API | Services + Dependency Injection |
| Redux/Zustand | Services + RxJS + Signals |
| React Router | Angular Router |
| Fetch/Axios | `HttpClient` |
| Custom hooks | Services, directives, utility functions |

## 2. How Angular Is Structured

Angular apps are made of:

- Components: UI blocks
- Templates: HTML with Angular bindings
- Services: reusable business logic and state
- Dependency Injection: built-in system to provide services
- Router: URL-to-view mapping
- Forms: template-driven and reactive forms
- HttpClient: API communication

Unlike React, Angular is a full framework with official patterns for most concerns.

## 3. Component Basics

### React style

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello {name}</h1>;
}
```

### Angular style

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  standalone: true,
  template: `<h1>Hello {{ name }}</h1>`,
})
export class GreetingComponent {
  @Input() name = '';
}
```

Key difference:

- React: JS renders UI directly.
- Angular: template is separate from component logic.

## 4. Data Flow: Props and Events

Parent to child is `@Input()`.
Child to parent is `@Output()`.

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ value }}</p>
    <button (click)="increment.emit()">+1</button>
  `,
})
export class CounterComponent {
  @Input() value = 0;
  @Output() increment = new EventEmitter<void>();
}
```

## 5. State Management Patterns

You can start simple:

- Local UI state in component fields/signals
- Shared app state in services

Example service with signal state:

```ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HabitStore {
  private habits = signal<string[]>([]);

  readonly all = this.habits.asReadonly();
  readonly count = computed(() => this.habits().length);

  addHabit(name: string): void {
    this.habits.update((list) => [...list, name]);
  }
}
```

Think of this like a lightweight global store.

## 6. Effects and Lifecycle

React `useEffect` maps roughly to Angular lifecycle hooks:

- `ngOnInit`: run setup logic after component creation
- `ngOnDestroy`: cleanup subscriptions/timers

```ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `<p>Example</p>`,
})
export class ExampleComponent implements OnInit, OnDestroy {
  private sub?: Subscription;

  ngOnInit(): void {
    // start side effects here
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
```

## 7. Template Syntax You Will Use Daily

- Interpolation: `{{ value }}`
- Property binding: `[disabled]="isSaving"`
- Event binding: `(click)="save()"`
- Two-way binding (forms): `[(ngModel)]="form.name"`
- Conditional rendering: `@if (isLoggedIn) { ... }`
- List rendering: `@for (habit of habits; track habit.id) { ... }`

Modern Angular uses built-in control flow (`@if`, `@for`) instead of older structural syntax in new code.

## 8. Routing (React Router vs Angular Router)

React:

- Typically define route tree in JSX

Angular:

- Define route config array and map URL to component

```ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HabitDashboardComponent } from './features/dashboard/habit-dashboard/habit-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: HabitDashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
```

Route guards are first-class for auth checks.

## 9. Forms (Big Angular Strength)

Use Reactive Forms for serious forms.

```ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input type="email" formControlName="email" />
      <input type="password" formControlName="password" />
      <button type="submit" [disabled]="form.invalid">Login</button>
    </form>
  `,
})
export class LoginComponent {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    console.log(this.form.value);
  }
}
```

## 10. HTTP and API Calls

Use `HttpClient` with typed responses.

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Habit {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class HabitApiService {
  constructor(private http: HttpClient) {}

  listHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>('/api/v1/habits');
  }
}
```

Interceptors are built-in for auth token handling, logging, and retry policies.

## 11. Dependency Injection (DI)

React often passes dependencies by props/context.
Angular injects dependencies through constructors.

```ts
constructor(private authService: AuthService) {}
```

Benefits:

- Less prop drilling
- Easy testing and mocking
- Consistent service lifecycles

## 12. Change Detection and Performance

Tips:

- Prefer `ChangeDetectionStrategy.OnPush` for performance-sensitive components
- Use `track` in `@for` loops
- Keep templates simple and move heavy logic into component/service

## 13. File and Naming Conventions

Typical Angular naming:

- `something.component.ts`
- `something.service.ts`
- `something.guard.ts`
- `something.model.ts`

Keep feature-first structure:

```text
src/app/
  core/          // singleton services, guards, interceptors
  shared/        // reusable UI and utilities
  features/      // auth, dashboard, habits, history
```

## 14. Testing Differences

React ecosystem varies by toolchain.
Angular includes testing conventions out of the box.

- Unit tests: Jasmine/Karma (default), or Jest if configured
- Component tests: TestBed
- E2E: Cypress or Playwright

For your habit tracker, start by testing:

- AuthService login/register logic
- HabitService toggle entry behavior
- Route guard behavior

## 15. Build and CLI Commands You Will Use Most

```powershell
ng serve
ng build
ng test
ng g c features/habits/habit-list
ng g s core/services/habit
ng g guard core/guards/auth
```

## 16. React-to-Angular Translation Cheatsheet

- `useState(...)` -> component field/signal
- `useEffect(() => {...}, [])` -> `ngOnInit`
- `useEffect(() => () => cleanup, [])` -> `ngOnDestroy`
- `props.value` -> `@Input() value`
- `onClick={handler}` -> `(click)="handler()"`
- `value={x} onChange={...}` -> `[(ngModel)]` or Reactive Form controls
- context provider -> DI service
- axios/fetch wrapper -> HttpClient service
- private routes -> route guards

## 17. Recommended Angular Abilities to Lean On

For your habit tracker, Angular gives you strong built-ins:

- Reactive forms with validation
- Route guards for auth
- Interceptors for JWT/token logic
- RxJS streams for async workflows
- Signals for local and shared reactive state
- CLI code generation for speed and consistency

## 18. Practical Advice for a React Developer

- Do not fight templates. Let Angular templates do view binding.
- Put business logic in services, not templates.
- Start with feature folders, not type folders.
- Use Reactive Forms for auth and habit forms.
- Keep interfaces for API models early to simplify backend integration.

## 19. Suggested Learning Path (Short)

1. Build login + register using Reactive Forms
2. Add route guard and protected dashboard
3. Build habit CRUD with a service
4. Add daily entry toggles and history page
5. Add API service layer and later switch from local storage to Go backend

---

If you use this guide while coding, you will avoid most React-to-Angular friction and move faster with Angular's native patterns.
