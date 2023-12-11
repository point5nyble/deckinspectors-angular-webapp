import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageToUrlConverterService} from "../../../service/image-to-url-converter.service";
import {forkJoin, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-invasive-section-modal',
  templateUrl: './invasive-section-modal.component.html',
  styleUrls: ['./invasive-section-modal.component.scss']
})
export class InvasiveSectionModalComponent {
  data: any;
  invasiveDeckReportModalForm!: FormGroup;
  selectedImage: File[] = [];
  imagePreviewUrls: (string | ArrayBuffer | null)[] = [];
  imageControl: FormControl = new FormControl();
  showErrors: boolean = false;
  isSaving: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<InvasiveSectionModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private imageToUrlConverterService : ImageToUrlConverterService) {
    this.data = data;
    this.data.images = this.data.images === undefined ? [] : this.data.images;
    this.imagePreviewUrls = JSON.parse(JSON.stringify(this.data.images));
  }

  ngOnInit() {
    this.invasiveDeckReportModalForm = this.formBuilder.group({
      invasiveDescription:[this.data.rowsMap?.get('invasiveDescription'), Validators.required],
      invasiveimages:[this.data.images, Validators.required],
      postinvasiverepairsrequired:[this.data.rowsMap?.get('postinvasiverepairsrequired') + ''],
    });
  }
  close() {
    this.imagePreviewUrls = this.data.images;
    this.invasiveDeckReportModalForm.patchValue({
      invasiveimages: this.imagePreviewUrls
    })
    this.dialogRef.close();
  }

  save() {
    if(this.invasiveDeckReportModalForm.valid){
      this.isSaving = true;
      this.uploadImage();
    }else {
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
        this.invasiveDeckReportModalForm.patchValue({
          invasiveimages: this.imagePreviewUrls
        })
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(index: number) {
    this.imageControl.setValue(null); // Reset the form control value if needed
    this.imagePreviewUrls.splice(index, 1);
    this.invasiveDeckReportModalForm.patchValue({
      invasiveimages: this.imagePreviewUrls
    })
  }

  uploadImage() {
    let data:any = {
      'entityName': 'invasivefolders',
      'uploader': 'deck',
      'containerName': 'invasivefolders'
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
    this.invasiveDeckReportModalForm.patchValue({
      invasiveimages: imageUrls
    });
    this.dialogRef.close(this.invasiveDeckReportModalForm.value);
  }

  private isValidImageLink(imageUrl: string): boolean {
    return (imageUrl.startsWith("http") || imageUrl.startsWith("https"));
  }
}
