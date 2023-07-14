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
import {BackNavigation} from "../../../app-state-service/back-navigation-state/back-navigation-selector";

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
  objectMap = new Map<string, any>();


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
      this.projectList = this.mapItemList(leftTreeData?.items);
    })
  }

  private fetchLeftTreeData() {
    if (this.projectList?.length === 0 || this.projectList === undefined) {
      let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/getProjectsMetaDataByUserName/deck';
      this.httpsRequestService.getHttpData<any>(url).subscribe(
        (response: any) => {
          let fetchedProjectList: Item[] = this.convertResponseToItemList(response);
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
      fetchedProjectList.push(this.extractProject(project));
    })
    this.createObjectMap(fetchedProjectList,this.objectMap);
    return fetchedProjectList;
  }
  private extractProject(project: any): Item {
    return {
      name: project.name,
      id:project.id,
      description: project.description,
      address: project.address,
      collapsed: true,
      parentid: "home",
      type: "project",
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
          parentid:project.id
        }
      ))
    };


    let subProject: Item[] = project.subProjects.map((subProject: any) => (
        {
          name: subProject.name,
          id:subProject._id,
          collapsed: true,
          parentId:project.id,
          type: "subproject",
          nestedItems: this.extractSubProjectLocation(subProject)
        }))

    let projectBuildings: Item = {
      name: 'Project Buildings',
      id:'',
      collapsed: true,
      nestedItems: subProject
    }

    return [locations, projectBuildings];
  }

  private extractSubProjectLocation(subProject: any): Item[] {
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
    subProject.subProjectLocations.forEach((location_: any) => {
      if (location_.locationType === 'buildinglocation') {
        buildingLocation.nestedItems?.push({
          name: location_.locationName,
          id:location_.locationId,
          parentid:subProject._id
        })
      } else {
        apartments.nestedItems?.push({
          name: location_.locationName,
          id:location_.locationId,
          parentid:subProject._id
        })
      }
    })
    return [buildingLocation, apartments];

  }

  openProject(item: Item) {
    this.currentSelectedItem = item.name;
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, 'project');
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Project_update, this.mapItem(item));

    this.findPath(item);
  }

  openLocation(location: Item) {
    if (location.id !== '' && location?.nestedItems?.length === 0) {
        this.currentSelectedItem = location.name;
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Show_Project_Details, 'location');
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Location_Click, this.mapItem(location));
        this.findPath(location);
    }
    }
  private subscribeToProjectDetailsForNameHighlight() {
    this.store.select(ProjectQuery.getProjectModel).subscribe(project => {
      this.currentSelectedItem = project.name;
     });
  }

  private mapItem(input: Item): Item {
    return {
      name: input?.name,
      id: input?.id,
      description: input?.description,
      address: input?.address,
      collapsed: input?.collapsed,
      parentid: input?.parentid,
      type: input?.type,
      nestedItems: input?.nestedItems?.map((item) => this.mapItem(item)) || []
    };
  }

  private mapItemList(input: Item[]): Item[] {
    return input?.map((item) => this.mapItem(item));
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

  private createObjectMap(project: Item[], objectMap: Map<any, any>) {
    project.forEach((project: any) => {
        objectMap.set(project.id, project);
        project.nestedItems.forEach((nestedItem: any) => {
            objectMap.set(nestedItem.id, nestedItem);
            if (nestedItem.nestedItems) {
                nestedItem.nestedItems.forEach((nestedItem: any) => {
                    objectMap.set(nestedItem.id, nestedItem);
                    if (nestedItem.nestedItems) {
                        nestedItem.nestedItems.forEach((nestedItem: any) => {
                            objectMap.set(nestedItem.id, nestedItem);
                            if (nestedItem.nestedItems) {
                                nestedItem.nestedItems.forEach((nestedItem: any) => {
                                    objectMap.set(nestedItem.id, nestedItem);
                                    if (nestedItem.nestedItems) {
                                        nestedItem.nestedItems.forEach((nestedItem: any) => {
                                            objectMap.set(nestedItem.id, nestedItem);
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    });
    // objectMap.set(project.id, project);
    // project.subProjects.forEach((subProject: any) => {
    //   objectMap.set(subProject._id, subProject);
    //     subProject.subProjectLocations.forEach((location: any) => {
    //         objectMap.set(location.locationId, location);
    //     })
    // });
    // project.locations.forEach((location: any) => {
    //   objectMap.set(location.locationId, location);
    // });
  }

  private findPath(item: Item) {
    let tempList:any[] = [];
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe(chain => {
      tempList = chain.stack;
    })
    tempList.forEach((element:any) => {
      if (element.name !== 'Home') {
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC, '');
      }
    })
    // this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC,'');
    // this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC,'');
    // this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC,'');
    let path = [];
    let parent:string | undefined = item.parentid;
    path.push(item);
    while (parent !== 'home' && parent != null) {
        let parentItem = this.objectMap.get(parent);
        path.push(parentItem);
        parent = parentItem.parentId;
    }
    while (path.length != 0) {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, path.pop());
    }
  }
}
