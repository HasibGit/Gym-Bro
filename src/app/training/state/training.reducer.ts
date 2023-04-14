import { Action } from '@ngrx/store/src/models';
import { Exercise } from '../interfaces/exercise.interface';
import * as trainingActions from './training.actions';
import * as fromRoot from '../../state/app/app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  allMuscleGroups: String[];
  pastExercieses: Exercise[];
  currentExercise: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  allMuscleGroups: [],
  pastExercieses: [],
  currentExercise: null,
};

// takes in the state and action to perform on the state
export function trainingReducer(
  state = initialState,
  action: trainingActions.TrainingActions
) {
  switch (action.type) {
    case trainingActions.SET_ALL_MUSCLE_GROUPS:
      return {
        ...state,
        allMuscleGroups: action.payload,
      };
    case trainingActions.SET_PAST_EXERCIESES:
      return {
        ...state,
        pastExercises: action.payload,
      };
    case trainingActions.START_TRAINING:
      return {
        ...state,
        currentExercise: action.payload,
      };
    case trainingActions.STOP_TRAINING:
      return {
        ...state,
        currentExercise: action.payload,
      };
    default:
      return state;
  }
}

// as easy callback functions for accessing state data fast

export const getTrainingState =
  createFeatureSelector<TrainingState>('training');

export const getAllMuscleGroups = createSelector(
  getTrainingState,
  (state: TrainingState) => state.allMuscleGroups
);
export const getPastExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.pastExercieses
);
export const getCurrentExercise = createSelector(
  getTrainingState,
  (state: TrainingState) => state.currentExercise
);
