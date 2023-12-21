import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageToUrlConverterService} from "../../service/image-to-url-converter.service";
import {forkJoin, Observable} from "rxjs";
import { map } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-visual-deck-report-modal',
  templateUrl: './visual-deck-report-modal.component.html',
  styleUrls: ['./visual-deck-report-modal.component.scss']
})
export class VisualDeckReportModalComponent implements OnInit {
  data: any;
  visualDeckReportModalForm!: FormGroup;
  exteriorElementsOptions = [
    'Decks', 'Porches/Entry', 'Stairs', 'Stairs Landing', 'Walkways', 'Railings', 'Integrations', 'Door Threshold','Stucco Interface'
  ];
  waterproofingElements = [
    'Flashings', 'Waterproofing', 'Coatings','Sealants'
  ];
  selectedImage: File[] = [];
  imagePreviewUrls: (string | ArrayBuffer | null)[] = [];
  imageControl: FormControl = new FormControl();
  showErrors: boolean = false;
  isSaving: boolean = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '8rem',
    minHeight: '3rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Nunito',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        
        'strikeThrough',
        'subscript',
        'superscript',
        
        
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      [
        'fontSize',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<VisualDeckReportModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any,
              private imageToUrlConverterService : ImageToUrlConverterService) {
    this.data = data;
    this.data.images = this.data.images === undefined ? [] : this.data.images;
    this.imagePreviewUrls = JSON.parse(JSON.stringify(this.data.images));
  }

  ngOnInit() {
    const unitUnavailableCheck = [null, undefined, true];
    this.visualDeckReportModalForm = this.formBuilder.group({
      visualReportName: [this.data.rowsMap?.get('name'), Validators.required], // Add validators if needed
      unitUnavailable: [this.data.rowsMap?.get('unitUnavailable')], // Add validators if needed
      //additionalConsiderationsOrConcernHtml:[this.data.rowsMap?.get('additionalconsiderationshtml')===null||this.data.rowsMap?.get('additionalconsiderationshtml')===undefined?'':this.data.rowsMap?.get('additionalconsiderationshtml')],
      exteriorElements: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? []: this.data.rowsMap?.get('exteriorelements'), (this.data.rowsMap?.get('unitUnavailable'))? "": Validators.required], // Add validators if needed
      waterproofingElements: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? []: this.data.rowsMap?.get('waterproofingelements'), (this.data.rowsMap?.get('unitUnavailable'))? "": Validators.required],
      visualReview:[unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? "": this.data.rowsMap?.get('visualreview'), (this.data.rowsMap?.get('unitUnavailable'))? "": Validators.required],
      signsOfLeaks:[unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? false: this.data.rowsMap?.get('visualsignsofleak'), (this.data.rowsMap?.get('unitUnavailable'))? false: Validators.required],
      invasiveReviewRequired:[unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? false: this.data.rowsMap?.get('furtherinvasivereviewrequired'), (this.data.rowsMap?.get('unitUnavailable'))? null: Validators.required],
      conditionAssessment: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? "": this.data.rowsMap?.get('conditionalassessment'), (this.data.rowsMap?.get('unitUnavailable'))? "": Validators.required],
      additionalConsiderationsOrConcern:[this.data.rowsMap?.get('additionalconsiderationshtml') !== undefined? this.data.rowsMap?.get('additionalconsiderationshtml') : this.data.rowsMap?.get('additionalconsiderations')],
      EEE:[unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? "": this.data.rowsMap?.get('eee'), (this.data.rowsMap?.get('unitUnavailable'))? "": Validators.required],
      LBC:[unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? "": this.data.rowsMap?.get('lbc'), (this.data.rowsMap?.get('unitUnavailable'))? "": Validators.required],
      AWE:[unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable'))? "": this.data.rowsMap?.get('awe'), (this.data.rowsMap?.get('unitUnavailable'))? "": Validators.required],
      images:[this.data.images, (this.data.rowsMap?.get('unitUnavailable'))? null: Validators.required]      
    });
  }

  close() {
    this.imagePreviewUrls = this.data.images;
    this.visualDeckReportModalForm.patchValue({
      images: this.imagePreviewUrls
    })
    this.dialogRef.close();
  }

  save() {
    if(this.visualDeckReportModalForm.valid){
      this.isSaving = true;
      this.uploadImage();
    }
    else{
      this.showErrors = true;
    }
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
        this.visualDeckReportModalForm.patchValue({
          images: this.imagePreviewUrls
        })
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(index: number) {
    this.imageControl.setValue(null); // Reset the form control value if needed
    this.imagePreviewUrls.splice(index, 1);
    this.visualDeckReportModalForm.patchValue({
      images: this.imagePreviewUrls
    })
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
    var parsedText='';
    const htmlText = this.visualDeckReportModalForm.value["additionalConsiderationsOrConcern"];
    if (htmlText!==null) {
      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(htmlText, 'text/html');
      parsedText = parsedDocument.body.textContent || '';
    }
    
    
    this.visualDeckReportModalForm.patchValue({
      conditionAssessment: this.visualDeckReportModalForm.value['conditionAssessment']? this.visualDeckReportModalForm.value['conditionAssessment'].toLowerCase() : "",
      signsOfLeaks: (this.visualDeckReportModalForm.value['signsOfLeaks'] === "Yes").toString(),
      invasiveReviewRequired: (this.visualDeckReportModalForm.value['invasiveReviewRequired'] === "Yes").toString(),
      additionalConsiderationsOrConcern: parsedText
    })
    this.visualDeckReportModalForm.value["additionalConsiderationsOrConcernHtml"] = htmlText;
   console.log(this.visualDeckReportModalForm.value);
    this.dialogRef.close(this.visualDeckReportModalForm.value);
  }

  private isValidImageLink(imageUrl: string): boolean {
    return (imageUrl.startsWith("http") || imageUrl.startsWith("https"));
  }

  handleUnitUnavailable = (unitUnavailable: any) =>{
    const imagesControl = this.visualDeckReportModalForm.get('images');
    const exteriorElementsControl = this.visualDeckReportModalForm.get('exteriorElements');
    const waterproofingElementsControl = this.visualDeckReportModalForm.get('waterproofingElements');
    const visualReviewControl = this.visualDeckReportModalForm.get('visualReview');
    const signsOfLeaksControl = this.visualDeckReportModalForm.get('signsOfLeaks');
    const invasiveReviewRequiredControl = this.visualDeckReportModalForm.get('invasiveReviewRequired');
    const conditionAssessmentControl = this.visualDeckReportModalForm.get('conditionAssessment');
    const EEEControl = this.visualDeckReportModalForm.get('EEE');
    const LBCControl = this.visualDeckReportModalForm.get('LBC');
    const AWEControl = this.visualDeckReportModalForm.get('AWE');
    
    if(unitUnavailable.checked){
      imagesControl?.clearValidators();
      exteriorElementsControl?.clearValidators();
      waterproofingElementsControl?.clearValidators();
      visualReviewControl?.clearValidators();
      signsOfLeaksControl?.clearValidators();
      invasiveReviewRequiredControl?.clearValidators();
      conditionAssessmentControl?.clearValidators();
      EEEControl?.clearValidators();
      LBCControl?.clearValidators();
      AWEControl?.clearValidators();
      
    } else{
      imagesControl?.setValidators([Validators.required]);
      exteriorElementsControl?.setValidators([Validators.required]);
      waterproofingElementsControl?.setValidators([Validators.required]);
      visualReviewControl?.setValidators([Validators.required]);
      signsOfLeaksControl?.setValidators([Validators.required]);
      invasiveReviewRequiredControl?.setValidators([Validators.required]);
      conditionAssessmentControl?.setValidators([Validators.required]);
      EEEControl?.setValidators([Validators.required]);
      LBCControl?.setValidators([Validators.required]);
      AWEControl?.setValidators([Validators.required]);

    }
    imagesControl?.updateValueAndValidity();
    exteriorElementsControl?.updateValueAndValidity();
    waterproofingElementsControl?.updateValueAndValidity();
    visualReviewControl?.updateValueAndValidity();
    signsOfLeaksControl?.updateValueAndValidity();
    invasiveReviewRequiredControl?.updateValueAndValidity();
    conditionAssessmentControl?.updateValueAndValidity();
    EEEControl?.updateValueAndValidity();
    LBCControl?.updateValueAndValidity();
    AWEControl?.updateValueAndValidity();
  }
}
