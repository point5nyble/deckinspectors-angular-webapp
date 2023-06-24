import {Component, Input, OnInit} from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";
import {HttpsRequestService} from "../../../../service/https-request.service";
import {InspectionReport} from "../../../../common/models/inspection-report";

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit{
  @Input() location!: BuildingLocation;
  sectionReport!: InspectionReport;

  constructor(private httpsRequestService:HttpsRequestService) {}
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

  ngOnInit(): void {
    console.log(this.location);
  }
}
