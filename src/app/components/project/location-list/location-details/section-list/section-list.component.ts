import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {BuildingLocation, Section} from "../../../../../common/models/buildingLocation";
import {
  OrchestratorCommunicationService
} from "../../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {HttpsRequestService} from "../../../../../service/https-request.service";
import {ProjectQuery} from "../../../../../app-state-service/project-state/project-selector";
import {Store} from "@ngrx/store";
import {ProjectState, SectionState} from "../../../../../app-state-service/store/project-state-model";
import {OrchestratorEventName} from "../../../../../orchestrator-service/models/orchestrator-event-name";

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss'],
})
export class SectionListComponent implements OnInit{
  header: string = 'Locations';

  @Output() sectionID = new EventEmitter<string>();
  location_!: BuildingLocation;  // @Input() location!: BuildingLocation
  sections: Section[] = [];
  @Input()
  set location(location: BuildingLocation) {
    this.location_ = location;
    this.getSections(location);
  }
  public currentSection!: any;

  projectState!: ProjectState;
  @Output() sectionStateChange = new EventEmitter<SectionState>();

  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private httpsRequestService:HttpsRequestService,
              private store: Store<any>) {
  }


  fetchDataForGivenSectionId($event: Section) {
    console.log($event);
    this.currentSection = $event;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SECTION_CLICKED, $event._id);
  }

  ngOnInit(): void {
    this.subscribeProjectState();
  }
  private subscribeProjectState() {
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      this.projectState = data.state;
      this.getSections(this.location_!);
    });
  }

  private getSections(location: BuildingLocation) {
    if (this.projectState === ProjectState.INVASIVE) {
      // TODO: Check Logic for Invasive
      this.sections = location?.sections.filter(section => section.furtherinvasivereviewrequired.valueOf());
    }

  }
}
