import {Component} from '@angular/core';
import {BuildingLocation} from "../../common/models/buildingLocation";
import {HttpsRequestService} from "../../service/https-request.service";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {Store} from "@ngrx/store";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {BackNavigation} from "../../app-state-service/back-navigation-state/back-navigation-selector";

@Component({
  selector: 'app-subproject',
  templateUrl: './subproject.component.html',
  styleUrls: ['./subproject.component.scss']
})
export class SubprojectComponent {
  showSectionInfo: string = 'subproject';
  projectInfo!: any;
  buildingCommonLocation!: BuildingLocation[];
  buildingApartments!: BuildingLocation[];

  constructor(private httpsRequestService: HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>) {
  }

  ngOnInit(): void {
    console.log("Inside SubprojectComponent")
    this.subscribeToProjectUpdatedEvent();
  }

  private fetchSubProjectData(projectID: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/subproject/getSubprojectsDataByProjectId';
    let data = {
      projectid: projectID,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        // this.buildingApartments = response.item;
        this.separateProject(response.item);
      },
      error => {
        console.log(error)
      }
    );
  }

  private subscribeToProjectUpdatedEvent() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      console.log(data);
      this.showSectionInfo = data;
    });
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      if (this.showSectionInfo === 'subproject') {
        this.projectInfo = previousState.stack[previousState.stack.length - 1];
        this.fetchSubProjectData(this.projectInfo.parentid);
      }
    });

  }
  private separateProject(item:any) {
    // Temp solution
    let subproject = item.filter((sub:any) => sub._id === this.projectInfo.id)[0];
    if (subproject === undefined) {
      subproject = item.filter((sub:any) => sub._id === this.projectInfo._id)[0];
    }
    this.buildingApartments = subproject.children.filter((sub:any) => sub.type === 'apartment');
    this.buildingCommonLocation = subproject.children.filter((sub:any) => sub.type === 'buildinglocation');
  }
}
