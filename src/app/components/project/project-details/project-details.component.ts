import {Component, OnInit} from '@angular/core';
import {Project} from "../../../common/models/project";
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {HttpsRequestService} from "../../../service/https-request.service";
import {Store} from "@ngrx/store";
import {ProjectListElement} from "../../../common/models/project-list-element";
import {BackNavigation} from "../../../app-state-service/back-navigation-state/back-navigation-selector";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  showSectionInfo: string = 'project';
  projectInfo!: Project;
  projectCommonLocationList!: BuildingLocation[];
  projectBuildings!: Project[];
  subprojectInfo!: ProjectListElement;
  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any> ) {
  }
  ngOnInit(): void {
    this.subscribeToProjectUpdatedEvent();
    // this.fetchLocationData(this.projectInfo?._id);
    // this.fetchSubProjectData(this.projectInfo?._id);
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
        console.log(this.projectBuildings);
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
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      //TODO: Change logic and make it consistent with project details upper selection component
      // if (this.showSectionInfo === 'project') {
      //   this.projectInfo = previousState.stack[previousState.stack.length - 1];
      //   let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
      //   this.fetchLocationData(projectid);
      //   if (this.projectInfo.type !== 'subproject') {
      //     this.fetchSubProjectData(projectid);
      //   }
      // }
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      if (this.projectInfo.type === 'project' && this.showSectionInfo === 'project') {
        let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
        this.fetchLocationData(projectid);
        this.fetchSubProjectData(projectid);
        // if (this.projectInfo.type !== 'subproject') {
        //   this.fetchSubProjectData(projectid);
        // }
      }
    });
  }


  private subscribeToShowPartInfoEvent() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      this.showSectionInfo = data;
    });
  }
}
