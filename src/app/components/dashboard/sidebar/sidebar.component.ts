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

  activateLink(event: Event){
    let elements = document.getElementsByClassName("active");
    for(let i = 0; i < elements.length; i++) {
      elements[i].className = "";
    }
    (event.currentTarget as HTMLElement).className = "active";
    console.log((event.currentTarget as HTMLElement))
  }
}
