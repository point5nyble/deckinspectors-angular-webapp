import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {ProjectState, SectionState} from "../../../../../app-state-service/store/project-state-model";
import {OrchestratorEventName} from "../../../../../orchestrator-service/models/orchestrator-event-name";
import {ProjectQuery} from "../../../../../app-state-service/project-state/project-selector";
import {Store} from "@ngrx/store";
import {
  InvasiveSectionModalComponent
} from "../../../../../forms/invasive-section-modal/invasive-section-modal/invasive-section-modal.component";
import {
  ConclusiveSectionModalComponent
} from "../../../../../forms/conclusive-section-modal/conclusive-section-modal/conclusive-section-modal.component";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit{
  @Input() isRecordFound!:boolean;
  @Input() sectionState!: SectionState;
  @Input() location!:BuildingLocation;
  sectionId_!:string;
  images!: string[];
  @Input()
  set sectionId($event: string) {
    console.log($event)
    // this.fetchDataForGivenSectionId($event);
  }
  sectionReport!: InspectionReport;

  @Output() sectionStateChange = new EventEmitter<SectionState>();

  projectState!: ProjectState;
  rows: { column1: string; column2: any }[] = [];
  rowsMap!: Map<string, string>;
  private englishNamesMap!: { [key: string]: string };


  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private httpsRequestService:HttpsRequestService,
              private store: Store<any>) {

  }

  ngOnInit(): void {
    this.constructEnglishNameMap();
    this.constructRows();
    this.subscribeProjectState();
    this.subscribeToSectionClick();
  }

  private fetchDataForGivenSectionId($event: string) {
    this.rows = [];
    this.sectionId_ = $event;
    let url = '';
    let data: any = {
      username: 'deck'
    };
    if (this.sectionState === SectionState.VISUAL) {
      data = {...data, sectionid: $event}
      url = 'https://deckinspectors-dev.azurewebsites.net/api/section/getSectionById';
    } else if (this.sectionState === SectionState.INVASIVE) {
      data = {...data, parentSectionId: $event}
      url = 'https://deckinspectors-dev.azurewebsites.net/api/invasivesection/getInvasiveSectionByParentId';
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      data = {...data, parentSectionId: $event}
      url = 'https://deckinspectors-dev.azurewebsites.net/api/conclusivesection/getConclusiveSectionsByParentId';
    }


    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        console.log(response)
        this.sectionReport = response.item;
        this.constructRows();
        this.isRecordFound = true;
      },
      error => {
        if (error.error.code === 401 && error.error.message === "No Invasive Section found.") {
          this.isRecordFound = false;
        }
        console.log(error.error)
      }
    );
  }

  private subscribeProjectState() {
    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      // Reset to default state
      this.rows = [];
      this.images = [];
      this.projectState = data.state;
    });
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
      invasiveDescription: "Invasive Description",
    };
  }
  private constructRows() {
    this.rows = [];
    this.rowsMap = new Map<string,string>();
    if (this.sectionReport != null || this.sectionReport != undefined) {
      for (let key in this.englishNamesMap) {
        if (this.englishNamesMap.hasOwnProperty(key) && this.sectionReport[key] !== null && this.sectionReport[key] !== undefined) {
          const value:string = this.englishNamesMap[key];
            console.log(value);
            this.rows.push(
              {
                column1: value,
                column2: this.sectionReport[key]
              }
            );
            this.rowsMap.set(key, this.sectionReport[key]);

        }
      }
    }
    if (this.sectionState === SectionState.INVASIVE) {
      this.images = this.sectionReport?.invasiveimages;
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      this.images = this.sectionReport?.images;
    } else if (this.sectionState === SectionState.VISUAL) {
      this.images = this.sectionReport?.images;
    }

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
      images: this.images,
    };
    if (this.sectionState === SectionState.VISUAL) {
      const dialogRef = this.dialog.open(VisualDeckReportModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        this.editSection(data);
      })
    } else if (this.sectionState === SectionState.INVASIVE) {
      const dialogRef = this.dialog.open(InvasiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        this.editSection(data);
      })
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      const dialogRef = this.dialog.open(ConclusiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        this.editSection(data);
      })
    }
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
    if (this.sectionState === SectionState.VISUAL) {
      const dialogRef = this.dialog.open(VisualDeckReportModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        this.createSection(data);
      })
    } else if (this.sectionState === SectionState.INVASIVE) {
      const dialogRef = this.dialog.open(InvasiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        this.createSection(data);
      })
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      const dialogRef = this.dialog.open(ConclusiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        this.createSection(data);
      })
    }

  }

  private editSection(data:any) {
    let request = null;
    if (this.sectionState === SectionState.VISUAL) {
      request = this.createSectionData(data);
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      request = this.createConclusiveSectionData(data);
    } else if (this.sectionState === SectionState.INVASIVE) {
      request = this.createInvasiveSectionData(data);
    }
    let url = this.getEditUrl();

    this.httpsRequestService.putHttpData(url, request).subscribe(
      (response:any) => {
        console.log(response);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'updated section');
        this.isRecordFound = true;
      },
      error => {
        console.log(error)
        this.isRecordFound = false;
      }
    );
  }

  private createSection(data: any) {
    let request = null;
    if (this.sectionState === SectionState.VISUAL) {
      request = this.createSectionData(data);
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      request = this.createConclusiveSectionData(data);
    } else if (this.sectionState === SectionState.INVASIVE) {
      request = this.createInvasiveSectionData(data);
    }
    let url = this.getAddUrl();
    this.httpsRequestService.postHttpData(url, request).subscribe(
      (response:any) => {
        console.log(response);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'added section');
        this.isRecordFound = true;
      },
      error => {
        console.log(error)
        this.isRecordFound = false;
      }
    );
  }

  closeOverlay() {
    this.isRecordFound  =!this.isRecordFound;
  }
  protected readonly ProjectState = ProjectState;
  protected readonly SectionState = SectionState;

  setSectionState(sectionState: SectionState) {
    // Reset to default state
    this.rows = [];
    this.images = [];
    this.sectionState = sectionState;
    this.sectionStateChange.emit(sectionState);
  }

  private createSectionData(data: any):any {
    console.log(data)
    return {
      "name": data.visualReportName,
      "additionalconsiderations": data.additionalConsiderationsOrConcern,
      "awe": data.AWE,
      "conditionalassessment": data.conditionAssessment,
      "createdby": "deck",
      "eee": data.EEE,
      "exteriorelements": data.exteriorElements,
      "furtherinvasivereviewrequired": data.invasiveReviewRequired,
      "lbc": data.LBC,
      "parentid": this.location._id,
      "parenttype": this.location.type,
      "visualreview": data.visualReview,
      "visualsignsofleak": data.signsOfLeaks,
      "waterproofingelements": data.waterproofingElements,
      "images": data.images
    };
  }

  private createInvasiveSectionData(data: any):any {
    console.log(data)
    return {
      "invasiveDescription": data.invasiveDescription,
      "postinvasiverepairsrequired": true,
      "parentid": this.sectionId_,
      "invasiveimages": data.invasiveimages
    };
  }

  private createConclusiveSectionData(data: any):any {
    console.log(data)
    return {
      "aweconclusive": data.AWE,
      "conclusiveconsiderations": "string",
      "eeeconclusive": data.EEE,
      "invasiverepairsinspectedandcompleted": true,
      "lbcconclusive": data.LBC,
      "parentid": this.sectionId_,
      "propowneragreed": true,
      "conclusiveimages": data.images
    };
  }

  private getAddUrl():string {
    let url = '';
    if (this.sectionState === SectionState.VISUAL) {
      url = 'https://deckinspectors-dev.azurewebsites.net/api/section/add';
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      url = 'https://deckinspectors-dev.azurewebsites.net/api/conclusivesection/add';
    } else if (this.sectionState === SectionState.INVASIVE) {
      url = 'https://deckinspectors-dev.azurewebsites.net/api/invasivesection/add';
    }
    return url;
  }

  private getEditUrl():string {
    let url = '';
    if (this.sectionState === SectionState.VISUAL) {
      url = 'https://deckinspectors-dev.azurewebsites.net/api/section/' + this.sectionReport._id;
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      url = 'https://deckinspectors-dev.azurewebsites.net/api/conclusivesection/' + this.sectionReport._id;
    } else if (this.sectionState === SectionState.INVASIVE) {
      url = 'https://deckinspectors-dev.azurewebsites.net/api/invasivesection/' + this.sectionReport._id;
    }
    return url;
  }


  public showAddBtn() {
    // always show add button for visual section
    // if section is invasive or conclusive and record is not found then show add button
    // else hide add button
    if (this.sectionState === SectionState.VISUAL) {
        return true;
    } else if ((this.sectionState === SectionState.INVASIVE || this.sectionState === SectionState.CONCLUSIVE) &&
                !this.isRecordFound) {
        return true;
    }
    return false;
  }

  private subscribeToSectionClick() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.SECTION_CLICKED).subscribe(
      (data:any) => {
        // Reset to default state
        this.rows = [];
        this.images = [];
        this.fetchDataForGivenSectionId(data);
      });
  }
}
