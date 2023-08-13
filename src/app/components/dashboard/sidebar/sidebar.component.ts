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
  }

  collapseSidebar() {
    this.isSidebarCollapsed = true;
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
