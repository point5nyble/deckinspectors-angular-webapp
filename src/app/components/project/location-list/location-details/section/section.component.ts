import {Component, EventEmitter, Input, OnInit, Output, SimpleChange} from '@angular/core';
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
import { environment } from '../../../../../../environments/environment';
import {TenantService} from "../../../../../service/tenant.service";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit{
  @Input() isRecordFound!:boolean;
  sectionState: SectionState = SectionState.VISUAL;
  @Input() location!:BuildingLocation;
  @Input() isDeletedSection!: boolean;
  sectionId_!:string;
  images!: string[];
  sectionReport!: InspectionReport;
  projectInfo: any;
  isDynamicForm: boolean = false;
  formQuestions: any = [];
  isLoading: boolean = false;

  @Output() sectionStateChange = new EventEmitter<SectionState>();

  projectState!: ProjectState;
  rows: { column1: string; column2: any }[] = [];
  rowsMap!: Map<string, string>;
  private englishNamesMap!: { [key: string]: string };
  showConclusiveSection:boolean = false;
  showBtn: boolean = false;
  isSaving: boolean = false;

  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private httpsRequestService:HttpsRequestService,
              private store: Store<any>,
              private tenantService: TenantService) {

  }

  ngOnInit(): void {
    this.constructEnglishNameMap();
    this.constructRows();
    this.subscribeProjectState();
    this.subscribeToSectionClick();
    this.projectInfo = this.tenantService.getProjectInfo();
    this.isDynamicForm = !!(this.projectInfo && this.projectInfo.formId && this.projectInfo.formId !== '');
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    // Extract changes to the input property by its name
    let change: SimpleChange = changes['isDeletedSection'];
    if(change?.currentValue){
      this.ngOnInit();
    }
    // Whenever the data in the parent changes, this method gets triggered
    // You can act on the changes here. You will have both the previous
    // value and the  current value here.
}


  private findOutConclusiveSectionStatus(sectionId: string) {
    // console.log(sectionId)
    if (sectionId === undefined || sectionId === '') {
        // console.log("one");
        return;
    }
    let url = environment.apiURL + '/invasivesection/getInvasiveSectionByParentId';
    let data: any = {
      username: localStorage.getItem('username'),
      parentSectionId: sectionId
    };
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.showConclusiveSection = response?.sections[0]?.postinvasiverepairsrequired === "Yes";
      },
      error => {
        console.log(error.error)
      }
    );

  }

  private fetchDataForGivenSectionId($event: string) {
    if ($event === undefined || $event === '') {
        return;
    }
    this.rows = [];
    this.sectionId_ = $event;

    let url = '';
    let data: any = {
      username: localStorage.getItem('username')
    };
    if (this.sectionState === SectionState.VISUAL) {
      if (this.isDynamicForm) {
        url = environment.apiURL + '/dynamicsection/' + this.sectionId_;
      } else {
        data = {...data, sectionid: $event}
        url = environment.apiURL + '/section/getSectionById';
        // this.findOutConclusiveSectionStatus(this.sectionId_);
      }
    } else if (this.sectionState === SectionState.INVASIVE) {
      data = {...data, parentSectionId: $event}
      url = environment.apiURL + '/invasivesection/getInvasiveSectionByParentId';
      this.findOutConclusiveSectionStatus(this.sectionId_);
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      data = {...data, parentSectionId: $event}
      url = environment.apiURL + '/conclusivesection/getConclusiveSectionsByParentId';
    }

    if (this.isDynamicForm) {
      this.getDynamicSectionById(url);
    } else {
      this.getSectionById(url, data);
    }
  }

  private getSectionById(url: string, data: any) {
    this.httpsRequestService.postHttpData(url, data).subscribe(
      (response:any) => {
        this.sectionReport = (this.sectionState === SectionState.VISUAL)? response.section : response.sections[0];
        this.constructRows();
        this.isRecordFound = true;
        this.isSaving = false;
      },
      error => {
        // Check this logic
        if (error.error.code === 401 || error.error.code === 500) {
          this.isRecordFound = false;
        }
        this.isSaving = false;
        console.log(error);
      }
    );
  }

  private getDynamicSectionById(url: string) {
    this.httpsRequestService.getHttpData(url).subscribe(
      (response:any) => {
        this.sectionReport = response.section;
        this.formQuestions = response.section?.questions || [];
        this.constructRows();
        this.isRecordFound = true;
        this.isSaving = false;
      },
      error => {
        // Check this logic
        if (error.error.code === 401 || error.error.code === 500) {
          this.isRecordFound = false;
        }
        this.isSaving = false;
        console.log(error);
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
      unitUnavailable: "Unit Unavailable",
      exteriorelements: "Exterior Elements",
      waterproofingelements: "Waterproofing Elements",
      visualreview: "Visual Review",
      visualsignsofleak: "Visual Signs of Leak",
      furtherinvasivereviewrequired: "Further Invasive Review Required",
      conditionalassessment: "Conditional Assessment",
      additionalconsiderations: "Additional Considerations or Concerns",
      additionalconsiderationshtml: "Additional Considerations or Concerns Html",
      eee: "Life Expectancy Exterior Elevated Elements (EEE)",
      lbc: "Life Expectancy Load Bearing Componenets (LBC)",
      awe: "Life Expectancy Associated Waterproofing Elements (AWE)",
      invasiveDescription: "Invasive Description",
      postinvasiverepairsrequired:"Post Invasive Repairs Required",
      aweconclusive: "AWE Conclusive",
      conclusiveconsiderations: "Conclusive Considerations",
      eeeconclusive: "EEE Conclusive",
      lbcconclusive: "LBC Conclusive",
      invasiverepairsinspectedandcompleted:"Invasive Repairs Inspected and Completed",
      propowneragreed:"Property Owner Agreed"

    };
  }
  private constructRows() {
    this.rows = [];
    this.rowsMap = new Map<string,string>();
    if (this.sectionReport != null || this.sectionReport != undefined) {
      if (this.sectionReport['additionalconsiderationshtml'] === null || this.sectionReport['additionalconsiderationshtml'] === undefined){
        this.sectionReport['additionalconsiderationshtml'] = this.sectionReport['additionalconsiderations'];
      }
      for (let key in this.englishNamesMap) {
        if (this.englishNamesMap.hasOwnProperty(key) && this.sectionReport[key] !== null && this.sectionReport[key] !== undefined) {
          const value:string = this.englishNamesMap[key];
            this.rows.push(
              {
                column1: value,
                column2: this.sectionReport[key]
              }
            );
            this.rowsMap.set(key, this.getFormValue(this.sectionReport[key]));

        }
      }
    }
    if (this.sectionState === SectionState.INVASIVE) {
      this.images = this.sectionReport?.invasiveimages;
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      let propowneragreed: any = this.sectionReport?.propowneragreed;
      let invasiverepairsinspectedandcompleted: any = this.sectionReport?.invasiverepairsinspectedandcompleted;
      this.images = this.sectionReport.conclusiveimages;
      if (!(propowneragreed === "Yes")) {
        this.rows = this.deleteElementFromArray(this.rows, this.englishNamesMap['aweconclusive']);
        this.rows = this.deleteElementFromArray(this.rows, this.englishNamesMap['conclusiveconsiderations']);
        this.rows = this.deleteElementFromArray(this.rows, this.englishNamesMap['eeeconclusive']);
        this.rows = this.deleteElementFromArray(this.rows, this.englishNamesMap['lbcconclusive']);
        this.images = [];
      }
    } else if (this.sectionState === SectionState.VISUAL) {
      this.images = this.sectionReport?.images;
    }
  }

  deleteElementFromArray(arr: any[], valueToDelete: string): any[] {
    return arr.filter(item => item.column1 !== valueToDelete);
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
    if (this.isDynamicForm && this.sectionReport && this.sectionReport['questions']) {
      dialogConfig.data.questions = this.sectionReport['questions'] || [];
    }
    if (this.sectionState === SectionState.VISUAL) {
      const dialogRef = this.dialog.open(VisualDeckReportModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
          this.editSection(data);
        }
      })
    } else if (this.sectionState === SectionState.INVASIVE) {
      const dialogRef = this.dialog.open(InvasiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
          this.editSection(data);
        }
      })
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      const dialogRef = this.dialog.open(ConclusiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
          this.editSection(data);
        }
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
        if (data !== undefined) {
            this.createSection(data);
        }
      })
    } else if (this.sectionState === SectionState.INVASIVE) {
      const dialogRef = this.dialog.open(InvasiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
          this.createSection(data);
        }
      })
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      const dialogRef = this.dialog.open(ConclusiveSectionModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
          this.createSection(data);
        }
      })
    }

  }

  private editSection(data:any) {
    this.isSaving = true;
    let request = null;
    if (this.sectionState === SectionState.VISUAL) {
      request = this.createSectionData(data);
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      request = this.createConclusiveSectionData(data);
    } else if (this.sectionState === SectionState.INVASIVE) {
      request = this.createInvasiveSectionData(data);
    }
    const isLocationFormFields = data.isLocationFormFields;
    let url = this.getEditUrl(isLocationFormFields);
    let isInvasive = request?.furtherinvasivereviewrequired === "Yes";
    this.httpsRequestService.putHttpData(url, request).subscribe(
      (response:any) => {
        // Reset to default state

        this.rows = [];
        this.images = [];
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'updated section');
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.INVASIVE_BTN_DISABLED,isInvasive);
        this.isRecordFound = true;
        this.fetchDataForGivenSectionId(this.sectionId_);
      },
      error => {
        // Reset to default state
        this.rows = [];
        this.images = [];
        console.log(error)
        this.isRecordFound = false;
        this.isSaving = false;
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
    const isLocationFormFields = data.isLocationFormFields;
    let url = this.getAddUrl(isLocationFormFields);
    let isInvasive = request?.furtherinvasivereviewrequired === "Yes";
    this.httpsRequestService.postHttpData(url, request).subscribe(
      (response:any) => {
        // Reset to default state
        this.rows = [];
        this.images = [];
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'added section');
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.INVASIVE_BTN_DISABLED,isInvasive);
        this.isRecordFound = true;
        this.fetchDataForGivenSectionId(this.sectionId_);
      },
      error => {
        // Reset to default state
        this.rows = [];
        this.images = [];
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
    this.fetchDataForGivenSectionId(this.sectionId_);
  }

  private createSectionData(data: any):any {
    const preparedObj: any = {
      "name": data?.visualReportName,
      "unitUnavailable": data?.unitUnavailable === true,
      "additionalconsiderations": data?.additionalConsiderationsOrConcern,
      "additionalconsiderationshtml": data?.additionalConsiderationsOrConcernHtml,
      // "awe": data?.AWE,
      // "conditionalassessment": data?.conditionAssessment,
      "createdby": localStorage.getItem('username'),
      // "eee": data?.EEE,
      // "exteriorelements": data?.exteriorElements,
      "furtherinvasivereviewrequired": data?.invasiveReviewRequired,
      // "lbc": data?.LBC,
      "parentid": this.location._id,
      "parenttype": this.location.type,
      // "visualreview": data?.visualReview,
      // "visualsignsofleak": data?.signsOfLeaks,
      // "waterproofingelements": data?.waterproofingElements,
      "images": data?.images,
      // "questions": data?.questions
    };
    if (data.isLocationFormFields) {
      preparedObj.questions = data?.questions;
      preparedObj.companyIdentifier = data?.companyIdentifier;
    } else {
      preparedObj.awe = data?.AWE;
      preparedObj.conditionalassessment = data?.conditionAssessment;
      preparedObj.eee = data?.EEE;
      preparedObj.exteriorelements = data?.exteriorElements;
      // preparedObj.furtherinvasivereviewrequired = data?.invasiveReviewRequired;
      preparedObj.lbc = data?.LBC;
      preparedObj.visualsignsofleak = data?.signsOfLeaks;
      preparedObj.waterproofingelements = data?.waterproofingElements;
      preparedObj.visualreview = data?.visualReview;
    }

    return preparedObj;
  }

  private createInvasiveSectionData(data: any):any {
    return {
      "invasiveDescription": data?.invasiveDescription,
      "postinvasiverepairsrequired": data?.postinvasiverepairsrequired,
      "parentid": this.sectionId_,
      "invasiveimages": data?.invasiveimages
    };
  }

  private createConclusiveSectionData(data: any):any {
    return {
      "aweconclusive": data?.AWE,
      "conclusiveconsiderations": data.conclusiveconsiderations,
      "eeeconclusive": data?.EEE,
      "invasiverepairsinspectedandcompleted": data.invasiverepairsinspectedandcompleted,
      "lbcconclusive": data?.LBC,
      "parentid": this.sectionId_,
      "propowneragreed": data.propowneragreed,
      "conclusiveimages": data?.conclusiveimages
    };
  }

  private getAddUrl(isLocationFormFields: boolean = false):string {
    let url = '';
    if (this.sectionState === SectionState.VISUAL) {
      if (isLocationFormFields) {
        url = environment.apiURL + '/dynamicsection/add';
      } else {
        url = environment.apiURL + '/section/add';
      }
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      url = environment.apiURL + '/conclusivesection/add';
    } else if (this.sectionState === SectionState.INVASIVE) {
      url = environment.apiURL + '/invasivesection/add';
    }
    return url;
  }

  private getEditUrl(isLocationFormFields: boolean = false):string {
    let url = '';
    if (this.sectionState === SectionState.VISUAL) {
      if (isLocationFormFields) {
        url = environment.apiURL + '/dynamicsection/' + this.sectionReport._id;
      } else {
        url = environment.apiURL + '/section/' + this.sectionReport._id;
      }
    } else if (this.sectionState === SectionState.CONCLUSIVE) {
      url = environment.apiURL + '/conclusivesection/' + this.sectionReport._id;
    } else if (this.sectionState === SectionState.INVASIVE) {
      url = environment.apiURL + '/invasivesection/' + this.sectionReport._id;
    }
    return url;
  }


  public showAddBtn() {
   if ((this.sectionState === SectionState.INVASIVE || this.sectionState === SectionState.CONCLUSIVE) &&
                !this.isRecordFound) {
        return true;
    }
    return false;
  }

  public showEditBtn(){
    if (this.rows.length > 0 && this.sectionState === SectionState.VISUAL) {
        return true;
    } else if (this.rows.length > 0 && (this.sectionState === SectionState.INVASIVE || this.sectionState === SectionState.CONCLUSIVE) &&
                this.isRecordFound) {
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
        this.showBtn = true;
        this.fetchDataForGivenSectionId(data);
      });
  }

  private getFormValue(sectionReportElement: any) {
    if (typeof sectionReportElement === 'string') {
        if (sectionReportElement === '0-1 Years') {
          return 'one'
        } else if (sectionReportElement === '1-4 Years') {
          return 'four'
        } else if (sectionReportElement === '4-7 Years') {
          return 'seven'
        } else if (sectionReportElement === '7+ Years') {
          return 'sevenplus'
        }
    }
    return sectionReportElement;
  }
}
