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
    this.httpsRequestService.getHttpData<any>(`${environment.apiURL1}/projectreports/${this.projectInfo.id}`).subscribe(
      (res) => {
        console.log('API Response:', res);
        if(res && res.length > 0) {
          console.log('First item full:', res[0]);
          console.log('First item keys:', Object.keys(res[0]));
          // Map the response to flatten the nested structure
          this.projectFiles = res.map((item: any) => {
            const reportData = item.ProjectReports || item;
            console.log('Full item object:', item);
            console.log('All keys in item:', Object.keys(item));
            console.log('reportData:', reportData);
            return {
              _id: item._id || reportData._id || reportData.project_id || reportData.id || item.id,
              name: reportData.name || item.name,
              reportType: reportData.docType || item.reportType,
              uploader: reportData.uploader || item.uploader,
              timestamp: reportData.timestamp || item.timestamp,
              url: reportData.url || item.url || '',
              fileName: reportData.fileName || item.fileName || reportData.name || item.name
            };
          });
          console.log('Transformed files:', this.projectFiles);
        } else {
          this.projectFiles = res;
        }
      },
      error => {
        this.projectFiles = [];
        console.log(error);
      }
    )
  }

  downloadProjectFile = (item: any) =>{
    this.httpsRequestService.getFile(item.url).subscribe((response: any) => {
      // Create a blob from the response
      const blob = new Blob([response], { type: 'application/octet-stream' });

      // Create a URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${item.fileName}`; // Set the file name here
      link.click();

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Failed to download file', error);
    });
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

  deleteDocument = (id: string,name:string) =>{

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.height = "230px";
    dialogConfig.data={
      name:name
    }
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data.confirmed){
        
        const deleteBody = { project_id: id };
        console.log('Sending delete request with body:', deleteBody);
        
        this.httpsRequestService.postHttpData<any>(`${environment.apiURL1}/projectreports/delete`, deleteBody).subscribe(
          (res) => {
            console.log('Delete response:', res);
            this.fetchProjectFiles();
          },
          error => {
            console.log('Delete error:', error);
            this.fetchProjectFiles();
          }
        )

      }})
  }
}
