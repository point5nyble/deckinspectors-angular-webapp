import {Component, HostListener} from '@angular/core';
import { Item } from 'src/app/common/models/project-tree';

@Component({
  selector: 'app-projects-list-left-panel',
  templateUrl: './projects-list-left-panel.component.html',
  styleUrls: ['./projects-list-left-panel.component.scss']
})
export class ProjectsListLeftPanelComponent {
  items:Item[] = [
    {
      name: 'Project  1',
      collapsed: true,
      nestedItems: [
        {
          name: 'Project Common Location',
          collapsed: true,
          nestedItems: [
            { name: 'Location 1' },
            { name: 'Location 2' }
          ]
        },
        {
          name: 'Building Name',
          collapsed: true,
          nestedItems: [
            {
              name: 'Building Common Location',
              collapsed: true,
              nestedItems: [
                { name: 'Location 3' },
                { name: 'Location 4' }
              ]
            },
            {
              name: 'Apartment',
              collapsed: true,
              nestedItems: [
                { name: 'Location 5' },
                { name: 'Location 6' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Project  2',
      collapsed: true,
      nestedItems: [
        {
          name: 'Project Common Location',
          collapsed: true,
          nestedItems: [
            { name: 'Location 1' },
            { name: 'Location 2' }
          ]
        },
        {
          name: 'Building Name',
          collapsed: true,
          nestedItems: [
            {
              name: 'Building Common Location',
              collapsed: true,
              nestedItems: [
                { name: 'Location 3' },
                { name: 'Location 4' }
              ]
            },
            {
              name: 'Apartment',
              collapsed: true,
              nestedItems: [
                { name: 'Location 5' },
                { name: 'Location 6' }
              ]
            }
          ]
        }
      ]
    }

  ];
  panelWidth: number = 200; // Initial panel width

  startX: number = 0;
  startWidth: number = 0;

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
  onDragEnd():void {
    this.startX = 0;
  }

  startDrag(event: MouseEvent):void {
    this.startX = event.clientX;
    this.startWidth = this.panelWidth;
  }

  toggleCollapse(item: any):void {
    item.collapsed = !item.collapsed;
  }
}
