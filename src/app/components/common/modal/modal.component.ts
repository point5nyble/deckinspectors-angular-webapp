import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/common/models/user';

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
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}

  submit = () =>{
    if (this.password?.trim() !== '')
      this.user.password = this.password;
    this.modalRef.close({user: this.user});
  } 

  togglePasswordVisibility = () =>{
    this.showPassword = !this.showPassword;
  }
}
