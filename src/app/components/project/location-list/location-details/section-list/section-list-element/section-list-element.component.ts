import {Component, Input} from '@angular/core';
import {Section} from "../../../../../../common/models/buildingLocation";

@Component({
  selector: 'app-section-list-element',
  templateUrl: './section-list-element.component.html',
  styleUrls: ['./section-list-element.component.scss']
})
export class SectionListElementComponent {
  @Input() section!: Section;
  @Input() isHighlighted!: boolean;
  assignedTo: string= "Jane Doe";
}
