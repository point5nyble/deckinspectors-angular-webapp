import { Component, Input } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { BackNavigation } from 'src/app/app-state-service/back-navigation-state/back-navigation-selector';
import { OrchestratorEventName } from 'src/app/orchestrator-service/models/orchestrator-event-name';
import { Store } from '@ngrx/store';
import { OrchestratorCommunicationService } from 'src/app/orchestrator-service/orchestrartor-communication/orchestrator-communication.service';
import { HttpsRequestService } from 'src/app/service/https-request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isSidebarCollapsed: boolean = true;
  name: string = '';
  role: string = ''; 
  firstName: string = '';// Add this property
   // Add this property
  isAdmin: boolean =
    JSON.parse(localStorage.getItem('user')!)?.role === 'admin';
  logoUrl = '';
  constructor(
    private loginService: LoginService,
    private store: Store<any>,
    private orchestratorCommunicationService: OrchestratorCommunicationService,
    private httpsRequestService: HttpsRequestService,
  ) {}

  ngOnInit(): void {
    // this.isAdmin = this.checkIfAdmin();
    this.logoUrl = localStorage.getItem('companyLogo')!;
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/user/${localStorage.getItem('username')}`).subscribe(
      (user) => {
        // Capitalize the first letter of the first name
        const capitalizedFirstName = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
        // Capitalize the first letter of the last name
        const capitalizedLastName = user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);

        const capitalizedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

        this.firstName = capitalizedFirstName;
        this.name = capitalizedFirstName + " " + capitalizedLastName;
        this.role = capitalizedRole; // Set the username property
        // console.log(user);
      },
      error => {
        console.log(error);
      }
    );
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

  activateLink(event: Event) {
    let elements = document.getElementsByClassName('active');
    for (let i = 0; i < elements.length; i++) {
      elements[i].className = '';
    }
    (event.currentTarget as HTMLElement).className = "active";
  }

  gotoHome() {
    let tempList: any[] = [];
    this.store
      .select(BackNavigation.getPreviousStateModelChain)
      .subscribe((chain: { stack: any[] }) => {
        tempList = chain.stack;
      });
    tempList.forEach((element: any) => {
      if (element.name !== 'Home') {
        this.orchestratorCommunicationService.publishEvent(
          OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC,
          ''
        );
      }
    });
    this.orchestratorCommunicationService.publishEvent(
      OrchestratorEventName.SHOW_SCREEN,
      'home'
    );
  }
}
