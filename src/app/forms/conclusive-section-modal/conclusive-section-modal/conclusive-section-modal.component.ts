import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageToUrlConverterService} from "../../../service/image-to-url-converter.service";
import {forkJoin, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-conclusive-section-modal',
  templateUrl: './conclusive-section-modal.component.html',
  styleUrls: ['./conclusive-section-modal.component.scss']
})
export class ConclusiveSectionModalComponent {
  data: any;
  conclusiveDeckReportModalForm!: FormGroup;
  waterproofingElements = [
    'Flashings', 'Waterproofing', 'Coatings','Sealants'
  ];
  selectedImage: File[] = [];
  imagePreviewUrls: (string | ArrayBuffer | null)[] = [];
  imageControl: FormControl = new FormControl();
  propowneragreed:string = "No";
  invasiverepairsinspectedandcompleted:string = "No";
  showErrors: boolean = false;
  isSaving: boolean = false;
  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<ConclusiveSectionModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private imageToUrlConverterService : ImageToUrlConverterService) {
    this.data = data;
    this.data.images = this.data.images === undefined ? [] : this.data.images;
    this.imagePreviewUrls = JSON.parse(JSON.stringify(this.data.images));
  }

  ngOnInit() {
    console.log(`rowmap: ${this.data.rowsMap}`);
    console.log(this.data.rowsMap?.get('propowneragreed'));
    let propowneragreed:boolean = this.data.rowsMap?.get('propowneragreed');
    let invasiverepairsinspectedandcompleted:boolean = this.data.rowsMap?.get('invasiverepairsinspectedandcompleted');
    this.propowneragreed = propowneragreed === undefined ? 'false' : propowneragreed.toString();
    this.invasiverepairsinspectedandcompleted = invasiverepairsinspectedandcompleted === undefined ? 'false' : invasiverepairsinspectedandcompleted.toString();
    this.conclusiveDeckReportModalForm = this.formBuilder.group({
      conclusiveconsiderations:[this.data.rowsMap?.get('conclusiveconsiderations'), (this.data.rowsMap?.get('propowneragreed'))? null: Validators.required],
      EEE:[this.data.rowsMap?.get('eeeconclusive'), (this.data.rowsMap?.get('propowneragreed'))? null: Validators.required],
      LBC:[this.data.rowsMap?.get('lbcconclusive'), (this.data.rowsMap?.get('propowneragreed'))? null: Validators.required],
      AWE:[this.data.rowsMap?.get('aweconclusive'), (this.data.rowsMap?.get('propowneragreed'))? null: Validators.required],
      invasiverepairsinspectedandcompleted:[this.data.rowsMap?.get('invasiverepairsinspectedandcompleted').toString()],
      propowneragreed:[this.data.rowsMap?.get('propowneragreed').toString()],
      conclusiveimages:[this.data.images, (this.data.rowsMap?.get('propowneragreed'))? null: Validators.required]
    });
    // @ts-ignore
    this.conclusiveDeckReportModalForm?.get('invasiverepairsinspectedandcompleted').valueChanges.subscribe(value => {
      this.invasiverepairsinspectedandcompleted = value;
    });
    // @ts-ignore
    this.conclusiveDeckReportModalForm?.get('propowneragreed').valueChanges.subscribe(value => {
      this.propowneragreed = value;
    });



  }
  close() {
    this.imagePreviewUrls = this.data.images;
    this.conclusiveDeckReportModalForm.patchValue({
      conclusiveimages: this.imagePreviewUrls
    })
    this.dialogRef.close();
  }

  save() {
    if(this.conclusiveDeckReportModalForm.valid){
      this.isSaving = true;
      this.uploadImage();
    } else{
      this.showErrors = true;
    }
  }

  handleFileInput(event: any) {
    const files = event.target.files;
    this.imageControl.setValue(files); // Set the form control value if needed
    if (this.imagePreviewUrls === null || this.imagePreviewUrls === undefined) {
      this.imagePreviewUrls = [];
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedImage.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrls.push(reader.result);
        this.conclusiveDeckReportModalForm.patchValue({
          conclusiveimages: this.imagePreviewUrls
        })
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(index: number) {
    this.imageControl.setValue(null); // Reset the form control value if needed
    this.imagePreviewUrls.splice(index, 1);
    this.conclusiveDeckReportModalForm.patchValue({
      conclusiveimages: this.imagePreviewUrls
    })
  }

  uploadImage() {
    let data:any = {
      'entityName': 'conclusivefolder',
      'uploader': 'deck',
      'containerName': 'conclusivefolder',
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
          this.isSaving = false;
        },
        (error) => {
          console.log(error);
          this.isSaving = false;
        }
      );
    if (imageRequests.length === 0) {
      this.addImagesUrlIfAny([]);
      return;
    }

  }

  private addImagesUrlIfAny(imageUrls: string[]) {
    if (this.imagePreviewUrls) {
      // push all imagePreviewUrls if they are string
      this.imagePreviewUrls.forEach(imageUrl => {
        if (typeof imageUrl === "string" && this.isValidImageLink(imageUrl)) {
          imageUrls.push(imageUrl);
        }
      })
    }
    this.conclusiveDeckReportModalForm.patchValue({
      conclusiveimages: imageUrls,
      propowneragreed: (this.conclusiveDeckReportModalForm.value['propowneragreed'] === "Yes").toString(),
      invasiverepairsinspectedandcompleted: (this.conclusiveDeckReportModalForm.value['invasiverepairsinspectedandcompleted'] === "Yes").toString()
    });
    this.dialogRef.close(this.conclusiveDeckReportModalForm.value);
  }

  private isValidImageLink(imageUrl: string): boolean {
    return (imageUrl.startsWith("http") || imageUrl.startsWith("https"));
  }

  showContent() {
    if (this.propowneragreed.valueOf() === "Yes"){
      this.conclusiveDeckReportModalForm.get('conclusiveconsiderations')?.setValidators([Validators.required]);
      this.conclusiveDeckReportModalForm.get('EEE')?.setValidators([Validators.required]);
      this.conclusiveDeckReportModalForm.get('LBC')?.setValidators([Validators.required]);
      this.conclusiveDeckReportModalForm.get('AWE')?.setValidators([Validators.required]);
      this.conclusiveDeckReportModalForm.get('invasiverepairsinspectedandcompleted')?.setValidators([Validators.required]);
      this.conclusiveDeckReportModalForm.get('conclusiveimages')?.setValidators([Validators.required]);
    }
    else{
      this.conclusiveDeckReportModalForm.get('conclusiveconsiderations')?.clearValidators();
      this.conclusiveDeckReportModalForm.get('EEE')?.clearValidators();
      this.conclusiveDeckReportModalForm.get('LBC')?.clearValidators();
      this.conclusiveDeckReportModalForm.get('AWE')?.clearValidators();
      this.conclusiveDeckReportModalForm.get('invasiverepairsinspectedandcompleted')?.clearValidators();
      this.conclusiveDeckReportModalForm.get('conclusiveimages')?.clearValidators();
    }
    this.conclusiveDeckReportModalForm.get('conclusiveconsiderations')?.updateValueAndValidity();
    this.conclusiveDeckReportModalForm.get('EEE')?.updateValueAndValidity();
    this.conclusiveDeckReportModalForm.get('LBC')?.updateValueAndValidity();
    this.conclusiveDeckReportModalForm.get('AWE')?.updateValueAndValidity();
    this.conclusiveDeckReportModalForm.get('invasiverepairsinspectedandcompleted')?.updateValueAndValidity();
    this.conclusiveDeckReportModalForm.get('conclusiveimages')?.updateValueAndValidity();
    return this.propowneragreed.valueOf() === "Yes";
  }
}

