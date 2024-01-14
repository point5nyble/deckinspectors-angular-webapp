import { Component,  EventEmitter, Output } from '@angular/core';
import { NewProjectModalComponent } from 'src/app/forms/new-project-modal/new-project-modal.component';
import { ReplaceFinalreportModalComponent } from 'src/app/forms/replace-finalreport-modal/replace-finalreport-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  showProjectInfo: string = 'home';
  @Output() newProjectUploaded = new EventEmitter<boolean>();
  @Output() fileUploaded = new EventEmitter<boolean>();
  constructor(private dialog: MatDialog) { }

  public openModal():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "640px";
    dialogConfig.data = {
      id: 1
    };
    const dialogRef = this.dialog.open(NewProjectModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data.name !== undefined) {
        this.newProjectUploaded.emit(true);
      }
    })

  }

  replaceFinalReportTemplate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "400px";
    dialogConfig.data = {
      
    };
    const dialogRef = this.dialog.open(ReplaceFinalreportModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data){
        this.fileUploaded.emit(data.uploadStatus);
      }
    })
  }
}
