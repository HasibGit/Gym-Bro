export interface Exercise {
  userId?: string;
  Force: string;
  Name: string;
  'Primary Muscles': string[];
  SecondaryMuscles: string[];
  Type: string;
  'Workout Type': string[];
  'Youtube link': string;
  Sets?: number;
  Break?: number;
  SetDuration?: number;
  date?: Date;
  status?: 'completed' | 'cancelled' | null;
}
