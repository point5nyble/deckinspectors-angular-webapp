import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Section} from "../../../../../../common/models/buildingLocation";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-list-element',
  templateUrl: './section-list-element.component.html',
  styleUrls: ['./section-list-element.component.scss'],
  standalone:true,
  imports: [CommonModule]
})
export class SectionListElementComponent {
  @Input() section!: Section;
  @Input() isHighlighted!: boolean;
  @Output() deleteElement = new EventEmitter<string>();
  deleteSection() {
    console.log("deleteSection", this.section._id)
    this.deleteElement.emit(this.section._id);
  }
}
