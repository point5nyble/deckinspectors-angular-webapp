import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Project } from 'src/app/common/models/project';
import { ProjectListElement } from 'src/app/common/models/project-list-element';
import { HttpsRequestService } from 'src/app/service/https-request.service';

@Component({
  selector: 'app-assign-project-modal',
  templateUrl: './assign-project-modal.component.html',
  styleUrls: ['./assign-project-modal.component.scss']
})
export class AssignProjectModalComponent {
  names: any[] = [];

  filteredNames: any[] = [];
  searchTerm: string = '';
  projectInfo!: Project;
  location!: ProjectListElement;

  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<AssignProjectModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any, private httpsRequestService:HttpsRequestService) {
    this.fetchUsers();
    this.projectInfo = data.project;
    this.location = data.location;
   }

   fetchUsers = () =>{
    if (this.names.length == 0){
    this.httpsRequestService.getHttpData<any>('https://deckinspectors-dev.azurewebsites.net/api/user/allusers').subscribe(
      (users) => {
        this.names = users;
        this.filteredNames = this.names;
      },
      error => {
        console.log(error);
      }
    )
    }
  }
  filterNames() {
    this.filteredNames = this.names.filter((name) =>
      name.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  refreshList() {
    this.filteredNames = this.names;
    this.searchTerm = '';
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const assignedUsers = this.names.filter((name) => name.checked);
    assignedUsers.forEach((user, i) =>{
      if (this.location === undefined){
      this.httpsRequestService.postHttpData(`https://deckinspectors-dev.azurewebsites.net/api/project/${this.projectInfo._id}/assign`, {username: user.username}).subscribe(
        (res) => {
          console.log(res);
        },
        error => {
          console.log(error);
        }
      )
    }
    else{
      this.httpsRequestService.postHttpData(`https://deckinspectors-dev.azurewebsites.net/api/subproject/${this.location._id}/assign`, {username: user.username}).subscribe(
        (res) => {
          console.log(res);
        },
        error => {
          console.log(error);
        }
      )
    }
  })
     this.dialogRef.close();
  }
}
