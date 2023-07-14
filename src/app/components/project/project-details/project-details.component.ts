import {Component, Input, OnInit} from '@angular/core';
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
  // @Input() projectInfo!: Project;
  @Input()
  set projectInfo(projectInfo: Project) {
    this.projectInfo_ = projectInfo;
    this.map(projectInfo);
  }
  projectCommonLocationList!: BuildingLocation[];
  projectBuildings!: Project[];
  subprojectInfo!: ProjectListElement;
  mappedProjectListInfo!: ProjectListElement;
  projectInfo_!: Project;

  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any> ) {
  }
  ngOnInit(): void {
    this.subscribeToProjectUpdatedEvent();
    this.fetchLocationData(this.projectInfo_._id);
    this.fetchSubProjectData(this.projectInfo_._id);
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
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      this.fetchLocationData(previousState._id);
      if (previousState.type !== 'subproject') {
        this.fetchSubProjectData(previousState._id);
      }
    });
  }


  private subscribeToShowPartInfoEvent() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Show_Project_Details).subscribe(data => {
      this.showSectionInfo = data;
    });
  }

  locationClicked($event: ProjectListElement) {
    this.subprojectInfo = $event;
    // this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Previous_Button_Click, this.projectInfo_);
  }


  private map(project: Project) {
    this.mappedProjectListInfo =
    {
      _id: project._id,
      createdat: project.createdat,
      createdby: project.createdby,
      description: project.description,
      name: project.name,
      parentid: project.parentid?project.parentid:'',
      parenttype: project.parenttype?project.parenttype:'project',
      type: project.type?project.type:'project',
      url: project.url
    }
  }
}
