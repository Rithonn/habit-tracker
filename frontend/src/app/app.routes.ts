import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './slices/auth/auth.routes';
import { DASHBOARD_ROUTES } from './slices/dashboard/dashboard.routes';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	...AUTH_ROUTES,
	...DASHBOARD_ROUTES,
	{ path: '**', redirectTo: 'dashboard' },
];
