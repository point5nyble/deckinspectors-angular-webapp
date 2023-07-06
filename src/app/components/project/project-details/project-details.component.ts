import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../common/models/project";
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {HttpsRequestService} from "../../../service/https-request.service";
import {PreviousStateModelQuery} from "../../../app-state-service/previous-state/previous-state-selector";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit{

  showPartInfo: boolean = true;
  @Input() projectInfo!: Project;
  projectCommonLocationList!: BuildingLocation[];
  projectBuildings!: Project[];

  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any> ) {
  }
  ngOnInit(): void {
    this.subscribeToProjectUpdatedEvent();
    this.fetchLocationData(this.projectInfo._id);
    this.fetchSubProjectData(this.projectInfo._id);
    this.subscribeToShowPartInfoEvent();
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
      },
      error => {
        console.log(error)
      }
    );
    return {url, data};
  }
  private subscribeToProjectUpdatedEvent() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Project_update).subscribe(data => {
      this.projectInfo = data;
      this.fetchLocationData(data.id);
      this.fetchSubProjectData(data.id);
    })
  }


  private subscribeToShowPartInfoEvent() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Show_Project_Details).subscribe(data => {
      this.showPartInfo = data;
    });
  }

  locationClicked($event: BuildingLocation) {
    console.log($event);
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Previous_Button_Click, this.projectInfo);
  }

  previousBtnClicked() {
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_All_Projects, true);
  }

  previousBtnClickedFromLocationDetails($event: boolean) {
    this.store.select(PreviousStateModelQuery.getPreviousStateModel).subscribe((previousState:any) => {
      console.log(previousState);
      this.projectInfo = previousState;
      this.fetchLocationData(previousState.id);
      this.fetchSubProjectData(previousState.id);
    })
  }
}
