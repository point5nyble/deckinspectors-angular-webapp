import {Component, Input} from '@angular/core';
import {OrchestratorEventName} from "../../../../orchestrator-service/models/orchestrator-event-name";
import {Project} from "../../../../common/models/project";
import {
  OrchestratorCommunicationService
} from "../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";

@Component({
  selector: 'app-project-details-upper-section',
  templateUrl: './project-details-upper-section.component.html',
  styleUrls: ['./project-details-upper-section.component.scss']
})
export class ProjectDetailsUpperSectionComponent {
  @Input() projectInfo!: Project;

  constructor(private orchestratorCommunicationService: OrchestratorCommunicationService) {
  }

  previousBtnClicked() {
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_All_Projects, true);
  }
}
