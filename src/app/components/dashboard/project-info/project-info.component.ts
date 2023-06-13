import { Component, Input } from '@angular/core';
import { ProjectInfo } from 'src/app/common/models/project-info';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AssignProjectModalComponent} from "../../../forms/assign-project-modal/assign-project-modal.component";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent {
  @Input() projectInfo!: ProjectInfo;
  constructor(private dialog: MatDialog) { }

  openAssignProjectModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "350px";
    dialogConfig.data = {
      id: 1
    };
    const dialogRef = this.dialog.open(AssignProjectModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
    })

  }
}
