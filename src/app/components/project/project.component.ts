import { Component, Input } from '@angular/core';
import { ProjectInfo } from 'src/app/common/models/project-info';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  showPartInfo: boolean = true;
  @Input() projectInfo!: ProjectInfo;
  public gotoPartInfo(): void {
    this.showPartInfo = false;
    console.log(this.showPartInfo);
    // this.cdr.detectChanges();
  }
}
