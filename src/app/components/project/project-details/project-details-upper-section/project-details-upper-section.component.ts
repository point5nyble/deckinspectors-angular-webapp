import {Component, OnInit} from '@angular/core';
import {OrchestratorEventName} from "../../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {ProjectListElement} from "../../../../common/models/project-list-element";
import {Store} from "@ngrx/store";
import {BackNavigation} from "../../../../app-state-service/back-navigation-state/back-navigation-selector";
import {HttpsRequestService} from "../../../../service/https-request.service";

@Component({
  selector: 'app-project-details-upper-section',
  templateUrl: './project-details-upper-section.component.html',
  styleUrls: ['./project-details-upper-section.component.scss']
})
export class ProjectDetailsUpperSectionComponent implements OnInit{
  projectInfo!: ProjectListElement;

  constructor(private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>,
              private httpsRequestService:HttpsRequestService ) {
  }

  ngOnInit(): void {
    this.subscribeToProjectInfo();
  }

  private fetchProjectDetails(projectid: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/getProjectById';
    let data = {
      projectid: projectid,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectInfo = response.item;
      },
      error => {
        console.log(error)
      }
    );
  }

  private fetchSubprojectDetails(projectid: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/subproject/getSubprojectsDataByProjectId';
    let data = {
      projectid: projectid,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectInfo = response.item;
      },
      error => {
        console.log(error)
      }
    );
  }

   previousBtnClicked() {
    console.log(this.projectInfo)
    if (this.projectInfo.type === 'subproject') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'project')
    }else {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_All_Projects, true);
    }
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
  }


  private subscribeToProjectInfo() {
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
      if (this.projectInfo.type === 'subproject' && projectid !== undefined) {
        this.fetchSubprojectDetails(projectid)
      } else if (this.projectInfo.type === 'project' && projectid !== undefined){
        this.fetchProjectDetails(projectid);
      }
    });
  }
}
