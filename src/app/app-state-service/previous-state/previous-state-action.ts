import {createAction, props} from "@ngrx/store";

export const updatePreviousState = createAction(
  '[PreviousStateModel] Update Previous State',
  props<{ previousState: any }>()
);
