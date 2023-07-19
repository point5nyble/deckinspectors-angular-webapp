import {Component, OnInit} from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";
import {HttpsRequestService} from "../../../../service/https-request.service";
import {InspectionReport} from "../../../../common/models/inspection-report";
import {OrchestratorEventName} from "../../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {Store} from "@ngrx/store";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewLocationModalComponent} from "../../../../forms/new-location-modal/new-location-modal.component";
import {BackNavigation} from "../../../../app-state-service/back-navigation-state/back-navigation-selector";

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit{
  location!: BuildingLocation;
  sectionReport!: InspectionReport;
  // @Output() previousBtnClickedFromLocationDetails = new  EventEmitter<boolean>();

  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private store: Store<any>,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchInitialData();
    this.subscribeToOnLocationClick();
  }
  fetchDataForGivenSectionId($event: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/section/getSectionById';
    let data = {
      sectionid:$event,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.sectionReport = response.item;
       },
      error => {
        console.log(error)
      }
    );
  }

  fetchLocationDetails($event: string) {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/location/getLocationById';
      let data = {
          locationid:$event,
          username: 'deck'
      };
      this.httpsRequestService.postHttpData(url, data).subscribe(
          (response:any) => {
            this.location = response.item;
            console.log(response);
          },
          error => {
              console.log(error)
          }
      );
  }
  private subscribeToOnLocationClick() {
    // this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Location_Click).subscribe(data => {
    //   this.fetchLocationDetails(data.id);
    //   console.log(data)
    // });
  }

  private fetchInitialData() {
    // this.store.select(ProjectQuery.getProjectModel).subscribe((project: any)=> {
    //   this.location = project;
    //   //TODO: Fix this inconsistent naming
    //   let projectid = project._id === undefined ? (<any>project).id : project._id;
    //   this.fetchLocationDetails(projectid);
    //   })

    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      this.location = previousState.stack[previousState.stack.length - 1];
      // TODO: Remove this inconsistent naming
      if (this.location.type === 'location' || this.location.type === 'projectlocation' || this.location.type === 'apartment' || this.location.type === 'buildinglocation') {
        let projectid = this.location._id === undefined ? (<any>this.location).id : this.location._id;
        this.fetchLocationDetails(projectid);
      }
    });
  }

  previousBtnClicked() {
    if (this.location.parenttype === 'subproject') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'subproject');
    } else {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'project');
    }
    // this.previousBtnClickedFromLocationDetails.emit(true);
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, this.location);
  }

  editLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "700px";
    dialogConfig.data = {
      id: 1,
      location:this.location
    };
    const dialogRef = this.dialog.open(NewLocationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
    })
  }
}
