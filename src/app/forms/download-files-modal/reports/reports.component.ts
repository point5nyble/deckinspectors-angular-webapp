import {Component, Input} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ImageToUrlConverterService } from 'src/app/service/image-to-url-converter.service';
import { HttpsRequestService } from 'src/app/service/https-request.service';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/common/models/project';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  fileList: File[] = [];
  projectFiles!: any[];
  @Input() projectInfo!: Project;
  isUploading : boolean = false;
  isUploaded :boolean=false;
  constructor(private imageToUrlConverterService : ImageToUrlConverterService,
              private httpsRequestService: HttpsRequestService,
              private dialog: MatDialog,
              private clipboardService: ClipboardService) {    
  }

  ngOnInit(){
    this.fetchProjectFiles(); 
  }

  fetchProjectFiles = () =>{
    console.log("running");
    this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/projectreports/${this.projectInfo._id}`).subscribe(
      (res) => {
        this.projectFiles = res;
        console.log(res);
      },
      error => {
        this.projectFiles = [];
        console.log(error);
      }
    )
  }

  handleFileUpload(event: any) {
    const files: FileList = event.target.files;
    // Add all the files to the fileList array
    Array.from(files).forEach(file => this.fileList.push(file));
    this.isUploaded=true;
  }

  formatUploadTime(timestamp: number) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
    this.isUploaded=false;
  }

  

  reset = () =>{
    this.fileList = [];
  }


  copyLink = (url: string) =>{
    this.clipboardService.copyFromContent(url);
  }

  deleteDocument = (id: string) =>{

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    // dialogConfig.height = "140px";
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data.confirmed){
        
        this.httpsRequestService.postHttpData<any>(`${environment.apiURL}/projectreports/delete`, {_id: id}).subscribe(
          (res) => {
            console.log(res);
            this.fetchProjectFiles();
          },
          error => {
            console.log(error);
            this.fetchProjectFiles();
          }
        )

      }})
  }
}
