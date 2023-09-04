import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpsRequestService } from "../../service/https-request.service";
import { Project } from "../../common/models/project";
import { OrchestratorCommunicationService } from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import { OrchestratorEventName } from "../../orchestrator-service/models/orchestrator-event-name";
import { ObjectCloneServiceService } from "../../service/object-clone-service.service";
import { ProjectState } from "../../app-state-service/store/project-state-model";
import { Store } from "@ngrx/store";
import { ProjectQuery } from "../../app-state-service/project-state/project-selector";
import {LoginService} from "../login/login.service";
import {Router} from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
  showProjectInfo: string = 'home';
  projectInfo! : Project;
  projectInfos!: Project[];
  allProjects!: Project[];
  projectState!: ProjectState;
  isChildClickEventTriggered: boolean = false;
  disableInvasiveBtn: boolean = false;
  isProjectAssigned: boolean = false;
  apiCalled: boolean = false;
  showProjectCompleteAlert: boolean = false;
  showProjectInProgressAlert: boolean = false;
    constructor(private cdr: ChangeDetectorRef,
                private httpsRequestService:HttpsRequestService,
                private orchestratorCommunicationService:OrchestratorCommunicationService,
                private store: Store<any>,
                private loginService: LoginService,
                private router: Router) {}

    ngOnInit(): void {
      this.performUserLoginSteps();
      this.subscribeToshowProjectInfoToggle();
      // this.subscribeToProjectState();
    }

  private fetchProjectData() {
    this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/user/${localStorage.getItem('username')}`).subscribe(
      (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        if(user.role.toLowerCase() === "admin"){
          this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/project/allProjects`).subscribe(
            (data) => {
              this.projectInfos = this.filterProject(data.projects);
              this.allProjects = this.filterProject(data.projects);
            },
            error => {
              console.log(error);
            }
          )
        }
        else {
            this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/project/getProjectsByUser/${localStorage.getItem('username')}`).subscribe(
            (data) => {
              this.projectInfos = this.filterProject(data.projects);
              this.allProjects = this.filterProject(data.projects);
            },
            error => {
              console.log(error);
            }
          )
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // This function is to get last element and called when we add new Project and automatically navigate to that function
  private fetchProjectDataToGetLastElement() {
    this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/user/${localStorage.getItem('username')}`).subscribe(
      (user) => {
        if(user.role.toLowerCase() === "admin"){
          this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/project/allProjects`).subscribe(
            (data) => {
              this.projectInfos = this.filterProject(data.projects);
              this.allProjects = this.filterProject(data.projects);
              this.projectInfo = this.getRecentlyAddedProject(data.projects);
              this.gotoProject(this.projectInfo);
            },
            error => {
              console.log(error);
            }
          )
        }
        else {
          this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/project/getProjectsByUser/${localStorage.getItem('username')}`).subscribe(
            (data) => {
              this.projectInfos = this.filterProject(data.projects);
              this.allProjects = this.filterProject(data.projects);
              this.projectInfo = this.getRecentlyAddedProject(data.projects);
              this.gotoProject(this.projectInfo);
            },
            error => {
              console.log(error);
            }
          )
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  public gotoProject(projectInfo :Project): void {
      if (this.isChildClickEventTriggered) {
        this.isChildClickEventTriggered = false;
          return;
      }
    this.projectInfo = projectInfo;
    //TODO: Remove this temp solution
    projectInfo.type = 'project';
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC,
      ObjectCloneServiceService.deepClone(projectInfo));
    if (projectInfo.projecttype === 'multilevel') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN,'project')
    } else {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN,'location')
    }
    // this.disableInvasiveBtn = !this.projectInfo.isInvasive;
  }

  private subscribeToshowProjectInfoToggle() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      this.showProjectInfo = data;
      if (data === 'home') {
        // this.disableInvasiveBtn = false;
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.PROJECT_STATE_UPDATE, {state:ProjectState.VISUAL});
      }
    })
  }

  projectSearch($event: string) {
    this.projectInfos = this.allProjects.filter((project) =>
      project.name.toLowerCase().includes($event.toLowerCase())
    );
  }

  newProjectUploaded() {
      // add Timeout
      setTimeout(() => {
        this.fetchProjectDataToGetLastElement();
      },1000)
  }

  changeProjectState() {
    this.projectState = this.projectState === ProjectState.VISUAL ? ProjectState.INVASIVE : ProjectState.VISUAL;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.PROJECT_STATE_UPDATE, {state:this.projectState});
  }

  private subscribeToProjectState() {
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      this.projectState = data.state;
      this.fetchProjectData();
    });
  }

  private filterProject(projects:Project[]): Project[] {
    if (this.projectState === ProjectState.INVASIVE) {
      return projects.filter(project => project.isInvasive);
    }
    return projects.filter(project => !project.iscomplete).sort(this.compare);
  }

  private getRecentlyAddedProject(projects: Project[]) {
      return projects[0];
  }

  childClickEventTriggered($event: boolean) {
    this.isChildClickEventTriggered = $event;
  }

  protected readonly event = event;

  private performUserLoginSteps() {
    if (this.loginService.isLoggedIn()) {
        this.fetchProjectData();
    } else {
      this.router.navigate(['/login'])
    }
  }

  gotoHome() {
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN,'home');
  }

  compare = (a:Project, b:Project) =>{
    let x = a._id.toLowerCase();
    let y = b._id.toLowerCase();
    if (x < y) {return 1;}
    if (x > y) {return -1;}
    return 0;
  }

  projectAssigned = (event: any) =>{

    this.isProjectAssigned = event.isAssigned;
    this.apiCalled = event.apiCalled;

    if (event.isAssigned && event.apiCalled){
      this.fetchProjectData();
      setTimeout(this.removeNotification, 5000);
    }
  }

  filterCompleted = (isChecked: boolean) =>{
    if(isChecked){
    this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/user/${localStorage.getItem('username')}`).subscribe(
      (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        if(user.role.toLowerCase() === "admin"){
          this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/project/allProjects`).subscribe(
            (data) => {
              this.projectInfos = data.projects.filter((project: any) => project.iscomplete).sort(this.compare);
              this.allProjects = data.projects.filter((project: any) => project.iscomplete).sort(this.compare);
            },
            error => {
              console.log(error);
            }
          )
        }
        else {
            this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/project/getProjectsByUser/${localStorage.getItem('username')}`).subscribe(
            (data) => {
              this.projectInfos = data.projects.filter((project: any) => project.iscomplete).sort(this.compare);
              this.allProjects = data.projects.filter((project: any) => project.iscomplete).sort(this.compare);
            },
            error => {
              console.log(error);
            }
          )
        }
      },
      error => {
        console.log(error);
      }
    )

  }
  else{
    this.fetchProjectData();
  }
}

markedCompleted = (completed: boolean) =>{
  if (completed){
    this.fetchProjectData();
    this.showProjectCompleteAlert = true;
  } else{
    this.filterCompleted(true);
    this.showProjectInProgressAlert = true;
  }
  setTimeout(this.removeNotification, 5000);
}

removeNotification = () =>{
  this.showProjectCompleteAlert = false;
  this.showProjectInProgressAlert = false;
  this.isProjectAssigned = false;
  this.apiCalled = false;
}

  projectEventDeletedEvent($event: string) {
    setTimeout(() => {
      this.fetchProjectData();
    },1000)
  }
}
