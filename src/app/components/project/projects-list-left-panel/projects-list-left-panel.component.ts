import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {Item} from 'src/app/common/models/project-tree';
import {HttpsRequestService} from "../../../service/https-request.service";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {ProjectQuery} from "../../../app-state-service/project-state/project-selector";
import {Store} from "@ngrx/store";
import {LeftTreeListModelQuery} from "../../../app-state-service/left-tree-items-state/left-tree-items-state-selector";

@Component({
  selector: 'app-projects-list-left-panel',
  templateUrl: './projects-list-left-panel.component.html',
  styleUrls: ['./projects-list-left-panel.component.scss']
})
export class ProjectsListLeftPanelComponent implements OnInit {
  @Output() showPartInfo = new EventEmitter<boolean>();
  projectList: Item[] = [];
  panelWidth: number = 200; // Initial panel width
  startX: number = 0;
  startWidth: number = 0;
  currentSelectedItem:string = '';

  constructor(private httpsRequestService: HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>) {
    this.fetchLeftTreeDataFromState();
    this.fetchLeftTreeData();
  }

  ngOnInit() {
    this.subscribeToProjectDetailsForNameHighlight();
  }

  private fetchLeftTreeDataFromState() {
    this.store.select(LeftTreeListModelQuery.getLeftTreeList).subscribe(leftTreeData => {
      this.projectList = this.mapItemList(leftTreeData.items);
    })
  }

  private fetchLeftTreeData() {
    if (this.projectList.length === 0) {
      let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/getProjectsMetaDataByUserName/deck';
      this.httpsRequestService.getHttpData<any>(url).subscribe(
        (response: any) => {
          let fetchedProjectList: Item[] = this.convertResponseToItemList(response);
          console.log(fetchedProjectList);
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Left_Tree_Data, fetchedProjectList);
        },
        error => {
          console.log(error)
        }
      );
    }
  }

  private convertResponseToItemList(response: any):Item[] {
    let fetchedProjectList:Item[] = [];
    response.item.forEach((project: any) => {
      fetchedProjectList.push(this.extractProject(project))
    })
    return fetchedProjectList;
  }
  private extractProject(project: any): Item {
    return {
      name: project.name,
      id:project.id,
      description: project.description,
      address: project.address,
      collapsed: true,
      nestedItems: this.extractNestedItems(project)
    };
  }

  private extractNestedItems(project: any): Item[] {

    let locations: Item = {
      name: 'Project Common Location',
      id:'',
      collapsed: true,
      nestedItems: project.locations.map((location: any) => (
        {
          name: location.locationName,
          id:location.locationId,
        }
      ))
    };


    let subProject: Item[] = project.subProjects.map((subProject: any) => (
        {
          name: subProject.name,
          id:subProject._id,
          collapsed: true,
          nestedItems: this.extractSubProjectLocation(subProject.subProjectLocations)
        }))

    let projectBuildings: Item = {
      name: 'Project Buildings',
      id:'',
      collapsed: true,
      nestedItems: subProject
    }

    return [locations, projectBuildings];
  }

  private extractSubProjectLocation(subProjectLocations: any): Item[] {
    let buildingLocation: Item = {
      name: 'Building Location',
      collapsed: true,
      id:'',
      nestedItems: []
    };
    let apartments: Item = {
      name: 'Apartments',
      collapsed: true,
      id:'',
      nestedItems: []
    };
    subProjectLocations.forEach((location_: any) => {
       if (location_.locationType === 'buildinglocation') {
        buildingLocation.nestedItems?.push({
          name: location_.locationName,
          id:location_.locationId
        })
      } else {
        apartments.nestedItems?.push({
          name: location_.locationName,
          id:location_.locationId
        })
      }
    })
    return [buildingLocation, apartments];

  }

  openProject(item: Item) {
    this.currentSelectedItem = item.name;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, true);
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Project_update, this.mapItem(item));
  }

  openLocation(location: Item) {
    if (location.id !== '' && location?.nestedItems?.length === 0) {
        this.currentSelectedItem = location.name;
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, false);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Location_Click, this.mapItem(location));
    }
    }
  private subscribeToProjectDetailsForNameHighlight() {
    console.log("Inside subscribeToProjectDetails")
    this.store.select(ProjectQuery.getProjectModel).subscribe(project => {
      this.currentSelectedItem = project.name;
     });
  }

  private mapItem(input: Item): Item {
    return {
      name: input.name,
      id: input.id,
      description: input.description,
      address: input.address,
      collapsed: input.collapsed,
      nestedItems: input.nestedItems?.map((item) => this.mapItem(item)) || []
    };
  }

  private mapItemList(input: Item[]): Item[] {
    return input.map((item) => this.mapItem(item));
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent) {
    if (this.startX !== 0) {
      const newWidth = this.startWidth + (event.clientX - this.startX);
      this.panelWidth = Math.max(200, newWidth); // Set minimum width

      // Uncomment the following line if you want the panel width to be limited to a maximum value
      // this.panelWidth = Math.min(400, Math.max(200, newWidth));
    }
  }

  @HostListener('document:mouseup')
  onDragEnd(): void {
    this.startX = 0;
  }

  startDrag(event: MouseEvent): void {
    this.startX = event.clientX;
    this.startWidth = this.panelWidth;
  }

  toggleCollapse(item: Item): void {
    item.collapsed = !item.collapsed;
  }
}
