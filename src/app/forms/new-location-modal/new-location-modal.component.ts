import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-new-location-modal',
  templateUrl: './new-location-modal.component.html',
  styleUrls: ['./new-location-modal.component.scss']
})
export class NewLocationModalComponent {
  newLocationForm!: FormGroup;
  description:string;
  private _event: any;
  subProjectNames: string[] = [];
  isSubProject: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewLocationModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.description = data.description;
    this.subProjectNames = data.projectName;
    this.isSubProject = data.isSubProject;
    console.log(data);
  }

  ngOnInit() {
    this.newLocationForm = this.formBuilder.group({
      image: [''], // Add validators if needed
      name: [''], // Add validators if needed
      address: [''],
      option: [''], // Add validators if needed
      description: [this.description, []]
    });
  }

  handleFileInput(event: any) {
    this._event = event;
    // Handle file input change, e.g., read and process the selected file
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.newLocationForm.value);
    this.dialogRef.close(this.newLocationForm.value);
  }
}
