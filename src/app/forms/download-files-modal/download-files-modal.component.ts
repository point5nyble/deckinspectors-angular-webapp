import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-download-files-modal',
  templateUrl: './download-files-modal.component.html',
  styleUrls: ['./download-files-modal.component.scss']
})
export class DownloadFilesModalComponent {
  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<DownloadFilesModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
    console.log(data);
  }
}
