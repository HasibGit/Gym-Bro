import { Exercise } from '../../training/interfaces/exercise.interface';

export interface Schedule {
  Sunday: Exercise[];
  Monday: Exercise[];
  Tuesday: Exercise[];
  Wednesday: Exercise[];
  Thursday: Exercise[];
  Friday: Exercise[];
  Saturday: Exercise[];
}
