import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageToUrlConverterService} from "../../service/image-to-url-converter.service";
import {forkJoin, Observable} from "rxjs";
import { map } from 'rxjs/operators';


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
  selectedImage: File[] = [];
  imagePreviewUrls: (string | ArrayBuffer | null)[] = [];
  imageControl: FormControl = new FormControl();

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<VisualDeckReportModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private imageToUrlConverterService : ImageToUrlConverterService) {
    this.data = data;
  }

  ngOnInit() {
    console.log(this.data);
    this.visualDeckReportModalForm = this.formBuilder.group({
      visualReportName: [this.data.rowsMap?.get('name')], // Add validators if needed
      exteriorElements: [this.data.rowsMap?.get('exteriorelements')], // Add validators if needed
      waterproofingElements: [this.data.rowsMap?.get('waterproofingelements')],
      visualReview:[this.data.rowsMap?.get('visualreview')],
      signsOfLeaks:[this.data.rowsMap?.get('visualsignsofleak')+''],
      invasiveReviewRequired:[this.data.rowsMap?.get('furtherinvasivereviewrequired')+''],
      conditionAssessment: [this.data.rowsMap?.get('conditionalassessment')],
      additionalConsiderationsOrConcern:[this.data.rowsMap?.get('additionalconsiderations')],
      EEE:[this.data.rowsMap?.get('eee')],
      LBC:[this.data.rowsMap?.get('lbc')],
      AWE:[this.data.rowsMap?.get('awe')],
      images:[]
    });
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    this.uploadImage();
  }

  handleFileInput(event: any) {
    const files = event.target.files;
    this.imageControl.setValue(files); // Set the form control value if needed
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedImage.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrls.push(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(index: number) {
    this.imageControl.setValue(null); // Reset the form control value if needed
    this.imagePreviewUrls.splice(index, 1);
  }

  uploadImage() {
    let data:any = {
      'entityName': this.visualDeckReportModalForm.value.visualReportName,
      'uploader': 'deck',
      'containerName': this.visualDeckReportModalForm.value.visualReportName.replace(' ', '').toLowerCase(),
    }
    const imageRequests:Observable<any>[]= [];
    this.selectedImage.forEach(file => {
      data['picture'] = file;
      imageRequests.push(this.imageToUrlConverterService.convertImageToUrl(data));
    })

    forkJoin(imageRequests)
      .pipe(
        map((responses) => responses.map((response: any) => response.url))
      )
      .subscribe(
        (imageUrls: string[]) => {
          console.log(imageUrls);
          this.visualDeckReportModalForm.patchValue({
            images: imageUrls
          });
          console.log(this.visualDeckReportModalForm.value);
          this.dialogRef.close(this.visualDeckReportModalForm.value);
        },
        (error) => {
          console.log(error);
        }
      );

  }
}
