# Angular CLI Reference

A practical command guide for day-to-day Angular development.

## What Angular CLI Is

Angular CLI is the command-line tool used to create, run, generate, build, and maintain Angular applications.

Command format:

```powershell
ng <command> [options]
```

Examples:

```powershell
ng version
ng help
```

## First Important Fix

Use:

```powershell
ng serve
```

Not:

```powershell
ng server
```

`serve` starts the dev server. `server` is not a valid command.

## Most Useful Commands

### Project setup

```powershell
ng new habit-tracker --routing --style=scss
cd habit-tracker
```

Useful options:

- `--standalone` create standalone-component style app (modern default in new Angular)
- `--ssr` enable server-side rendering
- `--skip-git` do not initialize Git
- `--package-manager npm|pnpm|yarn|bun`

### Run dev server

```powershell
ng serve
ng serve -o
ng serve --port 4300
ng serve --host 0.0.0.0
```

### Build

```powershell
ng build
ng build --configuration production
ng build --watch
```

### Test

```powershell
ng test
```

### Generate code

```powershell
ng g c features/auth/login
ng g c features/auth/register
ng g s core/services/auth
ng g guard core/guards/auth
ng g interceptor core/interceptors/auth
ng g interface shared/models/habit --type=model
```

Short aliases:

- `generate` -> `g`
- `component` -> `c`
- `service` -> `s`
- `guard` -> `g` with type guard context, so prefer explicit `guard` for clarity

## Generate Command Patterns

### Component

```powershell
ng g c features/history/history-calendar --standalone --change-detection OnPush
```

Helpful options:

- `--standalone`
- `--inline-template`
- `--inline-style`
- `--skip-tests`
- `--change-detection OnPush`

### Service

```powershell
ng g s core/services/habit
```

### Guard

```powershell
ng g guard core/guards/auth --functional
```

### Interceptor

```powershell
ng g interceptor core/interceptors/auth
```

## Workspace and Config Commands

```powershell
ng config
ng config projects.habit-tracker.architect.build.options.outputPath
```

Use `ng config` to read or write values in `angular.json`.

## Dependencies and Integrations

```powershell
ng add @angular/material
ng add @angular/pwa
```

`ng add` installs and applies package-specific setup automatically.

## Updates and Maintenance

```powershell
ng update
ng update @angular/core @angular/cli
```

Before updates:

1. Commit current work.
2. Run `ng update` and follow migration notes.
3. Run `ng test` and `ng build` after migration.

## Help and Discovery

```powershell
ng help
ng g --help
ng build --help
```

Use `--help` heavily to discover options quickly.

## High-Value Workflow for Feature Development

1. Generate feature files

```powershell
ng g c features/habits/habit-list
ng g c features/habits/habit-form
ng g s core/services/habit
```

2. Run app

```powershell
ng serve -o
```

3. Validate

```powershell
ng test
ng build
```

## Angular CLI and Environment Files

Common files:

- `angular.json` CLI workspace config
- `package.json` scripts and dependencies
- `src/environments/` environment-specific config (if present in your setup)

Typical environment usage:

- development API base URL for local testing
- production API base URL for deployment

## npm Script Shortcuts (Optional)

You can also run CLI commands through npm scripts:

```powershell
npm run start
npm run build
npm run test
```

These call Angular CLI under the hood based on `package.json` scripts.

## Troubleshooting

### ng is not recognized

- Ensure Node.js is installed: `node -v`
- Install CLI globally: `npm install -g @angular/cli`
- Restart terminal after install

### Wrong command name

If command fails, check with:

```powershell
ng help
```

Example: use `ng serve`, not `ng server`.

### Port already in use

```powershell
ng serve --port 4300
```

### Dependency mismatch after install/update

```powershell
npm install
ng version
```

Confirm `@angular/cli` and Angular package versions are compatible.

## Suggested Commands for Your Habit Tracker

```powershell
ng g c features/auth/login
ng g c features/auth/register
ng g c features/dashboard/habit-dashboard
ng g c features/history/history-calendar
ng g s core/services/auth
ng g s core/services/habit
ng g guard core/guards/auth
ng g interceptor core/interceptors/auth
ng serve -o
ng test
ng build --configuration production
```

## One-Line Cheat Sheet

- Create app: `ng new <name>`
- Generate code: `ng g ...`
- Run local app: `ng serve`
- Run tests: `ng test`
- Production build: `ng build --configuration production`
- Add integrations: `ng add <package>`
- Upgrade Angular: `ng update`
