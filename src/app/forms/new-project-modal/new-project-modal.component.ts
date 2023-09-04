import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageToUrlConverterService} from "../../service/image-to-url-converter.service";
import {HttpsRequestService} from "../../service/https-request.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";

@Component({
  selector: 'app-new-project-modal',
  templateUrl: './new-project-modal.component.html',
  styleUrls: ['./new-project-modal.component.scss']
})
export class NewProjectModalComponent implements OnInit {
  yourForm!: FormGroup;
  description:string;
  private _event: any;
  data!:any;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  selectedFileName: string | null = null;


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
      description: [this.data.process === 'edit' ? this.data.projectInfo?.description: ""]
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
      let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/add';
      let data = {
        "name": this.yourForm.value.name,
        "description": this.yourForm.value.description,
        "createdBy": localStorage.getItem('username'),
        "address": this.yourForm.value.address,
        "url": image_url=== undefined? '': image_url,
        "projecttype": this.yourForm.value.option,
        "assignedTo": [
          localStorage.getItem('username') !== undefined? localStorage.getItem('username') : "deck"
        ]
      }
      if (this.data.process === 'edit') {
        let projectid = this.data.projectInfo._id === undefined ? (<any>this.data.projectInfo).id : this.data.projectInfo._id;
        let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/' + projectid;
        this.updateProject(url, data);
      } else {
        this.createNewProject(url, data);
      }
    }

    private createNewProject(url:string, data:any) {
      this.httpsRequestService.postHttpData(url, data).subscribe(
        (response:any) => {
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, null);

          this.dialogRef.close(this.yourForm.value);
        },
        error => {
          console.log(error)
        }
      );
    }

    private updateProject(url:string, data:any) {
      this.httpsRequestService.putHttpData(url, data).subscribe(
        (response:any) => {
          console.log(response);
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, null);
          this.dialogRef.close(this.yourForm.value);
        },
        error => {
          console.log(error)
        }
      );
    }
}
