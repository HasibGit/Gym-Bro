import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromUI from '../../shared/state/ui.reducer';

// whole applications state is stored here
export interface State {
  ui: fromUI.State;
}

// all the reducers of the application, mapped as key-value
export const reducers: ActionReducerMap<State> = {
  ui: fromUI.uiReducer,
};

export const getUiState = createFeatureSelector<fromUI.State>('ui'); // createFeatureSelector to get a slice of whole applications state
export const getIsLoading = createSelector(getUiState, fromUI.getIsLoading); // createSelector has a callback function as parameter. First parameter
// takes the slice of the state u are interested in. Second parameter is a callback function which takes in the state passed in the first parameter and from that function u can return whatever u r interested in regarding that state
