import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpsRequestService} from "../../service/https-request.service";
import {Project} from "../../common/models/project";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
  showProjectInfo: boolean = true;
  projectInfo! : Project;
  projectInfos!: Project[];
    constructor(private cdr: ChangeDetectorRef,
                private httpsRequestService:HttpsRequestService) {}

    ngOnInit(): void {
        this.httpsRequestService.getHttpData<any>('https://deckinspectors-dev.azurewebsites.net/api/project/getProjectsByUser/deck').subscribe(
            (data)=> {
              console.log(data);
              this.projectInfos = data.projects;
            },
          error => {
              console.log(error);
          }
        )
    }


  public gotoProject(projectInfo :Project): void {
    this.showProjectInfo = false;
    this.projectInfo = projectInfo;
  }

}
