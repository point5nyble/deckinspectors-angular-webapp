import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Section} from "../../../../../../common/models/buildingLocation";

@Component({
  selector: 'app-part-element',
  templateUrl: './part-element.component.html',
  styleUrls: ['./part-element.component.scss']
})
export class PartElementComponent {
  @Input() section!: Section;
  @Output() sectionID = new EventEmitter<string>();
  createdOn: string= "Apr 12, 2023";
  createdBy: string= "John Doe";
  assignedTo: string= "Jane Doe";

  fetchInfoForCurrentSection() {
    this.sectionID.emit(this.section._id);
  }
}
