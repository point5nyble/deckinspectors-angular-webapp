import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewCustomFormComponent } from 'src/app/forms/new-custom-form/new-custom-form.component';

@Component({
  selector: 'app-custom-forms',
  templateUrl: './custom-forms.component.html',
  styleUrls: ['./custom-forms.component.scss']
})
export class CustomFormsComponent {
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
    const dialogRef = this.dialog.open(NewCustomFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data.name !== undefined) {
        // this.newProjectUploaded.emit(true);
      }
    })

  }
}
