import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Project } from 'src/app/common/models/project';
import { ProjectListElement } from 'src/app/common/models/project-list-element';
import { HttpsRequestService } from 'src/app/service/https-request.service';
import { environment } from '../../../environments/environment';

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
  location!: Project;

  constructor(private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<AssignProjectModalComponent>,
              @Inject(MAT_DIALOG_DATA) data : any, private httpsRequestService:HttpsRequestService) {
    this.fetchUsers();
    this.projectInfo = data.project;
    this.location = data.location;
   }

   fetchUsers = () =>{
    if (this.names.length == 0){
    this.httpsRequestService.getHttpData<any>(environment.apiURL + '/user/allusers').subscribe(
      (users: any) => {
        console.log(users);
        let assignedUsers = (this.location === undefined)? this.projectInfo.assignedto : this.location.assignedto;
        this.names = users.map((user : any) => {
          if(assignedUsers.includes(user.username))
            user.checked = true;
          return user;
        });
        console.log(this.names)
        this.filteredNames = this.names;
      },
      (error: any) => {
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
    this.dialogRef.close({isAssigned: false, apiCalled: false});
  }

  save() {
    const assignedUsers = this.names.filter((name) => name.checked);
    const assignedUserUsernames = assignedUsers.map((user:any) => user.username);
    const prevAssignedUsers = (this.location === undefined)? this.projectInfo.assignedto : this.location.assignedto;
    const currAssigned = assignedUserUsernames.filter(username => !prevAssignedUsers.includes(username));
    const unassignedUsers = prevAssignedUsers.filter(username => !assignedUserUsernames.includes(username));

    currAssigned.forEach((username, i) =>{
      if (this.location === undefined){
      this.httpsRequestService.postHttpData(`${environment.apiURL}/project/${this.projectInfo._id}/assign`, {username: username}).subscribe(
        (res: any) => {
          this.dialogRef.close({isAssigned: true, apiCalled: true});
        },
        (error: any) => {
          this.dialogRef.close({isAssigned: false, apiCalled: true});
        }
      )
    }
    else{
      this.httpsRequestService.postHttpData(`${environment.apiURL}/subproject/${this.location._id}/assign`, {username: username}).subscribe(
        (res: any) => {
          console.log(res);
          this.dialogRef.close({isAssigned: true, apiCalled: true});
        },
        (error: any) => {
          console.log(error);
          this.dialogRef.close({isAssigned: false, apiCalled: true});
        }
      )
    }
  })

  unassignedUsers.forEach((username : any) =>{
    if (this.location === undefined){
    this.httpsRequestService.postHttpData(`${environment.apiURL}/project/${this.projectInfo._id}/unassign`, {username: username}).subscribe(
      (res: any) => {
        console.log(res);
        this.dialogRef.close({isAssigned: true, apiCalled: true});
      },
      (error: any) => {
        console.log(error);
        this.dialogRef.close({isAssigned: false, apiCalled: true});
      }
    )
  }
  else{
    this.httpsRequestService.postHttpData(`${environment.apiURL}/subproject/${this.location._id}/unassign`, {username: username}).subscribe(
      (res: any) => {
        console.log(res);
        this.dialogRef.close({isAssigned: true, apiCalled: true});
      },
      (error: any) => {
        console.log(error);
        this.dialogRef.close({isAssigned: false, apiCalled: true});
      }
    )
  }
})
  }
}
