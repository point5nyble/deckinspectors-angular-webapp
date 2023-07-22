import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {
  VisualDeckReportModalComponent
} from "../../../../../forms/visual-deck-report-modal/visual-deck-report-modal.component";
import {BuildingLocation, Section} from "../../../../../common/models/buildingLocation";
import {
  OrchestratorCommunicationService
} from "../../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {HttpsRequestService} from "../../../../../service/https-request.service";
import {OrchestratorEventName} from "../../../../../orchestrator-service/models/orchestrator-event-name";

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})
export class SectionListComponent implements OnInit{
  header: string = 'Parts';
  @Output() sectionID = new EventEmitter<string>();
  @Input() location!: BuildingLocation
  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private httpsRequestService:HttpsRequestService) {
  }
  openVisualDeckReportModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "700px";
    dialogConfig.data = {
      id: 1
    };
    const dialogRef = this.dialog.open(VisualDeckReportModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.createSection(data);
    })
  }

  fetchDataForGivenSectionId($event: Section) {
    // console.log($event);
    this.sectionID.emit($event._id);
    // this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, $event);

  }

  ngOnInit(): void {
   }

  private createSection(data: any) {
    let request = {
      "name": data.visualReportName,
      "additionalconsiderations": data.additionalConsiderationsOrConcern,
      "awe": data.AWE,
      "conditionalassessment": data.conditionAssessment,
      "createdby": "deck",
      "eee": data.EEE,
      "exteriorelements": data.exteriorElements,
      "furtherinvasivereviewrequired": data.invasiveReviewRequired,
      "lbc": data.LBC,
      "parentid":this.location._id,
      "parenttype": this.location.type,
      "visualreview": data.visualReview,
      "visualsignsofleak": data.signsOfLeaks,
      "waterproofingelements": data.waterproofingElements,
      "images": data.images
    }
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/section/add';
    // console.log(request);
    this.httpsRequestService.postHttpData(url, request).subscribe(
      (response:any) => {
        // console.log(response);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'added section');
      },
      error => {
        console.log(error)
      }
    );
  }
}
