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
    this.httpsRequestService
      .postHttpData<any>(environment.apiURL + '/user/register', this.user)
      .subscribe(
        (data) => {
          this.toast.success('User added successfully!');
          this.modalRef.close({ success: true });
        },
        (error) => {
          console.log(error);
          this.toast.error('Adding user failed!');
        }
      );
  };

  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword;
  }
}
