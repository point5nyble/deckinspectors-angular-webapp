import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-visual-deck-report-modal',
  templateUrl: './visual-deck-report-modal.component.html',
  styleUrls: ['./visual-deck-report-modal.component.scss']
})
export class VisualDeckReportModalComponent implements OnInit {
  data: any;
  visualDeckReportModalForm!: FormGroup;
  exteriorElementsOptions = [
    'Decks', 'Porches / Entry', 'Stairs', 'Stairs Landing', 'Walkways', 'Railings', 'Integrations', 'Door Threshold'
  ];
  waterproofingElements = [
    'Flashings', 'Waterproofing', 'Coatings','Sealants'
  ];

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<VisualDeckReportModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.data = data;
  }

  ngOnInit() {
    console.log(this.data);
    this.visualDeckReportModalForm = this.formBuilder.group({
      visualReportName: [this.data.rowsMap?.get('name')], // Add validators if needed
      exteriorElements: [this.data.rowsMap?.get('exteriorelements')], // Add validators if needed
      waterproofingElements: [this.data.rowsMap?.get('waterproofingelements')],
      visualReview:[this.data.rowsMap?.get('visualreview')],
      signsOfLeaks:[this.data.rowsMap?.get('visualsignsofleak')],
      invasiveReviewRequired:[this.data.rowsMap?.get('furtherinvasivereviewrequired')],
      conditionAssessment: [this.data.rowsMap?.get('conditionalassessment')],
      additionalConsiderationsOrConcern:[this.data.rowsMap?.get('additionalconsiderations')],
      EEE:[this.data.rowsMap?.get('eee')],
      LBC:[this.data.rowsMap?.get('lbc')],
      AWE:[this.data.rowsMap?.get('awe')]
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
