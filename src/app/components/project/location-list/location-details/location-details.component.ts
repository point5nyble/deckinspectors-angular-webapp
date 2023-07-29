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
import {take} from "rxjs";

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit{
  location!: BuildingLocation;
  sectionReport!: InspectionReport;

  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private store: Store<any>) {
  }

  ngOnInit(): void {
    this.fetchSectionList();
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
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SHOW_SCREEN).subscribe(data => {
      if (data === 'location') {
        this.fetchSectionList();
      }
    });
    this.fetchSectionList();
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.UPDATE_LEFT_TREE_DATA).subscribe(data => {
      setTimeout(() => {
        this.fetchSectionList();
      },1000)
    });

  }

  private fetchSectionList() {
    this.store.select(BackNavigation.getPreviousStateModelChain).pipe(take(1)).subscribe((previousState: any) => {
      this.location = previousState.stack[previousState.stack.length - 1];
        // TODO: Remove this inconsistent naming
        if (this.location.type === 'location' ||
          this.location.type === 'projectlocation' ||
          this.location.type === 'apartment' ||
          this.location.type === 'buildinglocation') {
          let projectid = this.location._id === undefined ? (<any>this.location).id : this.location._id;
          this.fetchLocationDetails(projectid);
        }
      }
    );
  }
}
