import { ProjectInfo } from '../../common/models/project-info';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showProjectInfo: boolean = true;
  projectInfo! :ProjectInfo;
  constructor(private cdr: ChangeDetectorRef) {}

  // Create a list of projectInfo class
  projectInfos : ProjectInfo[] = [
    new ProjectInfo('Associate Professional Service', 'May 23, 2023', '60 Quintard st, CA 91911', ['Paul Bazek']),
    new ProjectInfo('Associate Professional Service', 'May 23, 2023', '60 Quintard st, CA 91911', ['Paul Bazek', 'Rohit Jadhav']),
    new ProjectInfo('Associate Professional Service', 'May 23, 2023', '60 Quintard st, CA 91911', ['Paul Bazek']),
    new ProjectInfo('Associate Professional Service', 'May 23, 2023', '60 Quintard st, CA 91911', ['Paul Bazek'])
  ]

  public gotoProject(projectInfo :ProjectInfo): void {
    this.showProjectInfo = false;
    this.projectInfo = projectInfo;
    console.log(this.showProjectInfo);
    // this.cdr.detectChanges();
  }

}
