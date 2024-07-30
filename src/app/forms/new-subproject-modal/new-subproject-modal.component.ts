import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpsRequestService} from "../../service/https-request.service";
import { environment } from '../../../environments/environment';

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
  }

  ngOnInit() {
    this.newSubprojectForm = this.formBuilder.group({
      image: [this.data.process === 'edit' ? this.data.projectInfo?.url: ""], // Add validators if needed
      name: [this.data.process === 'edit' ? this.data.projectInfo?.name: ""], // Add validators if needed
      subProjectName: [null], // Add validators if needed
      description: [this.data.process === 'edit' ? this.data.projectInfo?.description: ""],
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
    this.createNewLocation();
    this.dialogRef.close(this.newSubprojectForm);
  }

  createNewLocation(){
    let url = environment.apiURL + '/subproject/add';
    let username = localStorage.getItem('username');
    let data: any = {
      "name": this.newSubprojectForm.value.name,
      "description": this.newSubprojectForm.value.description,
      "parentid": this.data.projectInfo.parentId,
      "parenttype": this.data.projectInfo.parenttype,
      "isInvasive": true,
      "url": this.newSubprojectForm.value.image,
    }
    if (this.data.process === "edit"){
      data["lasteditedby"] = username;
    }
    else{
      data["createdBy"] = username;
      data["assignedTo"] = username;
    }
  }

  toggleChanged() {
    this.isSubProject = this.newSubprojectForm.value.toggle;
  }

  updateChange(subproject: any) {
    this.newSubprojectForm.value.name.push(subproject.name);
    this.newSubprojectForm.value.description.push(subproject.description);
  }
}
