import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isSidebarCollapsed: boolean = true;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    console.log(this.isSidebarCollapsed);
  }

  collapseSidebar() {
    this.isSidebarCollapsed = true;
    console.log(this.isSidebarCollapsed);
  }
}
