import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../common/models/inspection-report";

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent implements OnInit{
  @Input() sectionReport!: InspectionReport;

  ngOnInit(): void {
    console.log(this.sectionReport);
  }


}
