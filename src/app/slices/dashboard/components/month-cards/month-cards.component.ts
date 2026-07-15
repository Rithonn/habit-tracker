import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MonthCard } from '../../models/dashboard.models';

@Component({
  selector: 'app-month-cards',
  standalone: true,
  template: `
    <section class="month-grid" aria-label="Month selection">
      @for (month of months; track month.value) {
        <button class="month-card" type="button" (click)="open.emit(month.value)">
          <span class="month-name">{{ month.label }}</span>
          <span class="month-meta">{{ summaryByMonth[month.value] }}</span>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" [style.width.%]="percentByMonth[month.value] ?? 0"></div>
          </div>
          <span class="month-percent">{{ percentByMonth[month.value] ?? 0 }}%</span>
        </button>
      }
    </section>
  `,
  styles: [
    `
      .month-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      @media (max-width: 900px) {
        .month-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 620px) {
        .month-grid {
          grid-template-columns: 1fr;
        }
      }

      .month-card {
        text-align: left;
        border: 1px solid var(--border);
        background: var(--card-gradient);
        border-radius: 0.75rem;
        padding: 1.2rem;
        min-height: 170px;
        cursor: pointer;
        display: grid;
        gap: 0.55rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      }

      .month-card:hover {
        border-color: color-mix(in srgb, var(--accent) 45%, var(--border) 55%);
        box-shadow: var(--shadow);
        transform: translateY(-2px);
      }

      .month-name {
        font-weight: 700;
        font-size: 1.05rem;
        color: var(--text);
      }

      .month-meta {
        color: var(--muted);
        font-size: 0.95rem;
      }

      .progress-track {
        width: 100%;
        height: 0.42rem;
        background: var(--surface-alt);
        border-radius: 999px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 70%, #ffffff 30%) 0%, var(--accent) 100%);
        transition: width 0.2s ease;
      }

      .month-percent {
        color: var(--accent);
        font-size: 0.92rem;
        font-weight: 600;
      }
    `,
  ],
})
export class MonthCardsComponent {
  @Input() months: MonthCard[] = [];
  @Input() summaryByMonth: Record<string, string> = {};
  @Input() percentByMonth: Record<string, number> = {};

  @Output() open = new EventEmitter<string>();
}
