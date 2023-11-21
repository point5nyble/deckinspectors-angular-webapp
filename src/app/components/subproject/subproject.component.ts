import {Component, OnDestroy, OnInit} from '@angular/core';
import {BuildingLocation} from "../../common/models/buildingLocation";
import {HttpsRequestService} from "../../service/https-request.service";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {Store} from "@ngrx/store";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {BackNavigation} from "../../app-state-service/back-navigation-state/back-navigation-selector";
import {take} from "rxjs";
import {ProjectQuery} from "../../app-state-service/project-state/project-selector";
import {ProjectState} from "../../app-state-service/store/project-state-model";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subproject',
  templateUrl: './subproject.component.html',
  styleUrls: ['./subproject.component.scss']
})
export class SubprojectComponent implements OnInit, OnDestroy{
  showSectionInfo: string = 'subproject';
  projectInfo!: any;
  buildingCommonLocation!: BuildingLocation[];
  buildingApartments!: BuildingLocation[];
  projectState!: ProjectState;
  isLoading: boolean = false;
  private subscription:any[] = [];

  constructor(private httpsRequestService: HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>) {
  }

  ngOnInit(): void {
    this.subscribeToProjectUpdatedEvent();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  private fetchSubProjectData(projectID: string) {
    let url = environment.apiURL + '/subproject/getSubprojectsDataByProjectId';
    let data = {
      projectid: projectID,
      username: localStorage.getItem('username')
    };
    this.isLoading = true;
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        // this.buildingApartments = response.item;
        this.isLoading = false;
        this.separateProject(response.subprojects);
      },
      error => {
        console.log(error)
      }
    );
  }

  private subscribeToProjectUpdatedEvent() {
    // this.fetchSubprojectDataFromState();
    this.subscription.push(
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      this.showSectionInfo = data;
      this.fetchSubprojectDataFromState();
    }));
    this.subscription.push(
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.UPDATE_LEFT_TREE_DATA).subscribe(data => {
      setTimeout(() => {
        this.fetchSubprojectDataFromState();
      },1000)
    }));
    this.subscription.push(
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      this.projectState = data.state;
      this.fetchSubprojectDataFromState();
    }));
  }
  private separateProject(item:any) {
    // Temp solution
    let subproject = item.filter((sub:any) => sub._id === this.projectInfo.id)[0];
    if (subproject === undefined) {
      subproject = item.filter((sub:any) => sub._id === this.projectInfo._id)[0];
    }
    if (this.projectState === ProjectState.INVASIVE) {
      this.buildingApartments = subproject?.children?.filter((sub:any) => sub.type === 'apartment' && sub.isInvasive);
      this.buildingCommonLocation = subproject?.children?.filter((sub:any) => sub.type === 'buildinglocation' && sub.isInvasive);
    } else {
      this.buildingApartments = subproject?.children?.filter((sub:any) => sub.type === 'apartment');
      this.buildingCommonLocation = subproject?.children?.filter((sub:any) => sub.type === 'buildinglocation');
    }
  }

  private fetchSubprojectDataFromState() {
    this.subscription.push(
    this.store.select(BackNavigation.getPreviousStateModelChain).pipe(take(1)).subscribe((previousState: any) => {
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      if (this.projectInfo.type === 'subproject' && this.showSectionInfo === 'subproject') {
        this.fetchSubProjectData(this.projectInfo.parentid);
      }
    }));
  }
}
