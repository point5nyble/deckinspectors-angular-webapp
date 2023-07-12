import {createAction, props} from "@ngrx/store";

export const addPreviousState = createAction(
  '[backNavigationStateModel] Add to Previous State',
  props<{ addToPreviousState: any }>()
);

export const removePreviousState = createAction(
  '[backNavigationStateModel] Remove from Previous State',
  props<{ addToPreviousState: any }>()
);
