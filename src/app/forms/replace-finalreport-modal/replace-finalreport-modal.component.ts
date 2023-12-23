import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-replace-finalreport-modal',
  templateUrl: './replace-finalreport-modal.component.html',
  styleUrls: ['./replace-finalreport-modal.component.scss']
})
export class ReplaceFinalreportModalComponent {
  fileList: File[] = [];
  

  constructor(private cdr: ChangeDetectorRef,
              private http: HttpClient,
              private dialogRef: MatDialogRef<ReplaceFinalreportModalComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data : any) {
       
  }

  selectedFile: File | null = null;
  companyName: string = '';

  // Function to handle file input change
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Function to handle form submission
  onSubmit() {
    if (!this.selectedFile || !this.companyName) {
      return; // Ensure both file and file name are provided
    }

    // Create FormData to send file and file name
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('companyName', this.companyName);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data'); // Set the correct Content-Type
   
    this.http.post(`${environment.apiURL}/project/replacefinalreporttemplate`, formData, { headers }).subscribe(
      (response) => {
        this.dialogRef.close({uploadStatus: true});
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.dialogRef.close({uploadStatus: false});
      }
    );
  }

  onClose(){
    this.dialogRef.close();
  }
}
