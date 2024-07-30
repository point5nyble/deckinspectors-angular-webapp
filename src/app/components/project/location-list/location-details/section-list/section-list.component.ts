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
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgClass, NgFor, NgIf} from '@angular/common';
import { SectionListElementComponent } from './section-list-element/section-list-element.component';
import { VisualDeckReportModalComponent } from 'src/app/forms/visual-deck-report-modal/visual-deck-report-modal.component';
import {TenantService} from "../../../../../service/tenant.service";

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss'],
  standalone: true,
  imports: [CdkDropList, NgFor, CdkDrag, NgIf, NgClass, SectionListElementComponent]
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
  projectInfo: any;
  isDynamicForm: boolean = false;

  projectState!: ProjectState;
  @Output() sectionStateChange = new EventEmitter<SectionState>();

  constructor(private dialog: MatDialog,
              private orchestratorCommunicationService:OrchestratorCommunicationService,
              private httpsRequestService:HttpsRequestService,
              private store: Store<any>,
              private tenantService: TenantService) {
  }


  fetchDataForGivenSectionId($event: Section) {
    this.currentSection = $event;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SECTION_CLICKED, $event._id);
  }

  ngOnInit(): void {
    this.subscribeProjectState();
    this.fetchDataForGivenSectionIdOnInit();
    this.projectInfo = this.tenantService.getProjectInfo();
    this.isDynamicForm = !!(this.projectInfo && this.projectInfo.formId && this.projectInfo.formId !== '');
  }

  private fetchDataForGivenSectionIdOnInit() {
    if (this.sections && this.sections.length > 0) {
      this.fetchDataForGivenSectionId(this.sections[0]);
    } else {
      // this.fetchDataForGivenSectionId(undefined)
      const emptySection: Section = {
        _id: '',
        count: 0,
        furtherinvasivereviewrequired: false,
        visualsignsofleak: false,
        name: '',
        conditionalassessment: '',
        visualreview: ''
      };
      this.fetchDataForGivenSectionId(emptySection);
    }
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
    if (this.projectState === ProjectState.INVASIVE) {
      // TODO: Check Logic for Invasive
      this.sections = location?.sections?.filter(section => this.convertValueToBoolean(section?.furtherinvasivereviewrequired?.toString()));
    } else {
      this.sections = location?.sections;
    }

    let fl = false;
    this.sections?.forEach(section => {
      if (section.sequenceNo === undefined){
        fl = true;
      }
    });

    if (fl){
      this.sections?.sort((a, b) => {
        return String(a._id).localeCompare(String(b._id));
      });
    }else{
      this.sections?.sort((a, b) => {
        return parseInt(String(a.sequenceNo)) - parseInt(String(b.sequenceNo))
      });
    }

    this.fetchDataForGivenSectionIdOnInit();
    // console.log(this.sectionID);
  }

    private convertValueToBoolean(valueOf: string):boolean {
    try {
      return JSON.parse(valueOf.toLowerCase());
    } catch (e) {
      console.log(e);
      return false;
    }
    }

  deleteElement($event: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.height="230px";
    dialogConfig.data={
      name:$event.name
    }
    // dialogConfig.height = "140px";
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data.confirmed){
        let id = $event._id;
        let url: string = `${environment.apiURL}/section/${id}`;
        if (this.isDynamicForm) {
          url = `${environment.apiURL}/dynamicsection/${id}`;
        }
        this.httpsRequestService.deleteHttpData(url).subscribe(
          (response: any) => {
            this.sectionsDeletionComplete.emit(true);
          }
          , error => {
            console.log(error);
            this.sectionsDeletionComplete.emit(false);
          }
        );

      }})
  }

  dropSection(event: CdkDragDrop<Section[]>) {
    let res = moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  save(){
    this.sections.forEach(async (section, i) =>{
      let url = `${environment.apiURL}/section/${section._id}`;
      let data = {"sequenceNo": i.toString()};

      await this.httpsRequestService.putHttpData(url, data).subscribe(
        (response: any) => {
        },
        error => {
          console.log(error);
        }
      );
      if (i == this.sections.length - 1){
        alert('Sequence saved!');
      }
    })
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
    if (this.projectState === ProjectState.VISUAL) {
      const dialogRef = this.dialog.open(VisualDeckReportModalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined) {
            this.createSection(data);
        }
      })
    }

  }

  private createSection(data: any) {
    let request: any = null;
    if (this.projectState === ProjectState.VISUAL) {
      request = this.createSectionData(data);
    }
    let url = '';
    if (data.isLocationFormFields) {
      url = environment.apiURL + '/dynamicsection/add';
    } else {
      url = environment.apiURL + '/section/add';
    }

    let isInvasive = request?.furtherinvasivereviewrequired === "Yes";
    this.httpsRequestService.postHttpData(url, request).subscribe(
      (response:any) => {
        // Reset to default state
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.UPDATE_LEFT_TREE_DATA, 'added section');
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.INVASIVE_BTN_DISABLED,isInvasive);
        this.fetchDataForGivenSectionId({...request, _id: response.id});
      },
      error => {
        console.log(error)
      }
    );
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
      "parentid": this.location_._id,
      "parenttype": this.location_.type,
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
}
