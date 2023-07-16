import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpsRequestService} from "../../service/https-request.service";
import {ImageToUrlConverterService} from "../../service/image-to-url-converter.service";

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

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewLocationModalComponent>,
              private httpsRequestService: HttpsRequestService,
              @Inject(MAT_DIALOG_DATA) data : any,
              private imageToUrlConverterService : ImageToUrlConverterService ) {
    this.description = data.description;
    this.subProjects = data.projectInfo;
    this.isSubProject = data.isSubProject;
    this.data = data;
  }

  ngOnInit() {
    this.newLocationForm = this.formBuilder.group({
      image: [''], // Add validators if needed
      name: [''], // Add validators if needed
      subProjectName: [null], // Add validators if needed
      description: [''],
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
    this.uploadImage();
    this.dialogRef.close(this.newLocationForm);
  }

  createNewLocation(image_url?:string){
    let data = {
      "name": this.newLocationForm.value.name,
      "description": this.newLocationForm.value.description,
      "parentid":  this.data.projectInfo.parentId,
      "parenttype": this.data.projectInfo.parenttype,
      "isInvasive": true,
      "createdBy": "deck",
      "url": image_url,
      "type": this.data.type,
      "assignedTo":['']
    }
    let url = '';
    if (this.data.isSubProject) {
      data["assignedTo"] = ['deck'];
      url = "https://deckinspectors-dev.azurewebsites.net/api/subproject/add"
    } else {
      url = 'https://deckinspectors-dev.azurewebsites.net/api/location/add';
    }
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        console.log(response);
      },
      error => {
        console.log(error)
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
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/image/upload';
    let data = {
      'entityName': this.newLocationForm.value.name,
      'uploader': 'deck',
      'containerName': this.newLocationForm.value.name.replace(' ', '').toLowerCase(),
      'picture': this.selectedImage,
    }
    this.imageToUrlConverterService.convertImageToUrl(data).subscribe(
      (response:any) => {
        this.createNewLocation(response.url);
        console.log(response);
      },
      error => {
        console.log(error)
      }
    )
  }
}
