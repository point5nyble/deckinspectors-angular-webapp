import {Component, HostListener, OnInit} from '@angular/core';
import {Item} from 'src/app/common/models/project-tree';
import {HttpsRequestService} from "../../../service/https-request.service";
import {
  OrchestratorCommunicationService
} from "../../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../../orchestrator-service/models/orchestrator-event-name";

@Component({
  selector: 'app-projects-list-left-panel',
  templateUrl: './projects-list-left-panel.component.html',
  styleUrls: ['./projects-list-left-panel.component.scss']
})
export class ProjectsListLeftPanelComponent implements OnInit {
  items: Item[] = [];
  panelWidth: number = 200; // Initial panel width

  startX: number = 0;
  startWidth: number = 0;

  constructor(private httpsRequestService: HttpsRequestService,
              private orchestratorCommunicationService: OrchestratorCommunicationService) {

  }

  ngOnInit() {
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/project/getProjectsMetaDataByUserName/deck';
    this.httpsRequestService.getHttpData<any>(url).subscribe(
      (response: any) => {
        this.convertResponseToItemList(response);
        console.log(response);
        // console.log(item);
      },
      error => {
        console.log(error)
      }
    );
  }

  convertResponseToItemList(response: any) {
    return response.item.forEach((project: any) => {
      this.items.push(this.extractProject(project))
    })
  }

  private extractProject(project: any): Item {
    return {
      name: project.name,
      collapsed: true,
      nestedItems: this.extractNestedItems(project)
    };
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

  toggleCollapse(item: any): void {
    item.collapsed = !item.collapsed;
  }

  private extractNestedItems(project: any): Item[] {

    let locations: Item = {
      name: 'Project Common Location',
      collapsed: true,
      nestedItems: project.locations.map((location: any) => (
        {
          name: location.locationName
        }
      ))
    };

    let subProject: Item[] = project.subProjects.map((subProject: any) =>
      (
        {
          name: subProject.name,
          collapsed: true,
          nestedItems: this.extractSubProjectLocation(subProject.subProjectLocations)
        }))

    return [locations, ...subProject];
  }

  private extractSubProjectLocation(subProjectLocations: any): Item[] {
    let buildingLocation: Item = {
      name: 'Building Location',
      collapsed: true,
      nestedItems: []
    };
    let apartments: Item = {
      name: 'Apartments',
      collapsed: true,
      nestedItems: []
    };
    subProjectLocations.forEach((location_: any) => {
       if (location_.locationType === 'buildinglocation') {
        buildingLocation.nestedItems?.push({
          name: location_.locationName
        })
      } else {
        apartments.nestedItems?.push({
          name: location_.locationName
        })
      }
    })
    return [buildingLocation, apartments];

  }

  openProject(item: Item) {
    this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Project_update, item);
  }
}
