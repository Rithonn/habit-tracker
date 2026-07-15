import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HabitCategory, JournalEntryUpdateEvent, MatrixToggleEvent, MonthCard } from '../models/dashboard.models';
import { DashboardPersistenceService } from './dashboard-persistence.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardStateService {
  private readonly persistence = inject(DashboardPersistenceService);
  private readonly persistedState = this.persistence.load();

  readonly currentMonthCard: MonthCard = this.createMonthCard(new Date());

  readonly categories: HabitCategory[] = [
    { id: 'running', name: 'Running' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'reading', name: 'Reading' },
  ];

  readonly months: MonthCard[] = this.buildMonthsForYear(new Date().getFullYear());
  readonly selectedMonth = signal<string | null>(null);
  readonly journalDay = signal(1);
  readonly monthJournalDay = signal<Record<string, number>>(
    this.persistedState.monthJournalDay ?? {},
  );
  readonly entries = signal<Record<string, boolean>>(
    this.persistedState.entries ?? {
      '2026-07|running|1': true,
      '2026-07|running|2': true,
      '2026-07|cooking|2': true,
      '2026-07|reading|1': true,
      '2026-07|reading|3': true,
      '2026-07|reading|4': true,
    },
  );
  readonly journalEntries = signal<Record<string, string>>(
    this.persistedState.journalEntries ?? {
      '2026-07|2': 'Today I felt energized after a morning run.',
      '2026-07|4': 'Cooking dinner helped me unwind and reset.',
    },
  );

  readonly dayNumbers = computed(() => {
    const month = this.selectedMonth();
    if (!month) {
      return [];
    }

    const totalDays = this.daysInMonth(month);
    return Array.from({ length: totalDays }, (_, index) => index + 1);
  });

  readonly completedCount = computed(() => {
    const month = this.selectedMonth();
    if (!month) {
      return 0;
    }

    const monthKey = `${month}|`;
    return Object.entries(this.entries()).filter(([key, value]) => key.startsWith(monthKey) && value)
      .length;
  });

  readonly totalCells = computed(() => this.dayNumbers().length * this.categories.length);

  readonly journalCalendarDays = computed<Array<number | null>>(() => {
    const month = this.selectedMonth();
    if (!month) {
      return [];
    }

    const firstWeekday = this.firstWeekdayOfMonth(month);
    const placeholders = Array.from({ length: firstWeekday }, () => null);
    return [...placeholders, ...this.dayNumbers()];
  });

  readonly summaryByMonth = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {};

    for (const month of this.months) {
      result[month.value] = this.completionSummary(month.value);
    }

    return result;
  });

  readonly percentByMonth = computed<Record<string, number>>(() => {
    const result: Record<string, number> = {};

    for (const month of this.months) {
      result[month.value] = this.completionPercent(month.value);
    }

    return result;
  });

  readonly checkedLookup = computed<Record<string, boolean>>(() => {
    const month = this.selectedMonth();
    if (!month) {
      return {};
    }

    const lookup: Record<string, boolean> = {};

    for (const category of this.categories) {
      for (const day of this.dayNumbers()) {
        const key = `${category.id}|${day}`;
        lookup[key] = Boolean(this.entries()[`${month}|${category.id}|${day}`]);
      }
    }

    return lookup;
  });

  readonly activeJournalText = computed(() => {
    const month = this.selectedMonth();
    if (!month) {
      return '';
    }

    return this.journalEntries()[`${month}|${this.journalDay()}`] ?? '';
  });

  readonly journalDaysWithEntry = computed<Record<number, boolean>>(() => {
    const month = this.selectedMonth();
    if (!month) {
      return {};
    }

    const result: Record<number, boolean> = {};

    for (const day of this.dayNumbers()) {
      result[day] = Boolean(this.journalEntries()[`${month}|${day}`]?.trim());
    }

    return result;
  });

  constructor() {
    effect(() => {
      this.persistence.save({
        entries: this.entries(),
        journalEntries: this.journalEntries(),
        monthJournalDay: this.monthJournalDay(),
      });
    });
  }

  selectedMonthLabel(): string {
    const month = this.selectedMonth();
    if (!month) {
      return '';
    }

    return this.monthLabel(month);
  }

  completionSummary(month: string): string {
    const total = this.daysInMonth(month) * this.categories.length;
    const done = Object.entries(this.entries()).filter(
      ([key, value]) => key.startsWith(`${month}|`) && value,
    ).length;

    return `${done}/${total} complete`;
  }

  completionPercent(month: string): number {
    const total = this.daysInMonth(month) * this.categories.length;
    if (total === 0) {
      return 0;
    }

    const done = Object.entries(this.entries()).filter(
      ([key, value]) => key.startsWith(`${month}|`) && value,
    ).length;

    return Math.round((done / total) * 100);
  }

  openMonth(month: string): void {
    this.selectedMonth.set(month);
    this.journalDay.set(this.monthJournalDay()[month] ?? this.defaultJournalDay(month));
  }

  closeMonth(): void {
    this.selectedMonth.set(null);
  }

  toggleDay(event: MatrixToggleEvent): void {
    if (!this.selectedMonth()) {
      return;
    }

    const key = this.entryKey(event.categoryId, event.day);

    this.entries.update((state) => ({
      ...state,
      [key]: event.checked,
    }));
  }

  setJournalDay(day: number): void {
    const month = this.selectedMonth();
    if (!month) {
      return;
    }

    const safeDay = Math.min(Math.max(day, 1), this.daysInMonth(month));
    this.journalDay.set(safeDay);
    this.monthJournalDay.update((state) => ({
      ...state,
      [month]: safeDay,
    }));
  }

  updateJournalEntry(event: JournalEntryUpdateEvent): void {
    const month = this.selectedMonth();
    if (!month) {
      return;
    }

    const key = `${month}|${event.day}`;

    this.journalEntries.update((state) => ({
      ...state,
      [key]: event.text,
    }));
  }

  private entryKey(categoryId: string, day: number): string {
    return `${this.selectedMonth()}|${categoryId}|${day}`;
  }

  private monthLabel(monthValue: string): string {
    const [yearRaw, monthRaw] = monthValue.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    const date = new Date(year, month - 1, 1);

    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private buildMonthsForYear(year: number): MonthCard[] {
    return Array.from({ length: 12 }, (_, index) => {
      const month = String(index + 1).padStart(2, '0');
      const value = `${year}-${month}`;
      return {
        value,
        label: this.monthLabel(value),
      };
    });
  }

  private createMonthCard(date: Date): MonthCard {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const value = `${year}-${month}`;

    return {
      value,
      label: this.monthLabel(value),
    };
  }

  private defaultJournalDay(monthValue: string): number {
    const today = new Date();
    const currentMonthValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    if (monthValue === currentMonthValue) {
      return today.getDate();
    }

    return 1;
  }

  private daysInMonth(monthValue: string): number {
    const [yearRaw, monthRaw] = monthValue.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    return new Date(year, month, 0).getDate();
  }

  private firstWeekdayOfMonth(monthValue: string): number {
    const [yearRaw, monthRaw] = monthValue.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    return new Date(year, month - 1, 1).getDay();
  }
}
