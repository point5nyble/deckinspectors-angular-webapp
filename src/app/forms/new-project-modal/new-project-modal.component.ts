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

  constructor(private formBuilder: FormBuilder,
              private imageToUrlConverterService : ImageToUrlConverterService,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewProjectModalComponent>,
              private httpsRequestService: HttpsRequestService,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.description = data.description;
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
    this._event = event;
    // Handle file input change, e.g., read and process the selected file
  }
  close() {
    this.dialogRef.close();
  }

  save() {
    this.uploadImage();
    this.createNewProject();
    this.dialogRef.close(this.yourForm.value);
  }

    uploadImage() {
     this.yourForm.value.image = 'https://deckinspectors.blob.core.windows.net/location3/image_picker_CFD17C05-6758-4E0D-8CDA-527CA67746CD-3753-00000024EE34AE1A.jpg';
      // const imageFile = new File([this.yourForm.value.image], 'image.jpg', { type: 'image/jpeg' });
      // this.imageToUrlConverterService.convertImageToUrl(imageFile, '20210608_100407.jpg');
    }

    createNewProject() {
      let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/add';
      let data = {
        "name": this.yourForm.value.name,
        "description": this.yourForm.value.description,
        "createdBy": "deck",
        "address": this.yourForm.value.address,
        "url": this.yourForm.value.image,
        "projecttype": this.yourForm.value.option,
        "assignedTo": [
          "deck"
        ]
      }
      console.log(data);

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
