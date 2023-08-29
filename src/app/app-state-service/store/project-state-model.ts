export class ProjectStateModel {
  id: number = 0;
  state: ProjectState = ProjectState.VISUAL;
  isInvasiveBtnDisabled: boolean = false;
}

export enum ProjectState {
  VISUAL='VISUAL',
  INVASIVE='INVASIVE'
}

export enum SectionState {
  VISUAL='VISUAL',
  INVASIVE='INVASIVE',
  CONCLUSIVE='CONCLUSIVE'
}
