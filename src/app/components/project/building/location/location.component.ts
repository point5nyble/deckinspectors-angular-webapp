import { Component, Input } from '@angular/core';
import {BuildingLocation} from "../../../../common/models/buildingLocation";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  @Input() location!: BuildingLocation;
  @Input() isSubProject!: boolean;
  @Input() projectName!: string;
}
