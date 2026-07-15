import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HabitCategory, JournalEntryUpdateEvent, MatrixToggleEvent } from '../../models/dashboard.models';

@Component({
  selector: 'app-monthly-habit-matrix',
  standalone: true,
  template: `
    <section class="controls" aria-label="Monthly habit controls">
      <div class="month-heading">
        <button class="back-btn" type="button" (click)="back.emit()">Back</button>
        <h2>{{ monthLabel }}</h2>
      </div>
      <p class="summary">
        Completed cells this month: <strong>{{ completedCount }}</strong> / {{ totalCells }}
      </p>
    </section>

    <section class="journal-panel" aria-label="Daily journal entry">
      <h3>Daily Journal Entry</h3>
      <p class="journal-help">Write one sentence about your day for a selected date.</p>
      <div class="journal-day-grid" role="group" aria-label="Pick a day to write your journal entry">
        @for (label of weekdayLabels; track label) {
          <span class="weekday-chip" aria-hidden="true">{{ label }}</span>
        }

        @for (day of journalCalendarDays; track $index) {
          @if (day === null) {
            <span class="journal-day-empty" aria-hidden="true"></span>
          } @else {
            <button
              type="button"
              class="journal-day-btn"
              [class.selected]="day === journalDay"
              [class.has-entry]="journalDaysWithEntry[day]"
              (click)="onJournalDayClick(day)"
              [attr.aria-label]="'Open journal for day ' + day"
              [attr.aria-pressed]="day === journalDay"
            >
              {{ day }}
            </button>
          }
        }
      </div>
      <label for="journal-text" class="journal-label">Entry for day {{ journalDay }}</label>
      <textarea
        id="journal-text"
        rows="3"
        [value]="journalText"
        [attr.maxlength]="journalMaxLength"
        (input)="onJournalTextChange($any($event.target).value)"
        placeholder="Example: I felt focused and calm after my evening walk."
      ></textarea>
      <p class="char-count">{{ journalText.length }} / {{ journalMaxLength }}</p>
    </section>

    <section class="matrix-panel" aria-label="Monthly habit matrix">
      <h3>Monthly Habit Matrix</h3>
      <div class="matrix-wrap">
        <table class="matrix">
          <thead>
            <tr>
              <th scope="col">Category</th>
              @for (day of dayNumbers; track day) {
                <th scope="col">{{ day }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (category of categories; track category.id) {
              <tr>
                <th scope="row">{{ category.name }}</th>
                @for (day of dayNumbers; track day) {
                  <td>
                    <input
                      type="checkbox"
                      [checked]="checkedLookup[category.id + '|' + day] ?? false"
                      (change)="onToggle(category.id, day, $any($event.target).checked)"
                      [attr.aria-label]="category.name + ' day ' + day"
                    />
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .controls,
      .matrix-panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 1rem;
      }

      .controls {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .month-heading {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .month-heading h2 {
        margin: 0;
      }

      .back-btn {
        border: 1px solid var(--border);
        background: var(--accent-soft);
        color: var(--accent);
        border-radius: 0.45rem;
        padding: 0.35rem 0.7rem;
        cursor: pointer;
        font: inherit;
        font-weight: 600;
      }

      .matrix-panel {
        display: grid;
        gap: 0.75rem;
      }

      .matrix-panel h3 {
        margin: 0;
      }

      .summary {
        margin: 0;
        color: var(--muted);
      }

      .matrix-wrap {
        overflow-x: auto;
      }

      .matrix {
        border-collapse: collapse;
        width: 100%;
      }

      .matrix th,
      .matrix td {
        border: 1px solid var(--border);
        text-align: center;
        min-width: 2.1rem;
        height: 2.1rem;
        padding: 0.15rem;
      }

      .matrix thead th {
        position: sticky;
        top: 0;
        background: var(--surface-alt);
        z-index: 1;
      }

      .matrix th[scope='row'],
      .matrix th[scope='col']:first-child {
        min-width: 8.5rem;
        text-align: left;
        padding: 0.35rem 0.5rem;
        background: var(--surface-alt);
      }

      .matrix input[type='checkbox'] {
        width: 1rem;
        height: 1rem;
      }

      .journal-panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 1rem;
        display: grid;
        gap: 0.6rem;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent);
      }

      .journal-panel h3,
      .journal-label {
        margin: 0;
      }

      .journal-help,
      .char-count {
        margin: 0;
        color: var(--muted);
      }

      .journal-day-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 0.35rem;
        padding: 0.35rem;
        border: 1px solid var(--border);
        border-radius: 0.6rem;
        background: color-mix(in srgb, var(--surface-alt) 55%, transparent);
      }

      .weekday-chip {
        font-size: 0.74rem;
        font-weight: 600;
        color: var(--muted);
        text-align: center;
        padding-block: 0.2rem;
      }

      .journal-day-empty {
        min-height: 2.2rem;
        border: 1px dashed color-mix(in srgb, var(--border) 75%, transparent);
        border-radius: 0.45rem;
        background: color-mix(in srgb, var(--surface-alt) 85%, transparent);
      }

      .journal-day-btn {
        border: 1px solid var(--border);
        background: var(--surface-alt);
        color: var(--text);
        border-radius: 0.45rem;
        min-height: 2.2rem;
        cursor: pointer;
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      }

      .journal-day-btn:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
      }

      .journal-day-btn.has-entry {
        border-color: color-mix(in srgb, var(--accent) 70%, var(--border));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent);
      }

      .journal-day-btn.selected {
        background: var(--accent);
        color: #ffffff;
        border-color: var(--accent);
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent);
      }

      textarea {
        border: 1px solid var(--border);
        background: var(--surface-alt);
        color: var(--text);
        border-radius: 0.45rem;
        font: inherit;
      }

      textarea {
        width: 100%;
        resize: vertical;
        min-height: 72px;
        padding: 0.55rem;
      }

      .char-count {
        font-size: 0.82rem;
        text-align: right;
      }
    `,
  ],
})
export class MonthlyHabitMatrixComponent {
  readonly weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  @Input() monthLabel = '';
  @Input() dayNumbers: number[] = [];
  @Input() journalCalendarDays: Array<number | null> = [];
  @Input() categories: HabitCategory[] = [];
  @Input() completedCount = 0;
  @Input() totalCells = 0;
  @Input() checkedLookup: Record<string, boolean> = {};
  @Input() journalDay = 1;
  @Input() journalText = '';
  @Input() journalDaysWithEntry: Record<number, boolean> = {};
  @Input() journalMaxLength = 180;

  @Output() back = new EventEmitter<void>();
  @Output() toggled = new EventEmitter<MatrixToggleEvent>();
  @Output() journalDayChanged = new EventEmitter<number>();
  @Output() journalEntryUpdated = new EventEmitter<JournalEntryUpdateEvent>();

  onToggle(categoryId: string, day: number, checked: boolean): void {
    this.toggled.emit({ categoryId, day, checked });
  }

  onJournalDayClick(day: number): void {
    this.journalDayChanged.emit(day);
  }

  onJournalTextChange(text: string): void {
    this.journalEntryUpdated.emit({
      day: this.journalDay,
      text,
    });
  }
}
