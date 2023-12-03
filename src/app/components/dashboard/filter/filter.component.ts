import {Component, EventEmitter, Output} from '@angular/core';
import {NewProjectModalComponent} from "../../../forms/new-project-modal/new-project-modal.component";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ReplaceFinalreportModalComponent } from 'src/app/forms/replace-finalreport-modal/replace-finalreport-modal.component';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  searchTerm!: string;
  isChecked!: boolean;
  @Output() searchedTerm = new EventEmitter<string>();
  @Output() filterCompleted = new EventEmitter<boolean>();
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

  filterNames() {
      this.searchedTerm.emit(this.searchTerm);
  }

  filterCompletedProjects(){
    this.filterCompleted.emit(this.isChecked);
  }
}
