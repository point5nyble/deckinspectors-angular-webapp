import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-assign-project-modal',
  templateUrl: './assign-project-modal.component.html',
  styleUrls: ['./assign-project-modal.component.scss']
})
export class AssignProjectModalComponent {
  names: any[] = [
    { name: 'John', checked: false },
    { name: 'Jane', checked: false },
    { name: 'Mike', checked: false },
    { name: 'Emily', checked: false },
    // Add more names as needed
  ];

  filteredNames: any[] = [];
  searchTerm: string = '';

  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<AssignProjectModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.filteredNames = this.names;
    // console.log(data);
   }
  filterNames() {
    this.filteredNames = this.names.filter((name) =>
      name.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  refreshList() {
    this.filteredNames = this.names;
    this.searchTerm = '';
  }

  close() {
    this.dialogRef.close();
  }

  save() {
     this.dialogRef.close(this.names.filter((name) => name.checked));
  }
}
