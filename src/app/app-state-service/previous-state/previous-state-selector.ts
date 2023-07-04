import {createSelector} from "@ngrx/store";
import {PreviousStateModel} from "../store/previous-state-model";

const getPreviousStateModel = createSelector(
  (state: any) => state.previousState,
  (previousStateModel: PreviousStateModel) => previousStateModel
);

export const PreviousStateModelQuery = {
  getPreviousStateModel
}
