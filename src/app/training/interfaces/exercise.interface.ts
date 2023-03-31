export interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date?: Date;
  status?: 'completed' | 'cancelled' | null;
}

export interface Exercise2 {
  Force: string;
  Name: string;
  'Primary Muscles': string[];
  SecondaryMuscles: string[];
  Type: string;
  'Workout Type': string[];
  'Youtube link': string;
  Reps?: number;
  Break?: number;
  RepDuration?: number;
  date?: Date;
  status?: 'completed' | 'cancelled' | null;
}
