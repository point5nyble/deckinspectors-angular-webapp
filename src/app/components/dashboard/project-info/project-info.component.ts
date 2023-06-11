import { Component, Input } from '@angular/core';
import { ProjectInfo } from 'src/app/common/models/project-info';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent {
  @Input() projectInfo!: ProjectInfo;
}
