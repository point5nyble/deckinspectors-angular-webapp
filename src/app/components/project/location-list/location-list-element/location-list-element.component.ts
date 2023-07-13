import { Component, Input } from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";
import {ProjectListElement} from "../../../../common/models/project-list-element";

@Component({
  selector: 'app-location-list-element',
  templateUrl: './location-list-element.component.html',
  styleUrls: ['./location-list-element.component.scss']
})
export class LocationListElementComponent {
  @Input() location!: ProjectListElement;
  @Input() isSubProject!: boolean;
  @Input() projectName!: string;

}
