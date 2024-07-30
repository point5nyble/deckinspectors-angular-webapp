import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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
      name: [this.data.process === 'edit' ? this.data.projectInfo?.name: ""], // Add validators if needed
      address: [this.data.process === 'edit' ? this.data.projectInfo?.address: ""],
      option: [this.data.process === 'edit' ? this.data.projectInfo?.projecttype: "multilevel"], // Add validators if needed
      description: [this.data.process === 'edit' ? this.data.projectInfo?.description: ""],
      editDate: [this.data.process === 'edit' ? this.data.projectInfo?.editedat: this.getFormattedCurrentDate()],
      formId: [{value: (this.data.process === 'edit' && this.data.projectInfo && this.data.projectInfo.formId && this.data.projectInfo.formId != '') ? this.data.projectInfo?.formId : null, disabled: (this.data.process === 'edit')}],
    });
    this.fetchLocationForms();
  }

  private getFormattedCurrentDate(): string {
    const currentDate = new Date();
    // Format the date as needed (e.g., 'yyyy-MM-dd')
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
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
      let data = {
        "name": this.yourForm.value.name,
        "description": this.yourForm.value.description,
        "createdBy": localStorage.getItem('username'),
        "address": this.yourForm.value.address,
        "url": image_url=== undefined? '': image_url,
        "projecttype": this.yourForm.value.option,
        "assignedTo": [localStorage.getItem('username')],
        "editedat": this.yourForm.value.editDate,
        "formId": (this.yourForm.value.formId && this.yourForm.value.formId !== '') ? this.yourForm.value.formId : null
      }
      if (this.data.process === 'edit') {
        let projectid = this.data.projectInfo._id === undefined ? (<any>this.data.projectInfo).id : this.data.projectInfo._id;
        let url = environment.apiURL + '/project/' + projectid;
        data.formId = (this.data.projectInfo && this.data.projectInfo.formId && this.data.projectInfo.formId != '') ? this.data.projectInfo?.formId : null;
        this.updateProject(url, data);
      } else {
        this.createNewProject(url, data);
      }
    }

    private createNewProject(url:string, data:any) {
      this.httpsRequestService.postHttpData(url, data).subscribe(
        (response:any) => {
          this.isSaving = false;
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, null);

          this.dialogRef.close(this.yourForm.value);
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
          this.dialogRef.close(this.yourForm.value);
        },
        error => {
          console.log(error)
          this.isSaving = false;
        }
      );
    }
}
