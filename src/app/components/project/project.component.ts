import {Component, Input} from '@angular/core';
import {Project} from "../../common/models/project";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent{
  @Input() projectInfo!: Project;
}
