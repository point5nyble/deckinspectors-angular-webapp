import {createReducer, on} from "@ngrx/store";
import {LeftTreeItemsStateModel} from "../store/left-tree-items-state-model";
import {saveLeftTreeItems} from "./left-tree-items-state-action";
import {Item} from "../../common/models/project-tree";

export const initialState: Readonly<LeftTreeItemsStateModel> = new LeftTreeItemsStateModel();

export const addLeftTreeItems = createReducer(
  initialState,
  on(saveLeftTreeItems,  (state, {leftTreeItemsState}) => {
    return addLeftTreeItemsToState(state, leftTreeItemsState);
  })
);

const addLeftTreeItemsToState = (state: LeftTreeItemsStateModel, leftTreeItemsStateModel: Item[]) => {
  let leftTreeItemsStateModel1 = new LeftTreeItemsStateModel();
  leftTreeItemsStateModel1.items = leftTreeItemsStateModel;
  return leftTreeItemsStateModel1;
}


