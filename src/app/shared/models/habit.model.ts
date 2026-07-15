export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  archived?: boolean;
  createdAt: string;
}
