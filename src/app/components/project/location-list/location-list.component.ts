import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {Project} from "../../../common/models/project";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewLocationModalComponent} from "../../../forms/new-location-modal/new-location-modal.component";
import {Item} from "../../../common/models/project-tree";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent
{
  @Output() isDbClick = new EventEmitter<BuildingLocation>();
  @Input() header!: string;
  @Input() locations!: BuildingLocation[];
  @Input() subproject!: Project[];

  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService: OrchestratorCommunicationService) { }
  checkIfSubProject() : boolean {
    return (this.header === "Project Buildings");
  }

  extractProjectName()  {
    let subProjectNames:string[] = [];
    this.subproject?.forEach(project => {
      subProjectNames.push(project.name);
    });
    return subProjectNames;
  }
  onDbClick(locationInfo:BuildingLocation) {
    this.isDbClick.emit(locationInfo);
    if (locationInfo._id !== '') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, false);
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Location_Click, this.mapItem(locationInfo));
    }
  }

  public openModal():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
    dialogConfig.data = {
      id: 1,
      isSubProject: this.checkIfSubProject(),
      projectName: this.extractProjectName()
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
}
