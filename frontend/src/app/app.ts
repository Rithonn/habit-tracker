import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { HealthApiService } from './shared/services/health-api.service';

type ApiHealthState = 'checking' | 'online' | 'offline';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly healthApi = inject(HealthApiService);

  readonly isDark = signal(false);
  readonly apiHealthState = signal<ApiHealthState>('checking');

  constructor() {
    this.initializeTheme();
    this.checkApiHealth();
  }

  toggleTheme(): void {
    this.isDark.update((value) => !value);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ht_theme', this.isDark() ? 'dark' : 'light');
    }
  }

  checkApiHealth(): void {
    this.apiHealthState.set('checking');

    this.healthApi.checkHealth().subscribe({
      next: (response) => {
        this.apiHealthState.set(response.status === 'ok' ? 'online' : 'offline');
      },
      error: () => {
        this.apiHealthState.set('offline');
      },
    });
  }

  private initializeTheme(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = window.localStorage.getItem('ht_theme');

    if (saved === 'dark' || saved === 'light') {
      this.isDark.set(saved === 'dark');
      return;
    }

    this.isDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}
