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
import { environment } from '../../../../environments/environment';

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
  projectState!: ProjectState;
  isProjectAssigned: boolean = false;
  apiCalled: boolean = false;
  isLoading: boolean = false;
  showCommonSection: boolean = true;
  showBuildingSection: boolean = false;

  private subscription:any[] = [];
  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any> ) {
  }
  ngOnInit(): void {
    this.subscribeToFetchLocationsAndSubprojectList();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  showCommonSectionfunc() {
    this.showCommonSection = true;
    this.showBuildingSection = false;
  }

  showBuildingSectionfunc() {
    this.showCommonSection = false;
    this.showBuildingSection = true;
  }

  private fetchSubProjectData(projectID:string) {
    this.projectBuildings = [];
    let url = environment.apiURL + '/subproject/getSubprojectsDataByProjectId';
    let data = {
      projectid: projectID,
      username: localStorage.getItem('username')
    };
    this.isLoading = true;
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectBuildings = this.filterSubproject(response.subprojects);
        this.isLoading = false;
      },
      error => {
        console.log(error)
      }
    );
  }
  private fetchLocationData(projectID:string) {
    this.projectCommonLocationList = [];
    let url = environment.apiURL + '/location/getLocationsByProjectId';
    let data = {
      projectid: projectID,
      username: localStorage.getItem('username')
    };
    this.isLoading = true;
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectCommonLocationList = this.filterLocations(response.locations);
        this.isLoading = false;
      },
      error => {
        console.log(error)
      }
    );
    return {url, data};
  }

  private subscribeToFetchLocationsAndSubprojectList() {
    // this.fetchProjectDataFromState();
    this.subscription.push(
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      this.showSectionInfo = data;
      if (data === 'project') {
        this.fetchProjectDataFromState();
      }
    }));
    this.subscription.push(
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.UPDATE_LEFT_TREE_DATA).subscribe(data => {
      setTimeout(() => {
        this.fetchProjectDataFromState();
      },1000)
    }));
    // This function is for Invasive or Visual
    this.subscription.push(
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      this.projectState = data.state;
      this.fetchProjectDataFromState();
    }));
  }

  private fetchProjectDataFromState() {
    this.subscription.push(
    this.store.select(BackNavigation.getPreviousStateModelChain).pipe(take(1)).subscribe((previousState: any) => {
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      if (this.projectInfo.type === 'project' && this.showSectionInfo === 'project') {
        let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
        this.fetchLocationData(projectid);
        this.fetchSubProjectData(projectid);
      }
    }));
  }

  private filterLocations(locations:BuildingLocation[]): BuildingLocation[] {
    // console.log(locations);
    if (this.projectState === ProjectState.INVASIVE) {
      // return projects.filter(project => project.isInvasive);
      return locations.filter(location => location.isInvasive);
    }
    return locations;
  }

  private filterSubproject(projects:Project[]): Project[] {
    // console.log(projects);
    if (this.projectState === ProjectState.INVASIVE) {
      // return projects.filter(project => project.isInvasive);
      return projects.filter(project => project.isInvasive);
    }
    return projects;
  }

  projectAssigned = (event: any) =>{
    this.isProjectAssigned = event.isAssigned;
    this.apiCalled = event.apiCalled;
    // if (event.isAssigned && event.apiCalled)
    //   this.fetchProjectData();
  }


  projectDeletionComplete($event: boolean) {
    console.log($event);
    let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
    this.fetchLocationData(projectid);
    this.fetchSubProjectData(projectid);
    // $event is true when the subproject deleted process completed.
    // else location deleted process completed.
    if ($event) {
      this.fetchSubProjectData(projectid);
    } else {
        this.fetchLocationData(projectid);
    }
  }
}
