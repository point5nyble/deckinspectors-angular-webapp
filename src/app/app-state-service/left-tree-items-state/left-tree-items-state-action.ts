import {createAction, props} from "@ngrx/store";
import {Item} from "../../common/models/project-tree";

export const saveLeftTreeItems = createAction(
  '[LeftTreeItemsStateModel] Left Tree State Model',
  props<{ leftTreeItemsState: Item[] }>()
);
