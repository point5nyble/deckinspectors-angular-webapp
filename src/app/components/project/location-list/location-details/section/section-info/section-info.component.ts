import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../../common/models/inspection-report";

@Component({
  selector: 'app-section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.scss']
})
export class SectionInfoComponent implements OnInit{
  rows: { column1: string; column2: any }[] = [];
  sectionReport_!: InspectionReport;
  englishNamesMap!: { [key: string]: string };
  constructor() {
    this.englishNamesMap = {
      additionalconsiderations: "Additional Considerations",
      awe: "Life Expectancy Associated Waterproofing Elements (AWE)",
      conditionalassessment: "Conditional Assessment",
      createdat: "Created At",
      createdby: "Created By",
      editedat: "Edited At",
      eee: "Life Expectancy Exterior Elevated Elements (EEE)",
      exteriorelements: "Exterior Elements",
      furtherinvasivereviewrequired: "Further Invasive Review Required",
      lasteditedby: "Last Edited By",
      lbc: "Life Expectancy Load Bearing Componenets (LBC)",
      name: "Name",
      visualreview: "Visual Review",
      visualsignsofleak: "Visual Signs of Leak",
      waterproofingelements: "Waterproofing Elements"
    };
  }
  @Input()
  set sectionReport(section: InspectionReport) {
    this.sectionReport_ = section;
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.rows = [];
    if (this.sectionReport_ != null || this.sectionReport_ != undefined) {
      Object.entries(this.sectionReport_).forEach(([fieldName, fieldValue]) => {
        if (!(fieldName === '_id' || fieldName === 'images'
          || fieldName === 'parentid')) {
          fieldName = this.extarctFieldName(fieldName);
          this.rows.push({column1: fieldName, column2: fieldValue});
        }

      });
    }
  }


  private extarctFieldName(fieldName: string) {
    return this.englishNamesMap[fieldName] || fieldName;
  }

}
