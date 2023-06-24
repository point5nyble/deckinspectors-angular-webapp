import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-upload-files-modal',
  templateUrl: './upload-files-modal.component.html',
  styleUrls: ['./upload-files-modal.component.scss']
})
export class UploadFilesModalComponent {
  fileList: File[] = [];

  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<UploadFilesModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
  }
  handleFileUpload(event: any) {
    const files: FileList = event.target.files;
    // Add all the files to the fileList array
    Array.from(files).forEach(file => this.fileList.push(file));
  }

  formatUploadTime(timestamp: number) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }

  save() {
    this.dialogRef.close(this.fileList);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
