import { Component, OnInit } from '@angular/core';
import { HttpsRequestService } from '../../service/https-request.service';
import { Store } from '@ngrx/store';
import { User } from 'src/app/common/models/user';
import { ModalComponent } from '../common/modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { environment } from '../../../environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../forms/delete-confirmation-modal/delete-confirmation-modal.component';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  allUsers!: User[];
  filteredUsers!: User[];
  searchedTerm!: string;
  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(
    private dialog: MatDialog,
    private modalService: MdbModalService,
    private httpsRequestService: HttpsRequestService,
    private toast: HotToastService,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.fetchUsersData();
  }

  private fetchUsersData() {
    this.httpsRequestService
      .getHttpData<any>(environment.apiURL + '/user/allusers')
      .subscribe(
        (data) => {
          this.allUsers = data;
          this.filteredUsers = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  userSearch = () => {
    this.filteredUsers = this.allUsers.filter((user) => {
      let name = user.first_name + user.last_name;
      return name.toLowerCase().includes(this.searchedTerm.toLowerCase());
    });
  };

  reset = () => {
    this.filteredUsers = this.allUsers;
    this.searchedTerm = '';
  };

  createUser = () => {
    let user: User = {
      username: '',
      last_name: '',
      first_name: '',
      email: '',
      mobile: '',
      role: '',
      access_type: '',
    };
    this.modalRef = this.modalService.open(ModalComponent, {
      data: {
        title: 'Add User',
        buttonName: 'Create',
        user: user,
        formtype: 'createUser',
      },
    });

    this.modalRef.onClose.subscribe((message: any) => {
      if (message !== undefined && message.user !== undefined) {
        this.httpsRequestService
          .postHttpData<any>(environment.apiURL + '/user/register', user)
          .subscribe(
            (data) => {
              this.toast.success('User added successfully!');
              setTimeout(() => {
                this.fetchUsersData();
              }, 1500);
            },
            (error) => {
              console.log(error);
              this.toast.error('Adding user failed!');

              // if(error.status === 409){
              // (document.getElementById('success-alert') as HTMLElement).innerHTML =`<div class="alert alert-danger alert-dismissible fade show" role="alert">
              // <strong>Failure! </strong> ${error.error}
              // <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
              // }
              // else{
              // (document.getElementById('success-alert') as HTMLElement).innerHTML =`<div class="alert alert-danger alert-dismissible fade show" role="alert">
              // <strong>Failure! </strong> user not created
              // <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
              // }
            }
          );
      }
    });
  };

  updateUser = (userEmail: string) => {
    const res: User[] = this.allUsers.filter(
      (item) => item.email === userEmail
    );
    let user: User;
    if (res.length > 0) {
      user = res[0];
      this.modalRef = this.modalService.open(ModalComponent, {
        data: {
          title: 'Update User',
          buttonName: 'Save changes',
          user: user,
          formtype: 'updateUser',
        },
      });

      this.modalRef.onClose.subscribe((message: any) => {
        if (message !== undefined && message.user !== undefined) {
          this.httpsRequestService
            .postHttpData<any>(environment.apiURL + '/user/update', user)
            .subscribe(
              (data) => {},
              (error) => {
                console.log(error);
                if (error.status == 201) {
                  (
                    document.getElementById('success-alert') as HTMLElement
                  ).innerHTML = `<div class="alert alert-primary alert-dismissible fade show" role="alert">
                <strong>Success! </strong> user updated 
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                } else {
                  (
                    document.getElementById('success-alert') as HTMLElement
                  ).innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Failure! </strong> user not updated 
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
                }
              }
            );
        }
      });
    }
  };

  deleteUser = (deleteUser: User) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '230px';
    dialogConfig.data = {
      name: deleteUser.first_name + ' ' + deleteUser.last_name,
    };
    const dialogRef = this.dialog.open(
      DeleteConfirmationModalComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data.confirmed) {
        this.httpsRequestService
          .postHttpData<any>(environment.apiURL + '/user/delete', deleteUser)
          .subscribe(
            (data) => {
              (
                document.getElementById('success-alert') as HTMLElement
              ).innerHTML = `<div class="alert alert-primary alert-dismissible fade show" role="alert">
              <strong>Success! </strong> user updated 
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
            },
            (error) => {
              console.log(error);
              if (error.status == 201) {
                (
                  document.getElementById('success-alert') as HTMLElement
                ).innerHTML = `<div class="alert alert-primary alert-dismissible fade show" role="alert">
              <strong>Success! </strong> user deleted 
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                this.fetchUsersData();
              } else {
                (
                  document.getElementById('success-alert') as HTMLElement
                ).innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Failure! </strong> user not deleted 
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
              }
            }
          );
      }
    });
  };
}
