import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {Project} from "../../../common/models/project";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewLocationModalComponent} from "../../../forms/new-location-modal/new-location-modal.component";

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

  constructor(private dialog: MatDialog) { }
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
}
