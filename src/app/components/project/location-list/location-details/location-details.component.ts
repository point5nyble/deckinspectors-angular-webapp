import {Component, Input, OnInit} from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";
import {HttpsRequestService} from "../../../../service/https-request.service";
import {InspectionReport} from "../../../../common/models/inspection-report";
import {OrchestratorEventName} from "../../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {ProjectQuery} from "../../../../app-state-service/project-state/project-selector";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit{
  @Input() location!: BuildingLocation;
  sectionReport!: InspectionReport;

  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private store: Store<any>) {
  }

  ngOnInit(): void {
    this.fetchInitialData();
    this.subscribeToOnLocationClick();
  }
  fetchDataForGivenSectionId($event: string) {
    console.log("Inside fetchDataForGivenSectionId")
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
    console.log("Inside fetchDataForGivenSectionId")
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
      console.log(this.location);
     })
  }
}
