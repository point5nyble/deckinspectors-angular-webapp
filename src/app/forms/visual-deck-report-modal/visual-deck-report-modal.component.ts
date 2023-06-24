import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-visual-deck-report-modal',
  templateUrl: './visual-deck-report-modal.component.html',
  styleUrls: ['./visual-deck-report-modal.component.scss']
})
export class VisualDeckReportModalComponent implements OnInit {
  visualDeckReportModalForm!: FormGroup;
  exteriorElementsOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
    // Add more options as needed
  ];

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<VisualDeckReportModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
  }

  ngOnInit() {
    this.visualDeckReportModalForm = this.formBuilder.group({
      visualReportName: [''], // Add validators if needed
      exteriorElements: [''], // Add validators if needed
      waterproofingElements: [''],
      visualReview:[''],
      signsOfLeaks:[''],
      invasiveReviewRequired:[''],
      conditionAssessment: [''],
      additionalConsiderationsOrConcern:[''],
      EEE:[''],
      LBC:[''],
      AWE:['']
    });
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.visualDeckReportModalForm.value);
    this.dialogRef.close(this.visualDeckReportModalForm.value);
  }
}
