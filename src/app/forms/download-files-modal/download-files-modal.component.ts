import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-download-files-modal',
  templateUrl: './download-files-modal.component.html',
  styleUrls: ['./download-files-modal.component.scss']
})
export class DownloadFilesModalComponent {
  public projectName!: string;
  private modalData!: any;
  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<DownloadFilesModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private http: HttpClient) {
    console.log(data);
    this.modalData = data;
    this.projectName = data.project.name;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.downloadReport();
    this.dialogRef.close();
  }

  private downloadReport() {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/generatereport';
    let data = {
      "id": this.modalData.project._id,
      "sectionImageProperties": {
        "compressionQuality": 100,
        "imageFactor": 3
      },
      "companyName": "Wicr",
      "reportType": "visual"
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/pdf');
    this.http.post(url, data, { headers }).subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        window.open(downloadUrl);
        },
       error => {
           console.log(error);
           // alert('Error');
           // this.dialogRef.close();
       })
  }

  downloadReportEvent($event: string) {
    this.downloadReport();
    this.dialogRef.close();
  }
}
