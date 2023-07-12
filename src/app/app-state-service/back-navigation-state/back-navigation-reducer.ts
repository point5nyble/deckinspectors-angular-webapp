import {PreviousStateModel} from "../store/previous-state-model";
import {createReducer, on} from "@ngrx/store";
import {ProjectListElement} from "../../common/models/project-list-element";
import {addPreviousState, removePreviousState} from "./back-navigation-action";
import {BackNavigationStateModel} from "../store/back-navigation-state-model";

export const initialState: Readonly<BackNavigationStateModel> = new BackNavigationStateModel();
export const addPreviousStateModel = createReducer(
  initialState,
  on(addPreviousState,  (state, {addToPreviousState}) => {
    return addPreviousStateModelParams(state, addToPreviousState);
  }),
  on(removePreviousState,  (state, {addToPreviousState}) => {
    return removePreviousStateModelParams(state, addToPreviousState);
  })
);

const addPreviousStateModelParams = (state: BackNavigationStateModel, project: ProjectListElement) => {
  let previousState = new PreviousStateModel();
  previousState.stack = [...state.stack]
  previousState.stack.push(project);
  console.log("Previous state pushed ->", previousState);
  return previousState;
}

const removePreviousStateModelParams = (state: BackNavigationStateModel, project: ProjectListElement) => {
  let previousState = new PreviousStateModel();
  previousState.stack = [...state.stack];
  previousState.stack.pop();
  console.log("Previous state popped ->", previousState);
  return previousState;
}
