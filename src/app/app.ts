import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly isDark = signal(false);

  constructor() {
    this.initializeTheme();
  }

  toggleTheme(): void {
    this.isDark.update((value) => !value);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ht_theme', this.isDark() ? 'dark' : 'light');
    }
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
