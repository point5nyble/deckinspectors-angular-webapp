import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup,Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageToUrlConverterService} from "../../service/image-to-url-converter.service";
import {HttpsRequestService} from "../../service/https-request.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import { environment } from '../../../environments/environment';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-new-project-modal',
  templateUrl: './new-project-modal.component.html',
  styleUrls: ['./new-project-modal.component.scss'],
  // standalone: true,
  // imports: [MatFormFieldModule, MatInputModule],
})
export class NewProjectModalComponent implements OnInit {
  yourForm!: FormGroup;
  description:string;
  private _event: any;
  data!:any;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  selectedFileName: string | null = null;
  isSaving: boolean = false;
  allForms: any = [];


  constructor(private formBuilder: FormBuilder,
              private imageToUrlConverterService : ImageToUrlConverterService,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewProjectModalComponent>,
              private httpsRequestService: HttpsRequestService,
              @Inject(MAT_DIALOG_DATA) data : any,
              private orchestratorCommunicationService: OrchestratorCommunicationService) {
    this.description = data.description;
    this.data = data;
    this.imagePreviewUrl = this.data.projectInfo?.url;
  }

  ngOnInit() {
    this.yourForm = this.formBuilder.group({
      image: [this.data.process === 'edit' ? this.data.projectInfo?.url: ""], // Add validators if needed
      name: [this.data.process === 'edit' ? this.data.projectInfo?.name: "",Validators.required], // Add validators if needed
      address: [this.data.process === 'edit' ? this.data.projectInfo?.address: ""],
      option: [this.data.process === 'edit' ? this.data.projectInfo?.projecttype: "multilevel"], // Add validators if needed
      description: [this.data.process === 'edit' ? this.data.projectInfo?.description: ""],
      editDate: [this.data.process === 'edit' ? this.formatDateForDateTimeLocal(this.data.projectInfo?.editedat) : this.getFormattedCurrentDate()],
      formId: [{value: (this.data.process === 'edit' && this.data.projectInfo && this.data.projectInfo.formId && this.data.projectInfo.formId != '') ? this.data.projectInfo?.formId : null, disabled: (this.data.process === 'edit')},Validators.required],
    });
    this.fetchLocationForms();
  }

  private getFormattedCurrentDate(): string {
    return this.formatDateForDateTimeLocal(new Date());
  }

  private formatDateForDateTimeLocal(value: string | Date | null | undefined): string {
    const fallbackDate = new Date();
    const parsedDate = value ? new Date(this.normalizeDateInput(value)) : fallbackDate;
    const date = Number.isNaN(parsedDate.getTime()) ? fallbackDate : parsedDate;

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private normalizeDateInput(value: string | Date): string | Date {
    if (value instanceof Date) {
      return value;
    }

    // Some API responses omit timezone (e.g. 2026-03-30T02:39:00.000).
    // Treat them as UTC to avoid showing shifted times in local timezone.
    const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value);
    return hasTimezone ? value : `${value}Z`;
  }

  private toApiEditDate(value: string | Date | null | undefined): string {
    const fallbackDate = new Date();
    const parsedDate = value ? new Date(value) : fallbackDate;
    const date = Number.isNaN(parsedDate.getTime()) ? fallbackDate : parsedDate;

    // Always send timezone-aware timestamps to avoid cross-timezone shifts.
    return date.toISOString();
  }

  private fetchLocationForms() {
    const userObj = JSON.parse(localStorage.getItem('user')!);
    let url = environment.apiURL + '/locationforms/getalllocationforms';
    let data = {
      companyIdentifier: userObj.companyIdentifier,
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response: any) => {
        this.allForms = response.forms;
        
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
    // Read and set the image preview URL
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
    this._event = event;
  }

  removeImage() {
    this.selectedImage = null;
    this.selectedFileName = null;
    this.imagePreviewUrl = null;
    this.yourForm.patchValue({
      image: ''
    });
  }

  close() {
    this.dialogRef.close();
  }

  openDatePicker(input: HTMLInputElement) {
    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  }

    save() {
      this.isSaving = true;
      this.uploadImage();
  }

    uploadImage() {
      let data = {
        'entityName': this.yourForm.value.name,
        'uploader': 'deck',
        'containerName': this.yourForm.value.name?.replace(/\s+/g, '').toLowerCase(),
        'picture': this.selectedImage,
      }
      if (data.picture != null ) {
        this.imageToUrlConverterService.convertImageToUrl(data).subscribe(
          (response:any) => {
            this.createProject(response.url);
          },
          error => {
            console.log(error)
          }
        )
      } else {
        this.createProject(this.data.projectInfo?.url);
      }

    }
  createProject(image_url:string) {
      let url = environment.apiURL + '/project/add';
      let data: any = {
        "name": this.yourForm.value.name,
        "description": this.yourForm.value.description,
        "createdby": localStorage.getItem('username'),
        "address": this.yourForm.value.address,
        "url": image_url=== undefined? '': image_url,
        "projecttype": this.yourForm.value.option,
        "editedat": this.toApiEditDate(this.yourForm.value.editDate),
        "formId": (this.yourForm.value.formId && this.yourForm.value.formId !== '') ? this.yourForm.value.formId : null
      };

      // Only set assignedto for new projects. Do not override assignedto during edit.
      if (this.data.process !== 'edit') {
        data.assignedto = [localStorage.getItem('username')];
      } else if (this.data.projectInfo && this.data.projectInfo.assignedto) {
        // preserve existing assignedto on edit by including it in the update payload
        data.assignedto = this.data.projectInfo.assignedto;
      }
      if (this.data.process === 'edit') {
        let projectid = this.data.projectInfo._id === undefined ? (<any>this.data.projectInfo).id : this.data.projectInfo._id;
        let url = environment.apiURL + '/project/' + projectid;
        data.formId = (this.data.projectInfo && this.data.projectInfo.formId && this.data.projectInfo.formId != '') ? this.data.projectInfo?.formId : null;
        this.updateProject(url, data);
      } else {
        if (data.formId != null) {
          
          if(data.formId=='default')
            data.formId=null;
          this.createNewProject(url, data);
        }else{
          this.isSaving = false;
        }
      }
    }

    private createNewProject(url:string, data:any) {
      this.httpsRequestService.postHttpData(url, data).subscribe(
        (response:any) => {
          this.isSaving = false;
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, null);

          this.dialogRef.close({
            ...this.yourForm.getRawValue(),
            editedat: data.editedat,
            saved: true,
            process: this.data.process
          });
        },
        error => {
          console.log(error)
          this.isSaving = false;
        }
      );
    }

    private updateProject(url:string, data:any) {
      this.httpsRequestService.putHttpData(url, data).subscribe(
        (response:any) => {
          this.isSaving = false;
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, null);
          this.dialogRef.close({
            ...this.yourForm.getRawValue(),
            editedat: data.editedat,
            saved: true,
            process: this.data.process
          });
        },
        error => {
          console.log(error)
          this.isSaving = false;
        }
      );
    }
}
