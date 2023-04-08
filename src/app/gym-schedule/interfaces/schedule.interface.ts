import { Exercise } from '../../training/interfaces/exercise.interface';

export interface Schedule {
  userId?: string;
  Sunday: Exercise[];
  Monday: Exercise[];
  Tuesday: Exercise[];
  Wednesday: Exercise[];
  Thursday: Exercise[];
  Friday: Exercise[];
  Saturday: Exercise[];
}
