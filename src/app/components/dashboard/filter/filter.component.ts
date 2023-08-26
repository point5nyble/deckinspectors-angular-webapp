import {Component, EventEmitter, Output} from '@angular/core';
import {NewProjectModalComponent} from "../../../forms/new-project-modal/new-project-modal.component";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
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
  constructor(private dialog: MatDialog) { }

  public openModal():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
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

  filterNames() {
      this.searchedTerm.emit(this.searchTerm);
  }

  filterCompletedProjects(){
    this.filterCompleted.emit(this.isChecked);
  }
}
