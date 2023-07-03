import {Component, Input, OnInit} from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";
import {HttpsRequestService} from "../../../../service/https-request.service";
import {InspectionReport} from "../../../../common/models/inspection-report";
import {OrchestratorEventName} from "../../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit{
  @Input() location!: BuildingLocation;
  sectionReport!: InspectionReport;

  constructor(private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService:OrchestratorCommunicationService) {}
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

  ngOnInit(): void {
    this.subscribeToOnLocationClick();
  }


  private subscribeToOnLocationClick() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Location_Click).subscribe(data => {
      this.fetchLocationDetails(data.id);
      console.log(data)
    });
  }
}
