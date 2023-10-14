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
  reportGenerationTime = 0;
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
    // const reportId = uuidv4();
    let url = environment.apiURL + '/project/generatereport';
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
      "requestType": "init"
    }
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });
    this.showLoading = !this.showLoading;
    this.http.post<any>(url, data, { headers, responseType: 'json'}).subscribe((response: any) => {
        console.log(response);
        this.getReportStatus(false, 2, reportType, reportFormat, response.reportId);
        },
       error => {
         this.showLoading = !this.showLoading;
           console.log(error);
           alert('Error');
           this.dialogRef.close();
       })
  }

  async getReportStatus(status: boolean, waitTime: number, reportType: string, reportFormat: string, reportId: string){
    this.reportGenerationTime += waitTime;
    if (this.reportGenerationTime >= 1200){
      this.showLoading = !this.showLoading;
           console.log('Timeout! report generation');
           alert('Error');
           this.dialogRef.close();
    }
    if (status){

      let url = environment.apiURL + '/project/generatereport';
      let data = {
        "id": this.modalData.project._id,
        "sectionImageProperties": {
          "compressionQuality": 100,
          "imageFactor": this.selectedImages
        },
        "companyName": this.getCompanyNameFromActiveSection(this.activeSection),
        "reportType": reportType,
        "reportFormat": reportFormat,
        "reportId": reportId,
        "projectName": this.projectName,
        "requestType": "download"
      }
      const headers = new HttpHeaders({
        'accept': (reportFormat == "docx")?'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers, responseType: 'blob' as 'json'}).subscribe((response: any) => {

        this.showLoading = !this.showLoading;
        const blob = new Blob([response], { type: (reportFormat == "docx")?'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${this.projectName}_${reportType}.${reportFormat}`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.dialogRef.close();
        this.dialogRef.close();
      })

    }
    else{
      console.log(`Status: ${status}, Time: ${waitTime}`);
      waitTime = (waitTime >= 60)? 60 : waitTime * 2;
      let ms = waitTime * 1000;
      const sleep = async (ms: number) => await new Promise((r) => setTimeout(r, ms));
      await sleep(ms);
      const requestBody = {
        "reportType": reportType,
        "reportFormat": reportFormat,
        "reportId": reportId,
        "projectName": this.projectName,
      }
      this.http.post(`${environment.apiURL}/project/getReportStatus`, requestBody).subscribe((response: any)=>{
        this.getReportStatus(response.reportStatus, waitTime, reportType,
          reportFormat, reportId);
      })
  }
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
    if (activeSection === 'deckInspector') {
      return "DeckInspectors";
    } else {
      return "Wicr";
    }
  }
}
