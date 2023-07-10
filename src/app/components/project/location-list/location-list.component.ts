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

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  @Output() isDbClick = new EventEmitter<BuildingLocation>();
  @Input() header!: string;
  @Input() locations!: BuildingLocation[];
  @Input() subproject!: Project[];
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
  onDbClick(locationInfo:BuildingLocation) {
    console.log(locationInfo);
    this.isDbClick.emit(locationInfo);
    if (locationInfo._id !== '') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, false);
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Location_Click, this.mapItem(locationInfo));
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
      projectInfo: this.checkIfSubProject()?this.extractSubprojectInfo():this.projectInfo,
    };
    const dialogRef = this.dialog.open(NewLocationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {

    })
  }

  private mapItem(input: BuildingLocation): Item {
    return {
      name: input.name,
      id: input._id,
      description: input.description
    };
  }

  private subscribeToProjectDetailsForNameHighlight() {
    this.store.select(ProjectQuery.getProjectModel).subscribe((project:any) => {
      this.projectInfo = {};
      this.projectInfo.name = project.name;
      this.projectInfo.parentId = project._id;
      this.projectInfo.parenttype = 'project';
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
}
