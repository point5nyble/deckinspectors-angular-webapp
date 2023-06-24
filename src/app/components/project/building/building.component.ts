import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {Project} from "../../../common/models/project";

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent
{
  @Output() isDbClick = new EventEmitter<BuildingLocation>();
  @Input() header!: string;
  @Input() locations!: BuildingLocation[];
  @Input() subproject!: Project[];

  checkIfSubProject() : boolean {
    return (this.header === "Project Buildings");
  }
  onDbClick(locationInfo:BuildingLocation) {
    console.log(locationInfo);
    this.isDbClick.emit(locationInfo);
  }
}
