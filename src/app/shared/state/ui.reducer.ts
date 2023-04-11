import { Action } from '@ngrx/store/src/models';
import * as uiActions from './ui.actions';

export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false,
};

// takes in the state and action to perform on the state
export function uiReducer(state = initialState, action: Action) {
  switch (action.type) {
    case uiActions.START_LOADING:
      return {
        isLoading: true,
      };
    case uiActions.STOP_LOADING:
      return {
        isLoading: false,
      };
    default:
      return state;
  }
}

// as easy callback function that returns isLoading property of the uiState.
export const getIsLoading = (state: State) => state.isLoading;
