import { Injectable } from '@angular/core';
import { Exercise } from '../interfaces/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private allExercises: Exercise[] = [
    {
      id: 'jumping_jack',
      name: 'Jumping Jack',
      duration: 30,
      calories: 6,
    },
    {
      id: 'crunches',
      name: 'Crunches',
      duration: 60,
      calories: 20,
    },
    {
      id: 'push_up',
      name: 'Push Up',
      duration: 30,
      calories: 10,
    },
    {
      id: 'peck_deck_fly',
      name: 'Peck Deck Fly',
      duration: 40,
      calories: 5,
    },
    {
      id: 'preacher_curl',
      name: 'Preacher Curl',
      duration: 40,
      calories: 7,
    },
    {
      id: 'tricep_kicks',
      name: 'Tricep Kicks',
      duration: 50,
      calories: 4,
    },
  ];

  constructor() {}

  getAllExercises(): Exercise[] {
    return this.allExercises;
  }
}
