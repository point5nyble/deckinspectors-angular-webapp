import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AssignProjectModalComponent} from "../../../forms/assign-project-modal/assign-project-modal.component";
import {UploadFilesModalComponent} from "../../../forms/upload-fiels-modal/upload-files-modal.component";
import {DownloadFilesModalComponent} from "../../../forms/download-files-modal/download-files-modal.component";
import {Project} from "../../../common/models/project";
import { HttpsRequestService } from 'src/app/service/https-request.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent {
  @Input() projectInfo!: Project;
  @Output() projectAssignedEvent = new EventEmitter<any>();
  @Output() childClickEventTriggered = new EventEmitter<boolean>();
  @Output() markCompletedEvent = new EventEmitter<boolean>();
  constructor(private dialog: MatDialog, private httpsRequestService:HttpsRequestService) { }

  isAdmin: boolean = ((JSON.parse(localStorage.getItem('user')!))?.role === "admin");

  openAssignProjectModal() {
    this.childClickEventTriggered.emit(true);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "350px";
    dialogConfig.data = {
      project: this.projectInfo
    };
    const dialogRef = this.dialog.open(AssignProjectModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.projectAssignedEvent.emit({isAssigned: data.isAssigned, apiCalled: data.apiCalled});
     })

  }

  openUploadFilesModal() {
    this.childClickEventTriggered.emit(true);
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
    })
  }

  openDownloadReportModal() {
    this.childClickEventTriggered.emit(true);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "500px";
    dialogConfig.data = {
      id: 1,
      project: this.projectInfo
    };
    const dialogRef = this.dialog.open(DownloadFilesModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
    })
  }

  markComplete = () =>{
    this.childClickEventTriggered.emit(true);
    this.httpsRequestService.postHttpData<any>(`https://deckinspectors-dev.azurewebsites.net/api/project/${this.projectInfo._id}/toggleprojectstatus/${this.projectInfo.iscomplete ? 0 : 1}`, {}).subscribe(
      (data) => {
        this.markCompletedEvent.emit(!this.projectInfo.iscomplete);
      },
      error => {
        console.log(error);
      }
    )
  }

  moveProjectToFolder = () =>{
    this.childClickEventTriggered.emit(true);
  }
}
