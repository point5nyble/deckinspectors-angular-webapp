import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
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
  propowneragreed:boolean = false;
  invasiverepairsinspectedandcompleted:boolean = false;
  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<ConclusiveSectionModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private imageToUrlConverterService : ImageToUrlConverterService) {
    this.data = data;
    this.imagePreviewUrls = this.data.images;
  }

  ngOnInit() {
    let propowneragreed:boolean = JSON.parse(this.data.rowsMap?.get('propowneragreed').toLowerCase());
    let invasiverepairsinspectedandcompleted:boolean = JSON.parse(this.data.rowsMap?.get('invasiverepairsinspectedandcompleted').toLowerCase());
    this.propowneragreed = propowneragreed === undefined ? false : propowneragreed;
    this.invasiverepairsinspectedandcompleted = invasiverepairsinspectedandcompleted === undefined ? false : invasiverepairsinspectedandcompleted;
    // @ts-ignore
    this.conclusiveDeckReportModalForm?.get('invasiverepairsinspectedandcompleted').valueChanges.subscribe(value => {
      this.invasiverepairsinspectedandcompleted = JSON.parse(value.toLowerCase());
    });
    // @ts-ignore
    this.conclusiveDeckReportModalForm?.get('propowneragreed').valueChanges.subscribe(value => {
      this.propowneragreed = JSON.parse(value.toLowerCase());
    });

    this.conclusiveDeckReportModalForm = this.formBuilder.group({
      conclusiveconsiderations:[this.data.rowsMap?.get('conclusiveconsiderations')],
      EEE:[this.data.rowsMap?.get('eeeconclusive')],
      LBC:[this.data.rowsMap?.get('lbcconclusive')],
      AWE:[this.data.rowsMap?.get('aweconclusive')],
      invasiverepairsinspectedandcompleted:[this.data.rowsMap?.get('invasiverepairsinspectedandcompleted')],
      propowneragreed:[this.data.rowsMap?.get('propowneragreed')],
      conclusiveimages:[this.data.images]
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
      // push all imagePreviewUrls if they are string
      this.imagePreviewUrls.forEach(imageUrl => {
        if (typeof imageUrl === "string" && this.isValidImageLink(imageUrl)) {
          imageUrls.push(imageUrl);
        }
      })
    }
    this.conclusiveDeckReportModalForm.patchValue({
      conclusiveimages: imageUrls
    });
    this.dialogRef.close(this.conclusiveDeckReportModalForm.value);
  }

  private isValidImageLink(imageUrl: string): boolean {
    return (imageUrl.startsWith("http") || imageUrl.startsWith("https"));
  }

  showContent() {
    return this.propowneragreed.valueOf() && this.invasiverepairsinspectedandcompleted.valueOf();
  }
}

