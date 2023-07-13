import {PreviousStateModel} from "../store/previous-state-model";
import {createReducer, on} from "@ngrx/store";
import {updatePreviousState} from "./previous-state-action";

export const initialState: Readonly<PreviousStateModel> = new PreviousStateModel();

export const updatePreviousStateModel = createReducer(
  initialState,
  on(updatePreviousState,  (state, {previousState}) => {
    return updatePreviousStateModelParams(state, previousState);
  })
);
const updatePreviousStateModelParams = (state: PreviousStateModel, project: PreviousStateModel) => {
  return {...state,...project};
}
