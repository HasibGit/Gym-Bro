import { Action } from '@ngrx/store';
import { Exercise } from '../interfaces/exercise.interface';

export const SET_ALL_MUSCLE_GROUPS = '[TRAINING] SET MUSCLE GROUPS';
export const SET_PAST_EXERCIESES = '[TRAINING] SET PAST EXERCISES';
export const START_TRAINING = '[TRAINING] START TRAINING';
export const STOP_TRAINING = '[TRAINING] STOP TRAINING';

export class SetAllMuscleGroups implements Action {
  readonly type = SET_ALL_MUSCLE_GROUPS;

  constructor(public payload: string[]) {}
}

export class SetPastExercises implements Action {
  readonly type = SET_PAST_EXERCIESES;

  constructor(public payload: Exercise[]) {}
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;

  constructor(public payload: Exercise) {}
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;

  constructor(public payload: Exercise) {}
}

export type TrainingActions =
  | SetAllMuscleGroups
  | SetPastExercises
  | StartTraining
  | StopTraining;
