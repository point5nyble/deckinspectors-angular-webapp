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
  showLoading: boolean = false;
  activeSection: string = 'deckInspector'; // Variable to keep track of the active section
  imageQuality = 50; // Default image quality value
  selectedImages = '3'; // Default selected image option
  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<DownloadFilesModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private http: HttpClient) {
    // console.log(data);
    this.modalData = data;
    this.projectName = data.project.name;
  }

  showSection(section: string): void {
    this.activeSection = section;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close();
  }

  private downloadReport(reportType: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/generatereporthtml';
    let data = {
      "id": this.modalData.project._id,
      "sectionImageProperties": {
        "compressionQuality": 100,
        "imageFactor": 3
      },
      "companyName": "Wicr",
      "reportType": reportType
    }
    const headers = new HttpHeaders({
      'accept': 'text/html',
      'Content-Type': 'application/json'
    });
    this.showLoading = !this.showLoading;
    this.http.post<any>(url, data, { headers, responseType: 'text' as 'json'}).subscribe((response: any) => {
        console.log(response);
        this.showLoading = !this.showLoading;
        const newWindow = window.open('', '_blank');
        newWindow?.document.open();
        newWindow?.document.write(response);
        newWindow?.document.close();
        // this.createPdf(response);
        // const blob = new Blob([response], { type: 'application/pdf' });
        // const downloadUrl = window.URL.createObjectURL(blob);
        // window.open(downloadUrl);
        this.dialogRef.close();
        },
       error => {
         this.showLoading = !this.showLoading;
           console.log(error);
           alert('Error');
           this.dialogRef.close();
       })
  }


  downloadReportEvent($event: string) {
    if ($event === 'Visual Report') {
      this.downloadReport('Visual');
    } else if ($event === 'Invasive Only Report') {
      this.downloadReport('InvasiveOnly');
    } else if ($event == 'Final Report') {
      this.downloadReport('Invasive');
    }
  }

  onSliderChange(event: any) {
    this.imageQuality = event.value;
  }
}
