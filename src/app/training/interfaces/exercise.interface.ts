export interface Exercise {
  userId?: string;
  Name: string;
  PrimaryMuscle: string;
  Sets?: number;
  Break?: number;
  SetDuration?: number;
  date?: Date;
  status?: 'completed' | 'cancelled' | null;
}
