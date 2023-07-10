import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpsRequestService} from "../../service/https-request.service";

@Component({
  selector: 'app-new-subproject-modal',
  templateUrl: './new-subproject-modal.component.html',
  styleUrls: ['./new-subproject-modal.component.scss']
})
export class NewSubprojectModalComponent {
  newSubprojectForm!: FormGroup;
  description:string;
  private _event: any;
  subProjects:any[] = [];
  isSubProject: boolean = false;
  data!:any;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<NewSubprojectModalComponent>,
              private httpsRequestService: HttpsRequestService,
              @Inject(MAT_DIALOG_DATA) data : any) {
    this.description = data.description;
    this.subProjects = data.projectInfo;
    this.data = data;
    console.log(data);
  }

  ngOnInit() {
    this.newSubprojectForm = this.formBuilder.group({
      image: [''], // Add validators if needed
      name: [''], // Add validators if needed
      subProjectName: [null], // Add validators if needed
      description: [''],
      subProjectType: [],
      toggle: [false]
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
    console.log(this.newSubprojectForm.value);
    this.createNewLocation();
    this.dialogRef.close(this.newSubprojectForm);
  }

  createNewLocation(){
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/subproject/add';
    let data = {
      "name": this.newSubprojectForm.value.name,
      "description": this.newSubprojectForm.value.description,
      "parentid": this.data.projectInfo.parentId,
      "parenttype": this.data.projectInfo.parenttype,
      "isInvasive": true,
      "createdBy": 'deck',
      "url": this.newSubprojectForm.value.image,
      "assignedTo" : ['deck']
    }
    console.log(data);
    // this.httpsRequestService.postHttpData(url, data).subscribe(
    //   (response:any) => {
    //     console.log(response);
    //   },
    //   error => {
    //     console.log(error)
    //   }
    // );
  }

  toggleChanged() {
    console.log(this.newSubprojectForm.value);
    this.isSubProject = this.newSubprojectForm.value.toggle;
  }

  updateChange(subproject: any) {
    this.newSubprojectForm.value.name.push(subproject.name);
    this.newSubprojectForm.value.description.push(subproject.description);
  }
}
