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
    this.imagePreviewUrls = this.data.images;
  }

  ngOnInit() {
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
      images:[this.data.images]
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
    this.imageControl.setValue(files);
    // Set the form control value if needed
    if (this.imagePreviewUrls === null || this.imagePreviewUrls === undefined) {
      this.imagePreviewUrls = [];
    }
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
      'containerName': this.visualDeckReportModalForm.value.visualReportName.replace(/\s+/g, '').toLowerCase(),
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
          this.addImagesUrlIfAny(imageUrls);

        },
        (error) => {
          console.log(error);
        }
      );
    if (imageRequests.length === 0) {
      this.addImagesUrlIfAny([]);
      return;
    }

  }

  private addImagesUrlIfAny(imageUrls: string[]) {
    if (this.imagePreviewUrls) {
      // push all imagePreviewUrls if they are images.
      // We are verifying this as in edit functionality there could be images
      this.imagePreviewUrls.forEach(imageUrl => {
        if (typeof imageUrl === "string" && this.isValidImageLink(imageUrl)) {
          imageUrls.push(imageUrl);
        }
      })
    }
    this.visualDeckReportModalForm.patchValue({
      images: imageUrls
    });
    this.dialogRef.close(this.visualDeckReportModalForm.value);
  }

  private isValidImageLink(imageUrl: string): boolean {
    return (imageUrl.startsWith("http") || imageUrl.startsWith("https"));
  }
}
