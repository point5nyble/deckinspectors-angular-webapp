import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpsRequestService} from "../../service/https-request.service";
import {ImageToUrlConverterService} from "../../service/image-to-url-converter.service";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-new-location-modal',
  templateUrl: './new-location-modal.component.html',
  styleUrls: ['./new-location-modal.component.scss']
})
export class NewLocationModalComponent {
  newLocationForm!: FormGroup;
  description:string;
  private _event: any;
  subProjects:any[] = [];
  isSubProject: boolean = false;
  data!:any;
  imagePreviewUrl: string | null = null;
  selectedImage: File | null = null;
  selectedFileName: string | null = null;
  isSaving: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewLocationModalComponent>,
              private httpsRequestService: HttpsRequestService,
              @Inject(MAT_DIALOG_DATA) data : any,
              private imageToUrlConverterService : ImageToUrlConverterService,
              private orchestratorCommunicationService: OrchestratorCommunicationService) {
    this.description = data.description;
    this.subProjects = data.projectInfo;
    this.isSubProject = data.isSubProject;
    this.data = data;
    this.imagePreviewUrl = this.data.projectInfo?.url;
  }

  ngOnInit() {
    this.newLocationForm = this.formBuilder.group({
      image: [this.data.process === 'edit' ? this.data.projectInfo?.url : ""], // Add validators if neededthis.data.projectInfo?.url], // Add validators if needed
      name: [this.data.process === 'edit' ?this.data.projectInfo?.name : ""], // Add validators if needed
      subProjectName: [null], // Add validators if needed
      description: [this.data.process === 'edit' ?this.data.projectInfo?.description: ""],
      subProjectType: []
    });
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
  close() {
    this.dialogRef.close();
  }

  save() {
    this.isSaving = true;
    this.uploadImage();
  }

  createLocation(image_url?:string){
    let data: any = {
      "name": this.newLocationForm.value.name,
      "description": this.newLocationForm.value.description,
      "parentid":  this.data.projectInfo?.parentId,
      "parenttype": this.data.projectInfo?.parenttype,
      "createdBy": "deck",
      "url": image_url? image_url : "",
      "type": this.data.type,
      "isInvasive":false,
      "assignedTo":['']
    }
    console.log(data);
    let url: string;
    // TODO: Check this logic changing this for
    if (this.data.isSubProject || this.data.type === 'subproject') {
      data["assignedTo"] = ['deck'];
      url = environment.apiURL + "/subproject/add"
    } else {
      url = environment.apiURL + '/location/add';
    }

    if (this.data.process === 'edit') {
      let projectid = this.data.projectInfo._id === undefined ? (<any>this.data.projectInfo).id : this.data.projectInfo._id;
       url = url.replace('add', projectid);
      data["sequenceNumber"] = this.data.sequenceNumber;
      console.log(url);
      console.log(data);
      this.updateLocation(url, data);
    } else {
      data["sequenceNumber"] = this.data.sequenceNumber;
      this.createNewLocation(url,data);
    }
  }


  private createNewLocation(url: string, data: any) {
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        console.log(response);
        this.isSaving = false;
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, null);
        this.dialogRef.close(this.newLocationForm);

      },
      error => {
        console.log(error);
        this.isSaving = false;
      }
    );
  }

  private updateLocation(url: string, data: any) {
    this.httpsRequestService.putHttpData(url, data).subscribe(
      (response:any) => {
        console.log(response);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, null);
        this.dialogRef.close(this.newLocationForm);
        this.isSaving = false;

      },
      error => {
        console.log(error)
        this.isSaving = false;
      }
    );
  }

  removeImage() {
    this.selectedImage = null;
    this.selectedFileName = null;
    this.imagePreviewUrl = null;
    this.newLocationForm.patchValue({
      image: ''
    });
  }

  uploadImage() {
    let url = environment.apiURL + '/image/upload';
    let data = {
      'entityName': this.newLocationForm.value.name,
      'uploader': 'deck',
      'containerName': this.newLocationForm.value.name.replace(/\s+/g, '').toLowerCase(),
      'picture': this.selectedImage,
    }
    if (data.picture != null) {
      this.imageToUrlConverterService.convertImageToUrl(data).subscribe(
        (response:any) => {
          this.createLocation(response.url);
        },
        error => {
          console.log(error)
        }
      )
    } else {
      this.createLocation(this.data.projectInfo?.url);
    }

  }
}
