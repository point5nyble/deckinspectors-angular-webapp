import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../common/models/project";
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit{

  @Input() showPartInfo!: boolean;
  @Input() projectInfo!: Project;
  @Input() gotoPartInfo!: ($event: BuildingLocation) => void;
  @Input() projectCommonLocationList!: BuildingLocation[];
  @Input() projectBuildings!: Project[];
  @Input() buildingLocation!: BuildingLocation;

  constructor(private orchestratorCommunicationService: OrchestratorCommunicationService) {
  }
  ngOnInit(): void {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Show_Project_Details).subscribe(data => {
        this.showPartInfo = data;
    });
  }


}
