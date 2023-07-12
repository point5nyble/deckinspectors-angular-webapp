import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Section} from "../../../../../../common/models/buildingLocation";

@Component({
  selector: 'app-section-list-element',
  templateUrl: './section-list-element.component.html',
  styleUrls: ['./section-list-element.component.scss']
})
export class SectionListElementComponent {
  @Input() section!: Section;
  createdOn: string= "Apr 12, 2023";
  createdBy: string= "John Doe";
  assignedTo: string= "Jane Doe";
}
