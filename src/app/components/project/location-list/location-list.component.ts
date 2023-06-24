import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {Project} from "../../../common/models/project";

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent
{
  @Output() isDbClick = new EventEmitter<BuildingLocation>();
  @Input() header!: string;
  @Input() locations!: BuildingLocation[];
  @Input() subproject!: Project[];

  checkIfSubProject() : boolean {
    return (this.header === "Project Buildings");
  }
  onDbClick(locationInfo:BuildingLocation) {
    this.isDbClick.emit(locationInfo);
  }
}
