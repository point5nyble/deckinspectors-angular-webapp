import {createAction, props} from "@ngrx/store";

export const updateProject = createAction(
  '[ProjectModel] Project Update',
  props<{project: any}>());
