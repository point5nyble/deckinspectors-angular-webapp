import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import { ImageToUrlConverterService } from '../../service/image-to-url-converter.service';
import { HttpsRequestService } from '../../service/https-request.service';
import { environment } from '../../../environments/environment';
import { Project } from '../../common/models/project';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-upload-files-modal',
  templateUrl: './upload-files-modal.component.html',
  styleUrls: ['./upload-files-modal.component.scss']
})
export class UploadFilesModalComponent {
  fileList: File[] = [];
  projectFiles!: any[];
  projectInfo!: Project;
  isUploading : boolean = false;
  isUploaded :boolean=false;
  constructor(private cdr: ChangeDetectorRef,
              private imageToUrlConverterService : ImageToUrlConverterService,
              private httpsRequestService: HttpsRequestService,
              private dialogRef: MatDialogRef<UploadFilesModalComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data : any,
              private clipboardService: ClipboardService) {
          this.projectInfo = data.projectInfo;      
          this.fetchProjectFiles();   
  }

  fetchProjectFiles = () =>{
    console.log("running");
    this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/projectdocuments/${this.projectInfo._id}`).subscribe(
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

  uploadFiles () {
    return new Promise((resolve, reject) =>{
      if (this.fileList.length > 0) {
        this.isUploading = true;
        this.fileList.forEach((file: File) => {
          let user = localStorage.getItem('username')
          let data = {
            'entityName': file.name,
            'uploader': user? user: "deck",
            'containerName': file.name?.replace(/-|\s|\./g, '').toLowerCase(),
            'picture': file,
          }
          console.log(data.containerName);
            this.imageToUrlConverterService.convertImageToUrl(data).subscribe(
              (response:any) => {
                // this.createProject(response.url);
                let filePayload = {
                  "project_id": this.projectInfo._id,
                  "url": response.url,
                  "name": file.name,
                  "uploader": user? user: "deck"
                }
                this.httpsRequestService.postHttpData<any>(`${environment.apiURL}/projectdocuments/add`, filePayload).subscribe(
                  (res) => {
                    console.log(res);
                    resolve(res);
                  },
                  error => {
                    console.log(error);
                  }
                )
              },
              error => {
                console.log(error)
              }
            )
  
        })
      }
    })
  }

  reset = () =>{
    this.fileList = [];
  }

  async save() {
    await this.uploadFiles();
    this.isUploading = false;
    this.reset();
    this.fetchProjectFiles();
    // this.dialogRef.close(this.fileList);
    this.isUploaded=false;
  }

  closeModal() {
    this.dialogRef.close();
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
        
        this.httpsRequestService.postHttpData<any>(`${environment.apiURL}/projectdocuments/delete`, {_id: id}).subscribe(
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
