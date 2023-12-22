import { Component, Input } from '@angular/core';
import {LoginService} from "../../login/login.service";
import { BackNavigation } from 'src/app/app-state-service/back-navigation-state/back-navigation-selector';
import { OrchestratorEventName } from 'src/app/orchestrator-service/models/orchestrator-event-name';
import { Store } from '@ngrx/store';
import { OrchestratorCommunicationService } from 'src/app/orchestrator-service/orchestrartor-communication/orchestrator-communication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  

  isSidebarCollapsed: boolean = true;
  isAdmin: boolean = ((JSON.parse(localStorage.getItem('user')!))?.role === "admin");
  constructor(private loginService: LoginService,private store: Store<any>
    ,private orchestratorCommunicationService:OrchestratorCommunicationService) {
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
  }

  gotoHome() {
    let tempList:any[] = [];
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((chain: { stack: any[]; }) => {
      tempList = chain.stack;
    })
    tempList.forEach((element:any) => {
      if (element.name !== 'Home') {
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, '');
      }
    })
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN,'home');
  }
}
