import {Component, EventEmitter, Input, OnInit, Output, SimpleChange} from '@angular/core';
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
import { environment } from '../../../../../../environments/environment';
import { DeleteConfirmationModalComponent } from '../../../../../forms/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss'],
})
export class SectionListComponent implements OnInit{
  header: string = 'Locations';

  @Output() sectionID = new EventEmitter<string>();
  @Output() sectionsDeletionComplete = new EventEmitter<boolean>();
  location_!: BuildingLocation;  // @Input() location!: BuildingLocation
  sections: Section[] = [];
  @Input() isLoading!: boolean;
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
    this.currentSection = $event;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SECTION_CLICKED, $event._id);
  }

  ngOnInit(): void {
    this.subscribeProjectState();
    console.log(this.location_);
  }
  private subscribeProjectState() {
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      this.projectState = data.state;
      this.getSections(this.location_!);
    });
  }

ngOnChanges(changes: { [property: string]: SimpleChange }) {
    // Extract changes to the input property by its name
    let change: SimpleChange = changes['isLoading']; 
    if(change?.currentValue){
      
    }
    // Whenever the data in the parent changes, this method gets triggered
    // You can act on the changes here. You will have both the previous
    // value and the  current value here.
}

  private getSections(location: BuildingLocation) {
    console.log("get sections");
    if (this.projectState === ProjectState.INVASIVE) {
      // TODO: Check Logic for Invasive
      this.sections = location?.sections?.filter(section => this.convertValueToBoolean(section?.furtherinvasivereviewrequired?.toString()));
    } else {
      this.sections = location?.sections;
    }
  }

    private convertValueToBoolean(valueOf: string):boolean {
    try {
      return JSON.parse(valueOf.toLowerCase());
    } catch (e) {
      console.log(e);
      return false;
    }

    }

  deleteElement($event: string) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    // dialogConfig.height = "140px";
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data.confirmed){

        let id = $event;
        let url = `${environment.apiURL}/section/${id}`;
        this.httpsRequestService.deleteHttpData(url).subscribe(
          (response: any) => {
            console.log(response);
            this.sectionsDeletionComplete.emit(true);
          }
          , error => {
            console.log(error);
            this.sectionsDeletionComplete.emit(false);
          }
        );

      }})
  }
}
