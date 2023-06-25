import {Component, Input} from '@angular/core';
import {Project} from "../../../common/models/project";
import {BuildingLocation} from "../../../common/models/buildingLocation";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {

  @Input() showPartInfo!: boolean;
  @Input() projectInfo!: Project;
  @Input() gotoPartInfo!: ($event: BuildingLocation) => void;
  @Input() projectCommonLocationList!: BuildingLocation[];
  @Input() projectBuildings!: Project[];
  @Input() buildingLocation!: BuildingLocation;
}
