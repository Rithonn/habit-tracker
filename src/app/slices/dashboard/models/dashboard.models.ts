export type HabitCategory = {
  id: string;
  name: string;
};

export type MonthCard = {
  value: string;
  label: string;
};

export type MatrixToggleEvent = {
  categoryId: string;
  day: number;
  checked: boolean;
};

export type JournalEntryUpdateEvent = {
  day: number;
  text: string;
};
