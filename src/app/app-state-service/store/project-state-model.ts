export class ProjectStateModel {
  id: number = 0;
  state: ProjectState = ProjectState.VISUAL;
}

export enum ProjectState {
  VISUAL='VISUAL',
  INVASIVE='INVASIVE'
}
