import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpsRequestService} from "../../service/https-request.service";
import {Project} from "../../common/models/project";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";

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
                private httpsRequestService:HttpsRequestService,
                private orchestratorCommunicationService:OrchestratorCommunicationService) {}

    ngOnInit(): void {
        this.httpsRequestService.getHttpData<any>('https://deckinspectors-dev.azurewebsites.net/api/project/getProjectsByUser/deck').subscribe(
            (data)=> {
              this.projectInfos = data.projects;
            },
          error => {
              console.log(error);
          }
        )
      this.subscribeToshowProjectInfoToggle();
    }


  public gotoProject(projectInfo :Project): void {
    this.showProjectInfo = false;
    this.projectInfo = projectInfo;
  }

  private subscribeToshowProjectInfoToggle() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Show_All_Projects).subscribe(data => {
      this.showProjectInfo = data;
    })
  }
}
