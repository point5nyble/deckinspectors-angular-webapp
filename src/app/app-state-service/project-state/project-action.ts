import {createAction, props} from "@ngrx/store";

export const updateProject = createAction(
  '[ProjectModel] Project Update',
  props<{project: any}>());


export const updateInvasiveBtnState = createAction(
  '[ProjectModel] Project Invasive State Update',
  props<{project: any}>());

