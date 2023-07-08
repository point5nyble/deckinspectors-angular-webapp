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
  data!:any;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewLocationModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.description = data.description;
    this.subProjectNames = data.projectName;
    this.isSubProject = data.isSubProject;
    this.data = data;
  }

  ngOnInit() {
    this.newLocationForm = this.formBuilder.group({
      image: [''], // Add validators if needed
      name: [this.data.location.name], // Add validators if needed
      option: [''], // Add validators if needed
      description: [this.data.location.description]
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
    this.dialogRef.close(this.newLocationForm.value);
  }
}
