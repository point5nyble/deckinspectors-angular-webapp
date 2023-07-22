import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpsRequestService} from "../../service/https-request.service";
import {Project} from "../../common/models/project";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {ObjectCloneServiceService} from "../../service/object-clone-service.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
  showProjectInfo: string = 'home';
  projectInfo! : Project;
  projectInfos!: Project[];
  allProjects!: Project[];
    constructor(private cdr: ChangeDetectorRef,
                private httpsRequestService:HttpsRequestService,
                private orchestratorCommunicationService:OrchestratorCommunicationService) {}

    ngOnInit(): void {
      this.fetchProjectData();
      this.subscribeToshowProjectInfoToggle();
    }


  private fetchProjectData() {
    this.httpsRequestService.getHttpData<any>('https://deckinspectors-dev.azurewebsites.net/api/project/getProjectsByUser/deck').subscribe(
      (data) => {
        this.projectInfos = data.projects;
        this.allProjects = data.projects;
      },
      error => {
        console.log(error);
      }
    )
  }

  public gotoProject(projectInfo :Project): void {
    this.projectInfo = projectInfo;
    //TODO: Remove this temp solution
    projectInfo.type = 'project';
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC,
      ObjectCloneServiceService.deepClone(projectInfo));
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN,'project')
  }

  private subscribeToshowProjectInfoToggle() {
      // Show Project Screen
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      this.showProjectInfo = data;
    })
  }

  projectSearch($event: string) {
    this.projectInfos = this.allProjects.filter((project) =>
      project.name.toLowerCase().includes($event.toLowerCase())
    );
  }

  newProjectUploaded() {
      // add Timeout
      setTimeout(() => {
        this.fetchProjectData();
      },1000)
  }
}
