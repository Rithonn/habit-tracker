import { Component, inject } from '@angular/core';
import { MonthCardsComponent } from '../../components/month-cards/month-cards.component';
import { MonthlyHabitMatrixComponent } from '../../components/monthly-habit-matrix/monthly-habit-matrix.component';
import { JournalEntryUpdateEvent, MatrixToggleEvent } from '../../models/dashboard.models';
import { DashboardStateService } from '../../services/dashboard-state.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MonthCardsComponent, MonthlyHabitMatrixComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private readonly state = inject(DashboardStateService);

  readonly currentMonthCard = this.state.currentMonthCard;
  readonly categories = this.state.categories;
  readonly months = this.state.months;
  readonly selectedMonth = this.state.selectedMonth;
  readonly journalDay = this.state.journalDay;
  readonly dayNumbers = this.state.dayNumbers;
  readonly completedCount = this.state.completedCount;
  readonly totalCells = this.state.totalCells;
  readonly journalCalendarDays = this.state.journalCalendarDays;
  readonly summaryByMonth = this.state.summaryByMonth;
  readonly percentByMonth = this.state.percentByMonth;
  readonly checkedLookup = this.state.checkedLookup;
  readonly activeJournalText = this.state.activeJournalText;
  readonly journalDaysWithEntry = this.state.journalDaysWithEntry;

  selectedMonthLabel(): string {
    return this.state.selectedMonthLabel();
  }

  completionSummary(month: string): string {
    return this.state.completionSummary(month);
  }

  completionPercent(month: string): number {
    return this.state.completionPercent(month);
  }

  openMonth(month: string): void {
    this.state.openMonth(month);
  }

  closeMonth(): void {
    this.state.closeMonth();
  }

  toggleDay(event: MatrixToggleEvent): void {
    this.state.toggleDay(event);
  }

  setJournalDay(day: number): void {
    this.state.setJournalDay(day);
  }

  updateJournalEntry(event: JournalEntryUpdateEvent): void {
    this.state.updateJournalEntry(event);
  }
}
