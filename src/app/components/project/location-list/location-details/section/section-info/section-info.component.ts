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
      name: "Name",
      exteriorelements: "Exterior Elements",
      waterproofingelements: "Waterproofing Elements",
      visualreview: "Visual Review",
      visualsignsofleak: "Visual Signs of Leak",
      furtherinvasivereviewrequired: "Further Invasive Review Required",
      conditionalassessment: "Conditional Assessment",
      additionalconsiderations: "Additional Considerations or Concerns",
      eee: "Life Expectancy Exterior Elevated Elements (EEE)",
      lbc: "Life Expectancy Load Bearing Componenets (LBC)",
      awe: "Life Expectancy Associated Waterproofing Elements (AWE)",
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
      for (let key in this.englishNamesMap) {
        if (this.englishNamesMap.hasOwnProperty(key)) {
          const value:string = this.englishNamesMap[key];
          this.rows.push(
            {
              column1: value,
              column2: this.sectionReport_[key]
            }
          );
        }
      }
    }
  }


  private extarctFieldName(fieldName: string) {
    return this.englishNamesMap[fieldName];
  }

}
