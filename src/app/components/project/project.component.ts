import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../common/models/project";
import {HttpsRequestService} from "../../service/https-request.service";
import {BuildingLocation} from "../../common/models/buildingLocation";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit{
  showPartInfo: boolean = true;
  projectCommonLocationList!: BuildingLocation[];
  projectBuildings!: Project[];
  buildingLocation!: BuildingLocation;
  @Input() projectInfo!: Project;
  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService) {
    this.subscribeToProjectUpdatedEvent();
  }
  ngOnInit(): void {
    this.fetchLocationData(this.projectInfo._id);
    this.fetchSubProjectData(this.projectInfo._id);
  }

  private fetchSubProjectData(projectID:string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/subproject/getSubprojectsDataByProjectId';
    let data = {
      projectid: projectID,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectBuildings = response.item;
        console.log(response);
      },
      error => {
        console.log(error)
      }
    );
  }

  private fetchLocationData(projectID:string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/location/getLocationsByProjectId';
    let data = {
      projectid: projectID,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectCommonLocationList = response.item;
        console.log(response);
      },
      error => {
        console.log(error)
      }
    );
    return {url, data};
  }

  public gotoPartInfo($event: BuildingLocation): void {
    this.showPartInfo = false;
    this.buildingLocation = $event;
   }

  private subscribeToProjectUpdatedEvent() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Project_update).subscribe(data => {
      this.projectInfo = data;
      this.fetchLocationData(data.id);
      this.fetchSubProjectData(data.id);
    })
  }
}
