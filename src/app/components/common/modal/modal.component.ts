import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/common/models/user';
import { HttpsRequestService } from 'src/app/service/https-request.service';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment'; // Import your environment settings

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  title!: string;
  buttonName!: string;
  user!: any;
  formtype!: string;
  password!: string;
  showPassword: boolean = false;

  constructor(
    public modalRef: MdbModalRef<ModalComponent>,
    private httpsRequestService: HttpsRequestService,
    private toast: HotToastService
  ) {}

  submit = () => {
    if (this.password?.trim() !== '') {
      this.user.password = this.password;
    }

    // Check for empty fields
    if (!this.user.username || !this.user.last_name || !this.user.first_name || !this.user.email || !this.user.mobile || !this.user.role || !this.user.access_type) {
      this.toast.error('All fields are mandatory!');
      return;
    }

    // Make the HTTP request to register the user
    if(this.formtype==='createUser'){
      this.httpsRequestService
      .postHttpData<any>(environment.apiURL + '/user/register', this.user)
      .subscribe(
        (data) => {
          this.toast.success('User added successfully!');
          this.modalRef.close({ success: true });
        },
        (error) => {
          console.log(error);
          this.toast.error(error.error);

        }
      );
    }else{
      this.httpsRequestService
            .postHttpData<any>(environment.apiURL + '/user/update', this.user)
            .subscribe(
              (data) => {},
              (error) => {
                console.log(error);
                if (error.status == 201) {
                //   (
                //     document.getElementById('success-alert') as HTMLElement
                //   ).innerHTML = `<div class="alert alert-primary alert-dismissible fade show" role="alert">
                // <strong>Success! </strong> user updated 
                // <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                this.toast.success('User updated successfully!');
                this.modalRef.close({ success: true });
                } else {
                  this.toast.error(`User failed to update!, ${error.error}`);
                //   (
                //     document.getElementById('success-alert') as HTMLElement
                //   ).innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                // <strong>Failure! </strong> user not updated 
                // <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
                }
              }
            );
      
    }
    
  };

  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword;
  }
}
