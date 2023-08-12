import { Component } from '@angular/core';
import {LoginService} from "../../login/login.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isSidebarCollapsed: boolean = true;

  constructor(private loginService: LoginService) {
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  collapseSidebar() {
    this.isSidebarCollapsed = true;
  }

  logout() {
    this.loginService.logout();
  }
}
