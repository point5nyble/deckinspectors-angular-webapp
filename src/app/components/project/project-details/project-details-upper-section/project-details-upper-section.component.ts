import { ProjectInfo } from './../../../../common/models/project-info';
import {Component, OnDestroy, OnInit} from '@angular/core';
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
import { environment } from '../../../../../environments/environment';
// import { Project } from 'src/app/common/models/project';

@Component({
  selector: 'app-project-details-upper-section',
  templateUrl: './project-details-upper-section.component.html',
  styleUrls: ['./project-details-upper-section.component.scss']
})
export class ProjectDetailsUpperSectionComponent implements OnInit, OnDestroy{
  projectInfo!: BuildingLocation & ProjectListElement;
  // project!: Project;
  projectType!: string;
  projectState!: ProjectState;
  disableInvasiveBtn: boolean = false;
  enableDefaultImage: boolean = false;
  sequenceNo!: string | undefined;
  // List of subscription
  private subscription:any[] = [];
  currentProjectId!: string;

  constructor(private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>,
              private httpsRequestService:HttpsRequestService,
              private dialog: MatDialog,
              private http: HttpClient) {
  }

  public ngOnDestroy(): void {
        this.subscription.forEach(sub => sub.unsubscribe());
  }

  public ngOnInit(): void {
    this.subscribeToProjectInfo();
    this.subscribeToProjectState();
    this.sequenceNo = this.projectInfo.sequenceNo;
  }

  formatDate(dateTimeString: string | undefined): string | undefined {
    if (dateTimeString) {
      // const date = new Date(dateTimeString);
      // const options: Intl.DateTimeFormatOptions = {
      //   year: 'numeric',
      //   month: '2-digit',
      //   day: '2-digit'
      // };
      // return date.toLocaleDateString('en-US', options);
      return dateTimeString
    }
    return undefined;
  }


  private subscribeToProjectState() {
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      this.projectState = data.state;
      this.disableInvasiveBtn = data.isInvasiveBtnDisabled;
    });
  }

  private subscribeToProjectInfo() {
    this.fetchProjectIdFromState();
    this.subscription.push(
      this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
        if (data != 'home') {
          this.fetchProjectIdFromState();
        }
      })
    );
    this.subscription.push(
      this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.UPDATE_LEFT_TREE_DATA).subscribe(data => {
        setTimeout(() => {
          this.fetchProjectIdFromState();
        },1000)
      })
    );
  }

  public changeProjectState() {
    this.projectState = this.projectState === ProjectState.VISUAL ? ProjectState.INVASIVE : ProjectState.VISUAL;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.PROJECT_STATE_UPDATE, {state:this.projectState});
  }

  public previousBtnClicked() {
    // console.log(this.projectInfo.type);
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

  public homeBtnClicked() {
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'home');
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
      type: this.projectInfo.type,
      sequenceNo: this.sequenceNo
    };
    if (this.projectInfo.type === 'project') {
      const dialogRef = this.dialog.open(NewProjectModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        setTimeout(() => {
          this.fetchProjectIdFromState();
        },1000)
      })
    } else {
      const dialogRef = this.dialog.open(NewLocationModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        setTimeout(() => {
          this.fetchProjectIdFromState();
        },1000)
      })
    }
  }

  private fetchProjectIdFromState(): void {
    this.subscription.push(
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
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.INVASIVE_BTN_DISABLED,{isInvasiveBtnDisabled:this.disableInvasiveBtn});
      } else if (this.projectInfo.type === 'location' ||
        this.projectInfo.type === 'projectlocation' ||
        this.projectInfo.type === 'apartment' ||
        this.projectInfo.type === 'buildinglocation') {
        this.projectType = 'location';
        let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
        this.fetchLocationDetails(projectid);
      }
    })
    );
  }
  private fetchProjectDetails(projectid: string) {
    // if (this.currentProjectId !== projectid) {
      this.currentProjectId = projectid;
      let url = environment.apiURL + '/project/getProjectById';
      let data = {
        projectid: projectid,
        username: localStorage.getItem('username')
      };
      this.httpsRequestService.postHttpData(url, data).subscribe(
        (response: any) => {
          this.projectInfo = response.project;
          this.projectInfo.type = 'project';
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
        },
        error => {
          console.log(error)
        }
      );
    // }
  }
  private fetchSubprojectDetails(projectid: string) {
    // if (this.currentProjectId !== projectid) {
      this.currentProjectId = projectid;
      let url = environment.apiURL + '/subproject/getSubProjectById';
      let data = {
        subprojectid: projectid,
        username: localStorage.getItem('username')
      };
      this.httpsRequestService.postHttpData(url, data).subscribe(
        (response: any) => {
          this.projectInfo = response.subproject;
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
        },
        error => {
          console.log(error)
        }
      );
    // }
  }
  private fetchLocationDetails(projectid: string) {
    // if (this.currentProjectId !== projectid) {
        this.currentProjectId = projectid;

    let url = environment.apiURL + '/location/getLocationById';
    let data = {
      locationid:projectid,
      username: localStorage.getItem('username')
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.projectInfo = response.location;
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, this.projectInfo);
      },
      error => {
        console.log(error)
      }
    );
    // }
  }

  public downloadExcel() {
    let url = environment.apiURL + '/project/generateexcel';
    let projectid = this.projectInfo._id === undefined ? (<any>this.projectInfo).id : this.projectInfo._id;
    let data = {
      projectid:projectid,
      username: localStorage.getItem('username')
    };
    const headers = new HttpHeaders({
      'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Type': 'application/json'
    });
    this.httpsRequestService.postHttpDataForFile<any>(url, data).subscribe(
      (response: any) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create the date string in the format "daythMonthYear" (e.g., "18thSept2023")
        const currentDate = new Date();
        const dateStr = `${currentDate.getDate()}th${currentDate.toLocaleString('default', { month: 'short' })}${currentDate.getFullYear()}`;
        const fileName = `${this.projectInfo.name}_${dateStr}.xlsx`;
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      (error: any) => {
        console.log(error);
        alert('Error');
      }
    );
  }
  showDefaultImage = () =>{
    this.enableDefaultImage = true;
  }
}