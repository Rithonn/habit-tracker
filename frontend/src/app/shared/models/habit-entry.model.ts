export interface HabitEntry {
  id: string;
  userId: string;
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}
