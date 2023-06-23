import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../common/models/project";
import {HttpsRequestService} from "../../service/https-request.service";
import {BuildingLocation} from "../../common/models/buildingLocation";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit{
  showPartInfo: boolean = true;
  projectCommonLocationList!: BuildingLocation[];
  projectBuildings!: Project[];
  buildingLocation!: BuildingLocation;
  @Input() projectInfo!: Project;
  constructor(private httpsRequestService:HttpsRequestService) {
  }
  ngOnInit(): void {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/location/getLocationsByProjectId';
    let data = {
      projectid:this.projectInfo._id,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.projectCommonLocationList = response.item;
        console.log(this.projectCommonLocationList);
      },
      error => {
        console.log(error)
      }
    );

    url = 'https://deckinspectors-dev.azurewebsites.net/api/subproject/getSubprojectsDataByProjectId';
    data = {
      projectid:this.projectInfo._id,
      username: 'deck'
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.projectBuildings = response.item;
        console.log(this.projectBuildings);
      },
      error => {
        console.log(error)
      }
    );
  }
  public gotoPartInfo($event: BuildingLocation): void {
    this.showPartInfo = false;
    this.buildingLocation = $event;
    console.log(this.showPartInfo);
    console.log(this.buildingLocation);
   }
}
