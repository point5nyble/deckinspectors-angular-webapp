import {createSelector} from "@ngrx/store";
import {BackNavigationStateModel} from "../store/back-navigation-state-model";

const getPreviousStateModelChain = createSelector(
  (state: any) => state.addToPreviousState,
  (backNavigationStateModel: BackNavigationStateModel) => backNavigationStateModel
);

export const BackNavigation = {
  getPreviousStateModelChain
}
