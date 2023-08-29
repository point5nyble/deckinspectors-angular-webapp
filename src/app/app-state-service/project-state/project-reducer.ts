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

const updateProjectParams = (state: ProjectStateModel, project: ProjectStateModel) => {
  return {...state,...project};
}

const updateInvasiveParams = (state: ProjectStateModel, project: ProjectStateModel) => {
  let newState = new ProjectStateModel();
  newState.isInvasiveBtnDisabled = project.isInvasiveBtnDisabled;
  return newState;
}
