import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ImageToUrlConverterService } from "../../service/image-to-url-converter.service";
import { forkJoin, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from "../../../environments/environment";
import { HttpsRequestService } from "../../service/https-request.service";
import { TenantService } from "../../service/tenant.service";

@Component({
  selector: 'app-visual-deck-report-modal',
  templateUrl: './visual-deck-report-modal.component.html',
  styleUrls: ['./visual-deck-report-modal.component.scss']
})
export class VisualDeckReportModalComponent implements OnInit {
  data: any;
  visualDeckReportModalForm!: FormGroup;
  exteriorElementsOptions = [
    'Decks', 'Porches/Entry', 'Stairs', 'Stairs Landing', 'Walkways', 'Railings', 'Integrations', 'Door Threshold', 'Stucco Interface'
  ];
  waterproofingElements = [
    'Flashings', 'Waterproofing', 'Coatings', 'Sealants'
  ];
  selectedImage: File[] = [];
  imagePreviewUrls: (string | ArrayBuffer | null)[] = [];
  imageControl: FormControl = new FormControl();
  showErrors: boolean = false;
  isSaving: boolean = false;
  isLoading: boolean = false;
  isLocationFormFields: boolean = false;
  locationFormQuestions: any = [];
  projectInfo: any;

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
              @Inject(MAT_DIALOG_DATA) data: any,
              private imageToUrlConverterService: ImageToUrlConverterService,
              private httpsRequestService: HttpsRequestService,
              private tenantService: TenantService) {
    this.data = data;
    this.data.images = this.data.images === undefined ? [] : this.data.images;
    this.imagePreviewUrls = JSON.parse(JSON.stringify(this.data.images));
  }

  ngOnInit() {
    this.projectInfo = this.tenantService.getProjectInfo();
    if (this.projectInfo && this.projectInfo.formId && this.projectInfo.formId !== '') {
      this.getFormById(this.projectInfo.formId);
    }
    const unitUnavailableCheck = [null, undefined, true];
    this.visualDeckReportModalForm = this.formBuilder.group({
      visualReportName: [this.data.rowsMap?.get('name'), Validators.required], // Add validators if needed
      unitUnavailable: [this.data.rowsMap?.get('unitUnavailable')], // Add validators if needed
      exteriorElements: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? [] : this.data.rowsMap?.get('exteriorelements'), (this.data.rowsMap?.get('unitUnavailable')) ? "" : Validators.required], // Add validators if needed
      waterproofingElements: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? [] : this.data.rowsMap?.get('waterproofingelements'), (this.data.rowsMap?.get('unitUnavailable')) ? "" : Validators.required],
      visualReview: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? "" : this.data.rowsMap?.get('visualreview'), (this.data.rowsMap?.get('unitUnavailable')) ? "" : Validators.required],
      signsOfLeaks: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? false : this.data.rowsMap?.get('visualsignsofleak'), (this.data.rowsMap?.get('unitUnavailable')) ? false : Validators.required],
      invasiveReviewRequired: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? false : this.data.rowsMap?.get('furtherinvasivereviewrequired'), (this.data.rowsMap?.get('unitUnavailable')) ? null : Validators.required],
      conditionAssessment: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? "" : this.data.rowsMap?.get('conditionalassessment'), (this.data.rowsMap?.get('unitUnavailable')) ? "" : Validators.required],
      additionalConsiderationsOrConcern: [this.data.rowsMap?.get('additionalconsiderationshtml') !== undefined ? this.data.rowsMap?.get('additionalconsiderationshtml') : this.data.rowsMap?.get('additionalconsiderations')],
      EEE: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? "" : this.data.rowsMap?.get('eee'), (this.data.rowsMap?.get('unitUnavailable')) ? "" : Validators.required],
      LBC: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? "" : this.data.rowsMap?.get('lbc'), (this.data.rowsMap?.get('unitUnavailable')) ? "" : Validators.required],
      AWE: [unitUnavailableCheck.includes(this.data.rowsMap?.get('unitUnavailable')) ? "" : this.data.rowsMap?.get('awe'), (this.data.rowsMap?.get('unitUnavailable')) ? "" : Validators.required],
      images: [this.data.images, (this.data.rowsMap?.get('unitUnavailable')) ? null : Validators.required]
    });
    // console.log('data = ', this.data);
    // console.log('this.projectInfo = ', this.projectInfo);
  }

  getFormById(formId:string){
    this.isLoading = true;
    let url = environment.apiURL + `/locationforms/${formId}`;
    this.httpsRequestService.getHttpData(url).subscribe(
      (response: any) => {
        if (response.success) {
          if (response.location && response.location.questions) {
            this.locationFormQuestions = response.location.questions;
            this.locationFormQuestions = this.locationFormQuestions.map((question: any) => {
              question.type = question.type.toLowerCase();
              return question;
            });
          }
          this.isLocationFormFields = true;
          this.removeDefaultValidation();
        }
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  close() {
    this.imagePreviewUrls = this.data.images;
    this.visualDeckReportModalForm.patchValue({
      images: this.imagePreviewUrls
    });
    this.dialogRef.close();
  }

  save() {
    // console.log(this.visualDeckReportModalForm.value);
    // console.log(this.locationFormQuestions);
    if (this.visualDeckReportModalForm.valid && this.checkValidDynamicFields()) {
      this.isSaving = true;
      this.uploadImage();
    }
    else {
      this.showErrors = true;
    }
  }

  checkValidDynamicFields(): boolean {
    let valid: boolean = true;
    let unitUnavailable = this.visualDeckReportModalForm.get('unitUnavailable')?.value;
    unitUnavailable = !!(unitUnavailable);
    this.locationFormQuestions.forEach((question: any) => {
      if (!unitUnavailable && question.isMandatory &&
          ((question.type === 'checkbox' && (!question.answers || question.answers.length <= 0)) ||
          (question.type !== 'checkbox' && (!question.answer || question.answer === '')))) {
        valid = false;
      }
    })

    return valid;
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
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.imageControl.setValue(null); // Reset the form control value if needed
    this.imagePreviewUrls.splice(index, 1);
    this.visualDeckReportModalForm.patchValue({
      images: this.imagePreviewUrls
    });
  }

  uploadImage() {
    let data: any = {
      'entityName': this.visualDeckReportModalForm.value.visualReportName,
      'uploader': 'deck',
      'containerName': this.visualDeckReportModalForm.value.visualReportName.replace(/\s+/g, '').toLowerCase(),
    };
    const imageRequests: Observable<any>[] = [];
    this.selectedImage.forEach(file => {
      data['picture'] = file;
      imageRequests.push(this.imageToUrlConverterService.convertImageToUrl(data));
    });

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
      });
    }
    this.visualDeckReportModalForm.patchValue({
      images: imageUrls
    });
    var parsedText = '';
    const htmlText = this.visualDeckReportModalForm.value["additionalConsiderationsOrConcern"];
    if (htmlText !== null) {
      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(htmlText, 'text/html');
      parsedText = parsedDocument.body.textContent || '';
    }

    this.visualDeckReportModalForm.patchValue({
      conditionAssessment: this.visualDeckReportModalForm.value['conditionAssessment'] ? this.visualDeckReportModalForm.value['conditionAssessment'].toLowerCase() : "",
      signsOfLeaks: (this.visualDeckReportModalForm.value['signsOfLeaks'] === "Yes").toString(),
      invasiveReviewRequired: (this.visualDeckReportModalForm.value['invasiveReviewRequired'] === "Yes").toString(),
      additionalConsiderationsOrConcern: parsedText
    });
    this.visualDeckReportModalForm.value["additionalConsiderationsOrConcernHtml"] = htmlText;
    const valuesObj: any = this.visualDeckReportModalForm.value;
    valuesObj.questions = this.locationFormQuestions;
    valuesObj.isLocationFormFields = this.isLocationFormFields;
    valuesObj.companyIdentifier = this.projectInfo.companyIdentifier;
    this.dialogRef.close(valuesObj);
  }

  private isValidImageLink(imageUrl: string): boolean {
    return (imageUrl.startsWith("http") || imageUrl.startsWith("https") || imageUrl.startsWith("/var") || imageUrl.startsWith("/section"));
  }

  removeDefaultValidation() {
    const exteriorElementsControl = this.visualDeckReportModalForm.get('exteriorElements');
    const waterproofingElementsControl = this.visualDeckReportModalForm.get('waterproofingElements');
    const visualReviewControl = this.visualDeckReportModalForm.get('visualReview');
    const invasiveReviewRequiredControl = this.visualDeckReportModalForm.get('invasiveReviewRequired');
    const conditionAssessmentControl = this.visualDeckReportModalForm.get('conditionAssessment');
    const EEEControl = this.visualDeckReportModalForm.get('EEE');
    const LBCControl = this.visualDeckReportModalForm.get('LBC');
    const AWEControl = this.visualDeckReportModalForm.get('AWE');

    exteriorElementsControl?.clearValidators();
    waterproofingElementsControl?.clearValidators();
    visualReviewControl?.clearValidators();
    invasiveReviewRequiredControl?.clearValidators();
    conditionAssessmentControl?.clearValidators();
    EEEControl?.clearValidators();
    LBCControl?.clearValidators();
    AWEControl?.clearValidators();

    exteriorElementsControl?.updateValueAndValidity();
    waterproofingElementsControl?.updateValueAndValidity();
    visualReviewControl?.updateValueAndValidity();
    invasiveReviewRequiredControl?.updateValueAndValidity();
    conditionAssessmentControl?.updateValueAndValidity();
    EEEControl?.updateValueAndValidity();
    LBCControl?.updateValueAndValidity();
    AWEControl?.updateValueAndValidity();
  }

  handleUnitUnavailable = (unitUnavailable: any) => {
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

    if (unitUnavailable.checked) {
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
    } else {
      imagesControl?.setValidators([Validators.required]);
      invasiveReviewRequiredControl?.setValidators([Validators.required]);
      if (!this.isLocationFormFields) {
        exteriorElementsControl?.setValidators([Validators.required]);
        waterproofingElementsControl?.setValidators([Validators.required]);
        visualReviewControl?.setValidators([Validators.required]);
        signsOfLeaksControl?.setValidators([Validators.required]);
        conditionAssessmentControl?.setValidators([Validators.required]);
        EEEControl?.setValidators([Validators.required]);
        LBCControl?.setValidators([Validators.required]);
        AWEControl?.setValidators([Validators.required]);
      }
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

  selectEEE(value: string) {
    const eeeControl = this.visualDeckReportModalForm.get('EEE');
    if (eeeControl) {
      eeeControl.setValue(value);
    }
  }

  selectLBC(value: string) {
    const eeeControl = this.visualDeckReportModalForm.get('LBC');
    if (eeeControl) {
      eeeControl.setValue(value);
    }
  }

  selectAWE(value: string) {
    const aweControl = this.visualDeckReportModalForm.get('AWE');
    if (aweControl) {
      aweControl.setValue(value);
    }
  }

  selectVisualReview(value: string) {
    const visualReview = this.visualDeckReportModalForm.get('visualReview');
    if (visualReview) {
      visualReview.setValue(value);
    }
  }

  selectConditionAssessment(value: string) {
    const conditionAssessment = this.visualDeckReportModalForm.get('conditionAssessment');
    if (conditionAssessment) {
      conditionAssessment.setValue(value);
    }
  }

  toggleSignsOfLeaks() {
    const signsOfLeaksControl = this.visualDeckReportModalForm.get('signsOfLeaks');
    if (signsOfLeaksControl) {
      const currentValue = signsOfLeaksControl.value;
      const newValue = currentValue === 'Yes' ? 'No' : 'Yes';
      signsOfLeaksControl.setValue(newValue);
    }
  }

  toggleInvasiveReview() {
    const invasiveReviewControl = this.visualDeckReportModalForm.get('invasiveReviewRequired');
    if (invasiveReviewControl) {
      const currentValue = invasiveReviewControl.value;
      const newValue = currentValue === 'Yes' ? 'No' : 'Yes';
      invasiveReviewControl.setValue(newValue);
    }
  }


  isOptionSelected(option: string, formControlName: string): boolean {
    const selectedOptions = this.visualDeckReportModalForm.get(formControlName)?.value;
    return selectedOptions && selectedOptions.includes(option);
  }

  toggleOptionSelection(option: string, formControlName: string): void {
    const control = this.visualDeckReportModalForm.get(formControlName);
    const selectedOptions = control?.value || [];

    if (selectedOptions.includes(option)) {
      const index = selectedOptions.indexOf(option);
      selectedOptions.splice(index, 1);
    } else {
      selectedOptions.push(option);
    }

    control?.setValue(selectedOptions);
  }

  isOptionSelectedForDynamicField(option: string, index: number): boolean {
    const question = this.locationFormQuestions[index];
    const selectedOptions = question.answers;
    return selectedOptions && selectedOptions.includes(option);
  }

  toggleOptionSelectionForDynamicField(option: string, index: number): void {
    const question = this.locationFormQuestions[index];
    const selectedOptions = question.answers || [];

    if (selectedOptions.includes(option)) {
      const index = selectedOptions.indexOf(option);
      selectedOptions.splice(index, 1);
    } else {
      selectedOptions.push(option);
    }

    this.locationFormQuestions[index].answers = selectedOptions;
  }

  toggleForDynamicField(index: number) {
    const question = this.locationFormQuestions[index];
    const currentValue = question.answer;
    this.locationFormQuestions[index].answer = currentValue === 'Yes' ? 'No' : 'Yes';
  }



}
