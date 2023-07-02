import {createSelector} from "@ngrx/store";
import {ProjectStateModel} from "../store/project-state-model";

const getProjectModel = createSelector(
    (state: any) => state.project,
  (projectStateModel: ProjectStateModel) => projectStateModel
);

export const ProjectQuery = {
    getProjectModel
}
