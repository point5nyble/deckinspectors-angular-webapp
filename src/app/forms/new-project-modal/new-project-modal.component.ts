import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImageToUrlConverterService} from "../../service/image-to-url-converter.service";
import {HttpsRequestService} from "../../service/https-request.service";

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
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.description = data.description;
    this.data = data;
  }

  ngOnInit() {
    this.yourForm = this.formBuilder.group({
      image: [''], // Add validators if needed
      name: [''], // Add validators if needed
      address: [''],
      option: [''], // Add validators if needed
      description: [this.description, []]
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
    this.dialogRef.close(this.yourForm.value);
  }

    uploadImage() {
      let data = {
        'entityName': this.yourForm.value.name,
        'uploader': 'deck',
        'containerName': this.yourForm.value.name.replace(' ', '').toLowerCase(),
        'picture': this.selectedImage,
      }
      this.imageToUrlConverterService.convertImageToUrl(data).subscribe(
          (response:any) => {
            this.createNewProject(response.url);
            console.log(response);
          },
          error => {
            console.log(error)
          }
      )
    }

    createNewProject(image_url:string) {
      let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/add';
      let data = {
        "name": this.yourForm.value.name,
        "description": this.yourForm.value.description,
        "createdBy": "deck",
        "address": this.yourForm.value.address,
        "url": image_url,
        "projecttype": this.yourForm.value.option,
        "assignedTo": [
          "deck"
        ]
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



}
