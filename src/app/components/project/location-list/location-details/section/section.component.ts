import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../common/models/inspection-report";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit{
  @Input() sectionReport!: InspectionReport;

  ngOnInit(): void {
    console.log(this.sectionReport);
  }


}
