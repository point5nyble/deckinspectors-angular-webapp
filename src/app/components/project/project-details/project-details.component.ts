import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../../common/models/project";
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {HttpsRequestService} from "../../../service/https-request.service";
import {Store} from "@ngrx/store";
import {BackNavigation} from "../../../app-state-service/back-navigation-state/back-navigation-selector";
import {take} from "rxjs";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit,OnDestroy  {
  showSectionInfo: string = 'project';
  projectInfo!: Project;
  projectCommonLocationList!: BuildingLocation[];
  projectBuildings!: Project[];
  private subscription!: Subscription;
  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any> ) {
  }
  ngOnInit(): void {
    this.subscribeToShowPartInfoEvent();
  }

  ngOnDestroy(): void {
    // Unsubscribe the subscription to avoid memory leaks
    this.subscription.unsubscribe();
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



  private subscribeToShowPartInfoEvent() {
    this.subscription = this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      console.log(data);
      this.showSectionInfo = data;
      if (data === 'project') {
        this.fetchProjectDataFromState();
      }
    });
    this.fetchProjectDataFromState();
  }

  private fetchProjectDataFromState() {
    this.store.select(BackNavigation.getPreviousStateModelChain).pipe(take(1)).subscribe((previousState: any) => {
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      if (this.projectInfo.type === 'project' && this.showSectionInfo === 'project') {
        let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
        this.fetchLocationData(projectid);
        this.fetchSubProjectData(projectid);
      }
    });
  }
}
