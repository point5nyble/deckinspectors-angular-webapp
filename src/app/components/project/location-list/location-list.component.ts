import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgFor, NgIf} from '@angular/common';
import {BuildingLocation} from "../../../common/models/buildingLocation";
import {Project} from "../../../common/models/project";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewLocationModalComponent} from "../../../forms/new-location-modal/new-location-modal.component";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {Store} from "@ngrx/store";
import {ProjectListElement} from "../../../common/models/project-list-element";
import {BackNavigation} from "../../../app-state-service/back-navigation-state/back-navigation-selector";
import { LocationListElementModule } from './location-list-element/location-list-element.module';
import { HttpsRequestService } from 'src/app/service/https-request.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  standalone: true,
  imports: [CdkDropList, NgFor, CdkDrag, NgIf, LocationListElementModule]
})
export class LocationListComponent implements OnInit {
  @Input() header!: string;
  @Output() projectAssignedEvent = new EventEmitter<any>();
  ischildClickEvent!: boolean;
  @Input()
  set locations(locations: BuildingLocation[]) {
    this.extractLocationList(locations);
  }

  @Input()
  set subproject(subproject: Project[]) {
    this.extractSubprojectList(subproject);
  }

  locationList: ProjectListElement[] = [];
  subprojectList: ProjectListElement[] = [];

  projectInfo: any;

  constructor(private dialog: MatDialog,
              private httpsRequestService:HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>) { }

  public ngOnInit(): void {
    this.subscribeToProjectDetailsForNameHighlight();
  }
  checkIfSubProject() : boolean {
    return (this.header === "Project Buildings");
  }

  onDbClick(locationInfo:ProjectListElement) {
    if(this.ischildClickEvent)
      this.ischildClickEvent = false;
    else{
    if (locationInfo._id !== '') {
      if (locationInfo.type === 'subproject') {
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'subproject');
      } else {
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'location');
      }
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, locationInfo)
    }
  }
  }

  public openLocationModal():void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
    dialogConfig.data = {
      id: 1,
      isSubProject: this.checkIfSubProject(),
      projectInfo: this.projectInfo,
      type: this.getType(),
      process: 'create'
    };
    const dialogRef = this.dialog.open(NewLocationModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {

    })
  }

  private subscribeToProjectDetailsForNameHighlight() {
    // TODO: USED TAKE
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      // TODO: Remove Project ID Inconsistency
      let projectID = previousState.stack[previousState.stack.length - 1]._id === undefined? previousState.stack[previousState.stack.length - 1].id : previousState.stack[previousState.stack.length - 1]._id;
      this.projectInfo = {};
      this.projectInfo.name = previousState.stack[previousState.stack.length - 1].name;
      this.projectInfo.parentId = projectID;
      this.projectInfo.parenttype = previousState.stack[previousState.stack.length - 1].type?previousState.stack[previousState.stack.length - 1].type:'project';
    });
  }

  private extractLocationList(locations: BuildingLocation[]){
    this.locationList = [];
    locations?.forEach((location, i) => {
      this.locationList.push(
        {
          _id: location._id,
          createdat: location.createdat,
          createdby: location.createdby,
          description: location.description,
          name: location.name,
          parentid: location.parentid,
          parenttype: location.parenttype,
          type: location.type,
          url: location.url,
          sequenceNumber: location.sequenceNumber
        }
        );
    })
    this.locationList.sort((a, b) => {
      return parseInt(String(a.sequenceNumber)) - parseInt(String(b.sequenceNumber))
    });
  }

  private extractSubprojectList(subproject: Project[]) {
    this.subprojectList = [];
      subproject?.forEach(project => {
          this.subprojectList.push(
              {
                  _id: project._id,
                  createdat: project.createdat,
                  createdby: project.createdby,
                  description: project.description,
                  name: project.name,
                  parentid: project.parentid?project.parentid:'',
                  assignedto: project.assignedto,
                  parenttype: project.parenttype?project.parenttype:'project',
                  type: project.type?project.type:'project',
                  url: project.url,
                  sequenceNumber: project.sequenceNumber
              }
          );
      })

      this.subprojectList.sort((a, b) => {
        return parseInt(String(a.sequenceNumber)) - parseInt(String(b.sequenceNumber))
      });
  }

  private getType():string {
    // add case for subproject
    switch (this.header) {
        case "Project Common Location":
            return "projectlocation";
        case "Project Buildings":
            return "subproject";
        case "Building Common Location":
          return "buildinglocation";
        case "Building Apartments":
          return "apartment";
        default:
            return "location";
    }
  }

  dropProject(event: CdkDragDrop<ProjectListElement[]>) {
    let res = moveItemInArray(this.subprojectList, event.previousIndex, event.currentIndex);
  }

  dropLocation(event: CdkDragDrop<ProjectListElement[]>) {
    let res = moveItemInArray(this.locationList, event.previousIndex, event.currentIndex);
  }

  saveSubprojects = () =>{
    let count = 0;
    this.subprojectList.forEach((subproject, i) =>{
      let url = `https://deckinspectors-dev.azurewebsites.net/api/subproject/${subproject._id}`;
      let data = {"sequenceNumber": i};

      this.httpsRequestService.putHttpData(url, data).subscribe(
        (response: any) => {
          console.log(response)
          ++count;
        },
        error => {
          console.log(error);
        }
      );
    })

    if (count === this.subprojectList.length){
      alert('Sequence saved!');
    }
  }

  saveLocations = () =>{
    let count = 0;
    this.locationList.forEach((location, i) =>{
      let url = `https://deckinspectors-dev.azurewebsites.net/api/location/${location._id}`;
      let data = {"sequenceNumber": i};

      this.httpsRequestService.putHttpData(url, data).subscribe(
        (response: any) => {
          console.log(response);
          ++count;
        },
        error => {
          console.log(error);
        }
      );
    })

    if (count === this.locationList.length){
      alert('Sequence saved!');
    }
  }

  save(){
    this.saveSubprojects();
    this.saveLocations();
  }

  assignProject(event: any){
    this.projectAssignedEvent.emit({isAssigned: event.isAssigned, apiCalled: event.apiCalled});
  }

  childClickEvent(event: boolean){
    console.log("working - child");
    this.ischildClickEvent = true;
  }
}
