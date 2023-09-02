import {Component, OnInit} from '@angular/core';
import {OrchestratorEventName} from "../../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {ProjectListElement} from "../../../../common/models/project-list-element";
import {Store} from "@ngrx/store";
import {BackNavigation} from "../../../../app-state-service/back-navigation-state/back-navigation-selector";
import {HttpsRequestService} from "../../../../service/https-request.service";
import {BuildingLocation} from "../../../../common/models/buildingLocation";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewLocationModalComponent} from "../../../../forms/new-location-modal/new-location-modal.component";
import {NewProjectModalComponent} from "../../../../forms/new-project-modal/new-project-modal.component";
import {take} from "rxjs";
import {ProjectState} from "../../../../app-state-service/store/project-state-model";
import {ProjectQuery} from "../../../../app-state-service/project-state/project-selector";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-project-details-upper-section',
  templateUrl: './project-details-upper-section.component.html',
  styleUrls: ['./project-details-upper-section.component.scss']
})
export class ProjectDetailsUpperSectionComponent implements OnInit{
  projectInfo!: ProjectListElement | BuildingLocation;
  projectType!: string;
  projectState!: ProjectState;
  disableInvasiveBtn: boolean = false;

  constructor(private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>,
              private httpsRequestService:HttpsRequestService,
              private dialog: MatDialog,
              private http: HttpClient) {
  }

  public ngOnInit(): void {
    this.subscribeToProjectInfo();
  }

  private subscribeToProjectState() {
    this.store.select(ProjectQuery.getProjectModel).pipe(take(1)).subscribe(data => {
      this.projectState = data.state;
      this.disableInvasiveBtn = data.isInvasiveBtnDisabled;
      this.fetchProjectIdFromState();
    });
  }

  private subscribeToProjectInfo() {
    this.subscribeToProjectState();
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      this.subscribeToProjectState();
    });
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.UPDATE_LEFT_TREE_DATA).subscribe(data => {
      setTimeout(() => {
        this.subscribeToProjectState();
      },1000)
    });
  }

  public changeProjectState() {
    this.projectState = this.projectState === ProjectState.VISUAL ? ProjectState.INVASIVE : ProjectState.VISUAL;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.PROJECT_STATE_UPDATE, {state:this.projectState});
  }

  public previousBtnClicked() {
    if (this.projectInfo.type === 'subproject') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'project')
    } else if (this.projectInfo.type === 'location' ||
      this.projectInfo.type === 'projectlocation' ||
      this.projectInfo.type === 'apartment' ||
      this.projectInfo.type === 'buildinglocation') {
      if (this.projectInfo.parenttype === 'subproject') {
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'subproject');
      } else {
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'project');
      }
    } else {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'home');
    }
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
  }

  public editLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "700px";
    dialogConfig.data = {
      id: 1,
      projectInfo:this.projectInfo,
      process: 'edit',
      type: this.projectType
    };
    if (this.projectInfo.type === 'project') {
      const dialogRef = this.dialog.open(NewProjectModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
      })
    } else {
      const dialogRef = this.dialog.open(NewLocationModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
      })
    }
  }

  private fetchProjectIdFromState(): void {
    this.store.select(BackNavigation.getPreviousStateModelChain).pipe(take(1)).subscribe((previousState: any) => {
      this.projectInfo = previousState.stack[previousState.stack.length - 1];
      if (this.projectInfo.type === 'subproject') {
        this.projectType = 'subproject';
        let subprojectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
        this.fetchSubprojectDetails(subprojectid)
      } else if (this.projectInfo.type === 'project'){
        this.projectType = 'project';
        this.disableInvasiveBtn = !this.projectInfo.isInvasive;
        let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
        this.fetchProjectDetails(projectid);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.INVASIVE_BTN_DISABLED,{'isInvasiveBtnDisabled':this.disableInvasiveBtn});
      } else if (this.projectInfo.type === 'location' ||
        this.projectInfo.type === 'projectlocation' ||
        this.projectInfo.type === 'apartment' ||
        this.projectInfo.type === 'buildinglocation') {
        this.projectType = 'location';
        let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
        this.fetchLocationDetails(projectid);
      }
    });
  }
  private fetchProjectDetails(projectid: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/getProjectById';
    let data = {
      projectid: projectid,
      username: localStorage.getItem('username')
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.projectInfo = response.item;
        this.projectInfo.type = 'project';
      },
      error => {
        console.log(error)
      }
    );
  }
  private fetchSubprojectDetails(projectid: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/subproject/getSubProjectById';
    let data = {
      subprojectid: projectid,
      username: localStorage.getItem('username')
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
  private fetchLocationDetails($event: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/location/getLocationById';
    let data = {
      locationid:$event,
      username: localStorage.getItem('username')
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.projectInfo = response.item;
      },
      error => {
        console.log(error)
      }
    );
  }

  public downloadExcel() {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/generateexcel';
    let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
    let data = {
      projectid:projectid,
      username: localStorage.getItem('username')
    };
    const headers = new HttpHeaders({
      'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json'
    });
    this.http.post<any>(url, data, { headers, responseType: 'blob' as 'json'}).subscribe((response: any) => {
      console.log(response);
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
        window.open(downloadUrl);
      },
      (error:any) => {
        console.log(error);
        alert('Error');
      })
  }
}
