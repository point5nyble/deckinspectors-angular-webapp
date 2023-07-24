import {ProjectStateModel} from "../store/project-state-model";
import {createReducer, on} from "@ngrx/store";
import {updateProject} from "./project-action";

export const initialState: Readonly<ProjectStateModel> = new ProjectStateModel();

  export const projectReducer = createReducer(
  initialState,
  on(updateProject,  (state, {project}) => {
    return updateProjectParams(state, project);
  })
  );

const updateProjectParams = (state: ProjectStateModel, project: ProjectStateModel) => {
  console.log("Inside Current Project Reducer", {...state,...project})
  return {...state,...project};
}
