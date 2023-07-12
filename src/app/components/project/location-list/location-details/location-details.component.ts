import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";
import {HttpsRequestService} from "../../../../service/https-request.service";
import {InspectionReport} from "../../../../common/models/inspection-report";
import {OrchestratorEventName} from "../../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {ProjectQuery} from "../../../../app-state-service/project-state/project-selector";
import {Store} from "@ngrx/store";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewLocationModalComponent} from "../../../../forms/new-location-modal/new-location-modal.component";

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit{
  location!: BuildingLocation;
  sectionReport!: InspectionReport;
  @Output() previousBtnClickedFromLocationDetails = new  EventEmitter<boolean>();

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
    this.store.select(ProjectQuery.getProjectModel).subscribe((project: any)=> {
      this.location = project;
      this.fetchLocationDetails(project.id);
      })
  }

  previousBtnClicked() {
    if (this.location.parenttype === 'subproject') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, 'subproject');
    } else {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, 'project');
    }
    this.previousBtnClickedFromLocationDetails.emit(true);
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
