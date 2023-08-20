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
import {ProjectQuery} from "../../../app-state-service/project-state/project-selector";
import {ProjectState} from "../../../app-state-service/store/project-state-model";

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
  projectState!: ProjectState;
  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any> ) {
  }
  ngOnInit(): void {
    this.subscribeToFetchLocationsAndSubprojectList();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchSubProjectData(projectID:string) {
    this.projectBuildings = [];
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/subproject/getSubprojectsDataByProjectId';
    let data = {
      projectid: projectID,
      username: localStorage.getItem('username')
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectBuildings = this.filterSubproject(response.item);
      },
      error => {
        console.log(error)
      }
    );
  }
  private fetchLocationData(projectID:string) {
    this.projectCommonLocationList = [];
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/location/getLocationsByProjectId';
    let data = {
      projectid: projectID,
      username: localStorage.getItem('username')
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectCommonLocationList = this.filterLocations(response.item);
      },
      error => {
        console.log(error)
      }
    );
    return {url, data};
  }

  private subscribeToFetchLocationsAndSubprojectList() {
    // this.fetchProjectDataFromState();
    this.subscription = this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      this.showSectionInfo = data;
      if (data === 'project') {
        this.fetchProjectDataFromState();
      }
    });
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.UPDATE_LEFT_TREE_DATA).subscribe(data => {
      setTimeout(() => {
        this.fetchProjectDataFromState();
      },1000)
    });
    // This function is for Invasive or Visual
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      this.projectState = data.state;
      this.fetchProjectDataFromState();
    });
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

  private filterLocations(locations:BuildingLocation[]): BuildingLocation[] {
    if (this.projectState === ProjectState.INVASIVE) {
      // return projects.filter(project => project.isInvasive);
      return locations.filter(location => location.isInvasive);
    }
    return locations;
  }

  private filterSubproject(projects:Project[]): Project[] {
    if (this.projectState === ProjectState.INVASIVE) {
      // return projects.filter(project => project.isInvasive);
      return projects.filter(project => project.isInvasive);
    }
    return projects;
  }
}
