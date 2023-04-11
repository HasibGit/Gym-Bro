import { Action } from '@ngrx/store/src/models';
import * as authActions from './auth.actions';

export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false,
};

// takes in the state and action to perform on the state
export function authReducer(
  state = initialState,
  action: authActions.AuthActions
) {
  switch (action.type) {
    case authActions.AUTHENTICATE:
      return {
        isAuthenticated: true,
      };
    case authActions.UNAUTHENTICATE:
      return {
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

// as easy callback function that returns isLoading property of the uiState.
export const getIsAuthenticated = (state: State) => state.isAuthenticated;
