import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-new-project-modal',
  templateUrl: './new-project-modal.component.html',
  styleUrls: ['./new-project-modal.component.scss']
})
export class NewProjectModalComponent implements OnInit {
  yourForm!: FormGroup;
  description:string;
  private _event: any;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewProjectModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.description = data.description;
  }

  ngOnInit() {
    this.yourForm = this.formBuilder.group({
      image: [''], // Add validators if needed
      name: [''], // Add validators if needed
      address: ['USA'],
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
    console.log(this.yourForm.value);
    this.dialogRef.close(this.yourForm.value);
  }
}
