import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AssignProjectModalComponent} from "../../../forms/assign-project-modal/assign-project-modal.component";
import {UploadFilesModalComponent} from "../../../forms/upload-fiels-modal/upload-files-modal.component";
import {DownloadFilesModalComponent} from "../../../forms/download-files-modal/download-files-modal.component";
import {Project} from "../../../common/models/project";
import { HttpsRequestService } from 'src/app/service/https-request.service';
import { environment } from '../../../../environments/environment';
import { DeleteConfirmationModalComponent } from '../../../forms/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent {
  @Input() projectInfo!: Project;  
  formattedDate!: string;
  @Output() projectAssignedEvent = new EventEmitter<any>();
  @Output() childClickEventTriggered = new EventEmitter<boolean>();
  @Output() markCompletedEvent = new EventEmitter<boolean>();
  @Output() projectEventDeletedEvent = new EventEmitter<any>();
  @Output() isDownloading = new EventEmitter<boolean>();
  
  constructor(private dialog: MatDialog, private httpsRequestService:HttpsRequestService) {}

  ngOnInit(): void{
      let createdDate= new Date(this.projectInfo.createdat);
      let months: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  let day: number =createdDate.getDate();
  let monthIndex: number =createdDate.getMonth();
  let year: number =createdDate.getFullYear();
  this.formattedDate= `${months[monthIndex]} ${day}, ${year}`;
  }
  isAdmin: boolean = ((JSON.parse(localStorage.getItem('user')!))?.role === "admin");
  Status:String='false';
  openAssignProjectModal() {
    this.childClickEventTriggered.emit(true);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "600px";
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
      "projectInfo": this.projectInfo
    };
    const dialogRef = this.dialog.open(UploadFilesModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      //data -> array of files uploaded
      data.forEach((file: File) => {

      })
    })
  }

  openDownloadReportModal() {
    this.childClickEventTriggered.emit(true);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "500px";
    dialogConfig.data = {
      id: 1,
      project: this.projectInfo
    };
    const dialogRef = this.dialog.open(DownloadFilesModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.isDownloading.emit(data?.isDownloading);
    })
  }

  markComplete = () =>{
    this.childClickEventTriggered.emit(true);
    this.httpsRequestService.postHttpData<any>(`${environment.apiURL}/project/${this.projectInfo._id}/toggleprojectstatus/${this.projectInfo.iscomplete ? 0 : 1}`, {}).subscribe(
      (data) => {
        this.markCompletedEvent.emit(!this.projectInfo.iscomplete);
      },
      error => {
        console.log(error);
      }
    )
  }

  // moveProjectToFolder = () =>{
  //   this.childClickEventTriggered.emit(true);
  // }
  deleteProject() {
    this.childClickEventTriggered.emit(true);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    // dialogConfig.height = "140px";
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data.confirmed){
        let url = environment.apiURL + "/project/" + this.projectInfo._id;
        this.httpsRequestService.deleteHttpData<any>(url).subscribe(data => {
          this.projectEventDeletedEvent.emit({project_id: this.projectInfo._id, state: true});
        }, error => {
          console.log(error);
        })
      }})
  }
  StatusCheck(){
    this.childClickEventTriggered.emit(true);
    this.Status='true';
  }

  folderOpen(){
    this.childClickEventTriggered.emit(true);
  }
}
