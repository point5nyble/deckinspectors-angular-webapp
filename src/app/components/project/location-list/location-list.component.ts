import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {Project} from "../../../common/models/project";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewLocationModalComponent} from "../../../forms/new-location-modal/new-location-modal.component";
import {Item} from "../../../common/models/project-tree";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {ProjectQuery} from "../../../app-state-service/project-state/project-selector";
import {Store} from "@ngrx/store";
import {NewSubprojectModalComponent} from "../../../forms/new-subproject-modal/new-subproject-modal.component";
import {ProjectListElement} from "../../../common/models/project-list-element";
import {BackNavigation} from "../../../app-state-service/back-navigation-state/back-navigation-selector";

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  @Output() isDbClick = new EventEmitter<ProjectListElement>();
  @Input() header!: string;
  @Input()
  set locations(locations: BuildingLocation[]) {
    this.extractLocationList(locations);
  }

  @Input()
  set subproject(subproject: Project[]) {
    this.extractSubprojectList(subproject);
  }

  locationList: ProjectListElement[] = [];
  subprojectList!: ProjectListElement[];

  projectInfo: any;

  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>) { }

  public ngOnInit(): void {
    this.subscribeToProjectDetailsForNameHighlight();
  }
  checkIfSubProject() : boolean {
    return (this.header === "Project Buildings");
  }

  extractSubprojectInfo()  {
    let subProjectNames:any[]= [];
    console.log(this.subproject);
    this.subproject?.forEach(project => {
      subProjectNames.push({
        name: project.name,
        id: project._id,
        type: project.type
      });
    });
    return subProjectNames;
  }
  onDbClick(locationInfo:ProjectListElement) {
    this.isDbClick.emit(locationInfo);
    if (locationInfo._id !== '') {
      if (locationInfo.type === 'subproject') {
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, 'subproject');
      } else {
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, 'location');
      }
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Location_Click, this.mapItem(locationInfo));
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, locationInfo)
    }
  }

  public openLocationModal():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
    dialogConfig.data = {
      id: 1,
      isSubProject: this.checkIfSubProject(),
      projectInfo: this.projectInfo,
      type: this.getType()
    };
    const dialogRef = this.dialog.open(NewLocationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {

    })
  }

  private mapItem(input: ProjectListElement): Item {
    return {
      name: input.name,
      id: input._id,
      description: input.description
    };
  }

  private subscribeToProjectDetailsForNameHighlight() {
    // this.store.select(ProjectQuery.getProjectModel).subscribe((project:any) => {
    //   this.projectInfo = {};
    //   this.projectInfo.name = project.name;
    //   this.projectInfo.parentId = project._id;
    //   this.projectInfo.parenttype = 'project';
    //   console.log(project);
    // });

    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      console.log(previousState);
      this.projectInfo = {};
      this.projectInfo.name = previousState.stack[previousState.stack.length - 1].name;
      this.projectInfo.parentId = previousState.stack[previousState.stack.length - 1]._id;
      this.projectInfo.parenttype = previousState.stack[previousState.stack.length - 1].type?previousState.stack[previousState.stack.length - 1].type:'project';
    });
  }

  openSubprojectModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
    dialogConfig.data = {
      id: 1,
      isSubProject: this.checkIfSubProject(),
      projectInfo: this.checkIfSubProject()?this.extractSubprojectInfo():this.projectInfo,
    };
    const dialogRef = this.dialog.open(NewSubprojectModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {

    })
  }

  private extractLocationList(locations: BuildingLocation[]){
    this.locationList = [];
    locations?.forEach(location => {
      this.locationList.push(
        {
          _id: location._id,
          createdat: location.createdat,
          createdby: location.createdby,
          description: location.description,
          name: location.name,
          parentid: location.parentid,
          parenttype: location.parenttype,
          type: location.type,
          url: location.url
        }
        );
    })
  }

  private extractSubprojectList(subproject: Project[]) {
    this.subprojectList = [];
      subproject?.forEach(project => {
          this.subprojectList.push(
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
          );
      })
  }

  private getType():string {
    // add case for subproject
    switch (this.header) {
        case "Project Common Location":
            return "projectlocation";
        case "Project Buildings":
            return "subproject";
        case "Building Common Location":
          return "buildinglocation";
        case "Building Apartments":
          return "apartment";
        default:
            return "location";
    }
  }
}
