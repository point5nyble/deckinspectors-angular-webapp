import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from '../../../environments/environment';

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

  private downloadReport(reportType: string, reportFormat: string) {
    console.log("report format" + reportFormat);
    let url = environment.apiURL + '/project/generatereport';
    let data = {
      "id": this.modalData.project._id,
      "sectionImageProperties": {
        "compressionQuality": 100,
        "imageFactor": this.selectedImages
      },
      "companyName": this.getCompanyNameFromActiveSection(this.activeSection),
      "reportType": reportType,
      "reportFormat": reportFormat
    }
    const headers = new HttpHeaders({
      'accept': (reportFormat == "docx")?'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
      'Content-Type': 'application/json'
    });
    this.showLoading = !this.showLoading;
    this.http.post<any>(url, data, { headers, responseType: 'blob' as 'json'}).subscribe((response: any) => {
        this.showLoading = !this.showLoading;
        const blob = new Blob([response], { type: (reportFormat == "docx")?'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        window.open(downloadUrl);
        this.dialogRef.close();
        },
       error => {
         this.showLoading = !this.showLoading;
           console.log(error);
           alert('Error');
           this.dialogRef.close();
       })
  }


  downloadReportEvent($event: any) {
    if ($event.title === 'Visual Report') {
      this.downloadReport('Visual', $event.reportFormat);
    } else if ($event.title === 'Invasive Only Report') {
      this.downloadReport('InvasiveOnly', $event.reportFormat);
    } else if ($event.title == 'Final Report') {
      this.downloadReport('Invasive', $event.reportFormat);
    }
  }

  onSliderChange(event: any) {
    this.imageQuality = event.value;
  }

  private getCompanyNameFromActiveSection(activeSection: string) {
    if (activeSection === 'deckInspector') {
      return "DeckInspectors";
    } else {
      return "Wicr";
    }
  }
}
