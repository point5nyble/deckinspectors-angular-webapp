import { LocationInfo } from './../../../../common/models/location-info';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
@Input() locationInfo!: LocationInfo;
}
