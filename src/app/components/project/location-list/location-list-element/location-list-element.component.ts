import { Component, Input } from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";

@Component({
  selector: 'app-location-list-element',
  templateUrl: './location-list-element.component.html',
  styleUrls: ['./location-list-element.component.scss']
})
export class LocationListElementComponent {
  @Input() location!: BuildingLocation;
  @Input() isSubProject!: boolean;
  @Input() projectName!: string;

}
