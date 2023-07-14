import {Component, Input} from '@angular/core';
import {BuildingLocation} from "../../common/models/buildingLocation";
import {HttpsRequestService} from "../../service/https-request.service";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {Store} from "@ngrx/store";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {ProjectListElement} from "../../common/models/project-list-element";
import {BackNavigation} from "../../app-state-service/back-navigation-state/back-navigation-selector";

@Component({
  selector: 'app-subproject',
  templateUrl: './subproject.component.html',
  styleUrls: ['./subproject.component.scss']
})
export class SubprojectComponent {
  @Input() projectInfo!: any;
  buildingCommonLocation!: BuildingLocation[];
  buildingApartments!: BuildingLocation[];

  constructor(private httpsRequestService: HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>) {
  }

  ngOnInit(): void {
    this.subscribeToProjectUpdatedEvent();
    this.fetchSubProjectData(this.projectInfo.parentid);
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
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      this.fetchSubProjectData(this.projectInfo.id);
    });

  }
  locationClicked($event: ProjectListElement) {
    // this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Previous_Button_Click, this.projectInfo);
  }

  private separateProject(item:any) {
    let subproject = item.filter((sub:any) => sub._id === this.projectInfo._id)[0];
    this.buildingApartments = subproject.children.filter((sub:any) => sub.type === 'apartment');
    this.buildingCommonLocation = subproject.children.filter((sub:any) => sub.type === 'buildinglocation');
  }
}
