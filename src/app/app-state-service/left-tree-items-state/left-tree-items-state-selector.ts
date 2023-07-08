import {createSelector} from "@ngrx/store";
import {LeftTreeItemsStateModel} from "../store/left-tree-items-state-model";

const getLeftTreeList = createSelector(
  (state: any) => state.leftTreeItemsState,
  (leftTreeItemsStateModel:LeftTreeItemsStateModel) => leftTreeItemsStateModel
);

export const LeftTreeListModelQuery = {
  getLeftTreeList
}
