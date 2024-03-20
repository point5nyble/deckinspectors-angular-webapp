import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Project } from 'src/app/common/models/project';

@Component({
  selector: 'app-download-files-modal',
  templateUrl: './download-files-modal.component.html',
  styleUrls: ['./download-files-modal.component.scss']
})
export class DownloadFilesModalComponent {
  public projectName!: string;
  private modalData!: any;
  projectInfo!: Project;
  showLoading: boolean = false;
  reportGenerationTime = 0;
  activeSection: string = 'e3inspections'; // Variable to keep track of the active section
  imageQuality = 50; // Default image quality value
  selectedImages = '3'; // Default selected image option
  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<DownloadFilesModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private http: HttpClient) {
    this.modalData = data;
    this.projectName = data.project.name;
    this.projectInfo = data.project;
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
    //let url = environment.apiURL + '/project/generatereport';
    let url = "https://deckmultireportingapp.azurewebsites.net/api/project/generateReport";
      let data = {
        "id": this.modalData.project._id,
        "sectionImageProperties": {
          "compressionQuality": 100,
          "imageFactor": this.selectedImages
        },
        "companyName": this.getCompanyNameFromActiveSection(this.activeSection),
        "reportType": reportType,
        "reportFormat": reportFormat,
        // "reportId": reportId,
        "projectName": this.projectName,
        "user": localStorage.getItem('username')
        // "requestType": "download"
      }
      let token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'accept': (reportFormat == "docx")?'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
        'Content-Type': 'application/json',
        'Authorization': token!
      });

      // this.showLoading = !this.showLoading;
      this.http.post<any>(url, data, { headers, responseType: 'blob' as 'json'}).subscribe((response: any) => {
        // this.showLoading = !this.showLoading;
        // const blob = new Blob([response], { type: (reportFormat == "docx")?'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf' });
        // const downloadUrl = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = downloadUrl;
        // a.download = `${this.projectName}_${reportType}.${reportFormat}`;
        // a.style.display = 'none';
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        
      });
      this.dialogRef.close({isDownloading: true});
  }

  downloadFinalReport(reportType: string, reportFormat: string) {
    let url = environment.apiURL + '/project/finalreport';
    let data = {
     "companyName": this.getCompanyNameFromActiveSection(this.activeSection)
    };
    const headers = new HttpHeaders({
      'accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Type': 'application/json'
    });
    this.showLoading = !this.showLoading;
    this.http.post<any>(url, data, { headers, responseType: 'blob' as 'json'}).subscribe((response: any) => {
        this.showLoading = !this.showLoading;
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${this.projectName}_${reportType}.docx`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
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
    }else if($event.title === 'Invasive Report') {
      this.downloadReport('Invasive', $event.reportFormat);
    }
    else if ($event.title === 'Invasive Only Report') {
      this.downloadReport('InvasiveOnly', $event.reportFormat);

    } else if ($event.title == 'Invasive Report') {
      this.downloadReport('Invasive', $event.reportFormat);
    } else if ($event.title == 'Final Report') {
      this.downloadFinalReport('Final', $event.reportFormat);

    }
  }

  onSliderChange(event: any) {
    this.imageQuality = event.value;
  }

  private getCompanyNameFromActiveSection(activeSection: string) {
    if (activeSection === 'e3inspections') {
      return "E3Inspections";
    } else {
      return "Wicr";
    }
  }
}
