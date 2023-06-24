import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../../common/models/inspection-report";

@Component({
  selector: 'app-part-info',
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.scss']
})
export class PartInfoComponent implements OnInit{
  rows: { column1: string; column2: any }[] = [];
  sectionReport_!: InspectionReport;
  @Input()
  set sectionReport(section: InspectionReport) {
    this.sectionReport_ = section;
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.rows = [];
    Object.entries(this.sectionReport_).forEach(([fieldName, fieldValue]) => {
      if (!(fieldName === '_id' || fieldName === 'images'
         || fieldName === 'parentid')) {
        this.rows.push({column1: fieldName, column2: fieldValue});
      }

    });
  }
}
