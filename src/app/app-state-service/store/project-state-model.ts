export class ProjectStateModel {
  id: number = 0;
  state: ProjectState = ProjectState.NORMAL;
}

export enum ProjectState {
  NORMAL='NORMAL',
  INVASIVE='INVASIVE'
}
