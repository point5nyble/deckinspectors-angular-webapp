import {ProjectStateModel} from "../store/project-state-model";
import {createReducer, on} from "@ngrx/store";
import {updateInvasiveBtnState, updateProject} from "./project-action";

export const initialState: Readonly<ProjectStateModel> = new ProjectStateModel();

export const projectReducer = createReducer(
  initialState,
  on(updateProject,  (state, {project}) => {
    return updateProjectParams(state, project);
  }),
  on(updateInvasiveBtnState,  (state, {project}) => {
    return updateInvasiveParams(state, project);
  })
);

// To update the state of the project
const updateProjectParams = (state: ProjectStateModel, project: ProjectStateModel) => {
  let newState: ProjectStateModel = new ProjectStateModel();
  if (project.state === undefined) {
    newState.state = state.state;
  } else {
    newState.state = project.state;
  }
  newState.isInvasiveBtnDisabled = state.isInvasiveBtnDisabled;
  console.log(newState);
  return newState;
}

// To update the state of the invasive button
const updateInvasiveParams = (state: ProjectStateModel, project: ProjectStateModel) => {
  let newState: ProjectStateModel = new ProjectStateModel();
  newState.state = state.state;
  newState.isInvasiveBtnDisabled = project.isInvasiveBtnDisabled;
  console.log(newState);
  return newState;
}
