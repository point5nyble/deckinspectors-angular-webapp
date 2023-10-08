import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Item} from 'src/app/common/models/project-tree';
import {HttpsRequestService} from "../../../service/https-request.service";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";
import {Store} from "@ngrx/store";
import {LeftTreeListModelQuery} from "../../../app-state-service/left-tree-items-state/left-tree-items-state-selector";
import {BackNavigation} from "../../../app-state-service/back-navigation-state/back-navigation-selector";
import {ProjectState} from "../../../app-state-service/store/project-state-model";
import {ProjectQuery} from "../../../app-state-service/project-state/project-selector";
import {take} from "rxjs";
import { environment } from '../../../../environments/environment';

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
  loadingScreen:boolean = true;
  collapsed: boolean = false;
  private projectState: ProjectState = ProjectState.VISUAL;
  currentProject!:any;
  @Input() projectInfo: any;


  constructor(private httpsRequestService: HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService,
              private store: Store<any>) {

  }

  ngOnInit() {
    this.subscribeToGetCurrentProjectDetails();
    this.fetchLeftTreeDataFromState();
    this.updateProjectList();
    if (this.projectList !== undefined) {
      this.loadingScreen = false;
    }
  }

  toggleCollapse_() {
    this.collapsed = !this.collapsed;
  }

  toggleCollapse(item: Item): void {
    item.collapsed = !item.collapsed;
  }

  private subscribeToGetCurrentProjectDetails() {
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe((previousState:any) => {
      this.currentSelectedItem = previousState.stack[previousState.stack.length - 1].name;
      this.currentProject = previousState.stack[1]
    });
  }

  private fetchLeftTreeDataFromState() {
    this.store.select(LeftTreeListModelQuery.getLeftTreeList).subscribe(leftTreeData => {
      this.projectList = this.mapItemList(leftTreeData?.items);
      this.projectList = this.filterCurrentProject(this.projectList);
      this.projectList = this.filterInvasiveProjects(this.projectList);
      this.createObjectMap(this.projectList,this.objectMap);
      if (this.projectList?.length === 0 || this.projectList === undefined) {
        this.fetchLeftTreeData();
      }

    })
  }

  private updateProjectList() {
    // This function is called when used adds new project, subproject, location or sections
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.UPDATE_LEFT_TREE_DATA).subscribe(event => {
      setTimeout(() => {
        this.fetchLeftTreeData();
      },1000)
    });

    this.store.select(ProjectQuery.getProjectModel).subscribe(data => {
      if (this.projectState !== data.state) {
          this.projectState = data.state;
          this.fetchLeftTreeDataFromStateWhenCalled();
      }
    });

  }
  private fetchLeftTreeDataFromStateWhenCalled() {
    this.store.select(LeftTreeListModelQuery.getLeftTreeList).pipe(take(1)).subscribe(leftTreeData => {
      this.projectList = this.mapItemList(leftTreeData?.items);
      this.projectList = this.filterCurrentProject(this.projectList);
      this.projectList = this.filterInvasiveProjects(this.projectList);
      this.createObjectMap(this.projectList,this.objectMap);
      if (this.projectList?.length === 0 || this.projectList === undefined) {
        this.fetchLeftTreeData();
      }

    })
  }

  private fetchLeftTreeData() {
      let projectid = this.currentProject?._id === undefined ? (<any>this.currentProject)?.id : this.currentProject?._id;
      let url = `${environment.apiURL}/project/getProjectMetadata/` + this.projectInfo._id;
      this.httpsRequestService.getHttpData<any>(url).subscribe(
        (response: any) => {
          let fetchedProjectList: Item[] = this.convertResponseToItemList(response);
          this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Left_Tree_Data, fetchedProjectList);
          this.loadingScreen = false;
        },
        error => {
          this.loadingScreen = false;
          console.log(error)
        }
      );
  }

  private convertResponseToItemList(response: any):Item[] {
    let fetchedProjectList:Item[] = [];
    this.objectMap.clear();
    response.item.forEach((project: any) => {
      fetchedProjectList.push(this.extractProject(project));
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
      parentid: 'home',
      type: 'project',
      isInvasive:project.isInvasive,
      projectType:project.projectType,
      nestedItems: this.extractNestedItems(project)
    };
  }

  private extractNestedItems(project: any): Item[] {
    let locations: Item = {
      name: 'Project Common Location',
      id:'',
      collapsed: true,
      isInvasive:true,
      nestedItems: project.locations.map((location: any) => (
        {
          name: location.locationName,
          id:location.locationId,
          parentid:project.id,
          isInvasive:location.isInvasive
        }
      ))
    };


    let subProject: Item[] = project.subProjects.map((subProject: any) => (
        {
          name: subProject.name,
          id:subProject._id,
          collapsed: true,
          parentid:project.id,
          type: "subproject",
          isInvasive:true,
          nestedItems: this.extractSubProjectLocation(subProject)
        }))

    let projectBuildings: Item = {
      name: 'Project Buildings',
      id:'',
      collapsed: true,
      isInvasive:true,
      nestedItems: subProject
    }

    return [locations, projectBuildings];
  }

  private extractSubProjectLocation(subProject: any): Item[] {
    let buildingLocation: Item = {
      name: 'Building Location',
      collapsed: true,
      id:'',
      isInvasive:true,
      nestedItems: []
    };
    let apartments: Item = {
      name: 'Apartments',
      collapsed: true,
      id:'',
      isInvasive:true,
      nestedItems: []
    };
    subProject.subProjectLocations.forEach((location_: any) => {
      if (location_.locationType === 'buildinglocation') {
        buildingLocation.nestedItems?.push({
          name: location_.locationName,
          id:location_.locationId,
          parentid:subProject._id,
          isInvasive:location_.isInvasive
        })
      } else {
        apartments.nestedItems?.push({
          name: location_.locationName,
          id:location_.locationId,
          parentid:subProject._id,
          isInvasive:location_.isInvasive
        })
      }
    })
    return [buildingLocation, apartments];

  }

  public openProject(item: Item) {
    this.currentSelectedItem = item.name;
    this.findPath(item);
    if (item.projectType === 'multilevel') {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'project');
    } else {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'location');
    }
  }

  public openLocation(location: Item) {
    if (location.id !== '' && location?.nestedItems?.length === 0) {
        this.currentSelectedItem = location.name;
        this.findPath(location);
        this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'location');
    } else if (location.type === 'subproject') {
      this.currentSelectedItem = location.name;
      this.findPath(location);
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.SHOW_SCREEN, 'subproject');
    }
    }


  private mapItem(input: Item): Item {
    return {
      name: input?.name,
      id: input?.id,
      description: input?.description,
      address: input?.address,
      collapsed: input?.collapsed,
      parentid: input?.parentid,
      type: input?.nestedItems? input?.type:'location',
      isInvasive:input?.isInvasive,
      projectType:input?.projectType,
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


  private createObjectMap(project: Item[], objectMap: Map<any, any>) {
    if (project === undefined) return;
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
    let path = [];
    let parent:string | undefined = item.parentid;
    path.push(item);
    while (parent !== 'home' && parent != null) {
        let parentItem = this.objectMap.get(parent);
        path.push(parentItem);
        parent = parentItem.parentid;
    }
    while (path.length != 0) {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC, this.mapItem(path.pop()));
    }

  }


  private filterInvasiveProjects(projectList: Item[]) {
    // Iterate over all projectList and check if isInvasive is true.
    if (this.projectState === ProjectState.INVASIVE) {
      projectList = projectList?.filter(project => project.isInvasive);
      projectList?.forEach(project => {
        project.nestedItems = this.filterInvasiveLocations(project.nestedItems);
        project.nestedItems?.forEach(nestedItem => {
          nestedItem.nestedItems = this.filterInvasiveLocations(nestedItem.nestedItems);
          nestedItem.nestedItems?.forEach(nestedItem => {
            nestedItem.nestedItems = this.filterInvasiveLocations(nestedItem.nestedItems);
            nestedItem.nestedItems?.forEach(nestedItem => {
              nestedItem.nestedItems = this.filterInvasiveLocations(nestedItem.nestedItems);
            })
          })
        });
      })
    }
    return projectList;

  }

  private filterInvasiveLocations(nestedItems: Item[] | undefined) {
    return nestedItems?.filter(location => location.isInvasive);
  }

  private filterCurrentProject(projectList: Item[]) {
    let projectid = this.currentProject?._id === undefined ? (<any>this.currentProject)?.id : this.currentProject?._id;
    return projectList?.filter(project => project.id === projectid);
  }
}
