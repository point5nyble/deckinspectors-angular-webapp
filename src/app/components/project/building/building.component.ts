import { Component, Input } from '@angular/core';
import { LocationInfo } from 'src/app/common/models/location-info';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent {
  @Input() header!: string;

  // Create a list of location-info
  locationInfos: LocationInfo[] = [
    new LocationInfo('Access Stare Adjacent to Elvator','Apr, 12 2023','David Mazor', 'David Mazor'),
    new LocationInfo('Access Stare located at North West Corner','Apr, 12 2023','David Mazor', 'David Mazor'),
    new LocationInfo('Access Stare Next to Elvator 29', 'Apr, 12 2023','David Mazor', 'David Mazor')
  ]
}
