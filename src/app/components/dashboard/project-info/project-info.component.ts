import { Component, Input } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AssignProjectModalComponent} from "../../../forms/assign-project-modal/assign-project-modal.component";
import {UploadFilesModalComponent} from "../../../forms/upload-fiels-modal/upload-files-modal.component";
import {DownloadFilesModalComponent} from "../../../forms/download-files-modal/download-files-modal.component";
import {Project} from "../../../common/models/project";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent {
  @Input() projectInfo!: Project;
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

  openUploadFilesModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "700px";
    dialogConfig.data = {
      id: 1
    };
    const dialogRef = this.dialog.open(UploadFilesModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
    })
  }


  openDownloadReportModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "300px";
    dialogConfig.height = "400px";
    dialogConfig.data = {
      id: 1
    };
    const dialogRef = this.dialog.open(DownloadFilesModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
    })
  }
}
