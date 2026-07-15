import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type PersistedDashboardState = {
  entries?: Record<string, boolean>;
  journalEntries?: Record<string, string>;
  monthJournalDay?: Record<string, number>;
};

@Injectable({
  providedIn: 'root',
})
export class DashboardPersistenceService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly storageKey = 'habit-tracker:dashboard-state';

  load(): PersistedDashboardState {
    if (!this.isBrowser) {
      return {};
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as PersistedDashboardState;

      return {
        entries: this.toBooleanRecord(parsed.entries),
        journalEntries: this.toStringRecord(parsed.journalEntries),
        monthJournalDay: this.toPositiveNumberRecord(parsed.monthJournalDay),
      };
    } catch {
      return {};
    }
  }

  save(state: PersistedDashboardState): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private toBooleanRecord(value: unknown): Record<string, boolean> | undefined {
    if (!value || typeof value !== 'object') {
      return undefined;
    }

    const result: Record<string, boolean> = {};

    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === 'boolean') {
        result[key] = entry;
      }
    }

    return result;
  }

  private toStringRecord(value: unknown): Record<string, string> | undefined {
    if (!value || typeof value !== 'object') {
      return undefined;
    }

    const result: Record<string, string> = {};

    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === 'string') {
        result[key] = entry;
      }
    }

    return result;
  }

  private toPositiveNumberRecord(value: unknown): Record<string, number> | undefined {
    if (!value || typeof value !== 'object') {
      return undefined;
    }

    const result: Record<string, number> = {};

    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === 'number' && Number.isInteger(entry) && entry > 0) {
        result[key] = entry;
      }
    }

    return result;
  }
}
