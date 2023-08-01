import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../common/models/inspection-report";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {
  VisualDeckReportModalComponent
} from "../../../../../forms/visual-deck-report-modal/visual-deck-report-modal.component";
import {BuildingLocation} from "../../../../../common/models/buildingLocation";
import {
  OrchestratorCommunicationService
} from "../../../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {HttpsRequestService} from "../../../../../service/https-request.service";
import {SectionState} from "../../../../../app-state-service/store/project-state-model";
import {OrchestratorEventName} from "../../../../../orchestrator-service/models/orchestrator-event-name";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit{
  sectionReport_!: InspectionReport;
  @Input() sectionState!: SectionState;
  @Input()
  set sectionReport(section: InspectionReport) {
    this.sectionReport_ = section;
    this.ngOnInit();
  }

  @Input() location!:BuildingLocation;
  englishNamesMap!: { [key: string]: string };
  rows: { column1: string; column2: any }[] = [];
  rowsMap!: Map<string, string>;
  @Input() isRecordFound!:boolean;
  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private httpsRequestService:HttpsRequestService) {
    this.constructEnglishNameMap();
  }

  private constructEnglishNameMap() {
    this.englishNamesMap = {
      name: "Name",
      exteriorelements: "Exterior Elements",
      waterproofingelements: "Waterproofing Elements",
      visualreview: "Visual Review",
      visualsignsofleak: "Visual Signs of Leak",
      furtherinvasivereviewrequired: "Further Invasive Review Required",
      conditionalassessment: "Conditional Assessment",
      additionalconsiderations: "Additional Considerations or Concerns",
      eee: "Life Expectancy Exterior Elevated Elements (EEE)",
      lbc: "Life Expectancy Load Bearing Componenets (LBC)",
      awe: "Life Expectancy Associated Waterproofing Elements (AWE)",
    };
  }
  private constructRows() {
    this.rows = [];
    this.rowsMap = new Map<string,string>();
    if (this.sectionReport_ != null || this.sectionReport_ != undefined) {
      for (let key in this.englishNamesMap) {
        if (this.englishNamesMap.hasOwnProperty(key)) {
          const value:string = this.englishNamesMap[key];
          this.rows.push(
            {
              column1: value,
              column2: this.sectionReport_[key]
            }
          );
          this.rowsMap.set(key, this.sectionReport_[key]);
        }
      }
    }
  }

  ngOnInit(): void {
    this.constructRows();
  }

  editVisualDeckReportModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "700px";
    dialogConfig.data = {
      id: 1,
      rowsMap:this.rowsMap,
      images: this.sectionReport_?.images
    };
    const dialogRef = this.dialog.open(VisualDeckReportModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.createSection(data);
    })
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
    let url = this.getURL()
    console.log(url)
    if (this.isRecordFound) {
      console.log(request);
      this.httpsRequestService.putHttpData(url, request).subscribe(
        (response:any) => {
          console.log(response);
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'added section');
          this.closeOverlay();
        },
        error => {
          console.log(error)
          this.closeOverlay();
        }
      );
    } else {
      console.log(request);
      this.httpsRequestService.postHttpData(url, request).subscribe(
        (response:any) => {
          console.log(response);
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'added section');
          this.closeOverlay();
        },
        error => {
          console.log(error)
          this.closeOverlay();
        }
      );
    }
    // console.log(request);
    // this.httpsRequestService.putHttpData(url, request).subscribe(
    //   (response:any) => {
    //     console.log(response);
    //     this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'added section');
    //   },
    //   error => {
    //     console.log(error)
    //   }
    // );
  }

  closeOverlay() {
    this.isRecordFound  =!this.isRecordFound;
  }

  private getURL(): string {
    let url = '';
    if (this.isRecordFound) {
      if (this.sectionState === SectionState.VISUAL) {
          url = 'https://deckinspectors-dev.azurewebsites.net/api/section/' + this.sectionReport_._id;
      } else if (this.sectionState === SectionState.CONCLUSIVE) {
          url = 'https://deckinspectors-dev.azurewebsites.net/api/conclusivesection/' + this.sectionReport_._id;
      } else if (this.sectionState === SectionState.INVASIVE) {
          url = 'https://deckinspectors-dev.azurewebsites.net/api/invasivesection/' + this.sectionReport_._id;
      }
    } else {
      // If record not found we will add the record in the database
      if (this.sectionState === SectionState.VISUAL) {
            url = 'https://deckinspectors-dev.azurewebsites.net/api/section/add';
        } else if (this.sectionState === SectionState.CONCLUSIVE) {
            url = 'https://deckinspectors-dev.azurewebsites.net/api/conclusivesection/add';
        } else if (this.sectionState === SectionState.INVASIVE) {
            url = 'https://deckinspectors-dev.azurewebsites.net/api/invasivesection/add';
        }
    }
    return url;
  }
}
